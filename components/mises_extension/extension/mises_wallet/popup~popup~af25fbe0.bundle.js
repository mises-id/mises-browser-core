(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[17],{

/***/ 1190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "keccak256", function() { return /* binding */ keccak256; });

// EXTERNAL MODULE: /Volumes/GameDrive/code/a-mises/mises-wallet/node_modules/js-sha3/src/sha3.js
var sha3 = __webpack_require__(91);
var sha3_default = /*#__PURE__*/__webpack_require__.n(sha3);

// CONCATENATED MODULE: ../crypto/node_modules/@ethersproject/logger/lib.esm/_version.js
const version = "logger/5.5.0";
//# sourceMappingURL=_version.js.map
// CONCATENATED MODULE: ../crypto/node_modules/@ethersproject/logger/lib.esm/index.js

let _permanentCensorErrors = false;
let _censorErrors = false;
const LogLevels = { debug: 1, "default": 2, info: 2, warning: 3, error: 4, off: 5 };
let _logLevel = LogLevels["default"];

let _globalLogger = null;
function _checkNormalize() {
    try {
        const missing = [];
        // Make sure all forms of normalization are supported
        ["NFD", "NFC", "NFKD", "NFKC"].forEach((form) => {
            try {
                if ("test".normalize(form) !== "test") {
                    throw new Error("bad normalize");
                }
                ;
            }
            catch (error) {
                missing.push(form);
            }
        });
        if (missing.length) {
            throw new Error("missing " + missing.join(", "));
        }
        if (String.fromCharCode(0xe9).normalize("NFD") !== String.fromCharCode(0x65, 0x0301)) {
            throw new Error("broken implementation");
        }
    }
    catch (error) {
        return error.message;
    }
    return null;
}
const _normalizeError = _checkNormalize();
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARNING"] = "WARNING";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["OFF"] = "OFF";
})(LogLevel || (LogLevel = {}));
var ErrorCode;
(function (ErrorCode) {
    ///////////////////
    // Generic Errors
    // Unknown Error
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    // Not Implemented
    ErrorCode["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
    // Unsupported Operation
    //   - operation
    ErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
    // Network Error (i.e. Ethereum Network, such as an invalid chain ID)
    //   - event ("noNetwork" is not re-thrown in provider.ready; otherwise thrown)
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    // Some sort of bad response from the server
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
    // Timeout
    ErrorCode["TIMEOUT"] = "TIMEOUT";
    ///////////////////
    // Operational  Errors
    // Buffer Overrun
    ErrorCode["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
    // Numeric Fault
    //   - operation: the operation being executed
    //   - fault: the reason this faulted
    ErrorCode["NUMERIC_FAULT"] = "NUMERIC_FAULT";
    ///////////////////
    // Argument Errors
    // Missing new operator to an object
    //  - name: The name of the class
    ErrorCode["MISSING_NEW"] = "MISSING_NEW";
    // Invalid argument (e.g. value is incompatible with type) to a function:
    //   - argument: The argument name that was invalid
    //   - value: The value of the argument
    ErrorCode["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
    // Missing argument to a function:
    //   - count: The number of arguments received
    //   - expectedCount: The number of arguments expected
    ErrorCode["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
    // Too many arguments
    //   - count: The number of arguments received
    //   - expectedCount: The number of arguments expected
    ErrorCode["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
    ///////////////////
    // Blockchain Errors
    // Call exception
    //  - transaction: the transaction
    //  - address?: the contract address
    //  - args?: The arguments passed into the function
    //  - method?: The Solidity method signature
    //  - errorSignature?: The EIP848 error signature
    //  - errorArgs?: The EIP848 error parameters
    //  - reason: The reason (only for EIP848 "Error(string)")
    ErrorCode["CALL_EXCEPTION"] = "CALL_EXCEPTION";
    // Insufficient funds (< value + gasLimit * gasPrice)
    //   - transaction: the transaction attempted
    ErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    // Nonce has already been used
    //   - transaction: the transaction attempted
    ErrorCode["NONCE_EXPIRED"] = "NONCE_EXPIRED";
    // The replacement fee for the transaction is too low
    //   - transaction: the transaction attempted
    ErrorCode["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
    // The gas limit could not be estimated
    //   - transaction: the transaction passed to estimateGas
    ErrorCode["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
    // The transaction was replaced by one with a higher gas price
    //   - reason: "cancelled", "replaced" or "repriced"
    //   - cancelled: true if reason == "cancelled" or reason == "replaced")
    //   - hash: original transaction hash
    //   - replacement: the full TransactionsResponse for the replacement
    //   - receipt: the receipt of the replacement
    ErrorCode["TRANSACTION_REPLACED"] = "TRANSACTION_REPLACED";
})(ErrorCode || (ErrorCode = {}));
;
const HEX = "0123456789abcdef";
class lib_esm_Logger {
    constructor(version) {
        Object.defineProperty(this, "version", {
            enumerable: true,
            value: version,
            writable: false
        });
    }
    _log(logLevel, args) {
        const level = logLevel.toLowerCase();
        if (LogLevels[level] == null) {
            this.throwArgumentError("invalid log level name", "logLevel", logLevel);
        }
        if (_logLevel > LogLevels[level]) {
            return;
        }
        console.log.apply(console, args);
    }
    debug(...args) {
        this._log(lib_esm_Logger.levels.DEBUG, args);
    }
    info(...args) {
        this._log(lib_esm_Logger.levels.INFO, args);
    }
    warn(...args) {
        this._log(lib_esm_Logger.levels.WARNING, args);
    }
    makeError(message, code, params) {
        // Errors are being censored
        if (_censorErrors) {
            return this.makeError("censored error", code, {});
        }
        if (!code) {
            code = lib_esm_Logger.errors.UNKNOWN_ERROR;
        }
        if (!params) {
            params = {};
        }
        const messageDetails = [];
        Object.keys(params).forEach((key) => {
            const value = params[key];
            try {
                if (value instanceof Uint8Array) {
                    let hex = "";
                    for (let i = 0; i < value.length; i++) {
                        hex += HEX[value[i] >> 4];
                        hex += HEX[value[i] & 0x0f];
                    }
                    messageDetails.push(key + "=Uint8Array(0x" + hex + ")");
                }
                else {
                    messageDetails.push(key + "=" + JSON.stringify(value));
                }
            }
            catch (error) {
                messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
            }
        });
        messageDetails.push(`code=${code}`);
        messageDetails.push(`version=${this.version}`);
        const reason = message;
        if (messageDetails.length) {
            message += " (" + messageDetails.join(", ") + ")";
        }
        // @TODO: Any??
        const error = new Error(message);
        error.reason = reason;
        error.code = code;
        Object.keys(params).forEach(function (key) {
            error[key] = params[key];
        });
        return error;
    }
    throwError(message, code, params) {
        throw this.makeError(message, code, params);
    }
    throwArgumentError(message, name, value) {
        return this.throwError(message, lib_esm_Logger.errors.INVALID_ARGUMENT, {
            argument: name,
            value: value
        });
    }
    assert(condition, message, code, params) {
        if (!!condition) {
            return;
        }
        this.throwError(message, code, params);
    }
    assertArgument(condition, message, name, value) {
        if (!!condition) {
            return;
        }
        this.throwArgumentError(message, name, value);
    }
    checkNormalize(message) {
        if (message == null) {
            message = "platform missing String.prototype.normalize";
        }
        if (_normalizeError) {
            this.throwError("platform missing String.prototype.normalize", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "String.prototype.normalize", form: _normalizeError
            });
        }
    }
    checkSafeUint53(value, message) {
        if (typeof (value) !== "number") {
            return;
        }
        if (message == null) {
            message = "value not safe";
        }
        if (value < 0 || value >= 0x1fffffffffffff) {
            this.throwError(message, lib_esm_Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "out-of-safe-range",
                value: value
            });
        }
        if (value % 1) {
            this.throwError(message, lib_esm_Logger.errors.NUMERIC_FAULT, {
                operation: "checkSafeInteger",
                fault: "non-integer",
                value: value
            });
        }
    }
    checkArgumentCount(count, expectedCount, message) {
        if (message) {
            message = ": " + message;
        }
        else {
            message = "";
        }
        if (count < expectedCount) {
            this.throwError("missing argument" + message, lib_esm_Logger.errors.MISSING_ARGUMENT, {
                count: count,
                expectedCount: expectedCount
            });
        }
        if (count > expectedCount) {
            this.throwError("too many arguments" + message, lib_esm_Logger.errors.UNEXPECTED_ARGUMENT, {
                count: count,
                expectedCount: expectedCount
            });
        }
    }
    checkNew(target, kind) {
        if (target === Object || target == null) {
            this.throwError("missing new", lib_esm_Logger.errors.MISSING_NEW, { name: kind.name });
        }
    }
    checkAbstract(target, kind) {
        if (target === kind) {
            this.throwError("cannot instantiate abstract class " + JSON.stringify(kind.name) + " directly; use a sub-class", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, { name: target.name, operation: "new" });
        }
        else if (target === Object || target == null) {
            this.throwError("missing new", lib_esm_Logger.errors.MISSING_NEW, { name: kind.name });
        }
    }
    static globalLogger() {
        if (!_globalLogger) {
            _globalLogger = new lib_esm_Logger(version);
        }
        return _globalLogger;
    }
    static setCensorship(censorship, permanent) {
        if (!censorship && permanent) {
            this.globalLogger().throwError("cannot permanently disable censorship", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "setCensorship"
            });
        }
        if (_permanentCensorErrors) {
            if (!censorship) {
                return;
            }
            this.globalLogger().throwError("error censorship permanent", lib_esm_Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "setCensorship"
            });
        }
        _censorErrors = !!censorship;
        _permanentCensorErrors = !!permanent;
    }
    static setLogLevel(logLevel) {
        const level = LogLevels[logLevel.toLowerCase()];
        if (level == null) {
            lib_esm_Logger.globalLogger().warn("invalid log level - " + logLevel);
            return;
        }
        _logLevel = level;
    }
    static from(version) {
        return new lib_esm_Logger(version);
    }
}
lib_esm_Logger.errors = ErrorCode;
lib_esm_Logger.levels = LogLevel;
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ../crypto/node_modules/@ethersproject/bytes/lib.esm/_version.js
const _version_version = "bytes/5.5.0";
//# sourceMappingURL=_version.js.map
// CONCATENATED MODULE: ../crypto/node_modules/@ethersproject/bytes/lib.esm/index.js



const logger = new lib_esm_Logger(_version_version);
///////////////////////////////
function isHexable(value) {
    return !!(value.toHexString);
}
function addSlice(array) {
    if (array.slice) {
        return array;
    }
    array.slice = function () {
        const args = Array.prototype.slice.call(arguments);
        return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
    };
    return array;
}
function isBytesLike(value) {
    return ((isHexString(value) && !(value.length % 2)) || isBytes(value));
}
function isInteger(value) {
    return (typeof (value) === "number" && value == value && (value % 1) === 0);
}
function isBytes(value) {
    if (value == null) {
        return false;
    }
    if (value.constructor === Uint8Array) {
        return true;
    }
    if (typeof (value) === "string") {
        return false;
    }
    if (!isInteger(value.length) || value.length < 0) {
        return false;
    }
    for (let i = 0; i < value.length; i++) {
        const v = value[i];
        if (!isInteger(v) || v < 0 || v >= 256) {
            return false;
        }
    }
    return true;
}
function arrayify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        logger.checkSafeUint53(value, "invalid arrayify value");
        const result = [];
        while (value) {
            result.unshift(value & 0xff);
            value = parseInt(String(value / 256));
        }
        if (result.length === 0) {
            result.push(0);
        }
        return addSlice(new Uint8Array(result));
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        value = value.toHexString();
    }
    if (isHexString(value)) {
        let hex = value.substring(2);
        if (hex.length % 2) {
            if (options.hexPad === "left") {
                hex = "0x0" + hex.substring(2);
            }
            else if (options.hexPad === "right") {
                hex += "0";
            }
            else {
                logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        const result = [];
        for (let i = 0; i < hex.length; i += 2) {
            result.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return addSlice(new Uint8Array(result));
    }
    if (isBytes(value)) {
        return addSlice(new Uint8Array(value));
    }
    return logger.throwArgumentError("invalid arrayify value", "value", value);
}
function concat(items) {
    const objects = items.map(item => arrayify(item));
    const length = objects.reduce((accum, item) => (accum + item.length), 0);
    const result = new Uint8Array(length);
    objects.reduce((offset, object) => {
        result.set(object, offset);
        return offset + object.length;
    }, 0);
    return addSlice(result);
}
function stripZeros(value) {
    let result = arrayify(value);
    if (result.length === 0) {
        return result;
    }
    // Find the first non-zero entry
    let start = 0;
    while (start < result.length && result[start] === 0) {
        start++;
    }
    // If we started with zeros, strip them
    if (start) {
        result = result.slice(start);
    }
    return result;
}
function zeroPad(value, length) {
    value = arrayify(value);
    if (value.length > length) {
        logger.throwArgumentError("value out of range", "value", arguments[0]);
    }
    const result = new Uint8Array(length);
    result.set(value, length - value.length);
    return addSlice(result);
}
function isHexString(value, length) {
    if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
const HexCharacters = "0123456789abcdef";
function hexlify(value, options) {
    if (!options) {
        options = {};
    }
    if (typeof (value) === "number") {
        logger.checkSafeUint53(value, "invalid hexlify value");
        let hex = "";
        while (value) {
            hex = HexCharacters[value & 0xf] + hex;
            value = Math.floor(value / 16);
        }
        if (hex.length) {
            if (hex.length % 2) {
                hex = "0" + hex;
            }
            return "0x" + hex;
        }
        return "0x00";
    }
    if (typeof (value) === "bigint") {
        value = value.toString(16);
        if (value.length % 2) {
            return ("0x0" + value);
        }
        return "0x" + value;
    }
    if (options.allowMissingPrefix && typeof (value) === "string" && value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    if (isHexable(value)) {
        return value.toHexString();
    }
    if (isHexString(value)) {
        if (value.length % 2) {
            if (options.hexPad === "left") {
                value = "0x0" + value.substring(2);
            }
            else if (options.hexPad === "right") {
                value += "0";
            }
            else {
                logger.throwArgumentError("hex data is odd-length", "value", value);
            }
        }
        return value.toLowerCase();
    }
    if (isBytes(value)) {
        let result = "0x";
        for (let i = 0; i < value.length; i++) {
            let v = value[i];
            result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
        }
        return result;
    }
    return logger.throwArgumentError("invalid hexlify value", "value", value);
}
/*
function unoddify(value: BytesLike | Hexable | number): BytesLike | Hexable | number {
    if (typeof(value) === "string" && value.length % 2 && value.substring(0, 2) === "0x") {
        return "0x0" + value.substring(2);
    }
    return value;
}
*/
function hexDataLength(data) {
    if (typeof (data) !== "string") {
        data = hexlify(data);
    }
    else if (!isHexString(data) || (data.length % 2)) {
        return null;
    }
    return (data.length - 2) / 2;
}
function hexDataSlice(data, offset, endOffset) {
    if (typeof (data) !== "string") {
        data = hexlify(data);
    }
    else if (!isHexString(data) || (data.length % 2)) {
        logger.throwArgumentError("invalid hexData", "value", data);
    }
    offset = 2 + 2 * offset;
    if (endOffset != null) {
        return "0x" + data.substring(offset, 2 + 2 * endOffset);
    }
    return "0x" + data.substring(offset);
}
function hexConcat(items) {
    let result = "0x";
    items.forEach((item) => {
        result += hexlify(item).substring(2);
    });
    return result;
}
function hexValue(value) {
    const trimmed = hexStripZeros(hexlify(value, { hexPad: "left" }));
    if (trimmed === "0x") {
        return "0x0";
    }
    return trimmed;
}
function hexStripZeros(value) {
    if (typeof (value) !== "string") {
        value = hexlify(value);
    }
    if (!isHexString(value)) {
        logger.throwArgumentError("invalid hex string", "value", value);
    }
    value = value.substring(2);
    let offset = 0;
    while (offset < value.length && value[offset] === "0") {
        offset++;
    }
    return "0x" + value.substring(offset);
}
function hexZeroPad(value, length) {
    if (typeof (value) !== "string") {
        value = hexlify(value);
    }
    else if (!isHexString(value)) {
        logger.throwArgumentError("invalid hex string", "value", value);
    }
    if (value.length > 2 * length + 2) {
        logger.throwArgumentError("value out of range", "value", arguments[1]);
    }
    while (value.length < 2 * length + 2) {
        value = "0x0" + value.substring(2);
    }
    return value;
}
function splitSignature(signature) {
    const result = {
        r: "0x",
        s: "0x",
        _vs: "0x",
        recoveryParam: 0,
        v: 0
    };
    if (isBytesLike(signature)) {
        const bytes = arrayify(signature);
        if (bytes.length !== 65) {
            logger.throwArgumentError("invalid signature string; must be 65 bytes", "signature", signature);
        }
        // Get the r, s and v
        result.r = hexlify(bytes.slice(0, 32));
        result.s = hexlify(bytes.slice(32, 64));
        result.v = bytes[64];
        // Allow a recid to be used as the v
        if (result.v < 27) {
            if (result.v === 0 || result.v === 1) {
                result.v += 27;
            }
            else {
                logger.throwArgumentError("signature invalid v byte", "signature", signature);
            }
        }
        // Compute recoveryParam from v
        result.recoveryParam = 1 - (result.v % 2);
        // Compute _vs from recoveryParam and s
        if (result.recoveryParam) {
            bytes[32] |= 0x80;
        }
        result._vs = hexlify(bytes.slice(32, 64));
    }
    else {
        result.r = signature.r;
        result.s = signature.s;
        result.v = signature.v;
        result.recoveryParam = signature.recoveryParam;
        result._vs = signature._vs;
        // If the _vs is available, use it to populate missing s, v and recoveryParam
        // and verify non-missing s, v and recoveryParam
        if (result._vs != null) {
            const vs = zeroPad(arrayify(result._vs), 32);
            result._vs = hexlify(vs);
            // Set or check the recid
            const recoveryParam = ((vs[0] >= 128) ? 1 : 0);
            if (result.recoveryParam == null) {
                result.recoveryParam = recoveryParam;
            }
            else if (result.recoveryParam !== recoveryParam) {
                logger.throwArgumentError("signature recoveryParam mismatch _vs", "signature", signature);
            }
            // Set or check the s
            vs[0] &= 0x7f;
            const s = hexlify(vs);
            if (result.s == null) {
                result.s = s;
            }
            else if (result.s !== s) {
                logger.throwArgumentError("signature v mismatch _vs", "signature", signature);
            }
        }
        // Use recid and v to populate each other
        if (result.recoveryParam == null) {
            if (result.v == null) {
                logger.throwArgumentError("signature missing v and recoveryParam", "signature", signature);
            }
            else if (result.v === 0 || result.v === 1) {
                result.recoveryParam = result.v;
            }
            else {
                result.recoveryParam = 1 - (result.v % 2);
            }
        }
        else {
            if (result.v == null) {
                result.v = 27 + result.recoveryParam;
            }
            else {
                const recId = (result.v === 0 || result.v === 1) ? result.v : (1 - (result.v % 2));
                if (result.recoveryParam !== recId) {
                    logger.throwArgumentError("signature recoveryParam mismatch v", "signature", signature);
                }
            }
        }
        if (result.r == null || !isHexString(result.r)) {
            logger.throwArgumentError("signature missing or invalid r", "signature", signature);
        }
        else {
            result.r = hexZeroPad(result.r, 32);
        }
        if (result.s == null || !isHexString(result.s)) {
            logger.throwArgumentError("signature missing or invalid s", "signature", signature);
        }
        else {
            result.s = hexZeroPad(result.s, 32);
        }
        const vs = arrayify(result.s);
        if (vs[0] >= 128) {
            logger.throwArgumentError("signature s out of range", "signature", signature);
        }
        if (result.recoveryParam) {
            vs[0] |= 0x80;
        }
        const _vs = hexlify(vs);
        if (result._vs) {
            if (!isHexString(result._vs)) {
                logger.throwArgumentError("signature invalid _vs", "signature", signature);
            }
            result._vs = hexZeroPad(result._vs, 32);
        }
        // Set or check the _vs
        if (result._vs == null) {
            result._vs = _vs;
        }
        else if (result._vs !== _vs) {
            logger.throwArgumentError("signature _vs mismatch v and s", "signature", signature);
        }
    }
    return result;
}
function joinSignature(signature) {
    signature = splitSignature(signature);
    return hexlify(concat([
        signature.r,
        signature.s,
        (signature.recoveryParam ? "0x1c" : "0x1b")
    ]));
}
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: ../crypto/node_modules/@ethersproject/keccak256/lib.esm/index.js



function keccak256(data) {
    return '0x' + sha3_default.a.keccak_256(arrayify(data));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 16:
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
__exportStar(__webpack_require__(661), exports);
__exportStar(__webpack_require__(395), exports);
__exportStar(__webpack_require__(663), exports);
__exportStar(__webpack_require__(665), exports);
__exportStar(__webpack_require__(667), exports);
__exportStar(__webpack_require__(404), exports);
__exportStar(__webpack_require__(405), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 27:
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
__exportStar(__webpack_require__(696), exports);
__exportStar(__webpack_require__(702), exports);
__exportStar(__webpack_require__(839), exports);
__exportStar(__webpack_require__(840), exports);
__exportStar(__webpack_require__(842), exports);
__exportStar(__webpack_require__(843), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 283:
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
exports.BaseKVStore = void 0;
class BaseKVStore {
    constructor(provider, _prefix) {
        this.provider = provider;
        this._prefix = _prefix;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const k = this.prefix() + "/" + key;
            const data = yield this.provider.get();
            return data[k];
        });
    }
    set(key, data) {
        const k = this.prefix() + "/" + key;
        return this.provider.set({ [k]: data });
    }
    prefix() {
        return this._prefix;
    }
}
exports.BaseKVStore = BaseKVStore;
//# sourceMappingURL=base.js.map

/***/ }),

/***/ 395:
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bech32Address = void 0;
const bech32_1 = __importStar(__webpack_require__(104));
const buffer_1 = __webpack_require__(4);
const address_1 = __webpack_require__(244);
class Bech32Address {
    constructor(address) {
        this.address = address;
    }
    static shortenAddress(bech32, maxCharacters) {
        if (maxCharacters >= bech32.length) {
            return bech32;
        }
        const i = bech32.indexOf("1");
        const prefix = bech32.slice(0, i);
        const address = bech32.slice(i + 1);
        maxCharacters -= prefix.length;
        maxCharacters -= 3; // For "..."
        maxCharacters -= 1; // For "1"
        if (maxCharacters <= 0) {
            return "";
        }
        const mid = Math.floor(address.length / 2);
        let former = address.slice(0, mid);
        let latter = address.slice(mid);
        while (maxCharacters < former.length + latter.length) {
            if ((former.length + latter.length) % 2 === 1 && former.length > 0) {
                former = former.slice(0, former.length - 1);
            }
            else {
                latter = latter.slice(1);
            }
        }
        return prefix + "1" + former + "..." + latter;
    }
    static fromBech32(bech32Address, prefix) {
        const decoded = bech32_1.default.decode(bech32Address);
        if (prefix && decoded.prefix !== prefix) {
            throw new Error("Unmatched prefix");
        }
        return new Bech32Address(new Uint8Array(bech32_1.fromWords(decoded.words)));
    }
    static validate(bech32Address, prefix) {
        const { prefix: decodedPrefix } = bech32_1.default.decode(bech32Address);
        if (prefix && prefix !== decodedPrefix) {
            throw new Error(`Unexpected prefix (expected: ${prefix}, actual: ${decodedPrefix})`);
        }
    }
    static defaultBech32Config(mainPrefix, validatorPrefix = "val", consensusPrefix = "cons", publicPrefix = "pub", operatorPrefix = "oper") {
        return {
            bech32PrefixAccAddr: mainPrefix,
            bech32PrefixAccPub: mainPrefix + publicPrefix,
            bech32PrefixValAddr: mainPrefix + validatorPrefix + operatorPrefix,
            bech32PrefixValPub: mainPrefix + validatorPrefix + operatorPrefix + publicPrefix,
            bech32PrefixConsAddr: mainPrefix + validatorPrefix + consensusPrefix,
            bech32PrefixConsPub: mainPrefix + validatorPrefix + consensusPrefix + publicPrefix,
        };
    }
    toBech32(prefix) {
        const words = bech32_1.default.toWords(this.address);
        return bech32_1.default.encode(prefix, words);
    }
    toHex(mixedCaseChecksum = true) {
        const hex = buffer_1.Buffer.from(this.address).toString("hex");
        if (hex.length === 0) {
            throw new Error("Empty address");
        }
        if (mixedCaseChecksum) {
            return address_1.getAddress("0x" + hex);
        }
        else {
            return "0x" + hex;
        }
    }
}
exports.Bech32Address = Bech32Address;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 396:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainIdHelper = void 0;
class ChainIdHelper {
    static parse(chainId) {
        const split = chainId
            .split(ChainIdHelper.VersionFormatRegExp)
            .filter(Boolean);
        if (split.length !== 2) {
            return {
                identifier: chainId,
                version: 0,
            };
        }
        else {
            return { identifier: split[0], version: parseInt(split[1]) };
        }
    }
    static hasChainVersion(chainId) {
        const version = ChainIdHelper.parse(chainId);
        return version.identifier !== chainId;
    }
}
exports.ChainIdHelper = ChainIdHelper;
// VersionFormatRegExp checks if a chainID is in the format required for parsing versions
// The chainID should be in the form: `{identifier}-{version}`
ChainIdHelper.VersionFormatRegExp = /(.+)-([\d]+)/;
//# sourceMappingURL=cosmos.js.map

/***/ }),

/***/ 397:
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
exports.defaultProtoCodec = exports.ProtoCodec = void 0;
const tx_1 = __webpack_require__(619);
const tx_2 = __webpack_require__(620);
const tx_3 = __webpack_require__(689);
const tx_4 = __webpack_require__(621);
const tx_5 = __webpack_require__(623);
const tx_6 = __webpack_require__(624);
const tx_7 = __webpack_require__(625);
const unknown_1 = __webpack_require__(401);
__exportStar(__webpack_require__(401), exports);
class ProtoCodec {
    constructor() {
        this.typeUrlMap = new Map();
    }
    /**
     * Unpack the any to the registered message.
     * NOTE: If there is no matched message, it will not throw an error but return the `UnknownMessage` class.
     * @param any
     */
    unpackAny(any) {
        if (!this.typeUrlMap.has(any.typeUrl)) {
            return new unknown_1.UnknownMessage(any.typeUrl, any.value);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const factory = this.typeUrlMap.get(any.typeUrl);
        const unpacked = factory.decode(any.value);
        return Object.assign(Object.assign({}, any), { unpacked,
            factory });
    }
    registerAny(typeUrl, message) {
        this.typeUrlMap.set(typeUrl, message);
    }
}
exports.ProtoCodec = ProtoCodec;
exports.defaultProtoCodec = new ProtoCodec();
exports.defaultProtoCodec.registerAny("/cosmos.bank.v1beta1.MsgSend", tx_1.MsgSend);
exports.defaultProtoCodec.registerAny("/cosmos.staking.v1beta1.MsgDelegate", tx_2.MsgDelegate);
exports.defaultProtoCodec.registerAny("/cosmos.staking.v1beta1.MsgUndelegate", tx_2.MsgUndelegate);
exports.defaultProtoCodec.registerAny("/cosmos.staking.v1beta1.MsgBeginRedelegate", tx_2.MsgBeginRedelegate);
exports.defaultProtoCodec.registerAny("/cosmwasm.wasm.v1.MsgExecuteContract", tx_6.MsgExecuteContract);
exports.defaultProtoCodec.registerAny("/cosmwasm.wasm.v1.MsgInstantiateContract", tx_6.MsgInstantiateContract);
exports.defaultProtoCodec.registerAny("/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward", tx_5.MsgWithdrawDelegatorReward);
exports.defaultProtoCodec.registerAny("/ibc.applications.transfer.v1.MsgTransfer", tx_7.MsgTransfer);
exports.defaultProtoCodec.registerAny("/cosmos.gov.v1beta1.MsgVote", tx_4.MsgVote);
exports.defaultProtoCodec.registerAny("/cosmos.authz.v1beta1.MsgGrant", tx_3.MsgGrant);
exports.defaultProtoCodec.registerAny("/cosmos.authz.v1beta1.MsgRevoke", tx_3.MsgRevoke);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 401:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownMessage = void 0;
const buffer_1 = __webpack_require__(4);
class UnknownMessage {
    constructor(
    /** Any type_url. */
    _typeUrl, 
    /** Any value. */
    _value) {
        this._typeUrl = _typeUrl;
        this._value = _value;
    }
    get typeUrl() {
        return this._typeUrl;
    }
    get value() {
        return this._value;
    }
    toJSON() {
        return {
            type_url: this._typeUrl,
            value: buffer_1.Buffer.from(this._value).toString("base64"),
        };
    }
}
exports.UnknownMessage = UnknownMessage;
//# sourceMappingURL=unknown.js.map

/***/ }),

/***/ 402:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoSignDocDecoder = void 0;
const tx_1 = __webpack_require__(100);
const codec_1 = __webpack_require__(397);
class ProtoSignDocDecoder {
    constructor(signDoc, protoCodec = codec_1.defaultProtoCodec) {
        this.signDoc = signDoc;
        this.protoCodec = protoCodec;
    }
    static decode(bytes) {
        return new ProtoSignDocDecoder(tx_1.SignDoc.decode(bytes));
    }
    get txBody() {
        if (!this._txBody) {
            this._txBody = tx_1.TxBody.decode(this.signDoc.bodyBytes);
        }
        return this._txBody;
    }
    get txMsgs() {
        const msgs = [];
        for (const msg of this.txBody.messages) {
            msgs.push(this.protoCodec.unpackAny(msg));
        }
        return msgs;
    }
    get authInfo() {
        if (!this._authInfo) {
            this._authInfo = tx_1.AuthInfo.decode(this.signDoc.authInfoBytes);
        }
        return this._authInfo;
    }
    get chainId() {
        return this.signDoc.chainId;
    }
    get accountNumber() {
        return this.signDoc.accountNumber.toString();
    }
    toBytes() {
        return tx_1.SignDoc.encode(this.signDoc).finish();
    }
    toJSON() {
        return {
            txBody: Object.assign(Object.assign({}, tx_1.TxBody.toJSON(this.txBody)), {
                messages: this.txMsgs.map((msg) => {
                    if (msg) {
                        if (msg instanceof codec_1.UnknownMessage) {
                            return msg.toJSON();
                        }
                        if ("factory" in msg) {
                            return msg.factory.toJSON(msg.unpacked);
                        }
                    }
                    return msg;
                }),
            }),
            authInfo: tx_1.AuthInfo.toJSON(this.authInfo),
            chainId: this.chainId,
            accountNumber: this.accountNumber,
        };
    }
}
exports.ProtoSignDocDecoder = ProtoSignDocDecoder;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 404:
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
__exportStar(__webpack_require__(694), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 405:
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
__exportStar(__webpack_require__(695), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const sha_js_1 = __webpack_require__(125);
const keccak256_1 = __webpack_require__(1190);
const buffer_1 = __webpack_require__(4);
class Hash {
    static sha256(data) {
        return new Uint8Array(new sha_js_1.sha256().update(data).digest());
    }
    static keccak256(data) {
        return new buffer_1.Buffer(keccak256_1.keccak256(data).replace("0x", ""), "hex");
    }
    static truncHashPortion(str, firstCharCount = str.length, endCharCount = 0) {
        return (str.substring(0, firstCharCount) +
            "…" +
            str.substring(str.length - endCharCount, str.length));
    }
}
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map

/***/ }),

/***/ 50:
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
__exportStar(__webpack_require__(703), exports);
__exportStar(__webpack_require__(767), exports);
__exportStar(__webpack_require__(459), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 661:
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
exports.BaseAccount = void 0;
const unit_1 = __webpack_require__(26);
class BaseAccount {
    constructor(type, address, accountNumber, sequence) {
        this.type = type;
        this.address = address;
        this.accountNumber = accountNumber;
        this.sequence = sequence;
    }
    static fetchFromRest(instance, address, 
    // If the account doesn't exist, the result from `auth/accounts` would not have the address.
    // In this case, if `defaultBech32Address` param is provided, this will use it instead of the result from rest.
    defaultBech32Address = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield instance.get(`/cosmos/auth/v1beta1/accounts/${address}`, {
                validateStatus: function (status) {
                    // Permit 404 not found to handle the case of account not exists
                    return (status >= 200 && status < 300) || status === 404;
                },
            });
            console.log(1321, result);
            return BaseAccount.fromProtoJSON(result.data, defaultBech32Address ? address : "");
        });
    }
    static fromProtoJSON(obj, 
    // If the account doesn't exist, the result from `auth/accounts` would not have the address.
    // In this case, if `defaultBech32Address` param is provided, this will use it instead of the result from rest.
    defaultBech32Address = "") {
        if (!obj.account) {
            // Case of not existing account.
            // {
            //   "code": 5,
            //   "message": "rpc error: code = NotFound desc = account {address} not found: key not found",
            //   "details": [
            //   ]
            // }
            if (!defaultBech32Address) {
                throw new Error(`Account's address is unknown: ${JSON.stringify(obj)}`);
            }
            return new BaseAccount("", defaultBech32Address, new unit_1.Int(0), new unit_1.Int(0));
        }
        let value = obj.account;
        const type = value["@type"] || "";
        // If the chain modifies the account type, handle the case where the account type embeds the base account.
        // (Actually, the only existent case is ethermint, and this is the line for handling ethermint)
        const baseAccount = value.BaseAccount || value.baseAccount || value.base_account;
        if (baseAccount) {
            value = baseAccount;
        }
        // If the chain modifies the account type, handle the case where the account type embeds the account.
        // (Actually, the only existent case is desmos, and this is the line for handling desmos)
        const embedAccount = value.account;
        if (embedAccount) {
            value = embedAccount;
        }
        // If the account is the vesting account that embeds the base vesting account,
        // the actual base account exists under the base vesting account.
        // But, this can be different according to the version of cosmos-sdk.
        // So, anyway, try to parse it by some ways...
        const baseVestingAccount = value.BaseVestingAccount ||
            value.baseVestingAccount ||
            value.base_vesting_account;
        if (baseVestingAccount) {
            value = baseVestingAccount;
            const baseAccount = value.BaseAccount || value.baseAccount || value.base_account;
            if (baseAccount) {
                value = baseAccount;
            }
        }
        let address = value.address;
        if (!address) {
            if (!defaultBech32Address) {
                throw new Error(`Account's address is unknown: ${JSON.stringify(obj)}`);
            }
            address = defaultBech32Address;
        }
        const accountNumber = value.account_number;
        const sequence = value.sequence;
        return new BaseAccount(type, address, new unit_1.Int(accountNumber || "0"), new unit_1.Int(sequence || "0"));
    }
    getType() {
        return this.type;
    }
    getAddress() {
        return this.address;
    }
    getAccountNumber() {
        return this.accountNumber;
    }
    getSequence() {
        return this.sequence;
    }
}
exports.BaseAccount = BaseAccount;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 663:
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
__exportStar(__webpack_require__(396), exports);
__exportStar(__webpack_require__(664), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 664:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EthermintChainIdHelper = void 0;
const cosmos_1 = __webpack_require__(396);
class EthermintChainIdHelper {
    static parse(chainId) {
        const matches = chainId.match("^([a-z]{1,})_{1}([1-9][0-9]*)-{1}([1-9][0-9]*)$");
        if (!matches ||
            matches.length !== 4 ||
            matches[1] === "" ||
            Number.isNaN(parseFloat(matches[2])) ||
            !Number.isInteger(parseFloat(matches[2]))) {
            throw new Error(`Invalid chainId for ethermint: ${chainId}`);
        }
        const cosmosChainId = cosmos_1.ChainIdHelper.parse(chainId);
        return Object.assign(Object.assign({}, cosmosChainId), { ethChainId: parseFloat(matches[2]) });
    }
}
exports.EthermintChainIdHelper = EthermintChainIdHelper;
//# sourceMappingURL=ethermint.js.map

/***/ }),

