(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ 1026:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=currency.js.map

/***/ }),

/***/ 1027:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=bech32.js.map

/***/ }),

/***/ 1028:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=bip44.js.map

/***/ }),

/***/ 1029:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=chain-info.js.map

/***/ }),

/***/ 1030:
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
__exportStar(__webpack_require__(1031), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1031:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=keplr.js.map

/***/ }),

/***/ 1032:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=window.js.map

/***/ }),

/***/ 1033:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EthSignType = void 0;
var EthSignType;
(function (EthSignType) {
    EthSignType["MESSAGE"] = "message";
    EthSignType["TRANSACTION"] = "transaction";
    EthSignType["EIP712"] = "eip-712";
})(EthSignType = exports.EthSignType || (exports.EthSignType = {}));
//# sourceMappingURL=ethereum.js.map

/***/ }),

/***/ 1034:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=cosmjs.js.map

/***/ }),

/***/ 1035:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1036:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1131:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uint = exports.Int = void 0;
const big_integer_1 = __importDefault(__webpack_require__(391));
const decimal_1 = __webpack_require__(140);
const etc_1 = __webpack_require__(393);
class Int {
    /**
     * @param int - Parse a number | bigInteger | string into a bigInt.
     */
    constructor(int) {
        if (typeof int === "number") {
            int = int.toString();
        }
        if (typeof int === "string") {
            if (!etc_1.isValidIntegerString(int)) {
                if (etc_1.isExponentDecString(int)) {
                    int = etc_1.exponentDecStringToDecString(int);
                }
                else {
                    throw new Error(`invalid integer: ${int}`);
                }
            }
            this.int = big_integer_1.default(int);
        }
        else if (typeof int === "bigint") {
            this.int = big_integer_1.default(int);
        }
        else {
            this.int = big_integer_1.default(int);
        }
        this.checkBitLen();
    }
    checkBitLen() {
        if (this.int.abs().gt(Int.maxInt)) {
            throw new Error(`Integer out of range ${this.int.toString()}`);
        }
    }
    toString() {
        return this.int.toString(10);
    }
    isNegative() {
        return this.int.isNegative();
    }
    isPositive() {
        return this.int.isPositive();
    }
    isZero() {
        return this.int.eq(big_integer_1.default(0));
    }
    equals(i) {
        return this.int.equals(i.int);
    }
    gt(i) {
        return this.int.gt(i.int);
    }
    gte(i) {
        return this.int.greaterOrEquals(i.int);
    }
    lt(i) {
        return this.int.lt(i.int);
    }
    lte(i) {
        return this.int.lesserOrEquals(i.int);
    }
    abs() {
        return new Int(this.int.abs());
    }
    absUInt() {
        return new Uint(this.int.abs());
    }
    add(i) {
        return new Int(this.int.add(i.int));
    }
    sub(i) {
        return new Int(this.int.subtract(i.int));
    }
    mul(i) {
        return new Int(this.int.multiply(i.int));
    }
    div(i) {
        return new Int(this.int.divide(i.int));
    }
    mod(i) {
        return new Int(this.int.mod(i.int));
    }
    neg() {
        return new Int(this.int.negate());
    }
    pow(i) {
        return new Int(this.int.pow(i.toBigNumber()));
    }
    toDec() {
        return new decimal_1.Dec(this);
    }
    toBigNumber() {
        return this.int;
    }
}
exports.Int = Int;
// (2 ** 256) - 1
Int.maxInt = big_integer_1.default("115792089237316195423570985008687907853269984665640564039457584007913129639935");
class Uint {
    /**
     * @param uint - Parse a number | bigInteger | string into a bigUint.
     */
    constructor(uint) {
        if (typeof uint === "number") {
            uint = uint.toString();
        }
        if (typeof uint === "string") {
            if (!etc_1.isValidIntegerString(uint)) {
                if (etc_1.isExponentDecString(uint)) {
                    uint = etc_1.exponentDecStringToDecString(uint);
                }
                else {
                    throw new Error(`invalid integer: ${uint}`);
                }
            }
            this.uint = big_integer_1.default(uint);
        }
        else if (typeof uint === "bigint") {
            this.uint = big_integer_1.default(uint);
        }
        else {
            this.uint = big_integer_1.default(uint);
        }
        if (this.uint.isNegative()) {
            throw new TypeError("Uint should not be negative");
        }
        this.checkBitLen();
    }
    checkBitLen() {
        if (this.uint.abs().bitLength().gt(256)) {
            throw new Error(`Integer out of range ${this.uint.toString()}`);
        }
    }
    toString() {
        return this.uint.toString(10);
    }
    isZero() {
        return this.uint.eq(big_integer_1.default(0));
    }
    equals(i) {
        return this.uint.equals(i.uint);
    }
    gt(i) {
        return this.uint.gt(i.uint);
    }
    gte(i) {
        return this.uint.greaterOrEquals(i.uint);
    }
    lt(i) {
        return this.uint.lt(i.uint);
    }
    lte(i) {
        return this.uint.lesserOrEquals(i.uint);
    }
    add(i) {
        return new Uint(this.uint.add(i.uint));
    }
    sub(i) {
        return new Uint(this.uint.subtract(i.uint));
    }
    mul(i) {
        return new Uint(this.uint.multiply(i.uint));
    }
    div(i) {
        return new Uint(this.uint.divide(i.uint));
    }
    mod(i) {
        return new Uint(this.uint.mod(i.uint));
    }
    pow(i) {
        return new Uint(this.uint.pow(i.toBigNumber()));
    }
    toDec() {
        return new decimal_1.Dec(new Int(this.toString()));
    }
    toBigNumber() {
        return this.uint;
    }
}
exports.Uint = Uint;
//# sourceMappingURL=int.js.map

