import ColorNamer from 'color-namer';

const toEntryFromNamerName = (name) => {
  try {
    const { basic, html, ntc, pantone, roygbiv, x11 } = ColorNamer(name);
    let bestDistance = Infinity;
    let best;
    for (const list of [basic, html, ntc, pantone, roygbiv, x11]) {
      for (const entry of list) {
        if (entry.distance < bestDistance) {
          best = entry;
          bestDistance = entry.distance;
        }
        break;
      }
    }
    return best;
  } catch (e) {
    return { name: 'imaginary', hex: '000000' };
  }
};

const toTagFromNamerName = (name) => {
  const entry = toEntryFromNamerName(name);
  if (entry !== undefined) {
    return `color/${entry.name.toLowerCase()}`;
  }
  return `color/unknown`;
};

const toRgbFromNamerName = (name, defaultRgb = [0, 0, 0]) => {
  const entry = toEntryFromNamerName(name);
  if (entry !== undefined) {
    let hex = entry.hex;
    if (hex.startsWith('#')) hex = hex.substring(1);
    const value = parseInt(hex, 16);
    const rgb = [(value >> 16) & 0xFF,
                 (value >> 8) & 0xFF,
                 (value >> 0) & 0xFF];
    return rgb;
  }
  return defaultRgb;
};

const toRgbFromName = (name, defaultRgb = [0, 0, 0]) => {
  const normalizedName = name.toLowerCase();
  const { basic, html, ntc, pantone, roygbiv, x11 } = ColorNamer.lists;
  for (const list of [basic, html, ntc, pantone, roygbiv, x11]) {
    for (let { name, hex } of list) {
      if (normalizedName === name.toLowerCase()) {
        if (hex.startsWith('#')) hex = hex.substring(1);
        const value = parseInt(hex, 16);
        const rgb = [(value >> 16) & 0xFF,
                     (value >> 8) & 0xFF,
                     (value >> 0) & 0xFF];
        return rgb;
      }
    }
  }
  return toRgbFromNamerName(name, defaultRgb);
};

export const toTagFromRgbInt = (rgbInt, defaultTag = 'color/unknown') =>
  toTagFromNamerName(`rgb(${(rgbInt >> 16) & 0xFF},${(rgbInt >> 8) & 0xFF},${(rgbInt >> 0) & 0xFF})`);

export const toTagFromRgb = ([r = 0, g = 0, b = 0], defaultTag = 'color/black') =>
  toTagFromNamerName(`rgb(${r},${g},${b})`);

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

export const toTagFromName = (name) => toTagFromRgb(toRgbFromName(name));
