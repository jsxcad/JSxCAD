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
  { jumpPower = 0, power = 1000, speed = 1000 } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'dynamicLaser',
      cutSpeed: -power,
      jumpRate: speed,
      jumpSpeed: -jumpPower,
      feedRate: speed,
    },
  });

export const defConstantGrblLaser = (
  name,
  { jumpPower, power = 1000, speed = 1000, lead } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'constantLaser',
      cutSpeed: power,
      jumpRate: speed,
      jumpSpeed: jumpPower,
      feedRate: speed,
      lead,
    },
  });
