import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { ChainData } from '../types/chain';
import { getMetaMask, isMetaMaskInstalled, switchEthereumChain } from '../lib/metamask';

/**
 * Read-only provider for the chain's EVM RPC (falls back to the Tendermint
 * rpc list for chains that only expose one endpoint set).
 */
export function getReadProvider(chain: ChainData): JsonRpcProvider {
  const endpoint = chain.evm_rpc?.[0]?.address || chain.rpc?.[0]?.address;
  if (!endpoint) {
    throw new Error(`No EVM RPC endpoint available for chain ${chain.chain_name}`);
  }
  return new JsonRpcProvider(endpoint);
}

/**
 * Signer backed by the injected wallet (MetaMask). Ensures the wallet is
 * switched to the requested chain before returning the signer.
 */
export async function getBrowserSigner(chain: ChainData): Promise<JsonRpcSigner> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask extension is not installed');
  }

  await switchEthereumChain(chain);

  const ethereum = getMetaMask();
  const provider = new BrowserProvider(ethereum);
  return provider.getSigner();
}
