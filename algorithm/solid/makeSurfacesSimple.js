import { makeSimple } from '@jsxcad/algorithm-surface';

export const makeSurfacesSimple = (options = {}, solid) => solid.map(surface => makeSimple({}, surface));
