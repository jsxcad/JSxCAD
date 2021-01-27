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

export const defTool = (name, definition) => define(`tool/${name}`, definition);

export const defDynamicGrblLaser = (
  name,
  { power = 1500, speed = 1000 } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'laser',
      cutSpeed: -power,
      jumpSpeed: -power,
      feedRate: speed,
    },
  });

export const defConstantGrblLaser = (
  name,
  { power = 1500, speed = 1000 } = {}
) =>
  defTool(name, {
    grbl: { type: 'laser', cutSpeed: power, jumpSpeed: power, feedRate: speed },
  });
