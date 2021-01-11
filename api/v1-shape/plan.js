import Shape from './Shape.js';
import { taggedPlan } from '@jsxcad/geometry-tagged';

const updatePlan = (shape, update) => {
  const geometry = shape.toTransformedGeometry();
  if (geometry.type !== 'plan') {
    throw Error(`Shape is not a plan`);
  }
  const updated = Object.assign({}, geometry.plan, update);
  return Shape.fromGeometry(taggedPlan({ tags: geometry.tags }, updated));
};

const updatePlanMethod = function (update) {
  return updatePlan(this, update);
};

Shape.prototype.updatePlan = updatePlanMethod;

export const apothem = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan({
    apothem: [x, y, z],
    diameter: undefined,
    radius: undefined,
    corner1: undefined,
    corner2: undefined,
  });
export const angle = (shape, end = 360, start = 0) =>
  shape.updatePlan({ angle: { start, end } });
export const base = (shape, base) =>
  shape.updatePlan({ base, from: undefined });
export const corner1 = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan({
    corner1: [x, y, z],
    apothem: undefined,
    diameter: undefined,
    radius: undefined,
  });
export const corner2 = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan({
    corner2: [x, y, z],
    apothem: undefined,
    diameter: undefined,
    radius: undefined,
  });
export const diameter = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan({
    diameter: [x, y, z],
    apothem: undefined,
    radius: undefined,
    corner1: undefined,
    corner2: undefined,
  });
export const radius = (shape, x = 1, y = x, z = 0) =>
  shape.updatePlan({
    radius: [x, y, z],
    apothem: undefined,
    diameter: undefined,
    corner1: undefined,
    corner2: undefined,
  });
export const from = (shape, x = 0, y = 0, z = 0) =>
  shape.updatePlan({ from: [x, y, z] });
export const sides = (shape, sides = 1) => shape.updatePlan({ sides });
export const to = (shape, x = 0, y = 0, z = 0) =>
  shape.updatePlan({ to: [x, y, z], top: undefined });
export const top = (shape, top) => shape.updatePlan({ top, to: undefined });

const apothemMethod = function (x, y, z) {
  return apothem(this, x, y, z);
};
const angleMethod = function (end, start) {
  return angle(this, end, start);
};
const baseMethod = function (height) {
  return base(this, height);
};
const corner1Method = function (x, y, z) {
  return corner1(this, x, y, z);
};
const corner2Method = function (x, y, z) {
  return corner2(this, x, y, z);
};
const diameterMethod = function (x, y, z) {
  return diameter(this, x, y, z);
};
const fromMethod = function (x, y, z) {
  return from(this, x, y, z);
};
const radiusMethod = function (x, y, z) {
  return radius(this, x, y, z);
};
const sidesMethod = function (value) {
  return sides(this, value);
};
const toMethod = function (x, y, z) {
  return to(this, x, y, z);
};
const topMethod = function (height) {
  return top(this, height);
};

Shape.prototype.apothem = apothemMethod;
Shape.prototype.angle = angleMethod;
Shape.prototype.base = baseMethod;
Shape.prototype.corner1 = corner1Method;
Shape.prototype.c1 = corner1Method;
Shape.prototype.corner2 = corner2Method;
Shape.prototype.c2 = corner2Method;
Shape.prototype.diameter = diameterMethod;
Shape.prototype.from = fromMethod;
Shape.prototype.radius = radiusMethod;
Shape.prototype.sides = sidesMethod;
Shape.prototype.to = toMethod;
Shape.prototype.top = topMethod;
