// import colors from './colors.js';
import { standardColorDefinitions } from './standardColorDefinitions.js';

/*
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

export const toRgbFromName = (name) =>
  toArrayFromRgbInt(toRgbIntFromName(name));
*/

// FIX: Apply normalizations here.
const toTagFromName = (name) => {
  return `color/${name}`;
};

export const toTagsFromName = (name) => [toTagFromName(name)];

export const toTagFromRgbInt = (rgbInt, defaultTag = 'color/#000000') =>
  toTagFromName(`#${rgbInt.toString(16).padStart(6, '0')}`);

export const toRgbColorFromTags = (
  tags = [],
  customDefinitions = {},
  otherwise = '#000000'
) => {
  for (const tag of tags) {
    if (tag.startsWith('color/')) {
      for (const definitions of [standardColorDefinitions, customDefinitions]) {
        const definition = definitions[tag];
        if (definition && definition.rgb) {
          return definition.rgb;
        }
      }
      if (tag.startsWith('color/#')) {
        // Assume tags that start with # are rgb colors.
        return tag.substring(6);
      }
    }
  }
  return otherwise;
};

export const toRgbFromTags = (
  tags = [],
  customDefinitions = {},
  otherwise = '#000000'
) => {
  const rgbColor = toRgbColorFromTags(tags, customDefinitions, otherwise);
  const rgbInt = parseInt(rgbColor.substring(1), 16);
  const rgb = [
    (rgbInt >> 16) & 0xff,
    (rgbInt >> 8) & 0xff,
    (rgbInt >> 0) & 0xff,
  ];
  return rgb;
};
