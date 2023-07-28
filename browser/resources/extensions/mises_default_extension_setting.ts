import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';

import {I18nMixin, I18nMixinInterface} from 'chrome://resources/cr_elements/i18n_mixin.js'

import {PolymerElement} from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';

import {getTemplate} from './mises_default_extension_setting.html.js';

const ExtensionsMisesDefaultExtensionSettingElementBase =
  I18nMixin(PolymerElement) as {
    new(): PolymerElement & I18nMixinInterface
  }

interface walletItem {
  extension_id: string,
  title: string,
  logo: string,
  active?: boolean,
  key_property: string,
  id: string,
  iconUrl: string,
  name: string,
  platform: networkType[]
}

type networkType = 'EVM' | 'Cosmos' | 'Aptos' | 'Solana'

interface misesDefaultExtensionSettingDelegate {
  setDefaultEVMWallet: (id: string, keyProperty: string) => void,
  getDefaultEVMWallet: () => Promise<string>,
  getItemStateChangedTarget: () => ({
    addListener: any,
  })
}
const metamask_extension_id = 'nkbihfbeogaeaoehlefnkodbefgpgknn'
const hour = 60 * 60 * 1000;

// const hour = 10000;

const maxRetryCount =  3;
const retryInterval = 1000
let retryCount = 0;
export class ExtensionsMisesDefaultExtensionSettingElement extends ExtensionsMisesDefaultExtensionSettingElementBase {
  constructor() {
    super();
    this.fetchWalletList_()
  }

  static get is() {
    return 'mises-default-extension-setting';
  }

  static get template() {
    return getTemplate();
  }
  
  static get properties() {
    return {
      extensions: {
        type: String,
        observer: 'initSettingData'
      },
      defaultEVMWallet: {
        type: String
      },
      settingDialogVisable: Boolean,
      settingDialogTipsVisable: Boolean,
      showChangeWalletTips: Boolean,
      delegate: Object,
      walletList: {
        type: Object,
        value() {
          return {
            EVM: [{
              logo: '',
              title: 'Metamask',
              extension_id: metamask_extension_id,
              key_property: '',
            }]
          };
        },
      },
      EVMConfig_: {
        type: Object,
        value() {
          return {
            name: 'EVM',
            wallet: {
              logo: '',
              title: '',
              extension_id: '',
            }
          };
        },
      },
      activeNetworkName: {
        type: String,
        default: 'EVM'
      },
      activeWalletList: Array,

      defaultEVMWalletItem: Object
    };
  }

  extensions: chrome.developerPrivate.ExtensionInfo[];

  delegate: misesDefaultExtensionSettingDelegate;
  
  defaultEVMWallet: string

  settingDialogVisable: boolean = false;

  settingDialogTipsVisable: boolean = false;

  showChangeWalletTips: Boolean = false;

  walletList: {
    [key in networkType] : walletItem[]
  };
  
  EVMConfig_: {
    name: string,
    wallet: {
      logo: string,
      title: string,
      extension_id: string
    }
  }

  activeNetworkName: string;

  activeWalletList: walletItem[];

  defaultEVMWalletItem: chrome.developerPrivate.ExtensionInfo | null

  private fetchWalletList_() {
    const stroage = localStorage.getItem('walletList');

    !stroage && this.fetchEVMWalletData()

    if(stroage) {
      const storageData = JSON.parse(stroage)
      // Set cache data to list 
      this.setEVMWalletListData(storageData.data.wallet_list)
      console.log('getCache', storageData.data.wallet_list)

      // when expired
      const nowTime = new Date().getTime()
      const expiredStatus = nowTime - Number(storageData.time) > hour;

      expiredStatus && this.fetchEVMWalletData()
    }
  }

  async fetchEVMWalletData(): Promise<void> {
    try {
      const res = await chrome.misesPrivate.fetchJson('https://web3.mises.site/website/wallet.json')

      if(res) {
        const data = JSON.parse(res);

        localStorage.setItem('walletList', JSON.stringify({
          data: data,
          time: new Date().getTime()
        }));

        const wallet_list: walletItem[] = data.wallet_list

        this.setEVMWalletListData(wallet_list)
      }

    } catch (error) {
      if(retryCount === maxRetryCount) {
        retryCount = 0;
        return
      }

      console.log(retryCount)

      retryCount++;

      setTimeout(()=>this.fetchEVMWalletData(), retryInterval * 2 ** retryCount); 
    }
  }

