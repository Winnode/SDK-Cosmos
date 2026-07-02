import { ChainData } from './types/chain';

export interface TxResult {
  success: boolean;
  txHash?: string;
  error?: string;
  raw?: any;
}

export interface TxOptions {
  memo?: string;
  gasLimit?: string;
}

/**
 * A chain is treated as EVM when it declares evm_rpc endpoints or its
 * coin_type is 60 (Ethereum's SLIP-44 index) — same heuristic used across
 * the rest of the app (see lib/keplr.ts isEvmChain checks).
 */
export function isEvmChain(chain: ChainData): boolean {
  const coinType = parseInt(chain.coin_type || '118');
  return coinType === 60 || Boolean(chain.evm_rpc && chain.evm_rpc.length > 0);
}
