import { Contract, parseUnits, JsonRpcSigner } from 'ethers';
import { TxOptions, TxResult } from '../types';

export interface SendNativeParams {
  toAddress: string;
  amount: string; // human-readable, e.g. "1.5"
  decimals?: number; // defaults to 18
}

export interface SendTokenParams {
  tokenAddress: string;
  toAddress: string;
  amount: string; // human-readable
  decimals?: number; // defaults to 18
}

const ERC20_TRANSFER_ABI = ['function transfer(address to, uint256 amount) returns (bool)'];

async function run(fn: () => Promise<{ hash: string; wait: () => Promise<any> }>): Promise<TxResult> {
  try {
    const tx = await fn();
    const receipt = await tx.wait();
    if (receipt && receipt.status === 0) {
      return { success: false, error: 'Transaction reverted', txHash: tx.hash, raw: receipt };
    }
    return { success: true, txHash: tx.hash, raw: receipt };
  } catch (error: any) {
    return { success: false, error: error?.shortMessage || error?.message || 'Transaction failed' };
  }
}

/** Sends the chain's native coin (e.g. MON on Monad). */
export async function sendNative(
  signer: JsonRpcSigner,
  params: SendNativeParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  return run(() =>
    signer.sendTransaction({
      to: params.toAddress,
      value: parseUnits(params.amount, params.decimals ?? 18),
    })
  );
}

/** Sends an ERC-20 token via its standard `transfer` method. */
export async function sendToken(
  signer: JsonRpcSigner,
  params: SendTokenParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const contract = new Contract(params.tokenAddress, ERC20_TRANSFER_ABI, signer);
  return run(() => contract.transfer(params.toAddress, parseUnits(params.amount, params.decimals ?? 18)));
}

/**
 * Generic contract write, for chains that expose staking/governance actions
 * (delegate, undelegate, vote, unjail) through a contract or precompile
 * rather than a native Cosmos message — e.g. Cosmos-EVM staking/gov
 * precompiles. Pass the ABI fragment for the single method being called.
 */
export async function writeContract(
  signer: JsonRpcSigner,
  contractAddress: string,
  abiFragment: string[],
  method: string,
  args: any[] = [],
  opts: TxOptions = {}
): Promise<TxResult> {
  const contract = new Contract(contractAddress, abiFragment, signer);
  return run(() => contract[method](...args));
}
