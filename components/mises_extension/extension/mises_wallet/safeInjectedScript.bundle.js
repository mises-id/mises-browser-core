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
/******/ 	return __webpack_require__(__webpack_require__.s = 1654);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1654:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1656);


/***/ }),

/***/ 1656:
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
            }, 500);
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
    verifyDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("verifyDomain", { domain });
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
            console.log("listenUserDecision");
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

// const dictionary = {
//   "0x095ea7b3": "approve",
//   "0xa22cb465": "setApprovalForAll",
//   "0x0752881a": "transfer",
//   "0x42842e0e": "safeTransferFrom",
//   "0xb88d4fde": "safeTransferFrom1",
// };
// type dictionaryKeys = keyof typeof dictionary;
const domainCheckStatus = {
    waitCheck: "waitCheck",
    pendingCheck: "pendingCheck",
    finshedCheck: "finshedCheck",
};
const domainSafeType = {
    whiteDomain: "white",
    blackDomain: "black",
    fuzzyDomain: "fuzzy",
    normalDomain: "normal",
};
const containerId = "mises-safe-container";
const parseOriginToHostname = (param) => {
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
        throw new Error(`Invalid domain: ${param}`);
    }
    const i = split[split.length - 1].indexOf(":");
    if (i >= 0) {
        split[split.length - 1] = split[split.length - 1].slice(0, i);
    }
    return split.join(".");
};
class injected_script_ContentScripts {
    constructor() {
        this.container = null;
        this.config = {
            maxRetryNum: 3,
            retryCount: 0,
        };
        this.domainInfo = {
            domainSafeType: "",
            hostname: window.location.ancestorOrigins.length > 0
                ? parseOriginToHostname(window.location.ancestorOrigins[0])
                : window.location.hostname,
            type: domainSafeType.normalDomain,
            suggestedDomain: "",
            checkStatus: domainCheckStatus.waitCheck,
            isShowDomainAlert: false,
        };
        this.init();
    }
    init() {
        this.initContainer();
        this.initWeb3Proxy();
    }
    // 初始化外层包裹元素
    initContainer() {
        const base = document.getElementById(containerId);
        if (base) {
            this.container = base;
            return;
        }
        this.container = document.createElement("div");
        this.container.setAttribute("id", containerId);
        this.container.setAttribute("class", `chrome-extension-base-class${Math.floor(Math.random() * 10000)}`);
        document.body.appendChild(this.container);
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
            if (typeof window.ethereum !== "undefined") {
                const proxy1 = new Proxy(window.ethereum.request, handler);
                window.ethereum.request = proxy1;
                //window.ethereum.send = proxy1;
                //window.ethereum.sendAsync = proxy1;
                //window.ethereum.enable = proxy1;
                console.log("Find ethereum");
                clearInterval(proxyInterval);
            }
            else if (typeof window.web3 !== "undefined") {
                const proxy2 = new Proxy(window.web3.currentProvider, handler);
                window.web3.currentProvider = proxy2;
                console.log("Find web3");
                clearInterval(proxyInterval);
            }
            else {
                console.log("Did not find ethereum or web3");
            }
        }
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
        return this.domainInfo.domainSafeType !== domainSafeType.whiteDomain;
    }
    //isShouldVerifyDomain
    isShouldVerifyDomain() {
        return false;
        //ignore list
        return this.domainInfo.checkStatus !== domainCheckStatus.finshedCheck;
    }
    //verifyDomain
    verifyDomain() {
        return injected_script_awaiter(this, void 0, void 0, function* () {
            if (this.domainInfo.checkStatus === domainCheckStatus.finshedCheck) {
                return true;
            }
            /* if (this.domainInfo.checkStatus === domainCheckStatus.pendingCheck) {
              return false;
            } */
            this.domainInfo.checkStatus = domainCheckStatus.pendingCheck;
            const checkResult = yield proxyClient.verifyDomain(this.domainInfo.hostname);
            this.domainInfo.checkStatus = domainCheckStatus.finshedCheck;
            console.log("checkResult :>>", checkResult);
            //parse the check result
            if (checkResult) {
                this.domainInfo.domainSafeType = checkResult.type_string;
                this.domainInfo.suggestedDomain = checkResult.origin;
            }
            else if (this.config.retryCount < this.config.maxRetryNum) {
                this.domainInfo.checkStatus = domainCheckStatus.waitCheck;
                this.config.retryCount++;
                console.log("verifyDomain retry ", this.config.retryCount);
            }
            else {
                this.domainInfo.checkStatus = domainCheckStatus.finshedCheck;
            }
        });
    }
}

// CONCATENATED MODULE: ./src/content-scripts/safe-inject/index.ts

new injected_script_ContentScripts();


/***/ })

/******/ });