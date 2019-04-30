import { circle, difference, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  const outside = circle({ r: 64 / 2, fn: 3, center: true });
  const inside = circle({ r: 60 / 2, fn: 3, center: true });
  const perimeter = difference(outside, inside);

  await writeStl({ path: 'tmp/mold_inside.stl' }, inside.extrude({ height: 1 }));
  await writeStl({ path: 'tmp/mold_perimeter.stl' }, perimeter.extrude({ height: 6 }));
};
