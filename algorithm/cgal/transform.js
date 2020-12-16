import { getCgal } from './getCgal.js';

export const identity = () => getCgal().Transformation__identity();

export const fromExactToTransform = (...exact) =>
  getCgal().Transformation__from_exact(() => exact.shift());

export const fromApproximateToTransform = (...approximate) =>
  getCgal().Transformation__from_approximate(() => approximate.shift());

export const rotateX = (transform, angle) =>
  getCgal().Transformation__rotate_x(transform, angle);

export const rotateY = (transform, angle) =>
  getCgal().Transformation__rotate_y(transform, angle);

export const rotateZ = (transform, angle) =>
  getCgal().Transformation__rotate_z(transform, angle);

export const translate = (transform, x = 0, y = 0, z = 0) =>
  getCgal().Transformation__translate(transform, x, y, z);

export const scale = (transform, x = 0, y = 0, z = 0) =>
  getCgal().Transformation__scale(transform, x, y, z);
