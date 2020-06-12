import { Cylinder, Cube } from "./jsxcad-api-v1-shapes.js";
import { foot, inch } from "./jsxcad-api-v1-units.js";
import { registerDesignator } from "./jsxcad-api-v1-item.js";

// TODO: Support designation decoding.

// 3/16 x 3 ft Round Stock, Zinc Plated
// 10-24 x 3 ft Threaded Rod, 316 Stainless Steel

const Rod = (radius = 1, height = 1) =>
  Cylinder(radius, height)
    .op((s) => s.with(s.top(), s.bottom()))
    .Item(`Rod ${radius}x${height}`);

// TODO: Support designation decoding.

// 3/16 x 3 ft Round Stock, Zinc Plated
// 10-24 x 3 ft Threaded Rod, 316 Stainless Steel

const FlatRod = (radius = 1, height = 1, flat = 0.25) =>
  Rod(radius, height)
    .cut(Cube(radius * 2, radius * 2, height).moveX(radius * 2 - flat))
    .fuse()
    .Item(`FlatRod ${flat} ${radius}x${height}`);

/*
DESIGNATION
Hex bolts are typically described as follows:

Nominal Size (a diameter from 1/4" to 4", usually specified in fractional inches)
Threads per Inch (20 to 6 for UNC and 28 to 12 for UNF)
Bolt Length (in inches, measured from the underhead bearing surface to the extreme point)
Drive Style (Hex Head)
Fastener Name (Bolt)
Grade (for steel bolts only: ASTM Grade A307, SAE Grade 2, 5, 8; or non-standard Grade 9)
Material (steel, stainless steel, brass, silicon bronze, nylon; if not specified, steel is assumed)
Finish (for steel bolts only: plain, zinc plated or hot dip galvanized)
Country of Origin (imported, North America [Canada], USA; if not specified, imported is assumed)
Examples:

5/16-18 x 7/8" Hex Bolt, ASTM Grade A307, Plain Finish
3/8-16 x 3 3/4" Hex Bolt, SAE Grade 8, Yellow Zinc Plated, USA
1/4-20 x 1 1/2" Hex Bolt, Silicon Bronze
*/

var HexBolt = {};

/*
A metric ISO screw thread is designated by the letter M followed by the value of the nominal diameter D (the maximum thread diameter for external thread and the minimum diameter for internal one) and the pitch P, both expressed in millimetres and separated by the hyphen sign, - (e.g., M8-1.25). If the pitch is the normally used "coarse" pitch listed in ISO 261 or ISO 262, it can be omitted (e.g., M8). The length of a machine screw or bolt is indicated by a following x and the length expressed in millimetres (e.g., M8-1.25x30 or M8x30). Tolerance classes defined in ISO 965-1 can be appended to these designations, if required (e.g., M500– 6g in external threads).

External threads are designated by lowercase letter, g or h. Internal threads are designated by upper case letters, G or H.
*/

var Screw = {};

var global$1 =
  typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : {};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var inited = false;
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}

function toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr((len * 3) / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xff;
    arr[L++] = (tmp >> 8) & 0xff;
    arr[L++] = tmp & 0xff;
  }

  if (placeHolders === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xff;
  } else if (placeHolders === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xff;
    arr[L++] = tmp & 0xff;
  }

  return arr;
}

function tripletToBase64(num) {
  return (
    lookup[(num >> 18) & 0x3f] +
    lookup[(num >> 12) & 0x3f] +
    lookup[(num >> 6) & 0x3f] +
    lookup[num & 0x3f]
  );
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}

function fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = "";
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(
      encodeChunk(
        uint8,
        i,
        i + maxChunkLength > len2 ? len2 : i + maxChunkLength
      )
    );
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3f];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3f];
    output += lookup[(tmp << 2) & 0x3f];
    output += "=";
  }

  parts.push(output);

  return parts.join("");
}

function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << -nBits) - 1);
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << -nBits) - 1);
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}

function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (
    ;
    mLen >= 8;
    buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8
  ) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (
    ;
    eLen > 0;
    buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8
  ) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray =
  Array.isArray ||
  function (arr) {
    return toString.call(arr) == "[object Array]";
  };

var INSPECT_MAX_BYTES = 50;

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
Buffer.TYPED_ARRAY_SUPPORT =
  global$1.TYPED_ARRAY_SUPPORT !== undefined
    ? global$1.TYPED_ARRAY_SUPPORT
    : true;

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
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

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
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
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === "string"
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (
      (typeof ArrayBuffer !== "undefined" &&
        obj.buffer instanceof ArrayBuffer) ||
      "length" in obj
    ) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === "Buffer" && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError(
    "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
  );
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError(
      "Attempt to allocate Buffer larger than maximum " +
        "size: 0x" +
        kMaxLength().toString(16) +
        " bytes"
    );
  }
  return length | 0;
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}

Buffer.compare = function compare(a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError("Arguments must be Buffers");
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (
    typeof ArrayBuffer !== "undefined" &&
    typeof ArrayBuffer.isView === "function" &&
    (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)
  ) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case undefined:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return "";
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return "";
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return "";
  }

  if (!encoding) encoding = "utf8";

  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);

      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);

      case "ascii":
        return asciiSlice(this, start, end);

      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);

      case "base64":
        return base64Slice(this, start, end);

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return "";
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!internalIsBuffer(b)) throw new TypeError("Argument must be a Buffer");
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = "";
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
    if (this.length > max) str += " ... ";
  }
  return "<Buffer " + str + ">";
};

