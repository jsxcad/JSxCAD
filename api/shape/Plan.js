import { endTime, startTime } from '@jsxcad/sys';
// import { identity, registerReifier, taggedPlan } from '@jsxcad/geometry';
import { identity, taggedPlan } from '@jsxcad/geometry';

import { Shape } from './Shape.js';
import { zag } from '@jsxcad/api-v1-math';

const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];
const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];
const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];
const subtract = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

const updatePlan = Shape.registerMethod('updatePlan', 
  (...updates) =>
  (shape) => {
    const geometry = shape.toGeometry();
    if (geometry.type !== 'plan') {
      throw Error(`Shape is not a plan: ${JSON.stringify(geometry)}`);
    }
    // console.log(`QQ/updatePlan/shape.chain: ${shape.chain}`);
    return Shape.fromGeometry(
      taggedPlan(
        { tags: geometry.tags },
        {
          ...geometry.plan,
          history: [...(geometry.plan.history || []), ...updates],
        }
      )
    );
  });

export const hasAngle = Shape.registerMethod('hasAngle',
  (start = 0, end = 0) =>
    (shape) =>
      shape
        .updatePlan({ angle: { start: start, end: end } })
        .setTag('plan:angle/start', start)
        .setTag('plan:angle/end', end)
);
export const hasCorner1 = Shape.registerMethod(['hasC1', 'hasCorner1'],
  (x = 0, y = x, z = 0) =>
    (shape) => {
      // console.log(`QQ/hasCorner1/shape: ${JSON.stringify(shape)}`);
      return shape.updatePlan({ corner1: [x, y, z] });
    }
);
export const hasC1 = hasCorner1;
export const hasCorner2 = Shape.registerMethod(['hasC2', 'hasCorner2'],
  (x = 0, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan({
        corner2: [x, y, z],
      })
);
export const hasC2 = hasCorner2;
export const hasDiameter = Shape.registerMethod('hasDiameter',
  (x = 1, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan(
        { corner1: [x / 2, y / 2, z / 2] },
        { corner2: [x / -2, y / -2, z / -2] }
      )
);
export const hasRadius = Shape.registerMethod('hasRadius',
  (x = 1, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan(
        {
          corner1: [x, y, z],
        },
        {
          corner2: [-x, -y, -z],
        }
      )
);
export const hasApothem = Shape.registerMethod('hasApothem',
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
      )
);
export const hasSides = Shape.registerMethod('hasSides',
  (sides = 1) =>
    (shape) =>
      shape.updatePlan({ sides }).setTag('plan:sides', sides)
);
export const hasZag = Shape.registerMethod('hasZag',
  (zag) => (shape) => shape.updatePlan({ zag }).setTag('plan:zag', zag)
);

const eachEntry = (geometry, op, otherwise) => {
  if (geometry.plan.history) {
    for (let nth = geometry.plan.history.length - 1; nth >= 0; nth--) {
      const result = op(geometry.plan.history[nth]);
      if (result !== undefined) {
        return result;
      }
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
export const getMatrix = (geometry) => geometry.matrix || identity();
export const getTo = (geometry) => find(geometry, 'to', [0, 0, 1]);
export const getUp = (geometry) => find(geometry, 'up', [0, -1, 0]);
export const getZag = (geometry, otherwise = defaultZag) =>
  find(geometry, 'zag', otherwise);

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

const X = 0;
const Y = 1;
const Z = 2;

export const buildCorners = (x, y, z) => {
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    if (x[0] < x[1]) {
      c1[X] = x[1];
      c2[X] = x[0];
    } else {
      c1[X] = x[0];
      c2[X] = x[1];
    }
  } else {
    c1[X] = x / 2;
    c2[X] = x / -2;
  }
  if (y instanceof Array) {
    if (y[0] < y[1]) {
      c1[Y] = y[1];
      c2[Y] = y[0];
    } else {
      c1[Y] = y[0];
      c2[Y] = y[1];
    }
  } else {
    c1[Y] = y / 2;
    c2[Y] = y / -2;
  }
  if (z instanceof Array) {
    if (z[0] < z[1]) {
      c1[Z] = z[1];
      c2[Z] = z[0];
    } else {
      c1[Z] = z[0];
      c2[Z] = z[1];
    }
  } else {
    c1[Z] = z / 2;
    c2[Z] = z / -2;
  }
  return [c1, c2];
};

export const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

/*
Shape.registerReifier = (name, op) => {
  const finishedOp = async (geometry) => {
    const timer = startTime(`Reify ${name}`);
    const shape = op(Shape.fromGeometry(geometry));
    if (!(shape instanceof Shape) && !shape.isChain) {
      throw Error(`Expected Shape or chain`);
    }
    const result = await shape
      .transform(getMatrix(geometry))
      .setTags(geometry.tags)
      .toGeometry();
    endTime(timer);
    return result;
  };
  registerReifier(name, finishedOp);
  return finishedOp;
};
*/

export default Plan;
