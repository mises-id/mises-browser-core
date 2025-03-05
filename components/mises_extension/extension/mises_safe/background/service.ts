/*
 * @Author: lmk
 * @Date: 2022-11-17 15:39:01
 * @LastEditTime: 2022-11-24 11:53:02
 * @LastEditors: lmk
 * @Description: mises controller
 */
// import { MisesSafe } from "./mises";
import * as MisesNetwork from './mises-network';
import { html_similar } from "./html-similar";
import { KVStore } from "./store";

const listenMethods = {
  mVerifyDomain: "verifyDomain",
  mVerifyContract: "verifyContract",
  mNotifyFuzzyDomain: "notifyFuzzyDomain",
  mCalculateHtmlSimilarly: "calculateHtmlSimilarly",
  mRecordVisitWeb3siteEvent: "recordVisitWeb3siteEvent",
  mRecordUseContractEvent: "recordUseContractEvent",
};

const storageKey = {
  ContractTrust: "v3_contract_trust_",
  DomainRisk: "v3_domain_risk_",
};

const contractLevel = {
  Safe: "safe",
  Danger: "danger",
};
const domainLevel = {
  White: "white",
  Normal: "normal",
  Fuzzy: "fuzzy",
  Black: "black",
};

const userAction = {
  Ignore: "IGNOR",
  Block: "BLOCK",
};

const isShouldVerifyStateKey = "isShouldVerify";

// const TypeBackgroundResponse = "mises-background-response";