Buffer.prototype.compare = function compare(
  target,
  start,
  end,
  thisStart,
  thisEnd
) {
  if (!internalIsBuffer(target)) {
    throw new TypeError("Argument must be a Buffer");
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (
    start < 0 ||
    end > target.length ||
    thisStart < 0 ||
    thisEnd > this.length
  ) {
    throw new RangeError("out of range index");
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1;
  }

  // Normalize val
  if (typeof val === "string") {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 0xff; // Search for a byte value [0-255]
    if (
      Buffer.TYPED_ARRAY_SUPPORT &&
      typeof Uint8Array.prototype.indexOf === "function"
    ) {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError("val must be string, number or Buffer");
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (
      encoding === "ucs2" ||
      encoding === "ucs-2" ||
      encoding === "utf16le" ||
      encoding === "utf-16le"
    ) {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(
    utf8ToBytes(string, buf.length - offset),
    buf,
    offset,
    length
  );
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(
    utf16leToBytes(string, buf.length - offset),
    buf,
    offset,
    length
  );
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = "utf8";
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === "string") {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = "utf8";
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (
    (string.length > 0 && (length < 0 || offset < 0)) ||
    offset > this.length
  ) {
    throw new RangeError("Attempt to write outside buffer bounds");
  }

  if (!encoding) encoding = "utf8";

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case "hex":
        return hexWrite(this, string, offset, length);

      case "utf8":
      case "utf-8":
        return utf8Write(this, string, offset, length);

      case "ascii":
        return asciiWrite(this, string, offset, length);

      case "latin1":
      case "binary":
        return latin1Write(this, string, offset, length);

      case "base64":
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0),
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence =
      firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xc0) === 0x80) {
            tempCodePoint = ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f);
            if (tempCodePoint > 0x7f) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
            tempCodePoint =
              ((firstByte & 0xf) << 0xc) |
              ((secondByte & 0x3f) << 0x6) |
              (thirdByte & 0x3f);
            if (
              tempCodePoint > 0x7ff &&
              (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
            ) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if (
            (secondByte & 0xc0) === 0x80 &&
            (thirdByte & 0xc0) === 0x80 &&
            (fourthByte & 0xc0) === 0x80
          ) {
            tempCodePoint =
              ((firstByte & 0xf) << 0x12) |
              ((secondByte & 0x3f) << 0xc) |
              ((thirdByte & 0x3f) << 0x6) |
              (fourthByte & 0x3f);
            if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xfffd;
      bytesPerSequence = 1;
    } else if (codePoint > 0xffff) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
      codePoint = 0xdc00 | (codePoint & 0x3ff);
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
    );
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7f);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}

Buffer.prototype.readUIntLE = function readUIntLE(
  offset,
  byteLength,
  noAssert
) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(
  offset,
  byteLength,
  noAssert
) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8);
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) +
    this[offset + 3] * 0x1000000
  );
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    this[offset] * 0x1000000 +
    ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
  );
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return val & 0x8000 ? val | 0xffff0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return val & 0x8000 ? val | 0xffff0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    this[offset] |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
  );
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3]
  );
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
}

Buffer.prototype.writeUIntLE = function writeUIntLE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xff;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xff;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] =
      (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      ((littleEndian ? i : 1 - i) * 8);
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xff;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xff;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
  if (offset < 0) throw new RangeError("Index out of range");
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(
  value,
  offset,
  noAssert
) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(
  value,
  offset,
  noAssert
) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError("targetStart out of bounds");
  }
  if (start < 0 || start >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (end < 0) throw new RangeError("sourceEnd out of bounds");

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === "string") {
    if (typeof start === "string") {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === "string") {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== "string") {
      throw new TypeError("encoding must be a string");
    }
    if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
  } else if (typeof val === "number") {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError("Out of range index");
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === "number") {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, "");
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return "";
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, "");
}

function toHex(n) {
  if (n < 16) return "0" + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xd7ff && codePoint < 0xe000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xdbff) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xdc00) {
        if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint =
        (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(
        (codePoint >> 0xc) | 0xe0,
        ((codePoint >> 0x6) & 0x3f) | 0x80,
        (codePoint & 0x3f) | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(
        (codePoint >> 0x12) | 0xf0,
        ((codePoint >> 0xc) & 0x3f) | 0x80,
        ((codePoint >> 0x6) & 0x3f) | 0x80,
        (codePoint & 0x3f) | 0x80
      );
    } else {
      throw new Error("Invalid code point");
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xff);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}

// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return (
    obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
  );
}

function isFastBuffer(obj) {
  return (
    !!obj.constructor &&
    typeof obj.constructor.isBuffer === "function" &&
    obj.constructor.isBuffer(obj)
  );
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj) {
  return (
    typeof obj.readFloatLE === "function" &&
    typeof obj.slice === "function" &&
    isFastBuffer(obj.slice(0, 0))
  );
}

function Parsimmon(action) {
  if (!(this instanceof Parsimmon)) {
    return new Parsimmon(action);
  }
  this._ = action;
}

var _ = Parsimmon.prototype;

function times(n, f) {
  var i = 0;
  for (i; i < n; i++) {
    f(i);
  }
}

function forEach(f, arr) {
  times(arr.length, function (i) {
    f(arr[i], i, arr);
  });
}

function reduce(f, seed, arr) {
  forEach(function (elem, i, arr) {
    seed = f(seed, elem, i, arr);
  }, arr);
  return seed;
}

function map(f, arr) {
  return reduce(
    function (acc, elem, i, a) {
      return acc.concat([f(elem, i, a)]);
    },
    [],
    arr
  );
}

function lshiftBuffer(input) {
  var asTwoBytes = reduce(
    function (a, v, i, b) {
      return a.concat(
        i === b.length - 1
          ? Buffer.from([v, 0]).readUInt16BE(0)
          : b.readUInt16BE(i)
      );
    },
    [],
    input
  );
  return Buffer.from(
    map(function (x) {
      return ((x << 1) & 0xffff) >> 8;
    }, asTwoBytes)
  );
}

function consumeBitsFromBuffer(n, input) {
  var state = { v: 0, buf: input };
  times(n, function () {
    state = {
      v: (state.v << 1) | bitPeekBuffer(state.buf),
      buf: lshiftBuffer(state.buf),
    };
  });
  return state;
}

function bitPeekBuffer(input) {
  return input[0] >> 7;
}

function sum(numArr) {
  return reduce(
    function (x, y) {
      return x + y;
    },
    0,
    numArr
  );
}

function find(pred, arr) {
  return reduce(
    function (found, elem) {
      return found || (pred(elem) ? elem : found);
    },
    null,
    arr
  );
}

function bufferExists() {
  return typeof Buffer !== "undefined";
}

