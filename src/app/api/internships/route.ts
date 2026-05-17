import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const internshipSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"), // "Internship" or "Placement"
  location: z.string().optional().nullable(),
  eligibility: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDate: z.string().optional().nullable(), // Date string
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || ""; // "Internship" or "Placement"

    // Construct Prisma query
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { companyName: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (type && type !== "all") {
      where.type = type;
    }

    const internships = await prisma.internship.findMany({
      where,
      orderBy: { id: "desc" },
    });

    // If student is logged in, attach whether they've saved or applied to these jobs!
    const payload = getAuthUser(req);
    if (payload && payload.role === "student") {
      const studentId = payload.userId;

      const [savedJobs, appliedJobs] = await Promise.all([
        prisma.savedJob.findMany({ where: { studentId }, select: { internshipId: true } }),
        prisma.application.findMany({ where: { studentId }, select: { internshipId: true, status: true } }),
      ]);

      const savedSet = new Set(savedJobs.map((j: { internshipId: number }) => j.internshipId));
      const appliedMap = new Map(
        appliedJobs.map((a: { internshipId: number; status: string }) => [a.internshipId, a.status] as [number, string])
      );

      const enrichedInternships = internships.map((job: any) => ({
        ...job,
        isSaved: savedSet.has(job.id),
        isApplied: appliedMap.has(job.id),
        applicationStatus: appliedMap.get(job.id) || null,
      }));

      return NextResponse.json(enrichedInternships);
    }

    return NextResponse.json(internships);
  } catch (error: any) {
    console.error("GET Internships error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin RBAC Check
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validation = internshipSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { companyName, title, type, location, eligibility, description, lastDate } = validation.data;

    // Create the job posting
    const internship = await prisma.internship.create({
      data: {
        companyName,
        title,
        type,
        location: location || null,
        eligibility: eligibility || null,
        description: description || null,
        lastDate: lastDate ? new Date(lastDate) : null,
      },
    });

    return NextResponse.json(
      { message: "Job/Internship created successfully!", internship },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Internships error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
