import { Box } from './Box.js';
import { Empty } from './Empty.js';
import { add } from './vector.js';
import { measureBoundingBox } from './measureBoundingBox.js';

export const bb = (
  geometry,
  xOffset = 1,
  yOffset = xOffset,
  zOffset = yOffset,
  { flat = false } = {}
) => {
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return Empty();
  } else if (flat) {
    const [min, max] = bounds;
    return Box([], {
      c2: add(min, [-xOffset, -yOffset, 0]),
      c1: add(max, [xOffset, yOffset, 0]),
    });
  } else {
    const [min, max] = bounds;
    return Box([], {
      c2: add(min, [-xOffset, -yOffset, -zOffset]),
      c1: add(max, [xOffset, yOffset, zOffset]),
    });
  }
};