function ensureBuffer() {
  if (!bufferExists()) {
    throw new Error(
      "Buffer global does not exist; please use webpack if you need to parse Buffers in the browser."
    );
  }
}

function bitSeq(alignments) {
  ensureBuffer();
  var totalBits = sum(alignments);
  if (totalBits % 8 !== 0) {
    throw new Error(
      "The bits [" +
        alignments.join(", ") +
        "] add up to " +
        totalBits +
        " which is not an even number of bytes; the total should be divisible by 8"
    );
  }
  var bytes = totalBits / 8;

  var tooBigRange = find(function (x) {
    return x > 48;
  }, alignments);
  if (tooBigRange) {
    throw new Error(
      tooBigRange + " bit range requested exceeds 48 bit (6 byte) Number max."
    );
  }

  return new Parsimmon(function (input, i) {
    var newPos = bytes + i;
    if (newPos > input.length) {
      return makeFailure(i, bytes.toString() + " bytes");
    }
    return makeSuccess(
      newPos,
      reduce(
        function (acc, bits) {
          var state = consumeBitsFromBuffer(bits, acc.buf);
          return {
            coll: acc.coll.concat(state.v),
            buf: state.buf,
          };
        },
        { coll: [], buf: input.slice(i, newPos) },
        alignments
      ).coll
    );
  });
}

function bitSeqObj(namedAlignments) {
  ensureBuffer();
  var seenKeys = {};
  var totalKeys = 0;
  var fullAlignments = map(function (item) {
    if (isArray$1(item)) {
      var pair = item;
      if (pair.length !== 2) {
        throw new Error(
          "[" +
            pair.join(", ") +
            "] should be length 2, got length " +
            pair.length
        );
      }
      assertString(pair[0]);
      assertNumber(pair[1]);
      if (Object.prototype.hasOwnProperty.call(seenKeys, pair[0])) {
        throw new Error("duplicate key in bitSeqObj: " + pair[0]);
      }
      seenKeys[pair[0]] = true;
      totalKeys++;
      return pair;
    } else {
      assertNumber(item);
      return [null, item];
    }
  }, namedAlignments);
  if (totalKeys < 1) {
    throw new Error(
      "bitSeqObj expects at least one named pair, got [" +
        namedAlignments.join(", ") +
        "]"
    );
  }
  var namesOnly = map(function (pair) {
    return pair[0];
  }, fullAlignments);
  var alignmentsOnly = map(function (pair) {
    return pair[1];
  }, fullAlignments);

  return bitSeq(alignmentsOnly).map(function (parsed) {
    var namedParsed = map(function (name, i) {
      return [name, parsed[i]];
    }, namesOnly);

    return reduce(
      function (obj, kv) {
        if (kv[0] !== null) {
          obj[kv[0]] = kv[1];
        }
        return obj;
      },
      {},
      namedParsed
    );
  });
}

function parseBufferFor(other, length) {
  return new Parsimmon(function (input, i) {
    ensureBuffer();
    if (i + length > input.length) {
      return makeFailure(i, length + " bytes for " + other);
    }
    return makeSuccess(i + length, input.slice(i, i + length));
  });
}

function parseBuffer(length) {
  return parseBufferFor("buffer", length).map(function (unsafe) {
    return Buffer.from(unsafe);
  });
}

function encodedString(encoding, length) {
  return parseBufferFor("string", length).map(function (buff) {
    return buff.toString(encoding);
  });
}

function isInteger(value) {
  return typeof value === "number" && Math.floor(value) === value;
}

function assertValidIntegerByteLengthFor(who, length) {
  if (!isInteger(length) || length < 0 || length > 6) {
    throw new Error(who + " requires integer length in range [0, 6].");
  }
}

function uintBE(length) {
  assertValidIntegerByteLengthFor("uintBE", length);
  return parseBufferFor("uintBE(" + length + ")", length).map(function (buff) {
    return buff.readUIntBE(0, length);
  });
}

function uintLE(length) {
  assertValidIntegerByteLengthFor("uintLE", length);
  return parseBufferFor("uintLE(" + length + ")", length).map(function (buff) {
    return buff.readUIntLE(0, length);
  });
}

function intBE(length) {
  assertValidIntegerByteLengthFor("intBE", length);
  return parseBufferFor("intBE(" + length + ")", length).map(function (buff) {
    return buff.readIntBE(0, length);
  });
}

function intLE(length) {
  assertValidIntegerByteLengthFor("intLE", length);
  return parseBufferFor("intLE(" + length + ")", length).map(function (buff) {
    return buff.readIntLE(0, length);
  });
}

function floatBE() {
  return parseBufferFor("floatBE", 4).map(function (buff) {
    return buff.readFloatBE(0);
  });
}

function floatLE() {
  return parseBufferFor("floatLE", 4).map(function (buff) {
    return buff.readFloatLE(0);
  });
}

function doubleBE() {
  return parseBufferFor("doubleBE", 8).map(function (buff) {
    return buff.readDoubleBE(0);
  });
}

function doubleLE() {
  return parseBufferFor("doubleLE", 8).map(function (buff) {
    return buff.readDoubleLE(0);
  });
}

function toArray(arrLike) {
  return Array.prototype.slice.call(arrLike);
}
// -*- Helpers -*-

function isParser(obj) {
  return obj instanceof Parsimmon;
}

function isArray$1(x) {
  return {}.toString.call(x) === "[object Array]";
}

function isBuffer$1(x) {
  /* global Buffer */
  return bufferExists() && isBuffer(x);
}

function makeSuccess(index, value) {
  return {
    status: true,
    index: index,
    value: value,
    furthest: -1,
    expected: [],
  };
}

function makeFailure(index, expected) {
  if (!isArray$1(expected)) {
    expected = [expected];
  }
  return {
    status: false,
    index: -1,
    value: null,
    furthest: index,
    expected: expected,
  };
}

function mergeReplies(result, last) {
  if (!last) {
    return result;
  }
  if (result.furthest > last.furthest) {
    return result;
  }
  var expected =
    result.furthest === last.furthest
      ? union(result.expected, last.expected)
      : last.expected;
  return {
    status: result.status,
    index: result.index,
    value: result.value,
    furthest: last.furthest,
    expected: expected,
  };
}

