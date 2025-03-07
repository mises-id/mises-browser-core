const HASH_PRIME = 16777619;
const HASH_INIT = 671226215;
const ROLLING_WINDOW = 7;
const MAX_LENGTH = 64; // Max individual hash length in characters
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function toUTF8Array(str: string): Uint8Array {
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8.push(charcode);
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 
                0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 
                0x80 | ((charcode>>6) & 0x3f), 
                0x80 | (charcode & 0x3f));
    } else {
      // surrogate pair
      i++;
      charcode = ((charcode & 0x3ff)<<10) | (str.charCodeAt(i) & 0x3ff);
      charcode += 0x10000;
      utf8.push(0xf0 | (charcode >>18), 
                0x80 | ((charcode>>12) & 0x3f), 
                0x80 | ((charcode>>6) & 0x3f), 
                0x80 | (charcode & 0x3f));
    }
  }
  return new Uint8Array(utf8);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x: any, y: any) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

/*
  1000 0000
  1000 0000
  0000 0001
*/

function safe_multiply(x: any, y: any) {
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
function fnv(h: any, c: any) {
  return (safe_multiply(h, HASH_PRIME) ^ c) >>> 0;
}
class RollHash {
  rolling_window = new Array(ROLLING_WINDOW);
  h1 = 0;
  h2 = 0;
  h3 = 0;
  n = 0;
  constructor() {
    this.rolling_window = new Array(ROLLING_WINDOW);
    this.h1 = 0;
    this.h2 = 0;
    this.h3 = 0;
    this.n = 0;
  }
  update(c: any) {
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
function piecewiseHash(bytes: any, triggerValue: number) {
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

    if (
      signatures[0].length < MAX_LENGTH - 1 &&
      rh.sum() % triggerValue === triggerValue - 1
    ) {
      signatures[0] += B64.charAt(h1 & 63);
      h1 = HASH_INIT;
    }
    if (
      signatures[1].length < MAX_LENGTH / 2 - 1 &&
      rh.sum() % (triggerValue * 2) === triggerValue * 2 - 1
    ) {
      signatures[1] += B64.charAt(h2 & 63);
      h2 = HASH_INIT;
    }
  }
  signatures[0] += B64.charAt(h1 & 63);
  signatures[1] += B64.charAt(h2 & 63);
  return signatures;
}
class HtmlSimilar {
  constructor() {}
  digest(data: string) {
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
  distance(hash1: string, hash2: string) {
    let score = 0;

    const arr1 = hash1.split(":");
    const hash1BlockSize: number = Number(arr1[0]);
    const hash1String1 = arr1[1];
    const hash1String2 = arr1[2];
    const arr2 = hash2.split(":");
    const hash2BlockSize = Number(arr2[0]);
    const hash2String1 = arr2[1];
    const hash2String2 = arr2[2];
    if (hash1BlockSize == hash2BlockSize && hash1String1 == hash2String1) {
      return 100;
    }
    if (
      hash1BlockSize != hash2BlockSize &&
      hash1BlockSize != hash2BlockSize * 2 &&
      hash2BlockSize != hash1BlockSize * 2
    ) {
      return score;
    }
    if (hash1BlockSize == hash2BlockSize) {
      const d1 = scoreDistance(hash1String1, hash2String1);
      const d2 = scoreDistance(hash1String2, hash2String2);
      score = Math.max(d1, d2);
    } else if (hash1BlockSize == hash2BlockSize * 2) {
      score = scoreDistance(hash1String1, hash2String2);
    } else {
      score = scoreDistance(hash1String2, hash2String1);
    }
    return score;
  }
}

function editDistance(str1: string, str2: string) {
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

function scoreDistance(h1: string, h2: string) {
  let d = editDistance(h1, h2);
  d = (d * MAX_LENGTH) / (h1.length + h2.length);
  d = (100 * d) / MAX_LENGTH;
  d = 100 - d;
  return d;
}

const html_similar = new HtmlSimilar();
export { html_similar };
