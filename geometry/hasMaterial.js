import { rewriteTags } from './tagged/rewriteTags.js';
import { toTagsFromName } from '@jsxcad/algorithm-material';

export const hasMaterial = (geometry, name) =>
  rewriteTags(toTagsFromName(name), [], geometry);
