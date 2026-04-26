// bid-build-platform/lib/auth.ts

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Hash a password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Create a JWT token
export function createToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify a JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Get user from token
export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object") return null;

  const userId = (decoded as any).id;
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
}

