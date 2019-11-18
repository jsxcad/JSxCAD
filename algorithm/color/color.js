import Chroma from 'chroma-js';
import colors from './colors';

const toChromaNameFromRgb = (rgb) => {
  const suffix = rgb.toString(16);
  const prefix = '#000000';
  return prefix.substring(0, 7 - suffix.length) + suffix;
};

const toEntryFromChromaName = (chromaName) => {
  let bestDistance = Infinity;
  let best;
  for (const entry of colors) {
    const distance = Chroma.distance(chromaName, toChromaNameFromRgb(entry.rgb));
    if (distance < bestDistance) {
      best = entry;
      bestDistance = distance;
    }
  }
  return best;
};

const toTagFromChromaName = (name) => {
  const entry = toEntryFromChromaName(name);
  if (entry !== undefined) {
    return `color/${entry.name.toLowerCase()}`;
  }
  return `color/unknown`;
};

const toRgbFromChromaName = (name, defaultRgb = [0, 0, 0]) => {
  const entry = toEntryFromChromaName(name);
  if (entry !== undefined) {
    const { rgb } = entry;
    const result = [(rgb >> 16) & 0xFF,
                    (rgb >> 8) & 0xFF,
                    (rgb >> 0) & 0xFF];
    return result;
  }
  return defaultRgb;
};

const toRgbFromName = (name, defaultRgb = [0, 0, 0]) => {
  const normalizedName = name.toLowerCase();
  for (const { name, rgb } of colors) {
    if (normalizedName === name) {
      const result = [(rgb >> 16) & 0xFF,
                      (rgb >> 8) & 0xFF,
                      (rgb >> 0) & 0xFF];
      return result;
    }
  }
  return toRgbFromChromaName(name, defaultRgb);
};

export const toTagFromRgbInt = (rgbInt, defaultTag = 'color/black') =>
  toTagFromChromaName(`rgb(${(rgbInt >> 16) & 0xFF},${(rgbInt >> 8) & 0xFF},${(rgbInt >> 0) & 0xFF})`);

export const toTagFromRgb = ([r = 0, g = 0, b = 0], defaultTag = 'color/black') =>
  toTagFromChromaName(`rgb(${r},${g},${b})`);

export const toRgb = (tags = [], defaultRgb = [0, 0, 0]) => {
  let rgb = defaultRgb;
  for (const tag of tags) {
    if (tag.startsWith('color/')) {
      let entry = toRgbFromName(tag.substring(6));
      if (entry !== undefined) {
        rgb = entry;
      }
    }
  }
  return rgb;
};

export const toTagFromName = (name) => {
  const tag = toTagFromRgb(toRgbFromName(name));
  return tag;
};

export const toTagsFromName = (name) => {
  return [toTagFromName(name)];
};
