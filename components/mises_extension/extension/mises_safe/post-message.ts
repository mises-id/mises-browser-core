class ProxyClient {
  eventListener: {
    addMessageListener: (fn: any) => void;
    removeMessageListener: (fn: any) => void;
    postMessage: (message: any) => void;
  };
  parseMessage: any;

  constructor() {
    this.eventListener = {
      addMessageListener: (fn) => window.addEventListener("message", fn),
      removeMessageListener: (fn) => window.removeEventListener("message", fn),
      postMessage: (message) =>
        window.postMessage(message, window.location.origin),
    };
  }
  requestMethod(
    method: string,
    params: {
      domain?: any;
      contractAddress?: any;
      suggested_url?: any;
      logo?: string;
      html?: string;
      hash?: string;
      content?: string;
    }
  ) {
    const bytes = new Uint8Array(8);
    const id = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");

    const proxyMessage = {
      type: "mises-proxy-request",
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve("receive response timeout");
      }, 5000);
      const receiveResponse = (e: { data: any }) => {
        const proxyResponse = this.parseMessage
          ? this.parseMessage(e.data)
          : e.data;
        if (
          !proxyResponse ||
          proxyResponse.type !== "mises-safe-proxy-request-response"
        ) {
          return;
        }

        if (proxyResponse.id !== id) {
          return;
        }
        this.eventListener.removeMessageListener(receiveResponse);
        const result = proxyResponse.result;

        if (!result) {
          reject(new Error("Result is null"));
          return;
        }
        if (result.error) {
          reject(new Error(result.error));
          return;
        }
        clearTimeout(timer);
        resolve(result.return);
      };

      this.eventListener.addMessageListener(receiveResponse);

      this.eventListener.postMessage(proxyMessage);
    });
  }
  async verifyDomain(domain: string, logo: string, content: string) {
    return await this.requestMethod("verifyDomain", { domain, logo, content });
  }

  async verifyContract(contractAddress: string, domain: string) {
    return await this.requestMethod("verifyContract", {
      contractAddress,
      domain,
    });
  }

  async notifyFuzzyDomain(domain: string, suggested_url: string) {
    return await this.requestMethod("notifyFuzzyDomain", {
      domain,
      suggested_url,
    });
  }
  async calculateHtmlSimilarly(html: string, hash: string) {
    return await this.requestMethod("calculateHtmlSimilarly", {
      html,
      hash,
    });
  }

  async recordVisitWeb3siteEvent(domain: string) {
    return await this.requestMethod("recordVisitWeb3siteEvent", { domain });
  }

  async recordUseContractEvent(contractAddress: string, domain: string) {
    return await this.requestMethod("recordUseContractEvent", {
      contractAddress,
      domain,
    });
  }

  consoleLog(log: any) {
    return this.requestMethod("consoleLog", log);
  }

  //CurrentPage
  listenCurrentPage(method: string) {
    return new Promise((resolve, reject) => {
      const receiveResponse = (e: { data: any }) => {
        const proxyResponse = e.data;
        if (
          !proxyResponse ||
          proxyResponse.type !== "mises-proxy-listen-current-page"
        ) {
          return;
        }
        if (proxyResponse.method !== method) {
          return;
        }
        this.eventListener.removeMessageListener(receiveResponse);
        const result = proxyResponse.data;
        if (!result) {
          reject(new Error("Result is null"));
          return;
        }
        resolve(result);
      };
      this.eventListener.addMessageListener(receiveResponse);
    });
  }
  postUserDecision(decision: any) {
    const bytes = new Uint8Array(8);
    const id = Array.from(crypto.getRandomValues(bytes))
      .map((value) => {
        return value.toString(16);
      })
      .join("");
    const proxyMessage = {
      type: "mises-proxy-listen-current-page",
      id,
      method: "userDecision",
      data: { value: decision },
    };
    this.eventListener.postMessage(proxyMessage);
  }
  async listenUserDecision() {
    return await this.listenCurrentPage("userDecision");
  }
}

const proxyClient = new ProxyClient();

export { proxyClient };
