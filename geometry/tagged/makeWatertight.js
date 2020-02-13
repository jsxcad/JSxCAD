import {
  isWatertight as isWatertightSolid,
  makeWatertight as makeWatertightSolid
} from '@jsxcad/geometry-solid';

import {
  rewrite,
  visit
} from './visit';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';

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

export const isWatertight = (geometry, normalize = createNormalize3()) => {
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
