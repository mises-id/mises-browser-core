/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1650);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1650:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1652);


/***/ }),

/***/ 1652:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/content-scripts/safe-inject/post-message.ts
// proxy scripts 发送和监听消息
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ProxyClient {
    constructor() {
        this.eventListener = {
            addMessageListener: (fn) => window.addEventListener("message", fn),
            removeMessageListener: (fn) => window.removeEventListener("message", fn),
            postMessage: (message) => window.postMessage(message, window.location.origin),
        };
    }
    requestMethod(method, params) {
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
            const receiveResponse = (e) => {
                const proxyResponse = this.parseMessage
                    ? this.parseMessage(e.data)
                    : e.data;
                if (!proxyResponse ||
                    proxyResponse.type !== "mises-safe-proxy-request-response") {
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
    verifyDomain(domain, logo, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("verifyDomain", { domain, logo, content });
        });
    }
    verifyContract(contractAddress, domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("verifyContract", {
                contractAddress,
                domain,
            });
        });
    }
    notifyFuzzyDomain(domain, suggested_url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("notifyFuzzyDomain", {
                domain,
                suggested_url,
            });
        });
    }
    calculateHtmlSimilarly(html, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("calculateHtmlSimilarly", {
                html,
                hash,
            });
        });
    }
    consoleLog(log) {
        return this.requestMethod("consoleLog", log);
    }
    //CurrentPage
    listenCurrentPage(method) {
        return new Promise((resolve, reject) => {
            const receiveResponse = (e) => {
                const proxyResponse = e.data;
                if (!proxyResponse ||
                    proxyResponse.type !== "mises-proxy-listen-current-page") {
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
    postUserDecision(decision) {
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
    listenUserDecision() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.listenCurrentPage("userDecision");
        });
    }
}
const proxyClient = new ProxyClient();


// CONCATENATED MODULE: ./src/content-scripts/safe-inject/injected-script.tsx
var injected_script_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// /* global chrome */

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
const parseUrlToDomain = (param, type = "domain") => {
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
class injected_script_ContentScripts {
    constructor() {
        this.container = null;
        this.config = {
            maxRetryNum: 1,
            retryCount: 0,
        };
        this.domainInfo = {
            domainSafeLevel: "",
            hostname: window.location.ancestorOrigins.length > 0
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
            apply: (target, _, argumentsList) => injected_script_awaiter(this, void 0, void 0, function* () {
                const constList = [...argumentsList][0];
                console.log("Transaction Method Data :>> ", constList);
                const isNotable = this.isNotableAction(constList).result;
                const methodName = constList !== undefined ? constList.method : "unKonwn";
                //is should verifying domain
                if (this.isShouldVerifyDomain()) {
                    this.verifyDomain();
                }
                if (this.isShouldVerifyContract() && isNotable) {
                    let contractAddress;
                    //TODO check
                    if (methodName === "eth_signTypedData_v4") {
                        const v4_sign_params = constList.params[1];
                        const v4_sign_data = JSON.parse(v4_sign_params);
                        contractAddress = v4_sign_data.domain.verifyingContract;
                    }
                    else {
                        contractAddress = constList.params[0].to;
                    }
                    const verifyContractResult = proxyClient.verifyContract(contractAddress, this.domainInfo.hostname);
                    console.log("verifyContractResult :>>", verifyContractResult);
                    return target(...argumentsList);
                    //is should show contract address risking alert
                }
                return target(...argumentsList);
            }),
        };
        const proxyInterval = setInterval(() => proxyETH(), 1000);
        function proxyETH() {
            let isProxy = false;
            if (typeof window.ethereum !== "undefined") {
                const proxy1 = new Proxy(window.ethereum.request, handler);
                const proxy2 = new Proxy(window.ethereum.enable, handler);
                window.ethereum.request = proxy1;
                //window.ethereum.send = proxy1;
                //window.ethereum.sendAsync = proxy1;
                window.ethereum.enable = proxy2;
                isProxy = true;
                console.log("Find ethereum");
            }
            if (typeof window.web3 !== "undefined" &&
                typeof window.web3.currentProvider !== "undefined") {
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
    isNotableAction(constList) {
        // 检查是否为关注的交易
        try {
            // const notableActionList = ['approve', 'setApprovalForAll', 'transfer', 'safeTransferFrom', 'safeTransferFrom1'];
            if (typeof constList.method !== "undefined") {
                if (constList.method === "eth_sendTransaction") {
                    let functionName = "transfer";
                    // 当 params 长度为 0 或 params[0].data 为 undefined 时
                    if (constList.params.length === 0) {
                        functionName = "transfer";
                    }
                    else if (constList.params[0].data === undefined) {
                        functionName = "transfer";
                    }
                    else {
                    }
                    return { result: true, action: functionName };
                }
                if (constList.method === "eth_signTypedData_v4") {
                    return { result: true, action: "sign" };
                }
            }
            return { result: false };
        }
        catch (error) {
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
    //verifyDomain
    verifyDomain() {
        return injected_script_awaiter(this, void 0, void 0, function* () {
            if (this.domainInfo.checkStatus === domainCheckStatus.finshedCheck) {
                return true;
            }
            if (this.config.retryCount >= this.config.maxRetryNum) {
                return;
            }
            this.config.retryCount++;
            console.log("verifyDomain count ", this.config.retryCount);
            this.domainInfo.checkStatus = domainCheckStatus.pendingCheck;
            const e = document.documentElement;
            const checkResult = yield proxyClient.verifyDomain(this.domainInfo.hostname, this.getSiteLogo(), e.innerText);
            console.log("checkResult :>>", checkResult);
            //parse the check result
            if (checkResult &&
                checkResult.level &&
                this.domainInfo.checkStatus != domainCheckStatus.finshedCheck) {
                this.domainInfo.checkStatus = domainCheckStatus.finshedCheck;
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
            if (this.config.retryCount >= this.config.maxRetryNum) {
                this.domainInfo.checkStatus = domainCheckStatus.finshedCheck;
                return;
            }
        });
    }
    //doFuzzyCheck
    doFuzzyCheck() {
        return injected_script_awaiter(this, void 0, void 0, function* () {
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
            if (yield this.fuzzyCheckHtml()) {
                return this.notifyFuzzyDomain("html");
            }
        });
    }
    fuzzyCheckTitle() {
        if (this.domainInfo.title_keyword != "") {
            const origin_title_keyword = this.domainInfo.title_keyword.toLowerCase();
            const title = document.title.toLowerCase();
            console.log("document: ", title);
            const title_arr = title.toLowerCase().replace(",", "").split(" ");
            if (title_arr.find((title) => {
                return title == origin_title_keyword;
            })) {
                return true;
            }
        }
        return false;
    }
    fuzzyCheckLogo() {
        const suggested_url_domain = parseUrlToDomain(this.domainInfo.suggested_url, "topdomain");
        if (suggested_url_domain == "") {
            return false;
        }
        const links = document.querySelectorAll("head > link");
        for (const link of links) {
            if (!link.hasAttribute("href")) {
                continue;
            }
            const href = link.getAttribute("href") || "";
            if (href.indexOf("http") != -1 &&
                suggested_url_domain === parseUrlToDomain(href)) {
                return true;
            }
        }
        return false;
    }
    getSiteLogo() {
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
    fuzzyCheckHtml() {
        return injected_script_awaiter(this, void 0, void 0, function* () {
            if (this.domainInfo.html_body_fuzzy_hash == "") {
                return false;
            }
            const body = document.body.outerHTML;
            const score = yield proxyClient.calculateHtmlSimilarly(body, this.domainInfo.html_body_fuzzy_hash);
            console.log("score: ", score);
            if (score && typeof score == "number" && score > 60) {
                return true;
            }
            return false;
        });
    }
    notifyFuzzyDomain(tag) {
        return injected_script_awaiter(this, void 0, void 0, function* () {
            console.log("doFuzzyCheck notifyFuzzyDomain start tag ", tag);
            const result = yield proxyClient.notifyFuzzyDomain(this.domainInfo.hostname, this.domainInfo.suggested_url);
            console.log("doFuzzyCheck result >>: ", result);
        });
    }
}

// CONCATENATED MODULE: ./src/content-scripts/safe-inject/index.ts

new injected_script_ContentScripts();


/***/ })

/******/ });