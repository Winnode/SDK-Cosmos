# Security Policy

## Supported Versions

Only the latest published version of `winnode` on npm receives security
fixes. Please upgrade before reporting an issue:

```bash
npm install winnode@latest
```

## Reporting a Vulnerability

If you discover a security vulnerability (e.g. a signing/broadcast flaw, a
fee-calculation issue that could cause fund loss, or a dependency
vulnerability), please **do not open a public GitHub issue**. Instead report
it privately via [GitHub Security Advisories](https://github.com/winnode/sdk-cosmos/security/advisories/new)
for this repository.

Include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a minimal proof-of-concept.
- The affected version(s).

You should receive an initial response within 5 business days. Once a fix is
available, it will be released as a patch version and noted in
[CHANGELOG.md](CHANGELOG.md).

## Dependencies

This SDK signs and broadcasts transactions via `@cosmjs/*` and `ethers`.
All changes, including dependency bumps, go through CI (lint, typecheck,
tests, build — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml))
before merging.
