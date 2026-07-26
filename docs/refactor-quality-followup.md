# Refactor Quality Follow-up Handoff

This handoff records the release-readiness follow-up after the userscript source split and build refactor.

## Completed in this follow-up

- Restored the userscript metadata version to `0.3.4` in `src/userscript-header.js` and regenerated `LinuxDo Hub Tool.user.js`.
- Removed the pure-comment compatibility placeholder `src/core/state-and-queries.js` from `SOURCE_FILES` and deleted the file.
- Kept `src/channels/channel-cache.js` removed; channel cache mutation logic remains in `src/core/channel-cache.js`.
- Added key `SOURCE_FILES` order guards in `scripts/build-userscript.js`:
  - `src/core/constants.js` before `src/core/state.js`
  - `src/core/state.js` before `src/core/channel-cache.js`
  - `src/graphql/pricing-fields.js` before `src/core/fetch-patch.js`
  - `src/core/bootstrap-and-test-exports.js` as the final source file

## Verification run after fixes

The following checks passed after rebuilding:

```bash
node scripts/build-userscript.js
node scripts/check-userscript.js
node --test tests/*.test.js
node --check "LinuxDo Hub Tool.user.js"
node --check scripts/build-userscript.js
node --check scripts/check-userscript.js
```

Observed test result: 4 test files passed.

## Manual browser smoke checklist

This still requires a real logged-in browser session on `https://hub.linux.do/`.

- [ ] Marketplace page: verify all/free/paid filters still work and channel cards remain usable.
- [ ] Model detail page: verify provider pricing data still loads after GraphQL pricing-field augmentation.
- [ ] API Keys page: verify dialog open/close, profile binding, channel list editing, and save behavior.
- [ ] Requests page: verify entry point mounting, request-trigger controls, and channel mapping display.

Record browser, account state, and any console/network errors before release.

## Recommended next-session tasks

1. Add targeted tests for `src/graphql/pricing-fields.js`:
   - existing `mode` but missing `flatFee`
   - existing `flatFee` but missing `mode`
   - multiple `pricing` selections
   - nested pricing-like blocks
   - fragment-shaped marketplace model queries
2. Add fetch body regression coverage for:
   - `fetch(url, { body })`
   - `fetch(new Request(url, { body }))`
   - pricing-field injection preserving method, headers, and body
   - no body-consumption error after patched fetch processing
3. Continue splitting `src/core/fetch-patch.js` in small behavior-preserving steps:
   - request/header context helpers
   - response wrapping helpers
   - marketplace channel URL sanitization helpers
4. Keep the current zero-dependency concatenation build as the release baseline while preparing ESM/esbuild:
   - introduce explicit import/export only after source boundaries are stable
   - add a parallel bundler output first
   - do not replace `scripts/build-userscript.js` until the bundler output passes the same release checks and browser smoke tests
