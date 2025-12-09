import { NextRequest, NextResponse } from "next/server";
import { analyzeUploadedAsset } from "@/lib/ai/analysis";
import { prisma } from "@/lib/prisma";
import { AssetType, ProcessingStatus } from "@/types";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const mimeType = file.type;

    // 1. Run AI Analysis
    console.log(`Processing file: ${file.name} (${mimeType})...`);
    const analysis = await analyzeUploadedAsset(base64Data, mimeType);
    console.log("Analysis Complete:", analysis);

    // 2. Map AI classification to DB Enum
    let dbType: AssetType = AssetType.VISUAL; // Default
    if (analysis.classification === 'COMMERCIAL') dbType = AssetType.COMMERCIAL;
    if (analysis.classification === 'DOCUMENT') dbType = AssetType.DOCUMENT;
    if (analysis.classification === 'VISUAL') dbType = AssetType.VISUAL;

    // 3. Save to Database
    // In a real app, you would upload the file to S3/Blob storage here and get a URL.
    // For this prototype, we'll store a placeholder URL or the base64 (if small, but not recommended for prod).
    // We will simulate a storage URL.
    const fakeStorageUrl = `/uploads/${Date.now()}-${file.name}`;

    const newAsset = await prisma.asset.create({
      data: {
        url: fakeStorageUrl,
        type: dbType,
        status: ProcessingStatus.ANALYZED,
        aiRawResponse: analysis as any, // Store the full JSON object
      },
    });

    return NextResponse.json({ success: true, asset: newAsset });

  } catch (error) {
    console.error("Upload processing error:", error);
    return NextResponse.json(
      { error: "Failed to process asset", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}