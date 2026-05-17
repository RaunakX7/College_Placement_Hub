import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["Pending", "Selected", "Rejected", "Interview", "Shortlisted"]),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    // Admin Check
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const validation = updateStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // Verify application exists
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Update status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        student: { select: { name: true, email: true } },
        internship: { select: { companyName: true, title: true } },
      },
    });

    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("PATCH Application Status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
