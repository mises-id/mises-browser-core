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
/******/ 	return __webpack_require__(__webpack_require__.s = 1652);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 1652:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1658);


/***/ }),

/***/ 1658:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "VerifyDomainMsg", function() { return /* binding */ content_scripts_VerifyDomainMsg; });

// EXTERNAL MODULE: ../router/build/index.js
var build = __webpack_require__(3);

// EXTERNAL MODULE: ../router-extension/build/index.js
var router_extension_build = __webpack_require__(56);

// EXTERNAL MODULE: ../provider/build/index.js
var provider_build = __webpack_require__(194);

// CONCATENATED MODULE: ./src/content-scripts/events.ts

class events_PushEventDataMsg extends build["Message"] {
    constructor(data) {
        super();
        this.data = data;
    }
    static type() {
        return "push-event-data";
    }
    validateBasic() {
        if (!this.data.type) {
            throw new Error("Type should not be empty");
        }
    }
    route() {
        return "interaction-foreground";
    }
    type() {
        return events_PushEventDataMsg.type();
    }
}
function initEvents(router) {
    router.registerMessage(events_PushEventDataMsg);
    router.addHandler("interaction-foreground", (_, msg) => {
        switch (msg.constructor) {
            case events_PushEventDataMsg:
                if (msg.data.type === "keystore-changed") {
                    window.dispatchEvent(new Event("mises_keystorechange"));
                }
                return;
            default:
                throw new Error("Unknown msg type");
        }
    });
}

// EXTERNAL MODULE: ./src/manifest.json
var manifest = __webpack_require__(269);

// CONCATENATED MODULE: ./src/content-scripts/content-scripts.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





provider_build["InjectedKeplr"].startProxy(new provider_build["Keplr"](manifest.version, "core", new router_extension_build["InExtensionMessageRequester"]()));
const router = new router_extension_build["ExtensionRouter"](router_extension_build["ContentScriptEnv"].produceEnv);
router.addGuard(router_extension_build["ContentScriptGuards"].checkMessageIsInternal);
initEvents(router);
router.listen(build["WEBPAGE_PORT"]);
const container = document.head || document.documentElement;
const injectedScript = document.createElement("script");
injectedScript.src = browser.runtime.getURL("injectedScript.bundle.js");
injectedScript.type = "text/javascript";
container.insertBefore(injectedScript, container.children[0]);
injectedScript.remove();
document.addEventListener("DOMContentLoaded", () => {
    initPostMsgClient();
    const body = document.body;
    const injectedMisesScript = document.createElement("script");
    injectedMisesScript.src = browser.runtime.getURL("safeInjectedScript.bundle.js");
    injectedMisesScript.type = "text/javascript";
    body.appendChild(injectedMisesScript);
    injectedMisesScript.remove();
});
class content_scripts_VerifyDomainMsg extends build["Message"] {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "verify-domain";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises-safe";
    }
    type() {
        return content_scripts_VerifyDomainMsg.type();
    }
}
// mises-safe
const postMsg = (id, res) => {
    const targetOrigin = window.location.origin;
    const contentToProxyMessage = {
        type: "mises-safe-proxy-request-response",
        id,
        result: { return: res },
    };
    console.log("content post background message to proxy :>>", contentToProxyMessage, targetOrigin);
    window.postMessage(contentToProxyMessage, targetOrigin);
};
const initPostMsgClient = () => __awaiter(void 0, void 0, void 0, function* () {
    window.addEventListener("message", (e) => __awaiter(void 0, void 0, void 0, function* () {
        // 监听 message 事件
        if (e.origin !== window.location.origin) {
            // 验证消息来源地址
            return;
        }
        if (!e.data || e.data.type !== "mises-proxy-request") {
            return;
        }
        if (typeof e.data.method === "undefined") {
            return;
        }
        if (e.data.method === "consoleLog") {
            console.log("content consoleLog:>>", e.data);
            return;
        }
        console.log("content start sending message to background :>>", e.data);
        const res = yield new router_extension_build["InExtensionMessageRequester"]().sendMessage(build["BACKGROUND_PORT"], new content_scripts_VerifyDomainMsg(e.data));
        //post msg back to proxyClient
        console.log("background start sending message to :>>", res);
        //this.postMsg(res);
        postMsg(e.data.id, res);
    }));
});


/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRegistry = void 0;
class MessageRegistry {
    constructor() {
        this.registeredMsgType = new Map();
    }
    registerMessage(msgCls) {
        if (this.registeredMsgType.has(msgCls.type())) {
            throw new Error(`Already registered type ${msgCls.type()}`);
        }
        this.registeredMsgType.set(msgCls.type(), msgCls);
    }
    parseMessage(message) {
        if (!message.type) {
            throw new Error("Null type");
        }
        const msgCls = this.registeredMsgType.get(message.type);
        if (!msgCls) {
            throw new Error(`Unregistered msg type ${message.type}`);
        }
        return Object.setPrototypeOf(message.msg, msgCls.prototype);
    }
}
exports.MessageRegistry = MessageRegistry;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONUint8Array = void 0;
// The JSON encoder that supports the `Uint8Array`.
const hex_1 = __webpack_require__(326);
class JSONUint8Array {
    static parse(text) {
        return JSON.parse(text, (key, value) => {
            // Prevent potential prototype poisoning.
            if (key === "__proto__") {
                throw new Error("__proto__ is disallowed");
            }
            if (value &&
                typeof value === "string" &&
                value.startsWith("__uint8array__")) {
                return hex_1.fromHex(value.replace("__uint8array__", ""));
            }
            return value;
        });
    }
    static stringify(obj) {
        return JSON.stringify(obj, (key, value) => {
            // Prevent potential prototype poisoning.
            if (key === "__proto__") {
                throw new Error("__proto__ is disallowed");
            }
            if (value &&
                (value instanceof Uint8Array ||
                    (typeof value === "object" &&
                        "type" in value &&
                        "data" in value &&
                        value.type === "Buffer" &&
                        Array.isArray(value.data)))) {
                const array = value instanceof Uint8Array ? value : new Uint8Array(value.data);
                return `__uint8array__${hex_1.toHex(array)}`;
            }
            return value;
        });
    }
    static wrap(obj) {
        if (obj === undefined)
            return undefined;
        return JSON.parse(JSONUint8Array.stringify(obj));
    }
    static unwrap(obj) {
        if (obj === undefined)
            return undefined;
        return JSONUint8Array.parse(JSON.stringify(obj));
    }
}
exports.JSONUint8Array = JSONUint8Array;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeplrExtensionRouterId = void 0;
/**
 * getKeplrExtensionRouterId returns the `window.keplrExtensionRouterId`.
 * If the `window.keplrExtensionRouterId` is not initialized, it will be initialized and returned.
 */
function getKeplrExtensionRouterId() {
    const globalWindow = typeof window !== "undefined" ? window : chrome;
    if (globalWindow.keplrExtensionRouterId == null) {
        globalWindow.keplrExtensionRouterId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }
    return globalWindow.keplrExtensionRouterId;
}
exports.getKeplrExtensionRouterId = getKeplrExtensionRouterId;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeplrEnigmaUtils = void 0;
/**
 * KeplrEnigmaUtils duplicates the public methods that are supported on secretjs's EnigmaUtils class.
 */
class KeplrEnigmaUtils {
    constructor(chainId, keplr) {
        this.chainId = chainId;
        this.keplr = keplr;
    }
    getPubkey() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.getEnigmaPubKey(this.chainId);
        });
    }
    getTxEncryptionKey(nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.getEnigmaTxEncryptionKey(this.chainId, nonce);
        });
    }
    encrypt(contractCodeHash, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.enigmaEncrypt(this.chainId, contractCodeHash, msg);
        });
    }
    decrypt(ciphertext, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.enigmaDecrypt(this.chainId, ciphertext, nonce);
        });
    }
}
exports.KeplrEnigmaUtils = KeplrEnigmaUtils;
//# sourceMappingURL=enigma.js.map

/***/ }),

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmJSOfflineSigner = exports.CosmJSOfflineSignerOnlyAmino = void 0;
class CosmJSOfflineSignerOnlyAmino {
    constructor(chainId, keplr) {
        this.chainId = chainId;
        this.keplr = keplr;
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.keplr.getKey(this.chainId);
            return [
                {
                    address: key.bech32Address,
                    // Currently, only secp256k1 is supported.
                    algo: "secp256k1",
                    pubkey: key.pubKey,
                },
            ];
        });
    }
    signAmino(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.chainId !== signDoc.chain_id) {
                throw new Error("Unmatched chain id with the offline signer");
            }
            const key = yield this.keplr.getKey(signDoc.chain_id);
            if (key.bech32Address !== signerAddress) {
                throw new Error("Unknown signer address");
            }
            return yield this.keplr.signAmino(this.chainId, signerAddress, signDoc);
        });
    }
    // Fallback function for the legacy cosmjs implementation before the staragte.
    sign(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signAmino(signerAddress, signDoc);
        });
    }
}
exports.CosmJSOfflineSignerOnlyAmino = CosmJSOfflineSignerOnlyAmino;
class CosmJSOfflineSigner extends CosmJSOfflineSignerOnlyAmino {
    constructor(chainId, keplr) {
        super(chainId, keplr);
        this.chainId = chainId;
        this.keplr = keplr;
    }
    signDirect(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.chainId !== signDoc.chainId) {
                throw new Error("Unmatched chain id with the offline signer");
            }
            const key = yield this.keplr.getKey(signDoc.chainId);
            if (key.bech32Address !== signerAddress) {
                throw new Error("Unknown signer address");
            }
            return yield this.keplr.signDirect(this.chainId, signerAddress, signDoc);
        });
    }
}
exports.CosmJSOfflineSigner = CosmJSOfflineSigner;
//# sourceMappingURL=cosmjs.js.map

