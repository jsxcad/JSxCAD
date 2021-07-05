import Shape from './Shape.js';
import { taggedPlan } from '@jsxcad/geometry';

const updatePlan = (shape, ...updates) => {
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

const updatePlanMethod = function (...updates) {
  return updatePlan(this, ...updates);
};

Shape.prototype.updatePlan = updatePlanMethod;

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
