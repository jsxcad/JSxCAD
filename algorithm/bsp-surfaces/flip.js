import { flip as flipPolygon } from '@jsxcad/math-poly3';

export const flip = (bsp) => {
  if (bsp === null) {
    return null;
  }

  const flipped = {
    back: flip(bsp.front),
    front: flip(bsp.back),
    same: bsp.same === null ? null : bsp.same.map(flipPolygon)
  };

  return flipped;
};