/***/ 665:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TendermintTxTracer = void 0;
const types_1 = __webpack_require__(666);
const buffer_1 = __webpack_require__(4);
class TendermintTxTracer {
    constructor(url, wsEndpoint, options = {}) {
        this.url = url;
        this.wsEndpoint = wsEndpoint;
        this.options = options;
        this.newBlockSubscribes = [];
        // Key is "id" for jsonrpc
        this.txSubscribes = new Map();
        // Key is "id" for jsonrpc
        this.pendingQueries = new Map();
        this.listeners = {};
        this.onOpen = (e) => {
            var _a;
            if (this.newBlockSubscribes.length > 0) {
                this.sendSubscribeBlockRpc();
            }
            for (const [id, tx] of this.txSubscribes) {
                this.sendSubscribeTxRpc(id, tx.hash);
            }
            for (const [id, query] of this.pendingQueries) {
                this.sendQueryRpc(id, query.method, query.params);
            }
            for (const listener of (_a = this.listeners.open) !== null && _a !== void 0 ? _a : []) {
                listener(e);
            }
        };
        this.onMessage = (e) => {
            var _a, _b, _c, _d, _e, _f;
            for (const listener of (_a = this.listeners.message) !== null && _a !== void 0 ? _a : []) {
                listener(e);
            }
            if (e.data) {
                try {
                    const obj = JSON.parse(e.data);
                    if (obj === null || obj === void 0 ? void 0 : obj.id) {
                        if (this.pendingQueries.has(obj.id)) {
                            if (obj.error) {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                this.pendingQueries
                                    .get(obj.id)
                                    .rejector(new Error(obj.error.data || obj.error.message));
                            }
                            else {
                                // XXX: I'm not sure why this happens, but somtimes the form of tx id delivered under the "tx_result" field.
                                if ((_b = obj.result) === null || _b === void 0 ? void 0 : _b.tx_result) {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    this.pendingQueries.get(obj.id).resolver(obj.result.tx_result);
                                }
                                else {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    this.pendingQueries.get(obj.id).resolver(obj.result);
                                }
                            }
                            this.pendingQueries.delete(obj.id);
                        }
                    }
                    if (((_d = (_c = obj === null || obj === void 0 ? void 0 : obj.result) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.type) === "tendermint/event/NewBlock") {
                        for (const handler of this.newBlockSubscribes) {
                            handler.handler(obj.result.data.value);
                        }
                    }
                    if (((_f = (_e = obj === null || obj === void 0 ? void 0 : obj.result) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.type) === "tendermint/event/Tx") {
                        if (obj === null || obj === void 0 ? void 0 : obj.id) {
                            if (this.txSubscribes.has(obj.id)) {
                                if (obj.error) {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    this.txSubscribes
                                        .get(obj.id)
                                        .rejector(new Error(obj.error.data || obj.error.message));
                                }
                                else {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    this.txSubscribes
                                        .get(obj.id)
                                        .resolver(obj.result.data.value.TxResult.result);
                                }
                                this.txSubscribes.delete(obj.id);
                            }
                        }
                    }
                }
                catch (e) {
                    console.log(`Tendermint websocket jsonrpc response is not JSON: ${e.message || e.toString()}`);
                }
            }
        };
        this.onClose = (e) => {
            var _a;
            for (const listener of (_a = this.listeners.close) !== null && _a !== void 0 ? _a : []) {
                listener(e);
            }
        };
        this.ws = this.options.wsObject
            ? new this.options.wsObject(this.getWsEndpoint())
            : new WebSocket(this.getWsEndpoint());
        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessage;
        this.ws.onclose = this.onClose;
    }
    getWsEndpoint() {
        let url = this.url;
        if (url.startsWith("http")) {
            url = url.replace("http", "ws");
        }
        if (!url.endsWith(this.wsEndpoint)) {
            const wsEndpoint = this.wsEndpoint.startsWith("/")
                ? this.wsEndpoint
                : "/" + this.wsEndpoint;
            url = url.endsWith("/") ? url + wsEndpoint.slice(1) : url + wsEndpoint;
        }
        return url;
    }
    close() {
        this.ws.close();
    }
    get readyState() {
        switch (this.ws.readyState) {
            case 0:
                return types_1.WsReadyState.CONNECTING;
            case 1:
                return types_1.WsReadyState.OPEN;
            case 2:
                return types_1.WsReadyState.CLOSING;
            case 3:
                return types_1.WsReadyState.CLOSED;
            default:
                return types_1.WsReadyState.NONE;
        }
    }
    addEventListener(type, listener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.listeners[type].push(listener);
    }
    subscribeBlock(handler) {
        this.newBlockSubscribes.push({
            handler,
        });
        if (this.newBlockSubscribes.length === 1) {
            this.sendSubscribeBlockRpc();
        }
    }
    sendSubscribeBlockRpc() {
        if (this.readyState === types_1.WsReadyState.OPEN) {
            this.ws.send(JSON.stringify({
                jsonrpc: "2.0",
                method: "subscribe",
                params: ["tm.event='NewBlock'"],
                id: 1,
            }));
        }
    }
    // Query the tx and subscribe the tx.
    traceTx(hash) {
        return new Promise((resolve) => {
            // At first, try to query the tx at the same time of subscribing the tx.
            // But, the querying's error will be ignored.
            this.queryTx(hash)
                .then(resolve)
                .catch(() => {
                // noop
            });
            this.subscribeTx(hash).then(resolve);
        }).then((tx) => {
            // Occasionally, even if the subscribe tx event occurs, the state through query is not changed yet.
            // Perhaps it is because the block has not been committed yet even though the result of deliverTx in tendermint is complete.
            // This method is usually used to reflect the state change through query when tx is completed.
            // The simplest solution is to just add a little delay.
            return new Promise((resolve) => {
                setTimeout(() => resolve(tx), 100);
            });
        });
    }
    subscribeTx(hash) {
        const id = this.createRandomId();
        return new Promise((resolve, reject) => {
            this.txSubscribes.set(id, {
                hash,
                resolver: resolve,
                rejector: reject,
            });
            this.sendSubscribeTxRpc(id, hash);
        });
    }
    sendSubscribeTxRpc(id, hash) {
        if (this.readyState === types_1.WsReadyState.OPEN) {
            this.ws.send(JSON.stringify({
                jsonrpc: "2.0",
                method: "subscribe",
                params: [
                    `tm.event='Tx' AND tx.hash='${buffer_1.Buffer.from(hash)
                        .toString("hex")
                        .toUpperCase()}'`,
                ],
                id,
            }));
        }
    }
    queryTx(hash) {
        return this.query("tx", [buffer_1.Buffer.from(hash).toString("base64"), false]);
    }
    query(method, params) {
        const id = this.createRandomId();
        return new Promise((resolve, reject) => {
            this.pendingQueries.set(id, {
                method,
                params,
                resolver: resolve,
                rejector: reject,
            });
            this.sendQueryRpc(id, method, params);
        });
    }
    sendQueryRpc(id, method, params) {
        if (this.readyState === types_1.WsReadyState.OPEN) {
            this.ws.send(JSON.stringify({
                jsonrpc: "2.0",
                method,
                params,
                id,
            }));
        }
    }
    createRandomId() {
        return parseInt(Array.from({ length: 6 })
            .map(() => Math.floor(Math.random() * 100))
            .join(""));
    }
}
exports.TendermintTxTracer = TendermintTxTracer;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 666:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WsReadyState = void 0;
var WsReadyState;
(function (WsReadyState) {
    WsReadyState[WsReadyState["CONNECTING"] = 0] = "CONNECTING";
    WsReadyState[WsReadyState["OPEN"] = 1] = "OPEN";
    WsReadyState[WsReadyState["CLOSING"] = 2] = "CLOSING";
    WsReadyState[WsReadyState["CLOSED"] = 3] = "CLOSED";
    // WS is not initialized or the ready state of WS is unknown
    WsReadyState[WsReadyState["NONE"] = 4] = "NONE";
})(WsReadyState = exports.WsReadyState || (exports.WsReadyState = {}));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 667:
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
__exportStar(__webpack_require__(397), exports);
__exportStar(__webpack_require__(402), exports);
__exportStar(__webpack_require__(693), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 693:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SignDocWrapper = void 0;
const decoder_1 = __webpack_require__(402);
const tx_1 = __webpack_require__(100);
const adr_36_1 = __webpack_require__(404);
class SignDocWrapper {
    constructor(signDoc) {
        this.signDoc = signDoc;
        if ("msgs" in signDoc) {
            this.mode = "amino";
        }
        else {
            this.mode = "direct";
        }
        if (this.mode === "amino") {
            // Check that the sign doc is for ADR-36.
            // The validation should be performed on the background process.
            // So, here, we check once more, but the validation related to bech32 is considered to be done in the background process.
            this.isADR36SignDoc = adr_36_1.checkAndValidateADR36AminoSignDoc(this.aminoSignDoc);
        }
        else {
            // Currently, only support amino sign doc for ADR-36
            this.isADR36SignDoc = false;
        }
    }
    static fromAminoSignDoc(signDoc) {
        return new SignDocWrapper(signDoc);
    }
    static fromDirectSignDoc(signDoc) {
        return new SignDocWrapper(signDoc);
    }
    static fromDirectSignDocBytes(signDocBytes) {
        return new SignDocWrapper(tx_1.SignDoc.decode(signDocBytes));
    }
    clone() {
        return new SignDocWrapper(this.signDoc);
    }
    get protoSignDoc() {
        if (this.mode === "amino") {
            throw new Error("Sign doc is encoded as Amino Json");
        }
        if ("msgs" in this.signDoc) {
            throw new Error("Unexpected error");
        }
        if (!this._protoSignDoc) {
            this._protoSignDoc = new decoder_1.ProtoSignDocDecoder(this.signDoc);
        }
        return this._protoSignDoc;
    }
    get aminoSignDoc() {
        if (this.mode === "direct") {
            throw new Error("Sign doc is encoded as Protobuf");
        }
        if (!("msgs" in this.signDoc)) {
            throw new Error("Unexpected error");
        }
        return this.signDoc;
    }
    get chainId() {
        if (this.mode === "direct") {
            return this.protoSignDoc.chainId;
        }
        return this.aminoSignDoc.chain_id;
    }
    get memo() {
        if (this.mode === "direct") {
            return this.protoSignDoc.txBody.memo;
        }
        return this.aminoSignDoc.memo;
    }
    get fees() {
        var _a, _b;
        if (this.mode === "direct") {
            const fees = [];
            for (const coinObj of (_b = (_a = this.protoSignDoc.authInfo.fee) === null || _a === void 0 ? void 0 : _a.amount) !== null && _b !== void 0 ? _b : []) {
                if (coinObj.denom == null || coinObj.amount == null) {
                    throw new Error("Invalid fee");
                }
                fees.push({
                    denom: coinObj.denom,
                    amount: coinObj.amount,
                });
            }
            return fees;
        }
        return this.aminoSignDoc.fee.amount;
    }
    get gas() {
        var _a;
        if (this.mode === "direct") {
            if ((_a = this.protoSignDoc.authInfo.fee) === null || _a === void 0 ? void 0 : _a.gasLimit) {
                return parseInt(this.protoSignDoc.authInfo.fee.gasLimit);
            }
            else {
                return 0;
            }
        }
        return parseInt(this.aminoSignDoc.fee.gas);
    }
}
exports.SignDocWrapper = SignDocWrapper;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 694:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyADR36Amino = exports.verifyADR36AminoSignDoc = exports.makeADR36AminoSignDoc = exports.checkAndValidateADR36AminoSignDoc = void 0;
const signing_1 = __webpack_require__(405);
const bech32_1 = __webpack_require__(395);
const buffer_1 = __webpack_require__(4);
const crypto_1 = __webpack_require__(50);
/**
 * Check the sign doc is for ADR-36.
 * If the sign doc is expected to be ADR-36, validate the sign doc and throw an error if the sign doc is valid ADR-36.
 * @param signDoc
 * @param bech32PrefixAccAddr If this argument is provided, validate the signer in the `MsgSignData` with this prefix.
 *                            If not, validate the signer in the `MsgSignData` without considering the bech32 prefix.
 */
function checkAndValidateADR36AminoSignDoc(signDoc, bech32PrefixAccAddr) {
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
    if (!hasOnlyMsgSignData) {
        return false;
    }
    if (signDoc.chain_id !== "") {
        throw new Error("Chain id should be empty string for ADR-36 signing");
    }
    if (signDoc.memo !== "") {
        throw new Error("Memo should be empty string for ADR-36 signing");
    }
    if (signDoc.account_number !== "0") {
        throw new Error('Account number should be "0" for ADR-36 signing');
    }
    if (signDoc.sequence !== "0") {
        throw new Error('Sequence should be "0" for ADR-36 signing');
    }
    if (signDoc.fee.gas !== "0") {
        throw new Error('Gas should be "0" for ADR-36 signing');
    }
    if (signDoc.fee.amount.length !== 0) {
        throw new Error("Fee amount should be empty array for ADR-36 signing");
    }
    const msg = signDoc.msgs[0];
    if (msg.type !== "sign/MsgSignData") {
        throw new Error(`Invalid type of ADR-36 sign msg: ${msg.type}`);
    }
    if (!msg.value) {
        throw new Error("Empty value in the msg");
    }
    const signer = msg.value.signer;
    if (!signer) {
        throw new Error("Empty signer in the ADR-36 msg");
    }
    bech32_1.Bech32Address.validate(signer, bech32PrefixAccAddr);
    const data = msg.value.data;
    if (!data) {
        throw new Error("Empty data in the ADR-36 msg");
    }
    const rawData = buffer_1.Buffer.from(data, "base64");
    // Validate the data is encoded as base64.
    if (rawData.toString("base64") !== data) {
        throw new Error("Data is not encoded by base64");
    }
    if (rawData.length === 0) {
        throw new Error("Empty data in the ADR-36 msg");
    }
    return true;
}
exports.checkAndValidateADR36AminoSignDoc = checkAndValidateADR36AminoSignDoc;
function makeADR36AminoSignDoc(signer, data) {
    if (typeof data === "string") {
        data = buffer_1.Buffer.from(data).toString("base64");
    }
    else {
        data = buffer_1.Buffer.from(data).toString("base64");
    }
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
exports.makeADR36AminoSignDoc = makeADR36AminoSignDoc;
function verifyADR36AminoSignDoc(bech32PrefixAccAddr, signDoc, pubKey, signature) {
    if (!checkAndValidateADR36AminoSignDoc(signDoc, bech32PrefixAccAddr)) {
        throw new Error("Invalid sign doc for ADR-36");
    }
    const cryptoPubKey = new crypto_1.PubKeySecp256k1(pubKey);
    const expectedSigner = new bech32_1.Bech32Address(cryptoPubKey.getAddress()).toBech32(bech32PrefixAccAddr);
    const signer = signDoc.msgs[0].value.signer;
    if (expectedSigner !== signer) {
        throw new Error("Unmatched signer");
    }
    const msg = signing_1.serializeSignDoc(signDoc);
    return cryptoPubKey.verify(msg, signature);
}
exports.verifyADR36AminoSignDoc = verifyADR36AminoSignDoc;
function verifyADR36Amino(bech32PrefixAccAddr, signer, data, pubKey, signature) {
    const signDoc = makeADR36AminoSignDoc(signer, data);
    return verifyADR36AminoSignDoc(bech32PrefixAccAddr, signDoc, pubKey, signature);
}
exports.verifyADR36Amino = verifyADR36Amino;
//# sourceMappingURL=amino.js.map

/***/ }),

/***/ 695:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeSignDoc = exports.encodeSecp256k1Signature = exports.encodeSecp256k1Pubkey = void 0;
const buffer_1 = __webpack_require__(4);
const common_1 = __webpack_require__(27);
function encodeSecp256k1Pubkey(pubkey) {
    if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
        throw new Error("Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03");
    }
    return {
        type: "tendermint/PubKeySecp256k1",
        value: buffer_1.Buffer.from(pubkey).toString("base64"),
    };
}
exports.encodeSecp256k1Pubkey = encodeSecp256k1Pubkey;
function encodeSecp256k1Signature(pubkey, signature) {
    if (signature.length !== 64) {
        throw new Error("Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.");
    }
    return {
        pub_key: encodeSecp256k1Pubkey(pubkey),
        signature: buffer_1.Buffer.from(signature).toString("base64"),
    };
}
exports.encodeSecp256k1Signature = encodeSecp256k1Signature;
function serializeSignDoc(signDoc) {
    return buffer_1.Buffer.from(common_1.sortedJsonByKeyStringify(signDoc));
}
exports.serializeSignDoc = serializeSignDoc;
//# sourceMappingURL=encode.js.map

/***/ }),

