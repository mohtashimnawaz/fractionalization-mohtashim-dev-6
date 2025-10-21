import { NextResponse } from 'next/server';
import { getAssetsByOwner } from '@/lib/helius';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');

    if (!owner) {
      return NextResponse.json({ error: 'Missing owner query parameter' }, { status: 400 });
    }

    const assets = await getAssetsByOwner(owner);
    return NextResponse.json({ items: assets });
  } catch (error) {
    console.error('API /api/helius/getAssetsByOwner error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Unknown error' }, { status: 500 });
  }
}
