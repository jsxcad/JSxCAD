import Shape from './Shape.js';
import { taggedPlan } from '@jsxcad/geometry-tagged';

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

export const angle = (shape, start = 0, end = 0) =>
  shape.updatePlan({ angle: { start: start, end: end } });
export const base = (shape, base) => shape.updatePlan({ base });
export const at = (shape, x = 0, y = 0, z = 0) =>
  shape.updatePlan({
    at: [x, y, z],
  });
export const corner1 = (shape, x = 0, y = x, z = 0) =>
  shape.updatePlan({
    corner1: [x, y, z],
  });
export const corner2 = (shape, x = 0, y = x, z = 0) =>
  shape.updatePlan({
    corner2: [x, y, z],
  });
export const diameter = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan(
    { corner1: [x / 2, y / 2, z / 2] },
    { corner2: [x / -2, y / -2, z / -2] }
  );
export const radius = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan(
    {
      corner1: [x, y, z],
    },
    {
      corner2: [-x, -y, -z],
    }
  );
export const apothem = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan(
    {
      corner1: [x, y, z],
    },
    {
      corner2: [-x, -y, -z],
    },
    { apothem: [x, y, z] }
  );
export const from = (shape, x = 0, y = 0, z = 0) =>
  shape.updatePlan({ from: [x, y, z] });
export const sides = (shape, sides = 1) => shape.updatePlan({ sides });
export const to = (shape, x = 0, y = 0, z = 0) =>
  shape.updatePlan({ to: [x, y, z], top: undefined });
export const top = (shape, top) => shape.updatePlan({ top });
export const zag = (shape, zag) => shape.updatePlan({ zag });

Shape.registerMethod('apothem', apothem);
Shape.registerMethod('angle', angle);
Shape.registerMethod('at', at);
Shape.registerMethod('base', base);
Shape.registerMethod('corner1', corner1);
Shape.registerMethod('c1', corner1);
Shape.registerMethod('corner2', corner2);
Shape.registerMethod('c2', corner2);
Shape.registerMethod('diameter', diameter);
Shape.registerMethod('from', from);
Shape.registerMethod('radius', radius);
Shape.registerMethod('sides', sides);
Shape.registerMethod('to', to);
Shape.registerMethod('top', top);
Shape.registerMethod('zag', zag);

// Let's consider migrating to a 'has' prefix for planning.

Shape.registerMethod('hasApothem', apothem);
Shape.registerMethod('hasAngle', angle);
Shape.registerMethod('hasAt', at);
Shape.registerMethod('hasBase', base);
Shape.registerMethod('hasCorner1', corner1);
Shape.registerMethod('hasC1', corner1);
Shape.registerMethod('hasCorner2', corner2);
Shape.registerMethod('hasC2', corner2);
Shape.registerMethod('hasDiameter', diameter);
Shape.registerMethod('hasFrom', from);
Shape.registerMethod('hasRadius', radius);
Shape.registerMethod('hasSides', sides);
Shape.registerMethod('hasTo', to);
Shape.registerMethod('hasTop', top);
Shape.registerMethod('hasZag', zag);
