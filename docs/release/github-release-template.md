# MiniAppRuntime-Harmony v0.1.0

> 本模板用于项目作者手动创建 GitHub Release。发布前必须完成安全门禁，并删除所有尖括号占位内容。

## Positioning

v0.1.0 is a GitHub showcase release for a HarmonyOS Web container and JSBridge runtime practice project.

This project is based on public HarmonyOS, ArkTS and ArkWeb capabilities. The repository contains independently written source code, examples and documentation for this project.

## Highlights

- ArkWeb local H5 container with loading, blocked and error states.
- H5 SDK with `window.myascf.send(action, params, options?)`.
- requestId, callback map, Promise, timeout and callback lost handling.
- JavaScriptProxy based H5-to-ArkTS request boundary.
- BridgeController, BridgeDispatcher, HandlerRegistry and RuntimeBootstrap.
- Biz/Imp layers and BridgeCallbackExecutor.
- Toast, Clipboard, Storage and `runtime.getApiList` APIs.
- ApiManifest, generated API docs and typed API helper.
- Local `myascf_runtime` HAR module with `MyASCFRuntime` facade.
- H5 SDK IIFE/ESM builds and TypeScript declarations.
- DebugPanel, Node tests, consistency checks and GitHub Actions CI.
- Release, source walkthrough and manual smoke test documentation.

## Usage

### Local HAR

```json5
{
  "dependencies": {
    "myascf_runtime": "file:../myascf_runtime"
  }
}
```

Register the module in the project build profile, then import `MyASCFRuntime` from `myascf_runtime`. See the [HAR usage guide](https://github.com/lichenyang5/MiniAppRuntime-Harmony/blob/main/docs/guide/create-demo-with-har.md).

### H5 SDK

```bash
npm --prefix h5_sdk install
npm run h5:sync
```

The rawfile Demo loads the IIFE output and calls `window.myascf.send(...)`. ESM and typed API usage are documented in the [H5 SDK guide](https://github.com/lichenyang5/MiniAppRuntime-Harmony/blob/main/docs/guide/h5-sdk-usage.md).

## Verification

- Root checks: `<commit and result>`
- H5 SDK checks: `<test count and result>`
- npm pack dry-run: `<file count and size>`
- GitHub Actions: `<workflow URL and result>`
- HAP build: `<DevEco Studio / SDK / result>`
- Device or emulator: `<device / system / manual smoke result>`

GitHub Actions checks generated files, registration consistency, H5 SDK build/tests and package entries. It does not replace ArkWeb, permission or device smoke testing.

## Not Included

- No npm publish yet.
- No ohpm publish yet; the HAR is a local dependency.
- No CLI, Network API or Device API yet.
- No production-grade security sandbox or full compatibility guarantee.

## Known Limitations

- Clipboard permission behavior and SDK warnings require target-device verification.
- Some recommended screenshots and the complete manual regression record may still need completion.
- ArkTS Manifest and the JSON generation source are currently synchronized mirrors rather than one generated source.

## Security Gate

Do not publish this Release until exposed signing credentials have been rotated or revoked and removed from the current repository and Git history. Confirm the cleaned commit and its CI result before creating the tag.

## Links

- [README](https://github.com/lichenyang5/MiniAppRuntime-Harmony#readme)
- [Release Notes](https://github.com/lichenyang5/MiniAppRuntime-Harmony/blob/main/docs/release/v0.1.0-release-notes.md)
- [Manual Smoke Test](https://github.com/lichenyang5/MiniAppRuntime-Harmony/blob/main/docs/testing/manual-smoke-test.md)
- [Article Draft](https://github.com/lichenyang5/MiniAppRuntime-Harmony/blob/main/docs/articles/juejin-h5-sdk-runtime-framework-design.md)

This Release must be created manually. The project does not automate tagging, npm publishing or ohpm publishing in v0.1.0.
