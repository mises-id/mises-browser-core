// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import 'chrome://resources/cr_elements/cr_input/cr_input.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';

import '/strings.m.js';

import type {CrDialogElement} from 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import type {CrInputElement} from 'chrome://resources/cr_elements/cr_input/cr_input.js';
import {PolymerElement} from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';



import {getTemplate} from './mises_import_dialog.html.js';


export interface ImportDialogDelegate {

  /** Packs the extension into a .crx. */
  importExtension(json: string, progress: ((warning: chrome.developerPrivate.InstallWarning) => void)):
      Promise<chrome.developerPrivate.InstallWarning>;
}

class DummyImportDialogDelegate implements ImportDialogDelegate {

  async importExtension(json: string, progress: ((warning: chrome.developerPrivate.InstallWarning) => void)): Promise<chrome.developerPrivate.InstallWarning>  {
    try {
      const parsedData = JSON.parse(json)
      progress( {
        message: 'installing now'
      })
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      for await (const extension of parsedData) {
        if (extension.location == 'INTERNAL' && extension.type === 'TYPE_EXTENSION' && extension.id) {
          progress( {
            message: 'installing ' + extension.name + ' ...'
          })
          const res = await chrome.misesPrivate.installExtensionById(extension.id);
          progress( {
            message: extension.name + ' ' + (res == '' ? 'installed' : 'install failed: ' + res)
          })
          await delay(2000);
        }
      };
      return Promise.resolve({
        message: 'import done '
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error:' + error
      });
    }

  }
}

export interface ExtensionsImportDialogElement {
  $: {
    dialog: CrDialogElement,
    json: CrInputElement,
    link: CrInputElement,
  };
}


export class ExtensionsImportDialogElement extends PolymerElement {
  static get is() {
    return 'extensions-import-dialog';
  }

  static get template() {
    return getTemplate();
  }

  static get properties() {
    return {
      delegate: Object,
      importing_: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,  
      },
      json_: {
        type: String,
        value: '',  // Initialized to trigger binding when attached.
      },
      lastResponse_: Object,
    };
  }

  delegate: ImportDialogDelegate = new DummyImportDialogDelegate();
  protected json_: string = '';
  protected importing_: boolean = false;
  protected lastResponse_: chrome.developerPrivate.InstallWarning|null =
      null;

  override async connectedCallback() {
    super.connectedCallback();
    this.importing_ = false;
    this.$.dialog.showModal();
  }
  protected onJsonChanged_(e: CustomEvent<{value: string}>) {
    this.json_ = e.detail.value;
  }

  protected copyLink_() {
    navigator.clipboard.writeText(this.$.link.value).catch(() => {});
    this.lastResponse_ = {
      message: "link copied, please open in in kiwi or other browser"
    }
  }

  protected onCancelClick_() {
    this.$.dialog.cancel();
  }

  protected shouldDisableImport_(importing: boolean, json: string) {
    return importing  || !json
  }
  protected onConfirmClick_() {
    this.importing_ = true;
    this.delegate.importExtension(this.json_, this.onPackResponse_.bind(this))
        .then(response =>  {
        this.importing_ = false;
        this.onPackResponse_(response)
     });
    
  }

  /**
   * @param response The response from request to pack an extension.
   */
  private onPackResponse_(response:
                              chrome.developerPrivate.InstallWarning) {
    this.lastResponse_ = response;
  }

}


declare global {
  interface HTMLElementTagNameMap {
    'extensions-import-dialog': ExtensionsImportDialogElement;
  }
}

customElements.define(
  ExtensionsImportDialogElement.is, ExtensionsImportDialogElement);
  