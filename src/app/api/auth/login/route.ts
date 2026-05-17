import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  role: z.enum(["student", "admin"]),
  email: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate inputs
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { role, email, username, password } = validation.data;

    let userPayload = {
      userId: 0,
      role: role,
      emailOrUsername: "",
      name: "",
    };

    if (role === "admin") {
      if (!username) {
        return NextResponse.json({ error: "Admin username is required" }, { status: 400 });
      }

      // Fetch admin by username
      const admin = await prisma.admin.findUnique({
        where: { username },
      });

      if (!admin) {
        return NextResponse.json({ error: "Invalid admin username or password" }, { status: 401 });
      }

      // Verify password (supports plain text for seed 'admin123' as well as hashed passwords)
      const isPasswordValid =
        password === admin.password || (await comparePassword(password, admin.password));

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid admin username or password" }, { status: 401 });
      }

      userPayload = {
        userId: admin.id,
        role: "admin",
        emailOrUsername: admin.username,
        name: "Administrator",
      };
    } else {
      if (!email) {
        return NextResponse.json({ error: "Student email is required" }, { status: 400 });
      }

      // Fetch student by email
      const student = await prisma.student.findUnique({
        where: { email },
      });

      if (!student) {
        return NextResponse.json({ error: "Invalid student email or password" }, { status: 401 });
      }

      // Verify hashed password
      const isPasswordValid = await comparePassword(password, student.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid student email or password" }, { status: 401 });
      }

      userPayload = {
        userId: student.id,
        role: "student",
        emailOrUsername: student.email,
        name: student.name,
      };
    }

    // Generate JWT token
    const token = signToken(userPayload);

    // Set cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: userPayload.userId,
        role: userPayload.role,
        name: userPayload.name,
        emailOrUsername: userPayload.emailOrUsername,
      },
      token,
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
