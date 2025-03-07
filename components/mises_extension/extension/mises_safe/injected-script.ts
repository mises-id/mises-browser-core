// /* global chrome */
import { proxyClient } from "./post-message";
//import { image_similar } from "./image-similar";

const domainCheckStatus = {
  waitCheck: "waitCheck",
  pendingCheck: "pendingCheck",
  finshedCheck: "finshedCheck",
};

const domainSafeLevel = {
  White: "white",
  Black: "black",
  Fuzzy: "fuzzy",
  Normal: "normal",
};

export type verifyDomainResult = {
  domain: string;
  level: string;
  suggested_url: string;
  html_body_fuzzy_hash?: string;
  logo_phash?: string;
  title_keyword?: string;
  tag?: string;
};

const parseUrlToDomain = (param: string, type: string = "domain"): string => {
  let domain = param;

  if (domain.match(/^[a-zA-Z0-9-]+:\/\/.+$/)) {
    domain = domain.replace(/^[a-zA-Z0-9-]+:\/\//, "");
  }

  const slash = domain.indexOf("/");
  if (slash >= 0) {
    domain = domain.slice(0, slash);
  }
  const qMark = domain.indexOf("?");
  if (qMark >= 0) {
    domain = domain.slice(0, qMark);
  }
  const split = domain
    .split(".")
    .map((str) => str.trim())
    .filter((str) => str.length > 0);

  if (split.length < 2) {
    return "";
  }
  const i = split[split.length - 1].indexOf(":");
  if (i >= 0) {
    split[split.length - 1] = split[split.length - 1].slice(0, i);
  }
  if (type === "topdomain") {
    return split[split.length - 2] + "." + split[split.length - 1];
  }
  return split.join(".");
};

export class InjectedScripts {
  container: HTMLElement | null;
  domainInfo: {
    domainSafeLevel: string;
    hostname: string;
    type: string;
    suggested_url: string;
    checkStatus: string;
    isFuzzyCheck: boolean;
    html_body_fuzzy_hash: string;
    logo_phash: string;
    title_keyword: string;
  };
  config: {
    maxRetryNum: number;
    retryCount: number;
  };
  blackNotifyingMap: Map<string, string> = new Map();
  isRecordVisitDomain: boolean = false;
  constructor() {
    this.container = null;
    this.config = {
      maxRetryNum: 5,
      retryCount: 0,
    };
    this.domainInfo = {
      domainSafeLevel: "",
      hostname:
        window.location.ancestorOrigins.length > 0
          ? parseUrlToDomain(window.location.ancestorOrigins[0])
          : window.location.hostname,
      type: domainSafeLevel.Normal,
      suggested_url: "",
      checkStatus: domainCheckStatus.waitCheck,
      isFuzzyCheck: false,
      html_body_fuzzy_hash: "",
      logo_phash: "",
      title_keyword: "",
    };
    this.init();
  }
  init() {
    if (window.location.ancestorOrigins.length > 0) {
      return;
    }
    this.initWeb3Proxy();
  }
  initWeb3Proxy() {
    console.log("initWeb3Proxy");
    // const that = this;
    // 初始化代理
    const handler = {
      apply: async (target: any, thisArg: any, argumentsList: any) => {
        try {
          const constList = [...argumentsList][0];
          console.log("Transaction Method Data :>> ", constList);
          const isNotable = this.isNotableAction(constList).result;
          const methodName =
            constList !== undefined ? constList.method : "unKonwn";
          //record visit web3site
          this.recordVisitWeb3site();
          //is should verifying domain
          if (this.isShouldVerifyDomain()) {
            this.verifyDomain(methodName);
          }
          if (isNotable) {
            let contractAddress;
            //TODO check
            if (methodName === "eth_signTypedData_v4") {
              const v4_sign_params = constList.params[1];
              const v4_sign_data = JSON.parse(v4_sign_params);
              contractAddress = v4_sign_data.domain.verifyingContract;
            } else {
              contractAddress = constList.params[0].to;
            }
            //recordUseContractLog
            this.recordUseContract(contractAddress);
            //verifyContract
            if (this.isShouldVerifyContract()) {
              this.verifyContract(contractAddress);
              return Reflect.apply(target, thisArg, argumentsList);
              //is should show contract address risking alert
            }
          }
          return Reflect.apply(target, thisArg, argumentsList);
        } catch (err) {
          console.log("handler error: ", err);
          return Reflect.apply(target, thisArg, argumentsList);
        }
      },
    };
    const handlerEnable = {
      apply: async (target: any, thisArg: any, argumentsList: any) => {
        try {
          const constList = [...argumentsList][0];
          console.log("handlerEnable Transaction Method Data :>> ", constList);
          //record visit web3site
          this.recordVisitWeb3site();
          //is should verifying domain
          if (this.isShouldVerifyDomain()) {
            this.verifyDomain("eth_requestAccounts");
          }
          return Reflect.apply(target, thisArg, argumentsList);
        } catch (err) {
          console.log("handler error: ", err);
          return Reflect.apply(target, thisArg, argumentsList);
        }
      },
    };
    const handlerSend = {
      apply: (target: any, thisArg: any, args: any[]) => {
        const [payloadOrMethod, callbackOrParams] = args;
        console.log("handlerSend args :>> ", args);
        if (typeof payloadOrMethod === "string") {
          return window.ethereum?.request({
            method: payloadOrMethod,
            params: callbackOrParams,
          });
        }
        if (!callbackOrParams) {
          return Reflect.apply(target, thisArg, args);
        }
        return window.ethereum?.sendAsync(payloadOrMethod, callbackOrParams);
      },
    };
    const proxyInterval = setInterval(() => proxyETH(), 1000);

    function proxyETH() {
      let isProxy = false;
      if (typeof window.ethereum !== "undefined") {
        const proxyRequest = new Proxy(window.ethereum.request, handler);
        const proxyEnable = new Proxy(window.ethereum.enable, handlerEnable);
        const proxySend = new Proxy(window.ethereum.send, handlerSend);
        const proxySendAsync = new Proxy(window.ethereum.sendAsync, handler);
        window.ethereum.request = proxyRequest;
        window.ethereum.send = proxySend;
        window.ethereum.sendAsync = proxySendAsync;
        window.ethereum.enable = proxyEnable;
        isProxy = true;
        console.log("Find ethereum");
      }
      if (
        typeof window.web3 !== "undefined" &&
        typeof window.web3.currentProvider !== "undefined"
      ) {
        const proxy2 = new Proxy(window.web3.currentProvider, handler);
        window.web3.currentProvider = proxy2;
        isProxy = true;
        console.log("Find web3");
      }
      clearInterval(proxyInterval);
      if (!isProxy) {
        console.log("Did not find ethereum or web3");
      }
    }
    proxyETH();
    setTimeout(() => {
      clearInterval(proxyInterval);
    }, 10000);
  }

  //isNotableAction
  isNotableAction(constList: { method: string; params: string | any[] }) {
    // 检查是否为关注的交易
    try {
      // const notableActionList = ['approve', 'setApprovalForAll', 'transfer', 'safeTransferFrom', 'safeTransferFrom1'];
      if (typeof constList.method !== "undefined") {
        if (constList.method === "eth_sendTransaction") {
          let functionName = "transfer";
          // 当 params 长度为 0 或 params[0].data 为 undefined 时
          if (constList.params.length === 0) {
            functionName = "transfer";
          } else if (constList.params[0].data === undefined) {
            functionName = "transfer";
          } else {
          }
          return { result: true, action: functionName };
        }
        if (constList.method === "eth_signTypedData_v4") {
          return { result: true, action: "sign" };
        }
      }
      return { result: false };
    } catch (error) {
      return { result: false };
    }
  }

  //isShouldVerifyContract
  isShouldVerifyContract() {
    return this.domainInfo.domainSafeLevel !== domainSafeLevel.White;
  }

  //isShouldVerifyDomain
  isShouldVerifyDomain() {
    //ignore list
    return this.domainInfo.checkStatus !== domainCheckStatus.finshedCheck;
  }
  //record use contract
  async recordUseContract(contractAddress: string) {
    proxyClient.recordUseContractEvent(
      contractAddress,
      this.domainInfo.hostname
    );
  }
  //record visit web3site
  async recordVisitWeb3site() {
    if (this.isRecordVisitDomain) {
      return;
    }
    this.isRecordVisitDomain = true;
    proxyClient.recordVisitWeb3siteEvent(this.domainInfo.hostname);
  }
  //verify contract
  async verifyContract(contractAddress: string) {
    if (this.hasBlackNotifying(contractAddress)) {
      console.log("verifyContract hasBlackNotifying: ", contractAddress);
      return;
    }
    this.addBlackNotifying(contractAddress);
    setTimeout(() => {
      this.removeBlackNotifying(contractAddress);
    }, 1000 * 60 * 1);
    const verifyContractResult: any = await proxyClient.verifyContract(
      contractAddress,
      this.domainInfo.hostname
    );
    console.log("verifyContractResult :>>", verifyContractResult);
    //if verify contract failed
    if (!verifyContractResult || !verifyContractResult.level) {
      this.removeBlackNotifying(contractAddress);
    }
  }

  hasBlackNotifying(key: string): boolean {
    return key !== "" && this.blackNotifyingMap.has(key);
  }

  removeBlackNotifying(key: string) {
    this.blackNotifyingMap.delete(key);
  }

  addBlackNotifying(key: string) {
    this.blackNotifyingMap.set(key, "1");
  }

  //verifyDomain
  async verifyDomain(methodName: string) {
    if (this.config.retryCount >= this.config.maxRetryNum) {
      console.log("verifyDomain maxRetryNum  ", this.config.maxRetryNum);
      return;
    }
    const domain = this.domainInfo.hostname;
    if (this.config.retryCount > 0 && methodName != "eth_requestAccounts") {
      console.log(
        "verifyDomain not eth_requestAccounts >> ",
        domain,
        methodName
      );
      return;
    }
    if (this.hasBlackNotifying(domain)) {
      console.log("verifyDomain hasBlackNotifying: ", domain);
      return;
    }
    this.addBlackNotifying(domain);
    setTimeout(() => {
      this.removeBlackNotifying(domain);
    }, 1000 * 5);

    this.config.retryCount++;
    console.log("verifyDomain count ", this.config.retryCount);
    const e = document.documentElement as HTMLElement;
    const checkResult: any = await proxyClient.verifyDomain(
      this.domainInfo.hostname,
      this.getSiteLogo(),
      e.innerText
    );
    console.log("checkResult :>>", checkResult);
    //parse the check result
    if (checkResult && checkResult.level) {
      this.domainInfo.domainSafeLevel = checkResult.level;
      this.domainInfo.suggested_url = checkResult.suggested_url;
      this.domainInfo.html_body_fuzzy_hash =
        checkResult.html_body_fuzzy_hash || "";
      this.domainInfo.logo_phash = checkResult.logo_phash || "";
      this.domainInfo.title_keyword = checkResult.title_keyword || "";
      //if domainSafeLevel == fuzzy to check
      if (this.domainInfo.domainSafeLevel == domainSafeLevel.Fuzzy) {
        this.doFuzzyCheck();
      }
    }
    if (!checkResult || !checkResult.level) {
      this.removeBlackNotifying(domain);
      return;
    }
  }

  //doFuzzyCheck
  async doFuzzyCheck() {
    if (this.domainInfo.isFuzzyCheck) {
      return;
    }
    this.domainInfo.isFuzzyCheck = true;
    //check title
    if (this.fuzzyCheckTitle()) {
      return this.notifyFuzzyDomain("title");
    }
    //logo
    if (this.fuzzyCheckLogo()) {
      return this.notifyFuzzyDomain("logo");
    }
    //html
    if (await this.fuzzyCheckHtml()) {
      return this.notifyFuzzyDomain("html");
    }
  }

  fuzzyCheckTitle(): boolean {
    if (this.domainInfo.title_keyword != "") {
      const origin_title_keyword: string = this.domainInfo.title_keyword.toLowerCase();
      const title = document.title.toLowerCase();
      console.log("document: ", title);
      const title_arr = title.toLowerCase().replace(",", "").split(" ");
      if (
        title_arr.find((title) => {
          return title == origin_title_keyword;
        })
      ) {
        return true;
      }
    }
    return false;
  }

  fuzzyCheckLogo(): boolean {
    const suggested_url_domain = parseUrlToDomain(
      this.domainInfo.suggested_url,
      "topdomain"
    );
    if (suggested_url_domain == "") {
      return false;
    }
    const links = document.querySelectorAll("head > link");
    for (const link of links) {
      if (!link.hasAttribute("href")) {
        continue;
      }
      const href = link.getAttribute("href") || "";
      if (
        href.indexOf("http") != -1 &&
        suggested_url_domain === parseUrlToDomain(href)
      ) {
        return true;
      }
    }
    return false;
  }

  getSiteLogo(): string {
    const links = document.getElementsByTagName("link");
    let site_logo = "";
    if (links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        if (i > 10) {
          break;
        }
        if (links[i].rel.indexOf("icon") > -1) {
          const logo = links[i].href;
          const sizes = links[i].sizes;
          if (site_logo == "") {
            site_logo = logo;
          }
          if (sizes && sizes.toString() == "32x32") {
            site_logo = logo;
            break;
          }
        }
      }
    }
    console.log("site_logo: ", site_logo);
    return site_logo;
  }

  async fuzzyCheckHtml(): Promise<boolean> {
    if (this.domainInfo.html_body_fuzzy_hash == "") {
      return false;
    }
    const body = document.body.outerHTML;
    const score = await proxyClient.calculateHtmlSimilarly(
      body,
      this.domainInfo.html_body_fuzzy_hash
    );
    console.log("score: ", score);
    if (score && typeof score == "number" && score > 60) {
      return true;
    }
    return false;
  }

  async notifyFuzzyDomain(tag: string) {
    console.log("doFuzzyCheck notifyFuzzyDomain start tag ", tag);
    const result = await proxyClient.notifyFuzzyDomain(
      this.domainInfo.hostname,
      this.domainInfo.suggested_url
    );
    console.log("doFuzzyCheck result >>: ", result);
  }
}

new InjectedScripts();
