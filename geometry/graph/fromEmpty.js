import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromEmpty = ({ tags } = {}) =>
  taggedGraph({ tags }, { isEmpty: true });
