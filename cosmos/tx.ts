import type { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainData } from '../types/chain';
import { TxOptions, TxResult } from '../types';
import { getSigningStargateClient } from './client';
import { buildFee, getPrimaryDenom } from './fee';

export interface SendParams {
  fromAddress: string;
  toAddress: string;
  amount: string;
  denom?: string;
}

export interface DelegateParams {
  delegatorAddress: string;
  validatorAddress: string;
  amount: string;
  denom?: string;
}

export interface UndelegateParams extends DelegateParams {}

export interface RedelegateParams {
  delegatorAddress: string;
  validatorSrcAddress: string;
  validatorDstAddress: string;
  amount: string;
  denom?: string;
}

/** 1 = Yes, 2 = Abstain, 3 = No, 4 = NoWithVeto */
export type VoteOption = 1 | 2 | 3 | 4;

export interface VoteParams {
  voterAddress: string;
  proposalId: string;
  option: VoteOption;
}

export interface UnjailParams {
  senderAddress: string;
  validatorAddress: string;
}

export interface WithdrawRewardsParams {
  delegatorAddress: string;
  validatorAddress: string;
}

async function signAndBroadcast(
  chain: ChainData,
  signer: OfflineSigner,
  senderAddress: string,
  messages: Array<{ typeUrl: string; value: any }>,
  opts: TxOptions,
  defaultGasLimit: string
): Promise<TxResult> {
  try {
    const gasLimit = opts.gasLimit || defaultGasLimit;
    const client = await getSigningStargateClient(chain, signer);
    const fee = await buildFee(chain, gasLimit);

    const result = await client.signAndBroadcast(senderAddress, messages, fee, opts.memo || '');

    if (result.code === 0) {
      return { success: true, txHash: result.transactionHash, raw: result };
    }
    return { success: false, error: result.rawLog || `Transaction failed with code ${result.code}`, raw: result };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Transaction failed' };
  }
}

export async function send(
  chain: ChainData,
  signer: OfflineSigner,
  params: SendParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const denom = params.denom || getPrimaryDenom(chain);
  const message = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      amount: [{ denom, amount: params.amount }],
    },
  };
  return signAndBroadcast(chain, signer, params.fromAddress, [message], opts, '200000');
}

export async function delegate(
  chain: ChainData,
  signer: OfflineSigner,
  params: DelegateParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const denom = params.denom || getPrimaryDenom(chain);
  const message = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: {
      delegatorAddress: params.delegatorAddress,
      validatorAddress: params.validatorAddress,
      amount: { denom, amount: params.amount },
    },
  };
  return signAndBroadcast(chain, signer, params.delegatorAddress, [message], opts, '300000');
}

export async function undelegate(
  chain: ChainData,
  signer: OfflineSigner,
  params: UndelegateParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const denom = params.denom || getPrimaryDenom(chain);
  const message = {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: {
      delegatorAddress: params.delegatorAddress,
      validatorAddress: params.validatorAddress,
      amount: { denom, amount: params.amount },
    },
  };
  return signAndBroadcast(chain, signer, params.delegatorAddress, [message], opts, '300000');
}

export async function redelegate(
  chain: ChainData,
  signer: OfflineSigner,
  params: RedelegateParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const denom = params.denom || getPrimaryDenom(chain);
  const message = {
    typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    value: {
      delegatorAddress: params.delegatorAddress,
      validatorSrcAddress: params.validatorSrcAddress,
      validatorDstAddress: params.validatorDstAddress,
      amount: { denom, amount: params.amount },
    },
  };
  return signAndBroadcast(chain, signer, params.delegatorAddress, [message], opts, '300000');
}

export async function vote(
  chain: ChainData,
  signer: OfflineSigner,
  params: VoteParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const chainId = chain.chain_id || chain.chain_name;
  const typeUrl = chainId.includes('atomone') ? '/atomone.gov.v1beta1.MsgVote' : '/cosmos.gov.v1beta1.MsgVote';
  const message = {
    typeUrl,
    value: {
      proposalId: params.proposalId,
      voter: params.voterAddress,
      option: params.option,
    },
  };
  return signAndBroadcast(chain, signer, params.voterAddress, [message], opts, '400000');
}

export async function unjail(
  chain: ChainData,
  signer: OfflineSigner,
  params: UnjailParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const message = {
    typeUrl: '/cosmos.slashing.v1beta1.MsgUnjail',
    value: { validatorAddr: params.validatorAddress },
  };
  return signAndBroadcast(chain, signer, params.senderAddress, [message], opts, '500000');
}

export async function withdrawRewards(
  chain: ChainData,
  signer: OfflineSigner,
  params: WithdrawRewardsParams,
  opts: TxOptions = {}
): Promise<TxResult> {
  const message = {
    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    value: {
      delegatorAddress: params.delegatorAddress,
      validatorAddress: params.validatorAddress,
    },
  };
  return signAndBroadcast(chain, signer, params.delegatorAddress, [message], opts, '300000');
}
