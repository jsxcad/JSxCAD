import { eachSegment } from './eachSegment.js';
import { taggedSegments } from './taggedSegments.js';

export const toSegments = (geometry) => {
  const segments = [];
  eachSegment(geometry, (segment) => segments.push(segment));
  return taggedSegments({}, segments);
};