/***/ }),

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisesWeb3Client = void 0;
class MisesWeb3Client {
    constructor(keplr) {
        this.keplr = keplr;
    }
    misesAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.misesAccount();
        });
    }
    hasWalletAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.hasWalletAccount();
        });
    }
    openWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.openWallet();
        });
    }
    disconnect(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.disconnect(params);
        });
    }
    connect(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.connect(params);
        });
    }
    userFollow(toUid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.userFollow(toUid);
        });
    }
    userUnFollow(toUid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.userUnFollow(toUid);
        });
    }
    setUserInfo(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keplr.setUserInfo(params);
        });
    }
}
exports.MisesWeb3Client = MisesWeb3Client;
//# sourceMappingURL=mises.js.map

/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(592), exports);
__exportStar(__webpack_require__(190), exports);
__exportStar(__webpack_require__(189), exports);
__exportStar(__webpack_require__(595), exports);
__exportStar(__webpack_require__(191), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 211:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 266:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(583), exports);
__exportStar(__webpack_require__(584), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 269:
/***/ (function(module) {

module.exports = JSON.parse("{\"manifest_version\":3,\"name\":\"Mises\",\"description\":\"Mises is a browser extension wallet\",\"version\":\"0.2.4\",\"icons\":{\"16\":\"assets/icon-16.png\",\"48\":\"assets/icon-48.png\",\"128\":\"assets/icon-128.png\"},\"action\":{\"default_popup\":\"popup.html\",\"default_title\":\"Mises\",\"default_icon\":{\"16\":\"assets/icon-16.png\",\"48\":\"assets/icon-48.png\",\"128\":\"assets/icon-128.png\"}},\"background\":{\"service_worker\":\"background.bundle.js\"},\"author\":\"https://www.mises.site\",\"permissions\":[\"storage\",\"notifications\",\"identity\",\"tabs\",\"idle\",\"misesPrivate\",\"nativeMessaging\"],\"host_permissions\":[\"file://*/*\",\"http://*/*\",\"https://*/*\"],\"content_scripts\":[{\"matches\":[\"file://*/*\",\"http://*/*\",\"https://*/*\"],\"js\":[\"browser-polyfill.js\",\"contentScripts.bundle.js\"],\"run_at\":\"document_start\",\"all_frames\":true}],\"web_accessible_resources\":[{\"resources\":[\"injectedScript.bundle.js\",\"assets/logo-256.png\",\"safeInjectedScript.bundle.js\"],\"matches\":[\"http://*/*\",\"https://*/*\"]}],\"key\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuxlpHRb1I8/ks1bU2jiOFj7QRyGTV6NOO4VVmhkdzomhMxWIHf70QwxxYhxm52NCyRGoSc+hUqAc6gyGPzjPM5hhmtk4/MwjXyPkaJ7X1tlc5lOfTkXhntKffOGvB15JylxFbDb/Il2T9MoCUrDzkD+Y3jdBJ5PfiomiEl/uz2Gpgwvx118/qc9pBCPVZOP4sUAMlgKkvWksJ7s/u6birdR+15dM3jtwYYwMCE3lqfsJuWXYHMAlG6iUbEbo9kQCHI+TtyF0QU/w4NeY5fX6C1cXrqWPweI7KiEtADMdmmxNif/QaTsOhpGr6DDfHoGevQcF6lu8/dAJmk8YIiqXBQIDAQAB\",\"content_security_policy\":{\"extension_pages\":\"script-src 'self' 'wasm-unsafe-eval'; object-src 'self';\"}}");

/***/ }),

/***/ 284:
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(325), exports);
__exportStar(__webpack_require__(327), exports);
__exportStar(__webpack_require__(328), exports);
__exportStar(__webpack_require__(329), exports);
__exportStar(__webpack_require__(330), exports);
__exportStar(__webpack_require__(331), exports);
__exportStar(__webpack_require__(332), exports);
__exportStar(__webpack_require__(183), exports);
__exportStar(__webpack_require__(184), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const encoding_1 = __webpack_require__(183);
const json_uint8_array_1 = __webpack_require__(184);
class Router {
    constructor(envProducer) {
        this.envProducer = envProducer;
        this.msgRegistry = new encoding_1.MessageRegistry();
        this.registeredHandler = new Map();
        this.guards = [];
        this.port = "";
    }
    registerMessage(msgCls) {
        this.msgRegistry.registerMessage(msgCls);
    }
    addHandler(route, handler) {
        if (this.registeredHandler.has(route)) {
            throw new Error(`Already registered type ${route}`);
        }
        this.registeredHandler.set(route, handler);
    }
    addGuard(guard) {
        this.guards.push(guard);
    }
    handleMessage(message, sender) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = this.msgRegistry.parseMessage(json_uint8_array_1.JSONUint8Array.unwrap(message));
            const env = this.envProducer(sender, (_a = msg.routerMeta) !== null && _a !== void 0 ? _a : {});
            for (const guard of this.guards) {
                yield guard(env, msg, sender);
            }
            // Can happen throw
            msg.validateBasic();
            const route = msg.route();
            if (!route) {
                throw new Error("Null router");
            }
            const handler = this.registeredHandler.get(route);
            if (!handler) {
                throw new Error("Can't get handler");
            }
            return json_uint8_array_1.JSONUint8Array.wrap(yield handler(env, msg));
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
  Belows are from @cosmjs/encoding library.
  To reduce the bundle size of provider, put them directly here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromHex = exports.toHex = void 0;
function toHex(data) {
    let out = "";
    for (const byte of data) {
        out += ("0" + byte.toString(16)).slice(-2);
    }
    return out;
}
exports.toHex = toHex;
function fromHex(hexstring) {
    if (hexstring.length % 2 !== 0) {
        throw new Error("hex string length must be a multiple of 2");
    }
    const listOfInts = [];
    for (let i = 0; i < hexstring.length; i += 2) {
        const hexByteAsString = hexstring.substr(i, 2);
        if (!hexByteAsString.match(/[0-9a-f]{2}/i)) {
            throw new Error("hex string contains invalid characters");
        }
        listOfInts.push(parseInt(hexByteAsString, 16));
    }
    return new Uint8Array(listOfInts);
}
exports.fromHex = fromHex;
//# sourceMappingURL=hex.js.map

/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.KeplrError = void 0;
class KeplrError extends Error {
    constructor(module, code, message) {
        super(message);
        this.module = module;
        this.code = code;
        Object.setPrototypeOf(this, KeplrError.prototype);
    }
}
exports.KeplrError = KeplrError;
//# sourceMappingURL=error.js.map

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
/**
 * This messaging system is influenced by cosmos-sdk.
 * The messages are processed in the following order:
 * "deserialize message -> approve external -> validate basic -> handler by routing".
 * This deserializing system has weak polymorphism feature.
 * Message would be converted to object according to their class and registered type.
 * But, nested class is not supported. Non primitivie types or array that includes non primitive types in message's fields
 * can't be decoded to their type properly. In this case, user should set thier prototype manually.
 */
class Message {
    /**
     * Ask for approval if message is sent externally.
     */
    approveExternal(_env, _sender) {
        return false;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map

/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBPAGE_PORT = exports.APP_PORT = exports.BACKGROUND_PORT = void 0;
exports.BACKGROUND_PORT = "background";
exports.APP_PORT = "popup";
exports.WEBPAGE_PORT = "webpage";
//# sourceMappingURL=constant.js.map

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(89)
var ieee754 = __webpack_require__(284)
var isArray = __webpack_require__(211)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobileStatus = exports.enableScroll = exports.disableScroll = exports.fitPopupWindow = exports.closePopupTab = exports.openPopupTab = exports.closePopupWindow = exports.openPopupWindow = exports.PopupSize = void 0;
exports.PopupSize = {
    width: 360,
    height: 580,
};
const lastWindowIds = {};
const lastTabIds = {};
/**
 * Try open window if no previous window exists.
 * If, previous window exists, try to change the location of this window.
 * Finally, try to recover focusing for opened window.
 * @param url
 */
function openPopupWindow(url, channel = "default", options = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const option = Object.assign({ width: exports.PopupSize.width, height: exports.PopupSize.height, url: url, type: "popup" }, options);
        if (lastWindowIds[channel] !== undefined) {
            try {
                const window = yield browser.windows.get(lastWindowIds[channel], {
                    populate: true,
                });
                if ((_a = window === null || window === void 0 ? void 0 : window.tabs) === null || _a === void 0 ? void 0 : _a.length) {
                    const tab = window.tabs[0];
                    if (tab === null || tab === void 0 ? void 0 : tab.id) {
                        yield browser.tabs.update(tab.id, { active: true, url });
                    }
                    else {
                        throw new Error("Null window or tabs");
                    }
                }
                else {
                    throw new Error("Null window or tabs");
                }
            }
            catch (_b) {
                lastWindowIds[channel] = (yield browser.windows.create(option)).id;
            }
        }
        else {
            lastWindowIds[channel] = (yield browser.windows.create(option)).id;
        }
        if (lastWindowIds[channel]) {
            try {
                yield browser.windows.update(lastWindowIds[channel], {
                    focused: true,
                });
            }
            catch (e) {
                console.log(`Failed to update window focus: ${e.message}`);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return lastWindowIds[channel];
    });
}
exports.openPopupWindow = openPopupWindow;
function closePopupWindow(channel) {
    (() => __awaiter(this, void 0, void 0, function* () {
        const windowId = lastWindowIds[channel];
        if (windowId) {
            yield browser.windows.remove(windowId);
        }
    }))();
}
exports.closePopupWindow = closePopupWindow;
function openPopupTab(url, channel = "default") {
    return __awaiter(this, void 0, void 0, function* () {
        const [_openerTab] = yield browser.tabs.query({
            active: true,
            highlighted: true,
        });
        const option = {
            url,
            openerTabId: _openerTab && _openerTab.id,
        };
        console.log("_openerTab:", _openerTab.id);
        browser.storage.local.set({
            _openerTab: _openerTab.id,
        });
        if (lastTabIds[channel] !== undefined) {
            try {
                const tab = yield browser.tabs.get(lastTabIds[channel]);
                if (tab.id) {
                    yield browser.tabs.update(tab.id, Object.assign({ active: true, highlighted: true }, option));
                }
                else {
                    throw new Error("Null window or tabs");
                }
            }
            catch (_a) {
                lastTabIds[channel] = (yield browser.tabs.create(option)).id;
            }
        }
        else {
            lastTabIds[channel] = (yield browser.tabs.create(option)).id;
        }
        if (lastTabIds[channel]) {
            try {
                yield browser.tabs.update(lastTabIds[channel], Object.assign({ highlighted: true, active: true }, option));
            }
            catch (e) {
                console.log(`Failed to update window focus: ${e.message}`);
            }
        }
        browser.storage.local.set({
            lastTabId: lastTabIds[channel],
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return lastTabIds[channel];
    });
}
exports.openPopupTab = openPopupTab;
function closePopupTab() {
    return __awaiter(this, void 0, void 0, function* () {
        const openerTabId = (yield browser.storage.local.get("_openerTab"))
            ._openerTab;
        const lastTabId = (yield browser.storage.local.get("lastTabId")).lastTabId;
        console.log(openerTabId, "openerTabId");
        if (openerTabId) {
            yield browser.tabs.update(openerTabId, {
                active: true,
                highlighted: true,
            });
            browser.storage.local.set({
                _openerTab: "",
                lastTabId: "",
            });
        }
        if (lastTabId) {
            browser.tabs.remove(lastTabId);
        }
    });
}
exports.closePopupTab = closePopupTab;
/**
 * window.open() has many options for sizing, but they require different ways to do this per web browser.
 * So, to avoid this problem, just manually set sizing if new window popup is opened.
 */
function fitPopupWindow() {
    if (isMobileStatus()) {
        return;
    }
    // Get the gap size like title bar or menu bar, etc...
    const gap = {
        width: window.outerWidth - window.innerWidth,
        height: window.outerHeight - window.innerHeight,
    };
    if (browser.windows) {
        browser.windows.getCurrent().then((window) => {
            if ((window === null || window === void 0 ? void 0 : window.id) != null) {
                browser.windows.update(window.id, {
                    width: exports.PopupSize.width + gap.width,
                    height: exports.PopupSize.height + gap.height,
                });
            }
        });
        return;
    }
    window.resizeTo(exports.PopupSize.width + gap.width, exports.PopupSize.height + gap.height);
}
exports.fitPopupWindow = fitPopupWindow;
/**
 * In some case, opened window has scrollbar even if scroll is unnecessary.
 * This can spoil the layout of content slightly.
 * So, if you are sure you don't need scrolling, use this function to remove scrolling.
 */
function disableScroll() {
    const html = document.getElementsByTagName("html");
    html[0].style.overflow = "hidden";
}
exports.disableScroll = disableScroll;
function enableScroll() {
    const html = document.getElementsByTagName("html");
    html[0].style.overflow = "";
}
exports.enableScroll = enableScroll;
function isMobileStatus() {
    // return /Mobi|Android|iPhone/i.test(navigator.userAgent);
    return true;
}
exports.isMobileStatus = isMobileStatus;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(581), exports);
__exportStar(__webpack_require__(266), exports);
__exportStar(__webpack_require__(585), exports);
__exportStar(__webpack_require__(588), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 581:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(582), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 582:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionRouter = void 0;
const router_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(188);
class ExtensionRouter extends router_1.Router {
    constructor(envProducer) {
        super(envProducer);
        // You shouldn't set this handler as async funtion,
        // because mozila's extension polyfill deals with the message handler as resolved if it returns the `Promise`.
        // So, if this handler is async function, it always return the `Promise` if it returns `undefined` and it is dealt with as resolved.
        this.onMessage = (message, sender) => {
            var _a, _b;
            if (message.port !== this.port) {
                return;
            }
            // The receiverRouterId will be set when requesting an interaction from the background to the frontend.
            // If this value exists, it compares this value with the current router id and processes them only if they are the same.
            if (((_b = (_a = message.msg) === null || _a === void 0 ? void 0 : _a.routerMeta) === null || _b === void 0 ? void 0 : _b.receiverRouterId) &&
                message.msg.routerMeta.receiverRouterId !== utils_1.getKeplrExtensionRouterId()) {
                return;
            }
            return this.onMessageHandler(message, sender);
        };
    }
    listen(port) {
        if (!port) {
            throw new Error("Empty port");
        }
        this.port = port;
        browser.runtime.onMessage.addListener(this.onMessage);
        // Although security considerations cross-extension communication are in place,
        // we have put in additional security measures by disbling extension-to-extension communication until a formal security audit has taken place.
        /*
        if (browser.runtime.onMessageExternal) {
          browser.runtime.onMessageExternal.addListener(this.onMessage);
        }
         */
    }
    unlisten() {
        this.port = "";
        browser.runtime.onMessage.removeListener(this.onMessage);
        // Although security considerations cross-extension communication are in place,
        // we have put in additional security measures by disbling extension-to-extension communication until a formal security audit has taken place.
        /*
        if (browser.runtime.onMessageExternal) {
          browser.runtime.onMessageExternal.removeListener(this.onMessage);
        }
         */
    }
    onMessageHandler(message, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.handleMessage(message, sender);
                return {
                    return: result,
                };
            }
            catch (e) {
                console.log(`Failed to process msg ${message.type}: ${(e === null || e === void 0 ? void 0 : e.message) || (e === null || e === void 0 ? void 0 : e.toString())}`);
                if (e instanceof router_1.KeplrError) {
                    return Promise.resolve({
                        error: {
                            code: e.code,
                            module: e.module,
                            message: e.message || e.toString(),
                        },
                    });
                }
                else if (e) {
                    return Promise.resolve({
                        error: e.message || e.toString(),
                    });
                }
                else {
                    return Promise.resolve({
                        error: "Unknown error, and error is null",
                    });
                }
            }
        });
    }
}
exports.ExtensionRouter = ExtensionRouter;
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 583:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InExtensionMessageRequester = void 0;
const router_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(188);
class InExtensionMessageRequester {
    sendMessage(port, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.validateBasic();
            // Set message's origin.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            msg["origin"] =
                typeof window !== "undefined"
                    ? window.location.origin
                    : `chrome-extension://${browser.runtime.id}`;
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { routerId: utils_1.getKeplrExtensionRouterId() });
            const result = router_1.JSONUint8Array.unwrap(yield new Promise((resolve) => {
                chrome.runtime.sendMessage({
                    port,
                    type: msg.type(),
                    msg: router_1.JSONUint8Array.wrap(msg),
                }, (result) => {
                    console.log(result, "sendMessage-result>>>>>>");
                    resolve(result);
                });
            }));
            if (!result) {
                throw new Error("Null result");
            }
            if (result.error) {
                if (typeof result.error === "string") {
                    throw new Error(result.error);
                }
                else {
                    throw new router_1.KeplrError(result.error.module, result.error.code, result.error.message);
                }
            }
            return result.return;
        });
    }
    static sendMessageToTab(tabId, port, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.validateBasic();
            // Set message's origin.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            msg["origin"] =
                typeof window !== "undefined"
                    ? window.location.origin
                    : `chrome-extension://${browser.runtime.id}`;
            console.log(msg["origin"], "sendMessageToTab");
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { routerId: utils_1.getKeplrExtensionRouterId() });
            const result = router_1.JSONUint8Array.unwrap(yield new Promise((resolve) => {
                chrome.tabs.sendMessage(tabId, {
                    port,
                    type: msg.type(),
                    msg: router_1.JSONUint8Array.wrap(msg),
                }, (result) => {
                    console.log(result, "sendMessageToTab-result>>>>>>");
                    resolve(result);
                });
            }));
            if (!result) {
                throw new Error("Null result");
            }
            if (result.error) {
                if (typeof result.error === "string") {
                    throw new Error(result.error);
                }
                else {
                    throw new router_1.KeplrError(result.error.module, result.error.code, result.error.message);
                }
            }
            return result.return;
        });
    }
}
exports.InExtensionMessageRequester = InExtensionMessageRequester;
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScriptMessageRequester = void 0;
const router_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(188);
// The message requester to send the message to the content scripts.
// This will send message to the tab with the content script.
// And, this can't handle the result of the message sending.
// TODO: Research to improve this requester.
class ContentScriptMessageRequester {
    sendMessage(port, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            msg.validateBasic();
            // Set message's origin.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            msg["origin"] =
                typeof window !== "undefined"
                    ? window.location.origin
                    : `chrome-extension://${browser.runtime.id}`;
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { routerId: utils_1.getKeplrExtensionRouterId() });
            const wrappedMsg = router_1.JSONUint8Array.wrap(msg);
            const alltabs = yield browser.tabs.query({
                discarded: false,
                status: "complete",
            });
            const tabs = alltabs.filter((tab) => {
                if (tab.url) {
                    return ((tab.url.indexOf(browser.runtime.id) > -1 &&
                        tab.url.indexOf("interaction=true&interactionInternal=false") >
                            -1) ||
                        tab.url.indexOf("mises.site") > -1 ||
                        tab.url.indexOf("localhost") > -1);
                }
            });
            for (let i = 0; i < tabs.length; i++) {
                const tabId = tabs[i].id;
                if (tabId) {
                    try {
                        console.log(tabId);
                        chrome.tabs.sendMessage(tabId, {
                            port,
                            type: msg.type(),
                            msg: wrappedMsg,
                        }, (result) => {
                            console.log(result, "browser.tabs.sendMessage: success");
                        });
                        console.log(tabId, "browser.tabs.sendMessage");
                        // Ignore the failure
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            // This requester can't handle the result of the message.
            return undefined;
        });
    }
}
exports.ContentScriptMessageRequester = ContentScriptMessageRequester;
//# sourceMappingURL=content-script.js.map

