import { eachTriangle } from '../eachTriangle.js';
import { taggedTriangles } from './taggedTriangles.js';

Error.stackTraceLimit = Infinity;

export const toTriangles = ({ tags }, geometry) => {
  geometry.cache = geometry.cache || {};
  if (!geometry.cache.triangles) {
    const { matrix } = geometry;
    const triangles = [];
    eachTriangle(geometry, (triangle) => triangles.push(triangle));
    const trianglesGeometry = taggedTriangles({ tags, matrix }, triangles);
    geometry.cache.triangles = trianglesGeometry;
  }
  return geometry.cache.triangles;
};
