import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';

import {I18nMixin, I18nMixinInterface} from 'chrome://resources/cr_elements/i18n_mixin.js'

import {PolymerElement} from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';

import {getTemplate} from './mises_default_extension_setting.html.js'
;
import {getToastManager} from 'chrome://resources/cr_elements/cr_toast/cr_toast_manager.js';


const ExtensionsMisesDefaultExtensionSettingElementBase =
  I18nMixin(PolymerElement) as {
    new(): PolymerElement & I18nMixinInterface
  }

interface walletItem {
  extension_id: string,
  title: string,
  logo: string,
  active?: boolean
}

type networkType = 'EVM' | 'Cosmos' | 'Aptos' | 'Solana'

interface misesDefaultExtensionSettingDelegate {
  setProfileDefaultEVMWallet: (id: string) => void
}

export class ExtensionsMisesDefaultExtensionSettingElement extends ExtensionsMisesDefaultExtensionSettingElementBase {
  constructor() {
    super();
    this.fetchWalletList_()
    console.log(this.extensions, this.EVMConfig_, this.defaultEVMWallet)
  }
  static get is() {
    return 'mises-default-extension-setting';
  }

  static get template() {
    return getTemplate();
  }
  
  static get properties() {
    return {
      extensions: Array,
      defaultEVMWallet: String,
      settingDialogVisable: Boolean,
      delegate: Object,
      walletList: {
        type: Object,
        value() {
          return {};
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
              extension_id: ''
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
      }
    };
  }

  extensions: chrome.developerPrivate.ExtensionInfo[];

  delegate: misesDefaultExtensionSettingDelegate;
  
  defaultEVMWallet: string

  settingDialogVisable: boolean = false;

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

  private fetchWalletList_() {
    return fetch('https://web3.mises.site/website/wallet.json')
      .then(res=>res.json())
      .then(({ wallet_list })=>{
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

          const EVMWalletList = groupedExtensions['EVM']

          if(this.defaultEVMWallet) {
            const findDefaultWallet = EVMWalletList.find(val => val.extension_id === this.defaultEVMWallet)
            if(findDefaultWallet) {
              this.EVMConfig_.wallet = findDefaultWallet
            }
          }
        }
      })
      .catch(_ => {
        if(this.currentRetryCount === this.retryCount) {
          return 
        }
        
        this.currentRetryCount++;
        console.log(this.currentRetryCount, 'this.currentRetryCount')
        setTimeout(()=>this.fetchWalletList_(), this.currentRetryCount * this.retryTime);
      })
  }

  walletActiveList_(): walletItem[] {
    if(this.activeNetworkName) {
      const walleItemtList = this.walletList['EVM'] || [];
      console.log(this.extensions)
      return walleItemtList.map((val: walletItem) => {
        val.active = val.extension_id === this.defaultEVMWallet
        return val
      })
    }
    return []
  }

  openSettingDialog_() {
    this.settingDialogVisable = true
  }

  closeSettingDialog_() {
    this.settingDialogVisable = false
  }
  
  setProfileDefaultEVMWallet(event: any) {
    const id = event.model.item.id;
    const toastManager = getToastManager();
    if(id) {
      console.log(this.delegate, this.delegate.setProfileDefaultEVMWallet)
      this.delegate.setProfileDefaultEVMWallet(id)
      toastManager.show('Successful!!');
      this.closeSettingDialog_()
    }
  }
  hasDefaultWallet_() {
    return !!(this.EVMConfig_ && this.EVMConfig_.wallet.extension_id)
  }

  isActive(id: string, classList: string) {
    if(id === this.defaultEVMWallet) {
      return classList+ ' active'
    }
    return classList
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mises-default-extension-setting': ExtensionsMisesDefaultExtensionSettingElement;
  }
}

customElements.define(
  ExtensionsMisesDefaultExtensionSettingElement.is, ExtensionsMisesDefaultExtensionSettingElement);