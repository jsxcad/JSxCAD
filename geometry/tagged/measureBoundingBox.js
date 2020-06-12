import { max, min } from "@jsxcad/math-vec3";

import { eachPoint } from "./eachPoint";
import { isVoid } from "./isNotVoid";
import { measureBoundingBox as measureBoundingBoxOfSolid } from "@jsxcad/geometry-solid";
import { measureBoundingBox as measureBoundingBoxOfSurface } from "@jsxcad/geometry-surface";
import { measureBoundingBox as measureBoundingBoxOfZ0Surface } from "@jsxcad/geometry-z0surface";
import { toKeptGeometry } from "./toKeptGeometry";

const measureBoundingBoxGeneric = (geometry) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  eachPoint((point) => {
    minPoint = min(minPoint, point);
    maxPoint = max(maxPoint, point);
  }, geometry);
  return [minPoint, maxPoint];
};

export const measureBoundingBox = (rawGeometry) => {
  const geometry = toKeptGeometry(rawGeometry);

  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];

  const update = ([itemMinPoint, itemMaxPoint]) => {
    minPoint = min(minPoint, itemMinPoint);
    maxPoint = max(maxPoint, itemMaxPoint);
  };

  const walk = (item) => {
    if (isVoid(item)) {
      return;
    }
    if (item.assembly) {
      item.assembly.forEach(walk);
    } else if (item.layers) {
      item.layers.forEach(walk);
    } else if (item.connection) {
      item.geometries.map(walk);
    } else if (item.disjointAssembly) {
      item.disjointAssembly.forEach(walk);
    } else if (item.item) {
      walk(item.item);
    } else if (item.solid) {
      update(measureBoundingBoxOfSolid(item.solid));
    } else if (item.surface) {
      update(measureBoundingBoxOfSurface(item.surface));
    } else if (item.z0Surface) {
      update(measureBoundingBoxOfZ0Surface(item.z0Surface));
    } else if (item.plan) {
      if (item.plan.page) {
        update(item.marks);
      }
      walk(item.content);
    } else {
      update(measureBoundingBoxGeneric(item));
    }
  };

  walk(geometry);

  return [minPoint, maxPoint];
};