/***/ }),

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dec = void 0;
const big_integer_1 = __importDefault(__webpack_require__(391));
const int_1 = __webpack_require__(139);
const coin_utils_1 = __webpack_require__(282);
const etc_1 = __webpack_require__(393);
class Dec {
    /**
     * Create a new Dec from integer with decimal place at prec
     * @param int - Parse a number | bigInteger | string into a Dec.
     * If int is string and contains dot(.), prec is ignored and automatically calculated.
     * @param prec - Precision
     */
    constructor(int, prec = 0) {
        if (typeof int === "number") {
            int = int.toString();
        }
        if (typeof int === "string") {
            if (int.length === 0) {
                throw new Error("empty string");
            }
            if (!etc_1.isValidDecimalString(int)) {
                if (etc_1.isExponentDecString(int)) {
                    int = etc_1.exponentDecStringToDecString(int);
                }
                else {
                    throw new Error(`invalid decimal: ${int}`);
                }
            }
            // Even if an input with more than 18 decimals, it does not throw an error and ignores the rest.
            const reduced = Dec.reduceDecimalsFromString(int);
            if (reduced.isDownToZero) {
                // However, as a result, if the input becomes 0, a problem may occur in mul or quo. In this case, print a warning.
                console.log(`WARNING: Got ${int}. Dec can only handle up to 18 decimals. However, since the decimal point of the input exceeds 18 digits, the remainder is discarded. As a result, input becomes 0.`);
            }
            int = reduced.res;
            if (int.indexOf(".") >= 0) {
                prec = int.length - int.indexOf(".") - 1;
                int = int.replace(".", "");
            }
            this.int = big_integer_1.default(int);
        }
        else if (int instanceof int_1.Int) {
            this.int = big_integer_1.default(int.toString());
        }
        else if (typeof int === "bigint") {
            this.int = big_integer_1.default(int);
        }
        else {
            this.int = big_integer_1.default(int);
        }
        this.int = this.int.multiply(Dec.calcPrecisionMultiplier(prec));
        this.checkBitLen();
    }
    static calcPrecisionMultiplier(prec) {
        if (prec < 0) {
            throw new Error("Invalid prec");
        }
        if (prec > Dec.precision) {
            throw new Error("Too much precision");
        }
        if (Dec.precisionMultipliers[prec.toString()]) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return Dec.precisionMultipliers[prec.toString()];
        }
        const zerosToAdd = Dec.precision - prec;
        const multiplier = big_integer_1.default(10).pow(zerosToAdd);
        Dec.precisionMultipliers[prec.toString()] = multiplier;
        return multiplier;
    }
    static reduceDecimalsFromString(str) {
        const decimalPointIndex = str.indexOf(".");
        if (decimalPointIndex < 0) {
            return {
                res: str,
                isDownToZero: false,
            };
        }
        const exceededDecimals = str.length - 1 - decimalPointIndex - Dec.precision;
        if (exceededDecimals <= 0) {
            return {
                res: str,
                isDownToZero: false,
            };
        }
        const res = str.slice(0, str.length - exceededDecimals);
        return {
            res,
            isDownToZero: /^[0.]*$/.test(res),
        };
    }
    checkBitLen() {
        if (this.int.abs().gt(Dec.maxDec)) {
            throw new Error(`Integer out of range ${this.int.toString()}`);
        }
    }
    isZero() {
        return this.int.eq(big_integer_1.default(0));
    }
    isNegative() {
        return this.int.isNegative();
    }
    isPositive() {
        return this.int.isPositive();
    }
    equals(d2) {
        return this.int.eq(d2.int);
    }
    /**
     * Alias for the greater method.
     */
    gt(d2) {
        return this.int.gt(d2.int);
    }
    /**
     * Alias for the greaterOrEquals method.
     */
    gte(d2) {
        return this.int.geq(d2.int);
    }
    /**
     * Alias for the lesser method.
     */
    lt(d2) {
        return this.int.lt(d2.int);
    }
    /**
     * Alias for the lesserOrEquals method.
     */
    lte(d2) {
        return this.int.leq(d2.int);
    }
    /**
     * reverse the decimal sign.
     */
    neg() {
        return new Dec(this.int.negate(), Dec.precision);
    }
    /**
     * Returns the absolute value of a decimals.
     */
    abs() {
        return new Dec(this.int.abs(), Dec.precision);
    }
    add(d2) {
        return new Dec(this.int.add(d2.int), Dec.precision);
    }
    sub(d2) {
        return new Dec(this.int.subtract(d2.int), Dec.precision);
    }
    pow(n) {
        if (n.isZero()) {
            return new Dec(1);
        }
        if (n.isNegative()) {
            return new Dec(1).quo(this.pow(n.abs()));
        }
        let base = new Dec(this.int, Dec.precision);
        let tmp = new Dec(1);
        for (let i = n; i.gt(new int_1.Int(1)); i = i.div(new int_1.Int(2))) {
            if (!i.mod(new int_1.Int(2)).isZero()) {
                tmp = tmp.mul(base);
            }
            base = base.mul(base);
        }
        return base.mul(tmp);
    }
    mul(d2) {
        return new Dec(this.mulRaw(d2).chopPrecisionAndRound(), Dec.precision);
    }
    mulTruncate(d2) {
        return new Dec(this.mulRaw(d2).chopPrecisionAndTruncate(), Dec.precision);
    }
    mulRaw(d2) {
        return new Dec(this.int.multiply(d2.int), Dec.precision);
    }
    quo(d2) {
        return new Dec(this.quoRaw(d2).chopPrecisionAndRound(), Dec.precision);
    }
    quoTruncate(d2) {
        return new Dec(this.quoRaw(d2).chopPrecisionAndTruncate(), Dec.precision);
    }
    quoRoundUp(d2) {
        return new Dec(this.quoRaw(d2).chopPrecisionAndRoundUp(), Dec.precision);
    }
    quoRaw(d2) {
        const precision = Dec.calcPrecisionMultiplier(0);
        // multiply precision twice
        const mul = this.int.multiply(precision).multiply(precision);
        return new Dec(mul.divide(d2.int), Dec.precision);
    }
    isInteger() {
        const precision = Dec.calcPrecisionMultiplier(0);
        return this.int.remainder(precision).equals(big_integer_1.default(0));
    }
    /**
     * Remove a Precision amount of rightmost digits and perform bankers rounding
     * on the remainder (gaussian rounding) on the digits which have been removed.
     */
    chopPrecisionAndRound() {
        // Remove the negative and add it back when returning
        if (this.isNegative()) {
            const absoulteDec = this.abs();
            const choped = absoulteDec.chopPrecisionAndRound();
            return choped.negate();
        }
        const precision = Dec.calcPrecisionMultiplier(0);
        const fivePrecision = precision.divide(big_integer_1.default(2));
        // Get the truncated quotient and remainder
        const { quotient, remainder } = this.int.divmod(precision);
        // If remainder is zero
        if (remainder.equals(big_integer_1.default(0))) {
            return quotient;
        }
        if (remainder.lt(fivePrecision)) {
            return quotient;
        }
        else if (remainder.gt(fivePrecision)) {
            return quotient.add(big_integer_1.default(1));
        }
        else {
            // always round to an even number
            if (quotient.divide(big_integer_1.default(2)).equals(big_integer_1.default(0))) {
                return quotient;
            }
            else {
                return quotient.add(big_integer_1.default(1));
            }
        }
    }
    chopPrecisionAndRoundUp() {
        // Remove the negative and add it back when returning
        if (this.isNegative()) {
            const absoulteDec = this.abs();
            // truncate since d is negative...
            const choped = absoulteDec.chopPrecisionAndTruncate();
            return choped.negate();
        }
        const precision = Dec.calcPrecisionMultiplier(0);
        // Get the truncated quotient and remainder
        const { quotient, remainder } = this.int.divmod(precision);
        // If remainder is zero
        if (remainder.equals(big_integer_1.default(0))) {
            return quotient;
        }
        return quotient.add(big_integer_1.default(1));
    }
    /**
     * Similar to chopPrecisionAndRound, but always rounds down
     */
    chopPrecisionAndTruncate() {
        const precision = Dec.calcPrecisionMultiplier(0);
        return this.int.divide(precision);
    }
    toString(prec = Dec.precision, locale = false) {
        const precision = Dec.calcPrecisionMultiplier(0);
        const int = this.int.abs();
        const { quotient: integer, remainder: fraction } = int.divmod(precision);
        let fractionStr = fraction.toString(10);
        for (let i = 0, l = fractionStr.length; i < Dec.precision - l; i++) {
            fractionStr = "0" + fractionStr;
        }
        fractionStr = fractionStr.substring(0, prec);
        const isNegative = this.isNegative() &&
            !(integer.eq(big_integer_1.default(0)) && fractionStr.length === 0);
        const integerStr = locale
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                coin_utils_1.CoinUtils.integerStringToUSLocaleString(integer.toString())
            : integer.toString();
        return `${isNegative ? "-" : ""}${integerStr}${fractionStr.length > 0 ? "." + fractionStr : ""}`;
    }
    round() {
        return new int_1.Int(this.chopPrecisionAndRound());
    }
    roundUp() {
        return new int_1.Int(this.chopPrecisionAndRoundUp());
    }
    truncate() {
        return new int_1.Int(this.chopPrecisionAndTruncate());
    }
    roundDec() {
        return new Dec(this.chopPrecisionAndRound(), 0);
    }
    roundUpDec() {
        return new Dec(this.chopPrecisionAndRoundUp(), 0);
    }
    truncateDec() {
        return new Dec(this.chopPrecisionAndTruncate(), 0);
    }
}
exports.Dec = Dec;
Dec.precision = 18;
// Bytes required to represent the above precision is 18.
// Ceiling[Log2[999 999 999 999 999 999]]
Dec.decimalPrecisionBits = 60;
// Max bit length for `Dec` is 256 + 60(decimalPrecisionBits)
// The int in the `Dec` is handled as integer assuming that it has 18 precision.
// (2 ** (256 + 60) - 1)
Dec.maxDec = big_integer_1.default("133499189745056880149688856635597007162669032647290798121690100488888732861290034376435130433535");
Dec.precisionMultipliers = {};
//# sourceMappingURL=decimal.js.map

