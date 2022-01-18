import { flip as flipPaths } from '../paths/flip.js';
import { flip as flipPoints } from '../points/flip.js';
import { reverseFaceOrientations as graph } from '../graph/reverseFaceOrientations.js';

import { op } from './op.js';

const points = (geometry) => ({
  ...geometry,
  points: flipPoints(geometry.points),
});
const paths = (geometry) => ({
  ...geometry,
  paths: flipPaths(geometry.points),
});
const segments = (geometry) => ({
  ...geometry,
  segments: geometry.segments.map(([source, target]) => [target, source]),
});

export const flip = op({ graph, points, paths, segments });
