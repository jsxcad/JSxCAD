import { eachNonVoidItem } from './eachNonVoidItem.js';

export const getNonVoidSegments = (geometry) => {
  const segmentsets = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.type === 'segments') {
      segmentsets.push(item);
    }
  });
  return segmentsets;
};
