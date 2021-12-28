import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromEmpty = ({ tags, isPlanar } = {}) =>
  taggedGraph({ tags }, { isEmpty: true, isPlanar });
