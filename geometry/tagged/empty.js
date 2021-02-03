import { fromEmpty } from '@jsxcad/geometry-graph';
import { taggedGraph } from './taggedGraph.js';

export const empty = ({ tags }) => taggedGraph({ tags }, fromEmpty());
