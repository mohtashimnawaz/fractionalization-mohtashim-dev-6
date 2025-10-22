import { NextResponse } from 'next/server';
import { getAssetProof } from '@/lib/helius';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');

    if (!assetId) {
      return NextResponse.json({ error: 'Missing assetId query parameter' }, { status: 400 });
    }

    const proof = await getAssetProof(assetId);
    return NextResponse.json(proof);
  } catch (error) {
    console.error('API /api/helius/getAssetProof error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
}
