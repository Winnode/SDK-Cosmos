import { describe, expect, it } from 'vitest';
import { getPrimaryDenom, pickRpcEndpoint } from '../cosmos/fee';
import type { ChainData } from '../types/chain';

function chain(overrides: Partial<ChainData> = {}): ChainData {
  return { chain_name: 'test-chain', ...overrides };
}

describe('getPrimaryDenom', () => {
  it('returns the first asset base denom', () => {
    expect(getPrimaryDenom(chain({ assets: [{ base: 'uosmo' }] }))).toBe('uosmo');
  });

  it('falls back to uatom when no assets are configured', () => {
    expect(getPrimaryDenom(chain())).toBe('uatom');
  });
});

describe('pickRpcEndpoint', () => {
  it('prefers the endpoint with tx_index enabled', () => {
    const result = pickRpcEndpoint(
      chain({
        rpc: [
          { address: 'https://no-index.example' },
          { address: 'https://indexed.example', tx_index: 'on' },
        ],
      })
    );
    expect(result).toBe('https://indexed.example');
  });

  it('falls back to the first endpoint when none are indexed', () => {
    const result = pickRpcEndpoint(chain({ rpc: [{ address: 'https://first.example' }] }));
    expect(result).toBe('https://first.example');
  });

  it('throws when no rpc endpoints are configured', () => {
    expect(() => pickRpcEndpoint(chain())).toThrow(/No RPC endpoint available/);
  });
});