/***/ 696:
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
__exportStar(__webpack_require__(697), exports);
__exportStar(__webpack_require__(698), exports);
__exportStar(__webpack_require__(283), exports);
__exportStar(__webpack_require__(699), exports);
__exportStar(__webpack_require__(700), exports);
__exportStar(__webpack_require__(701), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 697:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=interface.js.map

/***/ }),

/***/ 698:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionKVStore = void 0;
const base_1 = __webpack_require__(283);
class ExtensionKVStore extends base_1.BaseKVStore {
    constructor(prefix) {
        if (!ExtensionKVStore.KVStoreProvider) {
            if (typeof browser === "undefined") {
                console.log("You should use ExtensionKVStore on the extension environment.");
            }
            else if (!browser.storage || !browser.storage.local) {
                console.log("The 'browser' exists, but it doesn't seem to be an extension environment. This can happen in Safari browser.");
            }
            else {
                ExtensionKVStore.KVStoreProvider = {
                    get: browser.storage.local.get,
                    set: browser.storage.local.set,
                };
            }
        }
        if (!ExtensionKVStore.KVStoreProvider) {
            throw new Error("Can't initialize kv store for browser extension");
        }
        super(ExtensionKVStore.KVStoreProvider, prefix);
    }
}
exports.ExtensionKVStore = ExtensionKVStore;
//# sourceMappingURL=extension.js.map

