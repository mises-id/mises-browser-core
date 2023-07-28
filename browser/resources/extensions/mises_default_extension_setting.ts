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
      retryCount: {
        type: Number,
        default: 3
      },
      retryTime: {
        type: Number,
        default: 1000
      },
      currentRetryCount: {
        type: Number,
        default: 0
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

  retryCount: number;

  retryTime: number;

  currentRetryCount: number;

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

  private async fetchWalletList_() {
    try {
      const stroage = localStorage.getItem('walletList');
      let res = '';
      if(stroage) {
        const data = JSON.parse(stroage)
        const hour = 60 * 60 * 1000;
        // const hour = 10000;
        const nowTime = new Date().getTime()

        if(nowTime - Number(data.time) > hour) {
          // const browser = chrome as any;
          res = await chrome.misesPrivate.fetchJson('https://web3.mises.site/website/wallet.json')
        }else {
          res = JSON.stringify(data.data)
        }
      } else {
        // const browser = chrome as any;
        res = await chrome.misesPrivate.fetchJson('https://web3.mises.site/website/wallet.json')
      }

      if(res && res.indexOf("{") > -1) {
        const data = JSON.parse(res);
        const wallet_list = data.wallet_list
        if(Array.isArray(wallet_list)) {
          const groupedExtensions: {
            [key in networkType] : walletItem[]
          } = {
            'EVM': [],
            'Aptos': [],
            'Cosmos': [],
            'Solana': []
          };

          wallet_list.forEach(extension => {
            extension.platform.forEach((platform: networkType) => {
              if (!groupedExtensions[platform]) groupedExtensions[platform] = [];

              groupedExtensions[platform].push(extension);
            });
          });
          this.walletList = groupedExtensions
          
          localStorage.setItem('walletList', JSON.stringify({
            data: data,
            time: new Date().getTime()
          }));
        }
      } else {
      }
    } catch (error) {
      if(this.currentRetryCount === this.retryCount) {
        return 
      }
      this.currentRetryCount++;
      setTimeout(()=>this.fetchWalletList_(), this.currentRetryCount * this.retryTime);
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