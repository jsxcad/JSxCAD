import { linearize } from './tagged/linearize.js';
import { outline } from './outline.js';
import { transformCoordinate } from './transform.js';

const filter = ({ type }) => type === 'segments';

export const eachSegment = (geometry, emit) => {
  for (const { matrix, segments } of linearize(outline(geometry), filter)) {
    for (const [source, target] of segments) {
      emit([
        transformCoordinate(source, matrix),
        transformCoordinate(target, matrix),
      ]);
    }
  }
};
