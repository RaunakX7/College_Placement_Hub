import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const internshipId = parseInt(id);

    if (isNaN(internshipId)) {
      return NextResponse.json({ error: "Invalid internship ID" }, { status: 400 });
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    // Check auth to enrich status
    const payload = getAuthUser(req);
    let enrichedData: any = { ...internship };

    if (payload && payload.role === "student") {
      const studentId = payload.userId;
      const [saved, applied] = await Promise.all([
        prisma.savedJob.findUnique({
          where: { uniqueSavedJob: { studentId, internshipId } },
        }),
        prisma.application.findFirst({
          where: { studentId, internshipId },
        }),
      ]);

      enrichedData.isSaved = !!saved;
      enrichedData.isApplied = !!applied;
      enrichedData.applicationStatus = applied ? applied.status : null;
    }

    return NextResponse.json(enrichedData);
  } catch (error: any) {
    console.error("GET Single Internship error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const internshipId = parseInt(id);

    if (isNaN(internshipId)) {
      return NextResponse.json({ error: "Invalid internship ID" }, { status: 400 });
    }

    // Admin RBAC Check
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    // Delete the internship (related applications and saved jobs are cascades or handled appropriately)
    await prisma.internship.delete({
      where: { id: internshipId },
    });

    return NextResponse.json({ message: "Job posting deleted successfully!" });
  } catch (error: any) {
    console.error("DELETE Internship error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
