
  declare namespace chrome {
    export namespace misesPrivate {
      export function fetchJson(jsonUrl: string): Promise<string>;
      export function recordEvent(params: string): void;
    }
  }
