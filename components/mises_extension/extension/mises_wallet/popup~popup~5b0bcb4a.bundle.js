(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
var ALPHABET_MAP = {}
for (var z = 0; z < ALPHABET.length; z++) {
  var x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
  var b = pre >> 25
  return ((pre & 0x1FFFFFF) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
}

function prefixChk (prefix) {
  var chk = 1
  for (var i = 0; i < prefix.length; ++i) {
    var c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) return 'Invalid prefix (' + prefix + ')'

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (i = 0; i < prefix.length; ++i) {
    var v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

function encode (prefix, words, LIMIT) {
  LIMIT = LIMIT || 90
  if ((prefix.length + 7 + words.length) > LIMIT) throw new TypeError('Exceeds length limit')

  prefix = prefix.toLowerCase()

  // determine chk mod
  var chk = prefixChk(prefix)
  if (typeof chk === 'string') throw new Error(chk)

  var result = prefix + '1'
  for (var i = 0; i < words.length; ++i) {
    var x = words[i]
    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (i = 0; i < 6; ++i) {
    var v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

function __decode (str, LIMIT) {
  LIMIT = LIMIT || 90
  if (str.length < 8) return str + ' too short'
  if (str.length > LIMIT) return 'Exceeds length limit'

  // don't allow mixed case
  var lowered = str.toLowerCase()
  var uppered = str.toUpperCase()
  if (str !== lowered && str !== uppered) return 'Mixed-case string ' + str
  str = lowered

  var split = str.lastIndexOf('1')
  if (split === -1) return 'No separator character for ' + str
  if (split === 0) return 'Missing prefix for ' + str

  var prefix = str.slice(0, split)
  var wordChars = str.slice(split + 1)
  if (wordChars.length < 6) return 'Data too short'

  var chk = prefixChk(prefix)
  if (typeof chk === 'string') return chk

  var words = []
  for (var i = 0; i < wordChars.length; ++i) {
    var c = wordChars.charAt(i)
    var v = ALPHABET_MAP[c]
    if (v === undefined) return 'Unknown character ' + c
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }

  if (chk !== 1) return 'Invalid checksum for ' + str
  return { prefix: prefix, words: words }
}

function decodeUnsafe () {
  var res = __decode.apply(null, arguments)
  if (typeof res === 'object') return res
}

function decode (str) {
  var res = __decode.apply(null, arguments)
  if (typeof res === 'object') return res

  throw new Error(res)
}

function convert (data, inBits, outBits, pad) {
  var value = 0
  var bits = 0
  var maxV = (1 << outBits) - 1

  var result = []
  for (var i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) return 'Excess padding'
    if ((value << (outBits - bits)) & maxV) return 'Non-zero padding'
  }

  return result
}

function toWordsUnsafe (bytes) {
  var res = convert(bytes, 8, 5, true)
  if (Array.isArray(res)) return res
}

function toWords (bytes) {
  var res = convert(bytes, 8, 5, true)
  if (Array.isArray(res)) return res

  throw new Error(res)
}

function fromWordsUnsafe (words) {
  var res = convert(words, 5, 8, false)
  if (Array.isArray(res)) return res
}

function fromWords (words) {
  var res = convert(words, 5, 8, false)
  if (Array.isArray(res)) return res

  throw new Error(res)
}

module.exports = {
  decodeUnsafe: decodeUnsafe,
  decode: decode,
  encode: encode,
  toWordsUnsafe: toWordsUnsafe,
  toWords: toWords,
  fromWordsUnsafe: fromWordsUnsafe,
  fromWords: fromWords
}


/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
const createHash = __webpack_require__(106);
const pbkdf2_1 = __webpack_require__(213);
const randomBytes = __webpack_require__(127);
const _wordlists_1 = __webpack_require__(425);
let DEFAULT_WORDLIST = _wordlists_1._default;
const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED = 'A wordlist is required but a default could not be found.\n' +
    'Please explicitly pass a 2048 word array explicitly.';
function pbkdf2Promise(password, saltMixin, iterations, keylen, digest) {
    return Promise.resolve().then(() => new Promise((resolve, reject) => {
        const callback = (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(derivedKey);
            }
        };
        pbkdf2_1.pbkdf2(password, saltMixin, iterations, keylen, digest, callback);
    }));
}
function normalize(str) {
    return (str || '').normalize('NFKD');
}
function lpad(str, padString, length) {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}
function binaryToByte(bin) {
    return parseInt(bin, 2);
}
function bytesToBinary(bytes) {
    return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}
function deriveChecksumBits(entropyBuffer) {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = createHash('sha256')
        .update(entropyBuffer)
        .digest();
    return bytesToBinary(Array.from(hash)).slice(0, CS);
}
function salt(password) {
    return 'mnemonic' + (password || '');
}
function mnemonicToSeedSync(mnemonic, password) {
    const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
    const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
    return pbkdf2_1.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
}
exports.mnemonicToSeedSync = mnemonicToSeedSync;
function mnemonicToSeed(mnemonic, password) {
    return Promise.resolve().then(() => {
        const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
        const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
        return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
    });
}
exports.mnemonicToSeed = mnemonicToSeed;
function mnemonicToEntropy(mnemonic, wordlist) {
    wordlist = wordlist || DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    const words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }
    // convert word indices to 11 bit binary strings
    const bits = words
        .map((word) => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(INVALID_MNEMONIC);
        }
        return lpad(index.toString(2), '0', 11);
    })
        .join('');
    // split the binary string into ENT/CS
    const dividerIndex = Math.floor(bits.length / 33) * 32;
    const entropyBits = bits.slice(0, dividerIndex);
    const checksumBits = bits.slice(dividerIndex);
    // calculate the checksum and compare
    const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }
    const entropy = Buffer.from(entropyBytes);
    const newChecksum = deriveChecksumBits(entropy);
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }
    return entropy.toString('hex');
}
exports.mnemonicToEntropy = mnemonicToEntropy;
function entropyToMnemonic(entropy, wordlist) {
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
    }
    wordlist = wordlist || DEFAULT_WORDLIST;
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    // 128 <= ENT <= 256
    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    const entropyBits = bytesToBinary(Array.from(entropy));
    const checksumBits = deriveChecksumBits(entropy);
    const bits = entropyBits + checksumBits;
    const chunks = bits.match(/(.{1,11})/g);
    const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
    });
    return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ');
}
exports.entropyToMnemonic = entropyToMnemonic;
function generateMnemonic(strength, rng, wordlist) {
    strength = strength || 128;
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    rng = rng || randomBytes;
    return entropyToMnemonic(rng(strength / 8), wordlist);
}
exports.generateMnemonic = generateMnemonic;
function validateMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.validateMnemonic = validateMnemonic;
function setDefaultWordlist(language) {
    const result = _wordlists_1.wordlists[language];
    if (result) {
        DEFAULT_WORDLIST = result;
    }
    else {
        throw new Error('Could not find wordlist for language "' + language + '"');
    }
}
exports.setDefaultWordlist = setDefaultWordlist;
function getDefaultWordlist() {
    if (!DEFAULT_WORDLIST) {
        throw new Error('No Default Wordlist set');
    }
    return Object.keys(_wordlists_1.wordlists).filter((lang) => {
        if (lang === 'JA' || lang === 'EN') {
            return false;
        }
        return _wordlists_1.wordlists[lang].every((word, index) => word === DEFAULT_WORDLIST[index]);
    })[0];
}
exports.getDefaultWordlist = getDefaultWordlist;
var _wordlists_2 = __webpack_require__(425);
exports.wordlists = _wordlists_2.wordlists;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4).Buffer))

/***/ }),

/***/ 1201:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDITIONAL_INTL_MESSAGES = exports.ADDITIONAL_SIGN_IN_PREPEND = void 0;
exports.ADDITIONAL_SIGN_IN_PREPEND = undefined;
exports.ADDITIONAL_INTL_MESSAGES = {};
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, Buffer) {/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(278);
/* harmony import */ var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(72);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _amplitude_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1221);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(603);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1320);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(255);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(256);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var blueimp_md5__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1321);
/* harmony import */ var blueimp_md5__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(blueimp_md5__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(639);
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(query_string__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _amplitude_ua_parser_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1322);
/* harmony import */ var _amplitude_ua_parser_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_amplitude_ua_parser_js__WEBPACK_IMPORTED_MODULE_9__);











var Constants = {
  DEFAULT_INSTANCE: '$default_instance',
  API_VERSION: 2,
  MAX_STRING_LENGTH: 4096,
  MAX_PROPERTY_KEYS: 1000,
  IDENTIFY_EVENT: '$identify',
  GROUP_IDENTIFY_EVENT: '$groupidentify',
  EVENT_LOG_URL: 'api.amplitude.com',
  EVENT_LOG_EU_URL: 'api.eu.amplitude.com',
  DYNAMIC_CONFIG_URL: 'regionconfig.amplitude.com',
  DYNAMIC_CONFIG_EU_URL: 'regionconfig.eu.amplitude.com',
  // localStorageKeys
  LAST_EVENT_ID: 'amplitude_lastEventId',
  LAST_EVENT_TIME: 'amplitude_lastEventTime',
  LAST_IDENTIFY_ID: 'amplitude_lastIdentifyId',
  LAST_SEQUENCE_NUMBER: 'amplitude_lastSequenceNumber',
  SESSION_ID: 'amplitude_sessionId',
  // Used in cookie as well
  DEVICE_ID: 'amplitude_deviceId',
  OPT_OUT: 'amplitude_optOut',
  USER_ID: 'amplitude_userId',
  // indexes of properties in cookie v2 storage format
  DEVICE_ID_INDEX: 0,
  USER_ID_INDEX: 1,
  OPT_OUT_INDEX: 2,
  SESSION_ID_INDEX: 3,
  LAST_EVENT_TIME_INDEX: 4,
  EVENT_ID_INDEX: 5,
  IDENTIFY_ID_INDEX: 6,
  SEQUENCE_NUMBER_INDEX: 7,
  COOKIE_TEST_PREFIX: 'amp_cookie_test',
  COOKIE_PREFIX: 'amp',
  // Storage options
  STORAGE_DEFAULT: '',
  STORAGE_COOKIES: 'cookies',
  STORAGE_NONE: 'none',
  STORAGE_LOCAL: 'localStorage',
  STORAGE_SESSION: 'sessionStorage',
  // revenue keys
  REVENUE_EVENT: 'revenue_amount',
  REVENUE_PRODUCT_ID: '$productId',
  REVENUE_QUANTITY: '$quantity',
  REVENUE_PRICE: '$price',
  REVENUE_REVENUE_TYPE: '$revenueType',
  AMP_DEVICE_ID_PARAM: 'amp_device_id',
  // url param
  REFERRER: 'referrer',
  // UTM Params
  UTM_SOURCE: 'utm_source',
  UTM_MEDIUM: 'utm_medium',
  UTM_CAMPAIGN: 'utm_campaign',
  UTM_TERM: 'utm_term',
  UTM_CONTENT: 'utm_content',
  ATTRIBUTION_EVENT: '[Amplitude] Attribution Captured',
  TRANSPORT_HTTP: 'http',
  TRANSPORT_BEACON: 'beacon'
};

/*
 * UTF-8 encoder/decoder
 * http://www.webtoolkit.info/
 */
var UTF8 = {
  encode: function encode(s) {
    var utftext = '';

    for (var n = 0; n < s.length; n++) {
      var c = s.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode(c >> 6 | 192);
        utftext += String.fromCharCode(c & 63 | 128);
      } else {
        utftext += String.fromCharCode(c >> 12 | 224);
        utftext += String.fromCharCode(c >> 6 & 63 | 128);
        utftext += String.fromCharCode(c & 63 | 128);
      }
    }

    return utftext;
  },
  decode: function decode(utftext) {
    var s = '';
    var i = 0;
    var c = 0,
        c1 = 0,
        c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        s += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c1 = utftext.charCodeAt(i + 1);
        s += String.fromCharCode((c & 31) << 6 | c1 & 63);
        i += 2;
      } else {
        c1 = utftext.charCodeAt(i + 1);
        c2 = utftext.charCodeAt(i + 2);
        s += String.fromCharCode((c & 15) << 12 | (c1 & 63) << 6 | c2 & 63);
        i += 3;
      }
    }

    return s;
  }
};

/* global globalThis */
var GlobalScope = function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }
}();

/*
 * Base64 encoder/decoder
 * http://www.webtoolkit.info/
 */

var Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function encode(input) {
    try {
      if (GlobalScope.btoa && GlobalScope.atob) {
        return GlobalScope.btoa(unescape(encodeURIComponent(input)));
      }
    } catch (e) {//log(e);
    }

    return Base64._encode(input);
  },
  _encode: function _encode(input) {
    var output = '';
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = UTF8.encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
    }

    return output;
  },
  decode: function decode(input) {
    try {
      if (GlobalScope.btoa && GlobalScope.atob) {
        return decodeURIComponent(escape(GlobalScope.atob(input)));
      }
    } catch (e) {//log(e);
    }

    return Base64._decode(input);
  },
  _decode: function _decode(input) {
    var output = '';
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9+/=]/g, '');

    while (i < input.length) {
      enc1 = Base64._keyStr.indexOf(input.charAt(i++));
      enc2 = Base64._keyStr.indexOf(input.charAt(i++));
      enc3 = Base64._keyStr.indexOf(input.charAt(i++));
      enc4 = Base64._keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = UTF8.decode(output);
    return output;
  }
};

/**
 * toString ref.
 * @private
 */
var toString = Object.prototype.toString;
/**
 * Return the type of `val`.
 * @private
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

function type (val) {
  switch (toString.call(val)) {
    case '[object Date]':
      return 'date';

    case '[object RegExp]':
      return 'regexp';

    case '[object Arguments]':
      return 'arguments';

    case '[object Array]':
      return 'array';

    case '[object Error]':
      return 'error';
  }

  if (val === null) {
    return 'null';
  }

  if (val === undefined) {
    return 'undefined';
  }

  if (val !== val) {
    return 'nan';
  }

  if (val && val.nodeType === 1) {
    return 'element';
  }

  if (typeof Buffer !== 'undefined' && typeof Buffer.isBuffer === 'function' && Buffer.isBuffer(val)) {
    return 'buffer';
  }

  val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);
  return _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_3___default()(val);
}

var logLevels = {
  DISABLE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3
};
var logLevel = logLevels.WARN;

var setLogLevel = function setLogLevel(logLevelName) {
  if (Object.prototype.hasOwnProperty.call(logLevels, logLevelName)) {
    logLevel = logLevels[logLevelName];
  }
};

var getLogLevel = function getLogLevel() {
  return logLevel;
};

var log = {
  error: function error(s) {
    if (logLevel >= logLevels.ERROR) {
      _log(s);
    }
  },
  warn: function warn(s) {
    if (logLevel >= logLevels.WARN) {
      _log(s);
    }
  },
  info: function info(s) {
    if (logLevel >= logLevels.INFO) {
      _log(s);
    }
  }
};

var _log = function _log(s) {
  try {
    console.log('[Amplitude] ' + s);
  } catch (e) {// console logging not available
  }
};

var isEmptyString = function isEmptyString(str) {
  return !str || str.length === 0;
};

var sessionStorageEnabled = function sessionStorageEnabled() {
  try {
    if (GlobalScope.sessionStorage) {
      return true;
    }
  } catch (e) {// sessionStorage disabled
  }

  return false;
}; // truncate string values in event and user properties so that request size does not get too large


var truncate = function truncate(value) {
  if (type(value) === 'array') {
    for (var i = 0; i < value.length; i++) {
      value[i] = truncate(value[i]);
    }
  } else if (type(value) === 'object') {
    for (var key in value) {
      if (key in value) {
        value[key] = truncate(value[key]);
      }
    }
  } else {
    value = _truncateValue(value);
  }

  return value;
};

var _truncateValue = function _truncateValue(value) {
  if (type(value) === 'string') {
    return value.length > Constants.MAX_STRING_LENGTH ? value.substring(0, Constants.MAX_STRING_LENGTH) : value;
  }

  return value;
};

var validateInput = function validateInput(input, name, expectedType) {
  if (type(input) !== expectedType) {
    log.error('Invalid ' + name + ' input type. Expected ' + expectedType + ' but received ' + type(input));
    return false;
  }

  return true;
};

var validateDeviceId = function validateDeviceId(deviceId) {
  if (!validateInput(deviceId, 'deviceId', 'string')) {
    return false;
  }

  if (deviceId.includes('.')) {
    log.error("Device IDs may not contain '.' characters. Value will be ignored: \"".concat(deviceId, "\""));
    return false;
  }

  return true;
};

var validateTransport = function validateTransport(transport) {
  if (!validateInput(transport, 'transport', 'string')) {
    return false;
  }

  if (transport !== Constants.TRANSPORT_HTTP && transport !== Constants.TRANSPORT_BEACON) {
    log.error("transport value must be one of '".concat(Constants.TRANSPORT_BEACON, "' or '").concat(Constants.TRANSPORT_HTTP, "'"));
    return false;
  }

  if (transport !== Constants.TRANSPORT_HTTP && !navigator.sendBeacon) {
    log.error("browser does not support sendBeacon, so transport must be HTTP");
    return false;
  }

  return true;
}; // do some basic sanitization and type checking, also catch property dicts with more than 1000 key/value pairs


var validateProperties = function validateProperties(properties) {
  var propsType = type(properties);

  if (propsType !== 'object') {
    log.error('Error: invalid properties format. Expecting Javascript object, received ' + propsType + ', ignoring');
    return {};
  }

  if (Object.keys(properties).length > Constants.MAX_PROPERTY_KEYS) {
    log.error('Error: too many properties (more than 1000), ignoring');
    return {};
  }

  var copy = {}; // create a copy with all of the valid properties

  for (var property in properties) {
    if (!Object.prototype.hasOwnProperty.call(properties, property)) {
      continue;
    } // validate key


    var key = property;
    var keyType = type(key);

    if (keyType !== 'string') {
      key = String(key);
      log.warn('WARNING: Non-string property key, received type ' + keyType + ', coercing to string "' + key + '"');
    } // validate value


    var value = validatePropertyValue(key, properties[property]);

    if (value === null) {
      continue;
    }

    copy[key] = value;
  }

  return copy;
};

var invalidValueTypes = ['nan', 'function', 'arguments', 'regexp', 'element'];

var validatePropertyValue = function validatePropertyValue(key, value) {
  var valueType = type(value);

  if (invalidValueTypes.indexOf(valueType) !== -1) {
    log.warn('WARNING: Property key "' + key + '" with invalid value type ' + valueType + ', ignoring');
    value = null;
  } else if (valueType === 'undefined') {
    value = null;
  } else if (valueType === 'error') {
    value = String(value);
    log.warn('WARNING: Property key "' + key + '" with value type error, coercing to ' + value);
  } else if (valueType === 'array') {
    // check for nested arrays or objects
    var arrayCopy = [];

    for (var i = 0; i < value.length; i++) {
      var element = value[i];
      var elemType = type(element);

      if (elemType === 'array') {
        log.warn('WARNING: Cannot have ' + elemType + ' nested in an array property value, skipping');
        continue;
      } else if (elemType === 'object') {
        arrayCopy.push(validateProperties(element));
      } else {
        arrayCopy.push(validatePropertyValue(key, element));
      }
    }

    value = arrayCopy;
  } else if (valueType === 'object') {
    value = validateProperties(value);
  }

  return value;
};

var validateGroups = function validateGroups(groups) {
  var groupsType = type(groups);

  if (groupsType !== 'object') {
    log.error('Error: invalid groups format. Expecting Javascript object, received ' + groupsType + ', ignoring');
    return {};
  }

  var copy = {}; // create a copy with all of the valid properties

  for (var group in groups) {
    if (!Object.prototype.hasOwnProperty.call(groups, group)) {
      continue;
    } // validate key


    var key = group;
    var keyType = type(key);

    if (keyType !== 'string') {
      key = String(key);
      log.warn('WARNING: Non-string groupType, received type ' + keyType + ', coercing to string "' + key + '"');
    } // validate value


    var value = validateGroupName(key, groups[group]);

    if (value === null) {
      continue;
    }

    copy[key] = value;
  }

  return copy;
};

var validateGroupName = function validateGroupName(key, groupName) {
  var groupNameType = type(groupName);

  if (groupNameType === 'string') {
    return groupName;
  }

  if (groupNameType === 'date' || groupNameType === 'number' || groupNameType === 'boolean') {
    groupName = String(groupName);
    log.warn('WARNING: Non-string groupName, received type ' + groupNameType + ', coercing to string "' + groupName + '"');
    return groupName;
  }

  if (groupNameType === 'array') {
    // check for nested arrays or objects
    var arrayCopy = [];

    for (var i = 0; i < groupName.length; i++) {
      var element = groupName[i];
      var elemType = type(element);

      if (elemType === 'array' || elemType === 'object') {
        log.warn('WARNING: Skipping nested ' + elemType + ' in array groupName');
        continue;
      } else if (elemType === 'string') {
        arrayCopy.push(element);
      } else if (elemType === 'date' || elemType === 'number' || elemType === 'boolean') {
        element = String(element);
        log.warn('WARNING: Non-string groupName, received type ' + elemType + ', coercing to string "' + element + '"');
        arrayCopy.push(element);
      }
    }

    return arrayCopy;
  }

  log.warn('WARNING: Non-string groupName, received type ' + groupNameType + '. Please use strings or array of strings for groupName');
}; // parses the value of a url param (for example ?gclid=1234&...)


var getQueryParam = function getQueryParam(name, query) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(query);
  return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var isWebWorkerEnvironment = function isWebWorkerEnvironment() {
  return typeof WorkerGlobalScope !== 'undefined';
};

var validateSessionId = function validateSessionId(sessionId) {
  if (validateInput(sessionId, 'sessionId', 'number') && new Date(sessionId).getTime() > 0) {
    return true;
  }

  log.error("sessionId value must in milliseconds since epoch (Unix Timestamp)");
  return false;
};

var utils = {
  setLogLevel: setLogLevel,
  getLogLevel: getLogLevel,
  logLevels: logLevels,
  log: log,
  isEmptyString: isEmptyString,
  isWebWorkerEnvironment: isWebWorkerEnvironment,
  getQueryParam: getQueryParam,
  sessionStorageEnabled: sessionStorageEnabled,
  truncate: truncate,
  validateGroups: validateGroups,
  validateInput: validateInput,
  validateProperties: validateProperties,
  validateDeviceId: validateDeviceId,
  validateTransport: validateTransport,
  validateSessionId: validateSessionId
};

var getLocation = function getLocation() {
  return GlobalScope.location;
};

// A URL safe variation on the the list of Base64 characters
var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

var base64Id = function base64Id() {
  var str = '';

  for (var i = 0; i < 22; ++i) {
    str += base64Chars.charAt(Math.floor(Math.random() * 64));
  }

  return str;
};

var get = function get(name) {
  try {
    var ca = document.cookie.split(';');
    var value = null;

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(name) === 0) {
        value = c.substring(name.length, c.length);
        break;
      }
    }

    return value;
  } catch (e) {
    return null;
  }
};

var getAll = function getAll(name) {
  try {
    var cookieArray = document.cookie.split(';').map(function (c) {
      return c.trimStart();
    });
    var values = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = cookieArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cookie = _step.value;

        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) === 0) {
          values.push(cookie.substring(name.length));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return values;
  } catch (e) {
    return [];
  }
};

var set = function set(name, value, opts) {
  var expires = value !== null ? opts.expirationDays : -1;

  if (expires) {
    var date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    expires = date;
  }

  var str = name + '=' + value;

  if (expires) {
    str += '; expires=' + expires.toUTCString();
  }

  str += '; path=/';

  if (opts.domain) {
    str += '; domain=' + opts.domain;
  }

  if (opts.secure) {
    str += '; Secure';
  }

  if (opts.sameSite) {
    str += '; SameSite=' + opts.sameSite;
  }

  document.cookie = str;
};

var getLastEventTime = function getLastEventTime() {
  var cookie = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var strValue = cookie.split('.')[Constants.LAST_EVENT_TIME_INDEX];
  var parsedValue;

  if (strValue) {
    parsedValue = parseInt(strValue, 32);
  }

  if (parsedValue) {
    return parsedValue;
  } else {
    utils.log.warn("unable to parse malformed cookie: ".concat(cookie));
    return 0;
  }
};

var sortByEventTime = function sortByEventTime(cookies) {
  return _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4___default()(cookies).sort(function (c1, c2) {
    var t1 = getLastEventTime(c1);
    var t2 = getLastEventTime(c2); // sort c1 first if its last event time is more recent
    // i.e its event time integer is larger that c2's

    return t2 - t1;
  });
}; // test that cookies are enabled - navigator.cookiesEnabled yields false positives in IE, need to test directly


var areCookiesEnabled = function areCookiesEnabled() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cookieName = Constants.COOKIE_TEST_PREFIX + base64Id();

  if (typeof document === 'undefined') {
    return false;
  }

  var _areCookiesEnabled = false;

  try {
    var uid = String(new Date());
    set(cookieName, uid, opts);
    utils.log.info("Testing if cookies available");
    _areCookiesEnabled = get(cookieName + '=') === uid;
  } catch (e) {
    utils.log.warn("Error thrown when checking for cookies. Reason: \"".concat(e, "\""));
  } finally {
    utils.log.info("Cleaning up cookies availability test");
    set(cookieName, null, opts);
  }

  return _areCookiesEnabled;
};

var baseCookie = {
  set: set,
  get: get,
  getAll: getAll,
  getLastEventTime: getLastEventTime,
  sortByEventTime: sortByEventTime,
  areCookiesEnabled: areCookiesEnabled
};

var getHost = function getHost(url) {
  if (url) {
    if (typeof document !== 'undefined') {
      var a = document.createElement('a');
      a.href = url;
      return a.hostname || GlobalScope.location.hostname;
    }

    if (typeof URL === 'function') {
      var u = new URL(url);
      return u.hostname || GlobalScope.location.hostname;
    }
  }

  return GlobalScope.location.hostname;
};

var topDomain = function topDomain(url) {
  var host = getHost(url);
  var parts = host.split('.');
  var levels = [];
  var cname = '_tldtest_' + base64Id();
  if (utils.isWebWorkerEnvironment()) return '';

  for (var i = parts.length - 2; i >= 0; --i) {
    levels.push(parts.slice(i).join('.'));
  }

  for (var _i = 0; _i < levels.length; ++_i) {
    var domain = levels[_i];
    var opts = {
      domain: '.' + domain
    };
    baseCookie.set(cname, 1, opts);

    if (baseCookie.get(cname)) {
      baseCookie.set(cname, null, opts);
      return domain;
    }
  }

  return '';
};

/*
 * Cookie data
 */
var _options = {
  expirationDays: undefined,
  domain: undefined
};

var reset = function reset() {
  _options = {
    expirationDays: undefined,
    domain: undefined
  };
};

var options = function options(opts) {
  if (arguments.length === 0) {
    return _options;
  }

  opts = opts || {};
  _options.expirationDays = opts.expirationDays;
  _options.secure = opts.secure;
  _options.sameSite = opts.sameSite;
  var domain = !utils.isEmptyString(opts.domain) ? opts.domain : '.' + topDomain(getLocation().href);
  var token = Math.random();
  _options.domain = domain;
  set$1('amplitude_test', token);
  var stored = get$1('amplitude_test');

  if (!stored || stored !== token) {
    domain = null;
  }

  remove('amplitude_test');
  _options.domain = domain;
  return _options;
};

var _domainSpecific = function _domainSpecific(name) {
  // differentiate between cookies on different domains
  var suffix = '';

  if (_options.domain) {
    suffix = _options.domain.charAt(0) === '.' ? _options.domain.substring(1) : _options.domain;
  }

  return name + suffix;
};

var get$1 = function get(name) {
  var nameEq = _domainSpecific(name) + '=';
  var value = baseCookie.get(nameEq);

  try {
    if (value) {
      return JSON.parse(Base64.decode(value));
    }
  } catch (e) {
    return null;
  }

  return null;
};

var set$1 = function set(name, value) {
  try {
    baseCookie.set(_domainSpecific(name), Base64.encode(JSON.stringify(value)), _options);
    return true;
  } catch (e) {
    return false;
  }
};

var setRaw = function setRaw(name, value) {
  try {
    baseCookie.set(_domainSpecific(name), value, _options);
    return true;
  } catch (e) {
    return false;
  }
};

var getRaw = function getRaw(name) {
  var nameEq = _domainSpecific(name) + '=';
  return baseCookie.get(nameEq);
};

var remove = function remove(name) {
  try {
    baseCookie.set(_domainSpecific(name), null, _options);
    return true;
  } catch (e) {
    return false;
  }
};

var Cookie = {
  reset: reset,
  options: options,
  get: get$1,
  set: set$1,
  remove: remove,
  setRaw: setRaw,
  getRaw: getRaw
};

var WorkerStorage =
/*#__PURE__*/
function () {
  function WorkerStorage() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default()(this, WorkerStorage);

    this.map = new Map();
    this.length = 0;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_6___default()(WorkerStorage, [{
    key: "key",
    value: function key(index) {
      var keys = Array.from(this.map.keys());
      var key = keys[index];
      return this.map.get(key);
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      return this.map.get(key);
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      if (!this.map.has(key)) {
        this.length += 1;
      }

      this.map.set(key, value);
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      if (this.map.has(key)) {
        this.length -= 1;
        this.map.delete(key);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.map.clear();
      this.length = 0;
    }
  }]);

  return WorkerStorage;
}();

/*
 * Implement localStorage to support Firefox 2-3 and IE 5-7
 */
var localStorage;

{
  // test that Window.localStorage is available and works
  var windowLocalStorageAvailable = function windowLocalStorageAvailable() {
    var uid = new Date();
    var result;

    try {
      GlobalScope.localStorage.setItem(uid, uid);
      result = GlobalScope.localStorage.getItem(uid) === String(uid);
      GlobalScope.localStorage.removeItem(uid);
      return result;
    } catch (e) {// localStorage not available
    }

    return false;
  };

  if (windowLocalStorageAvailable()) {
    localStorage = GlobalScope.localStorage;
  } else if (typeof GlobalScope !== 'undefined' && GlobalScope.globalStorage) {
    // Firefox 2-3 use globalStorage
    // See https://developer.mozilla.org/en/dom/storage#globalStorage
    try {
      localStorage = GlobalScope.globalStorage[GlobalScope.location.hostname];
    } catch (e) {// Something bad happened...
    }
  } else if (typeof document !== 'undefined') {
    // IE 5-7 use userData
    // See http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx
    var div = document.createElement('div'),
        attrKey = 'localStorage';
    div.style.display = 'none';
    document.getElementsByTagName('head')[0].appendChild(div);

    if (div.addBehavior) {
      div.addBehavior('#default#userdata');
      localStorage = {
        length: 0,
        setItem: function setItem(k, v) {
          div.load(attrKey);

          if (!div.getAttribute(k)) {
            this.length++;
          }

          div.setAttribute(k, v);
          div.save(attrKey);
        },
        getItem: function getItem(k) {
          div.load(attrKey);
          return div.getAttribute(k);
        },
        removeItem: function removeItem(k) {
          div.load(attrKey);

          if (div.getAttribute(k)) {
            this.length--;
          }

          div.removeAttribute(k);
          div.save(attrKey);
        },
        clear: function clear() {
          div.load(attrKey);
          var i = 0;
          var attr;

          while (attr = div.XMLDocument.documentElement.attributes[i++]) {
            div.removeAttribute(attr.name);
          }

          div.save(attrKey);
          this.length = 0;
        },
        key: function key(k) {
          div.load(attrKey);
          return div.XMLDocument.documentElement.attributes[k];
        }
      };
      div.load(attrKey);
      localStorage.length = div.XMLDocument.documentElement.attributes.length;
    }
  } else if (utils.isWebWorkerEnvironment()) {
    // Web worker
    localStorage = new WorkerStorage();
  }

  if (!localStorage) {
    /* eslint-disable no-unused-vars */
    localStorage = {
      length: 0,
      setItem: function setItem(k, v) {},
      getItem: function getItem(k) {},
      removeItem: function removeItem(k) {},
      clear: function clear() {},
      key: function key(k) {}
    };
    /* eslint-enable no-unused-vars */
  }
}

var ampLocalStorage = localStorage;

/*
 * Abstraction layer for cookie storage.
 * Uses cookie if available, otherwise fallback to localstorage.
 */

var cookieStorage = function cookieStorage() {
  this.storage = null;
};

cookieStorage.prototype.getStorage = function () {
  if (this.storage !== null) {
    return this.storage;
  }

  if (baseCookie.areCookiesEnabled()) {
    this.storage = Cookie;
  } else {
    // if cookies disabled, fallback to localstorage
    // note: localstorage does not persist across subdomains
    var keyPrefix = 'amp_cookiestore_';
    this.storage = {
      _options: {
        expirationDays: undefined,
        domain: undefined,
        secure: false
      },
      reset: function reset() {
        this._options = {
          expirationDays: undefined,
          domain: undefined,
          secure: false
        };
      },
      options: function options(opts) {
        if (arguments.length === 0) {
          return this._options;
        }

        opts = opts || {};
        this._options.expirationDays = opts.expirationDays || this._options.expirationDays; // localStorage is specific to subdomains

        this._options.domain = opts.domain || this._options.domain || GlobalScope && GlobalScope.location && GlobalScope.location.hostname;
        return this._options.secure = opts.secure || false;
      },
      get: function get(name) {
        try {
          return JSON.parse(ampLocalStorage.getItem(keyPrefix + name));
        } catch (e) {}
        /* eslint-disable-line no-empty */


        return null;
      },
      set: function set(name, value) {
        try {
          ampLocalStorage.setItem(keyPrefix + name, JSON.stringify(value));
          return true;
        } catch (e) {}
        /* eslint-disable-line no-empty */


        return false;
      },
      remove: function remove(name) {
        try {
          ampLocalStorage.removeItem(keyPrefix + name);
        } catch (e) {
          return false;
        }
      }
    };
  }

  return this.storage;
};

var _storageOptionExists;
var storageOptionExists = (_storageOptionExists = {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_storageOptionExists, Constants.STORAGE_COOKIES, true), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_storageOptionExists, Constants.STORAGE_NONE, true), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_storageOptionExists, Constants.STORAGE_LOCAL, true), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_storageOptionExists, Constants.STORAGE_SESSION, true), _storageOptionExists);
/**
 * MetadataStorage involves SDK data persistance
 * storage priority: cookies -> localStorage -> in memory
 * This priority can be overriden by setting the storage options.
 * if in localStorage, unable track users between subdomains
 * if in memory, then memory can't be shared between different tabs
 */

var MetadataStorage =
/*#__PURE__*/
function () {
  function MetadataStorage(_ref) {
    var storageKey = _ref.storageKey,
        disableCookies = _ref.disableCookies,
        domain = _ref.domain,
        secure = _ref.secure,
        sameSite = _ref.sameSite,
        expirationDays = _ref.expirationDays,
        storage = _ref.storage;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default()(this, MetadataStorage);

    this.storageKey = storageKey;
    this.domain = domain;
    this.secure = secure;
    this.sameSite = sameSite;
    this.expirationDays = expirationDays;
    this.cookieDomain = '';
    var writableTopDomain = topDomain(getLocation().href);
    this.cookieDomain = domain || (writableTopDomain ? '.' + writableTopDomain : null);

    if (storageOptionExists[storage]) {
      this.storage = storage;
    } else {
      var disableCookieStorage = disableCookies || !baseCookie.areCookiesEnabled({
        domain: this.cookieDomain,
        secure: this.secure,
        sameSite: this.sameSite,
        expirationDays: this.expirationDays
      });

      if (disableCookieStorage) {
        this.storage = Constants.STORAGE_LOCAL;
      } else {
        this.storage = Constants.STORAGE_COOKIES;
      }
    }
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_6___default()(MetadataStorage, [{
    key: "getCookieStorageKey",
    value: function getCookieStorageKey() {
      if (!this.domain) {
        return this.storageKey;
      }

      var suffix = this.domain.charAt(0) === '.' ? this.domain.substring(1) : this.domain;
      return "".concat(this.storageKey).concat(suffix ? "_".concat(suffix) : '');
    }
    /*
     * Data is saved as delimited values rather than JSO to minimize cookie space
     * Should not change order of the items
     */

  }, {
    key: "save",
    value: function save(_ref2) {
      var deviceId = _ref2.deviceId,
          userId = _ref2.userId,
          optOut = _ref2.optOut,
          sessionId = _ref2.sessionId,
          lastEventTime = _ref2.lastEventTime,
          eventId = _ref2.eventId,
          identifyId = _ref2.identifyId,
          sequenceNumber = _ref2.sequenceNumber;

      if (this.storage === Constants.STORAGE_NONE) {
        return;
      }

      var value = [deviceId, Base64.encode(userId || ''), // used to convert not unicode to alphanumeric since cookies only use alphanumeric
      optOut ? '1' : '', sessionId ? sessionId.toString(32) : '0', // generated when instantiated, timestamp (but re-uses session id in cookie if not expired) @TODO clients may want custom session id
      lastEventTime ? lastEventTime.toString(32) : '0', // last time an event was set
      eventId ? eventId.toString(32) : '0', identifyId ? identifyId.toString(32) : '0', sequenceNumber ? sequenceNumber.toString(32) : '0'].join('.');

      switch (this.storage) {
        case Constants.STORAGE_SESSION:
          if (GlobalScope.sessionStorage) {
            GlobalScope.sessionStorage.setItem(this.storageKey, value);
          }

          break;

        case Constants.STORAGE_LOCAL:
          ampLocalStorage.setItem(this.storageKey, value);
          break;

        case Constants.STORAGE_COOKIES:
          this.saveCookie(value);
          break;
      }
    }
  }, {
    key: "saveCookie",
    value: function saveCookie(value) {
      baseCookie.set(this.getCookieStorageKey(), value, {
        domain: this.cookieDomain,
        secure: this.secure,
        sameSite: this.sameSite,
        expirationDays: this.expirationDays
      });
    }
  }, {
    key: "load",
    value: function load() {
      var _this = this;

      var str;

      if (this.storage === Constants.STORAGE_COOKIES) {
        var cookieKey = this.getCookieStorageKey() + '=';
        var allCookies = baseCookie.getAll(cookieKey);

        if (allCookies.length === 0 || allCookies.length === 1) {
          str = allCookies[0];
        } else {
          // dedup cookies by deleting them all and restoring
          // the one with the most recent event time
          var latestCookie = baseCookie.sortByEventTime(allCookies)[0];
          allCookies.forEach(function () {
            return baseCookie.set(_this.getCookieStorageKey(), null, {});
          });
          this.saveCookie(latestCookie);
          str = baseCookie.get(cookieKey);
        }
      }

      if (!str) {
        str = ampLocalStorage.getItem(this.storageKey);
      }

      if (!str) {
        try {
          str = GlobalScope.sessionStorage && GlobalScope.sessionStorage.getItem(this.storageKey);
        } catch (e) {
          utils.log.info("window.sessionStorage unavailable. Reason: \"".concat(e, "\""));
        }
      }

      if (!str) {
        return null;
      }

      var values = str.split('.');
      var userId = null;

      if (values[Constants.USER_ID_INDEX]) {
        try {
          userId = Base64.decode(values[Constants.USER_ID_INDEX]);
        } catch (e) {
          userId = null;
        }
      }

      return {
        deviceId: values[Constants.DEVICE_ID_INDEX],
        userId: userId,
        optOut: values[Constants.OPT_OUT_INDEX] === '1',
        sessionId: parseInt(values[Constants.SESSION_ID_INDEX], 32),
        lastEventTime: parseInt(values[Constants.LAST_EVENT_TIME_INDEX], 32),
        eventId: parseInt(values[Constants.EVENT_ID_INDEX], 32),
        identifyId: parseInt(values[Constants.IDENTIFY_ID_INDEX], 32),
        sequenceNumber: parseInt(values[Constants.SEQUENCE_NUMBER_INDEX], 32)
      };
    }
    /**
     * Clears any saved metadata storage
     * @constructor AmplitudeClient
     * @public
     * @return {boolean} True if metadata was cleared, false if none existed
     */

  }, {
    key: "clear",
    value: function clear() {
      var str;

      if (this.storage === Constants.STORAGE_COOKIES) {
        str = baseCookie.get(this.getCookieStorageKey() + '=');
        baseCookie.set(this.getCookieStorageKey(), null, {
          domain: this.cookieDomain,
          secure: this.secure,
          sameSite: this.sameSite,
          expirationDays: 0
        });
      }

      if (!str) {
        str = ampLocalStorage.getItem(this.storageKey);
        ampLocalStorage.clear();
      }

      if (!str) {
        try {
          str = GlobalScope.sessionStorage && GlobalScope.sessionStorage.getItem(this.storageKey);
          GlobalScope.sessionStorage.clear();
        } catch (e) {
          utils.log.info("window.sessionStorage unavailable. Reason: \"".concat(e, "\""));
        }
      }

      return !!str;
    }
  }]);

  return MetadataStorage;
}();

var getUtmData = function getUtmData(rawCookie, query) {
  // Translate the utmz cookie format into url query string format.
  var cookie = rawCookie ? '?' + rawCookie.split('.').slice(-1)[0].replace(/\|/g, '&') : '';

  var fetchParam = function fetchParam(queryName, query, cookieName, cookie) {
    return utils.getQueryParam(queryName, query) || utils.getQueryParam(cookieName, cookie);
  };

  var utmSource = fetchParam(Constants.UTM_SOURCE, query, 'utmcsr', cookie);
  var utmMedium = fetchParam(Constants.UTM_MEDIUM, query, 'utmcmd', cookie);
  var utmCampaign = fetchParam(Constants.UTM_CAMPAIGN, query, 'utmccn', cookie);
  var utmTerm = fetchParam(Constants.UTM_TERM, query, 'utmctr', cookie);
  var utmContent = fetchParam(Constants.UTM_CONTENT, query, 'utmcct', cookie);
  var utmData = {};

  var addIfNotNull = function addIfNotNull(key, value) {
    if (!utils.isEmptyString(value)) {
      utmData[key] = value;
    }
  };

  addIfNotNull(Constants.UTM_SOURCE, utmSource);
  addIfNotNull(Constants.UTM_MEDIUM, utmMedium);
  addIfNotNull(Constants.UTM_CAMPAIGN, utmCampaign);
  addIfNotNull(Constants.UTM_TERM, utmTerm);
  addIfNotNull(Constants.UTM_CONTENT, utmContent);
  return utmData;
};

/*
 * Wrapper for a user properties JSON object that supports operations.
 * Note: if a user property is used in multiple operations on the same Identify object,
 * only the first operation will be saved, and the rest will be ignored.
 */

var AMP_OP_ADD = '$add';
var AMP_OP_APPEND = '$append';
var AMP_OP_CLEAR_ALL = '$clearAll';
var AMP_OP_PREPEND = '$prepend';
var AMP_OP_SET = '$set';
var AMP_OP_SET_ONCE = '$setOnce';
var AMP_OP_UNSET = '$unset';
var AMP_OP_PREINSERT = '$preInsert';
var AMP_OP_POSTINSERT = '$postInsert';
var AMP_OP_REMOVE = '$remove';
/**
 * Identify API - instance constructor. Identify objects are a wrapper for user property operations.
 * Each method adds a user property operation to the Identify object, and returns the same Identify object,
 * allowing you to chain multiple method calls together.
 * Note: if the same user property is used in multiple operations on a single Identify object,
 * only the first operation on that property will be saved, and the rest will be ignored.
 * @constructor Identify
 * @public
 * @example var identify = new amplitude.Identify();
 */

var Identify = function Identify() {
  this.userPropertiesOperations = {};
  this.properties = []; // keep track of keys that have been added
};
/**
 * Increment a user property by a given value (can also be negative to decrement).
 * If the user property does not have a value set yet, it will be initialized to 0 before being incremented.
 * @public
 * @param {string} property - The user property key.
 * @param {number|string} value - The amount by which to increment the user property. Allows numbers as strings (ex: '123').
 * @return {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 * @example var identify = new amplitude.Identify().add('karma', 1).add('friends', 1);
 * amplitude.identify(identify); // send the Identify call
 */


Identify.prototype.add = function (property, value) {
  if (type(value) === 'number' || type(value) === 'string') {
    this._addOperation(AMP_OP_ADD, property, value);
  } else {
    utils.log.error('Unsupported type for value: ' + type(value) + ', expecting number or string');
  }

  return this;
};
/**
 * Append a value or values to a user property.
 * If the user property does not have a value set yet,
 * it will be initialized to an empty list before the new values are appended.
 * If the user property has an existing value and it is not a list,
 * the existing value will be converted into a list with the new values appended.
 * @public
 * @param {string} property - The user property key.
 * @param {number|string|list|object} value - A value or values to append.
 * Values can be numbers, strings, lists, or object (key:value dict will be flattened).
 * @return {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 * @example var identify = new amplitude.Identify().append('ab-tests', 'new-user-tests');
 * identify.append('some_list', [1, 2, 3, 4, 'values']);
 * amplitude.identify(identify); // send the Identify call
 */


Identify.prototype.append = function (property, value) {
  this._addOperation(AMP_OP_APPEND, property, value);

  return this;
};
/**
 * Clear all user properties for the current user.
 * SDK user should instead call amplitude.clearUserProperties() instead of using this.
 * $clearAll needs to be sent on its own Identify object. If there are already other operations, then don't add $clearAll.
 * If $clearAll already in an Identify object, don't allow other operations to be added.
 * @private
 */


Identify.prototype.clearAll = function () {
  if (Object.keys(this.userPropertiesOperations).length > 0) {
    if (!Object.prototype.hasOwnProperty.call(this.userPropertiesOperations, AMP_OP_CLEAR_ALL)) {
      utils.log.error('Need to send $clearAll on its own Identify object without any other operations, skipping $clearAll');
    }

    return this;
  }

  this.userPropertiesOperations[AMP_OP_CLEAR_ALL] = '-';
  return this;
};
/**
 * Prepend a value or values to a user property.
 * Prepend means inserting the value or values at the front of a list.
 * If the user property does not have a value set yet,
 * it will be initialized to an empty list before the new values are prepended.
 * If the user property has an existing value and it is not a list,
 * the existing value will be converted into a list with the new values prepended.
 * @public
 * @param {string} property - The user property key.
 * @param {number|string|list|object} value - A value or values to prepend.
 * Values can be numbers, strings, lists, or object (key:value dict will be flattened).
 * @return {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 * @example var identify = new amplitude.Identify().prepend('ab-tests', 'new-user-tests');
 * identify.prepend('some_list', [1, 2, 3, 4, 'values']);
 * amplitude.identify(identify); // send the Identify call
 */


Identify.prototype.prepend = function (property, value) {
  this._addOperation(AMP_OP_PREPEND, property, value);

  return this;
};
/**
 * Sets the value of a given user property. If a value already exists, it will be overwriten with the new value.
 * @public
 * @param {string} property - The user property key.
 * @param {number|string|list|boolean|object} value - A value or values to set.
 * Values can be numbers, strings, lists, or object (key:value dict will be flattened).
 * @return {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 * @example var identify = new amplitude.Identify().set('user_type', 'beta');
 * identify.set('name', {'first': 'John', 'last': 'Doe'}); // dict is flattened and becomes name.first: John, name.last: Doe
 * amplitude.identify(identify); // send the Identify call
 */


Identify.prototype.set = function (property, value) {
  this._addOperation(AMP_OP_SET, property, value);

  return this;
};
/**
 * Sets the value of a given user property only once. Subsequent setOnce operations on that user property will be ignored;
 * however, that user property can still be modified through any of the other operations.
 * Useful for capturing properties such as 'initial_signup_date', 'initial_referrer', etc.
 * @public
 * @param {string} property - The user property key.
 * @param {number|string|list|boolean|object} value - A value or values to set once.
 * Values can be numbers, strings, lists, or object (key:value dict will be flattened).
 * @return {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 * @example var identify = new amplitude.Identify().setOnce('sign_up_date', '2016-04-01');
 * amplitude.identify(identify); // send the Identify call
 */


Identify.prototype.setOnce = function (property, value) {
  this._addOperation(AMP_OP_SET_ONCE, property, value);

  return this;
};
/**
 * Unset and remove a user property. This user property will no longer show up in a user's profile.
 * @public
 * @param {string} property - The user property key.
 * @return {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 * @example var identify = new amplitude.Identify().unset('user_type').unset('age');
 * amplitude.identify(identify); // send the Identify call
 */


Identify.prototype.unset = function (property) {
  this._addOperation(AMP_OP_UNSET, property, '-');

  return this;
};
/**
 * Preinsert a value or values to a user property, if it does not exist in the user property already.
 * Preinsert means inserting the value or values to the beginning of the specified user property.
 * If the item already exists in the user property, it will be a no-op.
 * @public
 * @param {string} property - The user property key.
 * @param {number|string|list|object} value - A value or values to insert.
 * @returns {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 */


Identify.prototype.preInsert = function (property, value) {
  this._addOperation(AMP_OP_PREINSERT, property, value);

  return this;
};
/**
 * Postinsert a value or values to a user property, if it does not exist in the user property already.
 * Postinsert means inserting the value or values to the beginning of the specified user property.
 * If the item already exists in the user property, it will be a no-op.
 * @param {string} property - The user property key.
 * @param {number|string|list|object} value - A value or values to insert.
 * @returns {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 */


Identify.prototype.postInsert = function (property, value) {
  this._addOperation(AMP_OP_POSTINSERT, property, value);

  return this;
};
/**
 * Remove a value or values to a user property, if it does exist in the user property.
 * If the item does not exist in the user property, it will be a no-op.
 * @param {string} property - The user property key.
 * @param {number|string|list|object} value - A value or values to remove.
 * @returns {Identify} Returns the same Identify object, allowing you to chain multiple method calls together.
 */


Identify.prototype.remove = function (property, value) {
  this._addOperation(AMP_OP_REMOVE, property, value);

  return this;
};
/**
 * Helper function that adds operation to the Identify's object
 * Handle's filtering of duplicate user property keys, and filtering for clearAll.
 * @private
 */


Identify.prototype._addOperation = function (operation, property, value) {
  // check that the identify doesn't already contain a clearAll
  if (Object.prototype.hasOwnProperty.call(this.userPropertiesOperations, AMP_OP_CLEAR_ALL)) {
    utils.log.error('This identify already contains a $clearAll operation, skipping operation ' + operation);
    return;
  } // check that property wasn't already used in this Identify


  if (this.properties.indexOf(property) !== -1) {
    utils.log.error('User property "' + property + '" already used in this identify, skipping operation ' + operation);
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(this.userPropertiesOperations, operation)) {
    this.userPropertiesOperations[operation] = {};
  }

  this.userPropertiesOperations[operation][property] = value;
  this.properties.push(property);
};

/*
 * Simple AJAX request object
 */

var Request = function Request(url, data, headers) {
  this.url = url;
  this.data = data || {};
  this.headers = headers;
};

var CORS_HEADER = 'Cross-Origin-Resource-Policy';

function setHeaders(xhr, headers) {
  for (var header in headers) {
    if (header === CORS_HEADER && !headers[header]) {
      continue;
    }

    xhr.setRequestHeader(header, headers[header]);
  }
}

Request.prototype.send = function (callback) {
  var isIE = GlobalScope.XDomainRequest ? true : false;

  if (isIE) {
    var xdr = new GlobalScope.XDomainRequest();
    xdr.open('POST', this.url, true);

    xdr.onload = function () {
      callback(200, xdr.responseText);
    };

    xdr.onerror = function () {
      // status code not available from xdr, try string matching on responseText
      if (xdr.responseText === 'Request Entity Too Large') {
        callback(413, xdr.responseText);
      } else {
        callback(500, xdr.responseText);
      }
    };

    xdr.ontimeout = function () {};

    xdr.onprogress = function () {};

    xdr.send(query_string__WEBPACK_IMPORTED_MODULE_8___default.a.stringify(this.data));
  } else if (typeof XMLHttpRequest !== 'undefined') {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.status, xhr.responseText);
      }
    };

    setHeaders(xhr, this.headers);
    xhr.send(query_string__WEBPACK_IMPORTED_MODULE_8___default.a.stringify(this.data));
  } else {
    var responseStatus = undefined;
    fetch(this.url, {
      method: 'POST',
      headers: this.headers,
      body: query_string__WEBPACK_IMPORTED_MODULE_8___default.a.stringify(this.data)
    }).then(function (response) {
      responseStatus = response.status;
      return response.text();
    }).then(function (responseText) {
      callback(responseStatus, responseText);
    });
  } //log('sent request to ' + this.url + ' with data ' + decodeURIComponent(queryString(this.data)));

};

/**
 * Revenue API - instance constructor. Wrapper for logging Revenue data. Revenue objects get passed to amplitude.logRevenueV2 to send to Amplitude servers.
 * Each method updates a revenue property in the Revenue object, and returns the same Revenue object,
 * allowing you to chain multiple method calls together.
 *
 * Note: price is a required field to log revenue events.
 * If quantity is not specified then defaults to 1.
 * @constructor Revenue
 * @public
 * @example var revenue = new amplitude.Revenue();
 */

var Revenue = function Revenue() {
  // required fields
  this._price = null; // optional fields

  this._productId = null;
  this._quantity = 1;
  this._revenueType = null;
  this._properties = null;
};
/**
 * Set a value for the product identifer.
 * @public
 * @param {string} productId - The value for the product identifier. Empty and invalid strings are ignored.
 * @return {Revenue} Returns the same Revenue object, allowing you to chain multiple method calls together.
 * @example var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99);
 * amplitude.logRevenueV2(revenue);
 */


Revenue.prototype.setProductId = function setProductId(productId) {
  if (type(productId) !== 'string') {
    utils.log.error('Unsupported type for productId: ' + type(productId) + ', expecting string');
  } else if (utils.isEmptyString(productId)) {
    utils.log.error('Invalid empty productId');
  } else {
    this._productId = productId;
  }

  return this;
};
/**
 * Set a value for the quantity. Note revenue amount is calculated as price * quantity.
 * @public
 * @param {number} quantity - Integer value for the quantity. If not set, quantity defaults to 1.
 * @return {Revenue} Returns the same Revenue object, allowing you to chain multiple method calls together.
 * @example var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99).setQuantity(5);
 * amplitude.logRevenueV2(revenue);
 */


Revenue.prototype.setQuantity = function setQuantity(quantity) {
  if (type(quantity) !== 'number') {
    utils.log.error('Unsupported type for quantity: ' + type(quantity) + ', expecting number');
  } else {
    this._quantity = parseInt(quantity);
  }

  return this;
};
/**
 * Set a value for the price. This field is required for all revenue being logged.
 *
 * Note: revenue amount is calculated as price * quantity.
 * @public
 * @param {number} price - Double value for the quantity.
 * @return {Revenue} Returns the same Revenue object, allowing you to chain multiple method calls together.
 * @example var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99);
 * amplitude.logRevenueV2(revenue);
 */


Revenue.prototype.setPrice = function setPrice(price) {
  if (type(price) !== 'number') {
    utils.log.error('Unsupported type for price: ' + type(price) + ', expecting number');
  } else {
    this._price = price;
  }

  return this;
};
/**
 * Set a value for the revenueType (for example purchase, cost, tax, refund, etc).
 * @public
 * @param {string} revenueType - RevenueType to designate.
 * @return {Revenue} Returns the same Revenue object, allowing you to chain multiple method calls together.
 * @example var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99).setRevenueType('purchase');
 * amplitude.logRevenueV2(revenue);
 */


Revenue.prototype.setRevenueType = function setRevenueType(revenueType) {
  if (type(revenueType) !== 'string') {
    utils.log.error('Unsupported type for revenueType: ' + type(revenueType) + ', expecting string');
  } else {
    this._revenueType = revenueType;
  }

  return this;
};
/**
 * Set event properties for the revenue event.
 * @public
 * @param {object} eventProperties - Revenue event properties to set.
 * @return {Revenue} Returns the same Revenue object, allowing you to chain multiple method calls together.
 * @example var event_properties = {'city': 'San Francisco'};
 * var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99).setEventProperties(event_properties);
 * amplitude.logRevenueV2(revenue);
 */


Revenue.prototype.setEventProperties = function setEventProperties(eventProperties) {
  if (type(eventProperties) !== 'object') {
    utils.log.error('Unsupported type for eventProperties: ' + type(eventProperties) + ', expecting object');
  } else {
    this._properties = utils.validateProperties(eventProperties);
  }

  return this;
};
/**
 * @private
 */


Revenue.prototype._isValidRevenue = function _isValidRevenue() {
  if (type(this._price) !== 'number') {
    utils.log.error('Invalid revenue, need to set price field');
    return false;
  }

  return true;
};
/**
 * @private
 */


Revenue.prototype._toJSONObject = function _toJSONObject() {
  var obj = type(this._properties) === 'object' ? this._properties : {};

  if (this._productId !== null) {
    obj[Constants.REVENUE_PRODUCT_ID] = this._productId;
  }

  if (this._quantity !== null) {
    obj[Constants.REVENUE_QUANTITY] = this._quantity;
  }

  if (this._price !== null) {
    obj[Constants.REVENUE_PRICE] = this._price;
  }

  if (this._revenueType !== null) {
    obj[Constants.REVENUE_REVENUE_TYPE] = this._revenueType;
  }

  return obj;
};

/**
 * Source: [jed's gist]{@link https://gist.github.com/982883}.
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f, and
 * y is replaced with a random hexadecimal digit from 8 to b.
 * Used to generate UUIDs for deviceIds.
 * @private
 */
var uuid = function uuid(a) {
  return a // if the placeholder was passed, return
  ? // a random number from 0 to 15
  (a ^ // unless b is 8,
  Math.random() * // in which case
  16 >> // a random number from
  a / 4). // 8 to 11
  toString(16) // in hexadecimal
  : // or otherwise a concatenated string:
  ([1e7] + // 10000000 +
  -1e3 + // -1000 +
  -4e3 + // -4000 +
  -8e3 + // -80000000 +
  -1e11). // -100000000000,
  replace( // replacing
  /[018]/g, // zeroes, ones, and eights with
  uuid // random hex digits
  );
};

var getLanguage = function getLanguage() {
  return typeof navigator !== 'undefined' && (navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage) || '';
};

var language = {
  getLanguage: getLanguage
};

/**
 * AmplitudeServerZone is for Data Residency and handling server zone related properties.
 * The server zones now are US and EU.
 *
 * For usage like sending data to Amplitude's EU servers, you need to configure the serverZone during nitializing.
 */

var AmplitudeServerZone = {
  US: 'US',
  EU: 'EU'
};

var getEventLogApi = function getEventLogApi(serverZone) {
  var eventLogUrl = Constants.EVENT_LOG_URL;

  switch (serverZone) {
    case AmplitudeServerZone.EU:
      eventLogUrl = Constants.EVENT_LOG_EU_URL;
      break;

    case AmplitudeServerZone.US:
      eventLogUrl = Constants.EVENT_LOG_URL;
      break;

    default:
      break;
  }

  return eventLogUrl;
};

var getDynamicConfigApi = function getDynamicConfigApi(serverZone) {
  var dynamicConfigUrl = Constants.DYNAMIC_CONFIG_URL;

  switch (serverZone) {
    case AmplitudeServerZone.EU:
      dynamicConfigUrl = Constants.DYNAMIC_CONFIG_EU_URL;
      break;

    case AmplitudeServerZone.US:
      dynamicConfigUrl = Constants.DYNAMIC_CONFIG_URL;
      break;

    default:
      break;
  }

  return dynamicConfigUrl;
};

var version = "8.16.0";

/**
 * Options used when initializing Amplitude
 * @typedef {Object} Options
 * @property {string} [apiEndpoint=`api.amplitude.com`] - Endpoint to send amplitude event requests to.
 * @property {boolean} [batchEvents=`false`] -  If `true`, then events are batched together and uploaded only when the number of unsent events is greater than or equal to eventUploadThreshold or after eventUploadPeriodMillis milliseconds have passed since the first unsent event was logged.
 * @property {number} [cookieExpiration=`365`] - The number of days after which the Amplitude cookie will expire. 12 months is for GDPR compliance.
 * @property {string} [cookieName=`amplitude_id`] - *DEPRECATED*
 * @property {string} [sameSiteCookie='None'] -  Sets the SameSite flag on the amplitude cookie. Decides cookie privacy policy.
 * @property {boolean} [cookieForceUpgrade=`false`] - Forces pre-v6.0.0 instances to adopt post-v6.0.0 compat cookie formats.
 * @property {boolean} [deferInitialization=`null`] -  If `true`, disables the core functionality of the sdk, including saving a cookie and all logging, until explicitly enabled. To enable tracking, please call `amplitude.getInstance().enableTracking()` *Note: This will not affect users who already have an amplitude cookie. The decision to track events is determined by whether or not a user has an amplitude analytics cookie. If the `cookieExpiration</code> is manually defined to be a short lifespan, you may need to run `amplitude.getInstance().enableTracking()` upon the cookie expiring or upon logging in.*
 * @property {boolean} [disableCookies=`false`] -  Disable Ampllitude cookies altogether.
 * @property {string} [deviceId=A randomly generated UUID.] -  The custom Device ID to set. *Note: This is not recommended unless you know what you are doing (e.g. you have your own system for tracking user devices).*
 * @property {boolean} [deviceIdFromUrlParam=`false`] -  If `true`, then the SDK will parse Device ID values from the URL parameter amp_device_id if available. Device IDs defined in the configuration options during init will take priority over Device IDs from URL parameters.
 * @property {string} [domain=The top domain of the current page's URL. ('https://amplitude.com')] -  Set a custom domain for the Amplitude cookie. To include subdomains, add a preceding period, eg: `.amplitude.com`.
 * @property {number} [eventUploadPeriodMillis=`30000` (30 sec)] -  Amount of time in milliseconds that the SDK waits before uploading events if batchEvents is true.
 * @property {number} [eventUploadThreshold=`30`] -  Minimum number of events to batch together per request if batchEvents is true.
 * @property {boolean} [forceHttps=`true`] -  If `true`, the events will always be uploaded to HTTPS endpoint. Otherwise, it will use the embedding site's protocol.
 * @property {boolean} [includeFbclid=`false`] -  If `true`, captures the fbclid URL parameter as well as the user's initial_fbclid via a setOnce operation.
 * @property {boolean} [includeGclid=`false`] -  If `true`, captures the gclid URL parameter as well as the user's initial_gclid via a setOnce operation.
 * @property {boolean} [includeReferrer=`false`] -  If `true`, captures the referrer and referring_domain for each session, as well as the user's initial_referrer and initial_referring_domain via a setOnce operation.
 * @property {boolean} [includeUtm=`false`] -  If `true`, finds UTM parameters in the query string or the _utmz cookie, parses, and includes them as user properties on all events uploaded. This also captures initial UTM parameters for each session via a setOnce operation.
 * @property {string} [language=The language determined by the browser] -  Custom language to set.
 * @property {Object} [library=`{ name: 'amplitude-js', version: packageJsonVersion }`] -  Values for the library version
 * @property {string} [logLevel=`WARN`] -  Level of logs to be printed in the developer console. Valid values are 'DISABLE', 'ERROR', 'WARN', 'INFO'. To learn more about the different options, see below.
 * @property {boolean} [logAttributionCapturedEvent=`false`] - If `true`, the SDK will log an Amplitude event anytime new attribution values are captured from the user. **Note: These events count towards your event volume.** Event name being logged: [Amplitude] Attribution Captured. Event Properties that can be logged: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `referrer`, `referring_domain`, `gclid`, `fbclid`. For UTM properties to be logged, `includeUtm` must be set to `true`. For the `referrer` and `referring_domain` properties to be logged, `includeReferrer` must be set to `true`. For the `gclid` property to be logged, `includeGclid` must be set to `true`. For the `fbclid` property to be logged, `includeFbclid` must be set to `true`.
 * @property {boolean} [optOut=`false`] -  Whether or not to disable tracking for the current user.
 * @property {function} [onError=`() => {}`] - Function to call on error.
 * @property {function} [onExitPage=`() => {}`] - Function called when the user exits the browser. Useful logging on page exit.
 * @property {Object} [plan] Tracking plan properties
 * @property {string} [plan.branch] The tracking plan branch name e.g. "main"
 * @property {string} [plan.source] The tracking plan source e.g. "web"
 * @property {string} [plan.version] The tracking plan version e.g. "1", "15"
 * @property {string} [platform=`Web`] -  Platform device is running on. Defaults to `Web` (browser, including mobile browsers).
 * @property {number} [savedMaxCount=`1000`] -  Maximum number of events to save in localStorage. If more events are logged while offline, then old events are removed.
 * @property {boolean} [saveEvents=`true`] -  If `true`, saves events to localStorage and removes them upon successful upload. *Note: Without saving events, events may be lost if the user navigates to another page before the events are uploaded.*
 * @property {boolean} [saveParamsReferrerOncePerSession=`true`] -  If `true`, then includeGclid, includeFbclid, includeReferrer, and includeUtm will only track their respective properties once per session. New values that come in during the middle of the user's session will be ignored. Set to false to always capture new values.
 * @property {boolean} [secureCookie=`false`] -  If `true`, the amplitude cookie will be set with the Secure flag.
 * @property {number} [sessionTimeout=`30*60*1000` (30 min)] -  The time between logged events before a new session starts in milliseconds.
 * @property {string[]} [storage=`''`] - Sets storage strategy.  Options are 'cookies', 'localStorage', 'sessionStorage', or `none`. Will override `disableCookies` option
 * @property {Object} [trackingOptions=`{ city: true, country: true, carrier: true, device_manufacturer: true, device_model: true, dma: true, ip_address: true, language: true, os_name: true, os_version: true, platform: true, region: true, version_name: true}`] - Type of data associated with a user.
 * @property {string} [transport=`http`] - Network transport mechanism used to send events. Options are 'http' and 'beacon'.
 * @property {boolean} [unsetParamsReferrerOnNewSession=`false`] -  If `false`, the existing `referrer` and `utm_parameter` values will be carried through each new session. If set to `true`, the `referrer` and `utm_parameter` user properties, which include `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`, will be set to `null` upon instantiating a new session. Note: This only works if `includeReferrer` or `includeUtm` is set to `true`.
 * @property {string} [unsentKey=`amplitude_unsent`] - localStorage key that stores unsent events.
 * @property {string} [unsentIdentifyKey=`amplitude_unsent_identify`] - localStorage key that stores unsent identifies.
 * @property {number} [uploadBatchSize=`100`] -  The maximum number of events to send to the server per request.
 * @property {Object} [headers=`{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }`] - Headers attached to an event(s) upload network request. Custom header properties are merged with this object.
 * @property {string} [serverZone] - For server zone related configuration, used for server api endpoint and dynamic configuration.
 * @property {boolean} [useDynamicConfig] - Enable dynamic configuration to find best server url for user.
 * @property {boolean} [serverZoneBasedApi] - To update api endpoint with serverZone change or not. For data residency, recommend to enable it unless using own proxy server.
 * @property {number} [sessionId=`null`] - The custom Session ID for the current session. *Note: This is not recommended unless you know what you are doing because the Session ID of a session is utilized for all session metrics in Amplitude.
 */

var DEFAULT_OPTIONS = {
  apiEndpoint: Constants.EVENT_LOG_URL,
  batchEvents: false,
  cookieExpiration: 365,
  // 12 months is for GDPR compliance
  cookieName: 'amplitude_id',
  // this is a deprecated option
  sameSiteCookie: 'Lax',
  // cookie privacy policy
  cookieForceUpgrade: false,
  deferInitialization: false,
  disableCookies: false,
  // this is a deprecated option
  deviceIdFromUrlParam: false,
  domain: '',
  eventUploadPeriodMillis: 30 * 1000,
  // 30s
  eventUploadThreshold: 30,
  forceHttps: true,
  includeFbclid: false,
  includeGclid: false,
  includeReferrer: false,
  includeUtm: false,
  language: language.getLanguage(),
  library: {
    name: 'amplitude-js',
    version: version
  },
  logLevel: 'WARN',
  logAttributionCapturedEvent: false,
  optOut: false,
  onError: function onError() {},
  onExitPage: function onExitPage() {},
  onNewSessionStart: function onNewSessionStart() {},
  plan: {
    branch: '',
    source: '',
    version: ''
  },
  platform: 'Web',
  savedMaxCount: 1000,
  saveEvents: true,
  saveParamsReferrerOncePerSession: true,
  secureCookie: false,
  sessionTimeout: 30 * 60 * 1000,
  storage: Constants.STORAGE_DEFAULT,
  trackingOptions: {
    city: true,
    country: true,
    carrier: true,
    device_manufacturer: true,
    device_model: true,
    dma: true,
    ip_address: true,
    language: true,
    os_name: true,
    os_version: true,
    platform: true,
    region: true,
    version_name: true
  },
  transport: Constants.TRANSPORT_HTTP,
  unsetParamsReferrerOnNewSession: false,
  unsentKey: 'amplitude_unsent',
  unsentIdentifyKey: 'amplitude_unsent_identify',
  uploadBatchSize: 100,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  },
  serverZone: AmplitudeServerZone.US,
  useDynamicConfig: false,
  serverZoneBasedApi: false,
  sessionId: null
};

/**
 * Dynamic Configuration
 * Find the best server url automatically based on app users' geo location.
 */

var ConfigManager =
/*#__PURE__*/
function () {
  function ConfigManager() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default()(this, ConfigManager);

    if (!ConfigManager.instance) {
      this.ingestionEndpoint = Constants.EVENT_LOG_URL;
      ConfigManager.instance = this;
    }

    return ConfigManager.instance;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_6___default()(ConfigManager, [{
    key: "refresh",
    value: function refresh(serverZone, forceHttps, callback) {
      var protocol = 'https';

      if (!forceHttps && 'https:' !== GlobalScope.location.protocol) {
        protocol = 'http';
      }

      var dynamicConfigUrl = protocol + '://' + getDynamicConfigApi(serverZone);
      var self = this;
      var isIE = GlobalScope.XDomainRequest ? true : false;

      if (isIE) {
        var xdr = new GlobalScope.XDomainRequest();
        xdr.open('GET', dynamicConfigUrl, true);

        xdr.onload = function () {
          var response = JSON.parse(xdr.responseText);
          self.ingestionEndpoint = response['ingestionEndpoint'];

          if (callback) {
            callback();
          }
        };

        xdr.onerror = function () {};

        xdr.ontimeout = function () {};

        xdr.onprogress = function () {};

        xdr.send();
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', dynamicConfigUrl, true);

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            self.ingestionEndpoint = response['ingestionEndpoint'];

            if (callback) {
              callback();
            }
          }
        };

        xhr.send();
      }
    }
  }]);

  return ConfigManager;
}();

var instance = new ConfigManager();

/**
 * AmplitudeClient SDK API - instance constructor.
 * The Amplitude class handles creation of client instances, all you need to do is call amplitude.getInstance()
 * @constructor AmplitudeClient
 * @public
 * @example var amplitudeClient = new AmplitudeClient();
 */

var AmplitudeClient = function AmplitudeClient(instanceName) {
  if (!Object(_amplitude_utils__WEBPACK_IMPORTED_MODULE_2__[/* isBrowserEnv */ "a"])() && !utils.isWebWorkerEnvironment()) {
    utils.log.warn('amplitude-js will not work in a non-browser environment. If you are planning to add Amplitude to a node environment, please use @amplitude/node');
  }

  this._instanceName = utils.isEmptyString(instanceName) ? Constants.DEFAULT_INSTANCE : instanceName.toLowerCase();
  this._unsentEvents = [];
  this._unsentIdentifys = [];
  this._ua = new _amplitude_ua_parser_js__WEBPACK_IMPORTED_MODULE_9___default.a(navigator.userAgent).getResult();
  this.options = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, DEFAULT_OPTIONS, {
    trackingOptions: _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, DEFAULT_OPTIONS.trackingOptions)
  });
  this.cookieStorage = new cookieStorage().getStorage();
  this._q = []; // queue for proxied functions before script load

  this._sending = false;
  this._updateScheduled = false;
  this._onInitCallbacks = [];
  this._onNewSessionStartCallbacks = []; // event meta data

  this._eventId = 0;
  this._identifyId = 0;
  this._lastEventTime = null;
  this._newSession = false; // sequence used for by frontend for prioritizing event send retries

  this._sequenceNumber = 0;
  this._sessionId = null;
  this._isInitialized = false;
  this._userAgent = navigator && navigator.userAgent || null;
};

AmplitudeClient.prototype.Identify = Identify;
AmplitudeClient.prototype.Revenue = Revenue;
/**
 * Initializes the Amplitude Javascript SDK with your apiKey and any optional configurations.
 * This is required before any other methods can be called.
 * @public
 * @param {string} apiKey - The API key for your app.
 * @param {string} opt_userId - (optional) An identifier for this user.
 * @param {object} opt_config - (optional) Configuration options.
 * See [options.js](https://amplitude.github.io/Amplitude-JavaScript/Options) for a list of options and default values.
 * @param {function} opt_callback - (optional) Provide a callback function to run after initialization is complete.
 * @example amplitudeClient.init('API_KEY', 'USER_ID', {includeReferrer: true, includeUtm: true}, function() { alert('init complete'); });
 */

AmplitudeClient.prototype.init = function init(apiKey, opt_userId, opt_config, opt_callback) {
  var _this = this;

  if (type(apiKey) !== 'string' || utils.isEmptyString(apiKey)) {
    utils.log.error('Invalid apiKey. Please re-initialize with a valid apiKey');
    return;
  }

  try {
    _parseConfig(this.options, opt_config);

    if ((Object(_amplitude_utils__WEBPACK_IMPORTED_MODULE_2__[/* isBrowserEnv */ "a"])() || utils.isWebWorkerEnvironment()) && GlobalScope.Prototype !== undefined && Array.prototype.toJSON) {
      Object(_amplitude_utils__WEBPACK_IMPORTED_MODULE_2__[/* prototypeJsFix */ "b"])();
      utils.log.warn('Prototype.js injected Array.prototype.toJSON. Deleting Array.prototype.toJSON to prevent double-stringify');
    }

    if (this.options.cookieName !== DEFAULT_OPTIONS.cookieName) {
      utils.log.warn('The cookieName option is deprecated. We will be ignoring it for newer cookies');
    }

    if (this.options.serverZoneBasedApi) {
      this.options.apiEndpoint = getEventLogApi(this.options.serverZone);
    }

    this._refreshDynamicConfig();

    this.options.apiKey = apiKey;
    this._storageSuffix = '_' + apiKey + (this._instanceName === Constants.DEFAULT_INSTANCE ? '' : '_' + this._instanceName);
    this._storageSuffixV5 = apiKey.slice(0, 6);
    this._oldCookiename = this.options.cookieName + this._storageSuffix;
    this._unsentKey = this.options.unsentKey + this._storageSuffix;
    this._unsentIdentifyKey = this.options.unsentIdentifyKey + this._storageSuffix;
    this._cookieName = Constants.COOKIE_PREFIX + '_' + this._storageSuffixV5;
    this.cookieStorage.options({
      expirationDays: this.options.cookieExpiration,
      domain: this.options.domain,
      secure: this.options.secureCookie,
      sameSite: this.options.sameSiteCookie
    });
    this._metadataStorage = new MetadataStorage({
      storageKey: this._cookieName,
      disableCookies: this.options.disableCookies,
      expirationDays: this.options.cookieExpiration,
      domain: this.options.domain,
      secure: this.options.secureCookie,
      sameSite: this.options.sameSiteCookie,
      storage: this.options.storage
    });
    var hasOldCookie = !!this.cookieStorage.get(this._oldCookiename);
    var hasNewCookie = !!this._metadataStorage.load();
    this._useOldCookie = !hasNewCookie && hasOldCookie && !this.options.cookieForceUpgrade;
    var hasCookie = hasNewCookie || hasOldCookie;
    this.options.domain = this.cookieStorage.options().domain;

    if (this.options.deferInitialization && !hasCookie) {
      this._deferInitialization(apiKey, opt_userId, opt_config, opt_callback);

      return;
    }

    if (type(this.options.logLevel) === 'string') {
      utils.setLogLevel(this.options.logLevel);
    }

    var trackingOptions = _generateApiPropertiesTrackingConfig(this);

    this._apiPropertiesTrackingOptions = Object.keys(trackingOptions).length > 0 ? {
      tracking_options: trackingOptions
    } : {};

    if (this.options.cookieForceUpgrade && hasOldCookie) {
      if (!hasNewCookie) {
        _upgradeCookieData(this);
      }

      this.cookieStorage.remove(this._oldCookiename);
    }

    _loadCookieData(this);

    this._pendingReadStorage = true;

    var initFromStorage = function initFromStorage(storedDeviceId) {
      if (opt_config && opt_config.deviceId && !utils.validateDeviceId(opt_config.deviceId)) {
        utils.log.error("Invalid device ID rejected. Randomly generated UUID will be used instead of \"".concat(opt_config.deviceId, "\""));
        delete opt_config.deviceId;
      }

      _this.options.deviceId = _this._getInitialDeviceId(opt_config && opt_config.deviceId, storedDeviceId);
      _this.options.userId = type(opt_userId) === 'string' && !utils.isEmptyString(opt_userId) && opt_userId || type(opt_userId) === 'number' && opt_userId.toString() || _this.options.userId || null;
      var now = new Date().getTime();
      var startNewSession = !_this._sessionId || !_this._lastEventTime || now - _this._lastEventTime > _this.options.sessionTimeout || _this.options.sessionId;

      if (startNewSession) {
        if (_this.options.unsetParamsReferrerOnNewSession) {
          _this._unsetUTMParams();
        }

        _this._newSession = true;
        _this._sessionId = _this.options.sessionId || now; // reset this.options.sessionId to avoid re-usage
        // use instance.getSessionId() to get session id

        _this.options.sessionId = undefined; // only capture UTM params and referrer if new session

        if (_this.options.saveParamsReferrerOncePerSession) {
          _this._trackParamsAndReferrer();
        }
      }

      if (!_this.options.saveParamsReferrerOncePerSession) {
        _this._trackParamsAndReferrer();
      } // load unsent events and identifies before any attempt to log new ones


      if (_this.options.saveEvents) {
        _validateUnsentEventQueue(_this._unsentEvents);

        _validateUnsentEventQueue(_this._unsentIdentifys);
      }

      _this._lastEventTime = now;

      _saveCookieData(_this);

      _this._pendingReadStorage = false;

      _this._sendEventsIfReady(); // try sending unsent events


      for (var i = 0; i < _this._onInitCallbacks.length; i++) {
        _this._onInitCallbacks[i](_this);
      }

      _this._onInitCallbacks = [];
      _this._isInitialized = true;

      if (startNewSession) {
        _this._runNewSessionStartCallbacks();
      }
    };

    if (this.options.saveEvents) {
      this._unsentEvents = this._loadSavedUnsentEvents(this.options.unsentKey).map(function (event) {
        return {
          event: event
        };
      }).concat(this._unsentEvents);
      this._unsentIdentifys = this._loadSavedUnsentEvents(this.options.unsentIdentifyKey).map(function (event) {
        return {
          event: event
        };
      }).concat(this._unsentIdentifys);
    }

    if (opt_config && opt_config.onNewSessionStart) {
      this.onNewSessionStart(this.options.onNewSessionStart);
    }

    initFromStorage();
    this.runQueuedFunctions();

    if (type(opt_callback) === 'function') {
      opt_callback(this);
    }

    var onExitPage = this.options.onExitPage;

    if (type(onExitPage) === 'function') {
      if (!this.pageHandlersAdded) {
        this.pageHandlersAdded = true;

        var handleVisibilityChange = function handleVisibilityChange() {
          var prevTransport = _this.options.transport;

          _this.setTransport(Constants.TRANSPORT_BEACON);

          onExitPage();

          _this.setTransport(prevTransport);
        }; // Monitoring just page exits because that is the most requested feature for now
        // "If you're specifically trying to detect page unload events, the pagehide event is the best option."
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event


        GlobalScope.addEventListener('pagehide', function () {
          handleVisibilityChange();
        }, false);
      }
    }
  } catch (err) {
    utils.log.error(err);

    if (opt_config && type(opt_config.onError) === 'function') {
      opt_config.onError(err);
    }
  }
};

AmplitudeClient.prototype._runNewSessionStartCallbacks = function () {
  for (var i = 0; i < this._onNewSessionStartCallbacks.length; i++) {
    this._onNewSessionStartCallbacks[i](this);
  }
};

AmplitudeClient.prototype.deleteLowerLevelDomainCookies = function () {
  var host = getHost();
  var cookieHost = this.options.domain && this.options.domain[0] === '.' ? this.options.domain.slice(1) : this.options.domain;

  if (!cookieHost || !utils.isWebWorkerEnvironment()) {
    return;
  }

  if (host !== cookieHost) {
    if (new RegExp(cookieHost + '$').test(host)) {
      var hostParts = host.split('.');
      var cookieHostParts = cookieHost.split('.');

      for (var i = hostParts.length; i > cookieHostParts.length; --i) {
        var deleteDomain = hostParts.slice(hostParts.length - i).join('.');
        baseCookie.set(this._cookieName, null, {
          domain: '.' + deleteDomain
        });
      }

      baseCookie.set(this._cookieName, null, {});
    }
  }
};

AmplitudeClient.prototype._getInitialDeviceId = function (configDeviceId, storedDeviceId) {
  if (configDeviceId) {
    return configDeviceId;
  }

  if (this.options.deviceIdFromUrlParam) {
    var deviceIdFromUrlParam = this._getDeviceIdFromUrlParam(this._getUrlParams());

    if (deviceIdFromUrlParam) {
      return deviceIdFromUrlParam;
    }
  }

  if (this.options.deviceId) {
    return this.options.deviceId;
  }

  if (storedDeviceId) {
    return storedDeviceId;
  }

  return base64Id();
}; // validate properties for unsent events


var _validateUnsentEventQueue = function _validateUnsentEventQueue(queue) {
  for (var i = 0; i < queue.length; i++) {
    var userProperties = queue[i].event.user_properties;
    var eventProperties = queue[i].event.event_properties;
    var groups = queue[i].event.groups;
    queue[i].event.user_properties = utils.validateProperties(userProperties);
    queue[i].event.event_properties = utils.validateProperties(eventProperties);
    queue[i].event.groups = utils.validateGroups(groups);
  }
};
/**
 * @private
 */


AmplitudeClient.prototype._trackParamsAndReferrer = function _trackParamsAndReferrer() {
  var utmProperties;
  var referrerProperties;
  var gclidProperties;
  var fbclidProperties;

  if (this.options.includeUtm) {
    utmProperties = this._initUtmData();
  }

  if (this.options.includeReferrer) {
    referrerProperties = this._saveReferrer(this._getReferrer());
  }

  if (this.options.includeGclid) {
    gclidProperties = this._saveGclid(this._getUrlParams());
  }

  if (this.options.includeFbclid) {
    fbclidProperties = this._saveFbclid(this._getUrlParams());
  }

  if (this.options.logAttributionCapturedEvent) {
    var attributionProperties = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, utmProperties, referrerProperties, gclidProperties, fbclidProperties);

    if (Object.keys(attributionProperties).length > 0) {
      this.logEvent(Constants.ATTRIBUTION_EVENT, attributionProperties);
    }
  }
};
/**
 * Parse and validate user specified config values and overwrite existing option value
 * DEFAULT_OPTIONS provides list of all config keys that are modifiable, as well as expected types for values
 * @private
 */


var _parseConfig = function _parseConfig(options, config) {
  if (type(config) !== 'object') {
    return;
  } // Add exception in headers


  var freeFormObjectKeys = new Set(['headers']); // validates config value is defined, is the correct type, and some additional value sanity checks

  var parseValidateAndLoad = function parseValidateAndLoad(key) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      return; // skip bogus config values
    }

    var inputValue = config[key];
    var expectedType = type(options[key]);

    if (key === 'transport' && !utils.validateTransport(inputValue)) {
      return;
    } else if (key === 'sessionId' && inputValue !== null) {
      options[key] = utils.validateSessionId(inputValue) ? inputValue : null;
      return;
    } else if (!utils.validateInput(inputValue, key + ' option', expectedType)) {
      return;
    }

    if (expectedType === 'boolean') {
      options[key] = !!inputValue;
    } else if (expectedType === 'string' && !utils.isEmptyString(inputValue) || expectedType === 'number' && inputValue > 0 || expectedType === 'function') {
      options[key] = inputValue;
    } else if (expectedType === 'object') {
      _parseConfig(options[key], inputValue);
    }
  };

  for (var key in config) {
    if (freeFormObjectKeys.has(key)) {
      options[key] = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, options[key], config[key]);
    } else if (Object.prototype.hasOwnProperty.call(config, key)) {
      parseValidateAndLoad(key);
    }
  }
};
/**
 * Run functions queued up by proxy loading snippet
 * @private
 */


AmplitudeClient.prototype.runQueuedFunctions = function () {
  var queue = this._q;
  this._q = [];

  for (var i = 0; i < queue.length; i++) {
    var fn = this[queue[i][0]];

    if (type(fn) === 'function') {
      fn.apply(this, queue[i].slice(1));
    }
  }
};
/**
 * Check that the apiKey is set before calling a function. Logs a warning message if not set.
 * @private
 */


AmplitudeClient.prototype._apiKeySet = function _apiKeySet(methodName) {
  if (utils.isEmptyString(this.options.apiKey)) {
    utils.log.error('Invalid apiKey. Please set a valid apiKey with init() before calling ' + methodName);
    return false;
  }

  return true;
};
/**
 * Load saved events from localStorage. JSON deserializes event array. Handles case where string is corrupted.
 * @private
 */


AmplitudeClient.prototype._loadSavedUnsentEvents = function _loadSavedUnsentEvents(unsentKey) {
  var savedUnsentEventsString = this._getFromStorage(ampLocalStorage, unsentKey);

  var unsentEvents = this._parseSavedUnsentEventsString(savedUnsentEventsString, unsentKey);

  this._setInStorage(ampLocalStorage, unsentKey, JSON.stringify(unsentEvents));

  return unsentEvents;
};
/**
 * Load saved events from localStorage. JSON deserializes event array. Handles case where string is corrupted.
 * @private
 */


AmplitudeClient.prototype._parseSavedUnsentEventsString = function _parseSavedUnsentEventsString(savedUnsentEventsString, unsentKey) {
  if (utils.isEmptyString(savedUnsentEventsString)) {
    return []; // new app, does not have any saved events
  }

  if (type(savedUnsentEventsString) === 'string') {
    try {
      var events = JSON.parse(savedUnsentEventsString);

      if (type(events) === 'array') {
        // handle case where JSON dumping of unsent events is corrupted
        return events;
      }
    } catch (e) {}
    /* eslint-disable-line no-empty */

  }

  utils.log.error('Unable to load ' + unsentKey + ' events. Restart with a new empty queue.');
  return [];
};
/**
 * Returns true if a new session was created during initialization, otherwise false.
 * @public
 * @return {boolean} Whether a new session was created during initialization.
 */


AmplitudeClient.prototype.isNewSession = function isNewSession() {
  return this._newSession;
};
/**
 * Add callbacks to call after init. Useful for users who load Amplitude through a snippet.
 * @public
 */


AmplitudeClient.prototype.onInit = function onInit(callback) {
  if (this._isInitialized) {
    callback(this);
  } else {
    this._onInitCallbacks.push(callback);
  }
};
/**
 * Add callbacks to call after new session start.
 * @public
 */


AmplitudeClient.prototype.onNewSessionStart = function onNewSessionStart(callback) {
  this._onNewSessionStartCallbacks.push(callback);
};
/**
 * Returns the id of the current session.
 * @public
 * @return {number} Id of the current session.
 */


AmplitudeClient.prototype.getSessionId = function getSessionId() {
  return this._sessionId;
};
/**
 * Increments the eventId and returns it.
 * @private
 */


AmplitudeClient.prototype.nextEventId = function nextEventId() {
  this._eventId++;
  return this._eventId;
};
/**
 * Increments the identifyId and returns it.
 * @private
 */


AmplitudeClient.prototype.nextIdentifyId = function nextIdentifyId() {
  this._identifyId++;
  return this._identifyId;
};
/**
 * Increments the sequenceNumber and returns it.
 * @private
 */


AmplitudeClient.prototype.nextSequenceNumber = function nextSequenceNumber() {
  this._sequenceNumber++;
  return this._sequenceNumber;
};
/**
 * Returns the total count of unsent events and identifys
 * @private
 */


AmplitudeClient.prototype._unsentCount = function _unsentCount() {
  return this._unsentEvents.length + this._unsentIdentifys.length;
};
/**
 * Send events if ready. Returns true if events are sent.
 * @private
 */


AmplitudeClient.prototype._sendEventsIfReady = function _sendEventsIfReady() {
  if (this._unsentCount() === 0) {
    return false;
  } // if batching disabled, send any unsent events immediately


  if (!this.options.batchEvents) {
    this.sendEvents();
    return true;
  } // if batching enabled, check if min threshold met for batch size


  if (this._unsentCount() >= this.options.eventUploadThreshold) {
    this.sendEvents();
    return true;
  } // if beacon transport is activated, send events immediately
  // because there is no way to retry them later


  if (this.options.transport === Constants.TRANSPORT_BEACON) {
    this.sendEvents();
    return true;
  } // otherwise schedule an upload after 30s


  if (!this._updateScheduled) {
    // make sure we only schedule 1 upload
    this._updateScheduled = true;
    setTimeout(function () {
      this._updateScheduled = false;
      this.sendEvents();
    }.bind(this), this.options.eventUploadPeriodMillis);
  }

  return false; // an upload was scheduled, no events were uploaded
};
/**
 * Clears any stored events and metadata. Storage is then re-created on next event sending.
 * @public
 * @return {boolean} True if metadata was cleared, false if none existed
 */


AmplitudeClient.prototype.clearStorage = function clearStorage() {
  return this._metadataStorage.clear();
};
/**
 * Helper function to fetch values from storage
 * Storage argument allows for localStoraoge and sessionStoraoge
 * @private
 */


AmplitudeClient.prototype._getFromStorage = function _getFromStorage(storage, key) {
  return storage.getItem(key + this._storageSuffix);
};
/**
 * Helper function to set values in storage
 * Storage argument allows for localStoraoge and sessionStoraoge
 * @private
 */


AmplitudeClient.prototype._setInStorage = function _setInStorage(storage, key, value) {
  storage.setItem(key + this._storageSuffix, value);
};
/**
 * Fetches deviceId, userId, event meta data from amplitude cookie
 * @private
 */


var _loadCookieData = function _loadCookieData(scope) {
  if (!scope._useOldCookie) {
    var props = scope._metadataStorage.load();

    if (type(props) === 'object') {
      _loadCookieDataProps(scope, props);
    }

    return;
  }

  var cookieData = scope.cookieStorage.get(scope._oldCookiename);

  if (type(cookieData) === 'object') {
    _loadCookieDataProps(scope, cookieData);

    return;
  }
};

var _upgradeCookieData = function _upgradeCookieData(scope) {
  var cookieData = scope.cookieStorage.get(scope._oldCookiename);

  if (type(cookieData) === 'object') {
    _loadCookieDataProps(scope, cookieData);

    _saveCookieData(scope);
  }
};

var _loadCookieDataProps = function _loadCookieDataProps(scope, cookieData) {
  if (cookieData.deviceId) {
    scope.options.deviceId = cookieData.deviceId;
  }

  if (cookieData.userId) {
    scope.options.userId = cookieData.userId;
  }

  if (cookieData.optOut !== null && cookieData.optOut !== undefined) {
    // Do not clobber config opt out value if cookieData has optOut as false
    if (cookieData.optOut !== false) {
      scope.options.optOut = cookieData.optOut;
    }
  }

  if (cookieData.sessionId) {
    scope._sessionId = parseInt(cookieData.sessionId, 10);
  }

  if (cookieData.lastEventTime) {
    scope._lastEventTime = parseInt(cookieData.lastEventTime, 10);
  }

  if (cookieData.eventId) {
    scope._eventId = parseInt(cookieData.eventId, 10);
  }

  if (cookieData.identifyId) {
    scope._identifyId = parseInt(cookieData.identifyId, 10);
  }

  if (cookieData.sequenceNumber) {
    scope._sequenceNumber = parseInt(cookieData.sequenceNumber, 10);
  }
};
/**
 * Saves deviceId, userId, event meta data to amplitude cookie
 * @private
 */


var _saveCookieData = function _saveCookieData(scope) {
  var cookieData = {
    deviceId: scope.options.deviceId,
    userId: scope.options.userId,
    optOut: scope.options.optOut,
    sessionId: scope._sessionId,
    lastEventTime: scope._lastEventTime,
    eventId: scope._eventId,
    identifyId: scope._identifyId,
    sequenceNumber: scope._sequenceNumber
  };

  if (scope._useOldCookie) {
    scope.cookieStorage.set(scope.options.cookieName + scope._storageSuffix, cookieData);
  } else {
    scope._metadataStorage.save(cookieData);
  }
};
/**
 * Parse the utm properties out of cookies and query for adding to user properties.
 * @private
 */


AmplitudeClient.prototype._initUtmData = function _initUtmData(queryParams, cookieParams) {
  queryParams = queryParams || this._getUrlParams();
  cookieParams = cookieParams || this.cookieStorage.get('__utmz');
  var utmProperties = getUtmData(cookieParams, queryParams);

  _sendParamsReferrerUserProperties(this, utmProperties);

  return utmProperties;
};
/**
 * Unset the utm params from the Amplitude instance and update the identify.
 * @private
 */


AmplitudeClient.prototype._unsetUTMParams = function _unsetUTMParams() {
  var identify = new Identify();
  identify.unset(Constants.REFERRER);
  identify.unset(Constants.UTM_SOURCE);
  identify.unset(Constants.UTM_MEDIUM);
  identify.unset(Constants.UTM_CAMPAIGN);
  identify.unset(Constants.UTM_TERM);
  identify.unset(Constants.UTM_CONTENT);
  this.identify(identify);
};
/**
 * The calling function should determine when it is appropriate to send these user properties. This function
 * will no longer contain any session storage checking logic.
 * @private
 */


var _sendParamsReferrerUserProperties = function _sendParamsReferrerUserProperties(scope, userProperties) {
  if (type(userProperties) !== 'object' || Object.keys(userProperties).length === 0) {
    return;
  } // setOnce the initial user properties


  var identify = new Identify();

  for (var key in userProperties) {
    if (Object.prototype.hasOwnProperty.call(userProperties, key)) {
      identify.setOnce('initial_' + key, userProperties[key]);
      identify.set(key, userProperties[key]);
    }
  }

  scope.identify(identify);
};
/**
 * @private
 */


AmplitudeClient.prototype._getReferrer = function _getReferrer() {
  return typeof document !== 'undefined' ? document.referrer : '';
};
/**
 * @private
 */


AmplitudeClient.prototype._getUrlParams = function _getUrlParams() {
  return GlobalScope.location.search;
};
/**
 * Try to fetch Google Gclid from url params.
 * @private
 */


AmplitudeClient.prototype._saveGclid = function _saveGclid(urlParams) {
  var gclid = utils.getQueryParam('gclid', urlParams);

  if (utils.isEmptyString(gclid)) {
    return;
  }

  var gclidProperties = {
    gclid: gclid
  };

  _sendParamsReferrerUserProperties(this, gclidProperties);

  return gclidProperties;
};
/**
 * Try to fetch Facebook Fbclid from url params.
 * @private
 */


AmplitudeClient.prototype._saveFbclid = function _saveFbclid(urlParams) {
  var fbclid = utils.getQueryParam('fbclid', urlParams);

  if (utils.isEmptyString(fbclid)) {
    return;
  }

  var fbclidProperties = {
    fbclid: fbclid
  };

  _sendParamsReferrerUserProperties(this, fbclidProperties);

  return fbclidProperties;
};
/**
 * Try to fetch Amplitude device id from url params.
 * @private
 */


AmplitudeClient.prototype._getDeviceIdFromUrlParam = function _getDeviceIdFromUrlParam(urlParams) {
  return utils.getQueryParam(Constants.AMP_DEVICE_ID_PARAM, urlParams);
};
/**
 * Parse the domain from referrer info
 * @private
 */


AmplitudeClient.prototype._getReferringDomain = function _getReferringDomain(referrer) {
  if (utils.isEmptyString(referrer)) {
    return null;
  }

  var parts = referrer.split('/');

  if (parts.length >= 3) {
    return parts[2];
  }

  return null;
};
/**
 * Fetch the referrer information, parse the domain and send.
 * Since user properties are propagated on the server, only send once per session, don't need to send with every event
 * @private
 */


AmplitudeClient.prototype._saveReferrer = function _saveReferrer(referrer) {
  if (utils.isEmptyString(referrer)) {
    return;
  }

  var referrerInfo = {
    referrer: referrer,
    referring_domain: this._getReferringDomain(referrer)
  };

  _sendParamsReferrerUserProperties(this, referrerInfo);

  return referrerInfo;
};
/**
 * Saves unsent events and identifies to localStorage. JSON stringifies event queues before saving.
 * Note: this is called automatically every time events are logged, unless you explicitly set option saveEvents to false.
 * @private
 */


AmplitudeClient.prototype.saveEvents = function saveEvents() {
  try {
    var serializedUnsentEvents = JSON.stringify(this._unsentEvents.map(function (_ref) {
      var event = _ref.event;
      return event;
    }));

    this._setInStorage(ampLocalStorage, this.options.unsentKey, serializedUnsentEvents);
  } catch (e) {}
  /* eslint-disable-line no-empty */


  try {
    var serializedIdentifys = JSON.stringify(this._unsentIdentifys.map(function (unsentIdentify) {
      return unsentIdentify.event;
    }));

    this._setInStorage(ampLocalStorage, this.options.unsentIdentifyKey, serializedIdentifys);
  } catch (e) {}
  /* eslint-disable-line no-empty */

};
/**
 * Sets a customer domain for the amplitude cookie. Useful if you want to support cross-subdomain tracking.
 * @public
 * @param {string} domain to set.
 * @example amplitudeClient.setDomain('.amplitude.com');
 */


AmplitudeClient.prototype.setDomain = function setDomain(domain) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setDomain'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!utils.validateInput(domain, 'domain', 'string')) {
    return;
  }

  try {
    this.cookieStorage.options({
      expirationDays: this.options.cookieExpiration,
      secure: this.options.secureCookie,
      domain: domain,
      sameSite: this.options.sameSiteCookie
    });
    this.options.domain = this.cookieStorage.options().domain;

    _loadCookieData(this);

    _saveCookieData(this);
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Sets an identifier for the current user.
 * @public
 * @param {string} userId - identifier to set. Can be null.
 * @param {boolean} startNewSession - (optional) if start a new session or not
 * @example amplitudeClient.setUserId('joe@gmail.com');
 */


AmplitudeClient.prototype.setUserId = function setUserId(userId) {
  var startNewSession = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!utils.validateInput(startNewSession, 'startNewSession', 'boolean')) {
    return;
  }

  if (this._shouldDeferCall()) {
    return this._q.push(['setUserId'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  try {
    this.options.userId = userId !== undefined && userId !== null && '' + userId || null;

    if (startNewSession) {
      if (this.options.unsetParamsReferrerOnNewSession) {
        this._unsetUTMParams();
      }

      this._newSession = true;
      this._sessionId = new Date().getTime();

      this._runNewSessionStartCallbacks(); // only capture UTM params and referrer if new session


      if (this.options.saveParamsReferrerOncePerSession) {
        this._trackParamsAndReferrer();
      }
    }

    _saveCookieData(this);
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Add user to a group or groups. You need to specify a groupType and groupName(s).
 *
 * For example you can group people by their organization.
 * In that case, groupType is "orgId" and groupName would be the actual ID(s).
 * groupName can be a string or an array of strings to indicate a user in multiple gruups.
 * You can also call setGroup multiple times with different groupTypes to track multiple types of groups (up to 5 per app).
 *
 * Note: this will also set groupType: groupName as a user property.
 * See the [advanced topics article](https://developers.amplitude.com/docs/javascript#user-groups) for more information.
 * @public
 * @param {string} groupType - the group type (ex: orgId)
 * @param {string|list} groupName - the name of the group (ex: 15), or a list of names of the groups
 * @example amplitudeClient.setGroup('orgId', 15); // this adds the current user to orgId 15.
 */


AmplitudeClient.prototype.setGroup = function (groupType, groupName) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setGroup'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('setGroup()') || !utils.validateInput(groupType, 'groupType', 'string') || utils.isEmptyString(groupType)) {
    return;
  }

  var groups = {};
  groups[groupType] = groupName;
  var identify = new Identify().set(groupType, groupName);

  this._logEvent(Constants.IDENTIFY_EVENT, null, null, identify.userPropertiesOperations, groups, null, null, null);
};
/**
 * Sets whether to opt current user out of tracking.
 * @public
 * @param {boolean} enable - if true then no events will be logged or sent.
 * @example: amplitude.setOptOut(true);
 */


AmplitudeClient.prototype.setOptOut = function setOptOut(enable) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setOptOut'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!utils.validateInput(enable, 'enable', 'boolean')) {
    return;
  }

  try {
    this.options.optOut = enable;

    _saveCookieData(this);
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Set a custom Session ID for the current session.
 * Note: This is not recommended unless you know what you are doing because the Session ID of a session is utilized for all session metrics in Amplitude.
 * The Session ID to set for the current session must be in milliseconds since epoch (Unix Timestamp).
 * @public
 * @param {int} sessionId to set.
 * @example amplitudeClient.setSessionId(1622158968000);
 */


AmplitudeClient.prototype.setSessionId = function setSessionId(sessionId) {
  if (!utils.validateInput(sessionId, 'sessionId', 'number')) {
    return;
  }

  try {
    this._sessionId = sessionId;

    _saveCookieData(this);
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Sets the current Unix timestamp as the new Session ID for the instance.
 * @public
 * @example amplitudeClient.resetSessionId();
 */


AmplitudeClient.prototype.resetSessionId = function resetSessionId() {
  this.setSessionId(new Date().getTime());
};
/**
 * Regenerates a new random deviceId for current user. Note: this is not recommended unless you know what you
 * are doing. This can be used in conjunction with `setUserId(null)` to anonymize users after they log out.
 * With a null userId and a completely new deviceId, the current user would appear as a brand new user in dashboard.
 * This uses src/uuid.js to regenerate the deviceId.
 * @public
 */


AmplitudeClient.prototype.regenerateDeviceId = function regenerateDeviceId() {
  if (this._shouldDeferCall()) {
    return this._q.push(['regenerateDeviceId'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  this.setDeviceId(base64Id());
};
/**
 * Sets a custom deviceId for current user. **Values may not have `.` inside them**
 * Note: this is not recommended unless you know what you are doing (like if you have your own system for managing deviceIds).
 * Make sure the deviceId you set is sufficiently unique
 * (we recommend something like a UUID - see src/uuid.js for an example of how to generate) to prevent conflicts with other devices in our system.
 * @public
 * @param {string} deviceId - custom deviceId for current user.
 * @example amplitudeClient.setDeviceId('45f0954f-eb79-4463-ac8a-233a6f45a8f0');
 */


AmplitudeClient.prototype.setDeviceId = function setDeviceId(deviceId) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setDeviceId'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!utils.validateDeviceId(deviceId)) {
    return;
  }

  try {
    if (!utils.isEmptyString(deviceId)) {
      this.options.deviceId = '' + deviceId;

      _saveCookieData(this);
    }
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Sets the network transport type for events. Typically used to set to 'beacon'
 * on an end-of-lifecycle event handler such as `onpagehide` or `onvisibilitychange`
 * @public
 * @param {string} transport - transport mechanism to use for events. Must be one of `http` or `beacon`.
 * @example amplitudeClient.setDeviceId('45f0954f-eb79-4463-ac8a-233a6f45a8f0');
 */


AmplitudeClient.prototype.setTransport = function setTransport(transport) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setTransport'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!utils.validateTransport(transport)) {
    return;
  }

  this.options.transport = transport;
};
/**
 * Sets user properties for the current user.
 * @public
 * @param {object} - object with string keys and values for the user properties to set.
 * @param {boolean} - DEPRECATED opt_replace: in earlier versions of the JS SDK the user properties object was kept in
 * memory and replace = true would replace the object in memory. Now the properties are no longer stored in memory, so replace is deprecated.
 * @example amplitudeClient.setUserProperties({'gender': 'female', 'sign_up_complete': true})
 */


AmplitudeClient.prototype.setUserProperties = function setUserProperties(userProperties) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setUserProperties'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('setUserProperties()') || !utils.validateInput(userProperties, 'userProperties', 'object')) {
    return;
  } // sanitize the userProperties dict before converting into identify


  var sanitized = utils.truncate(utils.validateProperties(userProperties));

  if (Object.keys(sanitized).length === 0) {
    return;
  } // convert userProperties into an identify call


  var identify = new Identify();

  for (var property in sanitized) {
    if (Object.prototype.hasOwnProperty.call(sanitized, property)) {
      identify.set(property, sanitized[property]);
    }
  }

  this.identify(identify);
};
/**
 * Clear all of the user properties for the current user. Note: clearing user properties is irreversible!
 * @public
 * @example amplitudeClient.clearUserProperties();
 */


AmplitudeClient.prototype.clearUserProperties = function clearUserProperties() {
  if (this._shouldDeferCall()) {
    return this._q.push(['clearUserProperties'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('clearUserProperties()')) {
    return;
  }

  var identify = new Identify();
  identify.clearAll();
  this.identify(identify);
};
/**
 * Applies the proxied functions on the proxied object to an instance of the real object.
 * Used to convert proxied Identify and Revenue objects.
 * @private
 */


var _convertProxyObjectToRealObject = function _convertProxyObjectToRealObject(instance, proxy) {
  for (var i = 0; i < proxy._q.length; i++) {
    var fn = instance[proxy._q[i][0]];

    if (type(fn) === 'function') {
      fn.apply(instance, proxy._q[i].slice(1));
    }
  }

  return instance;
};
/**
 * Send an identify call containing user property operations to Amplitude servers.
 * See the [Identify](https://amplitude.github.io/Amplitude-JavaScript/Identify/)
 * reference page for more information on the Identify API and user property operations.
 * @param {Identify} identify_obj - the Identify object containing the user property operations to send.
 * @param {Amplitude~eventCallback} opt_callback - (optional) callback function to run when the identify event has been sent.
 * Note: the server response code and response body from the identify event upload are passed to the callback function.
 * @param {Amplitude~eventCallback} opt_error_callback - (optional) a callback function to run after the event logging
 * fails. The failure can be from the request being malformed or from a network failure
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @example
 * var identify = new amplitude.Identify().set('colors', ['rose', 'gold']).add('karma', 1).setOnce('sign_up_date', '2016-03-31');
 * amplitude.identify(identify);
 */


AmplitudeClient.prototype.identify = function (identify_obj, opt_callback, opt_error_callback, outOfSession) {
  if (this._shouldDeferCall()) {
    return this._q.push(['identify'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('identify()')) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'API key is not set'
    });

    return;
  } // if identify input is a proxied object created by the async loading snippet, convert it into an identify object


  if (type(identify_obj) === 'object' && Object.prototype.hasOwnProperty.call(identify_obj, '_q')) {
    identify_obj = _convertProxyObjectToRealObject(new Identify(), identify_obj);
  }

  if (identify_obj instanceof Identify) {
    // only send if there are operations
    if (Object.keys(identify_obj.userPropertiesOperations).length > 0) {
      return this._logEvent(Constants.IDENTIFY_EVENT, null, null, identify_obj.userPropertiesOperations, null, null, null, opt_callback, opt_error_callback, outOfSession);
    } else {
      _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
        reason: 'No user property operations'
      });
    }
  } else {
    utils.log.error('Invalid identify input type. Expected Identify object but saw ' + type(identify_obj));

    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Invalid identify input type'
    });
  }
};

AmplitudeClient.prototype.groupIdentify = function (group_type, group_name, identify_obj, opt_callback, opt_error_callback, outOfSession) {
  if (this._shouldDeferCall()) {
    return this._q.push(['groupIdentify'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('groupIdentify()')) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'API key is not set'
    });

    return;
  }

  if (!utils.validateInput(group_type, 'group_type', 'string') || utils.isEmptyString(group_type)) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Invalid group type'
    });

    return;
  }

  if (group_name === null || group_name === undefined) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Invalid group name'
    });

    return;
  } // if identify input is a proxied object created by the async loading snippet, convert it into an identify object


  if (type(identify_obj) === 'object' && Object.prototype.hasOwnProperty.call(identify_obj, '_q')) {
    identify_obj = _convertProxyObjectToRealObject(new Identify(), identify_obj);
  }

  if (identify_obj instanceof Identify) {
    // only send if there are operations
    if (Object.keys(identify_obj.userPropertiesOperations).length > 0) {
      return this._logEvent(Constants.GROUP_IDENTIFY_EVENT, null, null, null, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, group_type, group_name), identify_obj.userPropertiesOperations, null, opt_callback, opt_error_callback, outOfSession);
    } else {
      _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
        reason: 'No group property operations'
      });
    }
  } else {
    utils.log.error('Invalid identify input type. Expected Identify object but saw ' + type(identify_obj));

    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Invalid identify input type'
    });
  }
};
/**
 * Set a versionName for your application.
 * @public
 * @param {string} versionName - The version to set for your application.
 * @example amplitudeClient.setVersionName('1.12.3');
 */


AmplitudeClient.prototype.setVersionName = function setVersionName(versionName) {
  if (this._shouldDeferCall()) {
    return this._q.push(['setVersionName'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!utils.validateInput(versionName, 'versionName', 'string')) {
    return;
  }

  this.options.versionName = versionName;
};
/**
 * Private logEvent method. Keeps apiProperties from being publicly exposed.
 * @private
 */


AmplitudeClient.prototype._logEvent = function _logEvent(eventType, eventProperties, apiProperties, userProperties, groups, groupProperties, timestamp, callback, errorCallback, outOfSession) {
  _loadCookieData(this); // reload cookie before each log event to sync event meta-data between windows and tabs


  if (!eventType) {
    _logErrorsWithCallbacks(callback, errorCallback, 0, 'No request sent', {
      reason: 'Missing eventType'
    });

    return;
  }

  if (this.options.optOut) {
    _logErrorsWithCallbacks(callback, errorCallback, 0, 'No request sent', {
      reason: 'optOut is set to true'
    });

    return;
  }

  try {
    var eventId;

    if (eventType === Constants.IDENTIFY_EVENT || eventType === Constants.GROUP_IDENTIFY_EVENT) {
      eventId = this.nextIdentifyId();
    } else {
      eventId = this.nextEventId();
    }

    var sequenceNumber = this.nextSequenceNumber();
    var eventTime = type(timestamp) === 'number' ? timestamp : new Date().getTime();

    if (outOfSession) {
      this._sessionId = -1;
    } else if (!this._sessionId || !this._lastEventTime || eventTime - this._lastEventTime > this.options.sessionTimeout) {
      this._sessionId = eventTime;

      this._runNewSessionStartCallbacks();
    }

    this._lastEventTime = eventTime;

    _saveCookieData(this);

    var osName = this._ua.browser.name;
    var osVersion = this._ua.browser.major;
    var deviceModel = this._ua.device.model || this._ua.os.name;
    var deviceVendor = this._ua.device.vendor;
    userProperties = userProperties || {};

    var trackingOptions = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, this._apiPropertiesTrackingOptions);

    apiProperties = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, apiProperties || {}, trackingOptions);
    eventProperties = eventProperties || {};
    groups = groups || {};
    groupProperties = groupProperties || {};
    var event = {
      device_id: this.options.deviceId,
      user_id: this.options.userId,
      timestamp: eventTime,
      event_id: eventId,
      session_id: this._sessionId || -1,
      event_type: eventType,
      version_name: this.options.versionName || null,
      platform: _shouldTrackField(this, 'platform') ? this.options.platform : null,
      os_name: _shouldTrackField(this, 'os_name') ? osName || null : null,
      os_version: _shouldTrackField(this, 'os_version') ? osVersion || null : null,
      device_model: _shouldTrackField(this, 'device_model') ? deviceModel || null : null,
      device_manufacturer: _shouldTrackField(this, 'device_manufacturer') ? deviceVendor || null : null,
      language: _shouldTrackField(this, 'language') ? this.options.language : null,
      api_properties: apiProperties,
      event_properties: utils.truncate(utils.validateProperties(eventProperties)),
      user_properties: utils.truncate(utils.validateProperties(userProperties)),
      uuid: uuid(),
      library: this.options.library,
      sequence_number: sequenceNumber,
      // for ordering events and identifys
      groups: utils.truncate(utils.validateGroups(groups)),
      group_properties: utils.truncate(utils.validateProperties(groupProperties)),
      user_agent: this._userAgent
    };

    if (_isObservePlanSet(this)) {
      event.plan = {
        branch: this.options.plan.branch || undefined,
        source: this.options.plan.source || undefined,
        version: this.options.plan.version || undefined
      };
    }

    if (eventType === Constants.IDENTIFY_EVENT || eventType === Constants.GROUP_IDENTIFY_EVENT) {
      this._unsentIdentifys.push({
        event: event,
        callback: callback,
        errorCallback: errorCallback
      });

      this._limitEventsQueued(this._unsentIdentifys);
    } else {
      this._unsentEvents.push({
        event: event,
        callback: callback,
        errorCallback: errorCallback
      });

      this._limitEventsQueued(this._unsentEvents);
    }

    if (this.options.saveEvents) {
      this.saveEvents();
    }

    this._sendEventsIfReady();

    return eventId;
  } catch (e) {
    utils.log.error(e);
  }
};

var _isObservePlanSet = function _isObservePlanSet(scope) {
  return scope.options.plan && (scope.options.plan.source || scope.options.plan.branch || scope.options.plan.version);
};

var _shouldTrackField = function _shouldTrackField(scope, field) {
  return !!scope.options.trackingOptions[field];
};

var _generateApiPropertiesTrackingConfig = function _generateApiPropertiesTrackingConfig(scope) {
  // to limit size of config payload, only send fields that have been disabled
  var fields = ['city', 'country', 'dma', 'ip_address', 'region'];
  var config = {};

  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];

    if (!_shouldTrackField(scope, field)) {
      config[field] = false;
    }
  }

  return config;
};
/**
 * Remove old events from the beginning of the array if too many have accumulated. Default limit is 1000 events.
 * @private
 */


AmplitudeClient.prototype._limitEventsQueued = function _limitEventsQueued(queue) {
  if (queue.length > this.options.savedMaxCount) {
    var deletedEvents = queue.splice(0, queue.length - this.options.savedMaxCount);
    deletedEvents.forEach(function (event) {
      _logErrorsWithCallbacks(event.callback, event.errorCallback, 0, 'No request sent', {
        reason: 'Event dropped because options.savedMaxCount exceeded. User may be offline or have a content blocker'
      });
    });
  }
};
/**
 * This is the callback for logEvent and identify calls. It gets called after the event/identify is uploaded,
 * and the server response code and response body from the upload request are passed to the callback function.
 * @callback Amplitude~eventCallback
 * @param {number} responseCode - Server response code for the event / identify upload request.
 * @param {string} responseBody - Server response body for the event / identify upload request.
 * @param {object} details - (optional) Additional information associated with sending event.
 */

/**
 * Log an event with eventType and eventProperties
 * @public
 * @param {string} eventType - name of event
 * @param {object} eventProperties - (optional) an object with string keys and values for the event properties.
 * @param {Amplitude~eventCallback} opt_callback - (optional) a callback function to run after the event is logged.
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @param {Amplitude~eventCallback} opt_error_callback - (optional) a callback function to run after the event logging
 * fails. The failure can be from the request being malformed or from a network failure
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @param {boolean} outOfSession - (optional) if this event is out of session or not
 * @example amplitudeClient.logEvent('Clicked Homepage Button', {'finished_flow': false, 'clicks': 15});
 */


AmplitudeClient.prototype.logEvent = function logEvent(eventType, eventProperties, opt_callback, opt_error_callback) {
  var outOfSession = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (this._shouldDeferCall()) {
    return this._q.push(['logEvent'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  return this.logEventWithTimestamp(eventType, eventProperties, null, opt_callback, opt_error_callback, outOfSession);
};
/**
 * Log an event with eventType and eventProperties and a custom timestamp
 * @public
 * @param {string} eventType - name of event
 * @param {object} eventProperties - (optional) an object with string keys and values for the event properties.
 * @param {number} timestamp - (optional) the custom timestamp as milliseconds since epoch.
 * @param {Amplitude~eventCallback} opt_callback - (optional) a callback function to run after the event is logged.
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @param {Amplitude~eventCallback} opt_error_callback - (optional) a callback function to run after the event logging
 * fails. The failure can be from the request being malformed or from a network failure
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @param {boolean} outOfSession - (optional) if out of the sessioin or not
 * @example amplitudeClient.logEvent('Clicked Homepage Button', {'finished_flow': false, 'clicks': 15});
 */


AmplitudeClient.prototype.logEventWithTimestamp = function logEvent(eventType, eventProperties, timestamp, opt_callback, opt_error_callback) {
  var outOfSession = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  if (this._shouldDeferCall()) {
    return this._q.push(['logEventWithTimestamp'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('logEvent()')) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'API key not set'
    });

    return -1;
  }

  if (!utils.validateInput(eventType, 'eventType', 'string')) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Invalid type for eventType'
    });

    return -1;
  }

  if (utils.isEmptyString(eventType)) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Missing eventType'
    });

    return -1;
  }

  if (!utils.validateInput(outOfSession, 'outOfSession', 'boolean')) {
    _logErrorsWithCallbacks(opt_callback, opt_error_callback, 0, 'No request sent', {
      reason: 'Invalid outOfSession value'
    });
  }

  return this._logEvent(eventType, eventProperties, null, null, null, null, timestamp, opt_callback, opt_error_callback, outOfSession);
};
/**
 * Log an event with eventType, eventProperties, and groups. Use this to set event-level groups.
 * Note: the group(s) set only apply for the specific event type being logged and does not persist on the user
 * (unless you explicitly set it with setGroup).
 *
 * See the [advanced topics article](https://developers.amplitude.com/docs/javascript#user-groups) for more information
 * about groups and Count by Distinct on the Amplitude platform.
 * @public
 * @param {string} eventType - name of event
 * @param {object} eventProperties - (optional) an object with string keys and values for the event properties.
 * @param {object} groups - (optional) an object with string groupType: groupName values for the event being logged.
 * groupName can be a string or an array of strings.
 * @param {Amplitude~eventCallback} opt_callback - (optional) a callback function to run after the event is logged.
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @param {Amplitude~eventCallback} opt_error_callback - (optional) a callback function to run after the event logging
 * fails. The failure can be from the request being malformed or from a network failure
 * Note: the server response code and response body from the event upload are passed to the callback function.
 * @example amplitudeClient.logEventWithGroups('Clicked Button', null, {'orgId': 24});
 */


AmplitudeClient.prototype.logEventWithGroups = function (eventType, eventProperties, groups, opt_callback, opt_error_callback) {
  var outOfSession = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  if (this._shouldDeferCall()) {
    return this._q.push(['logEventWithGroups'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('logEventWithGroups()')) {
    _logErrorsWithCallbacks(event.callback, event.errorCallback, 0, 'No request sent', {
      reason: 'API key not set'
    });

    return -1;
  }

  if (!utils.validateInput(eventType, 'eventType', 'string')) {
    _logErrorsWithCallbacks(event.callback, event.errorCallback, 0, 'No request sent', {
      reason: 'Invalid type for eventType'
    });

    return -1;
  }

  if (!utils.validateInput(outOfSession, 'outOfSession', 'boolean')) {
    _logErrorsWithCallbacks(event.callback, event.errorCallback, 0, 'No request sent', {
      reason: 'Invalid outOfSession value'
    });
  }

  return this._logEvent(eventType, eventProperties, null, null, groups, null, null, opt_callback, opt_error_callback, outOfSession);
};
/**
 * Test that n is a number or a numeric value.
 * @private
 */


var _isNumber = function _isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
/**
 * Handles errors that are sent to both callbacks
 * @private
 */


var _logErrorsWithCallbacks = function _logErrorsWithCallbacks(opt_callback, opt_error_callback, status, response, details) {
  if (type(opt_callback) === 'function') {
    opt_callback(status, response, details);
  }

  if (type(opt_error_callback) === 'function') {
    opt_error_callback(status, response, details);
  }
};
/**
 * Log revenue with Revenue interface. The new revenue interface allows for more revenue fields like
 * revenueType and event properties.
 *
 * See the [Revenue](https://amplitude.github.io/Amplitude-JavaScript/Revenue/)
 * reference page for more information on the Revenue interface and logging revenue.
 * @public
 * @param {Revenue} revenue_obj - the revenue object containing the revenue data being logged.
 * @example var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99);
 * amplitude.logRevenueV2(revenue);
 */


AmplitudeClient.prototype.logRevenueV2 = function logRevenueV2(revenue_obj) {
  if (this._shouldDeferCall()) {
    return this._q.push(['logRevenueV2'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  if (!this._apiKeySet('logRevenueV2()')) {
    return;
  } // if revenue input is a proxied object created by the async loading snippet, convert it into an revenue object


  if (type(revenue_obj) === 'object' && Object.prototype.hasOwnProperty.call(revenue_obj, '_q')) {
    revenue_obj = _convertProxyObjectToRealObject(new Revenue(), revenue_obj);
  }

  if (revenue_obj instanceof Revenue) {
    // only send if revenue is valid
    if (revenue_obj && revenue_obj._isValidRevenue()) {
      return this.logEvent(Constants.REVENUE_EVENT, revenue_obj._toJSONObject());
    }
  } else {
    utils.log.error('Invalid revenue input type. Expected Revenue object but saw ' + type(revenue_obj));
  }
};

{
  /**
   * Log revenue event with a price, quantity, and product identifier. DEPRECATED - use logRevenueV2
   * @public
   * @deprecated
   * @param {number} price - price of revenue event
   * @param {number} quantity - (optional) quantity of products in revenue event. If no quantity specified default to 1.
   * @param {string} product - (optional) product identifier
   * @example amplitudeClient.logRevenue(3.99, 1, 'product_1234');
   */
  AmplitudeClient.prototype.logRevenue = function logRevenue(price, quantity, product) {
    if (this._shouldDeferCall()) {
      return this._q.push(['logRevenue'].concat(Array.prototype.slice.call(arguments, 0)));
    } // Test that the parameters are of the right type.


    if (!this._apiKeySet('logRevenue()') || !_isNumber(price) || quantity !== undefined && !_isNumber(quantity)) {
      // utils.log('Price and quantity arguments to logRevenue must be numbers');
      return -1;
    }

    return this._logEvent(Constants.REVENUE_EVENT, {}, {
      productId: product,
      special: 'revenue_amount',
      quantity: quantity || 1,
      price: price
    }, null, null, null, null, null);
  };
}
/**
 * Calls error callback on unsent events
 * @private
 */


AmplitudeClient.prototype._logErrorsOnEvents = function _logErrorsOnEvents(maxEventId, maxIdentifyId, status, response) {
  var queues = ['_unsentEvents', '_unsentIdentifys'];

  for (var j = 0; j < queues.length; j++) {
    var queue = queues[j];
    var maxId = queue === '_unsentEvents' ? maxEventId : maxIdentifyId;

    for (var i = 0; i < this[queue].length || 0; i++) {
      var unsentEvent = this[queue][i];

      if (unsentEvent.event.event_id <= maxId) {
        if (unsentEvent.errorCallback) {
          unsentEvent.errorCallback(status, response);
        }
      }
    }
  }
};
/**
 * Remove events in storage with event ids up to and including maxEventId.
 * @private
 */


AmplitudeClient.prototype.removeEvents = function removeEvents(maxEventId, maxIdentifyId, status, response) {
  _removeEvents(this, '_unsentEvents', maxEventId, status, response);

  _removeEvents(this, '_unsentIdentifys', maxIdentifyId, status, response);
};
/**
 * Helper function to remove events up to maxId from a single queue.
 * Does a true filter in case events get out of order or old events are removed.
 * @private
 */


var _removeEvents = function _removeEvents(scope, eventQueue, maxId, status, response) {
  if (maxId < 0) {
    return;
  }

  var filteredEvents = [];

  for (var i = 0; i < scope[eventQueue].length || 0; i++) {
    var unsentEvent = scope[eventQueue][i];

    if (unsentEvent.event.event_id > maxId) {
      filteredEvents.push(unsentEvent);
    } else {
      if (unsentEvent.callback) {
        unsentEvent.callback(status, response);
      }
    }
  }

  scope[eventQueue] = filteredEvents;
};
/**
 * Send unsent events. Note: this is called automatically after events are logged if option batchEvents is false.
 * If batchEvents is true, then events are only sent when batch criterias are met.
 * @private
 */


AmplitudeClient.prototype.sendEvents = function sendEvents() {
  if (!this._apiKeySet('sendEvents()')) {
    this.removeEvents(Infinity, Infinity, 0, 'No request sent', {
      reason: 'API key not set'
    });
    return;
  }

  if (this.options.optOut) {
    this.removeEvents(Infinity, Infinity, 0, 'No request sent', {
      reason: 'Opt out is set to true'
    });
    return;
  } // How is it possible to get into this state?


  if (this._unsentCount() === 0) {
    return;
  } // We only make one request at a time. sendEvents will be invoked again once
  // the last request completes.
  // beacon data is sent synchronously, so don't pause for it


  if (this.options.transport !== Constants.TRANSPORT_BEACON) {
    if (this._sending) {
      return;
    }

    this._sending = true;
  }

  var protocol = this.options.forceHttps ? 'https' : 'https:' === GlobalScope.location.protocol ? 'https' : 'http';
  var url = protocol + '://' + this.options.apiEndpoint; // fetch events to send

  var numEvents = Math.min(this._unsentCount(), this.options.uploadBatchSize);

  var mergedEvents = this._mergeEventsAndIdentifys(numEvents);

  var maxEventId = mergedEvents.maxEventId;
  var maxIdentifyId = mergedEvents.maxIdentifyId;
  var events = JSON.stringify(mergedEvents.eventsToSend.map(function (_ref2) {
    var event = _ref2.event;
    return event;
  }));
  var uploadTime = new Date().getTime();
  var data = {
    client: this.options.apiKey,
    e: events,
    v: Constants.API_VERSION,
    upload_time: uploadTime,
    checksum: blueimp_md5__WEBPACK_IMPORTED_MODULE_7___default()(Constants.API_VERSION + this.options.apiKey + events + uploadTime)
  };

  if (this.options.transport === Constants.TRANSPORT_BEACON) {
    var success = navigator.sendBeacon(url, new URLSearchParams(data));

    if (success) {
      this.removeEvents(maxEventId, maxIdentifyId, 200, 'success');

      if (this.options.saveEvents) {
        this.saveEvents();
      }
    } else {
      this._logErrorsOnEvents(maxEventId, maxIdentifyId, 0, '');
    }

    return;
  }

  var scope = this;

  try {
    new Request(url, data, this.options.headers).send(function (status, response) {
      scope._sending = false;

      try {
        if (status === 200 && response === 'success') {
          scope.removeEvents(maxEventId, maxIdentifyId, status, response); // Update the event cache after the removal of sent events.

          if (scope.options.saveEvents) {
            scope.saveEvents();
          } // Send more events if any queued during previous send.


          scope._sendEventsIfReady(); // handle payload too large

        } else {
          scope._logErrorsOnEvents(maxEventId, maxIdentifyId, status, response);

          if (status === 413) {
            // utils.log('request too large');
            // Can't even get this one massive event through. Drop it, even if it is an identify.
            if (scope.options.uploadBatchSize === 1) {
              scope.removeEvents(maxEventId, maxIdentifyId, status, response);
            } // The server complained about the length of the request. Backoff and try again.


            scope.options.uploadBatchSize = Math.ceil(numEvents / 2);
            scope.sendEvents();
          }
        } // else {
        //  all the events are still queued, and will be retried when the next
        //  event is sent In the interest of debugging, it would be nice to have
        //  something like an event emitter for a better debugging experince
        //  here.
        // }

      } catch (e) {// utils.log.error('failed upload');
      }
    });
  } catch (e) {
    var status = 0,
        response = 'Request failed to send';
    utils.log.error(response);

    scope._logErrorsOnEvents(maxEventId, maxIdentifyId, status, response);

    scope.removeEvents(maxEventId, maxIdentifyId, status, response, {
      reason: e.message
    });
  }
};
/**
 * Merge unsent events and identifys together in sequential order based on their sequence number, for uploading.
 * Identifys given higher priority than Events. Also earlier sequence given priority
 * @private
 */


AmplitudeClient.prototype._mergeEventsAndIdentifys = function _mergeEventsAndIdentifys(numEvents) {
  // coalesce events from both queues
  var eventsToSend = [];
  var eventIndex = 0;
  var maxEventId = -1;
  var identifyIndex = 0;
  var maxIdentifyId = -1;

  while (eventsToSend.length < numEvents) {
    var unsentEvent = void 0;
    var noIdentifys = identifyIndex >= this._unsentIdentifys.length;
    var noEvents = eventIndex >= this._unsentEvents.length; // case 0: no events or identifys left
    // note this should not happen, this means we have less events and identifys than expected

    if (noEvents && noIdentifys) {
      utils.log.error('Merging Events and Identifys, less events and identifys than expected');
      break;
    } // case 1: no identifys - grab from events
    else if (noIdentifys) {
        unsentEvent = this._unsentEvents[eventIndex++];
        maxEventId = unsentEvent.event.event_id; // case 2: no events - grab from identifys
      } else if (noEvents) {
        unsentEvent = this._unsentIdentifys[identifyIndex++];
        maxIdentifyId = unsentEvent.event.event_id; // case 3: need to compare sequence numbers
      } else {
        // events logged before v2.5.0 won't have a sequence number, put those first
        if (!('sequence_number' in this._unsentEvents[eventIndex].event) || this._unsentEvents[eventIndex].event.sequence_number < this._unsentIdentifys[identifyIndex].event.sequence_number) {
          unsentEvent = this._unsentEvents[eventIndex++];
          maxEventId = unsentEvent.event.event_id;
        } else {
          unsentEvent = this._unsentIdentifys[identifyIndex++];
          maxIdentifyId = unsentEvent.event.event_id;
        }
      }

    eventsToSend.push(unsentEvent);
  }

  return {
    eventsToSend: eventsToSend,
    maxEventId: maxEventId,
    maxIdentifyId: maxIdentifyId
  };
};

{
  /**
   * Set global user properties. Note this is deprecated, and we recommend using setUserProperties
   * @public
   * @deprecated
   */
  AmplitudeClient.prototype.setGlobalUserProperties = function setGlobalUserProperties(userProperties) {
    this.setUserProperties(userProperties);
  };
}
/**
 * Get the current version of Amplitude's Javascript SDK.
 * @public
 * @returns {number} version number
 * @example var amplitudeVersion = amplitude.__VERSION__;
 */


AmplitudeClient.prototype.__VERSION__ = function getVersion() {
  return this.options.library.version;
};
/**
 * Sets the library name and version. Default is `amplitude-js` and the version defined in package.json. Used if you're building another library on top of amplitude-js and want a custom data source value
 * @public
 * @param {string} name - Custom library name
 * @param {string} version - Custom library version
 */


AmplitudeClient.prototype.setLibrary = function setLibrary(name, version) {
  if (name !== null && typeof name !== 'undefined') {
    this.options.library.name = name;
  }

  if (version !== null && typeof version !== 'undefined') {
    this.options.library.version = version;
  }
};
/**
 * Determines whether or not to push call to this._q or invoke it
 * @private
 */


AmplitudeClient.prototype._shouldDeferCall = function _shouldDeferCall() {
  return this._pendingReadStorage || this._initializationDeferred;
};
/**
 * Defers Initialization by putting all functions into storage until users
 * have accepted terms for tracking
 * @private
 */


AmplitudeClient.prototype._deferInitialization = function _deferInitialization() {
  this._initializationDeferred = true;

  this._q.push(['init'].concat(Array.prototype.slice.call(arguments, 0)));
};
/**
 * Enable tracking via logging events and dropping a cookie
 * Intended to be used with the deferInitialization configuration flag
 * This will drop a cookie and reset initialization deferred
 * @public
 */


AmplitudeClient.prototype.enableTracking = function enableTracking() {
  // This will call init (which drops the cookie) and will run any pending tasks
  this._initializationDeferred = false;

  _saveCookieData(this);

  this.runQueuedFunctions();
};
/**
 * Find best server url if choose to enable dynamic configuration.
 */


AmplitudeClient.prototype._refreshDynamicConfig = function _refreshDynamicConfig() {
  if (this.options.useDynamicConfig) {
    instance.refresh(this.options.serverZone, this.options.forceHttps, function () {
      this.options.apiEndpoint = instance.ingestionEndpoint;
    }.bind(this));
  }
};
/**
 * Returns the deviceId value.
 * @public
 * @return {string} Id of current device.
 */


AmplitudeClient.prototype.getDeviceId = function getDeviceId() {
  return this.options.deviceId;
};
/**
 * Returns the userId.
 * @public
 * @return {string} Id of current user.
 */


AmplitudeClient.prototype.getUserId = function getUserId() {
  return this.options.userId;
};
/**
 * Set a custom session expiration time.
 * @public
 * @param {number} timeInMillis - session expireation time in milliseconds.
 */


AmplitudeClient.prototype.setMinTimeBetweenSessionsMillis = function setMinTimeBetweenSessionsMillis(timeInMillis) {
  if (!utils.validateInput(timeInMillis, 'timeInMillis', 'number')) {
    return;
  }

  if (this._shouldDeferCall()) {
    return this._q.push(['setMinTimeBetweenSessionsMillis'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  try {
    this.options.sessionTimeout = timeInMillis;
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Sets minimum number of events to batch together per request if batchEvents is true.
 * @public
 * @param {number} eventUploadThreshold - The number of the event upload threshold. Default value is 30.
 * @example amplitudeClient.setEventUploadThreshold(10);
 */


AmplitudeClient.prototype.setEventUploadThreshold = function setEventUploadThreshold(eventUploadThreshold) {
  if (!utils.validateInput(eventUploadThreshold, 'eventUploadThreshold', 'number')) {
    return;
  }

  if (this._shouldDeferCall()) {
    return this._q.push(['setEventUploadThreshold'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  try {
    this.options.eventUploadThreshold = eventUploadThreshold;
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Dynamically adjust server URL
 * @public
 * @param {bool} useDynamicConfig - if enable dynamic config or not.
 * @example amplitudeClient.setUseDynamicConfig(true);
 */


AmplitudeClient.prototype.setUseDynamicConfig = function setUseDynamicConfig(useDynamicConfig) {
  if (!utils.validateInput(useDynamicConfig, 'useDynamicConfig', 'boolean')) {
    return;
  }

  if (this._shouldDeferCall()) {
    return this._q.push(['setUseDynamicConfig'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  try {
    this.options.useDynamicConfig = useDynamicConfig;

    this._refreshDynamicConfig();
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Sets the server zone, used for server api endpoint and dynamic configuration.
 * @public
 * @param {string} serverZone - the server zone value. AmplitudeServerZone.US or AmplitudeServerZone.EU.
 * @param {bool} serverZoneBasedApi - (optional) update api endpoint with serverZone change or not. For data residency, recommend to enable it unless using own proxy server.
 * @example amplitudeClient.setServerZone('joe@gmail.com', true);
 */


AmplitudeClient.prototype.setServerZone = function setServerZone(serverZone) {
  var serverZoneBasedApi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (serverZone !== AmplitudeServerZone.EU && serverZone !== AmplitudeServerZone.US || !utils.validateInput(serverZoneBasedApi, 'serverZoneBasedApi', 'boolean')) {
    return;
  }

  if (this._shouldDeferCall()) {
    return this._q.push(['setServerZone'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  try {
    this.options.serverZone = serverZone;
    this.options.serverZoneBasedApi = serverZoneBasedApi;

    if (serverZoneBasedApi) {
      this.options.apiEndpoint = getEventLogApi(this.options.serverZone);
    }
  } catch (e) {
    utils.log.error(e);
  }
};
/**
 * Sets the server URL for the request.
 * @public
 * @param {string} serverUrl - The value of the server URL.
 * @example amplitudeClient.setServerUrl('api.amplitude.com');
 */


AmplitudeClient.prototype.setServerUrl = function setServerUrl(serverUrl) {
  if (!utils.validateInput(serverUrl, 'serverUrl', 'string')) {
    return;
  }

  if (this._shouldDeferCall()) {
    return this._q.push(['setServerUrl'].concat(Array.prototype.slice.call(arguments, 0)));
  }

  try {
    this.options.apiEndpoint = serverUrl;
  } catch (e) {
    utils.log.error(e);
  }
};

/**
 * Deprecated legacy API of the Amplitude JS SDK - instance manager.
 *
 * Wraps around the current [AmplitudeClient](https://amplitude.github.io/Amplitude-JavaScript/) which provides more features
 * Function calls directly on amplitude have been deprecated. Please call methods on the default shared instance: amplitude.getInstance() instead.
 *
 * See the [3.0.0 changelog](https://github.com/amplitude/Amplitude-JavaScript/blob/ed405afb5f06d5cf5b72539a5d09179abcf7e1fe/README.md#300-update-and-logging-events-to-multiple-amplitude-apps) for more information about this change.
 * @constructor Amplitude
 * @public
 * @deprecated
 * @example var amplitude = new Amplitude();
 */

var Amplitude = function Amplitude() {
  this.options = _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()({}, DEFAULT_OPTIONS);
  this._q = [];
  this._instances = {}; // mapping of instance names to instances
};

Amplitude.prototype.Identify = Identify;
Amplitude.prototype.Revenue = Revenue;

Amplitude.prototype.getInstance = function getInstance(instance) {
  instance = utils.isEmptyString(instance) ? Constants.DEFAULT_INSTANCE : instance.toLowerCase();
  var client = this._instances[instance];

  if (client === undefined) {
    client = new AmplitudeClient(instance);
    this._instances[instance] = client;
  }

  return client;
};

{
  /**
   * Initializes the Amplitude Javascript SDK with your apiKey and any optional configurations.
   * This is required before any other methods can be called.
   * @public
   * @param {string} apiKey - The API key for your app.
   * @param {string} opt_userId - (optional) An identifier for this user.
   * @param {object} opt_config - (optional) Configuration options.
   * See [options.js](https://github.com/amplitude/Amplitude-JavaScript/blob/master/src/options.js#L14) for list of options and default values.
   * @param {function} opt_callback - (optional) Provide a callback function to run after initialization is complete.
   * @deprecated Please use amplitude.getInstance().init(apiKey, opt_userId, opt_config, opt_callback);
   * @example amplitude.init('API_KEY', 'USER_ID', {includeReferrer: true, includeUtm: true}, function() { alert('init complete'); });
   */
  Amplitude.prototype.init = function init(apiKey, opt_userId, opt_config, opt_callback) {
    this.getInstance().init(apiKey, opt_userId, opt_config, function (instance) {
      // make options such as deviceId available for callback functions
      this.options = instance.options;

      if (type(opt_callback) === 'function') {
        opt_callback(instance);
      }
    }.bind(this));
  };
  /**
   * Returns true if a new session was created during initialization, otherwise false.
   * @public
   * @return {boolean} Whether a new session was created during initialization.
   * @deprecated Please use amplitude.getInstance().isNewSession();
   */


  Amplitude.prototype.isNewSession = function isNewSession() {
    return this.getInstance().isNewSession();
  };
  /**
   * Returns the id of the current session.
   * @public
   * @return {number} Id of the current session.
   * @deprecated Please use amplitude.getInstance().getSessionId();
   */


  Amplitude.prototype.getSessionId = function getSessionId() {
    return this.getInstance().getSessionId();
  };
  /**
   * Increments the eventId and returns it.
   * @private
   */


  Amplitude.prototype.nextEventId = function nextEventId() {
    return this.getInstance().nextEventId();
  };
  /**
   * Increments the identifyId and returns it.
   * @private
   */


  Amplitude.prototype.nextIdentifyId = function nextIdentifyId() {
    return this.getInstance().nextIdentifyId();
  };
  /**
   * Increments the sequenceNumber and returns it.
   * @private
   */


  Amplitude.prototype.nextSequenceNumber = function nextSequenceNumber() {
    return this.getInstance().nextSequenceNumber();
  };
  /**
   * Saves unsent events and identifies to localStorage. JSON stringifies event queues before saving.
   * Note: this is called automatically every time events are logged, unless you explicitly set option saveEvents to false.
   * @private
   */


  Amplitude.prototype.saveEvents = function saveEvents() {
    this.getInstance().saveEvents();
  };
  /**
   * Sets a customer domain for the amplitude cookie. Useful if you want to support cross-subdomain tracking.
   * @public
   * @param {string} domain to set.
   * @deprecated Please use amplitude.getInstance().setDomain(domain);
   * @example amplitude.setDomain('.amplitude.com');
   */


  Amplitude.prototype.setDomain = function setDomain(domain) {
    this.getInstance().setDomain(domain);
  };
  /**
   * Sets an identifier for the current user.
   * @public
   * @param {string} userId - identifier to set. Can be null.
   * @deprecated Please use amplitude.getInstance().setUserId(userId);
   * @example amplitude.setUserId('joe@gmail.com');
   */


  Amplitude.prototype.setUserId = function setUserId(userId) {
    this.getInstance().setUserId(userId);
  };
  /**
   * Add user to a group or groups. You need to specify a groupType and groupName(s).
   * For example you can group people by their organization.
   * In that case groupType is "orgId" and groupName would be the actual ID(s).
   * groupName can be a string or an array of strings to indicate a user in multiple gruups.
   * You can also call setGroup multiple times with different groupTypes to track multiple types of groups (up to 5 per app).
   * Note: this will also set groupType: groupName as a user property.
   * See the [advanced topics article](https://developers.amplitude.com/docs/javascript#user-groups) for more information.
   * @public
   * @param {string} groupType - the group type (ex: orgId)
   * @param {string|list} groupName - the name of the group (ex: 15), or a list of names of the groups
   * @deprecated Please use amplitude.getInstance().setGroup(groupType, groupName);
   * @example amplitude.setGroup('orgId', 15); // this adds the current user to orgId 15.
   */


  Amplitude.prototype.setGroup = function (groupType, groupName) {
    this.getInstance().setGroup(groupType, groupName);
  };
  /**
   * Sets whether to opt current user out of tracking.
   * @public
   * @param {boolean} enable - if true then no events will be logged or sent.
   * @deprecated Please use amplitude.getInstance().setOptOut(enable);
   * @example: amplitude.setOptOut(true);
   */


  Amplitude.prototype.setOptOut = function setOptOut(enable) {
    this.getInstance().setOptOut(enable);
  };
  /**
   * Regenerates a new random deviceId for current user. Note: this is not recommended unless you know what you
   * are doing. This can be used in conjunction with `setUserId(null)` to anonymize users after they log out.
   * With a null userId and a completely new deviceId, the current user would appear as a brand new user in dashboard.
   * This uses src/uuid.js to regenerate the deviceId.
   * @public
   * @deprecated Please use amplitude.getInstance().regenerateDeviceId();
   */


  Amplitude.prototype.regenerateDeviceId = function regenerateDeviceId() {
    this.getInstance().regenerateDeviceId();
  };
  /**
   * Sets a custom deviceId for current user. Note: this is not recommended unless you know what you are doing
   * (like if you have your own system for managing deviceIds).
   *
   * Make sure the deviceId you set is sufficiently unique
   * (we recommend something like a UUID - see src/uuid.js for an example of how to generate) to prevent conflicts with other devices in our system.
   * @public
   * @param {string} deviceId - custom deviceId for current user.
   * @deprecated Please use amplitude.getInstance().setDeviceId(deviceId);
   * @example amplitude.setDeviceId('45f0954f-eb79-4463-ac8a-233a6f45a8f0');
   */


  Amplitude.prototype.setDeviceId = function setDeviceId(deviceId) {
    this.getInstance().setDeviceId(deviceId);
  };
  /**
   * Sets user properties for the current user.
   * @public
   * @param {object} userProperties - object with string keys and values for the user properties to set.
   * @param {boolean} opt_replace - Deprecated. In earlier versions of the JS SDK the user properties object was kept in
   * memory and replace = true would replace the object in memory. Now the properties are no longer stored in memory, so replace is deprecated.
   * @deprecated Please use amplitude.getInstance().setUserProperties(userProperties);
   * @example amplitude.setUserProperties({'gender': 'female', 'sign_up_complete': true})
   */


  Amplitude.prototype.setUserProperties = function setUserProperties(userProperties) {
    this.getInstance().setUserProperties(userProperties);
  };
  /**
   * Clear all of the user properties for the current user. Note: clearing user properties is irreversible!
   * @public
   * @deprecated Please use amplitude.getInstance().clearUserProperties();
   * @example amplitude.clearUserProperties();
   */


  Amplitude.prototype.clearUserProperties = function clearUserProperties() {
    this.getInstance().clearUserProperties();
  };
  /**
   * Send an identify call containing user property operations to Amplitude servers.
   * See the [Identify](https://amplitude.github.io/Amplitude-JavaScript/Identify/)
   * reference page for more information on the Identify API and user property operations.
   * @param {Identify} identify_obj - the Identify object containing the user property operations to send.
   * @param {Amplitude~eventCallback} opt_callback - (optional) callback function to run when the identify event has been sent.
   * Note: the server response code and response body from the identify event upload are passed to the callback function.
   * @deprecated Please use amplitude.getInstance().identify(identify);
   * @example
   * var identify = new amplitude.Identify().set('colors', ['rose', 'gold']).add('karma', 1).setOnce('sign_up_date', '2016-03-31');
   * amplitude.identify(identify);
   */


  Amplitude.prototype.identify = function (identify_obj, opt_callback) {
    this.getInstance().identify(identify_obj, opt_callback);
  };
  /**
   * Set a versionName for your application.
   * @public
   * @param {string} versionName - The version to set for your application.
   * @deprecated Please use amplitude.getInstance().setVersionName(versionName);
   * @example amplitude.setVersionName('1.12.3');
   */


  Amplitude.prototype.setVersionName = function setVersionName(versionName) {
    this.getInstance().setVersionName(versionName);
  };
  /**
   * This is the callback for logEvent and identify calls. It gets called after the event/identify is uploaded,
   * and the server response code and response body from the upload request are passed to the callback function.
   * @callback Amplitude~eventCallback
   * @param {number} responseCode - Server response code for the event / identify upload request.
   * @param {string} responseBody - Server response body for the event / identify upload request.
   */

  /**
   * Log an event with eventType and eventProperties
   * @public
   * @param {string} eventType - name of event
   * @param {object} eventProperties - (optional) an object with string keys and values for the event properties.
   * @param {Amplitude~eventCallback} opt_callback - (optional) a callback function to run after the event is logged.
   * Note: the server response code and response body from the event upload are passed to the callback function.
   * @deprecated Please use amplitude.getInstance().logEvent(eventType, eventProperties, opt_callback);
   * @example amplitude.logEvent('Clicked Homepage Button', {'finished_flow': false, 'clicks': 15});
   */


  Amplitude.prototype.logEvent = function logEvent(eventType, eventProperties, opt_callback) {
    return this.getInstance().logEvent(eventType, eventProperties, opt_callback);
  };
  /**
   * Log an event with eventType, eventProperties, and groups. Use this to set event-level groups.
   *
   * Note: the group(s) set only apply for the specific event type being logged and does not persist on the user
   * (unless you explicitly set it with setGroup).
   *
   * See the [advanced topics article](https://developers.amplitude.com/docs/javascript#user-groups) for more information
   * about groups and Count by Distinct on the Amplitude platform.
   * @public
   * @param {string} eventType - name of event
   * @param {object} eventProperties - (optional) an object with string keys and values for the event properties.
   * @param {object} groups - (optional) an object with string groupType: groupName values for the event being logged.
   * groupName can be a string or an array of strings.
   * @param {Amplitude~eventCallback} opt_callback - (optional) a callback function to run after the event is logged.
   * Note: the server response code and response body from the event upload are passed to the callback function.
   * @deprecated Please use amplitude.getInstance().logEventWithGroups(eventType, eventProperties, groups, opt_callback);
   * @example amplitude.logEventWithGroups('Clicked Button', null, {'orgId': 24});
   */


  Amplitude.prototype.logEventWithGroups = function (eventType, eventProperties, groups, opt_callback) {
    return this.getInstance().logEventWithGroups(eventType, eventProperties, groups, opt_callback);
  };
  /**
   * Log revenue with Revenue interface. The new revenue interface allows for more revenue fields like
   * revenueType and event properties.
   *
   * See the [Revenue](https://amplitude.github.io/Amplitude-JavaScript/Revenue/)
   * reference page for more information on the Revenue interface and logging revenue.
   * @public
   * @param {Revenue} revenue_obj - the revenue object containing the revenue data being logged.
   * @deprecated Please use amplitude.getInstance().logRevenueV2(revenue_obj);
   * @example var revenue = new amplitude.Revenue().setProductId('productIdentifier').setPrice(10.99);
   * amplitude.logRevenueV2(revenue);
   */


  Amplitude.prototype.logRevenueV2 = function logRevenueV2(revenue_obj) {
    return this.getInstance().logRevenueV2(revenue_obj);
  };
  /**
   * Log revenue event with a price, quantity, and product identifier.
   * @public
   * @param {number} price - price of revenue event
   * @param {number} quantity - (optional) quantity of products in revenue event. If no quantity specified default to 1.
   * @param {string} product - (optional) product identifier
   * @deprecated Please use amplitude.getInstance().logRevenueV2(revenue_obj);
   * @example amplitude.logRevenue(3.99, 1, 'product_1234');
   */


  Amplitude.prototype.logRevenue = function logRevenue(price, quantity, product) {
    return this.getInstance().logRevenue(price, quantity, product);
  };
  /**
   * Remove events in storage with event ids up to and including maxEventId.
   * @private
   */


  Amplitude.prototype.removeEvents = function removeEvents(maxEventId, maxIdentifyId) {
    this.getInstance().removeEvents(maxEventId, maxIdentifyId);
  };
  /**
   * Send unsent events. Note: this is called automatically after events are logged if option batchEvents is false.
   * If batchEvents is true, then events are only sent when batch criterias are met.
   * @private
   * @param {Amplitude~eventCallback} callback - (optional) callback to run after events are sent.
   * Note the server response code and response body are passed to the callback as input arguments.
   */


  Amplitude.prototype.sendEvents = function sendEvents(callback) {
    this.getInstance().sendEvents(callback);
  };
  /**
   * Set global user properties.
   * @public
   * @deprecated Please use amplitudeClient.setUserProperties
   */


  Amplitude.prototype.setGlobalUserProperties = function setGlobalUserProperties(userProperties) {
    this.getInstance().setUserProperties(userProperties);
  };
}
/**
 * Get the current version of Amplitude's Javascript SDK.
 * @public
 * @returns {number} version number
 * @example var amplitudeVersion = amplitude.__VERSION__;
 */


Amplitude.prototype.__VERSION__ = version;

// Entry point
var old = typeof GlobalScope !== 'undefined' && GlobalScope.amplitude || {};
var newInstance = new Amplitude();
newInstance._q = old._q || [];
/**
 * Instantiates Amplitude object and runs all queued function logged by stubbed methods provided by snippets
 * Event queue allows async loading of SDK to not blocking client's app
 */

for (var instance$1 in old._iq) {
  // migrate each instance's queue
  if (Object.prototype.hasOwnProperty.call(old._iq, instance$1)) {
    newInstance.getInstance(instance$1)._q = old._iq[instance$1]._q || [];
  }
} // If SDK is enabled as snippet, process the events queued by stubbed function

/* harmony default export */ __webpack_exports__["a"] = (newInstance);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11), __webpack_require__(4).Buffer))

/***/ }),

/***/ 1321:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

/* eslint-disable strict */

;(function ($) {
  'use strict'

  /**
   * Add integers, wrapping at 2^32.
   * This uses 16-bit operations internally to work around bugs in interpreters.
   *
   * @param {number} x First integer
   * @param {number} y Second integer
   * @returns {number} Sum
   */
  function safeAdd(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   *
   * @param {number} num 32-bit number
   * @param {number} cnt Rotation count
   * @returns {number} Rotated number
   */
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} q q
   * @param {number} a a
   * @param {number} b b
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  /**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /**
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   *
   * @param {Array} x Array of little-endian words
   * @param {number} len Bit length
   * @returns {Array<number>} MD5 Array
   */
  function binlMD5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /**
   * Convert an array of little-endian words to a string
   *
   * @param {Array<number>} input MD5 Array
   * @returns {string} MD5 string
   */
  function binl2rstr(input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff)
    }
    return output
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   *
   * @param {string} input Raw input string
   * @returns {Array<number>} Array of little-endian words
   */
  function rstr2binl(input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32
    }
    return output
  }

  /**
   * Calculate the MD5 of a raw string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /**
   * Calculates the HMAC-MD5 of a key and some data (raw strings)
   *
   * @param {string} key HMAC key
   * @param {string} data Raw input string
   * @returns {string} Raw MD5 string
   */
  function rstrHMACMD5(key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /**
   * Convert a raw string to a hex string
   *
   * @param {string} input Raw input string
   * @returns {string} Hex encoded string
   */
  function rstr2hex(input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
    }
    return output
  }

  /**
   * Encode a string as UTF-8
   *
   * @param {string} input Input string
   * @returns {string} UTF8 string
   */
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input))
  }

  /**
   * Encodes input string as raw MD5 string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  /**
   * Encodes input string as Hex encoded string
   *
   * @param {string} s Input string
   * @returns {string} Hex encoded string
   */
  function hexMD5(s) {
    return rstr2hex(rawMD5(s))
  }
  /**
   * Calculates the raw HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  /**
   * Calculates the Hex encoded HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  /**
   * Calculates MD5 value for a given string.
   * If a key is provided, calculates the HMAC-MD5 value.
   * Returns a Hex encoded string unless the raw argument is given.
   *
   * @param {string} string Input string
   * @param {string} [key] HMAC key
   * @param {boolean} [raw] Raw output switch
   * @returns {string} MD5 output
   */
  function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return md5
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {}
})(this)


/***/ }),

/***/ 1380:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(31);
var ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(1227);
var ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(1381);
var ___CSS_LOADER_URL_IMPORT_1___ = __webpack_require__(1382);
var ___CSS_LOADER_URL_IMPORT_2___ = __webpack_require__(1383);
var ___CSS_LOADER_URL_IMPORT_3___ = __webpack_require__(1384);
var ___CSS_LOADER_URL_IMPORT_4___ = __webpack_require__(1385);
exports = ___CSS_LOADER_API_IMPORT___(false);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_4___);
// Module
exports.push([module.i, "/*--------------------------------\n\nhermes-dashboard-icons Web Font - built using nucleoapp.com\nLicense - nucleoapp.com/license/\n\n-------------------------------- */\n@font-face {\n  font-family: 'NucleoIcons';\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format('embedded-opentype'), url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format('woff2'), url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format('woff'), url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format('truetype'), url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n\n/*------------------------\n    base class definition\n-------------------------*/\n.ni {\n  display: inline-block;\n  font: normal normal normal 14px/1 NucleoIcons;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/*------------------------\n  change icon size\n-------------------------*/\n.ni-lg {\n  font-size: 1.33333333em;\n  line-height: 0.75em;\n  vertical-align: -15%;\n}\n\n.ni-2x {\n  font-size: 2em;\n}\n\n.ni-3x {\n  font-size: 3em;\n}\n\n.ni-4x {\n  font-size: 4em;\n}\n\n.ni-5x {\n  font-size: 5em;\n}\n\n/*----------------------------------\n  add a square/circle background\n-----------------------------------*/\n.ni.square,\n.ni.circle {\n  padding: 0.33333333em;\n  vertical-align: -16%;\n  background-color: #eee;\n}\n\n.ni.circle {\n  border-radius: 50%;\n}\n\n/*------------------------\n  list icons\n-------------------------*/\n.ni-ul {\n  padding-left: 0;\n  margin-left: 2.14285714em;\n  list-style-type: none;\n}\n\n.ni-ul>li {\n  position: relative;\n}\n\n.ni-ul>li>.ni {\n  position: absolute;\n  left: -1.57142857em;\n  top: 0.14285714em;\n  text-align: center;\n}\n\n.ni-ul>li>.ni.lg {\n  top: 0;\n  left: -1.35714286em;\n}\n\n.ni-ul>li>.ni.circle,\n.ni-ul>li>.ni.square {\n  top: -0.19047619em;\n  left: -1.9047619em;\n}\n\n/*------------------------\n  spinning icons\n-------------------------*/\n.ni.spin {\n  -webkit-animation: nc-spin 2s infinite linear;\n  -moz-animation: nc-spin 2s infinite linear;\n  animation: nc-spin 2s infinite linear;\n}\n\n@-webkit-keyframes nc-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n  }\n\n  100% {\n    -webkit-transform: rotate(360deg);\n  }\n}\n\n@-moz-keyframes nc-spin {\n  0% {\n    -moz-transform: rotate(0deg);\n  }\n\n  100% {\n    -moz-transform: rotate(360deg);\n  }\n}\n\n@keyframes nc-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n\n  100% {\n    -webkit-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -ms-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n/*------------------------\n  rotated/flipped icons\n-------------------------*/\n.ni.rotate-90 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\n  -webkit-transform: rotate(90deg);\n  -moz-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  -o-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n\n.ni.rotate-180 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: rotate(180deg);\n  -moz-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  -o-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n\n.ni.rotate-270 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\n  -webkit-transform: rotate(270deg);\n  -moz-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  -o-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n\n.ni.flip-y {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=0);\n  -webkit-transform: scale(-1, 1);\n  -moz-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  -o-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n\n.ni.flip-x {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: scale(1, -1);\n  -moz-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  -o-transform: scale(1, -1);\n  transform: scale(1, -1);\n}\n\n/*------------------------\n    font icons\n-------------------------*/\n\n.ni-active-40::before {\n  content: \"\\ea02\";\n}\n\n.ni-air-baloon::before {\n  content: \"\\ea03\";\n}\n\n.ni-album-2::before {\n  content: \"\\ea04\";\n}\n\n.ni-align-center::before {\n  content: \"\\ea05\";\n}\n\n.ni-align-left-2::before {\n  content: \"\\ea06\";\n}\n\n.ni-ambulance::before {\n  content: \"\\ea07\";\n}\n\n.ni-app::before {\n  content: \"\\ea08\";\n}\n\n.ni-archive-2::before {\n  content: \"\\ea09\";\n}\n\n.ni-atom::before {\n  content: \"\\ea0a\";\n}\n\n.ni-badge::before {\n  content: \"\\ea0b\";\n}\n\n.ni-bag-17::before {\n  content: \"\\ea0c\";\n}\n\n.ni-basket::before {\n  content: \"\\ea0d\";\n}\n\n.ni-bell-55::before {\n  content: \"\\ea0e\";\n}\n\n.ni-bold-down::before {\n  content: \"\\ea0f\";\n}\n\n.ni-bold-left::before {\n  content: \"\\ea10\";\n}\n\n.ni-bold-right::before {\n  content: \"\\ea11\";\n}\n\n.ni-bold-up::before {\n  content: \"\\ea12\";\n}\n\n.ni-bold::before {\n  content: \"\\ea13\";\n}\n\n.ni-book-bookmark::before {\n  content: \"\\ea14\";\n}\n\n.ni-books::before {\n  content: \"\\ea15\";\n}\n\n.ni-box-2::before {\n  content: \"\\ea16\";\n}\n\n.ni-briefcase-24::before {\n  content: \"\\ea17\";\n}\n\n.ni-building::before {\n  content: \"\\ea18\";\n}\n\n.ni-bulb-61::before {\n  content: \"\\ea19\";\n}\n\n.ni-bullet-list-67::before {\n  content: \"\\ea1a\";\n}\n\n.ni-bus-front-12::before {\n  content: \"\\ea1b\";\n}\n\n.ni-button-pause::before {\n  content: \"\\ea1c\";\n}\n\n.ni-button-play::before {\n  content: \"\\ea1d\";\n}\n\n.ni-button-power::before {\n  content: \"\\ea1e\";\n}\n\n.ni-calendar-grid-58::before {\n  content: \"\\ea1f\";\n}\n\n.ni-camera-compact::before {\n  content: \"\\ea20\";\n}\n\n.ni-caps-small::before {\n  content: \"\\ea21\";\n}\n\n.ni-cart::before {\n  content: \"\\ea22\";\n}\n\n.ni-chart-bar-32::before {\n  content: \"\\ea23\";\n}\n\n.ni-chart-pie-35::before {\n  content: \"\\ea24\";\n}\n\n.ni-chat-round::before {\n  content: \"\\ea25\";\n}\n\n.ni-check-bold::before {\n  content: \"\\ea26\";\n}\n\n.ni-circle-08::before {\n  content: \"\\ea27\";\n}\n\n.ni-cloud-download-95::before {\n  content: \"\\ea28\";\n}\n\n.ni-cloud-upload-96::before {\n  content: \"\\ea29\";\n}\n\n.ni-compass-04::before {\n  content: \"\\ea2a\";\n}\n\n.ni-controller::before {\n  content: \"\\ea2b\";\n}\n\n.ni-credit-card::before {\n  content: \"\\ea2c\";\n}\n\n.ni-curved-next::before {\n  content: \"\\ea2d\";\n}\n\n.ni-delivery-fast::before {\n  content: \"\\ea2e\";\n}\n\n.ni-diamond::before {\n  content: \"\\ea2f\";\n}\n\n.ni-email-83::before {\n  content: \"\\ea30\";\n}\n\n.ni-fat-add::before {\n  content: \"\\ea31\";\n}\n\n.ni-fat-delete::before {\n  content: \"\\ea32\";\n}\n\n.ni-fat-remove::before {\n  content: \"\\ea33\";\n}\n\n.ni-favourite-28::before {\n  content: \"\\ea34\";\n}\n\n.ni-folder-17::before {\n  content: \"\\ea35\";\n}\n\n.ni-glasses-2::before {\n  content: \"\\ea36\";\n}\n\n.ni-hat-3::before {\n  content: \"\\ea37\";\n}\n\n.ni-headphones::before {\n  content: \"\\ea38\";\n}\n\n.ni-html5::before {\n  content: \"\\ea39\";\n}\n\n.ni-istanbul::before {\n  content: \"\\ea3a\";\n}\n\n.ni-key-25::before {\n  content: \"\\ea3b\";\n}\n\n.ni-laptop::before {\n  content: \"\\ea3c\";\n}\n\n.ni-like-2::before {\n  content: \"\\ea3d\";\n}\n\n.ni-lock-circle-open::before {\n  content: \"\\ea3e\";\n}\n\n.ni-map-big::before {\n  content: \"\\ea3f\";\n}\n\n.ni-mobile-button::before {\n  content: \"\\ea40\";\n}\n\n.ni-money-coins::before {\n  content: \"\\ea41\";\n}\n\n.ni-note-03::before {\n  content: \"\\ea42\";\n}\n\n.ni-notification-70::before {\n  content: \"\\ea43\";\n}\n\n.ni-palette::before {\n  content: \"\\ea44\";\n}\n\n.ni-paper-diploma::before {\n  content: \"\\ea45\";\n}\n\n.ni-pin-3::before {\n  content: \"\\ea46\";\n}\n\n.ni-planet::before {\n  content: \"\\ea47\";\n}\n\n.ni-ruler-pencil::before {\n  content: \"\\ea48\";\n}\n\n.ni-satisfied::before {\n  content: \"\\ea49\";\n}\n\n.ni-scissors::before {\n  content: \"\\ea4a\";\n}\n\n.ni-send::before {\n  content: \"\\ea4b\";\n}\n\n.ni-settings-gear-65::before {\n  content: \"\\ea4c\";\n}\n\n.ni-settings::before {\n  content: \"\\ea4d\";\n}\n\n.ni-single-02::before {\n  content: \"\\ea4e\";\n}\n\n.ni-single-copy-04::before {\n  content: \"\\ea4f\";\n}\n\n.ni-sound-wave::before {\n  content: \"\\ea50\";\n}\n\n.ni-spaceship::before {\n  content: \"\\ea51\";\n}\n\n.ni-square-pin::before {\n  content: \"\\ea52\";\n}\n\n.ni-support-16::before {\n  content: \"\\ea53\";\n}\n\n.ni-tablet-button::before {\n  content: \"\\ea54\";\n}\n\n.ni-tag::before {\n  content: \"\\ea55\";\n}\n\n.ni-tie-bow::before {\n  content: \"\\ea56\";\n}\n\n.ni-time-alarm::before {\n  content: \"\\ea57\";\n}\n\n.ni-trophy::before {\n  content: \"\\ea58\";\n}\n\n.ni-tv-2::before {\n  content: \"\\ea59\";\n}\n\n.ni-umbrella-13::before {\n  content: \"\\ea5a\";\n}\n\n.ni-user-run::before {\n  content: \"\\ea5b\";\n}\n\n.ni-vector::before {\n  content: \"\\ea5c\";\n}\n\n.ni-watch-time::before {\n  content: \"\\ea5d\";\n}\n\n.ni-world::before {\n  content: \"\\ea5e\";\n}\n\n.ni-zoom-split-in::before {\n  content: \"\\ea5f\";\n}\n\n.ni-collection::before {\n  content: \"\\ea60\";\n}\n\n.ni-image::before {\n  content: \"\\ea61\";\n}\n\n.ni-shop::before {\n  content: \"\\ea62\";\n}\n\n.ni-ungroup::before {\n  content: \"\\ea63\";\n}\n\n.ni-world-2::before {\n  content: \"\\ea64\";\n}\n\n.ni-ui-04::before {\n  content: \"\\ea65\";\n}\n\n\n/* all icon font classes list here */", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 1381:
/***/ (function(module, exports) {

module.exports = "assets/nucleo-icons.eot";

/***/ }),

/***/ 1382:
/***/ (function(module, exports) {

module.exports = "assets/nucleo-icons.woff2";

/***/ }),

/***/ 1383:
/***/ (function(module, exports) {

module.exports = "assets/nucleo-icons.woff";

/***/ }),

/***/ 1384:
/***/ (function(module, exports) {

module.exports = "assets/nucleo-icons.ttf";

/***/ }),

/***/ 1385:
/***/ (function(module, exports) {

module.exports = "assets/nucleo-icons.svg";

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;


/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inherits = __webpack_require__(18);
const Reporter = __webpack_require__(303).Reporter;
const Buffer = __webpack_require__(301).Buffer;

function DecoderBuffer(base, options) {
  Reporter.call(this, options);
  if (!Buffer.isBuffer(base)) {
    this.error('Input not Buffer');
    return;
  }

  this.base = base;
  this.offset = 0;
  this.length = base.length;
}
inherits(DecoderBuffer, Reporter);
exports.DecoderBuffer = DecoderBuffer;

DecoderBuffer.isDecoderBuffer = function isDecoderBuffer(data) {
  if (data instanceof DecoderBuffer) {
    return true;
  }

  // Or accept compatible API
  const isCompatible = typeof data === 'object' &&
    Buffer.isBuffer(data.base) &&
    data.constructor.name === 'DecoderBuffer' &&
    typeof data.offset === 'number' &&
    typeof data.length === 'number' &&
    typeof data.save === 'function' &&
    typeof data.restore === 'function' &&
    typeof data.isEmpty === 'function' &&
    typeof data.readUInt8 === 'function' &&
    typeof data.skip === 'function' &&
    typeof data.raw === 'function';

  return isCompatible;
};

DecoderBuffer.prototype.save = function save() {
  return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
};

DecoderBuffer.prototype.restore = function restore(save) {
  // Return skipped data
  const res = new DecoderBuffer(this.base);
  res.offset = save.offset;
  res.length = this.offset;

  this.offset = save.offset;
  Reporter.prototype.restore.call(this, save.reporter);

  return res;
};

DecoderBuffer.prototype.isEmpty = function isEmpty() {
  return this.offset === this.length;
};

DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
  if (this.offset + 1 <= this.length)
    return this.base.readUInt8(this.offset++, true);
  else
    return this.error(fail || 'DecoderBuffer overrun');
};

DecoderBuffer.prototype.skip = function skip(bytes, fail) {
  if (!(this.offset + bytes <= this.length))
    return this.error(fail || 'DecoderBuffer overrun');

  const res = new DecoderBuffer(this.base);

  // Share reporter state
  res._reporterState = this._reporterState;

  res.offset = this.offset;
  res.length = this.offset + bytes;
  this.offset += bytes;
  return res;
};

DecoderBuffer.prototype.raw = function raw(save) {
  return this.base.slice(save ? save.offset : this.offset, this.length);
};

function EncoderBuffer(value, reporter) {
  if (Array.isArray(value)) {
    this.length = 0;
    this.value = value.map(function(item) {
      if (!EncoderBuffer.isEncoderBuffer(item))
        item = new EncoderBuffer(item, reporter);
      this.length += item.length;
      return item;
    }, this);
  } else if (typeof value === 'number') {
    if (!(0 <= value && value <= 0xff))
      return reporter.error('non-byte EncoderBuffer value');
    this.value = value;
    this.length = 1;
  } else if (typeof value === 'string') {
    this.value = value;
    this.length = Buffer.byteLength(value);
  } else if (Buffer.isBuffer(value)) {
    this.value = value;
    this.length = value.length;
  } else {
    return reporter.error('Unsupported type: ' + typeof value);
  }
}
exports.EncoderBuffer = EncoderBuffer;

EncoderBuffer.isEncoderBuffer = function isEncoderBuffer(data) {
  if (data instanceof EncoderBuffer) {
    return true;
  }

  // Or accept compatible API
  const isCompatible = typeof data === 'object' &&
    data.constructor.name === 'EncoderBuffer' &&
    typeof data.length === 'number' &&
    typeof data.join === 'function';

  return isCompatible;
};

EncoderBuffer.prototype.join = function join(out, offset) {
  if (!out)
    out = Buffer.alloc(this.length);
  if (!offset)
    offset = 0;

  if (this.length === 0)
    return out;

  if (Array.isArray(this.value)) {
    this.value.forEach(function(item) {
      item.join(out, offset);
      offset += item.length;
    });
  } else {
    if (typeof this.value === 'number')
      out[offset] = this.value;
    else if (typeof this.value === 'string')
      out.write(this.value, offset);
    else if (Buffer.isBuffer(this.value))
      this.value.copy(out, offset);
    offset += this.length;
  }

  return out;
};


/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
(function(root) {
    "use strict";

    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    function createArray(length) {
        return new Uint8Array(length);
    }

    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
            if (sourceArray.slice) {
                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
            } else {
                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
            }
        }
        targetArray.set(sourceArray, targetStart);
    }



    var convertUtf8 = (function() {
        function toBytes(text) {
            var result = [], i = 0;
            text = encodeURI(text);
            while (i < text.length) {
                var c = text.charCodeAt(i++);

                // if it is a % sign, encode the following 2 bytes as a hex value
                if (c === 37) {
                    result.push(parseInt(text.substr(i, 2), 16))
                    i += 2;

                // otherwise, just the actual byte
                } else {
                    result.push(c)
                }
            }

            return coerceArray(result);
        }

        function fromBytes(bytes) {
            var result = [], i = 0;

            while (i < bytes.length) {
                var c = bytes[i];

                if (c < 128) {
                    result.push(String.fromCharCode(c));
                    i++;
                } else if (c > 191 && c < 224) {
                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
                    i += 2;
                } else {
                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
                    i += 3;
                }
            }

            return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();

    var convertHex = (function() {
        function toBytes(text) {
            var result = [];
            for (var i = 0; i < text.length; i += 2) {
                result.push(parseInt(text.substr(i, 2), 16));
            }

            return result;
        }

        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
        var Hex = '0123456789abcdef';

        function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
                }
                return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();


    // Number of rounds by keysize
    var numberOfRounds = {16: 10, 24: 12, 32: 14}

    // Round constant words
    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    // S-box and Inverse S-box (S is for Substitution)
    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    // Transformations for encryption
    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    // Transformations for decryption
    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    // Transformations for decryption key expansion
    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
            result.push(
                (bytes[i    ] << 24) |
                (bytes[i + 1] << 16) |
                (bytes[i + 2] <<  8) |
                 bytes[i + 3]
            );
        }
        return result;
    }

    var AES = function(key) {
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }

        Object.defineProperty(this, 'key', {
            value: coerceArray(key, true)
        });

        this._prepare();
    }


    AES.prototype._prepare = function() {

        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
        }

        // encryption round keys
        this._Ke = [];

        // decryption round keys
        this._Kd = [];

        for (var i = 0; i <= rounds; i++) {
            this._Ke.push([0, 0, 0, 0]);
            this._Kd.push([0, 0, 0, 0]);
        }

        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;

        // convert the key into ints
        var tk = convertToInt32(this.key);

        // copy values into round key arrays
        var index;
        for (var i = 0; i < KC; i++) {
            index = i >> 2;
            this._Ke[index][i % 4] = tk[i];
            this._Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                      (S[(tt >>  8) & 0xFF] << 16) ^
                      (S[ tt        & 0xFF] <<  8) ^
                       S[(tt >> 24) & 0xFF]        ^
                      (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (var i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

            // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (var i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
                              (S[(tt >>  8) & 0xFF] <<  8) ^
                              (S[(tt >> 16) & 0xFF] << 16) ^
                              (S[(tt >> 24) & 0xFF] << 24));

                for (var i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            var i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this._Ke[r][c] = tk[i];
                this._Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (var r = 1; r < rounds; r++) {
            for (var c = 0; c < 4; c++) {
                tt = this._Kd[r][c];
                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
                                  U2[(tt >> 16) & 0xFF] ^
                                  U3[(tt >>  8) & 0xFF] ^
                                  U4[ tt        & 0xFF]);
            }
        }
    }

    AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Ke[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T4[ t[(i + 3) % 4]        & 0xff] ^
                        this._Ke[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Ke[rounds][i];
            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }

    AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Kd[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T8[ t[(i + 1) % 4]        & 0xff] ^
                        this._Kd[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Kd[rounds][i];
            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }


    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);
            block = this._aes.encrypt(block);
            copyArray(block, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);
            copyArray(block, plaintext, i);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Block Chaining";
        this.name = "cbc";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastCipherblock = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (var j = 0; j < 16; j++) {
                block[j] ^= this._lastCipherblock[j];
            }

            this._lastCipherblock = this._aes.encrypt(block);
            copyArray(this._lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);

            for (var j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
            }

            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Feedback";
        this.name = "cfb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 size)');
        }

        if (!segmentSize) { segmentSize = 1; }

        this.segmentSize = segmentSize;

        this._shiftRegister = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if ((plaintext.length % this.segmentSize) != 0) {
            throw new Error('invalid plaintext size (must be segmentSize bytes)');
        }

        var encrypted = coerceArray(plaintext, true);

        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return encrypted;
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if ((ciphertext.length % this.segmentSize) != 0) {
            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
        }

        var plaintext = coerceArray(ciphertext, true);

        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return plaintext;
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Output Feedback";
        this.name = "ofb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
            throw Error('Counter must be instanitated with `new`');
        }

        // We allow 0, but anything false-ish uses the default 1
        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = createArray(16);
            this.setValue(initialValue);

        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number' || parseInt(value) != value) {
            throw new Error('invalid counter value (must be an integer)');
        }

        // We cannot safely handle numbers beyond the safe range for integers
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('integer value out of safe range');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = parseInt(value / 256);
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this._counter = bytes;
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            if (this._counter[i] === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i]++;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Counter";
        this.name = "ctr";

        if (!(counter instanceof Counter)) {
            counter = new Counter(counter)
        }

        this._counter = counter;

        this._remainingCounter = null;
        this._remainingCounterIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._remainingCounterIndex === 16) {
                this._remainingCounter = this._aes.encrypt(this._counter._counter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    ///////////////////////
    // Padding

    // See:https://tools.ietf.org/html/rfc2315
    function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - (data.length % 16);
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
            result[i] = padder;
        }
        return result;
    }

    function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

        var padder = data[data.length - 1];
        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
            if (data[length + i] !== padder) {
                throw new Error('PKCS#7 invalid padding byte');
            }
        }

        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
    }

    ///////////////////////
    // Exporting


    // The block cipher
    var aesjs = {
        AES: AES,
        Counter: Counter,

        ModeOfOperation: {
            ecb: ModeOfOperationECB,
            cbc: ModeOfOperationCBC,
            cfb: ModeOfOperationCFB,
            ofb: ModeOfOperationOFB,
            ctr: ModeOfOperationCTR
        },

        utils: {
            hex: convertHex,
            utf8: convertUtf8
        },

        padding: {
            pkcs7: {
                pad: pkcs7pad,
                strip: pkcs7strip
            }
        },

        _arrayTest: {
            coerceArray: coerceArray,
            createArray: createArray,
            copyArray: copyArray,
        }
    };


    // node.js
    if (true) {
        module.exports = aesjs

    // RequireJS/AMD
    // http://www.requirejs.org/docs/api.html
    // https://github.com/amdjs/amdjs-api/wiki/AMD
    } else {}


})(this);


/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(151);
var utils = __webpack_require__(45);

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;


/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(852);
var combineURLs = __webpack_require__(853);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var objectAssign = __webpack_require__(166);

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(115);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),

/***/ 302:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Reporter = __webpack_require__(303).Reporter;
const EncoderBuffer = __webpack_require__(180).EncoderBuffer;
const DecoderBuffer = __webpack_require__(180).DecoderBuffer;
const assert = __webpack_require__(78);

// Supported tags
const tags = [
  'seq', 'seqof', 'set', 'setof', 'objid', 'bool',
  'gentime', 'utctime', 'null_', 'enum', 'int', 'objDesc',
  'bitstr', 'bmpstr', 'charstr', 'genstr', 'graphstr', 'ia5str', 'iso646str',
  'numstr', 'octstr', 'printstr', 't61str', 'unistr', 'utf8str', 'videostr'
];

// Public methods list
const methods = [
  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
  'any', 'contains'
].concat(tags);

// Overrided methods list
const overrided = [
  '_peekTag', '_decodeTag', '_use',
  '_decodeStr', '_decodeObjid', '_decodeTime',
  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
  '_encodeNull', '_encodeInt', '_encodeBool'
];

function Node(enc, parent, name) {
  const state = {};
  this._baseState = state;

  state.name = name;
  state.enc = enc;

  state.parent = parent || null;
  state.children = null;

  // State
  state.tag = null;
  state.args = null;
  state.reverseArgs = null;
  state.choice = null;
  state.optional = false;
  state.any = false;
  state.obj = false;
  state.use = null;
  state.useDecoder = null;
  state.key = null;
  state['default'] = null;
  state.explicit = null;
  state.implicit = null;
  state.contains = null;

  // Should create new instance on each method
  if (!state.parent) {
    state.children = [];
    this._wrap();
  }
}
module.exports = Node;

const stateProps = [
  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
  'implicit', 'contains'
];

Node.prototype.clone = function clone() {
  const state = this._baseState;
  const cstate = {};
  stateProps.forEach(function(prop) {
    cstate[prop] = state[prop];
  });
  const res = new this.constructor(cstate.parent);
  res._baseState = cstate;
  return res;
};

Node.prototype._wrap = function wrap() {
  const state = this._baseState;
  methods.forEach(function(method) {
    this[method] = function _wrappedMethod() {
      const clone = new this.constructor(this);
      state.children.push(clone);
      return clone[method].apply(clone, arguments);
    };
  }, this);
};

Node.prototype._init = function init(body) {
  const state = this._baseState;

  assert(state.parent === null);
  body.call(this);

  // Filter children
  state.children = state.children.filter(function(child) {
    return child._baseState.parent === this;
  }, this);
  assert.equal(state.children.length, 1, 'Root node can have only one child');
};

Node.prototype._useArgs = function useArgs(args) {
  const state = this._baseState;

  // Filter children and args
  const children = args.filter(function(arg) {
    return arg instanceof this.constructor;
  }, this);
  args = args.filter(function(arg) {
    return !(arg instanceof this.constructor);
  }, this);

  if (children.length !== 0) {
    assert(state.children === null);
    state.children = children;

    // Replace parent to maintain backward link
    children.forEach(function(child) {
      child._baseState.parent = this;
    }, this);
  }
  if (args.length !== 0) {
    assert(state.args === null);
    state.args = args;
    state.reverseArgs = args.map(function(arg) {
      if (typeof arg !== 'object' || arg.constructor !== Object)
        return arg;

      const res = {};
      Object.keys(arg).forEach(function(key) {
        if (key == (key | 0))
          key |= 0;
        const value = arg[key];
        res[value] = key;
      });
      return res;
    });
  }
};

//
// Overrided methods
//

overrided.forEach(function(method) {
  Node.prototype[method] = function _overrided() {
    const state = this._baseState;
    throw new Error(method + ' not implemented for encoding: ' + state.enc);
  };
});

//
// Public methods
//

tags.forEach(function(tag) {
  Node.prototype[tag] = function _tagMethod() {
    const state = this._baseState;
    const args = Array.prototype.slice.call(arguments);

    assert(state.tag === null);
    state.tag = tag;

    this._useArgs(args);

    return this;
  };
});

Node.prototype.use = function use(item) {
  assert(item);
  const state = this._baseState;

  assert(state.use === null);
  state.use = item;

  return this;
};

Node.prototype.optional = function optional() {
  const state = this._baseState;

  state.optional = true;

  return this;
};

Node.prototype.def = function def(val) {
  const state = this._baseState;

  assert(state['default'] === null);
  state['default'] = val;
  state.optional = true;

  return this;
};

Node.prototype.explicit = function explicit(num) {
  const state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.explicit = num;

  return this;
};

Node.prototype.implicit = function implicit(num) {
  const state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.implicit = num;

  return this;
};

Node.prototype.obj = function obj() {
  const state = this._baseState;
  const args = Array.prototype.slice.call(arguments);

  state.obj = true;

  if (args.length !== 0)
    this._useArgs(args);

  return this;
};

Node.prototype.key = function key(newKey) {
  const state = this._baseState;

  assert(state.key === null);
  state.key = newKey;

  return this;
};

Node.prototype.any = function any() {
  const state = this._baseState;

  state.any = true;

  return this;
};

Node.prototype.choice = function choice(obj) {
  const state = this._baseState;

  assert(state.choice === null);
  state.choice = obj;
  this._useArgs(Object.keys(obj).map(function(key) {
    return obj[key];
  }));

  return this;
};

Node.prototype.contains = function contains(item) {
  const state = this._baseState;

  assert(state.use === null);
  state.contains = item;

  return this;
};

//
// Decoding
//

Node.prototype._decode = function decode(input, options) {
  const state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return input.wrapResult(state.children[0]._decode(input, options));

  let result = state['default'];
  let present = true;

  let prevKey = null;
  if (state.key !== null)
    prevKey = input.enterKey(state.key);

  // Check if tag is there
  if (state.optional) {
    let tag = null;
    if (state.explicit !== null)
      tag = state.explicit;
    else if (state.implicit !== null)
      tag = state.implicit;
    else if (state.tag !== null)
      tag = state.tag;

    if (tag === null && !state.any) {
      // Trial and Error
      const save = input.save();
      try {
        if (state.choice === null)
          this._decodeGeneric(state.tag, input, options);
        else
          this._decodeChoice(input, options);
        present = true;
      } catch (e) {
        present = false;
      }
      input.restore(save);
    } else {
      present = this._peekTag(input, tag, state.any);

      if (input.isError(present))
        return present;
    }
  }

  // Push object on stack
  let prevObj;
  if (state.obj && present)
    prevObj = input.enterObject();

  if (present) {
    // Unwrap explicit values
    if (state.explicit !== null) {
      const explicit = this._decodeTag(input, state.explicit);
      if (input.isError(explicit))
        return explicit;
      input = explicit;
    }

    const start = input.offset;

    // Unwrap implicit and normal values
    if (state.use === null && state.choice === null) {
      let save;
      if (state.any)
        save = input.save();
      const body = this._decodeTag(
        input,
        state.implicit !== null ? state.implicit : state.tag,
        state.any
      );
      if (input.isError(body))
        return body;

      if (state.any)
        result = input.raw(save);
      else
        input = body;
    }

    if (options && options.track && state.tag !== null)
      options.track(input.path(), start, input.length, 'tagged');

    if (options && options.track && state.tag !== null)
      options.track(input.path(), input.offset, input.length, 'content');

    // Select proper method for tag
    if (state.any) {
      // no-op
    } else if (state.choice === null) {
      result = this._decodeGeneric(state.tag, input, options);
    } else {
      result = this._decodeChoice(input, options);
    }

    if (input.isError(result))
      return result;

    // Decode children
    if (!state.any && state.choice === null && state.children !== null) {
      state.children.forEach(function decodeChildren(child) {
        // NOTE: We are ignoring errors here, to let parser continue with other
        // parts of encoded data
        child._decode(input, options);
      });
    }

    // Decode contained/encoded by schema, only in bit or octet strings
    if (state.contains && (state.tag === 'octstr' || state.tag === 'bitstr')) {
      const data = new DecoderBuffer(result);
      result = this._getUse(state.contains, input._reporterState.obj)
        ._decode(data, options);
    }
  }

  // Pop object
  if (state.obj && present)
    result = input.leaveObject(prevObj);

  // Set key
  if (state.key !== null && (result !== null || present === true))
    input.leaveKey(prevKey, state.key, result);
  else if (prevKey !== null)
    input.exitKey(prevKey);

  return result;
};

Node.prototype._decodeGeneric = function decodeGeneric(tag, input, options) {
  const state = this._baseState;

  if (tag === 'seq' || tag === 'set')
    return null;
  if (tag === 'seqof' || tag === 'setof')
    return this._decodeList(input, tag, state.args[0], options);
  else if (/str$/.test(tag))
    return this._decodeStr(input, tag, options);
  else if (tag === 'objid' && state.args)
    return this._decodeObjid(input, state.args[0], state.args[1], options);
  else if (tag === 'objid')
    return this._decodeObjid(input, null, null, options);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._decodeTime(input, tag, options);
  else if (tag === 'null_')
    return this._decodeNull(input, options);
  else if (tag === 'bool')
    return this._decodeBool(input, options);
  else if (tag === 'objDesc')
    return this._decodeStr(input, tag, options);
  else if (tag === 'int' || tag === 'enum')
    return this._decodeInt(input, state.args && state.args[0], options);

  if (state.use !== null) {
    return this._getUse(state.use, input._reporterState.obj)
      ._decode(input, options);
  } else {
    return input.error('unknown tag: ' + tag);
  }
};

Node.prototype._getUse = function _getUse(entity, obj) {

  const state = this._baseState;
  // Create altered use decoder if implicit is set
  state.useDecoder = this._use(entity, obj);
  assert(state.useDecoder._baseState.parent === null);
  state.useDecoder = state.useDecoder._baseState.children[0];
  if (state.implicit !== state.useDecoder._baseState.implicit) {
    state.useDecoder = state.useDecoder.clone();
    state.useDecoder._baseState.implicit = state.implicit;
  }
  return state.useDecoder;
};

Node.prototype._decodeChoice = function decodeChoice(input, options) {
  const state = this._baseState;
  let result = null;
  let match = false;

  Object.keys(state.choice).some(function(key) {
    const save = input.save();
    const node = state.choice[key];
    try {
      const value = node._decode(input, options);
      if (input.isError(value))
        return false;

      result = { type: key, value: value };
      match = true;
    } catch (e) {
      input.restore(save);
      return false;
    }
    return true;
  }, this);

  if (!match)
    return input.error('Choice not matched');

  return result;
};

//
// Encoding
//

Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
  return new EncoderBuffer(data, this.reporter);
};

Node.prototype._encode = function encode(data, reporter, parent) {
  const state = this._baseState;
  if (state['default'] !== null && state['default'] === data)
    return;

  const result = this._encodeValue(data, reporter, parent);
  if (result === undefined)
    return;

  if (this._skipDefault(result, reporter, parent))
    return;

  return result;
};

Node.prototype._encodeValue = function encode(data, reporter, parent) {
  const state = this._baseState;

  // Decode root node
  if (state.parent === null)
    return state.children[0]._encode(data, reporter || new Reporter());

  let result = null;

  // Set reporter to share it with a child class
  this.reporter = reporter;

  // Check if data is there
  if (state.optional && data === undefined) {
    if (state['default'] !== null)
      data = state['default'];
    else
      return;
  }

  // Encode children first
  let content = null;
  let primitive = false;
  if (state.any) {
    // Anything that was given is translated to buffer
    result = this._createEncoderBuffer(data);
  } else if (state.choice) {
    result = this._encodeChoice(data, reporter);
  } else if (state.contains) {
    content = this._getUse(state.contains, parent)._encode(data, reporter);
    primitive = true;
  } else if (state.children) {
    content = state.children.map(function(child) {
      if (child._baseState.tag === 'null_')
        return child._encode(null, reporter, data);

      if (child._baseState.key === null)
        return reporter.error('Child should have a key');
      const prevKey = reporter.enterKey(child._baseState.key);

      if (typeof data !== 'object')
        return reporter.error('Child expected, but input is not object');

      const res = child._encode(data[child._baseState.key], reporter, data);
      reporter.leaveKey(prevKey);

      return res;
    }, this).filter(function(child) {
      return child;
    });
    content = this._createEncoderBuffer(content);
  } else {
    if (state.tag === 'seqof' || state.tag === 'setof') {
      // TODO(indutny): this should be thrown on DSL level
      if (!(state.args && state.args.length === 1))
        return reporter.error('Too many args for : ' + state.tag);

      if (!Array.isArray(data))
        return reporter.error('seqof/setof, but data is not Array');

      const child = this.clone();
      child._baseState.implicit = null;
      content = this._createEncoderBuffer(data.map(function(item) {
        const state = this._baseState;

        return this._getUse(state.args[0], data)._encode(item, reporter);
      }, child));
    } else if (state.use !== null) {
      result = this._getUse(state.use, parent)._encode(data, reporter);
    } else {
      content = this._encodePrimitive(state.tag, data);
      primitive = true;
    }
  }

  // Encode data itself
  if (!state.any && state.choice === null) {
    const tag = state.implicit !== null ? state.implicit : state.tag;
    const cls = state.implicit === null ? 'universal' : 'context';

    if (tag === null) {
      if (state.use === null)
        reporter.error('Tag could be omitted only for .use()');
    } else {
      if (state.use === null)
        result = this._encodeComposite(tag, primitive, cls, content);
    }
  }

  // Wrap in explicit
  if (state.explicit !== null)
    result = this._encodeComposite(state.explicit, false, 'context', result);

  return result;
};

Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
  const state = this._baseState;

  const node = state.choice[data.type];
  if (!node) {
    assert(
      false,
      data.type + ' not found in ' +
            JSON.stringify(Object.keys(state.choice)));
  }
  return node._encode(data.value, reporter);
};

Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
  const state = this._baseState;

  if (/str$/.test(tag))
    return this._encodeStr(data, tag);
  else if (tag === 'objid' && state.args)
    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
  else if (tag === 'objid')
    return this._encodeObjid(data, null, null);
  else if (tag === 'gentime' || tag === 'utctime')
    return this._encodeTime(data, tag);
  else if (tag === 'null_')
    return this._encodeNull();
  else if (tag === 'int' || tag === 'enum')
    return this._encodeInt(data, state.args && state.reverseArgs[0]);
  else if (tag === 'bool')
    return this._encodeBool(data);
  else if (tag === 'objDesc')
    return this._encodeStr(data, tag);
  else
    throw new Error('Unsupported tag: ' + tag);
};

Node.prototype._isNumstr = function isNumstr(str) {
  return /^[0-9 ]*$/.test(str);
};

Node.prototype._isPrintstr = function isPrintstr(str) {
  return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(str);
};


/***/ }),

/***/ 303:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inherits = __webpack_require__(18);

function Reporter(options) {
  this._reporterState = {
    obj: null,
    path: [],
    options: options || {},
    errors: []
  };
}
exports.Reporter = Reporter;

Reporter.prototype.isError = function isError(obj) {
  return obj instanceof ReporterError;
};

Reporter.prototype.save = function save() {
  const state = this._reporterState;

  return { obj: state.obj, pathLen: state.path.length };
};

Reporter.prototype.restore = function restore(data) {
  const state = this._reporterState;

  state.obj = data.obj;
  state.path = state.path.slice(0, data.pathLen);
};

Reporter.prototype.enterKey = function enterKey(key) {
  return this._reporterState.path.push(key);
};

Reporter.prototype.exitKey = function exitKey(index) {
  const state = this._reporterState;

  state.path = state.path.slice(0, index - 1);
};

Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
  const state = this._reporterState;

  this.exitKey(index);
  if (state.obj !== null)
    state.obj[key] = value;
};

Reporter.prototype.path = function path() {
  return this._reporterState.path.join('/');
};

Reporter.prototype.enterObject = function enterObject() {
  const state = this._reporterState;

  const prev = state.obj;
  state.obj = {};
  return prev;
};

Reporter.prototype.leaveObject = function leaveObject(prev) {
  const state = this._reporterState;

  const now = state.obj;
  state.obj = prev;
  return now;
};

Reporter.prototype.error = function error(msg) {
  let err;
  const state = this._reporterState;

  const inherited = msg instanceof ReporterError;
  if (inherited) {
    err = msg;
  } else {
    err = new ReporterError(state.path.map(function(elem) {
      return '[' + JSON.stringify(elem) + ']';
    }).join(''), msg.message || msg, msg.stack);
  }

  if (!state.options.partial)
    throw err;

  if (!inherited)
    state.errors.push(err);

  return err;
};

Reporter.prototype.wrapResult = function wrapResult(result) {
  const state = this._reporterState;
  if (!state.options.partial)
    return result;

  return {
    result: this.isError(result) ? null : result,
    errors: state.errors
  };
};

function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
}
inherits(ReporterError, Error);

ReporterError.prototype.rethrow = function rethrow(msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, ReporterError);

  if (!this.stack) {
    try {
      // IE only adds stack when thrown
      throw new Error(this.message);
    } catch (e) {
      this.stack = e.stack;
    }
  }
  return this;
};


/***/ }),

/***/ 304:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Helper
function reverse(map) {
  const res = {};

  Object.keys(map).forEach(function(key) {
    // Convert key to integer if it is stringified
    if ((key | 0) == key)
      key = key | 0;

    const value = map[key];
    res[value] = key;
  });

  return res;
}

exports.tagClass = {
  0: 'universal',
  1: 'application',
  2: 'context',
  3: 'private'
};
exports.tagClassByName = reverse(exports.tagClass);

exports.tag = {
  0x00: 'end',
  0x01: 'bool',
  0x02: 'int',
  0x03: 'bitstr',
  0x04: 'octstr',
  0x05: 'null_',
  0x06: 'objid',
  0x07: 'objDesc',
  0x08: 'external',
  0x09: 'real',
  0x0a: 'enum',
  0x0b: 'embed',
  0x0c: 'utf8str',
  0x0d: 'relativeOid',
  0x10: 'seq',
  0x11: 'set',
  0x12: 'numstr',
  0x13: 'printstr',
  0x14: 't61str',
  0x15: 'videostr',
  0x16: 'ia5str',
  0x17: 'utctime',
  0x18: 'gentime',
  0x19: 'graphstr',
  0x1a: 'iso646str',
  0x1b: 'genstr',
  0x1c: 'unistr',
  0x1d: 'charstr',
  0x1e: 'bmpstr'
};
exports.tagByName = reverse(exports.tag);


/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(45);
var normalizeHeaderName = __webpack_require__(850);
var AxiosError = __webpack_require__(151);
var transitionalDefaults = __webpack_require__(462);
var toFormData = __webpack_require__(463);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(464);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(464);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: __webpack_require__(857)
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(28)))

/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(151);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;var bigInt = (function (undefined) {
    "use strict";

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    }
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    }
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    }

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    }


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    }
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    }

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    }

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    }

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    }
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    }

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    }

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    }

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    }

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var t = iterations === undefined ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    }

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    }

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    }
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < top) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    }

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if ( true && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}

//amd check
if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return bigInt;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(95)(module)))

/***/ }),

/***/ 425:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// browserify by default only pulls in files that are hard coded in requires
// In order of last to first in this file, the default wordlist will be chosen
// based on what is present. (Bundles may remove wordlists they don't need)
const wordlists = {};
exports.wordlists = wordlists;
let _default;
exports._default = _default;
try {
    exports._default = _default = __webpack_require__(727);
    wordlists.czech = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(728);
    wordlists.chinese_simplified = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(729);
    wordlists.chinese_traditional = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(730);
    wordlists.korean = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(731);
    wordlists.french = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(732);
    wordlists.italian = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(733);
    wordlists.spanish = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(734);
    wordlists.japanese = _default;
    wordlists.JA = _default;
}
catch (err) { }
try {
    exports._default = _default = __webpack_require__(735);
    wordlists.english = _default;
    wordlists.EN = _default;
}
catch (err) { }


/***/ }),

/***/ 449:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const asn1 = exports;

asn1.bignum = __webpack_require__(34);

asn1.define = __webpack_require__(802).define;
asn1.base = __webpack_require__(805);
asn1.constants = __webpack_require__(806);
asn1.decoders = __webpack_require__(452);
asn1.encoders = __webpack_require__(450);


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(461);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};


/***/ }),

/***/ 450:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const encoders = exports;

encoders.der = __webpack_require__(451);
encoders.pem = __webpack_require__(803);


/***/ }),

/***/ 451:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inherits = __webpack_require__(18);
const Buffer = __webpack_require__(301).Buffer;
const Node = __webpack_require__(302);

// Import DER constants
const der = __webpack_require__(304);

function DEREncoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
}
module.exports = DEREncoder;

DEREncoder.prototype.encode = function encode(data, reporter) {
  return this.tree._encode(data, reporter).join();
};

// Tree methods

function DERNode(parent) {
  Node.call(this, 'der', parent);
}
inherits(DERNode, Node);

DERNode.prototype._encodeComposite = function encodeComposite(tag,
  primitive,
  cls,
  content) {
  const encodedTag = encodeTag(tag, primitive, cls, this.reporter);

  // Short form
  if (content.length < 0x80) {
    const header = Buffer.alloc(2);
    header[0] = encodedTag;
    header[1] = content.length;
    return this._createEncoderBuffer([ header, content ]);
  }

  // Long form
  // Count octets required to store length
  let lenOctets = 1;
  for (let i = content.length; i >= 0x100; i >>= 8)
    lenOctets++;

  const header = Buffer.alloc(1 + 1 + lenOctets);
  header[0] = encodedTag;
  header[1] = 0x80 | lenOctets;

  for (let i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8)
    header[i] = j & 0xff;

  return this._createEncoderBuffer([ header, content ]);
};

DERNode.prototype._encodeStr = function encodeStr(str, tag) {
  if (tag === 'bitstr') {
    return this._createEncoderBuffer([ str.unused | 0, str.data ]);
  } else if (tag === 'bmpstr') {
    const buf = Buffer.alloc(str.length * 2);
    for (let i = 0; i < str.length; i++) {
      buf.writeUInt16BE(str.charCodeAt(i), i * 2);
    }
    return this._createEncoderBuffer(buf);
  } else if (tag === 'numstr') {
    if (!this._isNumstr(str)) {
      return this.reporter.error('Encoding of string type: numstr supports ' +
                                 'only digits and space');
    }
    return this._createEncoderBuffer(str);
  } else if (tag === 'printstr') {
    if (!this._isPrintstr(str)) {
      return this.reporter.error('Encoding of string type: printstr supports ' +
                                 'only latin upper and lower case letters, ' +
                                 'digits, space, apostrophe, left and rigth ' +
                                 'parenthesis, plus sign, comma, hyphen, ' +
                                 'dot, slash, colon, equal sign, ' +
                                 'question mark');
    }
    return this._createEncoderBuffer(str);
  } else if (/str$/.test(tag)) {
    return this._createEncoderBuffer(str);
  } else if (tag === 'objDesc') {
    return this._createEncoderBuffer(str);
  } else {
    return this.reporter.error('Encoding of string type: ' + tag +
                               ' unsupported');
  }
};

DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
  if (typeof id === 'string') {
    if (!values)
      return this.reporter.error('string objid given, but no values map found');
    if (!values.hasOwnProperty(id))
      return this.reporter.error('objid not found in values map');
    id = values[id].split(/[\s.]+/g);
    for (let i = 0; i < id.length; i++)
      id[i] |= 0;
  } else if (Array.isArray(id)) {
    id = id.slice();
    for (let i = 0; i < id.length; i++)
      id[i] |= 0;
  }

  if (!Array.isArray(id)) {
    return this.reporter.error('objid() should be either array or string, ' +
                               'got: ' + JSON.stringify(id));
  }

  if (!relative) {
    if (id[1] >= 40)
      return this.reporter.error('Second objid identifier OOB');
    id.splice(0, 2, id[0] * 40 + id[1]);
  }

  // Count number of octets
  let size = 0;
  for (let i = 0; i < id.length; i++) {
    let ident = id[i];
    for (size++; ident >= 0x80; ident >>= 7)
      size++;
  }

  const objid = Buffer.alloc(size);
  let offset = objid.length - 1;
  for (let i = id.length - 1; i >= 0; i--) {
    let ident = id[i];
    objid[offset--] = ident & 0x7f;
    while ((ident >>= 7) > 0)
      objid[offset--] = 0x80 | (ident & 0x7f);
  }

  return this._createEncoderBuffer(objid);
};

function two(num) {
  if (num < 10)
    return '0' + num;
  else
    return num;
}

DERNode.prototype._encodeTime = function encodeTime(time, tag) {
  let str;
  const date = new Date(time);

  if (tag === 'gentime') {
    str = [
      two(date.getUTCFullYear()),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else if (tag === 'utctime') {
    str = [
      two(date.getUTCFullYear() % 100),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  } else {
    this.reporter.error('Encoding ' + tag + ' time is not supported yet');
  }

  return this._encodeStr(str, 'octstr');
};

DERNode.prototype._encodeNull = function encodeNull() {
  return this._createEncoderBuffer('');
};

DERNode.prototype._encodeInt = function encodeInt(num, values) {
  if (typeof num === 'string') {
    if (!values)
      return this.reporter.error('String int or enum given, but no values map');
    if (!values.hasOwnProperty(num)) {
      return this.reporter.error('Values map doesn\'t contain: ' +
                                 JSON.stringify(num));
    }
    num = values[num];
  }

  // Bignum, assume big endian
  if (typeof num !== 'number' && !Buffer.isBuffer(num)) {
    const numArray = num.toArray();
    if (!num.sign && numArray[0] & 0x80) {
      numArray.unshift(0);
    }
    num = Buffer.from(numArray);
  }

  if (Buffer.isBuffer(num)) {
    let size = num.length;
    if (num.length === 0)
      size++;

    const out = Buffer.alloc(size);
    num.copy(out);
    if (num.length === 0)
      out[0] = 0;
    return this._createEncoderBuffer(out);
  }

  if (num < 0x80)
    return this._createEncoderBuffer(num);

  if (num < 0x100)
    return this._createEncoderBuffer([0, num]);

  let size = 1;
  for (let i = num; i >= 0x100; i >>= 8)
    size++;

  const out = new Array(size);
  for (let i = out.length - 1; i >= 0; i--) {
    out[i] = num & 0xff;
    num >>= 8;
  }
  if(out[0] & 0x80) {
    out.unshift(0);
  }

  return this._createEncoderBuffer(Buffer.from(out));
};

DERNode.prototype._encodeBool = function encodeBool(value) {
  return this._createEncoderBuffer(value ? 0xff : 0);
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getEncoder('der').tree;
};

DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
  const state = this._baseState;
  let i;
  if (state['default'] === null)
    return false;

  const data = dataBuffer.join();
  if (state.defaultBuffer === undefined)
    state.defaultBuffer = this._encodeValue(state['default'], reporter, parent).join();

  if (data.length !== state.defaultBuffer.length)
    return false;

  for (i=0; i < data.length; i++)
    if (data[i] !== state.defaultBuffer[i])
      return false;

  return true;
};

// Utility methods

function encodeTag(tag, primitive, cls, reporter) {
  let res;

  if (tag === 'seqof')
    tag = 'seq';
  else if (tag === 'setof')
    tag = 'set';

  if (der.tagByName.hasOwnProperty(tag))
    res = der.tagByName[tag];
  else if (typeof tag === 'number' && (tag | 0) === tag)
    res = tag;
  else
    return reporter.error('Unknown tag: ' + tag);

  if (res >= 0x1f)
    return reporter.error('Multi-octet tag encoding unsupported');

  if (!primitive)
    res |= 0x20;

  res |= (der.tagClassByName[cls || 'universal'] << 6);

  return res;
}


/***/ }),

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const decoders = exports;

decoders.der = __webpack_require__(453);
decoders.pem = __webpack_require__(804);


/***/ }),

/***/ 453:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inherits = __webpack_require__(18);

const bignum = __webpack_require__(34);
const DecoderBuffer = __webpack_require__(180).DecoderBuffer;
const Node = __webpack_require__(302);

// Import DER constants
const der = __webpack_require__(304);

function DERDecoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  // Construct base tree
  this.tree = new DERNode();
  this.tree._init(entity.body);
}
module.exports = DERDecoder;

DERDecoder.prototype.decode = function decode(data, options) {
  if (!DecoderBuffer.isDecoderBuffer(data)) {
    data = new DecoderBuffer(data, options);
  }

  return this.tree._decode(data, options);
};

// Tree methods

function DERNode(parent) {
  Node.call(this, 'der', parent);
}
inherits(DERNode, Node);

DERNode.prototype._peekTag = function peekTag(buffer, tag, any) {
  if (buffer.isEmpty())
    return false;

  const state = buffer.save();
  const decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  buffer.restore(state);

  return decodedTag.tag === tag || decodedTag.tagStr === tag ||
    (decodedTag.tagStr + 'of') === tag || any;
};

DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
  const decodedTag = derDecodeTag(buffer,
    'Failed to decode tag of "' + tag + '"');
  if (buffer.isError(decodedTag))
    return decodedTag;

  let len = derDecodeLen(buffer,
    decodedTag.primitive,
    'Failed to get length of "' + tag + '"');

  // Failure
  if (buffer.isError(len))
    return len;

  if (!any &&
      decodedTag.tag !== tag &&
      decodedTag.tagStr !== tag &&
      decodedTag.tagStr + 'of' !== tag) {
    return buffer.error('Failed to match tag: "' + tag + '"');
  }

  if (decodedTag.primitive || len !== null)
    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

  // Indefinite length... find END tag
  const state = buffer.save();
  const res = this._skipUntilEnd(
    buffer,
    'Failed to skip indefinite length body: "' + this.tag + '"');
  if (buffer.isError(res))
    return res;

  len = buffer.offset - state.offset;
  buffer.restore(state);
  return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
};

DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
  for (;;) {
    const tag = derDecodeTag(buffer, fail);
    if (buffer.isError(tag))
      return tag;
    const len = derDecodeLen(buffer, tag.primitive, fail);
    if (buffer.isError(len))
      return len;

    let res;
    if (tag.primitive || len !== null)
      res = buffer.skip(len);
    else
      res = this._skipUntilEnd(buffer, fail);

    // Failure
    if (buffer.isError(res))
      return res;

    if (tag.tagStr === 'end')
      break;
  }
};

DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder,
  options) {
  const result = [];
  while (!buffer.isEmpty()) {
    const possibleEnd = this._peekTag(buffer, 'end');
    if (buffer.isError(possibleEnd))
      return possibleEnd;

    const res = decoder.decode(buffer, 'der', options);
    if (buffer.isError(res) && possibleEnd)
      break;
    result.push(res);
  }
  return result;
};

DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
  if (tag === 'bitstr') {
    const unused = buffer.readUInt8();
    if (buffer.isError(unused))
      return unused;
    return { unused: unused, data: buffer.raw() };
  } else if (tag === 'bmpstr') {
    const raw = buffer.raw();
    if (raw.length % 2 === 1)
      return buffer.error('Decoding of string type: bmpstr length mismatch');

    let str = '';
    for (let i = 0; i < raw.length / 2; i++) {
      str += String.fromCharCode(raw.readUInt16BE(i * 2));
    }
    return str;
  } else if (tag === 'numstr') {
    const numstr = buffer.raw().toString('ascii');
    if (!this._isNumstr(numstr)) {
      return buffer.error('Decoding of string type: ' +
                          'numstr unsupported characters');
    }
    return numstr;
  } else if (tag === 'octstr') {
    return buffer.raw();
  } else if (tag === 'objDesc') {
    return buffer.raw();
  } else if (tag === 'printstr') {
    const printstr = buffer.raw().toString('ascii');
    if (!this._isPrintstr(printstr)) {
      return buffer.error('Decoding of string type: ' +
                          'printstr unsupported characters');
    }
    return printstr;
  } else if (/str$/.test(tag)) {
    return buffer.raw().toString();
  } else {
    return buffer.error('Decoding of string type: ' + tag + ' unsupported');
  }
};

DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
  let result;
  const identifiers = [];
  let ident = 0;
  let subident = 0;
  while (!buffer.isEmpty()) {
    subident = buffer.readUInt8();
    ident <<= 7;
    ident |= subident & 0x7f;
    if ((subident & 0x80) === 0) {
      identifiers.push(ident);
      ident = 0;
    }
  }
  if (subident & 0x80)
    identifiers.push(ident);

  const first = (identifiers[0] / 40) | 0;
  const second = identifiers[0] % 40;

  if (relative)
    result = identifiers;
  else
    result = [first, second].concat(identifiers.slice(1));

  if (values) {
    let tmp = values[result.join(' ')];
    if (tmp === undefined)
      tmp = values[result.join('.')];
    if (tmp !== undefined)
      result = tmp;
  }

  return result;
};

DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
  const str = buffer.raw().toString();

  let year;
  let mon;
  let day;
  let hour;
  let min;
  let sec;
  if (tag === 'gentime') {
    year = str.slice(0, 4) | 0;
    mon = str.slice(4, 6) | 0;
    day = str.slice(6, 8) | 0;
    hour = str.slice(8, 10) | 0;
    min = str.slice(10, 12) | 0;
    sec = str.slice(12, 14) | 0;
  } else if (tag === 'utctime') {
    year = str.slice(0, 2) | 0;
    mon = str.slice(2, 4) | 0;
    day = str.slice(4, 6) | 0;
    hour = str.slice(6, 8) | 0;
    min = str.slice(8, 10) | 0;
    sec = str.slice(10, 12) | 0;
    if (year < 70)
      year = 2000 + year;
    else
      year = 1900 + year;
  } else {
    return buffer.error('Decoding ' + tag + ' time is not supported yet');
  }

  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
};

DERNode.prototype._decodeNull = function decodeNull() {
  return null;
};

DERNode.prototype._decodeBool = function decodeBool(buffer) {
  const res = buffer.readUInt8();
  if (buffer.isError(res))
    return res;
  else
    return res !== 0;
};

DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
  // Bigint, return as it is (assume big endian)
  const raw = buffer.raw();
  let res = new bignum(raw);

  if (values)
    res = values[res.toString(10)] || res;

  return res;
};

DERNode.prototype._use = function use(entity, obj) {
  if (typeof entity === 'function')
    entity = entity(obj);
  return entity._getDecoder('der').tree;
};

// Utility methods

function derDecodeTag(buf, fail) {
  let tag = buf.readUInt8(fail);
  if (buf.isError(tag))
    return tag;

  const cls = der.tagClass[tag >> 6];
  const primitive = (tag & 0x20) === 0;

  // Multi-octet tag - load
  if ((tag & 0x1f) === 0x1f) {
    let oct = tag;
    tag = 0;
    while ((oct & 0x80) === 0x80) {
      oct = buf.readUInt8(fail);
      if (buf.isError(oct))
        return oct;

      tag <<= 7;
      tag |= oct & 0x7f;
    }
  } else {
    tag &= 0x1f;
  }
  const tagStr = der.tag[tag];

  return {
    cls: cls,
    primitive: primitive,
    tag: tag,
    tagStr: tagStr
  };
}

function derDecodeLen(buf, primitive, fail) {
  let len = buf.readUInt8(fail);
  if (buf.isError(len))
    return len;

  // Indefinite form
  if (!primitive && len === 0x80)
    return null;

  // Definite form
  if ((len & 0x80) === 0) {
    // Short form
    return len;
  }

  // Long form
  const num = len & 0x7f;
  if (num > 4)
    return buf.error('length octect is too long');

  len = 0;
  for (let i = 0; i < num; i++) {
    len <<= 8;
    const j = buf.readUInt8(fail);
    if (buf.isError(j))
      return j;
    len |= j;
  }

  return len;
}


/***/ }),

/***/ 461:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var utils = __webpack_require__(45);

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4).Buffer))

/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);
var settle = __webpack_require__(361);
var cookies = __webpack_require__(851);
var buildURL = __webpack_require__(237);
var buildFullPath = __webpack_require__(238);
var parseHeaders = __webpack_require__(854);
var isURLSameOrigin = __webpack_require__(855);
var transitionalDefaults = __webpack_require__(462);
var AxiosError = __webpack_require__(151);
var CanceledError = __webpack_require__(220);
var parseProtocol = __webpack_require__(856);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 466:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ 467:
/***/ (function(module, exports) {

module.exports = {
  "version": "0.27.2"
};

/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(845);

/***/ }),

/***/ 727:
/***/ (function(module) {

module.exports = JSON.parse("[\"abdikace\",\"abeceda\",\"adresa\",\"agrese\",\"akce\",\"aktovka\",\"alej\",\"alkohol\",\"amputace\",\"ananas\",\"andulka\",\"anekdota\",\"anketa\",\"antika\",\"anulovat\",\"archa\",\"arogance\",\"asfalt\",\"asistent\",\"aspirace\",\"astma\",\"astronom\",\"atlas\",\"atletika\",\"atol\",\"autobus\",\"azyl\",\"babka\",\"bachor\",\"bacil\",\"baculka\",\"badatel\",\"bageta\",\"bagr\",\"bahno\",\"bakterie\",\"balada\",\"baletka\",\"balkon\",\"balonek\",\"balvan\",\"balza\",\"bambus\",\"bankomat\",\"barbar\",\"baret\",\"barman\",\"baroko\",\"barva\",\"baterka\",\"batoh\",\"bavlna\",\"bazalka\",\"bazilika\",\"bazuka\",\"bedna\",\"beran\",\"beseda\",\"bestie\",\"beton\",\"bezinka\",\"bezmoc\",\"beztak\",\"bicykl\",\"bidlo\",\"biftek\",\"bikiny\",\"bilance\",\"biograf\",\"biolog\",\"bitva\",\"bizon\",\"blahobyt\",\"blatouch\",\"blecha\",\"bledule\",\"blesk\",\"blikat\",\"blizna\",\"blokovat\",\"bloudit\",\"blud\",\"bobek\",\"bobr\",\"bodlina\",\"bodnout\",\"bohatost\",\"bojkot\",\"bojovat\",\"bokorys\",\"bolest\",\"borec\",\"borovice\",\"bota\",\"boubel\",\"bouchat\",\"bouda\",\"boule\",\"bourat\",\"boxer\",\"bradavka\",\"brambora\",\"branka\",\"bratr\",\"brepta\",\"briketa\",\"brko\",\"brloh\",\"bronz\",\"broskev\",\"brunetka\",\"brusinka\",\"brzda\",\"brzy\",\"bublina\",\"bubnovat\",\"buchta\",\"buditel\",\"budka\",\"budova\",\"bufet\",\"bujarost\",\"bukvice\",\"buldok\",\"bulva\",\"bunda\",\"bunkr\",\"burza\",\"butik\",\"buvol\",\"buzola\",\"bydlet\",\"bylina\",\"bytovka\",\"bzukot\",\"capart\",\"carevna\",\"cedr\",\"cedule\",\"cejch\",\"cejn\",\"cela\",\"celer\",\"celkem\",\"celnice\",\"cenina\",\"cennost\",\"cenovka\",\"centrum\",\"cenzor\",\"cestopis\",\"cetka\",\"chalupa\",\"chapadlo\",\"charita\",\"chata\",\"chechtat\",\"chemie\",\"chichot\",\"chirurg\",\"chlad\",\"chleba\",\"chlubit\",\"chmel\",\"chmura\",\"chobot\",\"chochol\",\"chodba\",\"cholera\",\"chomout\",\"chopit\",\"choroba\",\"chov\",\"chrapot\",\"chrlit\",\"chrt\",\"chrup\",\"chtivost\",\"chudina\",\"chutnat\",\"chvat\",\"chvilka\",\"chvost\",\"chyba\",\"chystat\",\"chytit\",\"cibule\",\"cigareta\",\"cihelna\",\"cihla\",\"cinkot\",\"cirkus\",\"cisterna\",\"citace\",\"citrus\",\"cizinec\",\"cizost\",\"clona\",\"cokoliv\",\"couvat\",\"ctitel\",\"ctnost\",\"cudnost\",\"cuketa\",\"cukr\",\"cupot\",\"cvaknout\",\"cval\",\"cvik\",\"cvrkot\",\"cyklista\",\"daleko\",\"dareba\",\"datel\",\"datum\",\"dcera\",\"debata\",\"dechovka\",\"decibel\",\"deficit\",\"deflace\",\"dekl\",\"dekret\",\"demokrat\",\"deprese\",\"derby\",\"deska\",\"detektiv\",\"dikobraz\",\"diktovat\",\"dioda\",\"diplom\",\"disk\",\"displej\",\"divadlo\",\"divoch\",\"dlaha\",\"dlouho\",\"dluhopis\",\"dnes\",\"dobro\",\"dobytek\",\"docent\",\"dochutit\",\"dodnes\",\"dohled\",\"dohoda\",\"dohra\",\"dojem\",\"dojnice\",\"doklad\",\"dokola\",\"doktor\",\"dokument\",\"dolar\",\"doleva\",\"dolina\",\"doma\",\"dominant\",\"domluvit\",\"domov\",\"donutit\",\"dopad\",\"dopis\",\"doplnit\",\"doposud\",\"doprovod\",\"dopustit\",\"dorazit\",\"dorost\",\"dort\",\"dosah\",\"doslov\",\"dostatek\",\"dosud\",\"dosyta\",\"dotaz\",\"dotek\",\"dotknout\",\"doufat\",\"doutnat\",\"dovozce\",\"dozadu\",\"doznat\",\"dozorce\",\"drahota\",\"drak\",\"dramatik\",\"dravec\",\"draze\",\"drdol\",\"drobnost\",\"drogerie\",\"drozd\",\"drsnost\",\"drtit\",\"drzost\",\"duben\",\"duchovno\",\"dudek\",\"duha\",\"duhovka\",\"dusit\",\"dusno\",\"dutost\",\"dvojice\",\"dvorec\",\"dynamit\",\"ekolog\",\"ekonomie\",\"elektron\",\"elipsa\",\"email\",\"emise\",\"emoce\",\"empatie\",\"epizoda\",\"epocha\",\"epopej\",\"epos\",\"esej\",\"esence\",\"eskorta\",\"eskymo\",\"etiketa\",\"euforie\",\"evoluce\",\"exekuce\",\"exkurze\",\"expedice\",\"exploze\",\"export\",\"extrakt\",\"facka\",\"fajfka\",\"fakulta\",\"fanatik\",\"fantazie\",\"farmacie\",\"favorit\",\"fazole\",\"federace\",\"fejeton\",\"fenka\",\"fialka\",\"figurant\",\"filozof\",\"filtr\",\"finance\",\"finta\",\"fixace\",\"fjord\",\"flanel\",\"flirt\",\"flotila\",\"fond\",\"fosfor\",\"fotbal\",\"fotka\",\"foton\",\"frakce\",\"freska\",\"fronta\",\"fukar\",\"funkce\",\"fyzika\",\"galeje\",\"garant\",\"genetika\",\"geolog\",\"gilotina\",\"glazura\",\"glejt\",\"golem\",\"golfista\",\"gotika\",\"graf\",\"gramofon\",\"granule\",\"grep\",\"gril\",\"grog\",\"groteska\",\"guma\",\"hadice\",\"hadr\",\"hala\",\"halenka\",\"hanba\",\"hanopis\",\"harfa\",\"harpuna\",\"havran\",\"hebkost\",\"hejkal\",\"hejno\",\"hejtman\",\"hektar\",\"helma\",\"hematom\",\"herec\",\"herna\",\"heslo\",\"hezky\",\"historik\",\"hladovka\",\"hlasivky\",\"hlava\",\"hledat\",\"hlen\",\"hlodavec\",\"hloh\",\"hloupost\",\"hltat\",\"hlubina\",\"hluchota\",\"hmat\",\"hmota\",\"hmyz\",\"hnis\",\"hnojivo\",\"hnout\",\"hoblina\",\"hoboj\",\"hoch\",\"hodiny\",\"hodlat\",\"hodnota\",\"hodovat\",\"hojnost\",\"hokej\",\"holinka\",\"holka\",\"holub\",\"homole\",\"honitba\",\"honorace\",\"horal\",\"horda\",\"horizont\",\"horko\",\"horlivec\",\"hormon\",\"hornina\",\"horoskop\",\"horstvo\",\"hospoda\",\"hostina\",\"hotovost\",\"houba\",\"houf\",\"houpat\",\"houska\",\"hovor\",\"hradba\",\"hranice\",\"hravost\",\"hrazda\",\"hrbolek\",\"hrdina\",\"hrdlo\",\"hrdost\",\"hrnek\",\"hrobka\",\"hromada\",\"hrot\",\"hrouda\",\"hrozen\",\"hrstka\",\"hrubost\",\"hryzat\",\"hubenost\",\"hubnout\",\"hudba\",\"hukot\",\"humr\",\"husita\",\"hustota\",\"hvozd\",\"hybnost\",\"hydrant\",\"hygiena\",\"hymna\",\"hysterik\",\"idylka\",\"ihned\",\"ikona\",\"iluze\",\"imunita\",\"infekce\",\"inflace\",\"inkaso\",\"inovace\",\"inspekce\",\"internet\",\"invalida\",\"investor\",\"inzerce\",\"ironie\",\"jablko\",\"jachta\",\"jahoda\",\"jakmile\",\"jakost\",\"jalovec\",\"jantar\",\"jarmark\",\"jaro\",\"jasan\",\"jasno\",\"jatka\",\"javor\",\"jazyk\",\"jedinec\",\"jedle\",\"jednatel\",\"jehlan\",\"jekot\",\"jelen\",\"jelito\",\"jemnost\",\"jenom\",\"jepice\",\"jeseter\",\"jevit\",\"jezdec\",\"jezero\",\"jinak\",\"jindy\",\"jinoch\",\"jiskra\",\"jistota\",\"jitrnice\",\"jizva\",\"jmenovat\",\"jogurt\",\"jurta\",\"kabaret\",\"kabel\",\"kabinet\",\"kachna\",\"kadet\",\"kadidlo\",\"kahan\",\"kajak\",\"kajuta\",\"kakao\",\"kaktus\",\"kalamita\",\"kalhoty\",\"kalibr\",\"kalnost\",\"kamera\",\"kamkoliv\",\"kamna\",\"kanibal\",\"kanoe\",\"kantor\",\"kapalina\",\"kapela\",\"kapitola\",\"kapka\",\"kaple\",\"kapota\",\"kapr\",\"kapusta\",\"kapybara\",\"karamel\",\"karotka\",\"karton\",\"kasa\",\"katalog\",\"katedra\",\"kauce\",\"kauza\",\"kavalec\",\"kazajka\",\"kazeta\",\"kazivost\",\"kdekoliv\",\"kdesi\",\"kedluben\",\"kemp\",\"keramika\",\"kino\",\"klacek\",\"kladivo\",\"klam\",\"klapot\",\"klasika\",\"klaun\",\"klec\",\"klenba\",\"klepat\",\"klesnout\",\"klid\",\"klima\",\"klisna\",\"klobouk\",\"klokan\",\"klopa\",\"kloub\",\"klubovna\",\"klusat\",\"kluzkost\",\"kmen\",\"kmitat\",\"kmotr\",\"kniha\",\"knot\",\"koalice\",\"koberec\",\"kobka\",\"kobliha\",\"kobyla\",\"kocour\",\"kohout\",\"kojenec\",\"kokos\",\"koktejl\",\"kolaps\",\"koleda\",\"kolize\",\"kolo\",\"komando\",\"kometa\",\"komik\",\"komnata\",\"komora\",\"kompas\",\"komunita\",\"konat\",\"koncept\",\"kondice\",\"konec\",\"konfese\",\"kongres\",\"konina\",\"konkurs\",\"kontakt\",\"konzerva\",\"kopanec\",\"kopie\",\"kopnout\",\"koprovka\",\"korbel\",\"korektor\",\"kormidlo\",\"koroptev\",\"korpus\",\"koruna\",\"koryto\",\"korzet\",\"kosatec\",\"kostka\",\"kotel\",\"kotleta\",\"kotoul\",\"koukat\",\"koupelna\",\"kousek\",\"kouzlo\",\"kovboj\",\"koza\",\"kozoroh\",\"krabice\",\"krach\",\"krajina\",\"kralovat\",\"krasopis\",\"kravata\",\"kredit\",\"krejcar\",\"kresba\",\"kreveta\",\"kriket\",\"kritik\",\"krize\",\"krkavec\",\"krmelec\",\"krmivo\",\"krocan\",\"krok\",\"kronika\",\"kropit\",\"kroupa\",\"krovka\",\"krtek\",\"kruhadlo\",\"krupice\",\"krutost\",\"krvinka\",\"krychle\",\"krypta\",\"krystal\",\"kryt\",\"kudlanka\",\"kufr\",\"kujnost\",\"kukla\",\"kulajda\",\"kulich\",\"kulka\",\"kulomet\",\"kultura\",\"kuna\",\"kupodivu\",\"kurt\",\"kurzor\",\"kutil\",\"kvalita\",\"kvasinka\",\"kvestor\",\"kynolog\",\"kyselina\",\"kytara\",\"kytice\",\"kytka\",\"kytovec\",\"kyvadlo\",\"labrador\",\"lachtan\",\"ladnost\",\"laik\",\"lakomec\",\"lamela\",\"lampa\",\"lanovka\",\"lasice\",\"laso\",\"lastura\",\"latinka\",\"lavina\",\"lebka\",\"leckdy\",\"leden\",\"lednice\",\"ledovka\",\"ledvina\",\"legenda\",\"legie\",\"legrace\",\"lehce\",\"lehkost\",\"lehnout\",\"lektvar\",\"lenochod\",\"lentilka\",\"lepenka\",\"lepidlo\",\"letadlo\",\"letec\",\"letmo\",\"letokruh\",\"levhart\",\"levitace\",\"levobok\",\"libra\",\"lichotka\",\"lidojed\",\"lidskost\",\"lihovina\",\"lijavec\",\"lilek\",\"limetka\",\"linie\",\"linka\",\"linoleum\",\"listopad\",\"litina\",\"litovat\",\"lobista\",\"lodivod\",\"logika\",\"logoped\",\"lokalita\",\"loket\",\"lomcovat\",\"lopata\",\"lopuch\",\"lord\",\"losos\",\"lotr\",\"loudal\",\"louh\",\"louka\",\"louskat\",\"lovec\",\"lstivost\",\"lucerna\",\"lucifer\",\"lump\",\"lusk\",\"lustrace\",\"lvice\",\"lyra\",\"lyrika\",\"lysina\",\"madam\",\"madlo\",\"magistr\",\"mahagon\",\"majetek\",\"majitel\",\"majorita\",\"makak\",\"makovice\",\"makrela\",\"malba\",\"malina\",\"malovat\",\"malvice\",\"maminka\",\"mandle\",\"manko\",\"marnost\",\"masakr\",\"maskot\",\"masopust\",\"matice\",\"matrika\",\"maturita\",\"mazanec\",\"mazivo\",\"mazlit\",\"mazurka\",\"mdloba\",\"mechanik\",\"meditace\",\"medovina\",\"melasa\",\"meloun\",\"mentolka\",\"metla\",\"metoda\",\"metr\",\"mezera\",\"migrace\",\"mihnout\",\"mihule\",\"mikina\",\"mikrofon\",\"milenec\",\"milimetr\",\"milost\",\"mimika\",\"mincovna\",\"minibar\",\"minomet\",\"minulost\",\"miska\",\"mistr\",\"mixovat\",\"mladost\",\"mlha\",\"mlhovina\",\"mlok\",\"mlsat\",\"mluvit\",\"mnich\",\"mnohem\",\"mobil\",\"mocnost\",\"modelka\",\"modlitba\",\"mohyla\",\"mokro\",\"molekula\",\"momentka\",\"monarcha\",\"monokl\",\"monstrum\",\"montovat\",\"monzun\",\"mosaz\",\"moskyt\",\"most\",\"motivace\",\"motorka\",\"motyka\",\"moucha\",\"moudrost\",\"mozaika\",\"mozek\",\"mozol\",\"mramor\",\"mravenec\",\"mrkev\",\"mrtvola\",\"mrzet\",\"mrzutost\",\"mstitel\",\"mudrc\",\"muflon\",\"mulat\",\"mumie\",\"munice\",\"muset\",\"mutace\",\"muzeum\",\"muzikant\",\"myslivec\",\"mzda\",\"nabourat\",\"nachytat\",\"nadace\",\"nadbytek\",\"nadhoz\",\"nadobro\",\"nadpis\",\"nahlas\",\"nahnat\",\"nahodile\",\"nahradit\",\"naivita\",\"najednou\",\"najisto\",\"najmout\",\"naklonit\",\"nakonec\",\"nakrmit\",\"nalevo\",\"namazat\",\"namluvit\",\"nanometr\",\"naoko\",\"naopak\",\"naostro\",\"napadat\",\"napevno\",\"naplnit\",\"napnout\",\"naposled\",\"naprosto\",\"narodit\",\"naruby\",\"narychlo\",\"nasadit\",\"nasekat\",\"naslepo\",\"nastat\",\"natolik\",\"navenek\",\"navrch\",\"navzdory\",\"nazvat\",\"nebe\",\"nechat\",\"necky\",\"nedaleko\",\"nedbat\",\"neduh\",\"negace\",\"nehet\",\"nehoda\",\"nejen\",\"nejprve\",\"neklid\",\"nelibost\",\"nemilost\",\"nemoc\",\"neochota\",\"neonka\",\"nepokoj\",\"nerost\",\"nerv\",\"nesmysl\",\"nesoulad\",\"netvor\",\"neuron\",\"nevina\",\"nezvykle\",\"nicota\",\"nijak\",\"nikam\",\"nikdy\",\"nikl\",\"nikterak\",\"nitro\",\"nocleh\",\"nohavice\",\"nominace\",\"nora\",\"norek\",\"nositel\",\"nosnost\",\"nouze\",\"noviny\",\"novota\",\"nozdra\",\"nuda\",\"nudle\",\"nuget\",\"nutit\",\"nutnost\",\"nutrie\",\"nymfa\",\"obal\",\"obarvit\",\"obava\",\"obdiv\",\"obec\",\"obehnat\",\"obejmout\",\"obezita\",\"obhajoba\",\"obilnice\",\"objasnit\",\"objekt\",\"obklopit\",\"oblast\",\"oblek\",\"obliba\",\"obloha\",\"obluda\",\"obnos\",\"obohatit\",\"obojek\",\"obout\",\"obrazec\",\"obrna\",\"obruba\",\"obrys\",\"obsah\",\"obsluha\",\"obstarat\",\"obuv\",\"obvaz\",\"obvinit\",\"obvod\",\"obvykle\",\"obyvatel\",\"obzor\",\"ocas\",\"ocel\",\"ocenit\",\"ochladit\",\"ochota\",\"ochrana\",\"ocitnout\",\"odboj\",\"odbyt\",\"odchod\",\"odcizit\",\"odebrat\",\"odeslat\",\"odevzdat\",\"odezva\",\"odhadce\",\"odhodit\",\"odjet\",\"odjinud\",\"odkaz\",\"odkoupit\",\"odliv\",\"odluka\",\"odmlka\",\"odolnost\",\"odpad\",\"odpis\",\"odplout\",\"odpor\",\"odpustit\",\"odpykat\",\"odrazka\",\"odsoudit\",\"odstup\",\"odsun\",\"odtok\",\"odtud\",\"odvaha\",\"odveta\",\"odvolat\",\"odvracet\",\"odznak\",\"ofina\",\"ofsajd\",\"ohlas\",\"ohnisko\",\"ohrada\",\"ohrozit\",\"ohryzek\",\"okap\",\"okenice\",\"oklika\",\"okno\",\"okouzlit\",\"okovy\",\"okrasa\",\"okres\",\"okrsek\",\"okruh\",\"okupant\",\"okurka\",\"okusit\",\"olejnina\",\"olizovat\",\"omak\",\"omeleta\",\"omezit\",\"omladina\",\"omlouvat\",\"omluva\",\"omyl\",\"onehdy\",\"opakovat\",\"opasek\",\"operace\",\"opice\",\"opilost\",\"opisovat\",\"opora\",\"opozice\",\"opravdu\",\"oproti\",\"orbital\",\"orchestr\",\"orgie\",\"orlice\",\"orloj\",\"ortel\",\"osada\",\"oschnout\",\"osika\",\"osivo\",\"oslava\",\"oslepit\",\"oslnit\",\"oslovit\",\"osnova\",\"osoba\",\"osolit\",\"ospalec\",\"osten\",\"ostraha\",\"ostuda\",\"ostych\",\"osvojit\",\"oteplit\",\"otisk\",\"otop\",\"otrhat\",\"otrlost\",\"otrok\",\"otruby\",\"otvor\",\"ovanout\",\"ovar\",\"oves\",\"ovlivnit\",\"ovoce\",\"oxid\",\"ozdoba\",\"pachatel\",\"pacient\",\"padouch\",\"pahorek\",\"pakt\",\"palanda\",\"palec\",\"palivo\",\"paluba\",\"pamflet\",\"pamlsek\",\"panenka\",\"panika\",\"panna\",\"panovat\",\"panstvo\",\"pantofle\",\"paprika\",\"parketa\",\"parodie\",\"parta\",\"paruka\",\"paryba\",\"paseka\",\"pasivita\",\"pastelka\",\"patent\",\"patrona\",\"pavouk\",\"pazneht\",\"pazourek\",\"pecka\",\"pedagog\",\"pejsek\",\"peklo\",\"peloton\",\"penalta\",\"pendrek\",\"penze\",\"periskop\",\"pero\",\"pestrost\",\"petarda\",\"petice\",\"petrolej\",\"pevnina\",\"pexeso\",\"pianista\",\"piha\",\"pijavice\",\"pikle\",\"piknik\",\"pilina\",\"pilnost\",\"pilulka\",\"pinzeta\",\"pipeta\",\"pisatel\",\"pistole\",\"pitevna\",\"pivnice\",\"pivovar\",\"placenta\",\"plakat\",\"plamen\",\"planeta\",\"plastika\",\"platit\",\"plavidlo\",\"plaz\",\"plech\",\"plemeno\",\"plenta\",\"ples\",\"pletivo\",\"plevel\",\"plivat\",\"plnit\",\"plno\",\"plocha\",\"plodina\",\"plomba\",\"plout\",\"pluk\",\"plyn\",\"pobavit\",\"pobyt\",\"pochod\",\"pocit\",\"poctivec\",\"podat\",\"podcenit\",\"podepsat\",\"podhled\",\"podivit\",\"podklad\",\"podmanit\",\"podnik\",\"podoba\",\"podpora\",\"podraz\",\"podstata\",\"podvod\",\"podzim\",\"poezie\",\"pohanka\",\"pohnutka\",\"pohovor\",\"pohroma\",\"pohyb\",\"pointa\",\"pojistka\",\"pojmout\",\"pokazit\",\"pokles\",\"pokoj\",\"pokrok\",\"pokuta\",\"pokyn\",\"poledne\",\"polibek\",\"polknout\",\"poloha\",\"polynom\",\"pomalu\",\"pominout\",\"pomlka\",\"pomoc\",\"pomsta\",\"pomyslet\",\"ponechat\",\"ponorka\",\"ponurost\",\"popadat\",\"popel\",\"popisek\",\"poplach\",\"poprosit\",\"popsat\",\"popud\",\"poradce\",\"porce\",\"porod\",\"porucha\",\"poryv\",\"posadit\",\"posed\",\"posila\",\"poskok\",\"poslanec\",\"posoudit\",\"pospolu\",\"postava\",\"posudek\",\"posyp\",\"potah\",\"potkan\",\"potlesk\",\"potomek\",\"potrava\",\"potupa\",\"potvora\",\"poukaz\",\"pouto\",\"pouzdro\",\"povaha\",\"povidla\",\"povlak\",\"povoz\",\"povrch\",\"povstat\",\"povyk\",\"povzdech\",\"pozdrav\",\"pozemek\",\"poznatek\",\"pozor\",\"pozvat\",\"pracovat\",\"prahory\",\"praktika\",\"prales\",\"praotec\",\"praporek\",\"prase\",\"pravda\",\"princip\",\"prkno\",\"probudit\",\"procento\",\"prodej\",\"profese\",\"prohra\",\"projekt\",\"prolomit\",\"promile\",\"pronikat\",\"propad\",\"prorok\",\"prosba\",\"proton\",\"proutek\",\"provaz\",\"prskavka\",\"prsten\",\"prudkost\",\"prut\",\"prvek\",\"prvohory\",\"psanec\",\"psovod\",\"pstruh\",\"ptactvo\",\"puberta\",\"puch\",\"pudl\",\"pukavec\",\"puklina\",\"pukrle\",\"pult\",\"pumpa\",\"punc\",\"pupen\",\"pusa\",\"pusinka\",\"pustina\",\"putovat\",\"putyka\",\"pyramida\",\"pysk\",\"pytel\",\"racek\",\"rachot\",\"radiace\",\"radnice\",\"radon\",\"raft\",\"ragby\",\"raketa\",\"rakovina\",\"rameno\",\"rampouch\",\"rande\",\"rarach\",\"rarita\",\"rasovna\",\"rastr\",\"ratolest\",\"razance\",\"razidlo\",\"reagovat\",\"reakce\",\"recept\",\"redaktor\",\"referent\",\"reflex\",\"rejnok\",\"reklama\",\"rekord\",\"rekrut\",\"rektor\",\"reputace\",\"revize\",\"revma\",\"revolver\",\"rezerva\",\"riskovat\",\"riziko\",\"robotika\",\"rodokmen\",\"rohovka\",\"rokle\",\"rokoko\",\"romaneto\",\"ropovod\",\"ropucha\",\"rorejs\",\"rosol\",\"rostlina\",\"rotmistr\",\"rotoped\",\"rotunda\",\"roubenka\",\"roucho\",\"roup\",\"roura\",\"rovina\",\"rovnice\",\"rozbor\",\"rozchod\",\"rozdat\",\"rozeznat\",\"rozhodce\",\"rozinka\",\"rozjezd\",\"rozkaz\",\"rozloha\",\"rozmar\",\"rozpad\",\"rozruch\",\"rozsah\",\"roztok\",\"rozum\",\"rozvod\",\"rubrika\",\"ruchadlo\",\"rukavice\",\"rukopis\",\"ryba\",\"rybolov\",\"rychlost\",\"rydlo\",\"rypadlo\",\"rytina\",\"ryzost\",\"sadista\",\"sahat\",\"sako\",\"samec\",\"samizdat\",\"samota\",\"sanitka\",\"sardinka\",\"sasanka\",\"satelit\",\"sazba\",\"sazenice\",\"sbor\",\"schovat\",\"sebranka\",\"secese\",\"sedadlo\",\"sediment\",\"sedlo\",\"sehnat\",\"sejmout\",\"sekera\",\"sekta\",\"sekunda\",\"sekvoje\",\"semeno\",\"seno\",\"servis\",\"sesadit\",\"seshora\",\"seskok\",\"seslat\",\"sestra\",\"sesuv\",\"sesypat\",\"setba\",\"setina\",\"setkat\",\"setnout\",\"setrvat\",\"sever\",\"seznam\",\"shoda\",\"shrnout\",\"sifon\",\"silnice\",\"sirka\",\"sirotek\",\"sirup\",\"situace\",\"skafandr\",\"skalisko\",\"skanzen\",\"skaut\",\"skeptik\",\"skica\",\"skladba\",\"sklenice\",\"sklo\",\"skluz\",\"skoba\",\"skokan\",\"skoro\",\"skripta\",\"skrz\",\"skupina\",\"skvost\",\"skvrna\",\"slabika\",\"sladidlo\",\"slanina\",\"slast\",\"slavnost\",\"sledovat\",\"slepec\",\"sleva\",\"slezina\",\"slib\",\"slina\",\"sliznice\",\"slon\",\"sloupek\",\"slovo\",\"sluch\",\"sluha\",\"slunce\",\"slupka\",\"slza\",\"smaragd\",\"smetana\",\"smilstvo\",\"smlouva\",\"smog\",\"smrad\",\"smrk\",\"smrtka\",\"smutek\",\"smysl\",\"snad\",\"snaha\",\"snob\",\"sobota\",\"socha\",\"sodovka\",\"sokol\",\"sopka\",\"sotva\",\"souboj\",\"soucit\",\"soudce\",\"souhlas\",\"soulad\",\"soumrak\",\"souprava\",\"soused\",\"soutok\",\"souviset\",\"spalovna\",\"spasitel\",\"spis\",\"splav\",\"spodek\",\"spojenec\",\"spolu\",\"sponzor\",\"spornost\",\"spousta\",\"sprcha\",\"spustit\",\"sranda\",\"sraz\",\"srdce\",\"srna\",\"srnec\",\"srovnat\",\"srpen\",\"srst\",\"srub\",\"stanice\",\"starosta\",\"statika\",\"stavba\",\"stehno\",\"stezka\",\"stodola\",\"stolek\",\"stopa\",\"storno\",\"stoupat\",\"strach\",\"stres\",\"strhnout\",\"strom\",\"struna\",\"studna\",\"stupnice\",\"stvol\",\"styk\",\"subjekt\",\"subtropy\",\"suchar\",\"sudost\",\"sukno\",\"sundat\",\"sunout\",\"surikata\",\"surovina\",\"svah\",\"svalstvo\",\"svetr\",\"svatba\",\"svazek\",\"svisle\",\"svitek\",\"svoboda\",\"svodidlo\",\"svorka\",\"svrab\",\"sykavka\",\"sykot\",\"synek\",\"synovec\",\"sypat\",\"sypkost\",\"syrovost\",\"sysel\",\"sytost\",\"tabletka\",\"tabule\",\"tahoun\",\"tajemno\",\"tajfun\",\"tajga\",\"tajit\",\"tajnost\",\"taktika\",\"tamhle\",\"tampon\",\"tancovat\",\"tanec\",\"tanker\",\"tapeta\",\"tavenina\",\"tazatel\",\"technika\",\"tehdy\",\"tekutina\",\"telefon\",\"temnota\",\"tendence\",\"tenista\",\"tenor\",\"teplota\",\"tepna\",\"teprve\",\"terapie\",\"termoska\",\"textil\",\"ticho\",\"tiskopis\",\"titulek\",\"tkadlec\",\"tkanina\",\"tlapka\",\"tleskat\",\"tlukot\",\"tlupa\",\"tmel\",\"toaleta\",\"topinka\",\"topol\",\"torzo\",\"touha\",\"toulec\",\"tradice\",\"traktor\",\"tramp\",\"trasa\",\"traverza\",\"trefit\",\"trest\",\"trezor\",\"trhavina\",\"trhlina\",\"trochu\",\"trojice\",\"troska\",\"trouba\",\"trpce\",\"trpitel\",\"trpkost\",\"trubec\",\"truchlit\",\"truhlice\",\"trus\",\"trvat\",\"tudy\",\"tuhnout\",\"tuhost\",\"tundra\",\"turista\",\"turnaj\",\"tuzemsko\",\"tvaroh\",\"tvorba\",\"tvrdost\",\"tvrz\",\"tygr\",\"tykev\",\"ubohost\",\"uboze\",\"ubrat\",\"ubrousek\",\"ubrus\",\"ubytovna\",\"ucho\",\"uctivost\",\"udivit\",\"uhradit\",\"ujednat\",\"ujistit\",\"ujmout\",\"ukazatel\",\"uklidnit\",\"uklonit\",\"ukotvit\",\"ukrojit\",\"ulice\",\"ulita\",\"ulovit\",\"umyvadlo\",\"unavit\",\"uniforma\",\"uniknout\",\"upadnout\",\"uplatnit\",\"uplynout\",\"upoutat\",\"upravit\",\"uran\",\"urazit\",\"usednout\",\"usilovat\",\"usmrtit\",\"usnadnit\",\"usnout\",\"usoudit\",\"ustlat\",\"ustrnout\",\"utahovat\",\"utkat\",\"utlumit\",\"utonout\",\"utopenec\",\"utrousit\",\"uvalit\",\"uvolnit\",\"uvozovka\",\"uzdravit\",\"uzel\",\"uzenina\",\"uzlina\",\"uznat\",\"vagon\",\"valcha\",\"valoun\",\"vana\",\"vandal\",\"vanilka\",\"varan\",\"varhany\",\"varovat\",\"vcelku\",\"vchod\",\"vdova\",\"vedro\",\"vegetace\",\"vejce\",\"velbloud\",\"veletrh\",\"velitel\",\"velmoc\",\"velryba\",\"venkov\",\"veranda\",\"verze\",\"veselka\",\"veskrze\",\"vesnice\",\"vespodu\",\"vesta\",\"veterina\",\"veverka\",\"vibrace\",\"vichr\",\"videohra\",\"vidina\",\"vidle\",\"vila\",\"vinice\",\"viset\",\"vitalita\",\"vize\",\"vizitka\",\"vjezd\",\"vklad\",\"vkus\",\"vlajka\",\"vlak\",\"vlasec\",\"vlevo\",\"vlhkost\",\"vliv\",\"vlnovka\",\"vloupat\",\"vnucovat\",\"vnuk\",\"voda\",\"vodivost\",\"vodoznak\",\"vodstvo\",\"vojensky\",\"vojna\",\"vojsko\",\"volant\",\"volba\",\"volit\",\"volno\",\"voskovka\",\"vozidlo\",\"vozovna\",\"vpravo\",\"vrabec\",\"vracet\",\"vrah\",\"vrata\",\"vrba\",\"vrcholek\",\"vrhat\",\"vrstva\",\"vrtule\",\"vsadit\",\"vstoupit\",\"vstup\",\"vtip\",\"vybavit\",\"vybrat\",\"vychovat\",\"vydat\",\"vydra\",\"vyfotit\",\"vyhledat\",\"vyhnout\",\"vyhodit\",\"vyhradit\",\"vyhubit\",\"vyjasnit\",\"vyjet\",\"vyjmout\",\"vyklopit\",\"vykonat\",\"vylekat\",\"vymazat\",\"vymezit\",\"vymizet\",\"vymyslet\",\"vynechat\",\"vynikat\",\"vynutit\",\"vypadat\",\"vyplatit\",\"vypravit\",\"vypustit\",\"vyrazit\",\"vyrovnat\",\"vyrvat\",\"vyslovit\",\"vysoko\",\"vystavit\",\"vysunout\",\"vysypat\",\"vytasit\",\"vytesat\",\"vytratit\",\"vyvinout\",\"vyvolat\",\"vyvrhel\",\"vyzdobit\",\"vyznat\",\"vzadu\",\"vzbudit\",\"vzchopit\",\"vzdor\",\"vzduch\",\"vzdychat\",\"vzestup\",\"vzhledem\",\"vzkaz\",\"vzlykat\",\"vznik\",\"vzorek\",\"vzpoura\",\"vztah\",\"vztek\",\"xylofon\",\"zabrat\",\"zabydlet\",\"zachovat\",\"zadarmo\",\"zadusit\",\"zafoukat\",\"zahltit\",\"zahodit\",\"zahrada\",\"zahynout\",\"zajatec\",\"zajet\",\"zajistit\",\"zaklepat\",\"zakoupit\",\"zalepit\",\"zamezit\",\"zamotat\",\"zamyslet\",\"zanechat\",\"zanikat\",\"zaplatit\",\"zapojit\",\"zapsat\",\"zarazit\",\"zastavit\",\"zasunout\",\"zatajit\",\"zatemnit\",\"zatknout\",\"zaujmout\",\"zavalit\",\"zavelet\",\"zavinit\",\"zavolat\",\"zavrtat\",\"zazvonit\",\"zbavit\",\"zbrusu\",\"zbudovat\",\"zbytek\",\"zdaleka\",\"zdarma\",\"zdatnost\",\"zdivo\",\"zdobit\",\"zdroj\",\"zdvih\",\"zdymadlo\",\"zelenina\",\"zeman\",\"zemina\",\"zeptat\",\"zezadu\",\"zezdola\",\"zhatit\",\"zhltnout\",\"zhluboka\",\"zhotovit\",\"zhruba\",\"zima\",\"zimnice\",\"zjemnit\",\"zklamat\",\"zkoumat\",\"zkratka\",\"zkumavka\",\"zlato\",\"zlehka\",\"zloba\",\"zlom\",\"zlost\",\"zlozvyk\",\"zmapovat\",\"zmar\",\"zmatek\",\"zmije\",\"zmizet\",\"zmocnit\",\"zmodrat\",\"zmrzlina\",\"zmutovat\",\"znak\",\"znalost\",\"znamenat\",\"znovu\",\"zobrazit\",\"zotavit\",\"zoubek\",\"zoufale\",\"zplodit\",\"zpomalit\",\"zprava\",\"zprostit\",\"zprudka\",\"zprvu\",\"zrada\",\"zranit\",\"zrcadlo\",\"zrnitost\",\"zrno\",\"zrovna\",\"zrychlit\",\"zrzavost\",\"zticha\",\"ztratit\",\"zubovina\",\"zubr\",\"zvednout\",\"zvenku\",\"zvesela\",\"zvon\",\"zvrat\",\"zvukovod\",\"zvyk\"]");

/***/ }),

/***/ 728:
/***/ (function(module) {

module.exports = JSON.parse("[\"的\",\"一\",\"是\",\"在\",\"不\",\"了\",\"有\",\"和\",\"人\",\"这\",\"中\",\"大\",\"为\",\"上\",\"个\",\"国\",\"我\",\"以\",\"要\",\"他\",\"时\",\"来\",\"用\",\"们\",\"生\",\"到\",\"作\",\"地\",\"于\",\"出\",\"就\",\"分\",\"对\",\"成\",\"会\",\"可\",\"主\",\"发\",\"年\",\"动\",\"同\",\"工\",\"也\",\"能\",\"下\",\"过\",\"子\",\"说\",\"产\",\"种\",\"面\",\"而\",\"方\",\"后\",\"多\",\"定\",\"行\",\"学\",\"法\",\"所\",\"民\",\"得\",\"经\",\"十\",\"三\",\"之\",\"进\",\"着\",\"等\",\"部\",\"度\",\"家\",\"电\",\"力\",\"里\",\"如\",\"水\",\"化\",\"高\",\"自\",\"二\",\"理\",\"起\",\"小\",\"物\",\"现\",\"实\",\"加\",\"量\",\"都\",\"两\",\"体\",\"制\",\"机\",\"当\",\"使\",\"点\",\"从\",\"业\",\"本\",\"去\",\"把\",\"性\",\"好\",\"应\",\"开\",\"它\",\"合\",\"还\",\"因\",\"由\",\"其\",\"些\",\"然\",\"前\",\"外\",\"天\",\"政\",\"四\",\"日\",\"那\",\"社\",\"义\",\"事\",\"平\",\"形\",\"相\",\"全\",\"表\",\"间\",\"样\",\"与\",\"关\",\"各\",\"重\",\"新\",\"线\",\"内\",\"数\",\"正\",\"心\",\"反\",\"你\",\"明\",\"看\",\"原\",\"又\",\"么\",\"利\",\"比\",\"或\",\"但\",\"质\",\"气\",\"第\",\"向\",\"道\",\"命\",\"此\",\"变\",\"条\",\"只\",\"没\",\"结\",\"解\",\"问\",\"意\",\"建\",\"月\",\"公\",\"无\",\"系\",\"军\",\"很\",\"情\",\"者\",\"最\",\"立\",\"代\",\"想\",\"已\",\"通\",\"并\",\"提\",\"直\",\"题\",\"党\",\"程\",\"展\",\"五\",\"果\",\"料\",\"象\",\"员\",\"革\",\"位\",\"入\",\"常\",\"文\",\"总\",\"次\",\"品\",\"式\",\"活\",\"设\",\"及\",\"管\",\"特\",\"件\",\"长\",\"求\",\"老\",\"头\",\"基\",\"资\",\"边\",\"流\",\"路\",\"级\",\"少\",\"图\",\"山\",\"统\",\"接\",\"知\",\"较\",\"将\",\"组\",\"见\",\"计\",\"别\",\"她\",\"手\",\"角\",\"期\",\"根\",\"论\",\"运\",\"农\",\"指\",\"几\",\"九\",\"区\",\"强\",\"放\",\"决\",\"西\",\"被\",\"干\",\"做\",\"必\",\"战\",\"先\",\"回\",\"则\",\"任\",\"取\",\"据\",\"处\",\"队\",\"南\",\"给\",\"色\",\"光\",\"门\",\"即\",\"保\",\"治\",\"北\",\"造\",\"百\",\"规\",\"热\",\"领\",\"七\",\"海\",\"口\",\"东\",\"导\",\"器\",\"压\",\"志\",\"世\",\"金\",\"增\",\"争\",\"济\",\"阶\",\"油\",\"思\",\"术\",\"极\",\"交\",\"受\",\"联\",\"什\",\"认\",\"六\",\"共\",\"权\",\"收\",\"证\",\"改\",\"清\",\"美\",\"再\",\"采\",\"转\",\"更\",\"单\",\"风\",\"切\",\"打\",\"白\",\"教\",\"速\",\"花\",\"带\",\"安\",\"场\",\"身\",\"车\",\"例\",\"真\",\"务\",\"具\",\"万\",\"每\",\"目\",\"至\",\"达\",\"走\",\"积\",\"示\",\"议\",\"声\",\"报\",\"斗\",\"完\",\"类\",\"八\",\"离\",\"华\",\"名\",\"确\",\"才\",\"科\",\"张\",\"信\",\"马\",\"节\",\"话\",\"米\",\"整\",\"空\",\"元\",\"况\",\"今\",\"集\",\"温\",\"传\",\"土\",\"许\",\"步\",\"群\",\"广\",\"石\",\"记\",\"需\",\"段\",\"研\",\"界\",\"拉\",\"林\",\"律\",\"叫\",\"且\",\"究\",\"观\",\"越\",\"织\",\"装\",\"影\",\"算\",\"低\",\"持\",\"音\",\"众\",\"书\",\"布\",\"复\",\"容\",\"儿\",\"须\",\"际\",\"商\",\"非\",\"验\",\"连\",\"断\",\"深\",\"难\",\"近\",\"矿\",\"千\",\"周\",\"委\",\"素\",\"技\",\"备\",\"半\",\"办\",\"青\",\"省\",\"列\",\"习\",\"响\",\"约\",\"支\",\"般\",\"史\",\"感\",\"劳\",\"便\",\"团\",\"往\",\"酸\",\"历\",\"市\",\"克\",\"何\",\"除\",\"消\",\"构\",\"府\",\"称\",\"太\",\"准\",\"精\",\"值\",\"号\",\"率\",\"族\",\"维\",\"划\",\"选\",\"标\",\"写\",\"存\",\"候\",\"毛\",\"亲\",\"快\",\"效\",\"斯\",\"院\",\"查\",\"江\",\"型\",\"眼\",\"王\",\"按\",\"格\",\"养\",\"易\",\"置\",\"派\",\"层\",\"片\",\"始\",\"却\",\"专\",\"状\",\"育\",\"厂\",\"京\",\"识\",\"适\",\"属\",\"圆\",\"包\",\"火\",\"住\",\"调\",\"满\",\"县\",\"局\",\"照\",\"参\",\"红\",\"细\",\"引\",\"听\",\"该\",\"铁\",\"价\",\"严\",\"首\",\"底\",\"液\",\"官\",\"德\",\"随\",\"病\",\"苏\",\"失\",\"尔\",\"死\",\"讲\",\"配\",\"女\",\"黄\",\"推\",\"显\",\"谈\",\"罪\",\"神\",\"艺\",\"呢\",\"席\",\"含\",\"企\",\"望\",\"密\",\"批\",\"营\",\"项\",\"防\",\"举\",\"球\",\"英\",\"氧\",\"势\",\"告\",\"李\",\"台\",\"落\",\"木\",\"帮\",\"轮\",\"破\",\"亚\",\"师\",\"围\",\"注\",\"远\",\"字\",\"材\",\"排\",\"供\",\"河\",\"态\",\"封\",\"另\",\"施\",\"减\",\"树\",\"溶\",\"怎\",\"止\",\"案\",\"言\",\"士\",\"均\",\"武\",\"固\",\"叶\",\"鱼\",\"波\",\"视\",\"仅\",\"费\",\"紧\",\"爱\",\"左\",\"章\",\"早\",\"朝\",\"害\",\"续\",\"轻\",\"服\",\"试\",\"食\",\"充\",\"兵\",\"源\",\"判\",\"护\",\"司\",\"足\",\"某\",\"练\",\"差\",\"致\",\"板\",\"田\",\"降\",\"黑\",\"犯\",\"负\",\"击\",\"范\",\"继\",\"兴\",\"似\",\"余\",\"坚\",\"曲\",\"输\",\"修\",\"故\",\"城\",\"夫\",\"够\",\"送\",\"笔\",\"船\",\"占\",\"右\",\"财\",\"吃\",\"富\",\"春\",\"职\",\"觉\",\"汉\",\"画\",\"功\",\"巴\",\"跟\",\"虽\",\"杂\",\"飞\",\"检\",\"吸\",\"助\",\"升\",\"阳\",\"互\",\"初\",\"创\",\"抗\",\"考\",\"投\",\"坏\",\"策\",\"古\",\"径\",\"换\",\"未\",\"跑\",\"留\",\"钢\",\"曾\",\"端\",\"责\",\"站\",\"简\",\"述\",\"钱\",\"副\",\"尽\",\"帝\",\"射\",\"草\",\"冲\",\"承\",\"独\",\"令\",\"限\",\"阿\",\"宣\",\"环\",\"双\",\"请\",\"超\",\"微\",\"让\",\"控\",\"州\",\"良\",\"轴\",\"找\",\"否\",\"纪\",\"益\",\"依\",\"优\",\"顶\",\"础\",\"载\",\"倒\",\"房\",\"突\",\"坐\",\"粉\",\"敌\",\"略\",\"客\",\"袁\",\"冷\",\"胜\",\"绝\",\"析\",\"块\",\"剂\",\"测\",\"丝\",\"协\",\"诉\",\"念\",\"陈\",\"仍\",\"罗\",\"盐\",\"友\",\"洋\",\"错\",\"苦\",\"夜\",\"刑\",\"移\",\"频\",\"逐\",\"靠\",\"混\",\"母\",\"短\",\"皮\",\"终\",\"聚\",\"汽\",\"村\",\"云\",\"哪\",\"既\",\"距\",\"卫\",\"停\",\"烈\",\"央\",\"察\",\"烧\",\"迅\",\"境\",\"若\",\"印\",\"洲\",\"刻\",\"括\",\"激\",\"孔\",\"搞\",\"甚\",\"室\",\"待\",\"核\",\"校\",\"散\",\"侵\",\"吧\",\"甲\",\"游\",\"久\",\"菜\",\"味\",\"旧\",\"模\",\"湖\",\"货\",\"损\",\"预\",\"阻\",\"毫\",\"普\",\"稳\",\"乙\",\"妈\",\"植\",\"息\",\"扩\",\"银\",\"语\",\"挥\",\"酒\",\"守\",\"拿\",\"序\",\"纸\",\"医\",\"缺\",\"雨\",\"吗\",\"针\",\"刘\",\"啊\",\"急\",\"唱\",\"误\",\"训\",\"愿\",\"审\",\"附\",\"获\",\"茶\",\"鲜\",\"粮\",\"斤\",\"孩\",\"脱\",\"硫\",\"肥\",\"善\",\"龙\",\"演\",\"父\",\"渐\",\"血\",\"欢\",\"械\",\"掌\",\"歌\",\"沙\",\"刚\",\"攻\",\"谓\",\"盾\",\"讨\",\"晚\",\"粒\",\"乱\",\"燃\",\"矛\",\"乎\",\"杀\",\"药\",\"宁\",\"鲁\",\"贵\",\"钟\",\"煤\",\"读\",\"班\",\"伯\",\"香\",\"介\",\"迫\",\"句\",\"丰\",\"培\",\"握\",\"兰\",\"担\",\"弦\",\"蛋\",\"沉\",\"假\",\"穿\",\"执\",\"答\",\"乐\",\"谁\",\"顺\",\"烟\",\"缩\",\"征\",\"脸\",\"喜\",\"松\",\"脚\",\"困\",\"异\",\"免\",\"背\",\"星\",\"福\",\"买\",\"染\",\"井\",\"概\",\"慢\",\"怕\",\"磁\",\"倍\",\"祖\",\"皇\",\"促\",\"静\",\"补\",\"评\",\"翻\",\"肉\",\"践\",\"尼\",\"衣\",\"宽\",\"扬\",\"棉\",\"希\",\"伤\",\"操\",\"垂\",\"秋\",\"宜\",\"氢\",\"套\",\"督\",\"振\",\"架\",\"亮\",\"末\",\"宪\",\"庆\",\"编\",\"牛\",\"触\",\"映\",\"雷\",\"销\",\"诗\",\"座\",\"居\",\"抓\",\"裂\",\"胞\",\"呼\",\"娘\",\"景\",\"威\",\"绿\",\"晶\",\"厚\",\"盟\",\"衡\",\"鸡\",\"孙\",\"延\",\"危\",\"胶\",\"屋\",\"乡\",\"临\",\"陆\",\"顾\",\"掉\",\"呀\",\"灯\",\"岁\",\"措\",\"束\",\"耐\",\"剧\",\"玉\",\"赵\",\"跳\",\"哥\",\"季\",\"课\",\"凯\",\"胡\",\"额\",\"款\",\"绍\",\"卷\",\"齐\",\"伟\",\"蒸\",\"殖\",\"永\",\"宗\",\"苗\",\"川\",\"炉\",\"岩\",\"弱\",\"零\",\"杨\",\"奏\",\"沿\",\"露\",\"杆\",\"探\",\"滑\",\"镇\",\"饭\",\"浓\",\"航\",\"怀\",\"赶\",\"库\",\"夺\",\"伊\",\"灵\",\"税\",\"途\",\"灭\",\"赛\",\"归\",\"召\",\"鼓\",\"播\",\"盘\",\"裁\",\"险\",\"康\",\"唯\",\"录\",\"菌\",\"纯\",\"借\",\"糖\",\"盖\",\"横\",\"符\",\"私\",\"努\",\"堂\",\"域\",\"枪\",\"润\",\"幅\",\"哈\",\"竟\",\"熟\",\"虫\",\"泽\",\"脑\",\"壤\",\"碳\",\"欧\",\"遍\",\"侧\",\"寨\",\"敢\",\"彻\",\"虑\",\"斜\",\"薄\",\"庭\",\"纳\",\"弹\",\"饲\",\"伸\",\"折\",\"麦\",\"湿\",\"暗\",\"荷\",\"瓦\",\"塞\",\"床\",\"筑\",\"恶\",\"户\",\"访\",\"塔\",\"奇\",\"透\",\"梁\",\"刀\",\"旋\",\"迹\",\"卡\",\"氯\",\"遇\",\"份\",\"毒\",\"泥\",\"退\",\"洗\",\"摆\",\"灰\",\"彩\",\"卖\",\"耗\",\"夏\",\"择\",\"忙\",\"铜\",\"献\",\"硬\",\"予\",\"繁\",\"圈\",\"雪\",\"函\",\"亦\",\"抽\",\"篇\",\"阵\",\"阴\",\"丁\",\"尺\",\"追\",\"堆\",\"雄\",\"迎\",\"泛\",\"爸\",\"楼\",\"避\",\"谋\",\"吨\",\"野\",\"猪\",\"旗\",\"累\",\"偏\",\"典\",\"馆\",\"索\",\"秦\",\"脂\",\"潮\",\"爷\",\"豆\",\"忽\",\"托\",\"惊\",\"塑\",\"遗\",\"愈\",\"朱\",\"替\",\"纤\",\"粗\",\"倾\",\"尚\",\"痛\",\"楚\",\"谢\",\"奋\",\"购\",\"磨\",\"君\",\"池\",\"旁\",\"碎\",\"骨\",\"监\",\"捕\",\"弟\",\"暴\",\"割\",\"贯\",\"殊\",\"释\",\"词\",\"亡\",\"壁\",\"顿\",\"宝\",\"午\",\"尘\",\"闻\",\"揭\",\"炮\",\"残\",\"冬\",\"桥\",\"妇\",\"警\",\"综\",\"招\",\"吴\",\"付\",\"浮\",\"遭\",\"徐\",\"您\",\"摇\",\"谷\",\"赞\",\"箱\",\"隔\",\"订\",\"男\",\"吹\",\"园\",\"纷\",\"唐\",\"败\",\"宋\",\"玻\",\"巨\",\"耕\",\"坦\",\"荣\",\"闭\",\"湾\",\"键\",\"凡\",\"驻\",\"锅\",\"救\",\"恩\",\"剥\",\"凝\",\"碱\",\"齿\",\"截\",\"炼\",\"麻\",\"纺\",\"禁\",\"废\",\"盛\",\"版\",\"缓\",\"净\",\"睛\",\"昌\",\"婚\",\"涉\",\"筒\",\"嘴\",\"插\",\"岸\",\"朗\",\"庄\",\"街\",\"藏\",\"姑\",\"贸\",\"腐\",\"奴\",\"啦\",\"惯\",\"乘\",\"伙\",\"恢\",\"匀\",\"纱\",\"扎\",\"辩\",\"耳\",\"彪\",\"臣\",\"亿\",\"璃\",\"抵\",\"脉\",\"秀\",\"萨\",\"俄\",\"网\",\"舞\",\"店\",\"喷\",\"纵\",\"寸\",\"汗\",\"挂\",\"洪\",\"贺\",\"闪\",\"柬\",\"爆\",\"烯\",\"津\",\"稻\",\"墙\",\"软\",\"勇\",\"像\",\"滚\",\"厘\",\"蒙\",\"芳\",\"肯\",\"坡\",\"柱\",\"荡\",\"腿\",\"仪\",\"旅\",\"尾\",\"轧\",\"冰\",\"贡\",\"登\",\"黎\",\"削\",\"钻\",\"勒\",\"逃\",\"障\",\"氨\",\"郭\",\"峰\",\"币\",\"港\",\"伏\",\"轨\",\"亩\",\"毕\",\"擦\",\"莫\",\"刺\",\"浪\",\"秘\",\"援\",\"株\",\"健\",\"售\",\"股\",\"岛\",\"甘\",\"泡\",\"睡\",\"童\",\"铸\",\"汤\",\"阀\",\"休\",\"汇\",\"舍\",\"牧\",\"绕\",\"炸\",\"哲\",\"磷\",\"绩\",\"朋\",\"淡\",\"尖\",\"启\",\"陷\",\"柴\",\"呈\",\"徒\",\"颜\",\"泪\",\"稍\",\"忘\",\"泵\",\"蓝\",\"拖\",\"洞\",\"授\",\"镜\",\"辛\",\"壮\",\"锋\",\"贫\",\"虚\",\"弯\",\"摩\",\"泰\",\"幼\",\"廷\",\"尊\",\"窗\",\"纲\",\"弄\",\"隶\",\"疑\",\"氏\",\"宫\",\"姐\",\"震\",\"瑞\",\"怪\",\"尤\",\"琴\",\"循\",\"描\",\"膜\",\"违\",\"夹\",\"腰\",\"缘\",\"珠\",\"穷\",\"森\",\"枝\",\"竹\",\"沟\",\"催\",\"绳\",\"忆\",\"邦\",\"剩\",\"幸\",\"浆\",\"栏\",\"拥\",\"牙\",\"贮\",\"礼\",\"滤\",\"钠\",\"纹\",\"罢\",\"拍\",\"咱\",\"喊\",\"袖\",\"埃\",\"勤\",\"罚\",\"焦\",\"潜\",\"伍\",\"墨\",\"欲\",\"缝\",\"姓\",\"刊\",\"饱\",\"仿\",\"奖\",\"铝\",\"鬼\",\"丽\",\"跨\",\"默\",\"挖\",\"链\",\"扫\",\"喝\",\"袋\",\"炭\",\"污\",\"幕\",\"诸\",\"弧\",\"励\",\"梅\",\"奶\",\"洁\",\"灾\",\"舟\",\"鉴\",\"苯\",\"讼\",\"抱\",\"毁\",\"懂\",\"寒\",\"智\",\"埔\",\"寄\",\"届\",\"跃\",\"渡\",\"挑\",\"丹\",\"艰\",\"贝\",\"碰\",\"拔\",\"爹\",\"戴\",\"码\",\"梦\",\"芽\",\"熔\",\"赤\",\"渔\",\"哭\",\"敬\",\"颗\",\"奔\",\"铅\",\"仲\",\"虎\",\"稀\",\"妹\",\"乏\",\"珍\",\"申\",\"桌\",\"遵\",\"允\",\"隆\",\"螺\",\"仓\",\"魏\",\"锐\",\"晓\",\"氮\",\"兼\",\"隐\",\"碍\",\"赫\",\"拨\",\"忠\",\"肃\",\"缸\",\"牵\",\"抢\",\"博\",\"巧\",\"壳\",\"兄\",\"杜\",\"讯\",\"诚\",\"碧\",\"祥\",\"柯\",\"页\",\"巡\",\"矩\",\"悲\",\"灌\",\"龄\",\"伦\",\"票\",\"寻\",\"桂\",\"铺\",\"圣\",\"恐\",\"恰\",\"郑\",\"趣\",\"抬\",\"荒\",\"腾\",\"贴\",\"柔\",\"滴\",\"猛\",\"阔\",\"辆\",\"妻\",\"填\",\"撤\",\"储\",\"签\",\"闹\",\"扰\",\"紫\",\"砂\",\"递\",\"戏\",\"吊\",\"陶\",\"伐\",\"喂\",\"疗\",\"瓶\",\"婆\",\"抚\",\"臂\",\"摸\",\"忍\",\"虾\",\"蜡\",\"邻\",\"胸\",\"巩\",\"挤\",\"偶\",\"弃\",\"槽\",\"劲\",\"乳\",\"邓\",\"吉\",\"仁\",\"烂\",\"砖\",\"租\",\"乌\",\"舰\",\"伴\",\"瓜\",\"浅\",\"丙\",\"暂\",\"燥\",\"橡\",\"柳\",\"迷\",\"暖\",\"牌\",\"秧\",\"胆\",\"详\",\"簧\",\"踏\",\"瓷\",\"谱\",\"呆\",\"宾\",\"糊\",\"洛\",\"辉\",\"愤\",\"竞\",\"隙\",\"怒\",\"粘\",\"乃\",\"绪\",\"肩\",\"籍\",\"敏\",\"涂\",\"熙\",\"皆\",\"侦\",\"悬\",\"掘\",\"享\",\"纠\",\"醒\",\"狂\",\"锁\",\"淀\",\"恨\",\"牲\",\"霸\",\"爬\",\"赏\",\"逆\",\"玩\",\"陵\",\"祝\",\"秒\",\"浙\",\"貌\",\"役\",\"彼\",\"悉\",\"鸭\",\"趋\",\"凤\",\"晨\",\"畜\",\"辈\",\"秩\",\"卵\",\"署\",\"梯\",\"炎\",\"滩\",\"棋\",\"驱\",\"筛\",\"峡\",\"冒\",\"啥\",\"寿\",\"译\",\"浸\",\"泉\",\"帽\",\"迟\",\"硅\",\"疆\",\"贷\",\"漏\",\"稿\",\"冠\",\"嫩\",\"胁\",\"芯\",\"牢\",\"叛\",\"蚀\",\"奥\",\"鸣\",\"岭\",\"羊\",\"凭\",\"串\",\"塘\",\"绘\",\"酵\",\"融\",\"盆\",\"锡\",\"庙\",\"筹\",\"冻\",\"辅\",\"摄\",\"袭\",\"筋\",\"拒\",\"僚\",\"旱\",\"钾\",\"鸟\",\"漆\",\"沈\",\"眉\",\"疏\",\"添\",\"棒\",\"穗\",\"硝\",\"韩\",\"逼\",\"扭\",\"侨\",\"凉\",\"挺\",\"碗\",\"栽\",\"炒\",\"杯\",\"患\",\"馏\",\"劝\",\"豪\",\"辽\",\"勃\",\"鸿\",\"旦\",\"吏\",\"拜\",\"狗\",\"埋\",\"辊\",\"掩\",\"饮\",\"搬\",\"骂\",\"辞\",\"勾\",\"扣\",\"估\",\"蒋\",\"绒\",\"雾\",\"丈\",\"朵\",\"姆\",\"拟\",\"宇\",\"辑\",\"陕\",\"雕\",\"偿\",\"蓄\",\"崇\",\"剪\",\"倡\",\"厅\",\"咬\",\"驶\",\"薯\",\"刷\",\"斥\",\"番\",\"赋\",\"奉\",\"佛\",\"浇\",\"漫\",\"曼\",\"扇\",\"钙\",\"桃\",\"扶\",\"仔\",\"返\",\"俗\",\"亏\",\"腔\",\"鞋\",\"棱\",\"覆\",\"框\",\"悄\",\"叔\",\"撞\",\"骗\",\"勘\",\"旺\",\"沸\",\"孤\",\"吐\",\"孟\",\"渠\",\"屈\",\"疾\",\"妙\",\"惜\",\"仰\",\"狠\",\"胀\",\"谐\",\"抛\",\"霉\",\"桑\",\"岗\",\"嘛\",\"衰\",\"盗\",\"渗\",\"脏\",\"赖\",\"涌\",\"甜\",\"曹\",\"阅\",\"肌\",\"哩\",\"厉\",\"烃\",\"纬\",\"毅\",\"昨\",\"伪\",\"症\",\"煮\",\"叹\",\"钉\",\"搭\",\"茎\",\"笼\",\"酷\",\"偷\",\"弓\",\"锥\",\"恒\",\"杰\",\"坑\",\"鼻\",\"翼\",\"纶\",\"叙\",\"狱\",\"逮\",\"罐\",\"络\",\"棚\",\"抑\",\"膨\",\"蔬\",\"寺\",\"骤\",\"穆\",\"冶\",\"枯\",\"册\",\"尸\",\"凸\",\"绅\",\"坯\",\"牺\",\"焰\",\"轰\",\"欣\",\"晋\",\"瘦\",\"御\",\"锭\",\"锦\",\"丧\",\"旬\",\"锻\",\"垄\",\"搜\",\"扑\",\"邀\",\"亭\",\"酯\",\"迈\",\"舒\",\"脆\",\"酶\",\"闲\",\"忧\",\"酚\",\"顽\",\"羽\",\"涨\",\"卸\",\"仗\",\"陪\",\"辟\",\"惩\",\"杭\",\"姚\",\"肚\",\"捉\",\"飘\",\"漂\",\"昆\",\"欺\",\"吾\",\"郎\",\"烷\",\"汁\",\"呵\",\"饰\",\"萧\",\"雅\",\"邮\",\"迁\",\"燕\",\"撒\",\"姻\",\"赴\",\"宴\",\"烦\",\"债\",\"帐\",\"斑\",\"铃\",\"旨\",\"醇\",\"董\",\"饼\",\"雏\",\"姿\",\"拌\",\"傅\",\"腹\",\"妥\",\"揉\",\"贤\",\"拆\",\"歪\",\"葡\",\"胺\",\"丢\",\"浩\",\"徽\",\"昂\",\"垫\",\"挡\",\"览\",\"贪\",\"慰\",\"缴\",\"汪\",\"慌\",\"冯\",\"诺\",\"姜\",\"谊\",\"凶\",\"劣\",\"诬\",\"耀\",\"昏\",\"躺\",\"盈\",\"骑\",\"乔\",\"溪\",\"丛\",\"卢\",\"抹\",\"闷\",\"咨\",\"刮\",\"驾\",\"缆\",\"悟\",\"摘\",\"铒\",\"掷\",\"颇\",\"幻\",\"柄\",\"惠\",\"惨\",\"佳\",\"仇\",\"腊\",\"窝\",\"涤\",\"剑\",\"瞧\",\"堡\",\"泼\",\"葱\",\"罩\",\"霍\",\"捞\",\"胎\",\"苍\",\"滨\",\"俩\",\"捅\",\"湘\",\"砍\",\"霞\",\"邵\",\"萄\",\"疯\",\"淮\",\"遂\",\"熊\",\"粪\",\"烘\",\"宿\",\"档\",\"戈\",\"驳\",\"嫂\",\"裕\",\"徙\",\"箭\",\"捐\",\"肠\",\"撑\",\"晒\",\"辨\",\"殿\",\"莲\",\"摊\",\"搅\",\"酱\",\"屏\",\"疫\",\"哀\",\"蔡\",\"堵\",\"沫\",\"皱\",\"畅\",\"叠\",\"阁\",\"莱\",\"敲\",\"辖\",\"钩\",\"痕\",\"坝\",\"巷\",\"饿\",\"祸\",\"丘\",\"玄\",\"溜\",\"曰\",\"逻\",\"彭\",\"尝\",\"卿\",\"妨\",\"艇\",\"吞\",\"韦\",\"怨\",\"矮\",\"歇\"]");

/***/ }),

/***/ 729:
/***/ (function(module) {

module.exports = JSON.parse("[\"的\",\"一\",\"是\",\"在\",\"不\",\"了\",\"有\",\"和\",\"人\",\"這\",\"中\",\"大\",\"為\",\"上\",\"個\",\"國\",\"我\",\"以\",\"要\",\"他\",\"時\",\"來\",\"用\",\"們\",\"生\",\"到\",\"作\",\"地\",\"於\",\"出\",\"就\",\"分\",\"對\",\"成\",\"會\",\"可\",\"主\",\"發\",\"年\",\"動\",\"同\",\"工\",\"也\",\"能\",\"下\",\"過\",\"子\",\"說\",\"產\",\"種\",\"面\",\"而\",\"方\",\"後\",\"多\",\"定\",\"行\",\"學\",\"法\",\"所\",\"民\",\"得\",\"經\",\"十\",\"三\",\"之\",\"進\",\"著\",\"等\",\"部\",\"度\",\"家\",\"電\",\"力\",\"裡\",\"如\",\"水\",\"化\",\"高\",\"自\",\"二\",\"理\",\"起\",\"小\",\"物\",\"現\",\"實\",\"加\",\"量\",\"都\",\"兩\",\"體\",\"制\",\"機\",\"當\",\"使\",\"點\",\"從\",\"業\",\"本\",\"去\",\"把\",\"性\",\"好\",\"應\",\"開\",\"它\",\"合\",\"還\",\"因\",\"由\",\"其\",\"些\",\"然\",\"前\",\"外\",\"天\",\"政\",\"四\",\"日\",\"那\",\"社\",\"義\",\"事\",\"平\",\"形\",\"相\",\"全\",\"表\",\"間\",\"樣\",\"與\",\"關\",\"各\",\"重\",\"新\",\"線\",\"內\",\"數\",\"正\",\"心\",\"反\",\"你\",\"明\",\"看\",\"原\",\"又\",\"麼\",\"利\",\"比\",\"或\",\"但\",\"質\",\"氣\",\"第\",\"向\",\"道\",\"命\",\"此\",\"變\",\"條\",\"只\",\"沒\",\"結\",\"解\",\"問\",\"意\",\"建\",\"月\",\"公\",\"無\",\"系\",\"軍\",\"很\",\"情\",\"者\",\"最\",\"立\",\"代\",\"想\",\"已\",\"通\",\"並\",\"提\",\"直\",\"題\",\"黨\",\"程\",\"展\",\"五\",\"果\",\"料\",\"象\",\"員\",\"革\",\"位\",\"入\",\"常\",\"文\",\"總\",\"次\",\"品\",\"式\",\"活\",\"設\",\"及\",\"管\",\"特\",\"件\",\"長\",\"求\",\"老\",\"頭\",\"基\",\"資\",\"邊\",\"流\",\"路\",\"級\",\"少\",\"圖\",\"山\",\"統\",\"接\",\"知\",\"較\",\"將\",\"組\",\"見\",\"計\",\"別\",\"她\",\"手\",\"角\",\"期\",\"根\",\"論\",\"運\",\"農\",\"指\",\"幾\",\"九\",\"區\",\"強\",\"放\",\"決\",\"西\",\"被\",\"幹\",\"做\",\"必\",\"戰\",\"先\",\"回\",\"則\",\"任\",\"取\",\"據\",\"處\",\"隊\",\"南\",\"給\",\"色\",\"光\",\"門\",\"即\",\"保\",\"治\",\"北\",\"造\",\"百\",\"規\",\"熱\",\"領\",\"七\",\"海\",\"口\",\"東\",\"導\",\"器\",\"壓\",\"志\",\"世\",\"金\",\"增\",\"爭\",\"濟\",\"階\",\"油\",\"思\",\"術\",\"極\",\"交\",\"受\",\"聯\",\"什\",\"認\",\"六\",\"共\",\"權\",\"收\",\"證\",\"改\",\"清\",\"美\",\"再\",\"採\",\"轉\",\"更\",\"單\",\"風\",\"切\",\"打\",\"白\",\"教\",\"速\",\"花\",\"帶\",\"安\",\"場\",\"身\",\"車\",\"例\",\"真\",\"務\",\"具\",\"萬\",\"每\",\"目\",\"至\",\"達\",\"走\",\"積\",\"示\",\"議\",\"聲\",\"報\",\"鬥\",\"完\",\"類\",\"八\",\"離\",\"華\",\"名\",\"確\",\"才\",\"科\",\"張\",\"信\",\"馬\",\"節\",\"話\",\"米\",\"整\",\"空\",\"元\",\"況\",\"今\",\"集\",\"溫\",\"傳\",\"土\",\"許\",\"步\",\"群\",\"廣\",\"石\",\"記\",\"需\",\"段\",\"研\",\"界\",\"拉\",\"林\",\"律\",\"叫\",\"且\",\"究\",\"觀\",\"越\",\"織\",\"裝\",\"影\",\"算\",\"低\",\"持\",\"音\",\"眾\",\"書\",\"布\",\"复\",\"容\",\"兒\",\"須\",\"際\",\"商\",\"非\",\"驗\",\"連\",\"斷\",\"深\",\"難\",\"近\",\"礦\",\"千\",\"週\",\"委\",\"素\",\"技\",\"備\",\"半\",\"辦\",\"青\",\"省\",\"列\",\"習\",\"響\",\"約\",\"支\",\"般\",\"史\",\"感\",\"勞\",\"便\",\"團\",\"往\",\"酸\",\"歷\",\"市\",\"克\",\"何\",\"除\",\"消\",\"構\",\"府\",\"稱\",\"太\",\"準\",\"精\",\"值\",\"號\",\"率\",\"族\",\"維\",\"劃\",\"選\",\"標\",\"寫\",\"存\",\"候\",\"毛\",\"親\",\"快\",\"效\",\"斯\",\"院\",\"查\",\"江\",\"型\",\"眼\",\"王\",\"按\",\"格\",\"養\",\"易\",\"置\",\"派\",\"層\",\"片\",\"始\",\"卻\",\"專\",\"狀\",\"育\",\"廠\",\"京\",\"識\",\"適\",\"屬\",\"圓\",\"包\",\"火\",\"住\",\"調\",\"滿\",\"縣\",\"局\",\"照\",\"參\",\"紅\",\"細\",\"引\",\"聽\",\"該\",\"鐵\",\"價\",\"嚴\",\"首\",\"底\",\"液\",\"官\",\"德\",\"隨\",\"病\",\"蘇\",\"失\",\"爾\",\"死\",\"講\",\"配\",\"女\",\"黃\",\"推\",\"顯\",\"談\",\"罪\",\"神\",\"藝\",\"呢\",\"席\",\"含\",\"企\",\"望\",\"密\",\"批\",\"營\",\"項\",\"防\",\"舉\",\"球\",\"英\",\"氧\",\"勢\",\"告\",\"李\",\"台\",\"落\",\"木\",\"幫\",\"輪\",\"破\",\"亞\",\"師\",\"圍\",\"注\",\"遠\",\"字\",\"材\",\"排\",\"供\",\"河\",\"態\",\"封\",\"另\",\"施\",\"減\",\"樹\",\"溶\",\"怎\",\"止\",\"案\",\"言\",\"士\",\"均\",\"武\",\"固\",\"葉\",\"魚\",\"波\",\"視\",\"僅\",\"費\",\"緊\",\"愛\",\"左\",\"章\",\"早\",\"朝\",\"害\",\"續\",\"輕\",\"服\",\"試\",\"食\",\"充\",\"兵\",\"源\",\"判\",\"護\",\"司\",\"足\",\"某\",\"練\",\"差\",\"致\",\"板\",\"田\",\"降\",\"黑\",\"犯\",\"負\",\"擊\",\"范\",\"繼\",\"興\",\"似\",\"餘\",\"堅\",\"曲\",\"輸\",\"修\",\"故\",\"城\",\"夫\",\"夠\",\"送\",\"筆\",\"船\",\"佔\",\"右\",\"財\",\"吃\",\"富\",\"春\",\"職\",\"覺\",\"漢\",\"畫\",\"功\",\"巴\",\"跟\",\"雖\",\"雜\",\"飛\",\"檢\",\"吸\",\"助\",\"昇\",\"陽\",\"互\",\"初\",\"創\",\"抗\",\"考\",\"投\",\"壞\",\"策\",\"古\",\"徑\",\"換\",\"未\",\"跑\",\"留\",\"鋼\",\"曾\",\"端\",\"責\",\"站\",\"簡\",\"述\",\"錢\",\"副\",\"盡\",\"帝\",\"射\",\"草\",\"衝\",\"承\",\"獨\",\"令\",\"限\",\"阿\",\"宣\",\"環\",\"雙\",\"請\",\"超\",\"微\",\"讓\",\"控\",\"州\",\"良\",\"軸\",\"找\",\"否\",\"紀\",\"益\",\"依\",\"優\",\"頂\",\"礎\",\"載\",\"倒\",\"房\",\"突\",\"坐\",\"粉\",\"敵\",\"略\",\"客\",\"袁\",\"冷\",\"勝\",\"絕\",\"析\",\"塊\",\"劑\",\"測\",\"絲\",\"協\",\"訴\",\"念\",\"陳\",\"仍\",\"羅\",\"鹽\",\"友\",\"洋\",\"錯\",\"苦\",\"夜\",\"刑\",\"移\",\"頻\",\"逐\",\"靠\",\"混\",\"母\",\"短\",\"皮\",\"終\",\"聚\",\"汽\",\"村\",\"雲\",\"哪\",\"既\",\"距\",\"衛\",\"停\",\"烈\",\"央\",\"察\",\"燒\",\"迅\",\"境\",\"若\",\"印\",\"洲\",\"刻\",\"括\",\"激\",\"孔\",\"搞\",\"甚\",\"室\",\"待\",\"核\",\"校\",\"散\",\"侵\",\"吧\",\"甲\",\"遊\",\"久\",\"菜\",\"味\",\"舊\",\"模\",\"湖\",\"貨\",\"損\",\"預\",\"阻\",\"毫\",\"普\",\"穩\",\"乙\",\"媽\",\"植\",\"息\",\"擴\",\"銀\",\"語\",\"揮\",\"酒\",\"守\",\"拿\",\"序\",\"紙\",\"醫\",\"缺\",\"雨\",\"嗎\",\"針\",\"劉\",\"啊\",\"急\",\"唱\",\"誤\",\"訓\",\"願\",\"審\",\"附\",\"獲\",\"茶\",\"鮮\",\"糧\",\"斤\",\"孩\",\"脫\",\"硫\",\"肥\",\"善\",\"龍\",\"演\",\"父\",\"漸\",\"血\",\"歡\",\"械\",\"掌\",\"歌\",\"沙\",\"剛\",\"攻\",\"謂\",\"盾\",\"討\",\"晚\",\"粒\",\"亂\",\"燃\",\"矛\",\"乎\",\"殺\",\"藥\",\"寧\",\"魯\",\"貴\",\"鐘\",\"煤\",\"讀\",\"班\",\"伯\",\"香\",\"介\",\"迫\",\"句\",\"豐\",\"培\",\"握\",\"蘭\",\"擔\",\"弦\",\"蛋\",\"沉\",\"假\",\"穿\",\"執\",\"答\",\"樂\",\"誰\",\"順\",\"煙\",\"縮\",\"徵\",\"臉\",\"喜\",\"松\",\"腳\",\"困\",\"異\",\"免\",\"背\",\"星\",\"福\",\"買\",\"染\",\"井\",\"概\",\"慢\",\"怕\",\"磁\",\"倍\",\"祖\",\"皇\",\"促\",\"靜\",\"補\",\"評\",\"翻\",\"肉\",\"踐\",\"尼\",\"衣\",\"寬\",\"揚\",\"棉\",\"希\",\"傷\",\"操\",\"垂\",\"秋\",\"宜\",\"氫\",\"套\",\"督\",\"振\",\"架\",\"亮\",\"末\",\"憲\",\"慶\",\"編\",\"牛\",\"觸\",\"映\",\"雷\",\"銷\",\"詩\",\"座\",\"居\",\"抓\",\"裂\",\"胞\",\"呼\",\"娘\",\"景\",\"威\",\"綠\",\"晶\",\"厚\",\"盟\",\"衡\",\"雞\",\"孫\",\"延\",\"危\",\"膠\",\"屋\",\"鄉\",\"臨\",\"陸\",\"顧\",\"掉\",\"呀\",\"燈\",\"歲\",\"措\",\"束\",\"耐\",\"劇\",\"玉\",\"趙\",\"跳\",\"哥\",\"季\",\"課\",\"凱\",\"胡\",\"額\",\"款\",\"紹\",\"卷\",\"齊\",\"偉\",\"蒸\",\"殖\",\"永\",\"宗\",\"苗\",\"川\",\"爐\",\"岩\",\"弱\",\"零\",\"楊\",\"奏\",\"沿\",\"露\",\"桿\",\"探\",\"滑\",\"鎮\",\"飯\",\"濃\",\"航\",\"懷\",\"趕\",\"庫\",\"奪\",\"伊\",\"靈\",\"稅\",\"途\",\"滅\",\"賽\",\"歸\",\"召\",\"鼓\",\"播\",\"盤\",\"裁\",\"險\",\"康\",\"唯\",\"錄\",\"菌\",\"純\",\"借\",\"糖\",\"蓋\",\"橫\",\"符\",\"私\",\"努\",\"堂\",\"域\",\"槍\",\"潤\",\"幅\",\"哈\",\"竟\",\"熟\",\"蟲\",\"澤\",\"腦\",\"壤\",\"碳\",\"歐\",\"遍\",\"側\",\"寨\",\"敢\",\"徹\",\"慮\",\"斜\",\"薄\",\"庭\",\"納\",\"彈\",\"飼\",\"伸\",\"折\",\"麥\",\"濕\",\"暗\",\"荷\",\"瓦\",\"塞\",\"床\",\"築\",\"惡\",\"戶\",\"訪\",\"塔\",\"奇\",\"透\",\"梁\",\"刀\",\"旋\",\"跡\",\"卡\",\"氯\",\"遇\",\"份\",\"毒\",\"泥\",\"退\",\"洗\",\"擺\",\"灰\",\"彩\",\"賣\",\"耗\",\"夏\",\"擇\",\"忙\",\"銅\",\"獻\",\"硬\",\"予\",\"繁\",\"圈\",\"雪\",\"函\",\"亦\",\"抽\",\"篇\",\"陣\",\"陰\",\"丁\",\"尺\",\"追\",\"堆\",\"雄\",\"迎\",\"泛\",\"爸\",\"樓\",\"避\",\"謀\",\"噸\",\"野\",\"豬\",\"旗\",\"累\",\"偏\",\"典\",\"館\",\"索\",\"秦\",\"脂\",\"潮\",\"爺\",\"豆\",\"忽\",\"托\",\"驚\",\"塑\",\"遺\",\"愈\",\"朱\",\"替\",\"纖\",\"粗\",\"傾\",\"尚\",\"痛\",\"楚\",\"謝\",\"奮\",\"購\",\"磨\",\"君\",\"池\",\"旁\",\"碎\",\"骨\",\"監\",\"捕\",\"弟\",\"暴\",\"割\",\"貫\",\"殊\",\"釋\",\"詞\",\"亡\",\"壁\",\"頓\",\"寶\",\"午\",\"塵\",\"聞\",\"揭\",\"炮\",\"殘\",\"冬\",\"橋\",\"婦\",\"警\",\"綜\",\"招\",\"吳\",\"付\",\"浮\",\"遭\",\"徐\",\"您\",\"搖\",\"谷\",\"贊\",\"箱\",\"隔\",\"訂\",\"男\",\"吹\",\"園\",\"紛\",\"唐\",\"敗\",\"宋\",\"玻\",\"巨\",\"耕\",\"坦\",\"榮\",\"閉\",\"灣\",\"鍵\",\"凡\",\"駐\",\"鍋\",\"救\",\"恩\",\"剝\",\"凝\",\"鹼\",\"齒\",\"截\",\"煉\",\"麻\",\"紡\",\"禁\",\"廢\",\"盛\",\"版\",\"緩\",\"淨\",\"睛\",\"昌\",\"婚\",\"涉\",\"筒\",\"嘴\",\"插\",\"岸\",\"朗\",\"莊\",\"街\",\"藏\",\"姑\",\"貿\",\"腐\",\"奴\",\"啦\",\"慣\",\"乘\",\"夥\",\"恢\",\"勻\",\"紗\",\"扎\",\"辯\",\"耳\",\"彪\",\"臣\",\"億\",\"璃\",\"抵\",\"脈\",\"秀\",\"薩\",\"俄\",\"網\",\"舞\",\"店\",\"噴\",\"縱\",\"寸\",\"汗\",\"掛\",\"洪\",\"賀\",\"閃\",\"柬\",\"爆\",\"烯\",\"津\",\"稻\",\"牆\",\"軟\",\"勇\",\"像\",\"滾\",\"厘\",\"蒙\",\"芳\",\"肯\",\"坡\",\"柱\",\"盪\",\"腿\",\"儀\",\"旅\",\"尾\",\"軋\",\"冰\",\"貢\",\"登\",\"黎\",\"削\",\"鑽\",\"勒\",\"逃\",\"障\",\"氨\",\"郭\",\"峰\",\"幣\",\"港\",\"伏\",\"軌\",\"畝\",\"畢\",\"擦\",\"莫\",\"刺\",\"浪\",\"秘\",\"援\",\"株\",\"健\",\"售\",\"股\",\"島\",\"甘\",\"泡\",\"睡\",\"童\",\"鑄\",\"湯\",\"閥\",\"休\",\"匯\",\"舍\",\"牧\",\"繞\",\"炸\",\"哲\",\"磷\",\"績\",\"朋\",\"淡\",\"尖\",\"啟\",\"陷\",\"柴\",\"呈\",\"徒\",\"顏\",\"淚\",\"稍\",\"忘\",\"泵\",\"藍\",\"拖\",\"洞\",\"授\",\"鏡\",\"辛\",\"壯\",\"鋒\",\"貧\",\"虛\",\"彎\",\"摩\",\"泰\",\"幼\",\"廷\",\"尊\",\"窗\",\"綱\",\"弄\",\"隸\",\"疑\",\"氏\",\"宮\",\"姐\",\"震\",\"瑞\",\"怪\",\"尤\",\"琴\",\"循\",\"描\",\"膜\",\"違\",\"夾\",\"腰\",\"緣\",\"珠\",\"窮\",\"森\",\"枝\",\"竹\",\"溝\",\"催\",\"繩\",\"憶\",\"邦\",\"剩\",\"幸\",\"漿\",\"欄\",\"擁\",\"牙\",\"貯\",\"禮\",\"濾\",\"鈉\",\"紋\",\"罷\",\"拍\",\"咱\",\"喊\",\"袖\",\"埃\",\"勤\",\"罰\",\"焦\",\"潛\",\"伍\",\"墨\",\"欲\",\"縫\",\"姓\",\"刊\",\"飽\",\"仿\",\"獎\",\"鋁\",\"鬼\",\"麗\",\"跨\",\"默\",\"挖\",\"鏈\",\"掃\",\"喝\",\"袋\",\"炭\",\"污\",\"幕\",\"諸\",\"弧\",\"勵\",\"梅\",\"奶\",\"潔\",\"災\",\"舟\",\"鑑\",\"苯\",\"訟\",\"抱\",\"毀\",\"懂\",\"寒\",\"智\",\"埔\",\"寄\",\"屆\",\"躍\",\"渡\",\"挑\",\"丹\",\"艱\",\"貝\",\"碰\",\"拔\",\"爹\",\"戴\",\"碼\",\"夢\",\"芽\",\"熔\",\"赤\",\"漁\",\"哭\",\"敬\",\"顆\",\"奔\",\"鉛\",\"仲\",\"虎\",\"稀\",\"妹\",\"乏\",\"珍\",\"申\",\"桌\",\"遵\",\"允\",\"隆\",\"螺\",\"倉\",\"魏\",\"銳\",\"曉\",\"氮\",\"兼\",\"隱\",\"礙\",\"赫\",\"撥\",\"忠\",\"肅\",\"缸\",\"牽\",\"搶\",\"博\",\"巧\",\"殼\",\"兄\",\"杜\",\"訊\",\"誠\",\"碧\",\"祥\",\"柯\",\"頁\",\"巡\",\"矩\",\"悲\",\"灌\",\"齡\",\"倫\",\"票\",\"尋\",\"桂\",\"鋪\",\"聖\",\"恐\",\"恰\",\"鄭\",\"趣\",\"抬\",\"荒\",\"騰\",\"貼\",\"柔\",\"滴\",\"猛\",\"闊\",\"輛\",\"妻\",\"填\",\"撤\",\"儲\",\"簽\",\"鬧\",\"擾\",\"紫\",\"砂\",\"遞\",\"戲\",\"吊\",\"陶\",\"伐\",\"餵\",\"療\",\"瓶\",\"婆\",\"撫\",\"臂\",\"摸\",\"忍\",\"蝦\",\"蠟\",\"鄰\",\"胸\",\"鞏\",\"擠\",\"偶\",\"棄\",\"槽\",\"勁\",\"乳\",\"鄧\",\"吉\",\"仁\",\"爛\",\"磚\",\"租\",\"烏\",\"艦\",\"伴\",\"瓜\",\"淺\",\"丙\",\"暫\",\"燥\",\"橡\",\"柳\",\"迷\",\"暖\",\"牌\",\"秧\",\"膽\",\"詳\",\"簧\",\"踏\",\"瓷\",\"譜\",\"呆\",\"賓\",\"糊\",\"洛\",\"輝\",\"憤\",\"競\",\"隙\",\"怒\",\"粘\",\"乃\",\"緒\",\"肩\",\"籍\",\"敏\",\"塗\",\"熙\",\"皆\",\"偵\",\"懸\",\"掘\",\"享\",\"糾\",\"醒\",\"狂\",\"鎖\",\"淀\",\"恨\",\"牲\",\"霸\",\"爬\",\"賞\",\"逆\",\"玩\",\"陵\",\"祝\",\"秒\",\"浙\",\"貌\",\"役\",\"彼\",\"悉\",\"鴨\",\"趨\",\"鳳\",\"晨\",\"畜\",\"輩\",\"秩\",\"卵\",\"署\",\"梯\",\"炎\",\"灘\",\"棋\",\"驅\",\"篩\",\"峽\",\"冒\",\"啥\",\"壽\",\"譯\",\"浸\",\"泉\",\"帽\",\"遲\",\"矽\",\"疆\",\"貸\",\"漏\",\"稿\",\"冠\",\"嫩\",\"脅\",\"芯\",\"牢\",\"叛\",\"蝕\",\"奧\",\"鳴\",\"嶺\",\"羊\",\"憑\",\"串\",\"塘\",\"繪\",\"酵\",\"融\",\"盆\",\"錫\",\"廟\",\"籌\",\"凍\",\"輔\",\"攝\",\"襲\",\"筋\",\"拒\",\"僚\",\"旱\",\"鉀\",\"鳥\",\"漆\",\"沈\",\"眉\",\"疏\",\"添\",\"棒\",\"穗\",\"硝\",\"韓\",\"逼\",\"扭\",\"僑\",\"涼\",\"挺\",\"碗\",\"栽\",\"炒\",\"杯\",\"患\",\"餾\",\"勸\",\"豪\",\"遼\",\"勃\",\"鴻\",\"旦\",\"吏\",\"拜\",\"狗\",\"埋\",\"輥\",\"掩\",\"飲\",\"搬\",\"罵\",\"辭\",\"勾\",\"扣\",\"估\",\"蔣\",\"絨\",\"霧\",\"丈\",\"朵\",\"姆\",\"擬\",\"宇\",\"輯\",\"陝\",\"雕\",\"償\",\"蓄\",\"崇\",\"剪\",\"倡\",\"廳\",\"咬\",\"駛\",\"薯\",\"刷\",\"斥\",\"番\",\"賦\",\"奉\",\"佛\",\"澆\",\"漫\",\"曼\",\"扇\",\"鈣\",\"桃\",\"扶\",\"仔\",\"返\",\"俗\",\"虧\",\"腔\",\"鞋\",\"棱\",\"覆\",\"框\",\"悄\",\"叔\",\"撞\",\"騙\",\"勘\",\"旺\",\"沸\",\"孤\",\"吐\",\"孟\",\"渠\",\"屈\",\"疾\",\"妙\",\"惜\",\"仰\",\"狠\",\"脹\",\"諧\",\"拋\",\"黴\",\"桑\",\"崗\",\"嘛\",\"衰\",\"盜\",\"滲\",\"臟\",\"賴\",\"湧\",\"甜\",\"曹\",\"閱\",\"肌\",\"哩\",\"厲\",\"烴\",\"緯\",\"毅\",\"昨\",\"偽\",\"症\",\"煮\",\"嘆\",\"釘\",\"搭\",\"莖\",\"籠\",\"酷\",\"偷\",\"弓\",\"錐\",\"恆\",\"傑\",\"坑\",\"鼻\",\"翼\",\"綸\",\"敘\",\"獄\",\"逮\",\"罐\",\"絡\",\"棚\",\"抑\",\"膨\",\"蔬\",\"寺\",\"驟\",\"穆\",\"冶\",\"枯\",\"冊\",\"屍\",\"凸\",\"紳\",\"坯\",\"犧\",\"焰\",\"轟\",\"欣\",\"晉\",\"瘦\",\"禦\",\"錠\",\"錦\",\"喪\",\"旬\",\"鍛\",\"壟\",\"搜\",\"撲\",\"邀\",\"亭\",\"酯\",\"邁\",\"舒\",\"脆\",\"酶\",\"閒\",\"憂\",\"酚\",\"頑\",\"羽\",\"漲\",\"卸\",\"仗\",\"陪\",\"闢\",\"懲\",\"杭\",\"姚\",\"肚\",\"捉\",\"飄\",\"漂\",\"昆\",\"欺\",\"吾\",\"郎\",\"烷\",\"汁\",\"呵\",\"飾\",\"蕭\",\"雅\",\"郵\",\"遷\",\"燕\",\"撒\",\"姻\",\"赴\",\"宴\",\"煩\",\"債\",\"帳\",\"斑\",\"鈴\",\"旨\",\"醇\",\"董\",\"餅\",\"雛\",\"姿\",\"拌\",\"傅\",\"腹\",\"妥\",\"揉\",\"賢\",\"拆\",\"歪\",\"葡\",\"胺\",\"丟\",\"浩\",\"徽\",\"昂\",\"墊\",\"擋\",\"覽\",\"貪\",\"慰\",\"繳\",\"汪\",\"慌\",\"馮\",\"諾\",\"姜\",\"誼\",\"兇\",\"劣\",\"誣\",\"耀\",\"昏\",\"躺\",\"盈\",\"騎\",\"喬\",\"溪\",\"叢\",\"盧\",\"抹\",\"悶\",\"諮\",\"刮\",\"駕\",\"纜\",\"悟\",\"摘\",\"鉺\",\"擲\",\"頗\",\"幻\",\"柄\",\"惠\",\"慘\",\"佳\",\"仇\",\"臘\",\"窩\",\"滌\",\"劍\",\"瞧\",\"堡\",\"潑\",\"蔥\",\"罩\",\"霍\",\"撈\",\"胎\",\"蒼\",\"濱\",\"倆\",\"捅\",\"湘\",\"砍\",\"霞\",\"邵\",\"萄\",\"瘋\",\"淮\",\"遂\",\"熊\",\"糞\",\"烘\",\"宿\",\"檔\",\"戈\",\"駁\",\"嫂\",\"裕\",\"徙\",\"箭\",\"捐\",\"腸\",\"撐\",\"曬\",\"辨\",\"殿\",\"蓮\",\"攤\",\"攪\",\"醬\",\"屏\",\"疫\",\"哀\",\"蔡\",\"堵\",\"沫\",\"皺\",\"暢\",\"疊\",\"閣\",\"萊\",\"敲\",\"轄\",\"鉤\",\"痕\",\"壩\",\"巷\",\"餓\",\"禍\",\"丘\",\"玄\",\"溜\",\"曰\",\"邏\",\"彭\",\"嘗\",\"卿\",\"妨\",\"艇\",\"吞\",\"韋\",\"怨\",\"矮\",\"歇\"]");

/***/ }),

/***/ 730:
/***/ (function(module) {

module.exports = JSON.parse("[\"가격\",\"가끔\",\"가난\",\"가능\",\"가득\",\"가르침\",\"가뭄\",\"가방\",\"가상\",\"가슴\",\"가운데\",\"가을\",\"가이드\",\"가입\",\"가장\",\"가정\",\"가족\",\"가죽\",\"각오\",\"각자\",\"간격\",\"간부\",\"간섭\",\"간장\",\"간접\",\"간판\",\"갈등\",\"갈비\",\"갈색\",\"갈증\",\"감각\",\"감기\",\"감소\",\"감수성\",\"감자\",\"감정\",\"갑자기\",\"강남\",\"강당\",\"강도\",\"강력히\",\"강변\",\"강북\",\"강사\",\"강수량\",\"강아지\",\"강원도\",\"강의\",\"강제\",\"강조\",\"같이\",\"개구리\",\"개나리\",\"개방\",\"개별\",\"개선\",\"개성\",\"개인\",\"객관적\",\"거실\",\"거액\",\"거울\",\"거짓\",\"거품\",\"걱정\",\"건강\",\"건물\",\"건설\",\"건조\",\"건축\",\"걸음\",\"검사\",\"검토\",\"게시판\",\"게임\",\"겨울\",\"견해\",\"결과\",\"결국\",\"결론\",\"결석\",\"결승\",\"결심\",\"결정\",\"결혼\",\"경계\",\"경고\",\"경기\",\"경력\",\"경복궁\",\"경비\",\"경상도\",\"경영\",\"경우\",\"경쟁\",\"경제\",\"경주\",\"경찰\",\"경치\",\"경향\",\"경험\",\"계곡\",\"계단\",\"계란\",\"계산\",\"계속\",\"계약\",\"계절\",\"계층\",\"계획\",\"고객\",\"고구려\",\"고궁\",\"고급\",\"고등학생\",\"고무신\",\"고민\",\"고양이\",\"고장\",\"고전\",\"고집\",\"고춧가루\",\"고통\",\"고향\",\"곡식\",\"골목\",\"골짜기\",\"골프\",\"공간\",\"공개\",\"공격\",\"공군\",\"공급\",\"공기\",\"공동\",\"공무원\",\"공부\",\"공사\",\"공식\",\"공업\",\"공연\",\"공원\",\"공장\",\"공짜\",\"공책\",\"공통\",\"공포\",\"공항\",\"공휴일\",\"과목\",\"과일\",\"과장\",\"과정\",\"과학\",\"관객\",\"관계\",\"관광\",\"관념\",\"관람\",\"관련\",\"관리\",\"관습\",\"관심\",\"관점\",\"관찰\",\"광경\",\"광고\",\"광장\",\"광주\",\"괴로움\",\"굉장히\",\"교과서\",\"교문\",\"교복\",\"교실\",\"교양\",\"교육\",\"교장\",\"교직\",\"교통\",\"교환\",\"교훈\",\"구경\",\"구름\",\"구멍\",\"구별\",\"구분\",\"구석\",\"구성\",\"구속\",\"구역\",\"구입\",\"구청\",\"구체적\",\"국가\",\"국기\",\"국내\",\"국립\",\"국물\",\"국민\",\"국수\",\"국어\",\"국왕\",\"국적\",\"국제\",\"국회\",\"군대\",\"군사\",\"군인\",\"궁극적\",\"권리\",\"권위\",\"권투\",\"귀국\",\"귀신\",\"규정\",\"규칙\",\"균형\",\"그날\",\"그냥\",\"그늘\",\"그러나\",\"그룹\",\"그릇\",\"그림\",\"그제서야\",\"그토록\",\"극복\",\"극히\",\"근거\",\"근교\",\"근래\",\"근로\",\"근무\",\"근본\",\"근원\",\"근육\",\"근처\",\"글씨\",\"글자\",\"금강산\",\"금고\",\"금년\",\"금메달\",\"금액\",\"금연\",\"금요일\",\"금지\",\"긍정적\",\"기간\",\"기관\",\"기념\",\"기능\",\"기독교\",\"기둥\",\"기록\",\"기름\",\"기법\",\"기본\",\"기분\",\"기쁨\",\"기숙사\",\"기술\",\"기억\",\"기업\",\"기온\",\"기운\",\"기원\",\"기적\",\"기준\",\"기침\",\"기혼\",\"기획\",\"긴급\",\"긴장\",\"길이\",\"김밥\",\"김치\",\"김포공항\",\"깍두기\",\"깜빡\",\"깨달음\",\"깨소금\",\"껍질\",\"꼭대기\",\"꽃잎\",\"나들이\",\"나란히\",\"나머지\",\"나물\",\"나침반\",\"나흘\",\"낙엽\",\"난방\",\"날개\",\"날씨\",\"날짜\",\"남녀\",\"남대문\",\"남매\",\"남산\",\"남자\",\"남편\",\"남학생\",\"낭비\",\"낱말\",\"내년\",\"내용\",\"내일\",\"냄비\",\"냄새\",\"냇물\",\"냉동\",\"냉면\",\"냉방\",\"냉장고\",\"넥타이\",\"넷째\",\"노동\",\"노란색\",\"노력\",\"노인\",\"녹음\",\"녹차\",\"녹화\",\"논리\",\"논문\",\"논쟁\",\"놀이\",\"농구\",\"농담\",\"농민\",\"농부\",\"농업\",\"농장\",\"농촌\",\"높이\",\"눈동자\",\"눈물\",\"눈썹\",\"뉴욕\",\"느낌\",\"늑대\",\"능동적\",\"능력\",\"다방\",\"다양성\",\"다음\",\"다이어트\",\"다행\",\"단계\",\"단골\",\"단독\",\"단맛\",\"단순\",\"단어\",\"단위\",\"단점\",\"단체\",\"단추\",\"단편\",\"단풍\",\"달걀\",\"달러\",\"달력\",\"달리\",\"닭고기\",\"담당\",\"담배\",\"담요\",\"담임\",\"답변\",\"답장\",\"당근\",\"당분간\",\"당연히\",\"당장\",\"대규모\",\"대낮\",\"대단히\",\"대답\",\"대도시\",\"대략\",\"대량\",\"대륙\",\"대문\",\"대부분\",\"대신\",\"대응\",\"대장\",\"대전\",\"대접\",\"대중\",\"대책\",\"대출\",\"대충\",\"대통령\",\"대학\",\"대한민국\",\"대합실\",\"대형\",\"덩어리\",\"데이트\",\"도대체\",\"도덕\",\"도둑\",\"도망\",\"도서관\",\"도심\",\"도움\",\"도입\",\"도자기\",\"도저히\",\"도전\",\"도중\",\"도착\",\"독감\",\"독립\",\"독서\",\"독일\",\"독창적\",\"동화책\",\"뒷모습\",\"뒷산\",\"딸아이\",\"마누라\",\"마늘\",\"마당\",\"마라톤\",\"마련\",\"마무리\",\"마사지\",\"마약\",\"마요네즈\",\"마을\",\"마음\",\"마이크\",\"마중\",\"마지막\",\"마찬가지\",\"마찰\",\"마흔\",\"막걸리\",\"막내\",\"막상\",\"만남\",\"만두\",\"만세\",\"만약\",\"만일\",\"만점\",\"만족\",\"만화\",\"많이\",\"말기\",\"말씀\",\"말투\",\"맘대로\",\"망원경\",\"매년\",\"매달\",\"매력\",\"매번\",\"매스컴\",\"매일\",\"매장\",\"맥주\",\"먹이\",\"먼저\",\"먼지\",\"멀리\",\"메일\",\"며느리\",\"며칠\",\"면담\",\"멸치\",\"명단\",\"명령\",\"명예\",\"명의\",\"명절\",\"명칭\",\"명함\",\"모금\",\"모니터\",\"모델\",\"모든\",\"모범\",\"모습\",\"모양\",\"모임\",\"모조리\",\"모집\",\"모퉁이\",\"목걸이\",\"목록\",\"목사\",\"목소리\",\"목숨\",\"목적\",\"목표\",\"몰래\",\"몸매\",\"몸무게\",\"몸살\",\"몸속\",\"몸짓\",\"몸통\",\"몹시\",\"무관심\",\"무궁화\",\"무더위\",\"무덤\",\"무릎\",\"무슨\",\"무엇\",\"무역\",\"무용\",\"무조건\",\"무지개\",\"무척\",\"문구\",\"문득\",\"문법\",\"문서\",\"문제\",\"문학\",\"문화\",\"물가\",\"물건\",\"물결\",\"물고기\",\"물론\",\"물리학\",\"물음\",\"물질\",\"물체\",\"미국\",\"미디어\",\"미사일\",\"미술\",\"미역\",\"미용실\",\"미움\",\"미인\",\"미팅\",\"미혼\",\"민간\",\"민족\",\"민주\",\"믿음\",\"밀가루\",\"밀리미터\",\"밑바닥\",\"바가지\",\"바구니\",\"바나나\",\"바늘\",\"바닥\",\"바닷가\",\"바람\",\"바이러스\",\"바탕\",\"박물관\",\"박사\",\"박수\",\"반대\",\"반드시\",\"반말\",\"반발\",\"반성\",\"반응\",\"반장\",\"반죽\",\"반지\",\"반찬\",\"받침\",\"발가락\",\"발걸음\",\"발견\",\"발달\",\"발레\",\"발목\",\"발바닥\",\"발생\",\"발음\",\"발자국\",\"발전\",\"발톱\",\"발표\",\"밤하늘\",\"밥그릇\",\"밥맛\",\"밥상\",\"밥솥\",\"방금\",\"방면\",\"방문\",\"방바닥\",\"방법\",\"방송\",\"방식\",\"방안\",\"방울\",\"방지\",\"방학\",\"방해\",\"방향\",\"배경\",\"배꼽\",\"배달\",\"배드민턴\",\"백두산\",\"백색\",\"백성\",\"백인\",\"백제\",\"백화점\",\"버릇\",\"버섯\",\"버튼\",\"번개\",\"번역\",\"번지\",\"번호\",\"벌금\",\"벌레\",\"벌써\",\"범위\",\"범인\",\"범죄\",\"법률\",\"법원\",\"법적\",\"법칙\",\"베이징\",\"벨트\",\"변경\",\"변동\",\"변명\",\"변신\",\"변호사\",\"변화\",\"별도\",\"별명\",\"별일\",\"병실\",\"병아리\",\"병원\",\"보관\",\"보너스\",\"보라색\",\"보람\",\"보름\",\"보상\",\"보안\",\"보자기\",\"보장\",\"보전\",\"보존\",\"보통\",\"보편적\",\"보험\",\"복도\",\"복사\",\"복숭아\",\"복습\",\"볶음\",\"본격적\",\"본래\",\"본부\",\"본사\",\"본성\",\"본인\",\"본질\",\"볼펜\",\"봉사\",\"봉지\",\"봉투\",\"부근\",\"부끄러움\",\"부담\",\"부동산\",\"부문\",\"부분\",\"부산\",\"부상\",\"부엌\",\"부인\",\"부작용\",\"부장\",\"부정\",\"부족\",\"부지런히\",\"부친\",\"부탁\",\"부품\",\"부회장\",\"북부\",\"북한\",\"분노\",\"분량\",\"분리\",\"분명\",\"분석\",\"분야\",\"분위기\",\"분필\",\"분홍색\",\"불고기\",\"불과\",\"불교\",\"불꽃\",\"불만\",\"불법\",\"불빛\",\"불안\",\"불이익\",\"불행\",\"브랜드\",\"비극\",\"비난\",\"비닐\",\"비둘기\",\"비디오\",\"비로소\",\"비만\",\"비명\",\"비밀\",\"비바람\",\"비빔밥\",\"비상\",\"비용\",\"비율\",\"비중\",\"비타민\",\"비판\",\"빌딩\",\"빗물\",\"빗방울\",\"빗줄기\",\"빛깔\",\"빨간색\",\"빨래\",\"빨리\",\"사건\",\"사계절\",\"사나이\",\"사냥\",\"사람\",\"사랑\",\"사립\",\"사모님\",\"사물\",\"사방\",\"사상\",\"사생활\",\"사설\",\"사슴\",\"사실\",\"사업\",\"사용\",\"사월\",\"사장\",\"사전\",\"사진\",\"사촌\",\"사춘기\",\"사탕\",\"사투리\",\"사흘\",\"산길\",\"산부인과\",\"산업\",\"산책\",\"살림\",\"살인\",\"살짝\",\"삼계탕\",\"삼국\",\"삼십\",\"삼월\",\"삼촌\",\"상관\",\"상금\",\"상대\",\"상류\",\"상반기\",\"상상\",\"상식\",\"상업\",\"상인\",\"상자\",\"상점\",\"상처\",\"상추\",\"상태\",\"상표\",\"상품\",\"상황\",\"새벽\",\"색깔\",\"색연필\",\"생각\",\"생명\",\"생물\",\"생방송\",\"생산\",\"생선\",\"생신\",\"생일\",\"생활\",\"서랍\",\"서른\",\"서명\",\"서민\",\"서비스\",\"서양\",\"서울\",\"서적\",\"서점\",\"서쪽\",\"서클\",\"석사\",\"석유\",\"선거\",\"선물\",\"선배\",\"선생\",\"선수\",\"선원\",\"선장\",\"선전\",\"선택\",\"선풍기\",\"설거지\",\"설날\",\"설렁탕\",\"설명\",\"설문\",\"설사\",\"설악산\",\"설치\",\"설탕\",\"섭씨\",\"성공\",\"성당\",\"성명\",\"성별\",\"성인\",\"성장\",\"성적\",\"성질\",\"성함\",\"세금\",\"세미나\",\"세상\",\"세월\",\"세종대왕\",\"세탁\",\"센터\",\"센티미터\",\"셋째\",\"소규모\",\"소극적\",\"소금\",\"소나기\",\"소년\",\"소득\",\"소망\",\"소문\",\"소설\",\"소속\",\"소아과\",\"소용\",\"소원\",\"소음\",\"소중히\",\"소지품\",\"소질\",\"소풍\",\"소형\",\"속담\",\"속도\",\"속옷\",\"손가락\",\"손길\",\"손녀\",\"손님\",\"손등\",\"손목\",\"손뼉\",\"손실\",\"손질\",\"손톱\",\"손해\",\"솔직히\",\"솜씨\",\"송아지\",\"송이\",\"송편\",\"쇠고기\",\"쇼핑\",\"수건\",\"수년\",\"수단\",\"수돗물\",\"수동적\",\"수면\",\"수명\",\"수박\",\"수상\",\"수석\",\"수술\",\"수시로\",\"수업\",\"수염\",\"수영\",\"수입\",\"수준\",\"수집\",\"수출\",\"수컷\",\"수필\",\"수학\",\"수험생\",\"수화기\",\"숙녀\",\"숙소\",\"숙제\",\"순간\",\"순서\",\"순수\",\"순식간\",\"순위\",\"숟가락\",\"술병\",\"술집\",\"숫자\",\"스님\",\"스물\",\"스스로\",\"스승\",\"스웨터\",\"스위치\",\"스케이트\",\"스튜디오\",\"스트레스\",\"스포츠\",\"슬쩍\",\"슬픔\",\"습관\",\"습기\",\"승객\",\"승리\",\"승부\",\"승용차\",\"승진\",\"시각\",\"시간\",\"시골\",\"시금치\",\"시나리오\",\"시댁\",\"시리즈\",\"시멘트\",\"시민\",\"시부모\",\"시선\",\"시설\",\"시스템\",\"시아버지\",\"시어머니\",\"시월\",\"시인\",\"시일\",\"시작\",\"시장\",\"시절\",\"시점\",\"시중\",\"시즌\",\"시집\",\"시청\",\"시합\",\"시험\",\"식구\",\"식기\",\"식당\",\"식량\",\"식료품\",\"식물\",\"식빵\",\"식사\",\"식생활\",\"식초\",\"식탁\",\"식품\",\"신고\",\"신규\",\"신념\",\"신문\",\"신발\",\"신비\",\"신사\",\"신세\",\"신용\",\"신제품\",\"신청\",\"신체\",\"신화\",\"실감\",\"실내\",\"실력\",\"실례\",\"실망\",\"실수\",\"실습\",\"실시\",\"실장\",\"실정\",\"실질적\",\"실천\",\"실체\",\"실컷\",\"실태\",\"실패\",\"실험\",\"실현\",\"심리\",\"심부름\",\"심사\",\"심장\",\"심정\",\"심판\",\"쌍둥이\",\"씨름\",\"씨앗\",\"아가씨\",\"아나운서\",\"아드님\",\"아들\",\"아쉬움\",\"아스팔트\",\"아시아\",\"아울러\",\"아저씨\",\"아줌마\",\"아직\",\"아침\",\"아파트\",\"아프리카\",\"아픔\",\"아홉\",\"아흔\",\"악기\",\"악몽\",\"악수\",\"안개\",\"안경\",\"안과\",\"안내\",\"안녕\",\"안동\",\"안방\",\"안부\",\"안주\",\"알루미늄\",\"알코올\",\"암시\",\"암컷\",\"압력\",\"앞날\",\"앞문\",\"애인\",\"애정\",\"액수\",\"앨범\",\"야간\",\"야단\",\"야옹\",\"약간\",\"약국\",\"약속\",\"약수\",\"약점\",\"약품\",\"약혼녀\",\"양념\",\"양력\",\"양말\",\"양배추\",\"양주\",\"양파\",\"어둠\",\"어려움\",\"어른\",\"어젯밤\",\"어쨌든\",\"어쩌다가\",\"어쩐지\",\"언니\",\"언덕\",\"언론\",\"언어\",\"얼굴\",\"얼른\",\"얼음\",\"얼핏\",\"엄마\",\"업무\",\"업종\",\"업체\",\"엉덩이\",\"엉망\",\"엉터리\",\"엊그제\",\"에너지\",\"에어컨\",\"엔진\",\"여건\",\"여고생\",\"여관\",\"여군\",\"여권\",\"여대생\",\"여덟\",\"여동생\",\"여든\",\"여론\",\"여름\",\"여섯\",\"여성\",\"여왕\",\"여인\",\"여전히\",\"여직원\",\"여학생\",\"여행\",\"역사\",\"역시\",\"역할\",\"연결\",\"연구\",\"연극\",\"연기\",\"연락\",\"연설\",\"연세\",\"연속\",\"연습\",\"연애\",\"연예인\",\"연인\",\"연장\",\"연주\",\"연출\",\"연필\",\"연합\",\"연휴\",\"열기\",\"열매\",\"열쇠\",\"열심히\",\"열정\",\"열차\",\"열흘\",\"염려\",\"엽서\",\"영국\",\"영남\",\"영상\",\"영양\",\"영역\",\"영웅\",\"영원히\",\"영하\",\"영향\",\"영혼\",\"영화\",\"옆구리\",\"옆방\",\"옆집\",\"예감\",\"예금\",\"예방\",\"예산\",\"예상\",\"예선\",\"예술\",\"예습\",\"예식장\",\"예약\",\"예전\",\"예절\",\"예정\",\"예컨대\",\"옛날\",\"오늘\",\"오락\",\"오랫동안\",\"오렌지\",\"오로지\",\"오른발\",\"오븐\",\"오십\",\"오염\",\"오월\",\"오전\",\"오직\",\"오징어\",\"오페라\",\"오피스텔\",\"오히려\",\"옥상\",\"옥수수\",\"온갖\",\"온라인\",\"온몸\",\"온종일\",\"온통\",\"올가을\",\"올림픽\",\"올해\",\"옷차림\",\"와이셔츠\",\"와인\",\"완성\",\"완전\",\"왕비\",\"왕자\",\"왜냐하면\",\"왠지\",\"외갓집\",\"외국\",\"외로움\",\"외삼촌\",\"외출\",\"외침\",\"외할머니\",\"왼발\",\"왼손\",\"왼쪽\",\"요금\",\"요일\",\"요즘\",\"요청\",\"용기\",\"용서\",\"용어\",\"우산\",\"우선\",\"우승\",\"우연히\",\"우정\",\"우체국\",\"우편\",\"운동\",\"운명\",\"운반\",\"운전\",\"운행\",\"울산\",\"울음\",\"움직임\",\"웃어른\",\"웃음\",\"워낙\",\"원고\",\"원래\",\"원서\",\"원숭이\",\"원인\",\"원장\",\"원피스\",\"월급\",\"월드컵\",\"월세\",\"월요일\",\"웨이터\",\"위반\",\"위법\",\"위성\",\"위원\",\"위험\",\"위협\",\"윗사람\",\"유난히\",\"유럽\",\"유명\",\"유물\",\"유산\",\"유적\",\"유치원\",\"유학\",\"유행\",\"유형\",\"육군\",\"육상\",\"육십\",\"육체\",\"은행\",\"음력\",\"음료\",\"음반\",\"음성\",\"음식\",\"음악\",\"음주\",\"의견\",\"의논\",\"의문\",\"의복\",\"의식\",\"의심\",\"의외로\",\"의욕\",\"의원\",\"의학\",\"이것\",\"이곳\",\"이념\",\"이놈\",\"이달\",\"이대로\",\"이동\",\"이렇게\",\"이력서\",\"이론적\",\"이름\",\"이민\",\"이발소\",\"이별\",\"이불\",\"이빨\",\"이상\",\"이성\",\"이슬\",\"이야기\",\"이용\",\"이웃\",\"이월\",\"이윽고\",\"이익\",\"이전\",\"이중\",\"이튿날\",\"이틀\",\"이혼\",\"인간\",\"인격\",\"인공\",\"인구\",\"인근\",\"인기\",\"인도\",\"인류\",\"인물\",\"인생\",\"인쇄\",\"인연\",\"인원\",\"인재\",\"인종\",\"인천\",\"인체\",\"인터넷\",\"인하\",\"인형\",\"일곱\",\"일기\",\"일단\",\"일대\",\"일등\",\"일반\",\"일본\",\"일부\",\"일상\",\"일생\",\"일손\",\"일요일\",\"일월\",\"일정\",\"일종\",\"일주일\",\"일찍\",\"일체\",\"일치\",\"일행\",\"일회용\",\"임금\",\"임무\",\"입대\",\"입력\",\"입맛\",\"입사\",\"입술\",\"입시\",\"입원\",\"입장\",\"입학\",\"자가용\",\"자격\",\"자극\",\"자동\",\"자랑\",\"자부심\",\"자식\",\"자신\",\"자연\",\"자원\",\"자율\",\"자전거\",\"자정\",\"자존심\",\"자판\",\"작가\",\"작년\",\"작성\",\"작업\",\"작용\",\"작은딸\",\"작품\",\"잔디\",\"잔뜩\",\"잔치\",\"잘못\",\"잠깐\",\"잠수함\",\"잠시\",\"잠옷\",\"잠자리\",\"잡지\",\"장관\",\"장군\",\"장기간\",\"장래\",\"장례\",\"장르\",\"장마\",\"장면\",\"장모\",\"장미\",\"장비\",\"장사\",\"장소\",\"장식\",\"장애인\",\"장인\",\"장점\",\"장차\",\"장학금\",\"재능\",\"재빨리\",\"재산\",\"재생\",\"재작년\",\"재정\",\"재채기\",\"재판\",\"재학\",\"재활용\",\"저것\",\"저고리\",\"저곳\",\"저녁\",\"저런\",\"저렇게\",\"저번\",\"저울\",\"저절로\",\"저축\",\"적극\",\"적당히\",\"적성\",\"적용\",\"적응\",\"전개\",\"전공\",\"전기\",\"전달\",\"전라도\",\"전망\",\"전문\",\"전반\",\"전부\",\"전세\",\"전시\",\"전용\",\"전자\",\"전쟁\",\"전주\",\"전철\",\"전체\",\"전통\",\"전혀\",\"전후\",\"절대\",\"절망\",\"절반\",\"절약\",\"절차\",\"점검\",\"점수\",\"점심\",\"점원\",\"점점\",\"점차\",\"접근\",\"접시\",\"접촉\",\"젓가락\",\"정거장\",\"정도\",\"정류장\",\"정리\",\"정말\",\"정면\",\"정문\",\"정반대\",\"정보\",\"정부\",\"정비\",\"정상\",\"정성\",\"정오\",\"정원\",\"정장\",\"정지\",\"정치\",\"정확히\",\"제공\",\"제과점\",\"제대로\",\"제목\",\"제발\",\"제법\",\"제삿날\",\"제안\",\"제일\",\"제작\",\"제주도\",\"제출\",\"제품\",\"제한\",\"조각\",\"조건\",\"조금\",\"조깅\",\"조명\",\"조미료\",\"조상\",\"조선\",\"조용히\",\"조절\",\"조정\",\"조직\",\"존댓말\",\"존재\",\"졸업\",\"졸음\",\"종교\",\"종로\",\"종류\",\"종소리\",\"종업원\",\"종종\",\"종합\",\"좌석\",\"죄인\",\"주관적\",\"주름\",\"주말\",\"주머니\",\"주먹\",\"주문\",\"주민\",\"주방\",\"주변\",\"주식\",\"주인\",\"주일\",\"주장\",\"주전자\",\"주택\",\"준비\",\"줄거리\",\"줄기\",\"줄무늬\",\"중간\",\"중계방송\",\"중국\",\"중년\",\"중단\",\"중독\",\"중반\",\"중부\",\"중세\",\"중소기업\",\"중순\",\"중앙\",\"중요\",\"중학교\",\"즉석\",\"즉시\",\"즐거움\",\"증가\",\"증거\",\"증권\",\"증상\",\"증세\",\"지각\",\"지갑\",\"지경\",\"지극히\",\"지금\",\"지급\",\"지능\",\"지름길\",\"지리산\",\"지방\",\"지붕\",\"지식\",\"지역\",\"지우개\",\"지원\",\"지적\",\"지점\",\"지진\",\"지출\",\"직선\",\"직업\",\"직원\",\"직장\",\"진급\",\"진동\",\"진로\",\"진료\",\"진리\",\"진짜\",\"진찰\",\"진출\",\"진통\",\"진행\",\"질문\",\"질병\",\"질서\",\"짐작\",\"집단\",\"집안\",\"집중\",\"짜증\",\"찌꺼기\",\"차남\",\"차라리\",\"차량\",\"차림\",\"차별\",\"차선\",\"차츰\",\"착각\",\"찬물\",\"찬성\",\"참가\",\"참기름\",\"참새\",\"참석\",\"참여\",\"참외\",\"참조\",\"찻잔\",\"창가\",\"창고\",\"창구\",\"창문\",\"창밖\",\"창작\",\"창조\",\"채널\",\"채점\",\"책가방\",\"책방\",\"책상\",\"책임\",\"챔피언\",\"처벌\",\"처음\",\"천국\",\"천둥\",\"천장\",\"천재\",\"천천히\",\"철도\",\"철저히\",\"철학\",\"첫날\",\"첫째\",\"청년\",\"청바지\",\"청소\",\"청춘\",\"체계\",\"체력\",\"체온\",\"체육\",\"체중\",\"체험\",\"초등학생\",\"초반\",\"초밥\",\"초상화\",\"초순\",\"초여름\",\"초원\",\"초저녁\",\"초점\",\"초청\",\"초콜릿\",\"촛불\",\"총각\",\"총리\",\"총장\",\"촬영\",\"최근\",\"최상\",\"최선\",\"최신\",\"최악\",\"최종\",\"추석\",\"추억\",\"추진\",\"추천\",\"추측\",\"축구\",\"축소\",\"축제\",\"축하\",\"출근\",\"출발\",\"출산\",\"출신\",\"출연\",\"출입\",\"출장\",\"출판\",\"충격\",\"충고\",\"충돌\",\"충분히\",\"충청도\",\"취업\",\"취직\",\"취향\",\"치약\",\"친구\",\"친척\",\"칠십\",\"칠월\",\"칠판\",\"침대\",\"침묵\",\"침실\",\"칫솔\",\"칭찬\",\"카메라\",\"카운터\",\"칼국수\",\"캐릭터\",\"캠퍼스\",\"캠페인\",\"커튼\",\"컨디션\",\"컬러\",\"컴퓨터\",\"코끼리\",\"코미디\",\"콘서트\",\"콜라\",\"콤플렉스\",\"콩나물\",\"쾌감\",\"쿠데타\",\"크림\",\"큰길\",\"큰딸\",\"큰소리\",\"큰아들\",\"큰어머니\",\"큰일\",\"큰절\",\"클래식\",\"클럽\",\"킬로\",\"타입\",\"타자기\",\"탁구\",\"탁자\",\"탄생\",\"태권도\",\"태양\",\"태풍\",\"택시\",\"탤런트\",\"터널\",\"터미널\",\"테니스\",\"테스트\",\"테이블\",\"텔레비전\",\"토론\",\"토마토\",\"토요일\",\"통계\",\"통과\",\"통로\",\"통신\",\"통역\",\"통일\",\"통장\",\"통제\",\"통증\",\"통합\",\"통화\",\"퇴근\",\"퇴원\",\"퇴직금\",\"튀김\",\"트럭\",\"특급\",\"특별\",\"특성\",\"특수\",\"특징\",\"특히\",\"튼튼히\",\"티셔츠\",\"파란색\",\"파일\",\"파출소\",\"판결\",\"판단\",\"판매\",\"판사\",\"팔십\",\"팔월\",\"팝송\",\"패션\",\"팩스\",\"팩시밀리\",\"팬티\",\"퍼센트\",\"페인트\",\"편견\",\"편의\",\"편지\",\"편히\",\"평가\",\"평균\",\"평생\",\"평소\",\"평양\",\"평일\",\"평화\",\"포스터\",\"포인트\",\"포장\",\"포함\",\"표면\",\"표정\",\"표준\",\"표현\",\"품목\",\"품질\",\"풍경\",\"풍속\",\"풍습\",\"프랑스\",\"프린터\",\"플라스틱\",\"피곤\",\"피망\",\"피아노\",\"필름\",\"필수\",\"필요\",\"필자\",\"필통\",\"핑계\",\"하느님\",\"하늘\",\"하드웨어\",\"하룻밤\",\"하반기\",\"하숙집\",\"하순\",\"하여튼\",\"하지만\",\"하천\",\"하품\",\"하필\",\"학과\",\"학교\",\"학급\",\"학기\",\"학년\",\"학력\",\"학번\",\"학부모\",\"학비\",\"학생\",\"학술\",\"학습\",\"학용품\",\"학원\",\"학위\",\"학자\",\"학점\",\"한계\",\"한글\",\"한꺼번에\",\"한낮\",\"한눈\",\"한동안\",\"한때\",\"한라산\",\"한마디\",\"한문\",\"한번\",\"한복\",\"한식\",\"한여름\",\"한쪽\",\"할머니\",\"할아버지\",\"할인\",\"함께\",\"함부로\",\"합격\",\"합리적\",\"항공\",\"항구\",\"항상\",\"항의\",\"해결\",\"해군\",\"해답\",\"해당\",\"해물\",\"해석\",\"해설\",\"해수욕장\",\"해안\",\"핵심\",\"핸드백\",\"햄버거\",\"햇볕\",\"햇살\",\"행동\",\"행복\",\"행사\",\"행운\",\"행위\",\"향기\",\"향상\",\"향수\",\"허락\",\"허용\",\"헬기\",\"현관\",\"현금\",\"현대\",\"현상\",\"현실\",\"현장\",\"현재\",\"현지\",\"혈액\",\"협력\",\"형부\",\"형사\",\"형수\",\"형식\",\"형제\",\"형태\",\"형편\",\"혜택\",\"호기심\",\"호남\",\"호랑이\",\"호박\",\"호텔\",\"호흡\",\"혹시\",\"홀로\",\"홈페이지\",\"홍보\",\"홍수\",\"홍차\",\"화면\",\"화분\",\"화살\",\"화요일\",\"화장\",\"화학\",\"확보\",\"확인\",\"확장\",\"확정\",\"환갑\",\"환경\",\"환영\",\"환율\",\"환자\",\"활기\",\"활동\",\"활발히\",\"활용\",\"활짝\",\"회견\",\"회관\",\"회복\",\"회색\",\"회원\",\"회장\",\"회전\",\"횟수\",\"횡단보도\",\"효율적\",\"후반\",\"후춧가루\",\"훈련\",\"훨씬\",\"휴식\",\"휴일\",\"흉내\",\"흐름\",\"흑백\",\"흑인\",\"흔적\",\"흔히\",\"흥미\",\"흥분\",\"희곡\",\"희망\",\"희생\",\"흰색\",\"힘껏\"]");

/***/ }),

/***/ 731:
/***/ (function(module) {

module.exports = JSON.parse("[\"abaisser\",\"abandon\",\"abdiquer\",\"abeille\",\"abolir\",\"aborder\",\"aboutir\",\"aboyer\",\"abrasif\",\"abreuver\",\"abriter\",\"abroger\",\"abrupt\",\"absence\",\"absolu\",\"absurde\",\"abusif\",\"abyssal\",\"académie\",\"acajou\",\"acarien\",\"accabler\",\"accepter\",\"acclamer\",\"accolade\",\"accroche\",\"accuser\",\"acerbe\",\"achat\",\"acheter\",\"aciduler\",\"acier\",\"acompte\",\"acquérir\",\"acronyme\",\"acteur\",\"actif\",\"actuel\",\"adepte\",\"adéquat\",\"adhésif\",\"adjectif\",\"adjuger\",\"admettre\",\"admirer\",\"adopter\",\"adorer\",\"adoucir\",\"adresse\",\"adroit\",\"adulte\",\"adverbe\",\"aérer\",\"aéronef\",\"affaire\",\"affecter\",\"affiche\",\"affreux\",\"affubler\",\"agacer\",\"agencer\",\"agile\",\"agiter\",\"agrafer\",\"agréable\",\"agrume\",\"aider\",\"aiguille\",\"ailier\",\"aimable\",\"aisance\",\"ajouter\",\"ajuster\",\"alarmer\",\"alchimie\",\"alerte\",\"algèbre\",\"algue\",\"aliéner\",\"aliment\",\"alléger\",\"alliage\",\"allouer\",\"allumer\",\"alourdir\",\"alpaga\",\"altesse\",\"alvéole\",\"amateur\",\"ambigu\",\"ambre\",\"aménager\",\"amertume\",\"amidon\",\"amiral\",\"amorcer\",\"amour\",\"amovible\",\"amphibie\",\"ampleur\",\"amusant\",\"analyse\",\"anaphore\",\"anarchie\",\"anatomie\",\"ancien\",\"anéantir\",\"angle\",\"angoisse\",\"anguleux\",\"animal\",\"annexer\",\"annonce\",\"annuel\",\"anodin\",\"anomalie\",\"anonyme\",\"anormal\",\"antenne\",\"antidote\",\"anxieux\",\"apaiser\",\"apéritif\",\"aplanir\",\"apologie\",\"appareil\",\"appeler\",\"apporter\",\"appuyer\",\"aquarium\",\"aqueduc\",\"arbitre\",\"arbuste\",\"ardeur\",\"ardoise\",\"argent\",\"arlequin\",\"armature\",\"armement\",\"armoire\",\"armure\",\"arpenter\",\"arracher\",\"arriver\",\"arroser\",\"arsenic\",\"artériel\",\"article\",\"aspect\",\"asphalte\",\"aspirer\",\"assaut\",\"asservir\",\"assiette\",\"associer\",\"assurer\",\"asticot\",\"astre\",\"astuce\",\"atelier\",\"atome\",\"atrium\",\"atroce\",\"attaque\",\"attentif\",\"attirer\",\"attraper\",\"aubaine\",\"auberge\",\"audace\",\"audible\",\"augurer\",\"aurore\",\"automne\",\"autruche\",\"avaler\",\"avancer\",\"avarice\",\"avenir\",\"averse\",\"aveugle\",\"aviateur\",\"avide\",\"avion\",\"aviser\",\"avoine\",\"avouer\",\"avril\",\"axial\",\"axiome\",\"badge\",\"bafouer\",\"bagage\",\"baguette\",\"baignade\",\"balancer\",\"balcon\",\"baleine\",\"balisage\",\"bambin\",\"bancaire\",\"bandage\",\"banlieue\",\"bannière\",\"banquier\",\"barbier\",\"baril\",\"baron\",\"barque\",\"barrage\",\"bassin\",\"bastion\",\"bataille\",\"bateau\",\"batterie\",\"baudrier\",\"bavarder\",\"belette\",\"bélier\",\"belote\",\"bénéfice\",\"berceau\",\"berger\",\"berline\",\"bermuda\",\"besace\",\"besogne\",\"bétail\",\"beurre\",\"biberon\",\"bicycle\",\"bidule\",\"bijou\",\"bilan\",\"bilingue\",\"billard\",\"binaire\",\"biologie\",\"biopsie\",\"biotype\",\"biscuit\",\"bison\",\"bistouri\",\"bitume\",\"bizarre\",\"blafard\",\"blague\",\"blanchir\",\"blessant\",\"blinder\",\"blond\",\"bloquer\",\"blouson\",\"bobard\",\"bobine\",\"boire\",\"boiser\",\"bolide\",\"bonbon\",\"bondir\",\"bonheur\",\"bonifier\",\"bonus\",\"bordure\",\"borne\",\"botte\",\"boucle\",\"boueux\",\"bougie\",\"boulon\",\"bouquin\",\"bourse\",\"boussole\",\"boutique\",\"boxeur\",\"branche\",\"brasier\",\"brave\",\"brebis\",\"brèche\",\"breuvage\",\"bricoler\",\"brigade\",\"brillant\",\"brioche\",\"brique\",\"brochure\",\"broder\",\"bronzer\",\"brousse\",\"broyeur\",\"brume\",\"brusque\",\"brutal\",\"bruyant\",\"buffle\",\"buisson\",\"bulletin\",\"bureau\",\"burin\",\"bustier\",\"butiner\",\"butoir\",\"buvable\",\"buvette\",\"cabanon\",\"cabine\",\"cachette\",\"cadeau\",\"cadre\",\"caféine\",\"caillou\",\"caisson\",\"calculer\",\"calepin\",\"calibre\",\"calmer\",\"calomnie\",\"calvaire\",\"camarade\",\"caméra\",\"camion\",\"campagne\",\"canal\",\"caneton\",\"canon\",\"cantine\",\"canular\",\"capable\",\"caporal\",\"caprice\",\"capsule\",\"capter\",\"capuche\",\"carabine\",\"carbone\",\"caresser\",\"caribou\",\"carnage\",\"carotte\",\"carreau\",\"carton\",\"cascade\",\"casier\",\"casque\",\"cassure\",\"causer\",\"caution\",\"cavalier\",\"caverne\",\"caviar\",\"cédille\",\"ceinture\",\"céleste\",\"cellule\",\"cendrier\",\"censurer\",\"central\",\"cercle\",\"cérébral\",\"cerise\",\"cerner\",\"cerveau\",\"cesser\",\"chagrin\",\"chaise\",\"chaleur\",\"chambre\",\"chance\",\"chapitre\",\"charbon\",\"chasseur\",\"chaton\",\"chausson\",\"chavirer\",\"chemise\",\"chenille\",\"chéquier\",\"chercher\",\"cheval\",\"chien\",\"chiffre\",\"chignon\",\"chimère\",\"chiot\",\"chlorure\",\"chocolat\",\"choisir\",\"chose\",\"chouette\",\"chrome\",\"chute\",\"cigare\",\"cigogne\",\"cimenter\",\"cinéma\",\"cintrer\",\"circuler\",\"cirer\",\"cirque\",\"citerne\",\"citoyen\",\"citron\",\"civil\",\"clairon\",\"clameur\",\"claquer\",\"classe\",\"clavier\",\"client\",\"cligner\",\"climat\",\"clivage\",\"cloche\",\"clonage\",\"cloporte\",\"cobalt\",\"cobra\",\"cocasse\",\"cocotier\",\"coder\",\"codifier\",\"coffre\",\"cogner\",\"cohésion\",\"coiffer\",\"coincer\",\"colère\",\"colibri\",\"colline\",\"colmater\",\"colonel\",\"combat\",\"comédie\",\"commande\",\"compact\",\"concert\",\"conduire\",\"confier\",\"congeler\",\"connoter\",\"consonne\",\"contact\",\"convexe\",\"copain\",\"copie\",\"corail\",\"corbeau\",\"cordage\",\"corniche\",\"corpus\",\"correct\",\"cortège\",\"cosmique\",\"costume\",\"coton\",\"coude\",\"coupure\",\"courage\",\"couteau\",\"couvrir\",\"coyote\",\"crabe\",\"crainte\",\"cravate\",\"crayon\",\"créature\",\"créditer\",\"crémeux\",\"creuser\",\"crevette\",\"cribler\",\"crier\",\"cristal\",\"critère\",\"croire\",\"croquer\",\"crotale\",\"crucial\",\"cruel\",\"crypter\",\"cubique\",\"cueillir\",\"cuillère\",\"cuisine\",\"cuivre\",\"culminer\",\"cultiver\",\"cumuler\",\"cupide\",\"curatif\",\"curseur\",\"cyanure\",\"cycle\",\"cylindre\",\"cynique\",\"daigner\",\"damier\",\"danger\",\"danseur\",\"dauphin\",\"débattre\",\"débiter\",\"déborder\",\"débrider\",\"débutant\",\"décaler\",\"décembre\",\"déchirer\",\"décider\",\"déclarer\",\"décorer\",\"décrire\",\"décupler\",\"dédale\",\"déductif\",\"déesse\",\"défensif\",\"défiler\",\"défrayer\",\"dégager\",\"dégivrer\",\"déglutir\",\"dégrafer\",\"déjeuner\",\"délice\",\"déloger\",\"demander\",\"demeurer\",\"démolir\",\"dénicher\",\"dénouer\",\"dentelle\",\"dénuder\",\"départ\",\"dépenser\",\"déphaser\",\"déplacer\",\"déposer\",\"déranger\",\"dérober\",\"désastre\",\"descente\",\"désert\",\"désigner\",\"désobéir\",\"dessiner\",\"destrier\",\"détacher\",\"détester\",\"détourer\",\"détresse\",\"devancer\",\"devenir\",\"deviner\",\"devoir\",\"diable\",\"dialogue\",\"diamant\",\"dicter\",\"différer\",\"digérer\",\"digital\",\"digne\",\"diluer\",\"dimanche\",\"diminuer\",\"dioxyde\",\"directif\",\"diriger\",\"discuter\",\"disposer\",\"dissiper\",\"distance\",\"divertir\",\"diviser\",\"docile\",\"docteur\",\"dogme\",\"doigt\",\"domaine\",\"domicile\",\"dompter\",\"donateur\",\"donjon\",\"donner\",\"dopamine\",\"dortoir\",\"dorure\",\"dosage\",\"doseur\",\"dossier\",\"dotation\",\"douanier\",\"double\",\"douceur\",\"douter\",\"doyen\",\"dragon\",\"draper\",\"dresser\",\"dribbler\",\"droiture\",\"duperie\",\"duplexe\",\"durable\",\"durcir\",\"dynastie\",\"éblouir\",\"écarter\",\"écharpe\",\"échelle\",\"éclairer\",\"éclipse\",\"éclore\",\"écluse\",\"école\",\"économie\",\"écorce\",\"écouter\",\"écraser\",\"écrémer\",\"écrivain\",\"écrou\",\"écume\",\"écureuil\",\"édifier\",\"éduquer\",\"effacer\",\"effectif\",\"effigie\",\"effort\",\"effrayer\",\"effusion\",\"égaliser\",\"égarer\",\"éjecter\",\"élaborer\",\"élargir\",\"électron\",\"élégant\",\"éléphant\",\"élève\",\"éligible\",\"élitisme\",\"éloge\",\"élucider\",\"éluder\",\"emballer\",\"embellir\",\"embryon\",\"émeraude\",\"émission\",\"emmener\",\"émotion\",\"émouvoir\",\"empereur\",\"employer\",\"emporter\",\"emprise\",\"émulsion\",\"encadrer\",\"enchère\",\"enclave\",\"encoche\",\"endiguer\",\"endosser\",\"endroit\",\"enduire\",\"énergie\",\"enfance\",\"enfermer\",\"enfouir\",\"engager\",\"engin\",\"englober\",\"énigme\",\"enjamber\",\"enjeu\",\"enlever\",\"ennemi\",\"ennuyeux\",\"enrichir\",\"enrobage\",\"enseigne\",\"entasser\",\"entendre\",\"entier\",\"entourer\",\"entraver\",\"énumérer\",\"envahir\",\"enviable\",\"envoyer\",\"enzyme\",\"éolien\",\"épaissir\",\"épargne\",\"épatant\",\"épaule\",\"épicerie\",\"épidémie\",\"épier\",\"épilogue\",\"épine\",\"épisode\",\"épitaphe\",\"époque\",\"épreuve\",\"éprouver\",\"épuisant\",\"équerre\",\"équipe\",\"ériger\",\"érosion\",\"erreur\",\"éruption\",\"escalier\",\"espadon\",\"espèce\",\"espiègle\",\"espoir\",\"esprit\",\"esquiver\",\"essayer\",\"essence\",\"essieu\",\"essorer\",\"estime\",\"estomac\",\"estrade\",\"étagère\",\"étaler\",\"étanche\",\"étatique\",\"éteindre\",\"étendoir\",\"éternel\",\"éthanol\",\"éthique\",\"ethnie\",\"étirer\",\"étoffer\",\"étoile\",\"étonnant\",\"étourdir\",\"étrange\",\"étroit\",\"étude\",\"euphorie\",\"évaluer\",\"évasion\",\"éventail\",\"évidence\",\"éviter\",\"évolutif\",\"évoquer\",\"exact\",\"exagérer\",\"exaucer\",\"exceller\",\"excitant\",\"exclusif\",\"excuse\",\"exécuter\",\"exemple\",\"exercer\",\"exhaler\",\"exhorter\",\"exigence\",\"exiler\",\"exister\",\"exotique\",\"expédier\",\"explorer\",\"exposer\",\"exprimer\",\"exquis\",\"extensif\",\"extraire\",\"exulter\",\"fable\",\"fabuleux\",\"facette\",\"facile\",\"facture\",\"faiblir\",\"falaise\",\"fameux\",\"famille\",\"farceur\",\"farfelu\",\"farine\",\"farouche\",\"fasciner\",\"fatal\",\"fatigue\",\"faucon\",\"fautif\",\"faveur\",\"favori\",\"fébrile\",\"féconder\",\"fédérer\",\"félin\",\"femme\",\"fémur\",\"fendoir\",\"féodal\",\"fermer\",\"féroce\",\"ferveur\",\"festival\",\"feuille\",\"feutre\",\"février\",\"fiasco\",\"ficeler\",\"fictif\",\"fidèle\",\"figure\",\"filature\",\"filetage\",\"filière\",\"filleul\",\"filmer\",\"filou\",\"filtrer\",\"financer\",\"finir\",\"fiole\",\"firme\",\"fissure\",\"fixer\",\"flairer\",\"flamme\",\"flasque\",\"flatteur\",\"fléau\",\"flèche\",\"fleur\",\"flexion\",\"flocon\",\"flore\",\"fluctuer\",\"fluide\",\"fluvial\",\"folie\",\"fonderie\",\"fongible\",\"fontaine\",\"forcer\",\"forgeron\",\"formuler\",\"fortune\",\"fossile\",\"foudre\",\"fougère\",\"fouiller\",\"foulure\",\"fourmi\",\"fragile\",\"fraise\",\"franchir\",\"frapper\",\"frayeur\",\"frégate\",\"freiner\",\"frelon\",\"frémir\",\"frénésie\",\"frère\",\"friable\",\"friction\",\"frisson\",\"frivole\",\"froid\",\"fromage\",\"frontal\",\"frotter\",\"fruit\",\"fugitif\",\"fuite\",\"fureur\",\"furieux\",\"furtif\",\"fusion\",\"futur\",\"gagner\",\"galaxie\",\"galerie\",\"gambader\",\"garantir\",\"gardien\",\"garnir\",\"garrigue\",\"gazelle\",\"gazon\",\"géant\",\"gélatine\",\"gélule\",\"gendarme\",\"général\",\"génie\",\"genou\",\"gentil\",\"géologie\",\"géomètre\",\"géranium\",\"germe\",\"gestuel\",\"geyser\",\"gibier\",\"gicler\",\"girafe\",\"givre\",\"glace\",\"glaive\",\"glisser\",\"globe\",\"gloire\",\"glorieux\",\"golfeur\",\"gomme\",\"gonfler\",\"gorge\",\"gorille\",\"goudron\",\"gouffre\",\"goulot\",\"goupille\",\"gourmand\",\"goutte\",\"graduel\",\"graffiti\",\"graine\",\"grand\",\"grappin\",\"gratuit\",\"gravir\",\"grenat\",\"griffure\",\"griller\",\"grimper\",\"grogner\",\"gronder\",\"grotte\",\"groupe\",\"gruger\",\"grutier\",\"gruyère\",\"guépard\",\"guerrier\",\"guide\",\"guimauve\",\"guitare\",\"gustatif\",\"gymnaste\",\"gyrostat\",\"habitude\",\"hachoir\",\"halte\",\"hameau\",\"hangar\",\"hanneton\",\"haricot\",\"harmonie\",\"harpon\",\"hasard\",\"hélium\",\"hématome\",\"herbe\",\"hérisson\",\"hermine\",\"héron\",\"hésiter\",\"heureux\",\"hiberner\",\"hibou\",\"hilarant\",\"histoire\",\"hiver\",\"homard\",\"hommage\",\"homogène\",\"honneur\",\"honorer\",\"honteux\",\"horde\",\"horizon\",\"horloge\",\"hormone\",\"horrible\",\"houleux\",\"housse\",\"hublot\",\"huileux\",\"humain\",\"humble\",\"humide\",\"humour\",\"hurler\",\"hydromel\",\"hygiène\",\"hymne\",\"hypnose\",\"idylle\",\"ignorer\",\"iguane\",\"illicite\",\"illusion\",\"image\",\"imbiber\",\"imiter\",\"immense\",\"immobile\",\"immuable\",\"impact\",\"impérial\",\"implorer\",\"imposer\",\"imprimer\",\"imputer\",\"incarner\",\"incendie\",\"incident\",\"incliner\",\"incolore\",\"indexer\",\"indice\",\"inductif\",\"inédit\",\"ineptie\",\"inexact\",\"infini\",\"infliger\",\"informer\",\"infusion\",\"ingérer\",\"inhaler\",\"inhiber\",\"injecter\",\"injure\",\"innocent\",\"inoculer\",\"inonder\",\"inscrire\",\"insecte\",\"insigne\",\"insolite\",\"inspirer\",\"instinct\",\"insulter\",\"intact\",\"intense\",\"intime\",\"intrigue\",\"intuitif\",\"inutile\",\"invasion\",\"inventer\",\"inviter\",\"invoquer\",\"ironique\",\"irradier\",\"irréel\",\"irriter\",\"isoler\",\"ivoire\",\"ivresse\",\"jaguar\",\"jaillir\",\"jambe\",\"janvier\",\"jardin\",\"jauger\",\"jaune\",\"javelot\",\"jetable\",\"jeton\",\"jeudi\",\"jeunesse\",\"joindre\",\"joncher\",\"jongler\",\"joueur\",\"jouissif\",\"journal\",\"jovial\",\"joyau\",\"joyeux\",\"jubiler\",\"jugement\",\"junior\",\"jupon\",\"juriste\",\"justice\",\"juteux\",\"juvénile\",\"kayak\",\"kimono\",\"kiosque\",\"label\",\"labial\",\"labourer\",\"lacérer\",\"lactose\",\"lagune\",\"laine\",\"laisser\",\"laitier\",\"lambeau\",\"lamelle\",\"lampe\",\"lanceur\",\"langage\",\"lanterne\",\"lapin\",\"largeur\",\"larme\",\"laurier\",\"lavabo\",\"lavoir\",\"lecture\",\"légal\",\"léger\",\"légume\",\"lessive\",\"lettre\",\"levier\",\"lexique\",\"lézard\",\"liasse\",\"libérer\",\"libre\",\"licence\",\"licorne\",\"liège\",\"lièvre\",\"ligature\",\"ligoter\",\"ligue\",\"limer\",\"limite\",\"limonade\",\"limpide\",\"linéaire\",\"lingot\",\"lionceau\",\"liquide\",\"lisière\",\"lister\",\"lithium\",\"litige\",\"littoral\",\"livreur\",\"logique\",\"lointain\",\"loisir\",\"lombric\",\"loterie\",\"louer\",\"lourd\",\"loutre\",\"louve\",\"loyal\",\"lubie\",\"lucide\",\"lucratif\",\"lueur\",\"lugubre\",\"luisant\",\"lumière\",\"lunaire\",\"lundi\",\"luron\",\"lutter\",\"luxueux\",\"machine\",\"magasin\",\"magenta\",\"magique\",\"maigre\",\"maillon\",\"maintien\",\"mairie\",\"maison\",\"majorer\",\"malaxer\",\"maléfice\",\"malheur\",\"malice\",\"mallette\",\"mammouth\",\"mandater\",\"maniable\",\"manquant\",\"manteau\",\"manuel\",\"marathon\",\"marbre\",\"marchand\",\"mardi\",\"maritime\",\"marqueur\",\"marron\",\"marteler\",\"mascotte\",\"massif\",\"matériel\",\"matière\",\"matraque\",\"maudire\",\"maussade\",\"mauve\",\"maximal\",\"méchant\",\"méconnu\",\"médaille\",\"médecin\",\"méditer\",\"méduse\",\"meilleur\",\"mélange\",\"mélodie\",\"membre\",\"mémoire\",\"menacer\",\"mener\",\"menhir\",\"mensonge\",\"mentor\",\"mercredi\",\"mérite\",\"merle\",\"messager\",\"mesure\",\"métal\",\"météore\",\"méthode\",\"métier\",\"meuble\",\"miauler\",\"microbe\",\"miette\",\"mignon\",\"migrer\",\"milieu\",\"million\",\"mimique\",\"mince\",\"minéral\",\"minimal\",\"minorer\",\"minute\",\"miracle\",\"miroiter\",\"missile\",\"mixte\",\"mobile\",\"moderne\",\"moelleux\",\"mondial\",\"moniteur\",\"monnaie\",\"monotone\",\"monstre\",\"montagne\",\"monument\",\"moqueur\",\"morceau\",\"morsure\",\"mortier\",\"moteur\",\"motif\",\"mouche\",\"moufle\",\"moulin\",\"mousson\",\"mouton\",\"mouvant\",\"multiple\",\"munition\",\"muraille\",\"murène\",\"murmure\",\"muscle\",\"muséum\",\"musicien\",\"mutation\",\"muter\",\"mutuel\",\"myriade\",\"myrtille\",\"mystère\",\"mythique\",\"nageur\",\"nappe\",\"narquois\",\"narrer\",\"natation\",\"nation\",\"nature\",\"naufrage\",\"nautique\",\"navire\",\"nébuleux\",\"nectar\",\"néfaste\",\"négation\",\"négliger\",\"négocier\",\"neige\",\"nerveux\",\"nettoyer\",\"neurone\",\"neutron\",\"neveu\",\"niche\",\"nickel\",\"nitrate\",\"niveau\",\"noble\",\"nocif\",\"nocturne\",\"noirceur\",\"noisette\",\"nomade\",\"nombreux\",\"nommer\",\"normatif\",\"notable\",\"notifier\",\"notoire\",\"nourrir\",\"nouveau\",\"novateur\",\"novembre\",\"novice\",\"nuage\",\"nuancer\",\"nuire\",\"nuisible\",\"numéro\",\"nuptial\",\"nuque\",\"nutritif\",\"obéir\",\"objectif\",\"obliger\",\"obscur\",\"observer\",\"obstacle\",\"obtenir\",\"obturer\",\"occasion\",\"occuper\",\"océan\",\"octobre\",\"octroyer\",\"octupler\",\"oculaire\",\"odeur\",\"odorant\",\"offenser\",\"officier\",\"offrir\",\"ogive\",\"oiseau\",\"oisillon\",\"olfactif\",\"olivier\",\"ombrage\",\"omettre\",\"onctueux\",\"onduler\",\"onéreux\",\"onirique\",\"opale\",\"opaque\",\"opérer\",\"opinion\",\"opportun\",\"opprimer\",\"opter\",\"optique\",\"orageux\",\"orange\",\"orbite\",\"ordonner\",\"oreille\",\"organe\",\"orgueil\",\"orifice\",\"ornement\",\"orque\",\"ortie\",\"osciller\",\"osmose\",\"ossature\",\"otarie\",\"ouragan\",\"ourson\",\"outil\",\"outrager\",\"ouvrage\",\"ovation\",\"oxyde\",\"oxygène\",\"ozone\",\"paisible\",\"palace\",\"palmarès\",\"palourde\",\"palper\",\"panache\",\"panda\",\"pangolin\",\"paniquer\",\"panneau\",\"panorama\",\"pantalon\",\"papaye\",\"papier\",\"papoter\",\"papyrus\",\"paradoxe\",\"parcelle\",\"paresse\",\"parfumer\",\"parler\",\"parole\",\"parrain\",\"parsemer\",\"partager\",\"parure\",\"parvenir\",\"passion\",\"pastèque\",\"paternel\",\"patience\",\"patron\",\"pavillon\",\"pavoiser\",\"payer\",\"paysage\",\"peigne\",\"peintre\",\"pelage\",\"pélican\",\"pelle\",\"pelouse\",\"peluche\",\"pendule\",\"pénétrer\",\"pénible\",\"pensif\",\"pénurie\",\"pépite\",\"péplum\",\"perdrix\",\"perforer\",\"période\",\"permuter\",\"perplexe\",\"persil\",\"perte\",\"peser\",\"pétale\",\"petit\",\"pétrir\",\"peuple\",\"pharaon\",\"phobie\",\"phoque\",\"photon\",\"phrase\",\"physique\",\"piano\",\"pictural\",\"pièce\",\"pierre\",\"pieuvre\",\"pilote\",\"pinceau\",\"pipette\",\"piquer\",\"pirogue\",\"piscine\",\"piston\",\"pivoter\",\"pixel\",\"pizza\",\"placard\",\"plafond\",\"plaisir\",\"planer\",\"plaque\",\"plastron\",\"plateau\",\"pleurer\",\"plexus\",\"pliage\",\"plomb\",\"plonger\",\"pluie\",\"plumage\",\"pochette\",\"poésie\",\"poète\",\"pointe\",\"poirier\",\"poisson\",\"poivre\",\"polaire\",\"policier\",\"pollen\",\"polygone\",\"pommade\",\"pompier\",\"ponctuel\",\"pondérer\",\"poney\",\"portique\",\"position\",\"posséder\",\"posture\",\"potager\",\"poteau\",\"potion\",\"pouce\",\"poulain\",\"poumon\",\"pourpre\",\"poussin\",\"pouvoir\",\"prairie\",\"pratique\",\"précieux\",\"prédire\",\"préfixe\",\"prélude\",\"prénom\",\"présence\",\"prétexte\",\"prévoir\",\"primitif\",\"prince\",\"prison\",\"priver\",\"problème\",\"procéder\",\"prodige\",\"profond\",\"progrès\",\"proie\",\"projeter\",\"prologue\",\"promener\",\"propre\",\"prospère\",\"protéger\",\"prouesse\",\"proverbe\",\"prudence\",\"pruneau\",\"psychose\",\"public\",\"puceron\",\"puiser\",\"pulpe\",\"pulsar\",\"punaise\",\"punitif\",\"pupitre\",\"purifier\",\"puzzle\",\"pyramide\",\"quasar\",\"querelle\",\"question\",\"quiétude\",\"quitter\",\"quotient\",\"racine\",\"raconter\",\"radieux\",\"ragondin\",\"raideur\",\"raisin\",\"ralentir\",\"rallonge\",\"ramasser\",\"rapide\",\"rasage\",\"ratisser\",\"ravager\",\"ravin\",\"rayonner\",\"réactif\",\"réagir\",\"réaliser\",\"réanimer\",\"recevoir\",\"réciter\",\"réclamer\",\"récolter\",\"recruter\",\"reculer\",\"recycler\",\"rédiger\",\"redouter\",\"refaire\",\"réflexe\",\"réformer\",\"refrain\",\"refuge\",\"régalien\",\"région\",\"réglage\",\"régulier\",\"réitérer\",\"rejeter\",\"rejouer\",\"relatif\",\"relever\",\"relief\",\"remarque\",\"remède\",\"remise\",\"remonter\",\"remplir\",\"remuer\",\"renard\",\"renfort\",\"renifler\",\"renoncer\",\"rentrer\",\"renvoi\",\"replier\",\"reporter\",\"reprise\",\"reptile\",\"requin\",\"réserve\",\"résineux\",\"résoudre\",\"respect\",\"rester\",\"résultat\",\"rétablir\",\"retenir\",\"réticule\",\"retomber\",\"retracer\",\"réunion\",\"réussir\",\"revanche\",\"revivre\",\"révolte\",\"révulsif\",\"richesse\",\"rideau\",\"rieur\",\"rigide\",\"rigoler\",\"rincer\",\"riposter\",\"risible\",\"risque\",\"rituel\",\"rival\",\"rivière\",\"rocheux\",\"romance\",\"rompre\",\"ronce\",\"rondin\",\"roseau\",\"rosier\",\"rotatif\",\"rotor\",\"rotule\",\"rouge\",\"rouille\",\"rouleau\",\"routine\",\"royaume\",\"ruban\",\"rubis\",\"ruche\",\"ruelle\",\"rugueux\",\"ruiner\",\"ruisseau\",\"ruser\",\"rustique\",\"rythme\",\"sabler\",\"saboter\",\"sabre\",\"sacoche\",\"safari\",\"sagesse\",\"saisir\",\"salade\",\"salive\",\"salon\",\"saluer\",\"samedi\",\"sanction\",\"sanglier\",\"sarcasme\",\"sardine\",\"saturer\",\"saugrenu\",\"saumon\",\"sauter\",\"sauvage\",\"savant\",\"savonner\",\"scalpel\",\"scandale\",\"scélérat\",\"scénario\",\"sceptre\",\"schéma\",\"science\",\"scinder\",\"score\",\"scrutin\",\"sculpter\",\"séance\",\"sécable\",\"sécher\",\"secouer\",\"sécréter\",\"sédatif\",\"séduire\",\"seigneur\",\"séjour\",\"sélectif\",\"semaine\",\"sembler\",\"semence\",\"séminal\",\"sénateur\",\"sensible\",\"sentence\",\"séparer\",\"séquence\",\"serein\",\"sergent\",\"sérieux\",\"serrure\",\"sérum\",\"service\",\"sésame\",\"sévir\",\"sevrage\",\"sextuple\",\"sidéral\",\"siècle\",\"siéger\",\"siffler\",\"sigle\",\"signal\",\"silence\",\"silicium\",\"simple\",\"sincère\",\"sinistre\",\"siphon\",\"sirop\",\"sismique\",\"situer\",\"skier\",\"social\",\"socle\",\"sodium\",\"soigneux\",\"soldat\",\"soleil\",\"solitude\",\"soluble\",\"sombre\",\"sommeil\",\"somnoler\",\"sonde\",\"songeur\",\"sonnette\",\"sonore\",\"sorcier\",\"sortir\",\"sosie\",\"sottise\",\"soucieux\",\"soudure\",\"souffle\",\"soulever\",\"soupape\",\"source\",\"soutirer\",\"souvenir\",\"spacieux\",\"spatial\",\"spécial\",\"sphère\",\"spiral\",\"stable\",\"station\",\"sternum\",\"stimulus\",\"stipuler\",\"strict\",\"studieux\",\"stupeur\",\"styliste\",\"sublime\",\"substrat\",\"subtil\",\"subvenir\",\"succès\",\"sucre\",\"suffixe\",\"suggérer\",\"suiveur\",\"sulfate\",\"superbe\",\"supplier\",\"surface\",\"suricate\",\"surmener\",\"surprise\",\"sursaut\",\"survie\",\"suspect\",\"syllabe\",\"symbole\",\"symétrie\",\"synapse\",\"syntaxe\",\"système\",\"tabac\",\"tablier\",\"tactile\",\"tailler\",\"talent\",\"talisman\",\"talonner\",\"tambour\",\"tamiser\",\"tangible\",\"tapis\",\"taquiner\",\"tarder\",\"tarif\",\"tartine\",\"tasse\",\"tatami\",\"tatouage\",\"taupe\",\"taureau\",\"taxer\",\"témoin\",\"temporel\",\"tenaille\",\"tendre\",\"teneur\",\"tenir\",\"tension\",\"terminer\",\"terne\",\"terrible\",\"tétine\",\"texte\",\"thème\",\"théorie\",\"thérapie\",\"thorax\",\"tibia\",\"tiède\",\"timide\",\"tirelire\",\"tiroir\",\"tissu\",\"titane\",\"titre\",\"tituber\",\"toboggan\",\"tolérant\",\"tomate\",\"tonique\",\"tonneau\",\"toponyme\",\"torche\",\"tordre\",\"tornade\",\"torpille\",\"torrent\",\"torse\",\"tortue\",\"totem\",\"toucher\",\"tournage\",\"tousser\",\"toxine\",\"traction\",\"trafic\",\"tragique\",\"trahir\",\"train\",\"trancher\",\"travail\",\"trèfle\",\"tremper\",\"trésor\",\"treuil\",\"triage\",\"tribunal\",\"tricoter\",\"trilogie\",\"triomphe\",\"tripler\",\"triturer\",\"trivial\",\"trombone\",\"tronc\",\"tropical\",\"troupeau\",\"tuile\",\"tulipe\",\"tumulte\",\"tunnel\",\"turbine\",\"tuteur\",\"tutoyer\",\"tuyau\",\"tympan\",\"typhon\",\"typique\",\"tyran\",\"ubuesque\",\"ultime\",\"ultrason\",\"unanime\",\"unifier\",\"union\",\"unique\",\"unitaire\",\"univers\",\"uranium\",\"urbain\",\"urticant\",\"usage\",\"usine\",\"usuel\",\"usure\",\"utile\",\"utopie\",\"vacarme\",\"vaccin\",\"vagabond\",\"vague\",\"vaillant\",\"vaincre\",\"vaisseau\",\"valable\",\"valise\",\"vallon\",\"valve\",\"vampire\",\"vanille\",\"vapeur\",\"varier\",\"vaseux\",\"vassal\",\"vaste\",\"vecteur\",\"vedette\",\"végétal\",\"véhicule\",\"veinard\",\"véloce\",\"vendredi\",\"vénérer\",\"venger\",\"venimeux\",\"ventouse\",\"verdure\",\"vérin\",\"vernir\",\"verrou\",\"verser\",\"vertu\",\"veston\",\"vétéran\",\"vétuste\",\"vexant\",\"vexer\",\"viaduc\",\"viande\",\"victoire\",\"vidange\",\"vidéo\",\"vignette\",\"vigueur\",\"vilain\",\"village\",\"vinaigre\",\"violon\",\"vipère\",\"virement\",\"virtuose\",\"virus\",\"visage\",\"viseur\",\"vision\",\"visqueux\",\"visuel\",\"vital\",\"vitesse\",\"viticole\",\"vitrine\",\"vivace\",\"vivipare\",\"vocation\",\"voguer\",\"voile\",\"voisin\",\"voiture\",\"volaille\",\"volcan\",\"voltiger\",\"volume\",\"vorace\",\"vortex\",\"voter\",\"vouloir\",\"voyage\",\"voyelle\",\"wagon\",\"xénon\",\"yacht\",\"zèbre\",\"zénith\",\"zeste\",\"zoologie\"]");

/***/ }),

/***/ 732:
/***/ (function(module) {

module.exports = JSON.parse("[\"abaco\",\"abbaglio\",\"abbinato\",\"abete\",\"abisso\",\"abolire\",\"abrasivo\",\"abrogato\",\"accadere\",\"accenno\",\"accusato\",\"acetone\",\"achille\",\"acido\",\"acqua\",\"acre\",\"acrilico\",\"acrobata\",\"acuto\",\"adagio\",\"addebito\",\"addome\",\"adeguato\",\"aderire\",\"adipe\",\"adottare\",\"adulare\",\"affabile\",\"affetto\",\"affisso\",\"affranto\",\"aforisma\",\"afoso\",\"africano\",\"agave\",\"agente\",\"agevole\",\"aggancio\",\"agire\",\"agitare\",\"agonismo\",\"agricolo\",\"agrumeto\",\"aguzzo\",\"alabarda\",\"alato\",\"albatro\",\"alberato\",\"albo\",\"albume\",\"alce\",\"alcolico\",\"alettone\",\"alfa\",\"algebra\",\"aliante\",\"alibi\",\"alimento\",\"allagato\",\"allegro\",\"allievo\",\"allodola\",\"allusivo\",\"almeno\",\"alogeno\",\"alpaca\",\"alpestre\",\"altalena\",\"alterno\",\"alticcio\",\"altrove\",\"alunno\",\"alveolo\",\"alzare\",\"amalgama\",\"amanita\",\"amarena\",\"ambito\",\"ambrato\",\"ameba\",\"america\",\"ametista\",\"amico\",\"ammasso\",\"ammenda\",\"ammirare\",\"ammonito\",\"amore\",\"ampio\",\"ampliare\",\"amuleto\",\"anacardo\",\"anagrafe\",\"analista\",\"anarchia\",\"anatra\",\"anca\",\"ancella\",\"ancora\",\"andare\",\"andrea\",\"anello\",\"angelo\",\"angolare\",\"angusto\",\"anima\",\"annegare\",\"annidato\",\"anno\",\"annuncio\",\"anonimo\",\"anticipo\",\"anzi\",\"apatico\",\"apertura\",\"apode\",\"apparire\",\"appetito\",\"appoggio\",\"approdo\",\"appunto\",\"aprile\",\"arabica\",\"arachide\",\"aragosta\",\"araldica\",\"arancio\",\"aratura\",\"arazzo\",\"arbitro\",\"archivio\",\"ardito\",\"arenile\",\"argento\",\"argine\",\"arguto\",\"aria\",\"armonia\",\"arnese\",\"arredato\",\"arringa\",\"arrosto\",\"arsenico\",\"arso\",\"artefice\",\"arzillo\",\"asciutto\",\"ascolto\",\"asepsi\",\"asettico\",\"asfalto\",\"asino\",\"asola\",\"aspirato\",\"aspro\",\"assaggio\",\"asse\",\"assoluto\",\"assurdo\",\"asta\",\"astenuto\",\"astice\",\"astratto\",\"atavico\",\"ateismo\",\"atomico\",\"atono\",\"attesa\",\"attivare\",\"attorno\",\"attrito\",\"attuale\",\"ausilio\",\"austria\",\"autista\",\"autonomo\",\"autunno\",\"avanzato\",\"avere\",\"avvenire\",\"avviso\",\"avvolgere\",\"azione\",\"azoto\",\"azzimo\",\"azzurro\",\"babele\",\"baccano\",\"bacino\",\"baco\",\"badessa\",\"badilata\",\"bagnato\",\"baita\",\"balcone\",\"baldo\",\"balena\",\"ballata\",\"balzano\",\"bambino\",\"bandire\",\"baraonda\",\"barbaro\",\"barca\",\"baritono\",\"barlume\",\"barocco\",\"basilico\",\"basso\",\"batosta\",\"battuto\",\"baule\",\"bava\",\"bavosa\",\"becco\",\"beffa\",\"belgio\",\"belva\",\"benda\",\"benevole\",\"benigno\",\"benzina\",\"bere\",\"berlina\",\"beta\",\"bibita\",\"bici\",\"bidone\",\"bifido\",\"biga\",\"bilancia\",\"bimbo\",\"binocolo\",\"biologo\",\"bipede\",\"bipolare\",\"birbante\",\"birra\",\"biscotto\",\"bisesto\",\"bisnonno\",\"bisonte\",\"bisturi\",\"bizzarro\",\"blando\",\"blatta\",\"bollito\",\"bonifico\",\"bordo\",\"bosco\",\"botanico\",\"bottino\",\"bozzolo\",\"braccio\",\"bradipo\",\"brama\",\"branca\",\"bravura\",\"bretella\",\"brevetto\",\"brezza\",\"briglia\",\"brillante\",\"brindare\",\"broccolo\",\"brodo\",\"bronzina\",\"brullo\",\"bruno\",\"bubbone\",\"buca\",\"budino\",\"buffone\",\"buio\",\"bulbo\",\"buono\",\"burlone\",\"burrasca\",\"bussola\",\"busta\",\"cadetto\",\"caduco\",\"calamaro\",\"calcolo\",\"calesse\",\"calibro\",\"calmo\",\"caloria\",\"cambusa\",\"camerata\",\"camicia\",\"cammino\",\"camola\",\"campale\",\"canapa\",\"candela\",\"cane\",\"canino\",\"canotto\",\"cantina\",\"capace\",\"capello\",\"capitolo\",\"capogiro\",\"cappero\",\"capra\",\"capsula\",\"carapace\",\"carcassa\",\"cardo\",\"carisma\",\"carovana\",\"carretto\",\"cartolina\",\"casaccio\",\"cascata\",\"caserma\",\"caso\",\"cassone\",\"castello\",\"casuale\",\"catasta\",\"catena\",\"catrame\",\"cauto\",\"cavillo\",\"cedibile\",\"cedrata\",\"cefalo\",\"celebre\",\"cellulare\",\"cena\",\"cenone\",\"centesimo\",\"ceramica\",\"cercare\",\"certo\",\"cerume\",\"cervello\",\"cesoia\",\"cespo\",\"ceto\",\"chela\",\"chiaro\",\"chicca\",\"chiedere\",\"chimera\",\"china\",\"chirurgo\",\"chitarra\",\"ciao\",\"ciclismo\",\"cifrare\",\"cigno\",\"cilindro\",\"ciottolo\",\"circa\",\"cirrosi\",\"citrico\",\"cittadino\",\"ciuffo\",\"civetta\",\"civile\",\"classico\",\"clinica\",\"cloro\",\"cocco\",\"codardo\",\"codice\",\"coerente\",\"cognome\",\"collare\",\"colmato\",\"colore\",\"colposo\",\"coltivato\",\"colza\",\"coma\",\"cometa\",\"commando\",\"comodo\",\"computer\",\"comune\",\"conciso\",\"condurre\",\"conferma\",\"congelare\",\"coniuge\",\"connesso\",\"conoscere\",\"consumo\",\"continuo\",\"convegno\",\"coperto\",\"copione\",\"coppia\",\"copricapo\",\"corazza\",\"cordata\",\"coricato\",\"cornice\",\"corolla\",\"corpo\",\"corredo\",\"corsia\",\"cortese\",\"cosmico\",\"costante\",\"cottura\",\"covato\",\"cratere\",\"cravatta\",\"creato\",\"credere\",\"cremoso\",\"crescita\",\"creta\",\"criceto\",\"crinale\",\"crisi\",\"critico\",\"croce\",\"cronaca\",\"crostata\",\"cruciale\",\"crusca\",\"cucire\",\"cuculo\",\"cugino\",\"cullato\",\"cupola\",\"curatore\",\"cursore\",\"curvo\",\"cuscino\",\"custode\",\"dado\",\"daino\",\"dalmata\",\"damerino\",\"daniela\",\"dannoso\",\"danzare\",\"datato\",\"davanti\",\"davvero\",\"debutto\",\"decennio\",\"deciso\",\"declino\",\"decollo\",\"decreto\",\"dedicato\",\"definito\",\"deforme\",\"degno\",\"delegare\",\"delfino\",\"delirio\",\"delta\",\"demenza\",\"denotato\",\"dentro\",\"deposito\",\"derapata\",\"derivare\",\"deroga\",\"descritto\",\"deserto\",\"desiderio\",\"desumere\",\"detersivo\",\"devoto\",\"diametro\",\"dicembre\",\"diedro\",\"difeso\",\"diffuso\",\"digerire\",\"digitale\",\"diluvio\",\"dinamico\",\"dinnanzi\",\"dipinto\",\"diploma\",\"dipolo\",\"diradare\",\"dire\",\"dirotto\",\"dirupo\",\"disagio\",\"discreto\",\"disfare\",\"disgelo\",\"disposto\",\"distanza\",\"disumano\",\"dito\",\"divano\",\"divelto\",\"dividere\",\"divorato\",\"doblone\",\"docente\",\"doganale\",\"dogma\",\"dolce\",\"domato\",\"domenica\",\"dominare\",\"dondolo\",\"dono\",\"dormire\",\"dote\",\"dottore\",\"dovuto\",\"dozzina\",\"drago\",\"druido\",\"dubbio\",\"dubitare\",\"ducale\",\"duna\",\"duomo\",\"duplice\",\"duraturo\",\"ebano\",\"eccesso\",\"ecco\",\"eclissi\",\"economia\",\"edera\",\"edicola\",\"edile\",\"editoria\",\"educare\",\"egemonia\",\"egli\",\"egoismo\",\"egregio\",\"elaborato\",\"elargire\",\"elegante\",\"elencato\",\"eletto\",\"elevare\",\"elfico\",\"elica\",\"elmo\",\"elsa\",\"eluso\",\"emanato\",\"emblema\",\"emesso\",\"emiro\",\"emotivo\",\"emozione\",\"empirico\",\"emulo\",\"endemico\",\"enduro\",\"energia\",\"enfasi\",\"enoteca\",\"entrare\",\"enzima\",\"epatite\",\"epilogo\",\"episodio\",\"epocale\",\"eppure\",\"equatore\",\"erario\",\"erba\",\"erboso\",\"erede\",\"eremita\",\"erigere\",\"ermetico\",\"eroe\",\"erosivo\",\"errante\",\"esagono\",\"esame\",\"esanime\",\"esaudire\",\"esca\",\"esempio\",\"esercito\",\"esibito\",\"esigente\",\"esistere\",\"esito\",\"esofago\",\"esortato\",\"esoso\",\"espanso\",\"espresso\",\"essenza\",\"esso\",\"esteso\",\"estimare\",\"estonia\",\"estroso\",\"esultare\",\"etilico\",\"etnico\",\"etrusco\",\"etto\",\"euclideo\",\"europa\",\"evaso\",\"evidenza\",\"evitato\",\"evoluto\",\"evviva\",\"fabbrica\",\"faccenda\",\"fachiro\",\"falco\",\"famiglia\",\"fanale\",\"fanfara\",\"fango\",\"fantasma\",\"fare\",\"farfalla\",\"farinoso\",\"farmaco\",\"fascia\",\"fastoso\",\"fasullo\",\"faticare\",\"fato\",\"favoloso\",\"febbre\",\"fecola\",\"fede\",\"fegato\",\"felpa\",\"feltro\",\"femmina\",\"fendere\",\"fenomeno\",\"fermento\",\"ferro\",\"fertile\",\"fessura\",\"festivo\",\"fetta\",\"feudo\",\"fiaba\",\"fiducia\",\"fifa\",\"figurato\",\"filo\",\"finanza\",\"finestra\",\"finire\",\"fiore\",\"fiscale\",\"fisico\",\"fiume\",\"flacone\",\"flamenco\",\"flebo\",\"flemma\",\"florido\",\"fluente\",\"fluoro\",\"fobico\",\"focaccia\",\"focoso\",\"foderato\",\"foglio\",\"folata\",\"folclore\",\"folgore\",\"fondente\",\"fonetico\",\"fonia\",\"fontana\",\"forbito\",\"forchetta\",\"foresta\",\"formica\",\"fornaio\",\"foro\",\"fortezza\",\"forzare\",\"fosfato\",\"fosso\",\"fracasso\",\"frana\",\"frassino\",\"fratello\",\"freccetta\",\"frenata\",\"fresco\",\"frigo\",\"frollino\",\"fronde\",\"frugale\",\"frutta\",\"fucilata\",\"fucsia\",\"fuggente\",\"fulmine\",\"fulvo\",\"fumante\",\"fumetto\",\"fumoso\",\"fune\",\"funzione\",\"fuoco\",\"furbo\",\"furgone\",\"furore\",\"fuso\",\"futile\",\"gabbiano\",\"gaffe\",\"galateo\",\"gallina\",\"galoppo\",\"gambero\",\"gamma\",\"garanzia\",\"garbo\",\"garofano\",\"garzone\",\"gasdotto\",\"gasolio\",\"gastrico\",\"gatto\",\"gaudio\",\"gazebo\",\"gazzella\",\"geco\",\"gelatina\",\"gelso\",\"gemello\",\"gemmato\",\"gene\",\"genitore\",\"gennaio\",\"genotipo\",\"gergo\",\"ghepardo\",\"ghiaccio\",\"ghisa\",\"giallo\",\"gilda\",\"ginepro\",\"giocare\",\"gioiello\",\"giorno\",\"giove\",\"girato\",\"girone\",\"gittata\",\"giudizio\",\"giurato\",\"giusto\",\"globulo\",\"glutine\",\"gnomo\",\"gobba\",\"golf\",\"gomito\",\"gommone\",\"gonfio\",\"gonna\",\"governo\",\"gracile\",\"grado\",\"grafico\",\"grammo\",\"grande\",\"grattare\",\"gravoso\",\"grazia\",\"greca\",\"gregge\",\"grifone\",\"grigio\",\"grinza\",\"grotta\",\"gruppo\",\"guadagno\",\"guaio\",\"guanto\",\"guardare\",\"gufo\",\"guidare\",\"ibernato\",\"icona\",\"identico\",\"idillio\",\"idolo\",\"idra\",\"idrico\",\"idrogeno\",\"igiene\",\"ignaro\",\"ignorato\",\"ilare\",\"illeso\",\"illogico\",\"illudere\",\"imballo\",\"imbevuto\",\"imbocco\",\"imbuto\",\"immane\",\"immerso\",\"immolato\",\"impacco\",\"impeto\",\"impiego\",\"importo\",\"impronta\",\"inalare\",\"inarcare\",\"inattivo\",\"incanto\",\"incendio\",\"inchino\",\"incisivo\",\"incluso\",\"incontro\",\"incrocio\",\"incubo\",\"indagine\",\"india\",\"indole\",\"inedito\",\"infatti\",\"infilare\",\"inflitto\",\"ingaggio\",\"ingegno\",\"inglese\",\"ingordo\",\"ingrosso\",\"innesco\",\"inodore\",\"inoltrare\",\"inondato\",\"insano\",\"insetto\",\"insieme\",\"insonnia\",\"insulina\",\"intasato\",\"intero\",\"intonaco\",\"intuito\",\"inumidire\",\"invalido\",\"invece\",\"invito\",\"iperbole\",\"ipnotico\",\"ipotesi\",\"ippica\",\"iride\",\"irlanda\",\"ironico\",\"irrigato\",\"irrorare\",\"isolato\",\"isotopo\",\"isterico\",\"istituto\",\"istrice\",\"italia\",\"iterare\",\"labbro\",\"labirinto\",\"lacca\",\"lacerato\",\"lacrima\",\"lacuna\",\"laddove\",\"lago\",\"lampo\",\"lancetta\",\"lanterna\",\"lardoso\",\"larga\",\"laringe\",\"lastra\",\"latenza\",\"latino\",\"lattuga\",\"lavagna\",\"lavoro\",\"legale\",\"leggero\",\"lembo\",\"lentezza\",\"lenza\",\"leone\",\"lepre\",\"lesivo\",\"lessato\",\"lesto\",\"letterale\",\"leva\",\"levigato\",\"libero\",\"lido\",\"lievito\",\"lilla\",\"limatura\",\"limitare\",\"limpido\",\"lineare\",\"lingua\",\"liquido\",\"lira\",\"lirica\",\"lisca\",\"lite\",\"litigio\",\"livrea\",\"locanda\",\"lode\",\"logica\",\"lombare\",\"londra\",\"longevo\",\"loquace\",\"lorenzo\",\"loto\",\"lotteria\",\"luce\",\"lucidato\",\"lumaca\",\"luminoso\",\"lungo\",\"lupo\",\"luppolo\",\"lusinga\",\"lusso\",\"lutto\",\"macabro\",\"macchina\",\"macero\",\"macinato\",\"madama\",\"magico\",\"maglia\",\"magnete\",\"magro\",\"maiolica\",\"malafede\",\"malgrado\",\"malinteso\",\"malsano\",\"malto\",\"malumore\",\"mana\",\"mancia\",\"mandorla\",\"mangiare\",\"manifesto\",\"mannaro\",\"manovra\",\"mansarda\",\"mantide\",\"manubrio\",\"mappa\",\"maratona\",\"marcire\",\"maretta\",\"marmo\",\"marsupio\",\"maschera\",\"massaia\",\"mastino\",\"materasso\",\"matricola\",\"mattone\",\"maturo\",\"mazurca\",\"meandro\",\"meccanico\",\"mecenate\",\"medesimo\",\"meditare\",\"mega\",\"melassa\",\"melis\",\"melodia\",\"meninge\",\"meno\",\"mensola\",\"mercurio\",\"merenda\",\"merlo\",\"meschino\",\"mese\",\"messere\",\"mestolo\",\"metallo\",\"metodo\",\"mettere\",\"miagolare\",\"mica\",\"micelio\",\"michele\",\"microbo\",\"midollo\",\"miele\",\"migliore\",\"milano\",\"milite\",\"mimosa\",\"minerale\",\"mini\",\"minore\",\"mirino\",\"mirtillo\",\"miscela\",\"missiva\",\"misto\",\"misurare\",\"mitezza\",\"mitigare\",\"mitra\",\"mittente\",\"mnemonico\",\"modello\",\"modifica\",\"modulo\",\"mogano\",\"mogio\",\"mole\",\"molosso\",\"monastero\",\"monco\",\"mondina\",\"monetario\",\"monile\",\"monotono\",\"monsone\",\"montato\",\"monviso\",\"mora\",\"mordere\",\"morsicato\",\"mostro\",\"motivato\",\"motosega\",\"motto\",\"movenza\",\"movimento\",\"mozzo\",\"mucca\",\"mucosa\",\"muffa\",\"mughetto\",\"mugnaio\",\"mulatto\",\"mulinello\",\"multiplo\",\"mummia\",\"munto\",\"muovere\",\"murale\",\"musa\",\"muscolo\",\"musica\",\"mutevole\",\"muto\",\"nababbo\",\"nafta\",\"nanometro\",\"narciso\",\"narice\",\"narrato\",\"nascere\",\"nastrare\",\"naturale\",\"nautica\",\"naviglio\",\"nebulosa\",\"necrosi\",\"negativo\",\"negozio\",\"nemmeno\",\"neofita\",\"neretto\",\"nervo\",\"nessuno\",\"nettuno\",\"neutrale\",\"neve\",\"nevrotico\",\"nicchia\",\"ninfa\",\"nitido\",\"nobile\",\"nocivo\",\"nodo\",\"nome\",\"nomina\",\"nordico\",\"normale\",\"norvegese\",\"nostrano\",\"notare\",\"notizia\",\"notturno\",\"novella\",\"nucleo\",\"nulla\",\"numero\",\"nuovo\",\"nutrire\",\"nuvola\",\"nuziale\",\"oasi\",\"obbedire\",\"obbligo\",\"obelisco\",\"oblio\",\"obolo\",\"obsoleto\",\"occasione\",\"occhio\",\"occidente\",\"occorrere\",\"occultare\",\"ocra\",\"oculato\",\"odierno\",\"odorare\",\"offerta\",\"offrire\",\"offuscato\",\"oggetto\",\"oggi\",\"ognuno\",\"olandese\",\"olfatto\",\"oliato\",\"oliva\",\"ologramma\",\"oltre\",\"omaggio\",\"ombelico\",\"ombra\",\"omega\",\"omissione\",\"ondoso\",\"onere\",\"onice\",\"onnivoro\",\"onorevole\",\"onta\",\"operato\",\"opinione\",\"opposto\",\"oracolo\",\"orafo\",\"ordine\",\"orecchino\",\"orefice\",\"orfano\",\"organico\",\"origine\",\"orizzonte\",\"orma\",\"ormeggio\",\"ornativo\",\"orologio\",\"orrendo\",\"orribile\",\"ortensia\",\"ortica\",\"orzata\",\"orzo\",\"osare\",\"oscurare\",\"osmosi\",\"ospedale\",\"ospite\",\"ossa\",\"ossidare\",\"ostacolo\",\"oste\",\"otite\",\"otre\",\"ottagono\",\"ottimo\",\"ottobre\",\"ovale\",\"ovest\",\"ovino\",\"oviparo\",\"ovocito\",\"ovunque\",\"ovviare\",\"ozio\",\"pacchetto\",\"pace\",\"pacifico\",\"padella\",\"padrone\",\"paese\",\"paga\",\"pagina\",\"palazzina\",\"palesare\",\"pallido\",\"palo\",\"palude\",\"pandoro\",\"pannello\",\"paolo\",\"paonazzo\",\"paprica\",\"parabola\",\"parcella\",\"parere\",\"pargolo\",\"pari\",\"parlato\",\"parola\",\"partire\",\"parvenza\",\"parziale\",\"passivo\",\"pasticca\",\"patacca\",\"patologia\",\"pattume\",\"pavone\",\"peccato\",\"pedalare\",\"pedonale\",\"peggio\",\"peloso\",\"penare\",\"pendice\",\"penisola\",\"pennuto\",\"penombra\",\"pensare\",\"pentola\",\"pepe\",\"pepita\",\"perbene\",\"percorso\",\"perdonato\",\"perforare\",\"pergamena\",\"periodo\",\"permesso\",\"perno\",\"perplesso\",\"persuaso\",\"pertugio\",\"pervaso\",\"pesatore\",\"pesista\",\"peso\",\"pestifero\",\"petalo\",\"pettine\",\"petulante\",\"pezzo\",\"piacere\",\"pianta\",\"piattino\",\"piccino\",\"picozza\",\"piega\",\"pietra\",\"piffero\",\"pigiama\",\"pigolio\",\"pigro\",\"pila\",\"pilifero\",\"pillola\",\"pilota\",\"pimpante\",\"pineta\",\"pinna\",\"pinolo\",\"pioggia\",\"piombo\",\"piramide\",\"piretico\",\"pirite\",\"pirolisi\",\"pitone\",\"pizzico\",\"placebo\",\"planare\",\"plasma\",\"platano\",\"plenario\",\"pochezza\",\"poderoso\",\"podismo\",\"poesia\",\"poggiare\",\"polenta\",\"poligono\",\"pollice\",\"polmonite\",\"polpetta\",\"polso\",\"poltrona\",\"polvere\",\"pomice\",\"pomodoro\",\"ponte\",\"popoloso\",\"porfido\",\"poroso\",\"porpora\",\"porre\",\"portata\",\"posa\",\"positivo\",\"possesso\",\"postulato\",\"potassio\",\"potere\",\"pranzo\",\"prassi\",\"pratica\",\"precluso\",\"predica\",\"prefisso\",\"pregiato\",\"prelievo\",\"premere\",\"prenotare\",\"preparato\",\"presenza\",\"pretesto\",\"prevalso\",\"prima\",\"principe\",\"privato\",\"problema\",\"procura\",\"produrre\",\"profumo\",\"progetto\",\"prolunga\",\"promessa\",\"pronome\",\"proposta\",\"proroga\",\"proteso\",\"prova\",\"prudente\",\"prugna\",\"prurito\",\"psiche\",\"pubblico\",\"pudica\",\"pugilato\",\"pugno\",\"pulce\",\"pulito\",\"pulsante\",\"puntare\",\"pupazzo\",\"pupilla\",\"puro\",\"quadro\",\"qualcosa\",\"quasi\",\"querela\",\"quota\",\"raccolto\",\"raddoppio\",\"radicale\",\"radunato\",\"raffica\",\"ragazzo\",\"ragione\",\"ragno\",\"ramarro\",\"ramingo\",\"ramo\",\"randagio\",\"rantolare\",\"rapato\",\"rapina\",\"rappreso\",\"rasatura\",\"raschiato\",\"rasente\",\"rassegna\",\"rastrello\",\"rata\",\"ravveduto\",\"reale\",\"recepire\",\"recinto\",\"recluta\",\"recondito\",\"recupero\",\"reddito\",\"redimere\",\"regalato\",\"registro\",\"regola\",\"regresso\",\"relazione\",\"remare\",\"remoto\",\"renna\",\"replica\",\"reprimere\",\"reputare\",\"resa\",\"residente\",\"responso\",\"restauro\",\"rete\",\"retina\",\"retorica\",\"rettifica\",\"revocato\",\"riassunto\",\"ribadire\",\"ribelle\",\"ribrezzo\",\"ricarica\",\"ricco\",\"ricevere\",\"riciclato\",\"ricordo\",\"ricreduto\",\"ridicolo\",\"ridurre\",\"rifasare\",\"riflesso\",\"riforma\",\"rifugio\",\"rigare\",\"rigettato\",\"righello\",\"rilassato\",\"rilevato\",\"rimanere\",\"rimbalzo\",\"rimedio\",\"rimorchio\",\"rinascita\",\"rincaro\",\"rinforzo\",\"rinnovo\",\"rinomato\",\"rinsavito\",\"rintocco\",\"rinuncia\",\"rinvenire\",\"riparato\",\"ripetuto\",\"ripieno\",\"riportare\",\"ripresa\",\"ripulire\",\"risata\",\"rischio\",\"riserva\",\"risibile\",\"riso\",\"rispetto\",\"ristoro\",\"risultato\",\"risvolto\",\"ritardo\",\"ritegno\",\"ritmico\",\"ritrovo\",\"riunione\",\"riva\",\"riverso\",\"rivincita\",\"rivolto\",\"rizoma\",\"roba\",\"robotico\",\"robusto\",\"roccia\",\"roco\",\"rodaggio\",\"rodere\",\"roditore\",\"rogito\",\"rollio\",\"romantico\",\"rompere\",\"ronzio\",\"rosolare\",\"rospo\",\"rotante\",\"rotondo\",\"rotula\",\"rovescio\",\"rubizzo\",\"rubrica\",\"ruga\",\"rullino\",\"rumine\",\"rumoroso\",\"ruolo\",\"rupe\",\"russare\",\"rustico\",\"sabato\",\"sabbiare\",\"sabotato\",\"sagoma\",\"salasso\",\"saldatura\",\"salgemma\",\"salivare\",\"salmone\",\"salone\",\"saltare\",\"saluto\",\"salvo\",\"sapere\",\"sapido\",\"saporito\",\"saraceno\",\"sarcasmo\",\"sarto\",\"sassoso\",\"satellite\",\"satira\",\"satollo\",\"saturno\",\"savana\",\"savio\",\"saziato\",\"sbadiglio\",\"sbalzo\",\"sbancato\",\"sbarra\",\"sbattere\",\"sbavare\",\"sbendare\",\"sbirciare\",\"sbloccato\",\"sbocciato\",\"sbrinare\",\"sbruffone\",\"sbuffare\",\"scabroso\",\"scadenza\",\"scala\",\"scambiare\",\"scandalo\",\"scapola\",\"scarso\",\"scatenare\",\"scavato\",\"scelto\",\"scenico\",\"scettro\",\"scheda\",\"schiena\",\"sciarpa\",\"scienza\",\"scindere\",\"scippo\",\"sciroppo\",\"scivolo\",\"sclerare\",\"scodella\",\"scolpito\",\"scomparto\",\"sconforto\",\"scoprire\",\"scorta\",\"scossone\",\"scozzese\",\"scriba\",\"scrollare\",\"scrutinio\",\"scuderia\",\"scultore\",\"scuola\",\"scuro\",\"scusare\",\"sdebitare\",\"sdoganare\",\"seccatura\",\"secondo\",\"sedano\",\"seggiola\",\"segnalato\",\"segregato\",\"seguito\",\"selciato\",\"selettivo\",\"sella\",\"selvaggio\",\"semaforo\",\"sembrare\",\"seme\",\"seminato\",\"sempre\",\"senso\",\"sentire\",\"sepolto\",\"sequenza\",\"serata\",\"serbato\",\"sereno\",\"serio\",\"serpente\",\"serraglio\",\"servire\",\"sestina\",\"setola\",\"settimana\",\"sfacelo\",\"sfaldare\",\"sfamato\",\"sfarzoso\",\"sfaticato\",\"sfera\",\"sfida\",\"sfilato\",\"sfinge\",\"sfocato\",\"sfoderare\",\"sfogo\",\"sfoltire\",\"sforzato\",\"sfratto\",\"sfruttato\",\"sfuggito\",\"sfumare\",\"sfuso\",\"sgabello\",\"sgarbato\",\"sgonfiare\",\"sgorbio\",\"sgrassato\",\"sguardo\",\"sibilo\",\"siccome\",\"sierra\",\"sigla\",\"signore\",\"silenzio\",\"sillaba\",\"simbolo\",\"simpatico\",\"simulato\",\"sinfonia\",\"singolo\",\"sinistro\",\"sino\",\"sintesi\",\"sinusoide\",\"sipario\",\"sisma\",\"sistole\",\"situato\",\"slitta\",\"slogatura\",\"sloveno\",\"smarrito\",\"smemorato\",\"smentito\",\"smeraldo\",\"smilzo\",\"smontare\",\"smottato\",\"smussato\",\"snellire\",\"snervato\",\"snodo\",\"sobbalzo\",\"sobrio\",\"soccorso\",\"sociale\",\"sodale\",\"soffitto\",\"sogno\",\"soldato\",\"solenne\",\"solido\",\"sollazzo\",\"solo\",\"solubile\",\"solvente\",\"somatico\",\"somma\",\"sonda\",\"sonetto\",\"sonnifero\",\"sopire\",\"soppeso\",\"sopra\",\"sorgere\",\"sorpasso\",\"sorriso\",\"sorso\",\"sorteggio\",\"sorvolato\",\"sospiro\",\"sosta\",\"sottile\",\"spada\",\"spalla\",\"spargere\",\"spatola\",\"spavento\",\"spazzola\",\"specie\",\"spedire\",\"spegnere\",\"spelatura\",\"speranza\",\"spessore\",\"spettrale\",\"spezzato\",\"spia\",\"spigoloso\",\"spillato\",\"spinoso\",\"spirale\",\"splendido\",\"sportivo\",\"sposo\",\"spranga\",\"sprecare\",\"spronato\",\"spruzzo\",\"spuntino\",\"squillo\",\"sradicare\",\"srotolato\",\"stabile\",\"stacco\",\"staffa\",\"stagnare\",\"stampato\",\"stantio\",\"starnuto\",\"stasera\",\"statuto\",\"stelo\",\"steppa\",\"sterzo\",\"stiletto\",\"stima\",\"stirpe\",\"stivale\",\"stizzoso\",\"stonato\",\"storico\",\"strappo\",\"stregato\",\"stridulo\",\"strozzare\",\"strutto\",\"stuccare\",\"stufo\",\"stupendo\",\"subentro\",\"succoso\",\"sudore\",\"suggerito\",\"sugo\",\"sultano\",\"suonare\",\"superbo\",\"supporto\",\"surgelato\",\"surrogato\",\"sussurro\",\"sutura\",\"svagare\",\"svedese\",\"sveglio\",\"svelare\",\"svenuto\",\"svezia\",\"sviluppo\",\"svista\",\"svizzera\",\"svolta\",\"svuotare\",\"tabacco\",\"tabulato\",\"tacciare\",\"taciturno\",\"tale\",\"talismano\",\"tampone\",\"tannino\",\"tara\",\"tardivo\",\"targato\",\"tariffa\",\"tarpare\",\"tartaruga\",\"tasto\",\"tattico\",\"taverna\",\"tavolata\",\"tazza\",\"teca\",\"tecnico\",\"telefono\",\"temerario\",\"tempo\",\"temuto\",\"tendone\",\"tenero\",\"tensione\",\"tentacolo\",\"teorema\",\"terme\",\"terrazzo\",\"terzetto\",\"tesi\",\"tesserato\",\"testato\",\"tetro\",\"tettoia\",\"tifare\",\"tigella\",\"timbro\",\"tinto\",\"tipico\",\"tipografo\",\"tiraggio\",\"tiro\",\"titanio\",\"titolo\",\"titubante\",\"tizio\",\"tizzone\",\"toccare\",\"tollerare\",\"tolto\",\"tombola\",\"tomo\",\"tonfo\",\"tonsilla\",\"topazio\",\"topologia\",\"toppa\",\"torba\",\"tornare\",\"torrone\",\"tortora\",\"toscano\",\"tossire\",\"tostatura\",\"totano\",\"trabocco\",\"trachea\",\"trafila\",\"tragedia\",\"tralcio\",\"tramonto\",\"transito\",\"trapano\",\"trarre\",\"trasloco\",\"trattato\",\"trave\",\"treccia\",\"tremolio\",\"trespolo\",\"tributo\",\"tricheco\",\"trifoglio\",\"trillo\",\"trincea\",\"trio\",\"tristezza\",\"triturato\",\"trivella\",\"tromba\",\"trono\",\"troppo\",\"trottola\",\"trovare\",\"truccato\",\"tubatura\",\"tuffato\",\"tulipano\",\"tumulto\",\"tunisia\",\"turbare\",\"turchino\",\"tuta\",\"tutela\",\"ubicato\",\"uccello\",\"uccisore\",\"udire\",\"uditivo\",\"uffa\",\"ufficio\",\"uguale\",\"ulisse\",\"ultimato\",\"umano\",\"umile\",\"umorismo\",\"uncinetto\",\"ungere\",\"ungherese\",\"unicorno\",\"unificato\",\"unisono\",\"unitario\",\"unte\",\"uovo\",\"upupa\",\"uragano\",\"urgenza\",\"urlo\",\"usanza\",\"usato\",\"uscito\",\"usignolo\",\"usuraio\",\"utensile\",\"utilizzo\",\"utopia\",\"vacante\",\"vaccinato\",\"vagabondo\",\"vagliato\",\"valanga\",\"valgo\",\"valico\",\"valletta\",\"valoroso\",\"valutare\",\"valvola\",\"vampata\",\"vangare\",\"vanitoso\",\"vano\",\"vantaggio\",\"vanvera\",\"vapore\",\"varano\",\"varcato\",\"variante\",\"vasca\",\"vedetta\",\"vedova\",\"veduto\",\"vegetale\",\"veicolo\",\"velcro\",\"velina\",\"velluto\",\"veloce\",\"venato\",\"vendemmia\",\"vento\",\"verace\",\"verbale\",\"vergogna\",\"verifica\",\"vero\",\"verruca\",\"verticale\",\"vescica\",\"vessillo\",\"vestale\",\"veterano\",\"vetrina\",\"vetusto\",\"viandante\",\"vibrante\",\"vicenda\",\"vichingo\",\"vicinanza\",\"vidimare\",\"vigilia\",\"vigneto\",\"vigore\",\"vile\",\"villano\",\"vimini\",\"vincitore\",\"viola\",\"vipera\",\"virgola\",\"virologo\",\"virulento\",\"viscoso\",\"visione\",\"vispo\",\"vissuto\",\"visura\",\"vita\",\"vitello\",\"vittima\",\"vivanda\",\"vivido\",\"viziare\",\"voce\",\"voga\",\"volatile\",\"volere\",\"volpe\",\"voragine\",\"vulcano\",\"zampogna\",\"zanna\",\"zappato\",\"zattera\",\"zavorra\",\"zefiro\",\"zelante\",\"zelo\",\"zenzero\",\"zerbino\",\"zibetto\",\"zinco\",\"zircone\",\"zitto\",\"zolla\",\"zotico\",\"zucchero\",\"zufolo\",\"zulu\",\"zuppa\"]");

/***/ }),

/***/ 733:
/***/ (function(module) {

module.exports = JSON.parse("[\"ábaco\",\"abdomen\",\"abeja\",\"abierto\",\"abogado\",\"abono\",\"aborto\",\"abrazo\",\"abrir\",\"abuelo\",\"abuso\",\"acabar\",\"academia\",\"acceso\",\"acción\",\"aceite\",\"acelga\",\"acento\",\"aceptar\",\"ácido\",\"aclarar\",\"acné\",\"acoger\",\"acoso\",\"activo\",\"acto\",\"actriz\",\"actuar\",\"acudir\",\"acuerdo\",\"acusar\",\"adicto\",\"admitir\",\"adoptar\",\"adorno\",\"aduana\",\"adulto\",\"aéreo\",\"afectar\",\"afición\",\"afinar\",\"afirmar\",\"ágil\",\"agitar\",\"agonía\",\"agosto\",\"agotar\",\"agregar\",\"agrio\",\"agua\",\"agudo\",\"águila\",\"aguja\",\"ahogo\",\"ahorro\",\"aire\",\"aislar\",\"ajedrez\",\"ajeno\",\"ajuste\",\"alacrán\",\"alambre\",\"alarma\",\"alba\",\"álbum\",\"alcalde\",\"aldea\",\"alegre\",\"alejar\",\"alerta\",\"aleta\",\"alfiler\",\"alga\",\"algodón\",\"aliado\",\"aliento\",\"alivio\",\"alma\",\"almeja\",\"almíbar\",\"altar\",\"alteza\",\"altivo\",\"alto\",\"altura\",\"alumno\",\"alzar\",\"amable\",\"amante\",\"amapola\",\"amargo\",\"amasar\",\"ámbar\",\"ámbito\",\"ameno\",\"amigo\",\"amistad\",\"amor\",\"amparo\",\"amplio\",\"ancho\",\"anciano\",\"ancla\",\"andar\",\"andén\",\"anemia\",\"ángulo\",\"anillo\",\"ánimo\",\"anís\",\"anotar\",\"antena\",\"antiguo\",\"antojo\",\"anual\",\"anular\",\"anuncio\",\"añadir\",\"añejo\",\"año\",\"apagar\",\"aparato\",\"apetito\",\"apio\",\"aplicar\",\"apodo\",\"aporte\",\"apoyo\",\"aprender\",\"aprobar\",\"apuesta\",\"apuro\",\"arado\",\"araña\",\"arar\",\"árbitro\",\"árbol\",\"arbusto\",\"archivo\",\"arco\",\"arder\",\"ardilla\",\"arduo\",\"área\",\"árido\",\"aries\",\"armonía\",\"arnés\",\"aroma\",\"arpa\",\"arpón\",\"arreglo\",\"arroz\",\"arruga\",\"arte\",\"artista\",\"asa\",\"asado\",\"asalto\",\"ascenso\",\"asegurar\",\"aseo\",\"asesor\",\"asiento\",\"asilo\",\"asistir\",\"asno\",\"asombro\",\"áspero\",\"astilla\",\"astro\",\"astuto\",\"asumir\",\"asunto\",\"atajo\",\"ataque\",\"atar\",\"atento\",\"ateo\",\"ático\",\"atleta\",\"átomo\",\"atraer\",\"atroz\",\"atún\",\"audaz\",\"audio\",\"auge\",\"aula\",\"aumento\",\"ausente\",\"autor\",\"aval\",\"avance\",\"avaro\",\"ave\",\"avellana\",\"avena\",\"avestruz\",\"avión\",\"aviso\",\"ayer\",\"ayuda\",\"ayuno\",\"azafrán\",\"azar\",\"azote\",\"azúcar\",\"azufre\",\"azul\",\"baba\",\"babor\",\"bache\",\"bahía\",\"baile\",\"bajar\",\"balanza\",\"balcón\",\"balde\",\"bambú\",\"banco\",\"banda\",\"baño\",\"barba\",\"barco\",\"barniz\",\"barro\",\"báscula\",\"bastón\",\"basura\",\"batalla\",\"batería\",\"batir\",\"batuta\",\"baúl\",\"bazar\",\"bebé\",\"bebida\",\"bello\",\"besar\",\"beso\",\"bestia\",\"bicho\",\"bien\",\"bingo\",\"blanco\",\"bloque\",\"blusa\",\"boa\",\"bobina\",\"bobo\",\"boca\",\"bocina\",\"boda\",\"bodega\",\"boina\",\"bola\",\"bolero\",\"bolsa\",\"bomba\",\"bondad\",\"bonito\",\"bono\",\"bonsái\",\"borde\",\"borrar\",\"bosque\",\"bote\",\"botín\",\"bóveda\",\"bozal\",\"bravo\",\"brazo\",\"brecha\",\"breve\",\"brillo\",\"brinco\",\"brisa\",\"broca\",\"broma\",\"bronce\",\"brote\",\"bruja\",\"brusco\",\"bruto\",\"buceo\",\"bucle\",\"bueno\",\"buey\",\"bufanda\",\"bufón\",\"búho\",\"buitre\",\"bulto\",\"burbuja\",\"burla\",\"burro\",\"buscar\",\"butaca\",\"buzón\",\"caballo\",\"cabeza\",\"cabina\",\"cabra\",\"cacao\",\"cadáver\",\"cadena\",\"caer\",\"café\",\"caída\",\"caimán\",\"caja\",\"cajón\",\"cal\",\"calamar\",\"calcio\",\"caldo\",\"calidad\",\"calle\",\"calma\",\"calor\",\"calvo\",\"cama\",\"cambio\",\"camello\",\"camino\",\"campo\",\"cáncer\",\"candil\",\"canela\",\"canguro\",\"canica\",\"canto\",\"caña\",\"cañón\",\"caoba\",\"caos\",\"capaz\",\"capitán\",\"capote\",\"captar\",\"capucha\",\"cara\",\"carbón\",\"cárcel\",\"careta\",\"carga\",\"cariño\",\"carne\",\"carpeta\",\"carro\",\"carta\",\"casa\",\"casco\",\"casero\",\"caspa\",\"castor\",\"catorce\",\"catre\",\"caudal\",\"causa\",\"cazo\",\"cebolla\",\"ceder\",\"cedro\",\"celda\",\"célebre\",\"celoso\",\"célula\",\"cemento\",\"ceniza\",\"centro\",\"cerca\",\"cerdo\",\"cereza\",\"cero\",\"cerrar\",\"certeza\",\"césped\",\"cetro\",\"chacal\",\"chaleco\",\"champú\",\"chancla\",\"chapa\",\"charla\",\"chico\",\"chiste\",\"chivo\",\"choque\",\"choza\",\"chuleta\",\"chupar\",\"ciclón\",\"ciego\",\"cielo\",\"cien\",\"cierto\",\"cifra\",\"cigarro\",\"cima\",\"cinco\",\"cine\",\"cinta\",\"ciprés\",\"circo\",\"ciruela\",\"cisne\",\"cita\",\"ciudad\",\"clamor\",\"clan\",\"claro\",\"clase\",\"clave\",\"cliente\",\"clima\",\"clínica\",\"cobre\",\"cocción\",\"cochino\",\"cocina\",\"coco\",\"código\",\"codo\",\"cofre\",\"coger\",\"cohete\",\"cojín\",\"cojo\",\"cola\",\"colcha\",\"colegio\",\"colgar\",\"colina\",\"collar\",\"colmo\",\"columna\",\"combate\",\"comer\",\"comida\",\"cómodo\",\"compra\",\"conde\",\"conejo\",\"conga\",\"conocer\",\"consejo\",\"contar\",\"copa\",\"copia\",\"corazón\",\"corbata\",\"corcho\",\"cordón\",\"corona\",\"correr\",\"coser\",\"cosmos\",\"costa\",\"cráneo\",\"cráter\",\"crear\",\"crecer\",\"creído\",\"crema\",\"cría\",\"crimen\",\"cripta\",\"crisis\",\"cromo\",\"crónica\",\"croqueta\",\"crudo\",\"cruz\",\"cuadro\",\"cuarto\",\"cuatro\",\"cubo\",\"cubrir\",\"cuchara\",\"cuello\",\"cuento\",\"cuerda\",\"cuesta\",\"cueva\",\"cuidar\",\"culebra\",\"culpa\",\"culto\",\"cumbre\",\"cumplir\",\"cuna\",\"cuneta\",\"cuota\",\"cupón\",\"cúpula\",\"curar\",\"curioso\",\"curso\",\"curva\",\"cutis\",\"dama\",\"danza\",\"dar\",\"dardo\",\"dátil\",\"deber\",\"débil\",\"década\",\"decir\",\"dedo\",\"defensa\",\"definir\",\"dejar\",\"delfín\",\"delgado\",\"delito\",\"demora\",\"denso\",\"dental\",\"deporte\",\"derecho\",\"derrota\",\"desayuno\",\"deseo\",\"desfile\",\"desnudo\",\"destino\",\"desvío\",\"detalle\",\"detener\",\"deuda\",\"día\",\"diablo\",\"diadema\",\"diamante\",\"diana\",\"diario\",\"dibujo\",\"dictar\",\"diente\",\"dieta\",\"diez\",\"difícil\",\"digno\",\"dilema\",\"diluir\",\"dinero\",\"directo\",\"dirigir\",\"disco\",\"diseño\",\"disfraz\",\"diva\",\"divino\",\"doble\",\"doce\",\"dolor\",\"domingo\",\"don\",\"donar\",\"dorado\",\"dormir\",\"dorso\",\"dos\",\"dosis\",\"dragón\",\"droga\",\"ducha\",\"duda\",\"duelo\",\"dueño\",\"dulce\",\"dúo\",\"duque\",\"durar\",\"dureza\",\"duro\",\"ébano\",\"ebrio\",\"echar\",\"eco\",\"ecuador\",\"edad\",\"edición\",\"edificio\",\"editor\",\"educar\",\"efecto\",\"eficaz\",\"eje\",\"ejemplo\",\"elefante\",\"elegir\",\"elemento\",\"elevar\",\"elipse\",\"élite\",\"elixir\",\"elogio\",\"eludir\",\"embudo\",\"emitir\",\"emoción\",\"empate\",\"empeño\",\"empleo\",\"empresa\",\"enano\",\"encargo\",\"enchufe\",\"encía\",\"enemigo\",\"enero\",\"enfado\",\"enfermo\",\"engaño\",\"enigma\",\"enlace\",\"enorme\",\"enredo\",\"ensayo\",\"enseñar\",\"entero\",\"entrar\",\"envase\",\"envío\",\"época\",\"equipo\",\"erizo\",\"escala\",\"escena\",\"escolar\",\"escribir\",\"escudo\",\"esencia\",\"esfera\",\"esfuerzo\",\"espada\",\"espejo\",\"espía\",\"esposa\",\"espuma\",\"esquí\",\"estar\",\"este\",\"estilo\",\"estufa\",\"etapa\",\"eterno\",\"ética\",\"etnia\",\"evadir\",\"evaluar\",\"evento\",\"evitar\",\"exacto\",\"examen\",\"exceso\",\"excusa\",\"exento\",\"exigir\",\"exilio\",\"existir\",\"éxito\",\"experto\",\"explicar\",\"exponer\",\"extremo\",\"fábrica\",\"fábula\",\"fachada\",\"fácil\",\"factor\",\"faena\",\"faja\",\"falda\",\"fallo\",\"falso\",\"faltar\",\"fama\",\"familia\",\"famoso\",\"faraón\",\"farmacia\",\"farol\",\"farsa\",\"fase\",\"fatiga\",\"fauna\",\"favor\",\"fax\",\"febrero\",\"fecha\",\"feliz\",\"feo\",\"feria\",\"feroz\",\"fértil\",\"fervor\",\"festín\",\"fiable\",\"fianza\",\"fiar\",\"fibra\",\"ficción\",\"ficha\",\"fideo\",\"fiebre\",\"fiel\",\"fiera\",\"fiesta\",\"figura\",\"fijar\",\"fijo\",\"fila\",\"filete\",\"filial\",\"filtro\",\"fin\",\"finca\",\"fingir\",\"finito\",\"firma\",\"flaco\",\"flauta\",\"flecha\",\"flor\",\"flota\",\"fluir\",\"flujo\",\"flúor\",\"fobia\",\"foca\",\"fogata\",\"fogón\",\"folio\",\"folleto\",\"fondo\",\"forma\",\"forro\",\"fortuna\",\"forzar\",\"fosa\",\"foto\",\"fracaso\",\"frágil\",\"franja\",\"frase\",\"fraude\",\"freír\",\"freno\",\"fresa\",\"frío\",\"frito\",\"fruta\",\"fuego\",\"fuente\",\"fuerza\",\"fuga\",\"fumar\",\"función\",\"funda\",\"furgón\",\"furia\",\"fusil\",\"fútbol\",\"futuro\",\"gacela\",\"gafas\",\"gaita\",\"gajo\",\"gala\",\"galería\",\"gallo\",\"gamba\",\"ganar\",\"gancho\",\"ganga\",\"ganso\",\"garaje\",\"garza\",\"gasolina\",\"gastar\",\"gato\",\"gavilán\",\"gemelo\",\"gemir\",\"gen\",\"género\",\"genio\",\"gente\",\"geranio\",\"gerente\",\"germen\",\"gesto\",\"gigante\",\"gimnasio\",\"girar\",\"giro\",\"glaciar\",\"globo\",\"gloria\",\"gol\",\"golfo\",\"goloso\",\"golpe\",\"goma\",\"gordo\",\"gorila\",\"gorra\",\"gota\",\"goteo\",\"gozar\",\"grada\",\"gráfico\",\"grano\",\"grasa\",\"gratis\",\"grave\",\"grieta\",\"grillo\",\"gripe\",\"gris\",\"grito\",\"grosor\",\"grúa\",\"grueso\",\"grumo\",\"grupo\",\"guante\",\"guapo\",\"guardia\",\"guerra\",\"guía\",\"guiño\",\"guion\",\"guiso\",\"guitarra\",\"gusano\",\"gustar\",\"haber\",\"hábil\",\"hablar\",\"hacer\",\"hacha\",\"hada\",\"hallar\",\"hamaca\",\"harina\",\"haz\",\"hazaña\",\"hebilla\",\"hebra\",\"hecho\",\"helado\",\"helio\",\"hembra\",\"herir\",\"hermano\",\"héroe\",\"hervir\",\"hielo\",\"hierro\",\"hígado\",\"higiene\",\"hijo\",\"himno\",\"historia\",\"hocico\",\"hogar\",\"hoguera\",\"hoja\",\"hombre\",\"hongo\",\"honor\",\"honra\",\"hora\",\"hormiga\",\"horno\",\"hostil\",\"hoyo\",\"hueco\",\"huelga\",\"huerta\",\"hueso\",\"huevo\",\"huida\",\"huir\",\"humano\",\"húmedo\",\"humilde\",\"humo\",\"hundir\",\"huracán\",\"hurto\",\"icono\",\"ideal\",\"idioma\",\"ídolo\",\"iglesia\",\"iglú\",\"igual\",\"ilegal\",\"ilusión\",\"imagen\",\"imán\",\"imitar\",\"impar\",\"imperio\",\"imponer\",\"impulso\",\"incapaz\",\"índice\",\"inerte\",\"infiel\",\"informe\",\"ingenio\",\"inicio\",\"inmenso\",\"inmune\",\"innato\",\"insecto\",\"instante\",\"interés\",\"íntimo\",\"intuir\",\"inútil\",\"invierno\",\"ira\",\"iris\",\"ironía\",\"isla\",\"islote\",\"jabalí\",\"jabón\",\"jamón\",\"jarabe\",\"jardín\",\"jarra\",\"jaula\",\"jazmín\",\"jefe\",\"jeringa\",\"jinete\",\"jornada\",\"joroba\",\"joven\",\"joya\",\"juerga\",\"jueves\",\"juez\",\"jugador\",\"jugo\",\"juguete\",\"juicio\",\"junco\",\"jungla\",\"junio\",\"juntar\",\"júpiter\",\"jurar\",\"justo\",\"juvenil\",\"juzgar\",\"kilo\",\"koala\",\"labio\",\"lacio\",\"lacra\",\"lado\",\"ladrón\",\"lagarto\",\"lágrima\",\"laguna\",\"laico\",\"lamer\",\"lámina\",\"lámpara\",\"lana\",\"lancha\",\"langosta\",\"lanza\",\"lápiz\",\"largo\",\"larva\",\"lástima\",\"lata\",\"látex\",\"latir\",\"laurel\",\"lavar\",\"lazo\",\"leal\",\"lección\",\"leche\",\"lector\",\"leer\",\"legión\",\"legumbre\",\"lejano\",\"lengua\",\"lento\",\"leña\",\"león\",\"leopardo\",\"lesión\",\"letal\",\"letra\",\"leve\",\"leyenda\",\"libertad\",\"libro\",\"licor\",\"líder\",\"lidiar\",\"lienzo\",\"liga\",\"ligero\",\"lima\",\"límite\",\"limón\",\"limpio\",\"lince\",\"lindo\",\"línea\",\"lingote\",\"lino\",\"linterna\",\"líquido\",\"liso\",\"lista\",\"litera\",\"litio\",\"litro\",\"llaga\",\"llama\",\"llanto\",\"llave\",\"llegar\",\"llenar\",\"llevar\",\"llorar\",\"llover\",\"lluvia\",\"lobo\",\"loción\",\"loco\",\"locura\",\"lógica\",\"logro\",\"lombriz\",\"lomo\",\"lonja\",\"lote\",\"lucha\",\"lucir\",\"lugar\",\"lujo\",\"luna\",\"lunes\",\"lupa\",\"lustro\",\"luto\",\"luz\",\"maceta\",\"macho\",\"madera\",\"madre\",\"maduro\",\"maestro\",\"mafia\",\"magia\",\"mago\",\"maíz\",\"maldad\",\"maleta\",\"malla\",\"malo\",\"mamá\",\"mambo\",\"mamut\",\"manco\",\"mando\",\"manejar\",\"manga\",\"maniquí\",\"manjar\",\"mano\",\"manso\",\"manta\",\"mañana\",\"mapa\",\"máquina\",\"mar\",\"marco\",\"marea\",\"marfil\",\"margen\",\"marido\",\"mármol\",\"marrón\",\"martes\",\"marzo\",\"masa\",\"máscara\",\"masivo\",\"matar\",\"materia\",\"matiz\",\"matriz\",\"máximo\",\"mayor\",\"mazorca\",\"mecha\",\"medalla\",\"medio\",\"médula\",\"mejilla\",\"mejor\",\"melena\",\"melón\",\"memoria\",\"menor\",\"mensaje\",\"mente\",\"menú\",\"mercado\",\"merengue\",\"mérito\",\"mes\",\"mesón\",\"meta\",\"meter\",\"método\",\"metro\",\"mezcla\",\"miedo\",\"miel\",\"miembro\",\"miga\",\"mil\",\"milagro\",\"militar\",\"millón\",\"mimo\",\"mina\",\"minero\",\"mínimo\",\"minuto\",\"miope\",\"mirar\",\"misa\",\"miseria\",\"misil\",\"mismo\",\"mitad\",\"mito\",\"mochila\",\"moción\",\"moda\",\"modelo\",\"moho\",\"mojar\",\"molde\",\"moler\",\"molino\",\"momento\",\"momia\",\"monarca\",\"moneda\",\"monja\",\"monto\",\"moño\",\"morada\",\"morder\",\"moreno\",\"morir\",\"morro\",\"morsa\",\"mortal\",\"mosca\",\"mostrar\",\"motivo\",\"mover\",\"móvil\",\"mozo\",\"mucho\",\"mudar\",\"mueble\",\"muela\",\"muerte\",\"muestra\",\"mugre\",\"mujer\",\"mula\",\"muleta\",\"multa\",\"mundo\",\"muñeca\",\"mural\",\"muro\",\"músculo\",\"museo\",\"musgo\",\"música\",\"muslo\",\"nácar\",\"nación\",\"nadar\",\"naipe\",\"naranja\",\"nariz\",\"narrar\",\"nasal\",\"natal\",\"nativo\",\"natural\",\"náusea\",\"naval\",\"nave\",\"navidad\",\"necio\",\"néctar\",\"negar\",\"negocio\",\"negro\",\"neón\",\"nervio\",\"neto\",\"neutro\",\"nevar\",\"nevera\",\"nicho\",\"nido\",\"niebla\",\"nieto\",\"niñez\",\"niño\",\"nítido\",\"nivel\",\"nobleza\",\"noche\",\"nómina\",\"noria\",\"norma\",\"norte\",\"nota\",\"noticia\",\"novato\",\"novela\",\"novio\",\"nube\",\"nuca\",\"núcleo\",\"nudillo\",\"nudo\",\"nuera\",\"nueve\",\"nuez\",\"nulo\",\"número\",\"nutria\",\"oasis\",\"obeso\",\"obispo\",\"objeto\",\"obra\",\"obrero\",\"observar\",\"obtener\",\"obvio\",\"oca\",\"ocaso\",\"océano\",\"ochenta\",\"ocho\",\"ocio\",\"ocre\",\"octavo\",\"octubre\",\"oculto\",\"ocupar\",\"ocurrir\",\"odiar\",\"odio\",\"odisea\",\"oeste\",\"ofensa\",\"oferta\",\"oficio\",\"ofrecer\",\"ogro\",\"oído\",\"oír\",\"ojo\",\"ola\",\"oleada\",\"olfato\",\"olivo\",\"olla\",\"olmo\",\"olor\",\"olvido\",\"ombligo\",\"onda\",\"onza\",\"opaco\",\"opción\",\"ópera\",\"opinar\",\"oponer\",\"optar\",\"óptica\",\"opuesto\",\"oración\",\"orador\",\"oral\",\"órbita\",\"orca\",\"orden\",\"oreja\",\"órgano\",\"orgía\",\"orgullo\",\"oriente\",\"origen\",\"orilla\",\"oro\",\"orquesta\",\"oruga\",\"osadía\",\"oscuro\",\"osezno\",\"oso\",\"ostra\",\"otoño\",\"otro\",\"oveja\",\"óvulo\",\"óxido\",\"oxígeno\",\"oyente\",\"ozono\",\"pacto\",\"padre\",\"paella\",\"página\",\"pago\",\"país\",\"pájaro\",\"palabra\",\"palco\",\"paleta\",\"pálido\",\"palma\",\"paloma\",\"palpar\",\"pan\",\"panal\",\"pánico\",\"pantera\",\"pañuelo\",\"papá\",\"papel\",\"papilla\",\"paquete\",\"parar\",\"parcela\",\"pared\",\"parir\",\"paro\",\"párpado\",\"parque\",\"párrafo\",\"parte\",\"pasar\",\"paseo\",\"pasión\",\"paso\",\"pasta\",\"pata\",\"patio\",\"patria\",\"pausa\",\"pauta\",\"pavo\",\"payaso\",\"peatón\",\"pecado\",\"pecera\",\"pecho\",\"pedal\",\"pedir\",\"pegar\",\"peine\",\"pelar\",\"peldaño\",\"pelea\",\"peligro\",\"pellejo\",\"pelo\",\"peluca\",\"pena\",\"pensar\",\"peñón\",\"peón\",\"peor\",\"pepino\",\"pequeño\",\"pera\",\"percha\",\"perder\",\"pereza\",\"perfil\",\"perico\",\"perla\",\"permiso\",\"perro\",\"persona\",\"pesa\",\"pesca\",\"pésimo\",\"pestaña\",\"pétalo\",\"petróleo\",\"pez\",\"pezuña\",\"picar\",\"pichón\",\"pie\",\"piedra\",\"pierna\",\"pieza\",\"pijama\",\"pilar\",\"piloto\",\"pimienta\",\"pino\",\"pintor\",\"pinza\",\"piña\",\"piojo\",\"pipa\",\"pirata\",\"pisar\",\"piscina\",\"piso\",\"pista\",\"pitón\",\"pizca\",\"placa\",\"plan\",\"plata\",\"playa\",\"plaza\",\"pleito\",\"pleno\",\"plomo\",\"pluma\",\"plural\",\"pobre\",\"poco\",\"poder\",\"podio\",\"poema\",\"poesía\",\"poeta\",\"polen\",\"policía\",\"pollo\",\"polvo\",\"pomada\",\"pomelo\",\"pomo\",\"pompa\",\"poner\",\"porción\",\"portal\",\"posada\",\"poseer\",\"posible\",\"poste\",\"potencia\",\"potro\",\"pozo\",\"prado\",\"precoz\",\"pregunta\",\"premio\",\"prensa\",\"preso\",\"previo\",\"primo\",\"príncipe\",\"prisión\",\"privar\",\"proa\",\"probar\",\"proceso\",\"producto\",\"proeza\",\"profesor\",\"programa\",\"prole\",\"promesa\",\"pronto\",\"propio\",\"próximo\",\"prueba\",\"público\",\"puchero\",\"pudor\",\"pueblo\",\"puerta\",\"puesto\",\"pulga\",\"pulir\",\"pulmón\",\"pulpo\",\"pulso\",\"puma\",\"punto\",\"puñal\",\"puño\",\"pupa\",\"pupila\",\"puré\",\"quedar\",\"queja\",\"quemar\",\"querer\",\"queso\",\"quieto\",\"química\",\"quince\",\"quitar\",\"rábano\",\"rabia\",\"rabo\",\"ración\",\"radical\",\"raíz\",\"rama\",\"rampa\",\"rancho\",\"rango\",\"rapaz\",\"rápido\",\"rapto\",\"rasgo\",\"raspa\",\"rato\",\"rayo\",\"raza\",\"razón\",\"reacción\",\"realidad\",\"rebaño\",\"rebote\",\"recaer\",\"receta\",\"rechazo\",\"recoger\",\"recreo\",\"recto\",\"recurso\",\"red\",\"redondo\",\"reducir\",\"reflejo\",\"reforma\",\"refrán\",\"refugio\",\"regalo\",\"regir\",\"regla\",\"regreso\",\"rehén\",\"reino\",\"reír\",\"reja\",\"relato\",\"relevo\",\"relieve\",\"relleno\",\"reloj\",\"remar\",\"remedio\",\"remo\",\"rencor\",\"rendir\",\"renta\",\"reparto\",\"repetir\",\"reposo\",\"reptil\",\"res\",\"rescate\",\"resina\",\"respeto\",\"resto\",\"resumen\",\"retiro\",\"retorno\",\"retrato\",\"reunir\",\"revés\",\"revista\",\"rey\",\"rezar\",\"rico\",\"riego\",\"rienda\",\"riesgo\",\"rifa\",\"rígido\",\"rigor\",\"rincón\",\"riñón\",\"río\",\"riqueza\",\"risa\",\"ritmo\",\"rito\",\"rizo\",\"roble\",\"roce\",\"rociar\",\"rodar\",\"rodeo\",\"rodilla\",\"roer\",\"rojizo\",\"rojo\",\"romero\",\"romper\",\"ron\",\"ronco\",\"ronda\",\"ropa\",\"ropero\",\"rosa\",\"rosca\",\"rostro\",\"rotar\",\"rubí\",\"rubor\",\"rudo\",\"rueda\",\"rugir\",\"ruido\",\"ruina\",\"ruleta\",\"rulo\",\"rumbo\",\"rumor\",\"ruptura\",\"ruta\",\"rutina\",\"sábado\",\"saber\",\"sabio\",\"sable\",\"sacar\",\"sagaz\",\"sagrado\",\"sala\",\"saldo\",\"salero\",\"salir\",\"salmón\",\"salón\",\"salsa\",\"salto\",\"salud\",\"salvar\",\"samba\",\"sanción\",\"sandía\",\"sanear\",\"sangre\",\"sanidad\",\"sano\",\"santo\",\"sapo\",\"saque\",\"sardina\",\"sartén\",\"sastre\",\"satán\",\"sauna\",\"saxofón\",\"sección\",\"seco\",\"secreto\",\"secta\",\"sed\",\"seguir\",\"seis\",\"sello\",\"selva\",\"semana\",\"semilla\",\"senda\",\"sensor\",\"señal\",\"señor\",\"separar\",\"sepia\",\"sequía\",\"ser\",\"serie\",\"sermón\",\"servir\",\"sesenta\",\"sesión\",\"seta\",\"setenta\",\"severo\",\"sexo\",\"sexto\",\"sidra\",\"siesta\",\"siete\",\"siglo\",\"signo\",\"sílaba\",\"silbar\",\"silencio\",\"silla\",\"símbolo\",\"simio\",\"sirena\",\"sistema\",\"sitio\",\"situar\",\"sobre\",\"socio\",\"sodio\",\"sol\",\"solapa\",\"soldado\",\"soledad\",\"sólido\",\"soltar\",\"solución\",\"sombra\",\"sondeo\",\"sonido\",\"sonoro\",\"sonrisa\",\"sopa\",\"soplar\",\"soporte\",\"sordo\",\"sorpresa\",\"sorteo\",\"sostén\",\"sótano\",\"suave\",\"subir\",\"suceso\",\"sudor\",\"suegra\",\"suelo\",\"sueño\",\"suerte\",\"sufrir\",\"sujeto\",\"sultán\",\"sumar\",\"superar\",\"suplir\",\"suponer\",\"supremo\",\"sur\",\"surco\",\"sureño\",\"surgir\",\"susto\",\"sutil\",\"tabaco\",\"tabique\",\"tabla\",\"tabú\",\"taco\",\"tacto\",\"tajo\",\"talar\",\"talco\",\"talento\",\"talla\",\"talón\",\"tamaño\",\"tambor\",\"tango\",\"tanque\",\"tapa\",\"tapete\",\"tapia\",\"tapón\",\"taquilla\",\"tarde\",\"tarea\",\"tarifa\",\"tarjeta\",\"tarot\",\"tarro\",\"tarta\",\"tatuaje\",\"tauro\",\"taza\",\"tazón\",\"teatro\",\"techo\",\"tecla\",\"técnica\",\"tejado\",\"tejer\",\"tejido\",\"tela\",\"teléfono\",\"tema\",\"temor\",\"templo\",\"tenaz\",\"tender\",\"tener\",\"tenis\",\"tenso\",\"teoría\",\"terapia\",\"terco\",\"término\",\"ternura\",\"terror\",\"tesis\",\"tesoro\",\"testigo\",\"tetera\",\"texto\",\"tez\",\"tibio\",\"tiburón\",\"tiempo\",\"tienda\",\"tierra\",\"tieso\",\"tigre\",\"tijera\",\"tilde\",\"timbre\",\"tímido\",\"timo\",\"tinta\",\"tío\",\"típico\",\"tipo\",\"tira\",\"tirón\",\"titán\",\"títere\",\"título\",\"tiza\",\"toalla\",\"tobillo\",\"tocar\",\"tocino\",\"todo\",\"toga\",\"toldo\",\"tomar\",\"tono\",\"tonto\",\"topar\",\"tope\",\"toque\",\"tórax\",\"torero\",\"tormenta\",\"torneo\",\"toro\",\"torpedo\",\"torre\",\"torso\",\"tortuga\",\"tos\",\"tosco\",\"toser\",\"tóxico\",\"trabajo\",\"tractor\",\"traer\",\"tráfico\",\"trago\",\"traje\",\"tramo\",\"trance\",\"trato\",\"trauma\",\"trazar\",\"trébol\",\"tregua\",\"treinta\",\"tren\",\"trepar\",\"tres\",\"tribu\",\"trigo\",\"tripa\",\"triste\",\"triunfo\",\"trofeo\",\"trompa\",\"tronco\",\"tropa\",\"trote\",\"trozo\",\"truco\",\"trueno\",\"trufa\",\"tubería\",\"tubo\",\"tuerto\",\"tumba\",\"tumor\",\"túnel\",\"túnica\",\"turbina\",\"turismo\",\"turno\",\"tutor\",\"ubicar\",\"úlcera\",\"umbral\",\"unidad\",\"unir\",\"universo\",\"uno\",\"untar\",\"uña\",\"urbano\",\"urbe\",\"urgente\",\"urna\",\"usar\",\"usuario\",\"útil\",\"utopía\",\"uva\",\"vaca\",\"vacío\",\"vacuna\",\"vagar\",\"vago\",\"vaina\",\"vajilla\",\"vale\",\"válido\",\"valle\",\"valor\",\"válvula\",\"vampiro\",\"vara\",\"variar\",\"varón\",\"vaso\",\"vecino\",\"vector\",\"vehículo\",\"veinte\",\"vejez\",\"vela\",\"velero\",\"veloz\",\"vena\",\"vencer\",\"venda\",\"veneno\",\"vengar\",\"venir\",\"venta\",\"venus\",\"ver\",\"verano\",\"verbo\",\"verde\",\"vereda\",\"verja\",\"verso\",\"verter\",\"vía\",\"viaje\",\"vibrar\",\"vicio\",\"víctima\",\"vida\",\"vídeo\",\"vidrio\",\"viejo\",\"viernes\",\"vigor\",\"vil\",\"villa\",\"vinagre\",\"vino\",\"viñedo\",\"violín\",\"viral\",\"virgo\",\"virtud\",\"visor\",\"víspera\",\"vista\",\"vitamina\",\"viudo\",\"vivaz\",\"vivero\",\"vivir\",\"vivo\",\"volcán\",\"volumen\",\"volver\",\"voraz\",\"votar\",\"voto\",\"voz\",\"vuelo\",\"vulgar\",\"yacer\",\"yate\",\"yegua\",\"yema\",\"yerno\",\"yeso\",\"yodo\",\"yoga\",\"yogur\",\"zafiro\",\"zanja\",\"zapato\",\"zarza\",\"zona\",\"zorro\",\"zumo\",\"zurdo\"]");

/***/ }),

/***/ 734:
/***/ (function(module) {

module.exports = JSON.parse("[\"あいこくしん\",\"あいさつ\",\"あいだ\",\"あおぞら\",\"あかちゃん\",\"あきる\",\"あけがた\",\"あける\",\"あこがれる\",\"あさい\",\"あさひ\",\"あしあと\",\"あじわう\",\"あずかる\",\"あずき\",\"あそぶ\",\"あたえる\",\"あたためる\",\"あたりまえ\",\"あたる\",\"あつい\",\"あつかう\",\"あっしゅく\",\"あつまり\",\"あつめる\",\"あてな\",\"あてはまる\",\"あひる\",\"あぶら\",\"あぶる\",\"あふれる\",\"あまい\",\"あまど\",\"あまやかす\",\"あまり\",\"あみもの\",\"あめりか\",\"あやまる\",\"あゆむ\",\"あらいぐま\",\"あらし\",\"あらすじ\",\"あらためる\",\"あらゆる\",\"あらわす\",\"ありがとう\",\"あわせる\",\"あわてる\",\"あんい\",\"あんがい\",\"あんこ\",\"あんぜん\",\"あんてい\",\"あんない\",\"あんまり\",\"いいだす\",\"いおん\",\"いがい\",\"いがく\",\"いきおい\",\"いきなり\",\"いきもの\",\"いきる\",\"いくじ\",\"いくぶん\",\"いけばな\",\"いけん\",\"いこう\",\"いこく\",\"いこつ\",\"いさましい\",\"いさん\",\"いしき\",\"いじゅう\",\"いじょう\",\"いじわる\",\"いずみ\",\"いずれ\",\"いせい\",\"いせえび\",\"いせかい\",\"いせき\",\"いぜん\",\"いそうろう\",\"いそがしい\",\"いだい\",\"いだく\",\"いたずら\",\"いたみ\",\"いたりあ\",\"いちおう\",\"いちじ\",\"いちど\",\"いちば\",\"いちぶ\",\"いちりゅう\",\"いつか\",\"いっしゅん\",\"いっせい\",\"いっそう\",\"いったん\",\"いっち\",\"いってい\",\"いっぽう\",\"いてざ\",\"いてん\",\"いどう\",\"いとこ\",\"いない\",\"いなか\",\"いねむり\",\"いのち\",\"いのる\",\"いはつ\",\"いばる\",\"いはん\",\"いびき\",\"いひん\",\"いふく\",\"いへん\",\"いほう\",\"いみん\",\"いもうと\",\"いもたれ\",\"いもり\",\"いやがる\",\"いやす\",\"いよかん\",\"いよく\",\"いらい\",\"いらすと\",\"いりぐち\",\"いりょう\",\"いれい\",\"いれもの\",\"いれる\",\"いろえんぴつ\",\"いわい\",\"いわう\",\"いわかん\",\"いわば\",\"いわゆる\",\"いんげんまめ\",\"いんさつ\",\"いんしょう\",\"いんよう\",\"うえき\",\"うえる\",\"うおざ\",\"うがい\",\"うかぶ\",\"うかべる\",\"うきわ\",\"うくらいな\",\"うくれれ\",\"うけたまわる\",\"うけつけ\",\"うけとる\",\"うけもつ\",\"うける\",\"うごかす\",\"うごく\",\"うこん\",\"うさぎ\",\"うしなう\",\"うしろがみ\",\"うすい\",\"うすぎ\",\"うすぐらい\",\"うすめる\",\"うせつ\",\"うちあわせ\",\"うちがわ\",\"うちき\",\"うちゅう\",\"うっかり\",\"うつくしい\",\"うったえる\",\"うつる\",\"うどん\",\"うなぎ\",\"うなじ\",\"うなずく\",\"うなる\",\"うねる\",\"うのう\",\"うぶげ\",\"うぶごえ\",\"うまれる\",\"うめる\",\"うもう\",\"うやまう\",\"うよく\",\"うらがえす\",\"うらぐち\",\"うらない\",\"うりあげ\",\"うりきれ\",\"うるさい\",\"うれしい\",\"うれゆき\",\"うれる\",\"うろこ\",\"うわき\",\"うわさ\",\"うんこう\",\"うんちん\",\"うんてん\",\"うんどう\",\"えいえん\",\"えいが\",\"えいきょう\",\"えいご\",\"えいせい\",\"えいぶん\",\"えいよう\",\"えいわ\",\"えおり\",\"えがお\",\"えがく\",\"えきたい\",\"えくせる\",\"えしゃく\",\"えすて\",\"えつらん\",\"えのぐ\",\"えほうまき\",\"えほん\",\"えまき\",\"えもじ\",\"えもの\",\"えらい\",\"えらぶ\",\"えりあ\",\"えんえん\",\"えんかい\",\"えんぎ\",\"えんげき\",\"えんしゅう\",\"えんぜつ\",\"えんそく\",\"えんちょう\",\"えんとつ\",\"おいかける\",\"おいこす\",\"おいしい\",\"おいつく\",\"おうえん\",\"おうさま\",\"おうじ\",\"おうせつ\",\"おうたい\",\"おうふく\",\"おうべい\",\"おうよう\",\"おえる\",\"おおい\",\"おおう\",\"おおどおり\",\"おおや\",\"おおよそ\",\"おかえり\",\"おかず\",\"おがむ\",\"おかわり\",\"おぎなう\",\"おきる\",\"おくさま\",\"おくじょう\",\"おくりがな\",\"おくる\",\"おくれる\",\"おこす\",\"おこなう\",\"おこる\",\"おさえる\",\"おさない\",\"おさめる\",\"おしいれ\",\"おしえる\",\"おじぎ\",\"おじさん\",\"おしゃれ\",\"おそらく\",\"おそわる\",\"おたがい\",\"おたく\",\"おだやか\",\"おちつく\",\"おっと\",\"おつり\",\"おでかけ\",\"おとしもの\",\"おとなしい\",\"おどり\",\"おどろかす\",\"おばさん\",\"おまいり\",\"おめでとう\",\"おもいで\",\"おもう\",\"おもたい\",\"おもちゃ\",\"おやつ\",\"おやゆび\",\"およぼす\",\"おらんだ\",\"おろす\",\"おんがく\",\"おんけい\",\"おんしゃ\",\"おんせん\",\"おんだん\",\"おんちゅう\",\"おんどけい\",\"かあつ\",\"かいが\",\"がいき\",\"がいけん\",\"がいこう\",\"かいさつ\",\"かいしゃ\",\"かいすいよく\",\"かいぜん\",\"かいぞうど\",\"かいつう\",\"かいてん\",\"かいとう\",\"かいふく\",\"がいへき\",\"かいほう\",\"かいよう\",\"がいらい\",\"かいわ\",\"かえる\",\"かおり\",\"かかえる\",\"かがく\",\"かがし\",\"かがみ\",\"かくご\",\"かくとく\",\"かざる\",\"がぞう\",\"かたい\",\"かたち\",\"がちょう\",\"がっきゅう\",\"がっこう\",\"がっさん\",\"がっしょう\",\"かなざわし\",\"かのう\",\"がはく\",\"かぶか\",\"かほう\",\"かほご\",\"かまう\",\"かまぼこ\",\"かめれおん\",\"かゆい\",\"かようび\",\"からい\",\"かるい\",\"かろう\",\"かわく\",\"かわら\",\"がんか\",\"かんけい\",\"かんこう\",\"かんしゃ\",\"かんそう\",\"かんたん\",\"かんち\",\"がんばる\",\"きあい\",\"きあつ\",\"きいろ\",\"ぎいん\",\"きうい\",\"きうん\",\"きえる\",\"きおう\",\"きおく\",\"きおち\",\"きおん\",\"きかい\",\"きかく\",\"きかんしゃ\",\"ききて\",\"きくばり\",\"きくらげ\",\"きけんせい\",\"きこう\",\"きこえる\",\"きこく\",\"きさい\",\"きさく\",\"きさま\",\"きさらぎ\",\"ぎじかがく\",\"ぎしき\",\"ぎじたいけん\",\"ぎじにってい\",\"ぎじゅつしゃ\",\"きすう\",\"きせい\",\"きせき\",\"きせつ\",\"きそう\",\"きぞく\",\"きぞん\",\"きたえる\",\"きちょう\",\"きつえん\",\"ぎっちり\",\"きつつき\",\"きつね\",\"きてい\",\"きどう\",\"きどく\",\"きない\",\"きなが\",\"きなこ\",\"きぬごし\",\"きねん\",\"きのう\",\"きのした\",\"きはく\",\"きびしい\",\"きひん\",\"きふく\",\"きぶん\",\"きぼう\",\"きほん\",\"きまる\",\"きみつ\",\"きむずかしい\",\"きめる\",\"きもだめし\",\"きもち\",\"きもの\",\"きゃく\",\"きやく\",\"ぎゅうにく\",\"きよう\",\"きょうりゅう\",\"きらい\",\"きらく\",\"きりん\",\"きれい\",\"きれつ\",\"きろく\",\"ぎろん\",\"きわめる\",\"ぎんいろ\",\"きんかくじ\",\"きんじょ\",\"きんようび\",\"ぐあい\",\"くいず\",\"くうかん\",\"くうき\",\"くうぐん\",\"くうこう\",\"ぐうせい\",\"くうそう\",\"ぐうたら\",\"くうふく\",\"くうぼ\",\"くかん\",\"くきょう\",\"くげん\",\"ぐこう\",\"くさい\",\"くさき\",\"くさばな\",\"くさる\",\"くしゃみ\",\"くしょう\",\"くすのき\",\"くすりゆび\",\"くせげ\",\"くせん\",\"ぐたいてき\",\"くださる\",\"くたびれる\",\"くちこみ\",\"くちさき\",\"くつした\",\"ぐっすり\",\"くつろぐ\",\"くとうてん\",\"くどく\",\"くなん\",\"くねくね\",\"くのう\",\"くふう\",\"くみあわせ\",\"くみたてる\",\"くめる\",\"くやくしょ\",\"くらす\",\"くらべる\",\"くるま\",\"くれる\",\"くろう\",\"くわしい\",\"ぐんかん\",\"ぐんしょく\",\"ぐんたい\",\"ぐんて\",\"けあな\",\"けいかく\",\"けいけん\",\"けいこ\",\"けいさつ\",\"げいじゅつ\",\"けいたい\",\"げいのうじん\",\"けいれき\",\"けいろ\",\"けおとす\",\"けおりもの\",\"げきか\",\"げきげん\",\"げきだん\",\"げきちん\",\"げきとつ\",\"げきは\",\"げきやく\",\"げこう\",\"げこくじょう\",\"げざい\",\"けさき\",\"げざん\",\"けしき\",\"けしごむ\",\"けしょう\",\"げすと\",\"けたば\",\"けちゃっぷ\",\"けちらす\",\"けつあつ\",\"けつい\",\"けつえき\",\"けっこん\",\"けつじょ\",\"けっせき\",\"けってい\",\"けつまつ\",\"げつようび\",\"げつれい\",\"けつろん\",\"げどく\",\"けとばす\",\"けとる\",\"けなげ\",\"けなす\",\"けなみ\",\"けぬき\",\"げねつ\",\"けねん\",\"けはい\",\"げひん\",\"けぶかい\",\"げぼく\",\"けまり\",\"けみかる\",\"けむし\",\"けむり\",\"けもの\",\"けらい\",\"けろけろ\",\"けわしい\",\"けんい\",\"けんえつ\",\"けんお\",\"けんか\",\"げんき\",\"けんげん\",\"けんこう\",\"けんさく\",\"けんしゅう\",\"けんすう\",\"げんそう\",\"けんちく\",\"けんてい\",\"けんとう\",\"けんない\",\"けんにん\",\"げんぶつ\",\"けんま\",\"けんみん\",\"けんめい\",\"けんらん\",\"けんり\",\"こあくま\",\"こいぬ\",\"こいびと\",\"ごうい\",\"こうえん\",\"こうおん\",\"こうかん\",\"ごうきゅう\",\"ごうけい\",\"こうこう\",\"こうさい\",\"こうじ\",\"こうすい\",\"ごうせい\",\"こうそく\",\"こうたい\",\"こうちゃ\",\"こうつう\",\"こうてい\",\"こうどう\",\"こうない\",\"こうはい\",\"ごうほう\",\"ごうまん\",\"こうもく\",\"こうりつ\",\"こえる\",\"こおり\",\"ごかい\",\"ごがつ\",\"ごかん\",\"こくご\",\"こくさい\",\"こくとう\",\"こくない\",\"こくはく\",\"こぐま\",\"こけい\",\"こける\",\"ここのか\",\"こころ\",\"こさめ\",\"こしつ\",\"こすう\",\"こせい\",\"こせき\",\"こぜん\",\"こそだて\",\"こたい\",\"こたえる\",\"こたつ\",\"こちょう\",\"こっか\",\"こつこつ\",\"こつばん\",\"こつぶ\",\"こてい\",\"こてん\",\"ことがら\",\"ことし\",\"ことば\",\"ことり\",\"こなごな\",\"こねこね\",\"このまま\",\"このみ\",\"このよ\",\"ごはん\",\"こひつじ\",\"こふう\",\"こふん\",\"こぼれる\",\"ごまあぶら\",\"こまかい\",\"ごますり\",\"こまつな\",\"こまる\",\"こむぎこ\",\"こもじ\",\"こもち\",\"こもの\",\"こもん\",\"こやく\",\"こやま\",\"こゆう\",\"こゆび\",\"こよい\",\"こよう\",\"こりる\",\"これくしょん\",\"ころっけ\",\"こわもて\",\"こわれる\",\"こんいん\",\"こんかい\",\"こんき\",\"こんしゅう\",\"こんすい\",\"こんだて\",\"こんとん\",\"こんなん\",\"こんびに\",\"こんぽん\",\"こんまけ\",\"こんや\",\"こんれい\",\"こんわく\",\"ざいえき\",\"さいかい\",\"さいきん\",\"ざいげん\",\"ざいこ\",\"さいしょ\",\"さいせい\",\"ざいたく\",\"ざいちゅう\",\"さいてき\",\"ざいりょう\",\"さうな\",\"さかいし\",\"さがす\",\"さかな\",\"さかみち\",\"さがる\",\"さぎょう\",\"さくし\",\"さくひん\",\"さくら\",\"さこく\",\"さこつ\",\"さずかる\",\"ざせき\",\"さたん\",\"さつえい\",\"ざつおん\",\"ざっか\",\"ざつがく\",\"さっきょく\",\"ざっし\",\"さつじん\",\"ざっそう\",\"さつたば\",\"さつまいも\",\"さてい\",\"さといも\",\"さとう\",\"さとおや\",\"さとし\",\"さとる\",\"さのう\",\"さばく\",\"さびしい\",\"さべつ\",\"さほう\",\"さほど\",\"さます\",\"さみしい\",\"さみだれ\",\"さむけ\",\"さめる\",\"さやえんどう\",\"さゆう\",\"さよう\",\"さよく\",\"さらだ\",\"ざるそば\",\"さわやか\",\"さわる\",\"さんいん\",\"さんか\",\"さんきゃく\",\"さんこう\",\"さんさい\",\"ざんしょ\",\"さんすう\",\"さんせい\",\"さんそ\",\"さんち\",\"さんま\",\"さんみ\",\"さんらん\",\"しあい\",\"しあげ\",\"しあさって\",\"しあわせ\",\"しいく\",\"しいん\",\"しうち\",\"しえい\",\"しおけ\",\"しかい\",\"しかく\",\"じかん\",\"しごと\",\"しすう\",\"じだい\",\"したうけ\",\"したぎ\",\"したて\",\"したみ\",\"しちょう\",\"しちりん\",\"しっかり\",\"しつじ\",\"しつもん\",\"してい\",\"してき\",\"してつ\",\"じてん\",\"じどう\",\"しなぎれ\",\"しなもの\",\"しなん\",\"しねま\",\"しねん\",\"しのぐ\",\"しのぶ\",\"しはい\",\"しばかり\",\"しはつ\",\"しはらい\",\"しはん\",\"しひょう\",\"しふく\",\"じぶん\",\"しへい\",\"しほう\",\"しほん\",\"しまう\",\"しまる\",\"しみん\",\"しむける\",\"じむしょ\",\"しめい\",\"しめる\",\"しもん\",\"しゃいん\",\"しゃうん\",\"しゃおん\",\"じゃがいも\",\"しやくしょ\",\"しゃくほう\",\"しゃけん\",\"しゃこ\",\"しゃざい\",\"しゃしん\",\"しゃせん\",\"しゃそう\",\"しゃたい\",\"しゃちょう\",\"しゃっきん\",\"じゃま\",\"しゃりん\",\"しゃれい\",\"じゆう\",\"じゅうしょ\",\"しゅくはく\",\"じゅしん\",\"しゅっせき\",\"しゅみ\",\"しゅらば\",\"じゅんばん\",\"しょうかい\",\"しょくたく\",\"しょっけん\",\"しょどう\",\"しょもつ\",\"しらせる\",\"しらべる\",\"しんか\",\"しんこう\",\"じんじゃ\",\"しんせいじ\",\"しんちく\",\"しんりん\",\"すあげ\",\"すあし\",\"すあな\",\"ずあん\",\"すいえい\",\"すいか\",\"すいとう\",\"ずいぶん\",\"すいようび\",\"すうがく\",\"すうじつ\",\"すうせん\",\"すおどり\",\"すきま\",\"すくう\",\"すくない\",\"すける\",\"すごい\",\"すこし\",\"ずさん\",\"すずしい\",\"すすむ\",\"すすめる\",\"すっかり\",\"ずっしり\",\"ずっと\",\"すてき\",\"すてる\",\"すねる\",\"すのこ\",\"すはだ\",\"すばらしい\",\"ずひょう\",\"ずぶぬれ\",\"すぶり\",\"すふれ\",\"すべて\",\"すべる\",\"ずほう\",\"すぼん\",\"すまい\",\"すめし\",\"すもう\",\"すやき\",\"すらすら\",\"するめ\",\"すれちがう\",\"すろっと\",\"すわる\",\"すんぜん\",\"すんぽう\",\"せあぶら\",\"せいかつ\",\"せいげん\",\"せいじ\",\"せいよう\",\"せおう\",\"せかいかん\",\"せきにん\",\"せきむ\",\"せきゆ\",\"せきらんうん\",\"せけん\",\"せこう\",\"せすじ\",\"せたい\",\"せたけ\",\"せっかく\",\"せっきゃく\",\"ぜっく\",\"せっけん\",\"せっこつ\",\"せっさたくま\",\"せつぞく\",\"せつだん\",\"せつでん\",\"せっぱん\",\"せつび\",\"せつぶん\",\"せつめい\",\"せつりつ\",\"せなか\",\"せのび\",\"せはば\",\"せびろ\",\"せぼね\",\"せまい\",\"せまる\",\"せめる\",\"せもたれ\",\"せりふ\",\"ぜんあく\",\"せんい\",\"せんえい\",\"せんか\",\"せんきょ\",\"せんく\",\"せんげん\",\"ぜんご\",\"せんさい\",\"せんしゅ\",\"せんすい\",\"せんせい\",\"せんぞ\",\"せんたく\",\"せんちょう\",\"せんてい\",\"せんとう\",\"せんぬき\",\"せんねん\",\"せんぱい\",\"ぜんぶ\",\"ぜんぽう\",\"せんむ\",\"せんめんじょ\",\"せんもん\",\"せんやく\",\"せんゆう\",\"せんよう\",\"ぜんら\",\"ぜんりゃく\",\"せんれい\",\"せんろ\",\"そあく\",\"そいとげる\",\"そいね\",\"そうがんきょう\",\"そうき\",\"そうご\",\"そうしん\",\"そうだん\",\"そうなん\",\"そうび\",\"そうめん\",\"そうり\",\"そえもの\",\"そえん\",\"そがい\",\"そげき\",\"そこう\",\"そこそこ\",\"そざい\",\"そしな\",\"そせい\",\"そせん\",\"そそぐ\",\"そだてる\",\"そつう\",\"そつえん\",\"そっかん\",\"そつぎょう\",\"そっけつ\",\"そっこう\",\"そっせん\",\"そっと\",\"そとがわ\",\"そとづら\",\"そなえる\",\"そなた\",\"そふぼ\",\"そぼく\",\"そぼろ\",\"そまつ\",\"そまる\",\"そむく\",\"そむりえ\",\"そめる\",\"そもそも\",\"そよかぜ\",\"そらまめ\",\"そろう\",\"そんかい\",\"そんけい\",\"そんざい\",\"そんしつ\",\"そんぞく\",\"そんちょう\",\"ぞんび\",\"ぞんぶん\",\"そんみん\",\"たあい\",\"たいいん\",\"たいうん\",\"たいえき\",\"たいおう\",\"だいがく\",\"たいき\",\"たいぐう\",\"たいけん\",\"たいこ\",\"たいざい\",\"だいじょうぶ\",\"だいすき\",\"たいせつ\",\"たいそう\",\"だいたい\",\"たいちょう\",\"たいてい\",\"だいどころ\",\"たいない\",\"たいねつ\",\"たいのう\",\"たいはん\",\"だいひょう\",\"たいふう\",\"たいへん\",\"たいほ\",\"たいまつばな\",\"たいみんぐ\",\"たいむ\",\"たいめん\",\"たいやき\",\"たいよう\",\"たいら\",\"たいりょく\",\"たいる\",\"たいわん\",\"たうえ\",\"たえる\",\"たおす\",\"たおる\",\"たおれる\",\"たかい\",\"たかね\",\"たきび\",\"たくさん\",\"たこく\",\"たこやき\",\"たさい\",\"たしざん\",\"だじゃれ\",\"たすける\",\"たずさわる\",\"たそがれ\",\"たたかう\",\"たたく\",\"ただしい\",\"たたみ\",\"たちばな\",\"だっかい\",\"だっきゃく\",\"だっこ\",\"だっしゅつ\",\"だったい\",\"たてる\",\"たとえる\",\"たなばた\",\"たにん\",\"たぬき\",\"たのしみ\",\"たはつ\",\"たぶん\",\"たべる\",\"たぼう\",\"たまご\",\"たまる\",\"だむる\",\"ためいき\",\"ためす\",\"ためる\",\"たもつ\",\"たやすい\",\"たよる\",\"たらす\",\"たりきほんがん\",\"たりょう\",\"たりる\",\"たると\",\"たれる\",\"たれんと\",\"たろっと\",\"たわむれる\",\"だんあつ\",\"たんい\",\"たんおん\",\"たんか\",\"たんき\",\"たんけん\",\"たんご\",\"たんさん\",\"たんじょうび\",\"だんせい\",\"たんそく\",\"たんたい\",\"だんち\",\"たんてい\",\"たんとう\",\"だんな\",\"たんにん\",\"だんねつ\",\"たんのう\",\"たんぴん\",\"だんぼう\",\"たんまつ\",\"たんめい\",\"だんれつ\",\"だんろ\",\"だんわ\",\"ちあい\",\"ちあん\",\"ちいき\",\"ちいさい\",\"ちえん\",\"ちかい\",\"ちから\",\"ちきゅう\",\"ちきん\",\"ちけいず\",\"ちけん\",\"ちこく\",\"ちさい\",\"ちしき\",\"ちしりょう\",\"ちせい\",\"ちそう\",\"ちたい\",\"ちたん\",\"ちちおや\",\"ちつじょ\",\"ちてき\",\"ちてん\",\"ちぬき\",\"ちぬり\",\"ちのう\",\"ちひょう\",\"ちへいせん\",\"ちほう\",\"ちまた\",\"ちみつ\",\"ちみどろ\",\"ちめいど\",\"ちゃんこなべ\",\"ちゅうい\",\"ちゆりょく\",\"ちょうし\",\"ちょさくけん\",\"ちらし\",\"ちらみ\",\"ちりがみ\",\"ちりょう\",\"ちるど\",\"ちわわ\",\"ちんたい\",\"ちんもく\",\"ついか\",\"ついたち\",\"つうか\",\"つうじょう\",\"つうはん\",\"つうわ\",\"つかう\",\"つかれる\",\"つくね\",\"つくる\",\"つけね\",\"つける\",\"つごう\",\"つたえる\",\"つづく\",\"つつじ\",\"つつむ\",\"つとめる\",\"つながる\",\"つなみ\",\"つねづね\",\"つのる\",\"つぶす\",\"つまらない\",\"つまる\",\"つみき\",\"つめたい\",\"つもり\",\"つもる\",\"つよい\",\"つるぼ\",\"つるみく\",\"つわもの\",\"つわり\",\"てあし\",\"てあて\",\"てあみ\",\"ていおん\",\"ていか\",\"ていき\",\"ていけい\",\"ていこく\",\"ていさつ\",\"ていし\",\"ていせい\",\"ていたい\",\"ていど\",\"ていねい\",\"ていひょう\",\"ていへん\",\"ていぼう\",\"てうち\",\"ておくれ\",\"てきとう\",\"てくび\",\"でこぼこ\",\"てさぎょう\",\"てさげ\",\"てすり\",\"てそう\",\"てちがい\",\"てちょう\",\"てつがく\",\"てつづき\",\"でっぱ\",\"てつぼう\",\"てつや\",\"でぬかえ\",\"てぬき\",\"てぬぐい\",\"てのひら\",\"てはい\",\"てぶくろ\",\"てふだ\",\"てほどき\",\"てほん\",\"てまえ\",\"てまきずし\",\"てみじか\",\"てみやげ\",\"てらす\",\"てれび\",\"てわけ\",\"てわたし\",\"でんあつ\",\"てんいん\",\"てんかい\",\"てんき\",\"てんぐ\",\"てんけん\",\"てんごく\",\"てんさい\",\"てんし\",\"てんすう\",\"でんち\",\"てんてき\",\"てんとう\",\"てんない\",\"てんぷら\",\"てんぼうだい\",\"てんめつ\",\"てんらんかい\",\"でんりょく\",\"でんわ\",\"どあい\",\"といれ\",\"どうかん\",\"とうきゅう\",\"どうぐ\",\"とうし\",\"とうむぎ\",\"とおい\",\"とおか\",\"とおく\",\"とおす\",\"とおる\",\"とかい\",\"とかす\",\"ときおり\",\"ときどき\",\"とくい\",\"とくしゅう\",\"とくてん\",\"とくに\",\"とくべつ\",\"とけい\",\"とける\",\"とこや\",\"とさか\",\"としょかん\",\"とそう\",\"とたん\",\"とちゅう\",\"とっきゅう\",\"とっくん\",\"とつぜん\",\"とつにゅう\",\"とどける\",\"ととのえる\",\"とない\",\"となえる\",\"となり\",\"とのさま\",\"とばす\",\"どぶがわ\",\"とほう\",\"とまる\",\"とめる\",\"ともだち\",\"ともる\",\"どようび\",\"とらえる\",\"とんかつ\",\"どんぶり\",\"ないかく\",\"ないこう\",\"ないしょ\",\"ないす\",\"ないせん\",\"ないそう\",\"なおす\",\"ながい\",\"なくす\",\"なげる\",\"なこうど\",\"なさけ\",\"なたでここ\",\"なっとう\",\"なつやすみ\",\"ななおし\",\"なにごと\",\"なにもの\",\"なにわ\",\"なのか\",\"なふだ\",\"なまいき\",\"なまえ\",\"なまみ\",\"なみだ\",\"なめらか\",\"なめる\",\"なやむ\",\"ならう\",\"ならび\",\"ならぶ\",\"なれる\",\"なわとび\",\"なわばり\",\"にあう\",\"にいがた\",\"にうけ\",\"におい\",\"にかい\",\"にがて\",\"にきび\",\"にくしみ\",\"にくまん\",\"にげる\",\"にさんかたんそ\",\"にしき\",\"にせもの\",\"にちじょう\",\"にちようび\",\"にっか\",\"にっき\",\"にっけい\",\"にっこう\",\"にっさん\",\"にっしょく\",\"にっすう\",\"にっせき\",\"にってい\",\"になう\",\"にほん\",\"にまめ\",\"にもつ\",\"にやり\",\"にゅういん\",\"にりんしゃ\",\"にわとり\",\"にんい\",\"にんか\",\"にんき\",\"にんげん\",\"にんしき\",\"にんずう\",\"にんそう\",\"にんたい\",\"にんち\",\"にんてい\",\"にんにく\",\"にんぷ\",\"にんまり\",\"にんむ\",\"にんめい\",\"にんよう\",\"ぬいくぎ\",\"ぬかす\",\"ぬぐいとる\",\"ぬぐう\",\"ぬくもり\",\"ぬすむ\",\"ぬまえび\",\"ぬめり\",\"ぬらす\",\"ぬんちゃく\",\"ねあげ\",\"ねいき\",\"ねいる\",\"ねいろ\",\"ねぐせ\",\"ねくたい\",\"ねくら\",\"ねこぜ\",\"ねこむ\",\"ねさげ\",\"ねすごす\",\"ねそべる\",\"ねだん\",\"ねつい\",\"ねっしん\",\"ねつぞう\",\"ねったいぎょ\",\"ねぶそく\",\"ねふだ\",\"ねぼう\",\"ねほりはほり\",\"ねまき\",\"ねまわし\",\"ねみみ\",\"ねむい\",\"ねむたい\",\"ねもと\",\"ねらう\",\"ねわざ\",\"ねんいり\",\"ねんおし\",\"ねんかん\",\"ねんきん\",\"ねんぐ\",\"ねんざ\",\"ねんし\",\"ねんちゃく\",\"ねんど\",\"ねんぴ\",\"ねんぶつ\",\"ねんまつ\",\"ねんりょう\",\"ねんれい\",\"のいず\",\"のおづま\",\"のがす\",\"のきなみ\",\"のこぎり\",\"のこす\",\"のこる\",\"のせる\",\"のぞく\",\"のぞむ\",\"のたまう\",\"のちほど\",\"のっく\",\"のばす\",\"のはら\",\"のべる\",\"のぼる\",\"のみもの\",\"のやま\",\"のらいぬ\",\"のらねこ\",\"のりもの\",\"のりゆき\",\"のれん\",\"のんき\",\"ばあい\",\"はあく\",\"ばあさん\",\"ばいか\",\"ばいく\",\"はいけん\",\"はいご\",\"はいしん\",\"はいすい\",\"はいせん\",\"はいそう\",\"はいち\",\"ばいばい\",\"はいれつ\",\"はえる\",\"はおる\",\"はかい\",\"ばかり\",\"はかる\",\"はくしゅ\",\"はけん\",\"はこぶ\",\"はさみ\",\"はさん\",\"はしご\",\"ばしょ\",\"はしる\",\"はせる\",\"ぱそこん\",\"はそん\",\"はたん\",\"はちみつ\",\"はつおん\",\"はっかく\",\"はづき\",\"はっきり\",\"はっくつ\",\"はっけん\",\"はっこう\",\"はっさん\",\"はっしん\",\"はったつ\",\"はっちゅう\",\"はってん\",\"はっぴょう\",\"はっぽう\",\"はなす\",\"はなび\",\"はにかむ\",\"はぶらし\",\"はみがき\",\"はむかう\",\"はめつ\",\"はやい\",\"はやし\",\"はらう\",\"はろうぃん\",\"はわい\",\"はんい\",\"はんえい\",\"はんおん\",\"はんかく\",\"はんきょう\",\"ばんぐみ\",\"はんこ\",\"はんしゃ\",\"はんすう\",\"はんだん\",\"ぱんち\",\"ぱんつ\",\"はんてい\",\"はんとし\",\"はんのう\",\"はんぱ\",\"はんぶん\",\"はんぺん\",\"はんぼうき\",\"はんめい\",\"はんらん\",\"はんろん\",\"ひいき\",\"ひうん\",\"ひえる\",\"ひかく\",\"ひかり\",\"ひかる\",\"ひかん\",\"ひくい\",\"ひけつ\",\"ひこうき\",\"ひこく\",\"ひさい\",\"ひさしぶり\",\"ひさん\",\"びじゅつかん\",\"ひしょ\",\"ひそか\",\"ひそむ\",\"ひたむき\",\"ひだり\",\"ひたる\",\"ひつぎ\",\"ひっこし\",\"ひっし\",\"ひつじゅひん\",\"ひっす\",\"ひつぜん\",\"ぴったり\",\"ぴっちり\",\"ひつよう\",\"ひてい\",\"ひとごみ\",\"ひなまつり\",\"ひなん\",\"ひねる\",\"ひはん\",\"ひびく\",\"ひひょう\",\"ひほう\",\"ひまわり\",\"ひまん\",\"ひみつ\",\"ひめい\",\"ひめじし\",\"ひやけ\",\"ひやす\",\"ひよう\",\"びょうき\",\"ひらがな\",\"ひらく\",\"ひりつ\",\"ひりょう\",\"ひるま\",\"ひるやすみ\",\"ひれい\",\"ひろい\",\"ひろう\",\"ひろき\",\"ひろゆき\",\"ひんかく\",\"ひんけつ\",\"ひんこん\",\"ひんしゅ\",\"ひんそう\",\"ぴんち\",\"ひんぱん\",\"びんぼう\",\"ふあん\",\"ふいうち\",\"ふうけい\",\"ふうせん\",\"ぷうたろう\",\"ふうとう\",\"ふうふ\",\"ふえる\",\"ふおん\",\"ふかい\",\"ふきん\",\"ふくざつ\",\"ふくぶくろ\",\"ふこう\",\"ふさい\",\"ふしぎ\",\"ふじみ\",\"ふすま\",\"ふせい\",\"ふせぐ\",\"ふそく\",\"ぶたにく\",\"ふたん\",\"ふちょう\",\"ふつう\",\"ふつか\",\"ふっかつ\",\"ふっき\",\"ふっこく\",\"ぶどう\",\"ふとる\",\"ふとん\",\"ふのう\",\"ふはい\",\"ふひょう\",\"ふへん\",\"ふまん\",\"ふみん\",\"ふめつ\",\"ふめん\",\"ふよう\",\"ふりこ\",\"ふりる\",\"ふるい\",\"ふんいき\",\"ぶんがく\",\"ぶんぐ\",\"ふんしつ\",\"ぶんせき\",\"ふんそう\",\"ぶんぽう\",\"へいあん\",\"へいおん\",\"へいがい\",\"へいき\",\"へいげん\",\"へいこう\",\"へいさ\",\"へいしゃ\",\"へいせつ\",\"へいそ\",\"へいたく\",\"へいてん\",\"へいねつ\",\"へいわ\",\"へきが\",\"へこむ\",\"べにいろ\",\"べにしょうが\",\"へらす\",\"へんかん\",\"べんきょう\",\"べんごし\",\"へんさい\",\"へんたい\",\"べんり\",\"ほあん\",\"ほいく\",\"ぼうぎょ\",\"ほうこく\",\"ほうそう\",\"ほうほう\",\"ほうもん\",\"ほうりつ\",\"ほえる\",\"ほおん\",\"ほかん\",\"ほきょう\",\"ぼきん\",\"ほくろ\",\"ほけつ\",\"ほけん\",\"ほこう\",\"ほこる\",\"ほしい\",\"ほしつ\",\"ほしゅ\",\"ほしょう\",\"ほせい\",\"ほそい\",\"ほそく\",\"ほたて\",\"ほたる\",\"ぽちぶくろ\",\"ほっきょく\",\"ほっさ\",\"ほったん\",\"ほとんど\",\"ほめる\",\"ほんい\",\"ほんき\",\"ほんけ\",\"ほんしつ\",\"ほんやく\",\"まいにち\",\"まかい\",\"まかせる\",\"まがる\",\"まける\",\"まこと\",\"まさつ\",\"まじめ\",\"ますく\",\"まぜる\",\"まつり\",\"まとめ\",\"まなぶ\",\"まぬけ\",\"まねく\",\"まほう\",\"まもる\",\"まゆげ\",\"まよう\",\"まろやか\",\"まわす\",\"まわり\",\"まわる\",\"まんが\",\"まんきつ\",\"まんぞく\",\"まんなか\",\"みいら\",\"みうち\",\"みえる\",\"みがく\",\"みかた\",\"みかん\",\"みけん\",\"みこん\",\"みじかい\",\"みすい\",\"みすえる\",\"みせる\",\"みっか\",\"みつかる\",\"みつける\",\"みてい\",\"みとめる\",\"みなと\",\"みなみかさい\",\"みねらる\",\"みのう\",\"みのがす\",\"みほん\",\"みもと\",\"みやげ\",\"みらい\",\"みりょく\",\"みわく\",\"みんか\",\"みんぞく\",\"むいか\",\"むえき\",\"むえん\",\"むかい\",\"むかう\",\"むかえ\",\"むかし\",\"むぎちゃ\",\"むける\",\"むげん\",\"むさぼる\",\"むしあつい\",\"むしば\",\"むじゅん\",\"むしろ\",\"むすう\",\"むすこ\",\"むすぶ\",\"むすめ\",\"むせる\",\"むせん\",\"むちゅう\",\"むなしい\",\"むのう\",\"むやみ\",\"むよう\",\"むらさき\",\"むりょう\",\"むろん\",\"めいあん\",\"めいうん\",\"めいえん\",\"めいかく\",\"めいきょく\",\"めいさい\",\"めいし\",\"めいそう\",\"めいぶつ\",\"めいれい\",\"めいわく\",\"めぐまれる\",\"めざす\",\"めした\",\"めずらしい\",\"めだつ\",\"めまい\",\"めやす\",\"めんきょ\",\"めんせき\",\"めんどう\",\"もうしあげる\",\"もうどうけん\",\"もえる\",\"もくし\",\"もくてき\",\"もくようび\",\"もちろん\",\"もどる\",\"もらう\",\"もんく\",\"もんだい\",\"やおや\",\"やける\",\"やさい\",\"やさしい\",\"やすい\",\"やすたろう\",\"やすみ\",\"やせる\",\"やそう\",\"やたい\",\"やちん\",\"やっと\",\"やっぱり\",\"やぶる\",\"やめる\",\"ややこしい\",\"やよい\",\"やわらかい\",\"ゆうき\",\"ゆうびんきょく\",\"ゆうべ\",\"ゆうめい\",\"ゆけつ\",\"ゆしゅつ\",\"ゆせん\",\"ゆそう\",\"ゆたか\",\"ゆちゃく\",\"ゆでる\",\"ゆにゅう\",\"ゆびわ\",\"ゆらい\",\"ゆれる\",\"ようい\",\"ようか\",\"ようきゅう\",\"ようじ\",\"ようす\",\"ようちえん\",\"よかぜ\",\"よかん\",\"よきん\",\"よくせい\",\"よくぼう\",\"よけい\",\"よごれる\",\"よさん\",\"よしゅう\",\"よそう\",\"よそく\",\"よっか\",\"よてい\",\"よどがわく\",\"よねつ\",\"よやく\",\"よゆう\",\"よろこぶ\",\"よろしい\",\"らいう\",\"らくがき\",\"らくご\",\"らくさつ\",\"らくだ\",\"らしんばん\",\"らせん\",\"らぞく\",\"らたい\",\"らっか\",\"られつ\",\"りえき\",\"りかい\",\"りきさく\",\"りきせつ\",\"りくぐん\",\"りくつ\",\"りけん\",\"りこう\",\"りせい\",\"りそう\",\"りそく\",\"りてん\",\"りねん\",\"りゆう\",\"りゅうがく\",\"りよう\",\"りょうり\",\"りょかん\",\"りょくちゃ\",\"りょこう\",\"りりく\",\"りれき\",\"りろん\",\"りんご\",\"るいけい\",\"るいさい\",\"るいじ\",\"るいせき\",\"るすばん\",\"るりがわら\",\"れいかん\",\"れいぎ\",\"れいせい\",\"れいぞうこ\",\"れいとう\",\"れいぼう\",\"れきし\",\"れきだい\",\"れんあい\",\"れんけい\",\"れんこん\",\"れんさい\",\"れんしゅう\",\"れんぞく\",\"れんらく\",\"ろうか\",\"ろうご\",\"ろうじん\",\"ろうそく\",\"ろくが\",\"ろこつ\",\"ろじうら\",\"ろしゅつ\",\"ろせん\",\"ろてん\",\"ろめん\",\"ろれつ\",\"ろんぎ\",\"ろんぱ\",\"ろんぶん\",\"ろんり\",\"わかす\",\"わかめ\",\"わかやま\",\"わかれる\",\"わしつ\",\"わじまし\",\"わすれもの\",\"わらう\",\"われる\"]");

/***/ }),

/***/ 735:
/***/ (function(module) {

module.exports = JSON.parse("[\"abandon\",\"ability\",\"able\",\"about\",\"above\",\"absent\",\"absorb\",\"abstract\",\"absurd\",\"abuse\",\"access\",\"accident\",\"account\",\"accuse\",\"achieve\",\"acid\",\"acoustic\",\"acquire\",\"across\",\"act\",\"action\",\"actor\",\"actress\",\"actual\",\"adapt\",\"add\",\"addict\",\"address\",\"adjust\",\"admit\",\"adult\",\"advance\",\"advice\",\"aerobic\",\"affair\",\"afford\",\"afraid\",\"again\",\"age\",\"agent\",\"agree\",\"ahead\",\"aim\",\"air\",\"airport\",\"aisle\",\"alarm\",\"album\",\"alcohol\",\"alert\",\"alien\",\"all\",\"alley\",\"allow\",\"almost\",\"alone\",\"alpha\",\"already\",\"also\",\"alter\",\"always\",\"amateur\",\"amazing\",\"among\",\"amount\",\"amused\",\"analyst\",\"anchor\",\"ancient\",\"anger\",\"angle\",\"angry\",\"animal\",\"ankle\",\"announce\",\"annual\",\"another\",\"answer\",\"antenna\",\"antique\",\"anxiety\",\"any\",\"apart\",\"apology\",\"appear\",\"apple\",\"approve\",\"april\",\"arch\",\"arctic\",\"area\",\"arena\",\"argue\",\"arm\",\"armed\",\"armor\",\"army\",\"around\",\"arrange\",\"arrest\",\"arrive\",\"arrow\",\"art\",\"artefact\",\"artist\",\"artwork\",\"ask\",\"aspect\",\"assault\",\"asset\",\"assist\",\"assume\",\"asthma\",\"athlete\",\"atom\",\"attack\",\"attend\",\"attitude\",\"attract\",\"auction\",\"audit\",\"august\",\"aunt\",\"author\",\"auto\",\"autumn\",\"average\",\"avocado\",\"avoid\",\"awake\",\"aware\",\"away\",\"awesome\",\"awful\",\"awkward\",\"axis\",\"baby\",\"bachelor\",\"bacon\",\"badge\",\"bag\",\"balance\",\"balcony\",\"ball\",\"bamboo\",\"banana\",\"banner\",\"bar\",\"barely\",\"bargain\",\"barrel\",\"base\",\"basic\",\"basket\",\"battle\",\"beach\",\"bean\",\"beauty\",\"because\",\"become\",\"beef\",\"before\",\"begin\",\"behave\",\"behind\",\"believe\",\"below\",\"belt\",\"bench\",\"benefit\",\"best\",\"betray\",\"better\",\"between\",\"beyond\",\"bicycle\",\"bid\",\"bike\",\"bind\",\"biology\",\"bird\",\"birth\",\"bitter\",\"black\",\"blade\",\"blame\",\"blanket\",\"blast\",\"bleak\",\"bless\",\"blind\",\"blood\",\"blossom\",\"blouse\",\"blue\",\"blur\",\"blush\",\"board\",\"boat\",\"body\",\"boil\",\"bomb\",\"bone\",\"bonus\",\"book\",\"boost\",\"border\",\"boring\",\"borrow\",\"boss\",\"bottom\",\"bounce\",\"box\",\"boy\",\"bracket\",\"brain\",\"brand\",\"brass\",\"brave\",\"bread\",\"breeze\",\"brick\",\"bridge\",\"brief\",\"bright\",\"bring\",\"brisk\",\"broccoli\",\"broken\",\"bronze\",\"broom\",\"brother\",\"brown\",\"brush\",\"bubble\",\"buddy\",\"budget\",\"buffalo\",\"build\",\"bulb\",\"bulk\",\"bullet\",\"bundle\",\"bunker\",\"burden\",\"burger\",\"burst\",\"bus\",\"business\",\"busy\",\"butter\",\"buyer\",\"buzz\",\"cabbage\",\"cabin\",\"cable\",\"cactus\",\"cage\",\"cake\",\"call\",\"calm\",\"camera\",\"camp\",\"can\",\"canal\",\"cancel\",\"candy\",\"cannon\",\"canoe\",\"canvas\",\"canyon\",\"capable\",\"capital\",\"captain\",\"car\",\"carbon\",\"card\",\"cargo\",\"carpet\",\"carry\",\"cart\",\"case\",\"cash\",\"casino\",\"castle\",\"casual\",\"cat\",\"catalog\",\"catch\",\"category\",\"cattle\",\"caught\",\"cause\",\"caution\",\"cave\",\"ceiling\",\"celery\",\"cement\",\"census\",\"century\",\"cereal\",\"certain\",\"chair\",\"chalk\",\"champion\",\"change\",\"chaos\",\"chapter\",\"charge\",\"chase\",\"chat\",\"cheap\",\"check\",\"cheese\",\"chef\",\"cherry\",\"chest\",\"chicken\",\"chief\",\"child\",\"chimney\",\"choice\",\"choose\",\"chronic\",\"chuckle\",\"chunk\",\"churn\",\"cigar\",\"cinnamon\",\"circle\",\"citizen\",\"city\",\"civil\",\"claim\",\"clap\",\"clarify\",\"claw\",\"clay\",\"clean\",\"clerk\",\"clever\",\"click\",\"client\",\"cliff\",\"climb\",\"clinic\",\"clip\",\"clock\",\"clog\",\"close\",\"cloth\",\"cloud\",\"clown\",\"club\",\"clump\",\"cluster\",\"clutch\",\"coach\",\"coast\",\"coconut\",\"code\",\"coffee\",\"coil\",\"coin\",\"collect\",\"color\",\"column\",\"combine\",\"come\",\"comfort\",\"comic\",\"common\",\"company\",\"concert\",\"conduct\",\"confirm\",\"congress\",\"connect\",\"consider\",\"control\",\"convince\",\"cook\",\"cool\",\"copper\",\"copy\",\"coral\",\"core\",\"corn\",\"correct\",\"cost\",\"cotton\",\"couch\",\"country\",\"couple\",\"course\",\"cousin\",\"cover\",\"coyote\",\"crack\",\"cradle\",\"craft\",\"cram\",\"crane\",\"crash\",\"crater\",\"crawl\",\"crazy\",\"cream\",\"credit\",\"creek\",\"crew\",\"cricket\",\"crime\",\"crisp\",\"critic\",\"crop\",\"cross\",\"crouch\",\"crowd\",\"crucial\",\"cruel\",\"cruise\",\"crumble\",\"crunch\",\"crush\",\"cry\",\"crystal\",\"cube\",\"culture\",\"cup\",\"cupboard\",\"curious\",\"current\",\"curtain\",\"curve\",\"cushion\",\"custom\",\"cute\",\"cycle\",\"dad\",\"damage\",\"damp\",\"dance\",\"danger\",\"daring\",\"dash\",\"daughter\",\"dawn\",\"day\",\"deal\",\"debate\",\"debris\",\"decade\",\"december\",\"decide\",\"decline\",\"decorate\",\"decrease\",\"deer\",\"defense\",\"define\",\"defy\",\"degree\",\"delay\",\"deliver\",\"demand\",\"demise\",\"denial\",\"dentist\",\"deny\",\"depart\",\"depend\",\"deposit\",\"depth\",\"deputy\",\"derive\",\"describe\",\"desert\",\"design\",\"desk\",\"despair\",\"destroy\",\"detail\",\"detect\",\"develop\",\"device\",\"devote\",\"diagram\",\"dial\",\"diamond\",\"diary\",\"dice\",\"diesel\",\"diet\",\"differ\",\"digital\",\"dignity\",\"dilemma\",\"dinner\",\"dinosaur\",\"direct\",\"dirt\",\"disagree\",\"discover\",\"disease\",\"dish\",\"dismiss\",\"disorder\",\"display\",\"distance\",\"divert\",\"divide\",\"divorce\",\"dizzy\",\"doctor\",\"document\",\"dog\",\"doll\",\"dolphin\",\"domain\",\"donate\",\"donkey\",\"donor\",\"door\",\"dose\",\"double\",\"dove\",\"draft\",\"dragon\",\"drama\",\"drastic\",\"draw\",\"dream\",\"dress\",\"drift\",\"drill\",\"drink\",\"drip\",\"drive\",\"drop\",\"drum\",\"dry\",\"duck\",\"dumb\",\"dune\",\"during\",\"dust\",\"dutch\",\"duty\",\"dwarf\",\"dynamic\",\"eager\",\"eagle\",\"early\",\"earn\",\"earth\",\"easily\",\"east\",\"easy\",\"echo\",\"ecology\",\"economy\",\"edge\",\"edit\",\"educate\",\"effort\",\"egg\",\"eight\",\"either\",\"elbow\",\"elder\",\"electric\",\"elegant\",\"element\",\"elephant\",\"elevator\",\"elite\",\"else\",\"embark\",\"embody\",\"embrace\",\"emerge\",\"emotion\",\"employ\",\"empower\",\"empty\",\"enable\",\"enact\",\"end\",\"endless\",\"endorse\",\"enemy\",\"energy\",\"enforce\",\"engage\",\"engine\",\"enhance\",\"enjoy\",\"enlist\",\"enough\",\"enrich\",\"enroll\",\"ensure\",\"enter\",\"entire\",\"entry\",\"envelope\",\"episode\",\"equal\",\"equip\",\"era\",\"erase\",\"erode\",\"erosion\",\"error\",\"erupt\",\"escape\",\"essay\",\"essence\",\"estate\",\"eternal\",\"ethics\",\"evidence\",\"evil\",\"evoke\",\"evolve\",\"exact\",\"example\",\"excess\",\"exchange\",\"excite\",\"exclude\",\"excuse\",\"execute\",\"exercise\",\"exhaust\",\"exhibit\",\"exile\",\"exist\",\"exit\",\"exotic\",\"expand\",\"expect\",\"expire\",\"explain\",\"expose\",\"express\",\"extend\",\"extra\",\"eye\",\"eyebrow\",\"fabric\",\"face\",\"faculty\",\"fade\",\"faint\",\"faith\",\"fall\",\"false\",\"fame\",\"family\",\"famous\",\"fan\",\"fancy\",\"fantasy\",\"farm\",\"fashion\",\"fat\",\"fatal\",\"father\",\"fatigue\",\"fault\",\"favorite\",\"feature\",\"february\",\"federal\",\"fee\",\"feed\",\"feel\",\"female\",\"fence\",\"festival\",\"fetch\",\"fever\",\"few\",\"fiber\",\"fiction\",\"field\",\"figure\",\"file\",\"film\",\"filter\",\"final\",\"find\",\"fine\",\"finger\",\"finish\",\"fire\",\"firm\",\"first\",\"fiscal\",\"fish\",\"fit\",\"fitness\",\"fix\",\"flag\",\"flame\",\"flash\",\"flat\",\"flavor\",\"flee\",\"flight\",\"flip\",\"float\",\"flock\",\"floor\",\"flower\",\"fluid\",\"flush\",\"fly\",\"foam\",\"focus\",\"fog\",\"foil\",\"fold\",\"follow\",\"food\",\"foot\",\"force\",\"forest\",\"forget\",\"fork\",\"fortune\",\"forum\",\"forward\",\"fossil\",\"foster\",\"found\",\"fox\",\"fragile\",\"frame\",\"frequent\",\"fresh\",\"friend\",\"fringe\",\"frog\",\"front\",\"frost\",\"frown\",\"frozen\",\"fruit\",\"fuel\",\"fun\",\"funny\",\"furnace\",\"fury\",\"future\",\"gadget\",\"gain\",\"galaxy\",\"gallery\",\"game\",\"gap\",\"garage\",\"garbage\",\"garden\",\"garlic\",\"garment\",\"gas\",\"gasp\",\"gate\",\"gather\",\"gauge\",\"gaze\",\"general\",\"genius\",\"genre\",\"gentle\",\"genuine\",\"gesture\",\"ghost\",\"giant\",\"gift\",\"giggle\",\"ginger\",\"giraffe\",\"girl\",\"give\",\"glad\",\"glance\",\"glare\",\"glass\",\"glide\",\"glimpse\",\"globe\",\"gloom\",\"glory\",\"glove\",\"glow\",\"glue\",\"goat\",\"goddess\",\"gold\",\"good\",\"goose\",\"gorilla\",\"gospel\",\"gossip\",\"govern\",\"gown\",\"grab\",\"grace\",\"grain\",\"grant\",\"grape\",\"grass\",\"gravity\",\"great\",\"green\",\"grid\",\"grief\",\"grit\",\"grocery\",\"group\",\"grow\",\"grunt\",\"guard\",\"guess\",\"guide\",\"guilt\",\"guitar\",\"gun\",\"gym\",\"habit\",\"hair\",\"half\",\"hammer\",\"hamster\",\"hand\",\"happy\",\"harbor\",\"hard\",\"harsh\",\"harvest\",\"hat\",\"have\",\"hawk\",\"hazard\",\"head\",\"health\",\"heart\",\"heavy\",\"hedgehog\",\"height\",\"hello\",\"helmet\",\"help\",\"hen\",\"hero\",\"hidden\",\"high\",\"hill\",\"hint\",\"hip\",\"hire\",\"history\",\"hobby\",\"hockey\",\"hold\",\"hole\",\"holiday\",\"hollow\",\"home\",\"honey\",\"hood\",\"hope\",\"horn\",\"horror\",\"horse\",\"hospital\",\"host\",\"hotel\",\"hour\",\"hover\",\"hub\",\"huge\",\"human\",\"humble\",\"humor\",\"hundred\",\"hungry\",\"hunt\",\"hurdle\",\"hurry\",\"hurt\",\"husband\",\"hybrid\",\"ice\",\"icon\",\"idea\",\"identify\",\"idle\",\"ignore\",\"ill\",\"illegal\",\"illness\",\"image\",\"imitate\",\"immense\",\"immune\",\"impact\",\"impose\",\"improve\",\"impulse\",\"inch\",\"include\",\"income\",\"increase\",\"index\",\"indicate\",\"indoor\",\"industry\",\"infant\",\"inflict\",\"inform\",\"inhale\",\"inherit\",\"initial\",\"inject\",\"injury\",\"inmate\",\"inner\",\"innocent\",\"input\",\"inquiry\",\"insane\",\"insect\",\"inside\",\"inspire\",\"install\",\"intact\",\"interest\",\"into\",\"invest\",\"invite\",\"involve\",\"iron\",\"island\",\"isolate\",\"issue\",\"item\",\"ivory\",\"jacket\",\"jaguar\",\"jar\",\"jazz\",\"jealous\",\"jeans\",\"jelly\",\"jewel\",\"job\",\"join\",\"joke\",\"journey\",\"joy\",\"judge\",\"juice\",\"jump\",\"jungle\",\"junior\",\"junk\",\"just\",\"kangaroo\",\"keen\",\"keep\",\"ketchup\",\"key\",\"kick\",\"kid\",\"kidney\",\"kind\",\"kingdom\",\"kiss\",\"kit\",\"kitchen\",\"kite\",\"kitten\",\"kiwi\",\"knee\",\"knife\",\"knock\",\"know\",\"lab\",\"label\",\"labor\",\"ladder\",\"lady\",\"lake\",\"lamp\",\"language\",\"laptop\",\"large\",\"later\",\"latin\",\"laugh\",\"laundry\",\"lava\",\"law\",\"lawn\",\"lawsuit\",\"layer\",\"lazy\",\"leader\",\"leaf\",\"learn\",\"leave\",\"lecture\",\"left\",\"leg\",\"legal\",\"legend\",\"leisure\",\"lemon\",\"lend\",\"length\",\"lens\",\"leopard\",\"lesson\",\"letter\",\"level\",\"liar\",\"liberty\",\"library\",\"license\",\"life\",\"lift\",\"light\",\"like\",\"limb\",\"limit\",\"link\",\"lion\",\"liquid\",\"list\",\"little\",\"live\",\"lizard\",\"load\",\"loan\",\"lobster\",\"local\",\"lock\",\"logic\",\"lonely\",\"long\",\"loop\",\"lottery\",\"loud\",\"lounge\",\"love\",\"loyal\",\"lucky\",\"luggage\",\"lumber\",\"lunar\",\"lunch\",\"luxury\",\"lyrics\",\"machine\",\"mad\",\"magic\",\"magnet\",\"maid\",\"mail\",\"main\",\"major\",\"make\",\"mammal\",\"man\",\"manage\",\"mandate\",\"mango\",\"mansion\",\"manual\",\"maple\",\"marble\",\"march\",\"margin\",\"marine\",\"market\",\"marriage\",\"mask\",\"mass\",\"master\",\"match\",\"material\",\"math\",\"matrix\",\"matter\",\"maximum\",\"maze\",\"meadow\",\"mean\",\"measure\",\"meat\",\"mechanic\",\"medal\",\"media\",\"melody\",\"melt\",\"member\",\"memory\",\"mention\",\"menu\",\"mercy\",\"merge\",\"merit\",\"merry\",\"mesh\",\"message\",\"metal\",\"method\",\"middle\",\"midnight\",\"milk\",\"million\",\"mimic\",\"mind\",\"minimum\",\"minor\",\"minute\",\"miracle\",\"mirror\",\"misery\",\"miss\",\"mistake\",\"mix\",\"mixed\",\"mixture\",\"mobile\",\"model\",\"modify\",\"mom\",\"moment\",\"monitor\",\"monkey\",\"monster\",\"month\",\"moon\",\"moral\",\"more\",\"morning\",\"mosquito\",\"mother\",\"motion\",\"motor\",\"mountain\",\"mouse\",\"move\",\"movie\",\"much\",\"muffin\",\"mule\",\"multiply\",\"muscle\",\"museum\",\"mushroom\",\"music\",\"must\",\"mutual\",\"myself\",\"mystery\",\"myth\",\"naive\",\"name\",\"napkin\",\"narrow\",\"nasty\",\"nation\",\"nature\",\"near\",\"neck\",\"need\",\"negative\",\"neglect\",\"neither\",\"nephew\",\"nerve\",\"nest\",\"net\",\"network\",\"neutral\",\"never\",\"news\",\"next\",\"nice\",\"night\",\"noble\",\"noise\",\"nominee\",\"noodle\",\"normal\",\"north\",\"nose\",\"notable\",\"note\",\"nothing\",\"notice\",\"novel\",\"now\",\"nuclear\",\"number\",\"nurse\",\"nut\",\"oak\",\"obey\",\"object\",\"oblige\",\"obscure\",\"observe\",\"obtain\",\"obvious\",\"occur\",\"ocean\",\"october\",\"odor\",\"off\",\"offer\",\"office\",\"often\",\"oil\",\"okay\",\"old\",\"olive\",\"olympic\",\"omit\",\"once\",\"one\",\"onion\",\"online\",\"only\",\"open\",\"opera\",\"opinion\",\"oppose\",\"option\",\"orange\",\"orbit\",\"orchard\",\"order\",\"ordinary\",\"organ\",\"orient\",\"original\",\"orphan\",\"ostrich\",\"other\",\"outdoor\",\"outer\",\"output\",\"outside\",\"oval\",\"oven\",\"over\",\"own\",\"owner\",\"oxygen\",\"oyster\",\"ozone\",\"pact\",\"paddle\",\"page\",\"pair\",\"palace\",\"palm\",\"panda\",\"panel\",\"panic\",\"panther\",\"paper\",\"parade\",\"parent\",\"park\",\"parrot\",\"party\",\"pass\",\"patch\",\"path\",\"patient\",\"patrol\",\"pattern\",\"pause\",\"pave\",\"payment\",\"peace\",\"peanut\",\"pear\",\"peasant\",\"pelican\",\"pen\",\"penalty\",\"pencil\",\"people\",\"pepper\",\"perfect\",\"permit\",\"person\",\"pet\",\"phone\",\"photo\",\"phrase\",\"physical\",\"piano\",\"picnic\",\"picture\",\"piece\",\"pig\",\"pigeon\",\"pill\",\"pilot\",\"pink\",\"pioneer\",\"pipe\",\"pistol\",\"pitch\",\"pizza\",\"place\",\"planet\",\"plastic\",\"plate\",\"play\",\"please\",\"pledge\",\"pluck\",\"plug\",\"plunge\",\"poem\",\"poet\",\"point\",\"polar\",\"pole\",\"police\",\"pond\",\"pony\",\"pool\",\"popular\",\"portion\",\"position\",\"possible\",\"post\",\"potato\",\"pottery\",\"poverty\",\"powder\",\"power\",\"practice\",\"praise\",\"predict\",\"prefer\",\"prepare\",\"present\",\"pretty\",\"prevent\",\"price\",\"pride\",\"primary\",\"print\",\"priority\",\"prison\",\"private\",\"prize\",\"problem\",\"process\",\"produce\",\"profit\",\"program\",\"project\",\"promote\",\"proof\",\"property\",\"prosper\",\"protect\",\"proud\",\"provide\",\"public\",\"pudding\",\"pull\",\"pulp\",\"pulse\",\"pumpkin\",\"punch\",\"pupil\",\"puppy\",\"purchase\",\"purity\",\"purpose\",\"purse\",\"push\",\"put\",\"puzzle\",\"pyramid\",\"quality\",\"quantum\",\"quarter\",\"question\",\"quick\",\"quit\",\"quiz\",\"quote\",\"rabbit\",\"raccoon\",\"race\",\"rack\",\"radar\",\"radio\",\"rail\",\"rain\",\"raise\",\"rally\",\"ramp\",\"ranch\",\"random\",\"range\",\"rapid\",\"rare\",\"rate\",\"rather\",\"raven\",\"raw\",\"razor\",\"ready\",\"real\",\"reason\",\"rebel\",\"rebuild\",\"recall\",\"receive\",\"recipe\",\"record\",\"recycle\",\"reduce\",\"reflect\",\"reform\",\"refuse\",\"region\",\"regret\",\"regular\",\"reject\",\"relax\",\"release\",\"relief\",\"rely\",\"remain\",\"remember\",\"remind\",\"remove\",\"render\",\"renew\",\"rent\",\"reopen\",\"repair\",\"repeat\",\"replace\",\"report\",\"require\",\"rescue\",\"resemble\",\"resist\",\"resource\",\"response\",\"result\",\"retire\",\"retreat\",\"return\",\"reunion\",\"reveal\",\"review\",\"reward\",\"rhythm\",\"rib\",\"ribbon\",\"rice\",\"rich\",\"ride\",\"ridge\",\"rifle\",\"right\",\"rigid\",\"ring\",\"riot\",\"ripple\",\"risk\",\"ritual\",\"rival\",\"river\",\"road\",\"roast\",\"robot\",\"robust\",\"rocket\",\"romance\",\"roof\",\"rookie\",\"room\",\"rose\",\"rotate\",\"rough\",\"round\",\"route\",\"royal\",\"rubber\",\"rude\",\"rug\",\"rule\",\"run\",\"runway\",\"rural\",\"sad\",\"saddle\",\"sadness\",\"safe\",\"sail\",\"salad\",\"salmon\",\"salon\",\"salt\",\"salute\",\"same\",\"sample\",\"sand\",\"satisfy\",\"satoshi\",\"sauce\",\"sausage\",\"save\",\"say\",\"scale\",\"scan\",\"scare\",\"scatter\",\"scene\",\"scheme\",\"school\",\"science\",\"scissors\",\"scorpion\",\"scout\",\"scrap\",\"screen\",\"script\",\"scrub\",\"sea\",\"search\",\"season\",\"seat\",\"second\",\"secret\",\"section\",\"security\",\"seed\",\"seek\",\"segment\",\"select\",\"sell\",\"seminar\",\"senior\",\"sense\",\"sentence\",\"series\",\"service\",\"session\",\"settle\",\"setup\",\"seven\",\"shadow\",\"shaft\",\"shallow\",\"share\",\"shed\",\"shell\",\"sheriff\",\"shield\",\"shift\",\"shine\",\"ship\",\"shiver\",\"shock\",\"shoe\",\"shoot\",\"shop\",\"short\",\"shoulder\",\"shove\",\"shrimp\",\"shrug\",\"shuffle\",\"shy\",\"sibling\",\"sick\",\"side\",\"siege\",\"sight\",\"sign\",\"silent\",\"silk\",\"silly\",\"silver\",\"similar\",\"simple\",\"since\",\"sing\",\"siren\",\"sister\",\"situate\",\"six\",\"size\",\"skate\",\"sketch\",\"ski\",\"skill\",\"skin\",\"skirt\",\"skull\",\"slab\",\"slam\",\"sleep\",\"slender\",\"slice\",\"slide\",\"slight\",\"slim\",\"slogan\",\"slot\",\"slow\",\"slush\",\"small\",\"smart\",\"smile\",\"smoke\",\"smooth\",\"snack\",\"snake\",\"snap\",\"sniff\",\"snow\",\"soap\",\"soccer\",\"social\",\"sock\",\"soda\",\"soft\",\"solar\",\"soldier\",\"solid\",\"solution\",\"solve\",\"someone\",\"song\",\"soon\",\"sorry\",\"sort\",\"soul\",\"sound\",\"soup\",\"source\",\"south\",\"space\",\"spare\",\"spatial\",\"spawn\",\"speak\",\"special\",\"speed\",\"spell\",\"spend\",\"sphere\",\"spice\",\"spider\",\"spike\",\"spin\",\"spirit\",\"split\",\"spoil\",\"sponsor\",\"spoon\",\"sport\",\"spot\",\"spray\",\"spread\",\"spring\",\"spy\",\"square\",\"squeeze\",\"squirrel\",\"stable\",\"stadium\",\"staff\",\"stage\",\"stairs\",\"stamp\",\"stand\",\"start\",\"state\",\"stay\",\"steak\",\"steel\",\"stem\",\"step\",\"stereo\",\"stick\",\"still\",\"sting\",\"stock\",\"stomach\",\"stone\",\"stool\",\"story\",\"stove\",\"strategy\",\"street\",\"strike\",\"strong\",\"struggle\",\"student\",\"stuff\",\"stumble\",\"style\",\"subject\",\"submit\",\"subway\",\"success\",\"such\",\"sudden\",\"suffer\",\"sugar\",\"suggest\",\"suit\",\"summer\",\"sun\",\"sunny\",\"sunset\",\"super\",\"supply\",\"supreme\",\"sure\",\"surface\",\"surge\",\"surprise\",\"surround\",\"survey\",\"suspect\",\"sustain\",\"swallow\",\"swamp\",\"swap\",\"swarm\",\"swear\",\"sweet\",\"swift\",\"swim\",\"swing\",\"switch\",\"sword\",\"symbol\",\"symptom\",\"syrup\",\"system\",\"table\",\"tackle\",\"tag\",\"tail\",\"talent\",\"talk\",\"tank\",\"tape\",\"target\",\"task\",\"taste\",\"tattoo\",\"taxi\",\"teach\",\"team\",\"tell\",\"ten\",\"tenant\",\"tennis\",\"tent\",\"term\",\"test\",\"text\",\"thank\",\"that\",\"theme\",\"then\",\"theory\",\"there\",\"they\",\"thing\",\"this\",\"thought\",\"three\",\"thrive\",\"throw\",\"thumb\",\"thunder\",\"ticket\",\"tide\",\"tiger\",\"tilt\",\"timber\",\"time\",\"tiny\",\"tip\",\"tired\",\"tissue\",\"title\",\"toast\",\"tobacco\",\"today\",\"toddler\",\"toe\",\"together\",\"toilet\",\"token\",\"tomato\",\"tomorrow\",\"tone\",\"tongue\",\"tonight\",\"tool\",\"tooth\",\"top\",\"topic\",\"topple\",\"torch\",\"tornado\",\"tortoise\",\"toss\",\"total\",\"tourist\",\"toward\",\"tower\",\"town\",\"toy\",\"track\",\"trade\",\"traffic\",\"tragic\",\"train\",\"transfer\",\"trap\",\"trash\",\"travel\",\"tray\",\"treat\",\"tree\",\"trend\",\"trial\",\"tribe\",\"trick\",\"trigger\",\"trim\",\"trip\",\"trophy\",\"trouble\",\"truck\",\"true\",\"truly\",\"trumpet\",\"trust\",\"truth\",\"try\",\"tube\",\"tuition\",\"tumble\",\"tuna\",\"tunnel\",\"turkey\",\"turn\",\"turtle\",\"twelve\",\"twenty\",\"twice\",\"twin\",\"twist\",\"two\",\"type\",\"typical\",\"ugly\",\"umbrella\",\"unable\",\"unaware\",\"uncle\",\"uncover\",\"under\",\"undo\",\"unfair\",\"unfold\",\"unhappy\",\"uniform\",\"unique\",\"unit\",\"universe\",\"unknown\",\"unlock\",\"until\",\"unusual\",\"unveil\",\"update\",\"upgrade\",\"uphold\",\"upon\",\"upper\",\"upset\",\"urban\",\"urge\",\"usage\",\"use\",\"used\",\"useful\",\"useless\",\"usual\",\"utility\",\"vacant\",\"vacuum\",\"vague\",\"valid\",\"valley\",\"valve\",\"van\",\"vanish\",\"vapor\",\"various\",\"vast\",\"vault\",\"vehicle\",\"velvet\",\"vendor\",\"venture\",\"venue\",\"verb\",\"verify\",\"version\",\"very\",\"vessel\",\"veteran\",\"viable\",\"vibrant\",\"vicious\",\"victory\",\"video\",\"view\",\"village\",\"vintage\",\"violin\",\"virtual\",\"virus\",\"visa\",\"visit\",\"visual\",\"vital\",\"vivid\",\"vocal\",\"voice\",\"void\",\"volcano\",\"volume\",\"vote\",\"voyage\",\"wage\",\"wagon\",\"wait\",\"walk\",\"wall\",\"walnut\",\"want\",\"warfare\",\"warm\",\"warrior\",\"wash\",\"wasp\",\"waste\",\"water\",\"wave\",\"way\",\"wealth\",\"weapon\",\"wear\",\"weasel\",\"weather\",\"web\",\"wedding\",\"weekend\",\"weird\",\"welcome\",\"west\",\"wet\",\"whale\",\"what\",\"wheat\",\"wheel\",\"when\",\"where\",\"whip\",\"whisper\",\"wide\",\"width\",\"wife\",\"wild\",\"will\",\"win\",\"window\",\"wine\",\"wing\",\"wink\",\"winner\",\"winter\",\"wire\",\"wisdom\",\"wise\",\"wish\",\"witness\",\"wolf\",\"woman\",\"wonder\",\"wood\",\"wool\",\"word\",\"work\",\"world\",\"worry\",\"worth\",\"wrap\",\"wreck\",\"wrestle\",\"wrist\",\"write\",\"wrong\",\"yard\",\"year\",\"yellow\",\"you\",\"young\",\"youth\",\"zebra\",\"zero\",\"zone\",\"zoo\"]");

/***/ }),

/***/ 736:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bip32_1 = __webpack_require__(737);
exports.fromSeed = bip32_1.fromSeed;
exports.fromBase58 = bip32_1.fromBase58;
exports.fromPublicKey = bip32_1.fromPublicKey;
exports.fromPrivateKey = bip32_1.fromPrivateKey;


/***/ }),

/***/ 737:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __webpack_require__(738);
const bs58check = __webpack_require__(292);
const ecc = __webpack_require__(743);
const typeforce = __webpack_require__(764);
const wif = __webpack_require__(766);
const UINT256_TYPE = typeforce.BufferN(32);
const NETWORK_TYPE = typeforce.compile({
    wif: typeforce.UInt8,
    bip32: {
        public: typeforce.UInt32,
        private: typeforce.UInt32,
    },
});
const BITCOIN = {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
};
const HIGHEST_BIT = 0x80000000;
const UINT31_MAX = Math.pow(2, 31) - 1;
function BIP32Path(value) {
    return (typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/) !== null);
}
function UInt31(value) {
    return typeforce.UInt32(value) && value <= UINT31_MAX;
}
class BIP32 {
    constructor(__D, __Q, chainCode, network, __DEPTH = 0, __INDEX = 0, __PARENT_FINGERPRINT = 0x00000000) {
        this.__D = __D;
        this.__Q = __Q;
        this.chainCode = chainCode;
        this.network = network;
        this.__DEPTH = __DEPTH;
        this.__INDEX = __INDEX;
        this.__PARENT_FINGERPRINT = __PARENT_FINGERPRINT;
        typeforce(NETWORK_TYPE, network);
        this.lowR = false;
    }
    get depth() {
        return this.__DEPTH;
    }
    get index() {
        return this.__INDEX;
    }
    get parentFingerprint() {
        return this.__PARENT_FINGERPRINT;
    }
    get publicKey() {
        if (this.__Q === undefined)
            this.__Q = ecc.pointFromScalar(this.__D, true);
        return this.__Q;
    }
    get privateKey() {
        return this.__D;
    }
    get identifier() {
        return crypto.hash160(this.publicKey);
    }
    get fingerprint() {
        return this.identifier.slice(0, 4);
    }
    get compressed() {
        return true;
    }
    // Private === not neutered
    // Public === neutered
    isNeutered() {
        return this.__D === undefined;
    }
    neutered() {
        return fromPublicKeyLocal(this.publicKey, this.chainCode, this.network, this.depth, this.index, this.parentFingerprint);
    }
    toBase58() {
        const network = this.network;
        const version = !this.isNeutered()
            ? network.bip32.private
            : network.bip32.public;
        const buffer = Buffer.allocUnsafe(78);
        // 4 bytes: version bytes
        buffer.writeUInt32BE(version, 0);
        // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ....
        buffer.writeUInt8(this.depth, 4);
        // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
        buffer.writeUInt32BE(this.parentFingerprint, 5);
        // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
        // This is encoded in big endian. (0x00000000 if master key)
        buffer.writeUInt32BE(this.index, 9);
        // 32 bytes: the chain code
        this.chainCode.copy(buffer, 13);
        // 33 bytes: the public key or private key data
        if (!this.isNeutered()) {
            // 0x00 + k for private keys
            buffer.writeUInt8(0, 45);
            this.privateKey.copy(buffer, 46);
            // 33 bytes: the public key
        }
        else {
            // X9.62 encoding for public keys
            this.publicKey.copy(buffer, 45);
        }
        return bs58check.encode(buffer);
    }
    toWIF() {
        if (!this.privateKey)
            throw new TypeError('Missing private key');
        return wif.encode(this.network.wif, this.privateKey, true);
    }
    // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
    derive(index) {
        typeforce(typeforce.UInt32, index);
        const isHardened = index >= HIGHEST_BIT;
        const data = Buffer.allocUnsafe(37);
        // Hardened child
        if (isHardened) {
            if (this.isNeutered())
                throw new TypeError('Missing private key for hardened child key');
            // data = 0x00 || ser256(kpar) || ser32(index)
            data[0] = 0x00;
            this.privateKey.copy(data, 1);
            data.writeUInt32BE(index, 33);
            // Normal child
        }
        else {
            // data = serP(point(kpar)) || ser32(index)
            //      = serP(Kpar) || ser32(index)
            this.publicKey.copy(data, 0);
            data.writeUInt32BE(index, 33);
        }
        const I = crypto.hmacSHA512(this.chainCode, data);
        const IL = I.slice(0, 32);
        const IR = I.slice(32);
        // if parse256(IL) >= n, proceed with the next value for i
        if (!ecc.isPrivate(IL))
            return this.derive(index + 1);
        // Private parent key -> private child key
        let hd;
        if (!this.isNeutered()) {
            // ki = parse256(IL) + kpar (mod n)
            const ki = ecc.privateAdd(this.privateKey, IL);
            // In case ki == 0, proceed with the next value for i
            if (ki == null)
                return this.derive(index + 1);
            hd = fromPrivateKeyLocal(ki, IR, this.network, this.depth + 1, index, this.fingerprint.readUInt32BE(0));
            // Public parent key -> public child key
        }
        else {
            // Ki = point(parse256(IL)) + Kpar
            //    = G*IL + Kpar
            const Ki = ecc.pointAddScalar(this.publicKey, IL, true);
            // In case Ki is the point at infinity, proceed with the next value for i
            if (Ki === null)
                return this.derive(index + 1);
            hd = fromPublicKeyLocal(Ki, IR, this.network, this.depth + 1, index, this.fingerprint.readUInt32BE(0));
        }
        return hd;
    }
    deriveHardened(index) {
        typeforce(UInt31, index);
        // Only derives hardened private keys by default
        return this.derive(index + HIGHEST_BIT);
    }
    derivePath(path) {
        typeforce(BIP32Path, path);
        let splitPath = path.split('/');
        if (splitPath[0] === 'm') {
            if (this.parentFingerprint)
                throw new TypeError('Expected master, got child');
            splitPath = splitPath.slice(1);
        }
        return splitPath.reduce((prevHd, indexStr) => {
            let index;
            if (indexStr.slice(-1) === `'`) {
                index = parseInt(indexStr.slice(0, -1), 10);
                return prevHd.deriveHardened(index);
            }
            else {
                index = parseInt(indexStr, 10);
                return prevHd.derive(index);
            }
        }, this);
    }
    sign(hash, lowR) {
        if (!this.privateKey)
            throw new Error('Missing private key');
        if (lowR === undefined)
            lowR = this.lowR;
        if (lowR === false) {
            return ecc.sign(hash, this.privateKey);
        }
        else {
            let sig = ecc.sign(hash, this.privateKey);
            const extraData = Buffer.alloc(32, 0);
            let counter = 0;
            // if first try is lowR, skip the loop
            // for second try and on, add extra entropy counting up
            while (sig[0] > 0x7f) {
                counter++;
                extraData.writeUIntLE(counter, 0, 6);
                sig = ecc.signWithEntropy(hash, this.privateKey, extraData);
            }
            return sig;
        }
    }
    verify(hash, signature) {
        return ecc.verify(hash, this.publicKey, signature);
    }
}
function fromBase58(inString, network) {
    const buffer = bs58check.decode(inString);
    if (buffer.length !== 78)
        throw new TypeError('Invalid buffer length');
    network = network || BITCOIN;
    // 4 bytes: version bytes
    const version = buffer.readUInt32BE(0);
    if (version !== network.bip32.private && version !== network.bip32.public)
        throw new TypeError('Invalid network version');
    // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ...
    const depth = buffer[4];
    // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
    const parentFingerprint = buffer.readUInt32BE(5);
    if (depth === 0) {
        if (parentFingerprint !== 0x00000000)
            throw new TypeError('Invalid parent fingerprint');
    }
    // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
    // This is encoded in MSB order. (0x00000000 if master key)
    const index = buffer.readUInt32BE(9);
    if (depth === 0 && index !== 0)
        throw new TypeError('Invalid index');
    // 32 bytes: the chain code
    const chainCode = buffer.slice(13, 45);
    let hd;
    // 33 bytes: private key data (0x00 + k)
    if (version === network.bip32.private) {
        if (buffer.readUInt8(45) !== 0x00)
            throw new TypeError('Invalid private key');
        const k = buffer.slice(46, 78);
        hd = fromPrivateKeyLocal(k, chainCode, network, depth, index, parentFingerprint);
        // 33 bytes: public key data (0x02 + X or 0x03 + X)
    }
    else {
        const X = buffer.slice(45, 78);
        hd = fromPublicKeyLocal(X, chainCode, network, depth, index, parentFingerprint);
    }
    return hd;
}
exports.fromBase58 = fromBase58;
function fromPrivateKey(privateKey, chainCode, network) {
    return fromPrivateKeyLocal(privateKey, chainCode, network);
}
exports.fromPrivateKey = fromPrivateKey;
function fromPrivateKeyLocal(privateKey, chainCode, network, depth, index, parentFingerprint) {
    typeforce({
        privateKey: UINT256_TYPE,
        chainCode: UINT256_TYPE,
    }, { privateKey, chainCode });
    network = network || BITCOIN;
    if (!ecc.isPrivate(privateKey))
        throw new TypeError('Private key not in range [1, n)');
    return new BIP32(privateKey, undefined, chainCode, network, depth, index, parentFingerprint);
}
function fromPublicKey(publicKey, chainCode, network) {
    return fromPublicKeyLocal(publicKey, chainCode, network);
}
exports.fromPublicKey = fromPublicKey;
function fromPublicKeyLocal(publicKey, chainCode, network, depth, index, parentFingerprint) {
    typeforce({
        publicKey: typeforce.BufferN(33),
        chainCode: UINT256_TYPE,
    }, { publicKey, chainCode });
    network = network || BITCOIN;
    // verify the X coordinate is a point on the curve
    if (!ecc.isPoint(publicKey))
        throw new TypeError('Point is not on the curve');
    return new BIP32(undefined, publicKey, chainCode, network, depth, index, parentFingerprint);
}
function fromSeed(seed, network) {
    typeforce(typeforce.Buffer, seed);
    if (seed.length < 16)
        throw new TypeError('Seed should be at least 128 bits');
    if (seed.length > 64)
        throw new TypeError('Seed should be at most 512 bits');
    network = network || BITCOIN;
    const I = crypto.hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), seed);
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return fromPrivateKey(IL, IR, network);
}
exports.fromSeed = fromSeed;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4).Buffer))

/***/ }),

/***/ 738:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const createHash = __webpack_require__(106);
const createHmac = __webpack_require__(214);
function hash160(buffer) {
    const sha256Hash = createHash('sha256')
        .update(buffer)
        .digest();
    try {
        return createHash('rmd160')
            .update(sha256Hash)
            .digest();
    }
    catch (err) {
        return createHash('ripemd160')
            .update(sha256Hash)
            .digest();
    }
}
exports.hash160 = hash160;
function hmacSHA512(key, data) {
    return createHmac('sha512', key)
        .update(data)
        .digest();
}
exports.hmacSHA512 = hmacSHA512;


/***/ }),

/***/ 742:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// @ts-ignore
var _Buffer = __webpack_require__(22).Buffer
function base (ALPHABET) {
  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
  var BASE_MAP = new Uint8Array(256)
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i
  }
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
  function encode (source) {
    if (Array.isArray(source) || source instanceof Uint8Array) { source = _Buffer.from(source) }
    if (!_Buffer.isBuffer(source)) { throw new TypeError('Expected Buffer') }
    if (source.length === 0) { return '' }
        // Skip & count leading zeroes.
    var zeroes = 0
    var length = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }
        // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
        // Process the bytes.
    while (pbegin !== pend) {
      var carry = source[pbegin]
            // Apply "b58 = b58 * 256 + ch".
      var i = 0
      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
        carry += (256 * b58[it1]) >>> 0
        b58[it1] = (carry % BASE) >>> 0
        carry = (carry / BASE) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      pbegin++
    }
        // Skip leading zeroes in base58 result.
    var it2 = size - length
    while (it2 !== size && b58[it2] === 0) {
      it2++
    }
        // Translate the result into a string.
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]) }
    return str
  }
  function decodeUnsafe (source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return _Buffer.alloc(0) }
    var psz = 0
        // Skip leading spaces.
    if (source[psz] === ' ') { return }
        // Skip and count leading '1's.
    var zeroes = 0
    var length = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }
        // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size)
        // Process the characters.
    while (source[psz]) {
            // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)]
            // Invalid character
      if (carry === 255) { return }
      var i = 0
      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
        carry += (BASE * b256[it3]) >>> 0
        b256[it3] = (carry % 256) >>> 0
        carry = (carry / 256) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      psz++
    }
        // Skip trailing spaces.
    if (source[psz] === ' ') { return }
        // Skip leading zeroes in b256.
    var it4 = size - length
    while (it4 !== size && b256[it4] === 0) {
      it4++
    }
    var vch = _Buffer.allocUnsafe(zeroes + (size - it4))
    vch.fill(0x00, 0, zeroes)
    var j = zeroes
    while (it4 !== size) {
      vch[j++] = b256[it4++]
    }
    return vch
  }
  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
  }
  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}
module.exports = base


/***/ }),

/***/ 802:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const encoders = __webpack_require__(450);
const decoders = __webpack_require__(452);
const inherits = __webpack_require__(18);

const api = exports;

api.define = function define(name, body) {
  return new Entity(name, body);
};

function Entity(name, body) {
  this.name = name;
  this.body = body;

  this.decoders = {};
  this.encoders = {};
}

Entity.prototype._createNamed = function createNamed(Base) {
  const name = this.name;

  function Generated(entity) {
    this._initNamed(entity, name);
  }
  inherits(Generated, Base);
  Generated.prototype._initNamed = function _initNamed(entity, name) {
    Base.call(this, entity, name);
  };

  return new Generated(this);
};

Entity.prototype._getDecoder = function _getDecoder(enc) {
  enc = enc || 'der';
  // Lazily create decoder
  if (!this.decoders.hasOwnProperty(enc))
    this.decoders[enc] = this._createNamed(decoders[enc]);
  return this.decoders[enc];
};

Entity.prototype.decode = function decode(data, enc, options) {
  return this._getDecoder(enc).decode(data, options);
};

Entity.prototype._getEncoder = function _getEncoder(enc) {
  enc = enc || 'der';
  // Lazily create encoder
  if (!this.encoders.hasOwnProperty(enc))
    this.encoders[enc] = this._createNamed(encoders[enc]);
  return this.encoders[enc];
};

Entity.prototype.encode = function encode(data, enc, /* internal */ reporter) {
  return this._getEncoder(enc).encode(data, reporter);
};


/***/ }),

/***/ 803:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inherits = __webpack_require__(18);

const DEREncoder = __webpack_require__(451);

function PEMEncoder(entity) {
  DEREncoder.call(this, entity);
  this.enc = 'pem';
}
inherits(PEMEncoder, DEREncoder);
module.exports = PEMEncoder;

PEMEncoder.prototype.encode = function encode(data, options) {
  const buf = DEREncoder.prototype.encode.call(this, data);

  const p = buf.toString('base64');
  const out = [ '-----BEGIN ' + options.label + '-----' ];
  for (let i = 0; i < p.length; i += 64)
    out.push(p.slice(i, i + 64));
  out.push('-----END ' + options.label + '-----');
  return out.join('\n');
};


/***/ }),

/***/ 804:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inherits = __webpack_require__(18);
const Buffer = __webpack_require__(301).Buffer;

const DERDecoder = __webpack_require__(453);

function PEMDecoder(entity) {
  DERDecoder.call(this, entity);
  this.enc = 'pem';
}
inherits(PEMDecoder, DERDecoder);
module.exports = PEMDecoder;

PEMDecoder.prototype.decode = function decode(data, options) {
  const lines = data.toString().split(/[\r\n]+/g);

  const label = options.label.toUpperCase();

  const re = /^-----(BEGIN|END) ([^-]+)-----$/;
  let start = -1;
  let end = -1;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(re);
    if (match === null)
      continue;

    if (match[2] !== label)
      continue;

    if (start === -1) {
      if (match[1] !== 'BEGIN')
        break;
      start = i;
    } else {
      if (match[1] !== 'END')
        break;
      end = i;
      break;
    }
  }
  if (start === -1 || end === -1)
    throw new Error('PEM section not found for: ' + label);

  const base64 = lines.slice(start + 1, end).join('');
  // Remove excessive symbols
  base64.replace(/[^a-z0-9+/=]+/gi, '');

  const input = Buffer.from(base64, 'base64');
  return DERDecoder.prototype.decode.call(this, input, options);
};


/***/ }),

/***/ 805:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const base = exports;

base.Reporter = __webpack_require__(303).Reporter;
base.DecoderBuffer = __webpack_require__(180).DecoderBuffer;
base.EncoderBuffer = __webpack_require__(180).EncoderBuffer;
base.Node = __webpack_require__(302);


/***/ }),

/***/ 806:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const constants = exports;

// Helper
constants._reverse = function reverse(map) {
  const res = {};

  Object.keys(map).forEach(function(key) {
    // Convert key to integer if it is stringified
    if ((key | 0) == key)
      key = key | 0;

    const value = map[key];
    res[value] = key;
  });

  return res;
};

constants.der = __webpack_require__(304);


/***/ }),

/***/ 845:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);
var bind = __webpack_require__(461);
var Axios = __webpack_require__(846);
var mergeConfig = __webpack_require__(466);
var defaults = __webpack_require__(307);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = __webpack_require__(220);
axios.CancelToken = __webpack_require__(859);
axios.isCancel = __webpack_require__(465);
axios.VERSION = __webpack_require__(467).version;
axios.toFormData = __webpack_require__(463);

// Expose AxiosError class
axios.AxiosError = __webpack_require__(151);

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(860);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(861);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 846:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);
var buildURL = __webpack_require__(237);
var InterceptorManager = __webpack_require__(847);
var dispatchRequest = __webpack_require__(848);
var mergeConfig = __webpack_require__(466);
var buildFullPath = __webpack_require__(238);
var validator = __webpack_require__(858);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;


/***/ }),

/***/ 847:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 848:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);
var transformData = __webpack_require__(849);
var isCancel = __webpack_require__(465);
var defaults = __webpack_require__(307);
var CanceledError = __webpack_require__(220);

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 849:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);
var defaults = __webpack_require__(307);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 850:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 851:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 852:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 855:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 856:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};


/***/ }),

/***/ 857:
/***/ (function(module, exports) {

// eslint-disable-next-line strict
module.exports = null;


/***/ }),

/***/ 858:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var VERSION = __webpack_require__(467).version;
var AxiosError = __webpack_require__(151);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 859:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CanceledError = __webpack_require__(220);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 860:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 861:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(45);

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
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

}]);