function makeLineColumnIndex(input, i) {
  if (isBuffer$1(input)) {
    return {
      offset: i,
      line: -1,
      column: -1,
    };
  }
  var lines = input.slice(0, i).split("\n");
  // Note that unlike the character offset, the line and column offsets are
  // 1-based.
  var lineWeAreUpTo = lines.length;
  var columnWeAreUpTo = lines[lines.length - 1].length + 1;
  return {
    offset: i,
    line: lineWeAreUpTo,
    column: columnWeAreUpTo,
  };
}

// Returns the sorted set union of two arrays of strings
function union(xs, ys) {
  var obj = {};
  for (var i = 0; i < xs.length; i++) {
    obj[xs[i]] = true;
  }
  for (var j = 0; j < ys.length; j++) {
    obj[ys[j]] = true;
  }
  var keys = [];
  for (var k in obj) {
    if ({}.hasOwnProperty.call(obj, k)) {
      keys.push(k);
    }
  }
  keys.sort();
  return keys;
}

function assertParser(p) {
  if (!isParser(p)) {
    throw new Error("not a parser: " + p);
  }
}

function get(input, i) {
  if (typeof input === "string") {
    return input.charAt(i);
  }
  return input[i];
}

// TODO[ES5]: Switch to Array.isArray eventually.
function assertArray(x) {
  if (!isArray$1(x)) {
    throw new Error("not an array: " + x);
  }
}

function assertNumber(x) {
  if (typeof x !== "number") {
    throw new Error("not a number: " + x);
  }
}

function assertRegexp(x) {
  if (!(x instanceof RegExp)) {
    throw new Error("not a regexp: " + x);
  }
  var f = flags(x);
  for (var i = 0; i < f.length; i++) {
    var c = f.charAt(i);
    // Only allow regexp flags [imu] for now, since [g] and [y] specifically
    // mess up Parsimmon. If more non-stateful regexp flags are added in the
    // future, this will need to be revisited.
    if (c !== "i" && c !== "m" && c !== "u") {
      throw new Error('unsupported regexp flag "' + c + '": ' + x);
    }
  }
}

function assertFunction(x) {
  if (typeof x !== "function") {
    throw new Error("not a function: " + x);
  }
}

function assertString(x) {
  if (typeof x !== "string") {
    throw new Error("not a string: " + x);
  }
}

// -*- Error Formatting -*-

var linesBeforeStringError = 2;
var linesAfterStringError = 3;
var bytesPerLine = 8;
var bytesBefore = bytesPerLine * 5;
var bytesAfter = bytesPerLine * 4;
var defaultLinePrefix = "  ";

function repeat(string, amount) {
  return new Array(amount + 1).join(string);
}

function formatExpected(expected) {
  if (expected.length === 1) {
    return "Expected:\n\n" + expected[0];
  }
  return "Expected one of the following: \n\n" + expected.join(", ");
}

function leftPad(str, pad, char) {
  var add = pad - str.length;
  if (add <= 0) {
    return str;
  }
  return repeat(char, add) + str;
}

function toChunks(arr, chunkSize) {
  var length = arr.length;
  var chunks = [];
  var chunkIndex = 0;

  if (length <= chunkSize) {
    return [arr.slice()];
  }

  for (var i = 0; i < length; i++) {
    if (!chunks[chunkIndex]) {
      chunks.push([]);
    }

    chunks[chunkIndex].push(arr[i]);

    if ((i + 1) % chunkSize === 0) {
      chunkIndex++;
    }
  }

  return chunks;
}

// Get a range of indexes including `i`-th element and `before` and `after` amount of elements from `arr`.
function rangeFromIndexAndOffsets(i, before, after, length) {
  return {
    // Guard against the negative upper bound for lines included in the output.
    from: i - before > 0 ? i - before : 0,
    to: i + after > length ? length : i + after,
  };
}

function byteRangeToRange(byteRange) {
  // Exception for inputs smaller than `bytesPerLine`
  if (byteRange.from === 0 && byteRange.to === 1) {
    return {
      from: byteRange.from,
      to: byteRange.to,
    };
  }

  return {
    from: byteRange.from / bytesPerLine,
    // Round `to`, so we don't get float if the amount of bytes is not divisible by `bytesPerLine`
    to: Math.floor(byteRange.to / bytesPerLine),
  };
}

