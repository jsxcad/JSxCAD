import { convertPolygonsToMeshes } from '../convertPolygonsToMeshes.js';
import { toApproximateGeometry } from './toApproximateGeometry.js';

export const soup = (geometry) =>
  toApproximateGeometry(convertPolygonsToMeshes(geometry));
