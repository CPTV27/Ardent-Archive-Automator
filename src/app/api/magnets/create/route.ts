import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assetId, title, date, client } = body;

    if (!assetId || !title || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create the Session Event (Magnet)
    // 2. Update the Source Asset to VERIFIED
    // 3. Link them
    const newSession = await prisma.sessionEvent.create({
      data: {
        title,
        date: new Date(date),
        client: client || "Unknown Client",
        sourceArtifact: {
          connect: { id: assetId }
        }
      }
    });

    // Update the asset status explicitly
    await prisma.asset.update({
      where: { id: assetId },
      data: {
        status: 'VERIFIED'
      }
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Failed to create magnet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}