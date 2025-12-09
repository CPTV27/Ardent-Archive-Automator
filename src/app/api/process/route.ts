import { NextRequest, NextResponse } from 'next/server';
import { analyzeUploadedAsset } from '../../../lib/ai/analysis'; // Ensure this path matches your structure
// FIX: Relative import
import { AssetMetadata } from '../../../types';
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    // Run the AI Analysis
    const metadata: AssetMetadata = await analyzeUploadedAsset({
        mimeType: file.type,
        base64: base64
    });

    // In a real app, you would save to Prisma here:
    // await prisma.asset.create({ ... })

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Processing failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}