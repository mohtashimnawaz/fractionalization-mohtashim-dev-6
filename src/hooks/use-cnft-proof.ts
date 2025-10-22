/**
 * Hook for fetching compressed NFT Merkle proof
 */

import { useQuery } from '@tanstack/react-query';
import type { AssetProof } from '@/lib/helius';

/**
 * Fetch Merkle proof for a compressed NFT
 * Required for on-chain transactions (fractionalize, transfer, etc.)
 */
const fetchCNFTProof = async (
  assetId?: string
): Promise<AssetProof | null> => {
  if (!assetId) return null;

  try {
    const res = await fetch(`/api/helius/getAssetProof?assetId=${encodeURIComponent(assetId)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || res.statusText || 'Failed to fetch proof');
    }
    return (await res.json()) as AssetProof;
  } catch (error) {
    console.error('Failed to fetch cNFT proof:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch asset proof'
    );
  }
};

/**
 * Hook to fetch Merkle proof for a cNFT
 * Use this before fractionalizing to get proof for remaining_accounts
 */
export const useCNFTProof = (assetId?: string) => {
  return useQuery({
    queryKey: ['cnftProof', assetId],
    queryFn: () => fetchCNFTProof(assetId),
    enabled: !!assetId,
    staleTime: 60000, // 1 minute
    retry: 2,
    // Don't cache proofs too long - they should be fresh for transactions
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
