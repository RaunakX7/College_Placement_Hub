import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (payload.role === "admin") {
      // Admin sees all applications
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || "";

      const where: any = {};
      if (status && status !== "all") {
        where.status = status;
      }

      const applications = await prisma.application.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              rollNumber: true,
              department: true,
              cgpa: true,
              resume: true,
            },
          },
          internship: {
            select: {
              id: true,
              companyName: true,
              title: true,
              type: true,
            },
          },
        },
        orderBy: { id: "desc" },
      });

      return NextResponse.json(applications);
    } else {
      // Student sees only their own applications
      const studentId = payload.userId;

      const applications = await prisma.application.findMany({
        where: { studentId },
        include: {
          internship: true,
          rounds: {
            orderBy: { roundNumber: "asc" },
          },
        },
        orderBy: { id: "desc" },
      });

      return NextResponse.json(applications);
    }
  } catch (error: any) {
    console.error("GET Applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "student") {
      return NextResponse.json({ error: "Unauthorized. Student privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { internshipId } = body;

    if (!internshipId) {
      return NextResponse.json({ error: "Internship ID is required" }, { status: 400 });
    }

    const job = await prisma.internship.findUnique({
      where: { id: parseInt(internshipId) },
    });

    if (!job) {
      return NextResponse.json({ error: "Internship/Job posting not found" }, { status: 404 });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        studentId: payload.userId,
        internshipId: parseInt(internshipId),
      },
    });

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied for this opportunity." }, { status: 400 });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        studentId: payload.userId,
        internshipId: parseInt(internshipId),
        status: "Pending",
      },
    });

    return NextResponse.json(
      { message: "Application submitted successfully!", application },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
