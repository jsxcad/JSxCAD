import { Box } from './Box.js';
import { Empty } from './Empty.js';
import { add } from './vector.js';
import { measureBoundingBox } from './measureBoundingBox.js';

export const bb = (
  geometry,
  xOffset = 1,
  yOffset = xOffset,
  zOffset = yOffset
) => {
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return Empty();
  } else {
    const [min, max] = bounds;
    return Box([], {
      c2: add(min, [-xOffset, -yOffset, -zOffset]),
      c1: add(max, [xOffset, yOffset, zOffset]),
    });
  }
};
