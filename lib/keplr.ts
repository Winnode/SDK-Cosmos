import { ChainData } from '../types/chain';

const DEFAULT_GAS_PRICE = 0.025;
const DEFAULT_DENOM = 'uatom';

/**
 * Picks a gas price for the chain's primary fee token, preferring the
 * average price, then the low price, then the fixed minimum, and finally
 * falling back to a conservative default for chains that don't publish
 * fee_tokens (e.g. local devnets).
 */
function pickGasPrice(chain: ChainData): { denom: string; price: number } {
  const feeToken = chain.fees?.fee_tokens?.[0];
  if (!feeToken) {
    return { denom: chain.assets?.[0]?.base || DEFAULT_DENOM, price: DEFAULT_GAS_PRICE };
  }

  const price =
    feeToken.average_gas_price ?? feeToken.low_gas_price ?? feeToken.fixed_min_gas_price ?? DEFAULT_GAS_PRICE;

  return { denom: feeToken.denom, price };
}

export async function calculateFee(
  chain: ChainData,
  gasLimit: string
): Promise<{ amount: Array<{ denom: string; amount: string }>; gas: string }> {
  const { denom, price } = pickGasPrice(chain);
  const amount = Math.ceil(Number(gasLimit) * price).toString();

  return {
    amount: [{ denom, amount }],
    gas: gasLimit,
  };
}
