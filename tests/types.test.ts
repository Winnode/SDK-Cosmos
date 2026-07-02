import { describe, expect, it } from 'vitest';
import { isEvmChain } from '../types';
import type { ChainData } from '../types/chain';

function chain(overrides: Partial<ChainData> = {}): ChainData {
  return { chain_name: 'test-chain', ...overrides };
}

describe('isEvmChain', () => {
  it('treats coin_type 60 as EVM', () => {
    expect(isEvmChain(chain({ coin_type: '60' }))).toBe(true);
  });

  it('treats chains with evm_rpc endpoints as EVM', () => {
    expect(isEvmChain(chain({ evm_rpc: [{ address: 'https://rpc.example' }] }))).toBe(true);
  });

  it('defaults non-EVM chains to Cosmos', () => {
    expect(isEvmChain(chain())).toBe(false);
    expect(isEvmChain(chain({ coin_type: '118' }))).toBe(false);
  });
});