/***/ }),

/***/ 699:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryKVStore = void 0;
const base_1 = __webpack_require__(283);
class MemoryKVStoreProvider {
    constructor() {
        this.store = {};
    }
    get() {
        return Promise.resolve(this.store);
    }
    set(items) {
        this.store = Object.assign(Object.assign({}, this.store), items);
        return Promise.resolve();
    }
}
class MemoryKVStore extends base_1.BaseKVStore {
    constructor(prefix) {
        super(new MemoryKVStoreProvider(), prefix);
    }
}
exports.MemoryKVStore = MemoryKVStore;
//# sourceMappingURL=memory.js.map

/***/ }),

/***/ 700:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalKVStore = void 0;
class LocalKVStore {
    constructor(_prefix) {
        this._prefix = _prefix;
    }
    get(key) {
        const k = this.prefix() + "/" + key;
        const data = localStorage.getItem(k);
        if (data === null) {
            return Promise.resolve(undefined);
        }
        return Promise.resolve(JSON.parse(data));
    }
    set(key, data) {
        const k = this.prefix() + "/" + key;
        if (data === null) {
            return Promise.resolve(localStorage.removeItem(k));
        }
        return Promise.resolve(localStorage.setItem(k, JSON.stringify(data)));
    }
    prefix() {
        return this._prefix;
    }
}
exports.LocalKVStore = LocalKVStore;
//# sourceMappingURL=local.js.map

