import colors from './colors';
import { proximity } from './proximity';

const toEntryFromRgbInt = (rgbInt) => {
  const rgb = toArrayFromRgbInt(rgbInt);
  let bestDistance = Infinity;
  let best;
  for (const entry of colors) {
    const distance = proximity(rgb, toArrayFromRgbInt(entry.rgb));
    if (distance < bestDistance) {
      best = entry;
      bestDistance = distance;
    }
  }
  return best;
};

const toRgbIntFromName = (name, defaultRgbInt = 0) => {
  let rgbInt;
  // Handle '#00ffbb'.
  if (rgbInt === undefined) {
    if (name.startsWith('#')) {
      rgbInt = parseInt(name.substring(1), 16);
    }
  }
  // Handle 'blue'.
  if (rgbInt === undefined) {
    const normalizedName = name.toLowerCase();
    for (const { name, rgb } of colors) {
      if (normalizedName === name) {
        rgbInt = rgb;
      }
    }
  }
  // Handle defaulting.
  if (rgbInt === undefined) {
    rgbInt = defaultRgbInt;
  }
  return rgbInt;
};

export const toArrayFromRgbInt = (rgbInt) => [
  (rgbInt >> 16) & 0xff,
  (rgbInt >> 8) & 0xff,
  (rgbInt >> 0) & 0xff,
];

export const toRgbIntFromTags = (tags = [], defaultRgb = [0, 0, 0]) => {
  let rgb = defaultRgb;
  for (const tag of tags) {
    if (tag.startsWith('color/')) {
      let entry = toRgbIntFromName(tag.substring(6));
      if (entry !== undefined) {
        return entry;
      }
    }
  }
  return rgb;
};

export const toTagFromName = (name) => {
  const entry = toEntryFromRgbInt(toRgbIntFromName(name));
  if (entry !== undefined) {
    return `color/${entry.name.toLowerCase()}`;
  }
  return `color/unknown`;
};

export const toTagFromRgbInt = (rgbInt, defaultTag = 'color/black') =>
  toTagFromName(`#${rgbInt.toString(16).padStart(6, '0')}`);

export const toTagsFromName = (name) => [toTagFromName(name)];

export const toRgbFromName = (name) =>
  toArrayFromRgbInt(toRgbIntFromName(name));

export const toRgbFromTags = (tags, defaultRgb) => {
  const rgbInt = toRgbIntFromTags(tags, null);
  if (rgbInt === null) {
    return defaultRgb;
  }
  return toArrayFromRgbInt(rgbInt);
};
