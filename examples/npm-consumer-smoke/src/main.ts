import {
  ERROR_CODE_NATIVE_UNAVAILABLE,
  createTypedApi,
  initMyASCF
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

export async function verifyNormalBrowserBoundary(): Promise<boolean> {
  try {
    await api.ui.showToast({ message: 'npm consumer smoke' });
    return false;
  } catch (error: unknown) {
    return typeof error === 'object' && error !== null &&
      'code' in error && error.code === ERROR_CODE_NATIVE_UNAVAILABLE;
  }
}
