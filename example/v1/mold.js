import { circle, difference, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  const outside = circle({ radius: 64 / 2, resolution: 3 });
  const inside = circle({ radius: 60 / 2, resolution: 3 });
  const perimeter = difference(outside, inside);

  await writeStl({ path: 'tmp/mold_inside.stl' }, inside.extrude({ height: 1 }));
  await writeStl({ path: 'tmp/mold_perimeter.stl' }, perimeter.extrude({ height: 6 }));
};
