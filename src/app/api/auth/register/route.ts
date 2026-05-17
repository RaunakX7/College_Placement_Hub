import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  rollNumber: z.string().min(1, "Roll number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate inputs
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, rollNumber, password } = validation.data;

    // Check if email already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the student
    const student = await prisma.student.create({
      data: {
        name,
        email,
        rollNumber,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Registration successful. Please log in.", studentId: student.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
