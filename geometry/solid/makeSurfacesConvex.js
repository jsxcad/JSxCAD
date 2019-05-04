import { makeConvex } from '@jsxcad/geometry-surface';

export const makeSurfacesConvex = (options = {}, solid) => solid.map(surface => makeConvex(options, surface));
