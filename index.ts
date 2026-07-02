/**
 * WinScan Tx SDK
 *
 * Two independent, chain-type-specific transaction toolkits:
 *  - `sdk/cosmos` — send, delegate, undelegate, redelegate, vote, unjail,
 *    withdrawRewards for Cosmos SDK chains (signs via any OfflineSigner:
 *    Keplr, Leap, etc).
 *  - `sdk/evm`    — sendNative, sendToken, writeContract for EVM chains
 *    (signs via the injected browser wallet, e.g. MetaMask).
 *
 * Use `isEvmChain(chain)` to pick which one applies to a given chain config.
 */
export { isEvmChain } from './types';
export type { TxResult, TxOptions } from './types';

export * as cosmosTx from './cosmos';
export * as evmTx from './evm';
