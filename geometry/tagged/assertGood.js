import { assertGood as assertGoodSolid } from '@jsxcad/geometry-solid';
import { eachItem } from './eachItem';

export const assertGood = (geometry) => {
  eachItem(geometry, (item) => {
    if (item.solid) {
      assertGoodSolid(item.solid);
    }
  });
  return geometry;
};
