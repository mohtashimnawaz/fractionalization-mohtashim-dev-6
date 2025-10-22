import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, symbol, description, imageUrl, owner } = body;

    if (!name || !symbol || !owner) {
      return NextResponse.json(
        { error: 'Missing required parameters: name, symbol, owner' },
        { status: 400 }
      );
    }

    const heliusApiKey = process.env.HELIUS_API_KEY;
    
    if (!heliusApiKey) {
      console.error('HELIUS_API_KEY not configured in server environment');
      return NextResponse.json(
        { error: 'Helius API key not configured on server' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'mint-cnft',
          method: 'mintCompressedNft',
          params: {
            name,
            symbol,
            owner,
            description: description || 'A compressed NFT for testing fractionalization',
            attributes: [
              { trait_type: 'Type', value: 'Compressed' },
              { trait_type: 'Network', value: 'Devnet' },
              { trait_type: 'Created', value: new Date().toISOString() },
            ],
            imageUrl: imageUrl || 'https://via.placeholder.com/400/6366f1/ffffff?text=cNFT',
            externalUrl: 'https://example.com',
            sellerFeeBasisPoints: 500,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Helius mint error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Failed to mint cNFT' },
        { status: 500 }
      );
    }

    if (!data.result?.assetId) {
      return NextResponse.json(
        { error: 'No asset ID returned from mint' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      assetId: data.result.assetId,
      signature: data.result.signature,
    });
  } catch (error) {
    console.error('API /api/helius/mintCompressedNft error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}
