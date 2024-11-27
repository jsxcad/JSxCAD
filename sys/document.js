/* global globalThis */

import { Image } from 'canvas';
import { JSDOM } from 'jsdom';
import { onBoot } from './boot.js';

onBoot(() => {
  const dom = new JSDOM('<html><body></body></html>');
  globalThis.window = dom.window;
  globalThis.document = window.document;
  globalThis.createImageBitmap = async function createImageBitmap(blob) {
    const ab = await blob.arrayBuffer();
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.src = new Uint8Array(ab); // might have to do: Buffer.from(ab)
    });
    return img;
  };
});
