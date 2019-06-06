import { triangle, difference, writeStl } from '@jsxcad/api-v1';

export const main = async () => {
  const outside = triangle({ diameter: 64 });
  const inside = triangle({ diameter: 60 });
  const perimeter = difference(outside, inside);

  await writeStl({ path: 'tmp/mold_inside.stl' }, inside.extrude({ height: 1 }));
  await writeStl({ path: 'tmp/mold_perimeter.stl' }, perimeter.extrude({ height: 6 }));
};
