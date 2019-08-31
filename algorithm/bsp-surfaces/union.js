import { doesNotOverlap, toPolygons as toPolygonsFromSolid, fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';
import { inLeaf, outLeaf, fromSolid as toBspFromSolid } from './bsp';

import { splitPolygon } from './splitPolygon';

export const removeInteriorPolygons = (bsp, polygons) => {
  if (bsp === inLeaf) {
    return [];
  } else if (bsp === outLeaf) {
    return polygons;
  } else {
    const front = [];
    const back = [];
    for (let i = 0; i < polygons.length; i++) {
      splitPolygon(bsp.plane,
                   polygons[i],
                   /* back= */back,
                   /* coplanarBack= */back,
                   /* coplanarFront= */front,
                   /* front= */front);
    }
    const trimmedFront = removeInteriorPolygons(bsp.front, front);
    const trimmedBack = removeInteriorPolygons(bsp.back, back);

    if (trimmedFront.length === 0) {
      return trimmedBack;
    } else if (trimmedBack.length === 0) {
      return trimmedFront;
    } else {
      return [].concat(trimmedFront, trimmedBack);
    }
  }
};

export const union = (...solids) => {
  if (solids.length === 0) {
    return [];
  }
  const bsps = [];
  const polygonSets = [];
  for (let a = 0; a < solids.length; a++) {
    for (let b = 0; b < solids.length; b++) {
      if (a === b) {
        // No self-interaction.
        continue;
      }
      if (polygonSets[a] === undefined) {
        polygonSets[a] = toPolygonsFromSolid({}, solids[a]);
      }
      if (doesNotOverlap(solids[a], solids[b])) {
        // No overlap.
        continue;
      }
      // Remove polygons interior to other shapes.
      if (bsps[b] === undefined) {
        bsps[b] = toBspFromSolid(solids[b]);
      }
      polygonSets[a] = removeInteriorPolygons(bsps[b], polygonSets[a]);
    }
  }
  return toSolidFromPolygons({}, [].concat(...polygonSets));
};
