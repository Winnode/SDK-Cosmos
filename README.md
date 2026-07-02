# WinNode SDK

[![npm version](https://img.shields.io/npm/v/winnode.svg)](https://www.npmjs.com/package/winnode)
[![CI](https://github.com/winnode/sdk-cosmos/actions/workflows/ci.yml/badge.svg)](https://github.com/winnode/sdk-cosmos/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Transaction toolkits for Cosmos SDK and EVM chains — send, delegate, vote,
and more, with a small dependency-free `isEvmChain` helper to pick the right
toolkit for a given chain.

## Features

- **Cosmos SDK** (`cosmosTx`) — `send`, `delegate`, `undelegate`,
  `redelegate`, `vote`, `unjail`, `withdrawRewards`. Signs via any
  `OfflineSigner`-compatible wallet (Keplr, Leap, etc).
- **EVM chains** (`evmTx`) — `sendNative`, `sendToken`, `writeContract`.
  Signs via the injected browser wallet (MetaMask).
- **Chain-type detection** — `isEvmChain(chain)` picks which toolkit
  applies based on `coin_type` / `evm_rpc`.
- Ships as CJS, ESM, and TypeScript types.

## Installation

```bash
npm install winnode
```

Requires Node.js 18+ and (for EVM signing) a browser environment with
MetaMask injected as `window.ethereum`.

### CDN

For quick prototyping without a bundler, load the ESM build directly from a
CDN:

```html
<script type="module">
  import { isEvmChain, cosmosTx, evmTx } from 'https://cdn.jsdelivr.net/npm/winnode/dist/index.mjs';
</script>
```

Or from unpkg: `https://unpkg.com/winnode/dist/index.mjs`. Pin a version for
production use, e.g. `https://cdn.jsdelivr.net/npm/winnode@1.0.1/dist/index.mjs`.

## Usage

```typescript
import { isEvmChain, cosmosTx, evmTx } from 'winnode';
import type { ChainData } from 'winnode';

declare const chain: ChainData;

if (isEvmChain(chain)) {
  // EVM chain
  const signer = await evmTx.getBrowserSigner(chain);
  const result = await evmTx.sendNative(signer, {
    toAddress: '0x...',
    amount: '1.5',
  });
} else {
  // Cosmos SDK chain
  const result = await cosmosTx.send(chain, offlineSigner, {
    fromAddress: 'cosmos1...',
    toAddress: 'cosmos1...',
    amount: '1000000',
  });
}
```

### `ChainData`

Both toolkits take a `ChainData` describing the chain (see
[`types/chain.ts`](types/chain.ts)): `chain_name`, `chain_id`, `coin_type`,
`assets`, `rpc`, `evm_rpc`, `evm_chain_id`, and `fees.fee_tokens` (used for
Cosmos fee calculation).

### Cosmos SDK API (`cosmosTx`)

| Function | Description |
| --- | --- |
| `send(chain, signer, params, opts?)` | `MsgSend` |
| `delegate(chain, signer, params, opts?)` | `MsgDelegate` |
| `undelegate(chain, signer, params, opts?)` | `MsgUndelegate` |
| `redelegate(chain, signer, params, opts?)` | `MsgBeginRedelegate` |
| `vote(chain, signer, params, opts?)` | `MsgVote` |
| `unjail(chain, signer, params, opts?)` | `MsgUnjail` |
| `withdrawRewards(chain, signer, params, opts?)` | `MsgWithdrawDelegatorReward` |
| `getSigningStargateClient(chain, signer)` | Cached `SigningStargateClient` |

Every function returns a `Promise<TxResult>`:
`{ success: boolean; txHash?: string; error?: string; raw?: any }`.

### EVM API (`evmTx`)

| Function | Description |
| --- | --- |
| `sendNative(signer, params, opts?)` | Send the chain's native coin |
| `sendToken(signer, params, opts?)` | ERC-20 `transfer` |
| `writeContract(signer, address, abi, method, args?, opts?)` | Generic contract write (e.g. staking/gov precompiles) |
| `getReadProvider(chain)` | Read-only `JsonRpcProvider` |
| `getBrowserSigner(chain)` | MetaMask-backed `JsonRpcSigner`, switching chains as needed |

## Development

```bash
npm install         # install dependencies
npm run build        # build dist/ (CJS + ESM + types via tsup)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm test             # vitest run
```

## Releasing

Versions are bumped with `npm version`, which updates `package.json`,
commits the change, and creates a matching git tag:

```bash
npm version patch   # bug fixes: 1.0.0 -> 1.0.1
npm version minor   # new features: 1.0.0 -> 1.1.0
npm version major   # breaking changes: 1.0.0 -> 2.0.0
```

Before bumping, add an entry to [CHANGELOG.md](CHANGELOG.md) describing what
changed. Push the resulting commit and tag to `main`
(`git push && git push --tags`); the `Publish to npm` workflow lints,
typechecks, tests, builds, and publishes the package automatically.

## Security

See [SECURITY.md](SECURITY.md) for supported versions and how to report a
vulnerability.

## License

[MIT](LICENSE)
