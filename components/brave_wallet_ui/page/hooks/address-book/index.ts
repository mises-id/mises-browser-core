import { DeepReadonly } from "utility-types";
import { useState } from "react";
import { HasMapStore, KVStore, toGenerator } from "../../common";
import { AppCurrency } from "../../common/types";
export interface ChainInfo {
  chainName: string;
}

export interface ChainGetter {
  // Return the chain info matched with chain id.
  // Expect that this method will return the chain info reactively,
  // so it is possible to detect the chain info changed without any additional effort.
  getChain(chainId: string): ChainInfo & {
    raw: ChainInfo;
    addUnknownCurrencies(...coinMinimalDenoms: string[]): void;
    findCurrency(coinMinimalDenom: string): AppCurrency | undefined;
    forceFindCurrency(coinMinimalDenom: string): AppCurrency;
  };

  hasChain(chainId: string): boolean;
}

export type CoinPrimitive = {
  denom: string;
  amount: string;
};

export interface AddressBookSelectHandler {
  setRecipient(recipient: string): void;
  setMemo(memo: string): void;
}

export interface AddressBookData {
  name: string;
  address: string;
  memo: string;
}

export class AddressBookConfig {
  protected _addressBookDatas: AddressBookData[] = [];
  protected _isLoaded: boolean = false;

  protected _selectHandler?: AddressBookSelectHandler;

  constructor(
    protected readonly kvStore: KVStore,
    protected readonly chainGetter: ChainGetter,
    protected readonly chainId: string
  ) {
    // makeObservable(this);

    this.loadAddressBookDatas();
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  get addressBookDatas(): DeepReadonly<AddressBookData[]> {
    return this._addressBookDatas;
  }

  setSelectHandler(handler: AddressBookSelectHandler) {
    this._selectHandler = handler;
  }

  selectAddressAt(index: number) {
    const data = this.addressBookDatas[index];

    if (this._selectHandler) {
      this._selectHandler.setRecipient(data.address);
      this._selectHandler.setMemo(data.memo);
    }
  }

  *addAddressBook(data: AddressBookData) {
    yield this.loadAddressBookDatas();

    this._addressBookDatas.push(data);

    yield this.saveAddressBookDatas();
  }

  *removeAddressBook(index: number) {
    yield this.loadAddressBookDatas();

    this._addressBookDatas.splice(index, 1);

    yield this.saveAddressBookDatas();
  }

  *editAddressBookAt(index: number, data: AddressBookData) {
    yield this.loadAddressBookDatas();

    this._addressBookDatas[index] = data;

    yield this.saveAddressBookDatas();
  }

  async saveAddressBookDatas() {
    const chainInfo = this.chainGetter.getChain(this.chainId);

    await this.kvStore.set(
      AddressBookConfig.keyForChainInfo(chainInfo),
      this._addressBookDatas
    );
  }

  *loadAddressBookDatas() {
    const chainInfo = this.chainGetter.getChain(this.chainId);

    const datas = yield* toGenerator(
      this.kvStore.get<AddressBookData[]>(
        AddressBookConfig.keyForChainInfo(chainInfo)
      )
    );
    if (!datas) {
      this._addressBookDatas = [];
    } else {
      this._addressBookDatas = datas;
    }

    this._isLoaded = true;
  }

  async waitLoaded(): Promise<void> {
    if (this._isLoaded) {
      return;
    }

    return new Promise<void>((resolve) => {
      // const disposer = autorun(() => {
      //   if (this._isLoaded) {
      //     resolve();
      //     if (disposer) {
      //       disposer();
      //     }
      //   }
      // });
      resolve();
    });
  }

  static keyForChainInfo(chainInfo: ChainInfo): string {
    return `${chainInfo.chainName}`;
  }
}

export class AddressBookConfigMap extends HasMapStore<AddressBookConfig> {
  constructor(
    protected readonly kvStore: KVStore,
    protected readonly chainGetter: ChainGetter
  ) {
    super((chainId: string) => {
      return new AddressBookConfig(kvStore, chainGetter, chainId);
    });
  }

  getAddressBookConfig(chainId: string) {
    return this.get(chainId);
  }
}

export const useAddressBookConfig = (
  kvStore: KVStore,
  chainGetter: ChainGetter,
  chainId: string,
  handler: AddressBookSelectHandler
) => {
  const [configMap] = useState(
    () => new AddressBookConfigMap(kvStore, chainGetter)
  );

  const config = configMap.getAddressBookConfig(chainId);
  config.setSelectHandler(handler);

  return config;
};