function formatGot(input, error) {
  var index = error.index;
  var i = index.offset;

  var verticalMarkerLength = 1;
  var column;
  var lineWithErrorIndex;
  var lines;
  var lineRange;
  var lastLineNumberLabelLength;

  if (i === input.length) {
    return "Got the end of the input";
  }

  if (isBuffer$1(input)) {
    var byteLineWithErrorIndex = i - (i % bytesPerLine);
    var columnByteIndex = i - byteLineWithErrorIndex;
    var byteRange = rangeFromIndexAndOffsets(
      byteLineWithErrorIndex,
      bytesBefore,
      bytesAfter + bytesPerLine,
      input.length
    );
    var bytes = input.slice(byteRange.from, byteRange.to);
    var bytesInChunks = toChunks(bytes.toJSON().data, bytesPerLine);

    var byteLines = map(function (byteRow) {
      return map(function (byteValue) {
        // Prefix byte values with a `0` if they are shorter than 2 characters.
        return leftPad(byteValue.toString(16), 2, "0");
      }, byteRow);
    }, bytesInChunks);

    lineRange = byteRangeToRange(byteRange);
    lineWithErrorIndex = byteLineWithErrorIndex / bytesPerLine;
    column = columnByteIndex * 3;

    // Account for an extra space.
    if (columnByteIndex >= 4) {
      column += 1;
    }

    verticalMarkerLength = 2;
    lines = map(function (byteLine) {
      return byteLine.length <= 4
        ? byteLine.join(" ")
        : byteLine.slice(0, 4).join(" ") + "  " + byteLine.slice(4).join(" ");
    }, byteLines);
    lastLineNumberLabelLength = (
      (lineRange.to > 0 ? lineRange.to - 1 : lineRange.to) * 8
    ).toString(16).length;

    if (lastLineNumberLabelLength < 2) {
      lastLineNumberLabelLength = 2;
    }
  } else {
    var inputLines = input.split(/\r\n|[\n\r\u2028\u2029]/);
    column = index.column - 1;
    lineWithErrorIndex = index.line - 1;
    lineRange = rangeFromIndexAndOffsets(
      lineWithErrorIndex,
      linesBeforeStringError,
      linesAfterStringError,
      inputLines.length
    );

    lines = inputLines.slice(lineRange.from, lineRange.to);
    lastLineNumberLabelLength = lineRange.to.toString().length;
  }

  var lineWithErrorCurrentIndex = lineWithErrorIndex - lineRange.from;

  if (isBuffer$1(input)) {
    lastLineNumberLabelLength = (
      (lineRange.to > 0 ? lineRange.to - 1 : lineRange.to) * 8
    ).toString(16).length;

    if (lastLineNumberLabelLength < 2) {
      lastLineNumberLabelLength = 2;
    }
  }

  var linesWithLineNumbers = reduce(
    function (acc, lineSource, index) {
      var isLineWithError = index === lineWithErrorCurrentIndex;
      var prefix = isLineWithError ? "> " : defaultLinePrefix;
      var lineNumberLabel;

      if (isBuffer$1(input)) {
        lineNumberLabel = leftPad(
          ((lineRange.from + index) * 8).toString(16),
          lastLineNumberLabelLength,
          "0"
        );
      } else {
        lineNumberLabel = leftPad(
          (lineRange.from + index + 1).toString(),
          lastLineNumberLabelLength,
          " "
        );
      }

      return [].concat(
        acc,
        [prefix + lineNumberLabel + " | " + lineSource],
        isLineWithError
          ? [
              defaultLinePrefix +
                repeat(" ", lastLineNumberLabelLength) +
                " | " +
                leftPad("", column, " ") +
                repeat("^", verticalMarkerLength),
            ]
          : []
      );
    },
    [],
    lines
  );

  return linesWithLineNumbers.join("\n");
}

function formatError(input, error) {
  return [
    "\n",
    "-- PARSING FAILED " + repeat("-", 50),
    "\n\n",
    formatGot(input, error),
    "\n\n",
    formatExpected(error.expected),
    "\n",
  ].join("");
}

function flags(re) {
  var s = "" + re;
  return s.slice(s.lastIndexOf("/") + 1);
}

function anchoredRegexp(re) {
  return RegExp("^(?:" + re.source + ")", flags(re));
}

// -*- Combinators -*-

function seq() {
  var parsers = [].slice.call(arguments);
  var numParsers = parsers.length;
  for (var j = 0; j < numParsers; j += 1) {
    assertParser(parsers[j]);
  }
  return Parsimmon(function (input, i) {
    var result;
    var accum = new Array(numParsers);
    for (var j = 0; j < numParsers; j += 1) {
      result = mergeReplies(parsers[j]._(input, i), result);
      if (!result.status) {
        return result;
      }
      accum[j] = result.value;
      i = result.index;
    }
    return mergeReplies(makeSuccess(i, accum), result);
  });
}

function seqObj() {
  var seenKeys = {};
  var totalKeys = 0;
  var parsers = toArray(arguments);
  var numParsers = parsers.length;
  for (var j = 0; j < numParsers; j += 1) {
    var p = parsers[j];
    if (isParser(p)) {
      continue;
    }
    if (isArray$1(p)) {
      var isWellFormed =
        p.length === 2 && typeof p[0] === "string" && isParser(p[1]);
      if (isWellFormed) {
        var key = p[0];
        if (Object.prototype.hasOwnProperty.call(seenKeys, key)) {
          throw new Error("seqObj: duplicate key " + key);
        }
        seenKeys[key] = true;
        totalKeys++;
        continue;
      }
    }
    throw new Error(
      "seqObj arguments must be parsers or [string, parser] array pairs."
    );
  }
  if (totalKeys === 0) {
    throw new Error("seqObj expects at least one named parser, found zero");
  }
  return Parsimmon(function (input, i) {
    var result;
    var accum = {};
    for (var j = 0; j < numParsers; j += 1) {
      var name;
      var parser;
      if (isArray$1(parsers[j])) {
        name = parsers[j][0];
        parser = parsers[j][1];
      } else {
        name = null;
        parser = parsers[j];
      }
      result = mergeReplies(parser._(input, i), result);
      if (!result.status) {
        return result;
      }
      if (name) {
        accum[name] = result.value;
      }
      i = result.index;
    }
    return mergeReplies(makeSuccess(i, accum), result);
  });
}

function seqMap() {
  var args = [].slice.call(arguments);
  if (args.length === 0) {
    throw new Error("seqMap needs at least one argument");
  }
  var mapper = args.pop();
  assertFunction(mapper);
  return seq.apply(null, args).map(function (results) {
    return mapper.apply(null, results);
  });
}

// TODO[ES5]: Revisit this with Object.keys and .bind.
function createLanguage(parsers) {
  var language = {};
  for (var key in parsers) {
    if ({}.hasOwnProperty.call(parsers, key)) {
      (function (key) {
        var func = function () {
          return parsers[key](language);
        };
        language[key] = lazy(func);
      })(key);
    }
  }
  return language;
}

function alt() {
  var parsers = [].slice.call(arguments);
  var numParsers = parsers.length;
  if (numParsers === 0) {
    return fail("zero alternates");
  }
  for (var j = 0; j < numParsers; j += 1) {
    assertParser(parsers[j]);
  }
  return Parsimmon(function (input, i) {
    var result;
    for (var j = 0; j < parsers.length; j += 1) {
      result = mergeReplies(parsers[j]._(input, i), result);
      if (result.status) {
        return result;
      }
    }
    return result;
  });
}

function sepBy(parser, separator) {
  // Argument asserted by sepBy1
  return sepBy1(parser, separator).or(succeed([]));
}

function sepBy1(parser, separator) {
  assertParser(parser);
  assertParser(separator);
  var pairs = separator.then(parser).many();
  return seqMap(parser, pairs, function (r, rs) {
    return [r].concat(rs);
  });
}

