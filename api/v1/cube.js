import { assertEmpty, assertNumber, assertNumberTriple } from './assert';
import { buildRegularPrism, buildRingSphere,
         regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Solid } from './Solid';
import { minkowski } from './minkowski';

// Dispatch mechanism.
// TODO: Move this somewhere else.

const chain = (name, ...dispatches) => {
  return (...params) => {
    for (const dispatch of dispatches) {
      // For each signature
      let operation;
      try {
        // Try to decode it into an operation.
        operation = dispatch(...params);
      } catch (e) {
        continue;
      }
      return operation();
    }
    throw Error(`Unsupported interface for ${name}: ${JSON.stringify(params)}`);
  };
};

// Geometry construction.

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

// Note: We can't call this while bootstrapping, but we could memoize the result afterward.
const unitCube = () => Solid.fromPolygons(buildRegularPrism({ edges: 4 }))
    .rotateZ(45)
    .scale([edgeScale, edgeScale, 1]);

const centerMaybe = ({ size, center }, shape) => {
  if (center) {
    return shape;
  } else {
    if (typeof size === 'number') {
      return shape.translate([size / 2, size / 2, size / 2]);
    } else {
      return shape.translate([size[0] / 2, size[1] / 2, size[2] / 2]);
    }
  }
};

// Cube Interfaces.

// cube()
const cubeDefault = (...rest) => {
  assertEmpty(rest);
  return () => unitCube().translate([0.5, 0.5, 0.5]);
};

// cube(10)
const cubeSide = (size, ...rest) => {
  assertEmpty(rest);
  assertNumber(size);
  return () => unitCube().scale(size).translate([size / 2, size / 2, size / 2]);
};

// cube({ radius, roundRadius, resolution })
const cubeRoundRadiusResolution = ({ radius = 1, roundRadius, resolution = 5 }, ...rest) => {
  assertEmpty(rest);
  assertNumber(roundRadius);
  assertNumber(resolution);
  return () => minkowski(unitCube().scale(radius - roundRadius * 2),
                         Solid.fromPolygons(buildRingSphere({ resolution })).scale(roundRadius));
};

// cube({ center: [0, 0, 0], radius: 1 })
const cubeCenterRadius = ({ center, radius }, ...rest) => {
  assertEmpty(rest);
  assertNumberTriple(center);
  // PROVE: That radius makes sense when used like this.
  assertNumber(radius);
  return () => unitCube().scale(radius).translate(center);
};

// cube({ radius: 1 })
const cubeRadius = ({ radius }, ...rest) => {
  assertEmpty(rest);
  // PROVE: That radius makes sense when used like this.
  assertNumber(radius);
  return () => unitCube().scale(radius).translate([radius / 2, radius / 2, radius / 2]);
};

// cube({ corner1: [4, 4, 4], corner2: [5, 4, 2] });
const cubeCorner = ({ corner1, corner2 }, ...rest) => {
  assertEmpty(rest);
  assertNumberTriple(corner1);
  assertNumberTriple(corner2);
  const [c1x, c1y, c1z] = corner1;
  const [c2x, c2y, c2z] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const height = c2z - c1z;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2, (c1z + c2z) / 2];
  return () => unitCube().scale([length, width, height]).translate(center);
};

// cube({size: [1,2,3], center: false });
const cubeSizesCenter = ({ size, center = false }, ...rest) => {
  assertEmpty(rest);
  const [length, width, height] = size;
  assertNumber(length);
  assertNumber(width);
  assertNumber(height);
  return () => centerMaybe({ size, center }, unitCube().scale([length, width, height]));
};

// cube({ size: 1, center: false });
const cubeSizeCenter = ({ size, center = false }, ...rest) => {
  assertEmpty(rest);
  assertNumber(size);
  return () => centerMaybe({ size, center }, unitCube().scale(size));
};

// Cube Operation

export const cube = chain('cube',
                          cubeDefault,
                          cubeSide,
                          cubeRoundRadiusResolution,
                          cubeCenterRadius,
                          cubeRadius,
                          cubeCorner,
                          cubeSizesCenter,
                          cubeSizeCenter);

// Install support for Solid.cube and Solid.roundedCube.
Solid.cube = cube;
