import { hasTypeWire } from './type.js';
import { op } from './op.js';
import { outline as outlineGraph } from '../graph/outline.js';
import { taggedSegments } from './taggedSegments.js';

const graph = (geometry) =>
  hasTypeWire(outlineGraph({ tags: geometry.tags }, geometry));

const segments = (geometry) => hasTypeWire(geometry);

const polygonsWithHoles = (geometry) => {
  const segments = [];
  for (const polygon of geometry.polygonsWithHoles) {
    let last = polygon.points[polygon.points.length - 1];
    for (const point of polygon.points) {
      segments.push([last, point]);
      last = point;
    }
  }
  return hasTypeWire(taggedSegments({ tags: geometry.tags }, segments));
};

export const outline = op({ graph, polygonsWithHoles, segments });
