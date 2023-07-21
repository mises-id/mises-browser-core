import 'chrome://resources/cr_elements/cr_shared_style.css.js';

import {I18nMixin, I18nMixinInterface} from 'chrome://resources/cr_elements/i18n_mixin.js'

import {PolymerElement} from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';

import {getTemplate} from './mises_open_web_store_footer.html.js';



const ExtensionsMisesOpenWebStoreFooterElementBase =
  I18nMixin(PolymerElement) as {
    new(): PolymerElement & I18nMixinInterface
  }

export class ExtensionsMisesOpenWebStoreFooterElement extends ExtensionsMisesOpenWebStoreFooterElementBase {
  static get is() {
    return 'mises-open-web-store-footer';
  }

  static get template() {
    return getTemplate();
  }

  static get properties() {
    return {
    };
  }


}

declare global {
  interface HTMLElementTagNameMap {
    'mises-open-web-store-footer': ExtensionsMisesOpenWebStoreFooterElement;
  }
}

customElements.define(
  ExtensionsMisesOpenWebStoreFooterElement.is, ExtensionsMisesOpenWebStoreFooterElement);