/***/ }),

/***/ 1624:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DecUtils = void 0;
const decimal_1 = __webpack_require__(140);
const int_1 = __webpack_require__(139);
class DecUtils {
    static trim(dec) {
        let decStr = typeof dec === "string" ? dec : dec.toString();
        if (decStr.indexOf(".") < 0) {
            return decStr;
        }
        for (let i = decStr.length - 1; i >= 0; i--) {
            if (decStr[i] === "0") {
                decStr = decStr.slice(0, i);
            }
            else {
                break;
            }
        }
        if (decStr.length > 0) {
            if (decStr[decStr.length - 1] === ".") {
                decStr = decStr.slice(0, decStr.length - 1);
            }
        }
        return decStr;
    }
    static getTenExponentN(n) {
        if (n < -decimal_1.Dec.precision) {
            // Dec can only handle up to precision 18.
            // Anything less than 18 precision is 0, so there is a high probability of an error.
            throw new Error("Too little precision");
        }
        if (DecUtils.tenExponentNs[n.toString()]) {
            return DecUtils.tenExponentNs[n.toString()];
        }
        const dec = new decimal_1.Dec(10).pow(new int_1.Int(n));
        DecUtils.tenExponentNs[n.toString()] = dec;
        return dec;
    }
    static getTenExponentNInPrecisionRange(n) {
        if (n > decimal_1.Dec.precision) {
            throw new Error("Too much precision");
        }
        return DecUtils.getTenExponentN(n);
    }
    /**
     * @deprecated Use`getTenExponentNInPrecisionRange`
     */
    static getPrecisionDec(precision) {
        return DecUtils.getTenExponentNInPrecisionRange(precision);
    }
}
exports.DecUtils = DecUtils;
DecUtils.tenExponentNs = {};
//# sourceMappingURL=dec-utils.js.map

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IntPretty = void 0;
const int_1 = __webpack_require__(139);
const decimal_1 = __webpack_require__(140);
const dec_utils_1 = __webpack_require__(173);
const coin_utils_1 = __webpack_require__(282);
class IntPretty {
    constructor(num) {
        this.floatingDecimalPointRight = 0;
        this._options = {
            maxDecimals: 0,
            trim: false,
            shrink: false,
            ready: true,
            locale: true,
            inequalitySymbol: false,
            inequalitySymbolSeparator: " ",
        };
        if (typeof num === "object" && "toDec" in num) {
            num = num.toDec();
        }
        else if (!(num instanceof decimal_1.Dec)) {
            num = new decimal_1.Dec(num);
        }
        if (num.isZero()) {
            this.dec = num;
            return;
        }
        let dec = num;
        let decPrecision = 0;
        for (let i = 0; i < 18; i++) {
            if (!dec.truncate().equals(new int_1.Int(0)) &&
                dec.equals(new decimal_1.Dec(dec.truncate()))) {
                break;
            }
            dec = dec.mul(new decimal_1.Dec(10));
            decPrecision++;
        }
        this.dec = num;
        this._options.maxDecimals = decPrecision;
    }
    get options() {
        return this._options;
    }
    moveDecimalPointLeft(delta) {
        const pretty = this.clone();
        pretty.floatingDecimalPointRight += -delta;
        return pretty;
    }
    moveDecimalPointRight(delta) {
        const pretty = this.clone();
        pretty.floatingDecimalPointRight += delta;
        return pretty;
    }
    /**
     * @deprecated Use`moveDecimalPointLeft`
     */
    increasePrecision(delta) {
        return this.moveDecimalPointLeft(delta);
    }
    /**
     * @deprecated Use`moveDecimalPointRight`
     */
    decreasePrecision(delta) {
        return this.moveDecimalPointRight(delta);
    }
    maxDecimals(max) {
        const pretty = this.clone();
        pretty._options.maxDecimals = max;
        return pretty;
    }
    inequalitySymbol(bool) {
        const pretty = this.clone();
        pretty._options.inequalitySymbol = bool;
        return pretty;
    }
    inequalitySymbolSeparator(str) {
        const pretty = this.clone();
        pretty._options.inequalitySymbolSeparator = str;
        return pretty;
    }
    trim(bool) {
        const pretty = this.clone();
        pretty._options.trim = bool;
        return pretty;
    }
    shrink(bool) {
        const pretty = this.clone();
        pretty._options.shrink = bool;
        return pretty;
    }
    locale(locale) {
        const pretty = this.clone();
        pretty._options.locale = locale;
        return pretty;
    }
    /**
     * Ready indicates the actual value is ready to show the users.
     * Even if the ready option is false, it expects that the value can be shown to users (probably as 0).
     * The method that returns prettied value may return `undefined` or `null` if the value is not ready.
     * But, alternatively, it can return the 0 value that can be shown the users anyway, but indicates that the value is not ready.
     * @param bool
     */
    ready(bool) {
        const pretty = this.clone();
        pretty._options.ready = bool;
        return pretty;
    }
    get isReady() {
        return this._options.ready;
    }
    add(target) {
        if (!(target instanceof decimal_1.Dec)) {
            target = target.toDec();
        }
        const pretty = new IntPretty(this.toDec().add(target));
        pretty._options = Object.assign({}, this._options);
        return pretty;
    }
    sub(target) {
        if (!(target instanceof decimal_1.Dec)) {
            target = target.toDec();
        }
        const pretty = new IntPretty(this.toDec().sub(target));
        pretty._options = Object.assign({}, this._options);
        return pretty;
    }
    mul(target) {
        if (!(target instanceof decimal_1.Dec)) {
            target = target.toDec();
        }
        const pretty = new IntPretty(this.toDec().mul(target));
        pretty._options = Object.assign({}, this._options);
        return pretty;
    }
    quo(target) {
        if (!(target instanceof decimal_1.Dec)) {
            target = target.toDec();
        }
        const pretty = new IntPretty(this.toDec().quo(target));
        pretty._options = Object.assign({}, this._options);
        return pretty;
    }
    toDec() {
        if (this.floatingDecimalPointRight === 0) {
            return this.dec;
        }
        else if (this.floatingDecimalPointRight > 0) {
            return this.dec.mulTruncate(dec_utils_1.DecUtils.getTenExponentN(this.floatingDecimalPointRight));
        }
        else {
            // Since a decimal in Dec cannot exceed 18, it cannot be computed at once.
            let i = -this.floatingDecimalPointRight;
            let dec = this.dec;
            while (i > 0) {
                if (i >= decimal_1.Dec.precision) {
                    dec = dec.mulTruncate(dec_utils_1.DecUtils.getTenExponentN(-decimal_1.Dec.precision));
                    i -= decimal_1.Dec.precision;
                }
                else {
                    dec = dec.mulTruncate(dec_utils_1.DecUtils.getTenExponentN(-(i % decimal_1.Dec.precision)));
                    break;
                }
            }
            return dec;
        }
    }
    toString() {
        return this.toStringWithSymbols("", "");
    }
    toStringWithSymbols(prefix, suffix) {
        const dec = this.toDec();
        if (this._options.inequalitySymbol &&
            !dec.isZero() &&
            dec.abs().lt(dec_utils_1.DecUtils.getTenExponentN(-this._options.maxDecimals))) {
            const isNeg = dec.isNegative();
            return `${isNeg ? ">" : "<"}${this._options.inequalitySymbolSeparator}${isNeg ? "-" : ""}${prefix}${dec_utils_1.DecUtils.getTenExponentN(-this._options.maxDecimals).toString(this._options.maxDecimals, this._options.locale)}${suffix}`;
        }
        let result;
        if (!this._options.shrink) {
            result = dec.toString(this._options.maxDecimals, this._options.locale);
        }
        else {
            result = coin_utils_1.CoinUtils.shrinkDecimals(dec, 0, this._options.maxDecimals, this._options.locale);
        }
        if (this._options.trim) {
            result = dec_utils_1.DecUtils.trim(result);
        }
        const isNeg = result.charAt(0) === "-";
        if (isNeg) {
            result = result.slice(1);
        }
        return `${isNeg ? "-" : ""}${prefix}${result}${suffix}`;
    }
    clone() {
        const pretty = new IntPretty(this.dec);
        pretty.dec = this.dec;
        pretty.floatingDecimalPointRight = this.floatingDecimalPointRight;
        pretty._options = Object.assign({}, this._options);
        return pretty;
    }
}
exports.IntPretty = IntPretty;
//# sourceMappingURL=int-pretty.js.map

