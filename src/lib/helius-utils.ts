import { PublicKey } from '@solana/web3.js';
import type { AssetProof } from './helius';

// Client-usable helper: convert AssetProof.proof nodes (base58 strings) to PublicKey
export function proofToAccounts(proof: AssetProof): PublicKey[] {
  return proof.proof.map((node) => new PublicKey(node));
}
