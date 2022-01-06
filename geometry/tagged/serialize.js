import { prepareForSerialization as graph } from '../graph/prepareForSerialization.js';
import { op } from './op.js';

export const serialize = op({ graph });