/***/ }),

/***/ 26:
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
__exportStar(__webpack_require__(209), exports);
__exportStar(__webpack_require__(656), exports);
__exportStar(__webpack_require__(392), exports);
__exportStar(__webpack_require__(139), exports);
__exportStar(__webpack_require__(140), exports);
__exportStar(__webpack_require__(282), exports);
__exportStar(__webpack_require__(173), exports);
__exportStar(__webpack_require__(657), exports);
__exportStar(__webpack_require__(658), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 282:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinUtils = void 0;
const coin_1 = __webpack_require__(392);
const int_1 = __webpack_require__(139);
const decimal_1 = __webpack_require__(140);
const dec_utils_1 = __webpack_require__(173);
class CoinUtils {
    static createCoinsFromPrimitives(coinPrimitives) {
        return coinPrimitives.map((primitive) => {
            return new coin_1.Coin(primitive.denom, primitive.amount);
        });
    }
    static amountOf(coins, denom) {
        const coin = coins.find((coin) => {
            return coin.denom === denom;
        });
        if (!coin) {
            return new int_1.Int(0);
        }
        else {
            return coin.amount;
        }
    }
    static exclude(coins, demons) {
        return coins.filter((coin) => {
            return demons.indexOf(coin.denom) === 0;
        });
    }
    static concat(...coins) {
        if (coins.length === 0) {
            return [];
        }
        const arr = coins.slice();
        const reducer = (accumulator, coin) => {
            // Find the duplicated denom.
            const find = accumulator.find((c) => c.denom === coin.denom);
            // If duplicated coin exists, add the amount to duplicated one.
            if (find) {
                const newCoin = new coin_1.Coin(find.denom, find.amount.add(coin.amount));
                accumulator.push(newCoin);
            }
            else {
                const newCoin = new coin_1.Coin(coin.denom, coin.amount);
                accumulator.push(newCoin);
            }
            return accumulator;
        };
        return arr.reduce(reducer, []);
    }
    static getCoinFromDecimals(currencies, decAmountStr, denom) {
        const currency = currencies.find((currency) => {
            return currency.coinDenom === denom;
        });
        if (!currency) {
            throw new Error("Invalid currency");
        }
        let precision = new decimal_1.Dec(1);
        for (let i = 0; i < currency.coinDecimals; i++) {
            precision = precision.mul(new decimal_1.Dec(10));
        }
        let decAmount = new decimal_1.Dec(decAmountStr);
        decAmount = decAmount.mul(precision);
        if (!new decimal_1.Dec(decAmount.truncate()).equals(decAmount)) {
            throw new Error("Can't divide anymore");
        }
        return new coin_1.Coin(currency.coinMinimalDenom, decAmount.truncate());
    }
    static parseDecAndDenomFromCoin(currencies, coin) {
        let currency = currencies.find((currency) => {
            return currency.coinMinimalDenom === coin.denom;
        });
        if (!currency) {
            // If the currency is unknown, just use the raw currency.
            currency = {
                coinDecimals: 0,
                coinDenom: coin.denom,
                coinMinimalDenom: coin.denom,
            };
        }
        let precision = new decimal_1.Dec(1);
        for (let i = 0; i < currency.coinDecimals; i++) {
            precision = precision.mul(new decimal_1.Dec(10));
        }
        const decAmount = new decimal_1.Dec(coin.amount).quoTruncate(precision);
        return {
            amount: decAmount.toString(currency.coinDecimals),
            denom: currency.coinDenom,
        };
    }
    static shrinkDecimals(dec, minDecimals, maxDecimals, locale = false) {
        if (dec.equals(new decimal_1.Dec(0))) {
            return "0";
        }
        const isNeg = dec.isNegative();
        const integer = dec.abs().truncate();
        const fraction = dec.abs().sub(new decimal_1.Dec(integer));
        const decimals = Math.max(maxDecimals - integer.toString().length + 1, minDecimals);
        const fractionStr = decimals === 0 ? "" : fraction.toString(decimals).replace("0.", "");
        const integerStr = locale
            ? CoinUtils.integerStringToUSLocaleString(integer.toString())
            : integer.toString();
        return ((isNeg ? "-" : "") +
            integerStr +
            (fractionStr.length > 0 ? "." : "") +
            fractionStr);
    }
    /**
     * Change the non-locale integer string to locale string.
     * Only support en-US format.
     * This method uses the BigInt if the environment supports the BigInt.
     * @param numberStr
     */
    static integerStringToUSLocaleString(numberStr) {
        if (numberStr.indexOf(".") >= 0) {
            throw new Error(`${numberStr} is not integer`);
        }
        if (typeof BigInt !== "undefined") {
            return BigInt(numberStr).toLocaleString("en-US");
        }
        const integer = numberStr;
        const chunks = [];
        for (let i = integer.length; i > 0; i -= 3) {
            chunks.push(integer.slice(Math.max(0, i - 3), i));
        }
        return chunks.reverse().join(",");
    }
    static coinToTrimmedString(coin, currency, separator = " ") {
        const dec = new decimal_1.Dec(coin.amount).quoTruncate(dec_utils_1.DecUtils.getPrecisionDec(currency.coinDecimals));
        return `${dec_utils_1.DecUtils.trim(dec)}${separator}${currency.coinDenom}`;
    }
}
exports.CoinUtils = CoinUtils;
//# sourceMappingURL=coin-utils.js.map

/***/ }),

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
const int_1 = __webpack_require__(139);
class Coin {
    constructor(denom, amount) {
        this.denom = denom;
        this.amount = amount instanceof int_1.Int ? amount : new int_1.Int(amount);
    }
    static parse(str) {
        const re = new RegExp("([0-9]+)[ ]*([a-zA-Z]+)$");
        const execed = re.exec(str);
        if (!execed || execed.length !== 3) {
            throw new Error("Invalid coin str");
        }
        const denom = execed[2];
        const amount = execed[1];
        return new Coin(denom, amount);
    }
    toString() {
        return `${this.amount.toString()}${this.denom}`;
    }
}
exports.Coin = Coin;
//# sourceMappingURL=coin.js.map

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.exponentDecStringToDecString = exports.isExponentDecString = exports.isValidDecimalString = exports.isValidIntegerString = void 0;
const regexIntString = /^-?\d+$/;
const regexDecString = /^-?\d+.?\d*$/;
const regexExponentDecString = /^(-?)([\d.]+)e([-+])([\d]+)$/;
function isValidIntegerString(str) {
    return regexIntString.test(str);
}
exports.isValidIntegerString = isValidIntegerString;
function isValidDecimalString(str) {
    return regexDecString.test(str);
}
exports.isValidDecimalString = isValidDecimalString;
function isExponentDecString(str) {
    return regexExponentDecString.test(str);
}
exports.isExponentDecString = isExponentDecString;
function makeZerosStr(len) {
    let r = "";
    for (let i = 0; i < len; i++) {
        r += "0";
    }
    return r;
}
function removeHeadZeros(str) {
    while (str.length > 0 && str[0] === "0") {
        str = str.slice(1);
    }
    if (str.length === 0 || str[0] === ".") {
        return "0" + str;
    }
    return str;
}
function exponentDecStringToDecString(str) {
    const split = str.split(regexExponentDecString);
    if (split.length !== 6) {
        return str;
    }
    const isNeg = split[1] === "-";
    let numStr = split[2];
    const numStrFractionIndex = numStr.indexOf(".");
    const exponentStr = split[4];
    let exponent = parseInt(exponentStr) * (split[3] === "-" ? -1 : 1);
    if (numStrFractionIndex >= 0) {
        const fractionLen = numStr.length - numStrFractionIndex - 1;
        exponent = exponent - fractionLen;
        numStr = removeHeadZeros(numStr.replace(".", ""));
    }
    const prefix = isNeg ? "-" : "";
    if (exponent < 0) {
        if (numStr.length > -exponent) {
            const fractionPosition = numStr.length + exponent;
            return (prefix +
                (numStr.slice(0, fractionPosition) +
                    "." +
                    numStr.slice(fractionPosition)));
        }
        return prefix + "0." + makeZerosStr(-(numStr.length + exponent)) + numStr;
    }
    else {
        return prefix + numStr + makeZerosStr(exponent);
    }
}
exports.exponentDecStringToDecString = exponentDecStringToDecString;
//# sourceMappingURL=etc.js.map

