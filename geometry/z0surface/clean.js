import { fromSurface, toSurface } from './convert';

export const clean = (surface) => toSurface(fromSurface(surface));