// -*- Core Parsing Methods -*-

_.parse = function (input) {
  if (typeof input !== "string" && !isBuffer$1(input)) {
    throw new Error(
      ".parse must be called with a string or Buffer as its argument"
    );
  }
  var result = this.skip(eof)._(input, 0);
  if (result.status) {
    return {
      status: true,
      value: result.value,
    };
  }
  return {
    status: false,
    index: makeLineColumnIndex(input, result.furthest),
    expected: result.expected,
  };
};

// -*- Other Methods -*-

_.tryParse = function (str) {
  var result = this.parse(str);
  if (result.status) {
    return result.value;
  } else {
    var msg = formatError(str, result);
    var err = new Error(msg);
    err.type = "ParsimmonError";
    err.result = result;
    throw err;
  }
};

_.assert = function (condition, errorMessage) {
  return this.chain(function (value) {
    return condition(value) ? succeed(value) : fail(errorMessage);
  });
};

_.or = function (alternative) {
  return alt(this, alternative);
};

_.trim = function (parser) {
  return this.wrap(parser, parser);
};

_.wrap = function (leftParser, rightParser) {
  return seqMap(leftParser, this, rightParser, function (left, middle) {
    return middle;
  });
};

_.thru = function (wrapper) {
  return wrapper(this);
};

_.then = function (next) {
  assertParser(next);
  return seq(this, next).map(function (results) {
    return results[1];
  });
};

_.many = function () {
  var self = this;

  return Parsimmon(function (input, i) {
    var accum = [];
    var result = undefined;

    for (;;) {
      result = mergeReplies(self._(input, i), result);
      if (result.status) {
        if (i === result.index) {
          throw new Error(
            "infinite loop detected in .many() parser --- calling .many() on " +
              "a parser which can accept zero characters is usually the cause"
          );
        }
        i = result.index;
        accum.push(result.value);
      } else {
        return mergeReplies(makeSuccess(i, accum), result);
      }
    }
  });
};

_.tieWith = function (separator) {
  assertString(separator);
  return this.map(function (args) {
    assertArray(args);
    if (args.length) {
      assertString(args[0]);
      var s = args[0];
      for (var i = 1; i < args.length; i++) {
        assertString(args[i]);
        s += separator + args[i];
      }
      return s;
    } else {
      return "";
    }
  });
};

_.tie = function () {
  return this.tieWith("");
};

_.times = function (min, max) {
  var self = this;
  if (arguments.length < 2) {
    max = min;
  }
  assertNumber(min);
  assertNumber(max);
  return Parsimmon(function (input, i) {
    var accum = [];
    var result = undefined;
    var prevResult = undefined;
    for (var times = 0; times < min; times += 1) {
      result = self._(input, i);
      prevResult = mergeReplies(result, prevResult);
      if (result.status) {
        i = result.index;
        accum.push(result.value);
      } else {
        return prevResult;
      }
    }
    for (; times < max; times += 1) {
      result = self._(input, i);
      prevResult = mergeReplies(result, prevResult);
      if (result.status) {
        i = result.index;
        accum.push(result.value);
      } else {
        break;
      }
    }
    return mergeReplies(makeSuccess(i, accum), prevResult);
  });
};

_.result = function (res) {
  return this.map(function () {
    return res;
  });
};

_.atMost = function (n) {
  return this.times(0, n);
};

_.atLeast = function (n) {
  return seqMap(this.times(n), this.many(), function (init, rest) {
    return init.concat(rest);
  });
};

_.map = function (fn) {
  assertFunction(fn);
  var self = this;
  return Parsimmon(function (input, i) {
    var result = self._(input, i);
    if (!result.status) {
      return result;
    }
    return mergeReplies(makeSuccess(result.index, fn(result.value)), result);
  });
};

_.contramap = function (fn) {
  assertFunction(fn);
  var self = this;
  return Parsimmon(function (input, i) {
    var result = self.parse(fn(input.slice(i)));
    if (!result.status) {
      return result;
    }
    return makeSuccess(i + input.length, result.value);
  });
};

_.promap = function (f, g) {
  assertFunction(f);
  assertFunction(g);
  return this.contramap(f).map(g);
};

_.skip = function (next) {
  return seq(this, next).map(function (results) {
    return results[0];
  });
};

_.mark = function () {
  return seqMap(index, this, index, function (start, value, end) {
    return {
      start: start,
      value: value,
      end: end,
    };
  });
};

_.node = function (name) {
  return seqMap(index, this, index, function (start, value, end) {
    return {
      name: name,
      value: value,
      start: start,
      end: end,
    };
  });
};

_.sepBy = function (separator) {
  return sepBy(this, separator);
};

_.sepBy1 = function (separator) {
  return sepBy1(this, separator);
};

_.lookahead = function (x) {
  return this.skip(lookahead(x));
};

_.notFollowedBy = function (x) {
  return this.skip(notFollowedBy(x));
};

_.desc = function (expected) {
  if (!isArray$1(expected)) {
    expected = [expected];
  }
  var self = this;
  return Parsimmon(function (input, i) {
    var reply = self._(input, i);
    if (!reply.status) {
      reply.expected = expected;
    }
    return reply;
  });
};

_.fallback = function (result) {
  return this.or(succeed(result));
};

_.ap = function (other) {
  return seqMap(other, this, function (f, x) {
    return f(x);
  });
};

_.chain = function (f) {
  var self = this;
  return Parsimmon(function (input, i) {
    var result = self._(input, i);
    if (!result.status) {
      return result;
    }
    var nextParser = f(result.value);
    return mergeReplies(nextParser._(input, result.index), result);
  });
};

// -*- Constructors -*-

function string(str) {
  assertString(str);
  var expected = "'" + str + "'";
  return Parsimmon(function (input, i) {
    var j = i + str.length;
    var head = input.slice(i, j);
    if (head === str) {
      return makeSuccess(j, head);
    } else {
      return makeFailure(i, expected);
    }
  });
}

