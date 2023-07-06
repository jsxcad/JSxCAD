import { rewriteTags } from './tagged/rewriteTags.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';

export const hasColor = (geometry, name) =>
  rewriteTags(toTagsFromName(name), [], geometry);
