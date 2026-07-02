import { describe, expect, it } from 'vitest';
import { calculateFee } from '../lib/keplr';
import type { ChainData } from '../types/chain';

function chain(overrides: Partial<ChainData> = {}): ChainData {
  return { chain_name: 'test-chain', ...overrides };
}

describe('calculateFee', () => {
  it('uses the average gas price from fee_tokens when available', async () => {
    const fee = await calculateFee(
      chain({ fees: { fee_tokens: [{ denom: 'uatom', average_gas_price: 0.03 }] } }),
      '200000'
    );
    expect(fee).toEqual({ amount: [{ denom: 'uatom', amount: '6000' }], gas: '200000' });
  });

  it('falls back to fixed_min_gas_price when no average price is set', async () => {
    const fee = await calculateFee(
      chain({ fees: { fee_tokens: [{ denom: 'upaxi', fixed_min_gas_price: 0.01 }] } }),
      '100000'
    );
    expect(fee).toEqual({ amount: [{ denom: 'upaxi', amount: '1000' }], gas: '100000' });
  });

  it('falls back to a default gas price when no fee_tokens are configured', async () => {
    const fee = await calculateFee(chain(), '100000');
    expect(fee).toEqual({ amount: [{ denom: 'uatom', amount: '2500' }], gas: '100000' });
  });
});
