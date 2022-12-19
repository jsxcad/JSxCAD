import { rewriteTags } from './tagged/rewriteTags.js';

export const hasTags = (geometry, tags) => rewriteTags(tags, [], geometry);
