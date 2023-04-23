(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

/***/ 1019:
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
__exportStar(__webpack_require__(518), exports);
__exportStar(__webpack_require__(1020), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1020:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(333);
const constants_1 = __webpack_require__(519);
const handler_1 = __webpack_require__(1021);
function init(router, service) {
    router.registerMessage(messages_1.SetPersistentMemoryMsg);
    router.registerMessage(messages_1.GetPersistentMemoryMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1021:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const messages_1 = __webpack_require__(333);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.SetPersistentMemoryMsg:
                return handleSetPersistentMemoryMsg(service)(env, msg);
            case messages_1.GetPersistentMemoryMsg:
                return service.get();
            default:
                throw new Error("Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleSetPersistentMemoryMsg = (service) => (_, msg) => {
    service.set(msg.data);
    return {
        success: true,
    };
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1022:
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
__exportStar(__webpack_require__(520), exports);
__exportStar(__webpack_require__(1023), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1023:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(228);
const constants_1 = __webpack_require__(522);
const handler_1 = __webpack_require__(1024);
function init(router, service) {
    router.registerMessage(messages_1.GetChainInfosMsg);
    router.registerMessage(messages_1.SuggestChainInfoMsg);
    router.registerMessage(messages_1.RemoveSuggestedChainInfoMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1024:
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
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(228);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.GetChainInfosMsg:
                return handleGetChainInfosMsg(service)(env, msg);
            case messages_1.SuggestChainInfoMsg:
                return handleSuggestChainInfoMsg(service)(env, msg);
            case messages_1.RemoveSuggestedChainInfoMsg:
                return handleRemoveSuggestedChainInfoMsg(service)(env, msg);
            default:
                throw new router_1.KeplrError("chains", 110, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleGetChainInfosMsg = (service) => {
    return () => __awaiter(void 0, void 0, void 0, function* () {
        const chainInfos = yield service.getChainInfos();
        return {
            chainInfos,
        };
    });
};
const handleSuggestChainInfoMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (yield service.hasChainInfo(msg.chainInfo.chainId)) {
            // If suggested chain info is already registered, just return.
            return;
        }
        const chainInfo = msg.chainInfo;
        // And, always handle it as beta.
        chainInfo.beta = true;
        yield service.suggestChainInfo(env, chainInfo, msg.origin);
    });
};
const handleRemoveSuggestedChainInfoMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.removeChainInfo(msg.chainId);
        return yield service.getChainInfos();
    });
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1025:
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
__exportStar(__webpack_require__(527), exports);
__exportStar(__webpack_require__(1041), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1026:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Crypto = void 0;
const aes_js_1 = __importStar(__webpack_require__(194));
const crypto_1 = __webpack_require__(51);
const pbkdf2_1 = __importDefault(__webpack_require__(377));
const buffer_1 = __webpack_require__(4);
const router_1 = __webpack_require__(3);
class Crypto {
    static encrypt(crypto, kdf, type, text, password, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let random = new Uint8Array(32);
            const salt = buffer_1.Buffer.from(yield crypto.rng(random)).toString("hex");
            const scryptParams = {
                salt,
                dklen: 32,
                n: 32768,
                r: 8,
                p: 1,
            };
            random = new Uint8Array(16);
            const iv = buffer_1.Buffer.from(yield crypto.rng(random));
            // If the mnemonic is not imported, there will be no mnemonic content
            if (!text && !password && type === "mnemonic") {
                return {
                    version: "1.2",
                    type,
                    coinTypeForChain: {},
                    bip44HDPath,
                    meta,
                    crypto: {
                        cipher: "aes-128-ctr",
                        cipherparams: {
                            iv: iv.toString("hex"),
                        },
                        ciphertext: "",
                        kdf,
                        kdfparams: scryptParams,
                        mac: "",
                    },
                };
            }
            const derivedKey = yield (() => __awaiter(this, void 0, void 0, function* () {
                switch (kdf) {
                    case "scrypt":
                        return yield crypto.scrypt(password, scryptParams);
                    case "sha256":
                        return crypto_1.Hash.sha256(buffer_1.Buffer.from(`${salt}/${password}`));
                    case "pbkdf2":
                        return new Promise((resolve, reject) => {
                            pbkdf2_1.default.pbkdf2(password, salt, 4000, 32, "sha256", (err, derivedKey) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(new Uint8Array(derivedKey));
                                }
                            });
                        });
                    default:
                        throw new router_1.KeplrError("keyring", 220, "Unknown kdf");
                }
            }))();
            const buf = buffer_1.Buffer.from(text);
            const counter = new aes_js_1.Counter(0);
            counter.setBytes(iv);
            const aesCtr = new aes_js_1.default.ModeOfOperation.ctr(derivedKey, counter);
            const ciphertext = buffer_1.Buffer.from(aesCtr.encrypt(buf));
            // Mac is sha256(last 16 bytes of derived key + ciphertext)
            const mac = crypto_1.Hash.sha256(buffer_1.Buffer.concat([
                buffer_1.Buffer.from(derivedKey.slice(derivedKey.length / 2)),
                ciphertext,
            ]));
            return {
                version: "1.2",
                type,
                coinTypeForChain: {},
                bip44HDPath,
                meta,
                crypto: {
                    cipher: "aes-128-ctr",
                    cipherparams: {
                        iv: iv.toString("hex"),
                    },
                    ciphertext: ciphertext.toString("hex"),
                    kdf,
                    kdfparams: scryptParams,
                    mac: buffer_1.Buffer.from(mac).toString("hex"),
                },
            };
        });
    }
    static decrypt(crypto, keyStore, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const derivedKey = yield (() => __awaiter(this, void 0, void 0, function* () {
                switch (keyStore.crypto.kdf) {
                    case "scrypt":
                        return yield crypto.scrypt(password, keyStore.crypto.kdfparams);
                    case "sha256":
                        return crypto_1.Hash.sha256(buffer_1.Buffer.from(`${keyStore.crypto.kdfparams.salt}/${password}`));
                    case "pbkdf2":
                        return new Promise((resolve, reject) => {
                            pbkdf2_1.default.pbkdf2(password, keyStore.crypto.kdfparams.salt, 4000, 32, "sha256", (err, derivedKey) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(new Uint8Array(derivedKey));
                                }
                            });
                        });
                    default:
                        throw new router_1.KeplrError("keyring", 220, "Unknown kdf");
                }
            }))();
            const counter = new aes_js_1.Counter(0);
            counter.setBytes(buffer_1.Buffer.from(keyStore.crypto.cipherparams.iv, "hex"));
            const aesCtr = new aes_js_1.default.ModeOfOperation.ctr(derivedKey, counter);
            const mac = crypto_1.Hash.sha256(buffer_1.Buffer.concat([
                buffer_1.Buffer.from(derivedKey.slice(derivedKey.length / 2)),
                buffer_1.Buffer.from(keyStore.crypto.ciphertext, "hex"),
            ]));
            if (!buffer_1.Buffer.from(mac).equals(buffer_1.Buffer.from(keyStore.crypto.mac, "hex"))) {
                throw new router_1.KeplrError("keyring", 222, "Unmatched mac");
            }
            return buffer_1.Buffer.from(aesCtr.decrypt(buffer_1.Buffer.from(keyStore.crypto.ciphertext, "hex")));
        });
    }
}
exports.Crypto = Crypto;
//# sourceMappingURL=crypto.js.map

/***/ }),

/***/ 1027:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var Buffer = __webpack_require__(22).Buffer

var checkParameters = __webpack_require__(528)
var defaultEncoding = __webpack_require__(529)
var sync = __webpack_require__(530)
var toBuffer = __webpack_require__(531)

var ZERO_BUF
var subtle = global.crypto && global.crypto.subtle
var toBrowser = {
  sha: 'SHA-1',
  'sha-1': 'SHA-1',
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  'sha-256': 'SHA-256',
  sha384: 'SHA-384',
  'sha-384': 'SHA-384',
  'sha-512': 'SHA-512',
  sha512: 'SHA-512'
}
var checks = []
function checkNative (algo) {
  if (global.process && !global.process.browser) {
    return Promise.resolve(false)
  }
  if (!subtle || !subtle.importKey || !subtle.deriveBits) {
    return Promise.resolve(false)
  }
  if (checks[algo] !== undefined) {
    return checks[algo]
  }
  ZERO_BUF = ZERO_BUF || Buffer.alloc(8)
  var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo)
    .then(function () {
      return true
    }).catch(function () {
      return false
    })
  checks[algo] = prom
  return prom
}
var nextTick
function getNextTick () {
  if (nextTick) {
    return nextTick
  }
  if (global.process && global.process.nextTick) {
    nextTick = global.process.nextTick
  } else if (global.queueMicrotask) {
    nextTick = global.queueMicrotask
  } else if (global.setImmediate) {
    nextTick = global.setImmediate
  } else {
    nextTick = global.setTimeout
  }
  return nextTick
}
function browserPbkdf2 (password, salt, iterations, length, algo) {
  return subtle.importKey(
    'raw', password, { name: 'PBKDF2' }, false, ['deriveBits']
  ).then(function (key) {
    return subtle.deriveBits({
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: {
        name: algo
      }
    }, key, length << 3)
  }).then(function (res) {
    return Buffer.from(res)
  })
}

function resolvePromise (promise, callback) {
  promise.then(function (out) {
    getNextTick()(function () {
      callback(null, out)
    })
  }, function (e) {
    getNextTick()(function () {
      callback(e)
    })
  })
}
module.exports = function (password, salt, iterations, keylen, digest, callback) {
  if (typeof digest === 'function') {
    callback = digest
    digest = undefined
  }

  digest = digest || 'sha1'
  var algo = toBrowser[digest.toLowerCase()]

  if (!algo || typeof global.Promise !== 'function') {
    getNextTick()(function () {
      var out
      try {
        out = sync(password, salt, iterations, keylen, digest)
      } catch (e) {
        return callback(e)
      }
      callback(null, out)
    })
    return
  }

  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')
  if (typeof callback !== 'function') throw new Error('No callback provided to pbkdf2')

  resolvePromise(checkNative(algo).then(function (resp) {
    if (resp) return browserPbkdf2(password, salt, iterations, keylen, algo)

    return sync(password, salt, iterations, keylen, digest)
  }), callback)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 1039:
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
exports.Migrator = void 0;
class Migrator {
    // run all pending migrations on meta in place
    migrateData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { migrated } = yield browser.storage.local.get();
            if (migrated && migrated.data) {
                const keyringStore = migrated.data.KeyringController || {
                    vault: "",
                };
                return keyringStore;
            }
            return {
                vault: "",
            };
        });
    }
    enCodeValut(keyringStore, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line
            const encryptor = __webpack_require__(629);
            const { vault: vaultString } = keyringStore;
            const vault = (yield encryptor.decrypt(password, vaultString));
            return vault.filter((val) => ["HD Key Tree", "Simple Key Pair"].includes(val.type));
        });
    }
    clearCache() {
        console.log("clear data");
        return browser.storage.local.set({
            migrated: "done",
        });
    }
}
exports.Migrator = Migrator;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1040:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimAminoSignDoc = void 0;
const joi_1 = __importDefault(__webpack_require__(41));
const TrimAminoSignDocScheme = joi_1.default.object({
    chain_id: joi_1.default.string().allow(""),
    account_number: joi_1.default.string().allow(""),
    sequence: joi_1.default.string().allow(""),
    fee: joi_1.default.object({
        amount: joi_1.default.array().items(joi_1.default.object({
            denom: joi_1.default.string().allow(""),
            amount: joi_1.default.string().allow(""),
        })),
        gas: joi_1.default.string().allow(""),
        payer: joi_1.default.string().allow(""),
        granter: joi_1.default.string().allow(""),
        // XXX: "feePayer" should be "payer". But, it maybe from ethermint team's mistake.
        //      That means this part is not standard.
        feePayer: joi_1.default.string().allow(""),
    }),
    msgs: joi_1.default.array().items(joi_1.default.any()),
    memo: joi_1.default.string().allow(""),
    timeout_height: joi_1.default.string().allow(""),
});
/**
 * Trim unknown fields from sign doc.
 * The purpose of this function is not validate the sign doc, but only trim unknown fields.
 * @param signDoc
 */
function trimAminoSignDoc(signDoc) {
    const res = TrimAminoSignDocScheme.validate(signDoc, {
        stripUnknown: true,
    });
    if (res.error) {
        throw res.error;
    }
    return res.value;
}
exports.trimAminoSignDoc = trimAminoSignDoc;
//# sourceMappingURL=amino-sign-doc.js.map

/***/ }),

/***/ 1041:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(336);
const constants_1 = __webpack_require__(533);
const handler_1 = __webpack_require__(1042);
function init(router, service) {
    router.registerMessage(messages_1.RestoreKeyRingMsg);
    router.registerMessage(messages_1.DeleteKeyRingMsg);
    router.registerMessage(messages_1.UpdateNameKeyRingMsg);
    router.registerMessage(messages_1.ShowKeyRingMsg);
    router.registerMessage(messages_1.CreateMnemonicKeyMsg);
    router.registerMessage(messages_1.AddMnemonicKeyMsg);
    router.registerMessage(messages_1.CreatePrivateKeyMsg);
    router.registerMessage(messages_1.AddPrivateKeyMsg);
    router.registerMessage(messages_1.LockKeyRingMsg);
    router.registerMessage(messages_1.UnlockKeyRingMsg);
    router.registerMessage(messages_1.IsUnlockMsg);
    router.registerMessage(messages_1.GetKeyMsg);
    router.registerMessage(messages_1.RequestSignAminoMsg);
    router.registerMessage(messages_1.RequestVerifyADR36AminoSignDoc);
    router.registerMessage(messages_1.RequestSignDirectMsg);
    router.registerMessage(messages_1.GetMultiKeyStoreInfoMsg);
    router.registerMessage(messages_1.ChangeKeyRingMsg);
    router.registerMessage(messages_1.GetIsKeyStoreCoinTypeSetMsg);
    router.registerMessage(messages_1.SetKeyStoreCoinTypeMsg);
    router.registerMessage(messages_1.CheckPasswordMsg);
    router.registerMessage(messages_1.ExportKeyRingDatasMsg);
    router.registerMessage(messages_1.RequestSignEIP712CosmosTxMsg_v0);
    router.registerMessage(messages_1.AddAccountMsg);
    router.registerMessage(messages_1.MigratorKeyRingMsg);
    router.registerMessage(messages_1.RestoreKeyStoreMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1042:
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
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(336);
const cosmos_1 = __webpack_require__(16);
const tx_1 = __webpack_require__(100);
const keyring_1 = __webpack_require__(229);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.RestoreKeyRingMsg:
                return handleRestoreKeyRingMsg(service)(env, msg);
            case messages_1.DeleteKeyRingMsg:
                return handleDeleteKeyRingMsg(service)(env, msg);
            case messages_1.UpdateNameKeyRingMsg:
                return handleUpdateNameKeyRingMsg(service)(env, msg);
            case messages_1.ShowKeyRingMsg:
                return handleShowKeyRingMsg(service)(env, msg);
            case messages_1.CreateMnemonicKeyMsg:
                return handleCreateMnemonicKeyMsg(service)(env, msg);
            case messages_1.AddMnemonicKeyMsg:
                return handleAddMnemonicKeyMsg(service)(env, msg);
            case messages_1.CreatePrivateKeyMsg:
                return handleCreatePrivateKeyMsg(service)(env, msg);
            case messages_1.AddPrivateKeyMsg:
                return handleAddPrivateKeyMsg(service)(env, msg);
            case messages_1.LockKeyRingMsg:
                return handleLockKeyRingMsg(service)(env, msg);
            case messages_1.UnlockKeyRingMsg:
                return handleUnlockKeyRingMsg(service)(env, msg);
            case messages_1.IsUnlockMsg:
                return handleIsUnlockMsg(service)(env, msg);
            case messages_1.GetKeyMsg:
                return handleGetKeyMsg(service)(env, msg);
            case messages_1.RequestSignAminoMsg:
                return handleRequestSignAminoMsg(service)(env, msg);
            case messages_1.RequestSignEIP712CosmosTxMsg_v0:
                return handleRequestSignEIP712CosmosTxMsg_v0(service)(env, msg);
            case messages_1.RequestVerifyADR36AminoSignDoc:
                return handleRequestVerifyADR36AminoSignDoc(service)(env, msg);
            case messages_1.RequestSignDirectMsg:
                return handleRequestSignDirectMsg(service)(env, msg);
            case messages_1.GetMultiKeyStoreInfoMsg:
                return handleGetMultiKeyStoreInfoMsg(service)(env, msg);
            case messages_1.ChangeKeyRingMsg:
                return handleChangeKeyRingMsg(service)(env, msg);
            case messages_1.GetIsKeyStoreCoinTypeSetMsg:
                return handleGetIsKeyStoreCoinTypeSetMsg(service)(env, msg);
            case messages_1.SetKeyStoreCoinTypeMsg:
                return handleSetKeyStoreCoinTypeMsg(service)(env, msg);
            case messages_1.CheckPasswordMsg:
                return handleCheckPasswordMsg(service)(env, msg);
            case messages_1.ExportKeyRingDatasMsg:
                return handleExportKeyRingDatasMsg(service)(env, msg);
            case messages_1.AddAccountMsg:
                return handleAddAccountMsg(service)(env, msg);
            case messages_1.MigratorKeyRingMsg:
                return handleMigratorKeyRing(service)(env, msg);
            case messages_1.RestoreKeyStoreMsg:
                return handleRestoreKeyStore(service)(env, msg);
            default:
                throw new router_1.KeplrError("keyring", 221, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleRestoreKeyRingMsg = (service) => {
    return (_env, _msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.restore();
    });
};
const handleDeleteKeyRingMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.deleteKeyRing(msg.index, msg.password);
    });
};
const handleUpdateNameKeyRingMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.updateNameKeyRing(msg.index, msg.name);
    });
};
const handleShowKeyRingMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.showKeyRing(msg.index, msg.password);
    });
};
const handleCreateMnemonicKeyMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.createMnemonicKey(msg.kdf, msg.mnemonic, msg.password, msg.meta, msg.bip44HDPath);
    });
};
const handleAddMnemonicKeyMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.addMnemonicKey(msg.kdf, msg.mnemonic, msg.meta, msg.bip44HDPath);
    });
};
const handleCreatePrivateKeyMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.createPrivateKey(msg.kdf, msg.privateKey, msg.password, msg.meta);
    });
};
const handleAddPrivateKeyMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.addPrivateKey(msg.kdf, msg.privateKey, msg.meta);
    });
};
const handleLockKeyRingMsg = (service) => {
    return () => {
        return {
            status: service.lock(),
        };
    };
};
const handleUnlockKeyRingMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            status: yield service.unlock(msg.password),
        };
    });
};
const handleIsUnlockMsg = (service) => {
    return () => __awaiter(void 0, void 0, void 0, function* () {
        return service.keyRingStatus === keyring_1.KeyRingStatus.UNLOCKED;
    });
};
const handleGetKeyMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        const key = yield service.getKey(msg.chainId);
        return {
            name: service.getKeyStoreMeta("name"),
            algo: "secp256k1",
            pubKey: key.pubKey,
            address: key.address,
            bech32Address: new cosmos_1.Bech32Address(key.address).toBech32((yield service.chainsService.getChainInfo(msg.chainId)).bech32Config
                .bech32PrefixAccAddr),
            isNanoLedger: false,
        };
    });
};
const handleRequestSignAminoMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        return yield service.requestSignAmino(env, msg.origin, msg.chainId, msg.signer, msg.signDoc, msg.signOptions);
    });
};
const handleRequestSignEIP712CosmosTxMsg_v0 = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        return yield service.requestSignEIP712CosmosTx_v0(env, msg.origin, msg.chainId, msg.signer, msg.eip712, msg.signDoc, msg.signOptions);
    });
};
const handleRequestVerifyADR36AminoSignDoc = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        return yield service.verifyADR36AminoSignDoc(msg.chainId, msg.signer, msg.data, msg.signature);
    });
};
const handleRequestSignDirectMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        const signDoc = tx_1.SignDoc.fromPartial({
            bodyBytes: msg.signDoc.bodyBytes,
            authInfoBytes: msg.signDoc.authInfoBytes,
            chainId: msg.signDoc.chainId,
            accountNumber: msg.signDoc.accountNumber,
        });
        const response = yield service.requestSignDirect(env, msg.origin, msg.chainId, msg.signer, signDoc, msg.signOptions);
        return {
            signed: {
                bodyBytes: response.signed.bodyBytes,
                authInfoBytes: response.signed.authInfoBytes,
                chainId: response.signed.chainId,
                accountNumber: response.signed.accountNumber.toString(),
            },
            signature: response.signature,
        };
    });
};
const handleGetMultiKeyStoreInfoMsg = (service) => {
    return () => {
        return {
            multiKeyStoreInfo: service.getMultiKeyStoreInfo(),
        };
    };
};
const handleChangeKeyRingMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.changeKeyStoreFromMultiKeyStore(msg.index);
    });
};
const handleGetIsKeyStoreCoinTypeSetMsg = (service) => {
    return (_, msg) => {
        return service.getKeyStoreBIP44Selectables(msg.chainId, msg.paths);
    };
};
const handleSetKeyStoreCoinTypeMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.setKeyStoreCoinType(msg.chainId, msg.coinType);
        return service.keyRingStatus;
    });
};
const handleCheckPasswordMsg = (service) => {
    return (_, msg) => {
        return service.checkPassword(msg.password);
    };
};
const handleExportKeyRingDatasMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.exportKeyRingDatas(msg.password);
    });
};
const handleAddAccountMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.addAccount(msg.name, msg.bip44HDPath);
        return result;
    });
};
const handleMigratorKeyRing = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.migratorKeyRing(msg.password);
        return result;
    });
};
const handleRestoreKeyStore = (service) => {
    return () => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.restoreKeyStore();
    });
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1043:
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
__exportStar(__webpack_require__(534), exports);
__exportStar(__webpack_require__(1044), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1044:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(337);
const constants_1 = __webpack_require__(535);
const handler_1 = __webpack_require__(1045);
function init(router, service) {
    router.registerMessage(messages_1.SendTxMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1045:
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
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(337);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.SendTxMsg:
                return handleSendTxMsg(service)(env, msg);
            default:
                throw new router_1.KeplrError("tx", 110, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleSendTxMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        return yield service.sendTx(msg.chainId, msg.tx, msg.mode);
    });
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1046:
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
__exportStar(__webpack_require__(536), exports);
__exportStar(__webpack_require__(1047), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1047:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(338);
const constants_1 = __webpack_require__(537);
const handler_1 = __webpack_require__(1048);
function init(router, service) {
    router.registerMessage(messages_1.TryUpdateChainMsg);
    router.registerMessage(messages_1.SetChainEndpointsMsg);
    router.registerMessage(messages_1.ResetChainEndpointsMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1048:
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
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(338);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.TryUpdateChainMsg:
                return handleTryUpdateChainMsg(service)(env, msg);
            case messages_1.SetChainEndpointsMsg:
                return handleSetChainEndpointsMsg(service)(env, msg);
            case messages_1.ResetChainEndpointsMsg:
                return handleResetChainEndpointsMsg(service)(env, msg);
            default:
                throw new router_1.KeplrError("updater", 110, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleTryUpdateChainMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.tryUpdateChain(msg.chainId);
    });
};
const handleSetChainEndpointsMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.setChainEndpoints(msg.chainId, msg.rpc, msg.rest);
    });
};
const handleResetChainEndpointsMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.resetChainEndpoints(msg.chainId);
    });
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1049:
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
__exportStar(__webpack_require__(538), exports);
__exportStar(__webpack_require__(1051), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1050:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1051:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(230);
const constants_1 = __webpack_require__(540);
const handler_1 = __webpack_require__(1052);
function init(router, service) {
    router.registerMessage(messages_1.GetTokensMsg);
    router.registerMessage(messages_1.SuggestTokenMsg);
    router.registerMessage(messages_1.AddTokenMsg);
    router.registerMessage(messages_1.RemoveTokenMsg);
    router.registerMessage(messages_1.GetSecret20ViewingKey);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1052:
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
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(230);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.GetTokensMsg:
                return handleGetTokensMsg(service)(env, msg);
            case messages_1.SuggestTokenMsg:
                return handleSuggestTokenMsg(service)(env, msg);
            case messages_1.AddTokenMsg:
                return handleAddTokenMsg(service)(env, msg);
            case messages_1.RemoveTokenMsg:
                return handleRemoveTokenMsg(service)(env, msg);
            case messages_1.GetSecret20ViewingKey:
                return handleGetSecret20ViewingKey(service)(env, msg);
            default:
                throw new router_1.KeplrError("tokens", 120, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleGetTokensMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.getTokens(msg.chainId);
    });
};
const handleSuggestTokenMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        yield service.suggestToken(env, msg.chainId, msg.contractAddress, msg.viewingKey);
    });
};
const handleAddTokenMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.addToken(msg.chainId, msg.currency);
    });
};
const handleRemoveTokenMsg = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.removeToken(msg.chainId, msg.currency);
    });
};
const handleGetSecret20ViewingKey = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.permissionService.checkOrGrantBasicAccessPermission(env, msg.chainId, msg.origin);
        /*
        await service.checkOrGrantSecret20ViewingKeyPermission(
          env,
          msg.chainId,
          msg.contractAddress,
          msg.origin
        );
         */
        return yield service.getSecret20ViewingKey(msg.chainId, msg.contractAddress);
    });
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1053:
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
__exportStar(__webpack_require__(542), exports);
__exportStar(__webpack_require__(1058), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1054:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionForegroundService = void 0;
class InteractionForegroundService {
    constructor(handler) {
        this.handler = handler;
    }
    pushData(data) {
        this.handler.onInteractionDataReceived(data);
    }
    pushEvent(data) {
        this.handler.onEventDataReceived(data);
    }
}
exports.InteractionForegroundService = InteractionForegroundService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 1055:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1056:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionForegroundInit = void 0;
const messages_1 = __webpack_require__(340);
const constants_1 = __webpack_require__(544);
const handler_1 = __webpack_require__(1057);
function interactionForegroundInit(router, service) {
    router.registerMessage(messages_1.PushInteractionDataMsg);
    router.registerMessage(messages_1.PushEventDataMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.interactionForegroundInit = interactionForegroundInit;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1057:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(340);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.PushInteractionDataMsg:
                return handlePushInteractionDataMsg(service)(env, msg);
            case messages_1.PushEventDataMsg:
                return handlePushEventDataMsg(service)(env, msg);
            default:
                throw new router_1.KeplrError("interaction", 110, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handlePushInteractionDataMsg = (service) => {
    return (_, msg) => {
        return service.pushData(msg.data);
    };
};
const handlePushEventDataMsg = (service) => {
    return (_, msg) => {
        return service.pushEvent(msg.data);
    };
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1058:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(341);
const constants_1 = __webpack_require__(545);
const handler_1 = __webpack_require__(1059);
function init(router, service) {
    router.registerMessage(messages_1.ApproveInteractionMsg);
    router.registerMessage(messages_1.RejectInteractionMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1059:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(341);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.ApproveInteractionMsg:
                return handleApproveInteractionMsg(service)(env, msg);
            case messages_1.RejectInteractionMsg:
                return handleRejectInteractionMsg(service)(env, msg);
            default:
                throw new router_1.KeplrError("interaction", 100, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleApproveInteractionMsg = (service) => {
    return (_, msg) => {
        return service.approve(msg.id, msg.result);
    };
};
const handleRejectInteractionMsg = (service) => {
    return (_, msg) => {
        return service.reject(msg.id);
    };
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1060:
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
__exportStar(__webpack_require__(524), exports);
__exportStar(__webpack_require__(1061), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1061:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(334);
const constants_1 = __webpack_require__(526);
const handler_1 = __webpack_require__(1062);
function init(router, service) {
    router.registerMessage(messages_1.EnableAccessMsg);
    router.registerMessage(messages_1.GetPermissionOriginsMsg);
    router.registerMessage(messages_1.GetOriginPermittedChainsMsg);
    router.registerMessage(messages_1.AddPermissionOrigin);
    router.registerMessage(messages_1.RemovePermissionOrigin);
    router.registerMessage(messages_1.RemovePermissionsOrigin);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1062:
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
exports.getHandler = void 0;
const messages_1 = __webpack_require__(334);
const router_1 = __webpack_require__(3);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.EnableAccessMsg:
                return handleEnableAccessMsg(service)(env, msg);
            case messages_1.GetPermissionOriginsMsg:
                return handleGetPermissionOriginsMsg(service)(env, msg);
            case messages_1.GetOriginPermittedChainsMsg:
                return handleGetOriginPermittedChainsMsg(service)(env, msg);
            case messages_1.AddPermissionOrigin:
                return handleAddPermissionOrigin(service)(env, msg);
            case messages_1.RemovePermissionOrigin:
                return handleRemovePermissionOrigin(service)(env, msg);
            case messages_1.RemovePermissionsOrigin:
                return handleremoveAllPermissionsOrigin(service)(env, msg);
            default:
                throw new router_1.KeplrError("permission", 120, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleEnableAccessMsg = (service) => {
    return (env, msg) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.checkOrGrantBasicAccessPermission(env, msg.chainIds, msg.origin);
    });
};
const handleGetPermissionOriginsMsg = (service) => {
    return (_, msg) => {
        return service.getPermissionOrigins(msg.chainId, msg.permissionType);
    };
};
const handleGetOriginPermittedChainsMsg = (service) => {
    return (_, msg) => {
        return service.getOriginPermittedChains(msg.permissionOrigin, msg.permissionType);
    };
};
const handleAddPermissionOrigin = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.addPermission([msg.chainId], msg.permissionType, [
            msg.permissionOrigin,
        ]);
    });
};
const handleRemovePermissionOrigin = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.removePermission(msg.chainId, msg.permissionType, [
            msg.permissionOrigin,
        ]);
    });
};
const handleremoveAllPermissionsOrigin = (service) => {
    return (_, msg) => __awaiter(void 0, void 0, void 0, function* () {
        yield service.removeAllPermissions(msg.chainId);
    });
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1063:
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
__exportStar(__webpack_require__(546), exports);
__exportStar(__webpack_require__(1064), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1064:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(231);
const constants_1 = __webpack_require__(547);
const handler_1 = __webpack_require__(1065);
function init(router, service) {
    router.registerMessage(messages_1.GetAutoLockAccountDurationMsg);
    router.registerMessage(messages_1.UpdateAutoLockAccountDurationMsg);
    router.registerMessage(messages_1.StartAutoLockMonitoringMsg);
    router.registerMessage(messages_1.LockMsg);
    router.registerMessage(messages_1.KeepAliveMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1065:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(231);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.GetAutoLockAccountDurationMsg:
                return handleGetAutoLockAccountDurationMsg(service)(env, msg);
            case messages_1.UpdateAutoLockAccountDurationMsg:
                return handleUpdateAutoLockAccountDurationMsg(service)(env, msg);
            case messages_1.StartAutoLockMonitoringMsg:
                return handleStartAutoLockMonitoringMsg(service)(env, msg);
            case messages_1.LockMsg:
                return handleLockMsg(service)(env, msg);
            case messages_1.KeepAliveMsg:
                return handleKeepAliveMsg(service)(env, msg);
            default:
                throw new router_1.KeplrError("auto-lock-account", 100, "Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handleGetAutoLockAccountDurationMsg = (service) => {
    return () => {
        return service.getAutoLockDuration();
    };
};
const handleUpdateAutoLockAccountDurationMsg = (service) => {
    return (_, msg) => {
        if (!service.keyRingIsUnlocked) {
            throw new Error("Keyring is not unlocked");
        }
        return service.setDuration(msg.duration);
    };
};
const handleStartAutoLockMonitoringMsg = (service) => {
    return () => {
        return service.startAppStateCheckTimer();
    };
};
const handleLockMsg = (service) => {
    return () => {
        return service.lock();
    };
};
const handleKeepAliveMsg = (service) => {
    return () => {
        console.log("keepAlive start");
        return service.keepAlive();
    };
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1066:
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
__exportStar(__webpack_require__(342), exports);
__exportStar(__webpack_require__(1081), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1067:
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
exports.Mises = void 0;
const mises_js_sdk_1 = __webpack_require__(1068);
const mises_network_util_1 = __webpack_require__(232);
const tendermint_rpc_1 = __webpack_require__(319);
const stargate_1 = __webpack_require__(266);
const react_query_1 = __webpack_require__(236);
const service_1 = __webpack_require__(342);
const http_client_1 = __webpack_require__(1080);
class Mises {
    constructor() {
        this.config = mises_js_sdk_1.MSdk.newConfig();
        this.coinDefine = mises_js_sdk_1.MSdk.newCoinDefine();
        this.msgReader = mises_js_sdk_1.MSdk.newMsgReader();
        this.coinDefine.load();
        this.config.setLCDEndpoint(mises_network_util_1.MISES_POINT);
        this.misesSdk = mises_js_sdk_1.MSdk.newSdk(this.config);
        this.misesUser = this.misesSdk.userMgr();
        this.misesAppMgr = this.misesSdk.appMgr();
        this.queryFetchClient = new react_query_1.QueryClient();
    }
    queryFetchClientInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stargateClient = yield this.queryFetchClient.fetchQuery("StargateClient", () => stargate_1.StargateClient.connect(mises_network_util_1.MISES_POINT), service_1.fetchConfig);
        });
    }
    makeClient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmClient = yield tendermint_rpc_1.Tendermint34Client.create(new http_client_1.HttpClient(mises_network_util_1.MISES_POINT));
                return [
                    stargate_1.QueryClient.withExtensions(tmClient, stargate_1.setupStakingExtension, stargate_1.setupDistributionExtension, stargate_1.setupAuthExtension, stargate_1.setupTxExtension),
                    tmClient,
                ];
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
}
exports.Mises = Mises;
//# sourceMappingURL=mises.js.map

/***/ }),

/***/ 1080:
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
exports.HttpClient = void 0;
const json_rpc_1 = __webpack_require__(320);
const rpcclient_1 = __webpack_require__(227);
const mises_network_util_1 = __webpack_require__(232);
class HttpClient {
    constructor(endpoint) {
        if (typeof endpoint === "string") {
            // accept host.name:port and assume http protocol
            this.url = rpcclient_1.hasProtocol(endpoint) ? endpoint : "http://" + endpoint;
        }
        else {
            this.url = endpoint.url;
            this.headers = endpoint.headers;
        }
    }
    disconnect() {
        // nothing to be done
    }
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield mises_network_util_1.misesRequest({
                url: this.url,
                method: "POST",
                data: request ? JSON.stringify(request) : undefined,
                headers: Object.assign({ "Content-Type": "application/json" }, this.headers),
                timeout: 5000,
                isCustomRequest: true,
            });
            if (json_rpc_1.isJsonRpcErrorResponse(response)) {
                throw new Error(JSON.stringify(response.error));
            }
            return response;
        });
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http-client.js.map

/***/ }),

/***/ 1081:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(346);
const constants_1 = __webpack_require__(554);
const handler_1 = __webpack_require__(1082);
function init(router, service) {
    router.registerMessage(messages_1.BalanceUMISMsg);
    router.registerMessage(messages_1.MisesChainMsg);
    router.registerMessage(messages_1.RecentTransactionsMsg);
    router.registerMessage(messages_1.GetChainIdMsg);
    router.registerMessage(messages_1.UnbondingDelegationsMsg);
    router.registerMessage(messages_1.DelegationsMsg);
    router.registerMessage(messages_1.RewardsMsg);
    router.registerMessage(messages_1.AuthAccountsMsg);
    router.registerMessage(messages_1.BroadcastTxMsg);
    router.registerMessage(messages_1.SimulateMsg);
    router.registerMessage(messages_1.MisesAccountMsg);
    router.registerMessage(messages_1.HasWalletAccountMsg);
    router.registerMessage(messages_1.DisconnectMsg);
    router.registerMessage(messages_1.ConnectMsg);
    router.registerMessage(messages_1.UserFollowMsg);
    router.registerMessage(messages_1.UserUnFollowMsg);
    router.registerMessage(messages_1.SetUserInfoMsg);
    router.registerMessage(messages_1.StakingMsg);
    router.registerMessage(messages_1.ActiveUserMsg);
    router.registerMessage(messages_1.PortForTxMsg);
    router.registerMessage(messages_1.SaveTranstionsMsg);
    router.registerMessage(messages_1.OpenWalletMsg);
    router.registerMessage(messages_1.GetLocalCacheMsg);
    router.registerMessage(messages_1.SetLocalCacheMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1082:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const messages_1 = __webpack_require__(346);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.BalanceUMISMsg:
                return handlerBalanceUMISMsg(service)(env, msg);
            case messages_1.MisesChainMsg:
                return handlerMisesChainMsg(service)(env, msg);
            case messages_1.RecentTransactionsMsg:
                return handlerRecentTransactionsMsg(service)(env, msg);
            case messages_1.GetChainIdMsg:
                return handlerGetChainIdMsg(service)(env, msg);
            case messages_1.UnbondingDelegationsMsg:
                return handlerUnbondingDelegations(service)(env, msg);
            case messages_1.DelegationsMsg:
                return handlerDelegations(service)(env, msg);
            case messages_1.RewardsMsg:
                return handlerRewards(service)(env, msg);
            case messages_1.AuthAccountsMsg:
                return handlerAuthaccounts(service)(env, msg);
            case messages_1.BroadcastTxMsg:
                return handlerBroadcastTx(service)(env, msg);
            case messages_1.SimulateMsg:
                return handlerSimulate(service)(env, msg);
            case messages_1.MisesAccountMsg:
                return handlerMisesAccount(service)(env, msg);
            case messages_1.HasWalletAccountMsg:
                return handlerHasWalletAccount(service)(env, msg);
            case messages_1.DisconnectMsg:
                return handlerDisconnect(service)(env, msg);
            case messages_1.ConnectMsg:
                return handlerConnect(service)(env, msg);
            case messages_1.UserFollowMsg:
                return handlerUserFollow(service)(env, msg);
            case messages_1.UserUnFollowMsg:
                return handlerUserUnFollow(service)(env, msg);
            case messages_1.SetUserInfoMsg:
                return handlerSetUserInfo(service)(env, msg);
            case messages_1.StakingMsg:
                return handlerStaking(service)(env, msg);
            case messages_1.ActiveUserMsg:
                return handlerActiveUser(service)(env, msg);
            case messages_1.PortForTxMsg:
                return handlerPortForTx(service)(env, msg);
            case messages_1.SaveTranstionsMsg:
                return handlerSaveTranstions(service)(env, msg);
            case messages_1.OpenWalletMsg:
                return handlerOpenWallet(service)(env, msg);
            case messages_1.GetLocalCacheMsg:
                return handlerGetLocalCache(service)(env, msg);
            case messages_1.SetLocalCacheMsg:
                return handlerSetLocalCache(service)(env, msg);
            default:
                throw new Error("Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handlerBalanceUMISMsg = (service) => (_, msg) => {
    return service.getBalanceUMIS(msg.address);
};
const handlerMisesChainMsg = () => (_, msg) => {
    return msg.chainId === "mainnet";
};
const handlerRecentTransactionsMsg = (service) => () => {
    return service.recentTransactions();
};
const handlerGetChainIdMsg = (service) => () => {
    return service.getChainId();
};
const handlerUnbondingDelegations = (service) => (_, msg) => {
    return service.unbondingDelegations(msg.address);
};
const handlerDelegations = (service) => (_, msg) => {
    return service.delegations(msg.address);
};
const handlerRewards = (service) => (_, msg) => {
    return service.rewards(msg.address);
};
const handlerAuthaccounts = (service) => (_, msg) => {
    return service.authAccounts(msg.address);
};
const handlerBroadcastTx = (service) => (_, msg) => {
    return service.broadcastTx(msg.tx);
};
const handlerSimulate = (service) => (_, msg) => {
    return service.simulate(msg.messages, msg.memo, msg.signer, msg.sequence);
};
const handlerMisesAccount = (service) => () => {
    return service.misesAccount();
};
const handlerHasWalletAccount = (service) => () => {
    return service.hasWalletAccount();
};
const handlerDisconnect = (service) => (_, msg) => {
    return service.disconnect(msg.params);
};
const handlerConnect = (service) => (_, msg) => {
    return service.connect(msg.params);
};
const handlerUserFollow = (service) => (_, msg) => {
    return service.setFollow(msg.toUid);
};
const handlerUserUnFollow = (service) => (_, msg) => {
    return service.setUnFollow(msg.toUid);
};
const handlerSetUserInfo = (service) => (_, msg) => {
    return service.setUserInfo(msg.params);
};
const handlerStaking = (service) => (_, msg) => {
    return service.staking(msg.params);
};
const handlerActiveUser = (service) => () => {
    return service.userInfo;
};
const handlerPortForTx = (service) => (_, msg) => {
    return service.pollForTx(msg.txId);
};
const handlerSaveTranstions = (service) => (_, msg) => {
    return service.saveTranstions(msg.transtions);
};
const handlerOpenWallet = (service) => () => {
    return service.openWallet();
};
const handlerGetLocalCache = (service) => (_, msg) => {
    return service.getAddressUserInfo(msg.address);
};
const handlerSetLocalCache = (service) => (_, msg) => {
    return service.setCacheUserInfo(msg.params);
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1083:
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
__exportStar(__webpack_require__(555), exports);
__exportStar(__webpack_require__(1085), exports);
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 1084:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.html_similar = void 0;
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
exports.html_similar = html_similar;
//# sourceMappingURL=html-similar.js.map

/***/ }),

/***/ 1085:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const messages_1 = __webpack_require__(347);
const constants_1 = __webpack_require__(556);
const handler_1 = __webpack_require__(1086);
function init(router, service) {
    router.registerMessage(messages_1.InitSafeMsg);
    router.registerMessage(messages_1.VerifyDomainMsg);
    router.registerMessage(messages_1.SetIsShouldVerifyMsg);
    router.registerMessage(messages_1.GetIsShouldVerifyMsg);
    router.addHandler(constants_1.ROUTE, handler_1.getHandler(service));
}
exports.init = init;
//# sourceMappingURL=init.js.map

/***/ }),

/***/ 1086:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandler = void 0;
const messages_1 = __webpack_require__(347);
const getHandler = (service) => {
    return (env, msg) => {
        switch (msg.constructor) {
            case messages_1.InitSafeMsg:
                return handlerInitSafeMsg(service)(env, msg);
            case messages_1.VerifyDomainMsg:
                return handlerVerifyDomainMsg(service)(env, msg);
            case messages_1.GetIsShouldVerifyMsg:
                return handlerGetIsShouldVerifyMsg(service)(env, msg);
            case messages_1.SetIsShouldVerifyMsg:
                return handlerSetIsShouldVerifyMsg(service)(env, msg);
            default:
                throw new Error("Unknown msg type");
        }
    };
};
exports.getHandler = getHandler;
const handlerInitSafeMsg = (service) => (_, msg) => {
    service.setIsShouldVerifyState(msg.state);
};
const handlerVerifyDomainMsg = (service) => (_, msg) => {
    return service.initMessageClient(msg);
};
const handlerGetIsShouldVerifyMsg = (service) => (_) => {
    return service.isShouldVerify;
};
const handlerSetIsShouldVerifyMsg = (service) => (_, msg) => {
    return service.setIsShouldVerifyState(msg.state);
};
//# sourceMappingURL=handler.js.map

/***/ }),

/***/ 1087:
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
__exportStar(__webpack_require__(518), exports);
__exportStar(__webpack_require__(333), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1088:
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
__exportStar(__webpack_require__(342), exports);
__exportStar(__webpack_require__(346), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1089:
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
__exportStar(__webpack_require__(555), exports);
__exportStar(__webpack_require__(347), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1090:
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
__exportStar(__webpack_require__(1091), exports);
__exportStar(__webpack_require__(1171), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1091:
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
exports.SecretWasmService = void 0;
const secretjs_1 = __webpack_require__(1092);
const crypto_1 = __webpack_require__(51);
const common_1 = __webpack_require__(27);
const cosmos_1 = __webpack_require__(16);
const router_1 = __webpack_require__(3);
const buffer_1 = __webpack_require__(4);
class SecretWasmService {
    constructor(kvStore) {
        this.kvStore = kvStore;
        this.debouncerMap = new Map();
        this.cacheEnigmaUtils = new Map();
        this.onChainRemoved = () => {
            this.cacheEnigmaUtils = new Map();
        };
    }
    init(chainsService, keyRingService, permissionService) {
        this.chainsService = chainsService;
        this.keyRingService = keyRingService;
        this.permissionService = permissionService;
        this.chainsService.addChainRemovedHandler(this.onChainRemoved);
    }
    getPubkey(env, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            const keyRingType = yield this.keyRingService.getKeyRingType();
            if (keyRingType === "none") {
                throw new router_1.KeplrError("secret-wasm", 130, "Key ring is not initialized");
            }
            const seed = yield this.getSeed(env, chainInfo);
            const utils = this.getEnigmaUtils(chainInfo, seed);
            return utils.pubkey;
        });
    }
    getTxEncryptionKey(env, chainId, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            const keyRingType = yield this.keyRingService.getKeyRingType();
            if (keyRingType === "none") {
                throw new router_1.KeplrError("secret-wasm", 130, "Key ring is not initialized");
            }
            const seed = yield this.getSeed(env, chainInfo);
            const utils = this.getEnigmaUtils(chainInfo, seed);
            return utils.getTxEncryptionKey(nonce);
        });
    }
    encrypt(env, chainId, contractCodeHash, 
    // eslint-disable-next-line @typescript-eslint/ban-types
    msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            const keyRingType = yield this.keyRingService.getKeyRingType();
            if (keyRingType === "none") {
                throw new router_1.KeplrError("secret-wasm", 130, "Key ring is not initialized");
            }
            // XXX: Keplr should generate the seed deterministically according to the account.
            // Otherwise, it will lost the encryption/decryption key if Keplr is uninstalled or local storage is cleared.
            // For now, use the signature of some string to generate the seed.
            // It need to more research.
            const seed = yield this.getSeed(env, chainInfo);
            const utils = this.getEnigmaUtils(chainInfo, seed);
            return yield utils.encrypt(contractCodeHash, msg);
        });
    }
    decrypt(env, chainId, ciphertext, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            const keyRingType = yield this.keyRingService.getKeyRingType();
            if (keyRingType === "none") {
                throw new router_1.KeplrError("secret-wasm", 130, "Key ring is not initialized");
            }
            // XXX: Keplr should generate the seed deterministically according to the account.
            // Otherwise, it will lost the encryption/decryption key if Keplr is uninstalled or local storage is cleared.
            // For now, use the signature of some string to generate the seed.
            // It need to more research.
            const seed = yield this.getSeed(env, chainInfo);
            const utils = this.getEnigmaUtils(chainInfo, seed);
            return yield utils.decrypt(ciphertext, nonce);
        });
    }
    getEnigmaUtils(chainInfo, seed) {
        const key = `${chainInfo.chainId}-${buffer_1.Buffer.from(seed).toString("hex")}`;
        if (this.cacheEnigmaUtils.has(key)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.cacheEnigmaUtils.get(key);
        }
        // TODO: Handle the rest config.
        const utils = new secretjs_1.EnigmaUtils(chainInfo.rest, seed);
        this.cacheEnigmaUtils.set(key, utils);
        return utils;
    }
    // GetSeed will be debounced if the prior promise is pending.
    // GetSeed can be occured multiple times at once,
    // this case can be problem if the cache doesn't exist and key type is ledger,
    // because multiple requests to ledger will make the connection unstable.
    getSeed(env, chainInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.keyRingService.getKey(chainInfo.chainId);
            const bech32Address = new cosmos_1.Bech32Address(key.address).toBech32(chainInfo.bech32Config.bech32PrefixAccAddr);
            const debouncerKey = `${env.isInternalMsg}/${chainInfo.chainId}/${bech32Address}`;
            if (!this.debouncerMap.has(debouncerKey)) {
                this.debouncerMap.set(debouncerKey, common_1.Debouncer.promise(this.getSeedInner.bind(this)));
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const debouncedFn = this.debouncerMap.get(debouncerKey);
            return yield debouncedFn(env, chainInfo, bech32Address);
        });
    }
    getSeedInner(env, chainInfo, bech32Address) {
        return __awaiter(this, void 0, void 0, function* () {
            const storeKey = `seed-${chainInfo.chainId}-${bech32Address}`;
            const cached = yield this.kvStore.get(storeKey);
            if (cached) {
                return buffer_1.Buffer.from(cached, "hex");
            }
            const seed = crypto_1.Hash.sha256(buffer_1.Buffer.from(yield this.keyRingService.sign(env, chainInfo.chainId, buffer_1.Buffer.from(JSON.stringify({
                account_number: 0,
                chain_id: chainInfo.chainId,
                fee: [],
                memo: "Create Keplr Secret encryption key. Only approve requests by Keplr.",
                msgs: [],
                sequence: 0,
            })))));
            yield this.kvStore.set(storeKey, buffer_1.Buffer.from(seed).toString("hex"));
            return seed;
        });
    }
}
exports.SecretWasmService = SecretWasmService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 1171:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTxEncryptionKeyMsg = exports.RequestDecryptMsg = exports.ReqeustEncryptMsg = exports.GetPubkeyMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(1172);
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
            throw new router_1.KeplrError("secret-wasm", 100, "chain id not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("secret-wasm", 100, "chain id not set");
        }
        if (!this.contractCodeHash) {
            throw new router_1.KeplrError("secret-wasm", 103, "contract code hash not set");
        }
        if (!this.msg) {
            throw new router_1.KeplrError("secret-wasm", 101, "msg not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("secret-wasm", 100, "chain id not set");
        }
        if (!this.cipherText || this.cipherText.length === 0) {
            throw new router_1.KeplrError("secret-wasm", 102, "ciphertext not set");
        }
        if (!this.nonce || this.nonce.length === 0) {
            throw new router_1.KeplrError("secret-wasm", 110, "nonce not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("secret-wasm", 100, "chain id not set");
        }
        if (!this.nonce) {
            // Nonce of zero length is permitted.
            throw new router_1.KeplrError("secret-wasm", 111, "nonce is null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetTxEncryptionKeyMsg.type();
    }
}
exports.GetTxEncryptionKeyMsg = GetTxEncryptionKeyMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 1172:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "secret-wasm";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 1173:
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
__exportStar(__webpack_require__(534), exports);
__exportStar(__webpack_require__(337), exports);
__exportStar(__webpack_require__(1174), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1174:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1175:
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
__exportStar(__webpack_require__(536), exports);
__exportStar(__webpack_require__(338), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1176:
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
__exportStar(__webpack_require__(538), exports);
__exportStar(__webpack_require__(230), exports);
__exportStar(__webpack_require__(541), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1177:
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
__exportStar(__webpack_require__(542), exports);
__exportStar(__webpack_require__(341), exports);
__exportStar(__webpack_require__(1178), exports);
__exportStar(__webpack_require__(543), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1178:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1179:
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
__exportStar(__webpack_require__(546), exports);
__exportStar(__webpack_require__(231), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MISES_SITE_API */
/* unused harmony export MISES_POINT */
/* unused harmony export Request */
/* unused harmony export misesRequest */
/* unused harmony export cancelRequest */
/* unused harmony export cancelAllRequest */
/* unused harmony export TRUNCATED_NAME_CHAR_LIMIT */
/* unused harmony export TRUNCATED_ADDRESS_START_CHARS */
/* unused harmony export TRUNCATED_ADDRESS_END_CHARS */
/* unused harmony export MISES_TRUNCATED_ADDRESS_START_CHARS */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return shortenAddress; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vespaiach_axios_fetch_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(595);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const MISES_SITE_API = "https://api.alb.mises.site/api/v1";
//export const MISES_SITE_API = "http://localhost:8080/api/v1";
// export const MISES_POINT = 'http://192.168.1.8:26657';
const MISES_POINT = "http://127.0.0.1:26657";


class Request {
    constructor(config) {
        var _a, _b, _c, _d;
        this.requestUrlList = [];
        this.cancelRequestSourceList = [];
        this.instance = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create(Object.assign(Object.assign({}, config), { adapter: _vespaiach_axios_fetch_adapter__WEBPACK_IMPORTED_MODULE_1__["default"] }));
        this.interceptorsObj = config.interceptors;
        // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
        this.instance.interceptors.request.use((res) => res, (err) => err);
        // 使用实例拦截器
        this.instance.interceptors.request.use((_a = this.interceptorsObj) === null || _a === void 0 ? void 0 : _a.requestInterceptors, (_b = this.interceptorsObj) === null || _b === void 0 ? void 0 : _b.requestInterceptorsCatch);
        this.instance.interceptors.response.use((_c = this.interceptorsObj) === null || _c === void 0 ? void 0 : _c.responseInterceptors, (_d = this.interceptorsObj) === null || _d === void 0 ? void 0 : _d.responseInterceptorsCatch);
        // 全局响应拦截器保证最后执行
        this.instance.interceptors.response.use(
        // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
        (res) => {
            return res.data;
        }, (err) => err);
    }
    /**
     * @description: 获取指定 url 在 cancelRequestSourceList 中的索引
     * @param {string} url
     * @returns {number} 索引位置
     */
    getSourceIndex(url) {
        var _a;
        return (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.findIndex((item) => {
            return Object.keys(item)[0] === url;
        });
    }
    /**
     * @description: 删除 requestUrlList 和 cancelRequestSourceList
     * @param {string} url
     * @returns {*}
     */
    delUrl(url) {
        var _a, _b, _c;
        const urlIndex = (_a = this.requestUrlList) === null || _a === void 0 ? void 0 : _a.findIndex((u) => u === url);
        const sourceIndex = this.getSourceIndex(url);
        // 删除url和cancel方法
        urlIndex !== -1 && ((_b = this.requestUrlList) === null || _b === void 0 ? void 0 : _b.splice(urlIndex, 1));
        sourceIndex !== -1 && ((_c = this.cancelRequestSourceList) === null || _c === void 0 ? void 0 : _c.splice(sourceIndex, 1));
    }
    request(config) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
            if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config);
            }
            const url = config.url;
            // url存在保存取消请求方法和当前请求url
            if (url) {
                (_b = this.requestUrlList) === null || _b === void 0 ? void 0 : _b.push(url);
                // TODO 在axios0.22起，对CancelToken已经弃用，需要改成  AbortController 文档：https://axios-http.com/docs/cancellation
                config.cancelToken = new axios__WEBPACK_IMPORTED_MODULE_0___default.a.CancelToken((c) => {
                    var _a;
                    (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.push({
                        [url]: c,
                    });
                });
            }
            this.instance
                .request(config)
                .then((res) => {
                var _a;
                // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
                if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.responseInterceptors) {
                    res = config.interceptors.responseInterceptors(res);
                }
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            })
                .finally(() => {
                url && this.delUrl(url);
            });
        });
    }
    // 取消请求
    cancelRequest(url) {
        var _a;
        if (typeof url === "string") {
            // 取消单个请求
            const sourceIndex = this.getSourceIndex(url);
            sourceIndex >= 0 && ((_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a[sourceIndex][url]());
        }
        else {
            // 存在多个需要取消请求的地址
            url.forEach((u) => {
                var _a;
                const sourceIndex = this.getSourceIndex(u);
                sourceIndex >= 0 && ((_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a[sourceIndex][u]());
            });
        }
    }
    // 取消全部请求
    cancelAllRequest() {
        var _a;
        (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.forEach((source) => {
            const key = Object.keys(source)[0];
            source[key]();
        });
    }
}
const request = new Request({
    baseURL: MISES_SITE_API,
    timeout: 6000,
    interceptors: {
        // 请求拦截器
        requestInterceptors: (config) => config,
        // 响应拦截器
        responseInterceptors: (result) => {
            return result;
        },
    },
});
/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {misesRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const misesRequest = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const { method = "GET" } = config;
    if (method === "get" || method === "GET") {
        config.params = config.data;
    }
    try {
        const data = yield request.request(config);
        if (data.code === "ECONNABORTED") {
            return Promise.reject("ECONNABORTED");
        }
        let response = data;
        if (config.isCustomRequest) {
            const res = data;
            response = {
                data: res,
                code: "0",
                message: "success",
            };
        }
        return response.data;
    }
    catch (error) {
        console.log(error, "error");
        return Promise.reject(error);
    }
});
// 取消请求
const cancelRequest = (url) => request.cancelRequest(url);
// 取消全部请求
const cancelAllRequest = () => request.cancelAllRequest();
// The character limit on ENS names, nicknames and addresses before we truncate
const TRUNCATED_NAME_CHAR_LIMIT = 11;
// The number of characters to slice from the beginning of an address for truncated format:
// `${TRUNCATED_ADDRESS_START_CHARS}...${TRUNCATED_ADDRESS_END_CHARS}`
const TRUNCATED_ADDRESS_START_CHARS = 5;
// The number of characters to slice from the end of an address for truncated format:
// `${TRUNCATED_ADDRESS_START_CHARS}...${TRUNCATED_ADDRESS_END_CHARS}`
const TRUNCATED_ADDRESS_END_CHARS = 4;
const MISES_TRUNCATED_ADDRESS_START_CHARS = 8;
function shortenAddress(address = "", prefix = TRUNCATED_ADDRESS_START_CHARS) {
    if (address.length < TRUNCATED_NAME_CHAR_LIMIT) {
        return address;
    }
    return `${address.slice(0, prefix)}...${address.slice(-TRUNCATED_ADDRESS_END_CHARS)}`;
}


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveSuggestedChainInfoMsg = exports.SuggestChainInfoMsg = exports.GetChainInfosMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(522);
class GetChainInfosMsg extends router_1.Message {
    static type() {
        return "get-chain-infos";
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetChainInfosMsg.type();
    }
}
exports.GetChainInfosMsg = GetChainInfosMsg;
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
            throw new router_1.KeplrError("chains", 100, "Chain info not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SuggestChainInfoMsg.type();
    }
}
exports.SuggestChainInfoMsg = SuggestChainInfoMsg;
class RemoveSuggestedChainInfoMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "remove-suggested-chain-info";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("chains", 101, "Chain id not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RemoveSuggestedChainInfoMsg.type();
    }
}
exports.RemoveSuggestedChainInfoMsg = RemoveSuggestedChainInfoMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.KeyRing = exports.KeyRingStatus = void 0;
const crypto_1 = __webpack_require__(1026);
const crypto_2 = __webpack_require__(51);
const types_1 = __webpack_require__(96);
const router_1 = __webpack_require__(3);
const buffer_1 = __webpack_require__(4);
const cosmos_1 = __webpack_require__(16);
const wallet_1 = __webpack_require__(253);
const BytesUtils = __importStar(__webpack_require__(1));
const eip712_1 = __webpack_require__(532);
const hash_1 = __webpack_require__(268);
const migrator_1 = __webpack_require__(1039);
var KeyRingStatus;
(function (KeyRingStatus) {
    KeyRingStatus[KeyRingStatus["NOTLOADED"] = 0] = "NOTLOADED";
    KeyRingStatus[KeyRingStatus["EMPTY"] = 1] = "EMPTY";
    KeyRingStatus[KeyRingStatus["LOCKED"] = 2] = "LOCKED";
    KeyRingStatus[KeyRingStatus["UNLOCKED"] = 3] = "UNLOCKED";
    KeyRingStatus[KeyRingStatus["MIGRATOR"] = 4] = "MIGRATOR";
})(KeyRingStatus = exports.KeyRingStatus || (exports.KeyRingStatus = {}));
const KeyStoreKey = "key-store";
const KeyMultiStoreKey = "key-multi-store";
/*
 Keyring stores keys in persistent backround.
 And, this manages the state, crypto, address, signing and so on...
 */
class KeyRing {
    constructor(embedChainInfos, kvStore, crypto, misesService) {
        this.embedChainInfos = embedChainInfos;
        this.kvStore = kvStore;
        this.crypto = crypto;
        this.misesService = misesService;
        this.cached = new Map();
        this.password = "";
        this.migratorStore = { vault: "" };
        this.loaded = false;
        this.keyStore = null;
        this.multiKeyStore = [];
        const migrator = new migrator_1.Migrator();
        this.migrator = migrator;
        migrator.migrateData().then((res) => {
            this.migratorStore = res;
        });
    }
    static getTypeOfKeyStore(keyStore) {
        const type = keyStore.type;
        if (type == null) {
            return "mnemonic";
        }
        if (type !== "mnemonic" && type !== "privateKey" && type !== "ledger") {
            throw new router_1.KeplrError("keyring", 132, "Invalid type of key store");
        }
        return type;
    }
    get type() {
        if (!this.keyStore) {
            return "none";
        }
        else {
            return KeyRing.getTypeOfKeyStore(this.keyStore);
        }
    }
    isLocked() {
        return (this.privateKey == null &&
            this.mnemonicMasterSeed == null &&
            this.ledgerPublicKeyCache == null);
    }
    get privateKey() {
        return this._privateKey;
    }
    set privateKey(privateKey) {
        this._privateKey = privateKey;
        this._mnemonicMasterSeed = undefined;
        this._ledgerPublicKeyCache = undefined;
        this.cached = new Map();
    }
    get mnemonicMasterSeed() {
        return this._mnemonicMasterSeed;
    }
    set mnemonicMasterSeed(masterSeed) {
        this._mnemonicMasterSeed = masterSeed;
        this._privateKey = undefined;
        this._ledgerPublicKeyCache = undefined;
        this.cached = new Map();
    }
    get ledgerPublicKeyCache() {
        return this._ledgerPublicKeyCache;
    }
    set ledgerPublicKeyCache(publicKeys) {
        this._mnemonicMasterSeed = undefined;
        this._privateKey = undefined;
        this._ledgerPublicKeyCache = publicKeys;
        this.cached = new Map();
    }
    get status() {
        if (!this.loaded) {
            return KeyRingStatus.NOTLOADED;
        }
        if (!this.keyStore && this.migratorStore.vault) {
            return KeyRingStatus.MIGRATOR;
        }
        if (!this.keyStore) {
            return KeyRingStatus.EMPTY;
        }
        else if (!this.isLocked()) {
            return KeyRingStatus.UNLOCKED;
        }
        else {
            return KeyRingStatus.LOCKED;
        }
    }
    getKeyStoreCoinType(chainId) {
        if (!this.keyStore) {
            return undefined;
        }
        if (!this.keyStore.coinTypeForChain) {
            return undefined;
        }
        return this.keyStore.coinTypeForChain[cosmos_1.ChainIdHelper.parse(chainId).identifier];
    }
    getKey(chainId, defaultCoinType, useEthereumAddress) {
        return this.loadKey(this.computeKeyStoreCoinType(chainId, defaultCoinType), useEthereumAddress);
    }
    getKeyStoreMeta(key) {
        var _a;
        if (!this.keyStore || this.keyStore.meta == null) {
            return "";
        }
        return (_a = this.keyStore.meta[key]) !== null && _a !== void 0 ? _a : "";
    }
    computeKeyStoreCoinType(chainId, defaultCoinType) {
        var _a;
        if (!this.keyStore) {
            throw new router_1.KeplrError("keyring", 130, "Key store is empty");
        }
        return this.keyStore.coinTypeForChain
            ? (_a = this.keyStore.coinTypeForChain[cosmos_1.ChainIdHelper.parse(chainId).identifier]) !== null && _a !== void 0 ? _a : defaultCoinType : defaultCoinType;
    }
    getKeyFromCoinType(coinType, useEthereumAddress) {
        return this.loadKey(coinType, useEthereumAddress);
    }
    createMnemonicKey(kdf, mnemonic, password, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkKeyStoreStatus();
            if (![KeyRingStatus.EMPTY, KeyRingStatus.MIGRATOR].includes(this.status)) {
                throw new router_1.KeplrError("keyring", 142, "Key ring is not loaded or not empty");
            }
            this.mnemonicMasterSeed = crypto_2.Mnemonic.generateMasterSeedFromMnemonic(mnemonic);
            this.keyStore = yield KeyRing.CreateMnemonicKeyStore(this.crypto, kdf, mnemonic, password, yield this.assignKeyStoreIdMeta(meta), bip44HDPath);
            this.password = password;
            this.multiKeyStore.push(this.keyStore);
            const privKey = this.loadPrivKey(60);
            const ethWallet = new wallet_1.Wallet(privKey.toBytes());
            // this.misesService.initQueryClient();
            this.misesService.activateUser(ethWallet.privateKey);
            yield this.save();
            return {
                status: this.status,
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    createPrivateKey(kdf, privateKey, password, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.EMPTY) {
                throw new router_1.KeplrError("keyring", 142, "Key ring is not loaded or not empty");
            }
            this.privateKey = privateKey;
            this.keyStore = yield KeyRing.CreatePrivateKeyStore(this.crypto, kdf, privateKey, password, yield this.assignKeyStoreIdMeta(meta));
            this.password = password;
            this.multiKeyStore.push(this.keyStore);
            yield this.save();
            return {
                status: this.status,
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    lock() {
        if (this.status !== KeyRingStatus.UNLOCKED) {
            throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
        }
        this.mnemonicMasterSeed = undefined;
        this.privateKey = undefined;
        this.ledgerPublicKeyCache = undefined;
        this.password = "";
        this.misesService.lockAll();
    }
    checkKeyStoreStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyStore || this.type === "none") {
                console.log("checkKeyStoreStatus");
                yield this.restore();
            }
            return true;
        });
    }
    unlock(password) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * If the service worker is closed and reopened
             * the restore will not run, so you need to check whether the keystore needs to be restored again
             */
            console.log("unlocked");
            yield this.checkKeyStoreStatus();
            if (!this.keyStore || this.type === "none") {
                throw new router_1.KeplrError("keyring", 144, "Key ring not initialized");
            }
            if (this.type === "mnemonic") {
                // If password is invalid, error will be thrown.
                this.mnemonicMasterSeed = crypto_2.Mnemonic.generateMasterSeedFromMnemonic(buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, this.multiKeyStore[0], password)).toString());
            }
            else if (this.type === "privateKey") {
                // If password is invalid, error will be thrown.
                this.privateKey = buffer_1.Buffer.from(buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, this.keyStore, password)).toString(), "hex");
            }
            else {
                throw new router_1.KeplrError("keyring", 145, "Unexpected type of keyring");
            }
            this.password = password;
            const privKey = this.loadPrivKey(60);
            const ethWallet = new wallet_1.Wallet(privKey.toBytes());
            // this.misesService.initQueryClient();
            this.misesService.activateUser(ethWallet.privateKey);
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set(KeyStoreKey, this.keyStore);
            yield this.kvStore.set(KeyMultiStoreKey, this.multiKeyStore);
        });
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("keyring restore");
            const keyStore = yield this.kvStore.get(KeyStoreKey);
            if (!keyStore) {
                this.keyStore = null;
            }
            else {
                this.keyStore = keyStore;
            }
            const multiKeyStore = yield this.kvStore.get(KeyMultiStoreKey);
            if (!multiKeyStore) {
                // Restore the multi keystore if key store exist 13t multi Key store is empty.
                // This case will occur if extension is updated from the prior version that doesn't support the multi key store.
                // This line ensures the backward compatibility.
                if (keyStore) {
                    keyStore.meta = yield this.assignKeyStoreIdMeta({});
                    this.multiKeyStore = [keyStore];
                }
                else {
                    this.multiKeyStore = [];
                }
                yield this.save();
            }
            else {
                this.multiKeyStore = multiKeyStore;
            }
            let hasLegacyKeyStore = false;
            // In prior of version 1.2, bip44 path didn't tie with the keystore, and bip44 exists on the chain info.
            // But, after some chain matures, they decided the bip44 path's coin type.
            // So, some chain can have the multiple bip44 coin type (one is the standard coin type and other is the legacy coin type).
            // We should support the legacy coin type, so we determined that the coin type ties with the keystore.
            // To decrease the barrier of existing users, set the alternative coin type by force if the keystore version is prior than 1.2.
            if (this.keyStore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (this.keyStore.version === "1" || this.keyStore.version === "1.1") {
                    hasLegacyKeyStore = true;
                    this.updateLegacyKeyStore(this.keyStore);
                }
            }
            for (const keyStore of this.multiKeyStore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (keyStore.version === "1" || keyStore.version === "1.1") {
                    hasLegacyKeyStore = true;
                    this.updateLegacyKeyStore(keyStore);
                }
            }
            if (hasLegacyKeyStore) {
                yield this.save();
            }
            console.log("keyring restore done");
            this.loaded = true;
        });
    }
    updateLegacyKeyStore(keyStore) {
        keyStore.version = "1.2";
        for (const chainInfo of this.embedChainInfos) {
            const coinType = (() => {
                if (chainInfo.alternativeBIP44s &&
                    chainInfo.alternativeBIP44s.length > 0) {
                    return chainInfo.alternativeBIP44s[0].coinType;
                }
                else {
                    return chainInfo.bip44.coinType;
                }
            })();
            keyStore.coinTypeForChain = Object.assign(Object.assign({}, keyStore.coinTypeForChain), { [cosmos_1.ChainIdHelper.parse(chainInfo.chainId).identifier]: coinType });
        }
    }
    isKeyStoreCoinTypeSet(chainId) {
        if (!this.keyStore) {
            throw new router_1.KeplrError("keyring", 130, "Key store is empty");
        }
        return (this.keyStore.coinTypeForChain &&
            this.keyStore.coinTypeForChain[cosmos_1.ChainIdHelper.parse(chainId).identifier] !== undefined);
    }
    setKeyStoreCoinType(chainId, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyStore) {
                throw new router_1.KeplrError("keyring", 130, "Key store is empty");
            }
            if (this.keyStore.coinTypeForChain &&
                this.keyStore.coinTypeForChain[cosmos_1.ChainIdHelper.parse(chainId).identifier] !== undefined) {
                throw new router_1.KeplrError("keyring", 110, "Coin type already set");
            }
            this.keyStore.coinTypeForChain = Object.assign(Object.assign({}, this.keyStore.coinTypeForChain), { [cosmos_1.ChainIdHelper.parse(chainId).identifier]: coinType });
            const keyStoreInMulti = this.multiKeyStore.find((keyStore) => {
                return (KeyRing.getKeyStoreId(keyStore) ===
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    KeyRing.getKeyStoreId(this.keyStore));
            });
            if (keyStoreInMulti) {
                keyStoreInMulti.coinTypeForChain = Object.assign({}, this.keyStore.coinTypeForChain);
            }
            yield this.save();
        });
    }
    removeAllKeyStoreCoinType(chainId) {
        var _a, _b;
        const identifier = cosmos_1.ChainIdHelper.parse(chainId).identifier;
        if (this.keyStore) {
            const coinTypeForChain = (_a = this.keyStore.coinTypeForChain) !== null && _a !== void 0 ? _a : {};
            delete coinTypeForChain[identifier];
            this.keyStore.coinTypeForChain = coinTypeForChain;
        }
        for (const keyStore of this.multiKeyStore) {
            const coinTypeForChain = (_b = keyStore.coinTypeForChain) !== null && _b !== void 0 ? _b : {};
            delete coinTypeForChain[identifier];
            keyStore.coinTypeForChain = coinTypeForChain;
        }
        this.save();
    }
    deleteKeyRing(index, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
            }
            if (this.password !== password) {
                throw new router_1.KeplrError("keyring", 121, "Invalid password");
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_1.KeplrError("keyring", 130, "Key store is empty");
            }
            const multiKeyStore = this.multiKeyStore
                .slice(0, index)
                .concat(this.multiKeyStore.slice(index + 1));
            // Make sure that password is valid.
            yield crypto_1.Crypto.decrypt(this.crypto, this.multiKeyStore[0], password);
            let keyStoreChanged = false;
            if (this.keyStore) {
                // If key store is currently selected key store
                if (KeyRing.getKeyStoreId(keyStore) === KeyRing.getKeyStoreId(this.keyStore)) {
                    // If there is a key store left
                    if (multiKeyStore.length > 0) {
                        // Lock key store at first
                        yield this.lock();
                        // Select first key store
                        this.keyStore = multiKeyStore[0];
                        // And unlock it
                        yield this.unlock(password);
                    }
                    else {
                        // Else clear keyring.
                        this.keyStore = null;
                        this.mnemonicMasterSeed = undefined;
                        this.privateKey = undefined;
                        this.ledgerPublicKeyCache = undefined;
                        this.misesService.lockAll();
                    }
                    keyStoreChanged = true;
                }
            }
            this.multiKeyStore = multiKeyStore;
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
                keyStoreChanged,
            };
        });
    }
    updateNameKeyRing(index, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_1.KeplrError("keyring", 130, "Key store is empty");
            }
            keyStore.meta = Object.assign(Object.assign({}, keyStore.meta), { name: name });
            // If select key store and changed store are same, sync keystore
            if (this.keyStore &&
                KeyRing.getKeyStoreId(this.keyStore) === KeyRing.getKeyStoreId(keyStore)) {
                this.keyStore = keyStore;
            }
            yield this.save();
            return this.getMultiKeyStoreInfo();
        });
    }
    loadKey(coinType, useEthereumAddress = false) {
        if (this.status !== KeyRingStatus.UNLOCKED) {
            throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
        }
        if (!this.keyStore) {
            throw new router_1.KeplrError("keyring", 130, "Key store is empty");
        }
        const privKey = this.loadPrivKey(coinType);
        const pubKey = privKey.getPubKey();
        if (useEthereumAddress) {
            // For Ethereum Key-Gen Only:
            const wallet = new wallet_1.Wallet(privKey.toBytes());
            return {
                algo: "ethsecp256k1",
                pubKey: pubKey.toBytes(),
                address: buffer_1.Buffer.from(wallet.address.replace("0x", ""), "hex"),
                isNanoLedger: false,
            };
        }
        // Default
        return {
            algo: "secp256k1",
            pubKey: pubKey.toBytes(),
            address: pubKey.getAddress(),
            isNanoLedger: false,
        };
    }
    loadPrivKey(coinType) {
        if (this.status !== KeyRingStatus.UNLOCKED ||
            this.type === "none" ||
            !this.keyStore) {
            throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
        }
        const bip44HDPath = KeyRing.getKeyStoreBIP44Path(this.keyStore);
        if (this.type === "mnemonic") {
            const path = `m/44'/${coinType}'/${bip44HDPath.account}'/${bip44HDPath.change}/${bip44HDPath.addressIndex}`;
            const cachedKey = this.cached.get(path);
            if (cachedKey) {
                return new crypto_2.PrivKeySecp256k1(cachedKey);
            }
            if (!this.mnemonicMasterSeed) {
                throw new router_1.KeplrError("keyring", 133, "Key store type is mnemonic and it is unlocked. But, mnemonic is not loaded unexpectedly");
            }
            const privKey = crypto_2.Mnemonic.generatePrivateKeyFromMasterSeed(this.mnemonicMasterSeed, path);
            this.cached.set(path, privKey);
            return new crypto_2.PrivKeySecp256k1(privKey);
        }
        else if (this.type === "privateKey") {
            // If key store type is private key, path will be ignored.
            if (!this.privateKey) {
                throw new router_1.KeplrError("keyring", 134, "Key store type is private key and it is unlocked. But, private key is not loaded unexpectedly");
            }
            return new crypto_2.PrivKeySecp256k1(this.privateKey);
        }
        else {
            throw new router_1.KeplrError("keyring", 145, "Unexpected type of keyring");
        }
    }
    sign(env, chainId, defaultCoinType, message, useEthereumSigning) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(env);
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
            }
            if (!this.keyStore) {
                throw new router_1.KeplrError("keyring", 130, "Key store is empty");
            }
            const coinType = this.computeKeyStoreCoinType(chainId, defaultCoinType);
            const privKey = this.loadPrivKey(coinType);
            const signature = useEthereumSigning
                ? privKey.signDigest32(crypto_2.Hash.keccak256(message))
                : privKey.sign(message);
            // Signing indicates an explicit use of this coin type.
            // Mainly, this logic exists to explicitly set the coin type when signing by an external request.
            if (!this.isKeyStoreCoinTypeSet(chainId)) {
                yield this.setKeyStoreCoinType(chainId, coinType);
            }
            console.log("sign");
            return signature;
            // }
        });
    }
    signEthereum(env, chainId, defaultCoinType, message, type) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(env);
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
            }
            if (!this.keyStore) {
                throw new router_1.KeplrError("keyring", 130, "Key store is empty");
            }
            const coinType = this.computeKeyStoreCoinType(chainId, defaultCoinType);
            // Allow signing with Ethereum for chains with coinType !== 60
            const privKey = this.loadPrivKey(coinType);
            const ethWallet = new wallet_1.Wallet(privKey.toBytes());
            switch (type) {
                case types_1.EthSignType.MESSAGE: {
                    // Sign bytes with prefixed Ethereum magic
                    const signature = yield ethWallet.signMessage(message);
                    return BytesUtils.arrayify(signature);
                }
                case types_1.EthSignType.TRANSACTION: {
                    // Sign Ethereum transaction
                    const signature = yield ethWallet.signTransaction(JSON.parse(buffer_1.Buffer.from(message).toString()));
                    return BytesUtils.arrayify(signature);
                }
                case types_1.EthSignType.EIP712: {
                    const data = yield eip712_1.EIP712MessageValidator.validateAsync(JSON.parse(buffer_1.Buffer.from(message).toString()));
                    // Since ethermint eip712 tx uses non-standard format, it cannot pass validation of ethersjs.
                    // Therefore, it should be handled at a slightly lower level.
                    const signature = yield ethWallet._signingKey().signDigest(crypto_2.Hash.keccak256(buffer_1.Buffer.concat([
                        // eth separator
                        buffer_1.Buffer.from("19", "hex"),
                        // Version: 1
                        buffer_1.Buffer.from("01", "hex"),
                        buffer_1.Buffer.from(hash_1._TypedDataEncoder
                            .hashStruct("EIP712Domain", { EIP712Domain: data.types.EIP712Domain }, data.domain)
                            .replace("0x", ""), "hex"),
                        buffer_1.Buffer.from(hash_1._TypedDataEncoder
                            .from(
                        // Seems that there is no way to set primary type and the first type becomes primary type.
                        (() => {
                            const types = Object.assign({}, data.types);
                            delete types["EIP712Domain"];
                            const primary = types[data.primaryType];
                            if (!primary) {
                                throw new Error(`No matched primary type: ${data.primaryType}`);
                            }
                            delete types[data.primaryType];
                            return Object.assign({ [data.primaryType]: primary }, types);
                        })())
                            .hash(data.message)
                            .replace("0x", ""), "hex"),
                    ])));
                    return buffer_1.Buffer.concat([
                        buffer_1.Buffer.from(signature.r.replace("0x", ""), "hex"),
                        buffer_1.Buffer.from(signature.s.replace("0x", ""), "hex"),
                        // The metamask doesn't seem to consider the chain id in this case... (maybe bug on metamask?)
                        signature.recoveryParam
                            ? buffer_1.Buffer.from("1c", "hex")
                            : buffer_1.Buffer.from("1b", "hex"),
                    ]);
                }
                default:
                    throw new Error(`Unknown sign type: ${type}`);
            }
        });
    }
    // Show private key or mnemonic key if password is valid.
    showKeyRing(index, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
            }
            if (this.password !== password) {
                throw new router_1.KeplrError("keyring", 121, "Invalid password");
            }
            // If the index is -1, the mnemonic is exported
            if (index === -1) {
                const keyStore = this.multiKeyStore[0];
                return buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, keyStore, password)).toString();
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_1.KeplrError("keyring", 130, "Key store is empty");
            }
            if (keyStore.type === "mnemonic") {
                // If password is invalid, error will be thrown.
                if (!this.checkPassword(password)) {
                    throw new router_1.KeplrError("keyring", 222, "Unmatched mac");
                }
                const privKey = yield this.loadMnemonicPrivKey(60, keyStore);
                const ethWallet = new wallet_1.Wallet(privKey.toBytes());
                return ethWallet.privateKey.replace("0x", "");
            }
            else {
                // If password is invalid, error will be thrown.
                return buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, keyStore, password)).toString();
            }
        });
    }
    loadMnemonicPrivKey(coinType, keyStore) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || !keyStore) {
                throw new router_1.KeplrError("keyring", 143, "Key ring is not unlocked");
            }
            const bip44HDPath = KeyRing.getKeyStoreBIP44Path(keyStore);
            const path = `m/44'/${coinType}'/${bip44HDPath.account}'/${bip44HDPath.change}/${bip44HDPath.addressIndex}`;
            const cachedKey = this.cached.get(path);
            if (cachedKey) {
                return new crypto_2.PrivKeySecp256k1(cachedKey);
            }
            const mnemonic = buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, this.multiKeyStore[0], this.password)).toString();
            const mnemonicMasterSeed = crypto_2.Mnemonic.generateMasterSeedFromMnemonic(mnemonic);
            if (!mnemonicMasterSeed) {
                throw new router_1.KeplrError("keyring", 133, "Key store type is mnemonic and it is unlocked. But, mnemonic is not loaded unexpectedly");
            }
            const privKey = crypto_2.Mnemonic.generatePrivateKeyFromMasterSeed(mnemonicMasterSeed, path);
            this.cached.set(path, privKey);
            return new crypto_2.PrivKeySecp256k1(privKey);
        });
    }
    get canSetPath() {
        return this.type === "mnemonic" || this.type === "ledger";
    }
    addMnemonicKey(kdf, mnemonic, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || this.password == "") {
                throw new router_1.KeplrError("keyring", 141, "Key ring is locked or not initialized");
            }
            console.log(mnemonic);
            const keyStore = yield KeyRing.CreateMnemonicKeyStore(this.crypto, kdf, "", "", yield this.assignKeyStoreIdMeta(meta), bip44HDPath);
            this.multiKeyStore.push(keyStore);
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    _checkPrivateKey(privatekeyStore, currentKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(privatekeyStore) && privatekeyStore.length > 0) {
                const privatePromiseKeyStore = privatekeyStore.map((keyStore) => __awaiter(this, void 0, void 0, function* () {
                    return buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, keyStore, this.password)).toString();
                }));
                const privateKeyStoreList = yield Promise.all(privatePromiseKeyStore);
                return privateKeyStoreList.some((privateKey) => privateKey === currentKey);
            }
            return false;
        });
    }
    addPrivateKey(kdf, privateKey, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || this.password == "") {
                throw new router_1.KeplrError("keyring", 141, "Key ring is locked or not initialized");
            }
            const privatekeyStore = this.multiKeyStore.filter((val) => val.type === "privateKey");
            if (privatekeyStore.length > 0) {
                const isChecked = yield this._checkPrivateKey(privatekeyStore, buffer_1.Buffer.from(privateKey).toString("hex"));
                if (isChecked) {
                    throw new router_1.KeplrError("keyring", 141, "Don't repeat the import privateKey");
                }
            }
            const keyStore = yield KeyRing.CreatePrivateKeyStore(this.crypto, kdf, privateKey, this.password, yield this.assignKeyStoreIdMeta(meta));
            this.multiKeyStore.push(keyStore);
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    changeKeyStoreFromMultiKeyStore(index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || this.password == "") {
                throw new router_1.KeplrError("keyring", 141, "Key ring is locked or not initialized");
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_1.KeplrError("keyring", 120, "Invalid keystore");
            }
            this.keyStore = keyStore;
            yield this.unlock(this.password);
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    getMultiKeyStoreInfo() {
        const result = [];
        for (const keyStore of this.multiKeyStore) {
            result.push({
                version: keyStore.version,
                type: keyStore.type,
                meta: keyStore.meta,
                coinTypeForChain: keyStore.coinTypeForChain,
                bip44HDPath: keyStore.bip44HDPath,
                selected: this.keyStore
                    ? KeyRing.getKeyStoreId(keyStore) ===
                        KeyRing.getKeyStoreId(this.keyStore)
                    : false,
            });
        }
        return result;
    }
    checkPassword(password) {
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 100, "Keyring is locked");
        }
        return this.password === password;
    }
    exportKeyRingDatas(password) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.password) {
                throw new router_1.KeplrError("keyring", 100, "Keyring is locked");
            }
            if (this.password !== password) {
                throw new router_1.KeplrError("keyring", 121, "Invalid password");
            }
            const result = [];
            for (const keyStore of this.multiKeyStore) {
                const type = (_a = keyStore.type) !== null && _a !== void 0 ? _a : "mnemonic";
                switch (type) {
                    case "mnemonic": {
                        const mnemonic = buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, this.multiKeyStore[0], password)).toString();
                        result.push({
                            bip44HDPath: (_b = keyStore.bip44HDPath) !== null && _b !== void 0 ? _b : {
                                account: 0,
                                change: 0,
                                addressIndex: 0,
                            },
                            coinTypeForChain: keyStore.coinTypeForChain,
                            key: mnemonic,
                            meta: (_c = keyStore.meta) !== null && _c !== void 0 ? _c : {},
                            type: "mnemonic",
                        });
                        break;
                    }
                    case "privateKey": {
                        const privateKey = buffer_1.Buffer.from(yield crypto_1.Crypto.decrypt(this.crypto, keyStore, password)).toString();
                        result.push({
                            bip44HDPath: (_d = keyStore.bip44HDPath) !== null && _d !== void 0 ? _d : {
                                account: 0,
                                change: 0,
                                addressIndex: 0,
                            },
                            coinTypeForChain: keyStore.coinTypeForChain,
                            key: privateKey,
                            meta: (_e = keyStore.meta) !== null && _e !== void 0 ? _e : {},
                            type: "privateKey",
                        });
                        break;
                    }
                }
            }
            return result;
        });
    }
    static CreateMnemonicKeyStore(crypto, kdf, mnemonic, password, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield crypto_1.Crypto.encrypt(crypto, kdf, "mnemonic", mnemonic, password, meta, bip44HDPath);
        });
    }
    static CreatePrivateKeyStore(crypto, kdf, privateKey, password, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield crypto_1.Crypto.encrypt(crypto, kdf, "privateKey", buffer_1.Buffer.from(privateKey).toString("hex"), password, meta);
        });
    }
    assignKeyStoreIdMeta(meta) {
        return __awaiter(this, void 0, void 0, function* () {
            // `__id__` is used to distinguish the key store.
            return Object.assign({}, meta, {
                __id__: (yield this.getIncrementalNumber()).toString(),
            });
        });
    }
    static getKeyStoreId(keyStore) {
        var _a;
        const id = (_a = keyStore.meta) === null || _a === void 0 ? void 0 : _a.__id__;
        if (!id) {
            throw new router_1.KeplrError("keyring", 131, "Key store's id is empty");
        }
        return id;
    }
    static getKeyStoreBIP44Path(keyStore) {
        if (!keyStore.bip44HDPath) {
            return {
                account: 0,
                change: 0,
                addressIndex: 0,
            };
        }
        KeyRing.validateBIP44Path(keyStore.bip44HDPath);
        return keyStore.bip44HDPath;
    }
    static validateBIP44Path(bip44Path) {
        if (!Number.isInteger(bip44Path.account) || bip44Path.account < 0) {
            throw new router_1.KeplrError("keyring", 100, "Invalid account in hd path");
        }
        if (!Number.isInteger(bip44Path.change) ||
            !(bip44Path.change === 0 || bip44Path.change === 1)) {
            throw new router_1.KeplrError("keyring", 102, "Invalid change in hd path");
        }
        if (!Number.isInteger(bip44Path.addressIndex) ||
            bip44Path.addressIndex < 0) {
            throw new router_1.KeplrError("keyring", 101, "Invalid address index in hd path");
        }
    }
    getIncrementalNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            let num = yield this.kvStore.get("incrementalNumber");
            if (num === undefined) {
                num = 0;
            }
            num++;
            yield this.kvStore.set("incrementalNumber", num);
            return num;
        });
    }
    // XXX: There are other way to handle tx with ethermint on ledger.
    //      However, some chains have probably competitive spirit with evmos.
    //      They make unnecessary and silly minor changes to ethermint spec.
    //      Thus, there is a probability that it will potentially not work on other chains and they blame us.
    //      So, block them explicitly for now.
    throwErrorIfEthermintWithLedgerButNotEvmos(chainId) {
        if (this.keyStore && this.keyStore.type === "ledger") {
            if (!chainId.startsWith("evmos_")) {
                throw new router_1.KeplrError("keyring", 152, "Ledger is unsupported for this chain");
            }
        }
    }
    addAccount(name, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.addMnemonicKey("scrypt", "", {
                    name,
                }, bip44HDPath);
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    _restoreFirstAccount(mnemonic, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createMnemonicKey("scrypt", mnemonic, password, {
                name: "Account 1",
            }, {
                account: 0,
                change: 0,
                addressIndex: 0,
            });
        });
    }
    _addAccounts(addNumber, mnemonicKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = new Array(addNumber).fill("").map((_value, index) => {
                const bip44HDPath = {
                    account: 0,
                    addressIndex: index + 1,
                    change: 0,
                };
                const name = `Account ${index + 2}`;
                return {
                    bip44HDPath,
                    name,
                };
            });
            let multiKeyStore = {
                multiKeyStoreInfo: [],
            };
            for (let index = 0; index < accounts.length; index++) {
                const element = accounts[index];
                multiKeyStore = yield this.addAccount(element.name, element.bip44HDPath);
            }
            // add private key account
            const simpleKeys = mnemonicKeys.find((val) => val.type === "Simple Key Pair");
            if ((simpleKeys === null || simpleKeys === void 0 ? void 0 : simpleKeys.data.length) > 0) {
                for (let index = 0; index < (simpleKeys === null || simpleKeys === void 0 ? void 0 : simpleKeys.data.length); index++) {
                    const element = simpleKeys === null || simpleKeys === void 0 ? void 0 : simpleKeys.data[index];
                    const privateKey = buffer_1.Buffer.from(element, "hex");
                    multiKeyStore = yield this.addPrivateKey("scrypt", privateKey, {
                        name: `Account ${multiKeyStore.multiKeyStoreInfo.length + 1}`,
                    });
                }
            }
            return multiKeyStore;
        });
    }
    migratorKeyRing(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mnemonicKeys = yield this.migrator.enCodeValut(this.migratorStore, password);
                const mnemonicKey = mnemonicKeys.find((val) => val.type === "HD Key Tree");
                if (mnemonicKey) {
                    const mnemonic = buffer_1.Buffer.from(mnemonicKey === null || mnemonicKey === void 0 ? void 0 : mnemonicKey.data.mnemonic).toString("utf8");
                    const numberOfAccounts = mnemonicKey === null || mnemonicKey === void 0 ? void 0 : mnemonicKey.data.numberOfAccounts;
                    const firstAccount = yield this._restoreFirstAccount(mnemonic, password);
                    // An account has already been initialized, so need to delete first account number
                    const addNumber = numberOfAccounts > 1 ? numberOfAccounts - 1 : 0;
                    // clear thhe metamask cache data
                    yield this.migrator.clearCache();
                    this.migratorStore = {
                        vault: "",
                    };
                    return addNumber > 0
                        ? yield this._addAccounts(addNumber, mnemonicKeys)
                        : firstAccount;
                }
                return {
                    multiKeyStoreInfo: [],
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    restoreKeyStore() {
        this.keyStore = null;
        this.multiKeyStore = [];
        this.save();
    }
}
exports.KeyRing = KeyRing;
//# sourceMappingURL=keyring.js.map

/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSecret20ViewingKey = exports.RemoveTokenMsg = exports.AddTokenMsg = exports.SuggestTokenMsg = exports.GetTokensMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(540);
class GetTokensMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "get-tokens";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("tokens", 100, "Chain id is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetTokensMsg.type();
    }
}
exports.GetTokensMsg = GetTokensMsg;
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
    approveExternal() {
        return true;
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("tokens", 100, "Chain id is empty");
        }
        if (!this.contractAddress) {
            throw new router_1.KeplrError("tokens", 101, "Contract address is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SuggestTokenMsg.type();
    }
}
exports.SuggestTokenMsg = SuggestTokenMsg;
class AddTokenMsg extends router_1.Message {
    constructor(chainId, currency) {
        super();
        this.chainId = chainId;
        this.currency = currency;
    }
    static type() {
        return "add-token";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("tokens", 100, "Chain id is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return AddTokenMsg.type();
    }
}
exports.AddTokenMsg = AddTokenMsg;
class RemoveTokenMsg extends router_1.Message {
    constructor(chainId, currency) {
        super();
        this.chainId = chainId;
        this.currency = currency;
    }
    static type() {
        return "remove-token";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("tokens", 100, "Chain id is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RemoveTokenMsg.type();
    }
}
exports.RemoveTokenMsg = RemoveTokenMsg;
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
            throw new router_1.KeplrError("tokens", 100, "Chain id is empty");
        }
        if (!this.contractAddress) {
            throw new router_1.KeplrError("tokens", 101, "Contract address is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetSecret20ViewingKey.type();
    }
}
exports.GetSecret20ViewingKey = GetSecret20ViewingKey;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepAliveMsg = exports.LockMsg = exports.StartAutoLockMonitoringMsg = exports.UpdateAutoLockAccountDurationMsg = exports.GetAutoLockAccountDurationMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(547);
class GetAutoLockAccountDurationMsg extends router_1.Message {
    static type() {
        return "get-auto-lock-account-duration";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetAutoLockAccountDurationMsg.type();
    }
}
exports.GetAutoLockAccountDurationMsg = GetAutoLockAccountDurationMsg;
class UpdateAutoLockAccountDurationMsg extends router_1.Message {
    constructor(duration) {
        super();
        this.duration = duration;
    }
    static type() {
        return "update-auto-lock-account-duration";
    }
    validateBasic() {
        if (this.duration < 0) {
            throw new router_1.KeplrError("auto-lock-account", 101, "duration cannot be set to a negative number.");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return UpdateAutoLockAccountDurationMsg.type();
    }
}
exports.UpdateAutoLockAccountDurationMsg = UpdateAutoLockAccountDurationMsg;
class StartAutoLockMonitoringMsg extends router_1.Message {
    static type() {
        return "start-auto-lock-monitoring";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return StartAutoLockMonitoringMsg.type();
    }
}
exports.StartAutoLockMonitoringMsg = StartAutoLockMonitoringMsg;
class LockMsg extends router_1.Message {
    static type() {
        return "lock-msg";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return LockMsg.type();
    }
}
exports.LockMsg = LockMsg;
class KeepAliveMsg extends router_1.Message {
    static type() {
        return "keepAlive-msg";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return KeepAliveMsg.type();
    }
}
exports.KeepAliveMsg = KeepAliveMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 232:
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
exports.shortenAddress = exports.MISES_TRUNCATED_ADDRESS_START_CHARS = exports.TRUNCATED_ADDRESS_END_CHARS = exports.TRUNCATED_ADDRESS_START_CHARS = exports.TRUNCATED_NAME_CHAR_LIMIT = exports.cancelAllRequest = exports.cancelRequest = exports.misesRequest = exports.Request = exports.MISES_POINT = exports.MISES_SITE_API = void 0;
exports.MISES_SITE_API = "https://api.alb.mises.site/api/v1";
//export const MISES_SITE_API = "http://localhost:8080/api/v1";
// export const MISES_POINT = 'http://192.168.1.8:26657';
exports.MISES_POINT = "http://127.0.0.1:26657";
const axios_1 = __importDefault(__webpack_require__(60));
const axios_fetch_adapter_1 = __importDefault(__webpack_require__(595));
class Request {
    constructor(config) {
        var _a, _b, _c, _d;
        this.requestUrlList = [];
        this.cancelRequestSourceList = [];
        this.instance = axios_1.default.create(Object.assign(Object.assign({}, config), { adapter: axios_fetch_adapter_1.default }));
        this.interceptorsObj = config.interceptors;
        // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
        this.instance.interceptors.request.use((res) => res, (err) => err);
        // 使用实例拦截器
        this.instance.interceptors.request.use((_a = this.interceptorsObj) === null || _a === void 0 ? void 0 : _a.requestInterceptors, (_b = this.interceptorsObj) === null || _b === void 0 ? void 0 : _b.requestInterceptorsCatch);
        this.instance.interceptors.response.use((_c = this.interceptorsObj) === null || _c === void 0 ? void 0 : _c.responseInterceptors, (_d = this.interceptorsObj) === null || _d === void 0 ? void 0 : _d.responseInterceptorsCatch);
        // 全局响应拦截器保证最后执行
        this.instance.interceptors.response.use(
        // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
        (res) => {
            return res.data;
        }, (err) => err);
    }
    /**
     * @description: 获取指定 url 在 cancelRequestSourceList 中的索引
     * @param {string} url
     * @returns {number} 索引位置
     */
    getSourceIndex(url) {
        var _a;
        return (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.findIndex((item) => {
            return Object.keys(item)[0] === url;
        });
    }
    /**
     * @description: 删除 requestUrlList 和 cancelRequestSourceList
     * @param {string} url
     * @returns {*}
     */
    delUrl(url) {
        var _a, _b, _c;
        const urlIndex = (_a = this.requestUrlList) === null || _a === void 0 ? void 0 : _a.findIndex((u) => u === url);
        const sourceIndex = this.getSourceIndex(url);
        // 删除url和cancel方法
        urlIndex !== -1 && ((_b = this.requestUrlList) === null || _b === void 0 ? void 0 : _b.splice(urlIndex, 1));
        sourceIndex !== -1 && ((_c = this.cancelRequestSourceList) === null || _c === void 0 ? void 0 : _c.splice(sourceIndex, 1));
    }
    request(config) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
            if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config);
            }
            const url = config.url;
            // url存在保存取消请求方法和当前请求url
            if (url) {
                (_b = this.requestUrlList) === null || _b === void 0 ? void 0 : _b.push(url);
                // TODO 在axios0.22起，对CancelToken已经弃用，需要改成  AbortController 文档：https://axios-http.com/docs/cancellation
                config.cancelToken = new axios_1.default.CancelToken((c) => {
                    var _a;
                    (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.push({
                        [url]: c,
                    });
                });
            }
            this.instance
                .request(config)
                .then((res) => {
                var _a;
                // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
                if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.responseInterceptors) {
                    res = config.interceptors.responseInterceptors(res);
                }
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            })
                .finally(() => {
                url && this.delUrl(url);
            });
        });
    }
    // 取消请求
    cancelRequest(url) {
        var _a;
        if (typeof url === "string") {
            // 取消单个请求
            const sourceIndex = this.getSourceIndex(url);
            sourceIndex >= 0 && ((_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a[sourceIndex][url]());
        }
        else {
            // 存在多个需要取消请求的地址
            url.forEach((u) => {
                var _a;
                const sourceIndex = this.getSourceIndex(u);
                sourceIndex >= 0 && ((_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a[sourceIndex][u]());
            });
        }
    }
    // 取消全部请求
    cancelAllRequest() {
        var _a;
        (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.forEach((source) => {
            const key = Object.keys(source)[0];
            source[key]();
        });
    }
}
exports.Request = Request;
const request = new Request({
    baseURL: exports.MISES_SITE_API,
    timeout: 6000,
    interceptors: {
        // 请求拦截器
        requestInterceptors: (config) => config,
        // 响应拦截器
        responseInterceptors: (result) => {
            return result;
        },
    },
});
/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {misesRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const misesRequest = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const { method = "GET" } = config;
    if (method === "get" || method === "GET") {
        config.params = config.data;
    }
    try {
        const data = yield request.request(config);
        if (data.code === "ECONNABORTED") {
            return Promise.reject("ECONNABORTED");
        }
        let response = data;
        if (config.isCustomRequest) {
            const res = data;
            response = {
                data: res,
                code: "0",
                message: "success",
            };
        }
        return response.data;
    }
    catch (error) {
        console.log(error, "error");
        return Promise.reject(error);
    }
});
exports.misesRequest = misesRequest;
// 取消请求
const cancelRequest = (url) => request.cancelRequest(url);
exports.cancelRequest = cancelRequest;
// 取消全部请求
const cancelAllRequest = () => request.cancelAllRequest();
exports.cancelAllRequest = cancelAllRequest;
// The character limit on ENS names, nicknames and addresses before we truncate
exports.TRUNCATED_NAME_CHAR_LIMIT = 11;
// The number of characters to slice from the beginning of an address for truncated format:
// `${TRUNCATED_ADDRESS_START_CHARS}...${TRUNCATED_ADDRESS_END_CHARS}`
exports.TRUNCATED_ADDRESS_START_CHARS = 5;
// The number of characters to slice from the end of an address for truncated format:
// `${TRUNCATED_ADDRESS_START_CHARS}...${TRUNCATED_ADDRESS_END_CHARS}`
exports.TRUNCATED_ADDRESS_END_CHARS = 4;
exports.MISES_TRUNCATED_ADDRESS_START_CHARS = 8;
function shortenAddress(address = "", prefix = exports.TRUNCATED_ADDRESS_START_CHARS) {
    if (address.length < exports.TRUNCATED_NAME_CHAR_LIMIT) {
        return address;
    }
    return `${address.slice(0, prefix)}...${address.slice(-exports.TRUNCATED_ADDRESS_END_CHARS)}`;
}
exports.shortenAddress = shortenAddress;
//# sourceMappingURL=mises-network.util.js.map

/***/ }),

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPersistentMemoryMsg = exports.SetPersistentMemoryMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(519);
class SetPersistentMemoryMsg extends router_1.Message {
    constructor(data) {
        super();
        this.data = data;
    }
    static type() {
        return "set-persistent-memory";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() { }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SetPersistentMemoryMsg.type();
    }
}
exports.SetPersistentMemoryMsg = SetPersistentMemoryMsg;
class GetPersistentMemoryMsg extends router_1.Message {
    static type() {
        return "get-persistent-memory";
    }
    constructor() {
        super();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() { }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetPersistentMemoryMsg.type();
    }
}
exports.GetPersistentMemoryMsg = GetPersistentMemoryMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 334:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RemovePermissionsOrigin = exports.RemovePermissionOrigin = exports.AddPermissionOrigin = exports.GetOriginPermittedChainsMsg = exports.GetPermissionOriginsMsg = exports.EnableAccessMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(526);
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
            throw new router_1.KeplrError("permission", 100, "chain id not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    approveExternal() {
        return true;
    }
    type() {
        return EnableAccessMsg.type();
    }
}
exports.EnableAccessMsg = EnableAccessMsg;
class GetPermissionOriginsMsg extends router_1.Message {
    constructor(chainId, permissionType) {
        super();
        this.chainId = chainId;
        this.permissionType = permissionType;
    }
    static type() {
        return "get-permission-origins";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("permission", 100, "chain id not set");
        }
        if (!this.permissionType) {
            throw new router_1.KeplrError("permission", 110, "empty permission type");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetPermissionOriginsMsg.type();
    }
}
exports.GetPermissionOriginsMsg = GetPermissionOriginsMsg;
class GetOriginPermittedChainsMsg extends router_1.Message {
    constructor(permissionOrigin, permissionType) {
        super();
        this.permissionOrigin = permissionOrigin;
        this.permissionType = permissionType;
    }
    static type() {
        return "get-origin-permitted-chains";
    }
    validateBasic() {
        if (!this.permissionOrigin) {
            throw new router_1.KeplrError("permission", 101, "origin not set");
        }
        if (!this.permissionType) {
            throw new router_1.KeplrError("permission", 110, "empty permission type");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetOriginPermittedChainsMsg.type();
    }
}
exports.GetOriginPermittedChainsMsg = GetOriginPermittedChainsMsg;
class AddPermissionOrigin extends router_1.Message {
    constructor(chainId, permissionType, permissionOrigin) {
        super();
        this.chainId = chainId;
        this.permissionType = permissionType;
        this.permissionOrigin = permissionOrigin;
    }
    static type() {
        return "add-permission-origin";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("permission", 100, "chain id not set");
        }
        if (!this.permissionType) {
            throw new router_1.KeplrError("permission", 110, "empty permission type");
        }
        if (!this.permissionOrigin) {
            throw new router_1.KeplrError("permission", 111, "empty permission origin");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return AddPermissionOrigin.type();
    }
}
exports.AddPermissionOrigin = AddPermissionOrigin;
class RemovePermissionOrigin extends router_1.Message {
    constructor(chainId, permissionType, permissionOrigin) {
        super();
        this.chainId = chainId;
        this.permissionType = permissionType;
        this.permissionOrigin = permissionOrigin;
    }
    static type() {
        return "remove-permission-origin";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("permission", 100, "chain id not set");
        }
        if (!this.permissionType) {
            throw new router_1.KeplrError("permission", 110, "empty permission type");
        }
        if (!this.permissionOrigin) {
            throw new router_1.KeplrError("permission", 111, "empty permission origin");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RemovePermissionOrigin.type();
    }
}
exports.RemovePermissionOrigin = RemovePermissionOrigin;
class RemovePermissionsOrigin extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "remove-permissions-origin";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("permission", 100, "chain id not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RemovePermissionsOrigin.type();
    }
}
exports.RemovePermissionsOrigin = RemovePermissionsOrigin;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoreKeyStoreMsg = exports.MigratorKeyRingMsg = exports.AddAccountMsg = exports.IsUnlockMsg = exports.ExportKeyRingDatasMsg = exports.CheckPasswordMsg = exports.SetKeyStoreCoinTypeMsg = exports.GetIsKeyStoreCoinTypeSetMsg = exports.ChangeKeyRingMsg = exports.GetMultiKeyStoreInfoMsg = exports.RequestSignDirectMsg = exports.RequestVerifyADR36AminoSignDoc = exports.RequestSignEIP712CosmosTxMsg_v0 = exports.RequestSignAminoMsg = exports.GetKeyMsg = exports.UnlockKeyRingMsg = exports.LockKeyRingMsg = exports.AddPrivateKeyMsg = exports.CreatePrivateKeyMsg = exports.AddMnemonicKeyMsg = exports.CreateMnemonicKeyMsg = exports.ShowKeyRingMsg = exports.UpdateNameKeyRingMsg = exports.DeleteKeyRingMsg = exports.RestoreKeyRingMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(533);
const keyring_1 = __webpack_require__(229);
const cosmos_1 = __webpack_require__(16);
const types_1 = __webpack_require__(96);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = __webpack_require__(105);
const tx_1 = __webpack_require__(100);
const buffer_1 = __webpack_require__(4);
class RestoreKeyRingMsg extends router_1.Message {
    static type() {
        return "restore-keyring";
    }
    constructor() {
        super();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() { }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RestoreKeyRingMsg.type();
    }
}
exports.RestoreKeyRingMsg = RestoreKeyRingMsg;
class DeleteKeyRingMsg extends router_1.Message {
    constructor(index, password) {
        super();
        this.index = index;
        this.password = password;
    }
    static type() {
        return "delete-keyring";
    }
    validateBasic() {
        if (!Number.isInteger(this.index)) {
            throw new router_1.KeplrError("keyring", 201, "Invalid index");
        }
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return DeleteKeyRingMsg.type();
    }
}
exports.DeleteKeyRingMsg = DeleteKeyRingMsg;
class UpdateNameKeyRingMsg extends router_1.Message {
    constructor(index, name) {
        super();
        this.index = index;
        this.name = name;
    }
    static type() {
        return "update-name-keyring";
    }
    validateBasic() {
        if (!Number.isInteger(this.index)) {
            throw new router_1.KeplrError("keyring", 201, "Invalid index");
        }
        if (!this.name) {
            throw new router_1.KeplrError("keyring", 273, "name not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return UpdateNameKeyRingMsg.type();
    }
}
exports.UpdateNameKeyRingMsg = UpdateNameKeyRingMsg;
class ShowKeyRingMsg extends router_1.Message {
    constructor(index, password) {
        super();
        this.index = index;
        this.password = password;
    }
    static type() {
        return "show-keyring";
    }
    validateBasic() {
        if (!Number.isInteger(this.index)) {
            throw new router_1.KeplrError("keyring", 201, "Invalid index");
        }
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return ShowKeyRingMsg.type();
    }
}
exports.ShowKeyRingMsg = ShowKeyRingMsg;
class CreateMnemonicKeyMsg extends router_1.Message {
    constructor(kdf, mnemonic, password, meta, bip44HDPath) {
        super();
        this.kdf = kdf;
        this.mnemonic = mnemonic;
        this.password = password;
        this.meta = meta;
        this.bip44HDPath = bip44HDPath;
    }
    static type() {
        return "create-mnemonic-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_1.KeplrError("keyring", 202, "Invalid kdf");
        }
        if (!this.mnemonic) {
            throw new router_1.KeplrError("keyring", 272, "mnemonic not set");
        }
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
        // Validate mnemonic.
        // Checksome is not validate in this method.
        // Keeper should handle the case of invalid checksome.
        try {
            bip39.mnemonicToEntropy(this.mnemonic);
        }
        catch (e) {
            if (e.message !== "Invalid mnemonic checksum") {
                throw e;
            }
        }
        keyring_1.KeyRing.validateBIP44Path(this.bip44HDPath);
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return CreateMnemonicKeyMsg.type();
    }
}
exports.CreateMnemonicKeyMsg = CreateMnemonicKeyMsg;
class AddMnemonicKeyMsg extends router_1.Message {
    constructor(kdf, mnemonic, meta, bip44HDPath) {
        super();
        this.kdf = kdf;
        this.mnemonic = mnemonic;
        this.meta = meta;
        this.bip44HDPath = bip44HDPath;
    }
    static type() {
        return "add-mnemonic-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_1.KeplrError("keyring", 202, "Invalid kdf");
        }
        if (!this.mnemonic) {
            throw new router_1.KeplrError("keyring", 272, "mnemonic not set");
        }
        // Validate mnemonic.
        // Checksome is not validate in this method.
        // Keeper should handle the case of invalid checksome.
        try {
            bip39.mnemonicToEntropy(this.mnemonic);
        }
        catch (e) {
            if (e.message !== "Invalid mnemonic checksum") {
                throw e;
            }
        }
        keyring_1.KeyRing.validateBIP44Path(this.bip44HDPath);
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return AddMnemonicKeyMsg.type();
    }
}
exports.AddMnemonicKeyMsg = AddMnemonicKeyMsg;
class CreatePrivateKeyMsg extends router_1.Message {
    constructor(kdf, privateKey, password, meta) {
        super();
        this.kdf = kdf;
        this.privateKey = privateKey;
        this.password = password;
        this.meta = meta;
    }
    static type() {
        return "create-private-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_1.KeplrError("keyring", 202, "Invalid kdf");
        }
        if (!this.privateKey || this.privateKey.length === 0) {
            throw new router_1.KeplrError("keyring", 275, "private key not set");
        }
        if (this.privateKey.length !== 32) {
            throw new router_1.KeplrError("keyring", 260, "invalid length of private key");
        }
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return CreatePrivateKeyMsg.type();
    }
}
exports.CreatePrivateKeyMsg = CreatePrivateKeyMsg;
class AddPrivateKeyMsg extends router_1.Message {
    constructor(kdf, privateKey, meta) {
        super();
        this.kdf = kdf;
        this.privateKey = privateKey;
        this.meta = meta;
    }
    static type() {
        return "add-private-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_1.KeplrError("keyring", 202, "Invalid kdf");
        }
        if (!this.privateKey || this.privateKey.length === 0) {
            throw new router_1.KeplrError("keyring", 275, "private key not set");
        }
        if (this.privateKey.length !== 32) {
            throw new router_1.KeplrError("keyring", 260, "invalid length of private key");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return AddPrivateKeyMsg.type();
    }
}
exports.AddPrivateKeyMsg = AddPrivateKeyMsg;
class LockKeyRingMsg extends router_1.Message {
    static type() {
        return "lock-keyring";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return LockKeyRingMsg.type();
    }
}
exports.LockKeyRingMsg = LockKeyRingMsg;
class UnlockKeyRingMsg extends router_1.Message {
    constructor(password = "") {
        super();
        this.password = password;
    }
    static type() {
        return "unlock-keyring";
    }
    validateBasic() {
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return UnlockKeyRingMsg.type();
    }
}
exports.UnlockKeyRingMsg = UnlockKeyRingMsg;
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
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetKeyMsg.type();
    }
}
exports.GetKeyMsg = GetKeyMsg;
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
        var _a, _b;
        if (!this.chainId) {
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_1.KeplrError("keyring", 230, "signer not set");
        }
        // Validate bech32 address.
        cosmos_1.Bech32Address.validate(this.signer);
        // Check and validate the ADR-36 sign doc.
        // ADR-36 sign doc doesn't have the chain id
        if (!cosmos_1.checkAndValidateADR36AminoSignDoc(this.signDoc)) {
            if (this.signOptions.ethSignType) {
                throw new Error("Eth sign type can be requested with only ADR-36 amino sign doc");
            }
            if (this.signDoc.chain_id !== this.chainId) {
                throw new router_1.KeplrError("keyring", 234, "Chain id in the message is not matched with the requested chain id");
            }
        }
        else {
            if (this.signDoc.msgs[0].value.signer !== this.signer) {
                throw new router_1.KeplrError("keyring", 233, "Unmatched signer in sign doc");
            }
            if (this.signOptions.ethSignType) {
                switch (this.signOptions.ethSignType) {
                    // TODO: Check chain id in tx data.
                    // case EthSignType.TRANSACTION:
                    case types_1.EthSignType.EIP712: {
                        const message = JSON.parse(buffer_1.Buffer.from(this.signDoc.msgs[0].value.data, "base64").toString());
                        const { ethChainId } = cosmos_1.EthermintChainIdHelper.parse(this.chainId);
                        if (parseFloat((_a = message.domain) === null || _a === void 0 ? void 0 : _a.chainId) !== ethChainId) {
                            throw new Error(`Unmatched chain id for eth (expected: ${ethChainId}, actual: ${(_b = message.domain) === null || _b === void 0 ? void 0 : _b.chainId})`);
                        }
                    }
                    // XXX: There is no way to check chain id if type is message because eth personal sign standard doesn't define chain id field.
                    // case EthSignType.MESSAGE:
                }
            }
        }
        if (!this.signOptions) {
            throw new router_1.KeplrError("keyring", 235, "Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_1.KeplrError("keyring", 230, "signer not set");
        }
        // Validate bech32 address.
        cosmos_1.Bech32Address.validate(this.signer);
        // Check and validate the ADR-36 sign doc.
        // ADR-36 sign doc doesn't have the chain id
        if (!cosmos_1.checkAndValidateADR36AminoSignDoc(this.signDoc)) {
            if (this.signDoc.chain_id !== this.chainId) {
                throw new router_1.KeplrError("keyring", 234, "Chain id in the message is not matched with the requested chain id");
            }
            const { ethChainId } = cosmos_1.EthermintChainIdHelper.parse(this.chainId);
            if (parseFloat(this.eip712.domain.chainId) !== ethChainId) {
                throw new Error(`Unmatched chain id for eth (expected: ${ethChainId}, actual: ${this.eip712.domain.chainId})`);
            }
        }
        else {
            throw new Error("Can't sign ADR-36 with EIP-712");
        }
        if (!this.signOptions) {
            throw new router_1.KeplrError("keyring", 235, "Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_1.KeplrError("keyring", 230, "signer not set");
        }
        if (!this.signature) {
            throw new router_1.KeplrError("keyring", 271, "Signature not set");
        }
        // Validate bech32 address.
        cosmos_1.Bech32Address.validate(this.signer);
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_1.KeplrError("keyring", 230, "signer not set");
        }
        // Validate bech32 address.
        cosmos_1.Bech32Address.validate(this.signer);
        const signDoc = tx_1.SignDoc.fromPartial({
            bodyBytes: this.signDoc.bodyBytes,
            authInfoBytes: this.signDoc.authInfoBytes,
            chainId: this.signDoc.chainId,
            accountNumber: this.signDoc.accountNumber,
        });
        if (signDoc.chainId !== this.chainId) {
            throw new router_1.KeplrError("keyring", 234, "Chain id in the message is not matched with the requested chain id");
        }
        if (!this.signOptions) {
            throw new router_1.KeplrError("keyring", 235, "Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RequestSignDirectMsg.type();
    }
}
exports.RequestSignDirectMsg = RequestSignDirectMsg;
class GetMultiKeyStoreInfoMsg extends router_1.Message {
    static type() {
        return "get-multi-key-store-info";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetMultiKeyStoreInfoMsg.type();
    }
}
exports.GetMultiKeyStoreInfoMsg = GetMultiKeyStoreInfoMsg;
class ChangeKeyRingMsg extends router_1.Message {
    constructor(index) {
        super();
        this.index = index;
    }
    static type() {
        return "change-keyring";
    }
    validateBasic() {
        if (this.index < 0) {
            throw new router_1.KeplrError("keyring", 200, "Index is negative");
        }
        if (!Number.isInteger(this.index)) {
            throw new router_1.KeplrError("keyring", 201, "Invalid index");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return ChangeKeyRingMsg.type();
    }
}
exports.ChangeKeyRingMsg = ChangeKeyRingMsg;
// Return the list of selectable path.
// If coin type was set for the key store, will return empty array.
class GetIsKeyStoreCoinTypeSetMsg extends router_1.Message {
    constructor(chainId, paths) {
        super();
        this.chainId = chainId;
        this.paths = paths;
    }
    static type() {
        return "get-is-keystore-coin-type-set";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
        if (this.paths.length === 0) {
            throw new router_1.KeplrError("keyring", 250, "empty bip44 path list");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetIsKeyStoreCoinTypeSetMsg.type();
    }
}
exports.GetIsKeyStoreCoinTypeSetMsg = GetIsKeyStoreCoinTypeSetMsg;
class SetKeyStoreCoinTypeMsg extends router_1.Message {
    constructor(chainId, coinType) {
        super();
        this.chainId = chainId;
        this.coinType = coinType;
    }
    static type() {
        return "set-keystore-coin-type";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("keyring", 270, "chain id not set");
        }
        if (this.coinType < 0) {
            throw new router_1.KeplrError("keyring", 240, "coin type can not be negative");
        }
        if (!Number.isInteger(this.coinType)) {
            throw new router_1.KeplrError("keyring", 241, "coin type should be integer");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SetKeyStoreCoinTypeMsg.type();
    }
}
exports.SetKeyStoreCoinTypeMsg = SetKeyStoreCoinTypeMsg;
class CheckPasswordMsg extends router_1.Message {
    constructor(password) {
        super();
        this.password = password;
    }
    static type() {
        return "check-keyring-password";
    }
    validateBasic() {
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return CheckPasswordMsg.type();
    }
}
exports.CheckPasswordMsg = CheckPasswordMsg;
class ExportKeyRingDatasMsg extends router_1.Message {
    constructor(password) {
        super();
        this.password = password;
    }
    static type() {
        return "export-keyring-datas";
    }
    validateBasic() {
        if (!this.password) {
            throw new router_1.KeplrError("keyring", 274, "password not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return ExportKeyRingDatasMsg.type();
    }
}
exports.ExportKeyRingDatasMsg = ExportKeyRingDatasMsg;
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
        return constants_1.ROUTE;
    }
    type() {
        return IsUnlockMsg.type();
    }
}
exports.IsUnlockMsg = IsUnlockMsg;
class AddAccountMsg extends router_1.Message {
    constructor(name, bip44HDPath) {
        super();
        this.name = name;
        this.bip44HDPath = bip44HDPath;
    }
    static type() {
        return "add-account";
    }
    validateBasic() {
        //noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return AddAccountMsg.type();
    }
}
exports.AddAccountMsg = AddAccountMsg;
class MigratorKeyRingMsg extends router_1.Message {
    constructor(password) {
        super();
        this.password = password;
    }
    static type() {
        return "migrator";
    }
    validateBasic() {
        //noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return MigratorKeyRingMsg.type();
    }
}
exports.MigratorKeyRingMsg = MigratorKeyRingMsg;
class RestoreKeyStoreMsg extends router_1.Message {
    static type() {
        return "remove-all-Key-store";
    }
    constructor() {
        super();
    }
    validateBasic() {
        //noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RestoreKeyStoreMsg.type();
    }
}
exports.RestoreKeyStoreMsg = RestoreKeyStoreMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 337:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SendTxMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(535);
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
            throw new router_1.KeplrError("tx", 100, "chain id is empty");
        }
        if (!this.tx) {
            throw new router_1.KeplrError("tx", 101, "tx is empty");
        }
        if (!this.mode ||
            (this.mode !== "sync" && this.mode !== "async" && this.mode !== "block")) {
            throw new router_1.KeplrError("tx", 120, "invalid mode");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SendTxMsg.type();
    }
}
exports.SendTxMsg = SendTxMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 338:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetChainEndpointsMsg = exports.SetChainEndpointsMsg = exports.TryUpdateChainMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(537);
class TryUpdateChainMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "try-update-chain";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("updater", 100, "Empty chain id");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return TryUpdateChainMsg.type();
    }
}
exports.TryUpdateChainMsg = TryUpdateChainMsg;
class SetChainEndpointsMsg extends router_1.Message {
    constructor(chainId, rpc, rest) {
        super();
        this.chainId = chainId;
        this.rpc = rpc;
        this.rest = rest;
    }
    static type() {
        return "set-chain-endpoints";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("updater", 100, "Empty chain id");
        }
        if (this.rpc) {
            // Make sure that rpc is valid url form
            const url = new URL(this.rpc);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                throw new Error(`RPC has invalid protocol: ${url.protocol}`);
            }
        }
        if (this.rest) {
            // Make sure that rest is valid url form
            const url = new URL(this.rest);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                throw new Error(`LCD has invalid protocol: ${url.protocol}`);
            }
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SetChainEndpointsMsg.type();
    }
}
exports.SetChainEndpointsMsg = SetChainEndpointsMsg;
class ResetChainEndpointsMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "reset-chain-endpoints";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("updater", 100, "Empty chain id");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return ResetChainEndpointsMsg.type();
    }
}
exports.ResetChainEndpointsMsg = ResetChainEndpointsMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 339:
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
__exportStar(__webpack_require__(527), exports);
__exportStar(__webpack_require__(336), exports);
__exportStar(__webpack_require__(1050), exports);
__exportStar(__webpack_require__(229), exports);
__exportStar(__webpack_require__(532), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PushEventDataMsg = exports.PushInteractionDataMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(544);
class PushInteractionDataMsg extends router_1.Message {
    constructor(data) {
        super();
        this.data = data;
    }
    static type() {
        return "push-interaction-data";
    }
    validateBasic() {
        if (!this.data.type) {
            throw new router_1.KeplrError("interaction", 101, "Type should not be empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return PushInteractionDataMsg.type();
    }
}
exports.PushInteractionDataMsg = PushInteractionDataMsg;
class PushEventDataMsg extends router_1.Message {
    constructor(data) {
        super();
        this.data = data;
    }
    static type() {
        return "push-event-data";
    }
    validateBasic() {
        if (!this.data.type) {
            throw new router_1.KeplrError("interaction", 101, "Type should not be empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return PushEventDataMsg.type();
    }
}
exports.PushEventDataMsg = PushEventDataMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectInteractionMsg = exports.ApproveInteractionMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(545);
class ApproveInteractionMsg extends router_1.Message {
    constructor(id, result) {
        super();
        this.id = id;
        this.result = result;
    }
    static type() {
        return "approve-interaction";
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return ApproveInteractionMsg.type();
    }
}
exports.ApproveInteractionMsg = ApproveInteractionMsg;
class RejectInteractionMsg extends router_1.Message {
    constructor(id) {
        super();
        this.id = id;
    }
    static type() {
        return "reject-interaction";
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RejectInteractionMsg.type();
    }
}
exports.RejectInteractionMsg = RejectInteractionMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 342:
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
exports.MisesService = exports.fetchConfig = void 0;
/*
 * @Author: lmk
 * @Date: 2022-11-17 15:39:01
 * @LastEditTime: 2022-11-24 11:53:02
 * @LastEditors: lmk
 * @Description: mises controller
 */
const mises_1 = __webpack_require__(1067);
const mises_network_util_1 = __webpack_require__(232);
const stargate_1 = __webpack_require__(266);
const long_1 = __importDefault(__webpack_require__(7));
const defaultUserInfo = {
    misesId: "",
    nickname: "",
    avatar: undefined,
    token: "",
    timestamp: 0,
    transtions: [],
    balance: {
        denom: "mis",
        amount: "0",
    },
    stakedSum: {
        denom: "mis",
        amount: "0",
    },
};
exports.fetchConfig = {
    // To handle sequence mismatch
    retry: 3,
    retryDelay: 1000,
};
const timeout = 5000;
class MisesService {
    constructor(kvStore) {
        this.kvStore = kvStore;
        this.userInfo = defaultUserInfo;
        this.keepAlivePort = null;
        this.queryClientStatus = false;
        this.queryClientTryMaxCount = 5;
        this.queryClientTryCount = 1;
        this.data = {};
    }
    init() {
        this.mises = new mises_1.Mises();
    }
    initQueryClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queryClient) {
                return this.queryClient;
            }
            if (this.queryClientStatus) {
                return "await";
            }
            this.queryClientStatus = true;
            this.mises.queryFetchClient.fetchQuery("gasPriceAndLimit", () => this.gasPriceAndLimit(), exports.fetchConfig);
            try {
                console.log("init");
                const clients = yield this.mises.queryFetchClient.fetchQuery("makeClient", () => this.mises.makeClient(), exports.fetchConfig);
                const [queryClient, tmClient] = clients;
                this.queryClient = queryClient;
                this.tmClient = tmClient;
                this.queryClientStatus = false;
                console.log("init success");
                return queryClient;
            }
            catch (error) {
                console.log(error, "initQueryClient failed");
            }
        });
    }
    queryClientAwait() {
        return __awaiter(this, void 0, void 0, function* () {
            const queryClientStatus = yield this.initQueryClient();
            return new Promise((resolve, reject) => {
                if (this.queryClientTryCount === this.queryClientTryMaxCount) {
                    this.queryClientTryCount = 1; // reset
                    reject("queryClientAwait timeout");
                    return;
                }
                if (queryClientStatus === "await") {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        this.queryClientTryCount++;
                        yield this.queryClientAwait();
                        resolve();
                    }), 500 * this.queryClientTryCount);
                }
                else {
                    this.queryClientTryCount = 1;
                    resolve();
                }
            });
        });
    }
    activateUser(priKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeUser = yield this.mises.misesUser.activateUser(priKey.replace("0x", ""));
            console.log("activateUser", this.activeUser);
            const userInfo = yield this.misesUserInfo();
            this.storeUserInfo(userInfo);
            // this.initKeepAlive();
        });
    }
    misesUserInfo() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const misesId = (_a = this.activeUser) === null || _a === void 0 ? void 0 : _a.address();
            const userInfo = (misesId && (yield this.kvStore.get(misesId))) ||
                defaultUserInfo; // init userInfo
            const nowTimeStamp = new Date().getTime();
            const expireTokenFlag = userInfo.token &&
                userInfo.timestamp &&
                nowTimeStamp - userInfo.timestamp > 604800000; // 6 days
            if (!userInfo.token || expireTokenFlag) {
                const referrer = yield this.getinstallreferrer();
                const nonce = new Date().getTime().toString();
                const { auth } = yield this.generateAuth(nonce);
                const token = yield this.mises.queryFetchClient.fetchQuery("getServerToken", () => {
                    return this.getServerToken({
                        provider: "mises",
                        user_authz: { auth },
                        referrer,
                    });
                }, exports.fetchConfig);
                userInfo.token = token;
                userInfo.timestamp = new Date().getTime();
            }
            const isRegistered = yield this.activeUser.isRegistered();
            if (isRegistered) {
                const misesInfo = yield ((_b = this.activeUser) === null || _b === void 0 ? void 0 : _b.info());
                userInfo.avatar = misesInfo === null || misesInfo === void 0 ? void 0 : misesInfo.avatarUrl;
                userInfo.nickname = (misesInfo === null || misesInfo === void 0 ? void 0 : misesInfo.name) || "";
            }
            userInfo.nickname =
                userInfo.nickname ||
                    mises_network_util_1.shortenAddress(misesId, mises_network_util_1.MISES_TRUNCATED_ADDRESS_START_CHARS);
            userInfo.misesId = misesId;
            return userInfo;
        });
    }
    lockAll() {
        this.resetUserInfo();
        this.mises.misesUser.lockAll();
        this.activeUser = undefined;
        // this.disconnectKeepAlive();
        // this.setToMisesPrivate(defaultUserInfo);
    }
    generateAuth(nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.activeUser) {
                throw new Error("Unknown activeUser");
            }
            const auth = yield this.activeUser.generateAuth(nonce);
            return {
                auth,
                misesId: this.userInfo.misesId,
            };
        });
    }
    // set mises browser userinfo
    setToMisesPrivate(params) {
        if (browser.misesPrivate) {
            browser.misesPrivate.setMisesId(JSON.stringify(params));
        }
        return Promise.resolve();
    }
    setUnFollow(toUid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(toUid);
            try {
                this.activeUser.unfollow(toUid);
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    setFollow(toUid) {
        console.log(toUid);
        try {
            this.activeUser.follow(toUid);
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    getServerToken(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield mises_network_util_1.misesRequest({
                    url: "/signin",
                    method: "POST",
                    data: query,
                    timeout,
                });
                return data.token;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getGasPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return mises_network_util_1.misesRequest({
                    url: "/mises/gasprices",
                    timeout,
                });
            }
            catch (error) {
                return Promise.resolve({
                    propose_gasprice: 0,
                });
            }
        });
    }
    getinstallreferrer() {
        return new Promise((resolve) => {
            if (browser.misesPrivate &&
                browser.misesPrivate.getInstallReferrer) {
                browser.misesPrivate.getInstallReferrer(resolve);
                return;
            }
            resolve("");
        });
    }
    setUserInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            try {
                const activeUser = this.activeUser;
                const userinfo = yield activeUser.info();
                const version = userinfo.version.add(1);
                const { misesId, token, timestamp, balance } = this.userInfo;
                yield activeUser.setInfo(Object.assign(Object.assign({}, data), { version }));
                const updateUserInfo = {
                    nickname: data.name ||
                        mises_network_util_1.shortenAddress(misesId, mises_network_util_1.MISES_TRUNCATED_ADDRESS_START_CHARS),
                    avatar: data.avatarUrl,
                    token,
                    misesId,
                    timestamp,
                    balance,
                    transtions: this.userInfo.transtions,
                    stakedSum: this.userInfo.stakedSum,
                };
                this.storeUserInfo(updateUserInfo);
                return true;
            }
            catch (error) {
                console.log(error, "error");
                return Promise.reject(error);
            }
        });
    }
    connect({ domain, appid, userid, permissions, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({
                    domain,
                    appid,
                    userid,
                    permissions,
                });
                yield this.mises.misesAppMgr.ensureApp(appid, domain);
                const connect = yield this.mises.misesSdk.connect(domain, appid, userid, permissions);
                return connect;
            }
            catch (error) {
                return false;
            }
        });
    }
    disconnect({ appid, userid }) {
        return this.mises.misesSdk.disconnect(appid, userid);
    }
    gasPriceAndLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gasPrices = yield this.getGasPrices();
                const proposeGasprice = gasPrices.propose_gasprice || this.mises.config.gasPrice();
                this.mises.config.setGasPriceAndLimit(proposeGasprice, 200000);
                return proposeGasprice;
            }
            catch (error) {
                return Promise.resolve(this.mises.config.gasPrice());
            }
        });
    }
    resetUserInfo() {
        this.userInfo = defaultUserInfo;
    }
    storeUserInfo(userInfo) {
        this.userInfo = userInfo;
        this.save();
        userInfo.token && this.setToMisesPrivate(userInfo);
    }
    save() {
        var _a;
        const misesId = (_a = this.activeUser) === null || _a === void 0 ? void 0 : _a.address();
        if (misesId) {
            return this.kvStore.set(misesId, this.userInfo);
        }
    }
    getBalanceUMIS(address) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (address) {
                const currentAddressInfo = yield this.kvStore.get(address);
                return ((currentAddressInfo === null || currentAddressInfo === void 0 ? void 0 : currentAddressInfo.balance) ||
                    this.mises.coinDefine.toCoinUMIS(long_1.default.ZERO));
            }
            const balance = yield ((_a = this.activeUser) === null || _a === void 0 ? void 0 : _a.getBalanceUMIS());
            const toCoinUMIS = this.mises.coinDefine.toCoinUMIS(balance || long_1.default.ZERO);
            this.userInfo.balance = toCoinUMIS;
            this.save();
            return toCoinUMIS;
        });
    }
    getChainId() {
        return this.mises.stargateClient.getChainId();
    }
    unbondingDelegations(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.queryClientAwait();
                const queryClient = yield this.initQueryClient();
                if (queryClient !== "await") {
                    const delegatorUnbondingDelegations = yield (queryClient === null || queryClient === void 0 ? void 0 : queryClient.staking.delegatorUnbondingDelegations(address));
                    return delegatorUnbondingDelegations;
                }
            }
            catch (error) { }
        });
    }
    delegations(address) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.queryClientAwait();
                const queryClient = yield this.initQueryClient();
                if (queryClient !== "await") {
                    const delegatorDelegationsResponse = yield (queryClient === null || queryClient === void 0 ? void 0 : queryClient.staking.delegatorDelegations(address));
                    const total = ((_b = (_a = delegatorDelegationsResponse === null || delegatorDelegationsResponse === void 0 ? void 0 : delegatorDelegationsResponse.pagination) === null || _a === void 0 ? void 0 : _a.total) === null || _b === void 0 ? void 0 : _b.toNumber()) || 0;
                    if (total > 100 && (delegatorDelegationsResponse === null || delegatorDelegationsResponse === void 0 ? void 0 : delegatorDelegationsResponse.delegationResponses)) {
                        const nextRes = yield (queryClient === null || queryClient === void 0 ? void 0 : queryClient.staking.delegatorDelegations(address, (_c = delegatorDelegationsResponse === null || delegatorDelegationsResponse === void 0 ? void 0 : delegatorDelegationsResponse.pagination) === null || _c === void 0 ? void 0 : _c.nextKey));
                        if (nextRes === null || nextRes === void 0 ? void 0 : nextRes.delegationResponses) {
                            return {
                                delegationResponses: [
                                    ...delegatorDelegationsResponse.delegationResponses,
                                    ...nextRes === null || nextRes === void 0 ? void 0 : nextRes.delegationResponses,
                                ],
                            };
                        }
                    }
                    return delegatorDelegationsResponse;
                }
            }
            catch (error) { }
        });
    }
    rewards(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.queryClientAwait();
                const queryClient = yield this.initQueryClient();
                if (queryClient !== "await")
                    return queryClient === null || queryClient === void 0 ? void 0 : queryClient.distribution.delegationTotalRewards(address);
            }
            catch (error) { }
        });
    }
    authAccounts(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.queryClientAwait();
                const queryClient = yield this.initQueryClient();
                if (queryClient !== "await")
                    return queryClient === null || queryClient === void 0 ? void 0 : queryClient.auth.account(address);
            }
            catch (error) { }
        });
    }
    pollForTx(txId, timeoutMs = 3000 * 15, pollIntervalMs = 3000) {
        return __awaiter(this, void 0, void 0, function* () {
            let timedOut = false;
            const txPollTimeout = setTimeout(() => {
                timedOut = true;
            }, timeoutMs);
            if (typeof txId !== "string") {
                txId = this.toHex(txId);
            }
            try {
                if (timedOut) {
                    throw new stargate_1.TimeoutError(`Transaction with ID ${txId} was submitted but was not yet found on the chain. You might want to check later.`, txId);
                }
                yield this.sleep(pollIntervalMs);
                console.log(txId);
                const result = yield this.getTx(txId);
                clearTimeout(txPollTimeout);
                return result || this.pollForTx(txId);
            }
            catch (error) {
                clearTimeout(txPollTimeout);
                return Promise.reject(error);
            }
        });
    }
    broadcastTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const broadcasted = yield this.tmClient.broadcastTxSync({ tx });
                if (broadcasted.code) {
                    throw new Error(`Broadcasting transaction failed with code ${broadcasted.code} (codespace: ${broadcasted.codeSpace}). Log: ${broadcasted.log}`);
                }
                const transactionId = this.toHex(broadcasted.hash).toUpperCase();
                return transactionId;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    simulate(messages, memo, signer, sequence) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // const proposeGasprice = await this.gasPriceAndLimit();
            const res = yield this.queryClient.tx.simulate(messages, memo, signer, sequence);
            return {
                gasUsed: (_a = res.gasInfo) === null || _a === void 0 ? void 0 : _a.gasUsed,
            };
        });
    }
    toHex(data) {
        let out = "";
        for (const byte of data) {
            out += ("0" + byte.toString(16)).slice(-2);
        }
        return out;
    }
    getTx(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.txsQuery(`tx.hash='${hash}'`, {
                minHeight: 0,
                maxHeight: undefined,
                page: 1,
            });
            if (results.totalCount === 0 || !results.txs) {
                return undefined;
            }
            const result = results.txs[0];
            return {
                code: result.code,
                height: result.height,
                rawLog: result.rawLog,
                hash: result.hash,
                gasUsed: result.gasUsed,
                gasWanted: result.gasWanted,
            };
        });
    }
    txsQuery(query, param) {
        return __awaiter(this, void 0, void 0, function* () {
            const minHeight = param.minHeight || 0;
            const maxHeight = param.maxHeight || Number.MAX_SAFE_INTEGER;
            const page = param.page || 1;
            function withFilters(originalQuery) {
                return `${originalQuery} AND tx.height>=${minHeight} AND tx.height<=${maxHeight}`;
            }
            let results;
            try {
                results = yield this.tmClient.txSearch({
                    query: withFilters(query),
                    page,
                });
            }
            catch (_err) {
                results = {
                    totalCount: 0,
                    txs: [],
                };
            }
            this.tmClient.disconnect();
            return {
                totalCount: results.totalCount,
                txs: results.txs.map((tx) => {
                    return {
                        height: tx.height,
                        hash: this.toHex(tx.hash).toUpperCase(),
                        code: tx.result.code,
                        rawLog: tx.result.log || "",
                        tx: tx.tx,
                        gasUsed: tx.result.gasUsed,
                        gasWanted: tx.result.gasWanted,
                    };
                }),
            };
        });
    }
    sleep(ms = 3000) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    misesAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nonce = new Date().getTime().toString();
                const { auth } = yield this.generateAuth(nonce);
                return {
                    auth,
                    address: this.activeUser.address(),
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    hasWalletAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield browser.storage.local.get("keyring/key-multi-store");
            const list = items["keyring/key-multi-store"] || [];
            return list.length > 0;
        });
    }
    staking(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeUser = this.activeUser;
                const data = yield activeUser.postTx(params.msgs, "", params.gasFee, params.gasLimit);
                if (data.code !== 0) {
                    return Promise.reject(data.rawLog);
                }
                return data;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    parseAmountItem(item) {
        var _a;
        if (item.value) {
            const amount = (_a = item.value) === null || _a === void 0 ? void 0 : _a.replace("umis", "|umis").split("|");
            const currency = this.mises.coinDefine.fromCoin({
                amount: amount[0],
                denom: amount[1],
            });
            const coin = this.mises.coinDefine.toCoinMIS(currency);
            return {
                amount: coin.amount,
                denom: coin.denom.toUpperCase(),
            };
        }
        else {
            return {
                amount: "0",
                denom: "MIS",
            };
        }
    }
    parseTxEvents(activeUserAddr, tx) {
        const events = tx.raw;
        return events.reduce((result, event) => {
            var _a, _b;
            let amount = { amount: "", denom: "" };
            let recipient = { value: "" };
            let sender = { value: "" };
            let category = "";
            let title = "";
            let transactionGroupType = "misesIn";
            switch (event.type) {
                case "transfer": {
                    const amountItem = event.attributes.find((item) => item.key === "amount");
                    if (amountItem) {
                        amount = this.parseAmountItem(amountItem);
                    }
                    recipient = event.attributes.find((item) => item.key === "recipient");
                    sender = event.attributes.find((item) => item.key === "sender");
                    category =
                        recipient && recipient.value === activeUserAddr
                            ? "receive"
                            : "send";
                    title =
                        recipient && recipient.value === activeUserAddr
                            ? "Receive"
                            : "Send";
                    transactionGroupType =
                        recipient && recipient.value === activeUserAddr
                            ? "misesIn"
                            : "misesOut";
                    break;
                }
                case "withdraw_rewards": {
                    const amountItem = event.attributes.find((item) => item.key === "amount");
                    if (amountItem) {
                        amount = this.parseAmountItem(amountItem);
                    }
                    sender = event.attributes.find((item) => item.key === "validator");
                    recipient = { value: activeUserAddr };
                    category = "interaction";
                    title = "Withdraw Rewards";
                    transactionGroupType = "misesIn";
                    break;
                }
                case "delegate": {
                    const amountItem = event.attributes.find((item) => item.key === "amount");
                    if (amountItem) {
                        amount = this.parseAmountItem(amountItem);
                    }
                    sender = { value: activeUserAddr };
                    recipient = event.attributes.find((item) => item.key === "validator");
                    category = "interaction";
                    title = "Delegate";
                    transactionGroupType = "misesOut";
                    break;
                }
                case "redelegate": {
                    const amountItem = event.attributes.find((item) => item.key === "amount");
                    if (amountItem) {
                        amount = this.parseAmountItem(amountItem);
                    }
                    sender = { value: activeUserAddr };
                    recipient = event.attributes.find((item) => item.key === "destination_validator");
                    category = "interaction";
                    title = "Redelegate";
                    transactionGroupType = "misesOut";
                    break;
                }
                case "unbond": {
                    const amountItem = event.attributes.find((item) => item.key === "amount");
                    if (amountItem) {
                        amount = this.parseAmountItem(amountItem);
                    }
                    sender = event.attributes.find((item) => item.key === "validator");
                    recipient = { value: activeUserAddr };
                    category = "interaction";
                    title = "Undelegate";
                    transactionGroupType = "misesIn";
                    break;
                }
                default:
                    return result;
            }
            return result.concat({
                category,
                date: result.length === 0
                    ? `${tx.height}`
                    : `${tx.height}:${result.length}`,
                height: tx.height,
                initialTransaction: { id: "0x0", hash: tx.hash },
                primaryCurrency: `${amount.amount} ${amount.denom}`,
                recipientAddress: (_a = recipient.value) !== null && _a !== void 0 ? _a : "",
                secondaryCurrency: `${amount.amount} ${amount.denom}`,
                senderAddress: (_b = sender.value) !== null && _b !== void 0 ? _b : "",
                title,
                transactionGroupType,
                resultLength: result.length,
            });
        }, []);
    }
    recentTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeUser = this.activeUser;
                const height = this.userInfo.transtions[0]
                    ? this.userInfo.transtions[0].height + 1
                    : 0;
                let list = yield (activeUser === null || activeUser === void 0 ? void 0 : activeUser.recentTransactions(height));
                if (Array.isArray(list)) {
                    list = list.reduce((result, val) => {
                        val.raw = [];
                        JSON.parse(val.rawLog).forEach((item) => {
                            val.raw = [...val.raw, ...item.events];
                        });
                        return [
                            ...result,
                            ...this.parseTxEvents(activeUser.address(), val),
                        ];
                    }, []);
                    const sortList = [...list];
                    sortList.sort((a, b) => a.height === b.height
                        ? a.resultLength - b.resultLength
                        : b.height - a.height);
                    return sortList;
                }
                return [];
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
    saveTranstions(list) {
        this.userInfo.transtions = list;
        this.save();
    }
    openWallet() {
        browser.tabs.create({
            url: browser.runtime.getURL("popup.html"),
        });
    }
    handleMessage(msg) {
        console.log("handleMessage" + msg);
    }
    handleDisconnect(msg) {
        if (this.keepAlivePort) {
            console.log("handleDisconnect" + msg);
            this.keepAlivePort.onMessage.removeListener(this.handleMessage);
            this.keepAlivePort.onDisconnect.removeListener(this.handleDisconnect);
            this.keepAlivePort = null;
        }
    }
    initKeepAlive() {
        console.log("connectNative");
        if (this.keepAlivePort) {
            return;
        }
        this.keepAlivePort = browser.runtime.connectNative("site.mises.browser");
        this.keepAlivePort.onMessage.addListener(this.handleMessage);
        this.keepAlivePort.onDisconnect.addListener(this.handleDisconnect);
        this.keepAlivePort.postMessage({ text: "keep-alive service worker" });
    }
    disconnectKeepAlive() {
        var _a;
        if (this.keepAlivePort) {
            console.log("disconnectKeepAlive");
            (_a = this.keepAlivePort) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.handleDisconnect({});
        }
    }
    setCacheUserInfo(params) {
        this.userInfo = Object.assign(Object.assign({}, this.userInfo), params);
        this.save();
    }
    getAddressUserInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (address) {
                const currentAddressInfo = yield this.kvStore.get(address);
                return currentAddressInfo || this.userInfo;
            }
            return this.userInfo;
        });
    }
}
exports.MisesService = MisesService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SetLocalCacheMsg = exports.GetLocalCacheMsg = exports.OpenWalletMsg = exports.SaveTranstionsMsg = exports.PortForTxMsg = exports.ActiveUserMsg = exports.StakingMsg = exports.SetUserInfoMsg = exports.UserUnFollowMsg = exports.UserFollowMsg = exports.ConnectMsg = exports.DisconnectMsg = exports.HasWalletAccountMsg = exports.MisesAccountMsg = exports.SimulateMsg = exports.BroadcastTxMsg = exports.AuthAccountsMsg = exports.RewardsMsg = exports.DelegationsMsg = exports.UnbondingDelegationsMsg = exports.GetChainIdMsg = exports.RecentTransactionsMsg = exports.MisesChainMsg = exports.BalanceUMISMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(554);
class BalanceUMISMsg extends router_1.Message {
    constructor(address) {
        super();
        this.address = address;
    }
    static type() {
        return "balance-umis";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() { }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return BalanceUMISMsg.type();
    }
}
exports.BalanceUMISMsg = BalanceUMISMsg;
class MisesChainMsg extends router_1.Message {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "mises-chain";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        if (!this.chainId) {
            throw new router_1.KeplrError("mises", 274, "chainId not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return MisesChainMsg.type();
    }
}
exports.MisesChainMsg = MisesChainMsg;
class RecentTransactionsMsg extends router_1.Message {
    static type() {
        return "recent-transaction";
    }
    constructor() {
        super();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RecentTransactionsMsg.type();
    }
}
exports.RecentTransactionsMsg = RecentTransactionsMsg;
class GetChainIdMsg extends router_1.Message {
    static type() {
        return "get-chain-id";
    }
    constructor() {
        super();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetChainIdMsg.type();
    }
}
exports.GetChainIdMsg = GetChainIdMsg;
class UnbondingDelegationsMsg extends router_1.Message {
    constructor(address) {
        super();
        this.address = address;
    }
    static type() {
        return "unbonding-delegations";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
        if (!this.address) {
            throw new router_1.KeplrError("mises", 274, "address not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return UnbondingDelegationsMsg.type();
    }
}
exports.UnbondingDelegationsMsg = UnbondingDelegationsMsg;
class DelegationsMsg extends router_1.Message {
    constructor(address) {
        super();
        this.address = address;
    }
    static type() {
        return "delegations";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
        if (!this.address) {
            throw new router_1.KeplrError("mises", 274, "address not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return DelegationsMsg.type();
    }
}
exports.DelegationsMsg = DelegationsMsg;
class RewardsMsg extends router_1.Message {
    constructor(address) {
        super();
        this.address = address;
    }
    static type() {
        return "rewards";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
        if (!this.address) {
            throw new router_1.KeplrError("mises", 274, "address not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return RewardsMsg.type();
    }
}
exports.RewardsMsg = RewardsMsg;
class AuthAccountsMsg extends router_1.Message {
    constructor(address) {
        super();
        this.address = address;
    }
    static type() {
        return "auth-accounts";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
        if (!this.address) {
            throw new router_1.KeplrError("mises", 274, "address not set");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return AuthAccountsMsg.type();
    }
}
exports.AuthAccountsMsg = AuthAccountsMsg;
class BroadcastTxMsg extends router_1.Message {
    constructor(tx) {
        super();
        this.tx = tx;
    }
    static type() {
        return "broadcast-tx-to-background";
    }
    validateBasic() {
        if (!this.tx) {
            throw new router_1.KeplrError("tx", 101, "tx is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return BroadcastTxMsg.type();
    }
}
exports.BroadcastTxMsg = BroadcastTxMsg;
class SimulateMsg extends router_1.Message {
    constructor(messages, memo, signer, sequence) {
        super();
        this.messages = messages;
        this.memo = memo;
        this.signer = signer;
        this.sequence = sequence;
    }
    static type() {
        return "simulate";
    }
    validateBasic() {
        if (!this.messages) {
            throw new router_1.KeplrError("messages", 101, "messages is empty");
        }
        if (!this.signer) {
            throw new router_1.KeplrError("signer", 101, "signer is empty");
        }
        if (!this.sequence) {
            throw new router_1.KeplrError("sequence", 101, "sequence is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SimulateMsg.type();
    }
}
exports.SimulateMsg = SimulateMsg;
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
        return constants_1.ROUTE;
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
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("appid", 101, "appid is empty");
        }
        if (!this.params.userid) {
            throw new router_1.KeplrError("userid", 101, "userid is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("appid", 101, "appid is empty");
        }
        if (!this.params.userid) {
            throw new router_1.KeplrError("userid", 101, "userid is empty");
        }
        if (!this.params.domain) {
            throw new router_1.KeplrError("domain", 101, "domain is empty");
        }
        if (!this.params.permissions) {
            throw new router_1.KeplrError("permissions", 101, "permissions is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("toUid", 101, "toUid is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("toUid", 101, "toUid is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("params", 101, "params is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
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
            throw new router_1.KeplrError("params", 101, "params is empty");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return StakingMsg.type();
    }
}
exports.StakingMsg = StakingMsg;
class ActiveUserMsg extends router_1.Message {
    static type() {
        return "active-user";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    approveExternal() {
        return true;
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return ActiveUserMsg.type();
    }
}
exports.ActiveUserMsg = ActiveUserMsg;
class PortForTxMsg extends router_1.Message {
    constructor(txId) {
        super();
        this.txId = txId;
    }
    static type() {
        return "port-for-tx";
    }
    validateBasic() {
        if (!this.txId) {
            throw new router_1.KeplrError("txId", 101, "txId is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return PortForTxMsg.type();
    }
}
exports.PortForTxMsg = PortForTxMsg;
class SaveTranstionsMsg extends router_1.Message {
    constructor(transtions) {
        super();
        this.transtions = transtions;
    }
    static type() {
        return "save-transtions";
    }
    validateBasic() {
        if (!this.transtions) {
            throw new router_1.KeplrError("transtions", 101, "transtions is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SaveTranstionsMsg.type();
    }
}
exports.SaveTranstionsMsg = SaveTranstionsMsg;
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
        return constants_1.ROUTE;
    }
    type() {
        return OpenWalletMsg.type();
    }
}
exports.OpenWalletMsg = OpenWalletMsg;
class GetLocalCacheMsg extends router_1.Message {
    constructor(address) {
        super();
        this.address = address;
    }
    static type() {
        return "get-local-cache";
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return GetLocalCacheMsg.type();
    }
}
exports.GetLocalCacheMsg = GetLocalCacheMsg;
class SetLocalCacheMsg extends router_1.Message {
    constructor(params) {
        super();
        this.params = params;
    }
    static type() {
        return "set-local-cache";
    }
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return SetLocalCacheMsg.type();
    }
}
exports.SetLocalCacheMsg = SetLocalCacheMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SetIsShouldVerifyMsg = exports.GetIsShouldVerifyMsg = exports.VerifyDomainMsg = exports.InitSafeMsg = void 0;
const router_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(556);
class InitSafeMsg extends router_1.Message {
    constructor(state) {
        super();
        this.state = state;
    }
    static type() {
        return "init-mises-safe";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        if (!this.state) {
            throw new router_1.KeplrError("state", 101, "state is empty");
        }
    }
    route() {
        return constants_1.ROUTE;
    }
    type() {
        return InitSafeMsg.type();
    }
}
exports.InitSafeMsg = InitSafeMsg;
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
    route() {
        return constants_1.ROUTE;
    }
    approveExternal() {
        return true;
    }
    type() {
        return VerifyDomainMsg.type();
    }
}
exports.VerifyDomainMsg = VerifyDomainMsg;
class GetIsShouldVerifyMsg extends router_1.Message {
    static type() {
        return "get-is-should-verify";
    }
    constructor() {
        super();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    approveExternal() {
        return true;
    }
    type() {
        return GetIsShouldVerifyMsg.type();
    }
}
exports.GetIsShouldVerifyMsg = GetIsShouldVerifyMsg;
class SetIsShouldVerifyMsg extends router_1.Message {
    constructor(state) {
        super();
        this.state = state;
    }
    static type() {
        return "set-is-should-verify";
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() {
        // noop
    }
    route() {
        return constants_1.ROUTE;
    }
    approveExternal() {
        return true;
    }
    type() {
        return SetIsShouldVerifyMsg.type();
    }
}
exports.SetIsShouldVerifyMsg = SetIsShouldVerifyMsg;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

exports.pbkdf2 = __webpack_require__(1027)
exports.pbkdf2Sync = __webpack_require__(530)


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():undefined}(self,(function(){return e={1238:e=>{"use strict";e.exports={version:"17.5.0"}},7629:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(9474),o=r(1687),i=r(8652),l=r(8160),c=r(3292),u=r(6354),f=r(8901),m=r(9708),h=r(6914),d=r(2294),p=r(6133),g=r(1152),y=r(8863),b=r(2036),v={Base:class{constructor(e){this.type=e,this.$_root=null,this._definition={},this._reset()}_reset(){this._ids=new d.Ids,this._preferences=null,this._refs=new p.Manager,this._cache=null,this._valids=null,this._invalids=null,this._flags={},this._rules=[],this._singleRules=new Map,this.$_terms={},this.$_temp={ruleset:null,whens:{}}}describe(){return s("function"==typeof m.describe,"Manifest functionality disabled"),m.describe(this)}allow(...e){return l.verifyFlat(e,"allow"),this._values(e,"_valids")}alter(e){s(e&&"object"==typeof e&&!Array.isArray(e),"Invalid targets argument"),s(!this._inRuleset(),"Cannot set alterations inside a ruleset");const t=this.clone();t.$_terms.alterations=t.$_terms.alterations||[];for(const r in e){const n=e[r];s("function"==typeof n,"Alteration adjuster for",r,"must be a function"),t.$_terms.alterations.push({target:r,adjuster:n})}return t.$_temp.ruleset=!1,t}artifact(e){return s(void 0!==e,"Artifact cannot be undefined"),s(!this._cache,"Cannot set an artifact with a rule cache"),this.$_setFlag("artifact",e)}cast(e){return s(!1===e||"string"==typeof e,"Invalid to value"),s(!1===e||this._definition.cast[e],"Type",this.type,"does not support casting to",e),this.$_setFlag("cast",!1===e?void 0:e)}default(e,t){return this._default("default",e,t)}description(e){return s(e&&"string"==typeof e,"Description must be a non-empty string"),this.$_setFlag("description",e)}empty(e){const t=this.clone();return void 0!==e&&(e=t.$_compile(e,{override:!1})),t.$_setFlag("empty",e,{clone:!1})}error(e){return s(e,"Missing error"),s(e instanceof Error||"function"==typeof e,"Must provide a valid Error object or a function"),this.$_setFlag("error",e)}example(e,t={}){return s(void 0!==e,"Missing example"),l.assertOptions(t,["override"]),this._inner("examples",e,{single:!0,override:t.override})}external(e,t){return"object"==typeof e&&(s(!t,"Cannot combine options with description"),t=e.description,e=e.method),s("function"==typeof e,"Method must be a function"),s(void 0===t||t&&"string"==typeof t,"Description must be a non-empty string"),this._inner("externals",{method:e,description:t},{single:!0})}failover(e,t){return this._default("failover",e,t)}forbidden(){return this.presence("forbidden")}id(e){return e?(s("string"==typeof e,"id must be a non-empty string"),s(/^[^\.]+$/.test(e),"id cannot contain period character"),this.$_setFlag("id",e)):this.$_setFlag("id",void 0)}invalid(...e){return this._values(e,"_invalids")}label(e){return s(e&&"string"==typeof e,"Label name must be a non-empty string"),this.$_setFlag("label",e)}meta(e){return s(void 0!==e,"Meta cannot be undefined"),this._inner("metas",e,{single:!0})}note(...e){s(e.length,"Missing notes");for(const t of e)s(t&&"string"==typeof t,"Notes must be non-empty strings");return this._inner("notes",e)}only(e=!0){return s("boolean"==typeof e,"Invalid mode:",e),this.$_setFlag("only",e)}optional(){return this.presence("optional")}prefs(e){s(e,"Missing preferences"),s(void 0===e.context,"Cannot override context"),s(void 0===e.externals,"Cannot override externals"),s(void 0===e.warnings,"Cannot override warnings"),s(void 0===e.debug,"Cannot override debug"),l.checkPreferences(e);const t=this.clone();return t._preferences=l.preferences(t._preferences,e),t}presence(e){return s(["optional","required","forbidden"].includes(e),"Unknown presence mode",e),this.$_setFlag("presence",e)}raw(e=!0){return this.$_setFlag("result",e?"raw":void 0)}result(e){return s(["raw","strip"].includes(e),"Unknown result mode",e),this.$_setFlag("result",e)}required(){return this.presence("required")}strict(e){const t=this.clone(),r=void 0!==e&&!e;return t._preferences=l.preferences(t._preferences,{convert:r}),t}strip(e=!0){return this.$_setFlag("result",e?"strip":void 0)}tag(...e){s(e.length,"Missing tags");for(const t of e)s(t&&"string"==typeof t,"Tags must be non-empty strings");return this._inner("tags",e)}unit(e){return s(e&&"string"==typeof e,"Unit name must be a non-empty string"),this.$_setFlag("unit",e)}valid(...e){l.verifyFlat(e,"valid");const t=this.allow(...e);return t.$_setFlag("only",!!t._valids,{clone:!1}),t}when(e,t){const r=this.clone();r.$_terms.whens||(r.$_terms.whens=[]);const n=c.when(r,e,t);if(!["any","link"].includes(r.type)){const e=n.is?[n]:n.switch;for(const t of e)s(!t.then||"any"===t.then.type||t.then.type===r.type,"Cannot combine",r.type,"with",t.then&&t.then.type),s(!t.otherwise||"any"===t.otherwise.type||t.otherwise.type===r.type,"Cannot combine",r.type,"with",t.otherwise&&t.otherwise.type)}return r.$_terms.whens.push(n),r.$_mutateRebuild()}cache(e){s(!this._inRuleset(),"Cannot set caching inside a ruleset"),s(!this._cache,"Cannot override schema cache"),s(void 0===this._flags.artifact,"Cannot cache a rule with an artifact");const t=this.clone();return t._cache=e||i.provider.provision(),t.$_temp.ruleset=!1,t}clone(){const e=Object.create(Object.getPrototypeOf(this));return this._assign(e)}concat(e){s(l.isSchema(e),"Invalid schema object"),s("any"===this.type||"any"===e.type||e.type===this.type,"Cannot merge type",this.type,"with another type:",e.type),s(!this._inRuleset(),"Cannot concatenate onto a schema with open ruleset"),s(!e._inRuleset(),"Cannot concatenate a schema with open ruleset");let t=this.clone();if("any"===this.type&&"any"!==e.type){const r=e.clone();for(const e of Object.keys(t))"type"!==e&&(r[e]=t[e]);t=r}t._ids.concat(e._ids),t._refs.register(e,p.toSibling),t._preferences=t._preferences?l.preferences(t._preferences,e._preferences):e._preferences,t._valids=b.merge(t._valids,e._valids,e._invalids),t._invalids=b.merge(t._invalids,e._invalids,e._valids);for(const r of e._singleRules.keys())t._singleRules.has(r)&&(t._rules=t._rules.filter((e=>e.keep||e.name!==r)),t._singleRules.delete(r));for(const r of e._rules)e._definition.rules[r.method].multi||t._singleRules.set(r.name,r),t._rules.push(r);if(t._flags.empty&&e._flags.empty){t._flags.empty=t._flags.empty.concat(e._flags.empty);const r=Object.assign({},e._flags);delete r.empty,o(t._flags,r)}else if(e._flags.empty){t._flags.empty=e._flags.empty;const r=Object.assign({},e._flags);delete r.empty,o(t._flags,r)}else o(t._flags,e._flags);for(const r in e.$_terms){const s=e.$_terms[r];s?t.$_terms[r]?t.$_terms[r]=t.$_terms[r].concat(s):t.$_terms[r]=s.slice():t.$_terms[r]||(t.$_terms[r]=s)}return this.$_root._tracer&&this.$_root._tracer._combine(t,[this,e]),t.$_mutateRebuild()}extend(e){return s(!e.base,"Cannot extend type with another base"),f.type(this,e)}extract(e){return e=Array.isArray(e)?e:e.split("."),this._ids.reach(e)}fork(e,t){s(!this._inRuleset(),"Cannot fork inside a ruleset");let r=this;for(let s of[].concat(e))s=Array.isArray(s)?s:s.split("."),r=r._ids.fork(s,t,r);return r.$_temp.ruleset=!1,r}rule(e){const t=this._definition;l.assertOptions(e,Object.keys(t.modifiers)),s(!1!==this.$_temp.ruleset,"Cannot apply rules to empty ruleset or the last rule added does not support rule properties");const r=null===this.$_temp.ruleset?this._rules.length-1:this.$_temp.ruleset;s(r>=0&&r<this._rules.length,"Cannot apply rules to empty ruleset");const a=this.clone();for(let o=r;o<a._rules.length;++o){const r=a._rules[o],i=n(r);for(const n in e)t.modifiers[n](i,e[n]),s(i.name===r.name,"Cannot change rule name");a._rules[o]=i,a._singleRules.get(i.name)===r&&a._singleRules.set(i.name,i)}return a.$_temp.ruleset=!1,a.$_mutateRebuild()}get ruleset(){s(!this._inRuleset(),"Cannot start a new ruleset without closing the previous one");const e=this.clone();return e.$_temp.ruleset=e._rules.length,e}get $(){return this.ruleset}tailor(e){e=[].concat(e),s(!this._inRuleset(),"Cannot tailor inside a ruleset");let t=this;if(this.$_terms.alterations)for(const{target:r,adjuster:n}of this.$_terms.alterations)e.includes(r)&&(t=n(t),s(l.isSchema(t),"Alteration adjuster for",r,"failed to return a schema object"));return t=t.$_modify({each:t=>t.tailor(e),ref:!1}),t.$_temp.ruleset=!1,t.$_mutateRebuild()}tracer(){return g.location?g.location(this):this}validate(e,t){return y.entry(e,this,t)}validateAsync(e,t){return y.entryAsync(e,this,t)}$_addRule(e){"string"==typeof e&&(e={name:e}),s(e&&"object"==typeof e,"Invalid options"),s(e.name&&"string"==typeof e.name,"Invalid rule name");for(const t in e)s("_"!==t[0],"Cannot set private rule properties");const t=Object.assign({},e);t._resolve=[],t.method=t.method||t.name;const r=this._definition.rules[t.method],n=t.args;s(r,"Unknown rule",t.method);const a=this.clone();if(n){s(1===Object.keys(n).length||Object.keys(n).length===this._definition.rules[t.name].args.length,"Invalid rule definition for",this.type,t.name);for(const e in n){let o=n[e];if(void 0!==o){if(r.argsByName){const i=r.argsByName.get(e);if(i.ref&&l.isResolvable(o))t._resolve.push(e),a.$_mutateRegister(o);else if(i.normalize&&(o=i.normalize(o),n[e]=o),i.assert){const t=l.validateArg(o,e,i);s(!t,t,"or reference")}}n[e]=o}else delete n[e]}}return r.multi||(a._ruleRemove(t.name,{clone:!1}),a._singleRules.set(t.name,t)),!1===a.$_temp.ruleset&&(a.$_temp.ruleset=null),r.priority?a._rules.unshift(t):a._rules.push(t),a}$_compile(e,t){return c.schema(this.$_root,e,t)}$_createError(e,t,r,s,n,a={}){const o=!1!==a.flags?this._flags:{},i=a.messages?h.merge(this._definition.messages,a.messages):this._definition.messages;return new u.Report(e,t,r,o,i,s,n)}$_getFlag(e){return this._flags[e]}$_getRule(e){return this._singleRules.get(e)}$_mapLabels(e){return e=Array.isArray(e)?e:e.split("."),this._ids.labels(e)}$_match(e,t,r,s){(r=Object.assign({},r)).abortEarly=!0,r._externals=!1,t.snapshot();const n=!y.validate(e,this,t,r,s).errors;return t.restore(),n}$_modify(e){return l.assertOptions(e,["each","once","ref","schema"]),d.schema(this,e)||this}$_mutateRebuild(){return s(!this._inRuleset(),"Cannot add this rule inside a ruleset"),this._refs.reset(),this._ids.reset(),this.$_modify({each:(e,{source:t,name:r,path:s,key:n})=>{const a=this._definition[t][r]&&this._definition[t][r].register;!1!==a&&this.$_mutateRegister(e,{family:a,key:n})}}),this._definition.rebuild&&this._definition.rebuild(this),this.$_temp.ruleset=!1,this}$_mutateRegister(e,{family:t,key:r}={}){this._refs.register(e,t),this._ids.register(e,{key:r})}$_property(e){return this._definition.properties[e]}$_reach(e){return this._ids.reach(e)}$_rootReferences(){return this._refs.roots()}$_setFlag(e,t,r={}){s("_"===e[0]||!this._inRuleset(),"Cannot set flag inside a ruleset");const n=this._definition.flags[e]||{};if(a(t,n.default)&&(t=void 0),a(t,this._flags[e]))return this;const o=!1!==r.clone?this.clone():this;return void 0!==t?(o._flags[e]=t,o.$_mutateRegister(t)):delete o._flags[e],"_"!==e[0]&&(o.$_temp.ruleset=!1),o}$_parent(e,...t){return this[e][l.symbols.parent].call(this,...t)}$_validate(e,t,r){return y.validate(e,this,t,r)}_assign(e){e.type=this.type,e.$_root=this.$_root,e.$_temp=Object.assign({},this.$_temp),e.$_temp.whens={},e._ids=this._ids.clone(),e._preferences=this._preferences,e._valids=this._valids&&this._valids.clone(),e._invalids=this._invalids&&this._invalids.clone(),e._rules=this._rules.slice(),e._singleRules=n(this._singleRules,{shallow:!0}),e._refs=this._refs.clone(),e._flags=Object.assign({},this._flags),e._cache=null,e.$_terms={};for(const t in this.$_terms)e.$_terms[t]=this.$_terms[t]?this.$_terms[t].slice():null;e.$_super={};for(const t in this.$_super)e.$_super[t]=this._super[t].bind(e);return e}_bare(){const e=this.clone();e._reset();const t=e._definition.terms;for(const r in t){const s=t[r];e.$_terms[r]=s.init}return e.$_mutateRebuild()}_default(e,t,r={}){return l.assertOptions(r,"literal"),s(void 0!==t,"Missing",e,"value"),s("function"==typeof t||!r.literal,"Only function value supports literal option"),"function"==typeof t&&r.literal&&(t={[l.symbols.literal]:!0,literal:t}),this.$_setFlag(e,t)}_generate(e,t,r){if(!this.$_terms.whens)return{schema:this};const s=[],n=[];for(let a=0;a<this.$_terms.whens.length;++a){const o=this.$_terms.whens[a];if(o.concat){s.push(o.concat),n.push("".concat(a,".concat"));continue}const i=o.ref?o.ref.resolve(e,t,r):e,l=o.is?[o]:o.switch,c=n.length;for(let c=0;c<l.length;++c){const{is:u,then:f,otherwise:m}=l[c],h="".concat(a).concat(o.switch?"."+c:"");if(u.$_match(i,t.nest(u,"".concat(h,".is")),r)){if(f){const a=t.localize([...t.path,"".concat(h,".then")],t.ancestors,t.schemas),{schema:o,id:i}=f._generate(e,a,r);s.push(o),n.push("".concat(h,".then").concat(i?"(".concat(i,")"):""));break}}else if(m){const a=t.localize([...t.path,"".concat(h,".otherwise")],t.ancestors,t.schemas),{schema:o,id:i}=m._generate(e,a,r);s.push(o),n.push("".concat(h,".otherwise").concat(i?"(".concat(i,")"):""));break}}if(o.break&&n.length>c)break}const a=n.join(", ");if(t.mainstay.tracer.debug(t,"rule","when",a),!a)return{schema:this};if(!t.mainstay.tracer.active&&this.$_temp.whens[a])return{schema:this.$_temp.whens[a],id:a};let o=this;this._definition.generate&&(o=this._definition.generate(this,e,t,r));for(const e of s)o=o.concat(e);return this.$_root._tracer&&this.$_root._tracer._combine(o,[this,...s]),this.$_temp.whens[a]=o,{schema:o,id:a}}_inner(e,t,r={}){s(!this._inRuleset(),"Cannot set ".concat(e," inside a ruleset"));const n=this.clone();return n.$_terms[e]&&!r.override||(n.$_terms[e]=[]),r.single?n.$_terms[e].push(t):n.$_terms[e].push(...t),n.$_temp.ruleset=!1,n}_inRuleset(){return null!==this.$_temp.ruleset&&!1!==this.$_temp.ruleset}_ruleRemove(e,t={}){if(!this._singleRules.has(e))return this;const r=!1!==t.clone?this.clone():this;r._singleRules.delete(e);const s=[];for(let t=0;t<r._rules.length;++t){const n=r._rules[t];n.name!==e||n.keep?s.push(n):r._inRuleset()&&t<r.$_temp.ruleset&&--r.$_temp.ruleset}return r._rules=s,r}_values(e,t){l.verifyFlat(e,t.slice(1,-1));const r=this.clone(),n=e[0]===l.symbols.override;if(n&&(e=e.slice(1)),!r[t]&&e.length?r[t]=new b:n&&(r[t]=e.length?new b:null,r.$_mutateRebuild()),!r[t])return r;n&&r[t].override();for(const n of e){s(void 0!==n,"Cannot call allow/valid/invalid with undefined"),s(n!==l.symbols.override,"Override must be the first value");const e="_invalids"===t?"_valids":"_invalids";r[e]&&(r[e].remove(n),r[e].length||(s("_valids"===t||!r._flags.only,"Setting invalid value",n,"leaves schema rejecting all values due to previous valid rule"),r[e]=null)),r[t].add(n,r._refs)}return r}}};v.Base.prototype[l.symbols.any]={version:l.version,compile:c.compile,root:"$_root"},v.Base.prototype.isImmutable=!0,v.Base.prototype.deny=v.Base.prototype.invalid,v.Base.prototype.disallow=v.Base.prototype.invalid,v.Base.prototype.equal=v.Base.prototype.valid,v.Base.prototype.exist=v.Base.prototype.required,v.Base.prototype.not=v.Base.prototype.invalid,v.Base.prototype.options=v.Base.prototype.prefs,v.Base.prototype.preferences=v.Base.prototype.prefs,e.exports=new v.Base},8652:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(8160),o={max:1e3,supported:new Set(["undefined","boolean","number","string"])};t.provider={provision:e=>new o.Cache(e)},o.Cache=class{constructor(e={}){a.assertOptions(e,["max"]),s(void 0===e.max||e.max&&e.max>0&&isFinite(e.max),"Invalid max cache size"),this._max=e.max||o.max,this._map=new Map,this._list=new o.List}get length(){return this._map.size}set(e,t){if(null!==e&&!o.supported.has(typeof e))return;let r=this._map.get(e);if(r)return r.value=t,void this._list.first(r);r=this._list.unshift({key:e,value:t}),this._map.set(e,r),this._compact()}get(e){const t=this._map.get(e);if(t)return this._list.first(t),n(t.value)}_compact(){if(this._map.size>this._max){const e=this._list.pop();this._map.delete(e.key)}}},o.List=class{constructor(){this.tail=null,this.head=null}unshift(e){return e.next=null,e.prev=this.head,this.head&&(this.head.next=e),this.head=e,this.tail||(this.tail=e),e}first(e){e!==this.head&&(this._remove(e),this.unshift(e))}pop(){return this._remove(this.tail)}_remove(e){const{next:t,prev:r}=e;return t.prev=r,r&&(r.next=t),e===this.tail&&(this.tail=t),e.prev=null,e.next=null,e}}},8160:(e,t,r)=>{"use strict";const s=r(375),n=r(7916),a=r(1238);let o,i;const l={isoDate:/^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/};t.version=a.version,t.defaults={abortEarly:!0,allowUnknown:!1,artifacts:!1,cache:!0,context:null,convert:!0,dateFormat:"iso",errors:{escapeHtml:!1,label:"path",language:null,render:!0,stack:!1,wrap:{label:'"',array:"[]"}},externals:!0,messages:{},nonEnumerables:!1,noDefaults:!1,presence:"optional",skipFunctions:!1,stripUnknown:!1,warnings:!1},t.symbols={any:Symbol.for("@hapi/joi/schema"),arraySingle:Symbol("arraySingle"),deepDefault:Symbol("deepDefault"),errors:Symbol("errors"),literal:Symbol("literal"),override:Symbol("override"),parent:Symbol("parent"),prefs:Symbol("prefs"),ref:Symbol("ref"),template:Symbol("template"),values:Symbol("values")},t.assertOptions=function(e,t,r="Options"){s(e&&"object"==typeof e&&!Array.isArray(e),"Options must be of type object");const n=Object.keys(e).filter((e=>!t.includes(e)));s(0===n.length,"".concat(r," contain unknown keys: ").concat(n))},t.checkPreferences=function(e){i=i||r(3378);const t=i.preferences.validate(e);if(t.error)throw new n([t.error.details[0].message])},t.compare=function(e,t,r){switch(r){case"=":return e===t;case">":return e>t;case"<":return e<t;case">=":return e>=t;case"<=":return e<=t}},t.default=function(e,t){return void 0===e?t:e},t.isIsoDate=function(e){return l.isoDate.test(e)},t.isNumber=function(e){return"number"==typeof e&&!isNaN(e)},t.isResolvable=function(e){return!!e&&(e[t.symbols.ref]||e[t.symbols.template])},t.isSchema=function(e,r={}){const n=e&&e[t.symbols.any];return!!n&&(s(r.legacy||n.version===t.version,"Cannot mix different versions of joi schemas"),!0)},t.isValues=function(e){return e[t.symbols.values]},t.limit=function(e){return Number.isSafeInteger(e)&&e>=0},t.preferences=function(e,s){o=o||r(6914),e=e||{},s=s||{};const n=Object.assign({},e,s);return s.errors&&e.errors&&(n.errors=Object.assign({},e.errors,s.errors),n.errors.wrap=Object.assign({},e.errors.wrap,s.errors.wrap)),s.messages&&(n.messages=o.compile(s.messages,e.messages)),delete n[t.symbols.prefs],n},t.tryWithPath=function(e,t,r={}){try{return e()}catch(e){throw void 0!==e.path?e.path=t+"."+e.path:e.path=t,r.append&&(e.message="".concat(e.message," (").concat(e.path,")")),e}},t.validateArg=function(e,r,{assert:s,message:n}){if(t.isSchema(s)){const t=s.validate(e);if(!t.error)return;return t.error.message}if(!s(e))return r?"".concat(r," ").concat(n):n},t.verifyFlat=function(e,t){for(const r of e)s(!Array.isArray(r),"Method no longer accepts array arguments:",t)}},3292:(e,t,r)=>{"use strict";const s=r(375),n=r(8160),a=r(6133),o={};t.schema=function(e,t,r={}){n.assertOptions(r,["appendPath","override"]);try{return o.schema(e,t,r)}catch(e){throw r.appendPath&&void 0!==e.path&&(e.message="".concat(e.message," (").concat(e.path,")")),e}},o.schema=function(e,t,r){s(void 0!==t,"Invalid undefined schema"),Array.isArray(t)&&(s(t.length,"Invalid empty array schema"),1===t.length&&(t=t[0]));const a=(t,...s)=>!1!==r.override?t.valid(e.override,...s):t.valid(...s);if(o.simple(t))return a(e,t);if("function"==typeof t)return e.custom(t);if(s("object"==typeof t,"Invalid schema content:",typeof t),n.isResolvable(t))return a(e,t);if(n.isSchema(t))return t;if(Array.isArray(t)){for(const r of t)if(!o.simple(r))return e.alternatives().try(...t);return a(e,...t)}return t instanceof RegExp?e.string().regex(t):t instanceof Date?a(e.date(),t):(s(Object.getPrototypeOf(t)===Object.getPrototypeOf({}),"Schema can only contain plain objects"),e.object().keys(t))},t.ref=function(e,t){return a.isRef(e)?e:a.create(e,t)},t.compile=function(e,r,a={}){n.assertOptions(a,["legacy"]);const i=r&&r[n.symbols.any];if(i)return s(a.legacy||i.version===n.version,"Cannot mix different versions of joi schemas:",i.version,n.version),r;if("object"!=typeof r||!a.legacy)return t.schema(e,r,{appendPath:!0});const l=o.walk(r);return l?l.compile(l.root,r):t.schema(e,r,{appendPath:!0})},o.walk=function(e){if("object"!=typeof e)return null;if(Array.isArray(e)){for(const t of e){const e=o.walk(t);if(e)return e}return null}const t=e[n.symbols.any];if(t)return{root:e[t.root],compile:t.compile};s(Object.getPrototypeOf(e)===Object.getPrototypeOf({}),"Schema can only contain plain objects");for(const t in e){const r=o.walk(e[t]);if(r)return r}return null},o.simple=function(e){return null===e||["boolean","string","number"].includes(typeof e)},t.when=function(e,r,i){if(void 0===i&&(s(r&&"object"==typeof r,"Missing options"),i=r,r=a.create(".")),Array.isArray(i)&&(i={switch:i}),n.assertOptions(i,["is","not","then","otherwise","switch","break"]),n.isSchema(r))return s(void 0===i.is,'"is" can not be used with a schema condition'),s(void 0===i.not,'"not" can not be used with a schema condition'),s(void 0===i.switch,'"switch" can not be used with a schema condition'),o.condition(e,{is:r,then:i.then,otherwise:i.otherwise,break:i.break});if(s(a.isRef(r)||"string"==typeof r,"Invalid condition:",r),s(void 0===i.not||void 0===i.is,'Cannot combine "is" with "not"'),void 0===i.switch){let l=i;void 0!==i.not&&(l={is:i.not,then:i.otherwise,otherwise:i.then,break:i.break});let c=void 0!==l.is?e.$_compile(l.is):e.$_root.invalid(null,!1,0,"").required();return s(void 0!==l.then||void 0!==l.otherwise,'options must have at least one of "then", "otherwise", or "switch"'),s(void 0===l.break||void 0===l.then||void 0===l.otherwise,"Cannot specify then, otherwise, and break all together"),void 0===i.is||a.isRef(i.is)||n.isSchema(i.is)||(c=c.required()),o.condition(e,{ref:t.ref(r),is:c,then:l.then,otherwise:l.otherwise,break:l.break})}s(Array.isArray(i.switch),'"switch" must be an array'),s(void 0===i.is,'Cannot combine "switch" with "is"'),s(void 0===i.not,'Cannot combine "switch" with "not"'),s(void 0===i.then,'Cannot combine "switch" with "then"');const l={ref:t.ref(r),switch:[],break:i.break};for(let t=0;t<i.switch.length;++t){const r=i.switch[t],o=t===i.switch.length-1;n.assertOptions(r,o?["is","then","otherwise"]:["is","then"]),s(void 0!==r.is,'Switch statement missing "is"'),s(void 0!==r.then,'Switch statement missing "then"');const c={is:e.$_compile(r.is),then:e.$_compile(r.then)};if(a.isRef(r.is)||n.isSchema(r.is)||(c.is=c.is.required()),o){s(void 0===i.otherwise||void 0===r.otherwise,'Cannot specify "otherwise" inside and outside a "switch"');const t=void 0!==i.otherwise?i.otherwise:r.otherwise;void 0!==t&&(s(void 0===l.break,"Cannot specify both otherwise and break"),c.otherwise=e.$_compile(t))}l.switch.push(c)}return l},o.condition=function(e,t){for(const r of["then","otherwise"])void 0===t[r]?delete t[r]:t[r]=e.$_compile(t[r]);return t}},6354:(e,t,r)=>{"use strict";const s=r(5688),n=r(8160),a=r(3328);t.Report=class{constructor(e,r,s,n,a,o,i){if(this.code=e,this.flags=n,this.messages=a,this.path=o.path,this.prefs=i,this.state=o,this.value=r,this.message=null,this.template=null,this.local=s||{},this.local.label=t.label(this.flags,this.state,this.prefs,this.messages),void 0===this.value||this.local.hasOwnProperty("value")||(this.local.value=this.value),this.path.length){const e=this.path[this.path.length-1];"object"!=typeof e&&(this.local.key=e)}}_setTemplate(e){if(this.template=e,!this.flags.label&&0===this.path.length){const e=this._template(this.template,"root");e&&(this.local.label=e)}}toString(){if(this.message)return this.message;const e=this.code;if(!this.prefs.errors.render)return this.code;const t=this._template(this.template)||this._template(this.prefs.messages)||this._template(this.messages);return void 0===t?'Error code "'.concat(e,'" is not defined, your custom type is missing the correct messages definition'):(this.message=t.render(this.value,this.state,this.prefs,this.local,{errors:this.prefs.errors,messages:[this.prefs.messages,this.messages]}),this.prefs.errors.label||(this.message=this.message.replace(/^"" /,"").trim()),this.message)}_template(e,r){return t.template(this.value,e,r||this.code,this.state,this.prefs)}},t.path=function(e){let t="";for(const r of e)"object"!=typeof r&&("string"==typeof r?(t&&(t+="."),t+=r):t+="[".concat(r,"]"));return t},t.template=function(e,t,r,s,o){if(!t)return;if(a.isTemplate(t))return"root"!==r?t:null;let i=o.errors.language;if(n.isResolvable(i)&&(i=i.resolve(e,s,o)),i&&t[i]){if(void 0!==t[i][r])return t[i][r];if(void 0!==t[i]["*"])return t[i]["*"]}return t[r]?t[r]:t["*"]},t.label=function(e,r,s,n){if(e.label)return e.label;if(!s.errors.label)return"";let a=r.path;"key"===s.errors.label&&r.path.length>1&&(a=r.path.slice(-1));return t.path(a)||t.template(null,s.messages,"root",r,s)||n&&t.template(null,n,"root",r,s)||"value"},t.process=function(e,r,s){if(!e)return null;const{override:n,message:a,details:o}=t.details(e);if(n)return n;if(s.errors.stack)return new t.ValidationError(a,o,r);const i=Error.stackTraceLimit;Error.stackTraceLimit=0;const l=new t.ValidationError(a,o,r);return Error.stackTraceLimit=i,l},t.details=function(e,t={}){let r=[];const s=[];for(const n of e){if(n instanceof Error){if(!1!==t.override)return{override:n};const e=n.toString();r.push(e),s.push({message:e,type:"override",context:{error:n}});continue}const e=n.toString();r.push(e),s.push({message:e,path:n.path.filter((e=>"object"!=typeof e)),type:n.code,context:n.local})}return r.length>1&&(r=[...new Set(r)]),{message:r.join(". "),details:s}},t.ValidationError=class extends Error{constructor(e,t,r){super(e),this._original=r,this.details=t}static isError(e){return e instanceof t.ValidationError}},t.ValidationError.prototype.isJoi=!0,t.ValidationError.prototype.name="ValidationError",t.ValidationError.prototype.annotate=s.error},8901:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(8160),o=r(6914),i={};t.type=function(e,t){const r=Object.getPrototypeOf(e),l=n(r),c=e._assign(Object.create(l)),u=Object.assign({},t);delete u.base,l._definition=u;const f=r._definition||{};u.messages=o.merge(f.messages,u.messages),u.properties=Object.assign({},f.properties,u.properties),c.type=u.type,u.flags=Object.assign({},f.flags,u.flags);const m=Object.assign({},f.terms);if(u.terms)for(const e in u.terms){const t=u.terms[e];s(void 0===c.$_terms[e],"Invalid term override for",u.type,e),c.$_terms[e]=t.init,m[e]=t}u.terms=m,u.args||(u.args=f.args),u.prepare=i.prepare(u.prepare,f.prepare),u.coerce&&("function"==typeof u.coerce&&(u.coerce={method:u.coerce}),u.coerce.from&&!Array.isArray(u.coerce.from)&&(u.coerce={method:u.coerce.method,from:[].concat(u.coerce.from)})),u.coerce=i.coerce(u.coerce,f.coerce),u.validate=i.validate(u.validate,f.validate);const h=Object.assign({},f.rules);if(u.rules)for(const e in u.rules){const t=u.rules[e];s("object"==typeof t,"Invalid rule definition for",u.type,e);let r=t.method;if(void 0===r&&(r=function(){return this.$_addRule(e)}),r&&(s(!l[e],"Rule conflict in",u.type,e),l[e]=r),s(!h[e],"Rule conflict in",u.type,e),h[e]=t,t.alias){const e=[].concat(t.alias);for(const r of e)l[r]=t.method}t.args&&(t.argsByName=new Map,t.args=t.args.map((e=>("string"==typeof e&&(e={name:e}),s(!t.argsByName.has(e.name),"Duplicated argument name",e.name),a.isSchema(e.assert)&&(e.assert=e.assert.strict().label(e.name)),t.argsByName.set(e.name,e),e))))}u.rules=h;const d=Object.assign({},f.modifiers);if(u.modifiers)for(const e in u.modifiers){s(!l[e],"Rule conflict in",u.type,e);const t=u.modifiers[e];s("function"==typeof t,"Invalid modifier definition for",u.type,e);const r=function(t){return this.rule({[e]:t})};l[e]=r,d[e]=t}if(u.modifiers=d,u.overrides){l._super=r,c.$_super={};for(const e in u.overrides)s(r[e],"Cannot override missing",e),u.overrides[e][a.symbols.parent]=r[e],c.$_super[e]=r[e].bind(c);Object.assign(l,u.overrides)}u.cast=Object.assign({},f.cast,u.cast);const p=Object.assign({},f.manifest,u.manifest);return p.build=i.build(u.manifest&&u.manifest.build,f.manifest&&f.manifest.build),u.manifest=p,u.rebuild=i.rebuild(u.rebuild,f.rebuild),c},i.build=function(e,t){return e&&t?function(r,s){return t(e(r,s),s)}:e||t},i.coerce=function(e,t){return e&&t?{from:e.from&&t.from?[...new Set([...e.from,...t.from])]:null,method(r,s){let n;if((!t.from||t.from.includes(typeof r))&&(n=t.method(r,s),n)){if(n.errors||void 0===n.value)return n;r=n.value}if(!e.from||e.from.includes(typeof r)){const t=e.method(r,s);if(t)return t}return n}}:e||t},i.prepare=function(e,t){return e&&t?function(r,s){const n=e(r,s);if(n){if(n.errors||void 0===n.value)return n;r=n.value}return t(r,s)||n}:e||t},i.rebuild=function(e,t){return e&&t?function(r){t(r),e(r)}:e||t},i.validate=function(e,t){return e&&t?function(r,s){const n=t(r,s);if(n){if(n.errors&&(!Array.isArray(n.errors)||n.errors.length))return n;r=n.value}return e(r,s)||n}:e||t}},5107:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(8652),o=r(8160),i=r(3292),l=r(6354),c=r(8901),u=r(9708),f=r(6133),m=r(3328),h=r(1152);let d;const p={types:{alternatives:r(4946),any:r(8068),array:r(546),boolean:r(4937),date:r(7500),function:r(390),link:r(8785),number:r(3832),object:r(8966),string:r(7417),symbol:r(8826)},aliases:{alt:"alternatives",bool:"boolean",func:"function"},root:function(){const e={_types:new Set(Object.keys(p.types))};for(const t of e._types)e[t]=function(...e){return s(!e.length||["alternatives","link","object"].includes(t),"The",t,"type does not allow arguments"),p.generate(this,p.types[t],e)};for(const t of["allow","custom","disallow","equal","exist","forbidden","invalid","not","only","optional","options","prefs","preferences","required","strip","valid","when"])e[t]=function(...e){return this.any()[t](...e)};Object.assign(e,p.methods);for(const t in p.aliases){const r=p.aliases[t];e[t]=e[r]}return e.x=e.expression,h.setup&&h.setup(e),e}};p.methods={ValidationError:l.ValidationError,version:o.version,cache:a.provider,assert(e,t,...r){p.assert(e,t,!0,r)},attempt:(e,t,...r)=>p.assert(e,t,!1,r),build(e){return s("function"==typeof u.build,"Manifest functionality disabled"),u.build(this,e)},checkPreferences(e){o.checkPreferences(e)},compile(e,t){return i.compile(this,e,t)},defaults(e){s("function"==typeof e,"modifier must be a function");const t=Object.assign({},this);for(const r of t._types){const n=e(t[r]());s(o.isSchema(n),"modifier must return a valid schema object"),t[r]=function(...e){return p.generate(this,n,e)}}return t},expression:(...e)=>new m(...e),extend(...e){o.verifyFlat(e,"extend"),d=d||r(3378),s(e.length,"You need to provide at least one extension"),this.assert(e,d.extensions);const t=Object.assign({},this);t._types=new Set(t._types);for(let r of e){"function"==typeof r&&(r=r(t)),this.assert(r,d.extension);const e=p.expandExtension(r,t);for(const r of e){s(void 0===t[r.type]||t._types.has(r.type),"Cannot override name",r.type);const e=r.base||this.any(),n=c.type(e,r);t._types.add(r.type),t[r.type]=function(...e){return p.generate(this,n,e)}}}return t},isError:l.ValidationError.isError,isExpression:m.isTemplate,isRef:f.isRef,isSchema:o.isSchema,in:(...e)=>f.in(...e),override:o.symbols.override,ref:(...e)=>f.create(...e),types(){const e={};for(const t of this._types)e[t]=this[t]();for(const t in p.aliases)e[t]=this[t]();return e}},p.assert=function(e,t,r,s){const a=s[0]instanceof Error||"string"==typeof s[0]?s[0]:null,i=a?s[1]:s[0],c=t.validate(e,o.preferences({errors:{stack:!0}},i||{}));let u=c.error;if(!u)return c.value;if(a instanceof Error)throw a;const f=r&&"function"==typeof u.annotate?u.annotate():u.message;throw u instanceof l.ValidationError==0&&(u=n(u)),u.message=a?"".concat(a," ").concat(f):f,u},p.generate=function(e,t,r){return s(e,"Must be invoked on a Joi instance."),t.$_root=e,t._definition.args&&r.length?t._definition.args(t,...r):t},p.expandExtension=function(e,t){if("string"==typeof e.type)return[e];const r=[];for(const s of t._types)if(e.type.test(s)){const n=Object.assign({},e);n.type=s,n.base=t[s](),r.push(n)}return r},e.exports=p.root()},6914:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(3328);t.compile=function(e,t){if("string"==typeof e)return s(!t,"Cannot set single message string"),new a(e);if(a.isTemplate(e))return s(!t,"Cannot set single message template"),e;s("object"==typeof e&&!Array.isArray(e),"Invalid message options"),t=t?n(t):{};for(let r in e){const n=e[r];if("root"===r||a.isTemplate(n)){t[r]=n;continue}if("string"==typeof n){t[r]=new a(n);continue}s("object"==typeof n&&!Array.isArray(n),"Invalid message for",r);const o=r;for(r in t[o]=t[o]||{},n){const e=n[r];"root"===r||a.isTemplate(e)?t[o][r]=e:(s("string"==typeof e,"Invalid message for",r,"in",o),t[o][r]=new a(e))}}return t},t.decompile=function(e){const t={};for(let r in e){const s=e[r];if("root"===r){t.root=s;continue}if(a.isTemplate(s)){t[r]=s.describe({compact:!0});continue}const n=r;for(r in t[n]={},s){const e=s[r];"root"!==r?t[n][r]=e.describe({compact:!0}):t[n].root=e}}return t},t.merge=function(e,r){if(!e)return t.compile(r);if(!r)return e;if("string"==typeof r)return new a(r);if(a.isTemplate(r))return r;const o=n(e);for(let e in r){const t=r[e];if("root"===e||a.isTemplate(t)){o[e]=t;continue}if("string"==typeof t){o[e]=new a(t);continue}s("object"==typeof t&&!Array.isArray(t),"Invalid message for",e);const n=e;for(e in o[n]=o[n]||{},t){const r=t[e];"root"===e||a.isTemplate(r)?o[n][e]=r:(s("string"==typeof r,"Invalid message for",e,"in",n),o[n][e]=new a(r))}}return o}},2294:(e,t,r)=>{"use strict";function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function n(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const o=r(375),i=r(8160),l=r(6133),c={};t.Ids=c.Ids=class{constructor(){this._byId=new Map,this._byKey=new Map,this._schemaChain=!1}clone(){const e=new c.Ids;return e._byId=new Map(this._byId),e._byKey=new Map(this._byKey),e._schemaChain=this._schemaChain,e}concat(e){e._schemaChain&&(this._schemaChain=!0);for(const[t,r]of e._byId.entries())o(!this._byKey.has(t),"Schema id conflicts with existing key:",t),this._byId.set(t,r);for(const[t,r]of e._byKey.entries())o(!this._byId.has(t),"Schema key conflicts with existing id:",t),this._byKey.set(t,r)}fork(e,t,r){const s=this._collect(e);s.push({schema:r});const n=s.shift();let a={id:n.id,schema:t(n.schema)};o(i.isSchema(a.schema),"adjuster function failed to return a joi schema type");for(const e of s)a={id:e.id,schema:c.fork(e.schema,a.id,a.schema)};return a.schema}labels(e,t=[]){const r=e[0],s=this._get(r);if(!s)return[...t,...e].join(".");const n=e.slice(1);return t=[...t,s.schema._flags.label||r],n.length?s.schema._ids.labels(n,t):t.join(".")}reach(e,t=[]){const r=e[0],s=this._get(r);o(s,"Schema does not contain path",[...t,...e].join("."));const n=e.slice(1);return n.length?s.schema._ids.reach(n,[...t,r]):s.schema}register(e,{key:t}={}){if(!e||!i.isSchema(e))return;(e.$_property("schemaChain")||e._ids._schemaChain)&&(this._schemaChain=!0);const r=e._flags.id;if(r){const t=this._byId.get(r);o(!t||t.schema===e,"Cannot add different schemas with the same id:",r),o(!this._byKey.has(r),"Schema id conflicts with existing key:",r),this._byId.set(r,{schema:e,id:r})}t&&(o(!this._byKey.has(t),"Schema already contains key:",t),o(!this._byId.has(t),"Schema key conflicts with existing id:",t),this._byKey.set(t,{schema:e,id:t}))}reset(){this._byId=new Map,this._byKey=new Map,this._schemaChain=!1}_collect(e,t=[],r=[]){const s=e[0],n=this._get(s);o(n,"Schema does not contain path",[...t,...e].join(".")),r=[n,...r];const a=e.slice(1);return a.length?n.schema._ids._collect(a,[...t,s],r):r}_get(e){return this._byId.get(e)||this._byKey.get(e)}},c.fork=function(e,r,s){const n=t.schema(e,{each:(e,{key:t})=>{if(r===(e._flags.id||t))return s},ref:!1});return n?n.$_mutateRebuild():e},t.schema=function(e,t){let r;for(const s in e._flags){if("_"===s[0])continue;const n=c.scan(e._flags[s],{source:"flags",name:s},t);void 0!==n&&(r=r||e.clone(),r._flags[s]=n)}for(let s=0;s<e._rules.length;++s){const n=e._rules[s],a=c.scan(n.args,{source:"rules",name:n.name},t);if(void 0!==a){r=r||e.clone();const t=Object.assign({},n);t.args=a,r._rules[s]=t,r._singleRules.get(n.name)===n&&r._singleRules.set(n.name,t)}}for(const s in e.$_terms){if("_"===s[0])continue;const n=c.scan(e.$_terms[s],{source:"terms",name:s},t);void 0!==n&&(r=r||e.clone(),r.$_terms[s]=n)}return r},c.scan=function(e,t,r,s,a){const o=s||[];if(null===e||"object"!=typeof e)return;let u;if(Array.isArray(e)){for(let s=0;s<e.length;++s){const n="terms"===t.source&&"keys"===t.name&&e[s].key,a=c.scan(e[s],t,r,[s,...o],n);void 0!==a&&(u=u||e.slice(),u[s]=a)}return u}if(!1!==r.schema&&i.isSchema(e)||!1!==r.ref&&l.isRef(e)){const s=r.each(e,n(n({},t),{},{path:o,key:a}));if(s===e)return;return s}for(const s in e){if("_"===s[0])continue;const n=c.scan(e[s],t,r,[s,...o],a);void 0!==n&&(u=u||Object.assign({},e),u[s]=n)}return u}},6133:(e,t,r)=>{"use strict";function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function n(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const o=r(375),i=r(8571),l=r(9621),c=r(8160);let u;const f={symbol:Symbol("ref"),defaults:{adjust:null,in:!1,iterables:null,map:null,separator:".",type:"value"}};t.create=function(e,t={}){o("string"==typeof e,"Invalid reference key:",e),c.assertOptions(t,["adjust","ancestor","in","iterables","map","prefix","render","separator"]),o(!t.prefix||"object"==typeof t.prefix,"options.prefix must be of type object");const r=Object.assign({},f.defaults,t);delete r.prefix;const s=r.separator,n=f.context(e,s,t.prefix);if(r.type=n.type,e=n.key,"value"===r.type)if(n.root&&(o(!s||e[0]!==s,"Cannot specify relative path with root prefix"),r.ancestor="root",e||(e=null)),s&&s===e)e=null,r.ancestor=0;else if(void 0!==r.ancestor)o(!s||!e||e[0]!==s,"Cannot combine prefix with ancestor option");else{const[t,n]=f.ancestor(e,s);n&&""===(e=e.slice(n))&&(e=null),r.ancestor=t}return r.path=s?null===e?[]:e.split(s):[e],new f.Ref(r)},t.in=function(e,r={}){return t.create(e,n(n({},r),{},{in:!0}))},t.isRef=function(e){return!!e&&!!e[c.symbols.ref]},f.Ref=class{constructor(e){o("object"==typeof e,"Invalid reference construction"),c.assertOptions(e,["adjust","ancestor","in","iterables","map","path","render","separator","type","depth","key","root","display"]),o([!1,void 0].includes(e.separator)||"string"==typeof e.separator&&1===e.separator.length,"Invalid separator"),o(!e.adjust||"function"==typeof e.adjust,"options.adjust must be a function"),o(!e.map||Array.isArray(e.map),"options.map must be an array"),o(!e.map||!e.adjust,"Cannot set both map and adjust options"),Object.assign(this,f.defaults,e),o("value"===this.type||void 0===this.ancestor,"Non-value references cannot reference ancestors"),Array.isArray(this.map)&&(this.map=new Map(this.map)),this.depth=this.path.length,this.key=this.path.length?this.path.join(this.separator):null,this.root=this.path[0],this.updateDisplay()}resolve(e,t,r,s,n={}){return o(!this.in||n.in,"Invalid in() reference usage"),"global"===this.type?this._resolve(r.context,t,n):"local"===this.type?this._resolve(s,t,n):this.ancestor?"root"===this.ancestor?this._resolve(t.ancestors[t.ancestors.length-1],t,n):(o(this.ancestor<=t.ancestors.length,"Invalid reference exceeds the schema root:",this.display),this._resolve(t.ancestors[this.ancestor-1],t,n)):this._resolve(e,t,n)}_resolve(e,t,r){let s;if("value"===this.type&&t.mainstay.shadow&&!1!==r.shadow&&(s=t.mainstay.shadow.get(this.absolute(t))),void 0===s&&(s=l(e,this.path,{iterables:this.iterables,functions:!0})),this.adjust&&(s=this.adjust(s)),this.map){const e=this.map.get(s);void 0!==e&&(s=e)}return t.mainstay&&t.mainstay.tracer.resolve(t,this,s),s}toString(){return this.display}absolute(e){return[...e.path.slice(0,-this.ancestor),...this.path]}clone(){return new f.Ref(this)}describe(){const e={path:this.path};"value"!==this.type&&(e.type=this.type),"."!==this.separator&&(e.separator=this.separator),"value"===this.type&&1!==this.ancestor&&(e.ancestor=this.ancestor),this.map&&(e.map=[...this.map]);for(const t of["adjust","iterables","render"])null!==this[t]&&void 0!==this[t]&&(e[t]=this[t]);return!1!==this.in&&(e.in=!0),{ref:e}}updateDisplay(){const e=null!==this.key?this.key:"";if("value"!==this.type)return void(this.display="ref:".concat(this.type,":").concat(e));if(!this.separator)return void(this.display="ref:".concat(e));if(!this.ancestor)return void(this.display="ref:".concat(this.separator).concat(e));if("root"===this.ancestor)return void(this.display="ref:root:".concat(e));if(1===this.ancestor)return void(this.display="ref:".concat(e||".."));const t=new Array(this.ancestor+1).fill(this.separator).join("");this.display="ref:".concat(t).concat(e||"")}},f.Ref.prototype[c.symbols.ref]=!0,t.build=function(e){return"value"===(e=Object.assign({},f.defaults,e)).type&&void 0===e.ancestor&&(e.ancestor=1),new f.Ref(e)},f.context=function(e,t,r={}){if(e=e.trim(),r){const s=void 0===r.global?"$":r.global;if(s!==t&&e.startsWith(s))return{key:e.slice(s.length),type:"global"};const n=void 0===r.local?"#":r.local;if(n!==t&&e.startsWith(n))return{key:e.slice(n.length),type:"local"};const a=void 0===r.root?"/":r.root;if(a!==t&&e.startsWith(a))return{key:e.slice(a.length),type:"value",root:!0}}return{key:e,type:"value"}},f.ancestor=function(e,t){if(!t)return[1,0];if(e[0]!==t)return[1,0];if(e[1]!==t)return[0,1];let r=2;for(;e[r]===t;)++r;return[r-1,r]},t.toSibling=0,t.toParent=1,t.Manager=class{constructor(){this.refs=[]}register(e,s){if(e)if(s=void 0===s?t.toParent:s,Array.isArray(e))for(const t of e)this.register(t,s);else if(c.isSchema(e))for(const t of e._refs.refs)t.ancestor-s>=0&&this.refs.push({ancestor:t.ancestor-s,root:t.root});else t.isRef(e)&&"value"===e.type&&e.ancestor-s>=0&&this.refs.push({ancestor:e.ancestor-s,root:e.root}),u=u||r(3328),u.isTemplate(e)&&this.register(e.refs(),s)}get length(){return this.refs.length}clone(){const e=new t.Manager;return e.refs=i(this.refs),e}reset(){this.refs=[]}roots(){return this.refs.filter((e=>!e.ancestor)).map((e=>e.root))}}},3378:(e,t,r)=>{"use strict";const s=r(5107),n={};n.wrap=s.string().min(1).max(2).allow(!1),t.preferences=s.object({allowUnknown:s.boolean(),abortEarly:s.boolean(),artifacts:s.boolean(),cache:s.boolean(),context:s.object(),convert:s.boolean(),dateFormat:s.valid("date","iso","string","time","utc"),debug:s.boolean(),errors:{escapeHtml:s.boolean(),label:s.valid("path","key",!1),language:[s.string(),s.object().ref()],render:s.boolean(),stack:s.boolean(),wrap:{label:n.wrap,array:n.wrap,string:n.wrap}},externals:s.boolean(),messages:s.object(),noDefaults:s.boolean(),nonEnumerables:s.boolean(),presence:s.valid("required","optional","forbidden"),skipFunctions:s.boolean(),stripUnknown:s.object({arrays:s.boolean(),objects:s.boolean()}).or("arrays","objects").allow(!0,!1),warnings:s.boolean()}).strict(),n.nameRx=/^[a-zA-Z0-9]\w*$/,n.rule=s.object({alias:s.array().items(s.string().pattern(n.nameRx)).single(),args:s.array().items(s.string(),s.object({name:s.string().pattern(n.nameRx).required(),ref:s.boolean(),assert:s.alternatives([s.function(),s.object().schema()]).conditional("ref",{is:!0,then:s.required()}),normalize:s.function(),message:s.string().when("assert",{is:s.function(),then:s.required()})})),convert:s.boolean(),manifest:s.boolean(),method:s.function().allow(!1),multi:s.boolean(),validate:s.function()}),t.extension=s.object({type:s.alternatives([s.string(),s.object().regex()]).required(),args:s.function(),cast:s.object().pattern(n.nameRx,s.object({from:s.function().maxArity(1).required(),to:s.function().minArity(1).maxArity(2).required()})),base:s.object().schema().when("type",{is:s.object().regex(),then:s.forbidden()}),coerce:[s.function().maxArity(3),s.object({method:s.function().maxArity(3).required(),from:s.array().items(s.string()).single()})],flags:s.object().pattern(n.nameRx,s.object({setter:s.string(),default:s.any()})),manifest:{build:s.function().arity(2)},messages:[s.object(),s.string()],modifiers:s.object().pattern(n.nameRx,s.function().minArity(1).maxArity(2)),overrides:s.object().pattern(n.nameRx,s.function()),prepare:s.function().maxArity(3),rebuild:s.function().arity(1),rules:s.object().pattern(n.nameRx,n.rule),terms:s.object().pattern(n.nameRx,s.object({init:s.array().allow(null).required(),manifest:s.object().pattern(/.+/,[s.valid("schema","single"),s.object({mapped:s.object({from:s.string().required(),to:s.string().required()}).required()})])})),validate:s.function().maxArity(3)}).strict(),t.extensions=s.array().items(s.object(),s.function().arity(1)).strict(),n.desc={buffer:s.object({buffer:s.string()}),func:s.object({function:s.function().required(),options:{literal:!0}}),override:s.object({override:!0}),ref:s.object({ref:s.object({type:s.valid("value","global","local"),path:s.array().required(),separator:s.string().length(1).allow(!1),ancestor:s.number().min(0).integer().allow("root"),map:s.array().items(s.array().length(2)).min(1),adjust:s.function(),iterables:s.boolean(),in:s.boolean(),render:s.boolean()}).required()}),regex:s.object({regex:s.string().min(3)}),special:s.object({special:s.valid("deep").required()}),template:s.object({template:s.string().required(),options:s.object()}),value:s.object({value:s.alternatives([s.object(),s.array()]).required()})},n.desc.entity=s.alternatives([s.array().items(s.link("...")),s.boolean(),s.function(),s.number(),s.string(),n.desc.buffer,n.desc.func,n.desc.ref,n.desc.regex,n.desc.special,n.desc.template,n.desc.value,s.link("/")]),n.desc.values=s.array().items(null,s.boolean(),s.function(),s.number().allow(1/0,-1/0),s.string().allow(""),s.symbol(),n.desc.buffer,n.desc.func,n.desc.override,n.desc.ref,n.desc.regex,n.desc.template,n.desc.value),n.desc.messages=s.object().pattern(/.+/,[s.string(),n.desc.template,s.object().pattern(/.+/,[s.string(),n.desc.template])]),t.description=s.object({type:s.string().required(),flags:s.object({cast:s.string(),default:s.any(),description:s.string(),empty:s.link("/"),failover:n.desc.entity,id:s.string(),label:s.string(),only:!0,presence:["optional","required","forbidden"],result:["raw","strip"],strip:s.boolean(),unit:s.string()}).unknown(),preferences:{allowUnknown:s.boolean(),abortEarly:s.boolean(),artifacts:s.boolean(),cache:s.boolean(),convert:s.boolean(),dateFormat:["date","iso","string","time","utc"],errors:{escapeHtml:s.boolean(),label:["path","key"],language:[s.string(),n.desc.ref],wrap:{label:n.wrap,array:n.wrap}},externals:s.boolean(),messages:n.desc.messages,noDefaults:s.boolean(),nonEnumerables:s.boolean(),presence:["required","optional","forbidden"],skipFunctions:s.boolean(),stripUnknown:s.object({arrays:s.boolean(),objects:s.boolean()}).or("arrays","objects").allow(!0,!1),warnings:s.boolean()},allow:n.desc.values,invalid:n.desc.values,rules:s.array().min(1).items({name:s.string().required(),args:s.object().min(1),keep:s.boolean(),message:[s.string(),n.desc.messages],warn:s.boolean()}),keys:s.object().pattern(/.*/,s.link("/")),link:n.desc.ref}).pattern(/^[a-z]\w*$/,s.any())},493:(e,t,r)=>{"use strict";const s=r(8571),n=r(9621),a=r(8160),o={value:Symbol("value")};e.exports=o.State=class{constructor(e,t,r){this.path=e,this.ancestors=t,this.mainstay=r.mainstay,this.schemas=r.schemas,this.debug=null}localize(e,t=null,r=null){const s=new o.State(e,t,this);return r&&s.schemas&&(s.schemas=[o.schemas(r),...s.schemas]),s}nest(e,t){const r=new o.State(this.path,this.ancestors,this);return r.schemas=r.schemas&&[o.schemas(e),...r.schemas],r.debug=t,r}shadow(e,t){this.mainstay.shadow=this.mainstay.shadow||new o.Shadow,this.mainstay.shadow.set(this.path,e,t)}snapshot(){this.mainstay.shadow&&(this._snapshot=s(this.mainstay.shadow.node(this.path)))}restore(){this.mainstay.shadow&&(this.mainstay.shadow.override(this.path,this._snapshot),this._snapshot=void 0)}},o.schemas=function(e){return a.isSchema(e)?{schema:e}:e},o.Shadow=class{constructor(){this._values=null}set(e,t,r){if(!e.length)return;if("strip"===r&&"number"==typeof e[e.length-1])return;this._values=this._values||new Map;let s=this._values;for(let t=0;t<e.length;++t){const r=e[t];let n=s.get(r);n||(n=new Map,s.set(r,n)),s=n}s[o.value]=t}get(e){const t=this.node(e);if(t)return t[o.value]}node(e){if(this._values)return n(this._values,e,{iterables:!0})}override(e,t){if(!this._values)return;const r=e.slice(0,-1),s=e[e.length-1],a=n(this._values,r,{iterables:!0});t?a.set(s,t):a&&a.delete(s)}}},3328:(e,t,r)=>{"use strict";function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function n(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const o=r(375),i=r(8571),l=r(5277),c=r(1447),u=r(8160),f=r(6354),m=r(6133),h={symbol:Symbol("template"),opens:new Array(1e3).join("\0"),closes:new Array(1e3).join(""),dateFormat:{date:Date.prototype.toDateString,iso:Date.prototype.toISOString,string:Date.prototype.toString,time:Date.prototype.toTimeString,utc:Date.prototype.toUTCString}};e.exports=h.Template=class{constructor(e,t){o("string"==typeof e,"Template source must be a string"),o(!e.includes("\0")&&!e.includes(""),"Template source cannot contain reserved control characters"),this.source=e,this.rendered=e,this._template=null,this._settings=i(t),this._parse()}_parse(){if(!this.source.includes("{"))return;const e=h.encode(this.source),t=h.split(e);let r=!1;const s=[],n=t.shift();n&&s.push(n);for(const e of t){const t="{"!==e[0],n=t?"}":"}}",a=e.indexOf(n);if(-1===a||"{"===e[1]){s.push("{".concat(h.decode(e)));continue}let o=e.slice(t?0:1,a);const i=":"===o[0];i&&(o=o.slice(1));const l=this._ref(h.decode(o),{raw:t,wrapped:i});s.push(l),"string"!=typeof l&&(r=!0);const c=e.slice(a+n.length);c&&s.push(h.decode(c))}r?this._template=s:this.rendered=s.join("")}static date(e,t){return h.dateFormat[t.dateFormat].call(e)}describe(e={}){if(!this._settings&&e.compact)return this.source;const t={template:this.source};return this._settings&&(t.options=this._settings),t}static build(e){return new h.Template(e.template,e.options)}isDynamic(){return!!this._template}static isTemplate(e){return!!e&&!!e[u.symbols.template]}refs(){if(!this._template)return;const e=[];for(const t of this._template)"string"!=typeof t&&e.push(...t.refs);return e}resolve(e,t,r,s){return this._template&&1===this._template.length?this._part(this._template[0],e,t,r,s,{}):this.render(e,t,r,s)}_part(e,...t){return e.ref?e.ref.resolve(...t):e.formula.evaluate(t)}render(e,t,r,s,n={}){if(!this.isDynamic())return this.rendered;const a=[];for(const o of this._template)if("string"==typeof o)a.push(o);else{const i=this._part(o,e,t,r,s,n),c=h.stringify(i,e,t,r,s,n);if(void 0!==c){const e=o.raw||!1===(n.errors&&n.errors.escapeHtml)?c:l(c);a.push(h.wrap(e,o.wrapped&&r.errors.wrap.label))}}return a.join("")}_ref(e,{raw:t,wrapped:r}){const s=[],n=e=>{const t=m.create(e,this._settings);return s.push(t),e=>t.resolve(...e)};try{var a=new c.Parser(e,{reference:n,functions:h.functions,constants:h.constants})}catch(t){throw t.message='Invalid template variable "'.concat(e,'" fails due to: ').concat(t.message),t}if(a.single){if("reference"===a.single.type){const e=s[0];return{ref:e,raw:t,refs:s,wrapped:r||"local"===e.type&&"label"===e.key}}return h.stringify(a.single.value)}return{formula:a,raw:t,refs:s}}toString(){return this.source}},h.Template.prototype[u.symbols.template]=!0,h.Template.prototype.isImmutable=!0,h.encode=function(e){return e.replace(/\\(\{+)/g,((e,t)=>h.opens.slice(0,t.length))).replace(/\\(\}+)/g,((e,t)=>h.closes.slice(0,t.length)))},h.decode=function(e){return e.replace(/\u0000/g,"{").replace(/\u0001/g,"}")},h.split=function(e){const t=[];let r="";for(let s=0;s<e.length;++s){const n=e[s];if("{"===n){let n="";for(;s+1<e.length&&"{"===e[s+1];)n+="{",++s;t.push(r),r=n}else r+=n}return t.push(r),t},h.wrap=function(e,t){return t?1===t.length?"".concat(t).concat(e).concat(t):"".concat(t[0]).concat(e).concat(t[1]):e},h.stringify=function(e,t,r,s,a,o={}){const i=typeof e,l=s&&s.errors&&s.errors.wrap||{};let c=!1;if(m.isRef(e)&&e.render&&(c=e.in,e=e.resolve(t,r,s,a,n({in:e.in},o))),null===e)return"null";if("string"===i)return h.wrap(e,o.arrayItems&&l.string);if("number"===i||"function"===i||"symbol"===i)return e.toString();if("object"!==i)return JSON.stringify(e);if(e instanceof Date)return h.Template.date(e,s);if(e instanceof Map){const t=[];for(const[r,s]of e.entries())t.push("".concat(r.toString()," -> ").concat(s.toString()));e=t}if(!Array.isArray(e))return e.toString();const u=[];for(const i of e)u.push(h.stringify(i,t,r,s,a,n({arrayItems:!0},o)));return h.wrap(u.join(", "),!c&&l.array)},h.constants={true:!0,false:!1,null:null,second:1e3,minute:6e4,hour:36e5,day:864e5},h.functions={if:(e,t,r)=>e?t:r,msg(e){const[t,r,s,n,a]=this,o=a.messages;if(!o)return"";const i=f.template(t,o[0],e,r,s)||f.template(t,o[1],e,r,s);return i?i.render(t,r,s,n,a):""},number:e=>"number"==typeof e?e:"string"==typeof e?parseFloat(e):"boolean"==typeof e?e?1:0:e instanceof Date?e.getTime():null}},4946:(e,t,r)=>{"use strict";const s=r(375),n=r(1687),a=r(8068),o=r(8160),i=r(3292),l=r(6354),c=r(6133),u={};e.exports=a.extend({type:"alternatives",flags:{match:{default:"any"}},terms:{matches:{init:[],register:c.toSibling}},args:(e,...t)=>1===t.length&&Array.isArray(t[0])?e.try(...t[0]):e.try(...t),validate(e,t){const{schema:r,error:s,state:a,prefs:o}=t;if(r._flags.match){const t=[],i=[];for(let s=0;s<r.$_terms.matches.length;++s){const n=r.$_terms.matches[s],l=a.nest(n.schema,"match.".concat(s));l.snapshot();const c=n.schema.$_validate(e,l,o);c.errors?(i.push(c.errors),l.restore()):t.push(c.value)}if(0===t.length)return{errors:s("alternatives.any",{details:i.map((e=>l.details(e,{override:!1})))})};if("one"===r._flags.match)return 1===t.length?{value:t[0]}:{errors:s("alternatives.one")};if(t.length!==r.$_terms.matches.length)return{errors:s("alternatives.all",{details:i.map((e=>l.details(e,{override:!1})))})};const c=e=>e.$_terms.matches.some((e=>"object"===e.schema.type||"alternatives"===e.schema.type&&c(e.schema)));return c(r)?{value:t.reduce(((e,t)=>n(e,t,{mergeArrays:!1})))}:{value:t[t.length-1]}}const i=[];for(let t=0;t<r.$_terms.matches.length;++t){const s=r.$_terms.matches[t];if(s.schema){const r=a.nest(s.schema,"match.".concat(t));r.snapshot();const n=s.schema.$_validate(e,r,o);if(!n.errors)return n;r.restore(),i.push({schema:s.schema,reports:n.errors});continue}const n=s.ref?s.ref.resolve(e,a,o):e,l=s.is?[s]:s.switch;for(let r=0;r<l.length;++r){const i=l[r],{is:c,then:u,otherwise:f}=i,m="match.".concat(t).concat(s.switch?"."+r:"");if(c.$_match(n,a.nest(c,"".concat(m,".is")),o)){if(u)return u.$_validate(e,a.nest(u,"".concat(m,".then")),o)}else if(f)return f.$_validate(e,a.nest(f,"".concat(m,".otherwise")),o)}}return u.errors(i,t)},rules:{conditional:{method(e,t){s(!this._flags._endedSwitch,"Unreachable condition"),s(!this._flags.match,"Cannot combine match mode",this._flags.match,"with conditional rule"),s(void 0===t.break,"Cannot use break option with alternatives conditional");const r=this.clone(),n=i.when(r,e,t),a=n.is?[n]:n.switch;for(const e of a)if(e.then&&e.otherwise){r.$_setFlag("_endedSwitch",!0,{clone:!1});break}return r.$_terms.matches.push(n),r.$_mutateRebuild()}},match:{method(e){if(s(["any","one","all"].includes(e),"Invalid alternatives match mode",e),"any"!==e)for(const t of this.$_terms.matches)s(t.schema,"Cannot combine match mode",e,"with conditional rules");return this.$_setFlag("match",e)}},try:{method(...e){s(e.length,"Missing alternative schemas"),o.verifyFlat(e,"try"),s(!this._flags._endedSwitch,"Unreachable condition");const t=this.clone();for(const r of e)t.$_terms.matches.push({schema:t.$_compile(r)});return t.$_mutateRebuild()}}},overrides:{label(e){return this.$_parent("label",e).$_modify({each:(t,r)=>"is"!==r.path[0]?t.label(e):void 0,ref:!1})}},rebuild(e){e.$_modify({each:t=>{o.isSchema(t)&&"array"===t.type&&e.$_setFlag("_arrayItems",!0,{clone:!1})}})},manifest:{build(e,t){if(t.matches)for(const r of t.matches){const{schema:t,ref:s,is:n,not:a,then:o,otherwise:i}=r;e=t?e.try(t):s?e.conditional(s,{is:n,then:o,not:a,otherwise:i,switch:r.switch}):e.conditional(n,{then:o,otherwise:i})}return e}},messages:{"alternatives.all":"{{#label}} does not match all of the required types","alternatives.any":"{{#label}} does not match any of the allowed types","alternatives.match":"{{#label}} does not match any of the allowed types","alternatives.one":"{{#label}} matches more than one allowed type","alternatives.types":"{{#label}} must be one of {{#types}}"}}),u.errors=function(e,{error:t,state:r}){if(!e.length)return{errors:t("alternatives.any")};if(1===e.length)return{errors:e[0].reports};const s=new Set,n=[];for(const{reports:a,schema:o}of e){if(a.length>1)return u.unmatched(e,t);const i=a[0];if(i instanceof l.Report==0)return u.unmatched(e,t);if(i.state.path.length!==r.path.length){n.push({type:o.type,report:i});continue}if("any.only"===i.code){for(const e of i.local.valids)s.add(e);continue}const[c,f]=i.code.split(".");"base"===f?s.add(c):n.push({type:o.type,report:i})}return n.length?1===n.length?{errors:n[0].report}:u.unmatched(e,t):{errors:t("alternatives.types",{types:[...s]})}},u.unmatched=function(e,t){const r=[];for(const t of e)r.push(...t.reports);return{errors:t("alternatives.match",l.details(r,{override:!1}))}}},8068:(e,t,r)=>{"use strict";const s=r(375),n=r(7629),a=r(8160),o=r(6914);e.exports=n.extend({type:"any",flags:{only:{default:!1}},terms:{alterations:{init:null},examples:{init:null},externals:{init:null},metas:{init:[]},notes:{init:[]},shared:{init:null},tags:{init:[]},whens:{init:null}},rules:{custom:{method(e,t){return s("function"==typeof e,"Method must be a function"),s(void 0===t||t&&"string"==typeof t,"Description must be a non-empty string"),this.$_addRule({name:"custom",args:{method:e,description:t}})},validate(e,t,{method:r}){try{return r(e,t)}catch(e){return t.error("any.custom",{error:e})}},args:["method","description"],multi:!0},messages:{method(e){return this.prefs({messages:e})}},shared:{method(e){s(a.isSchema(e)&&e._flags.id,"Schema must be a schema with an id");const t=this.clone();return t.$_terms.shared=t.$_terms.shared||[],t.$_terms.shared.push(e),t.$_mutateRegister(e),t}},warning:{method(e,t){return s(e&&"string"==typeof e,"Invalid warning code"),this.$_addRule({name:"warning",args:{code:e,local:t},warn:!0})},validate:(e,t,{code:r,local:s})=>t.error(r,s),args:["code","local"],multi:!0}},modifiers:{keep(e,t=!0){e.keep=t},message(e,t){e.message=o.compile(t)},warn(e,t=!0){e.warn=t}},manifest:{build(e,t){for(const r in t){const s=t[r];if(["examples","externals","metas","notes","tags"].includes(r))for(const t of s)e=e[r.slice(0,-1)](t);else if("alterations"!==r)if("whens"!==r){if("shared"===r)for(const t of s)e=e.shared(t)}else for(const t of s){const{ref:r,is:s,not:n,then:a,otherwise:o,concat:i}=t;e=i?e.concat(i):r?e.when(r,{is:s,not:n,then:a,otherwise:o,switch:t.switch,break:t.break}):e.when(s,{then:a,otherwise:o,break:t.break})}else{const t={};for(const{target:e,adjuster:r}of s)t[e]=r;e=e.alter(t)}}return e}},messages:{"any.custom":"{{#label}} failed custom validation because {{#error.message}}","any.default":"{{#label}} threw an error when running default method","any.failover":"{{#label}} threw an error when running failover method","any.invalid":"{{#label}} contains an invalid value","any.only":'{{#label}} must be {if(#valids.length == 1, "", "one of ")}{{#valids}}',"any.ref":"{{#label}} {{#arg}} references {{:#ref}} which {{#reason}}","any.required":"{{#label}} is required","any.unknown":"{{#label}} is not allowed"}})},546:(e,t,r)=>{"use strict";const s=r(375),n=r(9474),a=r(9621),o=r(8068),i=r(8160),l=r(3292),c={};e.exports=o.extend({type:"array",flags:{single:{default:!1},sparse:{default:!1}},terms:{items:{init:[],manifest:"schema"},ordered:{init:[],manifest:"schema"},_exclusions:{init:[]},_inclusions:{init:[]},_requireds:{init:[]}},coerce:{from:"object",method(e,{schema:t,state:r,prefs:s}){if(!Array.isArray(e))return;const n=t.$_getRule("sort");return n?c.sort(t,e,n.args.options,r,s):void 0}},validate(e,{schema:t,error:r}){if(!Array.isArray(e)){if(t._flags.single){const t=[e];return t[i.symbols.arraySingle]=!0,{value:t}}return{errors:r("array.base")}}if(t.$_getRule("items")||t.$_terms.externals)return{value:e.slice()}},rules:{has:{method(e){e=this.$_compile(e,{appendPath:!0});const t=this.$_addRule({name:"has",args:{schema:e}});return t.$_mutateRegister(e),t},validate(e,{state:t,prefs:r,error:s},{schema:n}){const a=[e,...t.ancestors];for(let s=0;s<e.length;++s){const o=t.localize([...t.path,s],a,n);if(n.$_match(e[s],o,r))return e}const o=n._flags.label;return o?s("array.hasKnown",{patternLabel:o}):s("array.hasUnknown",null)},multi:!0},items:{method(...e){i.verifyFlat(e,"items");const t=this.$_addRule("items");for(let r=0;r<e.length;++r){const s=i.tryWithPath((()=>this.$_compile(e[r])),r,{append:!0});t.$_terms.items.push(s)}return t.$_mutateRebuild()},validate(e,{schema:t,error:r,state:s,prefs:n,errorsArray:a}){const o=t.$_terms._requireds.slice(),l=t.$_terms.ordered.slice(),u=[...t.$_terms._inclusions,...o],f=!e[i.symbols.arraySingle];delete e[i.symbols.arraySingle];const m=a();let h=e.length;for(let a=0;a<h;++a){const i=e[a];let d=!1,p=!1;const g=f?a:new Number(a),y=[...s.path,g];if(!t._flags.sparse&&void 0===i){if(m.push(r("array.sparse",{key:g,path:y,pos:a,value:void 0},s.localize(y))),n.abortEarly)return m;l.shift();continue}const b=[e,...s.ancestors];for(const e of t.$_terms._exclusions)if(e.$_match(i,s.localize(y,b,e),n,{presence:"ignore"})){if(m.push(r("array.excludes",{pos:a,value:i},s.localize(y))),n.abortEarly)return m;d=!0,l.shift();break}if(d)continue;if(t.$_terms.ordered.length){if(l.length){const o=l.shift(),u=o.$_validate(i,s.localize(y,b,o),n);if(u.errors){if(m.push(...u.errors),n.abortEarly)return m}else if("strip"===o._flags.result)c.fastSplice(e,a),--a,--h;else{if(!t._flags.sparse&&void 0===u.value){if(m.push(r("array.sparse",{key:g,path:y,pos:a,value:void 0},s.localize(y))),n.abortEarly)return m;continue}e[a]=u.value}continue}if(!t.$_terms.items.length){if(m.push(r("array.orderedLength",{pos:a,limit:t.$_terms.ordered.length})),n.abortEarly)return m;break}}const v=[];let _=o.length;for(let l=0;l<_;++l){const u=s.localize(y,b,o[l]);u.snapshot();const f=o[l].$_validate(i,u,n);if(v[l]=f,!f.errors){if(e[a]=f.value,p=!0,c.fastSplice(o,l),--l,--_,!t._flags.sparse&&void 0===f.value&&(m.push(r("array.sparse",{key:g,path:y,pos:a,value:void 0},s.localize(y))),n.abortEarly))return m;break}u.restore()}if(p)continue;const w=n.stripUnknown&&!!n.stripUnknown.arrays||!1;_=u.length;for(const l of u){let u;const f=o.indexOf(l);if(-1!==f)u=v[f];else{const o=s.localize(y,b,l);if(o.snapshot(),u=l.$_validate(i,o,n),!u.errors){"strip"===l._flags.result?(c.fastSplice(e,a),--a,--h):t._flags.sparse||void 0!==u.value?e[a]=u.value:(m.push(r("array.sparse",{key:g,path:y,pos:a,value:void 0},s.localize(y))),d=!0),p=!0;break}o.restore()}if(1===_){if(w){c.fastSplice(e,a),--a,--h,p=!0;break}if(m.push(...u.errors),n.abortEarly)return m;d=!0;break}}if(!d&&(t.$_terms._inclusions.length||t.$_terms._requireds.length)&&!p){if(w){c.fastSplice(e,a),--a,--h;continue}if(m.push(r("array.includes",{pos:a,value:i},s.localize(y))),n.abortEarly)return m}}return o.length&&c.fillMissedErrors(t,m,o,e,s,n),l.length&&(c.fillOrderedErrors(t,m,l,e,s,n),m.length||c.fillDefault(l,e,s,n)),m.length?m:e},priority:!0,manifest:!1},length:{method(e){return this.$_addRule({name:"length",args:{limit:e},operator:"="})},validate:(e,t,{limit:r},{name:s,operator:n,args:a})=>i.compare(e.length,r,n)?e:t.error("array."+s,{limit:a.limit,value:e}),args:[{name:"limit",ref:!0,assert:i.limit,message:"must be a positive integer"}]},max:{method(e){return this.$_addRule({name:"max",method:"length",args:{limit:e},operator:"<="})}},min:{method(e){return this.$_addRule({name:"min",method:"length",args:{limit:e},operator:">="})}},ordered:{method(...e){i.verifyFlat(e,"ordered");const t=this.$_addRule("items");for(let r=0;r<e.length;++r){const s=i.tryWithPath((()=>this.$_compile(e[r])),r,{append:!0});c.validateSingle(s,t),t.$_mutateRegister(s),t.$_terms.ordered.push(s)}return t.$_mutateRebuild()}},single:{method(e){const t=void 0===e||!!e;return s(!t||!this._flags._arrayItems,"Cannot specify single rule when array has array items"),this.$_setFlag("single",t)}},sort:{method(e={}){i.assertOptions(e,["by","order"]);const t={order:e.order||"ascending"};return e.by&&(t.by=l.ref(e.by,{ancestor:0}),s(!t.by.ancestor,"Cannot sort by ancestor")),this.$_addRule({name:"sort",args:{options:t}})},validate(e,{error:t,state:r,prefs:s,schema:n},{options:a}){const{value:o,errors:i}=c.sort(n,e,a,r,s);if(i)return i;for(let r=0;r<e.length;++r)if(e[r]!==o[r])return t("array.sort",{order:a.order,by:a.by?a.by.key:"value"});return e},convert:!0},sparse:{method(e){const t=void 0===e||!!e;return this._flags.sparse===t?this:(t?this.clone():this.$_addRule("items")).$_setFlag("sparse",t,{clone:!1})}},unique:{method(e,t={}){s(!e||"function"==typeof e||"string"==typeof e,"comparator must be a function or a string"),i.assertOptions(t,["ignoreUndefined","separator"]);const r={name:"unique",args:{options:t,comparator:e}};if(e)if("string"==typeof e){const s=i.default(t.separator,".");r.path=s?e.split(s):[e]}else r.comparator=e;return this.$_addRule(r)},validate(e,{state:t,error:r,schema:o},{comparator:i,options:l},{comparator:c,path:u}){const f={string:Object.create(null),number:Object.create(null),undefined:Object.create(null),boolean:Object.create(null),object:new Map,function:new Map,custom:new Map},m=c||n,h=l.ignoreUndefined;for(let n=0;n<e.length;++n){const o=u?a(e[n],u):e[n],l=c?f.custom:f[typeof o];if(s(l,"Failed to find unique map container for type",typeof o),l instanceof Map){const s=l.entries();let a;for(;!(a=s.next()).done;)if(m(a.value[0],o)){const s=t.localize([...t.path,n],[e,...t.ancestors]),o={pos:n,value:e[n],dupePos:a.value[1],dupeValue:e[a.value[1]]};return u&&(o.path=i),r("array.unique",o,s)}l.set(o,n)}else{if((!h||void 0!==o)&&void 0!==l[o]){const s={pos:n,value:e[n],dupePos:l[o],dupeValue:e[l[o]]};return u&&(s.path=i),r("array.unique",s,t.localize([...t.path,n],[e,...t.ancestors]))}l[o]=n}}return e},args:["comparator","options"],multi:!0}},cast:{set:{from:Array.isArray,to:(e,t)=>new Set(e)}},rebuild(e){e.$_terms._inclusions=[],e.$_terms._exclusions=[],e.$_terms._requireds=[];for(const t of e.$_terms.items)c.validateSingle(t,e),"required"===t._flags.presence?e.$_terms._requireds.push(t):"forbidden"===t._flags.presence?e.$_terms._exclusions.push(t):e.$_terms._inclusions.push(t);for(const t of e.$_terms.ordered)c.validateSingle(t,e)},manifest:{build:(e,t)=>(t.items&&(e=e.items(...t.items)),t.ordered&&(e=e.ordered(...t.ordered)),e)},messages:{"array.base":"{{#label}} must be an array","array.excludes":"{{#label}} contains an excluded value","array.hasKnown":"{{#label}} does not contain at least one required match for type {:#patternLabel}","array.hasUnknown":"{{#label}} does not contain at least one required match","array.includes":"{{#label}} does not match any of the allowed types","array.includesRequiredBoth":"{{#label}} does not contain {{#knownMisses}} and {{#unknownMisses}} other required value(s)","array.includesRequiredKnowns":"{{#label}} does not contain {{#knownMisses}}","array.includesRequiredUnknowns":"{{#label}} does not contain {{#unknownMisses}} required value(s)","array.length":"{{#label}} must contain {{#limit}} items","array.max":"{{#label}} must contain less than or equal to {{#limit}} items","array.min":"{{#label}} must contain at least {{#limit}} items","array.orderedLength":"{{#label}} must contain at most {{#limit}} items","array.sort":"{{#label}} must be sorted in {#order} order by {{#by}}","array.sort.mismatching":"{{#label}} cannot be sorted due to mismatching types","array.sort.unsupported":"{{#label}} cannot be sorted due to unsupported type {#type}","array.sparse":"{{#label}} must not be a sparse array item","array.unique":"{{#label}} contains a duplicate value"}}),c.fillMissedErrors=function(e,t,r,s,n,a){const o=[];let i=0;for(const e of r){const t=e._flags.label;t?o.push(t):++i}o.length?i?t.push(e.$_createError("array.includesRequiredBoth",s,{knownMisses:o,unknownMisses:i},n,a)):t.push(e.$_createError("array.includesRequiredKnowns",s,{knownMisses:o},n,a)):t.push(e.$_createError("array.includesRequiredUnknowns",s,{unknownMisses:i},n,a))},c.fillOrderedErrors=function(e,t,r,s,n,a){const o=[];for(const e of r)"required"===e._flags.presence&&o.push(e);o.length&&c.fillMissedErrors(e,t,o,s,n,a)},c.fillDefault=function(e,t,r,s){const n=[];let a=!0;for(let o=e.length-1;o>=0;--o){const i=e[o],l=[t,...r.ancestors],c=i.$_validate(void 0,r.localize(r.path,l,i),s).value;if(a){if(void 0===c)continue;a=!1}n.unshift(c)}n.length&&t.push(...n)},c.fastSplice=function(e,t){let r=t;for(;r<e.length;)e[r++]=e[r];--e.length},c.validateSingle=function(e,t){("array"===e.type||e._flags._arrayItems)&&(s(!t._flags.single,"Cannot specify array item with single rule enabled"),t.$_setFlag("_arrayItems",!0,{clone:!1}))},c.sort=function(e,t,r,s,n){const a="ascending"===r.order?1:-1,o=-1*a,i=a,l=(l,u)=>{let f=c.compare(l,u,o,i);if(null!==f)return f;if(r.by&&(l=r.by.resolve(l,s,n),u=r.by.resolve(u,s,n)),f=c.compare(l,u,o,i),null!==f)return f;const m=typeof l;if(m!==typeof u)throw e.$_createError("array.sort.mismatching",t,null,s,n);if("number"!==m&&"string"!==m)throw e.$_createError("array.sort.unsupported",t,{type:m},s,n);return"number"===m?(l-u)*a:l<u?o:i};try{return{value:t.slice().sort(l)}}catch(e){return{errors:e}}},c.compare=function(e,t,r,s){return e===t?0:void 0===e?1:void 0===t?-1:null===e?s:null===t?r:null}},4937:(e,t,r)=>{"use strict";const s=r(375),n=r(8068),a=r(8160),o=r(2036),i={isBool:function(e){return"boolean"==typeof e}};e.exports=n.extend({type:"boolean",flags:{sensitive:{default:!1}},terms:{falsy:{init:null,manifest:"values"},truthy:{init:null,manifest:"values"}},coerce(e,{schema:t}){if("boolean"!=typeof e){if("string"==typeof e){const r=t._flags.sensitive?e:e.toLowerCase();e="true"===r||"false"!==r&&e}return"boolean"!=typeof e&&(e=t.$_terms.truthy&&t.$_terms.truthy.has(e,null,null,!t._flags.sensitive)||(!t.$_terms.falsy||!t.$_terms.falsy.has(e,null,null,!t._flags.sensitive))&&e),{value:e}}},validate(e,{error:t}){if("boolean"!=typeof e)return{value:e,errors:t("boolean.base")}},rules:{truthy:{method(...e){a.verifyFlat(e,"truthy");const t=this.clone();t.$_terms.truthy=t.$_terms.truthy||new o;for(let r=0;r<e.length;++r){const n=e[r];s(void 0!==n,"Cannot call truthy with undefined"),t.$_terms.truthy.add(n)}return t}},falsy:{method(...e){a.verifyFlat(e,"falsy");const t=this.clone();t.$_terms.falsy=t.$_terms.falsy||new o;for(let r=0;r<e.length;++r){const n=e[r];s(void 0!==n,"Cannot call falsy with undefined"),t.$_terms.falsy.add(n)}return t}},sensitive:{method(e=!0){return this.$_setFlag("sensitive",e)}}},cast:{number:{from:i.isBool,to:(e,t)=>e?1:0},string:{from:i.isBool,to:(e,t)=>e?"true":"false"}},manifest:{build:(e,t)=>(t.truthy&&(e=e.truthy(...t.truthy)),t.falsy&&(e=e.falsy(...t.falsy)),e)},messages:{"boolean.base":"{{#label}} must be a boolean"}})},7500:(e,t,r)=>{"use strict";const s=r(375),n=r(8068),a=r(8160),o=r(3328),i={isDate:function(e){return e instanceof Date}};e.exports=n.extend({type:"date",coerce:{from:["number","string"],method:(e,{schema:t})=>({value:i.parse(e,t._flags.format)||e})},validate(e,{schema:t,error:r,prefs:s}){if(e instanceof Date&&!isNaN(e.getTime()))return;const n=t._flags.format;return s.convert&&n&&"string"==typeof e?{value:e,errors:r("date.format",{format:n})}:{value:e,errors:r("date.base")}},rules:{compare:{method:!1,validate(e,t,{date:r},{name:s,operator:n,args:o}){const i="now"===r?Date.now():r.getTime();return a.compare(e.getTime(),i,n)?e:t.error("date."+s,{limit:o.date,value:e})},args:[{name:"date",ref:!0,normalize:e=>"now"===e?e:i.parse(e),assert:e=>null!==e,message:"must have a valid date format"}]},format:{method(e){return s(["iso","javascript","unix"].includes(e),"Unknown date format",e),this.$_setFlag("format",e)}},greater:{method(e){return this.$_addRule({name:"greater",method:"compare",args:{date:e},operator:">"})}},iso:{method(){return this.format("iso")}},less:{method(e){return this.$_addRule({name:"less",method:"compare",args:{date:e},operator:"<"})}},max:{method(e){return this.$_addRule({name:"max",method:"compare",args:{date:e},operator:"<="})}},min:{method(e){return this.$_addRule({name:"min",method:"compare",args:{date:e},operator:">="})}},timestamp:{method(e="javascript"){return s(["javascript","unix"].includes(e),'"type" must be one of "javascript, unix"'),this.format(e)}}},cast:{number:{from:i.isDate,to:(e,t)=>e.getTime()},string:{from:i.isDate,to:(e,{prefs:t})=>o.date(e,t)}},messages:{"date.base":"{{#label}} must be a valid date","date.format":'{{#label}} must be in {msg("date.format." + #format) || #format} format',"date.greater":"{{#label}} must be greater than {{:#limit}}","date.less":"{{#label}} must be less than {{:#limit}}","date.max":"{{#label}} must be less than or equal to {{:#limit}}","date.min":"{{#label}} must be greater than or equal to {{:#limit}}","date.format.iso":"ISO 8601 date","date.format.javascript":"timestamp or number of milliseconds","date.format.unix":"timestamp or number of seconds"}}),i.parse=function(e,t){if(e instanceof Date)return e;if("string"!=typeof e&&(isNaN(e)||!isFinite(e)))return null;if(/^\s*$/.test(e))return null;if("iso"===t)return a.isIsoDate(e)?i.date(e.toString()):null;const r=e;if("string"==typeof e&&/^[+-]?\d+(\.\d+)?$/.test(e)&&(e=parseFloat(e)),t){if("javascript"===t)return i.date(1*e);if("unix"===t)return i.date(1e3*e);if("string"==typeof r)return null}return i.date(e)},i.date=function(e){const t=new Date(e);return isNaN(t.getTime())?null:t}},390:(e,t,r)=>{"use strict";const s=r(375),n=r(7824);e.exports=n.extend({type:"function",properties:{typeof:"function"},rules:{arity:{method(e){return s(Number.isSafeInteger(e)&&e>=0,"n must be a positive integer"),this.$_addRule({name:"arity",args:{n:e}})},validate:(e,t,{n:r})=>e.length===r?e:t.error("function.arity",{n:r})},class:{method(){return this.$_addRule("class")},validate:(e,t)=>/^\s*class\s/.test(e.toString())?e:t.error("function.class",{value:e})},minArity:{method(e){return s(Number.isSafeInteger(e)&&e>0,"n must be a strict positive integer"),this.$_addRule({name:"minArity",args:{n:e}})},validate:(e,t,{n:r})=>e.length>=r?e:t.error("function.minArity",{n:r})},maxArity:{method(e){return s(Number.isSafeInteger(e)&&e>=0,"n must be a positive integer"),this.$_addRule({name:"maxArity",args:{n:e}})},validate:(e,t,{n:r})=>e.length<=r?e:t.error("function.maxArity",{n:r})}},messages:{"function.arity":"{{#label}} must have an arity of {{#n}}","function.class":"{{#label}} must be a class","function.maxArity":"{{#label}} must have an arity lesser or equal to {{#n}}","function.minArity":"{{#label}} must have an arity greater or equal to {{#n}}"}})},7824:(e,t,r)=>{"use strict";const s=r(978),n=r(375),a=r(8571),o=r(3652),i=r(8068),l=r(8160),c=r(3292),u=r(6354),f=r(6133),m=r(3328),h={renameDefaults:{alias:!1,multiple:!1,override:!1}};e.exports=i.extend({type:"_keys",properties:{typeof:"object"},flags:{unknown:{default:!1}},terms:{dependencies:{init:null},keys:{init:null,manifest:{mapped:{from:"schema",to:"key"}}},patterns:{init:null},renames:{init:null}},args:(e,t)=>e.keys(t),validate(e,{schema:t,error:r,state:s,prefs:n}){if(!e||typeof e!==t.$_property("typeof")||Array.isArray(e))return{value:e,errors:r("object.base",{type:t.$_property("typeof")})};if(!(t.$_terms.renames||t.$_terms.dependencies||t.$_terms.keys||t.$_terms.patterns||t.$_terms.externals))return;e=h.clone(e,n);const a=[];if(t.$_terms.renames&&!h.rename(t,e,s,n,a))return{value:e,errors:a};if(!t.$_terms.keys&&!t.$_terms.patterns&&!t.$_terms.dependencies)return{value:e,errors:a};const o=new Set(Object.keys(e));if(t.$_terms.keys){const r=[e,...s.ancestors];for(const i of t.$_terms.keys){const t=i.key,l=e[t];o.delete(t);const c=s.localize([...s.path,t],r,i),u=i.schema.$_validate(l,c,n);if(u.errors){if(n.abortEarly)return{value:e,errors:u.errors};void 0!==u.value&&(e[t]=u.value),a.push(...u.errors)}else"strip"===i.schema._flags.result||void 0===u.value&&void 0!==l?delete e[t]:void 0!==u.value&&(e[t]=u.value)}}if(o.size||t._flags._hasPatternMatch){const r=h.unknown(t,e,o,a,s,n);if(r)return r}if(t.$_terms.dependencies)for(const r of t.$_terms.dependencies){if(r.key&&void 0===r.key.resolve(e,s,n,null,{shadow:!1}))continue;const o=h.dependencies[r.rel](t,r,e,s,n);if(o){const r=t.$_createError(o.code,e,o.context,s,n);if(n.abortEarly)return{value:e,errors:r};a.push(r)}}return{value:e,errors:a}},rules:{and:{method(...e){return l.verifyFlat(e,"and"),h.dependency(this,"and",null,e)}},append:{method(e){return null==e||0===Object.keys(e).length?this:this.keys(e)}},assert:{method(e,t,r){m.isTemplate(e)||(e=c.ref(e)),n(void 0===r||"string"==typeof r,"Message must be a string"),t=this.$_compile(t,{appendPath:!0});const s=this.$_addRule({name:"assert",args:{subject:e,schema:t,message:r}});return s.$_mutateRegister(e),s.$_mutateRegister(t),s},validate(e,{error:t,prefs:r,state:s},{subject:n,schema:a,message:o}){const i=n.resolve(e,s,r),l=f.isRef(n)?n.absolute(s):[];return a.$_match(i,s.localize(l,[e,...s.ancestors],a),r)?e:t("object.assert",{subject:n,message:o})},args:["subject","schema","message"],multi:!0},instance:{method(e,t){return n("function"==typeof e,"constructor must be a function"),t=t||e.name,this.$_addRule({name:"instance",args:{constructor:e,name:t}})},validate:(e,t,{constructor:r,name:s})=>e instanceof r?e:t.error("object.instance",{type:s,value:e}),args:["constructor","name"]},keys:{method(e){n(void 0===e||"object"==typeof e,"Object schema must be a valid object"),n(!l.isSchema(e),"Object schema cannot be a joi schema");const t=this.clone();if(e)if(Object.keys(e).length){t.$_terms.keys=t.$_terms.keys?t.$_terms.keys.filter((t=>!e.hasOwnProperty(t.key))):new h.Keys;for(const r in e)l.tryWithPath((()=>t.$_terms.keys.push({key:r,schema:this.$_compile(e[r])})),r)}else t.$_terms.keys=new h.Keys;else t.$_terms.keys=null;return t.$_mutateRebuild()}},length:{method(e){return this.$_addRule({name:"length",args:{limit:e},operator:"="})},validate:(e,t,{limit:r},{name:s,operator:n,args:a})=>l.compare(Object.keys(e).length,r,n)?e:t.error("object."+s,{limit:a.limit,value:e}),args:[{name:"limit",ref:!0,assert:l.limit,message:"must be a positive integer"}]},max:{method(e){return this.$_addRule({name:"max",method:"length",args:{limit:e},operator:"<="})}},min:{method(e){return this.$_addRule({name:"min",method:"length",args:{limit:e},operator:">="})}},nand:{method(...e){return l.verifyFlat(e,"nand"),h.dependency(this,"nand",null,e)}},or:{method(...e){return l.verifyFlat(e,"or"),h.dependency(this,"or",null,e)}},oxor:{method(...e){return h.dependency(this,"oxor",null,e)}},pattern:{method(e,t,r={}){const s=e instanceof RegExp;s||(e=this.$_compile(e,{appendPath:!0})),n(void 0!==t,"Invalid rule"),l.assertOptions(r,["fallthrough","matches"]),s&&n(!e.flags.includes("g")&&!e.flags.includes("y"),"pattern should not use global or sticky mode"),t=this.$_compile(t,{appendPath:!0});const a=this.clone();a.$_terms.patterns=a.$_terms.patterns||[];const o={[s?"regex":"schema"]:e,rule:t};return r.matches&&(o.matches=this.$_compile(r.matches),"array"!==o.matches.type&&(o.matches=o.matches.$_root.array().items(o.matches)),a.$_mutateRegister(o.matches),a.$_setFlag("_hasPatternMatch",!0,{clone:!1})),r.fallthrough&&(o.fallthrough=!0),a.$_terms.patterns.push(o),a.$_mutateRegister(t),a}},ref:{method(){return this.$_addRule("ref")},validate:(e,t)=>f.isRef(e)?e:t.error("object.refType",{value:e})},regex:{method(){return this.$_addRule("regex")},validate:(e,t)=>e instanceof RegExp?e:t.error("object.regex",{value:e})},rename:{method(e,t,r={}){n("string"==typeof e||e instanceof RegExp,"Rename missing the from argument"),n("string"==typeof t||t instanceof m,"Invalid rename to argument"),n(t!==e,"Cannot rename key to same name:",e),l.assertOptions(r,["alias","ignoreUndefined","override","multiple"]);const a=this.clone();a.$_terms.renames=a.$_terms.renames||[];for(const t of a.$_terms.renames)n(t.from!==e,"Cannot rename the same key multiple times");return t instanceof m&&a.$_mutateRegister(t),a.$_terms.renames.push({from:e,to:t,options:s(h.renameDefaults,r)}),a}},schema:{method(e="any"){return this.$_addRule({name:"schema",args:{type:e}})},validate:(e,t,{type:r})=>!l.isSchema(e)||"any"!==r&&e.type!==r?t.error("object.schema",{type:r}):e},unknown:{method(e){return this.$_setFlag("unknown",!1!==e)}},with:{method(e,t,r={}){return h.dependency(this,"with",e,t,r)}},without:{method(e,t,r={}){return h.dependency(this,"without",e,t,r)}},xor:{method(...e){return l.verifyFlat(e,"xor"),h.dependency(this,"xor",null,e)}}},overrides:{default(e,t){return void 0===e&&(e=l.symbols.deepDefault),this.$_parent("default",e,t)}},rebuild(e){if(e.$_terms.keys){const t=new o.Sorter;for(const r of e.$_terms.keys)l.tryWithPath((()=>t.add(r,{after:r.schema.$_rootReferences(),group:r.key})),r.key);e.$_terms.keys=new h.Keys(...t.nodes)}},manifest:{build(e,t){if(t.keys&&(e=e.keys(t.keys)),t.dependencies)for(const{rel:r,key:s=null,peers:n,options:a}of t.dependencies)e=h.dependency(e,r,s,n,a);if(t.patterns)for(const{regex:r,schema:s,rule:n,fallthrough:a,matches:o}of t.patterns)e=e.pattern(r||s,n,{fallthrough:a,matches:o});if(t.renames)for(const{from:r,to:s,options:n}of t.renames)e=e.rename(r,s,n);return e}},messages:{"object.and":"{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}","object.assert":'{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}',"object.base":"{{#label}} must be of type {{#type}}","object.instance":"{{#label}} must be an instance of {{:#type}}","object.length":'{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}',"object.max":'{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}',"object.min":'{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}',"object.missing":"{{#label}} must contain at least one of {{#peersWithLabels}}","object.nand":"{{:#mainWithLabel}} must not exist simultaneously with {{#peersWithLabels}}","object.oxor":"{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}","object.pattern.match":"{{#label}} keys failed to match pattern requirements","object.refType":"{{#label}} must be a Joi reference","object.regex":"{{#label}} must be a RegExp object","object.rename.multiple":"{{#label}} cannot rename {{:#from}} because multiple renames are disabled and another key was already renamed to {{:#to}}","object.rename.override":"{{#label}} cannot rename {{:#from}} because override is disabled and target {{:#to}} exists","object.schema":"{{#label}} must be a Joi schema of {{#type}} type","object.unknown":"{{#label}} is not allowed","object.with":"{{:#mainWithLabel}} missing required peer {{:#peerWithLabel}}","object.without":"{{:#mainWithLabel}} conflict with forbidden peer {{:#peerWithLabel}}","object.xor":"{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}"}}),h.clone=function(e,t){if("object"==typeof e){if(t.nonEnumerables)return a(e,{shallow:!0});const r=Object.create(Object.getPrototypeOf(e));return Object.assign(r,e),r}const r=function(...t){return e.apply(this,t)};return r.prototype=a(e.prototype),Object.defineProperty(r,"name",{value:e.name,writable:!1}),Object.defineProperty(r,"length",{value:e.length,writable:!1}),Object.assign(r,e),r},h.dependency=function(e,t,r,s,a){n(null===r||"string"==typeof r,t,"key must be a strings"),a||(a=s.length>1&&"object"==typeof s[s.length-1]?s.pop():{}),l.assertOptions(a,["separator"]),s=[].concat(s);const o=l.default(a.separator,"."),i=[];for(const e of s)n("string"==typeof e,t,"peers must be strings"),i.push(c.ref(e,{separator:o,ancestor:0,prefix:!1}));null!==r&&(r=c.ref(r,{separator:o,ancestor:0,prefix:!1}));const u=e.clone();return u.$_terms.dependencies=u.$_terms.dependencies||[],u.$_terms.dependencies.push(new h.Dependency(t,r,i,s)),u},h.dependencies={and(e,t,r,s,n){const a=[],o=[],i=t.peers.length;for(const e of t.peers)void 0===e.resolve(r,s,n,null,{shadow:!1})?a.push(e.key):o.push(e.key);if(a.length!==i&&o.length!==i)return{code:"object.and",context:{present:o,presentWithLabels:h.keysToLabels(e,o),missing:a,missingWithLabels:h.keysToLabels(e,a)}}},nand(e,t,r,s,n){const a=[];for(const e of t.peers)void 0!==e.resolve(r,s,n,null,{shadow:!1})&&a.push(e.key);if(a.length!==t.peers.length)return;const o=t.paths[0],i=t.paths.slice(1);return{code:"object.nand",context:{main:o,mainWithLabel:h.keysToLabels(e,o),peers:i,peersWithLabels:h.keysToLabels(e,i)}}},or(e,t,r,s,n){for(const e of t.peers)if(void 0!==e.resolve(r,s,n,null,{shadow:!1}))return;return{code:"object.missing",context:{peers:t.paths,peersWithLabels:h.keysToLabels(e,t.paths)}}},oxor(e,t,r,s,n){const a=[];for(const e of t.peers)void 0!==e.resolve(r,s,n,null,{shadow:!1})&&a.push(e.key);if(!a.length||1===a.length)return;const o={peers:t.paths,peersWithLabels:h.keysToLabels(e,t.paths)};return o.present=a,o.presentWithLabels=h.keysToLabels(e,a),{code:"object.oxor",context:o}},with(e,t,r,s,n){for(const a of t.peers)if(void 0===a.resolve(r,s,n,null,{shadow:!1}))return{code:"object.with",context:{main:t.key.key,mainWithLabel:h.keysToLabels(e,t.key.key),peer:a.key,peerWithLabel:h.keysToLabels(e,a.key)}}},without(e,t,r,s,n){for(const a of t.peers)if(void 0!==a.resolve(r,s,n,null,{shadow:!1}))return{code:"object.without",context:{main:t.key.key,mainWithLabel:h.keysToLabels(e,t.key.key),peer:a.key,peerWithLabel:h.keysToLabels(e,a.key)}}},xor(e,t,r,s,n){const a=[];for(const e of t.peers)void 0!==e.resolve(r,s,n,null,{shadow:!1})&&a.push(e.key);if(1===a.length)return;const o={peers:t.paths,peersWithLabels:h.keysToLabels(e,t.paths)};return 0===a.length?{code:"object.missing",context:o}:(o.present=a,o.presentWithLabels=h.keysToLabels(e,a),{code:"object.xor",context:o})}},h.keysToLabels=function(e,t){return Array.isArray(t)?t.map((t=>e.$_mapLabels(t))):e.$_mapLabels(t)},h.rename=function(e,t,r,s,n){const a={};for(const o of e.$_terms.renames){const i=[],l="string"!=typeof o.from;if(l)for(const e in t){if(void 0===t[e]&&o.options.ignoreUndefined)continue;if(e===o.to)continue;const r=o.from.exec(e);r&&i.push({from:e,to:o.to,match:r})}else!Object.prototype.hasOwnProperty.call(t,o.from)||void 0===t[o.from]&&o.options.ignoreUndefined||i.push(o);for(const c of i){const i=c.from;let u=c.to;if(u instanceof m&&(u=u.render(t,r,s,c.match)),i!==u){if(!o.options.multiple&&a[u]&&(n.push(e.$_createError("object.rename.multiple",t,{from:i,to:u,pattern:l},r,s)),s.abortEarly))return!1;if(Object.prototype.hasOwnProperty.call(t,u)&&!o.options.override&&!a[u]&&(n.push(e.$_createError("object.rename.override",t,{from:i,to:u,pattern:l},r,s)),s.abortEarly))return!1;void 0===t[i]?delete t[u]:t[u]=t[i],a[u]=!0,o.options.alias||delete t[i]}}}return!0},h.unknown=function(e,t,r,s,n,a){if(e.$_terms.patterns){let o=!1;const i=e.$_terms.patterns.map((e=>{if(e.matches)return o=!0,[]})),l=[t,...n.ancestors];for(const o of r){const c=t[o],u=[...n.path,o];for(let f=0;f<e.$_terms.patterns.length;++f){const m=e.$_terms.patterns[f];if(m.regex){const e=m.regex.test(o);if(n.mainstay.tracer.debug(n,"rule","pattern.".concat(f),e?"pass":"error"),!e)continue}else if(!m.schema.$_match(o,n.nest(m.schema,"pattern.".concat(f)),a))continue;r.delete(o);const h=n.localize(u,l,{schema:m.rule,key:o}),d=m.rule.$_validate(c,h,a);if(d.errors){if(a.abortEarly)return{value:t,errors:d.errors};s.push(...d.errors)}if(m.matches&&i[f].push(o),t[o]=d.value,!m.fallthrough)break}}if(o)for(let r=0;r<i.length;++r){const o=i[r];if(!o)continue;const c=e.$_terms.patterns[r].matches,f=n.localize(n.path,l,c),m=c.$_validate(o,f,a);if(m.errors){const r=u.details(m.errors,{override:!1});r.matches=o;const i=e.$_createError("object.pattern.match",t,r,n,a);if(a.abortEarly)return{value:t,errors:i};s.push(i)}}}if(r.size&&(e.$_terms.keys||e.$_terms.patterns)){if(a.stripUnknown&&!e._flags.unknown||a.skipFunctions){const e=!(!a.stripUnknown||!0!==a.stripUnknown&&!a.stripUnknown.objects);for(const s of r)e?(delete t[s],r.delete(s)):"function"==typeof t[s]&&r.delete(s)}if(!l.default(e._flags.unknown,a.allowUnknown))for(const o of r){const r=n.localize([...n.path,o],[]),i=e.$_createError("object.unknown",t[o],{child:o},r,a,{flags:!1});if(a.abortEarly)return{value:t,errors:i};s.push(i)}}},h.Dependency=class{constructor(e,t,r,s){this.rel=e,this.key=t,this.peers=r,this.paths=s}describe(){const e={rel:this.rel,peers:this.paths};return null!==this.key&&(e.key=this.key.key),"."!==this.peers[0].separator&&(e.options={separator:this.peers[0].separator}),e}},h.Keys=class extends Array{concat(e){const t=this.slice(),r=new Map;for(let e=0;e<t.length;++e)r.set(t[e].key,e);for(const s of e){const e=s.key,n=r.get(e);void 0!==n?t[n]={key:e,schema:t[n].schema.concat(s.schema)}:t.push(s)}return t}}},8785:(e,t,r)=>{"use strict";const s=r(375),n=r(8068),a=r(8160),o=r(3292),i=r(6354),l={};e.exports=n.extend({type:"link",properties:{schemaChain:!0},terms:{link:{init:null,manifest:"single",register:!1}},args:(e,t)=>e.ref(t),validate(e,{schema:t,state:r,prefs:n}){s(t.$_terms.link,"Uninitialized link schema");const a=l.generate(t,e,r,n),o=t.$_terms.link[0].ref;return a.$_validate(e,r.nest(a,"link:".concat(o.display,":").concat(a.type)),n)},generate:(e,t,r,s)=>l.generate(e,t,r,s),rules:{ref:{method(e){s(!this.$_terms.link,"Cannot reinitialize schema"),e=o.ref(e),s("value"===e.type||"local"===e.type,"Invalid reference type:",e.type),s("local"===e.type||"root"===e.ancestor||e.ancestor>0,"Link cannot reference itself");const t=this.clone();return t.$_terms.link=[{ref:e}],t}},relative:{method(e=!0){return this.$_setFlag("relative",e)}}},overrides:{concat(e){s(this.$_terms.link,"Uninitialized link schema"),s(a.isSchema(e),"Invalid schema object"),s("link"!==e.type,"Cannot merge type link with another link");const t=this.clone();return t.$_terms.whens||(t.$_terms.whens=[]),t.$_terms.whens.push({concat:e}),t.$_mutateRebuild()}},manifest:{build:(e,t)=>(s(t.link,"Invalid link description missing link"),e.ref(t.link))}}),l.generate=function(e,t,r,s){let n=r.mainstay.links.get(e);if(n)return n._generate(t,r,s).schema;const a=e.$_terms.link[0].ref,{perspective:o,path:i}=l.perspective(a,r);l.assert(o,"which is outside of schema boundaries",a,e,r,s);try{n=i.length?o.$_reach(i):o}catch(t){l.assert(!1,"to non-existing schema",a,e,r,s)}return l.assert("link"!==n.type,"which is another link",a,e,r,s),e._flags.relative||r.mainstay.links.set(e,n),n._generate(t,r,s).schema},l.perspective=function(e,t){if("local"===e.type){for(const{schema:r,key:s}of t.schemas){if((r._flags.id||s)===e.path[0])return{perspective:r,path:e.path.slice(1)};if(r.$_terms.shared)for(const t of r.$_terms.shared)if(t._flags.id===e.path[0])return{perspective:t,path:e.path.slice(1)}}return{perspective:null,path:null}}return"root"===e.ancestor?{perspective:t.schemas[t.schemas.length-1].schema,path:e.path}:{perspective:t.schemas[e.ancestor]&&t.schemas[e.ancestor].schema,path:e.path}},l.assert=function(e,t,r,n,a,o){e||s(!1,'"'.concat(i.label(n._flags,a,o),'" contains link reference "').concat(r.display,'" ').concat(t))}},3832:(e,t,r)=>{"use strict";const s=r(375),n=r(8068),a=r(8160),o={numberRx:/^\s*[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e([+-]?\d+))?\s*$/i,precisionRx:/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/};e.exports=n.extend({type:"number",flags:{unsafe:{default:!1}},coerce:{from:"string",method(e,{schema:t,error:r}){const s=e.match(o.numberRx);if(!s)return;e=e.trim();const n={value:parseFloat(e)};if(0===n.value&&(n.value=0),!t._flags.unsafe)if(e.match(/e/i)){if(o.normalizeExponent("".concat(n.value/Math.pow(10,s[1]),"e").concat(s[1]))!==o.normalizeExponent(e))return n.errors=r("number.unsafe"),n}else{const t=n.value.toString();if(t.match(/e/i))return n;if(t!==o.normalizeDecimal(e))return n.errors=r("number.unsafe"),n}return n}},validate(e,{schema:t,error:r,prefs:s}){if(e===1/0||e===-1/0)return{value:e,errors:r("number.infinity")};if(!a.isNumber(e))return{value:e,errors:r("number.base")};const n={value:e};if(s.convert){const e=t.$_getRule("precision");if(e){const t=Math.pow(10,e.args.limit);n.value=Math.round(n.value*t)/t}}return 0===n.value&&(n.value=0),!t._flags.unsafe&&(e>Number.MAX_SAFE_INTEGER||e<Number.MIN_SAFE_INTEGER)&&(n.errors=r("number.unsafe")),n},rules:{compare:{method:!1,validate:(e,t,{limit:r},{name:s,operator:n,args:o})=>a.compare(e,r,n)?e:t.error("number."+s,{limit:o.limit,value:e}),args:[{name:"limit",ref:!0,assert:a.isNumber,message:"must be a number"}]},greater:{method(e){return this.$_addRule({name:"greater",method:"compare",args:{limit:e},operator:">"})}},integer:{method(){return this.$_addRule("integer")},validate:(e,t)=>Math.trunc(e)-e==0?e:t.error("number.integer")},less:{method(e){return this.$_addRule({name:"less",method:"compare",args:{limit:e},operator:"<"})}},max:{method(e){return this.$_addRule({name:"max",method:"compare",args:{limit:e},operator:"<="})}},min:{method(e){return this.$_addRule({name:"min",method:"compare",args:{limit:e},operator:">="})}},multiple:{method(e){return this.$_addRule({name:"multiple",args:{base:e}})},validate:(e,t,{base:r},s)=>e*(1/r)%1==0?e:t.error("number.multiple",{multiple:s.args.base,value:e}),args:[{name:"base",ref:!0,assert:e=>"number"==typeof e&&isFinite(e)&&e>0,message:"must be a positive number"}],multi:!0},negative:{method(){return this.sign("negative")}},port:{method(){return this.$_addRule("port")},validate:(e,t)=>Number.isSafeInteger(e)&&e>=0&&e<=65535?e:t.error("number.port")},positive:{method(){return this.sign("positive")}},precision:{method(e){return s(Number.isSafeInteger(e),"limit must be an integer"),this.$_addRule({name:"precision",args:{limit:e}})},validate(e,t,{limit:r}){const s=e.toString().match(o.precisionRx);return Math.max((s[1]?s[1].length:0)-(s[2]?parseInt(s[2],10):0),0)<=r?e:t.error("number.precision",{limit:r,value:e})},convert:!0},sign:{method(e){return s(["negative","positive"].includes(e),"Invalid sign",e),this.$_addRule({name:"sign",args:{sign:e}})},validate:(e,t,{sign:r})=>"negative"===r&&e<0||"positive"===r&&e>0?e:t.error("number.".concat(r))},unsafe:{method(e=!0){return s("boolean"==typeof e,"enabled must be a boolean"),this.$_setFlag("unsafe",e)}}},cast:{string:{from:e=>"number"==typeof e,to:(e,t)=>e.toString()}},messages:{"number.base":"{{#label}} must be a number","number.greater":"{{#label}} must be greater than {{#limit}}","number.infinity":"{{#label}} cannot be infinity","number.integer":"{{#label}} must be an integer","number.less":"{{#label}} must be less than {{#limit}}","number.max":"{{#label}} must be less than or equal to {{#limit}}","number.min":"{{#label}} must be greater than or equal to {{#limit}}","number.multiple":"{{#label}} must be a multiple of {{#multiple}}","number.negative":"{{#label}} must be a negative number","number.port":"{{#label}} must be a valid port","number.positive":"{{#label}} must be a positive number","number.precision":"{{#label}} must have no more than {{#limit}} decimal places","number.unsafe":"{{#label}} must be a safe number"}}),o.normalizeExponent=function(e){return e.replace(/E/,"e").replace(/\.(\d*[1-9])?0+e/,".$1e").replace(/\.e/,"e").replace(/e\+/,"e").replace(/^\+/,"").replace(/^(-?)0+([1-9])/,"$1$2")},o.normalizeDecimal=function(e){return(e=e.replace(/^\+/,"").replace(/\.0*$/,"").replace(/^(-?)\.([^\.]*)$/,"$10.$2").replace(/^(-?)0+([0-9])/,"$1$2")).includes(".")&&e.endsWith("0")&&(e=e.replace(/0+$/,"")),"-0"===e?"0":e}},8966:(e,t,r)=>{"use strict";const s=r(7824);e.exports=s.extend({type:"object",cast:{map:{from:e=>e&&"object"==typeof e,to:(e,t)=>new Map(Object.entries(e))}}})},7417:(e,t,r)=>{"use strict";function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function n(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const o=r(375),i=r(5380),l=r(1745),c=r(9959),u=r(6064),f=r(9926),m=r(5752),h=r(8068),d=r(8160),p={tlds:f instanceof Set&&{tlds:{allow:f,deny:null}},base64Regex:{true:{true:/^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}==|[\w\-]{3}=)?$/,false:/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/},false:{true:/^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}(==)?|[\w\-]{3}=?)?$/,false:/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/}},dataUriRegex:/^data:[\w+.-]+\/[\w+.-]+;((charset=[\w-]+|base64),)?(.*)$/,hexRegex:/^[a-f0-9]+$/i,ipRegex:c.regex({cidr:"forbidden"}).regex,isoDurationRegex:/^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/,guidBrackets:{"{":"}","[":"]","(":")","":""},guidVersions:{uuidv1:"1",uuidv2:"2",uuidv3:"3",uuidv4:"4",uuidv5:"5"},guidSeparators:new Set([void 0,!0,!1,"-",":"]),normalizationForms:["NFC","NFD","NFKC","NFKD"]};e.exports=h.extend({type:"string",flags:{insensitive:{default:!1},truncate:{default:!1}},terms:{replacements:{init:null}},coerce:{from:"string",method(e,{schema:t,state:r,prefs:s}){const n=t.$_getRule("normalize");n&&(e=e.normalize(n.args.form));const a=t.$_getRule("case");a&&(e="upper"===a.args.direction?e.toLocaleUpperCase():e.toLocaleLowerCase());const o=t.$_getRule("trim");if(o&&o.args.enabled&&(e=e.trim()),t.$_terms.replacements)for(const r of t.$_terms.replacements)e=e.replace(r.pattern,r.replacement);const i=t.$_getRule("hex");if(i&&i.args.options.byteAligned&&e.length%2!=0&&(e="0".concat(e)),t.$_getRule("isoDate")){const t=p.isoDate(e);t&&(e=t)}if(t._flags.truncate){const n=t.$_getRule("max");if(n){let a=n.args.limit;if(d.isResolvable(a)&&(a=a.resolve(e,r,s),!d.limit(a)))return{value:e,errors:t.$_createError("any.ref",a,{ref:n.args.limit,arg:"limit",reason:"must be a positive integer"},r,s)};e=e.slice(0,a)}}return{value:e}}},validate(e,{schema:t,error:r}){if("string"!=typeof e)return{value:e,errors:r("string.base")};if(""===e){const s=t.$_getRule("min");if(s&&0===s.args.limit)return;return{value:e,errors:r("string.empty")}}},rules:{alphanum:{method(){return this.$_addRule("alphanum")},validate:(e,t)=>/^[a-zA-Z0-9]+$/.test(e)?e:t.error("string.alphanum")},base64:{method(e={}){return d.assertOptions(e,["paddingRequired","urlSafe"]),e=n({urlSafe:!1,paddingRequired:!0},e),o("boolean"==typeof e.paddingRequired,"paddingRequired must be boolean"),o("boolean"==typeof e.urlSafe,"urlSafe must be boolean"),this.$_addRule({name:"base64",args:{options:e}})},validate:(e,t,{options:r})=>p.base64Regex[r.paddingRequired][r.urlSafe].test(e)?e:t.error("string.base64")},case:{method(e){return o(["lower","upper"].includes(e),"Invalid case:",e),this.$_addRule({name:"case",args:{direction:e}})},validate:(e,t,{direction:r})=>"lower"===r&&e===e.toLocaleLowerCase()||"upper"===r&&e===e.toLocaleUpperCase()?e:t.error("string.".concat(r,"case")),convert:!0},creditCard:{method(){return this.$_addRule("creditCard")},validate(e,t){let r=e.length,s=0,n=1;for(;r--;){const t=e.charAt(r)*n;s+=t-9*(t>9),n^=3}return s>0&&s%10==0?e:t.error("string.creditCard")}},dataUri:{method(e={}){return d.assertOptions(e,["paddingRequired"]),e=n({paddingRequired:!0},e),o("boolean"==typeof e.paddingRequired,"paddingRequired must be boolean"),this.$_addRule({name:"dataUri",args:{options:e}})},validate(e,t,{options:r}){const s=e.match(p.dataUriRegex);if(s){if(!s[2])return e;if("base64"!==s[2])return e;if(p.base64Regex[r.paddingRequired].false.test(s[3]))return e}return t.error("string.dataUri")}},domain:{method(e){e&&d.assertOptions(e,["allowFullyQualified","allowUnicode","maxDomainSegments","minDomainSegments","tlds"]);const t=p.addressOptions(e);return this.$_addRule({name:"domain",args:{options:e},address:t})},validate:(e,t,r,{address:s})=>i.isValid(e,s)?e:t.error("string.domain")},email:{method(e={}){d.assertOptions(e,["allowFullyQualified","allowUnicode","ignoreLength","maxDomainSegments","minDomainSegments","multiple","separator","tlds"]),o(void 0===e.multiple||"boolean"==typeof e.multiple,"multiple option must be an boolean");const t=p.addressOptions(e),r=new RegExp("\\s*[".concat(e.separator?u(e.separator):",","]\\s*"));return this.$_addRule({name:"email",args:{options:e},regex:r,address:t})},validate(e,t,{options:r},{regex:s,address:n}){const a=r.multiple?e.split(s):[e],o=[];for(const e of a)l.isValid(e,n)||o.push(e);return o.length?t.error("string.email",{value:e,invalids:o}):e}},guid:{alias:"uuid",method(e={}){d.assertOptions(e,["version","separator"]);let t="";if(e.version){const r=[].concat(e.version);o(r.length>=1,"version must have at least 1 valid version specified");const s=new Set;for(let e=0;e<r.length;++e){const n=r[e];o("string"==typeof n,"version at position "+e+" must be a string");const a=p.guidVersions[n.toLowerCase()];o(a,"version at position "+e+" must be one of "+Object.keys(p.guidVersions).join(", ")),o(!s.has(a),"version at position "+e+" must not be a duplicate"),t+=a,s.add(a)}}o(p.guidSeparators.has(e.separator),'separator must be one of true, false, "-", or ":"');const r=void 0===e.separator?"[:-]?":!0===e.separator?"[:-]":!1===e.separator?"[]?":"\\".concat(e.separator),s=new RegExp("^([\\[{\\(]?)[0-9A-F]{8}(".concat(r,")[0-9A-F]{4}\\2?[").concat(t||"0-9A-F","][0-9A-F]{3}\\2?[").concat(t?"89AB":"0-9A-F","][0-9A-F]{3}\\2?[0-9A-F]{12}([\\]}\\)]?)$"),"i");return this.$_addRule({name:"guid",args:{options:e},regex:s})},validate(e,t,r,{regex:s}){const n=s.exec(e);return n?p.guidBrackets[n[1]]!==n[n.length-1]?t.error("string.guid"):e:t.error("string.guid")}},hex:{method(e={}){return d.assertOptions(e,["byteAligned"]),e=n({byteAligned:!1},e),o("boolean"==typeof e.byteAligned,"byteAligned must be boolean"),this.$_addRule({name:"hex",args:{options:e}})},validate:(e,t,{options:r})=>p.hexRegex.test(e)?r.byteAligned&&e.length%2!=0?t.error("string.hexAlign"):e:t.error("string.hex")},hostname:{method(){return this.$_addRule("hostname")},validate:(e,t)=>i.isValid(e,{minDomainSegments:1})||p.ipRegex.test(e)?e:t.error("string.hostname")},insensitive:{method(){return this.$_setFlag("insensitive",!0)}},ip:{method(e={}){d.assertOptions(e,["cidr","version"]);const{cidr:t,versions:r,regex:s}=c.regex(e),n=e.version?r:void 0;return this.$_addRule({name:"ip",args:{options:{cidr:t,version:n}},regex:s})},validate:(e,t,{options:r},{regex:s})=>s.test(e)?e:r.version?t.error("string.ipVersion",{value:e,cidr:r.cidr,version:r.version}):t.error("string.ip",{value:e,cidr:r.cidr})},isoDate:{method(){return this.$_addRule("isoDate")},validate:(e,{error:t})=>p.isoDate(e)?e:t("string.isoDate")},isoDuration:{method(){return this.$_addRule("isoDuration")},validate:(e,t)=>p.isoDurationRegex.test(e)?e:t.error("string.isoDuration")},length:{method(e,t){return p.length(this,"length",e,"=",t)},validate(e,t,{limit:r,encoding:s},{name:n,operator:a,args:o}){const i=!s&&e.length;return d.compare(i,r,a)?e:t.error("string."+n,{limit:o.limit,value:e,encoding:s})},args:[{name:"limit",ref:!0,assert:d.limit,message:"must be a positive integer"},"encoding"]},lowercase:{method(){return this.case("lower")}},max:{method(e,t){return p.length(this,"max",e,"<=",t)},args:["limit","encoding"]},min:{method(e,t){return p.length(this,"min",e,">=",t)},args:["limit","encoding"]},normalize:{method(e="NFC"){return o(p.normalizationForms.includes(e),"normalization form must be one of "+p.normalizationForms.join(", ")),this.$_addRule({name:"normalize",args:{form:e}})},validate:(e,{error:t},{form:r})=>e===e.normalize(r)?e:t("string.normalize",{value:e,form:r}),convert:!0},pattern:{alias:"regex",method(e,t={}){o(e instanceof RegExp,"regex must be a RegExp"),o(!e.flags.includes("g")&&!e.flags.includes("y"),"regex should not use global or sticky mode"),"string"==typeof t&&(t={name:t}),d.assertOptions(t,["invert","name"]);const r=["string.pattern",t.invert?".invert":"",t.name?".name":".base"].join("");return this.$_addRule({name:"pattern",args:{regex:e,options:t},errorCode:r})},validate:(e,t,{regex:r,options:s},{errorCode:n})=>r.test(e)^s.invert?e:t.error(n,{name:s.name,regex:r,value:e}),args:["regex","options"],multi:!0},replace:{method(e,t){"string"==typeof e&&(e=new RegExp(u(e),"g")),o(e instanceof RegExp,"pattern must be a RegExp"),o("string"==typeof t,"replacement must be a String");const r=this.clone();return r.$_terms.replacements||(r.$_terms.replacements=[]),r.$_terms.replacements.push({pattern:e,replacement:t}),r}},token:{method(){return this.$_addRule("token")},validate:(e,t)=>/^\w+$/.test(e)?e:t.error("string.token")},trim:{method(e=!0){return o("boolean"==typeof e,"enabled must be a boolean"),this.$_addRule({name:"trim",args:{enabled:e}})},validate:(e,t,{enabled:r})=>r&&e!==e.trim()?t.error("string.trim"):e,convert:!0},truncate:{method(e=!0){return o("boolean"==typeof e,"enabled must be a boolean"),this.$_setFlag("truncate",e)}},uppercase:{method(){return this.case("upper")}},uri:{method(e={}){d.assertOptions(e,["allowRelative","allowQuerySquareBrackets","domain","relativeOnly","scheme"]),e.domain&&d.assertOptions(e.domain,["allowFullyQualified","allowUnicode","maxDomainSegments","minDomainSegments","tlds"]);const{regex:t,scheme:r}=m.regex(e),s=e.domain?p.addressOptions(e.domain):null;return this.$_addRule({name:"uri",args:{options:e},regex:t,domain:s,scheme:r})},validate(e,t,{options:r},{regex:s,domain:n,scheme:a}){if(["http:/","https:/"].includes(e))return t.error("string.uri");const o=s.exec(e);if(o){const s=o[1]||o[2];return!n||r.allowRelative&&!s||i.isValid(s,n)?e:t.error("string.domain",{value:s})}return r.relativeOnly?t.error("string.uriRelativeOnly"):r.scheme?t.error("string.uriCustomScheme",{scheme:a,value:e}):t.error("string.uri")}}},manifest:{build(e,t){if(t.replacements)for(const{pattern:r,replacement:s}of t.replacements)e=e.replace(r,s);return e}},messages:{"string.alphanum":"{{#label}} must only contain alpha-numeric characters","string.base":"{{#label}} must be a string","string.base64":"{{#label}} must be a valid base64 string","string.creditCard":"{{#label}} must be a credit card","string.dataUri":"{{#label}} must be a valid dataUri string","string.domain":"{{#label}} must contain a valid domain name","string.email":"{{#label}} must be a valid email","string.empty":"{{#label}} is not allowed to be empty","string.guid":"{{#label}} must be a valid GUID","string.hex":"{{#label}} must only contain hexadecimal characters","string.hexAlign":"{{#label}} hex decoded representation must be byte aligned","string.hostname":"{{#label}} must be a valid hostname","string.ip":"{{#label}} must be a valid ip address with a {{#cidr}} CIDR","string.ipVersion":"{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR","string.isoDate":"{{#label}} must be in iso format","string.isoDuration":"{{#label}} must be a valid ISO 8601 duration","string.length":"{{#label}} length must be {{#limit}} characters long","string.lowercase":"{{#label}} must only contain lowercase characters","string.max":"{{#label}} length must be less than or equal to {{#limit}} characters long","string.min":"{{#label}} length must be at least {{#limit}} characters long","string.normalize":"{{#label}} must be unicode normalized in the {{#form}} form","string.token":"{{#label}} must only contain alpha-numeric and underscore characters","string.pattern.base":"{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}","string.pattern.name":"{{#label}} with value {:[.]} fails to match the {{#name}} pattern","string.pattern.invert.base":"{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}","string.pattern.invert.name":"{{#label}} with value {:[.]} matches the inverted {{#name}} pattern","string.trim":"{{#label}} must not have leading or trailing whitespace","string.uri":"{{#label}} must be a valid uri","string.uriCustomScheme":"{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern","string.uriRelativeOnly":"{{#label}} must be a valid relative uri","string.uppercase":"{{#label}} must only contain uppercase characters"}}),p.addressOptions=function(e){if(!e)return e;if(o(void 0===e.minDomainSegments||Number.isSafeInteger(e.minDomainSegments)&&e.minDomainSegments>0,"minDomainSegments must be a positive integer"),o(void 0===e.maxDomainSegments||Number.isSafeInteger(e.maxDomainSegments)&&e.maxDomainSegments>0,"maxDomainSegments must be a positive integer"),!1===e.tlds)return e;if(!0===e.tlds||void 0===e.tlds)return o(p.tlds,"Built-in TLD list disabled"),Object.assign({},e,p.tlds);o("object"==typeof e.tlds,"tlds must be true, false, or an object");const t=e.tlds.deny;if(t)return Array.isArray(t)&&(e=Object.assign({},e,{tlds:{deny:new Set(t)}})),o(e.tlds.deny instanceof Set,"tlds.deny must be an array, Set, or boolean"),o(!e.tlds.allow,"Cannot specify both tlds.allow and tlds.deny lists"),p.validateTlds(e.tlds.deny,"tlds.deny"),e;const r=e.tlds.allow;return r?!0===r?(o(p.tlds,"Built-in TLD list disabled"),Object.assign({},e,p.tlds)):(Array.isArray(r)&&(e=Object.assign({},e,{tlds:{allow:new Set(r)}})),o(e.tlds.allow instanceof Set,"tlds.allow must be an array, Set, or boolean"),p.validateTlds(e.tlds.allow,"tlds.allow"),e):e},p.validateTlds=function(e,t){for(const r of e)o(i.isValid(r,{minDomainSegments:1,maxDomainSegments:1}),"".concat(t," must contain valid top level domain names"))},p.isoDate=function(e){if(!d.isIsoDate(e))return null;/.*T.*[+-]\d\d$/.test(e)&&(e+="00");const t=new Date(e);return isNaN(t.getTime())?null:t.toISOString()},p.length=function(e,t,r,s,n){return o(!n||!1,"Invalid encoding:",n),e.$_addRule({name:t,method:"length",args:{limit:r,encoding:n},operator:s})}},8826:(e,t,r)=>{"use strict";const s=r(375),n=r(8068),a={};a.Map=class extends Map{slice(){return new a.Map(this)}},e.exports=n.extend({type:"symbol",terms:{map:{init:new a.Map}},coerce:{method(e,{schema:t,error:r}){const s=t.$_terms.map.get(e);return s&&(e=s),t._flags.only&&"symbol"!=typeof e?{value:e,errors:r("symbol.map",{map:t.$_terms.map})}:{value:e}}},validate(e,{error:t}){if("symbol"!=typeof e)return{value:e,errors:t("symbol.base")}},rules:{map:{method(e){e&&!e[Symbol.iterator]&&"object"==typeof e&&(e=Object.entries(e)),s(e&&e[Symbol.iterator],"Iterable must be an iterable or object");const t=this.clone(),r=[];for(const n of e){s(n&&n[Symbol.iterator],"Entry must be an iterable");const[e,a]=n;s("object"!=typeof e&&"function"!=typeof e&&"symbol"!=typeof e,"Key must not be of type object, function, or Symbol"),s("symbol"==typeof a,"Value must be a Symbol"),t.$_terms.map.set(e,a),r.push(a)}return t.valid(...r)}}},manifest:{build:(e,t)=>(t.map&&(e=e.map(t.map)),e)},messages:{"symbol.base":"{{#label}} must be a symbol","symbol.map":"{{#label}} must be one of {{#map}}"}})},8863:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(738),o=r(9621),i=r(8160),l=r(6354),c=r(493),u={result:Symbol("result")};t.entry=function(e,t,r){let n=i.defaults;r&&(s(void 0===r.warnings,"Cannot override warnings preference in synchronous validation"),s(void 0===r.artifacts,"Cannot override artifacts preference in synchronous validation"),n=i.preferences(i.defaults,r));const a=u.entry(e,t,n);s(!a.mainstay.externals.length,"Schema with external rules must use validateAsync()");const o={value:a.value};return a.error&&(o.error=a.error),a.mainstay.warnings.length&&(o.warning=l.details(a.mainstay.warnings)),a.mainstay.debug&&(o.debug=a.mainstay.debug),a.mainstay.artifacts&&(o.artifacts=a.mainstay.artifacts),o},t.entryAsync=async function(e,t,r){let s=i.defaults;r&&(s=i.preferences(i.defaults,r));const n=u.entry(e,t,s),a=n.mainstay;if(n.error)throw a.debug&&(n.error.debug=a.debug),n.error;if(a.externals.length){let e=n.value;for(const{method:t,path:n,label:i}of a.externals){let a,l,c=e;n.length&&(a=n[n.length-1],l=o(e,n.slice(0,-1)),c=l[a]);try{const s=await t(c,{prefs:r});if(void 0===s||s===c)continue;l?l[a]=s:e=s}catch(e){throw s.errors.label&&(e.message+=" (".concat(i,")")),e}}n.value=e}if(!s.warnings&&!s.debug&&!s.artifacts)return n.value;const c={value:n.value};return a.warnings.length&&(c.warning=l.details(a.warnings)),a.debug&&(c.debug=a.debug),a.artifacts&&(c.artifacts=a.artifacts),c},u.entry=function(e,r,s){const{tracer:n,cleanup:a}=u.tracer(r,s),o={externals:[],warnings:[],tracer:n,debug:s.debug?[]:null,links:r._ids._schemaChain?new Map:null},i=r._ids._schemaChain?[{schema:r}]:null,f=new c([],[],{mainstay:o,schemas:i}),m=t.validate(e,r,f,s);a&&r.$_root.untrace();const h=l.process(m.errors,e,s);return{value:m.value,error:h,mainstay:o}},u.tracer=function(e,t){return e.$_root._tracer?{tracer:e.$_root._tracer._register(e)}:t.debug?(s(e.$_root.trace,"Debug mode not supported"),{tracer:e.$_root.trace()._register(e),cleanup:!0}):{tracer:u.ignore}},t.validate=function(e,t,r,s,n={}){if(t.$_terms.whens&&(t=t._generate(e,r,s).schema),t._preferences&&(s=u.prefs(t,s)),t._cache&&s.cache){const s=t._cache.get(e);if(r.mainstay.tracer.debug(r,"validate","cached",!!s),s)return s}const a=(n,a,o)=>t.$_createError(n,e,a,o||r,s),o={original:e,prefs:s,schema:t,state:r,error:a,errorsArray:u.errorsArray,warn:(e,t,s)=>r.mainstay.warnings.push(a(e,t,s)),message:(n,a)=>t.$_createError("custom",e,a,r,s,{messages:n})};r.mainstay.tracer.entry(t,r);const l=t._definition;if(l.prepare&&void 0!==e&&s.convert){const t=l.prepare(e,o);if(t){if(r.mainstay.tracer.value(r,"prepare",e,t.value),t.errors)return u.finalize(t.value,[].concat(t.errors),o);e=t.value}}if(l.coerce&&void 0!==e&&s.convert&&(!l.coerce.from||l.coerce.from.includes(typeof e))){const t=l.coerce.method(e,o);if(t){if(r.mainstay.tracer.value(r,"coerced",e,t.value),t.errors)return u.finalize(t.value,[].concat(t.errors),o);e=t.value}}const c=t._flags.empty;c&&c.$_match(u.trim(e,t),r.nest(c),i.defaults)&&(r.mainstay.tracer.value(r,"empty",e,void 0),e=void 0);const f=n.presence||t._flags.presence||(t._flags._endedSwitch?null:s.presence);if(void 0===e){if("forbidden"===f)return u.finalize(e,null,o);if("required"===f)return u.finalize(e,[t.$_createError("any.required",e,null,r,s)],o);if("optional"===f){if(t._flags.default!==i.symbols.deepDefault)return u.finalize(e,null,o);r.mainstay.tracer.value(r,"default",e,{}),e={}}}else if("forbidden"===f)return u.finalize(e,[t.$_createError("any.unknown",e,null,r,s)],o);const m=[];if(t._valids){const n=t._valids.get(e,r,s,t._flags.insensitive);if(n)return s.convert&&(r.mainstay.tracer.value(r,"valids",e,n.value),e=n.value),r.mainstay.tracer.filter(t,r,"valid",n),u.finalize(e,null,o);if(t._flags.only){const n=t.$_createError("any.only",e,{valids:t._valids.values({display:!0})},r,s);if(s.abortEarly)return u.finalize(e,[n],o);m.push(n)}}if(t._invalids){const n=t._invalids.get(e,r,s,t._flags.insensitive);if(n){r.mainstay.tracer.filter(t,r,"invalid",n);const a=t.$_createError("any.invalid",e,{invalids:t._invalids.values({display:!0})},r,s);if(s.abortEarly)return u.finalize(e,[a],o);m.push(a)}}if(l.validate){const t=l.validate(e,o);if(t&&(r.mainstay.tracer.value(r,"base",e,t.value),e=t.value,t.errors)){if(!Array.isArray(t.errors))return m.push(t.errors),u.finalize(e,m,o);if(t.errors.length)return m.push(...t.errors),u.finalize(e,m,o)}}return t._rules.length?u.rules(e,m,o):u.finalize(e,m,o)},u.rules=function(e,t,r){const{schema:s,state:n,prefs:a}=r;for(const o of s._rules){const l=s._definition.rules[o.method];if(l.convert&&a.convert){n.mainstay.tracer.log(s,n,"rule",o.name,"full");continue}let c,f=o.args;if(o._resolve.length){f=Object.assign({},f);for(const t of o._resolve){const r=l.argsByName.get(t),o=f[t].resolve(e,n,a),u=r.normalize?r.normalize(o):o,m=i.validateArg(u,null,r);if(m){c=s.$_createError("any.ref",o,{arg:t,ref:f[t],reason:m},n,a);break}f[t]=u}}c=c||l.validate(e,r,f,o);const m=u.rule(c,o);if(m.errors){if(n.mainstay.tracer.log(s,n,"rule",o.name,"error"),o.warn){n.mainstay.warnings.push(...m.errors);continue}if(a.abortEarly)return u.finalize(e,m.errors,r);t.push(...m.errors)}else n.mainstay.tracer.log(s,n,"rule",o.name,"pass"),n.mainstay.tracer.value(n,"rule",e,m.value,o.name),e=m.value}return u.finalize(e,t,r)},u.rule=function(e,t){return e instanceof l.Report?(u.error(e,t),{errors:[e],value:null}):Array.isArray(e)&&e[i.symbols.errors]?(e.forEach((e=>u.error(e,t))),{errors:e,value:null}):{errors:null,value:e}},u.error=function(e,t){return t.message&&e._setTemplate(t.message),e},u.finalize=function(e,t,r){t=t||[];const{schema:n,state:a,prefs:o}=r;if(t.length){const s=u.default("failover",void 0,t,r);void 0!==s&&(a.mainstay.tracer.value(a,"failover",e,s),e=s,t=[])}if(t.length&&n._flags.error)if("function"==typeof n._flags.error){t=n._flags.error(t),Array.isArray(t)||(t=[t]);for(const e of t)s(e instanceof Error||e instanceof l.Report,"error() must return an Error object")}else t=[n._flags.error];if(void 0===e){const s=u.default("default",e,t,r);a.mainstay.tracer.value(a,"default",e,s),e=s}if(n._flags.cast&&void 0!==e){const t=n._definition.cast[n._flags.cast];if(t.from(e)){const s=t.to(e,r);a.mainstay.tracer.value(a,"cast",e,s,n._flags.cast),e=s}}if(n.$_terms.externals&&o.externals&&!1!==o._externals)for(const{method:e}of n.$_terms.externals)a.mainstay.externals.push({method:e,path:a.path,label:l.label(n._flags,a,o)});const i={value:e,errors:t.length?t:null};return n._flags.result&&(i.value="strip"===n._flags.result?void 0:r.original,a.mainstay.tracer.value(a,n._flags.result,e,i.value),a.shadow(e,n._flags.result)),n._cache&&!1!==o.cache&&!n._refs.length&&n._cache.set(r.original,i),void 0===e||i.errors||void 0===n._flags.artifact||(a.mainstay.artifacts=a.mainstay.artifacts||new Map,a.mainstay.artifacts.has(n._flags.artifact)||a.mainstay.artifacts.set(n._flags.artifact,[]),a.mainstay.artifacts.get(n._flags.artifact).push(a.path)),i},u.prefs=function(e,t){const r=t===i.defaults;return r&&e._preferences[i.symbols.prefs]?e._preferences[i.symbols.prefs]:(t=i.preferences(t,e._preferences),r&&(e._preferences[i.symbols.prefs]=t),t)},u.default=function(e,t,r,s){const{schema:a,state:o,prefs:l}=s,c=a._flags[e];if(l.noDefaults||void 0===c)return t;if(o.mainstay.tracer.log(a,o,"rule",e,"full"),!c)return c;if("function"==typeof c){const t=c.length?[n(o.ancestors[0]),s]:[];try{return c(...t)}catch(t){return void r.push(a.$_createError("any.".concat(e),null,{error:t},o,l))}}return"object"!=typeof c?c:c[i.symbols.literal]?c.literal:i.isResolvable(c)?c.resolve(t,o,l):n(c)},u.trim=function(e,t){if("string"!=typeof e)return e;const r=t.$_getRule("trim");return r&&r.args.enabled?e.trim():e},u.ignore={active:!1,debug:a,entry:a,filter:a,log:a,resolve:a,value:a},u.errorsArray=function(){const e=[];return e[i.symbols.errors]=!0,e}},2036:(e,t,r)=>{"use strict";const s=r(375),n=r(9474),a=r(8160),o={};e.exports=o.Values=class{constructor(e,t){this._values=new Set(e),this._refs=new Set(t),this._lowercase=o.lowercases(e),this._override=!1}get length(){return this._values.size+this._refs.size}add(e,t){a.isResolvable(e)?this._refs.has(e)||(this._refs.add(e),t&&t.register(e)):this.has(e,null,null,!1)||(this._values.add(e),"string"==typeof e&&this._lowercase.set(e.toLowerCase(),e))}static merge(e,t,r){if(e=e||new o.Values,t){if(t._override)return t.clone();for(const r of[...t._values,...t._refs])e.add(r)}if(r)for(const t of[...r._values,...r._refs])e.remove(t);return e.length?e:null}remove(e){a.isResolvable(e)?this._refs.delete(e):(this._values.delete(e),"string"==typeof e&&this._lowercase.delete(e.toLowerCase()))}has(e,t,r,s){return!!this.get(e,t,r,s)}get(e,t,r,s){if(!this.length)return!1;if(this._values.has(e))return{value:e};if("string"==typeof e&&e&&s){const t=this._lowercase.get(e.toLowerCase());if(t)return{value:t}}if(!this._refs.size&&"object"!=typeof e)return!1;if("object"==typeof e)for(const t of this._values)if(n(t,e))return{value:t};if(t)for(const a of this._refs){const o=a.resolve(e,t,r,null,{in:!0});if(void 0===o)continue;const i=a.in&&"object"==typeof o?Array.isArray(o)?o:Object.keys(o):[o];for(const t of i)if(typeof t==typeof e)if(s&&e&&"string"==typeof e){if(t.toLowerCase()===e.toLowerCase())return{value:t,ref:a}}else if(n(t,e))return{value:t,ref:a}}return!1}override(){this._override=!0}values(e){if(e&&e.display){const e=[];for(const t of[...this._values,...this._refs])void 0!==t&&e.push(t);return e}return Array.from([...this._values,...this._refs])}clone(){const e=new o.Values(this._values,this._refs);return e._override=this._override,e}concat(e){s(!e._override,"Cannot concat override set of values");const t=new o.Values([...this._values,...e._values],[...this._refs,...e._refs]);return t._override=this._override,t}describe(){const e=[];this._override&&e.push({override:!0});for(const t of this._values.values())e.push(t&&"object"==typeof t?{value:t}:t);for(const t of this._refs.values())e.push(t.describe());return e}},o.Values.prototype[a.symbols.values]=!0,o.Values.prototype.slice=o.Values.prototype.clone,o.lowercases=function(e){const t=new Map;if(e)for(const r of e)"string"==typeof r&&t.set(r.toLowerCase(),r);return t}},978:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(1687),o=r(9621),i={};e.exports=function(e,t,r={}){if(s(e&&"object"==typeof e,"Invalid defaults value: must be an object"),s(!t||!0===t||"object"==typeof t,"Invalid source value: must be true, falsy or an object"),s("object"==typeof r,"Invalid options: must be an object"),!t)return null;if(r.shallow)return i.applyToDefaultsWithShallow(e,t,r);const o=n(e);if(!0===t)return o;const l=void 0!==r.nullOverride&&r.nullOverride;return a(o,t,{nullOverride:l,mergeArrays:!1})},i.applyToDefaultsWithShallow=function(e,t,r){const l=r.shallow;s(Array.isArray(l),"Invalid keys");const c=new Map,u=!0===t?null:new Set;for(let r of l){r=Array.isArray(r)?r:r.split(".");const s=o(e,r);s&&"object"==typeof s?c.set(s,u&&o(t,r)||s):u&&u.add(r)}const f=n(e,{},c);if(!u)return f;for(const e of u)i.reachCopy(f,t,e);const m=void 0!==r.nullOverride&&r.nullOverride;return a(f,t,{nullOverride:m,mergeArrays:!1})},i.reachCopy=function(e,t,r){for(const e of r){if(!(e in t))return;const r=t[e];if("object"!=typeof r||null===r)return;t=r}const s=t;let n=e;for(let e=0;e<r.length-1;++e){const t=r[e];"object"!=typeof n[t]&&(n[t]={}),n=n[t]}n[r[r.length-1]]=s}},375:(e,t,r)=>{"use strict";const s=r(7916);e.exports=function(e,...t){if(!e){if(1===t.length&&t[0]instanceof Error)throw t[0];throw new s(t)}}},8571:(e,t,r)=>{"use strict";const s=r(9621),n=r(4277),a=r(7043),o={needsProtoHack:new Set([n.set,n.map,n.weakSet,n.weakMap])};e.exports=o.clone=function(e,t={},r=null){if("object"!=typeof e||null===e)return e;let s=o.clone,i=r;if(t.shallow){if(!0!==t.shallow)return o.cloneWithShallow(e,t);s=e=>e}else if(i){const t=i.get(e);if(t)return t}else i=new Map;const l=n.getInternalProto(e);if(l===n.buffer)return!1;if(l===n.date)return new Date(e.getTime());if(l===n.regex)return new RegExp(e);const c=o.base(e,l,t);if(c===e)return e;if(i&&i.set(e,c),l===n.set)for(const r of e)c.add(s(r,t,i));else if(l===n.map)for(const[r,n]of e)c.set(r,s(n,t,i));const u=a.keys(e,t);for(const r of u){if("__proto__"===r)continue;if(l===n.array&&"length"===r){c.length=e.length;continue}const a=Object.getOwnPropertyDescriptor(e,r);a?a.get||a.set?Object.defineProperty(c,r,a):a.enumerable?c[r]=s(e[r],t,i):Object.defineProperty(c,r,{enumerable:!1,writable:!0,configurable:!0,value:s(e[r],t,i)}):Object.defineProperty(c,r,{enumerable:!0,writable:!0,configurable:!0,value:s(e[r],t,i)})}return c},o.cloneWithShallow=function(e,t){const r=t.shallow;(t=Object.assign({},t)).shallow=!1;const n=new Map;for(const t of r){const r=s(e,t);"object"!=typeof r&&"function"!=typeof r||n.set(r,r)}return o.clone(e,t,n)},o.base=function(e,t,r){if(!1===r.prototype)return o.needsProtoHack.has(t)?new t.constructor:t===n.array?[]:{};const s=Object.getPrototypeOf(e);if(s&&s.isImmutable)return e;if(t===n.array){const e=[];return s!==t&&Object.setPrototypeOf(e,s),e}if(o.needsProtoHack.has(t)){const e=new s.constructor;return s!==t&&Object.setPrototypeOf(e,s),e}return Object.create(s)}},9474:(e,t,r)=>{"use strict";const s=r(4277),n={mismatched:null};e.exports=function(e,t,r){return r=Object.assign({prototype:!0},r),!!n.isDeepEqual(e,t,r,[])},n.isDeepEqual=function(e,t,r,a){if(e===t)return 0!==e||1/e==1/t;const o=typeof e;if(o!==typeof t)return!1;if(null===e||null===t)return!1;if("function"===o){if(!r.deepFunction||e.toString()!==t.toString())return!1}else if("object"!==o)return e!=e&&t!=t;const i=n.getSharedType(e,t,!!r.prototype);switch(i){case s.buffer:return!1;case s.promise:return e===t;case s.regex:return e.toString()===t.toString();case n.mismatched:return!1}for(let r=a.length-1;r>=0;--r)if(a[r].isSame(e,t))return!0;a.push(new n.SeenEntry(e,t));try{return!!n.isDeepEqualObj(i,e,t,r,a)}finally{a.pop()}},n.getSharedType=function(e,t,r){if(r)return Object.getPrototypeOf(e)!==Object.getPrototypeOf(t)?n.mismatched:s.getInternalProto(e);const a=s.getInternalProto(e);return a!==s.getInternalProto(t)?n.mismatched:a},n.valueOf=function(e){const t=e.valueOf;if(void 0===t)return e;try{return t.call(e)}catch(e){return e}},n.hasOwnEnumerableProperty=function(e,t){return Object.prototype.propertyIsEnumerable.call(e,t)},n.isSetSimpleEqual=function(e,t){for(const r of Set.prototype.values.call(e))if(!Set.prototype.has.call(t,r))return!1;return!0},n.isDeepEqualObj=function(e,t,r,a,o){const{isDeepEqual:i,valueOf:l,hasOwnEnumerableProperty:c}=n,{keys:u,getOwnPropertySymbols:f}=Object;if(e===s.array){if(!a.part){if(t.length!==r.length)return!1;for(let e=0;e<t.length;++e)if(!i(t[e],r[e],a,o))return!1;return!0}for(const e of t)for(const t of r)if(i(e,t,a,o))return!0}else if(e===s.set){if(t.size!==r.size)return!1;if(!n.isSetSimpleEqual(t,r)){const e=new Set(Set.prototype.values.call(r));for(const r of Set.prototype.values.call(t)){if(e.delete(r))continue;let t=!1;for(const s of e)if(i(r,s,a,o)){e.delete(s),t=!0;break}if(!t)return!1}}}else if(e===s.map){if(t.size!==r.size)return!1;for(const[e,s]of Map.prototype.entries.call(t)){if(void 0===s&&!Map.prototype.has.call(r,e))return!1;if(!i(s,Map.prototype.get.call(r,e),a,o))return!1}}else if(e===s.error&&(t.name!==r.name||t.message!==r.message))return!1;const m=l(t),h=l(r);if((t!==m||r!==h)&&!i(m,h,a,o))return!1;const d=u(t);if(!a.part&&d.length!==u(r).length&&!a.skip)return!1;let p=0;for(const e of d)if(a.skip&&a.skip.includes(e))void 0===r[e]&&++p;else{if(!c(r,e))return!1;if(!i(t[e],r[e],a,o))return!1}if(!a.part&&d.length-p!==u(r).length)return!1;if(!1!==a.symbols){const e=f(t),s=new Set(f(r));for(const n of e){if(!a.skip||!a.skip.includes(n))if(c(t,n)){if(!c(r,n))return!1;if(!i(t[n],r[n],a,o))return!1}else if(c(r,n))return!1;s.delete(n)}for(const e of s)if(c(r,e))return!1}return!0},n.SeenEntry=class{constructor(e,t){this.obj=e,this.ref=t}isSame(e,t){return this.obj===e&&this.ref===t}}},7916:(e,t,r)=>{"use strict";const s=r(8761);e.exports=class extends Error{constructor(e){super(e.filter((e=>""!==e)).map((e=>"string"==typeof e?e:e instanceof Error?e.message:s(e))).join(" ")||"Unknown error"),"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,t.assert)}}},5277:e=>{"use strict";const t={};e.exports=function(e){if(!e)return"";let r="";for(let s=0;s<e.length;++s){const n=e.charCodeAt(s);t.isSafe(n)?r+=e[s]:r+=t.escapeHtmlChar(n)}return r},t.escapeHtmlChar=function(e){const r=t.namedHtml[e];if(void 0!==r)return r;if(e>=256)return"&#"+e+";";const s=e.toString(16).padStart(2,"0");return"&#x".concat(s,";")},t.isSafe=function(e){return void 0!==t.safeCharCodes[e]},t.namedHtml={38:"&amp;",60:"&lt;",62:"&gt;",34:"&quot;",160:"&nbsp;",162:"&cent;",163:"&pound;",164:"&curren;",169:"&copy;",174:"&reg;"},t.safeCharCodes=function(){const e={};for(let t=32;t<123;++t)(t>=97||t>=65&&t<=90||t>=48&&t<=57||32===t||46===t||44===t||45===t||58===t||95===t)&&(e[t]=null);return e}()},6064:e=>{"use strict";e.exports=function(e){return e.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g,"\\$&")}},738:e=>{"use strict";e.exports=function(){}},1687:(e,t,r)=>{"use strict";const s=r(375),n=r(8571),a=r(7043),o={};e.exports=o.merge=function(e,t,r){if(s(e&&"object"==typeof e,"Invalid target value: must be an object"),s(null==t||"object"==typeof t,"Invalid source value: must be null, undefined, or an object"),!t)return e;if(r=Object.assign({nullOverride:!0,mergeArrays:!0},r),Array.isArray(t)){s(Array.isArray(e),"Cannot merge array onto an object"),r.mergeArrays||(e.length=0);for(let s=0;s<t.length;++s)e.push(n(t[s],{symbols:r.symbols}));return e}const i=a.keys(t,r);for(let s=0;s<i.length;++s){const a=i[s];if("__proto__"===a||!Object.prototype.propertyIsEnumerable.call(t,a))continue;const l=t[a];if(l&&"object"==typeof l){if(e[a]===l)continue;!e[a]||"object"!=typeof e[a]||Array.isArray(e[a])!==Array.isArray(l)||l instanceof Date||l instanceof RegExp?e[a]=n(l,{symbols:r.symbols}):o.merge(e[a],l,r)}else(null!=l||r.nullOverride)&&(e[a]=l)}return e}},9621:(e,t,r)=>{"use strict";const s=r(375),n={};e.exports=function(e,t,r){if(!1===t||null==t)return e;"string"==typeof(r=r||{})&&(r={separator:r});const a=Array.isArray(t);s(!a||!r.separator,"Separator option no valid for array-based chain");const o=a?t:t.split(r.separator||".");let i=e;for(let e=0;e<o.length;++e){let a=o[e];const l=r.iterables&&n.iterables(i);if(Array.isArray(i)||"set"===l){const e=Number(a);Number.isInteger(e)&&(a=e<0?i.length+e:e)}if(!i||"function"==typeof i&&!1===r.functions||!l&&void 0===i[a]){s(!r.strict||e+1===o.length,"Missing segment",a,"in reach path ",t),s("object"==typeof i||!0===r.functions||"function"!=typeof i,"Invalid segment",a,"in reach path ",t),i=r.default;break}i=l?"set"===l?[...i][a]:i.get(a):i[a]}return i},n.iterables=function(e){return e instanceof Set?"set":e instanceof Map?"map":void 0}},8761:e=>{"use strict";e.exports=function(...e){try{return JSON.stringify.apply(null,e)}catch(e){return"[Cannot display object: "+e.message+"]"}}},4277:(e,t)=>{"use strict";const r={};t=e.exports={array:Array.prototype,buffer:!1,date:Date.prototype,error:Error.prototype,generic:Object.prototype,map:Map.prototype,promise:Promise.prototype,regex:RegExp.prototype,set:Set.prototype,weakMap:WeakMap.prototype,weakSet:WeakSet.prototype},r.typeMap=new Map([["[object Error]",t.error],["[object Map]",t.map],["[object Promise]",t.promise],["[object Set]",t.set],["[object WeakMap]",t.weakMap],["[object WeakSet]",t.weakSet]]),t.getInternalProto=function(e){if(Array.isArray(e))return t.array;if(e instanceof Date)return t.date;if(e instanceof RegExp)return t.regex;if(e instanceof Error)return t.error;const s=Object.prototype.toString.call(e);return r.typeMap.get(s)||t.generic}},7043:(e,t)=>{"use strict";t.keys=function(e,t={}){return!1!==t.symbols?Reflect.ownKeys(e):Object.getOwnPropertyNames(e)}},3652:(e,t,r)=>{"use strict";const s=r(375),n={};t.Sorter=class{constructor(){this._items=[],this.nodes=[]}add(e,t){const r=[].concat((t=t||{}).before||[]),n=[].concat(t.after||[]),a=t.group||"?",o=t.sort||0;s(!r.includes(a),"Item cannot come before itself: ".concat(a)),s(!r.includes("?"),"Item cannot come before unassociated items"),s(!n.includes(a),"Item cannot come after itself: ".concat(a)),s(!n.includes("?"),"Item cannot come after unassociated items"),Array.isArray(e)||(e=[e]);for(const t of e){const e={seq:this._items.length,sort:o,before:r,after:n,group:a,node:t};this._items.push(e)}if(!t.manual){const e=this._sort();s(e,"item","?"!==a?"added into group ".concat(a):"","created a dependencies error")}return this.nodes}merge(e){Array.isArray(e)||(e=[e]);for(const t of e)if(t)for(const e of t._items)this._items.push(Object.assign({},e));this._items.sort(n.mergeSort);for(let e=0;e<this._items.length;++e)this._items[e].seq=e;const t=this._sort();return s(t,"merge created a dependencies error"),this.nodes}sort(){const e=this._sort();return s(e,"sort created a dependencies error"),this.nodes}_sort(){const e={},t=Object.create(null),r=Object.create(null);for(const s of this._items){const n=s.seq,a=s.group;r[a]=r[a]||[],r[a].push(n),e[n]=s.before;for(const e of s.after)t[e]=t[e]||[],t[e].push(n)}for(const t in e){const s=[];for(const n in e[t]){const a=e[t][n];r[a]=r[a]||[],s.push(...r[a])}e[t]=s}for(const s in t)if(r[s])for(const n of r[s])e[n].push(...t[s]);const s={};for(const t in e){const r=e[t];for(const e of r)s[e]=s[e]||[],s[e].push(t)}const n={},a=[];for(let e=0;e<this._items.length;++e){let t=e;if(s[e]){t=null;for(let e=0;e<this._items.length;++e){if(!0===n[e])continue;s[e]||(s[e]=[]);const r=s[e].length;let a=0;for(let t=0;t<r;++t)n[s[e][t]]&&++a;if(a===r){t=e;break}}}null!==t&&(n[t]=!0,a.push(t))}if(a.length!==this._items.length)return!1;const o={};for(const e of this._items)o[e.seq]=e;this._items=[],this.nodes=[];for(const e of a){const t=o[e];this.nodes.push(t.node),this._items.push(t)}return!0}},n.mergeSort=(e,t)=>e.sort===t.sort?0:e.sort<t.sort?-1:1},5380:(e,t,r)=>{"use strict";const s=r(443),n=r(2178),a={minDomainSegments:2,nonAsciiRx:/[^\x00-\x7f]/,domainControlRx:/[\x00-\x20@\:\/\\#!\$&\'\(\)\*\+,;=\?]/,tldSegmentRx:/^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,domainSegmentRx:/^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/,URL:s.URL||URL};t.analyze=function(e,t={}){if(!e)return n.code("DOMAIN_NON_EMPTY_STRING");if("string"!=typeof e)throw new Error("Invalid input: domain must be a string");if(e.length>256)return n.code("DOMAIN_TOO_LONG");if(a.nonAsciiRx.test(e)){if(!1===t.allowUnicode)return n.code("DOMAIN_INVALID_UNICODE_CHARS");e=e.normalize("NFC")}if(a.domainControlRx.test(e))return n.code("DOMAIN_INVALID_CHARS");e=a.punycode(e),t.allowFullyQualified&&"."===e[e.length-1]&&(e=e.slice(0,-1));const r=t.minDomainSegments||a.minDomainSegments,s=e.split(".");if(s.length<r)return n.code("DOMAIN_SEGMENTS_COUNT");if(t.maxDomainSegments&&s.length>t.maxDomainSegments)return n.code("DOMAIN_SEGMENTS_COUNT_MAX");const o=t.tlds;if(o){const e=s[s.length-1].toLowerCase();if(o.deny&&o.deny.has(e)||o.allow&&!o.allow.has(e))return n.code("DOMAIN_FORBIDDEN_TLDS")}for(let e=0;e<s.length;++e){const t=s[e];if(!t.length)return n.code("DOMAIN_EMPTY_SEGMENT");if(t.length>63)return n.code("DOMAIN_LONG_SEGMENT");if(e<s.length-1){if(!a.domainSegmentRx.test(t))return n.code("DOMAIN_INVALID_CHARS")}else if(!a.tldSegmentRx.test(t))return n.code("DOMAIN_INVALID_TLDS_CHARS")}return null},t.isValid=function(e,r){return!t.analyze(e,r)},a.punycode=function(e){e.includes("%")&&(e=e.replace(/%/g,"%25"));try{return new a.URL("http://".concat(e)).host}catch(t){return e}}},1745:(e,t,r)=>{"use strict";const s=r(9848),n=r(5380),a=r(2178),o={nonAsciiRx:/[^\x00-\x7f]/,encoder:new(s.TextEncoder||TextEncoder)};t.analyze=function(e,t){return o.email(e,t)},t.isValid=function(e,t){return!o.email(e,t)},o.email=function(e,t={}){if("string"!=typeof e)throw new Error("Invalid input: email must be a string");if(!e)return a.code("EMPTY_STRING");const r=!o.nonAsciiRx.test(e);if(!r){if(!1===t.allowUnicode)return a.code("FORBIDDEN_UNICODE");e=e.normalize("NFC")}const s=e.split("@");if(2!==s.length)return s.length>2?a.code("MULTIPLE_AT_CHAR"):a.code("MISSING_AT_CHAR");const[i,l]=s;if(!i)return a.code("EMPTY_LOCAL");if(!t.ignoreLength){if(e.length>254)return a.code("ADDRESS_TOO_LONG");if(o.encoder.encode(i).length>64)return a.code("LOCAL_TOO_LONG")}return o.local(i,r)||n.analyze(l,t)},o.local=function(e,t){const r=e.split(".");for(const e of r){if(!e.length)return a.code("EMPTY_LOCAL_SEGMENT");if(t){if(!o.atextRx.test(e))return a.code("INVALID_LOCAL_CHARS")}else for(const t of e){if(o.atextRx.test(t))continue;const e=o.binary(t);if(!o.atomRx.test(e))return a.code("INVALID_LOCAL_CHARS")}}},o.binary=function(e){return Array.from(o.encoder.encode(e)).map((e=>String.fromCharCode(e))).join("")},o.atextRx=/^[\w!#\$%&'\*\+\-/=\?\^`\{\|\}~]+$/,o.atomRx=new RegExp(["(?:[\\xc2-\\xdf][\\x80-\\xbf])","(?:\\xe0[\\xa0-\\xbf][\\x80-\\xbf])|(?:[\\xe1-\\xec][\\x80-\\xbf]{2})|(?:\\xed[\\x80-\\x9f][\\x80-\\xbf])|(?:[\\xee-\\xef][\\x80-\\xbf]{2})","(?:\\xf0[\\x90-\\xbf][\\x80-\\xbf]{2})|(?:[\\xf1-\\xf3][\\x80-\\xbf]{3})|(?:\\xf4[\\x80-\\x8f][\\x80-\\xbf]{2})"].join("|"))},2178:(e,t)=>{"use strict";t.codes={EMPTY_STRING:"Address must be a non-empty string",FORBIDDEN_UNICODE:"Address contains forbidden Unicode characters",MULTIPLE_AT_CHAR:"Address cannot contain more than one @ character",MISSING_AT_CHAR:"Address must contain one @ character",EMPTY_LOCAL:"Address local part cannot be empty",ADDRESS_TOO_LONG:"Address too long",LOCAL_TOO_LONG:"Address local part too long",EMPTY_LOCAL_SEGMENT:"Address local part contains empty dot-separated segment",INVALID_LOCAL_CHARS:"Address local part contains invalid character",DOMAIN_NON_EMPTY_STRING:"Domain must be a non-empty string",DOMAIN_TOO_LONG:"Domain too long",DOMAIN_INVALID_UNICODE_CHARS:"Domain contains forbidden Unicode characters",DOMAIN_INVALID_CHARS:"Domain contains invalid character",DOMAIN_INVALID_TLDS_CHARS:"Domain contains invalid tld character",DOMAIN_SEGMENTS_COUNT:"Domain lacks the minimum required number of segments",DOMAIN_SEGMENTS_COUNT_MAX:"Domain contains too many segments",DOMAIN_FORBIDDEN_TLDS:"Domain uses forbidden TLD",DOMAIN_EMPTY_SEGMENT:"Domain contains empty dot-separated segment",DOMAIN_LONG_SEGMENT:"Domain contains dot-separated segment that is too long"},t.code=function(e){return{code:e,error:t.codes[e]}}},9959:(e,t,r)=>{"use strict";const s=r(375),n=r(5752);t.regex=function(e={}){s(void 0===e.cidr||"string"==typeof e.cidr,"options.cidr must be a string");const t=e.cidr?e.cidr.toLowerCase():"optional";s(["required","optional","forbidden"].includes(t),"options.cidr must be one of required, optional, forbidden"),s(void 0===e.version||"string"==typeof e.version||Array.isArray(e.version),"options.version must be a string or an array of string");let r=e.version||["ipv4","ipv6","ipvfuture"];Array.isArray(r)||(r=[r]),s(r.length>=1,"options.version must have at least 1 version specified");for(let e=0;e<r.length;++e)s("string"==typeof r[e],"options.version must only contain strings"),r[e]=r[e].toLowerCase(),s(["ipv4","ipv6","ipvfuture"].includes(r[e]),"options.version contains unknown version "+r[e]+" - must be one of ipv4, ipv6, ipvfuture");r=Array.from(new Set(r));const a=r.map((e=>{if("forbidden"===t)return n.ip[e];const r="\\/".concat("ipv4"===e?n.ip.v4Cidr:n.ip.v6Cidr);return"required"===t?"".concat(n.ip[e]).concat(r):"".concat(n.ip[e],"(?:").concat(r,")?")})),o="(?:".concat(a.join("|"),")"),i=new RegExp("^".concat(o,"$"));return{cidr:t,versions:r,regex:i,raw:o}}},5752:(e,t,r)=>{"use strict";const s=r(375),n=r(6064),a={generate:function(){const e={},t="!\\$&'\\(\\)\\*\\+,;=",r="\\w-\\.~%\\dA-Fa-f"+t+":@",s="["+r+"]",n="(?:0{0,2}\\d|0?[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";e.ipv4address="(?:"+n+"\\.){3}"+n;const a="[\\dA-Fa-f]{1,4}",o="(?:"+a+":"+a+"|"+e.ipv4address+")",i="(?:"+a+":){6}"+o,l="::(?:"+a+":){5}"+o,c="(?:"+a+")?::(?:"+a+":){4}"+o,u="(?:(?:"+a+":){0,1}"+a+")?::(?:"+a+":){3}"+o,f="(?:(?:"+a+":){0,2}"+a+")?::(?:"+a+":){2}"+o,m="(?:(?:"+a+":){0,3}"+a+")?::"+a+":"+o,h="(?:(?:"+a+":){0,4}"+a+")?::"+o;e.ipv4Cidr="(?:\\d|[1-2]\\d|3[0-2])",e.ipv6Cidr="(?:0{0,2}\\d|0?[1-9]\\d|1[01]\\d|12[0-8])",e.ipv6address="(?:"+i+"|"+l+"|"+c+"|"+u+"|"+f+"|"+m+"|"+h+"|(?:(?:[\\dA-Fa-f]{1,4}:){0,5}[\\dA-Fa-f]{1,4})?::[\\dA-Fa-f]{1,4}|(?:(?:[\\dA-Fa-f]{1,4}:){0,6}[\\dA-Fa-f]{1,4})?::)",e.ipvFuture="v[\\dA-Fa-f]+\\.[\\w-\\.~"+t+":]+",e.scheme="[a-zA-Z][a-zA-Z\\d+-\\.]*",e.schemeRegex=new RegExp(e.scheme);const d="[\\w-\\.~%\\dA-Fa-f"+t+":]*",p="(?:\\[(?:"+e.ipv6address+"|"+e.ipvFuture+")\\]|"+e.ipv4address+"|[\\w-\\.~%\\dA-Fa-f!\\$&'\\(\\)\\*\\+,;=]{1,255})",g="(?:"+d+"@)?"+p+"(?::\\d*)?",y="(?:"+d+"@)?("+p+")(?::\\d*)?",b=s+"+",v="(?:\\/[\\w-\\.~%\\dA-Fa-f!\\$&'\\(\\)\\*\\+,;=:@]*)*",_="\\/(?:"+b+v+")?",w=b+v,$="[\\w-\\.~%\\dA-Fa-f!\\$&'\\(\\)\\*\\+,;=@]+"+v;return e.hierPart="(?:(?:\\/\\/"+g+v+")|"+_+"|"+w+"|(?:\\/\\/\\/[\\w-\\.~%\\dA-Fa-f!\\$&'\\(\\)\\*\\+,;=:@]*(?:\\/[\\w-\\.~%\\dA-Fa-f!\\$&'\\(\\)\\*\\+,;=:@]*)*))",e.hierPartCapture="(?:(?:\\/\\/"+y+v+")|"+_+"|"+w+")",e.relativeRef="(?:(?:\\/\\/"+g+v+")|"+_+"|"+$+"|)",e.relativeRefCapture="(?:(?:\\/\\/"+y+v+")|"+_+"|"+$+"|)",e.query="["+r+"\\/\\?]*(?=#|$)",e.queryWithSquareBrackets="["+r+"\\[\\]\\/\\?]*(?=#|$)",e.fragment="["+r+"\\/\\?]*",e}};a.rfc3986=a.generate(),t.ip={v4Cidr:a.rfc3986.ipv4Cidr,v6Cidr:a.rfc3986.ipv6Cidr,ipv4:a.rfc3986.ipv4address,ipv6:a.rfc3986.ipv6address,ipvfuture:a.rfc3986.ipvFuture},a.createRegex=function(e){const t=a.rfc3986,r="(?:\\?"+(e.allowQuerySquareBrackets?t.queryWithSquareBrackets:t.query)+")?(?:#"+t.fragment+")?",o=e.domain?t.relativeRefCapture:t.relativeRef;if(e.relativeOnly)return a.wrap(o+r);let i="";if(e.scheme){s(e.scheme instanceof RegExp||"string"==typeof e.scheme||Array.isArray(e.scheme),"scheme must be a RegExp, String, or Array");const r=[].concat(e.scheme);s(r.length>=1,"scheme must have at least 1 scheme specified");const a=[];for(let e=0;e<r.length;++e){const o=r[e];s(o instanceof RegExp||"string"==typeof o,"scheme at position "+e+" must be a RegExp or String"),o instanceof RegExp?a.push(o.source.toString()):(s(t.schemeRegex.test(o),"scheme at position "+e+" must be a valid scheme"),a.push(n(o)))}i=a.join("|")}const l="(?:"+(i?"(?:"+i+")":t.scheme)+":"+(e.domain?t.hierPartCapture:t.hierPart)+")",c=e.allowRelative?"(?:"+l+"|"+o+")":l;return a.wrap(c+r,i)},a.wrap=function(e,t){return{raw:e="(?=.)(?!https?:/(?:$|[^/]))(?!https?:///)(?!https?:[^/])".concat(e),regex:new RegExp("^".concat(e,"$")),scheme:t}},a.uriRegex=a.createRegex({}),t.regex=function(e={}){return e.scheme||e.allowRelative||e.relativeOnly||e.allowQuerySquareBrackets||e.domain?a.createRegex(e):a.uriRegex}},1447:(e,t)=>{"use strict";const r={operators:["!","^","*","/","%","+","-","<","<=",">",">=","==","!=","&&","||","??"],operatorCharacters:["!","^","*","/","%","+","-","<","=",">","&","|","?"],operatorsOrder:[["^"],["*","/","%"],["+","-"],["<","<=",">",">="],["==","!="],["&&"],["||","??"]],operatorsPrefix:["!","n"],literals:{'"':'"',"`":"`","'":"'","[":"]"},numberRx:/^(?:[0-9]*\.?[0-9]*){1}$/,tokenRx:/^[\w\$\#\.\@\:\{\}]+$/,symbol:Symbol("formula"),settings:Symbol("settings")};t.Parser=class{constructor(e,t={}){if(!t[r.settings]&&t.constants)for(const e in t.constants){const r=t.constants[e];if(null!==r&&!["boolean","number","string"].includes(typeof r))throw new Error("Formula constant ".concat(e," contains invalid ").concat(typeof r," value type"))}this.settings=t[r.settings]?t:Object.assign({[r.settings]:!0,constants:{},functions:{}},t),this.single=null,this._parts=null,this._parse(e)}_parse(e){let s=[],n="",a=0,o=!1;const i=e=>{if(a)throw new Error("Formula missing closing parenthesis");const i=s.length?s[s.length-1]:null;if(o||n||e){if(i&&"reference"===i.type&&")"===e)return i.type="function",i.value=this._subFormula(n,i.value),void(n="");if(")"===e){const e=new t.Parser(n,this.settings);s.push({type:"segment",value:e})}else if(o){if("]"===o)return s.push({type:"reference",value:n}),void(n="");s.push({type:"literal",value:n})}else if(r.operatorCharacters.includes(n))i&&"operator"===i.type&&r.operators.includes(i.value+n)?i.value+=n:s.push({type:"operator",value:n});else if(n.match(r.numberRx))s.push({type:"constant",value:parseFloat(n)});else if(void 0!==this.settings.constants[n])s.push({type:"constant",value:this.settings.constants[n]});else{if(!n.match(r.tokenRx))throw new Error("Formula contains invalid token: ".concat(n));s.push({type:"reference",value:n})}n=""}};for(const t of e)o?t===o?(i(),o=!1):n+=t:a?"("===t?(n+=t,++a):")"===t?(--a,a?n+=t:i(t)):n+=t:t in r.literals?o=r.literals[t]:"("===t?(i(),++a):r.operatorCharacters.includes(t)?(i(),n=t,i()):" "!==t?n+=t:i();i(),s=s.map(((e,t)=>"operator"!==e.type||"-"!==e.value||t&&"operator"!==s[t-1].type?e:{type:"operator",value:"n"}));let l=!1;for(const e of s){if("operator"===e.type){if(r.operatorsPrefix.includes(e.value))continue;if(!l)throw new Error("Formula contains an operator in invalid position");if(!r.operators.includes(e.value))throw new Error("Formula contains an unknown operator ".concat(e.value))}else if(l)throw new Error("Formula missing expected operator");l=!l}if(!l)throw new Error("Formula contains invalid trailing operator");1===s.length&&["reference","literal","constant"].includes(s[0].type)&&(this.single={type:"reference"===s[0].type?"reference":"value",value:s[0].value}),this._parts=s.map((e=>{if("operator"===e.type)return r.operatorsPrefix.includes(e.value)?e:e.value;if("reference"!==e.type)return e.value;if(this.settings.tokenRx&&!this.settings.tokenRx.test(e.value))throw new Error("Formula contains invalid reference ".concat(e.value));return this.settings.reference?this.settings.reference(e.value):r.reference(e.value)}))}_subFormula(e,s){const n=this.settings.functions[s];if("function"!=typeof n)throw new Error("Formula contains unknown function ".concat(s));let a=[];if(e){let t="",n=0,o=!1;const i=()=>{if(!t)throw new Error("Formula contains function ".concat(s," with invalid arguments ").concat(e));a.push(t),t=""};for(let s=0;s<e.length;++s){const a=e[s];o?(t+=a,a===o&&(o=!1)):a in r.literals&&!n?(t+=a,o=r.literals[a]):","!==a||n?(t+=a,"("===a?++n:")"===a&&--n):i()}i()}return a=a.map((e=>new t.Parser(e,this.settings))),function(e){const t=[];for(const r of a)t.push(r.evaluate(e));return n.call(e,...t)}}evaluate(e){const t=this._parts.slice();for(let s=t.length-2;s>=0;--s){const n=t[s];if(n&&"operator"===n.type){const a=t[s+1];t.splice(s+1,1);const o=r.evaluate(a,e);t[s]=r.single(n.value,o)}}return r.operatorsOrder.forEach((s=>{for(let n=1;n<t.length-1;)if(s.includes(t[n])){const s=t[n],a=r.evaluate(t[n-1],e),o=r.evaluate(t[n+1],e);t.splice(n,2);const i=r.calculate(s,a,o);t[n-1]=0===i?0:i}else n+=2})),r.evaluate(t[0],e)}},t.Parser.prototype[r.symbol]=!0,r.reference=function(e){return function(t){return t&&void 0!==t[e]?t[e]:null}},r.evaluate=function(e,t){return null===e?null:"function"==typeof e?e(t):e[r.symbol]?e.evaluate(t):e},r.single=function(e,t){if("!"===e)return!t;const r=-t;return 0===r?0:r},r.calculate=function(e,t,s){if("??"===e)return r.exists(t)?t:s;if("string"==typeof t||"string"==typeof s){if("+"===e)return(t=r.exists(t)?t:"")+(r.exists(s)?s:"")}else switch(e){case"^":return Math.pow(t,s);case"*":return t*s;case"/":return t/s;case"%":return t%s;case"+":return t+s;case"-":return t-s}switch(e){case"<":return t<s;case"<=":return t<=s;case">":return t>s;case">=":return t>=s;case"==":return t===s;case"!=":return t!==s;case"&&":return t&&s;case"||":return t||s}return null},r.exists=function(e){return null!=e}},9926:()=>{},5688:()=>{},9708:()=>{},1152:()=>{},443:()=>{},9848:()=>{}},t={},function r(s){var n=t[s];if(void 0!==n)return n.exports;var a=t[s]={exports:{}};return e[s](a,a.exports,r),a.exports}(5107);var e,t}));

/***/ }),

/***/ 518:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentMemoryService = void 0;
class PersistentMemoryService {
    constructor() {
        this.data = {};
    }
    init() {
        // noop
    }
    set(data) {
        this.data = Object.assign(Object.assign({}, this.data), data);
    }
    get() {
        return this.data;
    }
}
exports.PersistentMemoryService = PersistentMemoryService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 519:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "persistent-memory";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 520:
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
exports.ChainsService = void 0;
const types_1 = __webpack_require__(521);
const common_1 = __webpack_require__(27);
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(228);
const cosmos_1 = __webpack_require__(16);
const permission_1 = __webpack_require__(523);
class ChainsService {
    constructor(kvStore, embedChainInfos, experimentalOptions = {}) {
        this.kvStore = kvStore;
        this.embedChainInfos = embedChainInfos;
        this.experimentalOptions = experimentalOptions;
        this.onChainRemovedHandlers = [];
        this.getChainInfos = common_1.Debouncer.promise(() => __awaiter(this, void 0, void 0, function* () {
            if (this.cachedChainInfos) {
                return this.cachedChainInfos;
            }
            const chainInfos = this.embedChainInfos.map((chainInfo) => {
                return Object.assign(Object.assign({}, chainInfo), { embeded: true });
            });
            const embedChainInfoIdentifierMap = new Map();
            for (const embedChainInfo of chainInfos) {
                embedChainInfoIdentifierMap.set(cosmos_1.ChainIdHelper.parse(embedChainInfo.chainId).identifier, true);
            }
            const suggestedChainInfos = (yield this.getSuggestedChainInfos())
                .filter((chainInfo) => {
                // Filter the overlaped chain info with the embeded chain infos.
                return !embedChainInfoIdentifierMap.get(cosmos_1.ChainIdHelper.parse(chainInfo.chainId).identifier);
            })
                .map((chainInfo) => {
                return Object.assign(Object.assign({}, chainInfo), { embeded: false });
            });
            let result = chainInfos.concat(suggestedChainInfos);
            // Set the updated property of the chain.
            result = yield Promise.all(result.map((chainInfo) => __awaiter(this, void 0, void 0, function* () {
                const updated = yield this.chainUpdaterService.putUpdatedPropertyToChainInfo(chainInfo);
                return Object.assign(Object.assign({}, updated), { embeded: chainInfo.embeded });
            })));
            this.cachedChainInfos = result;
            return result;
        }));
        if (experimentalOptions === null || experimentalOptions === void 0 ? void 0 : experimentalOptions.useMemoryKVStoreForSuggestChain) {
            this.kvStoreForSuggestChain = new common_1.MemoryKVStore("suggest-chain");
        }
        else {
            this.kvStoreForSuggestChain = kvStore;
        }
    }
    init(chainUpdaterService, interactionService, permissionService) {
        this.chainUpdaterService = chainUpdaterService;
        this.interactionService = interactionService;
        this.permissionService = permissionService;
    }
    clearCachedChainInfos() {
        this.cachedChainInfos = undefined;
    }
    getChainInfo(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = (yield this.getChainInfos()).find((chainInfo) => {
                return (cosmos_1.ChainIdHelper.parse(chainInfo.chainId).identifier ===
                    cosmos_1.ChainIdHelper.parse(chainId).identifier);
            });
            if (!chainInfo) {
                throw new router_1.KeplrError("chains", 411, `There is no chain info for ${chainId}`);
            }
            return chainInfo;
        });
    }
    getChainCoinType(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.getChainInfo(chainId);
            if (!chainInfo) {
                throw new router_1.KeplrError("chains", 411, `There is no chain info for ${chainId}`);
            }
            return chainInfo.bip44.coinType;
        });
    }
    hasChainInfo(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield this.getChainInfos()).find((chainInfo) => {
                return (cosmos_1.ChainIdHelper.parse(chainInfo.chainId).identifier ===
                    cosmos_1.ChainIdHelper.parse(chainId).identifier);
            }) != null);
        });
    }
    suggestChainInfo(env, chainInfo, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            chainInfo = yield types_1.ChainInfoSchema.validateAsync(chainInfo, {
                stripUnknown: true,
            });
            yield this.interactionService.waitApprove(env, "/suggest-chain", messages_1.SuggestChainInfoMsg.type(), Object.assign(Object.assign({}, chainInfo), { origin }));
            yield this.permissionService.addPermission([chainInfo.chainId], permission_1.getBasicAccessPermissionType(), [origin]);
            yield this.addChainInfo(chainInfo);
        });
    }
    getSuggestedChainInfos() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return ((_a = (yield this.kvStoreForSuggestChain.get("chain-infos"))) !== null && _a !== void 0 ? _a : []);
        });
    }
    addChainInfo(chainInfo) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.hasChainInfo(chainInfo.chainId)) {
                throw new router_1.KeplrError("chains", 121, "Same chain is already registered");
            }
            const savedChainInfos = (_a = (yield this.kvStoreForSuggestChain.get("chain-infos"))) !== null && _a !== void 0 ? _a : [];
            savedChainInfos.push(chainInfo);
            yield this.kvStoreForSuggestChain.set("chain-infos", savedChainInfos);
            this.clearCachedChainInfos();
        });
    }
    removeChainInfo(chainId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.hasChainInfo(chainId))) {
                throw new router_1.KeplrError("chains", 120, "Chain is not registered");
            }
            if ((yield this.getChainInfo(chainId)).embeded) {
                throw new router_1.KeplrError("chains", 122, "Can't remove the embedded chain");
            }
            const savedChainInfos = (_a = (yield this.kvStoreForSuggestChain.get("chain-infos"))) !== null && _a !== void 0 ? _a : [];
            const resultChainInfo = savedChainInfos.filter((chainInfo) => {
                return (cosmos_1.ChainIdHelper.parse(chainInfo.chainId).identifier !==
                    cosmos_1.ChainIdHelper.parse(chainId).identifier);
            });
            yield this.kvStoreForSuggestChain.set("chain-infos", resultChainInfo);
            // Clear the updated chain info.
            yield this.chainUpdaterService.clearUpdatedProperty(chainId);
            for (const chainRemovedHandler of this.onChainRemovedHandlers) {
                chainRemovedHandler(chainId, cosmos_1.ChainIdHelper.parse(chainId).identifier);
            }
            this.clearCachedChainInfos();
        });
    }
    getChainEthereumKeyFeatures(chainId) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.getChainInfo(chainId);
            return {
                address: (_b = (_a = chainInfo.features) === null || _a === void 0 ? void 0 : _a.includes("eth-address-gen")) !== null && _b !== void 0 ? _b : false,
                signing: (_d = (_c = chainInfo.features) === null || _c === void 0 ? void 0 : _c.includes("eth-key-sign")) !== null && _d !== void 0 ? _d : false,
            };
        });
    }
    addChainRemovedHandler(handler) {
        this.onChainRemovedHandlers.push(handler);
    }
}
exports.ChainsService = ChainsService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 521:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainInfoSchema = exports.SuggestingBIP44Schema = exports.Bech32ConfigSchema = exports.FeeCurrencySchema = exports.Secret20CurrencySchema = exports.CW20CurrencySchema = exports.CurrencySchema = void 0;
const router_1 = __webpack_require__(3);
const joi_1 = __importDefault(__webpack_require__(41));
exports.CurrencySchema = joi_1.default.object({
    coinDenom: joi_1.default.string().required(),
    coinMinimalDenom: joi_1.default.string().required(),
    coinDecimals: joi_1.default.number().integer().min(0).max(18).required(),
    coinGeckoId: joi_1.default.string(),
    coinImageUrl: joi_1.default.string().uri(),
});
exports.CW20CurrencySchema = exports.CurrencySchema
    .keys({
    type: joi_1.default.string().equal("cw20").required(),
    contractAddress: joi_1.default.string().required(),
})
    .custom((value) => {
    if (value.coinMinimalDenom.startsWith(`${value.type}:${value.contractAddress}:`)) {
        return value;
    }
    else {
        return Object.assign(Object.assign({}, value), { coinMinimalDenom: `${value.type}:${value.contractAddress}:` + value.coinMinimalDenom });
    }
});
exports.Secret20CurrencySchema = exports.CurrencySchema
    .keys({
    type: joi_1.default.string().equal("secret20").required(),
    contractAddress: joi_1.default.string().required(),
    viewingKey: joi_1.default.string().required(),
})
    .custom((value) => {
    if (value.coinMinimalDenom.startsWith(`${value.type}:${value.contractAddress}:`)) {
        return value;
    }
    else {
        return Object.assign(Object.assign({}, value), { coinMinimalDenom: `${value.type}:${value.contractAddress}:` + value.coinMinimalDenom });
    }
});
const GasPriceStepSchema = joi_1.default.object({
    low: joi_1.default.number().required(),
    average: joi_1.default.number().required(),
    high: joi_1.default.number().required(),
}).custom((value) => {
    if (value.low > value.average) {
        throw new Error("Low gas price step can not be greater than average");
    }
    if (value.average > value.high) {
        throw new Error("Average gas price step can not be greater than high");
    }
    return value;
});
exports.FeeCurrencySchema = exports.CurrencySchema.keys({
    gasPriceStep: GasPriceStepSchema,
});
exports.Bech32ConfigSchema = joi_1.default.object({
    bech32PrefixAccAddr: joi_1.default.string().required(),
    bech32PrefixAccPub: joi_1.default.string().required(),
    bech32PrefixValAddr: joi_1.default.string().required(),
    bech32PrefixValPub: joi_1.default.string().required(),
    bech32PrefixConsAddr: joi_1.default.string().required(),
    bech32PrefixConsPub: joi_1.default.string().required(),
});
exports.SuggestingBIP44Schema = joi_1.default.object({
    coinType: joi_1.default.number().integer().min(0).required(),
}).unknown(true);
exports.ChainInfoSchema = joi_1.default.object({
    rpc: joi_1.default.string().required().uri(),
    // TODO: Handle rpc config.
    rest: joi_1.default.string().required().uri(),
    // TODO: Handle rest config.
    chainId: joi_1.default.string().required().min(1).max(30),
    chainName: joi_1.default.string().required().min(1).max(30),
    stakeCurrency: exports.CurrencySchema.required(),
    walletUrl: joi_1.default.string().uri(),
    walletUrlForStaking: joi_1.default.string().uri(),
    bip44: exports.SuggestingBIP44Schema.required(),
    bech32Config: exports.Bech32ConfigSchema.required(),
    currencies: joi_1.default.array()
        .min(1)
        .items(exports.CurrencySchema, exports.CW20CurrencySchema, exports.Secret20CurrencySchema)
        .custom((values) => {
        const dups = {};
        for (const val of values) {
            if (dups[val.coinMinimalDenom]) {
                throw new Error(`${val.coinMinimalDenom} is duplicated`);
            }
            dups[val.coinMinimalDenom] = true;
        }
        return values;
    })
        .required(),
    feeCurrencies: joi_1.default.array()
        .min(1)
        .items(exports.FeeCurrencySchema)
        .custom((values) => {
        const dups = {};
        for (const val of values) {
            if (dups[val.coinMinimalDenom]) {
                throw new Error(`${val.coinMinimalDenom} is duplicated`);
            }
            dups[val.coinMinimalDenom] = true;
        }
        return values;
    })
        .required(),
    coinType: joi_1.default.number().integer(),
    beta: joi_1.default.boolean(),
    features: joi_1.default.array()
        .items(joi_1.default.string().valid("stargate", "cosmwasm", "wasmd_0.24+", "secretwasm", "ibc-transfer", "no-legacy-stdTx", "ibc-go", "eth-address-gen", "eth-key-sign", "query:/cosmos/bank/v1beta1/spendable_balances", "axelar-evm-bridge", "osmosis-txfees"))
        .unique()
        .custom((value) => {
        if (value.indexOf("cosmwasm") >= 0 && value.indexOf("secretwasm") >= 0) {
            throw new router_1.KeplrError("chains", 430, "cosmwasm and secretwasm are not compatible");
        }
        return value;
    }),
});
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "chains";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 523:
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
__exportStar(__webpack_require__(524), exports);
__exportStar(__webpack_require__(525), exports);
__exportStar(__webpack_require__(334), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 524:
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
exports.PermissionService = void 0;
const router_1 = __webpack_require__(3);
const types_1 = __webpack_require__(525);
const cosmos_1 = __webpack_require__(16);
class PermissionService {
    constructor(kvStore, privilegedOrigins) {
        this.kvStore = kvStore;
        this.permissionMap = {};
        this.privilegedOrigins = new Map();
        this.onChainRemoved = (chainId) => {
            this.removeAllPermissions(chainId);
        };
        for (const origin of privilegedOrigins) {
            this.privilegedOrigins.set(origin, true);
        }
        this.restore();
    }
    init(interactionService, chainsService, keyRingService) {
        this.interactionService = interactionService;
        this.chainsService = chainsService;
        this.keyRingService = keyRingService;
        this.chainsService.addChainRemovedHandler(this.onChainRemoved);
    }
    checkOrGrantBasicAccessPermission(env, chainIds, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to unlock the key ring before checking or granting the basic permission.
            yield this.keyRingService.enable(env);
            if (typeof chainIds === "string") {
                chainIds = [chainIds];
            }
            const ungrantedChainIds = [];
            for (const chainId of chainIds) {
                if (!this.hasPermisson(chainId, types_1.getBasicAccessPermissionType(), origin)) {
                    ungrantedChainIds.push(chainId);
                }
            }
            if (ungrantedChainIds.length > 0) {
                yield this.grantBasicAccessPermission(env, ungrantedChainIds, [origin]);
            }
            yield this.checkBasicAccessPermission(env, chainIds, origin);
        });
    }
    grantPermission(env, url, chainIds, type, origins) {
        return __awaiter(this, void 0, void 0, function* () {
            if (env.isInternalMsg) {
                return;
            }
            const permissionData = {
                chainIds,
                type,
                origins,
            };
            yield this.interactionService.waitApprove(env, url, types_1.INTERACTION_TYPE_PERMISSION, permissionData);
            yield this.addPermission(chainIds, type, origins);
        });
    }
    grantBasicAccessPermission(env, chainIds, origins) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const chainId of chainIds) {
                // Make sure that the chain info is registered.
                yield this.chainsService.getChainInfo(chainId);
            }
            yield this.grantPermission(env, "/access", chainIds, types_1.getBasicAccessPermissionType(), origins);
        });
    }
    checkPermission(env, chainId, type, origin) {
        if (env.isInternalMsg) {
            return;
        }
        if (!this.hasPermisson(chainId, type, origin)) {
            throw new router_1.KeplrError("permission", 130, `${origin} is not permitted`);
        }
    }
    checkBasicAccessPermission(env, chainIds, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const chainId of chainIds) {
                // Make sure that the chain info is registered.
                yield this.chainsService.getChainInfo(chainId);
                this.checkPermission(env, chainId, types_1.getBasicAccessPermissionType(), origin);
            }
        });
    }
    hasPermisson(chainId, type, origin) {
        // Privileged origin can pass the any permission.
        if (this.privilegedOrigins.get(origin)) {
            return true;
        }
        const permissionsInChain = this.permissionMap[cosmos_1.ChainIdHelper.parse(chainId).identifier];
        if (!permissionsInChain) {
            return false;
        }
        const innerMap = permissionsInChain[type];
        return !(!innerMap || !innerMap[origin]);
    }
    getPermissionOrigins(chainId, type) {
        const origins = [];
        const permissionsInChain = this.permissionMap[cosmos_1.ChainIdHelper.parse(chainId).identifier];
        if (!permissionsInChain) {
            return [];
        }
        const innerMap = permissionsInChain[type];
        if (!innerMap) {
            return [];
        }
        for (const origin of Object.keys(innerMap)) {
            if (innerMap[origin]) {
                origins.push(origin);
            }
        }
        return origins;
    }
    getOriginPermittedChains(origin, type) {
        var _a;
        const chains = [];
        for (const chain of Object.keys(this.permissionMap)) {
            const permissionInChain = this.permissionMap[chain];
            const originMap = (_a = (permissionInChain ? permissionInChain[type] : undefined)) !== null && _a !== void 0 ? _a : {};
            for (const _origin of Object.keys(originMap)) {
                if (_origin === origin && originMap[_origin]) {
                    chains.push(chain);
                }
            }
        }
        return chains;
    }
    addPermission(chainIds, type, origins) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const chainId of chainIds) {
                let permissionsInChain = this.permissionMap[cosmos_1.ChainIdHelper.parse(chainId).identifier];
                if (!permissionsInChain) {
                    permissionsInChain = {};
                    this.permissionMap[cosmos_1.ChainIdHelper.parse(chainId).identifier] = permissionsInChain;
                }
                let innerMap = permissionsInChain[type];
                if (!innerMap) {
                    innerMap = {};
                    permissionsInChain[type] = innerMap;
                }
                for (const origin of origins) {
                    innerMap[origin] = true;
                }
            }
            yield this.save();
        });
    }
    removePermission(chainId, type, origins) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionsInChain = this.permissionMap[cosmos_1.ChainIdHelper.parse(chainId).identifier];
            if (!permissionsInChain) {
                return;
            }
            const innerMap = permissionsInChain[type];
            if (!innerMap) {
                return;
            }
            for (const origin of origins) {
                delete innerMap[origin];
            }
            yield this.save();
        });
    }
    removeAllPermissions(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.permissionMap[cosmos_1.ChainIdHelper.parse(chainId).identifier] = undefined;
            yield this.save();
        });
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            const map = yield this.kvStore.get("permissionMap");
            if (map) {
                this.permissionMap = map;
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set("permissionMap", this.permissionMap);
        });
    }
}
exports.PermissionService = PermissionService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isBasicAccessPermissionType = exports.getBasicAccessPermissionType = exports.INTERACTION_TYPE_PERMISSION = void 0;
exports.INTERACTION_TYPE_PERMISSION = "permission";
function getBasicAccessPermissionType() {
    return "basic-access";
}
exports.getBasicAccessPermissionType = getBasicAccessPermissionType;
function isBasicAccessPermissionType(type) {
    return type === getBasicAccessPermissionType();
}
exports.isBasicAccessPermissionType = isBasicAccessPermissionType;
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "permission";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 527:
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
exports.KeyRingService = void 0;
const keyring_1 = __webpack_require__(229);
const cosmos_1 = __webpack_require__(16);
const common_1 = __webpack_require__(27);
const types_1 = __webpack_require__(96);
const router_1 = __webpack_require__(3);
const tx_1 = __webpack_require__(100);
const long_1 = __importDefault(__webpack_require__(7));
const buffer_1 = __webpack_require__(4);
const amino_sign_doc_1 = __webpack_require__(1040);
class KeyRingService {
    constructor(kvStore, embedChainInfos, crypto) {
        this.kvStore = kvStore;
        this.embedChainInfos = embedChainInfos;
        this.crypto = crypto;
        this.onChainRemoved = (chainId) => {
            this.keyRing.removeAllKeyStoreCoinType(chainId);
        };
    }
    init(interactionService, chainsService, permissionService, misesService) {
        this.interactionService = interactionService;
        this.chainsService = chainsService;
        this.permissionService = permissionService;
        this.keyRing = new keyring_1.KeyRing(this.embedChainInfos, this.kvStore, this.crypto, misesService);
        this.chainsService.addChainRemovedHandler(this.onChainRemoved);
    }
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keyRing.restore();
            return {
                status: this.keyRing.status,
                multiKeyStoreInfo: this.keyRing.getMultiKeyStoreInfo(),
            };
        });
    }
    enable(env) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyRing.status === keyring_1.KeyRingStatus.NOTLOADED) {
                yield this.keyRing.restore();
            }
            if (this.keyRing.status === keyring_1.KeyRingStatus.EMPTY) {
                yield this.interactionService.waitApprove(env, "/register", "register", {});
                return this.keyRing.status;
            }
            if ([keyring_1.KeyRingStatus.LOCKED, keyring_1.KeyRingStatus.MIGRATOR].includes(this.keyRing.status)) {
                console.log("unlock", env);
                yield this.interactionService.waitApprove(env, "/unlock", "unlock", {});
                return this.keyRing.status;
            }
            return this.keyRing.status;
        });
    }
    get keyRingStatus() {
        return this.keyRing.status;
    }
    deleteKeyRing(index, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let keyStoreChanged = false;
            try {
                const result = yield this.keyRing.deleteKeyRing(index, password);
                keyStoreChanged = result.keyStoreChanged;
                return {
                    multiKeyStoreInfo: result.multiKeyStoreInfo,
                    status: this.keyRing.status,
                };
            }
            finally {
                if (keyStoreChanged) {
                    this.interactionService.dispatchEvent(router_1.WEBPAGE_PORT, "keystore-changed", {});
                }
            }
        });
    }
    updateNameKeyRing(index, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const multiKeyStoreInfo = yield this.keyRing.updateNameKeyRing(index, name);
            return {
                multiKeyStoreInfo,
            };
        });
    }
    showKeyRing(index, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.showKeyRing(index, password);
        });
    }
    createMnemonicKey(kdf, mnemonic, password, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Check mnemonic checksum.
            return yield this.keyRing.createMnemonicKey(kdf, mnemonic, password, meta, bip44HDPath);
        });
    }
    createPrivateKey(kdf, privateKey, password, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.createPrivateKey(kdf, privateKey, password, meta);
        });
    }
    lock() {
        this.keyRing.lock();
        return this.keyRing.status;
    }
    unlock(password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keyRing.unlock(password);
            return this.keyRing.status;
        });
    }
    getKey(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            return this.keyRing.getKey(chainId, yield this.chainsService.getChainCoinType(chainId), ethereumKeyFeatures.address);
        });
    }
    getKeyStoreMeta(key) {
        return this.keyRing.getKeyStoreMeta(key);
    }
    getKeyRingType() {
        return this.keyRing.type;
    }
    requestSignAmino(env, msgOrigin, chainId, signer, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            signDoc = Object.assign(Object.assign({}, signDoc), { memo: common_1.escapeHTML(signDoc.memo) });
            signDoc = amino_sign_doc_1.trimAminoSignDoc(signDoc);
            signDoc = common_1.sortObjectByKey(signDoc);
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Prefix = (yield this.chainsService.getChainInfo(chainId))
                .bech32Config.bech32PrefixAccAddr;
            const bech32Address = new cosmos_1.Bech32Address(key.address).toBech32(bech32Prefix);
            if (signer !== bech32Address) {
                throw new router_1.KeplrError("keyring", 231, "Signer mismatched");
            }
            const isADR36SignDoc = cosmos_1.checkAndValidateADR36AminoSignDoc(signDoc, bech32Prefix);
            if (isADR36SignDoc) {
                if (signDoc.msgs[0].value.signer !== signer) {
                    throw new router_1.KeplrError("keyring", 233, "Unmatched signer in sign doc");
                }
            }
            if (signOptions.isADR36WithString != null && !isADR36SignDoc) {
                throw new router_1.KeplrError("keyring", 236, 'Sign doc is not for ADR-36. But, "isADR36WithString" option is defined');
            }
            if (signOptions.ethSignType && !isADR36SignDoc) {
                throw new Error("Eth sign type can be requested with only ADR-36 amino sign doc");
            }
            let newSignDoc = (yield this.interactionService.waitApprove(env, "/sign", "request-sign", {
                msgOrigin,
                chainId,
                mode: "amino",
                signDoc,
                signer,
                signOptions,
                isADR36SignDoc,
                isADR36WithString: signOptions.isADR36WithString,
                ethSignType: signOptions.ethSignType,
            }));
            newSignDoc = Object.assign(Object.assign({}, newSignDoc), { memo: common_1.escapeHTML(newSignDoc.memo) });
            if (isADR36SignDoc) {
                // Validate the new sign doc, if it was for ADR-36.
                if (cosmos_1.checkAndValidateADR36AminoSignDoc(signDoc, bech32Prefix)) {
                    if (signDoc.msgs[0].value.signer !== signer) {
                        throw new router_1.KeplrError("keyring", 232, "Unmatched signer in new sign doc");
                    }
                }
                else {
                    throw new router_1.KeplrError("keyring", 237, "Signing request was for ADR-36. But, accidentally, new sign doc is not for ADR-36");
                }
            }
            // Handle Ethereum signing
            if (signOptions.ethSignType) {
                if (newSignDoc.msgs.length !== 1) {
                    // Validate number of messages
                    throw new Error("Invalid number of messages for Ethereum sign request");
                }
                const signBytes = buffer_1.Buffer.from(newSignDoc.msgs[0].value.data, "base64");
                try {
                    const signatureBytes = yield this.keyRing.signEthereum(env, chainId, coinType, signBytes, signOptions.ethSignType);
                    return {
                        signed: newSignDoc,
                        signature: {
                            pub_key: cosmos_1.encodeSecp256k1Pubkey(key.pubKey),
                            signature: buffer_1.Buffer.from(signatureBytes).toString("base64"),
                        },
                    };
                }
                finally {
                    this.interactionService.dispatchEvent(router_1.APP_PORT, "request-sign-end", {});
                }
            }
            try {
                const signature = yield this.keyRing.sign(env, chainId, coinType, cosmos_1.serializeSignDoc(newSignDoc), ethereumKeyFeatures.signing);
                return {
                    signed: newSignDoc,
                    signature: cosmos_1.encodeSecp256k1Signature(key.pubKey, signature),
                };
            }
            finally {
                this.interactionService.dispatchEvent(router_1.APP_PORT, "request-sign-end", {});
            }
        });
    }
    requestSignEIP712CosmosTx_v0(env, msgOrigin, chainId, signer, eip712, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            signDoc = Object.assign(Object.assign({}, signDoc), { memo: common_1.escapeHTML(signDoc.memo) });
            signDoc = amino_sign_doc_1.trimAminoSignDoc(signDoc);
            signDoc = common_1.sortObjectByKey(signDoc);
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Prefix = (yield this.chainsService.getChainInfo(chainId))
                .bech32Config.bech32PrefixAccAddr;
            const bech32Address = new cosmos_1.Bech32Address(key.address).toBech32(bech32Prefix);
            if (signer !== bech32Address) {
                throw new router_1.KeplrError("keyring", 231, "Signer mismatched");
            }
            let newSignDoc = (yield this.interactionService.waitApprove(env, "/sign", "request-sign", {
                msgOrigin,
                chainId,
                mode: "amino",
                signDoc,
                signer,
                signOptions,
                isADR36SignDoc: false,
                ethSignType: types_1.EthSignType.EIP712,
            }));
            newSignDoc = Object.assign(Object.assign({}, newSignDoc), { memo: common_1.escapeHTML(newSignDoc.memo) });
            try {
                const signature = yield this.keyRing.signEthereum(env, chainId, coinType, buffer_1.Buffer.from(JSON.stringify({
                    types: eip712.types,
                    domain: eip712.domain,
                    primaryType: eip712.primaryType,
                    message: newSignDoc,
                })), types_1.EthSignType.EIP712);
                return {
                    signed: newSignDoc,
                    signature: {
                        pub_key: cosmos_1.encodeSecp256k1Pubkey(key.pubKey),
                        // Return eth signature (r | s | v) 65 bytes.
                        signature: buffer_1.Buffer.from(signature).toString("base64"),
                    },
                };
            }
            finally {
                this.interactionService.dispatchEvent(router_1.APP_PORT, "request-sign-end", {});
            }
        });
    }
    requestSignDirect(env, msgOrigin, chainId, signer, signDoc, signOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Address = new cosmos_1.Bech32Address(key.address).toBech32((yield this.chainsService.getChainInfo(chainId)).bech32Config
                .bech32PrefixAccAddr);
            if (signer !== bech32Address) {
                throw new router_1.KeplrError("keyring", 231, "Signer mismatched");
            }
            const newSignDocBytes = (yield this.interactionService.waitApprove(env, "/sign", "request-sign", {
                msgOrigin,
                chainId,
                mode: "direct",
                signDocBytes: tx_1.SignDoc.encode(signDoc).finish(),
                signer,
                signOptions,
            }));
            const newSignDoc = tx_1.SignDoc.decode(newSignDocBytes);
            try {
                const signature = yield this.keyRing.sign(env, chainId, coinType, newSignDocBytes, ethereumKeyFeatures.signing);
                return {
                    signed: Object.assign(Object.assign({}, newSignDoc), { accountNumber: long_1.default.fromString(newSignDoc.accountNumber) }),
                    signature: cosmos_1.encodeSecp256k1Signature(key.pubKey, signature),
                };
            }
            finally {
                this.interactionService.dispatchEvent(router_1.APP_PORT, "request-sign-end", {});
            }
        });
    }
    verifyADR36AminoSignDoc(chainId, signer, data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Prefix = (yield this.chainsService.getChainInfo(chainId))
                .bech32Config.bech32PrefixAccAddr;
            const bech32Address = new cosmos_1.Bech32Address(key.address).toBech32(bech32Prefix);
            if (signer !== bech32Address) {
                throw new router_1.KeplrError("keyring", 231, "Signer mismatched");
            }
            if (signature.pub_key.type !== "tendermint/PubKeySecp256k1") {
                throw new router_1.KeplrError("keyring", 211, `Unsupported type of pub key: ${signature.pub_key.type}`);
            }
            if (buffer_1.Buffer.from(key.pubKey).toString("base64") !== signature.pub_key.value) {
                throw new router_1.KeplrError("keyring", 210, "Pub key unmatched");
            }
            const signDoc = cosmos_1.makeADR36AminoSignDoc(signer, data);
            return cosmos_1.verifyADR36AminoSignDoc(bech32Prefix, signDoc, buffer_1.Buffer.from(signature.pub_key.value, "base64"), buffer_1.Buffer.from(signature.signature, "base64"));
        });
    }
    sign(env, chainId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.keyRing.sign(env, chainId, yield this.chainsService.getChainCoinType(chainId), message, (yield this.chainsService.getChainEthereumKeyFeatures(chainId)).signing);
        });
    }
    addMnemonicKey(kdf, mnemonic, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.keyRing.addMnemonicKey(kdf, mnemonic, meta, bip44HDPath);
        });
    }
    addPrivateKey(kdf, privateKey, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.keyRing.addPrivateKey(kdf, privateKey, meta);
        });
    }
    changeKeyStoreFromMultiKeyStore(index) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.keyRing.changeKeyStoreFromMultiKeyStore(index);
            }
            finally {
                this.interactionService.dispatchEvent(router_1.WEBPAGE_PORT, "keystore-changed", {});
            }
        });
    }
    checkPassword(password) {
        return this.keyRing.checkPassword(password);
    }
    getMultiKeyStoreInfo() {
        return this.keyRing.getMultiKeyStoreInfo();
    }
    isKeyStoreCoinTypeSet(chainId) {
        return this.keyRing.isKeyStoreCoinTypeSet(chainId);
    }
    setKeyStoreCoinType(chainId, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevCoinType = this.keyRing.computeKeyStoreCoinType(chainId, yield this.chainsService.getChainCoinType(chainId));
            yield this.keyRing.setKeyStoreCoinType(chainId, coinType);
            if (prevCoinType !== coinType) {
                this.interactionService.dispatchEvent(router_1.WEBPAGE_PORT, "keystore-changed", {});
            }
        });
    }
    getKeyStoreBIP44Selectables(chainId, paths) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isKeyStoreCoinTypeSet(chainId)) {
                return [];
            }
            const result = [];
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            for (const path of paths) {
                const key = yield this.keyRing.getKeyFromCoinType(path.coinType, (yield this.chainsService.getChainEthereumKeyFeatures(chainId)).address);
                const bech32Address = new cosmos_1.Bech32Address(key.address).toBech32(chainInfo.bech32Config.bech32PrefixAccAddr);
                result.push({
                    path,
                    bech32Address,
                });
            }
            return result;
        });
    }
    exportKeyRingDatas(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.exportKeyRingDatas(password);
        });
    }
    addAccount(name, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.addAccount(name, bip44HDPath);
        });
    }
    migratorKeyRing(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.migratorKeyRing(password);
        });
    }
    restoreKeyStore() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.restoreKeyStore();
        });
    }
}
exports.KeyRingService = KeyRingService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 528:
/***/ (function(module, exports) {

var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs

module.exports = function (iterations, keylen) {
  if (typeof iterations !== 'number') {
    throw new TypeError('Iterations not a number')
  }

  if (iterations < 0) {
    throw new TypeError('Bad iterations')
  }

  if (typeof keylen !== 'number') {
    throw new TypeError('Key length not a number')
  }

  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) { /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length')
  }
}


/***/ }),

/***/ 529:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {var defaultEncoding
/* istanbul ignore next */
if (global.process && global.process.browser) {
  defaultEncoding = 'utf-8'
} else if (global.process && global.process.version) {
  var pVersionMajor = parseInt(process.version.split('.')[0].slice(1), 10)

  defaultEncoding = pVersionMajor >= 6 ? 'utf-8' : 'binary'
} else {
  defaultEncoding = 'utf-8'
}
module.exports = defaultEncoding

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11), __webpack_require__(28)))

/***/ }),

/***/ 530:
/***/ (function(module, exports, __webpack_require__) {

var md5 = __webpack_require__(291)
var RIPEMD160 = __webpack_require__(144)
var sha = __webpack_require__(124)
var Buffer = __webpack_require__(22).Buffer

var checkParameters = __webpack_require__(528)
var defaultEncoding = __webpack_require__(529)
var toBuffer = __webpack_require__(531)

var ZEROS = Buffer.alloc(128)
var sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
}

function Hmac (alg, key, saltLen) {
  var hash = getDigest(alg)
  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  if (key.length > blocksize) {
    key = hash(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = Buffer.allocUnsafe(blocksize + sizes[alg])
  var opad = Buffer.allocUnsafe(blocksize + sizes[alg])
  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  var ipad1 = Buffer.allocUnsafe(blocksize + saltLen + 4)
  ipad.copy(ipad1, 0, 0, blocksize)
  this.ipad1 = ipad1
  this.ipad2 = ipad
  this.opad = opad
  this.alg = alg
  this.blocksize = blocksize
  this.hash = hash
  this.size = sizes[alg]
}

Hmac.prototype.run = function (data, ipad) {
  data.copy(ipad, this.blocksize)
  var h = this.hash(ipad)
  h.copy(this.opad, this.blocksize)
  return this.hash(this.opad)
}

function getDigest (alg) {
  function shaFunc (data) {
    return sha(alg).update(data).digest()
  }
  function rmd160Func (data) {
    return new RIPEMD160().update(data).digest()
  }

  if (alg === 'rmd160' || alg === 'ripemd160') return rmd160Func
  if (alg === 'md5') return md5
  return shaFunc
}

function pbkdf2 (password, salt, iterations, keylen, digest) {
  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')

  digest = digest || 'sha1'

  var hmac = new Hmac(digest, password, salt.length)

  var DK = Buffer.allocUnsafe(keylen)
  var block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  var destPos = 0
  var hLen = sizes[digest]
  var l = Math.ceil(keylen / hLen)

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

    var T = hmac.run(block1, hmac.ipad1)
    var U = T

    for (var j = 1; j < iterations; j++) {
      U = hmac.run(U, hmac.ipad2)
      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    T.copy(DK, destPos)
    destPos += hLen
  }

  return DK
}

module.exports = pbkdf2


/***/ }),

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(22).Buffer

module.exports = function (thing, encoding, name) {
  if (Buffer.isBuffer(thing)) {
    return thing
  } else if (typeof thing === 'string') {
    return Buffer.from(thing, encoding)
  } else if (ArrayBuffer.isView(thing)) {
    return Buffer.from(thing.buffer)
  } else {
    throw new TypeError(name + ' must be a string, a Buffer, a typed array or a DataView')
  }
}


/***/ }),

/***/ 532:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIP712MessageValidator = exports.EIP712DomainTypeValidator = exports.EIP712PropertyFieldValidator = void 0;
const joi_1 = __importDefault(__webpack_require__(41));
// https://eips.ethereum.org/EIPS/eip-712
exports.EIP712PropertyFieldValidator = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    // TODO: Check valid types (string, bool, address, uint256...)
    type: joi_1.default.string().min(1).required(),
});
exports.EIP712DomainTypeValidator = joi_1.default.array()
    .items(joi_1.default.object({
    name: joi_1.default.string().valid("name").required(),
    type: joi_1.default.string().valid("string").required(),
}), joi_1.default.object({
    name: joi_1.default.string().valid("version").required(),
    type: joi_1.default.string().valid("string").required(),
}), joi_1.default.object({
    name: joi_1.default.string().valid("chainId").required(),
    type: joi_1.default.string().valid("uint256").required(),
}), joi_1.default.object({
    name: joi_1.default.string().valid("verifyingContract").required(),
    // From https://eips.ethereum.org/EIPS/eip-712, (string) may be non-standard?
    // But, ethermint set this type as string.
    type: joi_1.default.string().valid("address", "string").required(),
}), joi_1.default.object({
    name: joi_1.default.string().valid("salt").required(),
    // From https://eips.ethereum.org/EIPS/eip-712, (string) may be non-standard?
    // But, ethermint set this type as string.
    type: joi_1.default.string().valid("bytes32", "string").required(),
}))
    .unique()
    .min(1)
    .custom((value) => {
    // Sort by name
    const domainFieldNames = [
        "name",
        "version",
        "chainId",
        "verifyingContract",
        "salt",
    ];
    return value.sort((a, b) => {
        return (domainFieldNames.indexOf(a.name) - domainFieldNames.indexOf(b.name));
    });
});
exports.EIP712MessageValidator = joi_1.default.object({
    types: joi_1.default.object({
        EIP712Domain: exports.EIP712DomainTypeValidator.required(),
    })
        .unknown(true)
        .required(),
    primaryType: joi_1.default.string().min(1).required(),
    domain: joi_1.default.object().required(),
    message: joi_1.default.object().required(),
});
//# sourceMappingURL=eip712.js.map

/***/ }),

/***/ 533:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "keyring";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 534:
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
exports.BackgroundTxService = void 0;
const buffer_1 = __webpack_require__(4);
class BackgroundTxService {
    constructor(notification, misesService) {
        this.notification = notification;
        this.misesService = misesService;
    }
    init(chainsService, permissionService) {
        this.chainsService = chainsService;
        this.permissionService = permissionService;
    }
    sendTx(_chainId, tx, _mode) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(_mode);
            this.notification.create({
                iconRelativeUrl: "assets/logo-256.png",
                title: "Tx is pending...",
                message: "Wait a second",
            });
            try {
                const transactionHash = yield this.misesService.broadcastTx(tx);
                // if (txResponse.code != null && txResponse.code !== 0) {
                //   throw new Error(txResponse["rawLog"]);
                // }
                const txHash = buffer_1.Buffer.from(transactionHash, "hex");
                this.misesService.pollForTx(transactionHash).then((response) => {
                    BackgroundTxService.processTxResultNotification(this.notification, response);
                });
                return txHash;
            }
            catch (e) {
                console.log(e);
                BackgroundTxService.processTxErrorNotification(this.notification, e);
                throw e;
            }
        });
    }
    static processTxResultNotification(notification, result) {
        var _a;
        try {
            if (result.mode === "commit") {
                if (result.checkTx.code !== undefined && result.checkTx.code !== 0) {
                    throw new Error(result.checkTx.log);
                }
                if (result.deliverTx.code !== undefined &&
                    result.deliverTx.code !== 0) {
                    throw new Error(result.deliverTx.log);
                }
            }
            else {
                if (result.code != null && result.code !== 0) {
                    // XXX: Hack of the support of the stargate.
                    const log = (_a = result.log) !== null && _a !== void 0 ? _a : result["rawLog"];
                    throw new Error(log);
                }
            }
            notification.create({
                iconRelativeUrl: "assets/logo-256.png",
                title: "Tx succeeds",
                // TODO: Let users know the tx id?
                message: "Congratulations!",
            });
        }
        catch (e) {
            BackgroundTxService.processTxErrorNotification(notification, e);
        }
    }
    static processTxErrorNotification(notification, e) {
        console.log(e);
        let message = e.message;
        // Tendermint rpc error.
        const regResult = /code:\s*(-?\d+),\s*message:\s*(.+),\sdata:\s(.+)/g.exec(e.message);
        if (regResult && regResult.length === 4) {
            // If error is from tendermint
            message = regResult[3];
        }
        try {
            // Cosmos-sdk error in ante handler
            const sdkErr = JSON.parse(e.message);
            if (sdkErr === null || sdkErr === void 0 ? void 0 : sdkErr.message) {
                message = sdkErr.message;
            }
        }
        catch (_a) {
            // noop
        }
        try {
            // Cosmos-sdk error in processing message
            const abciMessageLogs = JSON.parse(e.message);
            if (abciMessageLogs && abciMessageLogs.length > 0) {
                for (const abciMessageLog of abciMessageLogs) {
                    if (!abciMessageLog.success) {
                        const sdkErr = JSON.parse(abciMessageLog.log);
                        if (sdkErr === null || sdkErr === void 0 ? void 0 : sdkErr.message) {
                            message = sdkErr.message;
                            break;
                        }
                    }
                }
            }
        }
        catch (_b) {
            // noop
        }
        notification.create({
            iconRelativeUrl: "assets/logo-256.png",
            title: "Tx failed",
            message,
        });
    }
}
exports.BackgroundTxService = BackgroundTxService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "background-tx";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 536:
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
exports.ChainUpdaterService = void 0;
const axios_1 = __importDefault(__webpack_require__(60));
const cosmos_1 = __webpack_require__(16);
const router_1 = __webpack_require__(3);
class ChainUpdaterService {
    constructor(kvStore) {
        this.kvStore = kvStore;
    }
    init(chainsService) {
        this.chainsService = chainsService;
    }
    putUpdatedPropertyToChainInfo(chainInfo) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProperty = yield this.getUpdatedChainProperty(chainInfo.chainId);
            const chainId = cosmos_1.ChainIdHelper.parse(chainInfo.chainId);
            const updatedChainId = cosmos_1.ChainIdHelper.parse(updatedProperty.chainId || chainInfo.chainId);
            // If the saved property is lesser than the current chain id, just ignore.
            if (updatedChainId.version < chainId.version) {
                return chainInfo;
            }
            const features = (_a = chainInfo.features) !== null && _a !== void 0 ? _a : [];
            for (const updatedFeature of (_b = updatedProperty.features) !== null && _b !== void 0 ? _b : []) {
                if (!features.includes(updatedFeature)) {
                    features.push(updatedFeature);
                }
            }
            return Object.assign(Object.assign({}, chainInfo), {
                chainId: updatedProperty.chainId || chainInfo.chainId,
                rpc: updatedProperty.rpc || chainInfo.rpc,
                rest: updatedProperty.rest || chainInfo.rest,
                features,
            });
        });
    }
    clearUpdatedProperty(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set(cosmos_1.ChainIdHelper.parse(chainId).identifier, null);
            this.chainsService.clearCachedChainInfos();
        });
    }
    tryUpdateChain(chainId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            // If chain id is not fomatted as {chainID}-{version},
            // there is no way to deal with the updated chain id.
            if (!cosmos_1.ChainIdHelper.hasChainVersion(chainInfo.chainId)) {
                return;
            }
            const updates = yield ChainUpdaterService.checkChainUpdate(chainInfo);
            if (updates.explicit || updates.slient) {
                const currentVersion = cosmos_1.ChainIdHelper.parse(chainInfo.chainId);
                if (updates.chainId) {
                    const fetchedChainId = updates.chainId;
                    const fetchedVersion = cosmos_1.ChainIdHelper.parse(fetchedChainId);
                    if (currentVersion.identifier === fetchedVersion.identifier &&
                        currentVersion.version < fetchedVersion.version) {
                        yield this.saveChainProperty(currentVersion.identifier, {
                            chainId: fetchedChainId,
                        });
                    }
                }
                if (updates.features && updates.features.length > 0) {
                    const savedChainProperty = yield this.getUpdatedChainProperty(chainInfo.chainId);
                    const updateFeatures = (_a = savedChainProperty.features) !== null && _a !== void 0 ? _a : [];
                    for (const feature of updates.features) {
                        if (!updateFeatures.includes(feature)) {
                            updateFeatures.push(feature);
                        }
                    }
                    yield this.saveChainProperty(currentVersion.identifier, {
                        features: updateFeatures,
                    });
                }
            }
        });
    }
    getUpdatedChainProperty(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const version = cosmos_1.ChainIdHelper.parse(chainId);
            return yield this.loadChainProperty(version.identifier);
        });
    }
    saveChainProperty(identifier, chainInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield this.loadChainProperty(identifier);
            yield this.kvStore.set(identifier, Object.assign(Object.assign({}, saved), chainInfo));
            this.chainsService.clearCachedChainInfos();
        });
    }
    loadChainProperty(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.kvStore.get(identifier);
            if (!chainInfo)
                return {};
            return chainInfo;
        });
    }
    /**
     * Returns wether the chain has been changed.
     * Currently, only check the chain id has been changed.
     * @param chainInfo Chain information.
     */
    static checkChainUpdate(chainInfo) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = chainInfo.chainId;
            // If chain id is not fomatted as {chainID}-{version},
            // there is no way to deal with the updated chain id.
            if (!cosmos_1.ChainIdHelper.hasChainVersion(chainId)) {
                return {
                    explicit: false,
                    slient: false,
                };
            }
            const instance = axios_1.default.create({
                baseURL: chainInfo.rpc,
            });
            // Get the status to get the chain id.
            const result = yield instance.get("/status");
            const resultChainId = result.data.result.node_info.network;
            const version = cosmos_1.ChainIdHelper.parse(chainId);
            const fetchedVersion = cosmos_1.ChainIdHelper.parse(resultChainId);
            // TODO: Should throw an error?
            if (version.identifier !== fetchedVersion.identifier) {
                return {
                    explicit: false,
                    slient: false,
                };
            }
            const restInstance = axios_1.default.create({
                baseURL: chainInfo.rest,
            });
            let ibcGoUpdates = false;
            try {
                if (!chainInfo.features || !chainInfo.features.includes("ibc-go")) {
                    // If the chain uses the ibc-go module separated from the cosmos-sdk,
                    // we need to check it because the REST API is different.
                    const result = yield restInstance.get("/ibc/apps/transfer/v1/params");
                    if (result.status === 200) {
                        ibcGoUpdates = true;
                    }
                }
            }
            catch (_b) { }
            let ibcTransferUpdate = false;
            try {
                if (!chainInfo.features || !chainInfo.features.includes("ibc-transfer")) {
                    const isIBCGo = ibcGoUpdates ||
                        (chainInfo.features && chainInfo.features.includes("ibc-go"));
                    // If the chain doesn't have the ibc transfer feature,
                    // try to fetch the params of ibc transfer module.
                    // assume that it can support the ibc transfer if the params return true, and try to update the features.
                    const result = yield restInstance.get(isIBCGo
                        ? "/ibc/apps/transfer/v1/params"
                        : "/ibc/applications/transfer/v1beta1/params");
                    if (result.data.params.receive_enabled &&
                        result.data.params.send_enabled) {
                        ibcTransferUpdate = true;
                    }
                }
            }
            catch (_c) { }
            let wasmd24Update = false;
            try {
                if (((_a = chainInfo.features) === null || _a === void 0 ? void 0 : _a.includes("cosmwasm")) &&
                    !chainInfo.features.includes("wasmd_0.24+")) {
                    // It is difficult to decide which contract address to test on each chain.
                    // So it simply sends a query that fails unconditionally.
                    // However, if 400 bad request instead of 501 occurs, the url itself exists.
                    // In this case, it is assumed that wasmd 0.24+ version.
                    const result = yield restInstance.get("/cosmwasm/wasm/v1/contract/test/smart/test", {
                        validateStatus: (status) => {
                            return status === 400 || status === 501;
                        },
                    });
                    if (result.status === 400) {
                        wasmd24Update = true;
                    }
                }
            }
            catch (_d) { }
            let querySpendableBalances = false;
            try {
                if (!chainInfo.features ||
                    !chainInfo.features.includes("query:/cosmos/bank/v1beta1/spendable_balances")) {
                    // It is difficult to decide which account to test on each chain.
                    // So it simply sends a query that fails unconditionally.
                    // However, if 400 bad request instead of 501 occurs, the url itself exists.
                    // In this case, it is assumed that we can query /cosmos/bank/v1beta1/spendable_balances/{account}
                    const result = yield restInstance.get("/cosmos/bank/v1beta1/spendable_balances/test", {
                        validateStatus: (status) => {
                            return status === 400 || status === 501;
                        },
                    });
                    if (result.status === 400) {
                        querySpendableBalances = true;
                    }
                }
            }
            catch (_e) { }
            const features = [];
            if (ibcGoUpdates) {
                features.push("ibc-go");
            }
            if (ibcTransferUpdate) {
                features.push("ibc-transfer");
            }
            if (wasmd24Update) {
                features.push("wasmd_0.24+");
            }
            if (querySpendableBalances) {
                features.push("query:/cosmos/bank/v1beta1/spendable_balances");
            }
            return {
                explicit: version.version < fetchedVersion.version,
                slient: features.length > 0,
                chainId: resultChainId,
                features,
            };
        });
    }
    // XXX: It is not conceptually valid that the function to set the rpc/rest endpoint of the chain exists in this service.
    //      However, in order to focus on adding feature rather than making a big change, the refactor is postponed later and the configuration of the rpc/rest endpoint is handled here.
    setChainEndpoints(chainId, rpc, rest) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = {};
            // `saveChainProperty` method merges chain info using spread operator.
            // That is, if the field is undefined, the field is finally saved as undefined and the field is treated as if it were deleted.
            // To avoid this problem, the field must not exist. The implementation of the below is critical to its operation.
            if (rpc) {
                chainInfo.rpc = rpc;
            }
            if (rest) {
                chainInfo.rest = rest;
            }
            const version = cosmos_1.ChainIdHelper.parse(chainId);
            yield this.saveChainProperty(version.identifier, chainInfo);
            return yield this.chainsService.getChainInfos();
        });
    }
    resetChainEndpoints(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const version = cosmos_1.ChainIdHelper.parse(chainId);
            // `saveChainProperty` method merges chain info using spread operator.
            // That is, if the field is undefined, the field is finally saved as undefined and the field is treated as if it were deleted.
            yield this.saveChainProperty(version.identifier, {
                rpc: undefined,
                rest: undefined,
            });
            return yield this.chainsService.getChainInfos();
        });
    }
    static checkEndpointsConnectivity(chainId, rpc, rest, wsObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const rpcInstance = axios_1.default.create({
                baseURL: rpc,
            });
            let resultStatus;
            try {
                // Get the status to get the chain id.
                resultStatus = yield rpcInstance.get("/status");
            }
            catch (e) {
                console.log(e);
                throw new Error("Failed to get response /status from rpc endpoint");
            }
            const version = cosmos_1.ChainIdHelper.parse(chainId);
            const versionFromRPCStatus = cosmos_1.ChainIdHelper.parse(resultStatus.data.result.node_info.network);
            if (versionFromRPCStatus.identifier !== version.identifier) {
                throw new router_1.KeplrError("updater", 8001, `RPC endpoint has different chain id (expected: ${chainId}, actual: ${resultStatus.data.result.node_info.network})`);
            }
            else if (versionFromRPCStatus.version !== version.version) {
                // In the form of {chain_identifier}-{chain_version}, if the identifier is the same but the version is different, it is strictly an error,
                // but it is actually the same chain but the chain version of the node is different.
                // In this case, it is possible to treat as a warning and proceed as it is, so this is separated with above error.
                throw new router_1.KeplrError("updater", 8002, `RPC endpoint has different chain id (expected: ${chainId}, actual: ${resultStatus.data.result.node_info.network})`);
            }
            let wsURL = rpc;
            if (wsURL.startsWith("http")) {
                wsURL = wsURL.replace("http", "ws");
            }
            wsURL = wsURL.endsWith("/") ? wsURL + "websocket" : wsURL + "/websocket";
            const wsInstance = wsObject ? new wsObject(wsURL) : new WebSocket(wsURL);
            // Try 15 times at 1 second intervals to test websocket connectivity.
            for (let i = 0; i < 15; i++) {
                // If ws state is not "connecting"
                if (wsInstance.readyState !== 0) {
                    // If ws state is "open", it means that app can connect ws to /websocket rpc
                    if (wsInstance.readyState === 1) {
                        break;
                    }
                    else {
                        // else, handle that as error.
                        throw new Error("Failed to connect websocket to /websocket rpc");
                    }
                }
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
            const restInstance = axios_1.default.create({
                baseURL: rest,
            });
            let resultLCDNodeInfo;
            try {
                // Get the node info to get the chain id.
                resultLCDNodeInfo = yield restInstance.get("/cosmos/base/tendermint/v1beta1/node_info");
            }
            catch (e) {
                console.log(e);
                throw new Error("Failed to get response /cosmos/base/tendermint/v1beta1/node_info from lcd endpoint");
            }
            const versionFromLCDNodeInfo = cosmos_1.ChainIdHelper.parse(resultLCDNodeInfo.data.default_node_info.network);
            if (versionFromLCDNodeInfo.identifier !== version.identifier) {
                throw new router_1.KeplrError("updater", 8101, `LCD endpoint has different chain id (expected: ${chainId}, actual: ${resultStatus.data.result.node_info.network})`);
            }
            else if (versionFromLCDNodeInfo.version !== version.version) {
                // In the form of {chain_identifier}-{chain_version}, if the identifier is the same but the version is different, it is strictly an error,
                // but it is actually the same chain but the chain version of the node is different.
                // In this case, it is possible to treat as a warning and proceed as it is, so this is separated with above error.
                throw new router_1.KeplrError("updater", 8102, `LCD endpoint has different chain id (expected: ${chainId}, actual: ${resultStatus.data.result.node_info.network})`);
            }
        });
    }
}
exports.ChainUpdaterService = ChainUpdaterService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 537:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "chain-updator";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 538:
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
exports.TokensService = void 0;
const router_1 = __webpack_require__(3);
const chains_1 = __webpack_require__(539);
const cosmos_1 = __webpack_require__(16);
const keyring_1 = __webpack_require__(339);
const buffer_1 = __webpack_require__(4);
const messages_1 = __webpack_require__(230);
const types_1 = __webpack_require__(541);
class TokensService {
    constructor(kvStore) {
        this.kvStore = kvStore;
        this.onChainRemoved = (chainId) => {
            this.clearTokens(chainId);
        };
    }
    init(interactionService, permissionService, chainsService, keyRingService) {
        this.interactionService = interactionService;
        this.permissionService = permissionService;
        this.chainsService = chainsService;
        this.keyRingService = keyRingService;
        this.chainsService.addChainRemovedHandler(this.onChainRemoved);
    }
    suggestToken(env, chainId, contractAddress, viewingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            const find = (yield this.getTokens(chainId)).find((currency) => "contractAddress" in currency &&
                currency.contractAddress === contractAddress);
            // If the same currency is already registered, do nothing.
            if (find) {
                // If the secret20 token,
                // just try to change the viewing key.
                if (viewingKey) {
                    if ("type" in find && find.type === "secret20") {
                        yield this.addToken(chainId, Object.assign(Object.assign({}, find), { viewingKey }));
                    }
                    return;
                }
                return;
            }
            // Validate the contract address.
            cosmos_1.Bech32Address.validate(contractAddress, chainInfo.bech32Config.bech32PrefixAccAddr);
            const params = {
                chainId,
                contractAddress,
                viewingKey,
            };
            const appCurrency = yield this.interactionService.waitApprove(env, "/setting/token/add", messages_1.SuggestTokenMsg.type(), params);
            yield this.addToken(chainId, appCurrency);
        });
    }
    addToken(chainId, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            currency = yield TokensService.validateCurrency(chainInfo, currency);
            const chainCurrencies = yield this.getTokens(chainId);
            const isTokenForAccount = "type" in currency && currency.type === "secret20";
            let isCurrencyUpdated = false;
            for (const chainCurrency of chainCurrencies) {
                if (currency.coinMinimalDenom === chainCurrency.coinMinimalDenom) {
                    if (!isTokenForAccount) {
                        // If currency is already registered, do nothing.
                        return;
                    }
                    isCurrencyUpdated = true;
                }
            }
            if (!isTokenForAccount) {
                const currencies = yield this.getTokensFromChain(chainId);
                currencies.push(currency);
                yield this.saveTokensToChain(chainId, currencies);
            }
            else {
                const currencies = yield this.getTokensFromChainAndAccount(chainId);
                if (!isCurrencyUpdated) {
                    currencies.push(currency);
                    yield this.saveTokensToChainAndAccount(chainId, currencies);
                }
                else {
                    const index = currencies.findIndex((cur) => cur.coinMinimalDenom === currency.coinMinimalDenom);
                    if (index >= 0) {
                        currencies[index] = currency;
                        yield this.saveTokensToChainAndAccount(chainId, currencies);
                    }
                }
            }
        });
    }
    removeToken(chainId, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            currency = yield TokensService.validateCurrency(chainInfo, currency);
            const chainCurrencies = yield this.getTokens(chainId);
            const isTokenForAccount = "type" in currency && currency.type === "secret20";
            let isFoundCurrency = false;
            for (const chainCurrency of chainCurrencies) {
                if (currency.coinMinimalDenom === chainCurrency.coinMinimalDenom) {
                    isFoundCurrency = true;
                    break;
                }
            }
            if (!isFoundCurrency) {
                return;
            }
            if (!isTokenForAccount) {
                const currencies = (yield this.getTokensFromChain(chainId)).filter((cur) => cur.coinMinimalDenom !== currency.coinMinimalDenom);
                yield this.saveTokensToChain(chainId, currencies);
            }
            else {
                const currencies = (yield this.getTokensFromChainAndAccount(chainId)).filter((cur) => cur.coinMinimalDenom !== currency.coinMinimalDenom);
                yield this.saveTokensToChainAndAccount(chainId, currencies);
            }
        });
    }
    getTokens(chainId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            const chainCurrencies = (_a = (yield this.kvStore.get(chainIdHelper.identifier))) !== null && _a !== void 0 ? _a : [];
            let keyCurrencies = [];
            if (this.keyRingService.keyRingStatus === keyring_1.KeyRingStatus.UNLOCKED) {
                const currentKey = yield this.keyRingService.getKey(chainId);
                keyCurrencies = (_b = (yield this.kvStore.get(`${chainIdHelper.identifier}-${buffer_1.Buffer.from(currentKey.address).toString("hex")}`))) !== null && _b !== void 0 ? _b : [];
            }
            return chainCurrencies.concat(keyCurrencies);
        });
    }
    clearTokens(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            yield this.kvStore.set(chainIdHelper.identifier, null);
            const reverse = yield this.getTokensToAccountReverse(chainId);
            for (const hexAddress of reverse) {
                yield this.kvStore.set(`${chainIdHelper.identifier}-${hexAddress}`, null);
            }
            yield this.setTokensToAccountReverse(chainId, []);
        });
    }
    getTokensFromChain(chainId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            return ((_a = (yield this.kvStore.get(chainIdHelper.identifier))) !== null && _a !== void 0 ? _a : []);
        });
    }
    saveTokensToChain(chainId, currencies) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            yield this.kvStore.set(chainIdHelper.identifier, currencies);
        });
    }
    getTokensFromChainAndAccount(chainId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            const currentKey = yield this.keyRingService.getKey(chainId);
            return ((_a = (yield this.kvStore.get(`${chainIdHelper.identifier}-${buffer_1.Buffer.from(currentKey.address).toString("hex")}`))) !== null && _a !== void 0 ? _a : []);
        });
    }
    saveTokensToChainAndAccount(chainId, currencies) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            const currentKey = yield this.keyRingService.getKey(chainId);
            const hexAddress = buffer_1.Buffer.from(currentKey.address).toString("hex");
            yield this.kvStore.set(`${chainIdHelper.identifier}-${hexAddress}`, currencies);
            yield this.insertTokensToAccountReverse(chainId, hexAddress);
        });
    }
    getTokensToAccountReverse(chainId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            return ((_a = (yield this.kvStore.get(`${chainIdHelper.identifier}-addresses`))) !== null && _a !== void 0 ? _a : []);
        });
    }
    setTokensToAccountReverse(chainId, addresses) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainIdHelper = cosmos_1.ChainIdHelper.parse(chainId);
            yield this.kvStore.set(`${chainIdHelper.identifier}-addresses`, addresses);
        });
    }
    insertTokensToAccountReverse(chainId, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const reverse = yield this.getTokensToAccountReverse(chainId);
            if (reverse.indexOf(address) < 0) {
                reverse.push(address);
                yield this.setTokensToAccountReverse(chainId, reverse);
            }
        });
    }
    getSecret20ViewingKey(chainId, contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.getTokens(chainId);
            for (const currency of tokens) {
                if ("type" in currency && currency.type === "secret20") {
                    if (currency.contractAddress === contractAddress) {
                        return currency.viewingKey;
                    }
                }
            }
            throw new router_1.KeplrError("tokens", 111, "There is no matched secret20");
        });
    }
    checkOrGrantSecret20ViewingKeyPermission(env, chainId, contractAddress, origin) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure that the secret20 was registered.
            yield this.getSecret20ViewingKey(chainId, contractAddress);
            const type = types_1.getSecret20ViewingKeyPermissionType(contractAddress);
            if (!this.permissionService.hasPermisson(chainId, type, origin)) {
                yield this.permissionService.grantPermission(env, "/access/viewing-key", [chainId], type, [origin]);
            }
            this.permissionService.checkPermission(env, chainId, type, origin);
        });
    }
    static validateCurrency(chainInfo, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate the schema.
            if ("type" in currency) {
                switch (currency.type) {
                    case "cw20":
                        currency = yield TokensService.validateCW20Currency(chainInfo, currency);
                        break;
                    case "secret20":
                        currency = yield TokensService.validateSecret20Currency(chainInfo, currency);
                        break;
                    default:
                        throw new router_1.KeplrError("tokens", 110, "Unknown type of currency");
                }
            }
            else {
                currency = yield chains_1.CurrencySchema.validateAsync(currency);
            }
            return currency;
        });
    }
    static validateCW20Currency(chainInfo, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate the schema.
            currency = yield chains_1.CW20CurrencySchema.validateAsync(currency);
            // Validate the contract address.
            cosmos_1.Bech32Address.validate(currency.contractAddress, chainInfo.bech32Config.bech32PrefixAccAddr);
            return currency;
        });
    }
    static validateSecret20Currency(chainInfo, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate the schema.
            currency = yield chains_1.Secret20CurrencySchema.validateAsync(currency);
            // Validate the contract address.
            cosmos_1.Bech32Address.validate(currency.contractAddress, chainInfo.bech32Config.bech32PrefixAccAddr);
            return currency;
        });
    }
}
exports.TokensService = TokensService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 539:
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
__exportStar(__webpack_require__(520), exports);
__exportStar(__webpack_require__(228), exports);
__exportStar(__webpack_require__(521), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const PersistentMemory = __importStar(__webpack_require__(1019));
const Chains = __importStar(__webpack_require__(1022));
const KeyRing = __importStar(__webpack_require__(1025));
// import * as SecretWasm from "./secret-wasm/internal";
const BackgroundTx = __importStar(__webpack_require__(1043));
const Updater = __importStar(__webpack_require__(1046));
const Tokens = __importStar(__webpack_require__(1049));
const Interaction = __importStar(__webpack_require__(1053));
const Permission = __importStar(__webpack_require__(1060));
// import * as PhishingList from "./phishing-list/internal";
const AutoLocker = __importStar(__webpack_require__(1063));
const Mises = __importStar(__webpack_require__(1066));
const MisesSafe = __importStar(__webpack_require__(1083));
__exportStar(__webpack_require__(1087), exports);
__exportStar(__webpack_require__(539), exports);
__exportStar(__webpack_require__(339), exports);
__exportStar(__webpack_require__(1088), exports);
__exportStar(__webpack_require__(1089), exports);
__exportStar(__webpack_require__(1090), exports);
__exportStar(__webpack_require__(1173), exports);
__exportStar(__webpack_require__(1175), exports);
__exportStar(__webpack_require__(1176), exports);
__exportStar(__webpack_require__(1177), exports);
__exportStar(__webpack_require__(523), exports);
__exportStar(__webpack_require__(1179), exports);
//import { LedgerOptions } from "./ledger/options";
//import { MisesSafe } from "./mises-safe/mises";
function init(router, storeCreator, 
// Message requester to the content script.
eventMsgRequester, embedChainInfos, 
// The origins that are able to pass any permission.
privilegedOrigins, commonCrypto, notification, experimentalOptions = {}) {
    var _a;
    const interactionService = new Interaction.InteractionService(eventMsgRequester, commonCrypto.rng);
    const persistentMemoryService = new PersistentMemory.PersistentMemoryService();
    const permissionService = new Permission.PermissionService(storeCreator("permission"), privilegedOrigins);
    const chainUpdaterService = new Updater.ChainUpdaterService(storeCreator("updator"));
    const tokensService = new Tokens.TokensService(storeCreator("tokens"));
    const chainsService = new Chains.ChainsService(storeCreator("chains"), embedChainInfos, {
        useMemoryKVStoreForSuggestChain: (_a = experimentalOptions.suggestChain) === null || _a === void 0 ? void 0 : _a.useMemoryKVStore,
    });
    const keyRingService = new KeyRing.KeyRingService(storeCreator("keyring"), embedChainInfos, commonCrypto);
    const misesService = new Mises.MisesService(storeCreator("mises"));
    const misesSafeService = new MisesSafe.MisesSafeService(storeCreator("misesSafe"));
    // const secretWasmService = new SecretWasm.SecretWasmService(
    //   storeCreator("secretwasm")
    // );
    const backgroundTxService = new BackgroundTx.BackgroundTxService(notification, misesService);
    // const phishingListService = new PhishingList.PhishingListService({
    //   blockListUrl:
    //     "https://raw.githubusercontent.com/chainapsis/phishing-block-list/main/block-list.txt",
    //   twitterListUrl:
    //     "https://raw.githubusercontent.com/chainapsis/phishing-block-list/main/twitter-scammer-list.txt",
    //   fetchingIntervalMs: 3 * 3600 * 1000, // 3 hours
    //   retryIntervalMs: 10 * 60 * 1000, // 10 mins,
    //   allowTimeoutMs: 10 * 60 * 1000, // 10 mins,
    // });
    const autoLockAccountService = new AutoLocker.AutoLockAccountService(storeCreator("auto-lock-account"), eventMsgRequester);
    interactionService.init();
    persistentMemoryService.init();
    permissionService.init(interactionService, chainsService, keyRingService);
    chainUpdaterService.init(chainsService);
    tokensService.init(interactionService, permissionService, chainsService, keyRingService);
    chainsService.init(chainUpdaterService, interactionService, permissionService);
    keyRingService.init(interactionService, chainsService, permissionService, misesService);
    misesService.init();
    misesSafeService.init();
    //secretWasmService.init(chainsService, keyRingService, permissionService);
    backgroundTxService.init(chainsService, permissionService);
    // phishingListService.init();
    // No need to wait because user can't interact with app right after launch.
    autoLockAccountService.init(keyRingService);
    Interaction.init(router, interactionService);
    PersistentMemory.init(router, persistentMemoryService);
    Permission.init(router, permissionService);
    Updater.init(router, chainUpdaterService);
    Tokens.init(router, tokensService);
    Chains.init(router, chainsService);
    KeyRing.init(router, keyRingService);
    // SecretWasm.init(router, secretWasmService);
    BackgroundTx.init(router, backgroundTxService);
    // PhishingList.init(router, phishingListService);
    AutoLocker.init(router, autoLockAccountService);
    Mises.init(router, misesService);
    MisesSafe.init(router, misesSafeService);
}
exports.init = init;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 540:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "tokens";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.splitSecret20ViewingKeyPermissionType = exports.isSecret20ViewingKeyPermissionType = exports.getSecret20ViewingKeyPermissionType = void 0;
function getSecret20ViewingKeyPermissionType(contractAddress) {
    return `viewing-key/${contractAddress}`;
}
exports.getSecret20ViewingKeyPermissionType = getSecret20ViewingKeyPermissionType;
function isSecret20ViewingKeyPermissionType(type) {
    return type.startsWith("viewing-key/");
}
exports.isSecret20ViewingKeyPermissionType = isSecret20ViewingKeyPermissionType;
function splitSecret20ViewingKeyPermissionType(type) {
    return type.replace("viewing-key/", "");
}
exports.splitSecret20ViewingKeyPermissionType = splitSecret20ViewingKeyPermissionType;
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 542:
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
exports.InteractionService = void 0;
const router_1 = __webpack_require__(3);
const foreground_1 = __webpack_require__(543);
class InteractionService {
    constructor(eventMsgRequester, rng) {
        this.eventMsgRequester = eventMsgRequester;
        this.rng = rng;
        this.waitingMap = new Map();
        this.resolverMap = new Map();
    }
    init() {
        // noop
    }
    // Dispatch the event to the frontend. Don't wait any interaction.
    // And, don't ensure that the event is delivered successfully, just ignore the any errors.
    dispatchEvent(port, type, data) {
        if (!type) {
            throw new router_1.KeplrError("interaction", 101, "Type should not be empty");
        }
        const msg = new foreground_1.PushEventDataMsg({
            type,
            data,
        });
        this.eventMsgRequester
            .sendMessage(port, msg)
            .then(() => {
            console.log(port, msg, "success sendMessage");
        })
            .catch((e) => {
            console.log(`Failed to send the event to ${port}: ${e.message}`);
        });
    }
    waitApprove(env, url, type, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!type) {
                throw new router_1.KeplrError("interaction", 101, "Type should not be empty");
            }
            // TODO: Add timeout?
            const interactionWaitingData = yield this.addDataToMap(type, env.isInternalMsg, data);
            const msg = new foreground_1.PushInteractionDataMsg(interactionWaitingData);
            return yield this.wait(msg.data.id, () => {
                env.requestInteraction(url, msg, options);
            });
        });
    }
    wait(id, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.resolverMap.has(id)) {
                throw new router_1.KeplrError("interaction", 100, "Id is aleady in use");
            }
            return new Promise((resolve, reject) => {
                this.resolverMap.set(id, {
                    onApprove: resolve,
                    onReject: reject,
                });
                fn();
            });
        });
    }
    approve(id, result) {
        if (this.resolverMap.has(id)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.resolverMap.get(id).onApprove(result);
            this.resolverMap.delete(id);
        }
        this.removeDataFromMap(id);
    }
    reject(id) {
        if (this.resolverMap.has(id)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.resolverMap.get(id).onReject(new Error("Request rejected"));
            this.resolverMap.delete(id);
        }
        this.removeDataFromMap(id);
    }
    addDataToMap(type, isInternal, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = new Uint8Array(8);
            const id = Array.from(yield this.rng(bytes))
                .map((value) => {
                return value.toString(16);
            })
                .join("");
            const interactionWaitingData = {
                id,
                type,
                isInternal,
                data,
            };
            if (this.waitingMap.has(id)) {
                throw new router_1.KeplrError("interaction", 100, "Id is aleady in use");
            }
            this.waitingMap.set(id, interactionWaitingData);
            return interactionWaitingData;
        });
    }
    removeDataFromMap(id) {
        this.waitingMap.delete(id);
    }
}
exports.InteractionService = InteractionService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 543:
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
__exportStar(__webpack_require__(1054), exports);
__exportStar(__webpack_require__(340), exports);
__exportStar(__webpack_require__(1055), exports);
__exportStar(__webpack_require__(1056), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 544:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "interaction-foreground";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 545:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "interaction";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 546:
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
exports.AutoLockAccountService = void 0;
const keyring_1 = __webpack_require__(339);
const router_1 = __webpack_require__(3);
const messages_1 = __webpack_require__(231);
class AutoLockAccountService {
    constructor(kvStore, eventMsgRequester, opts = {
        monitoringInterval: 10000,
    }) {
        this.kvStore = kvStore;
        this.eventMsgRequester = eventMsgRequester;
        this.opts = opts;
        // Unit: ms
        this.autoLockDuration = 15 * 60 * 1000;
        // Unit: ms
        this.keepAliveDuration = 15 * 1000;
        this.appStateCheckTimer = null;
        this.autoLockTimer = null;
        this.keepAliveTimer = null;
    }
    init(keyringService) {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyringService = keyringService;
            browser.idle.onStateChanged.addListener((idle) => {
                this.stateChangedHandler(idle);
            });
            yield this.loadDuration();
        });
    }
    stateChangedHandler(newState) {
        if (this.autoLockDuration > 0) {
            if (newState === "locked") {
                this.stopAppStateCheckTimer();
                this.stopAutoLockTimer();
                this.lock();
            }
        }
    }
    startAppStateCheckTimer() {
        if (this.autoLockDuration > 0 && this.keyRingIsUnlocked) {
            this.stopAutoLockTimer();
            this.startAutoLockTimer();
        }
    }
    stopAppStateCheckTimer() {
        if (this.appStateCheckTimer != null) {
            clearTimeout(this.appStateCheckTimer);
            this.appStateCheckTimer = null;
        }
    }
    checkAppIsActive() {
        // const background = browser.extension.getBackgroundPage();
        // const views = browser.extension.getViews();
        // if (background) {
        //   for (const view of views) {
        //     if (background.location.href !== view.location.href) {
        //       return true;
        //     }
        //   }
        // } else if (views.length > 0) {
        //   return true;
        // }
        return false;
    }
    startAutoLockTimer() {
        if (!this.keyRingIsUnlocked) {
            throw new Error("Keyring is not unlocked");
        }
        if (this.autoLockDuration <= 0) {
            return;
        }
        this.autoLockTimer = setTimeout(() => {
            this.stopAppStateCheckTimer();
            this.stopAutoLockTimer();
            this.lock();
        }, this.autoLockDuration);
    }
    stopAutoLockTimer() {
        if (this.autoLockTimer != null) {
            clearTimeout(this.autoLockTimer);
            this.autoLockTimer = null;
        }
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyRingIsUnlocked) {
                this.keyringService.lock();
                let tabs = yield browser.tabs.query({
                    discarded: false,
                    status: "complete",
                });
                tabs = tabs.filter((val) => val.url && val.url.indexOf(browser.runtime.id) > -1);
                for (const tab of tabs) {
                    browser.tabs.reload(tab.id);
                }
            }
        });
    }
    get keyRingIsUnlocked() {
        if (this.keyringService == null) {
            throw new Error("Keyring service is null");
        }
        return this.keyringService.keyRingStatus === keyring_1.KeyRingStatus.UNLOCKED;
    }
    getAutoLockDuration() {
        return this.autoLockDuration;
    }
    setDuration(duration) {
        this.autoLockDuration = duration;
        if (duration <= 0) {
            this.stopAppStateCheckTimer();
            this.stopAutoLockTimer();
        }
        return this.kvStore.set("autoLockDuration", duration);
    }
    loadDuration() {
        return __awaiter(this, void 0, void 0, function* () {
            const duration = yield this.kvStore.get("autoLockDuration");
            if (duration == null) {
                this.autoLockDuration = 15 * 60 * 1000;
            }
            else {
                this.autoLockDuration = duration;
            }
        });
    }
    keepAlive() {
        this.clearKeepAliveTimer();
        if (this.keyRingIsUnlocked) {
            this.keepAliveTimer = setTimeout(() => {
                const msg = new messages_1.KeepAliveMsg();
                this.eventMsgRequester.sendMessage(router_1.BACKGROUND_PORT, msg).finally(() => {
                    console.log("keepAlive");
                    this.keepAlive();
                });
            }, this.keepAliveDuration);
        }
    }
    clearKeepAliveTimer() {
        if (this.keepAliveTimer) {
            clearTimeout(this.keepAliveTimer);
            this.keepAliveTimer = null;
        }
    }
}
exports.AutoLockAccountService = AutoLockAccountService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 547:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "auto-lock-account";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 554:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "mises";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 555:
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
exports.MisesSafeService = void 0;
const mises_network_util_1 = __webpack_require__(232);
const html_similar_1 = __webpack_require__(1084);
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
class MisesSafeService {
    constructor(kvStore) {
        this.kvStore = kvStore;
        this.isShouldVerify = true;
        this.domainWhiteListMap = new Map();
        this.blackNotifyingMap = new Map();
        console.log("MisesSafeService init");
        this.localShouldVerify();
        this.getDomainwhiteList();
    }
    // private misesSafe!: MisesSafe;
    getDomainwhiteList() {
        mises_network_util_1.misesRequest({
            url: "https://web3.mises.site/website/whitesites.json",
        }).then((res) => {
            if (res) {
                res.forEach((v) => {
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
    setIsShouldVerifyState(state) {
        this.isShouldVerify = state;
        this.save();
    }
    parseDomainUntilSecondLevel(param) {
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
    initMessageClient(res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isShouldVerify) {
                console.log("disable Verify");
                return false;
            }
            if ((res === null || res === void 0 ? void 0 : res.params) && typeof res.params.method === "undefined") {
                return;
            }
            switch (res.params.method) {
                case listenMethods.mVerifyDomain:
                    return this.verifyDomain(res.params.params.domain, res.params.params.logo, res.params.params.content);
                case listenMethods.mNotifyFuzzyDomain:
                    return this.notifyFuzzyDomain(res.params.params.domain, res.params.params.suggested_url);
                case listenMethods.mVerifyContract:
                    return this.verifyContract(res.params.params.contractAddress, res.params.params.domain);
                case listenMethods.mCalculateHtmlSimilarly:
                    return this.calculateHtmlSimilarly(res.params.params.html, res.params.params.hash);
                case listenMethods.mRecordVisitWeb3siteEvent:
                    return this.recordVisitWeb3siteEvent(res.params.params.domain);
                case listenMethods.mRecordUseContractEvent:
                    return this.recordUseContractEvent(res.params.params.contractAddress, res.params.params.domain);
            }
        });
    }
    /* CalculateHtmlSimilarly start */
    calculateHtmlSimilarly(html, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const request_url_html_body_hash = html_similar_1.html_similar.digest(html);
            const score = html_similar_1.html_similar.distance(hash, request_url_html_body_hash);
            console.log("request_url_html_body_hash: ", request_url_html_body_hash);
            console.log("html_body_fuzzy_hash: ", hash);
            console.log("html body fuzzy html score: ", score);
            return score;
        });
    }
    /* VerifyDomain start */
    verifyDomain(domain, logo, content) {
        return __awaiter(this, void 0, void 0, function* () {
            //is ignore
            const isIgnore = yield this.isIgnoreDomain(domain);
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
            const verifyDomainResult = yield this.apiVerifyDomain(domain, logo, content);
            console.log("verifyDomainResult: ", verifyDomainResult);
            //is should alert user
            if (!this.hasBlackNotifying(domain) &&
                verifyDomainResult &&
                verifyDomainResult.level === domainLevel.Black) {
                console.log("verifyDomain notifyPhishingDetected start: ", domain);
                this.addBlackNotifying(domain);
                setTimeout(() => {
                    this.removeBlackNotifying(domain);
                }, 3000);
                const userDecision = yield this.notifyPhishingDetected({
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
        });
    }
    hasBlackNotifying(domain) {
        return domain !== "" && this.blackNotifyingMap.has(domain);
    }
    removeBlackNotifying(domain) {
        this.blackNotifyingMap.delete(domain);
    }
    addBlackNotifying(domain) {
        this.blackNotifyingMap.set(domain, "1");
    }
    notifyFuzzyDomain(domain, suggested_url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("verifyDomain notifyPhishingDetected start: ", domain, suggested_url);
            const userDecision = yield this.notifyPhishingDetected({
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
        });
    }
    apiVerifyDomain(domain, logo, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kvStore.get(domain);
            if (result) {
                return result;
            }
            const res = yield mises_network_util_1.misesRequest({
                method: "POST",
                url: "/phishing_site/check",
                data: {
                    domain: domain,
                    logo: logo,
                    content: content,
                },
            });
            if (res &&
                res.level !== domainLevel.Black &&
                res.level !== domainLevel.Fuzzy) {
                this.kvStore.set(domain, res);
            }
            return res;
        });
    }
    setIgnorDomain(domain) {
        this.kvStore.set(this.getDomainCacheKey(domain), "1");
    }
    isIgnoreDomain(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.kvStore.get(this.getDomainCacheKey(domain));
        });
    }
    getDomainCacheKey(domain) {
        return storageKey.DomainRisk + domain.replace(".", "-");
    }
    isDomainWhitelisted(domain) {
        domain = this.parseDomainUntilSecondLevel(domain);
        return domain !== "" && this.domainWhiteListMap.has(domain);
    }
    /* VerifyDomain end */
    /* verifyContract start */
    verifyContract(contractAddress, domain) {
        return __awaiter(this, void 0, void 0, function* () {
            //is ignore
            const isIgnore = yield this.isIgnoreDomain(domain);
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
            const verifyContractResult = yield this.apiVerifyContract(contractAddress, domain);
            console.log("verifyContractResult: ", verifyContractResult);
            //is should alert user
            if (!this.hasBlackNotifying(contractAddress) &&
                verifyContractResult &&
                verifyContractResult.level === contractLevel.Danger) {
                this.addBlackNotifying(contractAddress);
                setTimeout(() => {
                    this.removeBlackNotifying(contractAddress);
                }, 25000);
                console.log("notifyPhishingDetected start: ", contractAddress);
                const userDecision = yield this.notifyPhishingDetected({
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
        });
    }
    apiVerifyContract(contractAddress, domain) {
        return __awaiter(this, void 0, void 0, function* () {
            //cache
            const result = yield this.kvStore.get(contractAddress);
            if (result) {
                return result;
            }
            const res = yield mises_network_util_1.misesRequest({
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
        });
    }
    setIgnoreContract(contractAddress) {
        this.kvStore.set(this.getContractCacheKey(contractAddress), "1");
    }
    isIgnoreContract(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.kvStore.get(this.getContractCacheKey(contractAddress));
        });
    }
    getContractCacheKey(contractAddress) {
        return storageKey.ContractTrust + contractAddress.replace(".", "-");
    }
    /* verifyContract end */
    notifyPhishingDetected(params) {
        return new Promise((resolve) => {
            if (browser.misesPrivate &&
                browser.misesPrivate.notifyPhishingDetected) {
                browser.misesPrivate.notifyPhishingDetected(JSON.stringify(params), resolve);
                return;
            }
            resolve("mises");
        });
    }
    //recordVisitWeb3siteEvent
    recordVisitWeb3siteEvent(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("recordVisitWeb3siteEvent", domain);
            const params = { key1: "domain", value1: domain };
            this.recordEvent({
                event_type: "visit_web3site",
                params: params,
            });
        });
    }
    //recordUseContractEvent
    recordUseContractEvent(contractAddress, domain) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    //recordEvent
    recordEvent(params) {
        console.log("recordEvent", params);
        console.log("recordEvent", JSON.stringify(params));
        return new Promise(() => {
            if (browser.misesPrivate &&
                browser.misesPrivate.recordEvent) {
                browser.misesPrivate.recordEvent(JSON.stringify(params));
                return;
            }
        });
    }
}
exports.MisesSafeService = MisesSafeService;
//# sourceMappingURL=service.js.map

/***/ }),

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE = void 0;
exports.ROUTE = "mises-safe";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 608:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ messages_GetAutoLockAccountDurationMsg; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* reexport */ messages_UpdateAutoLockAccountDurationMsg; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ messages_KeepAliveMsg; });

// UNUSED EXPORTS: AutoLockAccountService, StartAutoLockMonitoringMsg, LockMsg

// EXTERNAL MODULE: ../background/src/keyring/index.ts + 9 modules
var keyring = __webpack_require__(635);

// EXTERNAL MODULE: ../router/build/index.js
var build = __webpack_require__(3);

// CONCATENATED MODULE: ../background/src/auto-lock-account/constants.ts
const ROUTE = "auto-lock-account";

// CONCATENATED MODULE: ../background/src/auto-lock-account/messages.ts


class messages_GetAutoLockAccountDurationMsg extends build["Message"] {
    static type() {
        return "get-auto-lock-account-duration";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_GetAutoLockAccountDurationMsg.type();
    }
}
class messages_UpdateAutoLockAccountDurationMsg extends build["Message"] {
    constructor(duration) {
        super();
        this.duration = duration;
    }
    static type() {
        return "update-auto-lock-account-duration";
    }
    validateBasic() {
        if (this.duration < 0) {
            throw new build["KeplrError"]("auto-lock-account", 101, "duration cannot be set to a negative number.");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_UpdateAutoLockAccountDurationMsg.type();
    }
}
class messages_StartAutoLockMonitoringMsg extends build["Message"] {
    static type() {
        return "start-auto-lock-monitoring";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_StartAutoLockMonitoringMsg.type();
    }
}
class messages_LockMsg extends build["Message"] {
    static type() {
        return "lock-msg";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_LockMsg.type();
    }
}
class messages_KeepAliveMsg extends build["Message"] {
    static type() {
        return "keepAlive-msg";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_KeepAliveMsg.type();
    }
}

// CONCATENATED MODULE: ../background/src/auto-lock-account/service.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class service_AutoLockAccountService {
    constructor(kvStore, eventMsgRequester, opts = {
        monitoringInterval: 10000,
    }) {
        this.kvStore = kvStore;
        this.eventMsgRequester = eventMsgRequester;
        this.opts = opts;
        // Unit: ms
        this.autoLockDuration = 15 * 60 * 1000;
        // Unit: ms
        this.keepAliveDuration = 15 * 1000;
        this.appStateCheckTimer = null;
        this.autoLockTimer = null;
        this.keepAliveTimer = null;
    }
    init(keyringService) {
        return __awaiter(this, void 0, void 0, function* () {
            this.keyringService = keyringService;
            browser.idle.onStateChanged.addListener((idle) => {
                this.stateChangedHandler(idle);
            });
            yield this.loadDuration();
        });
    }
    stateChangedHandler(newState) {
        if (this.autoLockDuration > 0) {
            if (newState === "locked") {
                this.stopAppStateCheckTimer();
                this.stopAutoLockTimer();
                this.lock();
            }
        }
    }
    startAppStateCheckTimer() {
        if (this.autoLockDuration > 0 && this.keyRingIsUnlocked) {
            this.stopAutoLockTimer();
            this.startAutoLockTimer();
        }
    }
    stopAppStateCheckTimer() {
        if (this.appStateCheckTimer != null) {
            clearTimeout(this.appStateCheckTimer);
            this.appStateCheckTimer = null;
        }
    }
    checkAppIsActive() {
        // const background = browser.extension.getBackgroundPage();
        // const views = browser.extension.getViews();
        // if (background) {
        //   for (const view of views) {
        //     if (background.location.href !== view.location.href) {
        //       return true;
        //     }
        //   }
        // } else if (views.length > 0) {
        //   return true;
        // }
        return false;
    }
    startAutoLockTimer() {
        if (!this.keyRingIsUnlocked) {
            throw new Error("Keyring is not unlocked");
        }
        if (this.autoLockDuration <= 0) {
            return;
        }
        this.autoLockTimer = setTimeout(() => {
            this.stopAppStateCheckTimer();
            this.stopAutoLockTimer();
            this.lock();
        }, this.autoLockDuration);
    }
    stopAutoLockTimer() {
        if (this.autoLockTimer != null) {
            clearTimeout(this.autoLockTimer);
            this.autoLockTimer = null;
        }
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyRingIsUnlocked) {
                this.keyringService.lock();
                let tabs = yield browser.tabs.query({
                    discarded: false,
                    status: "complete",
                });
                tabs = tabs.filter((val) => val.url && val.url.indexOf(browser.runtime.id) > -1);
                for (const tab of tabs) {
                    browser.tabs.reload(tab.id);
                }
            }
        });
    }
    get keyRingIsUnlocked() {
        if (this.keyringService == null) {
            throw new Error("Keyring service is null");
        }
        return this.keyringService.keyRingStatus === keyring["a" /* KeyRingStatus */].UNLOCKED;
    }
    getAutoLockDuration() {
        return this.autoLockDuration;
    }
    setDuration(duration) {
        this.autoLockDuration = duration;
        if (duration <= 0) {
            this.stopAppStateCheckTimer();
            this.stopAutoLockTimer();
        }
        return this.kvStore.set("autoLockDuration", duration);
    }
    loadDuration() {
        return __awaiter(this, void 0, void 0, function* () {
            const duration = yield this.kvStore.get("autoLockDuration");
            if (duration == null) {
                this.autoLockDuration = 15 * 60 * 1000;
            }
            else {
                this.autoLockDuration = duration;
            }
        });
    }
    keepAlive() {
        this.clearKeepAliveTimer();
        if (this.keyRingIsUnlocked) {
            this.keepAliveTimer = setTimeout(() => {
                const msg = new messages_KeepAliveMsg();
                this.eventMsgRequester.sendMessage(build["BACKGROUND_PORT"], msg).finally(() => {
                    console.log("keepAlive");
                    this.keepAlive();
                });
            }, this.keepAliveDuration);
        }
    }
    clearKeepAliveTimer() {
        if (this.keepAliveTimer) {
            clearTimeout(this.keepAliveTimer);
            this.keepAliveTimer = null;
        }
    }
}

// CONCATENATED MODULE: ../background/src/auto-lock-account/index.ts




/***/ }),

/***/ 635:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ KeyRingStatus; });

// UNUSED EXPORTS: KeyRingService, RestoreKeyRingMsg, DeleteKeyRingMsg, UpdateNameKeyRingMsg, ShowKeyRingMsg, CreateMnemonicKeyMsg, AddMnemonicKeyMsg, CreatePrivateKeyMsg, AddPrivateKeyMsg, LockKeyRingMsg, UnlockKeyRingMsg, GetKeyMsg, RequestSignAminoMsg, RequestSignEIP712CosmosTxMsg_v0, RequestVerifyADR36AminoSignDoc, RequestSignDirectMsg, GetMultiKeyStoreInfoMsg, ChangeKeyRingMsg, GetIsKeyStoreCoinTypeSetMsg, SetKeyStoreCoinTypeMsg, CheckPasswordMsg, ExportKeyRingDatasMsg, IsUnlockMsg, AddAccountMsg, MigratorKeyRingMsg, RestoreKeyStoreMsg, KeyRing, EIP712PropertyFieldValidator, EIP712DomainTypeValidator, EIP712MessageValidator

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/aes-js/index.js
var aes_js = __webpack_require__(194);
var aes_js_default = /*#__PURE__*/__webpack_require__.n(aes_js);

// EXTERNAL MODULE: ../crypto/build/index.js
var build = __webpack_require__(51);

// EXTERNAL MODULE: ../background/node_modules/pbkdf2/browser.js
var pbkdf2_browser = __webpack_require__(377);
var browser_default = /*#__PURE__*/__webpack_require__.n(pbkdf2_browser);

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/node-libs-browser/node_modules/buffer/index.js
var buffer = __webpack_require__(4);

// EXTERNAL MODULE: ../router/build/index.js
var router_build = __webpack_require__(3);

// CONCATENATED MODULE: ../background/src/keyring/crypto.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class crypto_Crypto {
    static encrypt(crypto, kdf, type, text, password, meta, bip44HDPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let random = new Uint8Array(32);
            const salt = buffer["Buffer"].from(yield crypto.rng(random)).toString("hex");
            const scryptParams = {
                salt,
                dklen: 32,
                n: 32768,
                r: 8,
                p: 1,
            };
            random = new Uint8Array(16);
            const iv = buffer["Buffer"].from(yield crypto.rng(random));
            // If the mnemonic is not imported, there will be no mnemonic content
            if (!text && !password && type === "mnemonic") {
                return {
                    version: "1.2",
                    type,
                    coinTypeForChain: {},
                    bip44HDPath,
                    meta,
                    crypto: {
                        cipher: "aes-128-ctr",
                        cipherparams: {
                            iv: iv.toString("hex"),
                        },
                        ciphertext: "",
                        kdf,
                        kdfparams: scryptParams,
                        mac: "",
                    },
                };
            }
            const derivedKey = yield (() => __awaiter(this, void 0, void 0, function* () {
                switch (kdf) {
                    case "scrypt":
                        return yield crypto.scrypt(password, scryptParams);
                    case "sha256":
                        return build["Hash"].sha256(buffer["Buffer"].from(`${salt}/${password}`));
                    case "pbkdf2":
                        return new Promise((resolve, reject) => {
                            browser_default.a.pbkdf2(password, salt, 4000, 32, "sha256", (err, derivedKey) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(new Uint8Array(derivedKey));
                                }
                            });
                        });
                    default:
                        throw new router_build["KeplrError"]("keyring", 220, "Unknown kdf");
                }
            }))();
            const buf = buffer["Buffer"].from(text);
            const counter = new aes_js["Counter"](0);
            counter.setBytes(iv);
            const aesCtr = new aes_js_default.a.ModeOfOperation.ctr(derivedKey, counter);
            const ciphertext = buffer["Buffer"].from(aesCtr.encrypt(buf));
            // Mac is sha256(last 16 bytes of derived key + ciphertext)
            const mac = build["Hash"].sha256(buffer["Buffer"].concat([
                buffer["Buffer"].from(derivedKey.slice(derivedKey.length / 2)),
                ciphertext,
            ]));
            return {
                version: "1.2",
                type,
                coinTypeForChain: {},
                bip44HDPath,
                meta,
                crypto: {
                    cipher: "aes-128-ctr",
                    cipherparams: {
                        iv: iv.toString("hex"),
                    },
                    ciphertext: ciphertext.toString("hex"),
                    kdf,
                    kdfparams: scryptParams,
                    mac: buffer["Buffer"].from(mac).toString("hex"),
                },
            };
        });
    }
    static decrypt(crypto, keyStore, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const derivedKey = yield (() => __awaiter(this, void 0, void 0, function* () {
                switch (keyStore.crypto.kdf) {
                    case "scrypt":
                        return yield crypto.scrypt(password, keyStore.crypto.kdfparams);
                    case "sha256":
                        return build["Hash"].sha256(buffer["Buffer"].from(`${keyStore.crypto.kdfparams.salt}/${password}`));
                    case "pbkdf2":
                        return new Promise((resolve, reject) => {
                            browser_default.a.pbkdf2(password, keyStore.crypto.kdfparams.salt, 4000, 32, "sha256", (err, derivedKey) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(new Uint8Array(derivedKey));
                                }
                            });
                        });
                    default:
                        throw new router_build["KeplrError"]("keyring", 220, "Unknown kdf");
                }
            }))();
            const counter = new aes_js["Counter"](0);
            counter.setBytes(buffer["Buffer"].from(keyStore.crypto.cipherparams.iv, "hex"));
            const aesCtr = new aes_js_default.a.ModeOfOperation.ctr(derivedKey, counter);
            const mac = build["Hash"].sha256(buffer["Buffer"].concat([
                buffer["Buffer"].from(derivedKey.slice(derivedKey.length / 2)),
                buffer["Buffer"].from(keyStore.crypto.ciphertext, "hex"),
            ]));
            if (!buffer["Buffer"].from(mac).equals(buffer["Buffer"].from(keyStore.crypto.mac, "hex"))) {
                throw new router_build["KeplrError"]("keyring", 222, "Unmatched mac");
            }
            return buffer["Buffer"].from(aesCtr.decrypt(buffer["Buffer"].from(keyStore.crypto.ciphertext, "hex")));
        });
    }
}

// EXTERNAL MODULE: ../types/build/index.js
var types_build = __webpack_require__(96);

// EXTERNAL MODULE: ../cosmos/build/index.js
var cosmos_build = __webpack_require__(16);

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/@ethersproject/wallet/lib.esm/index.js + 39 modules
var lib_esm = __webpack_require__(253);

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/@ethersproject/bytes/lib.esm/index.js + 1 modules
var bytes_lib_esm = __webpack_require__(1);

// EXTERNAL MODULE: ../background/node_modules/joi/dist/joi-browser.min.js
var joi_browser_min = __webpack_require__(41);
var joi_browser_min_default = /*#__PURE__*/__webpack_require__.n(joi_browser_min);

// CONCATENATED MODULE: ../background/src/keyring/eip712.ts

// https://eips.ethereum.org/EIPS/eip-712
const EIP712PropertyFieldValidator = joi_browser_min_default.a.object({
    name: joi_browser_min_default.a.string().min(1).required(),
    // TODO: Check valid types (string, bool, address, uint256...)
    type: joi_browser_min_default.a.string().min(1).required(),
});
const EIP712DomainTypeValidator = joi_browser_min_default.a.array()
    .items(joi_browser_min_default.a.object({
    name: joi_browser_min_default.a.string().valid("name").required(),
    type: joi_browser_min_default.a.string().valid("string").required(),
}), joi_browser_min_default.a.object({
    name: joi_browser_min_default.a.string().valid("version").required(),
    type: joi_browser_min_default.a.string().valid("string").required(),
}), joi_browser_min_default.a.object({
    name: joi_browser_min_default.a.string().valid("chainId").required(),
    type: joi_browser_min_default.a.string().valid("uint256").required(),
}), joi_browser_min_default.a.object({
    name: joi_browser_min_default.a.string().valid("verifyingContract").required(),
    // From https://eips.ethereum.org/EIPS/eip-712, (string) may be non-standard?
    // But, ethermint set this type as string.
    type: joi_browser_min_default.a.string().valid("address", "string").required(),
}), joi_browser_min_default.a.object({
    name: joi_browser_min_default.a.string().valid("salt").required(),
    // From https://eips.ethereum.org/EIPS/eip-712, (string) may be non-standard?
    // But, ethermint set this type as string.
    type: joi_browser_min_default.a.string().valid("bytes32", "string").required(),
}))
    .unique()
    .min(1)
    .custom((value) => {
    // Sort by name
    const domainFieldNames = [
        "name",
        "version",
        "chainId",
        "verifyingContract",
        "salt",
    ];
    return value.sort((a, b) => {
        return (domainFieldNames.indexOf(a.name) - domainFieldNames.indexOf(b.name));
    });
});
const EIP712MessageValidator = joi_browser_min_default.a.object({
    types: joi_browser_min_default.a.object({
        EIP712Domain: EIP712DomainTypeValidator.required(),
    })
        .unknown(true)
        .required(),
    primaryType: joi_browser_min_default.a.string().min(1).required(),
    domain: joi_browser_min_default.a.object().required(),
    message: joi_browser_min_default.a.object().required(),
});

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/@ethersproject/hash/lib.esm/typed-data.js + 4 modules
var typed_data = __webpack_require__(593);

// CONCATENATED MODULE: ../background/src/migrator/index.ts
var migrator_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Migrator {
    // run all pending migrations on meta in place
    migrateData() {
        return migrator_awaiter(this, void 0, void 0, function* () {
            const { migrated } = yield browser.storage.local.get();
            if (migrated && migrated.data) {
                const keyringStore = migrated.data.KeyringController || {
                    vault: "",
                };
                return keyringStore;
            }
            return {
                vault: "",
            };
        });
    }
    enCodeValut(keyringStore, password) {
        return migrator_awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line
            const encryptor = __webpack_require__(629);
            const { vault: vaultString } = keyringStore;
            const vault = (yield encryptor.decrypt(password, vaultString));
            return vault.filter((val) => ["HD Key Tree", "Simple Key Pair"].includes(val.type));
        });
    }
    clearCache() {
        console.log("clear data");
        return browser.storage.local.set({
            migrated: "done",
        });
    }
}

// CONCATENATED MODULE: ../background/src/keyring/keyring.ts
var keyring_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











var KeyRingStatus;
(function (KeyRingStatus) {
    KeyRingStatus[KeyRingStatus["NOTLOADED"] = 0] = "NOTLOADED";
    KeyRingStatus[KeyRingStatus["EMPTY"] = 1] = "EMPTY";
    KeyRingStatus[KeyRingStatus["LOCKED"] = 2] = "LOCKED";
    KeyRingStatus[KeyRingStatus["UNLOCKED"] = 3] = "UNLOCKED";
    KeyRingStatus[KeyRingStatus["MIGRATOR"] = 4] = "MIGRATOR";
})(KeyRingStatus || (KeyRingStatus = {}));
const KeyStoreKey = "key-store";
const KeyMultiStoreKey = "key-multi-store";
/*
 Keyring stores keys in persistent backround.
 And, this manages the state, crypto, address, signing and so on...
 */
class keyring_KeyRing {
    constructor(embedChainInfos, kvStore, crypto, misesService) {
        this.embedChainInfos = embedChainInfos;
        this.kvStore = kvStore;
        this.crypto = crypto;
        this.misesService = misesService;
        this.cached = new Map();
        this.password = "";
        this.migratorStore = { vault: "" };
        this.loaded = false;
        this.keyStore = null;
        this.multiKeyStore = [];
        const migrator = new Migrator();
        this.migrator = migrator;
        migrator.migrateData().then((res) => {
            this.migratorStore = res;
        });
    }
    static getTypeOfKeyStore(keyStore) {
        const type = keyStore.type;
        if (type == null) {
            return "mnemonic";
        }
        if (type !== "mnemonic" && type !== "privateKey" && type !== "ledger") {
            throw new router_build["KeplrError"]("keyring", 132, "Invalid type of key store");
        }
        return type;
    }
    get type() {
        if (!this.keyStore) {
            return "none";
        }
        else {
            return keyring_KeyRing.getTypeOfKeyStore(this.keyStore);
        }
    }
    isLocked() {
        return (this.privateKey == null &&
            this.mnemonicMasterSeed == null &&
            this.ledgerPublicKeyCache == null);
    }
    get privateKey() {
        return this._privateKey;
    }
    set privateKey(privateKey) {
        this._privateKey = privateKey;
        this._mnemonicMasterSeed = undefined;
        this._ledgerPublicKeyCache = undefined;
        this.cached = new Map();
    }
    get mnemonicMasterSeed() {
        return this._mnemonicMasterSeed;
    }
    set mnemonicMasterSeed(masterSeed) {
        this._mnemonicMasterSeed = masterSeed;
        this._privateKey = undefined;
        this._ledgerPublicKeyCache = undefined;
        this.cached = new Map();
    }
    get ledgerPublicKeyCache() {
        return this._ledgerPublicKeyCache;
    }
    set ledgerPublicKeyCache(publicKeys) {
        this._mnemonicMasterSeed = undefined;
        this._privateKey = undefined;
        this._ledgerPublicKeyCache = publicKeys;
        this.cached = new Map();
    }
    get status() {
        if (!this.loaded) {
            return KeyRingStatus.NOTLOADED;
        }
        if (!this.keyStore && this.migratorStore.vault) {
            return KeyRingStatus.MIGRATOR;
        }
        if (!this.keyStore) {
            return KeyRingStatus.EMPTY;
        }
        else if (!this.isLocked()) {
            return KeyRingStatus.UNLOCKED;
        }
        else {
            return KeyRingStatus.LOCKED;
        }
    }
    getKeyStoreCoinType(chainId) {
        if (!this.keyStore) {
            return undefined;
        }
        if (!this.keyStore.coinTypeForChain) {
            return undefined;
        }
        return this.keyStore.coinTypeForChain[cosmos_build["ChainIdHelper"].parse(chainId).identifier];
    }
    getKey(chainId, defaultCoinType, useEthereumAddress) {
        return this.loadKey(this.computeKeyStoreCoinType(chainId, defaultCoinType), useEthereumAddress);
    }
    getKeyStoreMeta(key) {
        var _a;
        if (!this.keyStore || this.keyStore.meta == null) {
            return "";
        }
        return (_a = this.keyStore.meta[key]) !== null && _a !== void 0 ? _a : "";
    }
    computeKeyStoreCoinType(chainId, defaultCoinType) {
        var _a;
        if (!this.keyStore) {
            throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
        }
        return this.keyStore.coinTypeForChain
            ? (_a = this.keyStore.coinTypeForChain[cosmos_build["ChainIdHelper"].parse(chainId).identifier]) !== null && _a !== void 0 ? _a : defaultCoinType : defaultCoinType;
    }
    getKeyFromCoinType(coinType, useEthereumAddress) {
        return this.loadKey(coinType, useEthereumAddress);
    }
    createMnemonicKey(kdf, mnemonic, password, meta, bip44HDPath) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            yield this.checkKeyStoreStatus();
            if (![KeyRingStatus.EMPTY, KeyRingStatus.MIGRATOR].includes(this.status)) {
                throw new router_build["KeplrError"]("keyring", 142, "Key ring is not loaded or not empty");
            }
            this.mnemonicMasterSeed = build["Mnemonic"].generateMasterSeedFromMnemonic(mnemonic);
            this.keyStore = yield keyring_KeyRing.CreateMnemonicKeyStore(this.crypto, kdf, mnemonic, password, yield this.assignKeyStoreIdMeta(meta), bip44HDPath);
            this.password = password;
            this.multiKeyStore.push(this.keyStore);
            const privKey = this.loadPrivKey(60);
            const ethWallet = new lib_esm["Wallet"](privKey.toBytes());
            // this.misesService.initQueryClient();
            this.misesService.activateUser(ethWallet.privateKey);
            yield this.save();
            return {
                status: this.status,
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    createPrivateKey(kdf, privateKey, password, meta) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.EMPTY) {
                throw new router_build["KeplrError"]("keyring", 142, "Key ring is not loaded or not empty");
            }
            this.privateKey = privateKey;
            this.keyStore = yield keyring_KeyRing.CreatePrivateKeyStore(this.crypto, kdf, privateKey, password, yield this.assignKeyStoreIdMeta(meta));
            this.password = password;
            this.multiKeyStore.push(this.keyStore);
            yield this.save();
            return {
                status: this.status,
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    lock() {
        if (this.status !== KeyRingStatus.UNLOCKED) {
            throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
        }
        this.mnemonicMasterSeed = undefined;
        this.privateKey = undefined;
        this.ledgerPublicKeyCache = undefined;
        this.password = "";
        this.misesService.lockAll();
    }
    checkKeyStoreStatus() {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (!this.keyStore || this.type === "none") {
                console.log("checkKeyStoreStatus");
                yield this.restore();
            }
            return true;
        });
    }
    unlock(password) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            /**
             * If the service worker is closed and reopened
             * the restore will not run, so you need to check whether the keystore needs to be restored again
             */
            console.log("unlocked");
            yield this.checkKeyStoreStatus();
            if (!this.keyStore || this.type === "none") {
                throw new router_build["KeplrError"]("keyring", 144, "Key ring not initialized");
            }
            if (this.type === "mnemonic") {
                // If password is invalid, error will be thrown.
                this.mnemonicMasterSeed = build["Mnemonic"].generateMasterSeedFromMnemonic(buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, this.multiKeyStore[0], password)).toString());
            }
            else if (this.type === "privateKey") {
                // If password is invalid, error will be thrown.
                this.privateKey = buffer["Buffer"].from(buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, this.keyStore, password)).toString(), "hex");
            }
            else {
                throw new router_build["KeplrError"]("keyring", 145, "Unexpected type of keyring");
            }
            this.password = password;
            const privKey = this.loadPrivKey(60);
            const ethWallet = new lib_esm["Wallet"](privKey.toBytes());
            // this.misesService.initQueryClient();
            this.misesService.activateUser(ethWallet.privateKey);
        });
    }
    save() {
        return keyring_awaiter(this, void 0, void 0, function* () {
            yield this.kvStore.set(KeyStoreKey, this.keyStore);
            yield this.kvStore.set(KeyMultiStoreKey, this.multiKeyStore);
        });
    }
    restore() {
        return keyring_awaiter(this, void 0, void 0, function* () {
            console.log("keyring restore");
            const keyStore = yield this.kvStore.get(KeyStoreKey);
            if (!keyStore) {
                this.keyStore = null;
            }
            else {
                this.keyStore = keyStore;
            }
            const multiKeyStore = yield this.kvStore.get(KeyMultiStoreKey);
            if (!multiKeyStore) {
                // Restore the multi keystore if key store exist 13t multi Key store is empty.
                // This case will occur if extension is updated from the prior version that doesn't support the multi key store.
                // This line ensures the backward compatibility.
                if (keyStore) {
                    keyStore.meta = yield this.assignKeyStoreIdMeta({});
                    this.multiKeyStore = [keyStore];
                }
                else {
                    this.multiKeyStore = [];
                }
                yield this.save();
            }
            else {
                this.multiKeyStore = multiKeyStore;
            }
            let hasLegacyKeyStore = false;
            // In prior of version 1.2, bip44 path didn't tie with the keystore, and bip44 exists on the chain info.
            // But, after some chain matures, they decided the bip44 path's coin type.
            // So, some chain can have the multiple bip44 coin type (one is the standard coin type and other is the legacy coin type).
            // We should support the legacy coin type, so we determined that the coin type ties with the keystore.
            // To decrease the barrier of existing users, set the alternative coin type by force if the keystore version is prior than 1.2.
            if (this.keyStore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (this.keyStore.version === "1" || this.keyStore.version === "1.1") {
                    hasLegacyKeyStore = true;
                    this.updateLegacyKeyStore(this.keyStore);
                }
            }
            for (const keyStore of this.multiKeyStore) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (keyStore.version === "1" || keyStore.version === "1.1") {
                    hasLegacyKeyStore = true;
                    this.updateLegacyKeyStore(keyStore);
                }
            }
            if (hasLegacyKeyStore) {
                yield this.save();
            }
            console.log("keyring restore done");
            this.loaded = true;
        });
    }
    updateLegacyKeyStore(keyStore) {
        keyStore.version = "1.2";
        for (const chainInfo of this.embedChainInfos) {
            const coinType = (() => {
                if (chainInfo.alternativeBIP44s &&
                    chainInfo.alternativeBIP44s.length > 0) {
                    return chainInfo.alternativeBIP44s[0].coinType;
                }
                else {
                    return chainInfo.bip44.coinType;
                }
            })();
            keyStore.coinTypeForChain = Object.assign(Object.assign({}, keyStore.coinTypeForChain), { [cosmos_build["ChainIdHelper"].parse(chainInfo.chainId).identifier]: coinType });
        }
    }
    isKeyStoreCoinTypeSet(chainId) {
        if (!this.keyStore) {
            throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
        }
        return (this.keyStore.coinTypeForChain &&
            this.keyStore.coinTypeForChain[cosmos_build["ChainIdHelper"].parse(chainId).identifier] !== undefined);
    }
    setKeyStoreCoinType(chainId, coinType) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (!this.keyStore) {
                throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
            }
            if (this.keyStore.coinTypeForChain &&
                this.keyStore.coinTypeForChain[cosmos_build["ChainIdHelper"].parse(chainId).identifier] !== undefined) {
                throw new router_build["KeplrError"]("keyring", 110, "Coin type already set");
            }
            this.keyStore.coinTypeForChain = Object.assign(Object.assign({}, this.keyStore.coinTypeForChain), { [cosmos_build["ChainIdHelper"].parse(chainId).identifier]: coinType });
            const keyStoreInMulti = this.multiKeyStore.find((keyStore) => {
                return (keyring_KeyRing.getKeyStoreId(keyStore) ===
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    keyring_KeyRing.getKeyStoreId(this.keyStore));
            });
            if (keyStoreInMulti) {
                keyStoreInMulti.coinTypeForChain = Object.assign({}, this.keyStore.coinTypeForChain);
            }
            yield this.save();
        });
    }
    removeAllKeyStoreCoinType(chainId) {
        var _a, _b;
        const identifier = cosmos_build["ChainIdHelper"].parse(chainId).identifier;
        if (this.keyStore) {
            const coinTypeForChain = (_a = this.keyStore.coinTypeForChain) !== null && _a !== void 0 ? _a : {};
            delete coinTypeForChain[identifier];
            this.keyStore.coinTypeForChain = coinTypeForChain;
        }
        for (const keyStore of this.multiKeyStore) {
            const coinTypeForChain = (_b = keyStore.coinTypeForChain) !== null && _b !== void 0 ? _b : {};
            delete coinTypeForChain[identifier];
            keyStore.coinTypeForChain = coinTypeForChain;
        }
        this.save();
    }
    deleteKeyRing(index, password) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
            }
            if (this.password !== password) {
                throw new router_build["KeplrError"]("keyring", 121, "Invalid password");
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
            }
            const multiKeyStore = this.multiKeyStore
                .slice(0, index)
                .concat(this.multiKeyStore.slice(index + 1));
            // Make sure that password is valid.
            yield crypto_Crypto.decrypt(this.crypto, this.multiKeyStore[0], password);
            let keyStoreChanged = false;
            if (this.keyStore) {
                // If key store is currently selected key store
                if (keyring_KeyRing.getKeyStoreId(keyStore) === keyring_KeyRing.getKeyStoreId(this.keyStore)) {
                    // If there is a key store left
                    if (multiKeyStore.length > 0) {
                        // Lock key store at first
                        yield this.lock();
                        // Select first key store
                        this.keyStore = multiKeyStore[0];
                        // And unlock it
                        yield this.unlock(password);
                    }
                    else {
                        // Else clear keyring.
                        this.keyStore = null;
                        this.mnemonicMasterSeed = undefined;
                        this.privateKey = undefined;
                        this.ledgerPublicKeyCache = undefined;
                        this.misesService.lockAll();
                    }
                    keyStoreChanged = true;
                }
            }
            this.multiKeyStore = multiKeyStore;
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
                keyStoreChanged,
            };
        });
    }
    updateNameKeyRing(index, name) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
            }
            keyStore.meta = Object.assign(Object.assign({}, keyStore.meta), { name: name });
            // If select key store and changed store are same, sync keystore
            if (this.keyStore &&
                keyring_KeyRing.getKeyStoreId(this.keyStore) === keyring_KeyRing.getKeyStoreId(keyStore)) {
                this.keyStore = keyStore;
            }
            yield this.save();
            return this.getMultiKeyStoreInfo();
        });
    }
    loadKey(coinType, useEthereumAddress = false) {
        if (this.status !== KeyRingStatus.UNLOCKED) {
            throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
        }
        if (!this.keyStore) {
            throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
        }
        const privKey = this.loadPrivKey(coinType);
        const pubKey = privKey.getPubKey();
        if (useEthereumAddress) {
            // For Ethereum Key-Gen Only:
            const wallet = new lib_esm["Wallet"](privKey.toBytes());
            return {
                algo: "ethsecp256k1",
                pubKey: pubKey.toBytes(),
                address: buffer["Buffer"].from(wallet.address.replace("0x", ""), "hex"),
                isNanoLedger: false,
            };
        }
        // Default
        return {
            algo: "secp256k1",
            pubKey: pubKey.toBytes(),
            address: pubKey.getAddress(),
            isNanoLedger: false,
        };
    }
    loadPrivKey(coinType) {
        if (this.status !== KeyRingStatus.UNLOCKED ||
            this.type === "none" ||
            !this.keyStore) {
            throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
        }
        const bip44HDPath = keyring_KeyRing.getKeyStoreBIP44Path(this.keyStore);
        if (this.type === "mnemonic") {
            const path = `m/44'/${coinType}'/${bip44HDPath.account}'/${bip44HDPath.change}/${bip44HDPath.addressIndex}`;
            const cachedKey = this.cached.get(path);
            if (cachedKey) {
                return new build["PrivKeySecp256k1"](cachedKey);
            }
            if (!this.mnemonicMasterSeed) {
                throw new router_build["KeplrError"]("keyring", 133, "Key store type is mnemonic and it is unlocked. But, mnemonic is not loaded unexpectedly");
            }
            const privKey = build["Mnemonic"].generatePrivateKeyFromMasterSeed(this.mnemonicMasterSeed, path);
            this.cached.set(path, privKey);
            return new build["PrivKeySecp256k1"](privKey);
        }
        else if (this.type === "privateKey") {
            // If key store type is private key, path will be ignored.
            if (!this.privateKey) {
                throw new router_build["KeplrError"]("keyring", 134, "Key store type is private key and it is unlocked. But, private key is not loaded unexpectedly");
            }
            return new build["PrivKeySecp256k1"](this.privateKey);
        }
        else {
            throw new router_build["KeplrError"]("keyring", 145, "Unexpected type of keyring");
        }
    }
    sign(env, chainId, defaultCoinType, message, useEthereumSigning) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            console.log(env);
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
            }
            if (!this.keyStore) {
                throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
            }
            const coinType = this.computeKeyStoreCoinType(chainId, defaultCoinType);
            const privKey = this.loadPrivKey(coinType);
            const signature = useEthereumSigning
                ? privKey.signDigest32(build["Hash"].keccak256(message))
                : privKey.sign(message);
            // Signing indicates an explicit use of this coin type.
            // Mainly, this logic exists to explicitly set the coin type when signing by an external request.
            if (!this.isKeyStoreCoinTypeSet(chainId)) {
                yield this.setKeyStoreCoinType(chainId, coinType);
            }
            console.log("sign");
            return signature;
            // }
        });
    }
    signEthereum(env, chainId, defaultCoinType, message, type) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            console.log(env);
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
            }
            if (!this.keyStore) {
                throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
            }
            const coinType = this.computeKeyStoreCoinType(chainId, defaultCoinType);
            // Allow signing with Ethereum for chains with coinType !== 60
            const privKey = this.loadPrivKey(coinType);
            const ethWallet = new lib_esm["Wallet"](privKey.toBytes());
            switch (type) {
                case types_build["EthSignType"].MESSAGE: {
                    // Sign bytes with prefixed Ethereum magic
                    const signature = yield ethWallet.signMessage(message);
                    return bytes_lib_esm["arrayify"](signature);
                }
                case types_build["EthSignType"].TRANSACTION: {
                    // Sign Ethereum transaction
                    const signature = yield ethWallet.signTransaction(JSON.parse(buffer["Buffer"].from(message).toString()));
                    return bytes_lib_esm["arrayify"](signature);
                }
                case types_build["EthSignType"].EIP712: {
                    const data = yield EIP712MessageValidator.validateAsync(JSON.parse(buffer["Buffer"].from(message).toString()));
                    // Since ethermint eip712 tx uses non-standard format, it cannot pass validation of ethersjs.
                    // Therefore, it should be handled at a slightly lower level.
                    const signature = yield ethWallet._signingKey().signDigest(build["Hash"].keccak256(buffer["Buffer"].concat([
                        // eth separator
                        buffer["Buffer"].from("19", "hex"),
                        // Version: 1
                        buffer["Buffer"].from("01", "hex"),
                        buffer["Buffer"].from(typed_data["a" /* TypedDataEncoder */]
                            .hashStruct("EIP712Domain", { EIP712Domain: data.types.EIP712Domain }, data.domain)
                            .replace("0x", ""), "hex"),
                        buffer["Buffer"].from(typed_data["a" /* TypedDataEncoder */]
                            .from(
                        // Seems that there is no way to set primary type and the first type becomes primary type.
                        (() => {
                            const types = Object.assign({}, data.types);
                            delete types["EIP712Domain"];
                            const primary = types[data.primaryType];
                            if (!primary) {
                                throw new Error(`No matched primary type: ${data.primaryType}`);
                            }
                            delete types[data.primaryType];
                            return Object.assign({ [data.primaryType]: primary }, types);
                        })())
                            .hash(data.message)
                            .replace("0x", ""), "hex"),
                    ])));
                    return buffer["Buffer"].concat([
                        buffer["Buffer"].from(signature.r.replace("0x", ""), "hex"),
                        buffer["Buffer"].from(signature.s.replace("0x", ""), "hex"),
                        // The metamask doesn't seem to consider the chain id in this case... (maybe bug on metamask?)
                        signature.recoveryParam
                            ? buffer["Buffer"].from("1c", "hex")
                            : buffer["Buffer"].from("1b", "hex"),
                    ]);
                }
                default:
                    throw new Error(`Unknown sign type: ${type}`);
            }
        });
    }
    // Show private key or mnemonic key if password is valid.
    showKeyRing(index, password) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED) {
                throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
            }
            if (this.password !== password) {
                throw new router_build["KeplrError"]("keyring", 121, "Invalid password");
            }
            // If the index is -1, the mnemonic is exported
            if (index === -1) {
                const keyStore = this.multiKeyStore[0];
                return buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, keyStore, password)).toString();
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_build["KeplrError"]("keyring", 130, "Key store is empty");
            }
            if (keyStore.type === "mnemonic") {
                // If password is invalid, error will be thrown.
                if (!this.checkPassword(password)) {
                    throw new router_build["KeplrError"]("keyring", 222, "Unmatched mac");
                }
                const privKey = yield this.loadMnemonicPrivKey(60, keyStore);
                const ethWallet = new lib_esm["Wallet"](privKey.toBytes());
                return ethWallet.privateKey.replace("0x", "");
            }
            else {
                // If password is invalid, error will be thrown.
                return buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, keyStore, password)).toString();
            }
        });
    }
    loadMnemonicPrivKey(coinType, keyStore) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || !keyStore) {
                throw new router_build["KeplrError"]("keyring", 143, "Key ring is not unlocked");
            }
            const bip44HDPath = keyring_KeyRing.getKeyStoreBIP44Path(keyStore);
            const path = `m/44'/${coinType}'/${bip44HDPath.account}'/${bip44HDPath.change}/${bip44HDPath.addressIndex}`;
            const cachedKey = this.cached.get(path);
            if (cachedKey) {
                return new build["PrivKeySecp256k1"](cachedKey);
            }
            const mnemonic = buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, this.multiKeyStore[0], this.password)).toString();
            const mnemonicMasterSeed = build["Mnemonic"].generateMasterSeedFromMnemonic(mnemonic);
            if (!mnemonicMasterSeed) {
                throw new router_build["KeplrError"]("keyring", 133, "Key store type is mnemonic and it is unlocked. But, mnemonic is not loaded unexpectedly");
            }
            const privKey = build["Mnemonic"].generatePrivateKeyFromMasterSeed(mnemonicMasterSeed, path);
            this.cached.set(path, privKey);
            return new build["PrivKeySecp256k1"](privKey);
        });
    }
    get canSetPath() {
        return this.type === "mnemonic" || this.type === "ledger";
    }
    addMnemonicKey(kdf, mnemonic, meta, bip44HDPath) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || this.password == "") {
                throw new router_build["KeplrError"]("keyring", 141, "Key ring is locked or not initialized");
            }
            console.log(mnemonic);
            const keyStore = yield keyring_KeyRing.CreateMnemonicKeyStore(this.crypto, kdf, "", "", yield this.assignKeyStoreIdMeta(meta), bip44HDPath);
            this.multiKeyStore.push(keyStore);
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    _checkPrivateKey(privatekeyStore, currentKey) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(privatekeyStore) && privatekeyStore.length > 0) {
                const privatePromiseKeyStore = privatekeyStore.map((keyStore) => keyring_awaiter(this, void 0, void 0, function* () {
                    return buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, keyStore, this.password)).toString();
                }));
                const privateKeyStoreList = yield Promise.all(privatePromiseKeyStore);
                return privateKeyStoreList.some((privateKey) => privateKey === currentKey);
            }
            return false;
        });
    }
    addPrivateKey(kdf, privateKey, meta) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || this.password == "") {
                throw new router_build["KeplrError"]("keyring", 141, "Key ring is locked or not initialized");
            }
            const privatekeyStore = this.multiKeyStore.filter((val) => val.type === "privateKey");
            if (privatekeyStore.length > 0) {
                const isChecked = yield this._checkPrivateKey(privatekeyStore, buffer["Buffer"].from(privateKey).toString("hex"));
                if (isChecked) {
                    throw new router_build["KeplrError"]("keyring", 141, "Don't repeat the import privateKey");
                }
            }
            const keyStore = yield keyring_KeyRing.CreatePrivateKeyStore(this.crypto, kdf, privateKey, this.password, yield this.assignKeyStoreIdMeta(meta));
            this.multiKeyStore.push(keyStore);
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    changeKeyStoreFromMultiKeyStore(index) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (this.status !== KeyRingStatus.UNLOCKED || this.password == "") {
                throw new router_build["KeplrError"]("keyring", 141, "Key ring is locked or not initialized");
            }
            const keyStore = this.multiKeyStore[index];
            if (!keyStore) {
                throw new router_build["KeplrError"]("keyring", 120, "Invalid keystore");
            }
            this.keyStore = keyStore;
            yield this.unlock(this.password);
            yield this.save();
            return {
                multiKeyStoreInfo: this.getMultiKeyStoreInfo(),
            };
        });
    }
    getMultiKeyStoreInfo() {
        const result = [];
        for (const keyStore of this.multiKeyStore) {
            result.push({
                version: keyStore.version,
                type: keyStore.type,
                meta: keyStore.meta,
                coinTypeForChain: keyStore.coinTypeForChain,
                bip44HDPath: keyStore.bip44HDPath,
                selected: this.keyStore
                    ? keyring_KeyRing.getKeyStoreId(keyStore) ===
                        keyring_KeyRing.getKeyStoreId(this.keyStore)
                    : false,
            });
        }
        return result;
    }
    checkPassword(password) {
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 100, "Keyring is locked");
        }
        return this.password === password;
    }
    exportKeyRingDatas(password) {
        var _a, _b, _c, _d, _e;
        return keyring_awaiter(this, void 0, void 0, function* () {
            if (!this.password) {
                throw new router_build["KeplrError"]("keyring", 100, "Keyring is locked");
            }
            if (this.password !== password) {
                throw new router_build["KeplrError"]("keyring", 121, "Invalid password");
            }
            const result = [];
            for (const keyStore of this.multiKeyStore) {
                const type = (_a = keyStore.type) !== null && _a !== void 0 ? _a : "mnemonic";
                switch (type) {
                    case "mnemonic": {
                        const mnemonic = buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, this.multiKeyStore[0], password)).toString();
                        result.push({
                            bip44HDPath: (_b = keyStore.bip44HDPath) !== null && _b !== void 0 ? _b : {
                                account: 0,
                                change: 0,
                                addressIndex: 0,
                            },
                            coinTypeForChain: keyStore.coinTypeForChain,
                            key: mnemonic,
                            meta: (_c = keyStore.meta) !== null && _c !== void 0 ? _c : {},
                            type: "mnemonic",
                        });
                        break;
                    }
                    case "privateKey": {
                        const privateKey = buffer["Buffer"].from(yield crypto_Crypto.decrypt(this.crypto, keyStore, password)).toString();
                        result.push({
                            bip44HDPath: (_d = keyStore.bip44HDPath) !== null && _d !== void 0 ? _d : {
                                account: 0,
                                change: 0,
                                addressIndex: 0,
                            },
                            coinTypeForChain: keyStore.coinTypeForChain,
                            key: privateKey,
                            meta: (_e = keyStore.meta) !== null && _e !== void 0 ? _e : {},
                            type: "privateKey",
                        });
                        break;
                    }
                }
            }
            return result;
        });
    }
    static CreateMnemonicKeyStore(crypto, kdf, mnemonic, password, meta, bip44HDPath) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            return yield crypto_Crypto.encrypt(crypto, kdf, "mnemonic", mnemonic, password, meta, bip44HDPath);
        });
    }
    static CreatePrivateKeyStore(crypto, kdf, privateKey, password, meta) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            return yield crypto_Crypto.encrypt(crypto, kdf, "privateKey", buffer["Buffer"].from(privateKey).toString("hex"), password, meta);
        });
    }
    assignKeyStoreIdMeta(meta) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            // `__id__` is used to distinguish the key store.
            return Object.assign({}, meta, {
                __id__: (yield this.getIncrementalNumber()).toString(),
            });
        });
    }
    static getKeyStoreId(keyStore) {
        var _a;
        const id = (_a = keyStore.meta) === null || _a === void 0 ? void 0 : _a.__id__;
        if (!id) {
            throw new router_build["KeplrError"]("keyring", 131, "Key store's id is empty");
        }
        return id;
    }
    static getKeyStoreBIP44Path(keyStore) {
        if (!keyStore.bip44HDPath) {
            return {
                account: 0,
                change: 0,
                addressIndex: 0,
            };
        }
        keyring_KeyRing.validateBIP44Path(keyStore.bip44HDPath);
        return keyStore.bip44HDPath;
    }
    static validateBIP44Path(bip44Path) {
        if (!Number.isInteger(bip44Path.account) || bip44Path.account < 0) {
            throw new router_build["KeplrError"]("keyring", 100, "Invalid account in hd path");
        }
        if (!Number.isInteger(bip44Path.change) ||
            !(bip44Path.change === 0 || bip44Path.change === 1)) {
            throw new router_build["KeplrError"]("keyring", 102, "Invalid change in hd path");
        }
        if (!Number.isInteger(bip44Path.addressIndex) ||
            bip44Path.addressIndex < 0) {
            throw new router_build["KeplrError"]("keyring", 101, "Invalid address index in hd path");
        }
    }
    getIncrementalNumber() {
        return keyring_awaiter(this, void 0, void 0, function* () {
            let num = yield this.kvStore.get("incrementalNumber");
            if (num === undefined) {
                num = 0;
            }
            num++;
            yield this.kvStore.set("incrementalNumber", num);
            return num;
        });
    }
    // XXX: There are other way to handle tx with ethermint on ledger.
    //      However, some chains have probably competitive spirit with evmos.
    //      They make unnecessary and silly minor changes to ethermint spec.
    //      Thus, there is a probability that it will potentially not work on other chains and they blame us.
    //      So, block them explicitly for now.
    throwErrorIfEthermintWithLedgerButNotEvmos(chainId) {
        if (this.keyStore && this.keyStore.type === "ledger") {
            if (!chainId.startsWith("evmos_")) {
                throw new router_build["KeplrError"]("keyring", 152, "Ledger is unsupported for this chain");
            }
        }
    }
    addAccount(name, bip44HDPath) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.addMnemonicKey("scrypt", "", {
                    name,
                }, bip44HDPath);
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    _restoreFirstAccount(mnemonic, password) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            return this.createMnemonicKey("scrypt", mnemonic, password, {
                name: "Account 1",
            }, {
                account: 0,
                change: 0,
                addressIndex: 0,
            });
        });
    }
    _addAccounts(addNumber, mnemonicKeys) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            const accounts = new Array(addNumber).fill("").map((_value, index) => {
                const bip44HDPath = {
                    account: 0,
                    addressIndex: index + 1,
                    change: 0,
                };
                const name = `Account ${index + 2}`;
                return {
                    bip44HDPath,
                    name,
                };
            });
            let multiKeyStore = {
                multiKeyStoreInfo: [],
            };
            for (let index = 0; index < accounts.length; index++) {
                const element = accounts[index];
                multiKeyStore = yield this.addAccount(element.name, element.bip44HDPath);
            }
            // add private key account
            const simpleKeys = mnemonicKeys.find((val) => val.type === "Simple Key Pair");
            if ((simpleKeys === null || simpleKeys === void 0 ? void 0 : simpleKeys.data.length) > 0) {
                for (let index = 0; index < (simpleKeys === null || simpleKeys === void 0 ? void 0 : simpleKeys.data.length); index++) {
                    const element = simpleKeys === null || simpleKeys === void 0 ? void 0 : simpleKeys.data[index];
                    const privateKey = buffer["Buffer"].from(element, "hex");
                    multiKeyStore = yield this.addPrivateKey("scrypt", privateKey, {
                        name: `Account ${multiKeyStore.multiKeyStoreInfo.length + 1}`,
                    });
                }
            }
            return multiKeyStore;
        });
    }
    migratorKeyRing(password) {
        return keyring_awaiter(this, void 0, void 0, function* () {
            try {
                const mnemonicKeys = yield this.migrator.enCodeValut(this.migratorStore, password);
                const mnemonicKey = mnemonicKeys.find((val) => val.type === "HD Key Tree");
                if (mnemonicKey) {
                    const mnemonic = buffer["Buffer"].from(mnemonicKey === null || mnemonicKey === void 0 ? void 0 : mnemonicKey.data.mnemonic).toString("utf8");
                    const numberOfAccounts = mnemonicKey === null || mnemonicKey === void 0 ? void 0 : mnemonicKey.data.numberOfAccounts;
                    const firstAccount = yield this._restoreFirstAccount(mnemonic, password);
                    // An account has already been initialized, so need to delete first account number
                    const addNumber = numberOfAccounts > 1 ? numberOfAccounts - 1 : 0;
                    // clear thhe metamask cache data
                    yield this.migrator.clearCache();
                    this.migratorStore = {
                        vault: "",
                    };
                    return addNumber > 0
                        ? yield this._addAccounts(addNumber, mnemonicKeys)
                        : firstAccount;
                }
                return {
                    multiKeyStoreInfo: [],
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    restoreKeyStore() {
        this.keyStore = null;
        this.multiKeyStore = [];
        this.save();
    }
}

// EXTERNAL MODULE: ../common/build/index.js
var common_build = __webpack_require__(27);

// EXTERNAL MODULE: ../proto-types/cosmos/tx/v1beta1/tx.js
var tx = __webpack_require__(100);

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/long/src/long.js
var src_long = __webpack_require__(7);
var long_default = /*#__PURE__*/__webpack_require__.n(src_long);

// CONCATENATED MODULE: ../background/src/keyring/amino-sign-doc.ts

const TrimAminoSignDocScheme = joi_browser_min_default.a.object({
    chain_id: joi_browser_min_default.a.string().allow(""),
    account_number: joi_browser_min_default.a.string().allow(""),
    sequence: joi_browser_min_default.a.string().allow(""),
    fee: joi_browser_min_default.a.object({
        amount: joi_browser_min_default.a.array().items(joi_browser_min_default.a.object({
            denom: joi_browser_min_default.a.string().allow(""),
            amount: joi_browser_min_default.a.string().allow(""),
        })),
        gas: joi_browser_min_default.a.string().allow(""),
        payer: joi_browser_min_default.a.string().allow(""),
        granter: joi_browser_min_default.a.string().allow(""),
        // XXX: "feePayer" should be "payer". But, it maybe from ethermint team's mistake.
        //      That means this part is not standard.
        feePayer: joi_browser_min_default.a.string().allow(""),
    }),
    msgs: joi_browser_min_default.a.array().items(joi_browser_min_default.a.any()),
    memo: joi_browser_min_default.a.string().allow(""),
    timeout_height: joi_browser_min_default.a.string().allow(""),
});
/**
 * Trim unknown fields from sign doc.
 * The purpose of this function is not validate the sign doc, but only trim unknown fields.
 * @param signDoc
 */
function trimAminoSignDoc(signDoc) {
    const res = TrimAminoSignDocScheme.validate(signDoc, {
        stripUnknown: true,
    });
    if (res.error) {
        throw res.error;
    }
    return res.value;
}

// CONCATENATED MODULE: ../background/src/keyring/service.ts
var service_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









class service_KeyRingService {
    constructor(kvStore, embedChainInfos, crypto) {
        this.kvStore = kvStore;
        this.embedChainInfos = embedChainInfos;
        this.crypto = crypto;
        this.onChainRemoved = (chainId) => {
            this.keyRing.removeAllKeyStoreCoinType(chainId);
        };
    }
    init(interactionService, chainsService, permissionService, misesService) {
        this.interactionService = interactionService;
        this.chainsService = chainsService;
        this.permissionService = permissionService;
        this.keyRing = new keyring_KeyRing(this.embedChainInfos, this.kvStore, this.crypto, misesService);
        this.chainsService.addChainRemovedHandler(this.onChainRemoved);
    }
    restore() {
        return service_awaiter(this, void 0, void 0, function* () {
            yield this.keyRing.restore();
            return {
                status: this.keyRing.status,
                multiKeyStoreInfo: this.keyRing.getMultiKeyStoreInfo(),
            };
        });
    }
    enable(env) {
        return service_awaiter(this, void 0, void 0, function* () {
            if (this.keyRing.status === KeyRingStatus.NOTLOADED) {
                yield this.keyRing.restore();
            }
            if (this.keyRing.status === KeyRingStatus.EMPTY) {
                yield this.interactionService.waitApprove(env, "/register", "register", {});
                return this.keyRing.status;
            }
            if ([KeyRingStatus.LOCKED, KeyRingStatus.MIGRATOR].includes(this.keyRing.status)) {
                console.log("unlock", env);
                yield this.interactionService.waitApprove(env, "/unlock", "unlock", {});
                return this.keyRing.status;
            }
            return this.keyRing.status;
        });
    }
    get keyRingStatus() {
        return this.keyRing.status;
    }
    deleteKeyRing(index, password) {
        return service_awaiter(this, void 0, void 0, function* () {
            let keyStoreChanged = false;
            try {
                const result = yield this.keyRing.deleteKeyRing(index, password);
                keyStoreChanged = result.keyStoreChanged;
                return {
                    multiKeyStoreInfo: result.multiKeyStoreInfo,
                    status: this.keyRing.status,
                };
            }
            finally {
                if (keyStoreChanged) {
                    this.interactionService.dispatchEvent(router_build["WEBPAGE_PORT"], "keystore-changed", {});
                }
            }
        });
    }
    updateNameKeyRing(index, name) {
        return service_awaiter(this, void 0, void 0, function* () {
            const multiKeyStoreInfo = yield this.keyRing.updateNameKeyRing(index, name);
            return {
                multiKeyStoreInfo,
            };
        });
    }
    showKeyRing(index, password) {
        return service_awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.showKeyRing(index, password);
        });
    }
    createMnemonicKey(kdf, mnemonic, password, meta, bip44HDPath) {
        return service_awaiter(this, void 0, void 0, function* () {
            // TODO: Check mnemonic checksum.
            return yield this.keyRing.createMnemonicKey(kdf, mnemonic, password, meta, bip44HDPath);
        });
    }
    createPrivateKey(kdf, privateKey, password, meta) {
        return service_awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.createPrivateKey(kdf, privateKey, password, meta);
        });
    }
    lock() {
        this.keyRing.lock();
        return this.keyRing.status;
    }
    unlock(password) {
        return service_awaiter(this, void 0, void 0, function* () {
            yield this.keyRing.unlock(password);
            return this.keyRing.status;
        });
    }
    getKey(chainId) {
        return service_awaiter(this, void 0, void 0, function* () {
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            return this.keyRing.getKey(chainId, yield this.chainsService.getChainCoinType(chainId), ethereumKeyFeatures.address);
        });
    }
    getKeyStoreMeta(key) {
        return this.keyRing.getKeyStoreMeta(key);
    }
    getKeyRingType() {
        return this.keyRing.type;
    }
    requestSignAmino(env, msgOrigin, chainId, signer, signDoc, signOptions) {
        return service_awaiter(this, void 0, void 0, function* () {
            signDoc = Object.assign(Object.assign({}, signDoc), { memo: Object(common_build["escapeHTML"])(signDoc.memo) });
            signDoc = trimAminoSignDoc(signDoc);
            signDoc = Object(common_build["sortObjectByKey"])(signDoc);
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Prefix = (yield this.chainsService.getChainInfo(chainId))
                .bech32Config.bech32PrefixAccAddr;
            const bech32Address = new cosmos_build["Bech32Address"](key.address).toBech32(bech32Prefix);
            if (signer !== bech32Address) {
                throw new router_build["KeplrError"]("keyring", 231, "Signer mismatched");
            }
            const isADR36SignDoc = Object(cosmos_build["checkAndValidateADR36AminoSignDoc"])(signDoc, bech32Prefix);
            if (isADR36SignDoc) {
                if (signDoc.msgs[0].value.signer !== signer) {
                    throw new router_build["KeplrError"]("keyring", 233, "Unmatched signer in sign doc");
                }
            }
            if (signOptions.isADR36WithString != null && !isADR36SignDoc) {
                throw new router_build["KeplrError"]("keyring", 236, 'Sign doc is not for ADR-36. But, "isADR36WithString" option is defined');
            }
            if (signOptions.ethSignType && !isADR36SignDoc) {
                throw new Error("Eth sign type can be requested with only ADR-36 amino sign doc");
            }
            let newSignDoc = (yield this.interactionService.waitApprove(env, "/sign", "request-sign", {
                msgOrigin,
                chainId,
                mode: "amino",
                signDoc,
                signer,
                signOptions,
                isADR36SignDoc,
                isADR36WithString: signOptions.isADR36WithString,
                ethSignType: signOptions.ethSignType,
            }));
            newSignDoc = Object.assign(Object.assign({}, newSignDoc), { memo: Object(common_build["escapeHTML"])(newSignDoc.memo) });
            if (isADR36SignDoc) {
                // Validate the new sign doc, if it was for ADR-36.
                if (Object(cosmos_build["checkAndValidateADR36AminoSignDoc"])(signDoc, bech32Prefix)) {
                    if (signDoc.msgs[0].value.signer !== signer) {
                        throw new router_build["KeplrError"]("keyring", 232, "Unmatched signer in new sign doc");
                    }
                }
                else {
                    throw new router_build["KeplrError"]("keyring", 237, "Signing request was for ADR-36. But, accidentally, new sign doc is not for ADR-36");
                }
            }
            // Handle Ethereum signing
            if (signOptions.ethSignType) {
                if (newSignDoc.msgs.length !== 1) {
                    // Validate number of messages
                    throw new Error("Invalid number of messages for Ethereum sign request");
                }
                const signBytes = buffer["Buffer"].from(newSignDoc.msgs[0].value.data, "base64");
                try {
                    const signatureBytes = yield this.keyRing.signEthereum(env, chainId, coinType, signBytes, signOptions.ethSignType);
                    return {
                        signed: newSignDoc,
                        signature: {
                            pub_key: Object(cosmos_build["encodeSecp256k1Pubkey"])(key.pubKey),
                            signature: buffer["Buffer"].from(signatureBytes).toString("base64"),
                        },
                    };
                }
                finally {
                    this.interactionService.dispatchEvent(router_build["APP_PORT"], "request-sign-end", {});
                }
            }
            try {
                const signature = yield this.keyRing.sign(env, chainId, coinType, Object(cosmos_build["serializeSignDoc"])(newSignDoc), ethereumKeyFeatures.signing);
                return {
                    signed: newSignDoc,
                    signature: Object(cosmos_build["encodeSecp256k1Signature"])(key.pubKey, signature),
                };
            }
            finally {
                this.interactionService.dispatchEvent(router_build["APP_PORT"], "request-sign-end", {});
            }
        });
    }
    requestSignEIP712CosmosTx_v0(env, msgOrigin, chainId, signer, eip712, signDoc, signOptions) {
        return service_awaiter(this, void 0, void 0, function* () {
            signDoc = Object.assign(Object.assign({}, signDoc), { memo: Object(common_build["escapeHTML"])(signDoc.memo) });
            signDoc = trimAminoSignDoc(signDoc);
            signDoc = Object(common_build["sortObjectByKey"])(signDoc);
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Prefix = (yield this.chainsService.getChainInfo(chainId))
                .bech32Config.bech32PrefixAccAddr;
            const bech32Address = new cosmos_build["Bech32Address"](key.address).toBech32(bech32Prefix);
            if (signer !== bech32Address) {
                throw new router_build["KeplrError"]("keyring", 231, "Signer mismatched");
            }
            let newSignDoc = (yield this.interactionService.waitApprove(env, "/sign", "request-sign", {
                msgOrigin,
                chainId,
                mode: "amino",
                signDoc,
                signer,
                signOptions,
                isADR36SignDoc: false,
                ethSignType: types_build["EthSignType"].EIP712,
            }));
            newSignDoc = Object.assign(Object.assign({}, newSignDoc), { memo: Object(common_build["escapeHTML"])(newSignDoc.memo) });
            try {
                const signature = yield this.keyRing.signEthereum(env, chainId, coinType, buffer["Buffer"].from(JSON.stringify({
                    types: eip712.types,
                    domain: eip712.domain,
                    primaryType: eip712.primaryType,
                    message: newSignDoc,
                })), types_build["EthSignType"].EIP712);
                return {
                    signed: newSignDoc,
                    signature: {
                        pub_key: Object(cosmos_build["encodeSecp256k1Pubkey"])(key.pubKey),
                        // Return eth signature (r | s | v) 65 bytes.
                        signature: buffer["Buffer"].from(signature).toString("base64"),
                    },
                };
            }
            finally {
                this.interactionService.dispatchEvent(router_build["APP_PORT"], "request-sign-end", {});
            }
        });
    }
    requestSignDirect(env, msgOrigin, chainId, signer, signDoc, signOptions) {
        return service_awaiter(this, void 0, void 0, function* () {
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            if (ethereumKeyFeatures.address || ethereumKeyFeatures.signing) {
                // Check the comment on the method itself.
                this.keyRing.throwErrorIfEthermintWithLedgerButNotEvmos(chainId);
            }
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Address = new cosmos_build["Bech32Address"](key.address).toBech32((yield this.chainsService.getChainInfo(chainId)).bech32Config
                .bech32PrefixAccAddr);
            if (signer !== bech32Address) {
                throw new router_build["KeplrError"]("keyring", 231, "Signer mismatched");
            }
            const newSignDocBytes = (yield this.interactionService.waitApprove(env, "/sign", "request-sign", {
                msgOrigin,
                chainId,
                mode: "direct",
                signDocBytes: tx["SignDoc"].encode(signDoc).finish(),
                signer,
                signOptions,
            }));
            const newSignDoc = tx["SignDoc"].decode(newSignDocBytes);
            try {
                const signature = yield this.keyRing.sign(env, chainId, coinType, newSignDocBytes, ethereumKeyFeatures.signing);
                return {
                    signed: Object.assign(Object.assign({}, newSignDoc), { accountNumber: long_default.a.fromString(newSignDoc.accountNumber) }),
                    signature: Object(cosmos_build["encodeSecp256k1Signature"])(key.pubKey, signature),
                };
            }
            finally {
                this.interactionService.dispatchEvent(router_build["APP_PORT"], "request-sign-end", {});
            }
        });
    }
    verifyADR36AminoSignDoc(chainId, signer, data, signature) {
        return service_awaiter(this, void 0, void 0, function* () {
            const coinType = yield this.chainsService.getChainCoinType(chainId);
            const ethereumKeyFeatures = yield this.chainsService.getChainEthereumKeyFeatures(chainId);
            const key = yield this.keyRing.getKey(chainId, coinType, ethereumKeyFeatures.address);
            const bech32Prefix = (yield this.chainsService.getChainInfo(chainId))
                .bech32Config.bech32PrefixAccAddr;
            const bech32Address = new cosmos_build["Bech32Address"](key.address).toBech32(bech32Prefix);
            if (signer !== bech32Address) {
                throw new router_build["KeplrError"]("keyring", 231, "Signer mismatched");
            }
            if (signature.pub_key.type !== "tendermint/PubKeySecp256k1") {
                throw new router_build["KeplrError"]("keyring", 211, `Unsupported type of pub key: ${signature.pub_key.type}`);
            }
            if (buffer["Buffer"].from(key.pubKey).toString("base64") !== signature.pub_key.value) {
                throw new router_build["KeplrError"]("keyring", 210, "Pub key unmatched");
            }
            const signDoc = Object(cosmos_build["makeADR36AminoSignDoc"])(signer, data);
            return Object(cosmos_build["verifyADR36AminoSignDoc"])(bech32Prefix, signDoc, buffer["Buffer"].from(signature.pub_key.value, "base64"), buffer["Buffer"].from(signature.signature, "base64"));
        });
    }
    sign(env, chainId, message) {
        return service_awaiter(this, void 0, void 0, function* () {
            return this.keyRing.sign(env, chainId, yield this.chainsService.getChainCoinType(chainId), message, (yield this.chainsService.getChainEthereumKeyFeatures(chainId)).signing);
        });
    }
    addMnemonicKey(kdf, mnemonic, meta, bip44HDPath) {
        return service_awaiter(this, void 0, void 0, function* () {
            return this.keyRing.addMnemonicKey(kdf, mnemonic, meta, bip44HDPath);
        });
    }
    addPrivateKey(kdf, privateKey, meta) {
        return service_awaiter(this, void 0, void 0, function* () {
            return this.keyRing.addPrivateKey(kdf, privateKey, meta);
        });
    }
    changeKeyStoreFromMultiKeyStore(index) {
        return service_awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.keyRing.changeKeyStoreFromMultiKeyStore(index);
            }
            finally {
                this.interactionService.dispatchEvent(router_build["WEBPAGE_PORT"], "keystore-changed", {});
            }
        });
    }
    checkPassword(password) {
        return this.keyRing.checkPassword(password);
    }
    getMultiKeyStoreInfo() {
        return this.keyRing.getMultiKeyStoreInfo();
    }
    isKeyStoreCoinTypeSet(chainId) {
        return this.keyRing.isKeyStoreCoinTypeSet(chainId);
    }
    setKeyStoreCoinType(chainId, coinType) {
        return service_awaiter(this, void 0, void 0, function* () {
            const prevCoinType = this.keyRing.computeKeyStoreCoinType(chainId, yield this.chainsService.getChainCoinType(chainId));
            yield this.keyRing.setKeyStoreCoinType(chainId, coinType);
            if (prevCoinType !== coinType) {
                this.interactionService.dispatchEvent(router_build["WEBPAGE_PORT"], "keystore-changed", {});
            }
        });
    }
    getKeyStoreBIP44Selectables(chainId, paths) {
        return service_awaiter(this, void 0, void 0, function* () {
            if (this.isKeyStoreCoinTypeSet(chainId)) {
                return [];
            }
            const result = [];
            const chainInfo = yield this.chainsService.getChainInfo(chainId);
            for (const path of paths) {
                const key = yield this.keyRing.getKeyFromCoinType(path.coinType, (yield this.chainsService.getChainEthereumKeyFeatures(chainId)).address);
                const bech32Address = new cosmos_build["Bech32Address"](key.address).toBech32(chainInfo.bech32Config.bech32PrefixAccAddr);
                result.push({
                    path,
                    bech32Address,
                });
            }
            return result;
        });
    }
    exportKeyRingDatas(password) {
        return service_awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.exportKeyRingDatas(password);
        });
    }
    addAccount(name, bip44HDPath) {
        return service_awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.addAccount(name, bip44HDPath);
        });
    }
    migratorKeyRing(password) {
        return service_awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.migratorKeyRing(password);
        });
    }
    restoreKeyStore() {
        return service_awaiter(this, void 0, void 0, function* () {
            return yield this.keyRing.restoreKeyStore();
        });
    }
}

// CONCATENATED MODULE: ../background/src/keyring/constants.ts
const ROUTE = "keyring";

// CONCATENATED MODULE: ../background/src/keyring/messages.ts





// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = __webpack_require__(105);


class messages_RestoreKeyRingMsg extends router_build["Message"] {
    static type() {
        return "restore-keyring";
    }
    constructor() {
        super();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validateBasic() { }
    route() {
        return ROUTE;
    }
    type() {
        return messages_RestoreKeyRingMsg.type();
    }
}
class messages_DeleteKeyRingMsg extends router_build["Message"] {
    constructor(index, password) {
        super();
        this.index = index;
        this.password = password;
    }
    static type() {
        return "delete-keyring";
    }
    validateBasic() {
        if (!Number.isInteger(this.index)) {
            throw new router_build["KeplrError"]("keyring", 201, "Invalid index");
        }
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_DeleteKeyRingMsg.type();
    }
}
class messages_UpdateNameKeyRingMsg extends router_build["Message"] {
    constructor(index, name) {
        super();
        this.index = index;
        this.name = name;
    }
    static type() {
        return "update-name-keyring";
    }
    validateBasic() {
        if (!Number.isInteger(this.index)) {
            throw new router_build["KeplrError"]("keyring", 201, "Invalid index");
        }
        if (!this.name) {
            throw new router_build["KeplrError"]("keyring", 273, "name not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_UpdateNameKeyRingMsg.type();
    }
}
class messages_ShowKeyRingMsg extends router_build["Message"] {
    constructor(index, password) {
        super();
        this.index = index;
        this.password = password;
    }
    static type() {
        return "show-keyring";
    }
    validateBasic() {
        if (!Number.isInteger(this.index)) {
            throw new router_build["KeplrError"]("keyring", 201, "Invalid index");
        }
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_ShowKeyRingMsg.type();
    }
}
class messages_CreateMnemonicKeyMsg extends router_build["Message"] {
    constructor(kdf, mnemonic, password, meta, bip44HDPath) {
        super();
        this.kdf = kdf;
        this.mnemonic = mnemonic;
        this.password = password;
        this.meta = meta;
        this.bip44HDPath = bip44HDPath;
    }
    static type() {
        return "create-mnemonic-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_build["KeplrError"]("keyring", 202, "Invalid kdf");
        }
        if (!this.mnemonic) {
            throw new router_build["KeplrError"]("keyring", 272, "mnemonic not set");
        }
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
        // Validate mnemonic.
        // Checksome is not validate in this method.
        // Keeper should handle the case of invalid checksome.
        try {
            bip39.mnemonicToEntropy(this.mnemonic);
        }
        catch (e) {
            if (e.message !== "Invalid mnemonic checksum") {
                throw e;
            }
        }
        keyring_KeyRing.validateBIP44Path(this.bip44HDPath);
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_CreateMnemonicKeyMsg.type();
    }
}
class messages_AddMnemonicKeyMsg extends router_build["Message"] {
    constructor(kdf, mnemonic, meta, bip44HDPath) {
        super();
        this.kdf = kdf;
        this.mnemonic = mnemonic;
        this.meta = meta;
        this.bip44HDPath = bip44HDPath;
    }
    static type() {
        return "add-mnemonic-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_build["KeplrError"]("keyring", 202, "Invalid kdf");
        }
        if (!this.mnemonic) {
            throw new router_build["KeplrError"]("keyring", 272, "mnemonic not set");
        }
        // Validate mnemonic.
        // Checksome is not validate in this method.
        // Keeper should handle the case of invalid checksome.
        try {
            bip39.mnemonicToEntropy(this.mnemonic);
        }
        catch (e) {
            if (e.message !== "Invalid mnemonic checksum") {
                throw e;
            }
        }
        keyring_KeyRing.validateBIP44Path(this.bip44HDPath);
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_AddMnemonicKeyMsg.type();
    }
}
class messages_CreatePrivateKeyMsg extends router_build["Message"] {
    constructor(kdf, privateKey, password, meta) {
        super();
        this.kdf = kdf;
        this.privateKey = privateKey;
        this.password = password;
        this.meta = meta;
    }
    static type() {
        return "create-private-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_build["KeplrError"]("keyring", 202, "Invalid kdf");
        }
        if (!this.privateKey || this.privateKey.length === 0) {
            throw new router_build["KeplrError"]("keyring", 275, "private key not set");
        }
        if (this.privateKey.length !== 32) {
            throw new router_build["KeplrError"]("keyring", 260, "invalid length of private key");
        }
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_CreatePrivateKeyMsg.type();
    }
}
class messages_AddPrivateKeyMsg extends router_build["Message"] {
    constructor(kdf, privateKey, meta) {
        super();
        this.kdf = kdf;
        this.privateKey = privateKey;
        this.meta = meta;
    }
    static type() {
        return "add-private-key";
    }
    validateBasic() {
        if (this.kdf !== "scrypt" &&
            this.kdf !== "sha256" &&
            this.kdf !== "pbkdf2") {
            throw new router_build["KeplrError"]("keyring", 202, "Invalid kdf");
        }
        if (!this.privateKey || this.privateKey.length === 0) {
            throw new router_build["KeplrError"]("keyring", 275, "private key not set");
        }
        if (this.privateKey.length !== 32) {
            throw new router_build["KeplrError"]("keyring", 260, "invalid length of private key");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_AddPrivateKeyMsg.type();
    }
}
class messages_LockKeyRingMsg extends router_build["Message"] {
    static type() {
        return "lock-keyring";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_LockKeyRingMsg.type();
    }
}
class messages_UnlockKeyRingMsg extends router_build["Message"] {
    constructor(password = "") {
        super();
        this.password = password;
    }
    static type() {
        return "unlock-keyring";
    }
    validateBasic() {
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_UnlockKeyRingMsg.type();
    }
}
class messages_GetKeyMsg extends router_build["Message"] {
    constructor(chainId) {
        super();
        this.chainId = chainId;
    }
    static type() {
        return "get-key";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_GetKeyMsg.type();
    }
}
class messages_RequestSignAminoMsg extends router_build["Message"] {
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
        var _a, _b;
        if (!this.chainId) {
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_build["KeplrError"]("keyring", 230, "signer not set");
        }
        // Validate bech32 address.
        cosmos_build["Bech32Address"].validate(this.signer);
        // Check and validate the ADR-36 sign doc.
        // ADR-36 sign doc doesn't have the chain id
        if (!Object(cosmos_build["checkAndValidateADR36AminoSignDoc"])(this.signDoc)) {
            if (this.signOptions.ethSignType) {
                throw new Error("Eth sign type can be requested with only ADR-36 amino sign doc");
            }
            if (this.signDoc.chain_id !== this.chainId) {
                throw new router_build["KeplrError"]("keyring", 234, "Chain id in the message is not matched with the requested chain id");
            }
        }
        else {
            if (this.signDoc.msgs[0].value.signer !== this.signer) {
                throw new router_build["KeplrError"]("keyring", 233, "Unmatched signer in sign doc");
            }
            if (this.signOptions.ethSignType) {
                switch (this.signOptions.ethSignType) {
                    // TODO: Check chain id in tx data.
                    // case EthSignType.TRANSACTION:
                    case types_build["EthSignType"].EIP712: {
                        const message = JSON.parse(buffer["Buffer"].from(this.signDoc.msgs[0].value.data, "base64").toString());
                        const { ethChainId } = cosmos_build["EthermintChainIdHelper"].parse(this.chainId);
                        if (parseFloat((_a = message.domain) === null || _a === void 0 ? void 0 : _a.chainId) !== ethChainId) {
                            throw new Error(`Unmatched chain id for eth (expected: ${ethChainId}, actual: ${(_b = message.domain) === null || _b === void 0 ? void 0 : _b.chainId})`);
                        }
                    }
                    // XXX: There is no way to check chain id if type is message because eth personal sign standard doesn't define chain id field.
                    // case EthSignType.MESSAGE:
                }
            }
        }
        if (!this.signOptions) {
            throw new router_build["KeplrError"]("keyring", 235, "Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_RequestSignAminoMsg.type();
    }
}
class messages_RequestSignEIP712CosmosTxMsg_v0 extends router_build["Message"] {
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
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_build["KeplrError"]("keyring", 230, "signer not set");
        }
        // Validate bech32 address.
        cosmos_build["Bech32Address"].validate(this.signer);
        // Check and validate the ADR-36 sign doc.
        // ADR-36 sign doc doesn't have the chain id
        if (!Object(cosmos_build["checkAndValidateADR36AminoSignDoc"])(this.signDoc)) {
            if (this.signDoc.chain_id !== this.chainId) {
                throw new router_build["KeplrError"]("keyring", 234, "Chain id in the message is not matched with the requested chain id");
            }
            const { ethChainId } = cosmos_build["EthermintChainIdHelper"].parse(this.chainId);
            if (parseFloat(this.eip712.domain.chainId) !== ethChainId) {
                throw new Error(`Unmatched chain id for eth (expected: ${ethChainId}, actual: ${this.eip712.domain.chainId})`);
            }
        }
        else {
            throw new Error("Can't sign ADR-36 with EIP-712");
        }
        if (!this.signOptions) {
            throw new router_build["KeplrError"]("keyring", 235, "Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_RequestSignEIP712CosmosTxMsg_v0.type();
    }
}
class messages_RequestVerifyADR36AminoSignDoc extends router_build["Message"] {
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
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_build["KeplrError"]("keyring", 230, "signer not set");
        }
        if (!this.signature) {
            throw new router_build["KeplrError"]("keyring", 271, "Signature not set");
        }
        // Validate bech32 address.
        cosmos_build["Bech32Address"].validate(this.signer);
    }
    approveExternal() {
        return true;
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_RequestVerifyADR36AminoSignDoc.type();
    }
}
class messages_RequestSignDirectMsg extends router_build["Message"] {
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
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
        if (!this.signer) {
            throw new router_build["KeplrError"]("keyring", 230, "signer not set");
        }
        // Validate bech32 address.
        cosmos_build["Bech32Address"].validate(this.signer);
        const signDoc = tx["SignDoc"].fromPartial({
            bodyBytes: this.signDoc.bodyBytes,
            authInfoBytes: this.signDoc.authInfoBytes,
            chainId: this.signDoc.chainId,
            accountNumber: this.signDoc.accountNumber,
        });
        if (signDoc.chainId !== this.chainId) {
            throw new router_build["KeplrError"]("keyring", 234, "Chain id in the message is not matched with the requested chain id");
        }
        if (!this.signOptions) {
            throw new router_build["KeplrError"]("keyring", 235, "Sign options are null");
        }
    }
    approveExternal() {
        return true;
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_RequestSignDirectMsg.type();
    }
}
class messages_GetMultiKeyStoreInfoMsg extends router_build["Message"] {
    static type() {
        return "get-multi-key-store-info";
    }
    constructor() {
        super();
    }
    validateBasic() {
        // noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_GetMultiKeyStoreInfoMsg.type();
    }
}
class messages_ChangeKeyRingMsg extends router_build["Message"] {
    constructor(index) {
        super();
        this.index = index;
    }
    static type() {
        return "change-keyring";
    }
    validateBasic() {
        if (this.index < 0) {
            throw new router_build["KeplrError"]("keyring", 200, "Index is negative");
        }
        if (!Number.isInteger(this.index)) {
            throw new router_build["KeplrError"]("keyring", 201, "Invalid index");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_ChangeKeyRingMsg.type();
    }
}
// Return the list of selectable path.
// If coin type was set for the key store, will return empty array.
class messages_GetIsKeyStoreCoinTypeSetMsg extends router_build["Message"] {
    constructor(chainId, paths) {
        super();
        this.chainId = chainId;
        this.paths = paths;
    }
    static type() {
        return "get-is-keystore-coin-type-set";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
        if (this.paths.length === 0) {
            throw new router_build["KeplrError"]("keyring", 250, "empty bip44 path list");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_GetIsKeyStoreCoinTypeSetMsg.type();
    }
}
class messages_SetKeyStoreCoinTypeMsg extends router_build["Message"] {
    constructor(chainId, coinType) {
        super();
        this.chainId = chainId;
        this.coinType = coinType;
    }
    static type() {
        return "set-keystore-coin-type";
    }
    validateBasic() {
        if (!this.chainId) {
            throw new router_build["KeplrError"]("keyring", 270, "chain id not set");
        }
        if (this.coinType < 0) {
            throw new router_build["KeplrError"]("keyring", 240, "coin type can not be negative");
        }
        if (!Number.isInteger(this.coinType)) {
            throw new router_build["KeplrError"]("keyring", 241, "coin type should be integer");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_SetKeyStoreCoinTypeMsg.type();
    }
}
class messages_CheckPasswordMsg extends router_build["Message"] {
    constructor(password) {
        super();
        this.password = password;
    }
    static type() {
        return "check-keyring-password";
    }
    validateBasic() {
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_CheckPasswordMsg.type();
    }
}
class messages_ExportKeyRingDatasMsg extends router_build["Message"] {
    constructor(password) {
        super();
        this.password = password;
    }
    static type() {
        return "export-keyring-datas";
    }
    validateBasic() {
        if (!this.password) {
            throw new router_build["KeplrError"]("keyring", 274, "password not set");
        }
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_ExportKeyRingDatasMsg.type();
    }
}
class messages_IsUnlockMsg extends router_build["Message"] {
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
        return ROUTE;
    }
    type() {
        return messages_IsUnlockMsg.type();
    }
}
class messages_AddAccountMsg extends router_build["Message"] {
    constructor(name, bip44HDPath) {
        super();
        this.name = name;
        this.bip44HDPath = bip44HDPath;
    }
    static type() {
        return "add-account";
    }
    validateBasic() {
        //noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_AddAccountMsg.type();
    }
}
class messages_MigratorKeyRingMsg extends router_build["Message"] {
    constructor(password) {
        super();
        this.password = password;
    }
    static type() {
        return "migrator";
    }
    validateBasic() {
        //noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_MigratorKeyRingMsg.type();
    }
}
class messages_RestoreKeyStoreMsg extends router_build["Message"] {
    static type() {
        return "remove-all-Key-store";
    }
    constructor() {
        super();
    }
    validateBasic() {
        //noop
    }
    route() {
        return ROUTE;
    }
    type() {
        return messages_RestoreKeyStoreMsg.type();
    }
}

// CONCATENATED MODULE: ../background/src/keyring/types.ts


// CONCATENATED MODULE: ../background/src/keyring/index.ts







/***/ })

}]);