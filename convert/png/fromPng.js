import UPNG from 'upng-js';

export const fromPng = async (options = {}, data) => {
  const img = UPNG.decode(data);
  const { width, height } = img;
  const rgba = UPNG.toRGBA8(img)[0];
  const pixels = new Uint8Array(rgba);
  return { width, height, pixels };
};
