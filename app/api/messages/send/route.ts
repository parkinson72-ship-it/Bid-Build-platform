// bid-build-platform/app/api/messages/send/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { jobId, message } = await req.json();

    if (!jobId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Only the homeowner or awarded builder can message
    const isHomeowner = job.userId === user.id;
    const isAwardedBuilder = job.awardedBuilderId === user.id;

    if (!isHomeowner && !isAwardedBuilder) {
      return NextResponse.json(
        { error: "You are not part of this job" },
        { status: 403 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        jobId,
        userId: user.id,
        content: message,
      },
    });

    return NextResponse.json(
      {
        message: "Message sent",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
