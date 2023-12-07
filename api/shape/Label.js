import Shape from './Shape.js';
import { Label as op } from '@jsxcad/geometry';

// Constructs an item, as a part, from the designator.
export const Label = Shape.registerMethod3('Label', ['string', 'number'], op);
