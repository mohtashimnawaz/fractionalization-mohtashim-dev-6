/**
 * Hook for fetching user's compressed NFTs via Helius DAS API
 */

import { useQuery } from '@tanstack/react-query';
import { CompressedNFT } from '@/lib/helius';

/**
 * Fetch compressed NFTs owned by the connected wallet
 */
const fetchUserCNFTs = async (
  walletAddress?: string
): Promise<CompressedNFT[]> => {
  if (!walletAddress) return [];

  try {
    const res = await fetch(
      `/api/helius/getAssetsByOwner?owner=${encodeURIComponent(walletAddress)}`
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || res.statusText || 'Failed to fetch cNFTs');
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch cNFTs:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch compressed NFTs'
    );
  }
};

/**
 * Hook to fetch user's compressed NFTs from Helius
 */
export const useUserCNFTs = (walletAddress?: string) => {
  return useQuery({
    queryKey: ['userCNFTs', walletAddress],
    queryFn: () => fetchUserCNFTs(walletAddress),
    enabled: !!walletAddress,
    staleTime: 30000, // 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