/***/ }),

/***/ 656:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinPretty = void 0;
const int_pretty_1 = __webpack_require__(209);
const decimal_1 = __webpack_require__(140);
const dec_utils_1 = __webpack_require__(173);
class CoinPretty {
    constructor(_currency, amount) {
        this._currency = _currency;
        this.amount = amount;
        this._options = {
            separator: " ",
            upperCase: false,
            lowerCase: false,
            hideDenom: false,
            hideIBCMetadata: false,
        };
        if (typeof this.amount === "object" && "toDec" in this.amount) {
            this.amount = this.amount.toDec();
        }
        else if (!(this.amount instanceof decimal_1.Dec)) {
            this.amount = new decimal_1.Dec(this.amount);
        }
        this.intPretty = new int_pretty_1.IntPretty(this.amount.quoTruncate(dec_utils_1.DecUtils.getTenExponentNInPrecisionRange(_currency.coinDecimals))).maxDecimals(_currency.coinDecimals);
    }
    get options() {
        return Object.assign(Object.assign({}, this._options), this.intPretty.options);
    }
    get denom() {
        return this.currency.coinDenom;
    }
    get currency() {
        return this._currency;
    }
    setCurrency(currency) {
        const pretty = this.clone();
        pretty.intPretty = this.intPretty.moveDecimalPointRight(this._currency.coinDecimals - currency.coinDecimals);
        pretty._currency = currency;
        return pretty;
    }
    separator(str) {
        const pretty = this.clone();
        pretty._options.separator = str;
        return pretty;
    }
    upperCase(bool) {
        const pretty = this.clone();
        pretty._options.upperCase = bool;
        pretty._options.lowerCase = !bool;
        return pretty;
    }
    lowerCase(bool) {
        const pretty = this.clone();
        pretty._options.lowerCase = bool;
        pretty._options.upperCase = !bool;
        return pretty;
    }
    hideDenom(bool) {
        const pretty = this.clone();
        pretty._options.hideDenom = bool;
        return pretty;
    }
    hideIBCMetadata(bool) {
        const pretty = this.clone();
        pretty._options.hideIBCMetadata = bool;
        return pretty;
    }
    moveDecimalPointLeft(delta) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.moveDecimalPointLeft(delta);
        return pretty;
    }
    moveDecimalPointRight(delta) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.moveDecimalPointRight(delta);
        return pretty;
    }
    /**
     * @deprecated Use`moveDecimalPointLeft`
     */
    increasePrecision(delta) {
        return this.moveDecimalPointLeft(delta);
    }
    /**
     * @deprecated Use`moveDecimalPointRight`
     */
    decreasePrecision(delta) {
        return this.moveDecimalPointRight(delta);
    }
    maxDecimals(max) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.maxDecimals(max);
        return pretty;
    }
    inequalitySymbol(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.inequalitySymbol(bool);
        return pretty;
    }
    inequalitySymbolSeparator(str) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.inequalitySymbolSeparator(str);
        return pretty;
    }
    trim(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.trim(bool);
        return pretty;
    }
    shrink(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.shrink(bool);
        return pretty;
    }
    locale(locale) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.locale(locale);
        return pretty;
    }
    /**
     * Ready indicates the actual value is ready to show the users.
     * Even if the ready option is false, it expects that the value can be shown to users (probably as 0).
     * The method that returns prettied value may return `undefined` or `null` if the value is not ready.
     * But, alternatively, it can return the 0 value that can be shown the users anyway, but indicates that the value is not ready.
     * @param bool
     */
    ready(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.ready(bool);
        return pretty;
    }
    get isReady() {
        return this.intPretty.isReady;
    }
    add(target) {
        const isCoinPretty = target instanceof CoinPretty;
        if (isCoinPretty) {
            // If target is `CoinPretty` and it has different denom, do nothing.
            if ("currency" in target &&
                this.currency.coinMinimalDenom !== target.currency.coinMinimalDenom) {
                return this.clone();
            }
        }
        if ("toDec" in target) {
            target = target.toDec();
        }
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.add(isCoinPretty
            ? target
            : target.mul(dec_utils_1.DecUtils.getTenExponentNInPrecisionRange(-this._currency.coinDecimals)));
        return pretty;
    }
    sub(target) {
        const isCoinPretty = target instanceof CoinPretty;
        if (isCoinPretty) {
            // If target is `CoinPretty` and it has different denom, do nothing.
            if ("currency" in target &&
                this.currency.coinMinimalDenom !== target.currency.coinMinimalDenom) {
                return this.clone();
            }
        }
        if ("toDec" in target) {
            target = target.toDec();
        }
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.sub(isCoinPretty
            ? target
            : target.mul(dec_utils_1.DecUtils.getTenExponentNInPrecisionRange(-this._currency.coinDecimals)));
        return pretty;
    }
    mul(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.mul(target);
        return pretty;
    }
    quo(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.quo(target);
        return pretty;
    }
    toDec() {
        return this.intPretty.toDec();
    }
    toCoin() {
        const amount = this.toDec()
            .mulTruncate(dec_utils_1.DecUtils.getTenExponentNInPrecisionRange(this.currency.coinDecimals))
            .truncate();
        return {
            denom: this.currency.coinMinimalDenom,
            amount: amount.toString(),
        };
    }
    toString() {
        let denom = this.denom;
        if (this._options.hideIBCMetadata &&
            "originCurrency" in this.currency &&
            this.currency.originCurrency) {
            denom = this.currency.originCurrency.coinDenom;
        }
        if (this._options.upperCase) {
            denom = denom.toUpperCase();
        }
        if (this._options.lowerCase) {
            denom = denom.toLowerCase();
        }
        let separator = this._options.separator;
        if (this._options.hideDenom) {
            denom = "";
            separator = "";
        }
        return this.intPretty.toStringWithSymbols("", `${separator}${denom}`);
    }
    clone() {
        const pretty = new CoinPretty(this._currency, this.amount);
        pretty._options = Object.assign({}, this._options);
        pretty.intPretty = this.intPretty.clone();
        return pretty;
    }
}
exports.CoinPretty = CoinPretty;
//# sourceMappingURL=coin-pretty.js.map

