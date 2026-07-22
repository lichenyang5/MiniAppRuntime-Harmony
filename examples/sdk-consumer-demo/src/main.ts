import {
  createTypedApi,
  initMyASCF,
  type BridgeResponse
} from '@lichenyang5/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);
const toastButton: HTMLButtonElement | null = document.querySelector('#toastButton');
const storageButton: HTMLButtonElement | null = document.querySelector('#storageButton');
const statusElement: HTMLElement | null = document.querySelector('#status');
const resultElement: HTMLElement | null = document.querySelector('#result');

function renderResult(status: string, value: unknown): void {
  if (statusElement) {
    statusElement.textContent = status;
  }
  if (resultElement) {
    resultElement.textContent = JSON.stringify(value, null, 2);
  }
}

toastButton?.addEventListener('click', async (): Promise<void> => {
  try {
    const response: BridgeResponse = await api.ui.showToast(
      { message: 'hello from esm consumer demo' },
      { timeout: 3000 }
    );
    renderResult('Promise resolved', response);
  } catch (error: unknown) {
    renderResult('Promise rejected (expected in a normal browser)', error);
  }
});

storageButton?.addEventListener('click', async (): Promise<void> => {
  try {
    await api.system.storage.setItem({
      key: 'username',
      value: 'lichenyang'
    });
    const response = await api.system.storage.getItem({ key: 'username' });
    renderResult('Storage resolved', response.data?.value);
  } catch (error: unknown) {
    renderResult('Promise rejected (expected in a normal browser)', error);
  }
});

function verifyGeneratedTypes(): void {
  // @ts-expect-error ui.showToast requires message.
  void api.ui.showToast({});
  // @ts-expect-error sendTyped only accepts actions from ApiManifest.
  void client.sendTyped('ui.missing', {});
  // @ts-expect-error ui.showToast requires a params argument.
  void client.sendTyped('ui.showToast');
}

void verifyGeneratedTypes;
