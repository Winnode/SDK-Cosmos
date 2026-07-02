import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import { MsgUnjail } from 'cosmjs-types/cosmos/slashing/v1beta1/tx';

/**
 * @cosmjs/stargate's defaultRegistryTypes already covers MsgSend, MsgDelegate,
 * MsgUndelegate, MsgBeginRedelegate, MsgVote and MsgWithdrawDelegatorReward.
 * MsgUnjail is the only staking-adjacent message missing from it.
 */
export function createCosmosRegistry(): Registry {
  return new Registry([
    ...defaultRegistryTypes,
    ['/cosmos.slashing.v1beta1.MsgUnjail', MsgUnjail],
  ] as any);
}
