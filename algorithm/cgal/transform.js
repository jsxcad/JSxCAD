import { getCgal } from './getCgal.js';

export const identityMatrix = [
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  '1 0 0 0 0 1 0 0 0 0 1 0 1',
];

export const composeTransforms = (a = identityMatrix, b = identityMatrix) => {
  try {
    const transform = [];
    getCgal().ComposeTransforms(a, b, transform);
    return transform;
  } catch (error) {
    throw Error(error);
  }
};

export const invertTransform = (a = identityMatrix) => {
  try {
    const inverted = [];
    getCgal().InvertTransform(a, inverted);
    return inverted;
  } catch (error) {
    throw Error(error);
  }
};

export const fromRotateXToTransform = (turn) => {
  try {
    const transform = [];
    getCgal().XTurnTransform(Number(turn), transform);
    return transform;
  } catch (error) {
    throw Error(error);
  }
};

export const fromRotateYToTransform = (turn) => {
  try {
    const transform = [];
    getCgal().YTurnTransform(Number(turn), transform);
    return transform;
  } catch (error) {
    throw Error(error);
  }
};

export const fromRotateZToTransform = (turn) => {
  try {
    const transform = [];
    getCgal().ZTurnTransform(Number(turn), transform);
    return transform;
  } catch (error) {
    throw Error(error);
  }
};

export const fromTranslateToTransform = (x = 0, y = 0, z = 0) => {
  try {
    if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
      throw Error(`Non-finite ${[x, y, z]}`);
    }
    const transform = [];
    getCgal().TranslateTransform(Number(x), Number(y), Number(z), transform);
    return transform;
  } catch (error) {
    throw Error(error);
  }
};

export const fromScaleToTransform = (x = 1, y = 1, z = 1) => {
  try {
    const transform = [];
    getCgal().ScaleTransform(x, y, z, transform);
    return transform;
  } catch (error) {
    throw Error(error);
  }
};

export const fromSegmentToInverseTransform = (
  [[startX = 0, startY = 0, startZ = 0], [endX = 0, endY = 0, endZ = 0]],
  [normalX = 0, normalY = 0, normalZ = 1]
) => {
  try {
    const jsTransform = [];
    getCgal().InverseSegmentTransform(
      startX,
      startY,
      startZ,
      endX,
      endY,
      endZ,
      normalX,
      normalY,
      normalZ,
      jsTransform
    );
    return jsTransform;
  } catch (error) {
    throw Error(error);
  }
};

// FIX: Why do we need to copy this?
export const identity = () => [...identityMatrix];

export const matrix6 = (a, b, c, d, tx, ty) => [
  a,
  b,
  0,
  0,
  c,
  d,
  0,
  0,
  0,
  0,
  1,
  0,
  tx,
  ty,
  0,
  1,
];

/*
export const rotateXToY0 = ([x, y, z]) =>
  toJsTransformFromCgalTransform(
    getCgal().Transformation__rotate_x_to_y0(x, y, z)
  );

export const rotateYToX0 = ([x, y, z]) =>
  toJsTransformFromCgalTransform(
    getCgal().Transformation__rotate_y_to_x0(x, y, z)
  );

export const rotateZToY0 = ([x, y, z]) =>
  toJsTransformFromCgalTransform(
    getCgal().Transformation__rotate_z_to_y0(x, y, z)
  );
*/
