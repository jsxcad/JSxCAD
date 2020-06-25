import { add, random, scale } from '@jsxcad/math-vec3';

import Connector from './Connector';
import { getSolids } from '@jsxcad/geometry-tagged';
import { toPlane } from '@jsxcad/geometry-surface';

// FIX:
// This will produce the average position, but that's probably not what we
// want, since it will include interior points produced by breaking up
// convexity.
const toPosition = (surface) => {
  let sum = [0, 0, 0];
  let count = 0;
  for (const path of surface) {
    for (const point of path) {
      sum = add(sum, point);
      count += 1;
    }
  }
  const position = scale(1 / count, sum);
  return position;
};

export const faceConnector = (shape, id, scoreOrientation, scorePosition) => {
  let bestSurface;
  let bestPosition;
  let bestOrientationScore = -Infinity;
  let bestPositionScore = -Infinity;

  // FIX: This may be sensitive to noise.
  const geometry = shape.toKeptGeometry();
  for (const { solid } of getSolids(geometry)) {
    for (const surface of solid) {
      const orientationScore = scoreOrientation(surface);
      if (orientationScore > bestOrientationScore) {
        bestSurface = surface;
        bestOrientationScore = orientationScore;
        bestPosition = toPosition(surface);
        bestPositionScore = scorePosition(bestPosition);
      } else if (orientationScore === bestOrientationScore) {
        const position = toPosition(surface);
        const positionScore = scorePosition(position);
        if (positionScore > bestPositionScore) {
          bestSurface = surface;
          bestPosition = position;
          bestPositionScore = positionScore;
        }
      }
    }
  }

  // FIX: We should have a consistent rule for deciding the rotational position of the connector.
  const plane = toPlane(bestSurface);
  return shape.toConnector(
    Connector(id, {
      plane,
      center: bestPosition,
      right: add(bestPosition, random(plane)),
    })
  );
};

export const toConnector = (shape, surface, id) => {
  const center = toPosition(surface);
  // FIX: Adding y + 1 is not always correct.
  const plane = toPlane(surface);
  return Connector(id, { plane, center, right: random(plane) });
};

export const withConnector = (shape, surface, id) => {
  return shape.toConnector(toConnector(shape, surface, id));
};

export default faceConnector;
