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

    const students = await prisma.student.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        rollNumber: true,
        phone: true,
        department: true,
        graduationYear: true,
        cgpa: true,
        resume: true,
        createdAt: true,
      },
    });

    const formattedStudents = students.map((s) => ({
      ...s,
      cgpa: s.cgpa ? Number(s.cgpa) : null,
    }));

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error("GET Admin Students error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Invalid Student ID" }, { status: 400 });
    }

    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json({ message: "Student deleted successfully!" });
  } catch (error: any) {
    console.error("DELETE Admin Student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  // Admin updates a student detail (e.g. CGPA, department)
  try {
    const payload = getAuthUser(req);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Invalid Student ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, email, rollNumber, department, cgpa, graduationYear } = body;

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        name,
        email,
        rollNumber,
        department,
        graduationYear,
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
      },
    });

    return NextResponse.json({ message: "Student updated successfully!", student: updated });
  } catch (error: any) {
    console.error("PATCH Admin Student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
