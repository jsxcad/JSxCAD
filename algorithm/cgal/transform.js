import { getCgal } from './getCgal.js';

export const TRANSFORM_COMPOSE = 0;
export const TRANSFORM_EXACT = 1;
export const TRANSFORM_APPROXIMATE = 2;
export const TRANSFORM_INVERT = 3;
export const TRANSFORM_ROTATE_X = 4;
export const TRANSFORM_ROTATE_Y = 5;
export const TRANSFORM_ROTATE_Z = 6;
export const TRANSFORM_TRANSLATE = 7;
export const TRANSFORM_SCALE = 8;
export const TRANSFORM_IDENTITY = 9;

export const identityMatrix = [TRANSFORM_IDENTITY];

export const makeApproximateMatrix = (approximate) => [
  TRANSFORM_APPROXIMATE,
  approximate,
];
export const makeExactMatrix = (exact) => [TRANSFORM_EXACT, exact];

export const composeTransforms = (a = identityMatrix, b = identityMatrix) => {
  if (!Number.isInteger(a[0]) || !Number.isInteger(b[0])) {
    throw Error(`composeTransforms: a=${JSON.stringify(a)} b=${JSON.stringify(b)}`);
  }
  return [
    TRANSFORM_COMPOSE,
    a,
    b,
  ];
};

export const invertTransform = (a = identityMatrix) => [TRANSFORM_INVERT, a];

export const fromRotateXToTransform = (turn) => [TRANSFORM_ROTATE_X, turn];

export const fromRotateYToTransform = (turn) => [TRANSFORM_ROTATE_Y, turn];

export const fromRotateZToTransform = (turn) => [TRANSFORM_ROTATE_Z, turn];

export const fromTranslateToTransform = (x = 0, y = 0, z = 0) => {
  if (typeof x !== 'number') throw Error('die/x');
  if (typeof y !== 'number') throw Error('die/y');
  if (typeof z !== 'number') throw Error('die/z');
  return [TRANSFORM_TRANSLATE, [x, y, z]];
};

export const fromScaleToTransform = (x = 1, y = 1, z = 1) => [
  TRANSFORM_SCALE,
  [x, y, z],
];

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

export const toApproximateMatrix = (matrix = identityMatrix) => {
  if (matrix[0] === TRANSFORM_APPROXIMATE) {
    return matrix;
  }
  try {
    const transform = [];
    getCgal().ToApproximateMatrix(matrix, transform);
    return transform;
  } catch (error) {
    console.log(`QQ/toApproximateMatrix: matrix=${JSON.stringify(matrix)}`);
    throw error;
  }
};

// FIX: Why do we need to copy this?
// export const identity = () => [...identityMatrix];

export const identity = () => [TRANSFORM_IDENTITY];

export const matrix6 = (a, b, c, d, tx, ty) =>
  makeApproximateMatrix([a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1]);
