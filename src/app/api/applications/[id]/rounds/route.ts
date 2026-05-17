import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const saveRoundSchema = z.object({
  roundNumber: z.number().min(1, "Round number must be at least 1"),
  roundTitle: z.string().min(1, "Round title is required"),
  roundStatus: z.enum(["Scheduled", "Completed", "Selected", "Rejected"]),
  scheduledAt: z.string().optional().nullable(), // ISO String or date-local string
  remarks: z.string().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    // Verify user authenticated
    const payload = getAuthUser(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { studentId: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Student can only see their own application's rounds
    if (payload.role === "student" && application.studentId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rounds = await prisma.interviewRound.findMany({
      where: { applicationId },
      orderBy: { roundNumber: "asc" },
    });

    return NextResponse.json(rounds);
  } catch (error: any) {
    console.error("GET Interview Rounds error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    // Admin RBAC Check
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const validation = saveRoundSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { roundNumber, roundTitle, roundStatus, scheduledAt, remarks } = validation.data;

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const parsedDate = scheduledAt ? new Date(scheduledAt) : null;

    // Use Prisma upsert based on the unique compound key: applicationId_roundNumber
    const round = await prisma.interviewRound.upsert({
      where: {
        uniqueApplicationRound: {
          applicationId,
          roundNumber,
        },
      },
      update: {
        roundTitle,
        roundStatus,
        scheduledAt: parsedDate,
        remarks: remarks || null,
      },
      create: {
        applicationId,
        roundNumber,
        roundTitle,
        roundStatus,
        scheduledAt: parsedDate,
        remarks: remarks || null,
      },
    });

    // Handle application status side effects exactly like legacy PHP
    let updatedAppStatus = application.status;
    if (roundStatus === "Selected") {
      updatedAppStatus = "Interview";
    } else if (roundStatus === "Rejected") {
      updatedAppStatus = "Rejected";
    } else if (roundStatus === "Completed") {
      updatedAppStatus = "Shortlisted";
    }

    if (updatedAppStatus !== application.status) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: updatedAppStatus },
      });
    }

    return NextResponse.json({
      message: "Interview round saved successfully.",
      round,
      applicationStatus: updatedAppStatus,
    });
  } catch (error: any) {
    console.error("POST Interview Round error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
