import Ref from './Ref.js';

export const X = (x = 0) => Ref().x(x);
export const Y = (y = 0) => Ref().y(y);
export const Z = (z = 0) => Ref().z(z);
export const XY = (z = 0) => Ref().z(z);
export const XZ = (y = 0) =>
  Ref()
    .rx(-1 / 4)
    .y(y);
export const YZ = (x = 0) =>
  Ref()
    .ry(-1 / 4)
    .x(x);
export const RX = (t = 0) => Ref().rx(t);
export const RY = (t = 0) => Ref().ry(t);
export const RZ = (t = 0) => Ref().rz(t);
