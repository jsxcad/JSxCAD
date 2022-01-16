import { prepareForSerialization as graph } from '../graph/prepareForSerialization.js';
import { op } from './op.js';
import { visit } from './visit.js';

export const prepareForSerialization = op({ graph }, visit);
