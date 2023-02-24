(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[18],{

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = exports.ModeInfo_Multi = exports.ModeInfo_Single = exports.ModeInfo = exports.SignerInfo = exports.AuthInfo = exports.TxBody = exports.SignDoc = exports.TxRaw = exports.Tx = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const signing_1 = __webpack_require__(626);
const any_1 = __webpack_require__(83);
const multisig_1 = __webpack_require__(403);
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.tx.v1beta1";
function createBaseTx() {
    return { body: undefined, authInfo: undefined, signatures: [] };
}
exports.Tx = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.body !== undefined) {
            exports.TxBody.encode(message.body, writer.uint32(10).fork()).ldelim();
        }
        if (message.authInfo !== undefined) {
            exports.AuthInfo.encode(message.authInfo, writer.uint32(18).fork()).ldelim();
        }
        for (const v of message.signatures) {
            writer.uint32(26).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.body = exports.TxBody.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.authInfo = exports.AuthInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.signatures.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            body: isSet(object.body) ? exports.TxBody.fromJSON(object.body) : undefined,
            authInfo: isSet(object.authInfo)
                ? exports.AuthInfo.fromJSON(object.authInfo)
                : undefined,
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => bytesFromBase64(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.body !== undefined &&
            (obj.body = message.body ? exports.TxBody.toJSON(message.body) : undefined);
        message.authInfo !== undefined &&
            (obj.authInfo = message.authInfo
                ? exports.AuthInfo.toJSON(message.authInfo)
                : undefined);
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseTx();
        message.body =
            object.body !== undefined && object.body !== null
                ? exports.TxBody.fromPartial(object.body)
                : undefined;
        message.authInfo =
            object.authInfo !== undefined && object.authInfo !== null
                ? exports.AuthInfo.fromPartial(object.authInfo)
                : undefined;
        message.signatures = ((_a = object.signatures) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseTxRaw() {
    return {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [],
    };
}
exports.TxRaw = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.bodyBytes.length !== 0) {
            writer.uint32(10).bytes(message.bodyBytes);
        }
        if (message.authInfoBytes.length !== 0) {
            writer.uint32(18).bytes(message.authInfoBytes);
        }
        for (const v of message.signatures) {
            writer.uint32(26).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTxRaw();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.bodyBytes = reader.bytes();
                    break;
                case 2:
                    message.authInfoBytes = reader.bytes();
                    break;
                case 3:
                    message.signatures.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            bodyBytes: isSet(object.bodyBytes)
                ? bytesFromBase64(object.bodyBytes)
                : new Uint8Array(),
            authInfoBytes: isSet(object.authInfoBytes)
                ? bytesFromBase64(object.authInfoBytes)
                : new Uint8Array(),
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => bytesFromBase64(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.bodyBytes !== undefined &&
            (obj.bodyBytes = base64FromBytes(message.bodyBytes !== undefined ? message.bodyBytes : new Uint8Array()));
        message.authInfoBytes !== undefined &&
            (obj.authInfoBytes = base64FromBytes(message.authInfoBytes !== undefined
                ? message.authInfoBytes
                : new Uint8Array()));
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseTxRaw();
        message.bodyBytes = (_a = object.bodyBytes) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.authInfoBytes = (_b = object.authInfoBytes) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.signatures = ((_c = object.signatures) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        return message;
    },
};
function createBaseSignDoc() {
    return {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        chainId: "",
        accountNumber: "0",
    };
}
exports.SignDoc = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.bodyBytes.length !== 0) {
            writer.uint32(10).bytes(message.bodyBytes);
        }
        if (message.authInfoBytes.length !== 0) {
            writer.uint32(18).bytes(message.authInfoBytes);
        }
        if (message.chainId !== "") {
            writer.uint32(26).string(message.chainId);
        }
        if (message.accountNumber !== "0") {
            writer.uint32(32).uint64(message.accountNumber);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignDoc();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.bodyBytes = reader.bytes();
                    break;
                case 2:
                    message.authInfoBytes = reader.bytes();
                    break;
                case 3:
                    message.chainId = reader.string();
                    break;
                case 4:
                    message.accountNumber = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            bodyBytes: isSet(object.bodyBytes)
                ? bytesFromBase64(object.bodyBytes)
                : new Uint8Array(),
            authInfoBytes: isSet(object.authInfoBytes)
                ? bytesFromBase64(object.authInfoBytes)
                : new Uint8Array(),
            chainId: isSet(object.chainId) ? String(object.chainId) : "",
            accountNumber: isSet(object.accountNumber)
                ? String(object.accountNumber)
                : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.bodyBytes !== undefined &&
            (obj.bodyBytes = base64FromBytes(message.bodyBytes !== undefined ? message.bodyBytes : new Uint8Array()));
        message.authInfoBytes !== undefined &&
            (obj.authInfoBytes = base64FromBytes(message.authInfoBytes !== undefined
                ? message.authInfoBytes
                : new Uint8Array()));
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.accountNumber !== undefined &&
            (obj.accountNumber = message.accountNumber);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseSignDoc();
        message.bodyBytes = (_a = object.bodyBytes) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.authInfoBytes = (_b = object.authInfoBytes) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.chainId = (_c = object.chainId) !== null && _c !== void 0 ? _c : "";
        message.accountNumber = (_d = object.accountNumber) !== null && _d !== void 0 ? _d : "0";
        return message;
    },
};
function createBaseTxBody() {
    return {
        messages: [],
        memo: "",
        timeoutHeight: "0",
        extensionOptions: [],
        nonCriticalExtensionOptions: [],
    };
}
exports.TxBody = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.messages) {
            any_1.Any.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.memo !== "") {
            writer.uint32(18).string(message.memo);
        }
        if (message.timeoutHeight !== "0") {
            writer.uint32(24).uint64(message.timeoutHeight);
        }
        for (const v of message.extensionOptions) {
            any_1.Any.encode(v, writer.uint32(8186).fork()).ldelim();
        }
        for (const v of message.nonCriticalExtensionOptions) {
            any_1.Any.encode(v, writer.uint32(16378).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTxBody();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.messages.push(any_1.Any.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.memo = reader.string();
                    break;
                case 3:
                    message.timeoutHeight = longToString(reader.uint64());
                    break;
                case 1023:
                    message.extensionOptions.push(any_1.Any.decode(reader, reader.uint32()));
                    break;
                case 2047:
                    message.nonCriticalExtensionOptions.push(any_1.Any.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            messages: Array.isArray(object === null || object === void 0 ? void 0 : object.messages)
                ? object.messages.map((e) => any_1.Any.fromJSON(e))
                : [],
            memo: isSet(object.memo) ? String(object.memo) : "",
            timeoutHeight: isSet(object.timeoutHeight)
                ? String(object.timeoutHeight)
                : "0",
            extensionOptions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensionOptions)
                ? object.extensionOptions.map((e) => any_1.Any.fromJSON(e))
                : [],
            nonCriticalExtensionOptions: Array.isArray(object === null || object === void 0 ? void 0 : object.nonCriticalExtensionOptions)
                ? object.nonCriticalExtensionOptions.map((e) => any_1.Any.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.messages) {
            obj.messages = message.messages.map((e) => e ? any_1.Any.toJSON(e) : undefined);
        }
        else {
            obj.messages = [];
        }
        message.memo !== undefined && (obj.memo = message.memo);
        message.timeoutHeight !== undefined &&
            (obj.timeoutHeight = message.timeoutHeight);
        if (message.extensionOptions) {
            obj.extensionOptions = message.extensionOptions.map((e) => e ? any_1.Any.toJSON(e) : undefined);
        }
        else {
            obj.extensionOptions = [];
        }
        if (message.nonCriticalExtensionOptions) {
            obj.nonCriticalExtensionOptions = message.nonCriticalExtensionOptions.map((e) => (e ? any_1.Any.toJSON(e) : undefined));
        }
        else {
            obj.nonCriticalExtensionOptions = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseTxBody();
        message.messages = ((_a = object.messages) === null || _a === void 0 ? void 0 : _a.map((e) => any_1.Any.fromPartial(e))) || [];
        message.memo = (_b = object.memo) !== null && _b !== void 0 ? _b : "";
        message.timeoutHeight = (_c = object.timeoutHeight) !== null && _c !== void 0 ? _c : "0";
        message.extensionOptions =
            ((_d = object.extensionOptions) === null || _d === void 0 ? void 0 : _d.map((e) => any_1.Any.fromPartial(e))) || [];
        message.nonCriticalExtensionOptions =
            ((_e = object.nonCriticalExtensionOptions) === null || _e === void 0 ? void 0 : _e.map((e) => any_1.Any.fromPartial(e))) || [];
        return message;
    },
};
function createBaseAuthInfo() {
    return { signerInfos: [], fee: undefined };
}
exports.AuthInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.signerInfos) {
            exports.SignerInfo.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.fee !== undefined) {
            exports.Fee.encode(message.fee, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAuthInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signerInfos.push(exports.SignerInfo.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.fee = exports.Fee.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            signerInfos: Array.isArray(object === null || object === void 0 ? void 0 : object.signerInfos)
                ? object.signerInfos.map((e) => exports.SignerInfo.fromJSON(e))
                : [],
            fee: isSet(object.fee) ? exports.Fee.fromJSON(object.fee) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.signerInfos) {
            obj.signerInfos = message.signerInfos.map((e) => e ? exports.SignerInfo.toJSON(e) : undefined);
        }
        else {
            obj.signerInfos = [];
        }
        message.fee !== undefined &&
            (obj.fee = message.fee ? exports.Fee.toJSON(message.fee) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseAuthInfo();
        message.signerInfos =
            ((_a = object.signerInfos) === null || _a === void 0 ? void 0 : _a.map((e) => exports.SignerInfo.fromPartial(e))) || [];
        message.fee =
            object.fee !== undefined && object.fee !== null
                ? exports.Fee.fromPartial(object.fee)
                : undefined;
        return message;
    },
};
function createBaseSignerInfo() {
    return { publicKey: undefined, modeInfo: undefined, sequence: "0" };
}
exports.SignerInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.publicKey !== undefined) {
            any_1.Any.encode(message.publicKey, writer.uint32(10).fork()).ldelim();
        }
        if (message.modeInfo !== undefined) {
            exports.ModeInfo.encode(message.modeInfo, writer.uint32(18).fork()).ldelim();
        }
        if (message.sequence !== "0") {
            writer.uint32(24).uint64(message.sequence);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignerInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.publicKey = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.modeInfo = exports.ModeInfo.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.sequence = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            publicKey: isSet(object.publicKey)
                ? any_1.Any.fromJSON(object.publicKey)
                : undefined,
            modeInfo: isSet(object.modeInfo)
                ? exports.ModeInfo.fromJSON(object.modeInfo)
                : undefined,
            sequence: isSet(object.sequence) ? String(object.sequence) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.publicKey !== undefined &&
            (obj.publicKey = message.publicKey
                ? any_1.Any.toJSON(message.publicKey)
                : undefined);
        message.modeInfo !== undefined &&
            (obj.modeInfo = message.modeInfo
                ? exports.ModeInfo.toJSON(message.modeInfo)
                : undefined);
        message.sequence !== undefined && (obj.sequence = message.sequence);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSignerInfo();
        message.publicKey =
            object.publicKey !== undefined && object.publicKey !== null
                ? any_1.Any.fromPartial(object.publicKey)
                : undefined;
        message.modeInfo =
            object.modeInfo !== undefined && object.modeInfo !== null
                ? exports.ModeInfo.fromPartial(object.modeInfo)
                : undefined;
        message.sequence = (_a = object.sequence) !== null && _a !== void 0 ? _a : "0";
        return message;
    },
};
function createBaseModeInfo() {
    return { single: undefined, multi: undefined };
}
exports.ModeInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.single !== undefined) {
            exports.ModeInfo_Single.encode(message.single, writer.uint32(10).fork()).ldelim();
        }
        if (message.multi !== undefined) {
            exports.ModeInfo_Multi.encode(message.multi, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModeInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.single = exports.ModeInfo_Single.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.multi = exports.ModeInfo_Multi.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            single: isSet(object.single)
                ? exports.ModeInfo_Single.fromJSON(object.single)
                : undefined,
            multi: isSet(object.multi)
                ? exports.ModeInfo_Multi.fromJSON(object.multi)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.single !== undefined &&
            (obj.single = message.single
                ? exports.ModeInfo_Single.toJSON(message.single)
                : undefined);
        message.multi !== undefined &&
            (obj.multi = message.multi
                ? exports.ModeInfo_Multi.toJSON(message.multi)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseModeInfo();
        message.single =
            object.single !== undefined && object.single !== null
                ? exports.ModeInfo_Single.fromPartial(object.single)
                : undefined;
        message.multi =
            object.multi !== undefined && object.multi !== null
                ? exports.ModeInfo_Multi.fromPartial(object.multi)
                : undefined;
        return message;
    },
};
function createBaseModeInfo_Single() {
    return { mode: 0 };
}
exports.ModeInfo_Single = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.mode !== 0) {
            writer.uint32(8).int32(message.mode);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModeInfo_Single();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.mode = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            mode: isSet(object.mode) ? signing_1.signModeFromJSON(object.mode) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.mode !== undefined && (obj.mode = signing_1.signModeToJSON(message.mode));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseModeInfo_Single();
        message.mode = (_a = object.mode) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseModeInfo_Multi() {
    return { bitarray: undefined, modeInfos: [] };
}
exports.ModeInfo_Multi = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.bitarray !== undefined) {
            multisig_1.CompactBitArray.encode(message.bitarray, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.modeInfos) {
            exports.ModeInfo.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModeInfo_Multi();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.bitarray = multisig_1.CompactBitArray.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.modeInfos.push(exports.ModeInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            bitarray: isSet(object.bitarray)
                ? multisig_1.CompactBitArray.fromJSON(object.bitarray)
                : undefined,
            modeInfos: Array.isArray(object === null || object === void 0 ? void 0 : object.modeInfos)
                ? object.modeInfos.map((e) => exports.ModeInfo.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.bitarray !== undefined &&
            (obj.bitarray = message.bitarray
                ? multisig_1.CompactBitArray.toJSON(message.bitarray)
                : undefined);
        if (message.modeInfos) {
            obj.modeInfos = message.modeInfos.map((e) => e ? exports.ModeInfo.toJSON(e) : undefined);
        }
        else {
            obj.modeInfos = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseModeInfo_Multi();
        message.bitarray =
            object.bitarray !== undefined && object.bitarray !== null
                ? multisig_1.CompactBitArray.fromPartial(object.bitarray)
                : undefined;
        message.modeInfos =
            ((_a = object.modeInfos) === null || _a === void 0 ? void 0 : _a.map((e) => exports.ModeInfo.fromPartial(e))) || [];
        return message;
    },
};
function createBaseFee() {
    return { amount: [], gasLimit: "0", payer: "", granter: "" };
}
exports.Fee = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.amount) {
            coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.gasLimit !== "0") {
            writer.uint32(16).uint64(message.gasLimit);
        }
        if (message.payer !== "") {
            writer.uint32(26).string(message.payer);
        }
        if (message.granter !== "") {
            writer.uint32(34).string(message.granter);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFee();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.amount.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.gasLimit = longToString(reader.uint64());
                    break;
                case 3:
                    message.payer = reader.string();
                    break;
                case 4:
                    message.granter = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            amount: Array.isArray(object === null || object === void 0 ? void 0 : object.amount)
                ? object.amount.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            gasLimit: isSet(object.gasLimit) ? String(object.gasLimit) : "0",
            payer: isSet(object.payer) ? String(object.payer) : "",
            granter: isSet(object.granter) ? String(object.granter) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.amount) {
            obj.amount = message.amount.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.amount = [];
        }
        message.gasLimit !== undefined && (obj.gasLimit = message.gasLimit);
        message.payer !== undefined && (obj.payer = message.payer);
        message.granter !== undefined && (obj.granter = message.granter);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseFee();
        message.amount = ((_a = object.amount) === null || _a === void 0 ? void 0 : _a.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.gasLimit = (_b = object.gasLimit) !== null && _b !== void 0 ? _b : "0";
        message.payer = (_c = object.payer) !== null && _c !== void 0 ? _c : "";
        message.granter = (_d = object.granter) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 1194:
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
__exportStar(__webpack_require__(1401), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1226:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultGasPriceStep = void 0;
exports.DefaultGasPriceStep = {
    low: 0.01,
    average: 0.025,
    high: 0.04,
};
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 1227:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZeroAllowedGasConfig = exports.useGasConfig = exports.GasConfig = void 0;
const chain_1 = __webpack_require__(262);
const mobx_1 = __webpack_require__(5);
const react_1 = __webpack_require__(0);
class GasConfig extends chain_1.TxChainSetter {
    constructor(chainGetter, initialChainId, initialGas, allowZeroGas) {
        super(chainGetter, initialChainId);
        /*
         This field is used to handle the value from the input more flexibly.
         We use string because there is no guarantee that only number is input in input component.
         If the user has never set it, undefined is also allowed to indicate that it is a default value.
         */
        this._gasRaw = undefined;
        /*
         There are services that sometimes use invalid tx to sign arbitrary data on the sign page.
         In this case, there is no obligation to deal with it, but 0 gas is favorably allowed. This option is used for this case.
         */
        this._allowZeroGas = undefined;
        this._gasRaw = initialGas === null || initialGas === void 0 ? void 0 : initialGas.toString();
        this._allowZeroGas = allowZeroGas;
        mobx_1.makeObservable(this);
    }
    get gasRaw() {
        if (this._gasRaw == null) {
            return this.gas.toString();
        }
        return this._gasRaw;
    }
    get gas() {
        // If the gasRaw is undefined,
        // it means that the user never input something yet.
        // In this case, it should be handled as gas is 0.
        // But, it can be overridden on the child class if it is needed.
        if (this._gasRaw == null) {
            return 0;
        }
        const r = parseInt(this._gasRaw);
        return Number.isNaN(r) ? 0 : r;
    }
    setGas(gas) {
        if (typeof gas === "number") {
            this._gasRaw = Math.floor(gas).toString();
            return;
        }
        if (gas === "") {
            this._gasRaw = gas;
            return;
        }
        // Gas must not be floated.
        if (!gas.includes(".")) {
            if (!Number.isNaN(Number.parseInt(gas))) {
                this._gasRaw = gas;
                return;
            }
        }
    }
    get error() {
        if (this._gasRaw === "") {
            return new Error("Gas not set");
        }
        if (this._gasRaw && Number.isNaN(this._gasRaw)) {
            return new Error("Gas is not valid number");
        }
        if (!Number.isInteger(this.gas)) {
            return new Error("Gas is not integer");
        }
        if (!this._allowZeroGas) {
            if (this.gas <= 0) {
                return new Error("Gas should be greater than 0");
            }
        }
        else {
            if (this.gas < 0) {
                return new Error("Gas should be greater or equal than 0");
            }
        }
        return;
    }
}
__decorate([
    mobx_1.observable
], GasConfig.prototype, "_gasRaw", void 0);
__decorate([
    mobx_1.observable
], GasConfig.prototype, "_allowZeroGas", void 0);
__decorate([
    mobx_1.computed
], GasConfig.prototype, "gas", null);
__decorate([
    mobx_1.action
], GasConfig.prototype, "setGas", null);
__decorate([
    mobx_1.computed
], GasConfig.prototype, "error", null);
exports.GasConfig = GasConfig;
const useGasConfig = (chainGetter, chainId, initialGas) => {
    const [txConfig] = react_1.useState(() => new GasConfig(chainGetter, chainId, initialGas));
    txConfig.setChain(chainId);
    return txConfig;
};
exports.useGasConfig = useGasConfig;
/*
 There are services that sometimes use invalid tx to sign arbitrary data on the sign page.
 In this case, there is no obligation to deal with it, but 0 gas is favorably allowed. This option is used for this case.
 */
const useZeroAllowedGasConfig = (chainGetter, chainId, initialGas) => {
    const [txConfig] = react_1.useState(() => new GasConfig(chainGetter, chainId, initialGas, true));
    txConfig.setChain(chainId);
    return txConfig;
};
exports.useZeroAllowedGasConfig = useZeroAllowedGasConfig;
//# sourceMappingURL=gas.js.map

/***/ }),

/***/ 1228:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAmountConfig = exports.AmountConfig = void 0;
const chain_1 = __webpack_require__(262);
const mobx_1 = __webpack_require__(5);
const errors_1 = __webpack_require__(280);
const unit_1 = __webpack_require__(26);
const react_1 = __webpack_require__(0);
class AmountConfig extends chain_1.TxChainSetter {
    constructor(chainGetter, queriesStore, initialChainId, sender, feeConfig) {
        super(chainGetter, initialChainId);
        this.queriesStore = queriesStore;
        this._sendCurrency = undefined;
        this._fraction = undefined;
        this._sender = sender;
        this.feeConfig = feeConfig;
        this._amount = "";
        mobx_1.makeObservable(this);
    }
    setFeeConfig(feeConfig) {
        this.feeConfig = feeConfig;
    }
    setSender(sender) {
        this._sender = sender;
    }
    setSendCurrency(currency) {
        this._sendCurrency = currency;
    }
    setAmount(amount) {
        if (amount.startsWith(".")) {
            amount = "0" + amount;
        }
        if (this.fraction != null) {
            this.setFraction(undefined);
        }
        this._amount = amount;
    }
    setIsMax(isMax) {
        this._fraction = isMax ? 1 : undefined;
    }
    toggleIsMax() {
        this.setIsMax(!this.isMax);
    }
    get isMax() {
        return this._fraction === 1;
    }
    get sender() {
        return this._sender;
    }
    get fraction() {
        return this._fraction;
    }
    setFraction(value) {
        this._fraction = value;
    }
    get amount() {
        var _a;
        if (this.fraction != null) {
            const balance = this.queriesStore
                .get(this.chainId)
                .queryBalances.getQueryBech32Address(this.sender)
                .getBalanceFromCurrency(this.sendCurrency);
            const result = ((_a = this.feeConfig) === null || _a === void 0 ? void 0 : _a.fee) ? balance.sub(this.feeConfig.fee)
                : balance;
            if (result.toDec().lte(new unit_1.Dec(0))) {
                return "0";
            }
            // Remember that the `CoinPretty`'s sub method do nothing if the currencies are different.
            return result
                .mul(new unit_1.Dec(this.fraction))
                .trim(true)
                .locale(false)
                .hideDenom(true)
                .toString();
        }
        return this._amount;
    }
    getAmountPrimitive() {
        const amountStr = this.amount;
        const sendCurrency = this.sendCurrency;
        if (!amountStr) {
            return {
                denom: sendCurrency.coinMinimalDenom,
                amount: "0",
            };
        }
        try {
            return {
                denom: sendCurrency.coinMinimalDenom,
                amount: new unit_1.Dec(amountStr)
                    .mul(unit_1.DecUtils.getPrecisionDec(sendCurrency.coinDecimals))
                    .truncate()
                    .toString(),
            };
        }
        catch (_a) {
            return {
                denom: sendCurrency.coinMinimalDenom,
                amount: "0",
            };
        }
    }
    get sendCurrency() {
        const chainInfo = this.chainInfo;
        if (this._sendCurrency) {
            const find = chainInfo.currencies.find(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (cur) => cur.coinMinimalDenom === this._sendCurrency.coinMinimalDenom);
            if (find) {
                return this._sendCurrency;
            }
        }
        if (chainInfo.currencies.length === 0) {
            throw new Error("Chain doesn't have the sendable currency informations");
        }
        return chainInfo.currencies[0];
    }
    get sendableCurrencies() {
        return this.chainInfo.currencies;
    }
    get error() {
        const sendCurrency = this.sendCurrency;
        if (!sendCurrency) {
            return new Error("Currency to send not set");
        }
        if (this.amount === "") {
            return new errors_1.EmptyAmountError("Amount is empty");
        }
        if (Number.isNaN(parseFloat(this.amount))) {
            return new errors_1.InvalidNumberAmountError("Invalid form of number");
        }
        let dec;
        try {
            dec = new unit_1.Dec(this.amount);
            if (dec.equals(new unit_1.Dec(0))) {
                return new errors_1.ZeroAmountError("Amount is zero");
            }
        }
        catch (_a) {
            return new errors_1.InvalidNumberAmountError("Invalid form of number");
        }
        if (new unit_1.Dec(this.amount).lt(new unit_1.Dec(0))) {
            return new errors_1.NegativeAmountError("Amount is negative");
        }
        const balance = this.queriesStore
            .get(this.chainId)
            .queryBalances.getQueryBech32Address(this.sender)
            .getBalanceFromCurrency(this.sendCurrency);
        const balanceDec = balance.toDec();
        if (dec.gt(balanceDec)) {
            return new errors_1.InsufficientAmountError("Insufficient amount");
        }
        return;
    }
}
__decorate([
    mobx_1.observable.ref
], AmountConfig.prototype, "feeConfig", void 0);
__decorate([
    mobx_1.observable
], AmountConfig.prototype, "_sender", void 0);
__decorate([
    mobx_1.observable.ref
], AmountConfig.prototype, "_sendCurrency", void 0);
__decorate([
    mobx_1.observable
], AmountConfig.prototype, "_amount", void 0);
__decorate([
    mobx_1.observable
], AmountConfig.prototype, "_fraction", void 0);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "setFeeConfig", null);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "setSender", null);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "setSendCurrency", null);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "setAmount", null);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "setIsMax", null);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "toggleIsMax", null);
__decorate([
    mobx_1.action
], AmountConfig.prototype, "setFraction", null);
__decorate([
    mobx_1.computed
], AmountConfig.prototype, "amount", null);
__decorate([
    mobx_1.computed
], AmountConfig.prototype, "sendCurrency", null);
__decorate([
    mobx_1.computed
], AmountConfig.prototype, "error", null);
exports.AmountConfig = AmountConfig;
const useAmountConfig = (chainGetter, queriesStore, chainId, sender) => {
    const [txConfig] = react_1.useState(() => new AmountConfig(chainGetter, queriesStore, chainId, sender, undefined));
    txConfig.setChain(chainId);
    txConfig.setSender(sender);
    return txConfig;
};
exports.useAmountConfig = useAmountConfig;
//# sourceMappingURL=amount.js.map

/***/ }),

/***/ 1229:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSendGasConfig = exports.SendGasConfig = void 0;
const gas_1 = __webpack_require__(1227);
const common_1 = __webpack_require__(27);
const react_1 = __webpack_require__(0);
const mobx_1 = __webpack_require__(5);
const errors_1 = __webpack_require__(280);
class SendGasConfig extends gas_1.GasConfig {
    constructor(chainGetter, accountStore, initialChainId, amountConfig) {
        super(chainGetter, initialChainId);
        this.accountStore = accountStore;
        this.amountConfig = amountConfig;
        mobx_1.makeObservable(this);
    }
    get gas() {
        var _a, _b, _c, _d, _e, _f;
        // If gas not set manually, assume that the tx is for MsgSend.
        // And, set the default gas according to the currency type.
        if (this._gasRaw == null && this.amountConfig.sendCurrency) {
            const denomHelper = new common_1.DenomHelper(this.amountConfig.sendCurrency.coinMinimalDenom);
            const account = this.accountStore.getAccount(this.chainId);
            switch (denomHelper.type) {
                case "secret20":
                    return (_b = (_a = account.secret) === null || _a === void 0 ? void 0 : _a.msgOpts.send.secret20.gas) !== null && _b !== void 0 ? _b : 0;
                case "cw20":
                    return (_d = (_c = account.cosmwasm) === null || _c === void 0 ? void 0 : _c.msgOpts.send.cw20.gas) !== null && _d !== void 0 ? _d : 0;
                default:
                    return (_f = (_e = account.cosmos) === null || _e === void 0 ? void 0 : _e.msgOpts.send.native.gas) !== null && _f !== void 0 ? _f : 0;
            }
        }
        return super.gas;
    }
    get error() {
        var _a, _b, _c;
        if (this.amountConfig.sendCurrency) {
            const denomHelper = new common_1.DenomHelper(this.amountConfig.sendCurrency.coinMinimalDenom);
            const account = this.accountStore.getAccount(this.chainId);
            switch (denomHelper.type) {
                case "secret20": {
                    if (!((_a = account.secret) === null || _a === void 0 ? void 0 : _a.msgOpts.send.secret20.gas)) {
                        return new errors_1.UnknownCurrencyError("Unknown currency");
                    }
                    break;
                }
                case "cw20": {
                    if (!((_b = account.cosmwasm) === null || _b === void 0 ? void 0 : _b.msgOpts.send.cw20.gas)) {
                        return new errors_1.UnknownCurrencyError("Unknown currency");
                    }
                    break;
                }
                default: {
                    if (!((_c = account.cosmos) === null || _c === void 0 ? void 0 : _c.msgOpts.send.native.gas)) {
                        return new errors_1.UnknownCurrencyError("Unknown currency");
                    }
                }
            }
        }
        return super.error;
    }
}
__decorate([
    mobx_1.override
], SendGasConfig.prototype, "gas", null);
__decorate([
    mobx_1.override
], SendGasConfig.prototype, "error", null);
exports.SendGasConfig = SendGasConfig;
const useSendGasConfig = (chainGetter, accountStore, chainId, amountConfig) => {
    const [gasConfig] = react_1.useState(() => new SendGasConfig(chainGetter, accountStore, chainId, amountConfig));
    gasConfig.setChain(chainId);
    return gasConfig;
};
exports.useSendGasConfig = useSendGasConfig;
//# sourceMappingURL=send-gas.js.map

/***/ }),

/***/ 1230:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStakedAmountConfig = exports.StakedAmountConfig = void 0;
const chain_1 = __webpack_require__(262);
const mobx_1 = __webpack_require__(5);
const errors_1 = __webpack_require__(280);
const unit_1 = __webpack_require__(26);
const react_1 = __webpack_require__(0);
class StakedAmountConfig extends chain_1.TxChainSetter {
    constructor(chainGetter, queriesStore, initialChainId, sender, initialValidatorAddress) {
        super(chainGetter, initialChainId);
        this.queriesStore = queriesStore;
        this._fraction = undefined;
        this._sender = sender;
        this._amount = "";
        this._validatorAddress = initialValidatorAddress;
        mobx_1.makeObservable(this);
    }
    setValidatorAddress(validatorAddress) {
        this._validatorAddress = validatorAddress;
    }
    get validatorAddress() {
        return this._validatorAddress;
    }
    setSender(sender) {
        this._sender = sender;
    }
    setSendCurrency() {
        // noop
    }
    setAmount(amount) {
        if (amount.startsWith(".")) {
            amount = "0" + amount;
        }
        if (this.isMax) {
            this.setIsMax(false);
        }
        this._amount = amount;
    }
    setIsMax(isMax) {
        this._fraction = isMax ? 1 : undefined;
    }
    toggleIsMax() {
        this.setIsMax(!this.isMax);
    }
    get isMax() {
        return this._fraction === 1;
    }
    get fraction() {
        return this._fraction;
    }
    setFraction(value) {
        this._fraction = value;
    }
    get sender() {
        return this._sender;
    }
    get amount() {
        if (!this.queriesStore.get(this.chainId).cosmos) {
            throw new Error("No querier for delegations");
        }
        if (this.fraction != null) {
            const result = this.queriesStore
                .get(this.chainId)
                .cosmos.queryDelegations.getQueryBech32Address(this.sender)
                .getDelegationTo(this.validatorAddress);
            if (result.toDec().lte(new unit_1.Dec(0))) {
                return "0";
            }
            return result
                .mul(new unit_1.Dec(this.fraction))
                .trim(true)
                .locale(false)
                .hideDenom(true)
                .toString();
        }
        return this._amount;
    }
    getAmountPrimitive() {
        const amountStr = this.amount;
        const sendCurrency = this.sendCurrency;
        if (!amountStr) {
            return {
                denom: sendCurrency.coinMinimalDenom,
                amount: "0",
            };
        }
        try {
            return {
                denom: sendCurrency.coinMinimalDenom,
                amount: new unit_1.Dec(amountStr)
                    .mul(unit_1.DecUtils.getPrecisionDec(sendCurrency.coinDecimals))
                    .truncate()
                    .toString(),
            };
        }
        catch (_a) {
            return {
                denom: sendCurrency.coinMinimalDenom,
                amount: "0",
            };
        }
    }
    get sendCurrency() {
        return this.chainInfo.stakeCurrency;
    }
    get sendableCurrencies() {
        return [this.chainInfo.stakeCurrency];
    }
    get error() {
        if (!this.queriesStore.get(this.chainId).cosmos) {
            throw new Error("No querier for delegations");
        }
        const sendCurrency = this.sendCurrency;
        if (!sendCurrency) {
            return new Error("Currency to send not set");
        }
        if (this.amount === "") {
            return new errors_1.EmptyAmountError("Amount is empty");
        }
        if (Number.isNaN(parseFloat(this.amount))) {
            return new errors_1.InvalidNumberAmountError("Invalid form of number");
        }
        let dec;
        try {
            dec = new unit_1.Dec(this.amount);
            if (dec.equals(new unit_1.Dec(0))) {
                return new errors_1.ZeroAmountError("Amount is zero");
            }
        }
        catch (_a) {
            return new errors_1.InvalidNumberAmountError("Invalid form of number");
        }
        if (new unit_1.Dec(this.amount).lt(new unit_1.Dec(0))) {
            return new errors_1.NegativeAmountError("Amount is negative");
        }
        const balance = this.queriesStore
            .get(this.chainId)
            .cosmos.queryDelegations.getQueryBech32Address(this.sender)
            .getDelegationTo(this.validatorAddress);
        const balanceDec = balance.toDec();
        if (dec.gt(balanceDec)) {
            return new errors_1.InsufficientAmountError("Insufficient amount");
        }
        return;
    }
}
__decorate([
    mobx_1.observable
], StakedAmountConfig.prototype, "_sender", void 0);
__decorate([
    mobx_1.observable
], StakedAmountConfig.prototype, "_validatorAddress", void 0);
__decorate([
    mobx_1.observable
], StakedAmountConfig.prototype, "_amount", void 0);
__decorate([
    mobx_1.observable
], StakedAmountConfig.prototype, "_fraction", void 0);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "setValidatorAddress", null);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "setSender", null);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "setSendCurrency", null);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "setAmount", null);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "setIsMax", null);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "toggleIsMax", null);
__decorate([
    mobx_1.action
], StakedAmountConfig.prototype, "setFraction", null);
__decorate([
    mobx_1.computed
], StakedAmountConfig.prototype, "amount", null);
__decorate([
    mobx_1.computed
], StakedAmountConfig.prototype, "sendCurrency", null);
__decorate([
    mobx_1.computed
], StakedAmountConfig.prototype, "error", null);
exports.StakedAmountConfig = StakedAmountConfig;
const useStakedAmountConfig = (chainGetter, queriesStore, chainId, sender, validatorAddress) => {
    const [txConfig] = react_1.useState(() => new StakedAmountConfig(chainGetter, queriesStore, chainId, sender, validatorAddress));
    txConfig.setChain(chainId);
    txConfig.setSender(sender);
    txConfig.setValidatorAddress(validatorAddress);
    return txConfig;
};
exports.useStakedAmountConfig = useStakedAmountConfig;
//# sourceMappingURL=staked-amount.js.map

/***/ }),

/***/ 1251:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIBCAmountConfig = exports.IBCAmountConfig = void 0;
const tx_1 = __webpack_require__(200);
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
const react_1 = __webpack_require__(0);
class IBCAmountConfig extends tx_1.AmountConfig {
    constructor(chainGetter, queriesStore, initialChainId, sender, feeConfig) {
        super(chainGetter, queriesStore, initialChainId, sender, feeConfig);
        this.queriesStore = queriesStore;
        mobx_1.makeObservable(this);
    }
    get sendableCurrencies() {
        // Only native currencies can be sent by IBC transfer.
        return super.sendableCurrencies.filter((cur) => new common_1.DenomHelper(cur.coinMinimalDenom).type === "native");
    }
}
__decorate([
    mobx_1.computed
], IBCAmountConfig.prototype, "sendableCurrencies", null);
exports.IBCAmountConfig = IBCAmountConfig;
const useIBCAmountConfig = (chainGetter, queriesStore, chainId, sender) => {
    const [txConfig] = react_1.useState(() => new IBCAmountConfig(chainGetter, queriesStore, chainId, sender, undefined));
    txConfig.setChain(chainId);
    txConfig.setSender(sender);
    return txConfig;
};
exports.useIBCAmountConfig = useIBCAmountConfig;
//# sourceMappingURL=amount.js.map

/***/ }),

/***/ 1252:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIBCChannelConfig = exports.IBCChannelConfig = void 0;
const mobx_1 = __webpack_require__(5);
const errors_1 = __webpack_require__(1253);
const react_1 = __webpack_require__(0);
class IBCChannelConfig {
    constructor() {
        this._channel = undefined;
        mobx_1.makeObservable(this);
    }
    get channel() {
        return this._channel;
    }
    get error() {
        if (!this._channel) {
            return new errors_1.ChannelNotSetError("Channel not set");
        }
        return undefined;
    }
    setChannel(channel) {
        this._channel = channel;
    }
}
__decorate([
    mobx_1.observable.ref
], IBCChannelConfig.prototype, "_channel", void 0);
__decorate([
    mobx_1.computed
], IBCChannelConfig.prototype, "error", null);
__decorate([
    mobx_1.action
], IBCChannelConfig.prototype, "setChannel", null);
exports.IBCChannelConfig = IBCChannelConfig;
const useIBCChannelConfig = () => {
    const [config] = react_1.useState(() => {
        return new IBCChannelConfig();
    });
    return config;
};
exports.useIBCChannelConfig = useIBCChannelConfig;
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 1253:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelNotSetError = void 0;
class ChannelNotSetError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ChannelNotSetError.prototype);
    }
}
exports.ChannelNotSetError = ChannelNotSetError;
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 1254:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIBCTransferGasConfig = exports.IBCTransferGasConfig = void 0;
const tx_1 = __webpack_require__(200);
const mobx_1 = __webpack_require__(5);
const react_1 = __webpack_require__(0);
class IBCTransferGasConfig extends tx_1.GasConfig {
    constructor(chainGetter, accountStore, initialChainId) {
        super(chainGetter, initialChainId);
        this.accountStore = accountStore;
        mobx_1.makeObservable(this);
    }
    get gas() {
        // If gas not set manually, assume that the tx is for MsgTransfer.
        if (this._gasRaw == null) {
            return this.accountStore.getAccount(this.chainId).cosmos.msgOpts
                .ibcTransfer.gas;
        }
        return super.gas;
    }
}
__decorate([
    mobx_1.override
], IBCTransferGasConfig.prototype, "gas", null);
exports.IBCTransferGasConfig = IBCTransferGasConfig;
const useIBCTransferGasConfig = (chainGetter, accountStore, chainId) => {
    const [gasConfig] = react_1.useState(() => new IBCTransferGasConfig(chainGetter, accountStore, chainId));
    gasConfig.setChain(chainId);
    return gasConfig;
};
exports.useIBCTransferGasConfig = useIBCTransferGasConfig;
//# sourceMappingURL=gas.js.map

/***/ }),

/***/ 1331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAuthorization = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.bank.v1beta1";
function createBaseSendAuthorization() {
    return { spendLimit: [] };
}
exports.SendAuthorization = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.spendLimit) {
            coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSendAuthorization();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.spendLimit.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            spendLimit: Array.isArray(object === null || object === void 0 ? void 0 : object.spendLimit)
                ? object.spendLimit.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.spendLimit) {
            obj.spendLimit = message.spendLimit.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.spendLimit = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSendAuthorization();
        message.spendLimit =
            ((_a = object.spendLimit) === null || _a === void 0 ? void 0 : _a.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
//# sourceMappingURL=authz.js.map

/***/ }),

/***/ 1394:
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
exports.useInteractionInfo = void 0;
const react_router_1 = __webpack_require__(20);
const querystring_1 = __importDefault(__webpack_require__(377));
const popup_1 = __webpack_require__(46);
const react_1 = __webpack_require__(0);
const useInteractionInfo = (cleanUp, options = {}) => {
    const location = react_router_1.useLocation();
    let search = location.search;
    if (search.startsWith("?")) {
        search = search.slice(1);
    }
    const query = querystring_1.default.parse(search);
    const cleanUpRef = react_1.useRef(cleanUp);
    cleanUpRef.current = cleanUp;
    const result = {
        interaction: query.interaction === "true",
        interactionInternal: query.interactionInternal === "true",
    };
    react_1.useEffect(() => {
        if (result.interaction && !result.interactionInternal) {
            // if (!options.enableScroll) {
            //   disableScroll();
            // }
            console.log(options);
            popup_1.fitPopupWindow();
        }
    }, [result.interaction, result.interactionInternal]);
    react_1.useEffect(() => {
        return () => {
            if (cleanUpRef.current) {
                cleanUpRef.current();
            }
        };
    }, []);
    react_1.useEffect(() => {
        // Execute the clean-up function when closing window.
        const beforeunload = () => __awaiter(void 0, void 0, void 0, function* () {
            if (cleanUpRef.current) {
                cleanUpRef.current();
            }
        });
        addEventListener("beforeunload", beforeunload);
        return () => {
            removeEventListener("beforeunload", beforeunload);
        };
    }, []);
    return result;
};
exports.useInteractionInfo = useInteractionInfo;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1398:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoConfig = exports.MemoConfig = void 0;
const mobx_1 = __webpack_require__(5);
const chain_1 = __webpack_require__(262);
const react_1 = __webpack_require__(0);
const errors_1 = __webpack_require__(280);
class MemoConfig extends chain_1.TxChainSetter {
    constructor(chainGetter, initialChainId) {
        super(chainGetter, initialChainId);
        this._memo = "";
        mobx_1.makeObservable(this);
    }
    get memo() {
        return this._memo;
    }
    setMemo(memo) {
        this._memo = memo;
    }
    get error() {
        const words = this.memo
            .trim()
            .split(" ")
            .map((w) => w.trim())
            .filter((w) => w.length > 0);
        // If it suspects that user entered mnemonic in memo, treat it as an error.
        // If more than 3/4 of the words are mnemonic words, an error is returned.
        if (words.length >= 8 && words.length <= 32) {
            const n = (words.length / 4) * 3;
            let numMnemonics = 0;
            for (const word of words) {
                if (wordlist[word]) {
                    numMnemonics++;
                }
            }
            if (numMnemonics >= n) {
                return new errors_1.MemoSuspectMnemonicInclusion("Memo contains mnemonic");
            }
        }
        return undefined;
    }
}
__decorate([
    mobx_1.observable
], MemoConfig.prototype, "_memo", void 0);
__decorate([
    mobx_1.action
], MemoConfig.prototype, "setMemo", null);
__decorate([
    mobx_1.computed
], MemoConfig.prototype, "error", null);
exports.MemoConfig = MemoConfig;
const useMemoConfig = (chainGetter, chainId) => {
    const [config] = react_1.useState(() => new MemoConfig(chainGetter, chainId));
    config.setChain(chainId);
    return config;
};
exports.useMemoConfig = useMemoConfig;
const wordlist = {
    abandon: true,
    ability: true,
    able: true,
    about: true,
    above: true,
    absent: true,
    absorb: true,
    abstract: true,
    absurd: true,
    abuse: true,
    access: true,
    accident: true,
    account: true,
    accuse: true,
    achieve: true,
    acid: true,
    acoustic: true,
    acquire: true,
    across: true,
    act: true,
    action: true,
    actor: true,
    actress: true,
    actual: true,
    adapt: true,
    add: true,
    addict: true,
    address: true,
    adjust: true,
    admit: true,
    adult: true,
    advance: true,
    advice: true,
    aerobic: true,
    affair: true,
    afford: true,
    afraid: true,
    again: true,
    age: true,
    agent: true,
    agree: true,
    ahead: true,
    aim: true,
    air: true,
    airport: true,
    aisle: true,
    alarm: true,
    album: true,
    alcohol: true,
    alert: true,
    alien: true,
    all: true,
    alley: true,
    allow: true,
    almost: true,
    alone: true,
    alpha: true,
    already: true,
    also: true,
    alter: true,
    always: true,
    amateur: true,
    amazing: true,
    among: true,
    amount: true,
    amused: true,
    analyst: true,
    anchor: true,
    ancient: true,
    anger: true,
    angle: true,
    angry: true,
    animal: true,
    ankle: true,
    announce: true,
    annual: true,
    another: true,
    answer: true,
    antenna: true,
    antique: true,
    anxiety: true,
    any: true,
    apart: true,
    apology: true,
    appear: true,
    apple: true,
    approve: true,
    april: true,
    arch: true,
    arctic: true,
    area: true,
    arena: true,
    argue: true,
    arm: true,
    armed: true,
    armor: true,
    army: true,
    around: true,
    arrange: true,
    arrest: true,
    arrive: true,
    arrow: true,
    art: true,
    artefact: true,
    artist: true,
    artwork: true,
    ask: true,
    aspect: true,
    assault: true,
    asset: true,
    assist: true,
    assume: true,
    asthma: true,
    athlete: true,
    atom: true,
    attack: true,
    attend: true,
    attitude: true,
    attract: true,
    auction: true,
    audit: true,
    august: true,
    aunt: true,
    author: true,
    auto: true,
    autumn: true,
    average: true,
    avocado: true,
    avoid: true,
    awake: true,
    aware: true,
    away: true,
    awesome: true,
    awful: true,
    awkward: true,
    axis: true,
    baby: true,
    bachelor: true,
    bacon: true,
    badge: true,
    bag: true,
    balance: true,
    balcony: true,
    ball: true,
    bamboo: true,
    banana: true,
    banner: true,
    bar: true,
    barely: true,
    bargain: true,
    barrel: true,
    base: true,
    basic: true,
    basket: true,
    battle: true,
    beach: true,
    bean: true,
    beauty: true,
    because: true,
    become: true,
    beef: true,
    before: true,
    begin: true,
    behave: true,
    behind: true,
    believe: true,
    below: true,
    belt: true,
    bench: true,
    benefit: true,
    best: true,
    betray: true,
    better: true,
    between: true,
    beyond: true,
    bicycle: true,
    bid: true,
    bike: true,
    bind: true,
    biology: true,
    bird: true,
    birth: true,
    bitter: true,
    black: true,
    blade: true,
    blame: true,
    blanket: true,
    blast: true,
    bleak: true,
    bless: true,
    blind: true,
    blood: true,
    blossom: true,
    blouse: true,
    blue: true,
    blur: true,
    blush: true,
    board: true,
    boat: true,
    body: true,
    boil: true,
    bomb: true,
    bone: true,
    bonus: true,
    book: true,
    boost: true,
    border: true,
    boring: true,
    borrow: true,
    boss: true,
    bottom: true,
    bounce: true,
    box: true,
    boy: true,
    bracket: true,
    brain: true,
    brand: true,
    brass: true,
    brave: true,
    bread: true,
    breeze: true,
    brick: true,
    bridge: true,
    brief: true,
    bright: true,
    bring: true,
    brisk: true,
    broccoli: true,
    broken: true,
    bronze: true,
    broom: true,
    brother: true,
    brown: true,
    brush: true,
    bubble: true,
    buddy: true,
    budget: true,
    buffalo: true,
    build: true,
    bulb: true,
    bulk: true,
    bullet: true,
    bundle: true,
    bunker: true,
    burden: true,
    burger: true,
    burst: true,
    bus: true,
    business: true,
    busy: true,
    butter: true,
    buyer: true,
    buzz: true,
    cabbage: true,
    cabin: true,
    cable: true,
    cactus: true,
    cage: true,
    cake: true,
    call: true,
    calm: true,
    camera: true,
    camp: true,
    can: true,
    canal: true,
    cancel: true,
    candy: true,
    cannon: true,
    canoe: true,
    canvas: true,
    canyon: true,
    capable: true,
    capital: true,
    captain: true,
    car: true,
    carbon: true,
    card: true,
    cargo: true,
    carpet: true,
    carry: true,
    cart: true,
    case: true,
    cash: true,
    casino: true,
    castle: true,
    casual: true,
    cat: true,
    catalog: true,
    catch: true,
    category: true,
    cattle: true,
    caught: true,
    cause: true,
    caution: true,
    cave: true,
    ceiling: true,
    celery: true,
    cement: true,
    census: true,
    century: true,
    cereal: true,
    certain: true,
    chair: true,
    chalk: true,
    champion: true,
    change: true,
    chaos: true,
    chapter: true,
    charge: true,
    chase: true,
    chat: true,
    cheap: true,
    check: true,
    cheese: true,
    chef: true,
    cherry: true,
    chest: true,
    chicken: true,
    chief: true,
    child: true,
    chimney: true,
    choice: true,
    choose: true,
    chronic: true,
    chuckle: true,
    chunk: true,
    churn: true,
    cigar: true,
    cinnamon: true,
    circle: true,
    citizen: true,
    city: true,
    civil: true,
    claim: true,
    clap: true,
    clarify: true,
    claw: true,
    clay: true,
    clean: true,
    clerk: true,
    clever: true,
    click: true,
    client: true,
    cliff: true,
    climb: true,
    clinic: true,
    clip: true,
    clock: true,
    clog: true,
    close: true,
    cloth: true,
    cloud: true,
    clown: true,
    club: true,
    clump: true,
    cluster: true,
    clutch: true,
    coach: true,
    coast: true,
    coconut: true,
    code: true,
    coffee: true,
    coil: true,
    coin: true,
    collect: true,
    color: true,
    column: true,
    combine: true,
    come: true,
    comfort: true,
    comic: true,
    common: true,
    company: true,
    concert: true,
    conduct: true,
    confirm: true,
    congress: true,
    connect: true,
    consider: true,
    control: true,
    convince: true,
    cook: true,
    cool: true,
    copper: true,
    copy: true,
    coral: true,
    core: true,
    corn: true,
    correct: true,
    cost: true,
    cotton: true,
    couch: true,
    country: true,
    couple: true,
    course: true,
    cousin: true,
    cover: true,
    coyote: true,
    crack: true,
    cradle: true,
    craft: true,
    cram: true,
    crane: true,
    crash: true,
    crater: true,
    crawl: true,
    crazy: true,
    cream: true,
    credit: true,
    creek: true,
    crew: true,
    cricket: true,
    crime: true,
    crisp: true,
    critic: true,
    crop: true,
    cross: true,
    crouch: true,
    crowd: true,
    crucial: true,
    cruel: true,
    cruise: true,
    crumble: true,
    crunch: true,
    crush: true,
    cry: true,
    crystal: true,
    cube: true,
    culture: true,
    cup: true,
    cupboard: true,
    curious: true,
    current: true,
    curtain: true,
    curve: true,
    cushion: true,
    custom: true,
    cute: true,
    cycle: true,
    dad: true,
    damage: true,
    damp: true,
    dance: true,
    danger: true,
    daring: true,
    dash: true,
    daughter: true,
    dawn: true,
    day: true,
    deal: true,
    debate: true,
    debris: true,
    decade: true,
    december: true,
    decide: true,
    decline: true,
    decorate: true,
    decrease: true,
    deer: true,
    defense: true,
    define: true,
    defy: true,
    degree: true,
    delay: true,
    deliver: true,
    demand: true,
    demise: true,
    denial: true,
    dentist: true,
    deny: true,
    depart: true,
    depend: true,
    deposit: true,
    depth: true,
    deputy: true,
    derive: true,
    describe: true,
    desert: true,
    design: true,
    desk: true,
    despair: true,
    destroy: true,
    detail: true,
    detect: true,
    develop: true,
    device: true,
    devote: true,
    diagram: true,
    dial: true,
    diamond: true,
    diary: true,
    dice: true,
    diesel: true,
    diet: true,
    differ: true,
    digital: true,
    dignity: true,
    dilemma: true,
    dinner: true,
    dinosaur: true,
    direct: true,
    dirt: true,
    disagree: true,
    discover: true,
    disease: true,
    dish: true,
    dismiss: true,
    disorder: true,
    display: true,
    distance: true,
    divert: true,
    divide: true,
    divorce: true,
    dizzy: true,
    doctor: true,
    document: true,
    dog: true,
    doll: true,
    dolphin: true,
    domain: true,
    donate: true,
    donkey: true,
    donor: true,
    door: true,
    dose: true,
    double: true,
    dove: true,
    draft: true,
    dragon: true,
    drama: true,
    drastic: true,
    draw: true,
    dream: true,
    dress: true,
    drift: true,
    drill: true,
    drink: true,
    drip: true,
    drive: true,
    drop: true,
    drum: true,
    dry: true,
    duck: true,
    dumb: true,
    dune: true,
    during: true,
    dust: true,
    dutch: true,
    duty: true,
    dwarf: true,
    dynamic: true,
    eager: true,
    eagle: true,
    early: true,
    earn: true,
    earth: true,
    easily: true,
    east: true,
    easy: true,
    echo: true,
    ecology: true,
    economy: true,
    edge: true,
    edit: true,
    educate: true,
    effort: true,
    egg: true,
    eight: true,
    either: true,
    elbow: true,
    elder: true,
    electric: true,
    elegant: true,
    element: true,
    elephant: true,
    elevator: true,
    elite: true,
    else: true,
    embark: true,
    embody: true,
    embrace: true,
    emerge: true,
    emotion: true,
    employ: true,
    empower: true,
    empty: true,
    enable: true,
    enact: true,
    end: true,
    endless: true,
    endorse: true,
    enemy: true,
    energy: true,
    enforce: true,
    engage: true,
    engine: true,
    enhance: true,
    enjoy: true,
    enlist: true,
    enough: true,
    enrich: true,
    enroll: true,
    ensure: true,
    enter: true,
    entire: true,
    entry: true,
    envelope: true,
    episode: true,
    equal: true,
    equip: true,
    era: true,
    erase: true,
    erode: true,
    erosion: true,
    error: true,
    erupt: true,
    escape: true,
    essay: true,
    essence: true,
    estate: true,
    eternal: true,
    ethics: true,
    evidence: true,
    evil: true,
    evoke: true,
    evolve: true,
    exact: true,
    example: true,
    excess: true,
    exchange: true,
    excite: true,
    exclude: true,
    excuse: true,
    execute: true,
    exercise: true,
    exhaust: true,
    exhibit: true,
    exile: true,
    exist: true,
    exit: true,
    exotic: true,
    expand: true,
    expect: true,
    expire: true,
    explain: true,
    expose: true,
    express: true,
    extend: true,
    extra: true,
    eye: true,
    eyebrow: true,
    fabric: true,
    face: true,
    faculty: true,
    fade: true,
    faint: true,
    faith: true,
    fall: true,
    false: true,
    fame: true,
    family: true,
    famous: true,
    fan: true,
    fancy: true,
    fantasy: true,
    farm: true,
    fashion: true,
    fat: true,
    fatal: true,
    father: true,
    fatigue: true,
    fault: true,
    favorite: true,
    feature: true,
    february: true,
    federal: true,
    fee: true,
    feed: true,
    feel: true,
    female: true,
    fence: true,
    festival: true,
    fetch: true,
    fever: true,
    few: true,
    fiber: true,
    fiction: true,
    field: true,
    figure: true,
    file: true,
    film: true,
    filter: true,
    final: true,
    find: true,
    fine: true,
    finger: true,
    finish: true,
    fire: true,
    firm: true,
    first: true,
    fiscal: true,
    fish: true,
    fit: true,
    fitness: true,
    fix: true,
    flag: true,
    flame: true,
    flash: true,
    flat: true,
    flavor: true,
    flee: true,
    flight: true,
    flip: true,
    float: true,
    flock: true,
    floor: true,
    flower: true,
    fluid: true,
    flush: true,
    fly: true,
    foam: true,
    focus: true,
    fog: true,
    foil: true,
    fold: true,
    follow: true,
    food: true,
    foot: true,
    force: true,
    forest: true,
    forget: true,
    fork: true,
    fortune: true,
    forum: true,
    forward: true,
    fossil: true,
    foster: true,
    found: true,
    fox: true,
    fragile: true,
    frame: true,
    frequent: true,
    fresh: true,
    friend: true,
    fringe: true,
    frog: true,
    front: true,
    frost: true,
    frown: true,
    frozen: true,
    fruit: true,
    fuel: true,
    fun: true,
    funny: true,
    furnace: true,
    fury: true,
    future: true,
    gadget: true,
    gain: true,
    galaxy: true,
    gallery: true,
    game: true,
    gap: true,
    garage: true,
    garbage: true,
    garden: true,
    garlic: true,
    garment: true,
    gas: true,
    gasp: true,
    gate: true,
    gather: true,
    gauge: true,
    gaze: true,
    general: true,
    genius: true,
    genre: true,
    gentle: true,
    genuine: true,
    gesture: true,
    ghost: true,
    giant: true,
    gift: true,
    giggle: true,
    ginger: true,
    giraffe: true,
    girl: true,
    give: true,
    glad: true,
    glance: true,
    glare: true,
    glass: true,
    glide: true,
    glimpse: true,
    globe: true,
    gloom: true,
    glory: true,
    glove: true,
    glow: true,
    glue: true,
    goat: true,
    goddess: true,
    gold: true,
    good: true,
    goose: true,
    gorilla: true,
    gospel: true,
    gossip: true,
    govern: true,
    gown: true,
    grab: true,
    grace: true,
    grain: true,
    grant: true,
    grape: true,
    grass: true,
    gravity: true,
    great: true,
    green: true,
    grid: true,
    grief: true,
    grit: true,
    grocery: true,
    group: true,
    grow: true,
    grunt: true,
    guard: true,
    guess: true,
    guide: true,
    guilt: true,
    guitar: true,
    gun: true,
    gym: true,
    habit: true,
    hair: true,
    half: true,
    hammer: true,
    hamster: true,
    hand: true,
    happy: true,
    harbor: true,
    hard: true,
    harsh: true,
    harvest: true,
    hat: true,
    have: true,
    hawk: true,
    hazard: true,
    head: true,
    health: true,
    heart: true,
    heavy: true,
    hedgehog: true,
    height: true,
    hello: true,
    helmet: true,
    help: true,
    hen: true,
    hero: true,
    hidden: true,
    high: true,
    hill: true,
    hint: true,
    hip: true,
    hire: true,
    history: true,
    hobby: true,
    hockey: true,
    hold: true,
    hole: true,
    holiday: true,
    hollow: true,
    home: true,
    honey: true,
    hood: true,
    hope: true,
    horn: true,
    horror: true,
    horse: true,
    hospital: true,
    host: true,
    hotel: true,
    hour: true,
    hover: true,
    hub: true,
    huge: true,
    human: true,
    humble: true,
    humor: true,
    hundred: true,
    hungry: true,
    hunt: true,
    hurdle: true,
    hurry: true,
    hurt: true,
    husband: true,
    hybrid: true,
    ice: true,
    icon: true,
    idea: true,
    identify: true,
    idle: true,
    ignore: true,
    ill: true,
    illegal: true,
    illness: true,
    image: true,
    imitate: true,
    immense: true,
    immune: true,
    impact: true,
    impose: true,
    improve: true,
    impulse: true,
    inch: true,
    include: true,
    income: true,
    increase: true,
    index: true,
    indicate: true,
    indoor: true,
    industry: true,
    infant: true,
    inflict: true,
    inform: true,
    inhale: true,
    inherit: true,
    initial: true,
    inject: true,
    injury: true,
    inmate: true,
    inner: true,
    innocent: true,
    input: true,
    inquiry: true,
    insane: true,
    insect: true,
    inside: true,
    inspire: true,
    install: true,
    intact: true,
    interest: true,
    into: true,
    invest: true,
    invite: true,
    involve: true,
    iron: true,
    island: true,
    isolate: true,
    issue: true,
    item: true,
    ivory: true,
    jacket: true,
    jaguar: true,
    jar: true,
    jazz: true,
    jealous: true,
    jeans: true,
    jelly: true,
    jewel: true,
    job: true,
    join: true,
    joke: true,
    journey: true,
    joy: true,
    judge: true,
    juice: true,
    jump: true,
    jungle: true,
    junior: true,
    junk: true,
    just: true,
    kangaroo: true,
    keen: true,
    keep: true,
    ketchup: true,
    key: true,
    kick: true,
    kid: true,
    kidney: true,
    kind: true,
    kingdom: true,
    kiss: true,
    kit: true,
    kitchen: true,
    kite: true,
    kitten: true,
    kiwi: true,
    knee: true,
    knife: true,
    knock: true,
    know: true,
    lab: true,
    label: true,
    labor: true,
    ladder: true,
    lady: true,
    lake: true,
    lamp: true,
    language: true,
    laptop: true,
    large: true,
    later: true,
    latin: true,
    laugh: true,
    laundry: true,
    lava: true,
    law: true,
    lawn: true,
    lawsuit: true,
    layer: true,
    lazy: true,
    leader: true,
    leaf: true,
    learn: true,
    leave: true,
    lecture: true,
    left: true,
    leg: true,
    legal: true,
    legend: true,
    leisure: true,
    lemon: true,
    lend: true,
    length: true,
    lens: true,
    leopard: true,
    lesson: true,
    letter: true,
    level: true,
    liar: true,
    liberty: true,
    library: true,
    license: true,
    life: true,
    lift: true,
    light: true,
    like: true,
    limb: true,
    limit: true,
    link: true,
    lion: true,
    liquid: true,
    list: true,
    little: true,
    live: true,
    lizard: true,
    load: true,
    loan: true,
    lobster: true,
    local: true,
    lock: true,
    logic: true,
    lonely: true,
    long: true,
    loop: true,
    lottery: true,
    loud: true,
    lounge: true,
    love: true,
    loyal: true,
    lucky: true,
    luggage: true,
    lumber: true,
    lunar: true,
    lunch: true,
    luxury: true,
    lyrics: true,
    machine: true,
    mad: true,
    magic: true,
    magnet: true,
    maid: true,
    mail: true,
    main: true,
    major: true,
    make: true,
    mammal: true,
    man: true,
    manage: true,
    mandate: true,
    mango: true,
    mansion: true,
    manual: true,
    maple: true,
    marble: true,
    march: true,
    margin: true,
    marine: true,
    market: true,
    marriage: true,
    mask: true,
    mass: true,
    master: true,
    match: true,
    material: true,
    math: true,
    matrix: true,
    matter: true,
    maximum: true,
    maze: true,
    meadow: true,
    mean: true,
    measure: true,
    meat: true,
    mechanic: true,
    medal: true,
    media: true,
    melody: true,
    melt: true,
    member: true,
    memory: true,
    mention: true,
    menu: true,
    mercy: true,
    merge: true,
    merit: true,
    merry: true,
    mesh: true,
    message: true,
    metal: true,
    method: true,
    middle: true,
    midnight: true,
    milk: true,
    million: true,
    mimic: true,
    mind: true,
    minimum: true,
    minor: true,
    minute: true,
    miracle: true,
    mirror: true,
    misery: true,
    miss: true,
    mistake: true,
    mix: true,
    mixed: true,
    mixture: true,
    mobile: true,
    model: true,
    modify: true,
    mom: true,
    moment: true,
    monitor: true,
    monkey: true,
    monster: true,
    month: true,
    moon: true,
    moral: true,
    more: true,
    morning: true,
    mosquito: true,
    mother: true,
    motion: true,
    motor: true,
    mountain: true,
    mouse: true,
    move: true,
    movie: true,
    much: true,
    muffin: true,
    mule: true,
    multiply: true,
    muscle: true,
    museum: true,
    mushroom: true,
    music: true,
    must: true,
    mutual: true,
    myself: true,
    mystery: true,
    myth: true,
    naive: true,
    name: true,
    napkin: true,
    narrow: true,
    nasty: true,
    nation: true,
    nature: true,
    near: true,
    neck: true,
    need: true,
    negative: true,
    neglect: true,
    neither: true,
    nephew: true,
    nerve: true,
    nest: true,
    net: true,
    network: true,
    neutral: true,
    never: true,
    news: true,
    next: true,
    nice: true,
    night: true,
    noble: true,
    noise: true,
    nominee: true,
    noodle: true,
    normal: true,
    north: true,
    nose: true,
    notable: true,
    note: true,
    nothing: true,
    notice: true,
    novel: true,
    now: true,
    nuclear: true,
    number: true,
    nurse: true,
    nut: true,
    oak: true,
    obey: true,
    object: true,
    oblige: true,
    obscure: true,
    observe: true,
    obtain: true,
    obvious: true,
    occur: true,
    ocean: true,
    october: true,
    odor: true,
    off: true,
    offer: true,
    office: true,
    often: true,
    oil: true,
    okay: true,
    old: true,
    olive: true,
    olympic: true,
    omit: true,
    once: true,
    one: true,
    onion: true,
    online: true,
    only: true,
    open: true,
    opera: true,
    opinion: true,
    oppose: true,
    option: true,
    orange: true,
    orbit: true,
    orchard: true,
    order: true,
    ordinary: true,
    organ: true,
    orient: true,
    original: true,
    orphan: true,
    ostrich: true,
    other: true,
    outdoor: true,
    outer: true,
    output: true,
    outside: true,
    oval: true,
    oven: true,
    over: true,
    own: true,
    owner: true,
    oxygen: true,
    oyster: true,
    ozone: true,
    pact: true,
    paddle: true,
    page: true,
    pair: true,
    palace: true,
    palm: true,
    panda: true,
    panel: true,
    panic: true,
    panther: true,
    paper: true,
    parade: true,
    parent: true,
    park: true,
    parrot: true,
    party: true,
    pass: true,
    patch: true,
    path: true,
    patient: true,
    patrol: true,
    pattern: true,
    pause: true,
    pave: true,
    payment: true,
    peace: true,
    peanut: true,
    pear: true,
    peasant: true,
    pelican: true,
    pen: true,
    penalty: true,
    pencil: true,
    people: true,
    pepper: true,
    perfect: true,
    permit: true,
    person: true,
    pet: true,
    phone: true,
    photo: true,
    phrase: true,
    physical: true,
    piano: true,
    picnic: true,
    picture: true,
    piece: true,
    pig: true,
    pigeon: true,
    pill: true,
    pilot: true,
    pink: true,
    pioneer: true,
    pipe: true,
    pistol: true,
    pitch: true,
    pizza: true,
    place: true,
    planet: true,
    plastic: true,
    plate: true,
    play: true,
    please: true,
    pledge: true,
    pluck: true,
    plug: true,
    plunge: true,
    poem: true,
    poet: true,
    point: true,
    polar: true,
    pole: true,
    police: true,
    pond: true,
    pony: true,
    pool: true,
    popular: true,
    portion: true,
    position: true,
    possible: true,
    post: true,
    potato: true,
    pottery: true,
    poverty: true,
    powder: true,
    power: true,
    practice: true,
    praise: true,
    predict: true,
    prefer: true,
    prepare: true,
    present: true,
    pretty: true,
    prevent: true,
    price: true,
    pride: true,
    primary: true,
    print: true,
    priority: true,
    prison: true,
    private: true,
    prize: true,
    problem: true,
    process: true,
    produce: true,
    profit: true,
    program: true,
    project: true,
    promote: true,
    proof: true,
    property: true,
    prosper: true,
    protect: true,
    proud: true,
    provide: true,
    public: true,
    pudding: true,
    pull: true,
    pulp: true,
    pulse: true,
    pumpkin: true,
    punch: true,
    pupil: true,
    puppy: true,
    purchase: true,
    purity: true,
    purpose: true,
    purse: true,
    push: true,
    put: true,
    puzzle: true,
    pyramid: true,
    quality: true,
    quantum: true,
    quarter: true,
    question: true,
    quick: true,
    quit: true,
    quiz: true,
    quote: true,
    rabbit: true,
    raccoon: true,
    race: true,
    rack: true,
    radar: true,
    radio: true,
    rail: true,
    rain: true,
    raise: true,
    rally: true,
    ramp: true,
    ranch: true,
    random: true,
    range: true,
    rapid: true,
    rare: true,
    rate: true,
    rather: true,
    raven: true,
    raw: true,
    razor: true,
    ready: true,
    real: true,
    reason: true,
    rebel: true,
    rebuild: true,
    recall: true,
    receive: true,
    recipe: true,
    record: true,
    recycle: true,
    reduce: true,
    reflect: true,
    reform: true,
    refuse: true,
    region: true,
    regret: true,
    regular: true,
    reject: true,
    relax: true,
    release: true,
    relief: true,
    rely: true,
    remain: true,
    remember: true,
    remind: true,
    remove: true,
    render: true,
    renew: true,
    rent: true,
    reopen: true,
    repair: true,
    repeat: true,
    replace: true,
    report: true,
    require: true,
    rescue: true,
    resemble: true,
    resist: true,
    resource: true,
    response: true,
    result: true,
    retire: true,
    retreat: true,
    return: true,
    reunion: true,
    reveal: true,
    review: true,
    reward: true,
    rhythm: true,
    rib: true,
    ribbon: true,
    rice: true,
    rich: true,
    ride: true,
    ridge: true,
    rifle: true,
    right: true,
    rigid: true,
    ring: true,
    riot: true,
    ripple: true,
    risk: true,
    ritual: true,
    rival: true,
    river: true,
    road: true,
    roast: true,
    robot: true,
    robust: true,
    rocket: true,
    romance: true,
    roof: true,
    rookie: true,
    room: true,
    rose: true,
    rotate: true,
    rough: true,
    round: true,
    route: true,
    royal: true,
    rubber: true,
    rude: true,
    rug: true,
    rule: true,
    run: true,
    runway: true,
    rural: true,
    sad: true,
    saddle: true,
    sadness: true,
    safe: true,
    sail: true,
    salad: true,
    salmon: true,
    salon: true,
    salt: true,
    salute: true,
    same: true,
    sample: true,
    sand: true,
    satisfy: true,
    satoshi: true,
    sauce: true,
    sausage: true,
    save: true,
    say: true,
    scale: true,
    scan: true,
    scare: true,
    scatter: true,
    scene: true,
    scheme: true,
    school: true,
    science: true,
    scissors: true,
    scorpion: true,
    scout: true,
    scrap: true,
    screen: true,
    script: true,
    scrub: true,
    sea: true,
    search: true,
    season: true,
    seat: true,
    second: true,
    secret: true,
    section: true,
    security: true,
    seed: true,
    seek: true,
    segment: true,
    select: true,
    sell: true,
    seminar: true,
    senior: true,
    sense: true,
    sentence: true,
    series: true,
    service: true,
    session: true,
    settle: true,
    setup: true,
    seven: true,
    shadow: true,
    shaft: true,
    shallow: true,
    share: true,
    shed: true,
    shell: true,
    sheriff: true,
    shield: true,
    shift: true,
    shine: true,
    ship: true,
    shiver: true,
    shock: true,
    shoe: true,
    shoot: true,
    shop: true,
    short: true,
    shoulder: true,
    shove: true,
    shrimp: true,
    shrug: true,
    shuffle: true,
    shy: true,
    sibling: true,
    sick: true,
    side: true,
    siege: true,
    sight: true,
    sign: true,
    silent: true,
    silk: true,
    silly: true,
    silver: true,
    similar: true,
    simple: true,
    since: true,
    sing: true,
    siren: true,
    sister: true,
    situate: true,
    six: true,
    size: true,
    skate: true,
    sketch: true,
    ski: true,
    skill: true,
    skin: true,
    skirt: true,
    skull: true,
    slab: true,
    slam: true,
    sleep: true,
    slender: true,
    slice: true,
    slide: true,
    slight: true,
    slim: true,
    slogan: true,
    slot: true,
    slow: true,
    slush: true,
    small: true,
    smart: true,
    smile: true,
    smoke: true,
    smooth: true,
    snack: true,
    snake: true,
    snap: true,
    sniff: true,
    snow: true,
    soap: true,
    soccer: true,
    social: true,
    sock: true,
    soda: true,
    soft: true,
    solar: true,
    soldier: true,
    solid: true,
    solution: true,
    solve: true,
    someone: true,
    song: true,
    soon: true,
    sorry: true,
    sort: true,
    soul: true,
    sound: true,
    soup: true,
    source: true,
    south: true,
    space: true,
    spare: true,
    spatial: true,
    spawn: true,
    speak: true,
    special: true,
    speed: true,
    spell: true,
    spend: true,
    sphere: true,
    spice: true,
    spider: true,
    spike: true,
    spin: true,
    spirit: true,
    split: true,
    spoil: true,
    sponsor: true,
    spoon: true,
    sport: true,
    spot: true,
    spray: true,
    spread: true,
    spring: true,
    spy: true,
    square: true,
    squeeze: true,
    squirrel: true,
    stable: true,
    stadium: true,
    staff: true,
    stage: true,
    stairs: true,
    stamp: true,
    stand: true,
    start: true,
    state: true,
    stay: true,
    steak: true,
    steel: true,
    stem: true,
    step: true,
    stereo: true,
    stick: true,
    still: true,
    sting: true,
    stock: true,
    stomach: true,
    stone: true,
    stool: true,
    story: true,
    stove: true,
    strategy: true,
    street: true,
    strike: true,
    strong: true,
    struggle: true,
    student: true,
    stuff: true,
    stumble: true,
    style: true,
    subject: true,
    submit: true,
    subway: true,
    success: true,
    such: true,
    sudden: true,
    suffer: true,
    sugar: true,
    suggest: true,
    suit: true,
    summer: true,
    sun: true,
    sunny: true,
    sunset: true,
    super: true,
    supply: true,
    supreme: true,
    sure: true,
    surface: true,
    surge: true,
    surprise: true,
    surround: true,
    survey: true,
    suspect: true,
    sustain: true,
    swallow: true,
    swamp: true,
    swap: true,
    swarm: true,
    swear: true,
    sweet: true,
    swift: true,
    swim: true,
    swing: true,
    switch: true,
    sword: true,
    symbol: true,
    symptom: true,
    syrup: true,
    system: true,
    table: true,
    tackle: true,
    tag: true,
    tail: true,
    talent: true,
    talk: true,
    tank: true,
    tape: true,
    target: true,
    task: true,
    taste: true,
    tattoo: true,
    taxi: true,
    teach: true,
    team: true,
    tell: true,
    ten: true,
    tenant: true,
    tennis: true,
    tent: true,
    term: true,
    test: true,
    text: true,
    thank: true,
    that: true,
    theme: true,
    then: true,
    theory: true,
    there: true,
    they: true,
    thing: true,
    this: true,
    thought: true,
    three: true,
    thrive: true,
    throw: true,
    thumb: true,
    thunder: true,
    ticket: true,
    tide: true,
    tiger: true,
    tilt: true,
    timber: true,
    time: true,
    tiny: true,
    tip: true,
    tired: true,
    tissue: true,
    title: true,
    toast: true,
    tobacco: true,
    today: true,
    toddler: true,
    toe: true,
    together: true,
    toilet: true,
    token: true,
    tomato: true,
    tomorrow: true,
    tone: true,
    tongue: true,
    tonight: true,
    tool: true,
    tooth: true,
    top: true,
    topic: true,
    topple: true,
    torch: true,
    tornado: true,
    tortoise: true,
    toss: true,
    total: true,
    tourist: true,
    toward: true,
    tower: true,
    town: true,
    toy: true,
    track: true,
    trade: true,
    traffic: true,
    tragic: true,
    train: true,
    transfer: true,
    trap: true,
    trash: true,
    travel: true,
    tray: true,
    treat: true,
    tree: true,
    trend: true,
    trial: true,
    tribe: true,
    trick: true,
    trigger: true,
    trim: true,
    trip: true,
    trophy: true,
    trouble: true,
    truck: true,
    true: true,
    truly: true,
    trumpet: true,
    trust: true,
    truth: true,
    try: true,
    tube: true,
    tuition: true,
    tumble: true,
    tuna: true,
    tunnel: true,
    turkey: true,
    turn: true,
    turtle: true,
    twelve: true,
    twenty: true,
    twice: true,
    twin: true,
    twist: true,
    two: true,
    type: true,
    typical: true,
    ugly: true,
    umbrella: true,
    unable: true,
    unaware: true,
    uncle: true,
    uncover: true,
    under: true,
    undo: true,
    unfair: true,
    unfold: true,
    unhappy: true,
    uniform: true,
    unique: true,
    unit: true,
    universe: true,
    unknown: true,
    unlock: true,
    until: true,
    unusual: true,
    unveil: true,
    update: true,
    upgrade: true,
    uphold: true,
    upon: true,
    upper: true,
    upset: true,
    urban: true,
    urge: true,
    usage: true,
    use: true,
    used: true,
    useful: true,
    useless: true,
    usual: true,
    utility: true,
    vacant: true,
    vacuum: true,
    vague: true,
    valid: true,
    valley: true,
    valve: true,
    van: true,
    vanish: true,
    vapor: true,
    various: true,
    vast: true,
    vault: true,
    vehicle: true,
    velvet: true,
    vendor: true,
    venture: true,
    venue: true,
    verb: true,
    verify: true,
    version: true,
    very: true,
    vessel: true,
    veteran: true,
    viable: true,
    vibrant: true,
    vicious: true,
    victory: true,
    video: true,
    view: true,
    village: true,
    vintage: true,
    violin: true,
    virtual: true,
    virus: true,
    visa: true,
    visit: true,
    visual: true,
    vital: true,
    vivid: true,
    vocal: true,
    voice: true,
    void: true,
    volcano: true,
    volume: true,
    vote: true,
    voyage: true,
    wage: true,
    wagon: true,
    wait: true,
    walk: true,
    wall: true,
    walnut: true,
    want: true,
    warfare: true,
    warm: true,
    warrior: true,
    wash: true,
    wasp: true,
    waste: true,
    water: true,
    wave: true,
    way: true,
    wealth: true,
    weapon: true,
    wear: true,
    weasel: true,
    weather: true,
    web: true,
    wedding: true,
    weekend: true,
    weird: true,
    welcome: true,
    west: true,
    wet: true,
    whale: true,
    what: true,
    wheat: true,
    wheel: true,
    when: true,
    where: true,
    whip: true,
    whisper: true,
    wide: true,
    width: true,
    wife: true,
    wild: true,
    will: true,
    win: true,
    window: true,
    wine: true,
    wing: true,
    wink: true,
    winner: true,
    winter: true,
    wire: true,
    wisdom: true,
    wise: true,
    wish: true,
    witness: true,
    wolf: true,
    woman: true,
    wonder: true,
    wood: true,
    wool: true,
    word: true,
    work: true,
    world: true,
    worry: true,
    worth: true,
    wrap: true,
    wreck: true,
    wrestle: true,
    wrist: true,
    write: true,
    wrong: true,
    yard: true,
    year: true,
    yellow: true,
    you: true,
    young: true,
    youth: true,
    zebra: true,
    zero: true,
    zone: true,
    zoo: true,
};
//# sourceMappingURL=memo.js.map

/***/ }),

/***/ 1399:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeeConfig = exports.FeeConfig = void 0;
const types_1 = __webpack_require__(1226);
const chain_1 = __webpack_require__(262);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
const mobx_utils_1 = __webpack_require__(201);
const react_1 = __webpack_require__(0);
const errors_1 = __webpack_require__(280);
class FeeConfig extends chain_1.TxChainSetter {
    constructor(chainGetter, queriesStore, initialChainId, sender, amountConfig, gasConfig, additionAmountToNeedFee = true) {
        super(chainGetter, initialChainId);
        this.queriesStore = queriesStore;
        this.amountConfig = amountConfig;
        this.gasConfig = gasConfig;
        this._autoFeeCoinMinimalDenom = undefined;
        this._feeType = undefined;
        this._manualFee = undefined;
        /**
         * `additionAmountToNeedFee` indicated that the fee config should consider the amount config's amount
         *  when checking that the fee is sufficient to send tx.
         *  If this value is true and if the amount + fee is not sufficient to send tx, it will return error.
         *  Else, only consider the fee without addition the amount.
         * @protected
         */
        this.additionAmountToNeedFee = true;
        this._disableBalanceCheck = false;
        this.getFeeTypePretty = mobx_utils_1.computedFn((feeType) => {
            if (this._manualFee) {
                throw new Error("Can't calculate fee from fee type. Because fee config uses the manual fee now");
            }
            if (!this.feeCurrency) {
                throw new Error("Fee currency not set");
            }
            const feeTypePrimitive = this.getFeeTypePrimitive(this.feeCurrency, feeType);
            const feeCurrency = this.feeCurrency;
            return new unit_1.CoinPretty(feeCurrency, new unit_1.Int(feeTypePrimitive.amount)).maxDecimals(feeCurrency.coinDecimals);
        });
        this.getFeeTypePrettyForFeeCurrency = mobx_utils_1.computedFn((feeCurrency, feeType) => {
            if (this._manualFee) {
                throw new Error("Can't calculate fee from fee type. Because fee config uses the manual fee now");
            }
            const feeTypePrimitive = this.getFeeTypePrimitive(feeCurrency, feeType);
            return new unit_1.CoinPretty(feeCurrency, new unit_1.Int(feeTypePrimitive.amount)).maxDecimals(feeCurrency.coinDecimals);
        });
        this._sender = sender;
        this.additionAmountToNeedFee = additionAmountToNeedFee;
        mobx_1.makeObservable(this);
    }
    setAdditionAmountToNeedFee(additionAmountToNeedFee) {
        this.additionAmountToNeedFee = additionAmountToNeedFee;
    }
    get sender() {
        return this._sender;
    }
    setSender(sender) {
        this._sender = sender;
    }
    setFeeType(feeType) {
        this._feeType = feeType;
        this._manualFee = undefined;
    }
    setAutoFeeCoinMinimalDenom(denom) {
        this._autoFeeCoinMinimalDenom = denom;
    }
    get isManual() {
        return this.feeType === undefined;
    }
    get feeType() {
        return this._feeType;
    }
    setManualFee(fee) {
        this._manualFee = fee;
        this._feeType = undefined;
    }
    get feeCurrencies() {
        if (this.canOsmosisTxFeesAndReady()) {
            const queryOsmosis = this.queriesStore.get(this.chainId).osmosis;
            if (queryOsmosis) {
                const txFees = queryOsmosis.queryTxFeesFeeTokens;
                const exists = {};
                // To reduce the confusion, add the priority to native (not ibc token) currency.
                // And, put the most priority to the base denom.
                // Remainings are sorted in alphabetical order.
                return this.chainInfo.feeCurrencies
                    .concat(txFees.feeCurrencies)
                    .filter((cur) => {
                    if (!exists[cur.coinMinimalDenom]) {
                        exists[cur.coinMinimalDenom] = true;
                        return true;
                    }
                    return false;
                })
                    .sort((cur1, cur2) => {
                    if (cur1.coinMinimalDenom ===
                        queryOsmosis.queryTxFeesBaseDenom.baseDenom) {
                        return -1;
                    }
                    if (cur2.coinMinimalDenom ===
                        queryOsmosis.queryTxFeesBaseDenom.baseDenom) {
                        return 1;
                    }
                    const cur1IsIBCToken = cur1.coinMinimalDenom.startsWith("ibc/");
                    const cur2IsIBCToken = cur2.coinMinimalDenom.startsWith("ibc/");
                    if (cur1IsIBCToken && !cur2IsIBCToken) {
                        return 1;
                    }
                    if (!cur1IsIBCToken && cur2IsIBCToken) {
                        return -1;
                    }
                    return cur1.coinMinimalDenom < cur2.coinMinimalDenom ? -1 : 1;
                });
            }
        }
        const res = [];
        for (const feeCurrency of this.chainInfo.feeCurrencies) {
            const cur = this.chainInfo.findCurrency(feeCurrency.coinMinimalDenom);
            if (cur) {
                res.push(Object.assign(Object.assign({}, feeCurrency), cur));
            }
        }
        return res;
    }
    get feeCurrency() {
        if (this._manualFee) {
            for (const currency of this.feeCurrencies) {
                if (currency.coinMinimalDenom === this._manualFee.denom) {
                    return currency;
                }
            }
            return {
                coinMinimalDenom: this._manualFee.denom,
                coinDenom: this._manualFee.denom,
                coinDecimals: 0,
            };
        }
        if (this._autoFeeCoinMinimalDenom) {
            for (const currency of this.feeCurrencies) {
                if (currency.coinMinimalDenom === this._autoFeeCoinMinimalDenom) {
                    return currency;
                }
            }
        }
        return this.feeCurrencies[0];
    }
    toStdFee() {
        const amount = this.getFeePrimitive();
        if (!amount) {
            return {
                gas: this.gasConfig.gas.toString(),
                amount: [],
            };
        }
        return {
            gas: this.gasConfig.gas.toString(),
            amount: [amount],
        };
    }
    get fee() {
        if (!this.feeCurrency) {
            return undefined;
        }
        const feePrimitive = this.getFeePrimitive();
        if (!feePrimitive) {
            return undefined;
        }
        return new unit_1.CoinPretty(this.feeCurrency, new unit_1.Int(feePrimitive.amount));
    }
    getFeePrimitive() {
        // If there is no fee currency, just return with empty fee amount.
        if (!this.feeCurrency) {
            return undefined;
        }
        if (this._manualFee) {
            return this._manualFee;
        }
        if (this.feeType) {
            return this.getFeeTypePrimitive(this.feeCurrency, this.feeType);
        }
        // If fee is not set, just return with empty fee amount.
        return undefined;
    }
    canOsmosisTxFeesAndReady() {
        if (this.chainInfo.features &&
            this.chainInfo.features.includes("osmosis-txfees")) {
            if (!this.queriesStore.get(this.chainId).osmosis) {
                console.log("Chain has osmosis-txfees feature. But no osmosis queries provided.");
                return false;
            }
            const queryBaseDenom = this.queriesStore.get(this.chainId).osmosis
                .queryTxFeesBaseDenom;
            if (queryBaseDenom.baseDenom &&
                this.chainInfo.feeCurrencies.find((cur) => cur.coinMinimalDenom === queryBaseDenom.baseDenom)) {
                return true;
            }
        }
        return false;
    }
    getFeeTypePrimitive(feeCurrency, feeType) {
        var _a, _b, _c, _d, _e, _f;
        if (this._manualFee) {
            throw new Error("Can't calculate fee from fee type. Because fee config uses the manual fee now");
        }
        if (this.chainInfo.features &&
            this.chainInfo.features.includes("osmosis-txfees") &&
            this.queriesStore.get(this.chainId).osmosis && ((_a = this.queriesStore
            .get(this.chainId)
            .osmosis) === null || _a === void 0 ? void 0 : _a.queryTxFeesFeeTokens.isTxFeeToken(feeCurrency.coinMinimalDenom))) {
            const gasPriceStep = (_b = this.feeCurrencies[0].gasPriceStep) !== null && _b !== void 0 ? _b : types_1.DefaultGasPriceStep;
            const gasPrice = new unit_1.Dec(gasPriceStep[feeType].toString());
            let feeAmount = gasPrice.mul(new unit_1.Dec(this.gasConfig.gas));
            const spotPriceDec = this.queriesStore
                .get(this.chainId)
                .osmosis.queryTxFeesSpotPriceByDenom.getQueryDenom(feeCurrency.coinMinimalDenom).spotPriceDec;
            if (spotPriceDec.gt(new unit_1.Dec(0))) {
                // If you calculate only the spot price, slippage cannot be considered. However, rather than performing the actual calculation here, the slippage problem is avoided by simply giving an additional value of 1%.
                feeAmount = feeAmount.quo(spotPriceDec).mul(new unit_1.Dec(1.01));
            }
            else {
                // 0 fee amount makes the simulation twice because there will be no zero fee immediately.
                // To reduce this problem, just set the fee amount as 1.
                feeAmount = new unit_1.Dec(1);
            }
            return {
                denom: feeCurrency.coinMinimalDenom,
                amount: feeAmount.roundUp().toString(),
            };
        }
        // For legacy support
        // Fallback gas price step to legacy chain info which includes gas price step field in root,
        // if there is no gas price step in fee currency.
        const chainInfoWithGasPriceStep = ((_c = this.chainInfo.raw) !== null && _c !== void 0 ? _c : {});
        const gasPriceStep = (_f = (_e = (_d = this.feeCurrency) === null || _d === void 0 ? void 0 : _d.gasPriceStep) !== null && _e !== void 0 ? _e : chainInfoWithGasPriceStep.gasPriceStep) !== null && _f !== void 0 ? _f : types_1.DefaultGasPriceStep;
        const gasPrice = new unit_1.Dec(gasPriceStep[feeType].toString());
        const feeAmount = gasPrice.mul(new unit_1.Dec(this.gasConfig.gas));
        return {
            denom: feeCurrency.coinMinimalDenom,
            amount: feeAmount.roundUp().toString(),
        };
    }
    get error() {
        var _a;
        if (this.gasConfig.error) {
            return this.gasConfig.error;
        }
        if (this.disableBalanceCheck) {
            return undefined;
        }
        const fee = this.getFeePrimitive();
        if (!fee) {
            return undefined;
        }
        if (this.feeCurrency &&
            this.chainInfo.features &&
            this.chainInfo.features.includes("osmosis-txfees") &&
            this.queriesStore.get(this.chainId).osmosis && ((_a = this.queriesStore
            .get(this.chainId)
            .osmosis) === null || _a === void 0 ? void 0 : _a.queryTxFeesFeeTokens.isTxFeeToken(this.feeCurrency.coinMinimalDenom))) {
            const spotPrice = this.queriesStore
                .get(this.chainId)
                .osmosis.queryTxFeesSpotPriceByDenom.getQueryDenom(this.feeCurrency.coinMinimalDenom);
            if (spotPrice.isFetching) {
                // Show loading indicator
                return new errors_1.NotLoadedFeeError(`spot price of ${this.feeCurrency.coinMinimalDenom} is loading`);
            }
            else if (spotPrice.error) {
                return new Error("Failed to fetch spot price");
            }
        }
        const amount = this.amountConfig.getAmountPrimitive();
        let need;
        if (this.additionAmountToNeedFee && fee && fee.denom === amount.denom) {
            need = new unit_1.Coin(fee.denom, new unit_1.Int(fee.amount).add(new unit_1.Int(amount.amount)));
        }
        else {
            need = new unit_1.Coin(fee.denom, new unit_1.Int(fee.amount));
        }
        if (need.amount.gt(new unit_1.Int(0))) {
            const bal = this.queriesStore
                .get(this.chainId)
                .queryBalances.getQueryBech32Address(this._sender)
                .balances.find((bal) => {
                return bal.currency.coinMinimalDenom === need.denom;
            });
            if (!bal) {
                return new errors_1.InsufficientFeeError("insufficient fee");
            }
            else if (!bal.response && !bal.error) {
                // If fetching balance doesn't have the response nor error,
                // assume it is not loaded from KVStore(cache).
                return new errors_1.NotLoadedFeeError(`${bal.currency.coinDenom} is not loaded yet`);
            }
            else if (bal.balance
                .toDec()
                .mul(unit_1.DecUtils.getPrecisionDec(bal.currency.coinDecimals))
                .truncate()
                .lt(need.amount)) {
                return new errors_1.InsufficientFeeError("insufficient fee");
            }
        }
    }
    setDisableBalanceCheck(bool) {
        this._disableBalanceCheck = bool;
    }
    get disableBalanceCheck() {
        return this._disableBalanceCheck;
    }
}
__decorate([
    mobx_1.observable
], FeeConfig.prototype, "_sender", void 0);
__decorate([
    mobx_1.observable
], FeeConfig.prototype, "_autoFeeCoinMinimalDenom", void 0);
__decorate([
    mobx_1.observable
], FeeConfig.prototype, "_feeType", void 0);
__decorate([
    mobx_1.observable
], FeeConfig.prototype, "_manualFee", void 0);
__decorate([
    mobx_1.observable
], FeeConfig.prototype, "additionAmountToNeedFee", void 0);
__decorate([
    mobx_1.observable
], FeeConfig.prototype, "_disableBalanceCheck", void 0);
__decorate([
    mobx_1.action
], FeeConfig.prototype, "setAdditionAmountToNeedFee", null);
__decorate([
    mobx_1.action
], FeeConfig.prototype, "setSender", null);
__decorate([
    mobx_1.action
], FeeConfig.prototype, "setFeeType", null);
__decorate([
    mobx_1.action
], FeeConfig.prototype, "setAutoFeeCoinMinimalDenom", null);
__decorate([
    mobx_1.action
], FeeConfig.prototype, "setManualFee", null);
__decorate([
    mobx_1.computed
], FeeConfig.prototype, "feeCurrencies", null);
__decorate([
    mobx_1.computed
], FeeConfig.prototype, "feeCurrency", null);
__decorate([
    mobx_1.computed
], FeeConfig.prototype, "fee", null);
__decorate([
    mobx_1.computed
], FeeConfig.prototype, "error", null);
__decorate([
    mobx_1.action
], FeeConfig.prototype, "setDisableBalanceCheck", null);
exports.FeeConfig = FeeConfig;
const useFeeConfig = (chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig, additionAmountToNeedFee = true) => {
    const [config] = react_1.useState(() => new FeeConfig(chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig, additionAmountToNeedFee));
    config.setChain(chainId);
    config.setSender(sender);
    config.setAdditionAmountToNeedFee(additionAmountToNeedFee);
    return config;
};
exports.useFeeConfig = useFeeConfig;
//# sourceMappingURL=fee.js.map

/***/ }),

/***/ 1400:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecipientConfig = exports.RecipientConfig = void 0;
const chain_1 = __webpack_require__(262);
const mobx_1 = __webpack_require__(5);
const errors_1 = __webpack_require__(280);
const cosmos_1 = __webpack_require__(16);
const react_1 = __webpack_require__(0);
const ens_1 = __webpack_require__(1194);
const address_1 = __webpack_require__(244);
const buffer_1 = __webpack_require__(4);
class RecipientConfig extends chain_1.TxChainSetter {
    constructor(chainGetter, initialChainId) {
        super(chainGetter, initialChainId);
        this._rawRecipient = "";
        this._ensEndpoint = undefined;
        this._allowHexAddressOnEthermint = undefined;
        this._bech32Prefix = undefined;
        this.ensFetcherMap = new Map();
        mobx_1.makeObservable(this);
    }
    get bech32Prefix() {
        if (!this._bech32Prefix) {
            return this.chainInfo.bech32Config.bech32PrefixAccAddr;
        }
        return this._bech32Prefix;
    }
    setBech32Prefix(prefix) {
        this._bech32Prefix = prefix;
    }
    get recipient() {
        var _a;
        const rawRecipient = this.rawRecipient.trim();
        if (ens_1.ObservableEnsFetcher.isValidENS(rawRecipient)) {
            const ensFetcher = this.getENSFetcher(rawRecipient);
            if (ensFetcher) {
                if (ensFetcher.isFetching) {
                    return "";
                }
                if (!ensFetcher.address ||
                    ensFetcher.error != null ||
                    ensFetcher.address.length !== 20) {
                    return "";
                }
                return new cosmos_1.Bech32Address(ensFetcher.address).toBech32(this.bech32Prefix);
            }
            else {
                // Can't try to fetch the ENS.
                return "";
            }
        }
        if (this._allowHexAddressOnEthermint) {
            const hasEthereumAddress = (_a = this.chainInfo.features) === null || _a === void 0 ? void 0 : _a.includes("eth-address-gen");
            if (hasEthereumAddress && rawRecipient.startsWith("0x")) {
                try {
                    if (address_1.isAddress(rawRecipient)) {
                        const buf = buffer_1.Buffer.from(rawRecipient.replace("0x", "").toLowerCase(), "hex");
                        return new cosmos_1.Bech32Address(buf).toBech32(this.bech32Prefix);
                    }
                }
                catch (_b) {
                    return "";
                }
                return "";
            }
        }
        return rawRecipient;
    }
    getENSFetcher(name) {
        if (!this._ensEndpoint || this.chainInfo.coinType == null) {
            return;
        }
        if (!this.ensFetcherMap.has(this._ensEndpoint)) {
            mobx_1.runInAction(() => {
                this.ensFetcherMap.set(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this._ensEndpoint, 
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                new ens_1.ObservableEnsFetcher(this._ensEndpoint));
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const fetcher = this.ensFetcherMap.get(this._ensEndpoint);
        fetcher.setNameAndCoinType(name, this.chainInfo.coinType);
        return fetcher;
    }
    setENSEndpoint(endpoint) {
        this._ensEndpoint = endpoint;
    }
    setAllowHexAddressOnEthermint(value) {
        this._allowHexAddressOnEthermint = value;
    }
    get error() {
        var _a;
        const rawRecipient = this.rawRecipient.trim();
        if (!rawRecipient) {
            return new errors_1.EmptyAddressError("Address is empty");
        }
        if (this._allowHexAddressOnEthermint) {
            const hasEthereumAddress = (_a = this.chainInfo.features) === null || _a === void 0 ? void 0 : _a.includes("eth-address-gen");
            if (hasEthereumAddress && rawRecipient.startsWith("0x")) {
                try {
                    if (address_1.isAddress(rawRecipient)) {
                        return;
                    }
                }
                catch (e) {
                    return e;
                }
                return new errors_1.InvalidHexError("Invalid hex address for chain");
            }
        }
        if (ens_1.ObservableEnsFetcher.isValidENS(rawRecipient)) {
            const ensFetcher = this.getENSFetcher(rawRecipient);
            if (!ensFetcher) {
                return new errors_1.ENSNotSupportedError("ENS not supported for this chain");
            }
            if (ensFetcher.isFetching) {
                return new errors_1.ENSIsFetchingError("ENS is fetching");
            }
            if (!ensFetcher.address ||
                ensFetcher.error != null ||
                ensFetcher.address.length !== 20) {
                return new errors_1.ENSFailedToFetchError("Failed to fetch the address from ENS");
            }
            return;
        }
        try {
            cosmos_1.Bech32Address.validate(this.recipient, this.bech32Prefix);
        }
        catch (e) {
            return new errors_1.InvalidBech32Error(`Invalid bech32: ${e.message || e.toString()}`);
        }
        return;
    }
    get rawRecipient() {
        return this._rawRecipient;
    }
    setRawRecipient(recipient) {
        this._rawRecipient = recipient;
    }
}
__decorate([
    mobx_1.observable
], RecipientConfig.prototype, "_rawRecipient", void 0);
__decorate([
    mobx_1.observable
], RecipientConfig.prototype, "_ensEndpoint", void 0);
__decorate([
    mobx_1.observable
], RecipientConfig.prototype, "_allowHexAddressOnEthermint", void 0);
__decorate([
    mobx_1.observable
], RecipientConfig.prototype, "_bech32Prefix", void 0);
__decorate([
    mobx_1.observable.shallow
], RecipientConfig.prototype, "ensFetcherMap", void 0);
__decorate([
    mobx_1.computed
], RecipientConfig.prototype, "bech32Prefix", null);
__decorate([
    mobx_1.action
], RecipientConfig.prototype, "setBech32Prefix", null);
__decorate([
    mobx_1.action
], RecipientConfig.prototype, "setENSEndpoint", null);
__decorate([
    mobx_1.action
], RecipientConfig.prototype, "setAllowHexAddressOnEthermint", null);
__decorate([
    mobx_1.computed
], RecipientConfig.prototype, "error", null);
__decorate([
    mobx_1.action
], RecipientConfig.prototype, "setRawRecipient", null);
exports.RecipientConfig = RecipientConfig;
const useRecipientConfig = (chainGetter, chainId, options = {}) => {
    const [config] = react_1.useState(() => new RecipientConfig(chainGetter, chainId));
    config.setChain(chainId);
    config.setENSEndpoint(options.ensEndpoint);
    config.setAllowHexAddressOnEthermint(options.allowHexAddressOnEthermint);
    return config;
};
exports.useRecipientConfig = useRecipientConfig;
//# sourceMappingURL=recipient.js.map

/***/ }),

/***/ 1401:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ObservableEnsFetcher = void 0;
const mobx_1 = __webpack_require__(5);
const buffer_1 = __webpack_require__(4);
const abi_1 = __webpack_require__(1311);
const axios_1 = __importDefault(__webpack_require__(60));
const common_1 = __webpack_require__(27);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const eth_ens_namehash_1 = __webpack_require__(1402);
const ensRegistryInterface = new abi_1.Interface([
    {
        constant: true,
        inputs: [
            {
                name: "node",
                type: "bytes32",
            },
        ],
        name: "resolver",
        outputs: [
            {
                name: "",
                type: "address",
            },
        ],
        type: "function",
    },
]);
const ensResolverInterface = new abi_1.Interface([
    // Resolver for multi coin.
    // https://eips.ethereum.org/EIPS/eip-2304
    {
        constant: true,
        inputs: [
            {
                name: "node",
                type: "bytes32",
            },
            {
                name: "coinType",
                type: "uint256",
            },
        ],
        name: "addr",
        outputs: [
            {
                name: "",
                type: "bytes",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
]);
class ObservableEnsFetcher {
    constructor(endpoint, ensRegistryContract = "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e") {
        this.endpoint = endpoint;
        this.ensRegistryContract = ensRegistryContract;
        this._isFetching = false;
        this._name = "";
        this._coinType = undefined;
        this._address = undefined;
        this._error = undefined;
        mobx_1.makeObservable(this);
    }
    static isValidENS(name) {
        const strs = name.split(".");
        if (strs.length <= 1) {
            return false;
        }
        const tld = strs[strs.length - 1];
        // TODO: What if more top level domain is added?
        return tld === "eth" || tld === "xyz" || tld === "luxe" || tld === "kred";
    }
    setNameAndCoinType(name, coinType) {
        const prevName = this._name;
        const prevCoinType = this._coinType;
        this._name = name;
        this._coinType = coinType;
        if (this._name !== prevName || this._coinType !== prevCoinType) {
            this.fetch(this._name, this._coinType);
        }
    }
    get isFetching() {
        return this._isFetching;
    }
    get name() {
        return this._name;
    }
    get coinType() {
        return this._coinType;
    }
    get address() {
        return this._address;
    }
    get error() {
        return this._error;
    }
    fetchResolverAddress(instance, node) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield instance.post("", {
                jsonrpc: "2.0",
                id: "1",
                method: "eth_call",
                params: [
                    {
                        to: this.ensRegistryContract,
                        data: ensRegistryInterface.encodeFunctionData("resolver", [node]),
                    },
                    "latest",
                ],
            });
            if (result.data.error && result.data.error.message) {
                throw new Error(result.data.error.message);
            }
            if (!result.data.result) {
                throw new Error("Unknown error");
            }
            return ensRegistryInterface.decodeFunctionResult("resolver", result.data.result)[0];
        });
    }
    fetchAddrFromResolver(instance, resolver, node, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield instance.post("", {
                jsonrpc: "2.0",
                id: "1",
                method: "eth_call",
                params: [
                    {
                        to: resolver,
                        data: ensResolverInterface.encodeFunctionData("addr", [
                            node,
                            coinType,
                        ]),
                    },
                    "latest",
                ],
            });
            if (result.data.error && result.data.error.message) {
                throw new Error(result.data.error.message);
            }
            if (!result.data.result) {
                throw new Error("Unknown error");
            }
            return ensResolverInterface.decodeFunctionResult("addr", result.data.result)[0];
        });
    }
    *fetch(name, coinType) {
        this._isFetching = true;
        try {
            const instance = axios_1.default.create(Object.assign({
                baseURL: this.endpoint,
            }));
            const node = eth_ens_namehash_1.hash(name);
            const resolver = yield* common_1.toGenerator(this.fetchResolverAddress(instance, node));
            const addr = yield* common_1.toGenerator(this.fetchAddrFromResolver(instance, resolver, node, coinType));
            this._address = buffer_1.Buffer.from(addr.replace("0x", ""), "hex");
            this._error = undefined;
        }
        catch (e) {
            this._error = e;
        }
        this._isFetching = false;
    }
}
__decorate([
    mobx_1.observable
], ObservableEnsFetcher.prototype, "_isFetching", void 0);
__decorate([
    mobx_1.observable
], ObservableEnsFetcher.prototype, "_name", void 0);
__decorate([
    mobx_1.observable
], ObservableEnsFetcher.prototype, "_coinType", void 0);
__decorate([
    mobx_1.observable.ref
], ObservableEnsFetcher.prototype, "_address", void 0);
__decorate([
    mobx_1.observable.ref
], ObservableEnsFetcher.prototype, "_error", void 0);
__decorate([
    mobx_1.action
], ObservableEnsFetcher.prototype, "setNameAndCoinType", null);
__decorate([
    mobx_1.flow
], ObservableEnsFetcher.prototype, "fetch", null);
exports.ObservableEnsFetcher = ObservableEnsFetcher;
//# sourceMappingURL=fetch.js.map

/***/ }),

/***/ 1403:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.useSendTxConfig = void 0;
const index_1 = __webpack_require__(200);
const send_gas_1 = __webpack_require__(1229);
const amount_1 = __webpack_require__(1228);
const useSendTxConfig = (chainGetter, queriesStore, accountStore, chainId, sender, options = {}) => {
    const amountConfig = amount_1.useAmountConfig(chainGetter, queriesStore, chainId, sender);
    const memoConfig = index_1.useMemoConfig(chainGetter, chainId);
    const gasConfig = send_gas_1.useSendGasConfig(chainGetter, accountStore, chainId, amountConfig);
    const feeConfig = index_1.useFeeConfig(chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig);
    // Due to the circular references between the amount config and gas/fee configs,
    // set the fee config of the amount config after initing the gas/fee configs.
    amountConfig.setFeeConfig(feeConfig);
    const recipientConfig = index_1.useRecipientConfig(chainGetter, chainId, options);
    return {
        amountConfig,
        memoConfig,
        gasConfig,
        feeConfig,
        recipientConfig,
    };
};
exports.useSendTxConfig = useSendTxConfig;
//# sourceMappingURL=send-tx.js.map

/***/ }),

/***/ 1404:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDelegateTxConfig = exports.useDelegateGasConfig = exports.useDelegateAmountConfig = exports.DelegateGasConfig = exports.DelegateAmountConfig = void 0;
const index_1 = __webpack_require__(200);
const react_1 = __webpack_require__(0);
const mobx_1 = __webpack_require__(5);
class DelegateAmountConfig extends index_1.AmountConfig {
    get sendableCurrencies() {
        return [this.chainInfo.stakeCurrency];
    }
}
exports.DelegateAmountConfig = DelegateAmountConfig;
class DelegateGasConfig extends index_1.GasConfig {
    constructor(chainGetter, accountStore, initialChainId) {
        super(chainGetter, initialChainId);
        this.accountStore = accountStore;
        mobx_1.makeObservable(this);
    }
    get gas() {
        // If gas not set manually, assume that the tx is for MsgTransfer.
        if (this._gasRaw == null) {
            return this.accountStore.getAccount(this.chainId).cosmos.msgOpts.delegate
                .gas;
        }
        return super.gas;
    }
}
__decorate([
    mobx_1.override
], DelegateGasConfig.prototype, "gas", null);
exports.DelegateGasConfig = DelegateGasConfig;
const useDelegateAmountConfig = (chainGetter, queriesStore, chainId, sender) => {
    const [txConfig] = react_1.useState(() => new DelegateAmountConfig(chainGetter, queriesStore, chainId, sender, undefined));
    txConfig.setChain(chainId);
    txConfig.setSender(sender);
    return txConfig;
};
exports.useDelegateAmountConfig = useDelegateAmountConfig;
const useDelegateGasConfig = (chainGetter, accountStore, chainId) => {
    const [gasConfig] = react_1.useState(() => new DelegateGasConfig(chainGetter, accountStore, chainId));
    gasConfig.setChain(chainId);
    return gasConfig;
};
exports.useDelegateGasConfig = useDelegateGasConfig;
const useDelegateTxConfig = (chainGetter, queriesStore, accountStore, chainId, sender) => {
    const amountConfig = exports.useDelegateAmountConfig(chainGetter, queriesStore, chainId, sender);
    const memoConfig = index_1.useMemoConfig(chainGetter, chainId);
    const gasConfig = exports.useDelegateGasConfig(chainGetter, accountStore, chainId);
    const feeConfig = index_1.useFeeConfig(chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig);
    // Due to the circular references between the amount config and gas/fee configs,
    // set the fee config of the amount config after initing the gas/fee configs.
    amountConfig.setFeeConfig(feeConfig);
    const recipientConfig = index_1.useRecipientConfig(chainGetter, chainId);
    recipientConfig.setBech32Prefix(chainGetter.getChain(chainId).bech32Config.bech32PrefixValAddr);
    return {
        amountConfig,
        memoConfig,
        gasConfig,
        feeConfig,
        recipientConfig,
    };
};
exports.useDelegateTxConfig = useDelegateTxConfig;
//# sourceMappingURL=delegate-tx.js.map

/***/ }),

/***/ 1405:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUndelegateTxConfig = exports.useUndelegateGasConfig = exports.UndelegateGasConfig = void 0;
const index_1 = __webpack_require__(200);
const staked_amount_1 = __webpack_require__(1230);
const mobx_1 = __webpack_require__(5);
const react_1 = __webpack_require__(0);
class UndelegateGasConfig extends index_1.GasConfig {
    constructor(chainGetter, accountStore, initialChainId) {
        super(chainGetter, initialChainId);
        this.accountStore = accountStore;
        mobx_1.makeObservable(this);
    }
    get gas() {
        // If gas not set manually, assume that the tx is for MsgTransfer.
        if (this._gasRaw == null) {
            return this.accountStore.getAccount(this.chainId).cosmos.msgOpts
                .undelegate.gas;
        }
        return super.gas;
    }
}
__decorate([
    mobx_1.override
], UndelegateGasConfig.prototype, "gas", null);
exports.UndelegateGasConfig = UndelegateGasConfig;
const useUndelegateGasConfig = (chainGetter, accountStore, chainId) => {
    const [gasConfig] = react_1.useState(() => new UndelegateGasConfig(chainGetter, accountStore, chainId));
    gasConfig.setChain(chainId);
    return gasConfig;
};
exports.useUndelegateGasConfig = useUndelegateGasConfig;
const useUndelegateTxConfig = (chainGetter, queriesStore, accountStore, chainId, sender, validatorAddress) => {
    const amountConfig = staked_amount_1.useStakedAmountConfig(chainGetter, queriesStore, chainId, sender, validatorAddress);
    const memoConfig = index_1.useMemoConfig(chainGetter, chainId);
    const gasConfig = exports.useUndelegateGasConfig(chainGetter, accountStore, chainId);
    const feeConfig = index_1.useFeeConfig(chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig, false);
    const recipientConfig = index_1.useRecipientConfig(chainGetter, chainId);
    recipientConfig.setBech32Prefix(chainGetter.getChain(chainId).bech32Config.bech32PrefixValAddr);
    return {
        amountConfig,
        memoConfig,
        gasConfig,
        feeConfig,
        recipientConfig,
    };
};
exports.useUndelegateTxConfig = useUndelegateTxConfig;
//# sourceMappingURL=undelegate-tx.js.map

/***/ }),

/***/ 1406:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRedelegateTxConfig = exports.useRedelegateGasConfig = exports.RedelegateGasConfig = void 0;
const index_1 = __webpack_require__(200);
const staked_amount_1 = __webpack_require__(1230);
const mobx_1 = __webpack_require__(5);
const react_1 = __webpack_require__(0);
class RedelegateGasConfig extends index_1.GasConfig {
    constructor(chainGetter, accountStore, initialChainId) {
        super(chainGetter, initialChainId);
        this.accountStore = accountStore;
        mobx_1.makeObservable(this);
    }
    get gas() {
        // If gas not set manually, assume that the tx is for MsgTransfer.
        if (this._gasRaw == null) {
            return this.accountStore.getAccount(this.chainId).cosmos.msgOpts
                .redelegate.gas;
        }
        return super.gas;
    }
}
__decorate([
    mobx_1.override
], RedelegateGasConfig.prototype, "gas", null);
exports.RedelegateGasConfig = RedelegateGasConfig;
const useRedelegateGasConfig = (chainGetter, accountStore, chainId) => {
    const [gasConfig] = react_1.useState(() => new RedelegateGasConfig(chainGetter, accountStore, chainId));
    gasConfig.setChain(chainId);
    return gasConfig;
};
exports.useRedelegateGasConfig = useRedelegateGasConfig;
const useRedelegateTxConfig = (chainGetter, queriesStore, accountStore, chainId, sender, srcValidatorAddress) => {
    const amountConfig = staked_amount_1.useStakedAmountConfig(chainGetter, queriesStore, chainId, sender, srcValidatorAddress);
    const memoConfig = index_1.useMemoConfig(chainGetter, chainId);
    const gasConfig = exports.useRedelegateGasConfig(chainGetter, accountStore, chainId);
    const feeConfig = index_1.useFeeConfig(chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig, false);
    const recipientConfig = index_1.useRecipientConfig(chainGetter, chainId);
    recipientConfig.setBech32Prefix(chainGetter.getChain(chainId).bech32Config.bech32PrefixValAddr);
    return {
        amountConfig,
        memoConfig,
        gasConfig,
        feeConfig,
        recipientConfig,
        srcValidatorAddress,
        dstValidatorAddress: recipientConfig.recipient,
    };
};
exports.useRedelegateTxConfig = useRedelegateTxConfig;
//# sourceMappingURL=redelegate-tx.js.map

/***/ }),

/***/ 1407:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGasSimulator = exports.GasSimulator = void 0;
const mobx_1 = __webpack_require__(5);
const react_1 = __webpack_require__(0);
const cosmos_1 = __webpack_require__(16);
const chain_1 = __webpack_require__(262);
const axios_1 = __importDefault(__webpack_require__(60));
class GasSimulatorState {
    constructor() {
        this._outdatedCosmosSdk = false;
        // If the initialGasEstimated is null, it means that there is no value stored or being loaded.
        this._initialGasEstimated = null;
        this._recentGasEstimated = undefined;
        this._tx = undefined;
        this._stdFee = undefined;
        mobx_1.makeObservable(this);
    }
    get outdatedCosmosSdk() {
        return this._outdatedCosmosSdk;
    }
    setOutdatedCosmosSdk(value) {
        this._outdatedCosmosSdk = value;
    }
    get initialGasEstimated() {
        return this._initialGasEstimated;
    }
    setInitialGasEstimated(value) {
        this._initialGasEstimated = value;
    }
    get recentGasEstimated() {
        return this._recentGasEstimated;
    }
    setRecentGasEstimated(value) {
        this._recentGasEstimated = value;
    }
    get tx() {
        return this._tx;
    }
    refreshTx(tx) {
        this._tx = tx;
    }
    get stdFee() {
        return this._stdFee;
    }
    refreshStdFee(fee) {
        this._stdFee = fee;
    }
    static isZeroFee(amount) {
        if (!amount) {
            return true;
        }
        for (const coin of amount) {
            if (coin.amount !== "0") {
                return false;
            }
        }
        return true;
    }
}
__decorate([
    mobx_1.observable
], GasSimulatorState.prototype, "_outdatedCosmosSdk", void 0);
__decorate([
    mobx_1.observable
], GasSimulatorState.prototype, "_initialGasEstimated", void 0);
__decorate([
    mobx_1.observable
], GasSimulatorState.prototype, "_recentGasEstimated", void 0);
__decorate([
    mobx_1.observable.ref
], GasSimulatorState.prototype, "_tx", void 0);
__decorate([
    mobx_1.observable.ref
], GasSimulatorState.prototype, "_stdFee", void 0);
__decorate([
    mobx_1.action
], GasSimulatorState.prototype, "setOutdatedCosmosSdk", null);
__decorate([
    mobx_1.action
], GasSimulatorState.prototype, "setInitialGasEstimated", null);
__decorate([
    mobx_1.action
], GasSimulatorState.prototype, "setRecentGasEstimated", null);
__decorate([
    mobx_1.action
], GasSimulatorState.prototype, "refreshTx", null);
__decorate([
    mobx_1.action
], GasSimulatorState.prototype, "refreshStdFee", null);
class GasSimulator extends chain_1.TxChainSetter {
    constructor(
    // TODO: Add comment about the reason why kvStore field is not observable.
    kvStore, chainGetter, initialChainId, gasConfig, feeConfig, initialKey, 
    // TODO: Add comment about the reason why simulateGasFn field is not observable.
    simulateGasFn) {
        super(chainGetter, initialChainId);
        this.kvStore = kvStore;
        this.gasConfig = gasConfig;
        this.feeConfig = feeConfig;
        this.initialKey = initialKey;
        this.simulateGasFn = simulateGasFn;
        this._gasAdjustmentRaw = "1.3";
        this._enabled = false;
        this._forceDisabled = false;
        this._forceDisableReason = undefined;
        this._isSimulating = false;
        // Key is the store key (probably, ${chainIdentifier}/${key})
        this._stateMap = new Map();
        this._disposers = [];
        this._chainId = initialChainId;
        this._key = initialKey;
        mobx_1.makeObservable(this);
        this.init();
    }
    setKVStore(kvStore) {
        this.kvStore = kvStore;
    }
    get key() {
        return this._key;
    }
    setKey(value) {
        this._key = value;
    }
    get isSimulating() {
        return this._isSimulating;
    }
    setSimulateGasFn(simulateGasFn) {
        this.simulateGasFn = simulateGasFn;
    }
    get enabled() {
        if (this._forceDisabled) {
            return false;
        }
        return this._enabled;
    }
    setEnabled(value) {
        if (this._forceDisabled && value) {
            console.log("Gas simulator is disabled by force. You can not enable the gas simulator");
            return;
        }
        this._enabled = value;
    }
    get forceDisabled() {
        return this._forceDisabled;
    }
    get forceDisableReason() {
        return this._forceDisableReason;
    }
    forceDisable(valueOrReason) {
        if (!valueOrReason) {
            this._forceDisabled = false;
            this._forceDisableReason = undefined;
        }
        else {
            if (this.enabled) {
                this.setEnabled(false);
            }
            this._forceDisabled = true;
            if (typeof valueOrReason !== "boolean") {
                this._forceDisableReason = valueOrReason;
            }
        }
    }
    get outdatedCosmosSdk() {
        const key = this.storeKey;
        const state = this.getState(key);
        return state.outdatedCosmosSdk;
    }
    get gasEstimated() {
        const key = this.storeKey;
        const state = this.getState(key);
        if (state.recentGasEstimated != null) {
            return state.recentGasEstimated;
        }
        if (state.initialGasEstimated != null) {
            return state.initialGasEstimated;
        }
        return undefined;
    }
    get gasAdjustment() {
        if (this._gasAdjustmentRaw === "") {
            return 0;
        }
        const num = parseFloat(this._gasAdjustmentRaw);
        if (Number.isNaN(num) || num < 0) {
            return 0;
        }
        return num;
    }
    get gasAdjustmentRaw() {
        return this._gasAdjustmentRaw;
    }
    setGasAdjustment(gasAdjustment) {
        if (typeof gasAdjustment === "number") {
            if (gasAdjustment < 0 || gasAdjustment > 2) {
                return;
            }
            this._gasAdjustmentRaw = gasAdjustment.toString();
            return;
        }
        if (gasAdjustment === "") {
            this._gasAdjustmentRaw = "";
            return;
        }
        if (gasAdjustment.startsWith(".")) {
            this._gasAdjustmentRaw = "0" + gasAdjustment;
        }
        const num = parseFloat(gasAdjustment);
        if (Number.isNaN(num) || num < 0 || num > 2) {
            return;
        }
        this._gasAdjustmentRaw = gasAdjustment;
    }
    init() {
        this._disposers.push(mobx_1.autorun(() => {
            if (!this.enabled) {
                return;
            }
            const key = this.storeKey;
            const state = this.getState(key);
            this.kvStore.get(key).then((saved) => {
                if (saved) {
                    state.setInitialGasEstimated(saved);
                }
            });
        }));
        // autorun is intentionally split.
        // The main reason for this implementation is that the gas when paying the fee is somewhat different from when there is a zero fee.
        // In order to calculate the gas more accurately, the fee should be included in the simulation,
        // but in the current reactive logic, the gas change by the simulation changes the fee and causes the simulation again.
        // Even though the implementation is not intuitive, the goals are
        // - Every time the observable used in simulateGasFn is updated, the simulation is refreshed.
        // - The simulation is refreshed only when changing from zero fee to paying fee or vice versa.
        this._disposers.push(mobx_1.autorun(() => {
            if (!this.enabled) {
                return;
            }
            try {
                const tx = this.simulateGasFn();
                const key = this.storeKey;
                const state = this.getState(key);
                state.refreshTx(tx);
            }
            catch (e) {
                console.log(e);
                return;
            }
        }));
        this._disposers.push(mobx_1.autorun(() => {
            var _a;
            if (!this.enabled) {
                return;
            }
            const fee = this.feeConfig.toStdFee();
            const key = this.storeKey;
            const state = this.getState(key);
            if (GasSimulatorState.isZeroFee((_a = state.stdFee) === null || _a === void 0 ? void 0 : _a.amount) !==
                GasSimulatorState.isZeroFee(fee.amount)) {
                state.refreshStdFee(fee);
            }
        }));
        this._disposers.push(mobx_1.autorun(() => {
            // TODO: Add debounce logic?
            const key = this.storeKey;
            const state = this.getState(key);
            if (!state.tx) {
                return;
            }
            const promise = state.tx.simulate(state.stdFee);
            mobx_1.runInAction(() => {
                this._isSimulating = true;
            });
            promise
                .then(({ gasUsed }) => {
                // Changing the gas in the gas config definitely will make the reaction to the fee config,
                // and, this reaction can potentially create a reaction in the amount config as well (Ex, when the "Max" option set).
                // These potential reactions can create repeated meaningless reactions.
                // To avoid this potential problem, change the value when there is a meaningful change in the gas estimated.
                if (!state.recentGasEstimated ||
                    Math.abs(state.recentGasEstimated - gasUsed) /
                        state.recentGasEstimated >
                        0.02) {
                    state.setRecentGasEstimated(gasUsed);
                }
                state.setOutdatedCosmosSdk(false);
                this.kvStore.set(key, gasUsed).catch((e) => {
                    console.log(e);
                });
            })
                .catch((e) => {
                var _a;
                if (axios_1.default.isAxiosError(e) && e.response) {
                    const response = e.response;
                    if (response.status === 400 && ((_a = response.data) === null || _a === void 0 ? void 0 : _a.message) &&
                        typeof response.data.message === "string" &&
                        response.data.message.includes("invalid empty tx")) {
                        state.setOutdatedCosmosSdk(true);
                    }
                }
                console.log(e);
            })
                .finally(() => {
                mobx_1.runInAction(() => {
                    this._isSimulating = false;
                });
            });
        }));
        this._disposers.push(mobx_1.autorun(() => {
            if (this.enabled && this.gasEstimated != null) {
                this.gasConfig.setGas(this.gasEstimated * this.gasAdjustment);
            }
        }));
    }
    dispose() {
        for (const disposer of this._disposers) {
            disposer();
        }
    }
    getState(key) {
        if (!this._stateMap.has(key)) {
            mobx_1.runInAction(() => {
                this._stateMap.set(key, new GasSimulatorState());
            });
        }
        return this._stateMap.get(key);
    }
    get storeKey() {
        const chainIdentifier = cosmos_1.ChainIdHelper.parse(this.chainId);
        return `${chainIdentifier.identifier}/${this.key}`;
    }
}
__decorate([
    mobx_1.observable
], GasSimulator.prototype, "_key", void 0);
__decorate([
    mobx_1.observable
], GasSimulator.prototype, "_gasAdjustmentRaw", void 0);
__decorate([
    mobx_1.observable
], GasSimulator.prototype, "_enabled", void 0);
__decorate([
    mobx_1.observable
], GasSimulator.prototype, "_forceDisabled", void 0);
__decorate([
    mobx_1.observable
], GasSimulator.prototype, "_forceDisableReason", void 0);
__decorate([
    mobx_1.observable
], GasSimulator.prototype, "_isSimulating", void 0);
__decorate([
    mobx_1.observable.shallow
], GasSimulator.prototype, "_stateMap", void 0);
__decorate([
    mobx_1.action
], GasSimulator.prototype, "setKey", null);
__decorate([
    mobx_1.action
], GasSimulator.prototype, "setEnabled", null);
__decorate([
    mobx_1.action
], GasSimulator.prototype, "forceDisable", null);
__decorate([
    mobx_1.action
], GasSimulator.prototype, "setGasAdjustment", null);
__decorate([
    mobx_1.computed
], GasSimulator.prototype, "storeKey", null);
exports.GasSimulator = GasSimulator;
// CONTRACT: Use with `observer`
const useGasSimulator = (kvStore, chainGetter, chainId, gasConfig, feeConfig, key, simulateGasFn, initialDisabled) => {
    const [gasSimulator] = react_1.useState(() => {
        const gasSimulator = new GasSimulator(kvStore, chainGetter, chainId, gasConfig, feeConfig, key, simulateGasFn);
        if (initialDisabled) {
            gasSimulator.setEnabled(false);
        }
        else {
            gasSimulator.setEnabled(true);
        }
        return gasSimulator;
    });
    gasSimulator.setKVStore(kvStore);
    gasSimulator.setChain(chainId);
    gasSimulator.setKey(key);
    gasSimulator.setSimulateGasFn(simulateGasFn);
    react_1.useEffect(() => {
        return () => {
            gasSimulator.dispose();
        };
    }, [gasSimulator]);
    return gasSimulator;
};
exports.useGasSimulator = useGasSimulator;
//# sourceMappingURL=gas-simulator.js.map

/***/ }),

/***/ 1408:
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.useRegisterConfig = exports.RegisterConfig = void 0;
const react_1 = __importStar(__webpack_require__(0));
const mobx_1 = __webpack_require__(5);
const crypto_1 = __webpack_require__(50);
class RegisterConfig {
    constructor(keyRingStore, options, rng) {
        this.rng = rng;
        // Indicate wether the account is creating or not.
        this._isLoading = false;
        this.options = [];
        this._type = "";
        this._isFinalized = false;
        this.keyRingStore = keyRingStore;
        mobx_1.makeObservable(this);
        for (const option of options) {
            this.addRegisterOption(option.type, option.intro, option.page);
        }
    }
    get mode() {
        return this.keyRingStore.multiKeyStoreInfo.length === 0 ? "create" : "add";
    }
    get isLoading() {
        return this._isLoading;
    }
    get isFinalized() {
        return this._isFinalized;
    }
    addRegisterOption(type, intro, page) {
        this.options.push({
            type,
            intro,
            page,
        });
    }
    setType(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
    get isIntro() {
        return this._type === "";
    }
    clear() {
        this.setType("");
    }
    // Create or add the mnemonic account.
    // If the mode is "add", password will be ignored.
    *createMnemonic(name, mnemonic, password, bip44HDPath, meta = {}) {
        this._isLoading = true;
        try {
            if (this.mode === "create") {
                yield this.keyRingStore.createMnemonicKey(mnemonic, password, Object.assign({ name }, meta), bip44HDPath);
            }
            else {
                yield this.keyRingStore.addMnemonicKey(mnemonic, Object.assign({ name }, meta), bip44HDPath);
            }
            this._isFinalized = true;
        }
        finally {
            this._isLoading = false;
        }
    }
    // Create or add the account based on the private key.
    // If the mode is "add", password will be ignored.
    *createPrivateKey(name, privateKey, password, meta = {}) {
        this._isLoading = true;
        try {
            if (this.mode === "create") {
                yield this.keyRingStore.createPrivateKey(privateKey, password, Object.assign({ name }, meta));
            }
            else {
                yield this.keyRingStore.addPrivateKey(privateKey, Object.assign({ name }, meta));
            }
            this._isFinalized = true;
        }
        finally {
            this._isLoading = false;
        }
    }
    *restoreKeyStore() {
        this._isLoading = true;
        try {
            yield this.keyRingStore.restoreKeyStore();
            this._isFinalized = false;
        }
        finally {
            this._isLoading = false;
        }
    }
    // Create or add the mnemonic account.
    // If the mode is "add", password will be ignored.
    *restoreMnemonic(name, mnemonic, password, bip44HDPath, meta = {}) {
        this._isLoading = true;
        try {
            yield this.keyRingStore.createMnemonicKey(mnemonic, password, Object.assign({ name }, meta), bip44HDPath);
            this._isFinalized = true;
        }
        finally {
            this._isLoading = false;
        }
    }
    generateMnemonic(strenth = 128) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield crypto_1.Mnemonic.generateSeed(this.rng, strenth);
        });
    }
    render() {
        return (react_1.default.createElement("div", { style: { padding: "0 20px" } }, this.isIntro
            ? this.options.map((option) => {
                return (react_1.default.createElement(react_1.default.Fragment, { key: option.type },
                    react_1.default.createElement(option.intro, { registerConfig: this })));
            })
            : !this.isFinalized
                ? this.options.map((option) => {
                    if (option.type === this.type) {
                        return (react_1.default.createElement(react_1.default.Fragment, { key: option.type },
                            react_1.default.createElement(option.page, { registerConfig: this })));
                    }
                })
                : null));
    }
}
__decorate([
    mobx_1.observable
], RegisterConfig.prototype, "_isLoading", void 0);
__decorate([
    mobx_1.observable.shallow
], RegisterConfig.prototype, "options", void 0);
__decorate([
    mobx_1.observable
], RegisterConfig.prototype, "_type", void 0);
__decorate([
    mobx_1.observable
], RegisterConfig.prototype, "_isFinalized", void 0);
__decorate([
    mobx_1.computed
], RegisterConfig.prototype, "mode", null);
__decorate([
    mobx_1.action
], RegisterConfig.prototype, "addRegisterOption", null);
__decorate([
    mobx_1.action
], RegisterConfig.prototype, "setType", null);
__decorate([
    mobx_1.action
], RegisterConfig.prototype, "clear", null);
__decorate([
    mobx_1.flow
], RegisterConfig.prototype, "createMnemonic", null);
__decorate([
    mobx_1.flow
], RegisterConfig.prototype, "createPrivateKey", null);
__decorate([
    mobx_1.flow
], RegisterConfig.prototype, "restoreKeyStore", null);
__decorate([
    mobx_1.flow
], RegisterConfig.prototype, "restoreMnemonic", null);
exports.RegisterConfig = RegisterConfig;
// CONTRACT: Use with `observer`.
const useRegisterConfig = (keyRingStore, initialOptions, rng = (array) => {
    return Promise.resolve(crypto.getRandomValues(array));
}) => {
    const [txConfig] = react_1.useState(() => new RegisterConfig(keyRingStore, initialOptions, rng));
    return txConfig;
};
exports.useRegisterConfig = useRegisterConfig;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1409:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.useAddressBookConfig = exports.AddressBookConfigMap = exports.AddressBookConfig = void 0;
const mobx_1 = __webpack_require__(5);
const common_1 = __webpack_require__(27);
const stores_1 = __webpack_require__(43);
const react_1 = __webpack_require__(0);
class AddressBookConfig {
    constructor(kvStore, chainGetter, chainId) {
        this.kvStore = kvStore;
        this.chainGetter = chainGetter;
        this.chainId = chainId;
        this._addressBookDatas = [];
        this._isLoaded = false;
        mobx_1.makeObservable(this);
        this.loadAddressBookDatas();
    }
    get isLoaded() {
        return this._isLoaded;
    }
    get addressBookDatas() {
        return this._addressBookDatas;
    }
    setSelectHandler(handler) {
        this._selectHandler = handler;
    }
    selectAddressAt(index) {
        const data = this.addressBookDatas[index];
        if (this._selectHandler) {
            this._selectHandler.setRecipient(data.address);
            this._selectHandler.setMemo(data.memo);
        }
    }
    *addAddressBook(data) {
        yield this.loadAddressBookDatas();
        this._addressBookDatas.push(data);
        yield this.saveAddressBookDatas();
    }
    *removeAddressBook(index) {
        yield this.loadAddressBookDatas();
        this._addressBookDatas.splice(index, 1);
        yield this.saveAddressBookDatas();
    }
    *editAddressBookAt(index, data) {
        yield this.loadAddressBookDatas();
        this._addressBookDatas[index] = data;
        yield this.saveAddressBookDatas();
    }
    saveAddressBookDatas() {
        return __awaiter(this, void 0, void 0, function* () {
            const chainInfo = this.chainGetter.getChain(this.chainId);
            yield this.kvStore.set(AddressBookConfig.keyForChainInfo(chainInfo), mobx_1.toJS(this._addressBookDatas));
        });
    }
    *loadAddressBookDatas() {
        const chainInfo = this.chainGetter.getChain(this.chainId);
        const datas = yield* common_1.toGenerator(this.kvStore.get(AddressBookConfig.keyForChainInfo(chainInfo)));
        if (!datas) {
            this._addressBookDatas = [];
        }
        else {
            this._addressBookDatas = datas;
        }
        this._isLoaded = true;
    }
    waitLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isLoaded) {
                return;
            }
            return new Promise((resolve) => {
                const disposer = mobx_1.autorun(() => {
                    if (this._isLoaded) {
                        resolve();
                        if (disposer) {
                            disposer();
                        }
                    }
                });
            });
        });
    }
    static keyForChainInfo(chainInfo) {
        return `${chainInfo.chainName}`;
    }
}
__decorate([
    mobx_1.observable
], AddressBookConfig.prototype, "_addressBookDatas", void 0);
__decorate([
    mobx_1.observable
], AddressBookConfig.prototype, "_isLoaded", void 0);
__decorate([
    mobx_1.flow
], AddressBookConfig.prototype, "addAddressBook", null);
__decorate([
    mobx_1.flow
], AddressBookConfig.prototype, "removeAddressBook", null);
__decorate([
    mobx_1.flow
], AddressBookConfig.prototype, "editAddressBookAt", null);
__decorate([
    mobx_1.flow
], AddressBookConfig.prototype, "loadAddressBookDatas", null);
exports.AddressBookConfig = AddressBookConfig;
class AddressBookConfigMap extends stores_1.HasMapStore {
    constructor(kvStore, chainGetter) {
        super((chainId) => {
            return new AddressBookConfig(kvStore, chainGetter, chainId);
        });
        this.kvStore = kvStore;
        this.chainGetter = chainGetter;
    }
    getAddressBookConfig(chainId) {
        return this.get(chainId);
    }
}
exports.AddressBookConfigMap = AddressBookConfigMap;
const useAddressBookConfig = (kvStore, chainGetter, chainId, handler) => {
    const [configMap] = react_1.useState(() => new AddressBookConfigMap(kvStore, chainGetter));
    const config = configMap.getAddressBookConfig(chainId);
    config.setSelectHandler(handler);
    return config;
};
exports.useAddressBookConfig = useAddressBookConfig;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1413:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivKey = exports.PubKey = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "cosmos.crypto.secp256k1";
function createBasePubKey() {
    return { key: new Uint8Array() };
}
exports.PubKey = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePubKey();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBasePubKey();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : new Uint8Array();
        return message;
    },
};
function createBasePrivKey() {
    return { key: new Uint8Array() };
}
exports.PrivKey = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePrivKey();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBasePrivKey();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=keys.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 1414:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionOptionsWeb3Tx = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "ethermint.types.v1";
function createBaseExtensionOptionsWeb3Tx() {
    return { typedDataChainId: "0", feePayer: "", feePayerSig: new Uint8Array() };
}
exports.ExtensionOptionsWeb3Tx = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.typedDataChainId !== "0") {
            writer.uint32(8).uint64(message.typedDataChainId);
        }
        if (message.feePayer !== "") {
            writer.uint32(18).string(message.feePayer);
        }
        if (message.feePayerSig.length !== 0) {
            writer.uint32(26).bytes(message.feePayerSig);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExtensionOptionsWeb3Tx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.typedDataChainId = longToString(reader.uint64());
                    break;
                case 2:
                    message.feePayer = reader.string();
                    break;
                case 3:
                    message.feePayerSig = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            typedDataChainId: isSet(object.typedDataChainId)
                ? String(object.typedDataChainId)
                : "0",
            feePayer: isSet(object.feePayer) ? String(object.feePayer) : "",
            feePayerSig: isSet(object.feePayerSig)
                ? bytesFromBase64(object.feePayerSig)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.typedDataChainId !== undefined &&
            (obj.typedDataChainId = message.typedDataChainId);
        message.feePayer !== undefined && (obj.feePayer = message.feePayer);
        message.feePayerSig !== undefined &&
            (obj.feePayerSig = base64FromBytes(message.feePayerSig !== undefined
                ? message.feePayerSig
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseExtensionOptionsWeb3Tx();
        message.typedDataChainId = (_a = object.typedDataChainId) !== null && _a !== void 0 ? _a : "0";
        message.feePayer = (_b = object.feePayer) !== null && _b !== void 0 ? _b : "";
        message.feePayerSig = (_c = object.feePayerSig) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=web3.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 1417:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgExecuteContract = exports.MsgInstantiateContract = exports.MsgStoreCode = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "secret.compute.v1beta1";
function createBaseMsgStoreCode() {
    return {
        sender: new Uint8Array(),
        wasmByteCode: new Uint8Array(),
        source: "",
        builder: "",
    };
}
exports.MsgStoreCode = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender.length !== 0) {
            writer.uint32(10).bytes(message.sender);
        }
        if (message.wasmByteCode.length !== 0) {
            writer.uint32(18).bytes(message.wasmByteCode);
        }
        if (message.source !== "") {
            writer.uint32(26).string(message.source);
        }
        if (message.builder !== "") {
            writer.uint32(34).string(message.builder);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreCode();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.bytes();
                    break;
                case 2:
                    message.wasmByteCode = reader.bytes();
                    break;
                case 3:
                    message.source = reader.string();
                    break;
                case 4:
                    message.builder = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender)
                ? bytesFromBase64(object.sender)
                : new Uint8Array(),
            wasmByteCode: isSet(object.wasmByteCode)
                ? bytesFromBase64(object.wasmByteCode)
                : new Uint8Array(),
            source: isSet(object.source) ? String(object.source) : "",
            builder: isSet(object.builder) ? String(object.builder) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined &&
            (obj.sender = base64FromBytes(message.sender !== undefined ? message.sender : new Uint8Array()));
        message.wasmByteCode !== undefined &&
            (obj.wasmByteCode = base64FromBytes(message.wasmByteCode !== undefined
                ? message.wasmByteCode
                : new Uint8Array()));
        message.source !== undefined && (obj.source = message.source);
        message.builder !== undefined && (obj.builder = message.builder);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseMsgStoreCode();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.wasmByteCode = (_b = object.wasmByteCode) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.source = (_c = object.source) !== null && _c !== void 0 ? _c : "";
        message.builder = (_d = object.builder) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseMsgInstantiateContract() {
    return {
        sender: new Uint8Array(),
        callbackCodeHash: "",
        codeId: "0",
        label: "",
        initMsg: new Uint8Array(),
        initFunds: [],
        callbackSig: new Uint8Array(),
    };
}
exports.MsgInstantiateContract = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender.length !== 0) {
            writer.uint32(10).bytes(message.sender);
        }
        if (message.callbackCodeHash !== "") {
            writer.uint32(18).string(message.callbackCodeHash);
        }
        if (message.codeId !== "0") {
            writer.uint32(24).uint64(message.codeId);
        }
        if (message.label !== "") {
            writer.uint32(34).string(message.label);
        }
        if (message.initMsg.length !== 0) {
            writer.uint32(42).bytes(message.initMsg);
        }
        for (const v of message.initFunds) {
            coin_1.Coin.encode(v, writer.uint32(50).fork()).ldelim();
        }
        if (message.callbackSig.length !== 0) {
            writer.uint32(58).bytes(message.callbackSig);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.bytes();
                    break;
                case 2:
                    message.callbackCodeHash = reader.string();
                    break;
                case 3:
                    message.codeId = longToString(reader.uint64());
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 5:
                    message.initMsg = reader.bytes();
                    break;
                case 6:
                    message.initFunds.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.callbackSig = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender)
                ? bytesFromBase64(object.sender)
                : new Uint8Array(),
            callbackCodeHash: isSet(object.callbackCodeHash)
                ? String(object.callbackCodeHash)
                : "",
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            label: isSet(object.label) ? String(object.label) : "",
            initMsg: isSet(object.initMsg)
                ? bytesFromBase64(object.initMsg)
                : new Uint8Array(),
            initFunds: Array.isArray(object === null || object === void 0 ? void 0 : object.initFunds)
                ? object.initFunds.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            callbackSig: isSet(object.callbackSig)
                ? bytesFromBase64(object.callbackSig)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined &&
            (obj.sender = base64FromBytes(message.sender !== undefined ? message.sender : new Uint8Array()));
        message.callbackCodeHash !== undefined &&
            (obj.callbackCodeHash = message.callbackCodeHash);
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.label !== undefined && (obj.label = message.label);
        message.initMsg !== undefined &&
            (obj.initMsg = base64FromBytes(message.initMsg !== undefined ? message.initMsg : new Uint8Array()));
        if (message.initFunds) {
            obj.initFunds = message.initFunds.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.initFunds = [];
        }
        message.callbackSig !== undefined &&
            (obj.callbackSig = base64FromBytes(message.callbackSig !== undefined
                ? message.callbackSig
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseMsgInstantiateContract();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.callbackCodeHash = (_b = object.callbackCodeHash) !== null && _b !== void 0 ? _b : "";
        message.codeId = (_c = object.codeId) !== null && _c !== void 0 ? _c : "0";
        message.label = (_d = object.label) !== null && _d !== void 0 ? _d : "";
        message.initMsg = (_e = object.initMsg) !== null && _e !== void 0 ? _e : new Uint8Array();
        message.initFunds = ((_f = object.initFunds) === null || _f === void 0 ? void 0 : _f.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.callbackSig = (_g = object.callbackSig) !== null && _g !== void 0 ? _g : new Uint8Array();
        return message;
    },
};
function createBaseMsgExecuteContract() {
    return {
        sender: new Uint8Array(),
        contract: new Uint8Array(),
        msg: new Uint8Array(),
        callbackCodeHash: "",
        sentFunds: [],
        callbackSig: new Uint8Array(),
    };
}
exports.MsgExecuteContract = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender.length !== 0) {
            writer.uint32(10).bytes(message.sender);
        }
        if (message.contract.length !== 0) {
            writer.uint32(18).bytes(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(26).bytes(message.msg);
        }
        if (message.callbackCodeHash !== "") {
            writer.uint32(34).string(message.callbackCodeHash);
        }
        for (const v of message.sentFunds) {
            coin_1.Coin.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.callbackSig.length !== 0) {
            writer.uint32(50).bytes(message.callbackSig);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExecuteContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.bytes();
                    break;
                case 2:
                    message.contract = reader.bytes();
                    break;
                case 3:
                    message.msg = reader.bytes();
                    break;
                case 4:
                    message.callbackCodeHash = reader.string();
                    break;
                case 5:
                    message.sentFunds.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.callbackSig = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender)
                ? bytesFromBase64(object.sender)
                : new Uint8Array(),
            contract: isSet(object.contract)
                ? bytesFromBase64(object.contract)
                : new Uint8Array(),
            msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(),
            callbackCodeHash: isSet(object.callbackCodeHash)
                ? String(object.callbackCodeHash)
                : "",
            sentFunds: Array.isArray(object === null || object === void 0 ? void 0 : object.sentFunds)
                ? object.sentFunds.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            callbackSig: isSet(object.callbackSig)
                ? bytesFromBase64(object.callbackSig)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined &&
            (obj.sender = base64FromBytes(message.sender !== undefined ? message.sender : new Uint8Array()));
        message.contract !== undefined &&
            (obj.contract = base64FromBytes(message.contract !== undefined ? message.contract : new Uint8Array()));
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        message.callbackCodeHash !== undefined &&
            (obj.callbackCodeHash = message.callbackCodeHash);
        if (message.sentFunds) {
            obj.sentFunds = message.sentFunds.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.sentFunds = [];
        }
        message.callbackSig !== undefined &&
            (obj.callbackSig = base64FromBytes(message.callbackSig !== undefined
                ? message.callbackSig
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseMsgExecuteContract();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.contract = (_b = object.contract) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.msg = (_c = object.msg) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.callbackCodeHash = (_d = object.callbackCodeHash) !== null && _d !== void 0 ? _d : "";
        message.sentFunds = ((_e = object.sentFunds) === null || _e === void 0 ? void 0 : _e.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.callbackSig = (_f = object.callbackSig) !== null && _f !== void 0 ? _f : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=msg.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "google.protobuf";
function createBaseTimestamp() {
    return { seconds: "0", nanos: 0 };
}
exports.Timestamp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.seconds !== "0") {
            writer.uint32(8).int64(message.seconds);
        }
        if (message.nanos !== 0) {
            writer.uint32(16).int32(message.nanos);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTimestamp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.seconds = longToString(reader.int64());
                    break;
                case 2:
                    message.nanos = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            seconds: isSet(object.seconds) ? String(object.seconds) : "0",
            nanos: isSet(object.nanos) ? Number(object.nanos) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.seconds !== undefined && (obj.seconds = message.seconds);
        message.nanos !== undefined && (obj.nanos = Math.round(message.nanos));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseTimestamp();
        message.seconds = (_a = object.seconds) !== null && _a !== void 0 ? _a : "0";
        message.nanos = (_b = object.nanos) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=timestamp.js.map

/***/ }),

/***/ 1495:
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
__exportStar(__webpack_require__(1496), exports);
__exportStar(__webpack_require__(1497), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1496:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignDocAmountConfig = exports.SignDocAmountConfig = void 0;
const tx_1 = __webpack_require__(200);
const mobx_1 = __webpack_require__(5);
const unit_1 = __webpack_require__(26);
const react_1 = __webpack_require__(0);
const mobx_utils_1 = __webpack_require__(201);
const cosmos_1 = __webpack_require__(16);
// This config helps the fee config to calculate that the fee is enough to send with considering
// the amount in the sign doc.
// This sets the amount as the sum of the messages in the sign doc if the message is known and can be parsed.
class SignDocAmountConfig extends tx_1.TxChainSetter {
    constructor(chainGetter, accountStore, initialChainId, sender) {
        super(chainGetter, initialChainId);
        this.accountStore = accountStore;
        this.signDocHelper = undefined;
        this._disableBalanceCheck = false;
        this.getAmountPrimitive = mobx_utils_1.computedFn(() => {
            var _a;
            if (this.disableBalanceCheck ||
                !((_a = this.signDocHelper) === null || _a === void 0 ? void 0 : _a.signDocWrapper) ||
                this.chainInfo.feeCurrencies.length === 0) {
                return {
                    amount: "0",
                    denom: this.sendCurrency.coinMinimalDenom,
                };
            }
            if (this.signDocHelper.signDocWrapper.mode === "amino") {
                return this.computeAmountInAminoMsgs(this.signDocHelper.signDocWrapper.aminoSignDoc.msgs);
            }
            else {
                return this.computeAmountInProtoMsgs(this.signDocHelper.signDocWrapper.protoSignDoc.txMsgs);
            }
        });
        this._sender = sender;
        mobx_1.makeObservable(this);
    }
    setSignDocHelper(signDocHelper) {
        this.signDocHelper = signDocHelper;
    }
    get amount() {
        const primitive = this.getAmountPrimitive();
        return new unit_1.CoinPretty(this.sendCurrency, new unit_1.Int(primitive.amount)).toString();
    }
    get sendCurrency() {
        const chainInfo = this.chainInfo;
        if (chainInfo.feeCurrencies.length > 0) {
            return chainInfo.feeCurrencies[0];
        }
        return chainInfo.currencies[0];
    }
    get sendableCurrencies() {
        return [this.sendCurrency];
    }
    setSender(sender) {
        this._sender = sender;
    }
    get sender() {
        return this._sender;
    }
    computeAmountInAminoMsgs(msgs) {
        const amount = new unit_1.Coin(this.sendCurrency.coinMinimalDenom, new unit_1.Int(0));
        const account = this.accountStore.getAccount(this.chainId);
        for (const msg of msgs) {
            try {
                switch (msg.type) {
                    case account.cosmos.msgOpts.send.native.type:
                        if (msg.value.from_address &&
                            msg.value.from_address !== this.sender) {
                            return {
                                amount: "0",
                                denom: this.sendCurrency.coinMinimalDenom,
                            };
                        }
                        if (msg.value.amount && Array.isArray(msg.value.amount)) {
                            for (const amountInMsg of msg.value.amount) {
                                if (amountInMsg.denom === amount.denom) {
                                    amount.amount = amount.amount.add(new unit_1.Int(amountInMsg.amount));
                                }
                            }
                        }
                        break;
                    case account.cosmos.msgOpts.delegate.type:
                        if (msg.value.delegator_address &&
                            msg.value.delegator_address !== this.sender) {
                            return {
                                amount: "0",
                                denom: this.sendCurrency.coinMinimalDenom,
                            };
                        }
                        if (msg.value.amount && msg.value.amount.denom === amount.denom) {
                            amount.amount = amount.amount.add(new unit_1.Int(msg.value.amount.amount));
                        }
                        break;
                }
            }
            catch (e) {
                console.log(`Error on the parsing the msg: ${e.message || e.toString()}`);
            }
        }
        return {
            amount: amount.amount.toString(),
            denom: amount.denom,
        };
    }
    computeAmountInProtoMsgs(msgs) {
        var _a;
        const amount = new unit_1.Coin(this.sendCurrency.coinMinimalDenom, new unit_1.Int(0));
        for (const msg of msgs) {
            try {
                if (!(msg instanceof cosmos_1.UnknownMessage) && "unpacked" in msg) {
                    switch (msg.typeUrl) {
                        case "/cosmos.bank.v1beta1.MsgSend": {
                            const sendMsg = msg.unpacked;
                            if (sendMsg.fromAddress && sendMsg.fromAddress !== this.sender) {
                                return {
                                    amount: "0",
                                    denom: this.sendCurrency.coinMinimalDenom,
                                };
                            }
                            for (const amountInMsg of sendMsg.amount) {
                                if (amountInMsg.denom === amount.denom && amountInMsg.amount) {
                                    amount.amount = amount.amount.add(new unit_1.Int(amountInMsg.amount));
                                }
                            }
                            break;
                        }
                        case "/cosmos.staking.v1beta1.MsgDelegate": {
                            const delegateMsg = msg.unpacked;
                            if (delegateMsg.delegatorAddress &&
                                delegateMsg.delegatorAddress !== this.sender) {
                                return {
                                    amount: "0",
                                    denom: this.sendCurrency.coinMinimalDenom,
                                };
                            }
                            if (((_a = delegateMsg.amount) === null || _a === void 0 ? void 0 : _a.denom) === amount.denom &&
                                delegateMsg.amount.amount) {
                                amount.amount = amount.amount.add(new unit_1.Int(delegateMsg.amount.amount));
                            }
                            break;
                        }
                    }
                }
            }
            catch (e) {
                console.log(`Error on the parsing the msg: ${e.message || e.toString()}`);
            }
        }
        return {
            amount: amount.amount.toString(),
            denom: amount.denom,
        };
    }
    get error() {
        return undefined;
    }
    setIsMax(_) {
        // noop
    }
    toggleIsMax() {
        // noop
    }
    get isMax() {
        // noop
        return false;
    }
    get fraction() {
        // noop
        return undefined;
    }
    setFraction(_) {
        // noop
    }
    setAmount() {
        // noop
    }
    setSendCurrency() {
        // noop
    }
    setDisableBalanceCheck(bool) {
        this._disableBalanceCheck = bool;
    }
    get disableBalanceCheck() {
        return this._disableBalanceCheck;
    }
}
__decorate([
    mobx_1.observable.ref
], SignDocAmountConfig.prototype, "signDocHelper", void 0);
__decorate([
    mobx_1.observable
], SignDocAmountConfig.prototype, "_sender", void 0);
__decorate([
    mobx_1.observable
], SignDocAmountConfig.prototype, "_disableBalanceCheck", void 0);
__decorate([
    mobx_1.action
], SignDocAmountConfig.prototype, "setSignDocHelper", null);
__decorate([
    mobx_1.computed
], SignDocAmountConfig.prototype, "amount", null);
__decorate([
    mobx_1.action
], SignDocAmountConfig.prototype, "setSender", null);
__decorate([
    mobx_1.action
], SignDocAmountConfig.prototype, "setDisableBalanceCheck", null);
exports.SignDocAmountConfig = SignDocAmountConfig;
const useSignDocAmountConfig = (chainGetter, accountStore, chainId, sender) => {
    const [config] = react_1.useState(() => new SignDocAmountConfig(chainGetter, accountStore, chainId, sender));
    config.setChain(chainId);
    config.setSender(sender);
    return config;
};
exports.useSignDocAmountConfig = useSignDocAmountConfig;
//# sourceMappingURL=amount.js.map

/***/ }),

/***/ 1497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignDocHelper = exports.SignDocHelper = void 0;
const mobx_1 = __webpack_require__(5);
const react_1 = __webpack_require__(0);
const cosmos_1 = __webpack_require__(16);
const tx_1 = __webpack_require__(100);
const common_1 = __webpack_require__(27);
class SignDocHelper {
    constructor(feeConfig, memoConfig) {
        this.feeConfig = feeConfig;
        this.memoConfig = memoConfig;
        this._signDocWrapper = undefined;
        mobx_1.makeObservable(this);
    }
    get signDocWrapper() {
        var _a, _b;
        if (!this._signDocWrapper) {
            return undefined;
        }
        // If the sign doc is for ADR-36,
        // The fee and memo should be empty.
        // Ignore the fee and memo config, and just return itself.
        if (this._signDocWrapper.isADR36SignDoc) {
            return this._signDocWrapper;
        }
        const stdFee = this.feeConfig.toStdFee();
        if (this._signDocWrapper.mode === "amino") {
            const aminoSignDoc = this._signDocWrapper.aminoSignDoc;
            const signDoc = Object.assign(Object.assign({}, aminoSignDoc), { 
                // XXX: Set fee payer/granter if the requested sign doc has fee payer/granter.
                //      Currently, there is no support for fee delegation within keplr,
                //      but this handling is essential for external services that set fee payer/granter.
                fee: (() => {
                    const fee = Object.assign({}, stdFee);
                    if (aminoSignDoc.fee.feePayer) {
                        // XXX: This part is not standard. This is only used for ethermint EIP-712 signing.
                        fee.feePayer = aminoSignDoc.fee.feePayer;
                    }
                    if (aminoSignDoc.fee.granter) {
                        fee.granter = aminoSignDoc.fee.granter;
                    }
                    if (aminoSignDoc.fee.payer) {
                        fee.payer = aminoSignDoc.fee.payer;
                    }
                    return fee;
                })(), memo: common_1.escapeHTML(this.memoConfig.memo) });
            return cosmos_1.SignDocWrapper.fromAminoSignDoc(signDoc);
        }
        const protoSignDoc = this._signDocWrapper.protoSignDoc;
        const fee = tx_1.Fee.fromPartial({
            gasLimit: stdFee.gas,
            amount: stdFee.amount.map((fee) => {
                return {
                    amount: fee.amount,
                    denom: fee.denom,
                };
            }),
            granter: (_a = protoSignDoc.authInfo.fee) === null || _a === void 0 ? void 0 : _a.granter,
            payer: (_b = protoSignDoc.authInfo.fee) === null || _b === void 0 ? void 0 : _b.payer,
        });
        const newSignDoc = Object.assign(Object.assign({}, protoSignDoc.signDoc), {
            bodyBytes: tx_1.TxBody.encode(Object.assign(Object.assign({}, protoSignDoc.txBody), {
                memo: this.memoConfig.memo,
            })).finish(),
            authInfoBytes: tx_1.AuthInfo.encode(Object.assign(Object.assign({}, protoSignDoc.authInfo), {
                fee,
            })).finish(),
        });
        return cosmos_1.SignDocWrapper.fromDirectSignDoc(newSignDoc);
    }
    get signDocJson() {
        if (!this.signDocWrapper) {
            return undefined;
        }
        if (this.signDocWrapper.mode === "amino") {
            return this.signDocWrapper.aminoSignDoc;
        }
        else {
            return this.signDocWrapper.protoSignDoc.toJSON();
        }
    }
    setSignDocWrapper(signDoc) {
        this._signDocWrapper = signDoc;
    }
}
__decorate([
    mobx_1.observable.ref
], SignDocHelper.prototype, "_signDocWrapper", void 0);
__decorate([
    mobx_1.computed
], SignDocHelper.prototype, "signDocWrapper", null);
__decorate([
    mobx_1.computed
], SignDocHelper.prototype, "signDocJson", null);
__decorate([
    mobx_1.action
], SignDocHelper.prototype, "setSignDocWrapper", null);
exports.SignDocHelper = SignDocHelper;
const useSignDocHelper = (feeConfig, memoConfig) => {
    const [helper] = react_1.useState(() => new SignDocHelper(feeConfig, memoConfig));
    return helper;
};
exports.useSignDocHelper = useSignDocHelper;
//# sourceMappingURL=helper.js.map

/***/ }),

/***/ 1498:
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
__exportStar(__webpack_require__(1251), exports);
__exportStar(__webpack_require__(1252), exports);
__exportStar(__webpack_require__(1253), exports);
__exportStar(__webpack_require__(1254), exports);
__exportStar(__webpack_require__(1499), exports);
__exportStar(__webpack_require__(1501), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1499:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.useIBCTransferConfig = void 0;
const tx_1 = __webpack_require__(200);
const amount_1 = __webpack_require__(1251);
const gas_1 = __webpack_require__(1254);
const channel_1 = __webpack_require__(1252);
const reciepient_1 = __webpack_require__(1500);
/**
 * useIBCTransferConfig returns the configs for IBC transfer.
 * The recipient config's chain id should be the destination chain id for IBC.
 * But, actually, the recipient config's chain id would be set as the sending chain id if the channel not set.
 * So, you should remember that the recipient config's chain id is equalt to the sending chain id, if channel not set.
 * @param chainGetter
 * @param queriesStore
 * @param accountStore
 * @param chainId
 * @param sender
 * @param options
 */
const useIBCTransferConfig = (chainGetter, queriesStore, accountStore, chainId, sender, options = {}) => {
    const amountConfig = amount_1.useIBCAmountConfig(chainGetter, queriesStore, chainId, sender);
    const memoConfig = tx_1.useMemoConfig(chainGetter, chainId);
    const gasConfig = gas_1.useIBCTransferGasConfig(chainGetter, accountStore, chainId);
    const feeConfig = tx_1.useFeeConfig(chainGetter, queriesStore, chainId, sender, amountConfig, gasConfig);
    // Due to the circular references between the amount config and gas/fee configs,
    // set the fee config of the amount config after initing the gas/fee configs.
    amountConfig.setFeeConfig(feeConfig);
    const channelConfig = channel_1.useIBCChannelConfig();
    const recipientConfig = reciepient_1.useIBCRecipientConfig(chainGetter, chainId, channelConfig, options);
    return {
        amountConfig,
        memoConfig,
        gasConfig,
        feeConfig,
        recipientConfig,
        channelConfig,
    };
};
exports.useIBCTransferConfig = useIBCTransferConfig;
//# sourceMappingURL=send-ibc-transfer.js.map

/***/ }),

/***/ 1500:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.useIBCRecipientConfig = exports.IBCRecipientConfig = void 0;
const tx_1 = __webpack_require__(200);
const react_1 = __webpack_require__(0);
/**
 * IBCRecipientConfig returns the recipient config for IBC transfer.
 * The recipient config's chain id should be the destination chain id for IBC.
 * But, actually, the recipient config's chain id would be set as the sending chain id if the channel not set.
 * So, you should remember that the recipient config's chain id is equalt to the sending chain id, if channel not set.
 */
class IBCRecipientConfig extends tx_1.RecipientConfig {
    constructor(chainGetter, initialChainId, channelConfig) {
        super(chainGetter, initialChainId);
        this.channelConfig = channelConfig;
    }
    get chainId() {
        return this.channelConfig.channel
            ? this.channelConfig.channel.counterpartyChainId
            : super.chainId;
    }
}
exports.IBCRecipientConfig = IBCRecipientConfig;
const useIBCRecipientConfig = (chainGetter, chainId, channelConfig, options = {}) => {
    const [config] = react_1.useState(() => new IBCRecipientConfig(chainGetter, chainId, channelConfig));
    config.setChain(chainId);
    config.setENSEndpoint(options.ensEndpoint);
    config.setAllowHexAddressOnEthermint(options.allowHexAddressOnEthermint);
    return config;
};
exports.useIBCRecipientConfig = useIBCRecipientConfig;
//# sourceMappingURL=reciepient.js.map

/***/ }),

/***/ 1501:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

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

/***/ 200:
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
__exportStar(__webpack_require__(280), exports);
__exportStar(__webpack_require__(1226), exports);
__exportStar(__webpack_require__(1398), exports);
__exportStar(__webpack_require__(1399), exports);
__exportStar(__webpack_require__(1227), exports);
__exportStar(__webpack_require__(1400), exports);
__exportStar(__webpack_require__(1228), exports);
__exportStar(__webpack_require__(1229), exports);
__exportStar(__webpack_require__(1403), exports);
__exportStar(__webpack_require__(262), exports);
__exportStar(__webpack_require__(1404), exports);
__exportStar(__webpack_require__(1405), exports);
__exportStar(__webpack_require__(1406), exports);
__exportStar(__webpack_require__(1407), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 262:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxChainSetter = void 0;
const mobx_1 = __webpack_require__(5);
class TxChainSetter {
    constructor(chainGetter, initialChainId) {
        this.chainGetter = chainGetter;
        this._chainId = initialChainId;
        mobx_1.makeObservable(this);
    }
    get chainInfo() {
        return this.chainGetter.getChain(this.chainId);
    }
    get chainId() {
        return this._chainId;
    }
    setChain(chainId) {
        this._chainId = chainId;
    }
}
__decorate([
    mobx_1.observable
], TxChainSetter.prototype, "_chainId", void 0);
__decorate([
    mobx_1.computed
], TxChainSetter.prototype, "chainInfo", null);
__decorate([
    mobx_1.action
], TxChainSetter.prototype, "setChain", null);
exports.TxChainSetter = TxChainSetter;
//# sourceMappingURL=chain.js.map

/***/ }),

/***/ 274:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeAuthorization_Validators = exports.StakeAuthorization = exports.authorizationTypeToJSON = exports.authorizationTypeFromJSON = exports.AuthorizationType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.staking.v1beta1";
/** AuthorizationType defines the type of staking module authorization type */
var AuthorizationType;
(function (AuthorizationType) {
    /** AUTHORIZATION_TYPE_UNSPECIFIED - AUTHORIZATION_TYPE_UNSPECIFIED specifies an unknown authorization type */
    AuthorizationType[AuthorizationType["AUTHORIZATION_TYPE_UNSPECIFIED"] = 0] = "AUTHORIZATION_TYPE_UNSPECIFIED";
    /** AUTHORIZATION_TYPE_DELEGATE - AUTHORIZATION_TYPE_DELEGATE defines an authorization type for Msg/Delegate */
    AuthorizationType[AuthorizationType["AUTHORIZATION_TYPE_DELEGATE"] = 1] = "AUTHORIZATION_TYPE_DELEGATE";
    /** AUTHORIZATION_TYPE_UNDELEGATE - AUTHORIZATION_TYPE_UNDELEGATE defines an authorization type for Msg/Undelegate */
    AuthorizationType[AuthorizationType["AUTHORIZATION_TYPE_UNDELEGATE"] = 2] = "AUTHORIZATION_TYPE_UNDELEGATE";
    /** AUTHORIZATION_TYPE_REDELEGATE - AUTHORIZATION_TYPE_REDELEGATE defines an authorization type for Msg/BeginRedelegate */
    AuthorizationType[AuthorizationType["AUTHORIZATION_TYPE_REDELEGATE"] = 3] = "AUTHORIZATION_TYPE_REDELEGATE";
    AuthorizationType[AuthorizationType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(AuthorizationType = exports.AuthorizationType || (exports.AuthorizationType = {}));
function authorizationTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "AUTHORIZATION_TYPE_UNSPECIFIED":
            return AuthorizationType.AUTHORIZATION_TYPE_UNSPECIFIED;
        case 1:
        case "AUTHORIZATION_TYPE_DELEGATE":
            return AuthorizationType.AUTHORIZATION_TYPE_DELEGATE;
        case 2:
        case "AUTHORIZATION_TYPE_UNDELEGATE":
            return AuthorizationType.AUTHORIZATION_TYPE_UNDELEGATE;
        case 3:
        case "AUTHORIZATION_TYPE_REDELEGATE":
            return AuthorizationType.AUTHORIZATION_TYPE_REDELEGATE;
        case -1:
        case "UNRECOGNIZED":
        default:
            return AuthorizationType.UNRECOGNIZED;
    }
}
exports.authorizationTypeFromJSON = authorizationTypeFromJSON;
function authorizationTypeToJSON(object) {
    switch (object) {
        case AuthorizationType.AUTHORIZATION_TYPE_UNSPECIFIED:
            return "AUTHORIZATION_TYPE_UNSPECIFIED";
        case AuthorizationType.AUTHORIZATION_TYPE_DELEGATE:
            return "AUTHORIZATION_TYPE_DELEGATE";
        case AuthorizationType.AUTHORIZATION_TYPE_UNDELEGATE:
            return "AUTHORIZATION_TYPE_UNDELEGATE";
        case AuthorizationType.AUTHORIZATION_TYPE_REDELEGATE:
            return "AUTHORIZATION_TYPE_REDELEGATE";
        default:
            return "UNKNOWN";
    }
}
exports.authorizationTypeToJSON = authorizationTypeToJSON;
function createBaseStakeAuthorization() {
    return {
        maxTokens: undefined,
        allowList: undefined,
        denyList: undefined,
        authorizationType: 0,
    };
}
exports.StakeAuthorization = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.maxTokens !== undefined) {
            coin_1.Coin.encode(message.maxTokens, writer.uint32(10).fork()).ldelim();
        }
        if (message.allowList !== undefined) {
            exports.StakeAuthorization_Validators.encode(message.allowList, writer.uint32(18).fork()).ldelim();
        }
        if (message.denyList !== undefined) {
            exports.StakeAuthorization_Validators.encode(message.denyList, writer.uint32(26).fork()).ldelim();
        }
        if (message.authorizationType !== 0) {
            writer.uint32(32).int32(message.authorizationType);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakeAuthorization();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.maxTokens = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.allowList = exports.StakeAuthorization_Validators.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.denyList = exports.StakeAuthorization_Validators.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.authorizationType = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            maxTokens: isSet(object.maxTokens)
                ? coin_1.Coin.fromJSON(object.maxTokens)
                : undefined,
            allowList: isSet(object.allowList)
                ? exports.StakeAuthorization_Validators.fromJSON(object.allowList)
                : undefined,
            denyList: isSet(object.denyList)
                ? exports.StakeAuthorization_Validators.fromJSON(object.denyList)
                : undefined,
            authorizationType: isSet(object.authorizationType)
                ? authorizationTypeFromJSON(object.authorizationType)
                : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.maxTokens !== undefined &&
            (obj.maxTokens = message.maxTokens
                ? coin_1.Coin.toJSON(message.maxTokens)
                : undefined);
        message.allowList !== undefined &&
            (obj.allowList = message.allowList
                ? exports.StakeAuthorization_Validators.toJSON(message.allowList)
                : undefined);
        message.denyList !== undefined &&
            (obj.denyList = message.denyList
                ? exports.StakeAuthorization_Validators.toJSON(message.denyList)
                : undefined);
        message.authorizationType !== undefined &&
            (obj.authorizationType = authorizationTypeToJSON(message.authorizationType));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStakeAuthorization();
        message.maxTokens =
            object.maxTokens !== undefined && object.maxTokens !== null
                ? coin_1.Coin.fromPartial(object.maxTokens)
                : undefined;
        message.allowList =
            object.allowList !== undefined && object.allowList !== null
                ? exports.StakeAuthorization_Validators.fromPartial(object.allowList)
                : undefined;
        message.denyList =
            object.denyList !== undefined && object.denyList !== null
                ? exports.StakeAuthorization_Validators.fromPartial(object.denyList)
                : undefined;
        message.authorizationType = (_a = object.authorizationType) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseStakeAuthorization_Validators() {
    return { address: [] };
}
exports.StakeAuthorization_Validators = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.address) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStakeAuthorization_Validators();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: Array.isArray(object === null || object === void 0 ? void 0 : object.address)
                ? object.address.map((e) => String(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.address) {
            obj.address = message.address.map((e) => e);
        }
        else {
            obj.address = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseStakeAuthorization_Validators();
        message.address = ((_a = object.address) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=authz.js.map

/***/ }),

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoSuspectMnemonicInclusion = exports.InvalidHexError = exports.UnknownCurrencyError = exports.InsufficientFeeError = exports.NotLoadedFeeError = exports.InsufficientAmountError = exports.NegativeAmountError = exports.ZeroAmountError = exports.InvalidNumberAmountError = exports.EmptyAmountError = exports.ENSFailedToFetchError = exports.ENSIsFetchingError = exports.ENSNotSupportedError = exports.InvalidBech32Error = exports.EmptyAddressError = void 0;
class EmptyAddressError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EmptyAddressError.prototype);
    }
}
exports.EmptyAddressError = EmptyAddressError;
class InvalidBech32Error extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidBech32Error.prototype);
    }
}
exports.InvalidBech32Error = InvalidBech32Error;
class ENSNotSupportedError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ENSNotSupportedError.prototype);
    }
}
exports.ENSNotSupportedError = ENSNotSupportedError;
class ENSIsFetchingError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ENSIsFetchingError.prototype);
    }
}
exports.ENSIsFetchingError = ENSIsFetchingError;
class ENSFailedToFetchError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ENSFailedToFetchError.prototype);
    }
}
exports.ENSFailedToFetchError = ENSFailedToFetchError;
class EmptyAmountError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EmptyAmountError.prototype);
    }
}
exports.EmptyAmountError = EmptyAmountError;
class InvalidNumberAmountError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidNumberAmountError.prototype);
    }
}
exports.InvalidNumberAmountError = InvalidNumberAmountError;
class ZeroAmountError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ZeroAmountError.prototype);
    }
}
exports.ZeroAmountError = ZeroAmountError;
class NegativeAmountError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NegativeAmountError.prototype);
    }
}
exports.NegativeAmountError = NegativeAmountError;
class InsufficientAmountError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InsufficientAmountError.prototype);
    }
}
exports.InsufficientAmountError = InsufficientAmountError;
class NotLoadedFeeError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotLoadedFeeError.prototype);
    }
}
exports.NotLoadedFeeError = NotLoadedFeeError;
class InsufficientFeeError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InsufficientFeeError.prototype);
    }
}
exports.InsufficientFeeError = InsufficientFeeError;
class UnknownCurrencyError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnknownCurrencyError.prototype);
    }
}
exports.UnknownCurrencyError = UnknownCurrencyError;
class InvalidHexError extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidHexError.prototype);
    }
}
exports.InvalidHexError = InvalidHexError;
class MemoSuspectMnemonicInclusion extends Error {
    constructor(m) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MemoSuspectMnemonicInclusion.prototype);
    }
}
exports.MemoSuspectMnemonicInclusion = MemoSuspectMnemonicInclusion;
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 400:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "google.protobuf";
function createBaseDuration() {
    return { seconds: "0", nanos: 0 };
}
exports.Duration = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.seconds !== "0") {
            writer.uint32(8).int64(message.seconds);
        }
        if (message.nanos !== 0) {
            writer.uint32(16).int32(message.nanos);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDuration();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.seconds = longToString(reader.int64());
                    break;
                case 2:
                    message.nanos = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            seconds: isSet(object.seconds) ? String(object.seconds) : "0",
            nanos: isSet(object.nanos) ? Number(object.nanos) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.seconds !== undefined && (obj.seconds = message.seconds);
        message.nanos !== undefined && (obj.nanos = Math.round(message.nanos));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseDuration();
        message.seconds = (_a = object.seconds) !== null && _a !== void 0 ? _a : "0";
        message.nanos = (_b = object.nanos) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=duration.js.map

/***/ }),

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactBitArray = exports.MultiSignature = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "cosmos.crypto.multisig.v1beta1";
function createBaseMultiSignature() {
    return { signatures: [] };
}
exports.MultiSignature = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.signatures) {
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMultiSignature();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signatures.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => bytesFromBase64(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMultiSignature();
        message.signatures = ((_a = object.signatures) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseCompactBitArray() {
    return { extraBitsStored: 0, elems: new Uint8Array() };
}
exports.CompactBitArray = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.extraBitsStored !== 0) {
            writer.uint32(8).uint32(message.extraBitsStored);
        }
        if (message.elems.length !== 0) {
            writer.uint32(18).bytes(message.elems);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCompactBitArray();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.extraBitsStored = reader.uint32();
                    break;
                case 2:
                    message.elems = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            extraBitsStored: isSet(object.extraBitsStored)
                ? Number(object.extraBitsStored)
                : 0,
            elems: isSet(object.elems)
                ? bytesFromBase64(object.elems)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.extraBitsStored !== undefined &&
            (obj.extraBitsStored = Math.round(message.extraBitsStored));
        message.elems !== undefined &&
            (obj.elems = base64FromBytes(message.elems !== undefined ? message.elems : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseCompactBitArray();
        message.extraBitsStored = (_a = object.extraBitsStored) !== null && _a !== void 0 ? _a : 0;
        message.elems = (_b = object.elems) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=multisig.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 44:
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
__exportStar(__webpack_require__(1394), exports);
__exportStar(__webpack_require__(200), exports);
__exportStar(__webpack_require__(1408), exports);
__exportStar(__webpack_require__(1409), exports);
__exportStar(__webpack_require__(1495), exports);
__exportStar(__webpack_require__(1498), exports);
//# sourceMappingURL=index.js.map

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

/***/ 597:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grant = exports.GenericAuthorization = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const timestamp_1 = __webpack_require__(142);
const any_1 = __webpack_require__(83);
exports.protobufPackage = "cosmos.authz.v1beta1";
function createBaseGenericAuthorization() {
    return { msg: "" };
}
exports.GenericAuthorization = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.msg !== "") {
            writer.uint32(10).string(message.msg);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenericAuthorization();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.msg = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            msg: isSet(object.msg) ? String(object.msg) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.msg !== undefined && (obj.msg = message.msg);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGenericAuthorization();
        message.msg = (_a = object.msg) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseGrant() {
    return { authorization: undefined, expiration: undefined };
}
exports.Grant = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.authorization !== undefined) {
            any_1.Any.encode(message.authorization, writer.uint32(10).fork()).ldelim();
        }
        if (message.expiration !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.expiration), writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGrant();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.authorization = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.expiration = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            authorization: isSet(object.authorization)
                ? any_1.Any.fromJSON(object.authorization)
                : undefined,
            expiration: isSet(object.expiration)
                ? fromJsonTimestamp(object.expiration)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.authorization !== undefined &&
            (obj.authorization = message.authorization
                ? any_1.Any.toJSON(message.authorization)
                : undefined);
        message.expiration !== undefined &&
            (obj.expiration = message.expiration.toISOString());
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGrant();
        message.authorization =
            object.authorization !== undefined && object.authorization !== null
                ? any_1.Any.fromPartial(object.authorization)
                : undefined;
        message.expiration = (_a = object.expiration) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = Number(t.seconds) * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=authz.js.map

/***/ }),

/***/ 619:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgMultiSendResponse = exports.MsgMultiSend = exports.MsgSendResponse = exports.MsgSend = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
const bank_1 = __webpack_require__(682);
exports.protobufPackage = "cosmos.bank.v1beta1";
function createBaseMsgSend() {
    return { fromAddress: "", toAddress: "", amount: [] };
}
exports.MsgSend = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.fromAddress !== "") {
            writer.uint32(10).string(message.fromAddress);
        }
        if (message.toAddress !== "") {
            writer.uint32(18).string(message.toAddress);
        }
        for (const v of message.amount) {
            coin_1.Coin.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSend();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.fromAddress = reader.string();
                    break;
                case 2:
                    message.toAddress = reader.string();
                    break;
                case 3:
                    message.amount.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            fromAddress: isSet(object.fromAddress) ? String(object.fromAddress) : "",
            toAddress: isSet(object.toAddress) ? String(object.toAddress) : "",
            amount: Array.isArray(object === null || object === void 0 ? void 0 : object.amount)
                ? object.amount.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.fromAddress !== undefined &&
            (obj.fromAddress = message.fromAddress);
        message.toAddress !== undefined && (obj.toAddress = message.toAddress);
        if (message.amount) {
            obj.amount = message.amount.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.amount = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgSend();
        message.fromAddress = (_a = object.fromAddress) !== null && _a !== void 0 ? _a : "";
        message.toAddress = (_b = object.toAddress) !== null && _b !== void 0 ? _b : "";
        message.amount = ((_c = object.amount) === null || _c === void 0 ? void 0 : _c.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgSendResponse() {
    return {};
}
exports.MsgSendResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSendResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgSendResponse();
        return message;
    },
};
function createBaseMsgMultiSend() {
    return { inputs: [], outputs: [] };
}
exports.MsgMultiSend = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.inputs) {
            bank_1.Input.encode(v, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.outputs) {
            bank_1.Output.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMultiSend();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.inputs.push(bank_1.Input.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.outputs.push(bank_1.Output.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            inputs: Array.isArray(object === null || object === void 0 ? void 0 : object.inputs)
                ? object.inputs.map((e) => bank_1.Input.fromJSON(e))
                : [],
            outputs: Array.isArray(object === null || object === void 0 ? void 0 : object.outputs)
                ? object.outputs.map((e) => bank_1.Output.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.inputs) {
            obj.inputs = message.inputs.map((e) => (e ? bank_1.Input.toJSON(e) : undefined));
        }
        else {
            obj.inputs = [];
        }
        if (message.outputs) {
            obj.outputs = message.outputs.map((e) => e ? bank_1.Output.toJSON(e) : undefined);
        }
        else {
            obj.outputs = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgMultiSend();
        message.inputs = ((_a = object.inputs) === null || _a === void 0 ? void 0 : _a.map((e) => bank_1.Input.fromPartial(e))) || [];
        message.outputs = ((_b = object.outputs) === null || _b === void 0 ? void 0 : _b.map((e) => bank_1.Output.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgMultiSendResponse() {
    return {};
}
exports.MsgMultiSendResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMultiSendResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgMultiSendResponse();
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map

/***/ }),

/***/ 620:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgUndelegateResponse = exports.MsgUndelegate = exports.MsgBeginRedelegateResponse = exports.MsgBeginRedelegate = exports.MsgDelegateResponse = exports.MsgDelegate = exports.MsgEditValidatorResponse = exports.MsgEditValidator = exports.MsgCreateValidatorResponse = exports.MsgCreateValidator = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const timestamp_1 = __webpack_require__(142);
const staking_1 = __webpack_require__(683);
const any_1 = __webpack_require__(83);
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.staking.v1beta1";
function createBaseMsgCreateValidator() {
    return {
        description: undefined,
        commission: undefined,
        minSelfDelegation: "",
        delegatorAddress: "",
        validatorAddress: "",
        pubkey: undefined,
        value: undefined,
    };
}
exports.MsgCreateValidator = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.description !== undefined) {
            staking_1.Description.encode(message.description, writer.uint32(10).fork()).ldelim();
        }
        if (message.commission !== undefined) {
            staking_1.CommissionRates.encode(message.commission, writer.uint32(18).fork()).ldelim();
        }
        if (message.minSelfDelegation !== "") {
            writer.uint32(26).string(message.minSelfDelegation);
        }
        if (message.delegatorAddress !== "") {
            writer.uint32(34).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(42).string(message.validatorAddress);
        }
        if (message.pubkey !== undefined) {
            any_1.Any.encode(message.pubkey, writer.uint32(50).fork()).ldelim();
        }
        if (message.value !== undefined) {
            coin_1.Coin.encode(message.value, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateValidator();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.description = staking_1.Description.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.commission = staking_1.CommissionRates.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.minSelfDelegation = reader.string();
                    break;
                case 4:
                    message.delegatorAddress = reader.string();
                    break;
                case 5:
                    message.validatorAddress = reader.string();
                    break;
                case 6:
                    message.pubkey = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.value = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            description: isSet(object.description)
                ? staking_1.Description.fromJSON(object.description)
                : undefined,
            commission: isSet(object.commission)
                ? staking_1.CommissionRates.fromJSON(object.commission)
                : undefined,
            minSelfDelegation: isSet(object.minSelfDelegation)
                ? String(object.minSelfDelegation)
                : "",
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
            pubkey: isSet(object.pubkey) ? any_1.Any.fromJSON(object.pubkey) : undefined,
            value: isSet(object.value) ? coin_1.Coin.fromJSON(object.value) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.description !== undefined &&
            (obj.description = message.description
                ? staking_1.Description.toJSON(message.description)
                : undefined);
        message.commission !== undefined &&
            (obj.commission = message.commission
                ? staking_1.CommissionRates.toJSON(message.commission)
                : undefined);
        message.minSelfDelegation !== undefined &&
            (obj.minSelfDelegation = message.minSelfDelegation);
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.pubkey !== undefined &&
            (obj.pubkey = message.pubkey ? any_1.Any.toJSON(message.pubkey) : undefined);
        message.value !== undefined &&
            (obj.value = message.value ? coin_1.Coin.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgCreateValidator();
        message.description =
            object.description !== undefined && object.description !== null
                ? staking_1.Description.fromPartial(object.description)
                : undefined;
        message.commission =
            object.commission !== undefined && object.commission !== null
                ? staking_1.CommissionRates.fromPartial(object.commission)
                : undefined;
        message.minSelfDelegation = (_a = object.minSelfDelegation) !== null && _a !== void 0 ? _a : "";
        message.delegatorAddress = (_b = object.delegatorAddress) !== null && _b !== void 0 ? _b : "";
        message.validatorAddress = (_c = object.validatorAddress) !== null && _c !== void 0 ? _c : "";
        message.pubkey =
            object.pubkey !== undefined && object.pubkey !== null
                ? any_1.Any.fromPartial(object.pubkey)
                : undefined;
        message.value =
            object.value !== undefined && object.value !== null
                ? coin_1.Coin.fromPartial(object.value)
                : undefined;
        return message;
    },
};
function createBaseMsgCreateValidatorResponse() {
    return {};
}
exports.MsgCreateValidatorResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgCreateValidatorResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgCreateValidatorResponse();
        return message;
    },
};
function createBaseMsgEditValidator() {
    return {
        description: undefined,
        validatorAddress: "",
        commissionRate: "",
        minSelfDelegation: "",
    };
}
exports.MsgEditValidator = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.description !== undefined) {
            staking_1.Description.encode(message.description, writer.uint32(10).fork()).ldelim();
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        if (message.commissionRate !== "") {
            writer.uint32(26).string(message.commissionRate);
        }
        if (message.minSelfDelegation !== "") {
            writer.uint32(34).string(message.minSelfDelegation);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgEditValidator();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.description = staking_1.Description.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                case 3:
                    message.commissionRate = reader.string();
                    break;
                case 4:
                    message.minSelfDelegation = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            description: isSet(object.description)
                ? staking_1.Description.fromJSON(object.description)
                : undefined,
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
            commissionRate: isSet(object.commissionRate)
                ? String(object.commissionRate)
                : "",
            minSelfDelegation: isSet(object.minSelfDelegation)
                ? String(object.minSelfDelegation)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.description !== undefined &&
            (obj.description = message.description
                ? staking_1.Description.toJSON(message.description)
                : undefined);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.commissionRate !== undefined &&
            (obj.commissionRate = message.commissionRate);
        message.minSelfDelegation !== undefined &&
            (obj.minSelfDelegation = message.minSelfDelegation);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgEditValidator();
        message.description =
            object.description !== undefined && object.description !== null
                ? staking_1.Description.fromPartial(object.description)
                : undefined;
        message.validatorAddress = (_a = object.validatorAddress) !== null && _a !== void 0 ? _a : "";
        message.commissionRate = (_b = object.commissionRate) !== null && _b !== void 0 ? _b : "";
        message.minSelfDelegation = (_c = object.minSelfDelegation) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseMsgEditValidatorResponse() {
    return {};
}
exports.MsgEditValidatorResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgEditValidatorResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgEditValidatorResponse();
        return message;
    },
};
function createBaseMsgDelegate() {
    return { delegatorAddress: "", validatorAddress: "", amount: undefined };
}
exports.MsgDelegate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        if (message.amount !== undefined) {
            coin_1.Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                case 3:
                    message.amount = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
            amount: isSet(object.amount) ? coin_1.Coin.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.amount !== undefined &&
            (obj.amount = message.amount ? coin_1.Coin.toJSON(message.amount) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgDelegate();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : "";
        message.amount =
            object.amount !== undefined && object.amount !== null
                ? coin_1.Coin.fromPartial(object.amount)
                : undefined;
        return message;
    },
};
function createBaseMsgDelegateResponse() {
    return {};
}
exports.MsgDelegateResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDelegateResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgDelegateResponse();
        return message;
    },
};
function createBaseMsgBeginRedelegate() {
    return {
        delegatorAddress: "",
        validatorSrcAddress: "",
        validatorDstAddress: "",
        amount: undefined,
    };
}
exports.MsgBeginRedelegate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorSrcAddress !== "") {
            writer.uint32(18).string(message.validatorSrcAddress);
        }
        if (message.validatorDstAddress !== "") {
            writer.uint32(26).string(message.validatorDstAddress);
        }
        if (message.amount !== undefined) {
            coin_1.Coin.encode(message.amount, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBeginRedelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorSrcAddress = reader.string();
                    break;
                case 3:
                    message.validatorDstAddress = reader.string();
                    break;
                case 4:
                    message.amount = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorSrcAddress: isSet(object.validatorSrcAddress)
                ? String(object.validatorSrcAddress)
                : "",
            validatorDstAddress: isSet(object.validatorDstAddress)
                ? String(object.validatorDstAddress)
                : "",
            amount: isSet(object.amount) ? coin_1.Coin.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorSrcAddress !== undefined &&
            (obj.validatorSrcAddress = message.validatorSrcAddress);
        message.validatorDstAddress !== undefined &&
            (obj.validatorDstAddress = message.validatorDstAddress);
        message.amount !== undefined &&
            (obj.amount = message.amount ? coin_1.Coin.toJSON(message.amount) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgBeginRedelegate();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorSrcAddress = (_b = object.validatorSrcAddress) !== null && _b !== void 0 ? _b : "";
        message.validatorDstAddress = (_c = object.validatorDstAddress) !== null && _c !== void 0 ? _c : "";
        message.amount =
            object.amount !== undefined && object.amount !== null
                ? coin_1.Coin.fromPartial(object.amount)
                : undefined;
        return message;
    },
};
function createBaseMsgBeginRedelegateResponse() {
    return { completionTime: undefined };
}
exports.MsgBeginRedelegateResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.completionTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgBeginRedelegateResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.completionTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            completionTime: isSet(object.completionTime)
                ? fromJsonTimestamp(object.completionTime)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.completionTime !== undefined &&
            (obj.completionTime = message.completionTime.toISOString());
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgBeginRedelegateResponse();
        message.completionTime = (_a = object.completionTime) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseMsgUndelegate() {
    return { delegatorAddress: "", validatorAddress: "", amount: undefined };
}
exports.MsgUndelegate = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        if (message.amount !== undefined) {
            coin_1.Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUndelegate();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                case 3:
                    message.amount = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
            amount: isSet(object.amount) ? coin_1.Coin.fromJSON(object.amount) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.amount !== undefined &&
            (obj.amount = message.amount ? coin_1.Coin.toJSON(message.amount) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgUndelegate();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : "";
        message.amount =
            object.amount !== undefined && object.amount !== null
                ? coin_1.Coin.fromPartial(object.amount)
                : undefined;
        return message;
    },
};
function createBaseMsgUndelegateResponse() {
    return { completionTime: undefined };
}
exports.MsgUndelegateResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.completionTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUndelegateResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.completionTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            completionTime: isSet(object.completionTime)
                ? fromJsonTimestamp(object.completionTime)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.completionTime !== undefined &&
            (obj.completionTime = message.completionTime.toISOString());
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgUndelegateResponse();
        message.completionTime = (_a = object.completionTime) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = Number(t.seconds) * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgDepositResponse = exports.MsgDeposit = exports.MsgVoteWeightedResponse = exports.MsgVoteWeighted = exports.MsgVoteResponse = exports.MsgVote = exports.MsgSubmitProposalResponse = exports.MsgSubmitProposal = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const gov_1 = __webpack_require__(622);
const any_1 = __webpack_require__(83);
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.gov.v1beta1";
function createBaseMsgSubmitProposal() {
    return { content: undefined, initialDeposit: [], proposer: "" };
}
exports.MsgSubmitProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.content !== undefined) {
            any_1.Any.encode(message.content, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.initialDeposit) {
            coin_1.Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.proposer !== "") {
            writer.uint32(26).string(message.proposer);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSubmitProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.content = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.initialDeposit.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.proposer = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            content: isSet(object.content) ? any_1.Any.fromJSON(object.content) : undefined,
            initialDeposit: Array.isArray(object === null || object === void 0 ? void 0 : object.initialDeposit)
                ? object.initialDeposit.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            proposer: isSet(object.proposer) ? String(object.proposer) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.content !== undefined &&
            (obj.content = message.content ? any_1.Any.toJSON(message.content) : undefined);
        if (message.initialDeposit) {
            obj.initialDeposit = message.initialDeposit.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.initialDeposit = [];
        }
        message.proposer !== undefined && (obj.proposer = message.proposer);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgSubmitProposal();
        message.content =
            object.content !== undefined && object.content !== null
                ? any_1.Any.fromPartial(object.content)
                : undefined;
        message.initialDeposit =
            ((_a = object.initialDeposit) === null || _a === void 0 ? void 0 : _a.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.proposer = (_b = object.proposer) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseMsgSubmitProposalResponse() {
    return { proposalId: "0" };
}
exports.MsgSubmitProposalResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSubmitProposalResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgSubmitProposalResponse();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        return message;
    },
};
function createBaseMsgVote() {
    return { proposalId: "0", voter: "", option: 0 };
}
exports.MsgVote = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        if (message.voter !== "") {
            writer.uint32(18).string(message.voter);
        }
        if (message.option !== 0) {
            writer.uint32(24).int32(message.option);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgVote();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                case 2:
                    message.voter = reader.string();
                    break;
                case 3:
                    message.option = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
            voter: isSet(object.voter) ? String(object.voter) : "",
            option: isSet(object.option) ? gov_1.voteOptionFromJSON(object.option) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        message.voter !== undefined && (obj.voter = message.voter);
        message.option !== undefined &&
            (obj.option = gov_1.voteOptionToJSON(message.option));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgVote();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        message.voter = (_b = object.voter) !== null && _b !== void 0 ? _b : "";
        message.option = (_c = object.option) !== null && _c !== void 0 ? _c : 0;
        return message;
    },
};
function createBaseMsgVoteResponse() {
    return {};
}
exports.MsgVoteResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgVoteResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgVoteResponse();
        return message;
    },
};
function createBaseMsgVoteWeighted() {
    return { proposalId: "0", voter: "", options: [] };
}
exports.MsgVoteWeighted = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        if (message.voter !== "") {
            writer.uint32(18).string(message.voter);
        }
        for (const v of message.options) {
            gov_1.WeightedVoteOption.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgVoteWeighted();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                case 2:
                    message.voter = reader.string();
                    break;
                case 3:
                    message.options.push(gov_1.WeightedVoteOption.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
            voter: isSet(object.voter) ? String(object.voter) : "",
            options: Array.isArray(object === null || object === void 0 ? void 0 : object.options)
                ? object.options.map((e) => gov_1.WeightedVoteOption.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        message.voter !== undefined && (obj.voter = message.voter);
        if (message.options) {
            obj.options = message.options.map((e) => e ? gov_1.WeightedVoteOption.toJSON(e) : undefined);
        }
        else {
            obj.options = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgVoteWeighted();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        message.voter = (_b = object.voter) !== null && _b !== void 0 ? _b : "";
        message.options =
            ((_c = object.options) === null || _c === void 0 ? void 0 : _c.map((e) => gov_1.WeightedVoteOption.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgVoteWeightedResponse() {
    return {};
}
exports.MsgVoteWeightedResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgVoteWeightedResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgVoteWeightedResponse();
        return message;
    },
};
function createBaseMsgDeposit() {
    return { proposalId: "0", depositor: "", amount: [] };
}
exports.MsgDeposit = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        if (message.depositor !== "") {
            writer.uint32(18).string(message.depositor);
        }
        for (const v of message.amount) {
            coin_1.Coin.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDeposit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                case 2:
                    message.depositor = reader.string();
                    break;
                case 3:
                    message.amount.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
            depositor: isSet(object.depositor) ? String(object.depositor) : "",
            amount: Array.isArray(object === null || object === void 0 ? void 0 : object.amount)
                ? object.amount.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        message.depositor !== undefined && (obj.depositor = message.depositor);
        if (message.amount) {
            obj.amount = message.amount.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.amount = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgDeposit();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        message.depositor = (_b = object.depositor) !== null && _b !== void 0 ? _b : "";
        message.amount = ((_c = object.amount) === null || _c === void 0 ? void 0 : _c.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgDepositResponse() {
    return {};
}
exports.MsgDepositResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgDepositResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgDepositResponse();
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map

/***/ }),

/***/ 622:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TallyParams = exports.VotingParams = exports.DepositParams = exports.Vote = exports.TallyResult = exports.Proposal = exports.Deposit = exports.TextProposal = exports.WeightedVoteOption = exports.proposalStatusToJSON = exports.proposalStatusFromJSON = exports.ProposalStatus = exports.voteOptionToJSON = exports.voteOptionFromJSON = exports.VoteOption = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const timestamp_1 = __webpack_require__(142);
const coin_1 = __webpack_require__(80);
const any_1 = __webpack_require__(83);
const duration_1 = __webpack_require__(400);
exports.protobufPackage = "cosmos.gov.v1beta1";
/** VoteOption enumerates the valid vote options for a given governance proposal. */
var VoteOption;
(function (VoteOption) {
    /** VOTE_OPTION_UNSPECIFIED - VOTE_OPTION_UNSPECIFIED defines a no-op vote option. */
    VoteOption[VoteOption["VOTE_OPTION_UNSPECIFIED"] = 0] = "VOTE_OPTION_UNSPECIFIED";
    /** VOTE_OPTION_YES - VOTE_OPTION_YES defines a yes vote option. */
    VoteOption[VoteOption["VOTE_OPTION_YES"] = 1] = "VOTE_OPTION_YES";
    /** VOTE_OPTION_ABSTAIN - VOTE_OPTION_ABSTAIN defines an abstain vote option. */
    VoteOption[VoteOption["VOTE_OPTION_ABSTAIN"] = 2] = "VOTE_OPTION_ABSTAIN";
    /** VOTE_OPTION_NO - VOTE_OPTION_NO defines a no vote option. */
    VoteOption[VoteOption["VOTE_OPTION_NO"] = 3] = "VOTE_OPTION_NO";
    /** VOTE_OPTION_NO_WITH_VETO - VOTE_OPTION_NO_WITH_VETO defines a no with veto vote option. */
    VoteOption[VoteOption["VOTE_OPTION_NO_WITH_VETO"] = 4] = "VOTE_OPTION_NO_WITH_VETO";
    VoteOption[VoteOption["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(VoteOption = exports.VoteOption || (exports.VoteOption = {}));
function voteOptionFromJSON(object) {
    switch (object) {
        case 0:
        case "VOTE_OPTION_UNSPECIFIED":
            return VoteOption.VOTE_OPTION_UNSPECIFIED;
        case 1:
        case "VOTE_OPTION_YES":
            return VoteOption.VOTE_OPTION_YES;
        case 2:
        case "VOTE_OPTION_ABSTAIN":
            return VoteOption.VOTE_OPTION_ABSTAIN;
        case 3:
        case "VOTE_OPTION_NO":
            return VoteOption.VOTE_OPTION_NO;
        case 4:
        case "VOTE_OPTION_NO_WITH_VETO":
            return VoteOption.VOTE_OPTION_NO_WITH_VETO;
        case -1:
        case "UNRECOGNIZED":
        default:
            return VoteOption.UNRECOGNIZED;
    }
}
exports.voteOptionFromJSON = voteOptionFromJSON;
function voteOptionToJSON(object) {
    switch (object) {
        case VoteOption.VOTE_OPTION_UNSPECIFIED:
            return "VOTE_OPTION_UNSPECIFIED";
        case VoteOption.VOTE_OPTION_YES:
            return "VOTE_OPTION_YES";
        case VoteOption.VOTE_OPTION_ABSTAIN:
            return "VOTE_OPTION_ABSTAIN";
        case VoteOption.VOTE_OPTION_NO:
            return "VOTE_OPTION_NO";
        case VoteOption.VOTE_OPTION_NO_WITH_VETO:
            return "VOTE_OPTION_NO_WITH_VETO";
        default:
            return "UNKNOWN";
    }
}
exports.voteOptionToJSON = voteOptionToJSON;
/** ProposalStatus enumerates the valid statuses of a proposal. */
var ProposalStatus;
(function (ProposalStatus) {
    /** PROPOSAL_STATUS_UNSPECIFIED - PROPOSAL_STATUS_UNSPECIFIED defines the default propopsal status. */
    ProposalStatus[ProposalStatus["PROPOSAL_STATUS_UNSPECIFIED"] = 0] = "PROPOSAL_STATUS_UNSPECIFIED";
    /**
     * PROPOSAL_STATUS_DEPOSIT_PERIOD - PROPOSAL_STATUS_DEPOSIT_PERIOD defines a proposal status during the deposit
     * period.
     */
    ProposalStatus[ProposalStatus["PROPOSAL_STATUS_DEPOSIT_PERIOD"] = 1] = "PROPOSAL_STATUS_DEPOSIT_PERIOD";
    /**
     * PROPOSAL_STATUS_VOTING_PERIOD - PROPOSAL_STATUS_VOTING_PERIOD defines a proposal status during the voting
     * period.
     */
    ProposalStatus[ProposalStatus["PROPOSAL_STATUS_VOTING_PERIOD"] = 2] = "PROPOSAL_STATUS_VOTING_PERIOD";
    /**
     * PROPOSAL_STATUS_PASSED - PROPOSAL_STATUS_PASSED defines a proposal status of a proposal that has
     * passed.
     */
    ProposalStatus[ProposalStatus["PROPOSAL_STATUS_PASSED"] = 3] = "PROPOSAL_STATUS_PASSED";
    /**
     * PROPOSAL_STATUS_REJECTED - PROPOSAL_STATUS_REJECTED defines a proposal status of a proposal that has
     * been rejected.
     */
    ProposalStatus[ProposalStatus["PROPOSAL_STATUS_REJECTED"] = 4] = "PROPOSAL_STATUS_REJECTED";
    /**
     * PROPOSAL_STATUS_FAILED - PROPOSAL_STATUS_FAILED defines a proposal status of a proposal that has
     * failed.
     */
    ProposalStatus[ProposalStatus["PROPOSAL_STATUS_FAILED"] = 5] = "PROPOSAL_STATUS_FAILED";
    ProposalStatus[ProposalStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ProposalStatus = exports.ProposalStatus || (exports.ProposalStatus = {}));
function proposalStatusFromJSON(object) {
    switch (object) {
        case 0:
        case "PROPOSAL_STATUS_UNSPECIFIED":
            return ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED;
        case 1:
        case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
            return ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD;
        case 2:
        case "PROPOSAL_STATUS_VOTING_PERIOD":
            return ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD;
        case 3:
        case "PROPOSAL_STATUS_PASSED":
            return ProposalStatus.PROPOSAL_STATUS_PASSED;
        case 4:
        case "PROPOSAL_STATUS_REJECTED":
            return ProposalStatus.PROPOSAL_STATUS_REJECTED;
        case 5:
        case "PROPOSAL_STATUS_FAILED":
            return ProposalStatus.PROPOSAL_STATUS_FAILED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ProposalStatus.UNRECOGNIZED;
    }
}
exports.proposalStatusFromJSON = proposalStatusFromJSON;
function proposalStatusToJSON(object) {
    switch (object) {
        case ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED:
            return "PROPOSAL_STATUS_UNSPECIFIED";
        case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
            return "PROPOSAL_STATUS_DEPOSIT_PERIOD";
        case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
            return "PROPOSAL_STATUS_VOTING_PERIOD";
        case ProposalStatus.PROPOSAL_STATUS_PASSED:
            return "PROPOSAL_STATUS_PASSED";
        case ProposalStatus.PROPOSAL_STATUS_REJECTED:
            return "PROPOSAL_STATUS_REJECTED";
        case ProposalStatus.PROPOSAL_STATUS_FAILED:
            return "PROPOSAL_STATUS_FAILED";
        default:
            return "UNKNOWN";
    }
}
exports.proposalStatusToJSON = proposalStatusToJSON;
function createBaseWeightedVoteOption() {
    return { option: 0, weight: "" };
}
exports.WeightedVoteOption = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.option !== 0) {
            writer.uint32(8).int32(message.option);
        }
        if (message.weight !== "") {
            writer.uint32(18).string(message.weight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWeightedVoteOption();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.option = reader.int32();
                    break;
                case 2:
                    message.weight = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            option: isSet(object.option) ? voteOptionFromJSON(object.option) : 0,
            weight: isSet(object.weight) ? String(object.weight) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.option !== undefined &&
            (obj.option = voteOptionToJSON(message.option));
        message.weight !== undefined && (obj.weight = message.weight);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseWeightedVoteOption();
        message.option = (_a = object.option) !== null && _a !== void 0 ? _a : 0;
        message.weight = (_b = object.weight) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseTextProposal() {
    return { title: "", description: "" };
}
exports.TextProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTextProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            title: isSet(object.title) ? String(object.title) : "",
            description: isSet(object.description) ? String(object.description) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined &&
            (obj.description = message.description);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseTextProposal();
        message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
        message.description = (_b = object.description) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseDeposit() {
    return { proposalId: "0", depositor: "", amount: [] };
}
exports.Deposit = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        if (message.depositor !== "") {
            writer.uint32(18).string(message.depositor);
        }
        for (const v of message.amount) {
            coin_1.Coin.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeposit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                case 2:
                    message.depositor = reader.string();
                    break;
                case 3:
                    message.amount.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
            depositor: isSet(object.depositor) ? String(object.depositor) : "",
            amount: Array.isArray(object === null || object === void 0 ? void 0 : object.amount)
                ? object.amount.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        message.depositor !== undefined && (obj.depositor = message.depositor);
        if (message.amount) {
            obj.amount = message.amount.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.amount = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseDeposit();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        message.depositor = (_b = object.depositor) !== null && _b !== void 0 ? _b : "";
        message.amount = ((_c = object.amount) === null || _c === void 0 ? void 0 : _c.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseProposal() {
    return {
        proposalId: "0",
        content: undefined,
        status: 0,
        finalTallyResult: undefined,
        submitTime: undefined,
        depositEndTime: undefined,
        totalDeposit: [],
        votingStartTime: undefined,
        votingEndTime: undefined,
    };
}
exports.Proposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        if (message.content !== undefined) {
            any_1.Any.encode(message.content, writer.uint32(18).fork()).ldelim();
        }
        if (message.status !== 0) {
            writer.uint32(24).int32(message.status);
        }
        if (message.finalTallyResult !== undefined) {
            exports.TallyResult.encode(message.finalTallyResult, writer.uint32(34).fork()).ldelim();
        }
        if (message.submitTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.submitTime), writer.uint32(42).fork()).ldelim();
        }
        if (message.depositEndTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.depositEndTime), writer.uint32(50).fork()).ldelim();
        }
        for (const v of message.totalDeposit) {
            coin_1.Coin.encode(v, writer.uint32(58).fork()).ldelim();
        }
        if (message.votingStartTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.votingStartTime), writer.uint32(66).fork()).ldelim();
        }
        if (message.votingEndTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.votingEndTime), writer.uint32(74).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                case 2:
                    message.content = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.status = reader.int32();
                    break;
                case 4:
                    message.finalTallyResult = exports.TallyResult.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.submitTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.depositEndTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.totalDeposit.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 8:
                    message.votingStartTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 9:
                    message.votingEndTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
            content: isSet(object.content) ? any_1.Any.fromJSON(object.content) : undefined,
            status: isSet(object.status) ? proposalStatusFromJSON(object.status) : 0,
            finalTallyResult: isSet(object.finalTallyResult)
                ? exports.TallyResult.fromJSON(object.finalTallyResult)
                : undefined,
            submitTime: isSet(object.submitTime)
                ? fromJsonTimestamp(object.submitTime)
                : undefined,
            depositEndTime: isSet(object.depositEndTime)
                ? fromJsonTimestamp(object.depositEndTime)
                : undefined,
            totalDeposit: Array.isArray(object === null || object === void 0 ? void 0 : object.totalDeposit)
                ? object.totalDeposit.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            votingStartTime: isSet(object.votingStartTime)
                ? fromJsonTimestamp(object.votingStartTime)
                : undefined,
            votingEndTime: isSet(object.votingEndTime)
                ? fromJsonTimestamp(object.votingEndTime)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        message.content !== undefined &&
            (obj.content = message.content ? any_1.Any.toJSON(message.content) : undefined);
        message.status !== undefined &&
            (obj.status = proposalStatusToJSON(message.status));
        message.finalTallyResult !== undefined &&
            (obj.finalTallyResult = message.finalTallyResult
                ? exports.TallyResult.toJSON(message.finalTallyResult)
                : undefined);
        message.submitTime !== undefined &&
            (obj.submitTime = message.submitTime.toISOString());
        message.depositEndTime !== undefined &&
            (obj.depositEndTime = message.depositEndTime.toISOString());
        if (message.totalDeposit) {
            obj.totalDeposit = message.totalDeposit.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.totalDeposit = [];
        }
        message.votingStartTime !== undefined &&
            (obj.votingStartTime = message.votingStartTime.toISOString());
        message.votingEndTime !== undefined &&
            (obj.votingEndTime = message.votingEndTime.toISOString());
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseProposal();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        message.content =
            object.content !== undefined && object.content !== null
                ? any_1.Any.fromPartial(object.content)
                : undefined;
        message.status = (_b = object.status) !== null && _b !== void 0 ? _b : 0;
        message.finalTallyResult =
            object.finalTallyResult !== undefined && object.finalTallyResult !== null
                ? exports.TallyResult.fromPartial(object.finalTallyResult)
                : undefined;
        message.submitTime = (_c = object.submitTime) !== null && _c !== void 0 ? _c : undefined;
        message.depositEndTime = (_d = object.depositEndTime) !== null && _d !== void 0 ? _d : undefined;
        message.totalDeposit =
            ((_e = object.totalDeposit) === null || _e === void 0 ? void 0 : _e.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.votingStartTime = (_f = object.votingStartTime) !== null && _f !== void 0 ? _f : undefined;
        message.votingEndTime = (_g = object.votingEndTime) !== null && _g !== void 0 ? _g : undefined;
        return message;
    },
};
function createBaseTallyResult() {
    return { yes: "", abstain: "", no: "", noWithVeto: "" };
}
exports.TallyResult = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.yes !== "") {
            writer.uint32(10).string(message.yes);
        }
        if (message.abstain !== "") {
            writer.uint32(18).string(message.abstain);
        }
        if (message.no !== "") {
            writer.uint32(26).string(message.no);
        }
        if (message.noWithVeto !== "") {
            writer.uint32(34).string(message.noWithVeto);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTallyResult();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.yes = reader.string();
                    break;
                case 2:
                    message.abstain = reader.string();
                    break;
                case 3:
                    message.no = reader.string();
                    break;
                case 4:
                    message.noWithVeto = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            yes: isSet(object.yes) ? String(object.yes) : "",
            abstain: isSet(object.abstain) ? String(object.abstain) : "",
            no: isSet(object.no) ? String(object.no) : "",
            noWithVeto: isSet(object.noWithVeto) ? String(object.noWithVeto) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.yes !== undefined && (obj.yes = message.yes);
        message.abstain !== undefined && (obj.abstain = message.abstain);
        message.no !== undefined && (obj.no = message.no);
        message.noWithVeto !== undefined && (obj.noWithVeto = message.noWithVeto);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseTallyResult();
        message.yes = (_a = object.yes) !== null && _a !== void 0 ? _a : "";
        message.abstain = (_b = object.abstain) !== null && _b !== void 0 ? _b : "";
        message.no = (_c = object.no) !== null && _c !== void 0 ? _c : "";
        message.noWithVeto = (_d = object.noWithVeto) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseVote() {
    return { proposalId: "0", voter: "", option: 0, options: [] };
}
exports.Vote = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.proposalId !== "0") {
            writer.uint32(8).uint64(message.proposalId);
        }
        if (message.voter !== "") {
            writer.uint32(18).string(message.voter);
        }
        if (message.option !== 0) {
            writer.uint32(24).int32(message.option);
        }
        for (const v of message.options) {
            exports.WeightedVoteOption.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVote();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.proposalId = longToString(reader.uint64());
                    break;
                case 2:
                    message.voter = reader.string();
                    break;
                case 3:
                    message.option = reader.int32();
                    break;
                case 4:
                    message.options.push(exports.WeightedVoteOption.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            proposalId: isSet(object.proposalId) ? String(object.proposalId) : "0",
            voter: isSet(object.voter) ? String(object.voter) : "",
            option: isSet(object.option) ? voteOptionFromJSON(object.option) : 0,
            options: Array.isArray(object === null || object === void 0 ? void 0 : object.options)
                ? object.options.map((e) => exports.WeightedVoteOption.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.proposalId !== undefined && (obj.proposalId = message.proposalId);
        message.voter !== undefined && (obj.voter = message.voter);
        message.option !== undefined &&
            (obj.option = voteOptionToJSON(message.option));
        if (message.options) {
            obj.options = message.options.map((e) => e ? exports.WeightedVoteOption.toJSON(e) : undefined);
        }
        else {
            obj.options = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseVote();
        message.proposalId = (_a = object.proposalId) !== null && _a !== void 0 ? _a : "0";
        message.voter = (_b = object.voter) !== null && _b !== void 0 ? _b : "";
        message.option = (_c = object.option) !== null && _c !== void 0 ? _c : 0;
        message.options =
            ((_d = object.options) === null || _d === void 0 ? void 0 : _d.map((e) => exports.WeightedVoteOption.fromPartial(e))) || [];
        return message;
    },
};
function createBaseDepositParams() {
    return { minDeposit: [], maxDepositPeriod: undefined };
}
exports.DepositParams = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.minDeposit) {
            coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.maxDepositPeriod !== undefined) {
            duration_1.Duration.encode(message.maxDepositPeriod, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDepositParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.minDeposit.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.maxDepositPeriod = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            minDeposit: Array.isArray(object === null || object === void 0 ? void 0 : object.minDeposit)
                ? object.minDeposit.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            maxDepositPeriod: isSet(object.maxDepositPeriod)
                ? duration_1.Duration.fromJSON(object.maxDepositPeriod)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.minDeposit) {
            obj.minDeposit = message.minDeposit.map((e) => e ? coin_1.Coin.toJSON(e) : undefined);
        }
        else {
            obj.minDeposit = [];
        }
        message.maxDepositPeriod !== undefined &&
            (obj.maxDepositPeriod = message.maxDepositPeriod
                ? duration_1.Duration.toJSON(message.maxDepositPeriod)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseDepositParams();
        message.minDeposit =
            ((_a = object.minDeposit) === null || _a === void 0 ? void 0 : _a.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.maxDepositPeriod =
            object.maxDepositPeriod !== undefined && object.maxDepositPeriod !== null
                ? duration_1.Duration.fromPartial(object.maxDepositPeriod)
                : undefined;
        return message;
    },
};
function createBaseVotingParams() {
    return { votingPeriod: undefined };
}
exports.VotingParams = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.votingPeriod !== undefined) {
            duration_1.Duration.encode(message.votingPeriod, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVotingParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.votingPeriod = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            votingPeriod: isSet(object.votingPeriod)
                ? duration_1.Duration.fromJSON(object.votingPeriod)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.votingPeriod !== undefined &&
            (obj.votingPeriod = message.votingPeriod
                ? duration_1.Duration.toJSON(message.votingPeriod)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseVotingParams();
        message.votingPeriod =
            object.votingPeriod !== undefined && object.votingPeriod !== null
                ? duration_1.Duration.fromPartial(object.votingPeriod)
                : undefined;
        return message;
    },
};
function createBaseTallyParams() {
    return {
        quorum: new Uint8Array(),
        threshold: new Uint8Array(),
        vetoThreshold: new Uint8Array(),
    };
}
exports.TallyParams = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.quorum.length !== 0) {
            writer.uint32(10).bytes(message.quorum);
        }
        if (message.threshold.length !== 0) {
            writer.uint32(18).bytes(message.threshold);
        }
        if (message.vetoThreshold.length !== 0) {
            writer.uint32(26).bytes(message.vetoThreshold);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTallyParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.quorum = reader.bytes();
                    break;
                case 2:
                    message.threshold = reader.bytes();
                    break;
                case 3:
                    message.vetoThreshold = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            quorum: isSet(object.quorum)
                ? bytesFromBase64(object.quorum)
                : new Uint8Array(),
            threshold: isSet(object.threshold)
                ? bytesFromBase64(object.threshold)
                : new Uint8Array(),
            vetoThreshold: isSet(object.vetoThreshold)
                ? bytesFromBase64(object.vetoThreshold)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.quorum !== undefined &&
            (obj.quorum = base64FromBytes(message.quorum !== undefined ? message.quorum : new Uint8Array()));
        message.threshold !== undefined &&
            (obj.threshold = base64FromBytes(message.threshold !== undefined ? message.threshold : new Uint8Array()));
        message.vetoThreshold !== undefined &&
            (obj.vetoThreshold = base64FromBytes(message.vetoThreshold !== undefined
                ? message.vetoThreshold
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseTallyParams();
        message.quorum = (_a = object.quorum) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.threshold = (_b = object.threshold) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.vetoThreshold = (_c = object.vetoThreshold) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = Number(t.seconds) * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=gov.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 623:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgFundCommunityPoolResponse = exports.MsgFundCommunityPool = exports.MsgWithdrawValidatorCommissionResponse = exports.MsgWithdrawValidatorCommission = exports.MsgWithdrawDelegatorRewardResponse = exports.MsgWithdrawDelegatorReward = exports.MsgSetWithdrawAddressResponse = exports.MsgSetWithdrawAddress = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.distribution.v1beta1";
function createBaseMsgSetWithdrawAddress() {
    return { delegatorAddress: "", withdrawAddress: "" };
}
exports.MsgSetWithdrawAddress = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.withdrawAddress !== "") {
            writer.uint32(18).string(message.withdrawAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSetWithdrawAddress();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.withdrawAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            withdrawAddress: isSet(object.withdrawAddress)
                ? String(object.withdrawAddress)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.withdrawAddress !== undefined &&
            (obj.withdrawAddress = message.withdrawAddress);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgSetWithdrawAddress();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.withdrawAddress = (_b = object.withdrawAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseMsgSetWithdrawAddressResponse() {
    return {};
}
exports.MsgSetWithdrawAddressResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgSetWithdrawAddressResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgSetWithdrawAddressResponse();
        return message;
    },
};
function createBaseMsgWithdrawDelegatorReward() {
    return { delegatorAddress: "", validatorAddress: "" };
}
exports.MsgWithdrawDelegatorReward = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgWithdrawDelegatorReward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgWithdrawDelegatorReward();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseMsgWithdrawDelegatorRewardResponse() {
    return {};
}
exports.MsgWithdrawDelegatorRewardResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgWithdrawDelegatorRewardResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgWithdrawDelegatorRewardResponse();
        return message;
    },
};
function createBaseMsgWithdrawValidatorCommission() {
    return { validatorAddress: "" };
}
exports.MsgWithdrawValidatorCommission = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.validatorAddress !== "") {
            writer.uint32(10).string(message.validatorAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgWithdrawValidatorCommission();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.validatorAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgWithdrawValidatorCommission();
        message.validatorAddress = (_a = object.validatorAddress) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseMsgWithdrawValidatorCommissionResponse() {
    return {};
}
exports.MsgWithdrawValidatorCommissionResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgWithdrawValidatorCommissionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgWithdrawValidatorCommissionResponse();
        return message;
    },
};
function createBaseMsgFundCommunityPool() {
    return { amount: [], depositor: "" };
}
exports.MsgFundCommunityPool = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.amount) {
            coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.depositor !== "") {
            writer.uint32(18).string(message.depositor);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgFundCommunityPool();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.amount.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.depositor = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            amount: Array.isArray(object === null || object === void 0 ? void 0 : object.amount)
                ? object.amount.map((e) => coin_1.Coin.fromJSON(e))
                : [],
            depositor: isSet(object.depositor) ? String(object.depositor) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.amount) {
            obj.amount = message.amount.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.amount = [];
        }
        message.depositor !== undefined && (obj.depositor = message.depositor);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgFundCommunityPool();
        message.amount = ((_a = object.amount) === null || _a === void 0 ? void 0 : _a.map((e) => coin_1.Coin.fromPartial(e))) || [];
        message.depositor = (_b = object.depositor) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseMsgFundCommunityPoolResponse() {
    return {};
}
exports.MsgFundCommunityPoolResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgFundCommunityPoolResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgFundCommunityPoolResponse();
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map

/***/ }),

/***/ 624:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClearAdminResponse = exports.MsgClearAdmin = exports.MsgUpdateAdminResponse = exports.MsgUpdateAdmin = exports.MsgMigrateContractResponse = exports.MsgMigrateContract = exports.MsgExecuteContractResponse = exports.MsgExecuteContract = exports.MsgInstantiateContractResponse = exports.MsgInstantiateContract = exports.MsgStoreCodeResponse = exports.MsgStoreCode = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const types_1 = __webpack_require__(690);
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmwasm.wasm.v1";
function createBaseMsgStoreCode() {
    return {
        sender: "",
        wasmByteCode: new Uint8Array(),
        instantiatePermission: undefined,
    };
}
exports.MsgStoreCode = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.wasmByteCode.length !== 0) {
            writer.uint32(18).bytes(message.wasmByteCode);
        }
        if (message.instantiatePermission !== undefined) {
            types_1.AccessConfig.encode(message.instantiatePermission, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreCode();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.wasmByteCode = reader.bytes();
                    break;
                case 5:
                    message.instantiatePermission = types_1.AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender) ? String(object.sender) : "",
            wasmByteCode: isSet(object.wasmByteCode)
                ? bytesFromBase64(object.wasmByteCode)
                : new Uint8Array(),
            instantiatePermission: isSet(object.instantiatePermission)
                ? types_1.AccessConfig.fromJSON(object.instantiatePermission)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.wasmByteCode !== undefined &&
            (obj.wasmByteCode = base64FromBytes(message.wasmByteCode !== undefined
                ? message.wasmByteCode
                : new Uint8Array()));
        message.instantiatePermission !== undefined &&
            (obj.instantiatePermission = message.instantiatePermission
                ? types_1.AccessConfig.toJSON(message.instantiatePermission)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgStoreCode();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : "";
        message.wasmByteCode = (_b = object.wasmByteCode) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.instantiatePermission =
            object.instantiatePermission !== undefined &&
                object.instantiatePermission !== null
                ? types_1.AccessConfig.fromPartial(object.instantiatePermission)
                : undefined;
        return message;
    },
};
function createBaseMsgStoreCodeResponse() {
    return { codeId: "0" };
}
exports.MsgStoreCodeResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.codeId !== "0") {
            writer.uint32(8).uint64(message.codeId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgStoreCodeResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.codeId !== undefined && (obj.codeId = message.codeId);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgStoreCodeResponse();
        message.codeId = (_a = object.codeId) !== null && _a !== void 0 ? _a : "0";
        return message;
    },
};
function createBaseMsgInstantiateContract() {
    return {
        sender: "",
        admin: "",
        codeId: "0",
        label: "",
        msg: new Uint8Array(),
        funds: [],
    };
}
exports.MsgInstantiateContract = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.admin !== "") {
            writer.uint32(18).string(message.admin);
        }
        if (message.codeId !== "0") {
            writer.uint32(24).uint64(message.codeId);
        }
        if (message.label !== "") {
            writer.uint32(34).string(message.label);
        }
        if (message.msg.length !== 0) {
            writer.uint32(42).bytes(message.msg);
        }
        for (const v of message.funds) {
            coin_1.Coin.encode(v, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.admin = reader.string();
                    break;
                case 3:
                    message.codeId = longToString(reader.uint64());
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 5:
                    message.msg = reader.bytes();
                    break;
                case 6:
                    message.funds.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender) ? String(object.sender) : "",
            admin: isSet(object.admin) ? String(object.admin) : "",
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            label: isSet(object.label) ? String(object.label) : "",
            msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(),
            funds: Array.isArray(object === null || object === void 0 ? void 0 : object.funds)
                ? object.funds.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.admin !== undefined && (obj.admin = message.admin);
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.label !== undefined && (obj.label = message.label);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        if (message.funds) {
            obj.funds = message.funds.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.funds = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseMsgInstantiateContract();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : "";
        message.admin = (_b = object.admin) !== null && _b !== void 0 ? _b : "";
        message.codeId = (_c = object.codeId) !== null && _c !== void 0 ? _c : "0";
        message.label = (_d = object.label) !== null && _d !== void 0 ? _d : "";
        message.msg = (_e = object.msg) !== null && _e !== void 0 ? _e : new Uint8Array();
        message.funds = ((_f = object.funds) === null || _f === void 0 ? void 0 : _f.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgInstantiateContractResponse() {
    return { address: "", data: new Uint8Array() };
}
exports.MsgInstantiateContractResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgInstantiateContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            data: isSet(object.data)
                ? bytesFromBase64(object.data)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgInstantiateContractResponse();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.data = (_b = object.data) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseMsgExecuteContract() {
    return { sender: "", contract: "", msg: new Uint8Array(), funds: [] };
}
exports.MsgExecuteContract = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.contract !== "") {
            writer.uint32(18).string(message.contract);
        }
        if (message.msg.length !== 0) {
            writer.uint32(26).bytes(message.msg);
        }
        for (const v of message.funds) {
            coin_1.Coin.encode(v, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExecuteContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.contract = reader.string();
                    break;
                case 3:
                    message.msg = reader.bytes();
                    break;
                case 5:
                    message.funds.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender) ? String(object.sender) : "",
            contract: isSet(object.contract) ? String(object.contract) : "",
            msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(),
            funds: Array.isArray(object === null || object === void 0 ? void 0 : object.funds)
                ? object.funds.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.contract !== undefined && (obj.contract = message.contract);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        if (message.funds) {
            obj.funds = message.funds.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.funds = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseMsgExecuteContract();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : "";
        message.contract = (_b = object.contract) !== null && _b !== void 0 ? _b : "";
        message.msg = (_c = object.msg) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.funds = ((_d = object.funds) === null || _d === void 0 ? void 0 : _d.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgExecuteContractResponse() {
    return { data: new Uint8Array() };
}
exports.MsgExecuteContractResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExecuteContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data)
                ? bytesFromBase64(object.data)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgExecuteContractResponse();
        message.data = (_a = object.data) !== null && _a !== void 0 ? _a : new Uint8Array();
        return message;
    },
};
function createBaseMsgMigrateContract() {
    return { sender: "", contract: "", codeId: "0", msg: new Uint8Array() };
}
exports.MsgMigrateContract = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.contract !== "") {
            writer.uint32(18).string(message.contract);
        }
        if (message.codeId !== "0") {
            writer.uint32(24).uint64(message.codeId);
        }
        if (message.msg.length !== 0) {
            writer.uint32(34).bytes(message.msg);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMigrateContract();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.contract = reader.string();
                    break;
                case 3:
                    message.codeId = longToString(reader.uint64());
                    break;
                case 4:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender) ? String(object.sender) : "",
            contract: isSet(object.contract) ? String(object.contract) : "",
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.contract !== undefined && (obj.contract = message.contract);
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseMsgMigrateContract();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : "";
        message.contract = (_b = object.contract) !== null && _b !== void 0 ? _b : "";
        message.codeId = (_c = object.codeId) !== null && _c !== void 0 ? _c : "0";
        message.msg = (_d = object.msg) !== null && _d !== void 0 ? _d : new Uint8Array();
        return message;
    },
};
function createBaseMsgMigrateContractResponse() {
    return { data: new Uint8Array() };
}
exports.MsgMigrateContractResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.data.length !== 0) {
            writer.uint32(10).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgMigrateContractResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data)
                ? bytesFromBase64(object.data)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgMigrateContractResponse();
        message.data = (_a = object.data) !== null && _a !== void 0 ? _a : new Uint8Array();
        return message;
    },
};
function createBaseMsgUpdateAdmin() {
    return { sender: "", newAdmin: "", contract: "" };
}
exports.MsgUpdateAdmin = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.newAdmin !== "") {
            writer.uint32(18).string(message.newAdmin);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateAdmin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.newAdmin = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender) ? String(object.sender) : "",
            newAdmin: isSet(object.newAdmin) ? String(object.newAdmin) : "",
            contract: isSet(object.contract) ? String(object.contract) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.newAdmin !== undefined && (obj.newAdmin = message.newAdmin);
        message.contract !== undefined && (obj.contract = message.contract);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgUpdateAdmin();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : "";
        message.newAdmin = (_b = object.newAdmin) !== null && _b !== void 0 ? _b : "";
        message.contract = (_c = object.contract) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseMsgUpdateAdminResponse() {
    return {};
}
exports.MsgUpdateAdminResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgUpdateAdminResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgUpdateAdminResponse();
        return message;
    },
};
function createBaseMsgClearAdmin() {
    return { sender: "", contract: "" };
}
exports.MsgClearAdmin = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.contract !== "") {
            writer.uint32(26).string(message.contract);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgClearAdmin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 3:
                    message.contract = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sender: isSet(object.sender) ? String(object.sender) : "",
            contract: isSet(object.contract) ? String(object.contract) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.contract !== undefined && (obj.contract = message.contract);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgClearAdmin();
        message.sender = (_a = object.sender) !== null && _a !== void 0 ? _a : "";
        message.contract = (_b = object.contract) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseMsgClearAdminResponse() {
    return {};
}
exports.MsgClearAdminResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgClearAdminResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgClearAdminResponse();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 625:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgTransferResponse = exports.MsgTransfer = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
const client_1 = __webpack_require__(691);
exports.protobufPackage = "ibc.applications.transfer.v1";
function createBaseMsgTransfer() {
    return {
        sourcePort: "",
        sourceChannel: "",
        token: undefined,
        sender: "",
        receiver: "",
        timeoutHeight: undefined,
        timeoutTimestamp: "0",
    };
}
exports.MsgTransfer = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sourcePort !== "") {
            writer.uint32(10).string(message.sourcePort);
        }
        if (message.sourceChannel !== "") {
            writer.uint32(18).string(message.sourceChannel);
        }
        if (message.token !== undefined) {
            coin_1.Coin.encode(message.token, writer.uint32(26).fork()).ldelim();
        }
        if (message.sender !== "") {
            writer.uint32(34).string(message.sender);
        }
        if (message.receiver !== "") {
            writer.uint32(42).string(message.receiver);
        }
        if (message.timeoutHeight !== undefined) {
            client_1.Height.encode(message.timeoutHeight, writer.uint32(50).fork()).ldelim();
        }
        if (message.timeoutTimestamp !== "0") {
            writer.uint32(56).uint64(message.timeoutTimestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgTransfer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sourcePort = reader.string();
                    break;
                case 2:
                    message.sourceChannel = reader.string();
                    break;
                case 3:
                    message.token = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.sender = reader.string();
                    break;
                case 5:
                    message.receiver = reader.string();
                    break;
                case 6:
                    message.timeoutHeight = client_1.Height.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.timeoutTimestamp = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sourcePort: isSet(object.sourcePort) ? String(object.sourcePort) : "",
            sourceChannel: isSet(object.sourceChannel)
                ? String(object.sourceChannel)
                : "",
            token: isSet(object.token) ? coin_1.Coin.fromJSON(object.token) : undefined,
            sender: isSet(object.sender) ? String(object.sender) : "",
            receiver: isSet(object.receiver) ? String(object.receiver) : "",
            timeoutHeight: isSet(object.timeoutHeight)
                ? client_1.Height.fromJSON(object.timeoutHeight)
                : undefined,
            timeoutTimestamp: isSet(object.timeoutTimestamp)
                ? String(object.timeoutTimestamp)
                : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.sourcePort !== undefined && (obj.sourcePort = message.sourcePort);
        message.sourceChannel !== undefined &&
            (obj.sourceChannel = message.sourceChannel);
        message.token !== undefined &&
            (obj.token = message.token ? coin_1.Coin.toJSON(message.token) : undefined);
        message.sender !== undefined && (obj.sender = message.sender);
        message.receiver !== undefined && (obj.receiver = message.receiver);
        message.timeoutHeight !== undefined &&
            (obj.timeoutHeight = message.timeoutHeight
                ? client_1.Height.toJSON(message.timeoutHeight)
                : undefined);
        message.timeoutTimestamp !== undefined &&
            (obj.timeoutTimestamp = message.timeoutTimestamp);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseMsgTransfer();
        message.sourcePort = (_a = object.sourcePort) !== null && _a !== void 0 ? _a : "";
        message.sourceChannel = (_b = object.sourceChannel) !== null && _b !== void 0 ? _b : "";
        message.token =
            object.token !== undefined && object.token !== null
                ? coin_1.Coin.fromPartial(object.token)
                : undefined;
        message.sender = (_c = object.sender) !== null && _c !== void 0 ? _c : "";
        message.receiver = (_d = object.receiver) !== null && _d !== void 0 ? _d : "";
        message.timeoutHeight =
            object.timeoutHeight !== undefined && object.timeoutHeight !== null
                ? client_1.Height.fromPartial(object.timeoutHeight)
                : undefined;
        message.timeoutTimestamp = (_e = object.timeoutTimestamp) !== null && _e !== void 0 ? _e : "0";
        return message;
    },
};
function createBaseMsgTransferResponse() {
    return {};
}
exports.MsgTransferResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgTransferResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgTransferResponse();
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map

/***/ }),

/***/ 626:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureDescriptor_Data_Multi = exports.SignatureDescriptor_Data_Single = exports.SignatureDescriptor_Data = exports.SignatureDescriptor = exports.SignatureDescriptors = exports.signModeToJSON = exports.signModeFromJSON = exports.SignMode = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const any_1 = __webpack_require__(83);
const multisig_1 = __webpack_require__(403);
exports.protobufPackage = "cosmos.tx.signing.v1beta1";
/** SignMode represents a signing mode with its own security guarantees. */
var SignMode;
(function (SignMode) {
    /**
     * SIGN_MODE_UNSPECIFIED - SIGN_MODE_UNSPECIFIED specifies an unknown signing mode and will be
     * rejected
     */
    SignMode[SignMode["SIGN_MODE_UNSPECIFIED"] = 0] = "SIGN_MODE_UNSPECIFIED";
    /**
     * SIGN_MODE_DIRECT - SIGN_MODE_DIRECT specifies a signing mode which uses SignDoc and is
     * verified with raw bytes from Tx
     */
    SignMode[SignMode["SIGN_MODE_DIRECT"] = 1] = "SIGN_MODE_DIRECT";
    /**
     * SIGN_MODE_TEXTUAL - SIGN_MODE_TEXTUAL is a future signing mode that will verify some
     * human-readable textual representation on top of the binary representation
     * from SIGN_MODE_DIRECT
     */
    SignMode[SignMode["SIGN_MODE_TEXTUAL"] = 2] = "SIGN_MODE_TEXTUAL";
    /**
     * SIGN_MODE_LEGACY_AMINO_JSON - SIGN_MODE_LEGACY_AMINO_JSON is a backwards compatibility mode which uses
     * Amino JSON and will be removed in the future
     */
    SignMode[SignMode["SIGN_MODE_LEGACY_AMINO_JSON"] = 127] = "SIGN_MODE_LEGACY_AMINO_JSON";
    SignMode[SignMode["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignMode = exports.SignMode || (exports.SignMode = {}));
function signModeFromJSON(object) {
    switch (object) {
        case 0:
        case "SIGN_MODE_UNSPECIFIED":
            return SignMode.SIGN_MODE_UNSPECIFIED;
        case 1:
        case "SIGN_MODE_DIRECT":
            return SignMode.SIGN_MODE_DIRECT;
        case 2:
        case "SIGN_MODE_TEXTUAL":
            return SignMode.SIGN_MODE_TEXTUAL;
        case 127:
        case "SIGN_MODE_LEGACY_AMINO_JSON":
            return SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SignMode.UNRECOGNIZED;
    }
}
exports.signModeFromJSON = signModeFromJSON;
function signModeToJSON(object) {
    switch (object) {
        case SignMode.SIGN_MODE_UNSPECIFIED:
            return "SIGN_MODE_UNSPECIFIED";
        case SignMode.SIGN_MODE_DIRECT:
            return "SIGN_MODE_DIRECT";
        case SignMode.SIGN_MODE_TEXTUAL:
            return "SIGN_MODE_TEXTUAL";
        case SignMode.SIGN_MODE_LEGACY_AMINO_JSON:
            return "SIGN_MODE_LEGACY_AMINO_JSON";
        default:
            return "UNKNOWN";
    }
}
exports.signModeToJSON = signModeToJSON;
function createBaseSignatureDescriptors() {
    return { signatures: [] };
}
exports.SignatureDescriptors = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.signatures) {
            exports.SignatureDescriptor.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignatureDescriptors();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signatures.push(exports.SignatureDescriptor.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => exports.SignatureDescriptor.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => e ? exports.SignatureDescriptor.toJSON(e) : undefined);
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSignatureDescriptors();
        message.signatures =
            ((_a = object.signatures) === null || _a === void 0 ? void 0 : _a.map((e) => exports.SignatureDescriptor.fromPartial(e))) || [];
        return message;
    },
};
function createBaseSignatureDescriptor() {
    return { publicKey: undefined, data: undefined, sequence: "0" };
}
exports.SignatureDescriptor = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.publicKey !== undefined) {
            any_1.Any.encode(message.publicKey, writer.uint32(10).fork()).ldelim();
        }
        if (message.data !== undefined) {
            exports.SignatureDescriptor_Data.encode(message.data, writer.uint32(18).fork()).ldelim();
        }
        if (message.sequence !== "0") {
            writer.uint32(24).uint64(message.sequence);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignatureDescriptor();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.publicKey = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.data = exports.SignatureDescriptor_Data.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.sequence = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            publicKey: isSet(object.publicKey)
                ? any_1.Any.fromJSON(object.publicKey)
                : undefined,
            data: isSet(object.data)
                ? exports.SignatureDescriptor_Data.fromJSON(object.data)
                : undefined,
            sequence: isSet(object.sequence) ? String(object.sequence) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.publicKey !== undefined &&
            (obj.publicKey = message.publicKey
                ? any_1.Any.toJSON(message.publicKey)
                : undefined);
        message.data !== undefined &&
            (obj.data = message.data
                ? exports.SignatureDescriptor_Data.toJSON(message.data)
                : undefined);
        message.sequence !== undefined && (obj.sequence = message.sequence);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSignatureDescriptor();
        message.publicKey =
            object.publicKey !== undefined && object.publicKey !== null
                ? any_1.Any.fromPartial(object.publicKey)
                : undefined;
        message.data =
            object.data !== undefined && object.data !== null
                ? exports.SignatureDescriptor_Data.fromPartial(object.data)
                : undefined;
        message.sequence = (_a = object.sequence) !== null && _a !== void 0 ? _a : "0";
        return message;
    },
};
function createBaseSignatureDescriptor_Data() {
    return { single: undefined, multi: undefined };
}
exports.SignatureDescriptor_Data = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.single !== undefined) {
            exports.SignatureDescriptor_Data_Single.encode(message.single, writer.uint32(10).fork()).ldelim();
        }
        if (message.multi !== undefined) {
            exports.SignatureDescriptor_Data_Multi.encode(message.multi, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignatureDescriptor_Data();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.single = exports.SignatureDescriptor_Data_Single.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.multi = exports.SignatureDescriptor_Data_Multi.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            single: isSet(object.single)
                ? exports.SignatureDescriptor_Data_Single.fromJSON(object.single)
                : undefined,
            multi: isSet(object.multi)
                ? exports.SignatureDescriptor_Data_Multi.fromJSON(object.multi)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.single !== undefined &&
            (obj.single = message.single
                ? exports.SignatureDescriptor_Data_Single.toJSON(message.single)
                : undefined);
        message.multi !== undefined &&
            (obj.multi = message.multi
                ? exports.SignatureDescriptor_Data_Multi.toJSON(message.multi)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseSignatureDescriptor_Data();
        message.single =
            object.single !== undefined && object.single !== null
                ? exports.SignatureDescriptor_Data_Single.fromPartial(object.single)
                : undefined;
        message.multi =
            object.multi !== undefined && object.multi !== null
                ? exports.SignatureDescriptor_Data_Multi.fromPartial(object.multi)
                : undefined;
        return message;
    },
};
function createBaseSignatureDescriptor_Data_Single() {
    return { mode: 0, signature: new Uint8Array() };
}
exports.SignatureDescriptor_Data_Single = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.mode !== 0) {
            writer.uint32(8).int32(message.mode);
        }
        if (message.signature.length !== 0) {
            writer.uint32(18).bytes(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignatureDescriptor_Data_Single();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.mode = reader.int32();
                    break;
                case 2:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            mode: isSet(object.mode) ? signModeFromJSON(object.mode) : 0,
            signature: isSet(object.signature)
                ? bytesFromBase64(object.signature)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.mode !== undefined && (obj.mode = signModeToJSON(message.mode));
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseSignatureDescriptor_Data_Single();
        message.mode = (_a = object.mode) !== null && _a !== void 0 ? _a : 0;
        message.signature = (_b = object.signature) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBaseSignatureDescriptor_Data_Multi() {
    return { bitarray: undefined, signatures: [] };
}
exports.SignatureDescriptor_Data_Multi = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.bitarray !== undefined) {
            multisig_1.CompactBitArray.encode(message.bitarray, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.signatures) {
            exports.SignatureDescriptor_Data.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignatureDescriptor_Data_Multi();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.bitarray = multisig_1.CompactBitArray.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signatures.push(exports.SignatureDescriptor_Data.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            bitarray: isSet(object.bitarray)
                ? multisig_1.CompactBitArray.fromJSON(object.bitarray)
                : undefined,
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => exports.SignatureDescriptor_Data.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.bitarray !== undefined &&
            (obj.bitarray = message.bitarray
                ? multisig_1.CompactBitArray.toJSON(message.bitarray)
                : undefined);
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => e ? exports.SignatureDescriptor_Data.toJSON(e) : undefined);
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSignatureDescriptor_Data_Multi();
        message.bitarray =
            object.bitarray !== undefined && object.bitarray !== null
                ? multisig_1.CompactBitArray.fromPartial(object.bitarray)
                : undefined;
        message.signatures =
            ((_a = object.signatures) === null || _a === void 0 ? void 0 : _a.map((e) => exports.SignatureDescriptor_Data.fromPartial(e))) ||
                [];
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=signing.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 682:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.DenomUnit = exports.Supply = exports.Output = exports.Input = exports.SendEnabled = exports.Params = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.bank.v1beta1";
function createBaseParams() {
    return { sendEnabled: [], defaultSendEnabled: false };
}
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.sendEnabled) {
            exports.SendEnabled.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.defaultSendEnabled === true) {
            writer.uint32(16).bool(message.defaultSendEnabled);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sendEnabled.push(exports.SendEnabled.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.defaultSendEnabled = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            sendEnabled: Array.isArray(object === null || object === void 0 ? void 0 : object.sendEnabled)
                ? object.sendEnabled.map((e) => exports.SendEnabled.fromJSON(e))
                : [],
            defaultSendEnabled: isSet(object.defaultSendEnabled)
                ? Boolean(object.defaultSendEnabled)
                : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.sendEnabled) {
            obj.sendEnabled = message.sendEnabled.map((e) => e ? exports.SendEnabled.toJSON(e) : undefined);
        }
        else {
            obj.sendEnabled = [];
        }
        message.defaultSendEnabled !== undefined &&
            (obj.defaultSendEnabled = message.defaultSendEnabled);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseParams();
        message.sendEnabled =
            ((_a = object.sendEnabled) === null || _a === void 0 ? void 0 : _a.map((e) => exports.SendEnabled.fromPartial(e))) || [];
        message.defaultSendEnabled = (_b = object.defaultSendEnabled) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function createBaseSendEnabled() {
    return { denom: "", enabled: false };
}
exports.SendEnabled = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.enabled === true) {
            writer.uint32(16).bool(message.enabled);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSendEnabled();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.enabled = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            denom: isSet(object.denom) ? String(object.denom) : "",
            enabled: isSet(object.enabled) ? Boolean(object.enabled) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.enabled !== undefined && (obj.enabled = message.enabled);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseSendEnabled();
        message.denom = (_a = object.denom) !== null && _a !== void 0 ? _a : "";
        message.enabled = (_b = object.enabled) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function createBaseInput() {
    return { address: "", coins: [] };
}
exports.Input = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        for (const v of message.coins) {
            coin_1.Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseInput();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.coins.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            coins: Array.isArray(object === null || object === void 0 ? void 0 : object.coins)
                ? object.coins.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        if (message.coins) {
            obj.coins = message.coins.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.coins = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseInput();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.coins = ((_b = object.coins) === null || _b === void 0 ? void 0 : _b.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseOutput() {
    return { address: "", coins: [] };
}
exports.Output = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== "") {
            writer.uint32(10).string(message.address);
        }
        for (const v of message.coins) {
            coin_1.Coin.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseOutput();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.coins.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address) ? String(object.address) : "",
            coins: Array.isArray(object === null || object === void 0 ? void 0 : object.coins)
                ? object.coins.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        if (message.coins) {
            obj.coins = message.coins.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.coins = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseOutput();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : "";
        message.coins = ((_b = object.coins) === null || _b === void 0 ? void 0 : _b.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseSupply() {
    return { total: [] };
}
exports.Supply = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.total) {
            coin_1.Coin.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSupply();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.total.push(coin_1.Coin.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            total: Array.isArray(object === null || object === void 0 ? void 0 : object.total)
                ? object.total.map((e) => coin_1.Coin.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.total) {
            obj.total = message.total.map((e) => (e ? coin_1.Coin.toJSON(e) : undefined));
        }
        else {
            obj.total = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSupply();
        message.total = ((_a = object.total) === null || _a === void 0 ? void 0 : _a.map((e) => coin_1.Coin.fromPartial(e))) || [];
        return message;
    },
};
function createBaseDenomUnit() {
    return { denom: "", exponent: 0, aliases: [] };
}
exports.DenomUnit = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.exponent !== 0) {
            writer.uint32(16).uint32(message.exponent);
        }
        for (const v of message.aliases) {
            writer.uint32(26).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDenomUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.exponent = reader.uint32();
                    break;
                case 3:
                    message.aliases.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            denom: isSet(object.denom) ? String(object.denom) : "",
            exponent: isSet(object.exponent) ? Number(object.exponent) : 0,
            aliases: Array.isArray(object === null || object === void 0 ? void 0 : object.aliases)
                ? object.aliases.map((e) => String(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.exponent !== undefined &&
            (obj.exponent = Math.round(message.exponent));
        if (message.aliases) {
            obj.aliases = message.aliases.map((e) => e);
        }
        else {
            obj.aliases = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseDenomUnit();
        message.denom = (_a = object.denom) !== null && _a !== void 0 ? _a : "";
        message.exponent = (_b = object.exponent) !== null && _b !== void 0 ? _b : 0;
        message.aliases = ((_c = object.aliases) === null || _c === void 0 ? void 0 : _c.map((e) => e)) || [];
        return message;
    },
};
function createBaseMetadata() {
    return {
        description: "",
        denomUnits: [],
        base: "",
        display: "",
        name: "",
        symbol: "",
    };
}
exports.Metadata = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.description !== "") {
            writer.uint32(10).string(message.description);
        }
        for (const v of message.denomUnits) {
            exports.DenomUnit.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.base !== "") {
            writer.uint32(26).string(message.base);
        }
        if (message.display !== "") {
            writer.uint32(34).string(message.display);
        }
        if (message.name !== "") {
            writer.uint32(42).string(message.name);
        }
        if (message.symbol !== "") {
            writer.uint32(50).string(message.symbol);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMetadata();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.description = reader.string();
                    break;
                case 2:
                    message.denomUnits.push(exports.DenomUnit.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.base = reader.string();
                    break;
                case 4:
                    message.display = reader.string();
                    break;
                case 5:
                    message.name = reader.string();
                    break;
                case 6:
                    message.symbol = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            description: isSet(object.description) ? String(object.description) : "",
            denomUnits: Array.isArray(object === null || object === void 0 ? void 0 : object.denomUnits)
                ? object.denomUnits.map((e) => exports.DenomUnit.fromJSON(e))
                : [],
            base: isSet(object.base) ? String(object.base) : "",
            display: isSet(object.display) ? String(object.display) : "",
            name: isSet(object.name) ? String(object.name) : "",
            symbol: isSet(object.symbol) ? String(object.symbol) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.description !== undefined &&
            (obj.description = message.description);
        if (message.denomUnits) {
            obj.denomUnits = message.denomUnits.map((e) => e ? exports.DenomUnit.toJSON(e) : undefined);
        }
        else {
            obj.denomUnits = [];
        }
        message.base !== undefined && (obj.base = message.base);
        message.display !== undefined && (obj.display = message.display);
        message.name !== undefined && (obj.name = message.name);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseMetadata();
        message.description = (_a = object.description) !== null && _a !== void 0 ? _a : "";
        message.denomUnits =
            ((_b = object.denomUnits) === null || _b === void 0 ? void 0 : _b.map((e) => exports.DenomUnit.fromPartial(e))) || [];
        message.base = (_c = object.base) !== null && _c !== void 0 ? _c : "";
        message.display = (_d = object.display) !== null && _d !== void 0 ? _d : "";
        message.name = (_e = object.name) !== null && _e !== void 0 ? _e : "";
        message.symbol = (_f = object.symbol) !== null && _f !== void 0 ? _f : "";
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=bank.js.map

/***/ }),

/***/ 683:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.RedelegationResponse = exports.RedelegationEntryResponse = exports.DelegationResponse = exports.Params = exports.Redelegation = exports.RedelegationEntry = exports.UnbondingDelegationEntry = exports.UnbondingDelegation = exports.Delegation = exports.DVVTriplets = exports.DVVTriplet = exports.DVPairs = exports.DVPair = exports.ValAddresses = exports.Validator = exports.Description = exports.Commission = exports.CommissionRates = exports.HistoricalInfo = exports.bondStatusToJSON = exports.bondStatusFromJSON = exports.BondStatus = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const timestamp_1 = __webpack_require__(142);
const types_1 = __webpack_require__(684);
const any_1 = __webpack_require__(83);
const duration_1 = __webpack_require__(400);
const coin_1 = __webpack_require__(80);
exports.protobufPackage = "cosmos.staking.v1beta1";
/** BondStatus is the status of a validator. */
var BondStatus;
(function (BondStatus) {
    /** BOND_STATUS_UNSPECIFIED - UNSPECIFIED defines an invalid validator status. */
    BondStatus[BondStatus["BOND_STATUS_UNSPECIFIED"] = 0] = "BOND_STATUS_UNSPECIFIED";
    /** BOND_STATUS_UNBONDED - UNBONDED defines a validator that is not bonded. */
    BondStatus[BondStatus["BOND_STATUS_UNBONDED"] = 1] = "BOND_STATUS_UNBONDED";
    /** BOND_STATUS_UNBONDING - UNBONDING defines a validator that is unbonding. */
    BondStatus[BondStatus["BOND_STATUS_UNBONDING"] = 2] = "BOND_STATUS_UNBONDING";
    /** BOND_STATUS_BONDED - BONDED defines a validator that is bonded. */
    BondStatus[BondStatus["BOND_STATUS_BONDED"] = 3] = "BOND_STATUS_BONDED";
    BondStatus[BondStatus["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(BondStatus = exports.BondStatus || (exports.BondStatus = {}));
function bondStatusFromJSON(object) {
    switch (object) {
        case 0:
        case "BOND_STATUS_UNSPECIFIED":
            return BondStatus.BOND_STATUS_UNSPECIFIED;
        case 1:
        case "BOND_STATUS_UNBONDED":
            return BondStatus.BOND_STATUS_UNBONDED;
        case 2:
        case "BOND_STATUS_UNBONDING":
            return BondStatus.BOND_STATUS_UNBONDING;
        case 3:
        case "BOND_STATUS_BONDED":
            return BondStatus.BOND_STATUS_BONDED;
        case -1:
        case "UNRECOGNIZED":
        default:
            return BondStatus.UNRECOGNIZED;
    }
}
exports.bondStatusFromJSON = bondStatusFromJSON;
function bondStatusToJSON(object) {
    switch (object) {
        case BondStatus.BOND_STATUS_UNSPECIFIED:
            return "BOND_STATUS_UNSPECIFIED";
        case BondStatus.BOND_STATUS_UNBONDED:
            return "BOND_STATUS_UNBONDED";
        case BondStatus.BOND_STATUS_UNBONDING:
            return "BOND_STATUS_UNBONDING";
        case BondStatus.BOND_STATUS_BONDED:
            return "BOND_STATUS_BONDED";
        default:
            return "UNKNOWN";
    }
}
exports.bondStatusToJSON = bondStatusToJSON;
function createBaseHistoricalInfo() {
    return { header: undefined, valset: [] };
}
exports.HistoricalInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            types_1.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.valset) {
            exports.Validator.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHistoricalInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.header = types_1.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.valset.push(exports.Validator.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            header: isSet(object.header) ? types_1.Header.fromJSON(object.header) : undefined,
            valset: Array.isArray(object === null || object === void 0 ? void 0 : object.valset)
                ? object.valset.map((e) => exports.Validator.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined &&
            (obj.header = message.header ? types_1.Header.toJSON(message.header) : undefined);
        if (message.valset) {
            obj.valset = message.valset.map((e) => e ? exports.Validator.toJSON(e) : undefined);
        }
        else {
            obj.valset = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseHistoricalInfo();
        message.header =
            object.header !== undefined && object.header !== null
                ? types_1.Header.fromPartial(object.header)
                : undefined;
        message.valset = ((_a = object.valset) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Validator.fromPartial(e))) || [];
        return message;
    },
};
function createBaseCommissionRates() {
    return { rate: "", maxRate: "", maxChangeRate: "" };
}
exports.CommissionRates = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.rate !== "") {
            writer.uint32(10).string(message.rate);
        }
        if (message.maxRate !== "") {
            writer.uint32(18).string(message.maxRate);
        }
        if (message.maxChangeRate !== "") {
            writer.uint32(26).string(message.maxChangeRate);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommissionRates();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.rate = reader.string();
                    break;
                case 2:
                    message.maxRate = reader.string();
                    break;
                case 3:
                    message.maxChangeRate = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            rate: isSet(object.rate) ? String(object.rate) : "",
            maxRate: isSet(object.maxRate) ? String(object.maxRate) : "",
            maxChangeRate: isSet(object.maxChangeRate)
                ? String(object.maxChangeRate)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.rate !== undefined && (obj.rate = message.rate);
        message.maxRate !== undefined && (obj.maxRate = message.maxRate);
        message.maxChangeRate !== undefined &&
            (obj.maxChangeRate = message.maxChangeRate);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseCommissionRates();
        message.rate = (_a = object.rate) !== null && _a !== void 0 ? _a : "";
        message.maxRate = (_b = object.maxRate) !== null && _b !== void 0 ? _b : "";
        message.maxChangeRate = (_c = object.maxChangeRate) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseCommission() {
    return { commissionRates: undefined, updateTime: undefined };
}
exports.Commission = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.commissionRates !== undefined) {
            exports.CommissionRates.encode(message.commissionRates, writer.uint32(10).fork()).ldelim();
        }
        if (message.updateTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.updateTime), writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommission();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.commissionRates = exports.CommissionRates.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.updateTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            commissionRates: isSet(object.commissionRates)
                ? exports.CommissionRates.fromJSON(object.commissionRates)
                : undefined,
            updateTime: isSet(object.updateTime)
                ? fromJsonTimestamp(object.updateTime)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.commissionRates !== undefined &&
            (obj.commissionRates = message.commissionRates
                ? exports.CommissionRates.toJSON(message.commissionRates)
                : undefined);
        message.updateTime !== undefined &&
            (obj.updateTime = message.updateTime.toISOString());
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseCommission();
        message.commissionRates =
            object.commissionRates !== undefined && object.commissionRates !== null
                ? exports.CommissionRates.fromPartial(object.commissionRates)
                : undefined;
        message.updateTime = (_a = object.updateTime) !== null && _a !== void 0 ? _a : undefined;
        return message;
    },
};
function createBaseDescription() {
    return {
        moniker: "",
        identity: "",
        website: "",
        securityContact: "",
        details: "",
    };
}
exports.Description = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.moniker !== "") {
            writer.uint32(10).string(message.moniker);
        }
        if (message.identity !== "") {
            writer.uint32(18).string(message.identity);
        }
        if (message.website !== "") {
            writer.uint32(26).string(message.website);
        }
        if (message.securityContact !== "") {
            writer.uint32(34).string(message.securityContact);
        }
        if (message.details !== "") {
            writer.uint32(42).string(message.details);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDescription();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.moniker = reader.string();
                    break;
                case 2:
                    message.identity = reader.string();
                    break;
                case 3:
                    message.website = reader.string();
                    break;
                case 4:
                    message.securityContact = reader.string();
                    break;
                case 5:
                    message.details = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            moniker: isSet(object.moniker) ? String(object.moniker) : "",
            identity: isSet(object.identity) ? String(object.identity) : "",
            website: isSet(object.website) ? String(object.website) : "",
            securityContact: isSet(object.securityContact)
                ? String(object.securityContact)
                : "",
            details: isSet(object.details) ? String(object.details) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.moniker !== undefined && (obj.moniker = message.moniker);
        message.identity !== undefined && (obj.identity = message.identity);
        message.website !== undefined && (obj.website = message.website);
        message.securityContact !== undefined &&
            (obj.securityContact = message.securityContact);
        message.details !== undefined && (obj.details = message.details);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseDescription();
        message.moniker = (_a = object.moniker) !== null && _a !== void 0 ? _a : "";
        message.identity = (_b = object.identity) !== null && _b !== void 0 ? _b : "";
        message.website = (_c = object.website) !== null && _c !== void 0 ? _c : "";
        message.securityContact = (_d = object.securityContact) !== null && _d !== void 0 ? _d : "";
        message.details = (_e = object.details) !== null && _e !== void 0 ? _e : "";
        return message;
    },
};
function createBaseValidator() {
    return {
        operatorAddress: "",
        consensusPubkey: undefined,
        jailed: false,
        status: 0,
        tokens: "",
        delegatorShares: "",
        description: undefined,
        unbondingHeight: "0",
        unbondingTime: undefined,
        commission: undefined,
        minSelfDelegation: "",
    };
}
exports.Validator = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.operatorAddress !== "") {
            writer.uint32(10).string(message.operatorAddress);
        }
        if (message.consensusPubkey !== undefined) {
            any_1.Any.encode(message.consensusPubkey, writer.uint32(18).fork()).ldelim();
        }
        if (message.jailed === true) {
            writer.uint32(24).bool(message.jailed);
        }
        if (message.status !== 0) {
            writer.uint32(32).int32(message.status);
        }
        if (message.tokens !== "") {
            writer.uint32(42).string(message.tokens);
        }
        if (message.delegatorShares !== "") {
            writer.uint32(50).string(message.delegatorShares);
        }
        if (message.description !== undefined) {
            exports.Description.encode(message.description, writer.uint32(58).fork()).ldelim();
        }
        if (message.unbondingHeight !== "0") {
            writer.uint32(64).int64(message.unbondingHeight);
        }
        if (message.unbondingTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.unbondingTime), writer.uint32(74).fork()).ldelim();
        }
        if (message.commission !== undefined) {
            exports.Commission.encode(message.commission, writer.uint32(82).fork()).ldelim();
        }
        if (message.minSelfDelegation !== "") {
            writer.uint32(90).string(message.minSelfDelegation);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidator();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.operatorAddress = reader.string();
                    break;
                case 2:
                    message.consensusPubkey = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.jailed = reader.bool();
                    break;
                case 4:
                    message.status = reader.int32();
                    break;
                case 5:
                    message.tokens = reader.string();
                    break;
                case 6:
                    message.delegatorShares = reader.string();
                    break;
                case 7:
                    message.description = exports.Description.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.unbondingHeight = longToString(reader.int64());
                    break;
                case 9:
                    message.unbondingTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.commission = exports.Commission.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.minSelfDelegation = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            operatorAddress: isSet(object.operatorAddress)
                ? String(object.operatorAddress)
                : "",
            consensusPubkey: isSet(object.consensusPubkey)
                ? any_1.Any.fromJSON(object.consensusPubkey)
                : undefined,
            jailed: isSet(object.jailed) ? Boolean(object.jailed) : false,
            status: isSet(object.status) ? bondStatusFromJSON(object.status) : 0,
            tokens: isSet(object.tokens) ? String(object.tokens) : "",
            delegatorShares: isSet(object.delegatorShares)
                ? String(object.delegatorShares)
                : "",
            description: isSet(object.description)
                ? exports.Description.fromJSON(object.description)
                : undefined,
            unbondingHeight: isSet(object.unbondingHeight)
                ? String(object.unbondingHeight)
                : "0",
            unbondingTime: isSet(object.unbondingTime)
                ? fromJsonTimestamp(object.unbondingTime)
                : undefined,
            commission: isSet(object.commission)
                ? exports.Commission.fromJSON(object.commission)
                : undefined,
            minSelfDelegation: isSet(object.minSelfDelegation)
                ? String(object.minSelfDelegation)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.operatorAddress !== undefined &&
            (obj.operatorAddress = message.operatorAddress);
        message.consensusPubkey !== undefined &&
            (obj.consensusPubkey = message.consensusPubkey
                ? any_1.Any.toJSON(message.consensusPubkey)
                : undefined);
        message.jailed !== undefined && (obj.jailed = message.jailed);
        message.status !== undefined &&
            (obj.status = bondStatusToJSON(message.status));
        message.tokens !== undefined && (obj.tokens = message.tokens);
        message.delegatorShares !== undefined &&
            (obj.delegatorShares = message.delegatorShares);
        message.description !== undefined &&
            (obj.description = message.description
                ? exports.Description.toJSON(message.description)
                : undefined);
        message.unbondingHeight !== undefined &&
            (obj.unbondingHeight = message.unbondingHeight);
        message.unbondingTime !== undefined &&
            (obj.unbondingTime = message.unbondingTime.toISOString());
        message.commission !== undefined &&
            (obj.commission = message.commission
                ? exports.Commission.toJSON(message.commission)
                : undefined);
        message.minSelfDelegation !== undefined &&
            (obj.minSelfDelegation = message.minSelfDelegation);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const message = createBaseValidator();
        message.operatorAddress = (_a = object.operatorAddress) !== null && _a !== void 0 ? _a : "";
        message.consensusPubkey =
            object.consensusPubkey !== undefined && object.consensusPubkey !== null
                ? any_1.Any.fromPartial(object.consensusPubkey)
                : undefined;
        message.jailed = (_b = object.jailed) !== null && _b !== void 0 ? _b : false;
        message.status = (_c = object.status) !== null && _c !== void 0 ? _c : 0;
        message.tokens = (_d = object.tokens) !== null && _d !== void 0 ? _d : "";
        message.delegatorShares = (_e = object.delegatorShares) !== null && _e !== void 0 ? _e : "";
        message.description =
            object.description !== undefined && object.description !== null
                ? exports.Description.fromPartial(object.description)
                : undefined;
        message.unbondingHeight = (_f = object.unbondingHeight) !== null && _f !== void 0 ? _f : "0";
        message.unbondingTime = (_g = object.unbondingTime) !== null && _g !== void 0 ? _g : undefined;
        message.commission =
            object.commission !== undefined && object.commission !== null
                ? exports.Commission.fromPartial(object.commission)
                : undefined;
        message.minSelfDelegation = (_h = object.minSelfDelegation) !== null && _h !== void 0 ? _h : "";
        return message;
    },
};
function createBaseValAddresses() {
    return { addresses: [] };
}
exports.ValAddresses = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.addresses) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValAddresses();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.addresses.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            addresses: Array.isArray(object === null || object === void 0 ? void 0 : object.addresses)
                ? object.addresses.map((e) => String(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.addresses) {
            obj.addresses = message.addresses.map((e) => e);
        }
        else {
            obj.addresses = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseValAddresses();
        message.addresses = ((_a = object.addresses) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseDVPair() {
    return { delegatorAddress: "", validatorAddress: "" };
}
exports.DVPair = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDVPair();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseDVPair();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseDVPairs() {
    return { pairs: [] };
}
exports.DVPairs = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.pairs) {
            exports.DVPair.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDVPairs();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pairs.push(exports.DVPair.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pairs: Array.isArray(object === null || object === void 0 ? void 0 : object.pairs)
                ? object.pairs.map((e) => exports.DVPair.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.pairs) {
            obj.pairs = message.pairs.map((e) => (e ? exports.DVPair.toJSON(e) : undefined));
        }
        else {
            obj.pairs = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseDVPairs();
        message.pairs = ((_a = object.pairs) === null || _a === void 0 ? void 0 : _a.map((e) => exports.DVPair.fromPartial(e))) || [];
        return message;
    },
};
function createBaseDVVTriplet() {
    return {
        delegatorAddress: "",
        validatorSrcAddress: "",
        validatorDstAddress: "",
    };
}
exports.DVVTriplet = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorSrcAddress !== "") {
            writer.uint32(18).string(message.validatorSrcAddress);
        }
        if (message.validatorDstAddress !== "") {
            writer.uint32(26).string(message.validatorDstAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDVVTriplet();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorSrcAddress = reader.string();
                    break;
                case 3:
                    message.validatorDstAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorSrcAddress: isSet(object.validatorSrcAddress)
                ? String(object.validatorSrcAddress)
                : "",
            validatorDstAddress: isSet(object.validatorDstAddress)
                ? String(object.validatorDstAddress)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorSrcAddress !== undefined &&
            (obj.validatorSrcAddress = message.validatorSrcAddress);
        message.validatorDstAddress !== undefined &&
            (obj.validatorDstAddress = message.validatorDstAddress);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseDVVTriplet();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorSrcAddress = (_b = object.validatorSrcAddress) !== null && _b !== void 0 ? _b : "";
        message.validatorDstAddress = (_c = object.validatorDstAddress) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseDVVTriplets() {
    return { triplets: [] };
}
exports.DVVTriplets = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.triplets) {
            exports.DVVTriplet.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDVVTriplets();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.triplets.push(exports.DVVTriplet.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            triplets: Array.isArray(object === null || object === void 0 ? void 0 : object.triplets)
                ? object.triplets.map((e) => exports.DVVTriplet.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.triplets) {
            obj.triplets = message.triplets.map((e) => e ? exports.DVVTriplet.toJSON(e) : undefined);
        }
        else {
            obj.triplets = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseDVVTriplets();
        message.triplets =
            ((_a = object.triplets) === null || _a === void 0 ? void 0 : _a.map((e) => exports.DVVTriplet.fromPartial(e))) || [];
        return message;
    },
};
function createBaseDelegation() {
    return { delegatorAddress: "", validatorAddress: "", shares: "" };
}
exports.Delegation = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        if (message.shares !== "") {
            writer.uint32(26).string(message.shares);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDelegation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                case 3:
                    message.shares = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
            shares: isSet(object.shares) ? String(object.shares) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        message.shares !== undefined && (obj.shares = message.shares);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseDelegation();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : "";
        message.shares = (_c = object.shares) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseUnbondingDelegation() {
    return { delegatorAddress: "", validatorAddress: "", entries: [] };
}
exports.UnbondingDelegation = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorAddress !== "") {
            writer.uint32(18).string(message.validatorAddress);
        }
        for (const v of message.entries) {
            exports.UnbondingDelegationEntry.encode(v, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUnbondingDelegation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorAddress = reader.string();
                    break;
                case 3:
                    message.entries.push(exports.UnbondingDelegationEntry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorAddress: isSet(object.validatorAddress)
                ? String(object.validatorAddress)
                : "",
            entries: Array.isArray(object === null || object === void 0 ? void 0 : object.entries)
                ? object.entries.map((e) => exports.UnbondingDelegationEntry.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = message.validatorAddress);
        if (message.entries) {
            obj.entries = message.entries.map((e) => e ? exports.UnbondingDelegationEntry.toJSON(e) : undefined);
        }
        else {
            obj.entries = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseUnbondingDelegation();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : "";
        message.entries =
            ((_c = object.entries) === null || _c === void 0 ? void 0 : _c.map((e) => exports.UnbondingDelegationEntry.fromPartial(e))) || [];
        return message;
    },
};
function createBaseUnbondingDelegationEntry() {
    return {
        creationHeight: "0",
        completionTime: undefined,
        initialBalance: "",
        balance: "",
    };
}
exports.UnbondingDelegationEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.creationHeight !== "0") {
            writer.uint32(8).int64(message.creationHeight);
        }
        if (message.completionTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(18).fork()).ldelim();
        }
        if (message.initialBalance !== "") {
            writer.uint32(26).string(message.initialBalance);
        }
        if (message.balance !== "") {
            writer.uint32(34).string(message.balance);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUnbondingDelegationEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creationHeight = longToString(reader.int64());
                    break;
                case 2:
                    message.completionTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.initialBalance = reader.string();
                    break;
                case 4:
                    message.balance = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            creationHeight: isSet(object.creationHeight)
                ? String(object.creationHeight)
                : "0",
            completionTime: isSet(object.completionTime)
                ? fromJsonTimestamp(object.completionTime)
                : undefined,
            initialBalance: isSet(object.initialBalance)
                ? String(object.initialBalance)
                : "",
            balance: isSet(object.balance) ? String(object.balance) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.creationHeight !== undefined &&
            (obj.creationHeight = message.creationHeight);
        message.completionTime !== undefined &&
            (obj.completionTime = message.completionTime.toISOString());
        message.initialBalance !== undefined &&
            (obj.initialBalance = message.initialBalance);
        message.balance !== undefined && (obj.balance = message.balance);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseUnbondingDelegationEntry();
        message.creationHeight = (_a = object.creationHeight) !== null && _a !== void 0 ? _a : "0";
        message.completionTime = (_b = object.completionTime) !== null && _b !== void 0 ? _b : undefined;
        message.initialBalance = (_c = object.initialBalance) !== null && _c !== void 0 ? _c : "";
        message.balance = (_d = object.balance) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseRedelegationEntry() {
    return {
        creationHeight: "0",
        completionTime: undefined,
        initialBalance: "",
        sharesDst: "",
    };
}
exports.RedelegationEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.creationHeight !== "0") {
            writer.uint32(8).int64(message.creationHeight);
        }
        if (message.completionTime !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(18).fork()).ldelim();
        }
        if (message.initialBalance !== "") {
            writer.uint32(26).string(message.initialBalance);
        }
        if (message.sharesDst !== "") {
            writer.uint32(34).string(message.sharesDst);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRedelegationEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creationHeight = longToString(reader.int64());
                    break;
                case 2:
                    message.completionTime = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.initialBalance = reader.string();
                    break;
                case 4:
                    message.sharesDst = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            creationHeight: isSet(object.creationHeight)
                ? String(object.creationHeight)
                : "0",
            completionTime: isSet(object.completionTime)
                ? fromJsonTimestamp(object.completionTime)
                : undefined,
            initialBalance: isSet(object.initialBalance)
                ? String(object.initialBalance)
                : "",
            sharesDst: isSet(object.sharesDst) ? String(object.sharesDst) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.creationHeight !== undefined &&
            (obj.creationHeight = message.creationHeight);
        message.completionTime !== undefined &&
            (obj.completionTime = message.completionTime.toISOString());
        message.initialBalance !== undefined &&
            (obj.initialBalance = message.initialBalance);
        message.sharesDst !== undefined && (obj.sharesDst = message.sharesDst);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseRedelegationEntry();
        message.creationHeight = (_a = object.creationHeight) !== null && _a !== void 0 ? _a : "0";
        message.completionTime = (_b = object.completionTime) !== null && _b !== void 0 ? _b : undefined;
        message.initialBalance = (_c = object.initialBalance) !== null && _c !== void 0 ? _c : "";
        message.sharesDst = (_d = object.sharesDst) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseRedelegation() {
    return {
        delegatorAddress: "",
        validatorSrcAddress: "",
        validatorDstAddress: "",
        entries: [],
    };
}
exports.Redelegation = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegatorAddress !== "") {
            writer.uint32(10).string(message.delegatorAddress);
        }
        if (message.validatorSrcAddress !== "") {
            writer.uint32(18).string(message.validatorSrcAddress);
        }
        if (message.validatorDstAddress !== "") {
            writer.uint32(26).string(message.validatorDstAddress);
        }
        for (const v of message.entries) {
            exports.RedelegationEntry.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRedelegation();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegatorAddress = reader.string();
                    break;
                case 2:
                    message.validatorSrcAddress = reader.string();
                    break;
                case 3:
                    message.validatorDstAddress = reader.string();
                    break;
                case 4:
                    message.entries.push(exports.RedelegationEntry.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegatorAddress: isSet(object.delegatorAddress)
                ? String(object.delegatorAddress)
                : "",
            validatorSrcAddress: isSet(object.validatorSrcAddress)
                ? String(object.validatorSrcAddress)
                : "",
            validatorDstAddress: isSet(object.validatorDstAddress)
                ? String(object.validatorDstAddress)
                : "",
            entries: Array.isArray(object === null || object === void 0 ? void 0 : object.entries)
                ? object.entries.map((e) => exports.RedelegationEntry.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegatorAddress !== undefined &&
            (obj.delegatorAddress = message.delegatorAddress);
        message.validatorSrcAddress !== undefined &&
            (obj.validatorSrcAddress = message.validatorSrcAddress);
        message.validatorDstAddress !== undefined &&
            (obj.validatorDstAddress = message.validatorDstAddress);
        if (message.entries) {
            obj.entries = message.entries.map((e) => e ? exports.RedelegationEntry.toJSON(e) : undefined);
        }
        else {
            obj.entries = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseRedelegation();
        message.delegatorAddress = (_a = object.delegatorAddress) !== null && _a !== void 0 ? _a : "";
        message.validatorSrcAddress = (_b = object.validatorSrcAddress) !== null && _b !== void 0 ? _b : "";
        message.validatorDstAddress = (_c = object.validatorDstAddress) !== null && _c !== void 0 ? _c : "";
        message.entries =
            ((_d = object.entries) === null || _d === void 0 ? void 0 : _d.map((e) => exports.RedelegationEntry.fromPartial(e))) || [];
        return message;
    },
};
function createBaseParams() {
    return {
        unbondingTime: undefined,
        maxValidators: 0,
        maxEntries: 0,
        historicalEntries: 0,
        bondDenom: "",
    };
}
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.unbondingTime !== undefined) {
            duration_1.Duration.encode(message.unbondingTime, writer.uint32(10).fork()).ldelim();
        }
        if (message.maxValidators !== 0) {
            writer.uint32(16).uint32(message.maxValidators);
        }
        if (message.maxEntries !== 0) {
            writer.uint32(24).uint32(message.maxEntries);
        }
        if (message.historicalEntries !== 0) {
            writer.uint32(32).uint32(message.historicalEntries);
        }
        if (message.bondDenom !== "") {
            writer.uint32(42).string(message.bondDenom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.unbondingTime = duration_1.Duration.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.maxValidators = reader.uint32();
                    break;
                case 3:
                    message.maxEntries = reader.uint32();
                    break;
                case 4:
                    message.historicalEntries = reader.uint32();
                    break;
                case 5:
                    message.bondDenom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            unbondingTime: isSet(object.unbondingTime)
                ? duration_1.Duration.fromJSON(object.unbondingTime)
                : undefined,
            maxValidators: isSet(object.maxValidators)
                ? Number(object.maxValidators)
                : 0,
            maxEntries: isSet(object.maxEntries) ? Number(object.maxEntries) : 0,
            historicalEntries: isSet(object.historicalEntries)
                ? Number(object.historicalEntries)
                : 0,
            bondDenom: isSet(object.bondDenom) ? String(object.bondDenom) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.unbondingTime !== undefined &&
            (obj.unbondingTime = message.unbondingTime
                ? duration_1.Duration.toJSON(message.unbondingTime)
                : undefined);
        message.maxValidators !== undefined &&
            (obj.maxValidators = Math.round(message.maxValidators));
        message.maxEntries !== undefined &&
            (obj.maxEntries = Math.round(message.maxEntries));
        message.historicalEntries !== undefined &&
            (obj.historicalEntries = Math.round(message.historicalEntries));
        message.bondDenom !== undefined && (obj.bondDenom = message.bondDenom);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseParams();
        message.unbondingTime =
            object.unbondingTime !== undefined && object.unbondingTime !== null
                ? duration_1.Duration.fromPartial(object.unbondingTime)
                : undefined;
        message.maxValidators = (_a = object.maxValidators) !== null && _a !== void 0 ? _a : 0;
        message.maxEntries = (_b = object.maxEntries) !== null && _b !== void 0 ? _b : 0;
        message.historicalEntries = (_c = object.historicalEntries) !== null && _c !== void 0 ? _c : 0;
        message.bondDenom = (_d = object.bondDenom) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseDelegationResponse() {
    return { delegation: undefined, balance: undefined };
}
exports.DelegationResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.delegation !== undefined) {
            exports.Delegation.encode(message.delegation, writer.uint32(10).fork()).ldelim();
        }
        if (message.balance !== undefined) {
            coin_1.Coin.encode(message.balance, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDelegationResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.delegation = exports.Delegation.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.balance = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            delegation: isSet(object.delegation)
                ? exports.Delegation.fromJSON(object.delegation)
                : undefined,
            balance: isSet(object.balance)
                ? coin_1.Coin.fromJSON(object.balance)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.delegation !== undefined &&
            (obj.delegation = message.delegation
                ? exports.Delegation.toJSON(message.delegation)
                : undefined);
        message.balance !== undefined &&
            (obj.balance = message.balance
                ? coin_1.Coin.toJSON(message.balance)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseDelegationResponse();
        message.delegation =
            object.delegation !== undefined && object.delegation !== null
                ? exports.Delegation.fromPartial(object.delegation)
                : undefined;
        message.balance =
            object.balance !== undefined && object.balance !== null
                ? coin_1.Coin.fromPartial(object.balance)
                : undefined;
        return message;
    },
};
function createBaseRedelegationEntryResponse() {
    return { redelegationEntry: undefined, balance: "" };
}
exports.RedelegationEntryResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.redelegationEntry !== undefined) {
            exports.RedelegationEntry.encode(message.redelegationEntry, writer.uint32(10).fork()).ldelim();
        }
        if (message.balance !== "") {
            writer.uint32(34).string(message.balance);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRedelegationEntryResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.redelegationEntry = exports.RedelegationEntry.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.balance = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            redelegationEntry: isSet(object.redelegationEntry)
                ? exports.RedelegationEntry.fromJSON(object.redelegationEntry)
                : undefined,
            balance: isSet(object.balance) ? String(object.balance) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.redelegationEntry !== undefined &&
            (obj.redelegationEntry = message.redelegationEntry
                ? exports.RedelegationEntry.toJSON(message.redelegationEntry)
                : undefined);
        message.balance !== undefined && (obj.balance = message.balance);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseRedelegationEntryResponse();
        message.redelegationEntry =
            object.redelegationEntry !== undefined &&
                object.redelegationEntry !== null
                ? exports.RedelegationEntry.fromPartial(object.redelegationEntry)
                : undefined;
        message.balance = (_a = object.balance) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseRedelegationResponse() {
    return { redelegation: undefined, entries: [] };
}
exports.RedelegationResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.redelegation !== undefined) {
            exports.Redelegation.encode(message.redelegation, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.entries) {
            exports.RedelegationEntryResponse.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseRedelegationResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.redelegation = exports.Redelegation.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.entries.push(exports.RedelegationEntryResponse.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            redelegation: isSet(object.redelegation)
                ? exports.Redelegation.fromJSON(object.redelegation)
                : undefined,
            entries: Array.isArray(object === null || object === void 0 ? void 0 : object.entries)
                ? object.entries.map((e) => exports.RedelegationEntryResponse.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.redelegation !== undefined &&
            (obj.redelegation = message.redelegation
                ? exports.Redelegation.toJSON(message.redelegation)
                : undefined);
        if (message.entries) {
            obj.entries = message.entries.map((e) => e ? exports.RedelegationEntryResponse.toJSON(e) : undefined);
        }
        else {
            obj.entries = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseRedelegationResponse();
        message.redelegation =
            object.redelegation !== undefined && object.redelegation !== null
                ? exports.Redelegation.fromPartial(object.redelegation)
                : undefined;
        message.entries =
            ((_a = object.entries) === null || _a === void 0 ? void 0 : _a.map((e) => exports.RedelegationEntryResponse.fromPartial(e))) ||
                [];
        return message;
    },
};
function createBasePool() {
    return { notBondedTokens: "", bondedTokens: "" };
}
exports.Pool = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.notBondedTokens !== "") {
            writer.uint32(10).string(message.notBondedTokens);
        }
        if (message.bondedTokens !== "") {
            writer.uint32(18).string(message.bondedTokens);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePool();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.notBondedTokens = reader.string();
                    break;
                case 2:
                    message.bondedTokens = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            notBondedTokens: isSet(object.notBondedTokens)
                ? String(object.notBondedTokens)
                : "",
            bondedTokens: isSet(object.bondedTokens)
                ? String(object.bondedTokens)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.notBondedTokens !== undefined &&
            (obj.notBondedTokens = message.notBondedTokens);
        message.bondedTokens !== undefined &&
            (obj.bondedTokens = message.bondedTokens);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePool();
        message.notBondedTokens = (_a = object.notBondedTokens) !== null && _a !== void 0 ? _a : "";
        message.bondedTokens = (_b = object.bondedTokens) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = Number(t.seconds) * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=staking.js.map

/***/ }),

/***/ 684:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxProof = exports.BlockMeta = exports.LightBlock = exports.SignedHeader = exports.Proposal = exports.CommitSig = exports.Commit = exports.Vote = exports.Data = exports.Header = exports.BlockID = exports.Part = exports.PartSetHeader = exports.signedMsgTypeToJSON = exports.signedMsgTypeFromJSON = exports.SignedMsgType = exports.blockIDFlagToJSON = exports.blockIDFlagFromJSON = exports.BlockIDFlag = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const timestamp_1 = __webpack_require__(142);
const proof_1 = __webpack_require__(685);
const types_1 = __webpack_require__(686);
const validator_1 = __webpack_require__(687);
exports.protobufPackage = "tendermint.types";
/** BlockIdFlag indicates which BlcokID the signature is for */
var BlockIDFlag;
(function (BlockIDFlag) {
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_UNKNOWN"] = 0] = "BLOCK_ID_FLAG_UNKNOWN";
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_ABSENT"] = 1] = "BLOCK_ID_FLAG_ABSENT";
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_COMMIT"] = 2] = "BLOCK_ID_FLAG_COMMIT";
    BlockIDFlag[BlockIDFlag["BLOCK_ID_FLAG_NIL"] = 3] = "BLOCK_ID_FLAG_NIL";
    BlockIDFlag[BlockIDFlag["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(BlockIDFlag = exports.BlockIDFlag || (exports.BlockIDFlag = {}));
function blockIDFlagFromJSON(object) {
    switch (object) {
        case 0:
        case "BLOCK_ID_FLAG_UNKNOWN":
            return BlockIDFlag.BLOCK_ID_FLAG_UNKNOWN;
        case 1:
        case "BLOCK_ID_FLAG_ABSENT":
            return BlockIDFlag.BLOCK_ID_FLAG_ABSENT;
        case 2:
        case "BLOCK_ID_FLAG_COMMIT":
            return BlockIDFlag.BLOCK_ID_FLAG_COMMIT;
        case 3:
        case "BLOCK_ID_FLAG_NIL":
            return BlockIDFlag.BLOCK_ID_FLAG_NIL;
        case -1:
        case "UNRECOGNIZED":
        default:
            return BlockIDFlag.UNRECOGNIZED;
    }
}
exports.blockIDFlagFromJSON = blockIDFlagFromJSON;
function blockIDFlagToJSON(object) {
    switch (object) {
        case BlockIDFlag.BLOCK_ID_FLAG_UNKNOWN:
            return "BLOCK_ID_FLAG_UNKNOWN";
        case BlockIDFlag.BLOCK_ID_FLAG_ABSENT:
            return "BLOCK_ID_FLAG_ABSENT";
        case BlockIDFlag.BLOCK_ID_FLAG_COMMIT:
            return "BLOCK_ID_FLAG_COMMIT";
        case BlockIDFlag.BLOCK_ID_FLAG_NIL:
            return "BLOCK_ID_FLAG_NIL";
        default:
            return "UNKNOWN";
    }
}
exports.blockIDFlagToJSON = blockIDFlagToJSON;
/** SignedMsgType is a type of signed message in the consensus. */
var SignedMsgType;
(function (SignedMsgType) {
    SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_UNKNOWN"] = 0] = "SIGNED_MSG_TYPE_UNKNOWN";
    /** SIGNED_MSG_TYPE_PREVOTE - Votes */
    SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_PREVOTE"] = 1] = "SIGNED_MSG_TYPE_PREVOTE";
    SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_PRECOMMIT"] = 2] = "SIGNED_MSG_TYPE_PRECOMMIT";
    /** SIGNED_MSG_TYPE_PROPOSAL - Proposals */
    SignedMsgType[SignedMsgType["SIGNED_MSG_TYPE_PROPOSAL"] = 32] = "SIGNED_MSG_TYPE_PROPOSAL";
    SignedMsgType[SignedMsgType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(SignedMsgType = exports.SignedMsgType || (exports.SignedMsgType = {}));
function signedMsgTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "SIGNED_MSG_TYPE_UNKNOWN":
            return SignedMsgType.SIGNED_MSG_TYPE_UNKNOWN;
        case 1:
        case "SIGNED_MSG_TYPE_PREVOTE":
            return SignedMsgType.SIGNED_MSG_TYPE_PREVOTE;
        case 2:
        case "SIGNED_MSG_TYPE_PRECOMMIT":
            return SignedMsgType.SIGNED_MSG_TYPE_PRECOMMIT;
        case 32:
        case "SIGNED_MSG_TYPE_PROPOSAL":
            return SignedMsgType.SIGNED_MSG_TYPE_PROPOSAL;
        case -1:
        case "UNRECOGNIZED":
        default:
            return SignedMsgType.UNRECOGNIZED;
    }
}
exports.signedMsgTypeFromJSON = signedMsgTypeFromJSON;
function signedMsgTypeToJSON(object) {
    switch (object) {
        case SignedMsgType.SIGNED_MSG_TYPE_UNKNOWN:
            return "SIGNED_MSG_TYPE_UNKNOWN";
        case SignedMsgType.SIGNED_MSG_TYPE_PREVOTE:
            return "SIGNED_MSG_TYPE_PREVOTE";
        case SignedMsgType.SIGNED_MSG_TYPE_PRECOMMIT:
            return "SIGNED_MSG_TYPE_PRECOMMIT";
        case SignedMsgType.SIGNED_MSG_TYPE_PROPOSAL:
            return "SIGNED_MSG_TYPE_PROPOSAL";
        default:
            return "UNKNOWN";
    }
}
exports.signedMsgTypeToJSON = signedMsgTypeToJSON;
function createBasePartSetHeader() {
    return { total: 0, hash: new Uint8Array() };
}
exports.PartSetHeader = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.total !== 0) {
            writer.uint32(8).uint32(message.total);
        }
        if (message.hash.length !== 0) {
            writer.uint32(18).bytes(message.hash);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePartSetHeader();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.total = reader.uint32();
                    break;
                case 2:
                    message.hash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            total: isSet(object.total) ? Number(object.total) : 0,
            hash: isSet(object.hash)
                ? bytesFromBase64(object.hash)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.total !== undefined && (obj.total = Math.round(message.total));
        message.hash !== undefined &&
            (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePartSetHeader();
        message.total = (_a = object.total) !== null && _a !== void 0 ? _a : 0;
        message.hash = (_b = object.hash) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
function createBasePart() {
    return { index: 0, bytes: new Uint8Array(), proof: undefined };
}
exports.Part = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.index !== 0) {
            writer.uint32(8).uint32(message.index);
        }
        if (message.bytes.length !== 0) {
            writer.uint32(18).bytes(message.bytes);
        }
        if (message.proof !== undefined) {
            proof_1.Proof.encode(message.proof, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePart();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.index = reader.uint32();
                    break;
                case 2:
                    message.bytes = reader.bytes();
                    break;
                case 3:
                    message.proof = proof_1.Proof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            index: isSet(object.index) ? Number(object.index) : 0,
            bytes: isSet(object.bytes)
                ? bytesFromBase64(object.bytes)
                : new Uint8Array(),
            proof: isSet(object.proof) ? proof_1.Proof.fromJSON(object.proof) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.bytes !== undefined &&
            (obj.bytes = base64FromBytes(message.bytes !== undefined ? message.bytes : new Uint8Array()));
        message.proof !== undefined &&
            (obj.proof = message.proof ? proof_1.Proof.toJSON(message.proof) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePart();
        message.index = (_a = object.index) !== null && _a !== void 0 ? _a : 0;
        message.bytes = (_b = object.bytes) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.proof =
            object.proof !== undefined && object.proof !== null
                ? proof_1.Proof.fromPartial(object.proof)
                : undefined;
        return message;
    },
};
function createBaseBlockID() {
    return { hash: new Uint8Array(), partSetHeader: undefined };
}
exports.BlockID = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.hash.length !== 0) {
            writer.uint32(10).bytes(message.hash);
        }
        if (message.partSetHeader !== undefined) {
            exports.PartSetHeader.encode(message.partSetHeader, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockID();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.hash = reader.bytes();
                    break;
                case 2:
                    message.partSetHeader = exports.PartSetHeader.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            hash: isSet(object.hash)
                ? bytesFromBase64(object.hash)
                : new Uint8Array(),
            partSetHeader: isSet(object.partSetHeader)
                ? exports.PartSetHeader.fromJSON(object.partSetHeader)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.hash !== undefined &&
            (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
        message.partSetHeader !== undefined &&
            (obj.partSetHeader = message.partSetHeader
                ? exports.PartSetHeader.toJSON(message.partSetHeader)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseBlockID();
        message.hash = (_a = object.hash) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.partSetHeader =
            object.partSetHeader !== undefined && object.partSetHeader !== null
                ? exports.PartSetHeader.fromPartial(object.partSetHeader)
                : undefined;
        return message;
    },
};
function createBaseHeader() {
    return {
        version: undefined,
        chainId: "",
        height: "0",
        time: undefined,
        lastBlockId: undefined,
        lastCommitHash: new Uint8Array(),
        dataHash: new Uint8Array(),
        validatorsHash: new Uint8Array(),
        nextValidatorsHash: new Uint8Array(),
        consensusHash: new Uint8Array(),
        appHash: new Uint8Array(),
        lastResultsHash: new Uint8Array(),
        evidenceHash: new Uint8Array(),
        proposerAddress: new Uint8Array(),
    };
}
exports.Header = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.version !== undefined) {
            types_1.Consensus.encode(message.version, writer.uint32(10).fork()).ldelim();
        }
        if (message.chainId !== "") {
            writer.uint32(18).string(message.chainId);
        }
        if (message.height !== "0") {
            writer.uint32(24).int64(message.height);
        }
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.time), writer.uint32(34).fork()).ldelim();
        }
        if (message.lastBlockId !== undefined) {
            exports.BlockID.encode(message.lastBlockId, writer.uint32(42).fork()).ldelim();
        }
        if (message.lastCommitHash.length !== 0) {
            writer.uint32(50).bytes(message.lastCommitHash);
        }
        if (message.dataHash.length !== 0) {
            writer.uint32(58).bytes(message.dataHash);
        }
        if (message.validatorsHash.length !== 0) {
            writer.uint32(66).bytes(message.validatorsHash);
        }
        if (message.nextValidatorsHash.length !== 0) {
            writer.uint32(74).bytes(message.nextValidatorsHash);
        }
        if (message.consensusHash.length !== 0) {
            writer.uint32(82).bytes(message.consensusHash);
        }
        if (message.appHash.length !== 0) {
            writer.uint32(90).bytes(message.appHash);
        }
        if (message.lastResultsHash.length !== 0) {
            writer.uint32(98).bytes(message.lastResultsHash);
        }
        if (message.evidenceHash.length !== 0) {
            writer.uint32(106).bytes(message.evidenceHash);
        }
        if (message.proposerAddress.length !== 0) {
            writer.uint32(114).bytes(message.proposerAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHeader();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.version = types_1.Consensus.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.chainId = reader.string();
                    break;
                case 3:
                    message.height = longToString(reader.int64());
                    break;
                case 4:
                    message.time = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.lastBlockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.lastCommitHash = reader.bytes();
                    break;
                case 7:
                    message.dataHash = reader.bytes();
                    break;
                case 8:
                    message.validatorsHash = reader.bytes();
                    break;
                case 9:
                    message.nextValidatorsHash = reader.bytes();
                    break;
                case 10:
                    message.consensusHash = reader.bytes();
                    break;
                case 11:
                    message.appHash = reader.bytes();
                    break;
                case 12:
                    message.lastResultsHash = reader.bytes();
                    break;
                case 13:
                    message.evidenceHash = reader.bytes();
                    break;
                case 14:
                    message.proposerAddress = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            version: isSet(object.version)
                ? types_1.Consensus.fromJSON(object.version)
                : undefined,
            chainId: isSet(object.chainId) ? String(object.chainId) : "",
            height: isSet(object.height) ? String(object.height) : "0",
            time: isSet(object.time) ? fromJsonTimestamp(object.time) : undefined,
            lastBlockId: isSet(object.lastBlockId)
                ? exports.BlockID.fromJSON(object.lastBlockId)
                : undefined,
            lastCommitHash: isSet(object.lastCommitHash)
                ? bytesFromBase64(object.lastCommitHash)
                : new Uint8Array(),
            dataHash: isSet(object.dataHash)
                ? bytesFromBase64(object.dataHash)
                : new Uint8Array(),
            validatorsHash: isSet(object.validatorsHash)
                ? bytesFromBase64(object.validatorsHash)
                : new Uint8Array(),
            nextValidatorsHash: isSet(object.nextValidatorsHash)
                ? bytesFromBase64(object.nextValidatorsHash)
                : new Uint8Array(),
            consensusHash: isSet(object.consensusHash)
                ? bytesFromBase64(object.consensusHash)
                : new Uint8Array(),
            appHash: isSet(object.appHash)
                ? bytesFromBase64(object.appHash)
                : new Uint8Array(),
            lastResultsHash: isSet(object.lastResultsHash)
                ? bytesFromBase64(object.lastResultsHash)
                : new Uint8Array(),
            evidenceHash: isSet(object.evidenceHash)
                ? bytesFromBase64(object.evidenceHash)
                : new Uint8Array(),
            proposerAddress: isSet(object.proposerAddress)
                ? bytesFromBase64(object.proposerAddress)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.version !== undefined &&
            (obj.version = message.version
                ? types_1.Consensus.toJSON(message.version)
                : undefined);
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.height !== undefined && (obj.height = message.height);
        message.time !== undefined && (obj.time = message.time.toISOString());
        message.lastBlockId !== undefined &&
            (obj.lastBlockId = message.lastBlockId
                ? exports.BlockID.toJSON(message.lastBlockId)
                : undefined);
        message.lastCommitHash !== undefined &&
            (obj.lastCommitHash = base64FromBytes(message.lastCommitHash !== undefined
                ? message.lastCommitHash
                : new Uint8Array()));
        message.dataHash !== undefined &&
            (obj.dataHash = base64FromBytes(message.dataHash !== undefined ? message.dataHash : new Uint8Array()));
        message.validatorsHash !== undefined &&
            (obj.validatorsHash = base64FromBytes(message.validatorsHash !== undefined
                ? message.validatorsHash
                : new Uint8Array()));
        message.nextValidatorsHash !== undefined &&
            (obj.nextValidatorsHash = base64FromBytes(message.nextValidatorsHash !== undefined
                ? message.nextValidatorsHash
                : new Uint8Array()));
        message.consensusHash !== undefined &&
            (obj.consensusHash = base64FromBytes(message.consensusHash !== undefined
                ? message.consensusHash
                : new Uint8Array()));
        message.appHash !== undefined &&
            (obj.appHash = base64FromBytes(message.appHash !== undefined ? message.appHash : new Uint8Array()));
        message.lastResultsHash !== undefined &&
            (obj.lastResultsHash = base64FromBytes(message.lastResultsHash !== undefined
                ? message.lastResultsHash
                : new Uint8Array()));
        message.evidenceHash !== undefined &&
            (obj.evidenceHash = base64FromBytes(message.evidenceHash !== undefined
                ? message.evidenceHash
                : new Uint8Array()));
        message.proposerAddress !== undefined &&
            (obj.proposerAddress = base64FromBytes(message.proposerAddress !== undefined
                ? message.proposerAddress
                : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const message = createBaseHeader();
        message.version =
            object.version !== undefined && object.version !== null
                ? types_1.Consensus.fromPartial(object.version)
                : undefined;
        message.chainId = (_a = object.chainId) !== null && _a !== void 0 ? _a : "";
        message.height = (_b = object.height) !== null && _b !== void 0 ? _b : "0";
        message.time = (_c = object.time) !== null && _c !== void 0 ? _c : undefined;
        message.lastBlockId =
            object.lastBlockId !== undefined && object.lastBlockId !== null
                ? exports.BlockID.fromPartial(object.lastBlockId)
                : undefined;
        message.lastCommitHash = (_d = object.lastCommitHash) !== null && _d !== void 0 ? _d : new Uint8Array();
        message.dataHash = (_e = object.dataHash) !== null && _e !== void 0 ? _e : new Uint8Array();
        message.validatorsHash = (_f = object.validatorsHash) !== null && _f !== void 0 ? _f : new Uint8Array();
        message.nextValidatorsHash = (_g = object.nextValidatorsHash) !== null && _g !== void 0 ? _g : new Uint8Array();
        message.consensusHash = (_h = object.consensusHash) !== null && _h !== void 0 ? _h : new Uint8Array();
        message.appHash = (_j = object.appHash) !== null && _j !== void 0 ? _j : new Uint8Array();
        message.lastResultsHash = (_k = object.lastResultsHash) !== null && _k !== void 0 ? _k : new Uint8Array();
        message.evidenceHash = (_l = object.evidenceHash) !== null && _l !== void 0 ? _l : new Uint8Array();
        message.proposerAddress = (_m = object.proposerAddress) !== null && _m !== void 0 ? _m : new Uint8Array();
        return message;
    },
};
function createBaseData() {
    return { txs: [] };
}
exports.Data = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.txs) {
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.txs.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            txs: Array.isArray(object === null || object === void 0 ? void 0 : object.txs)
                ? object.txs.map((e) => bytesFromBase64(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.txs) {
            obj.txs = message.txs.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.txs = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseData();
        message.txs = ((_a = object.txs) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseVote() {
    return {
        type: 0,
        height: "0",
        round: 0,
        blockId: undefined,
        timestamp: undefined,
        validatorAddress: new Uint8Array(),
        validatorIndex: 0,
        signature: new Uint8Array(),
    };
}
exports.Vote = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.height !== "0") {
            writer.uint32(16).int64(message.height);
        }
        if (message.round !== 0) {
            writer.uint32(24).int32(message.round);
        }
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(34).fork()).ldelim();
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(42).fork()).ldelim();
        }
        if (message.validatorAddress.length !== 0) {
            writer.uint32(50).bytes(message.validatorAddress);
        }
        if (message.validatorIndex !== 0) {
            writer.uint32(56).int32(message.validatorIndex);
        }
        if (message.signature.length !== 0) {
            writer.uint32(66).bytes(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVote();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.height = longToString(reader.int64());
                    break;
                case 3:
                    message.round = reader.int32();
                    break;
                case 4:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.timestamp = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.validatorAddress = reader.bytes();
                    break;
                case 7:
                    message.validatorIndex = reader.int32();
                    break;
                case 8:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            type: isSet(object.type) ? signedMsgTypeFromJSON(object.type) : 0,
            height: isSet(object.height) ? String(object.height) : "0",
            round: isSet(object.round) ? Number(object.round) : 0,
            blockId: isSet(object.blockId)
                ? exports.BlockID.fromJSON(object.blockId)
                : undefined,
            timestamp: isSet(object.timestamp)
                ? fromJsonTimestamp(object.timestamp)
                : undefined,
            validatorAddress: isSet(object.validatorAddress)
                ? bytesFromBase64(object.validatorAddress)
                : new Uint8Array(),
            validatorIndex: isSet(object.validatorIndex)
                ? Number(object.validatorIndex)
                : 0,
            signature: isSet(object.signature)
                ? bytesFromBase64(object.signature)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined &&
            (obj.type = signedMsgTypeToJSON(message.type));
        message.height !== undefined && (obj.height = message.height);
        message.round !== undefined && (obj.round = Math.round(message.round));
        message.blockId !== undefined &&
            (obj.blockId = message.blockId
                ? exports.BlockID.toJSON(message.blockId)
                : undefined);
        message.timestamp !== undefined &&
            (obj.timestamp = message.timestamp.toISOString());
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = base64FromBytes(message.validatorAddress !== undefined
                ? message.validatorAddress
                : new Uint8Array()));
        message.validatorIndex !== undefined &&
            (obj.validatorIndex = Math.round(message.validatorIndex));
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g;
        const message = createBaseVote();
        message.type = (_a = object.type) !== null && _a !== void 0 ? _a : 0;
        message.height = (_b = object.height) !== null && _b !== void 0 ? _b : "0";
        message.round = (_c = object.round) !== null && _c !== void 0 ? _c : 0;
        message.blockId =
            object.blockId !== undefined && object.blockId !== null
                ? exports.BlockID.fromPartial(object.blockId)
                : undefined;
        message.timestamp = (_d = object.timestamp) !== null && _d !== void 0 ? _d : undefined;
        message.validatorAddress = (_e = object.validatorAddress) !== null && _e !== void 0 ? _e : new Uint8Array();
        message.validatorIndex = (_f = object.validatorIndex) !== null && _f !== void 0 ? _f : 0;
        message.signature = (_g = object.signature) !== null && _g !== void 0 ? _g : new Uint8Array();
        return message;
    },
};
function createBaseCommit() {
    return { height: "0", round: 0, blockId: undefined, signatures: [] };
}
exports.Commit = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.height !== "0") {
            writer.uint32(8).int64(message.height);
        }
        if (message.round !== 0) {
            writer.uint32(16).int32(message.round);
        }
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(26).fork()).ldelim();
        }
        for (const v of message.signatures) {
            exports.CommitSig.encode(v, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.height = longToString(reader.int64());
                    break;
                case 2:
                    message.round = reader.int32();
                    break;
                case 3:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.signatures.push(exports.CommitSig.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            height: isSet(object.height) ? String(object.height) : "0",
            round: isSet(object.round) ? Number(object.round) : 0,
            blockId: isSet(object.blockId)
                ? exports.BlockID.fromJSON(object.blockId)
                : undefined,
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => exports.CommitSig.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.height !== undefined && (obj.height = message.height);
        message.round !== undefined && (obj.round = Math.round(message.round));
        message.blockId !== undefined &&
            (obj.blockId = message.blockId
                ? exports.BlockID.toJSON(message.blockId)
                : undefined);
        if (message.signatures) {
            obj.signatures = message.signatures.map((e) => e ? exports.CommitSig.toJSON(e) : undefined);
        }
        else {
            obj.signatures = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseCommit();
        message.height = (_a = object.height) !== null && _a !== void 0 ? _a : "0";
        message.round = (_b = object.round) !== null && _b !== void 0 ? _b : 0;
        message.blockId =
            object.blockId !== undefined && object.blockId !== null
                ? exports.BlockID.fromPartial(object.blockId)
                : undefined;
        message.signatures =
            ((_c = object.signatures) === null || _c === void 0 ? void 0 : _c.map((e) => exports.CommitSig.fromPartial(e))) || [];
        return message;
    },
};
function createBaseCommitSig() {
    return {
        blockIdFlag: 0,
        validatorAddress: new Uint8Array(),
        timestamp: undefined,
        signature: new Uint8Array(),
    };
}
exports.CommitSig = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.blockIdFlag !== 0) {
            writer.uint32(8).int32(message.blockIdFlag);
        }
        if (message.validatorAddress.length !== 0) {
            writer.uint32(18).bytes(message.validatorAddress);
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(26).fork()).ldelim();
        }
        if (message.signature.length !== 0) {
            writer.uint32(34).bytes(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCommitSig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.blockIdFlag = reader.int32();
                    break;
                case 2:
                    message.validatorAddress = reader.bytes();
                    break;
                case 3:
                    message.timestamp = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            blockIdFlag: isSet(object.blockIdFlag)
                ? blockIDFlagFromJSON(object.blockIdFlag)
                : 0,
            validatorAddress: isSet(object.validatorAddress)
                ? bytesFromBase64(object.validatorAddress)
                : new Uint8Array(),
            timestamp: isSet(object.timestamp)
                ? fromJsonTimestamp(object.timestamp)
                : undefined,
            signature: isSet(object.signature)
                ? bytesFromBase64(object.signature)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.blockIdFlag !== undefined &&
            (obj.blockIdFlag = blockIDFlagToJSON(message.blockIdFlag));
        message.validatorAddress !== undefined &&
            (obj.validatorAddress = base64FromBytes(message.validatorAddress !== undefined
                ? message.validatorAddress
                : new Uint8Array()));
        message.timestamp !== undefined &&
            (obj.timestamp = message.timestamp.toISOString());
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseCommitSig();
        message.blockIdFlag = (_a = object.blockIdFlag) !== null && _a !== void 0 ? _a : 0;
        message.validatorAddress = (_b = object.validatorAddress) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.timestamp = (_c = object.timestamp) !== null && _c !== void 0 ? _c : undefined;
        message.signature = (_d = object.signature) !== null && _d !== void 0 ? _d : new Uint8Array();
        return message;
    },
};
function createBaseProposal() {
    return {
        type: 0,
        height: "0",
        round: 0,
        polRound: 0,
        blockId: undefined,
        timestamp: undefined,
        signature: new Uint8Array(),
    };
}
exports.Proposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.height !== "0") {
            writer.uint32(16).int64(message.height);
        }
        if (message.round !== 0) {
            writer.uint32(24).int32(message.round);
        }
        if (message.polRound !== 0) {
            writer.uint32(32).int32(message.polRound);
        }
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(42).fork()).ldelim();
        }
        if (message.timestamp !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(50).fork()).ldelim();
        }
        if (message.signature.length !== 0) {
            writer.uint32(58).bytes(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.height = longToString(reader.int64());
                    break;
                case 3:
                    message.round = reader.int32();
                    break;
                case 4:
                    message.polRound = reader.int32();
                    break;
                case 5:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.timestamp = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 7:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            type: isSet(object.type) ? signedMsgTypeFromJSON(object.type) : 0,
            height: isSet(object.height) ? String(object.height) : "0",
            round: isSet(object.round) ? Number(object.round) : 0,
            polRound: isSet(object.polRound) ? Number(object.polRound) : 0,
            blockId: isSet(object.blockId)
                ? exports.BlockID.fromJSON(object.blockId)
                : undefined,
            timestamp: isSet(object.timestamp)
                ? fromJsonTimestamp(object.timestamp)
                : undefined,
            signature: isSet(object.signature)
                ? bytesFromBase64(object.signature)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined &&
            (obj.type = signedMsgTypeToJSON(message.type));
        message.height !== undefined && (obj.height = message.height);
        message.round !== undefined && (obj.round = Math.round(message.round));
        message.polRound !== undefined &&
            (obj.polRound = Math.round(message.polRound));
        message.blockId !== undefined &&
            (obj.blockId = message.blockId
                ? exports.BlockID.toJSON(message.blockId)
                : undefined);
        message.timestamp !== undefined &&
            (obj.timestamp = message.timestamp.toISOString());
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBaseProposal();
        message.type = (_a = object.type) !== null && _a !== void 0 ? _a : 0;
        message.height = (_b = object.height) !== null && _b !== void 0 ? _b : "0";
        message.round = (_c = object.round) !== null && _c !== void 0 ? _c : 0;
        message.polRound = (_d = object.polRound) !== null && _d !== void 0 ? _d : 0;
        message.blockId =
            object.blockId !== undefined && object.blockId !== null
                ? exports.BlockID.fromPartial(object.blockId)
                : undefined;
        message.timestamp = (_e = object.timestamp) !== null && _e !== void 0 ? _e : undefined;
        message.signature = (_f = object.signature) !== null && _f !== void 0 ? _f : new Uint8Array();
        return message;
    },
};
function createBaseSignedHeader() {
    return { header: undefined, commit: undefined };
}
exports.SignedHeader = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.header !== undefined) {
            exports.Header.encode(message.header, writer.uint32(10).fork()).ldelim();
        }
        if (message.commit !== undefined) {
            exports.Commit.encode(message.commit, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSignedHeader();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.header = exports.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.commit = exports.Commit.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            header: isSet(object.header) ? exports.Header.fromJSON(object.header) : undefined,
            commit: isSet(object.commit) ? exports.Commit.fromJSON(object.commit) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.header !== undefined &&
            (obj.header = message.header ? exports.Header.toJSON(message.header) : undefined);
        message.commit !== undefined &&
            (obj.commit = message.commit ? exports.Commit.toJSON(message.commit) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseSignedHeader();
        message.header =
            object.header !== undefined && object.header !== null
                ? exports.Header.fromPartial(object.header)
                : undefined;
        message.commit =
            object.commit !== undefined && object.commit !== null
                ? exports.Commit.fromPartial(object.commit)
                : undefined;
        return message;
    },
};
function createBaseLightBlock() {
    return { signedHeader: undefined, validatorSet: undefined };
}
exports.LightBlock = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.signedHeader !== undefined) {
            exports.SignedHeader.encode(message.signedHeader, writer.uint32(10).fork()).ldelim();
        }
        if (message.validatorSet !== undefined) {
            validator_1.ValidatorSet.encode(message.validatorSet, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLightBlock();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.signedHeader = exports.SignedHeader.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.validatorSet = validator_1.ValidatorSet.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            signedHeader: isSet(object.signedHeader)
                ? exports.SignedHeader.fromJSON(object.signedHeader)
                : undefined,
            validatorSet: isSet(object.validatorSet)
                ? validator_1.ValidatorSet.fromJSON(object.validatorSet)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.signedHeader !== undefined &&
            (obj.signedHeader = message.signedHeader
                ? exports.SignedHeader.toJSON(message.signedHeader)
                : undefined);
        message.validatorSet !== undefined &&
            (obj.validatorSet = message.validatorSet
                ? validator_1.ValidatorSet.toJSON(message.validatorSet)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseLightBlock();
        message.signedHeader =
            object.signedHeader !== undefined && object.signedHeader !== null
                ? exports.SignedHeader.fromPartial(object.signedHeader)
                : undefined;
        message.validatorSet =
            object.validatorSet !== undefined && object.validatorSet !== null
                ? validator_1.ValidatorSet.fromPartial(object.validatorSet)
                : undefined;
        return message;
    },
};
function createBaseBlockMeta() {
    return { blockId: undefined, blockSize: "0", header: undefined, numTxs: "0" };
}
exports.BlockMeta = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.blockId !== undefined) {
            exports.BlockID.encode(message.blockId, writer.uint32(10).fork()).ldelim();
        }
        if (message.blockSize !== "0") {
            writer.uint32(16).int64(message.blockSize);
        }
        if (message.header !== undefined) {
            exports.Header.encode(message.header, writer.uint32(26).fork()).ldelim();
        }
        if (message.numTxs !== "0") {
            writer.uint32(32).int64(message.numTxs);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBlockMeta();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.blockId = exports.BlockID.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.blockSize = longToString(reader.int64());
                    break;
                case 3:
                    message.header = exports.Header.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.numTxs = longToString(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            blockId: isSet(object.blockId)
                ? exports.BlockID.fromJSON(object.blockId)
                : undefined,
            blockSize: isSet(object.blockSize) ? String(object.blockSize) : "0",
            header: isSet(object.header) ? exports.Header.fromJSON(object.header) : undefined,
            numTxs: isSet(object.numTxs) ? String(object.numTxs) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.blockId !== undefined &&
            (obj.blockId = message.blockId
                ? exports.BlockID.toJSON(message.blockId)
                : undefined);
        message.blockSize !== undefined && (obj.blockSize = message.blockSize);
        message.header !== undefined &&
            (obj.header = message.header ? exports.Header.toJSON(message.header) : undefined);
        message.numTxs !== undefined && (obj.numTxs = message.numTxs);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseBlockMeta();
        message.blockId =
            object.blockId !== undefined && object.blockId !== null
                ? exports.BlockID.fromPartial(object.blockId)
                : undefined;
        message.blockSize = (_a = object.blockSize) !== null && _a !== void 0 ? _a : "0";
        message.header =
            object.header !== undefined && object.header !== null
                ? exports.Header.fromPartial(object.header)
                : undefined;
        message.numTxs = (_b = object.numTxs) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseTxProof() {
    return {
        rootHash: new Uint8Array(),
        data: new Uint8Array(),
        proof: undefined,
    };
}
exports.TxProof = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.rootHash.length !== 0) {
            writer.uint32(10).bytes(message.rootHash);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        if (message.proof !== undefined) {
            proof_1.Proof.encode(message.proof, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTxProof();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.rootHash = reader.bytes();
                    break;
                case 2:
                    message.data = reader.bytes();
                    break;
                case 3:
                    message.proof = proof_1.Proof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            rootHash: isSet(object.rootHash)
                ? bytesFromBase64(object.rootHash)
                : new Uint8Array(),
            data: isSet(object.data)
                ? bytesFromBase64(object.data)
                : new Uint8Array(),
            proof: isSet(object.proof) ? proof_1.Proof.fromJSON(object.proof) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.rootHash !== undefined &&
            (obj.rootHash = base64FromBytes(message.rootHash !== undefined ? message.rootHash : new Uint8Array()));
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        message.proof !== undefined &&
            (obj.proof = message.proof ? proof_1.Proof.toJSON(message.proof) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseTxProof();
        message.rootHash = (_a = object.rootHash) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.data = (_b = object.data) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.proof =
            object.proof !== undefined && object.proof !== null
                ? proof_1.Proof.fromPartial(object.proof)
                : undefined;
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = Number(t.seconds) * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=types.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 685:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofOps = exports.ProofOp = exports.DominoOp = exports.ValueOp = exports.Proof = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "tendermint.crypto";
function createBaseProof() {
    return { total: "0", index: "0", leafHash: new Uint8Array(), aunts: [] };
}
exports.Proof = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.total !== "0") {
            writer.uint32(8).int64(message.total);
        }
        if (message.index !== "0") {
            writer.uint32(16).int64(message.index);
        }
        if (message.leafHash.length !== 0) {
            writer.uint32(26).bytes(message.leafHash);
        }
        for (const v of message.aunts) {
            writer.uint32(34).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProof();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.total = longToString(reader.int64());
                    break;
                case 2:
                    message.index = longToString(reader.int64());
                    break;
                case 3:
                    message.leafHash = reader.bytes();
                    break;
                case 4:
                    message.aunts.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            total: isSet(object.total) ? String(object.total) : "0",
            index: isSet(object.index) ? String(object.index) : "0",
            leafHash: isSet(object.leafHash)
                ? bytesFromBase64(object.leafHash)
                : new Uint8Array(),
            aunts: Array.isArray(object === null || object === void 0 ? void 0 : object.aunts)
                ? object.aunts.map((e) => bytesFromBase64(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.total !== undefined && (obj.total = message.total);
        message.index !== undefined && (obj.index = message.index);
        message.leafHash !== undefined &&
            (obj.leafHash = base64FromBytes(message.leafHash !== undefined ? message.leafHash : new Uint8Array()));
        if (message.aunts) {
            obj.aunts = message.aunts.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.aunts = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseProof();
        message.total = (_a = object.total) !== null && _a !== void 0 ? _a : "0";
        message.index = (_b = object.index) !== null && _b !== void 0 ? _b : "0";
        message.leafHash = (_c = object.leafHash) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.aunts = ((_d = object.aunts) === null || _d === void 0 ? void 0 : _d.map((e) => e)) || [];
        return message;
    },
};
function createBaseValueOp() {
    return { key: new Uint8Array(), proof: undefined };
}
exports.ValueOp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        if (message.proof !== undefined) {
            exports.Proof.encode(message.proof, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValueOp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                case 2:
                    message.proof = exports.Proof.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
            proof: isSet(object.proof) ? exports.Proof.fromJSON(object.proof) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        message.proof !== undefined &&
            (obj.proof = message.proof ? exports.Proof.toJSON(message.proof) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseValueOp();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.proof =
            object.proof !== undefined && object.proof !== null
                ? exports.Proof.fromPartial(object.proof)
                : undefined;
        return message;
    },
};
function createBaseDominoOp() {
    return { key: "", input: "", output: "" };
}
exports.DominoOp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.input !== "") {
            writer.uint32(18).string(message.input);
        }
        if (message.output !== "") {
            writer.uint32(26).string(message.output);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDominoOp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.input = reader.string();
                    break;
                case 3:
                    message.output = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            input: isSet(object.input) ? String(object.input) : "",
            output: isSet(object.output) ? String(object.output) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.input !== undefined && (obj.input = message.input);
        message.output !== undefined && (obj.output = message.output);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseDominoOp();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : "";
        message.input = (_b = object.input) !== null && _b !== void 0 ? _b : "";
        message.output = (_c = object.output) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseProofOp() {
    return { type: "", key: new Uint8Array(), data: new Uint8Array() };
}
exports.ProofOp = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.type !== "") {
            writer.uint32(10).string(message.type);
        }
        if (message.key.length !== 0) {
            writer.uint32(18).bytes(message.key);
        }
        if (message.data.length !== 0) {
            writer.uint32(26).bytes(message.data);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProofOp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.key = reader.bytes();
                    break;
                case 3:
                    message.data = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            type: isSet(object.type) ? String(object.type) : "",
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
            data: isSet(object.data)
                ? bytesFromBase64(object.data)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = message.type);
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseProofOp();
        message.type = (_a = object.type) !== null && _a !== void 0 ? _a : "";
        message.key = (_b = object.key) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.data = (_c = object.data) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseProofOps() {
    return { ops: [] };
}
exports.ProofOps = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.ops) {
            exports.ProofOp.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProofOps();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ops.push(exports.ProofOp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ops: Array.isArray(object === null || object === void 0 ? void 0 : object.ops)
                ? object.ops.map((e) => exports.ProofOp.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.ops) {
            obj.ops = message.ops.map((e) => (e ? exports.ProofOp.toJSON(e) : undefined));
        }
        else {
            obj.ops = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseProofOps();
        message.ops = ((_a = object.ops) === null || _a === void 0 ? void 0 : _a.map((e) => exports.ProofOp.fromPartial(e))) || [];
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=proof.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 686:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consensus = exports.App = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "tendermint.version";
function createBaseApp() {
    return { protocol: "0", software: "" };
}
exports.App = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.protocol !== "0") {
            writer.uint32(8).uint64(message.protocol);
        }
        if (message.software !== "") {
            writer.uint32(18).string(message.software);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseApp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.protocol = longToString(reader.uint64());
                    break;
                case 2:
                    message.software = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            protocol: isSet(object.protocol) ? String(object.protocol) : "0",
            software: isSet(object.software) ? String(object.software) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.protocol !== undefined && (obj.protocol = message.protocol);
        message.software !== undefined && (obj.software = message.software);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseApp();
        message.protocol = (_a = object.protocol) !== null && _a !== void 0 ? _a : "0";
        message.software = (_b = object.software) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseConsensus() {
    return { block: "0", app: "0" };
}
exports.Consensus = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.block !== "0") {
            writer.uint32(8).uint64(message.block);
        }
        if (message.app !== "0") {
            writer.uint32(16).uint64(message.app);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConsensus();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.block = longToString(reader.uint64());
                    break;
                case 2:
                    message.app = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            block: isSet(object.block) ? String(object.block) : "0",
            app: isSet(object.app) ? String(object.app) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.block !== undefined && (obj.block = message.block);
        message.app !== undefined && (obj.app = message.app);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseConsensus();
        message.block = (_a = object.block) !== null && _a !== void 0 ? _a : "0";
        message.app = (_b = object.app) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 687:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleValidator = exports.Validator = exports.ValidatorSet = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const keys_1 = __webpack_require__(688);
exports.protobufPackage = "tendermint.types";
function createBaseValidatorSet() {
    return { validators: [], proposer: undefined, totalVotingPower: "0" };
}
exports.ValidatorSet = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.validators) {
            exports.Validator.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.proposer !== undefined) {
            exports.Validator.encode(message.proposer, writer.uint32(18).fork()).ldelim();
        }
        if (message.totalVotingPower !== "0") {
            writer.uint32(24).int64(message.totalVotingPower);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidatorSet();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.validators.push(exports.Validator.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.proposer = exports.Validator.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.totalVotingPower = longToString(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            validators: Array.isArray(object === null || object === void 0 ? void 0 : object.validators)
                ? object.validators.map((e) => exports.Validator.fromJSON(e))
                : [],
            proposer: isSet(object.proposer)
                ? exports.Validator.fromJSON(object.proposer)
                : undefined,
            totalVotingPower: isSet(object.totalVotingPower)
                ? String(object.totalVotingPower)
                : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.validators) {
            obj.validators = message.validators.map((e) => e ? exports.Validator.toJSON(e) : undefined);
        }
        else {
            obj.validators = [];
        }
        message.proposer !== undefined &&
            (obj.proposer = message.proposer
                ? exports.Validator.toJSON(message.proposer)
                : undefined);
        message.totalVotingPower !== undefined &&
            (obj.totalVotingPower = message.totalVotingPower);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseValidatorSet();
        message.validators =
            ((_a = object.validators) === null || _a === void 0 ? void 0 : _a.map((e) => exports.Validator.fromPartial(e))) || [];
        message.proposer =
            object.proposer !== undefined && object.proposer !== null
                ? exports.Validator.fromPartial(object.proposer)
                : undefined;
        message.totalVotingPower = (_b = object.totalVotingPower) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseValidator() {
    return {
        address: new Uint8Array(),
        pubKey: undefined,
        votingPower: "0",
        proposerPriority: "0",
    };
}
exports.Validator = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address.length !== 0) {
            writer.uint32(10).bytes(message.address);
        }
        if (message.pubKey !== undefined) {
            keys_1.PublicKey.encode(message.pubKey, writer.uint32(18).fork()).ldelim();
        }
        if (message.votingPower !== "0") {
            writer.uint32(24).int64(message.votingPower);
        }
        if (message.proposerPriority !== "0") {
            writer.uint32(32).int64(message.proposerPriority);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseValidator();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.bytes();
                    break;
                case 2:
                    message.pubKey = keys_1.PublicKey.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.votingPower = longToString(reader.int64());
                    break;
                case 4:
                    message.proposerPriority = longToString(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            address: isSet(object.address)
                ? bytesFromBase64(object.address)
                : new Uint8Array(),
            pubKey: isSet(object.pubKey)
                ? keys_1.PublicKey.fromJSON(object.pubKey)
                : undefined,
            votingPower: isSet(object.votingPower) ? String(object.votingPower) : "0",
            proposerPriority: isSet(object.proposerPriority)
                ? String(object.proposerPriority)
                : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined &&
            (obj.address = base64FromBytes(message.address !== undefined ? message.address : new Uint8Array()));
        message.pubKey !== undefined &&
            (obj.pubKey = message.pubKey
                ? keys_1.PublicKey.toJSON(message.pubKey)
                : undefined);
        message.votingPower !== undefined &&
            (obj.votingPower = message.votingPower);
        message.proposerPriority !== undefined &&
            (obj.proposerPriority = message.proposerPriority);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseValidator();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.pubKey =
            object.pubKey !== undefined && object.pubKey !== null
                ? keys_1.PublicKey.fromPartial(object.pubKey)
                : undefined;
        message.votingPower = (_b = object.votingPower) !== null && _b !== void 0 ? _b : "0";
        message.proposerPriority = (_c = object.proposerPriority) !== null && _c !== void 0 ? _c : "0";
        return message;
    },
};
function createBaseSimpleValidator() {
    return { pubKey: undefined, votingPower: "0" };
}
exports.SimpleValidator = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pubKey !== undefined) {
            keys_1.PublicKey.encode(message.pubKey, writer.uint32(10).fork()).ldelim();
        }
        if (message.votingPower !== "0") {
            writer.uint32(16).int64(message.votingPower);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSimpleValidator();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pubKey = keys_1.PublicKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.votingPower = longToString(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pubKey: isSet(object.pubKey)
                ? keys_1.PublicKey.fromJSON(object.pubKey)
                : undefined,
            votingPower: isSet(object.votingPower) ? String(object.votingPower) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.pubKey !== undefined &&
            (obj.pubKey = message.pubKey
                ? keys_1.PublicKey.toJSON(message.pubKey)
                : undefined);
        message.votingPower !== undefined &&
            (obj.votingPower = message.votingPower);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseSimpleValidator();
        message.pubKey =
            object.pubKey !== undefined && object.pubKey !== null
                ? keys_1.PublicKey.fromPartial(object.pubKey)
                : undefined;
        message.votingPower = (_a = object.votingPower) !== null && _a !== void 0 ? _a : "0";
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=validator.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 688:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "tendermint.crypto";
function createBasePublicKey() {
    return { ed25519: undefined, secp256k1: undefined };
}
exports.PublicKey = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ed25519 !== undefined) {
            writer.uint32(10).bytes(message.ed25519);
        }
        if (message.secp256k1 !== undefined) {
            writer.uint32(18).bytes(message.secp256k1);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePublicKey();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ed25519 = reader.bytes();
                    break;
                case 2:
                    message.secp256k1 = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ed25519: isSet(object.ed25519)
                ? bytesFromBase64(object.ed25519)
                : undefined,
            secp256k1: isSet(object.secp256k1)
                ? bytesFromBase64(object.secp256k1)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.ed25519 !== undefined &&
            (obj.ed25519 =
                message.ed25519 !== undefined
                    ? base64FromBytes(message.ed25519)
                    : undefined);
        message.secp256k1 !== undefined &&
            (obj.secp256k1 =
                message.secp256k1 !== undefined
                    ? base64FromBytes(message.secp256k1)
                    : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasePublicKey();
        message.ed25519 = (_a = object.ed25519) !== null && _a !== void 0 ? _a : undefined;
        message.secp256k1 = (_b = object.secp256k1) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=keys.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 689:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgRevokeResponse = exports.MsgRevoke = exports.MsgGrantResponse = exports.MsgExec = exports.MsgExecResponse = exports.MsgGrant = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const authz_1 = __webpack_require__(597);
const any_1 = __webpack_require__(83);
exports.protobufPackage = "cosmos.authz.v1beta1";
function createBaseMsgGrant() {
    return { granter: "", grantee: "", grant: undefined };
}
exports.MsgGrant = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.granter !== "") {
            writer.uint32(10).string(message.granter);
        }
        if (message.grantee !== "") {
            writer.uint32(18).string(message.grantee);
        }
        if (message.grant !== undefined) {
            authz_1.Grant.encode(message.grant, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgGrant();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.granter = reader.string();
                    break;
                case 2:
                    message.grantee = reader.string();
                    break;
                case 3:
                    message.grant = authz_1.Grant.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            granter: isSet(object.granter) ? String(object.granter) : "",
            grantee: isSet(object.grantee) ? String(object.grantee) : "",
            grant: isSet(object.grant) ? authz_1.Grant.fromJSON(object.grant) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.granter !== undefined && (obj.granter = message.granter);
        message.grantee !== undefined && (obj.grantee = message.grantee);
        message.grant !== undefined &&
            (obj.grant = message.grant ? authz_1.Grant.toJSON(message.grant) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgGrant();
        message.granter = (_a = object.granter) !== null && _a !== void 0 ? _a : "";
        message.grantee = (_b = object.grantee) !== null && _b !== void 0 ? _b : "";
        message.grant =
            object.grant !== undefined && object.grant !== null
                ? authz_1.Grant.fromPartial(object.grant)
                : undefined;
        return message;
    },
};
function createBaseMsgExecResponse() {
    return { results: [] };
}
exports.MsgExecResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.results) {
            writer.uint32(10).bytes(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExecResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.results.push(reader.bytes());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            results: Array.isArray(object === null || object === void 0 ? void 0 : object.results)
                ? object.results.map((e) => bytesFromBase64(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.results) {
            obj.results = message.results.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
        }
        else {
            obj.results = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseMsgExecResponse();
        message.results = ((_a = object.results) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function createBaseMsgExec() {
    return { grantee: "", msgs: [] };
}
exports.MsgExec = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.grantee !== "") {
            writer.uint32(10).string(message.grantee);
        }
        for (const v of message.msgs) {
            any_1.Any.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgExec();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.grantee = reader.string();
                    break;
                case 2:
                    message.msgs.push(any_1.Any.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            grantee: isSet(object.grantee) ? String(object.grantee) : "",
            msgs: Array.isArray(object === null || object === void 0 ? void 0 : object.msgs)
                ? object.msgs.map((e) => any_1.Any.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.grantee !== undefined && (obj.grantee = message.grantee);
        if (message.msgs) {
            obj.msgs = message.msgs.map((e) => (e ? any_1.Any.toJSON(e) : undefined));
        }
        else {
            obj.msgs = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseMsgExec();
        message.grantee = (_a = object.grantee) !== null && _a !== void 0 ? _a : "";
        message.msgs = ((_b = object.msgs) === null || _b === void 0 ? void 0 : _b.map((e) => any_1.Any.fromPartial(e))) || [];
        return message;
    },
};
function createBaseMsgGrantResponse() {
    return {};
}
exports.MsgGrantResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgGrantResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgGrantResponse();
        return message;
    },
};
function createBaseMsgRevoke() {
    return { granter: "", grantee: "", msgTypeUrl: "" };
}
exports.MsgRevoke = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.granter !== "") {
            writer.uint32(10).string(message.granter);
        }
        if (message.grantee !== "") {
            writer.uint32(18).string(message.grantee);
        }
        if (message.msgTypeUrl !== "") {
            writer.uint32(26).string(message.msgTypeUrl);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRevoke();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.granter = reader.string();
                    break;
                case 2:
                    message.grantee = reader.string();
                    break;
                case 3:
                    message.msgTypeUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            granter: isSet(object.granter) ? String(object.granter) : "",
            grantee: isSet(object.grantee) ? String(object.grantee) : "",
            msgTypeUrl: isSet(object.msgTypeUrl) ? String(object.msgTypeUrl) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.granter !== undefined && (obj.granter = message.granter);
        message.grantee !== undefined && (obj.grantee = message.grantee);
        message.msgTypeUrl !== undefined && (obj.msgTypeUrl = message.msgTypeUrl);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgRevoke();
        message.granter = (_a = object.granter) !== null && _a !== void 0 ? _a : "";
        message.grantee = (_b = object.grantee) !== null && _b !== void 0 ? _b : "";
        message.msgTypeUrl = (_c = object.msgTypeUrl) !== null && _c !== void 0 ? _c : "";
        return message;
    },
};
function createBaseMsgRevokeResponse() {
    return {};
}
exports.MsgRevokeResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgRevokeResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = createBaseMsgRevokeResponse();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.AbsoluteTxPosition = exports.ContractCodeHistoryEntry = exports.ContractInfo = exports.CodeInfo = exports.Params = exports.AccessConfig = exports.AccessTypeParam = exports.contractCodeHistoryOperationTypeToJSON = exports.contractCodeHistoryOperationTypeFromJSON = exports.ContractCodeHistoryOperationType = exports.accessTypeToJSON = exports.accessTypeFromJSON = exports.AccessType = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const any_1 = __webpack_require__(83);
exports.protobufPackage = "cosmwasm.wasm.v1";
/** AccessType permission types */
var AccessType;
(function (AccessType) {
    /** ACCESS_TYPE_UNSPECIFIED - AccessTypeUnspecified placeholder for empty value */
    AccessType[AccessType["ACCESS_TYPE_UNSPECIFIED"] = 0] = "ACCESS_TYPE_UNSPECIFIED";
    /** ACCESS_TYPE_NOBODY - AccessTypeNobody forbidden */
    AccessType[AccessType["ACCESS_TYPE_NOBODY"] = 1] = "ACCESS_TYPE_NOBODY";
    /** ACCESS_TYPE_ONLY_ADDRESS - AccessTypeOnlyAddress restricted to an address */
    AccessType[AccessType["ACCESS_TYPE_ONLY_ADDRESS"] = 2] = "ACCESS_TYPE_ONLY_ADDRESS";
    /** ACCESS_TYPE_EVERYBODY - AccessTypeEverybody unrestricted */
    AccessType[AccessType["ACCESS_TYPE_EVERYBODY"] = 3] = "ACCESS_TYPE_EVERYBODY";
    AccessType[AccessType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(AccessType = exports.AccessType || (exports.AccessType = {}));
function accessTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "ACCESS_TYPE_UNSPECIFIED":
            return AccessType.ACCESS_TYPE_UNSPECIFIED;
        case 1:
        case "ACCESS_TYPE_NOBODY":
            return AccessType.ACCESS_TYPE_NOBODY;
        case 2:
        case "ACCESS_TYPE_ONLY_ADDRESS":
            return AccessType.ACCESS_TYPE_ONLY_ADDRESS;
        case 3:
        case "ACCESS_TYPE_EVERYBODY":
            return AccessType.ACCESS_TYPE_EVERYBODY;
        case -1:
        case "UNRECOGNIZED":
        default:
            return AccessType.UNRECOGNIZED;
    }
}
exports.accessTypeFromJSON = accessTypeFromJSON;
function accessTypeToJSON(object) {
    switch (object) {
        case AccessType.ACCESS_TYPE_UNSPECIFIED:
            return "ACCESS_TYPE_UNSPECIFIED";
        case AccessType.ACCESS_TYPE_NOBODY:
            return "ACCESS_TYPE_NOBODY";
        case AccessType.ACCESS_TYPE_ONLY_ADDRESS:
            return "ACCESS_TYPE_ONLY_ADDRESS";
        case AccessType.ACCESS_TYPE_EVERYBODY:
            return "ACCESS_TYPE_EVERYBODY";
        default:
            return "UNKNOWN";
    }
}
exports.accessTypeToJSON = accessTypeToJSON;
/** ContractCodeHistoryOperationType actions that caused a code change */
var ContractCodeHistoryOperationType;
(function (ContractCodeHistoryOperationType) {
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED - ContractCodeHistoryOperationTypeUnspecified placeholder for empty value */
    ContractCodeHistoryOperationType[ContractCodeHistoryOperationType["CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED"] = 0] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED";
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT - ContractCodeHistoryOperationTypeInit on chain contract instantiation */
    ContractCodeHistoryOperationType[ContractCodeHistoryOperationType["CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT"] = 1] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT";
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE - ContractCodeHistoryOperationTypeMigrate code migration */
    ContractCodeHistoryOperationType[ContractCodeHistoryOperationType["CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE"] = 2] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE";
    /** CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS - ContractCodeHistoryOperationTypeGenesis based on genesis data */
    ContractCodeHistoryOperationType[ContractCodeHistoryOperationType["CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS"] = 3] = "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS";
    ContractCodeHistoryOperationType[ContractCodeHistoryOperationType["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(ContractCodeHistoryOperationType = exports.ContractCodeHistoryOperationType || (exports.ContractCodeHistoryOperationType = {}));
function contractCodeHistoryOperationTypeFromJSON(object) {
    switch (object) {
        case 0:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED;
        case 1:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT;
        case 2:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE;
        case 3:
        case "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS":
            return ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS;
        case -1:
        case "UNRECOGNIZED":
        default:
            return ContractCodeHistoryOperationType.UNRECOGNIZED;
    }
}
exports.contractCodeHistoryOperationTypeFromJSON = contractCodeHistoryOperationTypeFromJSON;
function contractCodeHistoryOperationTypeToJSON(object) {
    switch (object) {
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE";
        case ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
            return "CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS";
        default:
            return "UNKNOWN";
    }
}
exports.contractCodeHistoryOperationTypeToJSON = contractCodeHistoryOperationTypeToJSON;
function createBaseAccessTypeParam() {
    return { value: 0 };
}
exports.AccessTypeParam = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.value !== 0) {
            writer.uint32(8).int32(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccessTypeParam();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.value = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            value: isSet(object.value) ? accessTypeFromJSON(object.value) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.value !== undefined &&
            (obj.value = accessTypeToJSON(message.value));
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseAccessTypeParam();
        message.value = (_a = object.value) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseAccessConfig() {
    return { permission: 0, address: "" };
}
exports.AccessConfig = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.permission !== 0) {
            writer.uint32(8).int32(message.permission);
        }
        if (message.address !== "") {
            writer.uint32(18).string(message.address);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccessConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.permission = reader.int32();
                    break;
                case 2:
                    message.address = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            permission: isSet(object.permission)
                ? accessTypeFromJSON(object.permission)
                : 0,
            address: isSet(object.address) ? String(object.address) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.permission !== undefined &&
            (obj.permission = accessTypeToJSON(message.permission));
        message.address !== undefined && (obj.address = message.address);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseAccessConfig();
        message.permission = (_a = object.permission) !== null && _a !== void 0 ? _a : 0;
        message.address = (_b = object.address) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseParams() {
    return {
        codeUploadAccess: undefined,
        instantiateDefaultPermission: 0,
        maxWasmCodeSize: "0",
    };
}
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.codeUploadAccess !== undefined) {
            exports.AccessConfig.encode(message.codeUploadAccess, writer.uint32(10).fork()).ldelim();
        }
        if (message.instantiateDefaultPermission !== 0) {
            writer.uint32(16).int32(message.instantiateDefaultPermission);
        }
        if (message.maxWasmCodeSize !== "0") {
            writer.uint32(24).uint64(message.maxWasmCodeSize);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeUploadAccess = exports.AccessConfig.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.instantiateDefaultPermission = reader.int32();
                    break;
                case 3:
                    message.maxWasmCodeSize = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            codeUploadAccess: isSet(object.codeUploadAccess)
                ? exports.AccessConfig.fromJSON(object.codeUploadAccess)
                : undefined,
            instantiateDefaultPermission: isSet(object.instantiateDefaultPermission)
                ? accessTypeFromJSON(object.instantiateDefaultPermission)
                : 0,
            maxWasmCodeSize: isSet(object.maxWasmCodeSize)
                ? String(object.maxWasmCodeSize)
                : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.codeUploadAccess !== undefined &&
            (obj.codeUploadAccess = message.codeUploadAccess
                ? exports.AccessConfig.toJSON(message.codeUploadAccess)
                : undefined);
        message.instantiateDefaultPermission !== undefined &&
            (obj.instantiateDefaultPermission = accessTypeToJSON(message.instantiateDefaultPermission));
        message.maxWasmCodeSize !== undefined &&
            (obj.maxWasmCodeSize = message.maxWasmCodeSize);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseParams();
        message.codeUploadAccess =
            object.codeUploadAccess !== undefined && object.codeUploadAccess !== null
                ? exports.AccessConfig.fromPartial(object.codeUploadAccess)
                : undefined;
        message.instantiateDefaultPermission = (_a = object.instantiateDefaultPermission) !== null && _a !== void 0 ? _a : 0;
        message.maxWasmCodeSize = (_b = object.maxWasmCodeSize) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseCodeInfo() {
    return {
        codeHash: new Uint8Array(),
        creator: "",
        instantiateConfig: undefined,
    };
}
exports.CodeInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.codeHash.length !== 0) {
            writer.uint32(10).bytes(message.codeHash);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.instantiateConfig !== undefined) {
            exports.AccessConfig.encode(message.instantiateConfig, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCodeInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeHash = reader.bytes();
                    break;
                case 2:
                    message.creator = reader.string();
                    break;
                case 5:
                    message.instantiateConfig = exports.AccessConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            codeHash: isSet(object.codeHash)
                ? bytesFromBase64(object.codeHash)
                : new Uint8Array(),
            creator: isSet(object.creator) ? String(object.creator) : "",
            instantiateConfig: isSet(object.instantiateConfig)
                ? exports.AccessConfig.fromJSON(object.instantiateConfig)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.codeHash !== undefined &&
            (obj.codeHash = base64FromBytes(message.codeHash !== undefined ? message.codeHash : new Uint8Array()));
        message.creator !== undefined && (obj.creator = message.creator);
        message.instantiateConfig !== undefined &&
            (obj.instantiateConfig = message.instantiateConfig
                ? exports.AccessConfig.toJSON(message.instantiateConfig)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseCodeInfo();
        message.codeHash = (_a = object.codeHash) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.creator = (_b = object.creator) !== null && _b !== void 0 ? _b : "";
        message.instantiateConfig =
            object.instantiateConfig !== undefined &&
                object.instantiateConfig !== null
                ? exports.AccessConfig.fromPartial(object.instantiateConfig)
                : undefined;
        return message;
    },
};
function createBaseContractInfo() {
    return {
        codeId: "0",
        creator: "",
        admin: "",
        label: "",
        created: undefined,
        ibcPortId: "",
        extension: undefined,
    };
}
exports.ContractInfo = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.codeId !== "0") {
            writer.uint32(8).uint64(message.codeId);
        }
        if (message.creator !== "") {
            writer.uint32(18).string(message.creator);
        }
        if (message.admin !== "") {
            writer.uint32(26).string(message.admin);
        }
        if (message.label !== "") {
            writer.uint32(34).string(message.label);
        }
        if (message.created !== undefined) {
            exports.AbsoluteTxPosition.encode(message.created, writer.uint32(42).fork()).ldelim();
        }
        if (message.ibcPortId !== "") {
            writer.uint32(50).string(message.ibcPortId);
        }
        if (message.extension !== undefined) {
            any_1.Any.encode(message.extension, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseContractInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.codeId = longToString(reader.uint64());
                    break;
                case 2:
                    message.creator = reader.string();
                    break;
                case 3:
                    message.admin = reader.string();
                    break;
                case 4:
                    message.label = reader.string();
                    break;
                case 5:
                    message.created = exports.AbsoluteTxPosition.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.ibcPortId = reader.string();
                    break;
                case 7:
                    message.extension = any_1.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            creator: isSet(object.creator) ? String(object.creator) : "",
            admin: isSet(object.admin) ? String(object.admin) : "",
            label: isSet(object.label) ? String(object.label) : "",
            created: isSet(object.created)
                ? exports.AbsoluteTxPosition.fromJSON(object.created)
                : undefined,
            ibcPortId: isSet(object.ibcPortId) ? String(object.ibcPortId) : "",
            extension: isSet(object.extension)
                ? any_1.Any.fromJSON(object.extension)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.creator !== undefined && (obj.creator = message.creator);
        message.admin !== undefined && (obj.admin = message.admin);
        message.label !== undefined && (obj.label = message.label);
        message.created !== undefined &&
            (obj.created = message.created
                ? exports.AbsoluteTxPosition.toJSON(message.created)
                : undefined);
        message.ibcPortId !== undefined && (obj.ibcPortId = message.ibcPortId);
        message.extension !== undefined &&
            (obj.extension = message.extension
                ? any_1.Any.toJSON(message.extension)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseContractInfo();
        message.codeId = (_a = object.codeId) !== null && _a !== void 0 ? _a : "0";
        message.creator = (_b = object.creator) !== null && _b !== void 0 ? _b : "";
        message.admin = (_c = object.admin) !== null && _c !== void 0 ? _c : "";
        message.label = (_d = object.label) !== null && _d !== void 0 ? _d : "";
        message.created =
            object.created !== undefined && object.created !== null
                ? exports.AbsoluteTxPosition.fromPartial(object.created)
                : undefined;
        message.ibcPortId = (_e = object.ibcPortId) !== null && _e !== void 0 ? _e : "";
        message.extension =
            object.extension !== undefined && object.extension !== null
                ? any_1.Any.fromPartial(object.extension)
                : undefined;
        return message;
    },
};
function createBaseContractCodeHistoryEntry() {
    return {
        operation: 0,
        codeId: "0",
        updated: undefined,
        msg: new Uint8Array(),
    };
}
exports.ContractCodeHistoryEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.operation !== 0) {
            writer.uint32(8).int32(message.operation);
        }
        if (message.codeId !== "0") {
            writer.uint32(16).uint64(message.codeId);
        }
        if (message.updated !== undefined) {
            exports.AbsoluteTxPosition.encode(message.updated, writer.uint32(26).fork()).ldelim();
        }
        if (message.msg.length !== 0) {
            writer.uint32(34).bytes(message.msg);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseContractCodeHistoryEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.operation = reader.int32();
                    break;
                case 2:
                    message.codeId = longToString(reader.uint64());
                    break;
                case 3:
                    message.updated = exports.AbsoluteTxPosition.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.msg = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            operation: isSet(object.operation)
                ? contractCodeHistoryOperationTypeFromJSON(object.operation)
                : 0,
            codeId: isSet(object.codeId) ? String(object.codeId) : "0",
            updated: isSet(object.updated)
                ? exports.AbsoluteTxPosition.fromJSON(object.updated)
                : undefined,
            msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.operation !== undefined &&
            (obj.operation = contractCodeHistoryOperationTypeToJSON(message.operation));
        message.codeId !== undefined && (obj.codeId = message.codeId);
        message.updated !== undefined &&
            (obj.updated = message.updated
                ? exports.AbsoluteTxPosition.toJSON(message.updated)
                : undefined);
        message.msg !== undefined &&
            (obj.msg = base64FromBytes(message.msg !== undefined ? message.msg : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseContractCodeHistoryEntry();
        message.operation = (_a = object.operation) !== null && _a !== void 0 ? _a : 0;
        message.codeId = (_b = object.codeId) !== null && _b !== void 0 ? _b : "0";
        message.updated =
            object.updated !== undefined && object.updated !== null
                ? exports.AbsoluteTxPosition.fromPartial(object.updated)
                : undefined;
        message.msg = (_c = object.msg) !== null && _c !== void 0 ? _c : new Uint8Array();
        return message;
    },
};
function createBaseAbsoluteTxPosition() {
    return { blockHeight: "0", txIndex: "0" };
}
exports.AbsoluteTxPosition = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.blockHeight !== "0") {
            writer.uint32(8).uint64(message.blockHeight);
        }
        if (message.txIndex !== "0") {
            writer.uint32(16).uint64(message.txIndex);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAbsoluteTxPosition();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.blockHeight = longToString(reader.uint64());
                    break;
                case 2:
                    message.txIndex = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            blockHeight: isSet(object.blockHeight) ? String(object.blockHeight) : "0",
            txIndex: isSet(object.txIndex) ? String(object.txIndex) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.blockHeight !== undefined &&
            (obj.blockHeight = message.blockHeight);
        message.txIndex !== undefined && (obj.txIndex = message.txIndex);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseAbsoluteTxPosition();
        message.blockHeight = (_a = object.blockHeight) !== null && _a !== void 0 ? _a : "0";
        message.txIndex = (_b = object.txIndex) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseModel() {
    return { key: new Uint8Array(), value: new Uint8Array() };
}
exports.Model = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key.length !== 0) {
            writer.uint32(10).bytes(message.key);
        }
        if (message.value.length !== 0) {
            writer.uint32(18).bytes(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModel();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.bytes();
                    break;
                case 2:
                    message.value = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? bytesFromBase64(object.key) : new Uint8Array(),
            value: isSet(object.value)
                ? bytesFromBase64(object.value)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        message.value !== undefined &&
            (obj.value = base64FromBytes(message.value !== undefined ? message.value : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseModel();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : new Uint8Array();
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=types.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 691:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Params = exports.Height = exports.UpgradeProposal = exports.ClientUpdateProposal = exports.ClientConsensusStates = exports.ConsensusStateWithHeight = exports.IdentifiedClientState = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const any_1 = __webpack_require__(83);
const upgrade_1 = __webpack_require__(692);
exports.protobufPackage = "ibc.core.client.v1";
function createBaseIdentifiedClientState() {
    return { clientId: "", clientState: undefined };
}
exports.IdentifiedClientState = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.clientId !== "") {
            writer.uint32(10).string(message.clientId);
        }
        if (message.clientState !== undefined) {
            any_1.Any.encode(message.clientState, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIdentifiedClientState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.clientId = reader.string();
                    break;
                case 2:
                    message.clientState = any_1.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            clientId: isSet(object.clientId) ? String(object.clientId) : "",
            clientState: isSet(object.clientState)
                ? any_1.Any.fromJSON(object.clientState)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.clientId !== undefined && (obj.clientId = message.clientId);
        message.clientState !== undefined &&
            (obj.clientState = message.clientState
                ? any_1.Any.toJSON(message.clientState)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseIdentifiedClientState();
        message.clientId = (_a = object.clientId) !== null && _a !== void 0 ? _a : "";
        message.clientState =
            object.clientState !== undefined && object.clientState !== null
                ? any_1.Any.fromPartial(object.clientState)
                : undefined;
        return message;
    },
};
function createBaseConsensusStateWithHeight() {
    return { height: undefined, consensusState: undefined };
}
exports.ConsensusStateWithHeight = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.height !== undefined) {
            exports.Height.encode(message.height, writer.uint32(10).fork()).ldelim();
        }
        if (message.consensusState !== undefined) {
            any_1.Any.encode(message.consensusState, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseConsensusStateWithHeight();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.height = exports.Height.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.consensusState = any_1.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            height: isSet(object.height) ? exports.Height.fromJSON(object.height) : undefined,
            consensusState: isSet(object.consensusState)
                ? any_1.Any.fromJSON(object.consensusState)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.height !== undefined &&
            (obj.height = message.height ? exports.Height.toJSON(message.height) : undefined);
        message.consensusState !== undefined &&
            (obj.consensusState = message.consensusState
                ? any_1.Any.toJSON(message.consensusState)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseConsensusStateWithHeight();
        message.height =
            object.height !== undefined && object.height !== null
                ? exports.Height.fromPartial(object.height)
                : undefined;
        message.consensusState =
            object.consensusState !== undefined && object.consensusState !== null
                ? any_1.Any.fromPartial(object.consensusState)
                : undefined;
        return message;
    },
};
function createBaseClientConsensusStates() {
    return { clientId: "", consensusStates: [] };
}
exports.ClientConsensusStates = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.clientId !== "") {
            writer.uint32(10).string(message.clientId);
        }
        for (const v of message.consensusStates) {
            exports.ConsensusStateWithHeight.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClientConsensusStates();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.clientId = reader.string();
                    break;
                case 2:
                    message.consensusStates.push(exports.ConsensusStateWithHeight.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            clientId: isSet(object.clientId) ? String(object.clientId) : "",
            consensusStates: Array.isArray(object === null || object === void 0 ? void 0 : object.consensusStates)
                ? object.consensusStates.map((e) => exports.ConsensusStateWithHeight.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.clientId !== undefined && (obj.clientId = message.clientId);
        if (message.consensusStates) {
            obj.consensusStates = message.consensusStates.map((e) => e ? exports.ConsensusStateWithHeight.toJSON(e) : undefined);
        }
        else {
            obj.consensusStates = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseClientConsensusStates();
        message.clientId = (_a = object.clientId) !== null && _a !== void 0 ? _a : "";
        message.consensusStates =
            ((_b = object.consensusStates) === null || _b === void 0 ? void 0 : _b.map((e) => exports.ConsensusStateWithHeight.fromPartial(e))) || [];
        return message;
    },
};
function createBaseClientUpdateProposal() {
    return {
        title: "",
        description: "",
        subjectClientId: "",
        substituteClientId: "",
    };
}
exports.ClientUpdateProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.subjectClientId !== "") {
            writer.uint32(26).string(message.subjectClientId);
        }
        if (message.substituteClientId !== "") {
            writer.uint32(34).string(message.substituteClientId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseClientUpdateProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.subjectClientId = reader.string();
                    break;
                case 4:
                    message.substituteClientId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            title: isSet(object.title) ? String(object.title) : "",
            description: isSet(object.description) ? String(object.description) : "",
            subjectClientId: isSet(object.subjectClientId)
                ? String(object.subjectClientId)
                : "",
            substituteClientId: isSet(object.substituteClientId)
                ? String(object.substituteClientId)
                : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined &&
            (obj.description = message.description);
        message.subjectClientId !== undefined &&
            (obj.subjectClientId = message.subjectClientId);
        message.substituteClientId !== undefined &&
            (obj.substituteClientId = message.substituteClientId);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseClientUpdateProposal();
        message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
        message.description = (_b = object.description) !== null && _b !== void 0 ? _b : "";
        message.subjectClientId = (_c = object.subjectClientId) !== null && _c !== void 0 ? _c : "";
        message.substituteClientId = (_d = object.substituteClientId) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseUpgradeProposal() {
    return {
        title: "",
        description: "",
        plan: undefined,
        upgradedClientState: undefined,
    };
}
exports.UpgradeProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.plan !== undefined) {
            upgrade_1.Plan.encode(message.plan, writer.uint32(26).fork()).ldelim();
        }
        if (message.upgradedClientState !== undefined) {
            any_1.Any.encode(message.upgradedClientState, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpgradeProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.plan = upgrade_1.Plan.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.upgradedClientState = any_1.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            title: isSet(object.title) ? String(object.title) : "",
            description: isSet(object.description) ? String(object.description) : "",
            plan: isSet(object.plan) ? upgrade_1.Plan.fromJSON(object.plan) : undefined,
            upgradedClientState: isSet(object.upgradedClientState)
                ? any_1.Any.fromJSON(object.upgradedClientState)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined &&
            (obj.description = message.description);
        message.plan !== undefined &&
            (obj.plan = message.plan ? upgrade_1.Plan.toJSON(message.plan) : undefined);
        message.upgradedClientState !== undefined &&
            (obj.upgradedClientState = message.upgradedClientState
                ? any_1.Any.toJSON(message.upgradedClientState)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseUpgradeProposal();
        message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
        message.description = (_b = object.description) !== null && _b !== void 0 ? _b : "";
        message.plan =
            object.plan !== undefined && object.plan !== null
                ? upgrade_1.Plan.fromPartial(object.plan)
                : undefined;
        message.upgradedClientState =
            object.upgradedClientState !== undefined &&
                object.upgradedClientState !== null
                ? any_1.Any.fromPartial(object.upgradedClientState)
                : undefined;
        return message;
    },
};
function createBaseHeight() {
    return { revisionNumber: "0", revisionHeight: "0" };
}
exports.Height = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.revisionNumber !== "0") {
            writer.uint32(8).uint64(message.revisionNumber);
        }
        if (message.revisionHeight !== "0") {
            writer.uint32(16).uint64(message.revisionHeight);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseHeight();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.revisionNumber = longToString(reader.uint64());
                    break;
                case 2:
                    message.revisionHeight = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            revisionNumber: isSet(object.revisionNumber)
                ? String(object.revisionNumber)
                : "0",
            revisionHeight: isSet(object.revisionHeight)
                ? String(object.revisionHeight)
                : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.revisionNumber !== undefined &&
            (obj.revisionNumber = message.revisionNumber);
        message.revisionHeight !== undefined &&
            (obj.revisionHeight = message.revisionHeight);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseHeight();
        message.revisionNumber = (_a = object.revisionNumber) !== null && _a !== void 0 ? _a : "0";
        message.revisionHeight = (_b = object.revisionHeight) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function createBaseParams() {
    return { allowedClients: [] };
}
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.allowedClients) {
            writer.uint32(10).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.allowedClients.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            allowedClients: Array.isArray(object === null || object === void 0 ? void 0 : object.allowedClients)
                ? object.allowedClients.map((e) => String(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.allowedClients) {
            obj.allowedClients = message.allowedClients.map((e) => e);
        }
        else {
            obj.allowedClients = [];
        }
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseParams();
        message.allowedClients = ((_a = object.allowedClients) === null || _a === void 0 ? void 0 : _a.map((e) => e)) || [];
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 692:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleVersion = exports.CancelSoftwareUpgradeProposal = exports.SoftwareUpgradeProposal = exports.Plan = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
const timestamp_1 = __webpack_require__(142);
const any_1 = __webpack_require__(83);
exports.protobufPackage = "cosmos.upgrade.v1beta1";
function createBasePlan() {
    return {
        name: "",
        time: undefined,
        height: "0",
        info: "",
        upgradedClientState: undefined,
    };
}
exports.Plan = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.time !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.time), writer.uint32(18).fork()).ldelim();
        }
        if (message.height !== "0") {
            writer.uint32(24).int64(message.height);
        }
        if (message.info !== "") {
            writer.uint32(34).string(message.info);
        }
        if (message.upgradedClientState !== undefined) {
            any_1.Any.encode(message.upgradedClientState, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePlan();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.time = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.height = longToString(reader.int64());
                    break;
                case 4:
                    message.info = reader.string();
                    break;
                case 5:
                    message.upgradedClientState = any_1.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            time: isSet(object.time) ? fromJsonTimestamp(object.time) : undefined,
            height: isSet(object.height) ? String(object.height) : "0",
            info: isSet(object.info) ? String(object.info) : "",
            upgradedClientState: isSet(object.upgradedClientState)
                ? any_1.Any.fromJSON(object.upgradedClientState)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.time !== undefined && (obj.time = message.time.toISOString());
        message.height !== undefined && (obj.height = message.height);
        message.info !== undefined && (obj.info = message.info);
        message.upgradedClientState !== undefined &&
            (obj.upgradedClientState = message.upgradedClientState
                ? any_1.Any.toJSON(message.upgradedClientState)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasePlan();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.time = (_b = object.time) !== null && _b !== void 0 ? _b : undefined;
        message.height = (_c = object.height) !== null && _c !== void 0 ? _c : "0";
        message.info = (_d = object.info) !== null && _d !== void 0 ? _d : "";
        message.upgradedClientState =
            object.upgradedClientState !== undefined &&
                object.upgradedClientState !== null
                ? any_1.Any.fromPartial(object.upgradedClientState)
                : undefined;
        return message;
    },
};
function createBaseSoftwareUpgradeProposal() {
    return { title: "", description: "", plan: undefined };
}
exports.SoftwareUpgradeProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        if (message.plan !== undefined) {
            exports.Plan.encode(message.plan, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSoftwareUpgradeProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                case 3:
                    message.plan = exports.Plan.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            title: isSet(object.title) ? String(object.title) : "",
            description: isSet(object.description) ? String(object.description) : "",
            plan: isSet(object.plan) ? exports.Plan.fromJSON(object.plan) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined &&
            (obj.description = message.description);
        message.plan !== undefined &&
            (obj.plan = message.plan ? exports.Plan.toJSON(message.plan) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseSoftwareUpgradeProposal();
        message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
        message.description = (_b = object.description) !== null && _b !== void 0 ? _b : "";
        message.plan =
            object.plan !== undefined && object.plan !== null
                ? exports.Plan.fromPartial(object.plan)
                : undefined;
        return message;
    },
};
function createBaseCancelSoftwareUpgradeProposal() {
    return { title: "", description: "" };
}
exports.CancelSoftwareUpgradeProposal = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.title !== "") {
            writer.uint32(10).string(message.title);
        }
        if (message.description !== "") {
            writer.uint32(18).string(message.description);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCancelSoftwareUpgradeProposal();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.title = reader.string();
                    break;
                case 2:
                    message.description = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            title: isSet(object.title) ? String(object.title) : "",
            description: isSet(object.description) ? String(object.description) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.title !== undefined && (obj.title = message.title);
        message.description !== undefined &&
            (obj.description = message.description);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseCancelSoftwareUpgradeProposal();
        message.title = (_a = object.title) !== null && _a !== void 0 ? _a : "";
        message.description = (_b = object.description) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseModuleVersion() {
    return { name: "", version: "0" };
}
exports.ModuleVersion = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.name !== "") {
            writer.uint32(10).string(message.name);
        }
        if (message.version !== "0") {
            writer.uint32(16).uint64(message.version);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseModuleVersion();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.version = longToString(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            name: isSet(object.name) ? String(object.name) : "",
            version: isSet(object.version) ? String(object.version) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        message.name !== undefined && (obj.name = message.name);
        message.version !== undefined && (obj.version = message.version);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseModuleVersion();
        message.name = (_a = object.name) !== null && _a !== void 0 ? _a : "";
        message.version = (_b = object.version) !== null && _b !== void 0 ? _b : "0";
        return message;
    },
};
function toTimestamp(date) {
    const seconds = Math.trunc(date.getTime() / 1000).toString();
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = Number(t.seconds) * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function longToString(long) {
    return long.toString();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=upgrade.js.map

/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecProto = exports.IntProto = exports.DecCoin = exports.Coin = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "cosmos.base.v1beta1";
function createBaseCoin() {
    return { denom: "", amount: "" };
}
exports.Coin = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCoin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            denom: isSet(object.denom) ? String(object.denom) : "",
            amount: isSet(object.amount) ? String(object.amount) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.amount !== undefined && (obj.amount = message.amount);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseCoin();
        message.denom = (_a = object.denom) !== null && _a !== void 0 ? _a : "";
        message.amount = (_b = object.amount) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseDecCoin() {
    return { denom: "", amount: "" };
}
exports.DecCoin = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.amount !== "") {
            writer.uint32(18).string(message.amount);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDecCoin();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.amount = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            denom: isSet(object.denom) ? String(object.denom) : "",
            amount: isSet(object.amount) ? String(object.amount) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.amount !== undefined && (obj.amount = message.amount);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseDecCoin();
        message.denom = (_a = object.denom) !== null && _a !== void 0 ? _a : "";
        message.amount = (_b = object.amount) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseIntProto() {
    return { int: "" };
}
exports.IntProto = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.int !== "") {
            writer.uint32(10).string(message.int);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseIntProto();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.int = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            int: isSet(object.int) ? String(object.int) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.int !== undefined && (obj.int = message.int);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseIntProto();
        message.int = (_a = object.int) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseDecProto() {
    return { dec: "" };
}
exports.DecProto = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.dec !== "") {
            writer.uint32(10).string(message.dec);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDecProto();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.dec = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            dec: isSet(object.dec) ? String(object.dec) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.dec !== undefined && (obj.dec = message.dec);
        return obj;
    },
    fromPartial(object) {
        var _a;
        const message = createBaseDecProto();
        message.dec = (_a = object.dec) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=coin.js.map

/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(__webpack_require__(7));
const minimal_1 = __importDefault(__webpack_require__(9));
exports.protobufPackage = "google.protobuf";
function createBaseAny() {
    return { typeUrl: "", value: new Uint8Array() };
}
exports.Any = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.typeUrl !== "") {
            writer.uint32(10).string(message.typeUrl);
        }
        if (message.value.length !== 0) {
            writer.uint32(18).bytes(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAny();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.typeUrl = reader.string();
                    break;
                case 2:
                    message.value = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            typeUrl: isSet(object.typeUrl) ? String(object.typeUrl) : "",
            value: isSet(object.value)
                ? bytesFromBase64(object.value)
                : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.typeUrl !== undefined && (obj.typeUrl = message.typeUrl);
        message.value !== undefined &&
            (obj.value = base64FromBytes(message.value !== undefined ? message.value : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseAny();
        message.typeUrl = (_a = object.typeUrl) !== null && _a !== void 0 ? _a : "";
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : new Uint8Array();
        return message;
    },
};
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=any.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ })

}]);