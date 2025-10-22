import { NextResponse } from 'next/server';
import { getAsset } from '@/lib/helius';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');

    if (!assetId) {
      return NextResponse.json({ error: 'Missing assetId query parameter' }, { status: 400 });
    }

    const asset = await getAsset(assetId);
    return NextResponse.json(asset);
  } catch (error) {
    console.error('API /api/helius/getAsset error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
}
