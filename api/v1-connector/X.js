import { Shape } from '@jsxcad/api-v1-shape';
import { toConnector } from './faceConnector.js';

// Ideally this would be a plane of infinite extent.
// Unfortunately this makes things like interpolation tricky,
// so we approximate it with a very large polygon instead.

export const X = (x = 0) => {
  const size = 1e5;
  const min = -size;
  const max = size;
  const sheet = Shape.fromPathToSurface([
    [x, max, min],
    [x, max, max],
    [x, min, max],
    [x, min, min],
  ]);
  return toConnector(sheet, sheet.toGeometry().surface, 'top');
};

export default X;
