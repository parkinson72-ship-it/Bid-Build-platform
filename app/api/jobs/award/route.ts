// bid-build-platform/app/api/jobs/award/route.ts

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

    const { jobId, bidId } = await req.json();

    if (!jobId || !bidId) {
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

    // Ensure the user owns the job
    if (job.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not the owner of this job" },
        { status: 403 }
      );
    }

    // Fetch bid
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid || bid.jobId !== jobId) {
      return NextResponse.json(
        { error: "Invalid bid for this job" },
        { status: 400 }
      );
    }

    // Update job status and awarded builder
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "AWARDED",
        awardedBidId: bidId,
        awardedBuilderId: bid.userId,
      },
    });

    return NextResponse.json(
      {
        message: "Job awarded successfully",
        job: updatedJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Award job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