export type notifyPhishingDetectedParams = {
  notify_type: string;
  address?: string;
  domain?: string;
  suggested_url?: string;
  notify_tag?: string;
  notify_level?: string;
};
export type recordEventParams = {
  event_type: string;
  params: { key1: string; value1: string; key2?: string; value2?: string };
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



export class MisesSafeService {
  isShouldVerify: boolean = true;
  domainWhiteListMap: Map<string, string> = new Map();
  blackNotifyingMap: Map<string, string> = new Map();

  constructor(protected readonly kvStore: KVStore) {
    console.log("MisesSafeService init");
    this.localShouldVerify();
    this.getDomainwhiteList();
  }
  // private misesSafe!: MisesSafe;

  getDomainwhiteList() {
    MisesNetwork.misesRequest({
      url: "https://web3.mises.site/website/whitesites.json",
    }).then((res) => {
      if (res) {
        res.forEach((v: string) => {
          const domain = this.parseDomainUntilSecondLevel(v);
          if (v != "") {
            this.domainWhiteListMap.set(domain, "1");
          }
        });
      }
    });
  }

  init() {
    this.messageClient();
  }
  messageClient() {
    // this.misesSafe = new MisesSafe();
    // !this.isInitClient && this.isShouldVerify && this.initMessageClient();
  }

  localShouldVerify() {
    this.kvStore.get(isShouldVerifyStateKey).then((res) => {
      this.isShouldVerify = res ? !!res : true;
    });
  }

  setIsShouldVerifyState(state: boolean) {
    this.isShouldVerify = state;
    this.save();
  }

  parseDomainUntilSecondLevel(param: string): string {
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

    return split[split.length - 2] + "." + split[split.length - 1];
  }

  save() {
    this.kvStore.set(isShouldVerifyStateKey, this.isShouldVerify);
  }

  async initMessageClient(res: any) {
    if (!this.isShouldVerify) {
      console.log("disable Verify");
      return false;
    }
    if (typeof res.params === "undefined" && typeof res.method === "undefined") {
      return;
    }
    switch (res.method) {
      case listenMethods.mVerifyDomain:
        return this.verifyDomain(
          res.params.domain,
          res.params.logo,
          res.params.content
        );
      case listenMethods.mNotifyFuzzyDomain:
        return this.notifyFuzzyDomain(
          res.params.domain,
          res.params.suggested_url
        );
      case listenMethods.mVerifyContract:
        return this.verifyContract(
          res.params.contractAddress,
          res.params.domain
        );
      case listenMethods.mCalculateHtmlSimilarly:
        return this.calculateHtmlSimilarly(
          res.params.html,
          res.params.hash
        );
      case listenMethods.mRecordVisitWeb3siteEvent:
        return this.recordVisitWeb3siteEvent(res.params.domain);
      case listenMethods.mRecordUseContractEvent:
        return this.recordUseContractEvent(
          res.params.contractAddress,
          res.params.domain
        );
    }
  }

  /* CalculateHtmlSimilarly start */

  async calculateHtmlSimilarly(html: string, hash: string): Promise<number> {
    const request_url_html_body_hash = html_similar.digest(html);
    const score = html_similar.distance(hash, request_url_html_body_hash);
    console.log("request_url_html_body_hash: ", request_url_html_body_hash);
    console.log("html_body_fuzzy_hash: ", hash);
    console.log("html body fuzzy html score: ", score);
    return score;
  }

  /* VerifyDomain start */

  async verifyDomain(
    domain: string,
    logo: string,
    content: string
  ): Promise<verifyDomainResult> {
    //is ignore
    const isIgnore = await this.isIgnoreDomain(domain);
    console.log("verifyDomain ignore <<:", isIgnore);
    if (isIgnore) {
      return {
        domain: domain,
        suggested_url: domain,
        level: domainLevel.White,
        tag: "ignore",
      };
    }
    //in whitelist domain
    if (this.isDomainWhitelisted(domain)) {
      return {
        domain: domain,
        suggested_url: domain,
        level: domainLevel.White,
        tag: "white",
      };
    }
    const verifyDomainResult = await this.apiVerifyDomain(
      domain,
      logo,
      content
    );
    console.log("verifyDomainResult: ", verifyDomainResult);
    //is should alert user
    if (
      !this.hasBlackNotifying(domain) &&
      verifyDomainResult &&
      verifyDomainResult.level === domainLevel.Black
    ) {
      console.log("verifyDomain notifyPhishingDetected start: ", domain);
      this.addBlackNotifying(domain);
      setTimeout(() => {
        this.removeBlackNotifying(domain);
      }, 3000);
      const userDecision = await this.notifyPhishingDetected<{
        notify_type: string;
        domain: string;
        suggested_url: string;
        notify_tag: string;
        notify_level: string;
      }>({
        notify_type: "url",
        domain: domain,
        suggested_url: verifyDomainResult.suggested_url || "",
        notify_tag: "fuzzy",
        notify_level: "danger",
      });
      console.log("verifyDomain notifyPhishingDetected result: ", userDecision);
      if (userDecision === userAction.Ignore) {
        console.log("verifyDomain notifyPhishingDetected set: ", userDecision);
        this.setIgnorDomain(domain);
      }
    }
    return verifyDomainResult;
  }

  hasBlackNotifying(domain: string): boolean {
    return domain !== "" && this.blackNotifyingMap.has(domain);
  }

  removeBlackNotifying(domain: string) {
    this.blackNotifyingMap.delete(domain);
  }

  addBlackNotifying(domain: string) {
    this.blackNotifyingMap.set(domain, "1");
  }

  async notifyFuzzyDomain(domain: string, suggested_url: string) {
    console.log(
      "verifyDomain notifyPhishingDetected start: ",
      domain,
      suggested_url
    );
    const userDecision = await this.notifyPhishingDetected({
      notify_type: "url",
      notify_tag: "fuzzy",
      domain: domain,
      notify_level: "warning",
      suggested_url: suggested_url,
    });
    console.log("fuzzyDomain notifyPhishingDetected result: ", userDecision);
    if (userDecision === userAction.Ignore) {
      console.log("fuzzyDomain notifyPhishingDetected set: ", userDecision);
      this.setIgnorDomain(domain);
    }
  }
  async apiVerifyDomain(domain: string, logo: string, content: string) {
    const result = await this.kvStore.get(domain);
    if (result) {
      return result;
    }
    const res = await MisesNetwork.misesRequest({
      method: "POST",
      url: "/phishing_site/check",
      data: {
        domain: domain,
        logo: logo,
        content: content,
      },
    });
    if (
      res &&
      res.level !== domainLevel.Black &&
      res.level !== domainLevel.Fuzzy
    ) {
      this.kvStore.set(domain, res);
    }
    return res;
  }

  setIgnorDomain(domain: string) {
    this.kvStore.set(this.getDomainCacheKey(domain), "1");
  }

  async isIgnoreDomain(domain: string) {
    return await this.kvStore.get(this.getDomainCacheKey(domain));
  }

  getDomainCacheKey(domain: string) {
    return storageKey.DomainRisk + domain.replace(".", "-");
  }

  isDomainWhitelisted(domain: string) {
    domain = this.parseDomainUntilSecondLevel(domain);
    return domain !== "" && this.domainWhiteListMap.has(domain);
  }
  /* VerifyDomain end */

  /* verifyContract start */

  async verifyContract(contractAddress: string, domain: string) {
    //is ignore
    const isIgnore = await this.isIgnoreDomain(domain);
    console.log("verifyContract ignore <<:", isIgnore);
    if (isIgnore) {
      const verifyContractResult = {
        address: contractAddress,
        trust_percentage: 100,
        level: contractLevel.Safe,
        tag: "ignore",
      };
      return verifyContractResult;
    }
    //in whitelist domain
    if (this.isDomainWhitelisted(domain)) {
      const safeVerifyContractResult = {
        address: contractAddress,
        trust_percentage: 100,
        level: contractLevel.Safe,
        tag: "white",
      };
      return safeVerifyContractResult;
    }
    const verifyContractResult = await this.apiVerifyContract(
      contractAddress,
      domain
    );
    console.log("verifyContractResult: ", verifyContractResult);
    //is should alert user
    if (
      !this.hasBlackNotifying(contractAddress) &&
      verifyContractResult &&
      verifyContractResult.level === contractLevel.Danger
    ) {
      this.addBlackNotifying(contractAddress);
      setTimeout(() => {
        this.removeBlackNotifying(contractAddress);
      }, 25000);
      console.log("notifyPhishingDetected start: ", contractAddress);
      const userDecision = await this.notifyPhishingDetected({
        address: contractAddress,
        notify_type: "address",
      });
      console.log("notifyPhishingDetected result: ", userDecision);
      if (userDecision === userAction.Ignore) {
        console.log("notifyPhishingDetected set: ", userDecision);
        this.setIgnorDomain(domain);
      }
    }
    return verifyContractResult;
  }

  async apiVerifyContract(contractAddress: string, domain: string) {
    //cache
    const result = await this.kvStore.get(contractAddress);
    if (result) {
      return result;
    }
    const res = await MisesNetwork.misesRequest({
      url: "/web3safe/verify_contract",
      data: {
        address: contractAddress,
        domain: domain,
      },
    });
    if (res && res.level !== contractLevel.Danger) {
      this.kvStore.set(contractAddress, res);
    }
    return res;
  }

  setIgnoreContract(contractAddress: string) {
    this.kvStore.set(this.getContractCacheKey(contractAddress), "1");
  }

  async isIgnoreContract(contractAddress: string) {
    return await this.kvStore.get(this.getContractCacheKey(contractAddress));
  }

  getContractCacheKey(contractAddress: string) {
    return storageKey.ContractTrust + contractAddress.replace(".", "-");
  }

  /* verifyContract end */

  notifyPhishingDetected<T = notifyPhishingDetectedParams>(
    params: T
  ): Promise<string> {
    return new Promise((resolve) => {
      if (
        chrome.misesPrivate &&
        chrome.misesPrivate.notifyPhishingDetected
      ) {
        return chrome.misesPrivate.notifyPhishingDetected(
          JSON.stringify(params),
        );
      }
      resolve("mises");
      return;
    });
  }
  //recordVisitWeb3siteEvent
  async recordVisitWeb3siteEvent(domain: string) {
    console.log("recordVisitWeb3siteEvent", domain);
    const params = { key1: "domain", value1: domain };
    this.recordEvent({
      event_type: "visit_web3site",
      params: params,
    });
  }
  //recordUseContractEvent
  async recordUseContractEvent(contractAddress: string, domain: string) {
    console.log("recordUseContractEvent", domain, contractAddress);
    const params = {
      key1: "domain",
      value1: domain,
      key2: "contract",
      value2: contractAddress,
    };
    this.recordEvent({
      event_type: "use_contract",
      params: params,
    });
  }
  //recordEvent
  recordEvent<T = recordEventParams>(params: T) {
    console.log("recordEvent", params);
    console.log("recordEvent", JSON.stringify(params));
    return new Promise(() => {
      if (
        chrome.misesPrivate &&
        chrome.misesPrivate.recordEvent
      ) {
        chrome.misesPrivate.recordEvent(JSON.stringify(params));
        return;
      }
    });
  }
}
