import { fromObjSync, fromObj as fromObjToGeometry } from '@jsxcad/convert-obj';

import { Shape } from '@jsxcad/api-shape';

export const fromObj = async (data, { invert = false } = {}) =>
  Shape.fromGeometry(await fromObjToGeometry(data, { invert }));

Shape.fromObj = (data, { invert = false } = {}) =>
  Shape.fromGeometry(
    fromObjSync(new TextEncoder('utf8').encode(data), { invert })
  );

export default fromObj;