/***/ }),

/***/ 701:
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
exports.IndexedDBKVStore = void 0;
class IndexedDBKVStore {
    constructor(_prefix) {
        this._prefix = _prefix;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = (yield this.getDB()).transaction([this.prefix()], "readonly");
            const store = tx.objectStore(this.prefix());
            return new Promise((resolve, reject) => {
                const request = store.get(key);
                request.onerror = (event) => {
                    event.stopPropagation();
                    reject(event.target);
                };
                request.onsuccess = () => {
                    if (!request.result) {
                        resolve(undefined);
                    }
                    else {
                        resolve(request.result.data);
                    }
                };
            });
        });
    }
    set(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === null) {
                const tx = (yield this.getDB()).transaction([this.prefix()], "readwrite");
                const store = tx.objectStore(this.prefix());
                return new Promise((resolve, reject) => {
                    const request = store.delete(key);
                    request.onerror = (event) => {
                        event.stopPropagation();
                        reject(event.target);
                    };
                    request.onsuccess = () => {
                        resolve();
                    };
                });
            }
            else {
                const tx = (yield this.getDB()).transaction([this.prefix()], "readwrite");
                const store = tx.objectStore(this.prefix());
                return new Promise((resolve, reject) => {
                    const request = store.put({
                        key,
                        data,
                    });
                    request.onerror = (event) => {
                        event.stopPropagation();
                        reject(event.target);
                    };
                    request.onsuccess = () => {
                        resolve();
                    };
                });
            }
        });
    }
    prefix() {
        return this._prefix;
    }
    getDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedDB) {
                return this.cachedDB;
            }
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open(this.prefix());
                request.onerror = (event) => {
                    event.stopPropagation();
                    reject(event.target);
                };
                request.onupgradeneeded = (event) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const db = event.target.result;
                    db.createObjectStore(this.prefix(), { keyPath: "key" });
                };
                request.onsuccess = () => {
                    this.cachedDB = request.result;
                    resolve(request.result);
                };
            });
        });
    }
}
exports.IndexedDBKVStore = IndexedDBKVStore;
//# sourceMappingURL=indexed-db.js.map

