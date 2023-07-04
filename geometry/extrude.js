import { isNotTypeGhost, isTypeVoid } from './tagged/type.js';

import { Group } from './Group.js';
import { Point } from './Point.js';
import { computeNormalCoordinate } from './computeNormal.js';
import { extrude as extrudeWithCgal } from '@jsxcad/algorithm-cgal';
import { getLeafs } from './tagged/getLeafs.js';
import { linearize } from './tagged/linearize.js';
import { makeAbsolute } from './makeAbsolute.js';
import { moveAlong } from './moveAlong.js';
import { replacer } from './tagged/visit.js';

const filter = (noVoid) => (geometry) =>
  ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
  (isNotTypeGhost(geometry) || (!noVoid && isTypeVoid));

export const extrude = (geometry, top, bottom, { noVoid } = {}) => {
  const inputs = linearize(geometry, filter(noVoid));
  const count = inputs.length;
  inputs.push(top, bottom);
  const outputs = extrudeWithCgal(inputs, count, noVoid);
  const result = replacer(inputs, outputs)(geometry);
  return result;
};

// This interface is a bit awkward.
export const extrudeAlong = (geometry, vector, intervals, { noVoid } = {}) => {
  const extrusions = [];
  for (const [depth, height] of intervals) {
    if (height === depth) {
      // Return unextruded geometry at this height, instead.
      extrusions.push(moveAlong(geometry, vector, [height]));
      continue;
    }
    extrusions.push(
      extrude(
        geometry,
        moveAlong(Point(0, 0, 0), vector, [height]),
        moveAlong(Point(0, 0, 0), vector, [depth]),
        { noVoid }
      )
    );
  }
  return Group(extrusions);
};

export const extrudeAlongNormal = (geometry, intervals, options) => {
  const inputs = [];
  const outputs = [];
  for (const leaf of getLeafs(geometry)) {
    inputs.push(leaf);
    const normal = makeAbsolute(computeNormalCoordinate(leaf));
    outputs.push(extrudeAlong(leaf, normal, intervals, options));
  }
  return replacer(inputs, outputs)(geometry);
};

export const extrudeAlongX = (geometry, intervals, options) =>
  extrudeAlong(geometry, [1, 0, 0], intervals, options);

export const extrudeAlongY = (geometry, intervals, options) =>
  extrudeAlong(geometry, [0, 1, 0], intervals, options);

export const extrudeAlongZ = (geometry, intervals, options) =>
  extrudeAlong(geometry, [0, 0, 1], intervals, options);
