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
  return encoded;
};

export const decodeFiles = (encodedFiles) => {
  const decoded = {};
  for (const key of Object.keys(encodedFiles)) {
    decoded[key] = decode(encodedFiles[key]);
  }
  return decoded;
};
