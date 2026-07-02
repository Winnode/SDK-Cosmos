import { ChainData } from '../types/chain';

export function getPrimaryDenom(chain: ChainData): string {
  return chain.assets?.[0]?.base || 'uatom';
}

/**
 * Delegates to the app's existing, battle-tested fee calculation
 * (gas_price / fee_tokens / exponent-based fallbacks, PaxiHub minimums, etc.)
 * so every SDK tx uses the same fee logic as the rest of the explorer.
 */
export async function buildFee(
  chain: ChainData,
  gasLimit: string
): Promise<{ amount: Array<{ denom: string; amount: string }>; gas: string }> {
  const { calculateFee } = await import('../lib/keplr');
  return calculateFee(chain, gasLimit);
}

/**
 * Picks the RPC endpoint with tx_index enabled when available, otherwise
 * falls back to the first configured endpoint.
 */
export function pickRpcEndpoint(chain: ChainData): string {
  const rpcList = chain.rpc || [];
  const indexed = rpcList.find((rpc) => rpc.tx_index === 'on');
  const endpoint = (indexed || rpcList[0])?.address;

  if (!endpoint) {
    throw new Error(`No RPC endpoint available for chain ${chain.chain_name}`);
  }

  return endpoint;
}
