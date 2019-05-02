import { makeSimple } from '@jsxcad/geometry-surface';

export const makeSurfacesSimple = (options = {}, solid) => solid.map(surface => makeSimple({}, surface));
