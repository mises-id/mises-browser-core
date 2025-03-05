// Copyright (c) 2019 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at https://mozilla.org/MPL/2.0/.

export {}

type RequestIdleCallbackHandle = any
type RequestIdleCallbackOptions = {
  timeout: number
}
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number)
}


interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
  on(event: string, listener: (...args: any[]) => void): void;
  removeListener(event: string, listener: (...args: any[]) => void): void;
  enable(): Promise<string[]>;
  selectedAddress: string | null;
  networkVersion: string | null;
  chainId: string | null;
  isConnected(): boolean;
  // Add legacy methods
  sendAsync(payload: { method: string; params?: any[] }, callback: (error: Error | null, result?: any) => void): void;
  send(payload: { method: string; params?: any[] }, callback?: (error: Error | null, result?: any) => void): void;
}

interface Web3Provider {
  currentProvider: any;
  eth: {
    accounts: string[];
    defaultAccount: string | null;
    defaultBlock: string | number;
    getAccounts(): Promise<string[]>;
    getBalance(address: string): Promise<string>;
    sendTransaction(txData: any): Promise<string>;
  };
  version: string;
}


declare global {
  interface Window {
    // Typescript doesn't include requestIdleCallback as it's non-standard.
    // Since it's supported in Chromium, we can include it here.
    requestIdleCallback: ((
      callback: ((deadline: RequestIdleCallbackDeadline) => void),
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle)
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void)
    alreadyInserted: boolean
    ethereum?: EthereumProvider;
    web3?: Web3Provider;
    content_cosmetic: {
      cosmeticStyleSheet: CSSStyleSheet
      allSelectorsToRules: Map<string, number>
      observingHasStarted: boolean
      hide1pContent: boolean
      generichide: boolean
      firstRunQueue: Set<string>
      secondRunQueue: Set<string>
      finalRunQueue: Set<string>
      allQueues: Set<string>[]
      numQueues: any
      alreadyUnhiddenSelectors: Set<string>
      alreadyKnownFirstPartySubtrees: WeakSet
      _hasDelayOcurred: boolean
      _startCheckingId: number | undefined
      firstSelectorsPollingDelayMs: number | undefined
      switchToSelectorsPollingThreshold : number | undefined
      fetchNewClassIdRulesThrottlingMs : number | undefined
      tryScheduleQueuePump: (() => void)
    }
  }
}
