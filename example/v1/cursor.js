import { Cursor, writePdf } from '@jsxcad/api-v1';

export const main = async () => {
  const cursor = new Cursor();
  const shape = cursor.translate([1])
      .rotateZ(15)
      .translate([0.9])
      .rotateZ(-15)
      .translate([0.8])
      .rotateZ(15)
      .translate([0.7])
      .rotateZ(-15)
      .translate([0.6])
      .rotateZ(15)
      .translate([0.5])
      .toShape();
  await writePdf({ path: 'tmp/cursor.pdf' }, shape);
};
