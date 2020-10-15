import { segment } from './segment.js';

export const segmented = (paths, length) => {
  const segmentedPaths = [];
  for (let start = 0; ; start += length) {
    const segments = segment(paths, start, start + length);
    if (segments.length === 0) {
      break;
    }
    segmentedPaths.push(...segments);
  }
  return segmentedPaths;
};
