import { prepareForSerialization } from './prepareForSerialization.js';

export const serialized = (geometry) =>
  prepareForSerialization(geometry).serializedSurfaceMesh;