  setEVMWalletListData(wallet_list?: walletItem[]) {
    console.log('wallet_list', wallet_list)
    if(wallet_list && wallet_list.length) {
      const groupedExtensions: {
        [key in networkType] : walletItem[]
      } = {
        'EVM': [],
        'Aptos': [],
        'Cosmos': [],
        'Solana': []
      };

      wallet_list.forEach(extension => {
        if(extension.platform.includes('EVM')) groupedExtensions['EVM'].push(extension)
        if(extension.platform.includes('Aptos')) groupedExtensions['Aptos'].push(extension)
        if(extension.platform.includes('Cosmos')) groupedExtensions['Cosmos'].push(extension)
        if(extension.platform.includes('Solana')) groupedExtensions['Solana'].push(extension)
      });

      this.walletList = groupedExtensions
    }
  }

  walletList_(): walletItem[] {
    const EVMwalleList = this.walletList['EVM'] || [];
    if(this.extensions.length) {
      const extensionsDic: { [id: string]: chrome.developerPrivate.ExtensionInfo } = {};
      this.extensions.forEach((val) => {extensionsDic[val.id] = val;})
      EVMwalleList.forEach((val) => {
        val.id = val.extension_id;
        
        val.active = val.id in extensionsDic;
        if (val.active) {
          val.iconUrl = extensionsDic[val.id].iconUrl;
          val.name = extensionsDic[val.id].name;
        }
      });
      return EVMwalleList.filter(val => val.active)
    }
    return []
  }

  fetchDefaultEVMWallet() {
    return this.delegate.getDefaultEVMWallet().then(res => {
      this.defaultEVMWallet = res
    })
  }

  async openSettingDialog_() {
    if(!this.defaultEVMWallet) {
      await this.fetchDefaultEVMWallet()
    }
    
    this.activeWalletList = this.walletList_()
    console.log(this.activeWalletList, this.walletList, 'walletList')
    this.settingDialogVisable = true
  }

  closeSettingDialog_() {
    this.settingDialogVisable = false
  }

  toggleSettingTipsDialog_() {
    this.settingDialogTipsVisable = !this.settingDialogTipsVisable
  }
  setDefaultEVMWallet(event: any) {
    const id = event.model.item.id;
    const key_property = event.model.item.key_property;
    if(id) {
      this.delegate.setDefaultEVMWallet(id, key_property)
      this.closeSettingDialog_()
      this.defaultEVMWallet = id;
      this.setDefaultEVMWalletItem()
      const params = {
        key1: 'id',
        value1: id
      }
      // const browser = chrome as any;
      chrome.misesPrivate.recordEvent(JSON.stringify({
        event_type: "setting_default_extension",
        params: params
      }))
      this.showChangeWalletTips = true;
    }
  }

  hasDefaultWallet_() {
    return !!(this.EVMConfig_ && this.EVMConfig_.wallet.extension_id)
  }

  isActive(id: string) {
    return id === this.defaultEVMWallet
  }

  initSettingData() {
    this.setDefaultEVMWalletItem()
    this.delegate.getItemStateChangedTarget().addListener(this.onItemStateChanged_.bind(this));
  }

  private onItemStateChanged_(eventData: chrome.developerPrivate.EventData) {
    const EventType = chrome.developerPrivate.EventType;
    switch (eventData.event_type) {
      case EventType.UNINSTALLED:
        if(eventData.item_id === this.defaultEVMWallet) {
          this.cleanDefaultWallet_()
        }
      break;
    }
  }

  async setDefaultEVMWalletItem() {
    await this.fetchDefaultEVMWallet()
    if(this.defaultEVMWallet) {
      const item = this.extensions.find(val => val.id === this.defaultEVMWallet)
      this.defaultEVMWalletItem = item || null

      if(!this.defaultEVMWalletItem) {
        this.defaultEVMWallet = '';
        this.delegate.setDefaultEVMWallet('', '')
      }
      return 
    }
    this.defaultEVMWalletItem = null
  }

  cleanDefaultWallet_() {
    // window.localStorage.setItem('resetStatus', '1');
    this.delegate.setDefaultEVMWallet('', '')
    this.settingDialogVisable && this.closeSettingDialog_()
    this.defaultEVMWallet = '';
    this.defaultEVMWalletItem = null
    console.log('clean wallet')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mises-default-extension-setting': ExtensionsMisesDefaultExtensionSettingElement;
  }
}

customElements.define(
  ExtensionsMisesDefaultExtensionSettingElement.is, ExtensionsMisesDefaultExtensionSettingElement);