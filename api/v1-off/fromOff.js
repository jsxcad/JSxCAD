import { fromOffSync, fromOff as fromOffToGeometry } from '@jsxcad/convert-off';

import Shape from '@jsxcad/api-v1-shape';

export const fromOff = async (data, { invert = false } = {}) =>
  Shape.fromGeometry(await fromOffToGeometry(data, { invert }));

Shape.fromOff = (data, { invert = false } = {}) =>
  Shape.fromGeometry(
    fromOffSync(new TextEncoder('utf8').encode(data), { invert })
  );

export default fromOff;