/***/ }),

/***/ 657:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PricePretty = void 0;
const int_pretty_1 = __webpack_require__(209);
const dec_utils_1 = __webpack_require__(173);
class PricePretty {
    constructor(_fiatCurrency, amount) {
        this._fiatCurrency = _fiatCurrency;
        this.amount = amount;
        this._options = {
            separator: "",
            upperCase: false,
            lowerCase: false,
            locale: "en-US",
        };
        this.intPretty = new int_pretty_1.IntPretty(amount)
            .maxDecimals(_fiatCurrency.maxDecimals)
            .shrink(true)
            .trim(true)
            .locale(false)
            .inequalitySymbol(true);
        this._options.locale = _fiatCurrency.locale;
    }
    get options() {
        return Object.assign(Object.assign({}, this.intPretty.options), this._options);
    }
    get symbol() {
        return this._fiatCurrency.symbol;
    }
    get fiatCurrency() {
        return this._fiatCurrency;
    }
    separator(str) {
        const pretty = this.clone();
        pretty._options.separator = str;
        return pretty;
    }
    upperCase(bool) {
        const pretty = this.clone();
        pretty._options.upperCase = bool;
        pretty._options.lowerCase = !bool;
        return pretty;
    }
    lowerCase(bool) {
        const pretty = this.clone();
        pretty._options.lowerCase = bool;
        pretty._options.upperCase = !bool;
        return pretty;
    }
    moveDecimalPointLeft(delta) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.moveDecimalPointLeft(delta);
        return pretty;
    }
    moveDecimalPointRight(delta) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.moveDecimalPointRight(delta);
        return pretty;
    }
    /**
     * @deprecated Use`moveDecimalPointLeft`
     */
    increasePrecision(delta) {
        return this.moveDecimalPointLeft(delta);
    }
    /**
     * @deprecated Use`moveDecimalPointRight`
     */
    decreasePrecision(delta) {
        return this.moveDecimalPointRight(delta);
    }
    maxDecimals(max) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.maxDecimals(max);
        return pretty;
    }
    inequalitySymbol(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.inequalitySymbol(bool);
        return pretty;
    }
    inequalitySymbolSeparator(str) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.inequalitySymbolSeparator(str);
        return pretty;
    }
    trim(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.trim(bool);
        return pretty;
    }
    shrink(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.shrink(bool);
        return pretty;
    }
    locale(locale) {
        const pretty = this.clone();
        pretty._options.locale = locale;
        return pretty;
    }
    /**
     * Ready indicates the actual value is ready to show the users.
     * Even if the ready option is false, it expects that the value can be shown to users (probably as 0).
     * The method that returns prettied value may return `undefined` or `null` if the value is not ready.
     * But, alternatively, it can return the 0 value that can be shown the users anyway, but indicates that the value is not ready.
     * @param bool
     */
    ready(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.ready(bool);
        return pretty;
    }
    get isReady() {
        return this.intPretty.isReady;
    }
    add(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.add(target);
        return pretty;
    }
    sub(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.sub(target);
        return pretty;
    }
    mul(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.mul(target);
        return pretty;
    }
    quo(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.quo(target);
        return pretty;
    }
    toDec() {
        return this.intPretty.toDec();
    }
    toString() {
        let symbol = this.symbol;
        if (this._options.upperCase) {
            symbol = symbol.toUpperCase();
        }
        if (this._options.lowerCase) {
            symbol = symbol.toLowerCase();
        }
        const dec = this.toDec();
        const options = this.options;
        if (options.inequalitySymbol &&
            !dec.isZero() &&
            dec.abs().lt(dec_utils_1.DecUtils.getTenExponentN(-options.maxDecimals))) {
            return this.intPretty.toStringWithSymbols(`${symbol}${this._options.separator}`, "");
        }
        let localeString = parseFloat(this.intPretty.toString()).toLocaleString(options.locale, {
            maximumFractionDigits: options.maxDecimals,
        });
        const isNeg = localeString.charAt(0) === "-";
        if (isNeg) {
            localeString = localeString.slice(1);
        }
        return `${isNeg ? "-" : ""}${symbol}${this._options.separator}${localeString}`;
    }
    clone() {
        const pretty = new PricePretty(this._fiatCurrency, this.amount);
        pretty._options = Object.assign({}, this._options);
        pretty.intPretty = this.intPretty.clone();
        return pretty;
    }
}
exports.PricePretty = PricePretty;
//# sourceMappingURL=price-pretty.js.map