function byte(b) {
  ensureBuffer();
  assertNumber(b);
  if (b > 0xff) {
    throw new Error(
      "Value specified to byte constructor (" +
        b +
        "=0x" +
        b.toString(16) +
        ") is larger in value than a single byte."
    );
  }
  var expected = (b > 0xf ? "0x" : "0x0") + b.toString(16);
  return Parsimmon(function (input, i) {
    var head = get(input, i);
    if (head === b) {
      return makeSuccess(i + 1, head);
    } else {
      return makeFailure(i, expected);
    }
  });
}

function regexp(re, group) {
  assertRegexp(re);
  if (arguments.length >= 2) {
    assertNumber(group);
  } else {
    group = 0;
  }
  var anchored = anchoredRegexp(re);
  var expected = "" + re;
  return Parsimmon(function (input, i) {
    var match = anchored.exec(input.slice(i));
    if (match) {
      if (0 <= group && group <= match.length) {
        var fullMatch = match[0];
        var groupMatch = match[group];
        return makeSuccess(i + fullMatch.length, groupMatch);
      }
      var message =
        "valid match group (0 to " + match.length + ") in " + expected;
      return makeFailure(i, message);
    }
    return makeFailure(i, expected);
  });
}

function succeed(value) {
  return Parsimmon(function (input, i) {
    return makeSuccess(i, value);
  });
}

function fail(expected) {
  return Parsimmon(function (input, i) {
    return makeFailure(i, expected);
  });
}

function lookahead(x) {
  if (isParser(x)) {
    return Parsimmon(function (input, i) {
      var result = x._(input, i);
      result.index = i;
      result.value = "";
      return result;
    });
  } else if (typeof x === "string") {
    return lookahead(string(x));
  } else if (x instanceof RegExp) {
    return lookahead(regexp(x));
  }
  throw new Error("not a string, regexp, or parser: " + x);
}

function notFollowedBy(parser) {
  assertParser(parser);
  return Parsimmon(function (input, i) {
    var result = parser._(input, i);
    var text = input.slice(i, result.index);
    return result.status
      ? makeFailure(i, 'not "' + text + '"')
      : makeSuccess(i, null);
  });
}

function test(predicate) {
  assertFunction(predicate);
  return Parsimmon(function (input, i) {
    var char = get(input, i);
    if (i < input.length && predicate(char)) {
      return makeSuccess(i + 1, char);
    } else {
      return makeFailure(i, "a character/byte matching " + predicate);
    }
  });
}

function oneOf(str) {
  var expected = str.split("");
  for (var idx = 0; idx < expected.length; idx++) {
    expected[idx] = "'" + expected[idx] + "'";
  }
  return test(function (ch) {
    return str.indexOf(ch) >= 0;
  }).desc(expected);
}

function noneOf(str) {
  return test(function (ch) {
    return str.indexOf(ch) < 0;
  }).desc("none of '" + str + "'");
}

function custom(parsingFunction) {
  return Parsimmon(parsingFunction(makeSuccess, makeFailure));
}

// TODO[ES5]: Improve error message using JSON.stringify eventually.
function range(begin, end) {
  return test(function (ch) {
    return begin <= ch && ch <= end;
  }).desc(begin + "-" + end);
}

function takeWhile(predicate) {
  assertFunction(predicate);

  return Parsimmon(function (input, i) {
    var j = i;
    while (j < input.length && predicate(get(input, j))) {
      j++;
    }
    return makeSuccess(j, input.slice(i, j));
  });
}

function lazy(desc, f) {
  if (arguments.length < 2) {
    f = desc;
    desc = undefined;
  }

  var parser = Parsimmon(function (input, i) {
    parser._ = f()._;
    return parser._(input, i);
  });

  if (desc) {
    return parser.desc(desc);
  } else {
    return parser;
  }
}

// -*- Fantasy Land Extras -*-

function empty() {
  return fail("fantasy-land/empty");
}

_.concat = _.or;
_.empty = empty;
_.of = succeed;
_["fantasy-land/ap"] = _.ap;
_["fantasy-land/chain"] = _.chain;
_["fantasy-land/concat"] = _.concat;
_["fantasy-land/empty"] = _.empty;
_["fantasy-land/of"] = _.of;
_["fantasy-land/map"] = _.map;

// -*- Base Parsers -*-

var index = Parsimmon(function (input, i) {
  return makeSuccess(i, makeLineColumnIndex(input, i));
});

var any = Parsimmon(function (input, i) {
  if (i >= input.length) {
    return makeFailure(i, "any character/byte");
  }
  return makeSuccess(i + 1, get(input, i));
});

var all = Parsimmon(function (input, i) {
  return makeSuccess(input.length, input.slice(i));
});

var eof = Parsimmon(function (input, i) {
  if (i < input.length) {
    return makeFailure(i, "EOF");
  }
  return makeSuccess(i, null);
});

var digit = regexp(/[0-9]/).desc("a digit");
var digits = regexp(/[0-9]*/).desc("optional digits");
var letter = regexp(/[a-z]/i).desc("a letter");
var letters = regexp(/[a-z]*/i).desc("optional letters");
var optWhitespace = regexp(/\s*/).desc("optional whitespace");
var whitespace = regexp(/\s+/).desc("whitespace");
var cr = string("\r");
var lf = string("\n");
var crlf = string("\r\n");
var newline = alt(crlf, lf, cr).desc("newline");
var end = alt(newline, eof);

