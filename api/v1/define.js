import { emit } from '@jsxcad/sys';
import hashSum from 'hash-sum';

export const define = (tag, data) => {
  const define = { tag, data };
  emit({ define, hash: hashSum(define) });
  return define;
};

export const defRgbColor = (name, rgb) => define(`color/${name}`, { rgb });

export const defThreejsMaterial = (name, definition) =>
  define(`material/${name}`, { threejsMaterial: definition });
