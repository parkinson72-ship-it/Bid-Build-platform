// bid-build-platform/app/api/files/scan/route.ts

import { NextResponse } from "next/server";
import { getFromR2 } from "@/lib/r2";
import { scanFileWithVirusTotal } from "@/lib/virusTotal";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { error: "Missing file key" },
        { status: 400 }
      );
    }

    // Download file from R2
    const r2File = await getFromR2(key);
    const stream = r2File.Body as ReadableStream;

    const buffer = Buffer.from(await streamToArrayBuffer(stream));

    // Send to VirusTotal
    const scanResult = await scanFileWithVirusTotal(buffer);

    return NextResponse.json(
      {
        message: "Scan submitted",
        scanId: scanResult.data.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper: convert ReadableStream → ArrayBuffer
async function streamToArrayBuffer(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const size = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const buffer = new Uint8Array(size);

  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }

  return buffer.buffer;
}

