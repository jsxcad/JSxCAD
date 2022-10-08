import {
  decode as decodeToArrayBuffer,
  encode as encodeFromArrayBuffer,
} from 'base64-arraybuffer';

export const encode = (data) => {
  if (typeof data === 'string') {
    data = new TextEncoder('utf-8').encode(data);
  }
  return encodeFromArrayBuffer(data.buffer);
};

export const decode = (string) => new Uint8Array(decodeToArrayBuffer(string));

export const encodeFiles = (unencoded) => {
  const encoded = {};
  for (const key of Object.keys(unencoded)) {
    encoded[key] = encode(unencoded[key]);
  }
  return encodeURIComponent(JSON.stringify(encoded));
};

export const decodeFiles = (string) => {
  const encoded = JSON.parse(decodeURIComponent(string));
  const decoded = {};
  for (const key of Object.keys(encoded)) {
    decoded[key] = decode(encoded[key]);
  }
  return decoded;
};