/***/ }),

/***/ 702:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DenomHelper = void 0;
const buffer_1 = __webpack_require__(4);
const crypto_1 = __webpack_require__(50);
class DenomHelper {
    constructor(_denom) {
        this._denom = _denom;
        // Remember that the coin's actual denom should start with "type:contractAddress:denom" if it is for the token based on contract.
        const split = this.denom.split(/(\w+):(\w+):(.+)/).filter(Boolean);
        if (split.length !== 1 && split.length !== 3) {
            throw new Error(`Invalid denom: ${this.denom}`);
        }
        this._type = split.length === 3 ? split[0] : "";
        this._contractAddress = split.length === 3 ? split[1] : "";
    }
    static ibcDenom(paths, coinMinimalDenom) {
        const prefixes = [];
        for (const path of paths) {
            prefixes.push(`${path.portId}/${path.channelId}`);
        }
        const prefix = prefixes.join("/");
        const denom = `${prefix}/${coinMinimalDenom}`;
        return ("ibc/" +
            buffer_1.Buffer.from(crypto_1.Hash.sha256(buffer_1.Buffer.from(denom)))
                .toString("hex")
                .toUpperCase());
    }
    get denom() {
        return this._denom;
    }
    get type() {
        return this._type || "native";
    }
    get contractAddress() {
        return this._contractAddress;
    }
}
exports.DenomHelper = DenomHelper;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 703:
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
exports.Mnemonic = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = __webpack_require__(105);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip32 = __webpack_require__(736);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bs58check = __webpack_require__(290);
const buffer_1 = __webpack_require__(4);
class Mnemonic {
    static generateWallet(rng, path = `m/44'/60'/0'/0/0`, password = "", strength = 256) {
        return __awaiter(this, void 0, void 0, function* () {
            const mnemonic = yield Mnemonic.generateSeed(rng, strength);
            const privKey = Mnemonic.generateWalletFromMnemonic(mnemonic, path, password);
            return {
                privKey,
                mnemonic,
            };
        });
    }
    static validateMnemonic(mnemonic) {
        return bip39.validateMnemonic(mnemonic);
    }
    static generateSeed(rng, strength = 128) {
        return __awaiter(this, void 0, void 0, function* () {
            if (strength % 32 !== 0) {
                throw new TypeError("invalid entropy");
            }
            let bytes = new Uint8Array(strength / 8);
            bytes = yield rng(bytes);
            return bip39.entropyToMnemonic(buffer_1.Buffer.from(bytes).toString("hex"));
        });
    }
    static generateWalletFromMnemonic(mnemonic, path = `m/44'/60'/0'/0/0`, password = "") {
        const seed = bip39.mnemonicToSeedSync(mnemonic, password);
        const masterSeed = bip32.fromSeed(seed);
        const hd = masterSeed.derivePath(path);
        const privateKey = hd.privateKey;
        if (!privateKey) {
            throw new Error("null hd key");
        }
        return privateKey;
    }
    static generateMasterSeedFromMnemonic(mnemonic, password = "") {
        const seed = bip39.mnemonicToSeedSync(mnemonic, password);
        const masterKey = bip32.fromSeed(seed);
        return buffer_1.Buffer.from(bs58check.decode(masterKey.toBase58()));
    }
    static generatePrivateKeyFromMasterSeed(seed, path = `m/44'/60'/0'/0/0`) {
        const masterSeed = bip32.fromBase58(bs58check.encode(seed));
        const hd = masterSeed.derivePath(path);
        const privateKey = hd.privateKey;
        if (!privateKey) {
            throw new Error("null hd key");
        }
        return privateKey;
    }
}
exports.Mnemonic = Mnemonic;
//# sourceMappingURL=mnemonic.js.map

