import { linearize } from './tagged/linearize.js';
import { outline } from './outline.js';

const filter = ({ type }) => type === 'segments';

export const eachSegment = (geometry, emit) => {
  for (const { segments } of linearize(outline(geometry), filter)) {
    for (const segment of segments) {
      emit(segment);
    }
  }
};
