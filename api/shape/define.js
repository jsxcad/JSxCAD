import { emit } from '@jsxcad/sys';
import hashSum from 'hash-sum';

export const define = (tag, data) => {
  const define = { tag, data };
  emit({ define, hash: hashSum(define) });
  return data;
};

export const defRgbColor = (name, rgb) => define(`color:${name}`, { rgb });

export const defThreejsMaterial = (name, definition) =>
  define(`material:${name}`, { threejsMaterial: definition });

export const defTool = (name, definition) => define(`tool:${name}`, definition);

export const GrblSpindle = ({
  cutDepth = 0.2,
  rpm,
  feedRate,
  drillRate,
  diameter,
  jumpZ = 1,
} = {}) => ({
  grbl: {
    type: 'spindle',
    cutDepth,
    cutSpeed: rpm,
    feedRate,
    drillRate,
    diameter,
    jumpZ,
  },
});

export const GrblDynamicLaser = ({
  cutDepth = 0.2,
  diameter = 0.09,
  jumpPower = 0,
  power = 1000,
  speed = 1000,
  warmupDuration,
  warmupPower = 0,
} = {}) => ({
  grbl: {
    type: 'dynamicLaser',
    cutDepth,
    cutSpeed: -power,
    diameter,
    jumpRate: speed,
    jumpSpeed: -jumpPower,
    feedRate: speed,
    warmupDuration,
    warmupSpeed: -warmupPower,
  },
});

export const GrblConstantLaser = ({
  cutDepth = 0.2,
  diameter = 0.09,
  jumpPower,
  power = 1000,
  speed = 1000,
  warmupDuration,
  warmupPower = 0,
} = {}) => ({
  grbl: {
    type: 'constantLaser',
    cutDepth,
    cutSpeed: power,
    diameter,
    jumpRate: speed,
    jumpSpeed: jumpPower,
    feedRate: speed,
    warmupDuration,
    warmupSpeed: warmupPower,
  },
});

export const GrblPlotter = ({ feedRate = 1000, jumpZ = 1 } = {}) => ({
  grbl: { type: 'plotter', feedRate, jumpZ },
});
