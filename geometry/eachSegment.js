import { Segment, Segments } from './Segment.js';
import { linearize } from './tagged/linearize.js';
import { outline } from './outline.js';
import { transformCoordinate } from './transform.js';

const filter = ({ type }) => type === 'segments';

export const eachSegment = (geometry, emit, selections = []) => {
  if (!(selections instanceof Array)) {
    selections = [selections];
  }
  for (const { matrix, segments, normals, faces } of linearize(
    outline(geometry, selections),
    filter
  )) {
    for (let nth = 0; nth < segments.length; nth++) {
      const [source, target] = segments[nth];
      const normal = normals
        ? transformCoordinate(normals[nth], matrix)
        : undefined;
      const face = faces ? faces[nth] : undefined;
      emit(
        [
          transformCoordinate(source, matrix),
          transformCoordinate(target, matrix),
        ],
        normal,
        face
      );
    }
  }
};

export const toSegments = (geometry, selections) => {
  const segments = [];
  eachSegment(geometry, (segment) => segments.push(segment), selections);
  return Segments(segments);
};

export const toSegmentList = (geometry, selections) => {
  const segments = [];
  eachSegment(
    geometry,
    (segment) => segments.push(Segment(segment)),
    selections
  );
  return segments;
};
