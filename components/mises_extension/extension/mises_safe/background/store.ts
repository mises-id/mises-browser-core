
export interface KVStore {
  get<T = unknown>(key: string): Promise<T | undefined>;
  set<T = unknown>(key: string, data: T | null): Promise<void>;
  prefix(): string;
}

export interface KVStoreProvider {
  get(): Promise<{ [key: string]: any }>;
  set(items: { [key: string]: any }): Promise<void>;
}



export class BaseKVStore implements KVStore {
  constructor(
    private readonly provider: KVStoreProvider,
    private readonly _prefix: string
  ) {}

  async get<T = unknown>(key: string): Promise<T | undefined> {
    const k = this.prefix() + "/" + key;

    const data = await this.provider.get();
    return data[k];
  }

  set<T = unknown>(key: string, data: T | null): Promise<void> {
    const k = this.prefix() + "/" + key;

    return this.provider.set({ [k]: data });
  }

  prefix(): string {
    return this._prefix;
  }
}


export class ExtensionKVStore extends BaseKVStore {
  protected static KVStoreProvider: KVStoreProvider | undefined;

  constructor(prefix: string) {
    if (!ExtensionKVStore.KVStoreProvider) {
      if (typeof chrome === "undefined") {
        console.log(
          "You should use ExtensionKVStore on the extension environment."
        );
      } else if (!chrome.storage || !chrome.storage.local) {
        console.log(
          "The 'browser' exists, but it doesn't seem to be an extension environment. This can happen in Safari browser."
        );
      } else {
        ExtensionKVStore.KVStoreProvider = chrome.storage.local;
      }
    }

    if (!ExtensionKVStore.KVStoreProvider) {
      throw new Error("Can't initialize kv store for browser extension");
    }

    super(ExtensionKVStore.KVStoreProvider, prefix);
  }
}

