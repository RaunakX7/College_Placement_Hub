import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Admin Check
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const [totalStudents, totalJobs, totalApplications, placedStudents, recentApplications] = await Promise.all([
      prisma.student.count(),
      prisma.internship.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: "Selected" } }),
      prisma.application.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: {
          student: { select: { name: true, email: true, rollNumber: true } },
          internship: { select: { companyName: true, title: true, type: true } },
        },
      }),
    ]);

    // Calculate application status breakdown for beautiful charts
    const statusCounts = await prisma.application.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const stats = {
      metrics: {
        totalStudents,
        totalJobs,
        totalApplications,
        placedStudents,
      },
      statusBreakdown: statusCounts.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
      recentApplications,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("GET Admin Stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
