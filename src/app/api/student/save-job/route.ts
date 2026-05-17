import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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

    // Check if already saved
    const existingSave = await prisma.savedJob.findUnique({
      where: {
        uniqueSavedJob: {
          studentId: payload.userId,
          internshipId: parseInt(internshipId),
        },
      },
    });

    if (existingSave) {
      // Unsave (Delete)
      await prisma.savedJob.delete({
        where: { id: existingSave.id },
      });
      return NextResponse.json({ message: "Job removed from saved list.", saved: false });
    } else {
      // Save (Create)
      await prisma.savedJob.create({
        data: {
          studentId: payload.userId,
          internshipId: parseInt(internshipId),
        },
      });
      return NextResponse.json({ message: "Job saved successfully.", saved: true });
    }
  } catch (error: any) {
    console.error("POST Toggle Saved Job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
