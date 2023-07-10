import { rotateX, rotateY, rotateZ } from './rotate.js';

import { Point } from './Point.js';
import { hasTypeReference } from './tagged/type.js';
import { translate } from './translate.js';

export const ref = (geometry) => hasTypeReference(geometry);

export const Ref = () => ref(Point([0, 0, 0]));

export const X = (x = 0) => translate(Ref(), [x, 0, 0]);
export const Y = (y = 0) => translate(Ref(), [0, y, 0]);
export const Z = (z = 0) => translate(Ref(), [0, 0, z]);
export const XY = (z = 0) => translate(Ref(), [0, 0, z]);
export const YX = (z = 0) => rotateX(translate(Ref(), [0, 0, z]), 1 / 2);
export const XZ = (y = 0) => rotateX(translate(Ref(), [0, y, 0]), -1 / 4);
export const ZX = (y = 0) => rotateX(translate(Ref(), [0, y, 0]), 1 / 4);
export const YZ = (x = 0) => rotateY(translate(Ref(), [x, 0, 0]), -1 / 4);
export const ZY = (x = 0) => rotateY(translate(Ref(), [x, 0, 0]), 1 / 40);
export const RX = (t = 0) => rotateX(Ref(), t);
export const RY = (t = 0) => rotateY(Ref(), t);
export const RZ = (t = 0) => rotateZ(Ref(), t);
