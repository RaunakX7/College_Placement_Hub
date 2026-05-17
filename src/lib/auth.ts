import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key_123";

export interface JWTPayload {
  userId: number;
  role: "student" | "admin";
  emailOrUsername: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req: NextRequest): JWTPayload | null {
  // Check authorization header first
  const authHeader = req.headers.get("authorization");
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Fallback to cookie
    const cookieToken = req.cookies.get("token");
    if (cookieToken) {
      token = cookieToken.value;
    }
  }

  if (!token) return null;
  return verifyToken(token);
}
