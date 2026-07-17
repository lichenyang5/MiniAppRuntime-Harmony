<!-- AUTO-GENERATED: DO NOT EDIT DIRECTLY -->

| Category | Action | Params | Response | Status |
| --- | --- | --- | --- | --- |
| runtime | `runtime.getApiList` | - | `apis: ApiSummary[]` | ✅ |
| ui | `ui.showToast` | `message: string` | `echoAction: string` | ✅ |
| system | `system.clipboard.writeText` | `text: string` | `echoAction: string` | ✅ |
| system | `system.clipboard.readText` | - | `echoAction: string, text: string` | ✅ |
| system | `system.storage.setItem` | `key: string, value: string` | `echoAction: string, key: string, value: string` | ✅ |
| system | `system.storage.getItem` | `key: string` | `echoAction: string, key: string, value: string` | ✅ |
| system | `system.storage.removeItem` | `key: string` | `echoAction: string, key: string` | ✅ |
| system | `system.storage.clear` | - | `echoAction: string` | ✅ |
| network | `network.request` | `url: string, method?: NetworkMethod, headers?: NetworkHeaders, body?: string, timeout?: number, responseType?: NetworkResponseType` | `statusCode: number, headers: NetworkHeaders, body: NetworkBody, duration: number` | ✅ |
