import {
  findOpenEdges as findOpenEdgesOfSolid,
  isWatertight as isWatertightSolid,
  makeWatertight as makeWatertightSolid,
  reconcile as reconcileSolid
} from '@jsxcad/geometry-solid';

import {
  rewrite,
  visit
} from './visit';

import { close } from '@jsxcad/geometry-path';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';

export const reconcile = (geometry, normalize = createNormalize3()) =>
  rewrite(geometry,
          (geometry, descend) => {
            if (geometry.solid) {
              return {
                solid: reconcileSolid(geometry.solid, normalize),
                tags: geometry.tags
              };
            } else {
              return descend();
            }
          });

export const makeWatertight = (geometry, normalize = createNormalize3(), onFixed) =>
  rewrite(geometry,
          (geometry, descend) => {
            if (geometry.solid) {
              return {
                solid: makeWatertightSolid(geometry.solid, normalize, onFixed),
                tags: geometry.tags
              };
            } else {
              return descend();
            }
          });

export const isWatertight = (geometry) => {
  let watertight = true;
  visit(geometry,
        (geometry, descend) => {
          if (geometry.solid && !isWatertightSolid(geometry.solid)) {
            watertight = false;
          }
          return descend();
        });
  return watertight;
};

export const findOpenEdges = (geometry) => {
  const openEdges = [];
  visit(geometry,
        (geometry, descend) => {
          if (geometry.solid) {
            openEdges.push(...findOpenEdgesOfSolid(geometry.solid).map(close));
          }
          return descend();
        });
  return { paths: openEdges };
};
