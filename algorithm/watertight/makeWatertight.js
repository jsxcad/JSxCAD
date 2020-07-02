import { fixTJunctions } from './fixTJunctions.js';

export const makeWatertight = (polygons) => fixTJunctions(polygons);
