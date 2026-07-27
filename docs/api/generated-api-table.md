<!-- AUTO-GENERATED: DO NOT EDIT DIRECTLY -->

| Category | Action | Params | Response | Status |
| --- | --- | --- | --- | --- |
| runtime | `runtime.getApiList` | - | `apis: ApiSummary[]` | Implemented |
| ui | `ui.showToast` | `message: string` | `echoAction: string` | Implemented |
| system | `system.clipboard.writeText` | `text: string` | `echoAction: string` | Implemented |
| system | `system.clipboard.readText` | - | `echoAction: string, text: string` | Implemented |
| system | `system.storage.setItem` | `key: string, value: string` | `echoAction: string, key: string, value: string` | Implemented |
| system | `system.storage.getItem` | `key: string` | `echoAction: string, key: string, value: string` | Implemented |
| system | `system.storage.removeItem` | `key: string` | `echoAction: string, key: string` | Implemented |
| system | `system.storage.clear` | - | `echoAction: string` | Implemented |
| network | `network.request` | `url: string, method?: NetworkMethod, headers?: NetworkHeaders, body?: string, timeout?: number, responseType?: NetworkResponseType` | `ok: boolean, statusCode: number, statusText?: string, headers: NetworkHeaders, body: NetworkBody, duration: number` | Implemented |
