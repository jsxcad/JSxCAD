import { BRANCH, dividePolygons, inLeaf, outLeaf } from './bsp';
import { toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

export const deform = (solid, transform, heights) => {
  let bsp = inLeaf;

  // FIX: Build a balanced bsp.
  for (const height of heights) {
    // Build a classifier from heights.
    bsp = {
      back: bsp,
      front: outLeaf,
      kind: BRANCH,
      plane: [0, 0, 1, height],
      same: []
    };
  }

  const solidPolygons = toPolygonsFromSolid({}, solid);

  // Classify the solid with it.
  const dividedPolygons = dividePolygons(bsp, solidPolygons);

  // Now the solid should have vertexes at the given heights, and we can apply the transform.
  const transformedPolygons = dividedPolygons.map(path => path.map(transform));

  return toSolidFromPolygons({}, transformedPolygons);
};
