import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (payload.role === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { id: payload.userId },
        select: { id: true, username: true },
      });

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: admin.id,
          role: "admin",
          name: "Administrator",
          emailOrUsername: admin.username,
        },
      });
    } else {
      const student = await prisma.student.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          rollNumber: true,
          phone: true,
          location: true,
          cgpa: true,
          skills: true,
          bio: true,
          department: true,
          graduationYear: true,
          resume: true,
          linkedinUrl: true,
          githubUrl: true,
          createdAt: true,
        },
      });

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          ...student,
          role: "student",
          emailOrUsername: student.email,
          cgpa: student.cgpa ? Number(student.cgpa) : null,
        },
      });
    }
  } catch (error: any) {
    console.error("Auth Me API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