/***/ }),

/***/ 767:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubKeySecp256k1 = exports.PrivKeySecp256k1 = void 0;
const elliptic_1 = __webpack_require__(97);
const crypto_js_1 = __importDefault(__webpack_require__(768));
const buffer_1 = __webpack_require__(4);
const hash_1 = __webpack_require__(459);
class PrivKeySecp256k1 {
    constructor(privKey) {
        this.privKey = privKey;
    }
    static generateRandomKey() {
        const secp256k1 = new elliptic_1.ec("secp256k1");
        return new PrivKeySecp256k1(buffer_1.Buffer.from(secp256k1.genKeyPair().getPrivate().toArray()));
    }
    toBytes() {
        return new Uint8Array(this.privKey);
    }
    getPubKey() {
        const secp256k1 = new elliptic_1.ec("secp256k1");
        const key = secp256k1.keyFromPrivate(this.privKey);
        return new PubKeySecp256k1(new Uint8Array(key.getPublic().encodeCompressed("array")));
    }
    /**
     * @deprecated Use `signDigest32(Hash.sha256(data))` instead.
     * @param msg
     */
    sign(msg) {
        return this.signDigest32(hash_1.Hash.sha256(msg));
    }
    signDigest32(digest) {
        if (digest.length !== 32) {
            throw new Error(`Invalid length of digest to sign: ${digest.length}`);
        }
        const secp256k1 = new elliptic_1.ec("secp256k1");
        const key = secp256k1.keyFromPrivate(this.privKey);
        const signature = key.sign(digest, {
            canonical: true,
        });
        return new Uint8Array(signature.r.toArray("be", 32).concat(signature.s.toArray("be", 32)));
    }
}
exports.PrivKeySecp256k1 = PrivKeySecp256k1;
class PubKeySecp256k1 {
    constructor(pubKey) {
        this.pubKey = pubKey;
    }
    toBytes() {
        return new Uint8Array(this.pubKey);
    }
    getAddress() {
        let hash = crypto_js_1.default.SHA256(crypto_js_1.default.lib.WordArray.create(this.pubKey)).toString();
        hash = crypto_js_1.default.RIPEMD160(crypto_js_1.default.enc.Hex.parse(hash)).toString();
        return new Uint8Array(buffer_1.Buffer.from(hash, "hex"));
    }
    toKeyPair() {
        const secp256k1 = new elliptic_1.ec("secp256k1");
        return secp256k1.keyFromPublic(buffer_1.Buffer.from(this.pubKey).toString("hex"), "hex");
    }
    /**
     * @deprecated Use `verifyDigest32(Hash.sha256(data))` instead.
     * @param msg
     */
    verify(msg, signature) {
        return this.verifyDigest32(hash_1.Hash.sha256(msg), signature);
    }
    verifyDigest32(digest, signature) {
        if (digest.length !== 32) {
            throw new Error(`Invalid length of digest to verify: ${digest.length}`);
        }
        if (signature.length !== 64) {
            throw new Error(`Invalid length of signature: ${signature.length}`);
        }
        const secp256k1 = new elliptic_1.ec("secp256k1");
        const r = signature.slice(0, 32);
        const s = signature.slice(32);
        return secp256k1.verify(digest, {
            r: buffer_1.Buffer.from(r).toString("hex"),
            s: buffer_1.Buffer.from(s).toString("hex"),
        }, this.toKeyPair());
    }
}
exports.PubKeySecp256k1 = PubKeySecp256k1;
//# sourceMappingURL=key.js.map

