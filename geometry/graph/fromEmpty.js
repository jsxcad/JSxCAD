import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromEmpty = ({ tags, isPlanar } = {}) =>
  taggedGraph({ tags, provenance: 'geometry/graph/fromEmpty' }, { isEmpty: true, isPlanar });
