import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { makeWatertight as makeWatertightSolid } from '@jsxcad/geometry-solid';
import { rewrite } from './visit';

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