/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(586), exports);
__exportStar(__webpack_require__(587), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionGuards = void 0;
class ExtensionGuards {
}
exports.ExtensionGuards = ExtensionGuards;
ExtensionGuards.checkOriginIsValid = (_, msg, sender) => {
    // TODO: When is a url undefined?
    if (!sender.url) {
        throw new Error("url is empty");
    }
    if (!msg.origin) {
        throw new Error("origin is empty");
    }
    const url = new URL(sender.url);
    if (url.origin !== msg.origin) {
        throw new Error("Invalid origin");
    }
    return Promise.resolve();
};
ExtensionGuards.checkMessageIsInternal = (env, msg, sender) => {
    if (!env.isInternalMsg && !msg.approveExternal(env, sender)) {
        throw new Error("Permission rejected");
    }
    return Promise.resolve();
};
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScriptGuards = void 0;
class ContentScriptGuards {
}
exports.ContentScriptGuards = ContentScriptGuards;
// Router in content script will reject all messages that can be sent from the external.
ContentScriptGuards.checkMessageIsInternal = (env, msg, sender) => {
    if (!env.isInternalMsg || msg.approveExternal(env, sender)) {
        throw new Error("Content script can't handle the message that is able to be sent from external");
    }
    return Promise.resolve();
};
//# sourceMappingURL=content-script.js.map

/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(589), exports);
__exportStar(__webpack_require__(590), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 589:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionEnv = void 0;
const router_1 = __webpack_require__(3);
const popup_1 = __webpack_require__(46);
const requester_1 = __webpack_require__(266);
class PromiseQueue {
    constructor() {
        this.workingOnPromise = false;
        this.queue = [];
    }
    enqueue(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                fn,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }
    dequeue() {
        if (this.workingOnPromise) {
            return;
        }
        const item = this.queue.shift();
        if (!item) {
            return;
        }
        this.workingOnPromise = true;
        item
            .fn()
            .then((result) => {
            item.resolve(result);
        })
            .catch((e) => {
            item.reject(e);
        })
            .finally(() => {
            this.workingOnPromise = false;
            this.dequeue();
        });
    }
}
const openPopupQueue = new PromiseQueue();
// To handle the opening popup more easily,
// just open the popup one by one.
function openPopupWindow(url, channel = "default") {
    return __awaiter(this, void 0, void 0, function* () {
        return yield openPopupQueue.enqueue(() => {
            return popup_1.isMobileStatus()
                ? popup_1.openPopupTab(url, channel)
                : popup_1.openPopupWindow(url, channel);
        });
    });
}
class ExtensionEnv {
}
exports.ExtensionEnv = ExtensionEnv;
ExtensionEnv.produceEnv = (sender, routerMeta) => {
    const isInternalMsg = ExtensionEnv.checkIsInternalMessage(sender, browser.runtime.id, browser.runtime.getURL("/"));
    // Add additional query string for letting the extension know it is for interaction.
    const queryString = `interaction=true&interactionInternal=${isInternalMsg}`;
    const openAndSendMsg = (url, msg, options) => __awaiter(void 0, void 0, void 0, function* () {
        if (url.startsWith("/")) {
            url = url.slice(1);
        }
        url = browser.runtime.getURL("/popup.html#/" + url);
        url += `${url.includes("?") ? "&" : "?"}${queryString}`;
        let tabId;
        const windowId = yield openPopupWindow(url, options === null || options === void 0 ? void 0 : options.channel);
        if (!popup_1.isMobileStatus()) {
            const window = yield browser.windows.get(windowId, {
                populate: true,
            });
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tabId = window.tabs[0].id;
        }
        else {
            tabId = windowId;
        }
        // Wait until that tab is loaded
        yield (() => __awaiter(void 0, void 0, void 0, function* () {
            const tab = yield browser.tabs.get(tabId);
            if (tab.status === "complete") {
                console.log("openAndSendMsg-complete");
                return;
            }
            return new Promise((resolve) => {
                browser.tabs.onUpdated.addListener((_tabId, changeInfo) => {
                    if (tabId === _tabId && changeInfo.status === "complete") {
                        console.log("openAndSendMsg");
                        resolve();
                    }
                });
            });
        }))();
        return yield requester_1.InExtensionMessageRequester.sendMessageToTab(tabId, router_1.APP_PORT, msg);
    });
    if (!isInternalMsg) {
        // If msg is from external (probably from webpage), it opens the popup for extension and send the msg back to the tab opened.
        return {
            isInternalMsg,
            requestInteraction: openAndSendMsg,
        };
    }
    else {
        // If msg is from the extension itself, it can send the msg back to the extension itself.
        // In this case, this expects that there is only one extension popup have been opened.
        const requestInteraction = (url, msg, options) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (options === null || options === void 0 ? void 0 : options.forceOpenWindow) {
                return yield openAndSendMsg(url, msg, options);
            }
            if (url.startsWith("/")) {
                url = url.slice(1);
            }
            url = browser.runtime.getURL("/popup.html#/" + url);
            if (url.includes("?")) {
                url += "&" + queryString;
            }
            else {
                url += "?" + queryString;
            }
            if ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) {
                let tabs = yield browser.tabs.query({
                    discarded: false,
                    status: "complete",
                });
                tabs = tabs.filter((val) => val.url && val.url.indexOf(browser.runtime.id) > -1);
                if (tabs.length > 0) {
                    for (const tab of tabs) {
                        if (tab.id) {
                            browser.tabs.update(tab.id, {
                                url,
                            });
                        }
                    }
                }
            }
            // const backgroundPage = await browser.runtime.getBackgroundPage();
            // const views = browser.extension
            //   .getViews({
            //     // Request only for the same tab as the requested frontend.
            //     // But the browser popup itself has no information about tab.
            //     // Also, if user has multiple windows on, we need another way to distinguish them.
            //     // See the comment right below this part.
            //     tabId: sender.tab?.id,
            //   })
            //   .filter((window) => {
            //     // You need to request interaction with the frontend that requested the message.
            //     // It is difficult to achieve this with the browser api alone.
            //     // Check the router id under the window of each view
            //     // and process only the view that has the same router id of the requested frontend.
            //     return (
            //       window.location.href !== backgroundPage.location.href &&
            //       (routerMeta.routerId == null ||
            //         routerMeta.routerId === window.keplrExtensionRouterId)
            //     );
            //   });
            // if (views.length > 0) {
            //   for (const view of views) {
            //     view.location.href = url;
            //   }
            // }
            msg.routerMeta = Object.assign(Object.assign({}, msg.routerMeta), { receiverRouterId: routerMeta.routerId });
            return yield new requester_1.InExtensionMessageRequester().sendMessage(router_1.APP_PORT, msg);
        });
        return {
            isInternalMsg,
            requestInteraction,
        };
    }
};
ExtensionEnv.checkIsInternalMessage = (sender, extensionId, extensionUrl) => {
    if (!sender.url) {
        throw new Error("Empty sender url");
    }
    const url = new URL(sender.url);
    if (!url.origin || url.origin === "null") {
        throw new Error("Invalid sender url");
    }
    const browserURL = new URL(extensionUrl);
    if (!browserURL.origin || browserURL.origin === "null") {
        throw new Error("Invalid browser url");
    }
    if (url.origin !== browserURL.origin) {
        return false;
    }
    return sender.id === extensionId;
};
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 590:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentScriptEnv = void 0;
// ContentScriptEnv only checks the id is same as the extension id.
// And, doesn't support the request interaction.
class ContentScriptEnv {
}
exports.ContentScriptEnv = ContentScriptEnv;
ContentScriptEnv.produceEnv = (sender) => {
    const isInternalMsg = sender.id === browser.runtime.id;
    return {
        isInternalMsg,
        requestInteraction: () => {
            throw new Error("ContentScriptEnv doesn't support `requestInteraction`");
        },
    };
};
//# sourceMappingURL=content-script.js.map

