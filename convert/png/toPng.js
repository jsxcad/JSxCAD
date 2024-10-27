import UPNG from 'upng-js';

export const toPng = async ({ width, height, bytes }) =>
  new Uint8Array(UPNG.encode([bytes], width, height, 256));
