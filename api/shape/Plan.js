import { abs, add, scale, subtract } from '@jsxcad/math-vec3';

import { Shape } from './Shape.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { taggedPlan } from '@jsxcad/geometry';
import { zag } from '@jsxcad/api-v1-math';

const updatePlan =
  (...updates) =>
  (shape) => {
    const geometry = shape.toTransformedGeometry();
    if (geometry.type !== 'plan') {
      throw Error(`Shape is not a plan`);
    }
    return Shape.fromGeometry(
      taggedPlan(
        { tags: geometry.tags },
        {
          ...geometry.plan,
          history: [...(geometry.plan.history || []), ...updates],
        }
      )
    );
  };

Shape.registerMethod('updatePlan', updatePlan);

export const hasAngle =
  (start = 0, end = 0) =>
  (shape) =>
    shape.updatePlan({ angle: { start: start, end: end } });
export const hasBase = (base) => (shape) => shape.updatePlan({ base });
export const hasAt =
  (x = 0, y = 0, z = 0) =>
  (shape) =>
    shape.updatePlan({
      at: [x, y, z],
    });
export const hasCorner1 =
  (x = 0, y = x, z = 0) =>
  (shape) =>
    shape.updatePlan({
      corner1: [x, y, z],
    });
export const hasC1 = hasCorner1;
export const hasCorner2 =
  (x = 0, y = x, z = 0) =>
  (shape) =>
    shape.updatePlan({
      corner2: [x, y, z],
    });
export const hasC2 = hasCorner2;
export const hasDiameter =
  (x = 1, y = x, z = 0) =>
  (shape) =>
    shape.updatePlan(
      { corner1: [x / 2, y / 2, z / 2] },
      { corner2: [x / -2, y / -2, z / -2] }
    );
export const hasRadius =
  (x = 1, y = x, z = 0) =>
  (shape) =>
    shape.updatePlan(
      {
        corner1: [x, y, z],
      },
      {
        corner2: [-x, -y, -z],
      }
    );
export const hasApothem =
  (x = 1, y = x, z = 0) =>
  (shape) =>
    shape.updatePlan(
      {
        corner1: [x, y, z],
      },
      {
        corner2: [-x, -y, -z],
      },
      { apothem: [x, y, z] }
    );
export const hasFrom =
  (x = 0, y = 0, z = 0) =>
  (shape) =>
    shape.updatePlan({ from: [x, y, z] });
export const hasSides =
  (sides = 1) =>
  (shape) =>
    shape.updatePlan({ sides });
export const hasTo =
  (x = 0, y = 0, z = 0) =>
  (shape) =>
    shape.updatePlan({ to: [x, y, z], top: undefined });
export const hasTop = (top) => (shape) => shape.updatePlan({ top });
export const hasZag = (zag) => (shape) => shape.updatePlan({ zag });

// Let's consider migrating to a 'has' prefix for planning.

Shape.registerMethod('hasApothem', hasApothem);
Shape.registerMethod('hasAngle', hasAngle);
Shape.registerMethod('hasAt', hasAt);
Shape.registerMethod('hasBase', hasBase);
Shape.registerMethod('hasCorner1', hasCorner1);
Shape.registerMethod('hasC1', hasCorner1);
Shape.registerMethod('hasCorner2', hasCorner2);
Shape.registerMethod('hasC2', hasCorner2);
Shape.registerMethod('hasDiameter', hasDiameter);
Shape.registerMethod('hasFrom', hasFrom);
Shape.registerMethod('hasRadius', hasRadius);
Shape.registerMethod('hasSides', hasSides);
Shape.registerMethod('hasTo', hasTo);
Shape.registerMethod('hasTop', hasTop);
Shape.registerMethod('hasZag', hasZag);

const eachEntry = (geometry, op, otherwise) => {
  for (let nth = geometry.plan.history.length - 1; nth >= 0; nth--) {
    const result = op(geometry.plan.history[nth]);
    if (result !== undefined) {
      return result;
    }
  }
  return otherwise;
};

const find = (geometry, key, otherwise) =>
  eachEntry(
    geometry,
    (entry) => {
      return entry[key];
    },
    otherwise
  );

export const ofPlan = find;

export const getAngle = (geometry) => find(geometry, 'angle', {});
export const getAt = (geometry) => find(geometry, 'at', [0, 0, 0]);
export const getCorner1 = (geometry) => find(geometry, 'corner1', [0, 0, 0]);
export const getCorner2 = (geometry) => find(geometry, 'corner2', [0, 0, 0]);
export const getFrom = (geometry) => find(geometry, 'from', [0, 0, 0]);
export const getMatrix = (geometry) => geometry.matrix || identityMatrix;
export const getTo = (geometry) => find(geometry, 'to', [0, 0, 0]);

const defaultZag = 0.01;

export const getSides = (geometry, otherwise = 32) => {
  const [scale] = getScale(geometry);
  let [length, width] = abs(scale);
  if (defaultZag !== undefined) {
    otherwise = zag(Math.max(length, width) * 2, defaultZag);
  }
  return eachEntry(
    geometry,
    (entry) => {
      if (entry.sides !== undefined) {
        return entry.sides;
      } else if (entry.zag !== undefined) {
        return zag(Math.max(length, width), entry.zag);
      }
    },
    otherwise
  );
};

export const getScale = (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  return [
    scale(0.5, subtract(corner1, corner2)),
    scale(0.5, add(corner1, corner2)),
  ];
};

export const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

export default Plan;
