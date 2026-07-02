# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `types/chain.ts` — local `ChainData` type (previously imported from an external app path that didn't exist in this repo).
- `lib/keplr.ts` — local `calculateFee` implementation.
- `lib/metamask.ts` — local MetaMask helpers (`getMetaMask`, `isMetaMaskInstalled`, `switchEthereumChain`).
- `@cosmjs/stargate`, `@cosmjs/proto-signing`, `cosmjs-types`, and `ethers` as declared dependencies.
- `tsup`-based dual CJS/ESM build so `main`/`module`/`exports` in `package.json` resolve to real build output.
- Vitest test suite covering `isEvmChain`, `cosmos/fee.ts`, and `lib/keplr.ts`.
- ESLint configuration and `npm run lint` / `npm run typecheck` scripts.
- CI workflow (`.github/workflows/ci.yml`) running lint, typecheck, tests, and build on every push/PR.
- `package-lock.json`, fixing `npm ci` in CI.

## [1.0.0] - 2026-07-02

### Added

- Initial `cosmosTx` toolkit: `send`, `delegate`, `undelegate`, `redelegate`, `vote`, `unjail`, `withdrawRewards`.
- Initial `evmTx` toolkit: `sendNative`, `sendToken`, `writeContract`.
- `isEvmChain` chain-type helper.
