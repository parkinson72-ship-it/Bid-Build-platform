// bid-build-platform/app/api/jobs/bid/route.ts

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

    const { jobId, amount, message, timeline } = await req.json();

    if (!jobId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check job exists
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate bids from same builder
    const existingBid = await prisma.bid.findFirst({
      where: {
        jobId,
        userId: user.id,
      },
    });

    if (existingBid) {
      return NextResponse.json(
        { error: "You have already submitted a bid for this job" },
        { status: 409 }
      );
    }

    const bid = await prisma.bid.create({
      data: {
        amount,
        message: message || "",
        timeline: timeline || "",
        jobId,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Bid submitted successfully",
        bid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bid submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