Parsimmon.all = all;
Parsimmon.alt = alt;
Parsimmon.any = any;
Parsimmon.cr = cr;
Parsimmon.createLanguage = createLanguage;
Parsimmon.crlf = crlf;
Parsimmon.custom = custom;
Parsimmon.digit = digit;
Parsimmon.digits = digits;
Parsimmon.empty = empty;
Parsimmon.end = end;
Parsimmon.eof = eof;
Parsimmon.fail = fail;
Parsimmon.formatError = formatError;
Parsimmon.index = index;
Parsimmon.isParser = isParser;
Parsimmon.lazy = lazy;
Parsimmon.letter = letter;
Parsimmon.letters = letters;
Parsimmon.lf = lf;
Parsimmon.lookahead = lookahead;
Parsimmon.makeFailure = makeFailure;
Parsimmon.makeSuccess = makeSuccess;
Parsimmon.newline = newline;
Parsimmon.noneOf = noneOf;
Parsimmon.notFollowedBy = notFollowedBy;
Parsimmon.of = succeed;
Parsimmon.oneOf = oneOf;
Parsimmon.optWhitespace = optWhitespace;
Parsimmon.Parser = Parsimmon;
Parsimmon.range = range;
Parsimmon.regex = regexp;
Parsimmon.regexp = regexp;
Parsimmon.sepBy = sepBy;
Parsimmon.sepBy1 = sepBy1;
Parsimmon.seq = seq;
Parsimmon.seqMap = seqMap;
Parsimmon.seqObj = seqObj;
Parsimmon.string = string;
Parsimmon.succeed = succeed;
Parsimmon.takeWhile = takeWhile;
Parsimmon.test = test;
Parsimmon.whitespace = whitespace;
Parsimmon["fantasy-land/empty"] = empty;
Parsimmon["fantasy-land/of"] = succeed;

Parsimmon.Binary = {
  bitSeq: bitSeq,
  bitSeqObj: bitSeqObj,
  byte: byte,
  buffer: parseBuffer,
  encodedString: encodedString,
  uintBE: uintBE,
  uint8BE: uintBE(1),
  uint16BE: uintBE(2),
  uint32BE: uintBE(4),
  uintLE: uintLE,
  uint8LE: uintLE(1),
  uint16LE: uintLE(2),
  uint32LE: uintLE(4),
  intBE: intBE,
  int8BE: intBE(1),
  int16BE: intBE(2),
  int32BE: intBE(4),
  intLE: intLE,
  int8LE: intLE(1),
  int16LE: intLE(2),
  int32LE: intLE(4),
  floatBE: floatBE(),
  floatLE: floatLE(),
  doubleBE: doubleBE(),
  doubleLE: doubleLE(),
};

var parsimmon = Parsimmon;

const {
  alt: alt$1,
  regexp: regexp$1,
  seq: seq$1,
  string: string$1,
} = parsimmon;

const whitespace$1 = regexp$1(/\s*/m);
const token = (parser) => parser.skip(whitespace$1);
const skipWhitespace = (parser) => parser.skip(whitespace$1);
const letter$1 = (text) => string$1(text).thru(skipWhitespace);
const word = (text) => string$1(text).thru(skipWhitespace);
const number = () =>
  token(regexp$1(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/))
    .map(Number)
    .desc("number");

const nominalSize = seq$1(word("#"), number()).map(([, inchDiameter]) => ({
  inchDiameter,
}));
const length = seq$1(number()).map(([feetLength]) => ({ feetLength }));

// FIX: Should be 'M'
const metricSize = seq$1(letter$1("m"), number()).map(([, mmDiameter]) => ({
  mmDiameter,
}));
const metricLength = alt$1(
  number().skip(word("mm")),
  number()
).map((mmLength) => ({ mmLength }));

const nominalSizeAndLength = seq$1(
  nominalSize.skip(word("x")),
  length
).map(([nominalSize, length]) => ({ ...nominalSize, ...length }));
const metricSizeAndLength = seq$1(
  metricSize.skip(word("x")),
  metricLength
).map(([nominalSize, length]) => ({ ...nominalSize, ...length }));

const size = alt$1(nominalSizeAndLength, metricSizeAndLength);

const driveStyle = alt$1(
  word("slotted"),
  word("phillips"), // Phillips
  word("square")
).map((driveStyle) => ({ driveStyle }));

const headType = alt$1(
  word("flat head"),
  word("oval countersunk head"),
  word("round head")
).map((headType) => ({ headType }));

const fastenerName = alt$1(word("wood screw")).map((fastenerName) => ({
  fastenerName: fastenerName,
}));

const material = alt$1(
  word("steel"),
  word("stainless steel"),
  word("brass"),
  word("silicon bronze")
).map((material) => ({ material }));

const protectiveFinish = alt$1(word("zinc plated")).map((protectiveFinish) => ({
  protectiveFinish,
}));

const WoodScrewDesignator = alt$1(
  seq$1(
    size,
    driveStyle,
    headType,
    fastenerName.skip(word(",")),
    material,
    protectiveFinish
  ),
  seq$1(size, driveStyle, headType, fastenerName.skip(word(",")), material),
  seq$1(
    size,
    driveStyle,
    headType,
    fastenerName.skip(word(",")),
    protectiveFinish
  ),
  seq$1(size, driveStyle, headType, fastenerName)
);

/*
From: https://www.fastenermart.com/wood-screws.html

DESIGNATION
Wood screws are typically described as follows:

Nominal Size (a number from #0 to #24; #0 is smallest)
Screw Length (in inches; see above for instructions on how to measure)
Drive Style (slotted, Phillips or square)
Head Type (flat or oval countersunk, or round)
Fastener Name (wood screw)
Material (steel, stainless steel, brass and silicon bronze)
Protective Finish (zinc plated if steel)
Examples:

#10 x 1 1/2" Slotted Round Head Wood Screw, Brass
#4 x 7/8" Phillips Flat Head Wood Screw, Zinc Plated (because zinc plating usually means that the fastener is made of steel, the word "steel" is often omitted in the description)
*/

const decode = (designator) => {
  return WoodScrewDesignator.tryParse(designator.toLowerCase()).reduce(
    (value, object) => ({ ...object, ...value, designator }),
    {}
  );
};

const WoodScrew = ({
  fastenerName = "wood screw",
  headType,
  driveStyle,
  inchDiameter,
  feetLength,
  material = "steel",
  mmDiameter,
  mmLength,
  protectiveFinish,
  designator,
}) => {
  if (feetLength) {
    mmLength = feetLength * foot;
  }
  if (inchDiameter) {
    mmDiameter = inchDiameter * inch;
  }
  return Cylinder(mmDiameter, mmLength).material("thread").Item(designator);
};

registerDesignator(decode, WoodScrew);

const api = {
  FlatRod,
  HexBolt,
  Rod,
  Screw,
  WoodScrew,
};

export default api;
export { FlatRod, HexBolt, Rod, Screw, WoodScrew };
