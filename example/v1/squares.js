import { square, union, writePdf } from '@jsxcad/api-v1';

export const main = async () => {
  const shape = union(square(30), square(30).translate([15, 15])).outline();
  await writePdf({ path: 'tmp/squares.pdf' }, shape);
};
