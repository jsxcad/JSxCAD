import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromEmpty = () => taggedGraph({}, { isEmpty: true });
