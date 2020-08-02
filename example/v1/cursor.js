import '@jsxcad/api-v1-pdf';

import { Cursor } from '@jsxcad/api-v1-cursor';

Cursor.fromOrigin()
  .move(1)
  .rotateZ(90)
  .move(1)
  .rotateZ(90)
  .move(1)
  .rotateZ(90)
  .move(1)
  .rotateZ(90)
  .toShape()
  .Page()
  .view()
  .writePdf('cursor');
