import UPNG from 'upng-js';

export const toPng = async ({ width, height, pixels }) =>
  UPNG.encode([pixels], width, height, 256);