/***/ }),

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toGenerator = void 0;
// Copied from the mobx-state-tree repository.
/**
 * @experimental
 * experimental api - might change on minor/patch releases
 *
 * Convert a promise to a generator yielding that promise
 * This is intended to allow for usage of `yield*` in async actions to
 * retain the promise return type.
 *
 * Example:
 * ```ts
 * function getDataAsync(input: string): Promise<number> { ... }
 *
 * const someModel.actions(self => ({
 *   someAction: flow(function*() {
 *     // value is typed as number
 *     const value = yield* toGenerator(getDataAsync("input value"));
 *     ...
 *   })
 * }))
 * ```
 */
function* toGenerator(p) {
    return (yield p);
}
exports.toGenerator = toGenerator;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 840:
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
__exportStar(__webpack_require__(841), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 841:
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
exports.Debouncer = void 0;
class Debouncer {
    static promise(fn) {
        let currentPromise;
        return (...arguments_) => __awaiter(this, void 0, void 0, function* () {
            if (currentPromise) {
                return currentPromise;
            }
            try {
                currentPromise = fn.apply(this, arguments_);
                return yield currentPromise;
            }
            finally {
                currentPromise = undefined;
            }
        });
    }
}
exports.Debouncer = Debouncer;
//# sourceMappingURL=debouncer.js.map

/***/ }),

/***/ 842:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.unescapeHTML = exports.escapeHTML = void 0;
/**
 * Escapes <,>,& in string.
 * Golang's json marshaller escapes <,>,& by default.
 * However, because JS doesn't do that by default, to match the sign doc with cosmos-sdk,
 * we should escape <,>,& in string manually.
 * @param str
 */
function escapeHTML(str) {
    return str
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}
exports.escapeHTML = escapeHTML;
/**
 * Unescapes \u003c/(<),\u003e(>),\u0026(&) in string.
 * Golang's json marshaller escapes <,>,& by default, whilst for most of the users, such escape characters are unfamiliar.
 * This function can be used to show the escaped characters with more familiar characters.
 * @param str
 */
function unescapeHTML(str) {
    return str
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">")
        .replace(/\\u0026/g, "&");
}
exports.unescapeHTML = unescapeHTML;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 843:
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
__exportStar(__webpack_require__(844), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 844:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedJsonByKeyStringify = exports.sortObjectByKey = void 0;
function sortObjectByKey(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortObjectByKey);
    }
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    sortedKeys.forEach((key) => {
        result[key] = sortObjectByKey(obj[key]);
    });
    return result;
}
exports.sortObjectByKey = sortObjectByKey;
function sortedJsonByKeyStringify(obj) {
    return JSON.stringify(sortObjectByKey(obj));
}
exports.sortedJsonByKeyStringify = sortedJsonByKeyStringify;
//# sourceMappingURL=sort.js.map

/***/ })

}]);