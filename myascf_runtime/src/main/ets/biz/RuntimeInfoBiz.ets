import { ACTION_RUNTIME_GET_API_LIST } from '../api/ActionNames';
import { ApiManifestItem, ApiParamMeta, BUILTIN_API_MANIFEST } from '../api/ApiManifest';
import { ApiSummary, BridgeRequest, BridgeResponse, BridgeResponseData } from '../api/BridgeTypes';
import { BridgeErrorCode } from '../error/BridgeErrorCode';

export class RuntimeInfoBiz {
  async getApiList(request: BridgeRequest): Promise<BridgeResponse> {
    const apis: ApiSummary[] = [];

    for (let index: number = 0; index < BUILTIN_API_MANIFEST.length; index += 1) {
      const item: ApiManifestItem = BUILTIN_API_MANIFEST[index];
      const summary: ApiSummary = {
        action: item.action,
        category: item.category,
        title: item.title,
        description: item.description,
        implemented: item.implemented,
        paramsText: this.formatParams(item.params)
      };
      apis.push(summary);
    }

    const data: BridgeResponseData = {
      echoAction: ACTION_RUNTIME_GET_API_LIST,
      apis: apis
    };
    const response: BridgeResponse = {
      requestId: request.requestId,
      code: BridgeErrorCode.SUCCESS,
      message: 'get api list success',
      data: data
    };
    return response;
  }

  private formatParams(params: ApiParamMeta[]): string {
    if (params.length === 0) {
      return '-';
    }

    const parts: string[] = [];
    for (let index: number = 0; index < params.length; index += 1) {
      const param: ApiParamMeta = params[index];
      const optionalMark: string = param.required ? '' : '?';
      parts.push(`${param.name}${optionalMark}: ${param.type}`);
    }
    return parts.join(', ');
  }
}