/***/ }),

/***/ 658:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RatePretty = void 0;
const int_pretty_1 = __webpack_require__(209);
/**
 * RatePretty treats `Dec` in rate form for easy calculation, and displays it as a percentage to the user by using toString().
 * By default, if the value is less than maxDeciamls, it is displayed using an inequality sign (Ex. < 0.001%)
 */
class RatePretty {
    constructor(amount) {
        this.amount = amount;
        this._options = {
            separator: "",
            symbol: "%",
        };
        this.intPretty = new int_pretty_1.IntPretty(amount);
        this.intPretty = this.intPretty
            .maxDecimals(3)
            .shrink(false)
            .trim(true)
            .locale(true)
            .inequalitySymbol(true);
    }
    get options() {
        return Object.assign(Object.assign({}, this.intPretty.options), this._options);
    }
    separator(str) {
        const pretty = this.clone();
        pretty._options.separator = str;
        return pretty;
    }
    symbol(str) {
        const pretty = this.clone();
        pretty._options.symbol = str;
        return pretty;
    }
    moveDecimalPointLeft(delta) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.moveDecimalPointLeft(delta);
        return pretty;
    }
    moveDecimalPointRight(delta) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.moveDecimalPointRight(delta);
        return pretty;
    }
    maxDecimals(max) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.maxDecimals(max);
        return pretty;
    }
    inequalitySymbol(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.inequalitySymbol(bool);
        return pretty;
    }
    inequalitySymbolSeparator(str) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.inequalitySymbolSeparator(str);
        return pretty;
    }
    trim(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.trim(bool);
        return pretty;
    }
    shrink(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.shrink(bool);
        return pretty;
    }
    locale(locale) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.locale(locale);
        return pretty;
    }
    /**
     * Ready indicates the actual value is ready to show the users.
     * Even if the ready option is false, it expects that the value can be shown to users (probably as 0).
     * The method that returns prettied value may return `undefined` or `null` if the value is not ready.
     * But, alternatively, it can return the 0 value that can be shown the users anyway, but indicates that the value is not ready.
     * @param bool
     */
    ready(bool) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.ready(bool);
        return pretty;
    }
    get isReady() {
        return this.intPretty.isReady;
    }
    add(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.add(target);
        return pretty;
    }
    sub(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.sub(target);
        return pretty;
    }
    mul(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.mul(target);
        return pretty;
    }
    quo(target) {
        const pretty = this.clone();
        pretty.intPretty = pretty.intPretty.quo(target);
        return pretty;
    }
    toDec() {
        return this.intPretty.toDec();
    }
    toString() {
        return this.intPretty
            .moveDecimalPointRight(2)
            .toStringWithSymbols("", `${this._options.separator}${this._options.symbol}`);
    }
    clone() {
        const pretty = new RatePretty(this.amount);
        pretty._options = Object.assign({}, this._options);
        pretty.intPretty = this.intPretty.clone();
        return pretty;
    }
}
exports.RatePretty = RatePretty;
//# sourceMappingURL=rate-pretty.js.map

/***/ }),

/***/ 660:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 703:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 705:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 714:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 716:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 742:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 787:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 789:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 796:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 797:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 862:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 884:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 96:
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
__exportStar(__webpack_require__(1026), exports);
__exportStar(__webpack_require__(1027), exports);
__exportStar(__webpack_require__(1028), exports);
__exportStar(__webpack_require__(1029), exports);
__exportStar(__webpack_require__(1030), exports);
__exportStar(__webpack_require__(1032), exports);
__exportStar(__webpack_require__(1033), exports);
__exportStar(__webpack_require__(1034), exports);
//# sourceMappingURL=index.js.map

/***/ })

}]);