import { common } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';

const STORAGE_NAME: string = 'myascf_storage';

export class StorageImp {
  private context: common.Context;

  constructor(context: common.Context) {
    this.context = context;
  }

  async setItem(key: string, value: string): Promise<void> {
    const store: preferences.Preferences = await preferences.getPreferences(this.context, STORAGE_NAME);
    await store.put(key, value);
    await store.flush();
  }

  async getItem(key: string): Promise<string> {
    const store: preferences.Preferences = await preferences.getPreferences(this.context, STORAGE_NAME);
    const value: preferences.ValueType = await store.get(key, '');
    return typeof value === 'string' ? value : '';
  }

  async removeItem(key: string): Promise<void> {
    const store: preferences.Preferences = await preferences.getPreferences(this.context, STORAGE_NAME);
    await store.delete(key);
    await store.flush();
  }

  async clear(): Promise<void> {
    const store: preferences.Preferences = await preferences.getPreferences(this.context, STORAGE_NAME);
    await store.clear();
    await store.flush();
  }
}
