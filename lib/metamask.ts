import { ChainData } from '../types/chain';

interface Eip1193Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
}

export function getMetaMask(): Eip1193Provider {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask extension is not installed');
  }
  return window.ethereum as Eip1193Provider;
}

function toHexChainId(chain: ChainData): string {
  if (!chain.evm_chain_id) {
    throw new Error(`No evm_chain_id configured for chain ${chain.chain_name}`);
  }
  return `0x${chain.evm_chain_id.toString(16)}`;
}

/**
 * Switches the wallet's active chain, adding it first if MetaMask doesn't
 * already know about it (error code 4902).
 */
export async function switchEthereumChain(chain: ChainData): Promise<void> {
  const ethereum = getMetaMask();
  const chainIdHex = toHexChainId(chain);

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (error: any) {
    if (error?.code !== 4902) {
      throw error;
    }

    const asset = chain.assets?.[0];
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainIdHex,
          chainName: chain.chain_name,
          nativeCurrency: {
            name: asset?.display || asset?.base || chain.chain_name,
            symbol: asset?.symbol || asset?.display || 'ETH',
            decimals: 18,
          },
          rpcUrls: (chain.evm_rpc || []).map((rpc) => rpc.address),
        },
      ],
    });
  }
}
