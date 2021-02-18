import { fromOffSync, fromOff as fromOffToGeometry } from '@jsxcad/convert-off';

import Shape from '@jsxcad/api-v1-shape';

export const fromOff = async (data) =>
  Shape.fromGeometry(await fromOffToGeometry(data));

Shape.fromOff = (data) =>
  Shape.fromGeometry(fromOffSync(new TextEncoder('utf8').encode(data)));

export default fromOff;
