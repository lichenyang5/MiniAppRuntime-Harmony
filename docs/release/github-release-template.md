# MiniAppRuntime-Harmony v0.1.0

> 本模板用于未来 GitHub Release。发布前请删除未完成内容，并填写真实验证环境。

## Highlights

- ArkWeb local H5 container and load states.
- H5 to ArkTS Promise-based JSBridge.
- Local `myascf_runtime` HAR module.
- H5 SDK JavaScript dist and TypeScript declarations.
- Toast, Clipboard and Storage APIs.
- `runtime.getApiList` and API Manifest.
- H5 DebugPanel and generated API docs.

## Install / Usage

### Local HAR

```json5
{
  "dependencies": {
    "myascf_runtime": "file:../myascf_runtime"
  }
}
```

在根 `build-profile.json5` 注册模块，然后从 `myascf_runtime` 导入 `MyASCFRuntime`。

### H5 SDK

```bash
npm --prefix h5_sdk install
npm run h5:sync
```

H5 页面通过 `<script src="./js/myascf.js"></script>` 加载 SDK，并调用 `window.myascf.send(...)`。

## Validation

- H5 SDK tests: `<填写结果>`
- HAP build: `<填写结果>`
- Device / emulator: `<填写环境与结果>`

## Known Limitations

- H5 SDK 尚未发布到 npm。
- HAR 当前仅提供本地依赖方式。
- Clipboard 权限和部分公开 API 的 SDK 警告仍需结合目标设备验证。
- 当前项目不宣称完整小程序规范或生产发布保障。

## Notes

This is a personal open-source learning and engineering practice project based on public HarmonyOS, ArkTS and ArkWeb capabilities.
