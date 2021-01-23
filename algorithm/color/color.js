import { standardColorDefinitions } from './standardColorDefinitions.js';

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
  otherwise = [0, 0, 0]
) => {
  const rgbColor = toRgbColorFromTags(tags, customDefinitions, otherwise);
  if (rgbColor === otherwise) {
    return otherwise;
  }
  const rgbInt = parseInt(rgbColor.substring(1), 16);
  const rgb = [
    (rgbInt >> 16) & 0xff,
    (rgbInt >> 8) & 0xff,
    (rgbInt >> 0) & 0xff,
  ];
  return rgb;
};
