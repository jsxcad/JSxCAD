import { taggedSegments } from './tagged/taggedSegments.js';

export const Segment = (segment) => taggedSegments({}, [segment]);

export const Segments = (segments) => taggedSegments({}, segments);
