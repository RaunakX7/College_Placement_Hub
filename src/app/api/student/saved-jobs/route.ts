import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "student") {
      return NextResponse.json({ error: "Unauthorized. Student privileges required." }, { status: 403 });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { studentId: payload.userId },
      include: {
        internship: true,
      },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(savedJobs);
  } catch (error: any) {
    console.error("GET Saved Jobs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
