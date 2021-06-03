import { fromEmpty } from '../graph/fromEmpty.js';
import { taggedGraph } from './taggedGraph.js';

export const empty = ({ tags }) => taggedGraph({ tags }, fromEmpty());
