
declare namespace chrome {
  export namespace misesPrivate {
    export function fetchJson(jsonUrl: string): Promise<string>;
    export function notifyPhishingDetected(params: string): Promise<string>;
    export function recordEvent(params: string): void;
    export function setDefaultEVMWallet(id: string, keyProperty: string): void;
    export function getDefaultEVMWallet(): Promise<string>;
    export function installExtensionById(id: string): Promise<string>;
  }
}
