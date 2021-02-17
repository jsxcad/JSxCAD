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

export const defGrblSpindle = (
  name,
  { cutDepth = 0.2, rpm, feedRate, diameter, jumpZ = 1 }
) =>
  defTool(name, {
    grbl: {
      type: 'spindle',
      cutDepth,
      cutSpeed: rpm,
      feedRate,
      diameter,
      jumpZ,
    },
  });

export const defGrblDynamicLaser = (
  name,
  {
    cutDepth = 0.2,
    jumpPower = 0,
    power = 1000,
    speed = 1000,
    warmupDuration,
    warmupPower = 0,
  } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'dynamicLaser',
      cutDepth,
      cutSpeed: -power,
      jumpRate: speed,
      jumpSpeed: -jumpPower,
      feedRate: speed,
      warmupDuration,
      warmupSpeed: -warmupPower,
    },
  });

export const defGrblConstantLaser = (
  name,
  {
    cutDepth = 0.2,
    jumpPower,
    power = 1000,
    speed = 1000,
    warmupDuration,
    warmupPower = 0,
  } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'constantLaser',
      cutDepth,
      cutSpeed: power,
      jumpRate: speed,
      jumpSpeed: jumpPower,
      feedRate: speed,
      warmupDuration,
      warmupSpeed: warmupPower,
    },
  });
