import { taggedPoints } from './tagged/taggedPoints.js';

export const Point = (x = 0, y = 0, z = 0, coordinate) =>
  taggedPoints({}, [coordinate || [x, y, z]]);

export const Points = (coordinates) => taggedPoints({}, coordinates);
