import { SigningStargateClient } from '@cosmjs/stargate';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainData } from '../types/chain';
import { createCosmosRegistry } from './registry';
import { pickRpcEndpoint } from './fee';

const clientCache = new Map<string, SigningStargateClient>();

/**
 * Connects a SigningStargateClient for the given chain using any
 * OfflineSigner-compatible wallet (Keplr's getOfflineSignerAuto/getOfflineSigner,
 * Leap, etc). Clients are cached per rpc+address so repeated calls in the
 * same session reuse the open connection.
 */
export async function getSigningStargateClient(
  chain: ChainData,
  signer: OfflineSigner
): Promise<SigningStargateClient> {
  const rpcEndpoint = pickRpcEndpoint(chain);
  const [account] = await signer.getAccounts();
  const cacheKey = `${rpcEndpoint}:${account.address}`;

  const cached = clientCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // @cosmjs/proto-signing is duplicated (top-level ^0.37 vs stargate's
  // nested ^0.38), so Registry's type identity differs even though the
  // runtime shape is compatible. Same workaround used in lib/keplr.ts.
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: createCosmosRegistry() as any,
  });

  clientCache.set(cacheKey, client);
  return client;
}

export function clearCosmosClientCache(): void {
  clientCache.clear();
}
