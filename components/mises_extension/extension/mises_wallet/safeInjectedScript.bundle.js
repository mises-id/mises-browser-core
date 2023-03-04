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
/******/ 	return __webpack_require__(__webpack_require__.s = 1655);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1655:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1657);


/***/ }),

/***/ 1657:
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
    verifyDomain(domain, logo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("verifyDomain", { domain, logo });
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


// CONCATENATED MODULE: ./src/content-scripts/safe-inject/html-similar.ts
const HASH_PRIME = 16777619;
const HASH_INIT = 671226215;
const ROLLING_WINDOW = 7;
const MAX_LENGTH = 64; // Max individual hash length in characters
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
//refer http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
function toUTF8Array(str) {
    // eslint-disable-next-line prefer-const
    let out = [], p = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        }
        else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        }
        else if ((c & 0xfc00) == 0xd800 &&
            i + 1 < str.length &&
            (str.charCodeAt(i + 1) & 0xfc00) == 0xdc00) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
        else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}
/*
  1000 0000
  1000 0000
  0000 0001
*/
function safe_multiply(x, y) {
    /*
      a = a00 + a16
      b = b00 + b16
      a*b = (a00 + a16)(b00 + b16)
        = a00b00 + a00b16 + a16b00 + a16b16
  
      a16b16 overflows the 32bits
     */
    let xlsw = x & 0xffff;
    let xmsw = (x >> 16) + (xlsw >> 16);
    const ylsw = y & 0xffff;
    const ymsw = (y >> 16) + (ylsw >> 16);
    const a16 = xmsw;
    const a00 = xlsw;
    const b16 = ymsw;
    const b00 = ylsw;
    const c00 = a00 * b00;
    let c16 = c00 >>> 16;
    c16 += a16 * b00;
    c16 &= 0xffff; // Not required but improves performance
    c16 += a00 * b16;
    xlsw = c00 & 0xffff;
    xmsw = c16 & 0xffff;
    return (xmsw << 16) | (xlsw & 0xffff);
}
//FNV-1 hash
function fnv(h, c) {
    return (safe_multiply(h, HASH_PRIME) ^ c) >>> 0;
}
class RollHash {
    constructor() {
        this.rolling_window = new Array(ROLLING_WINDOW);
        this.h1 = 0;
        this.h2 = 0;
        this.h3 = 0;
        this.n = 0;
        this.rolling_window = new Array(ROLLING_WINDOW);
        this.h1 = 0;
        this.h2 = 0;
        this.h3 = 0;
        this.n = 0;
    }
    update(c) {
        this.h2 = safe_add(this.h2, -this.h1);
        const mut = ROLLING_WINDOW * c;
        this.h2 = safe_add(this.h2, mut) >>> 0;
        this.h1 = safe_add(this.h1, c);
        const val = this.rolling_window[this.n % ROLLING_WINDOW] || 0;
        this.h1 = safe_add(this.h1, -val) >>> 0;
        this.rolling_window[this.n % ROLLING_WINDOW] = c;
        this.n++;
        this.h3 = this.h3 << 5;
        this.h3 = (this.h3 ^ c) >>> 0;
    }
    sum() {
        return (this.h1 + this.h2 + this.h3) >>> 0;
    }
}
function piecewiseHash(bytes, triggerValue) {
    const signatures = ["", "", String(triggerValue)];
    if (bytes.length === 0) {
        return signatures;
    }
    let h1 = HASH_INIT;
    let h2 = HASH_INIT;
    const rh = new RollHash();
    //console.log(triggerValue)
    for (let i = 0, len = bytes.length; i < len; i++) {
        const thisByte = bytes[i];
        h1 = fnv(h1, thisByte);
        h2 = fnv(h2, thisByte);
        rh.update(thisByte);
        if (signatures[0].length < MAX_LENGTH - 1 &&
            rh.sum() % triggerValue === triggerValue - 1) {
            signatures[0] += B64.charAt(h1 & 63);
            h1 = HASH_INIT;
        }
        if (signatures[1].length < MAX_LENGTH / 2 - 1 &&
            rh.sum() % (triggerValue * 2) === triggerValue * 2 - 1) {
            signatures[1] += B64.charAt(h2 & 63);
            h2 = HASH_INIT;
        }
    }
    signatures[0] += B64.charAt(h1 & 63);
    signatures[1] += B64.charAt(h2 & 63);
    return signatures;
}
class HtmlSimilar {
    constructor() { }
    digest(data) {
        const bytes = toUTF8Array(data);
        let bi = 3;
        while (bi * MAX_LENGTH < bytes.length) {
            bi *= 2;
        }
        // console.log("bi: ",bi)
        let signatures;
        do {
            signatures = piecewiseHash(bytes, bi);
            console.log("bi: ", bi, signatures[0], signatures[1]);
            bi = ~~(bi / 2);
        } while (bi > 3 && signatures[0].length < MAX_LENGTH / 2);
        return signatures[2] + ":" + signatures[0] + ":" + signatures[1];
    }
    distance(hash1, hash2) {
        let score = 0;
        const arr1 = hash1.split(":");
        const hash1BlockSize = Number(arr1[0]);
        const hash1String1 = arr1[1];
        const hash1String2 = arr1[2];
        const arr2 = hash2.split(":");
        const hash2BlockSize = Number(arr2[0]);
        const hash2String1 = arr2[1];
        const hash2String2 = arr2[2];
        if (hash1BlockSize == hash2BlockSize && hash1String1 == hash2String1) {
            return 100;
        }
        if (hash1BlockSize != hash2BlockSize &&
            hash1BlockSize != hash2BlockSize * 2 &&
            hash2BlockSize != hash1BlockSize * 2) {
            return score;
        }
        if (hash1BlockSize == hash2BlockSize) {
            const d1 = scoreDistance(hash1String1, hash2String1);
            const d2 = scoreDistance(hash1String2, hash2String2);
            score = Math.max(d1, d2);
        }
        else if (hash1BlockSize == hash2BlockSize * 2) {
            score = scoreDistance(hash1String1, hash2String2);
        }
        else {
            score = scoreDistance(hash1String2, hash2String1);
        }
        return score;
    }
}
function editDistance(str1, str2) {
    // write code here
    let cost, lastdiag, olddiag;
    const s1 = toUTF8Array(str1);
    const s2 = toUTF8Array(str2);
    const lenS1 = s1.length;
    const lenS2 = s2.length;
    const column = new Array(1 + lenS1);
    for (let i = 1; i <= lenS1; i++) {
        column[i] = i;
    }
    for (let x = 1; x <= lenS2; x++) {
        column[0] = x;
        lastdiag = x - 1;
        for (let y = 1; y <= lenS1; y++) {
            olddiag = column[y];
            cost = 0;
            if (s1[y - 1] != s2[x - 1]) {
                // Replace costs 2 in ssdeep
                cost = 2;
            }
            column[y] = Math.min(column[y] + 1, column[y - 1] + 1, lastdiag + cost);
            lastdiag = olddiag;
        }
    }
    return column[lenS1];
}
function scoreDistance(h1, h2) {
    let d = editDistance(h1, h2);
    d = (d * MAX_LENGTH) / (h1.length + h2.length);
    d = (100 * d) / MAX_LENGTH;
    d = 100 - d;
    return d;
}
const html_similar = new HtmlSimilar();


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
const containerId = "mises-safe-container";
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
            const checkResult = yield proxyClient.verifyDomain(this.domainInfo.hostname, this.getSiteLogo());
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
            //html
            if (this.fuzzyCheckHtml()) {
                return this.notifyFuzzyDomain("html");
            }
            //logo
            if (this.fuzzyCheckLogo()) {
                return this.notifyFuzzyDomain("logo");
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
        if (this.domainInfo.html_body_fuzzy_hash == "") {
            return false;
        }
        console.time("fuzzyChekcHtml");
        const body = document.body.outerHTML;
        const request_url_html_body_hash = html_similar.digest(body);
        const score = html_similar.distance(this.domainInfo.html_body_fuzzy_hash, request_url_html_body_hash);
        console.log("request_url_html_body_hash: ", request_url_html_body_hash);
        console.log("html_body_fuzzy_hash: ", this.domainInfo.html_body_fuzzy_hash);
        console.log("html body fuzzy html score: ", score);
        console.timeEnd("fuzzyChekcHtml");
        if (score > 60) {
            return true;
        }
        return false;
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