/***/ }),

/***/ 592:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keplr = void 0;
const router_1 = __webpack_require__(3);
const types_1 = __webpack_require__(593);
const enigma_1 = __webpack_require__(189);
const cosmjs_1 = __webpack_require__(190);
const deepmerge_1 = __importDefault(__webpack_require__(167));
const long_1 = __importDefault(__webpack_require__(7));
const buffer_1 = __webpack_require__(4);
const mises_1 = __webpack_require__(191);
class Keplr {
    constructor(version, mode, requester) {
        this.version = version;
        this.mode = mode;
        this.requester = requester;
        this.enigmaUtils = new Map();
        this.defaultOptions = {};
    }
    isUnlocked() {
        return __awaiter(this, void 0, void 0, function* () {
            // return true;
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.IsUnlockMsg());
        });
    }
    enable(chainIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof chainIds === "string") {
                chainIds = [chainIds];
            }
            yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.EnableAccessMsg(chainIds));
        });
    }
    experimentalSuggestChain(chainInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chainInfo.gasPriceStep) {
                // Gas price step in ChainInfo is legacy format.
                // Try to change the recent format for backward-compatibility.
                const gasPriceStep = Object.assign({}, chainInfo.gasPriceStep);
                for (const feeCurrency of chainInfo.feeCurrencies) {
                    if (!feeCurrency.gasPriceStep) {
                        feeCurrency.gasPriceStep = gasPriceStep;
                    }
                }
                delete chainInfo.gasPriceStep;
                console.warn("The `gasPriceStep` field of the `ChainInfo` has been moved under `feeCurrencies`. This is automatically handled as of right now, but the upcoming update would potentially cause errors.");
            }
            const msg = new types_1.SuggestChainInfoMsg(chainInfo);
            yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    getKey(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.GetKeyMsg(chainId);
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    sendTx(chainId, tx, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.SendTxMsg(chainId, tx, mode);
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    signAmino(chainId, signer, signDoc, signOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.RequestSignAminoMsg(chainId, signer, signDoc, deepmerge_1.default((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions));
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    signDirect(chainId, signer, signDoc, signOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.RequestSignDirectMsg(chainId, signer, {
                bodyBytes: signDoc.bodyBytes,
                authInfoBytes: signDoc.authInfoBytes,
                chainId: signDoc.chainId,
                accountNumber: signDoc.accountNumber
                    ? signDoc.accountNumber.toString()
                    : null,
            }, deepmerge_1.default((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions));
            const response = yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
            return {
                signed: {
                    bodyBytes: response.signed.bodyBytes,
                    authInfoBytes: response.signed.authInfoBytes,
                    chainId: response.signed.chainId,
                    accountNumber: long_1.default.fromString(response.signed.accountNumber),
                },
                signature: response.signature,
            };
        });
    }
    signArbitrary(chainId, signer, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let isADR36WithString;
            [data, isADR36WithString] = this.getDataForADR36(data);
            const signDoc = this.getADR36SignDoc(signer, data);
            const msg = new types_1.RequestSignAminoMsg(chainId, signer, signDoc, {
                isADR36WithString,
            });
            return (yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg)).signature;
        });
    }
    verifyArbitrary(chainId, signer, data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof data === "string") {
                data = buffer_1.Buffer.from(data);
            }
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.RequestVerifyADR36AminoSignDoc(chainId, signer, data, signature));
        });
    }
    signEthereum(chainId, signer, data, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let isADR36WithString;
            [data, isADR36WithString] = this.getDataForADR36(data);
            const signDoc = this.getADR36SignDoc(signer, data);
            if (data === "") {
                throw new Error("Signing empty data is not supported.");
            }
            const msg = new types_1.RequestSignAminoMsg(chainId, signer, signDoc, {
                isADR36WithString,
                ethSignType: type,
            });
            const signature = (yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg))
                .signature;
            return buffer_1.Buffer.from(signature.signature, "base64");
        });
    }
    getOfflineSigner(chainId) {
        return new cosmjs_1.CosmJSOfflineSigner(chainId, this);
    }
    getOfflineSignerOnlyAmino(chainId) {
        return new cosmjs_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
    }
    getOfflineSignerAuto(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getKey(chainId);
            if (key.isNanoLedger) {
                return new cosmjs_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
            }
            return new cosmjs_1.CosmJSOfflineSigner(chainId, this);
        });
    }
    suggestToken(chainId, contractAddress, viewingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.SuggestTokenMsg(chainId, contractAddress, viewingKey);
            yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    getSecret20ViewingKey(chainId, contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.GetSecret20ViewingKey(chainId, contractAddress);
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    getEnigmaPubKey(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.GetPubkeyMsg(chainId));
        });
    }
    getEnigmaTxEncryptionKey(chainId, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.GetTxEncryptionKeyMsg(chainId, nonce));
        });
    }
    enigmaEncrypt(chainId, contractCodeHash, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.ReqeustEncryptMsg(chainId, contractCodeHash, msg));
        });
    }
    enigmaDecrypt(chainId, ciphertext, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ciphertext || ciphertext.length === 0) {
                return new Uint8Array();
            }
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.RequestDecryptMsg(chainId, ciphertext, nonce));
        });
    }
    getEnigmaUtils(chainId) {
        if (this.enigmaUtils.has(chainId)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.enigmaUtils.get(chainId);
        }
        const enigmaUtils = new enigma_1.KeplrEnigmaUtils(chainId, this);
        this.enigmaUtils.set(chainId, enigmaUtils);
        return enigmaUtils;
    }
    experimentalSignEIP712CosmosTx_v0(chainId, signer, eip712, signDoc, signOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const msg = new types_1.RequestSignEIP712CosmosTxMsg_v0(chainId, signer, eip712, signDoc, deepmerge_1.default((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions));
            return yield this.requester.sendMessage(router_1.BACKGROUND_PORT, msg);
        });
    }
    getDataForADR36(data) {
        let isADR36WithString = false;
        if (typeof data === "string") {
            data = buffer_1.Buffer.from(data).toString("base64");
            isADR36WithString = true;
        }
        else {
            data = buffer_1.Buffer.from(data).toString("base64");
        }
        return [data, isADR36WithString];
    }
    getADR36SignDoc(signer, data) {
        return {
            chain_id: "",
            account_number: "0",
            sequence: "0",
            fee: {
                gas: "0",
                amount: [],
            },
            msgs: [
                {
                    type: "sign/MsgSignData",
                    value: {
                        signer,
                        data,
                    },
                },
            ],
            memo: "",
        };
    }
    misesWeb3Client() {
        return new mises_1.MisesWeb3Client(this);
    }
    misesAccount() {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.MisesAccountMsg());
    }
    hasWalletAccount() {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.HasWalletAccountMsg());
    }
    openWallet() {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.OpenWalletMsg());
    }
    disconnect(params) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.DisconnectMsg(params));
    }
    connect(params) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.ConnectMsg(params));
    }
    userFollow(toUid) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.UserFollowMsg(toUid));
    }
    userUnFollow(toUid) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.UserUnFollowMsg(toUid));
    }
    setUserInfo(params) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.SetUserInfoMsg(params));
    }
    staking(params) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.StakingMsg(params));
    }
    verifyDomain(params) {
        return this.requester.sendMessage(router_1.BACKGROUND_PORT, new types_1.VerifyDomainMsg(params));
    }
}
exports.Keplr = Keplr;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 593:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(594), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 594:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyDomainMsg = exports.OpenWalletMsg = exports.StakingMsg = exports.SetUserInfoMsg = exports.UserUnFollowMsg = exports.UserFollowMsg = exports.ConnectMsg = exports.DisconnectMsg = exports.HasWalletAccountMsg = exports.MisesAccountMsg = exports.IsUnlockMsg = exports.GetTxEncryptionKeyMsg = exports.RequestDecryptMsg = exports.ReqeustEncryptMsg = exports.GetPubkeyMsg = exports.RequestSignDirectMsg = exports.RequestVerifyADR36AminoSignDoc = exports.RequestSignEIP712CosmosTxMsg_v0 = exports.RequestSignAminoMsg = exports.GetSecret20ViewingKey = exports.SendTxMsg = exports.SuggestTokenMsg = exports.SuggestChainInfoMsg = exports.GetKeyMsg = exports.EnableAccessMsg = void 0;
const router_1 = __webpack_require__(3);
class EnableAccessMsg extends router_1.Message {
    constructor(chainIds) {
        super();
        this.chainIds = chainIds;
    }
    static type() {
        return "enable-access";
    }
    validateBasic() {
        if (!this.chainIds || this.chainIds.length === 0) {
            throw new Error("chain id not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "permission";
    }
    type() {
        return EnableAccessMsg.type();
    }
}
exports.EnableAccessMsg = EnableAccessMsg;
class GetKeyMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "get-key";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
    }
    route() {
        return "keyring";
    }
    type() {
        return GetKeyMsg.type();
    }
}
exports.GetKeyMsg = GetKeyMsg;
class SuggestChainInfoMsg extends router_1.Message {
    constructor(chainInfo) {
        super();
        this.chainInfo = chainInfo;
    }
    static type() {
        return "suggest-chain-info";
    }
    validateBasic() {
        if (!this.chainInfo) {
            throw new Error("chain info not set");
        }
    }
    route() {
        return "chains";
    }
    type() {
        return SuggestChainInfoMsg.type();
    }
}
exports.SuggestChainInfoMsg = SuggestChainInfoMsg;
class SuggestTokenMsg extends router_1.Message {
    constructor(chainId, contractAddress, viewingKey) {
        super();
        this.chainId = chainId;
        this.contractAddress = contractAddress;
        this.viewingKey = viewingKey;
    }
    static type() {
        return "suggest-token";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("Chain id is empty");
        }
        if (!this.contractAddress) {
            throw new Error("Contract address is empty");
        }
    }
    route() {
        return "tokens";
    }
    type() {
        return SuggestTokenMsg.type();
    }
}
exports.SuggestTokenMsg = SuggestTokenMsg;
// Return the tx hash
class SendTxMsg extends router_1.Message {
    constructor(chainId, tx, mode) {
        super();
        this.chainId = chainId;
        this.tx = tx;
        this.mode = mode;
    }
    static type() {
        return "send-tx-to-background";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id is empty");
        }
        if (!this.tx) {
            throw new Error("tx is empty");
        }
        if (!this.mode ||
            (this.mode !== "sync" && this.mode !== "async" && this.mode !== "block")) {
            throw new Error("invalid mode");
        }
    }
    route() {
        return "background-tx";
    }
    type() {
        return SendTxMsg.type();
    }
}
exports.SendTxMsg = SendTxMsg;
class GetSecret20ViewingKey extends router_1.Message {
    constructor(chainId, contractAddress) {
        super();
        this.chainId = chainId;
        this.contractAddress = contractAddress;
    }
    static type() {
        return "get-secret20-viewing-key";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("Chain id is empty");
        }
        if (!this.contractAddress) {
            throw new Error("Contract address is empty");
        }
    }
    route() {
        return "tokens";
    }
    type() {
        return GetSecret20ViewingKey.type();
    }
}
exports.GetSecret20ViewingKey = GetSecret20ViewingKey;
class RequestSignAminoMsg extends router_1.Message {
    constructor(chainId, signer, signDoc, signOptions = {}) {
        super();
        this.chainId = chainId;
        this.signer = signer;
        this.signDoc = signDoc;
        this.signOptions = signOptions;
    }
    static type() {
        return "request-sign-amino";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.signer) {
            throw new Error("signer not set");
        }
        // It is not important to check this on the client side as opposed to increasing the bundle size.
        // Validate bech32 address.
        // Bech32Address.validate(this.signer);
        const signDoc = this.signDoc;
        // Check that the sign doc is for ADR-36,
        // the validation should be performed on the background.
        const hasOnlyMsgSignData = (() => {
            if (signDoc &&
                signDoc.msgs &&
                Array.isArray(signDoc.msgs) &&
                signDoc.msgs.length === 1) {
                const msg = signDoc.msgs[0];
                return msg.type === "sign/MsgSignData";
            }
            else {
                return false;
            }
        })();
        // If the sign doc is expected to be for ADR-36,
        // it doesn't have to have the chain id in the sign doc.
        if (!hasOnlyMsgSignData && signDoc.chain_id !== this.chainId) {
            throw new Error("Chain id in the message is not matched with the requested chain id");
        }
        if (!this.signOptions) {
            throw new Error("Sign options are null");
        }
    }
    route() {
        return "keyring";
    }
    type() {
        return RequestSignAminoMsg.type();
    }
}
exports.RequestSignAminoMsg = RequestSignAminoMsg;
class RequestSignEIP712CosmosTxMsg_v0 extends router_1.Message {
    constructor(chainId, signer, eip712, signDoc, signOptions) {
        super();
        this.chainId = chainId;
        this.signer = signer;
        this.eip712 = eip712;
        this.signDoc = signDoc;
        this.signOptions = signOptions;
    }
    static type() {
        return "request-sign-eip-712-cosmos-tx-v0";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.signer) {
            throw new Error("signer not set");
        }
        if (this.signDoc.chain_id !== this.chainId) {
            throw new Error("Chain id in the message is not matched with the requested chain id");
        }
        if (!this.signOptions) {
            throw new Error("Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "keyring";
    }
    type() {
        return RequestSignEIP712CosmosTxMsg_v0.type();
    }
}
exports.RequestSignEIP712CosmosTxMsg_v0 = RequestSignEIP712CosmosTxMsg_v0;
class RequestVerifyADR36AminoSignDoc extends router_1.Message {
    constructor(chainId, signer, data, signature) {
        super();
        this.chainId = chainId;
        this.signer = signer;
        this.data = data;
        this.signature = signature;
    }
    static type() {
        return "request-verify-adr-36-amino-doc";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.signer) {
            throw new Error("signer not set");
        }
        if (!this.signature) {
            throw new Error("Signature not set");
        }
        // It is not important to check this on the client side as opposed to increasing the bundle size.
        // Validate bech32 address.
        // Bech32Address.validate(this.signer);
    }
    route() {
        return "keyring";
    }
    type() {
        return RequestVerifyADR36AminoSignDoc.type();
    }
}
exports.RequestVerifyADR36AminoSignDoc = RequestVerifyADR36AminoSignDoc;
class RequestSignDirectMsg extends router_1.Message {
    constructor(chainId, signer, signDoc, signOptions = {}) {
        super();
        this.chainId = chainId;
        this.signer = signer;
        this.signDoc = signDoc;
        this.signOptions = signOptions;
    }
    static type() {
        return "request-sign-direct";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.signer) {
            throw new Error("signer not set");
        }
        // It is not important to check this on the client side as opposed to increasing the bundle size.
        // Validate bech32 address.
        // Bech32Address.validate(this.signer);
        // const signDoc = cosmos.tx.v1beta1.SignDoc.create({
        //   bodyBytes: this.signDoc.bodyBytes,
        //   authInfoBytes: this.signDoc.authInfoBytes,
        //   chainId: this.signDoc.chainId,
        //   accountNumber: this.signDoc.accountNumber
        //     ? Long.fromString(this.signDoc.accountNumber)
        //     : undefined,
        // });
        //
        // if (signDoc.chainId !== this.chainId) {
        //   throw new Error(
        //     "Chain id in the message is not matched with the requested chain id"
        //   );
        // }
        if (!this.signOptions) {
            throw new Error("Sign options are null");
        }
    }
    route() {
        return "keyring";
    }
    type() {
        return RequestSignDirectMsg.type();
    }
}
exports.RequestSignDirectMsg = RequestSignDirectMsg;
class GetPubkeyMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "get-pubkey-msg";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
    }
    route() {
        return "secret-wasm";
    }
    type() {
        return GetPubkeyMsg.type();
    }
}
exports.GetPubkeyMsg = GetPubkeyMsg;
class ReqeustEncryptMsg extends router_1.Message {
    constructor(chainId, contractCodeHash, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    msg) {
        super();
        this.chainId = chainId;
        this.contractCodeHash = contractCodeHash;
        this.msg = msg;
    }
    static type() {
        return "request-encrypt-msg";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.contractCodeHash) {
            throw new Error("contract code hash not set");
        }
        if (!this.msg) {
            throw new Error("msg not set");
        }
    }
    route() {
        return "secret-wasm";
    }
    type() {
        return ReqeustEncryptMsg.type();
    }
}
exports.ReqeustEncryptMsg = ReqeustEncryptMsg;
class RequestDecryptMsg extends router_1.Message {
    constructor(chainId, cipherText, nonce) {
        super();
        this.chainId = chainId;
        this.cipherText = cipherText;
        this.nonce = nonce;
    }
    static type() {
        return "request-decrypt-msg";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.cipherText || this.cipherText.length === 0) {
            throw new Error("ciphertext not set");
        }
        if (!this.nonce || this.nonce.length === 0) {
            throw new Error("nonce not set");
        }
    }
    route() {
        return "secret-wasm";
    }
    type() {
        return RequestDecryptMsg.type();
    }
}
exports.RequestDecryptMsg = RequestDecryptMsg;
class GetTxEncryptionKeyMsg extends router_1.Message {
    constructor(chainId, nonce) {
        super();
        this.chainId = chainId;
        this.nonce = nonce;
    }
    static type() {
        return "get-tx-encryption-key-msg";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new Error("chain id not set");
        }
        if (!this.nonce) {
            // Nonce of zero length is permitted.
            throw new Error("nonce is null");
        }
    }
    route() {
        return "secret-wasm";
    }
    type() {
        return GetTxEncryptionKeyMsg.type();
    }
}
exports.GetTxEncryptionKeyMsg = GetTxEncryptionKeyMsg;
class IsUnlockMsg extends router_1.Message {
    static type() {
        return "isUnlocked";
    }
    constructor() {
        super();
    }
    validateBasic() {
        //noop
    }
    approveExternal() {
        return true;
    }
    route() {
        return "keyring";
    }
    type() {
        return IsUnlockMsg.type();
    }
}
exports.IsUnlockMsg = IsUnlockMsg;
class MisesAccountMsg extends router_1.Message {
    static type() {
        return "mises-account";
    }
    constructor() {
        super();
    }
    validateBasic() {
        //noop
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return MisesAccountMsg.type();
    }
}
exports.MisesAccountMsg = MisesAccountMsg;
class HasWalletAccountMsg extends router_1.Message {
    static type() {
        return "has-wallet-account";
    }
    constructor() {
        super();
    }
    validateBasic() {
        //noop
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return HasWalletAccountMsg.type();
    }
}
exports.HasWalletAccountMsg = HasWalletAccountMsg;
class DisconnectMsg extends router_1.Message {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "disconnect";
    }
    validateBasic() {
        if (!this.params.appid) {
            throw new Error("appid is empty");
        }
        if (!this.params.userid) {
            throw new Error("userid is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return DisconnectMsg.type();
    }
}
exports.DisconnectMsg = DisconnectMsg;
class ConnectMsg extends router_1.Message {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "connect";
    }
    validateBasic() {
        if (!this.params.appid) {
            throw new Error("appid is empty");
        }
        if (!this.params.userid) {
            throw new Error("userid is empty");
        }
        if (!this.params.domain) {
            throw new Error("domain is empty");
        }
        if (!this.params.permissions) {
            throw new Error("permissions is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return ConnectMsg.type();
    }
}
exports.ConnectMsg = ConnectMsg;
class UserFollowMsg extends router_1.Message {
    constructor(toUid) {
        super();
        this.toUid = toUid;
    }
    static type() {
        return "userFollow";
    }
    validateBasic() {
        if (!this.toUid) {
            throw new Error("toUid is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return UserFollowMsg.type();
    }
}
exports.UserFollowMsg = UserFollowMsg;
class UserUnFollowMsg extends router_1.Message {
    constructor(toUid) {
        super();
        this.toUid = toUid;
    }
    static type() {
        return "userUnFollow";
    }
    validateBasic() {
        if (!this.toUid) {
            throw new Error("toUid is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return UserUnFollowMsg.type();
    }
}
exports.UserUnFollowMsg = UserUnFollowMsg;
class SetUserInfoMsg extends router_1.Message {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "set-user-info";
    }
    validateBasic() {
        if (!this.params) {
            throw new Error("params is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return SetUserInfoMsg.type();
    }
}
exports.SetUserInfoMsg = SetUserInfoMsg;
class StakingMsg extends router_1.Message {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "staking";
    }
    validateBasic() {
        if (!this.params) {
            throw new Error("params is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises";
    }
    type() {
        return StakingMsg.type();
    }
}
exports.StakingMsg = StakingMsg;
class OpenWalletMsg extends router_1.Message {
    static type() {
        return "open-wallet";
    }
    constructor() {
        super();
    }
    approveExternal() {
        return true;
    }
    validateBasic() {
        //noop
    }
    route() {
        return "mises";
    }
    type() {
        return OpenWalletMsg.type();
    }
}
exports.OpenWalletMsg = OpenWalletMsg;
class VerifyDomainMsg extends router_1.Message {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "verify-domain";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
    }
    approveExternal() {
        return true;
    }
    route() {
        return "mises-safe";
    }
    type() {
        return VerifyDomainMsg.type();
    }
}
exports.VerifyDomainMsg = VerifyDomainMsg;
//# sourceMappingURL=msgs.js.map

/***/ }),

/***/ 595:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectedKeplr = exports.injectKeplrToWindow = void 0;
const router_1 = __webpack_require__(3);
const enigma_1 = __webpack_require__(189);
const cosmjs_1 = __webpack_require__(190);
const deepmerge_1 = __importDefault(__webpack_require__(167));
const long_1 = __importDefault(__webpack_require__(7));
const mises_1 = __webpack_require__(191);
function defineUnwritablePropertyIfPossible(o, p, value) {
    const descriptor = Object.getOwnPropertyDescriptor(o, p);
    if (!descriptor || descriptor.writable) {
        if (!descriptor || descriptor.configurable) {
            Object.defineProperty(o, p, {
                value,
                writable: false,
            });
        }
        else {
            o[p] = value;
        }
    }
    else {
        console.warn(`Failed to inject ${p} from keplr. Probably, other wallet is trying to intercept Keplr`);
    }
}
const __getLargeImg = () => {
    let img;
    const nodeList = document.getElementsByTagName("img");
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        let h = node.naturalHeight;
        let w = node.naturalWidth;
        if (h === 0 || w === 0) {
            h = node.height;
            w = node.width;
        }
        if (h >= 200 && w >= 300) {
            img = nodeList[i];
            if (img && img.src && img.src.toLowerCase().startsWith("http")) {
                break;
            }
        }
    }
    return img && img.src;
};
const __getFavicon = () => {
    let favicon;
    const nodeList = document.getElementsByTagName("link");
    for (let i = 0; i < nodeList.length; i++) {
        const rel = nodeList[i].getAttribute("rel");
        if (rel === "icon" ||
            rel === "shortcut icon" ||
            rel === "icon shortcut" ||
            rel === "apple-touch-icon") {
            favicon = nodeList[i];
        }
    }
    return favicon && favicon.href;
};
function injectKeplrToWindow(keplr) {
    defineUnwritablePropertyIfPossible(window, "misesWallet", keplr);
    defineUnwritablePropertyIfPossible(window, "misesModule", {
        getWindowInformation() {
            // const config = window.$misesShare;
            const url = window.location.href;
            const icon = __getLargeImg() || __getFavicon();
            const { title } = window.document;
            console.log({ url, icon, title });
            return { url, icon, title };
        },
    });
    defineUnwritablePropertyIfPossible(window, "getOfflineSigner", keplr.getOfflineSigner);
    defineUnwritablePropertyIfPossible(window, "getOfflineSignerOnlyAmino", keplr.getOfflineSignerOnlyAmino);
    defineUnwritablePropertyIfPossible(window, "getOfflineSignerAuto", keplr.getOfflineSignerAuto);
    defineUnwritablePropertyIfPossible(window, "getEnigmaUtils", keplr.getEnigmaUtils);
    defineUnwritablePropertyIfPossible(window, "MisesWeb3Client", keplr.misesWeb3Client);
}
exports.injectKeplrToWindow = injectKeplrToWindow;
/**
 * InjectedKeplr would be injected to the webpage.
 * In the webpage, it can't request any messages to the extension because it doesn't have any API related to the extension.
 * So, to request some methods of the extension, this will proxy the request to the content script that is injected to webpage on the extension level.
 * This will use `window.postMessage` to interact with the content script.
 */
class InjectedKeplr {
    constructor(version, mode, eventListener = {
        addMessageListener: (fn) => window.addEventListener("message", fn),
        removeMessageListener: (fn) => window.removeEventListener("message", fn),
        postMessage: (message) => window.postMessage(message, window.location.origin),
    }, parseMessage) {
        this.version = version;
        this.mode = mode;
        this.eventListener = eventListener;
        this.parseMessage = parseMessage;
        this.enigmaUtils = new Map();
        this.defaultOptions = {};
        // Freeze fields/method except for "defaultOptions"
        // Intentionally, "defaultOptions" can be mutated to allow a webpage to change the options with cosmjs usage.
        // Freeze fields
        const fieldNames = Object.keys(this);
        for (const fieldName of fieldNames) {
            if (fieldName !== "defaultOptions") {
                Object.defineProperty(this, fieldName, {
                    value: this[fieldName],
                    writable: false,
                });
            }
            // If field is "eventListener", try to iterate one-level deep.
            if (fieldName === "eventListener") {
                const fieldNames = Object.keys(this.eventListener);
                for (const fieldName of fieldNames) {
                    Object.defineProperty(this.eventListener, fieldName, {
                        value: this.eventListener[fieldName],
                        writable: false,
                    });
                }
            }
        }
        // Freeze methods
        const methodNames = Object.getOwnPropertyNames(InjectedKeplr.prototype);
        for (const methodName of methodNames) {
            if (methodName !== "constructor" &&
                typeof this[methodName] === "function") {
                Object.defineProperty(this, methodName, {
                    value: this[methodName].bind(this),
                    writable: false,
                });
            }
        }
    }
    static startProxy(keplr, eventListener = {
        addMessageListener: (fn) => window.addEventListener("message", fn),
        postMessage: (message) => window.postMessage(message, window.location.origin),
    }, parseMessage) {
        eventListener.addMessageListener((e) => __awaiter(this, void 0, void 0, function* () {
            const message = parseMessage
                ? parseMessage(e.data)
                : e.data;
            if (!message || message.type !== "mises-proxy-request") {
                return;
            }
            try {
                if (!message.id) {
                    throw new Error("Empty id");
                }
                if (message.method === "version") {
                    throw new Error("Version is not function");
                }
                if (message.method === "mode") {
                    throw new Error("Mode is not function");
                }
                if (message.method === "defaultOptions") {
                    throw new Error("DefaultOptions is not function");
                }
                if (!keplr[message.method] ||
                    typeof keplr[message.method] !== "function") {
                    throw new Error(`Invalid method: ${message.method}`);
                }
                if (message.method === "getOfflineSigner") {
                    throw new Error("GetOfflineSigner method can't be proxy request");
                }
                if (message.method === "getOfflineSignerOnlyAmino") {
                    throw new Error("GetOfflineSignerOnlyAmino method can't be proxy request");
                }
                if (message.method === "getOfflineSignerAuto") {
                    throw new Error("GetOfflineSignerAuto method can't be proxy request");
                }
                if (message.method === "getEnigmaUtils") {
                    throw new Error("GetEnigmaUtils method can't be proxy request");
                }
                const result = message.method === "signDirect"
                    ? yield (() => __awaiter(this, void 0, void 0, function* () {
                        const receivedSignDoc = message.args[2];
                        const result = yield keplr.signDirect(message.args[0], message.args[1], {
                            bodyBytes: receivedSignDoc.bodyBytes,
                            authInfoBytes: receivedSignDoc.authInfoBytes,
                            chainId: receivedSignDoc.chainId,
                            accountNumber: receivedSignDoc.accountNumber
                                ? long_1.default.fromString(receivedSignDoc.accountNumber)
                                : null,
                        }, message.args[3]);
                        return {
                            signed: {
                                bodyBytes: result.signed.bodyBytes,
                                authInfoBytes: result.signed.authInfoBytes,
                                chainId: result.signed.chainId,
                                accountNumber: result.signed.accountNumber.toString(),
                            },
                            signature: result.signature,
                        };
                    }))()
                    : yield keplr[message.method](
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    ...router_1.JSONUint8Array.unwrap(message.args));
                const proxyResponse = {
                    type: "mises-proxy-request-response",
                    id: message.id,
                    result: {
                        return: router_1.JSONUint8Array.wrap(result),
                    },
                };
                eventListener.postMessage(proxyResponse);
            }
            catch (e) {
                const proxyResponse = {
                    type: "mises-proxy-request-response",
                    id: message.id,
                    result: {
                        error: e.message || e.toString(),
                    },
                };
                eventListener.postMessage(proxyResponse);
            }
        }));
    }
    requestMethod(method, args) {
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
            args: router_1.JSONUint8Array.wrap(args),
        };
        return new Promise((resolve, reject) => {
            const receiveResponse = (e) => {
                const proxyResponse = this.parseMessage
                    ? this.parseMessage(e.data)
                    : e.data;
                if (!proxyResponse ||
                    proxyResponse.type !== "mises-proxy-request-response") {
                    return;
                }
                if (proxyResponse.id !== id) {
                    return;
                }
                this.eventListener.removeMessageListener(receiveResponse);
                const result = router_1.JSONUint8Array.unwrap(proxyResponse.result);
                if (!result) {
                    reject(new Error("Result is null"));
                    return;
                }
                if (result.error) {
                    reject(new Error(result.error));
                    return;
                }
                resolve(result.return);
            };
            this.eventListener.addMessageListener(receiveResponse);
            this.eventListener.postMessage(proxyMessage);
        });
    }
    isUnlocked() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("isUnlocked", []);
        });
    }
    enable(chainIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.requestMethod("enable", [chainIds]);
        });
    }
    experimentalSuggestChain(chainInfo) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = chainInfo.features) === null || _a === void 0 ? void 0 : _a.includes("stargate")) || ((_b = chainInfo.features) === null || _b === void 0 ? void 0 : _b.includes("no-legacy-stdTx"))) {
                console.warn("“stargate”, “no-legacy-stdTx” feature has been deprecated. The launchpad is no longer supported, thus works without the two features. We would keep the aforementioned two feature for a while, but the upcoming update would potentially cause errors. Remove the two feature.");
            }
            yield this.requestMethod("experimentalSuggestChain", [chainInfo]);
        });
    }
    getKey(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("getKey", [chainId]);
        });
    }
    sendTx(chainId, tx, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!("length" in tx)) {
                console.warn("Do not send legacy std tx via `sendTx` API. We now only support protobuf tx. The usage of legeacy std tx would throw an error in the near future.");
            }
            return yield this.requestMethod("sendTx", [chainId, tx, mode]);
        });
    }
    signAmino(chainId, signer, signDoc, signOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("signAmino", [
                chainId,
                signer,
                signDoc,
                deepmerge_1.default((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions),
            ]);
        });
    }
    signDirect(chainId, signer, signDoc, signOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.requestMethod("signDirect", [
                chainId,
                signer,
                // We can't send the `Long` with remaing the type.
                // Receiver should change the `string` to `Long`.
                {
                    bodyBytes: signDoc.bodyBytes,
                    authInfoBytes: signDoc.authInfoBytes,
                    chainId: signDoc.chainId,
                    accountNumber: signDoc.accountNumber
                        ? signDoc.accountNumber.toString()
                        : null,
                },
                deepmerge_1.default((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions),
            ]);
            const signed = result.signed;
            return {
                signed: {
                    bodyBytes: signed.bodyBytes,
                    authInfoBytes: signed.authInfoBytes,
                    chainId: signed.chainId,
                    // We can't send the `Long` with remaing the type.
                    // Sender should change the `Long` to `string`.
                    accountNumber: long_1.default.fromString(signed.accountNumber),
                },
                signature: result.signature,
            };
        });
    }
    signArbitrary(chainId, signer, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("signArbitrary", [chainId, signer, data]);
        });
    }
    verifyArbitrary(chainId, signer, data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("verifyArbitrary", [
                chainId,
                signer,
                data,
                signature,
            ]);
        });
    }
    signEthereum(chainId, signer, data, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("signEthereum", [
                chainId,
                signer,
                data,
                type,
            ]);
        });
    }
    getOfflineSigner(chainId) {
        return new cosmjs_1.CosmJSOfflineSigner(chainId, this);
    }
    getOfflineSignerOnlyAmino(chainId) {
        return new cosmjs_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
    }
    getOfflineSignerAuto(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getKey(chainId);
            if (key.isNanoLedger) {
                return new cosmjs_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
            }
            return new cosmjs_1.CosmJSOfflineSigner(chainId, this);
        });
    }
    suggestToken(chainId, contractAddress, viewingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("suggestToken", [
                chainId,
                contractAddress,
                viewingKey,
            ]);
        });
    }
    getSecret20ViewingKey(chainId, contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("getSecret20ViewingKey", [
                chainId,
                contractAddress,
            ]);
        });
    }
    getEnigmaPubKey(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("getEnigmaPubKey", [chainId]);
        });
    }
    getEnigmaTxEncryptionKey(chainId, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("getEnigmaTxEncryptionKey", [
                chainId,
                nonce,
            ]);
        });
    }
    enigmaEncrypt(chainId, contractCodeHash, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("enigmaEncrypt", [
                chainId,
                contractCodeHash,
                msg,
            ]);
        });
    }
    enigmaDecrypt(chainId, ciphertext, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("enigmaDecrypt", [
                chainId,
                ciphertext,
                nonce,
            ]);
        });
    }
    getEnigmaUtils(chainId) {
        if (this.enigmaUtils.has(chainId)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.enigmaUtils.get(chainId);
        }
        const enigmaUtils = new enigma_1.KeplrEnigmaUtils(chainId, this);
        this.enigmaUtils.set(chainId, enigmaUtils);
        return enigmaUtils;
    }
    experimentalSignEIP712CosmosTx_v0(chainId, signer, eip712, signDoc, signOptions = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.requestMethod("experimentalSignEIP712CosmosTx_v0", [
                chainId,
                signer,
                eip712,
                signDoc,
                deepmerge_1.default((_a = this.defaultOptions.sign) !== null && _a !== void 0 ? _a : {}, signOptions),
            ]);
        });
    }
    misesWeb3Client() {
        return new mises_1.MisesWeb3Client(this);
    }
    misesAccount() {
        return this.requestMethod("misesAccount", []);
    }
    hasWalletAccount() {
        return this.requestMethod("hasWalletAccount", []);
    }
    openWallet() {
        return this.requestMethod("openWallet", []);
    }
    disconnect(params) {
        return this.requestMethod("disconnect", [params]);
    }
    connect(params) {
        return this.requestMethod("connect", [params]);
    }
    userFollow(toUid) {
        return this.requestMethod("userFollow", [toUid]);
    }
    userUnFollow(toUid) {
        return this.requestMethod("userUnFollow", [toUid]);
    }
    setUserInfo(params) {
        return this.requestMethod("setUserInfo", [params]);
    }
    staking(params) {
        return this.requestMethod("staking", [params]);
    }
    verifyDomain(params) {
        console.log(params);
        return Promise.resolve();
        // return this.requestMethod<any>("verifyDomain", [params]);
    }
}
exports.InjectedKeplr = InjectedKeplr;
//# sourceMappingURL=inject.js.map

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};


/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ })

/******/ });