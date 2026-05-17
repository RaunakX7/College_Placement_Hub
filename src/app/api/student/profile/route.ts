import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const profileSchema = z.object({
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  cgpa: z.string().or(z.number()).optional().nullable(),
  skills: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  graduationYear: z.string().optional().nullable(),
  resume: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "student") {
      return NextResponse.json({ error: "Unauthorized. Student privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      phone,
      location,
      cgpa,
      skills,
      bio,
      department,
      graduationYear,
      resume,
      linkedinUrl,
      githubUrl,
    } = validation.data;

    // Convert CGPA to standard float number for SQLite compatibility
    let cgpaFloat: number | null = null;
    if (cgpa !== undefined && cgpa !== null && cgpa !== "") {
      const parsedCgpa = parseFloat(cgpa.toString());
      if (!isNaN(parsedCgpa)) {
        cgpaFloat = parsedCgpa;
      }
    }

    const updatedStudent = await prisma.student.update({
      where: { id: payload.userId },
      data: {
        phone: phone || null,
        location: location || null,
        cgpa: cgpaFloat,
        skills: skills || null,
        bio: bio || null,
        department: department || null,
        graduationYear: graduationYear || null,
        resume: resume || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully!",
      student: {
        ...updatedStudent,
        cgpa: updatedStudent.cgpa ? Number(updatedStudent.cgpa) : null,
      },
    });
  } catch (error: any) {
    console.error("PATCH Student Profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
