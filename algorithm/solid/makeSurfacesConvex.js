import { makeConvex } from '@jsxcad/algorithm-surface';

export const makeSurfacesConvex = (options = {}, solid) => solid.map(surface => makeConvex(options, surface));
