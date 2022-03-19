import { getCgal } from './getCgal.js';
import { identityMatrix } from '@jsxcad/math-mat4';

export const blessed = (matrix) => {
  matrix.blessed = true;
  return matrix;
};

const M00 = 0;
const M01 = 1;
const M02 = 2;
const M03 = 3;
const M10 = 4;
const M11 = 5;
const M12 = 6;
const M13 = 7;
const M20 = 8;
const M21 = 9;
const M22 = 10;
const M23 = 11;
const HW = 12;

const transformSymbol = Symbol('transform');

export const toJsTransformFromCgalTransform = (cgalTransform) => {
  try {
    const a = [];
    getCgal().Transformation__to_approximate(cgalTransform, (value) =>
      a.push(value)
    );
    const jsTransform = [
      a[M00],
      a[M10],
      a[M20],
      0,
      a[M01],
      a[M11],
      a[M21],
      0,
      a[M02],
      a[M12],
      a[M22],
      0,
      a[M03],
      a[M13],
      a[M23],
      a[HW],
    ];
    getCgal().Transformation__to_exact(cgalTransform, (value) =>
      jsTransform.push(value)
    );
    jsTransform[transformSymbol] = cgalTransform;
    return jsTransform;
  } catch (error) {
    throw Error(error);
  }
};

export const toCgalTransformFromJsTransform = (
  jsTransform = identityMatrix
) => {
  try {
    let cgalTransform = jsTransform[transformSymbol];
    if (cgalTransform === undefined) {
      if (jsTransform.length > 16) {
        cgalTransform = fromExactToCgalTransform(jsTransform.slice(16));
      } else {
        const [
          m00,
          m10,
          m20,
          ,
          m01,
          m11,
          m21,
          ,
          m02,
          m12,
          m22,
          ,
          m03,
          m13,
          m23,
          hw,
        ] = jsTransform;
        if (!jsTransform.blessed) {
          throw Error(
            `Received unblessed non-identity approximate matrix: ${JSON.stringify(
              jsTransform
            )}`
          );
        }
        cgalTransform = fromApproximateToCgalTransform([
          m00,
          m01,
          m02,
          m03,
          m10,
          m11,
          m12,
          m13,
          m20,
          m21,
          m22,
          m23,
          hw,
        ]);
      }
      jsTransform[transformSymbol] = cgalTransform;
    }
    return cgalTransform;
  } catch (e) {
    console.log(
      `Malformed transform: ${JSON.stringify(jsTransform)}: ${e.stack}`
    );
    throw e;
  }
};

export const composeTransforms = (a, b) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().Transformation__compose(
        toCgalTransformFromJsTransform(a),
        toCgalTransformFromJsTransform(b)
      )
    );
  } catch (error) {
    throw Error(error);
  }
};

export const invertTransform = (a) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().Transformation__inverse(toCgalTransformFromJsTransform(a))
    );
  } catch (error) {
    throw Error(error);
  }
};

export const fromExactToCgalTransform = (exact) => {
  try {
    return getCgal().Transformation__from_exact(...exact);
  } catch (error) {
    throw Error(error);
  }
};

export const fromApproximateToCgalTransform = (approximate) => {
  try {
    return getCgal().Transformation__from_approximate(...approximate);
  } catch (error) {
    throw Error(error);
  }
};

export const fromIdentityToCgalTransform = () => {
  try {
    return toJsTransformFromCgalTransform(getCgal().Transformation__identity());
  } catch (error) {
    throw Error(error);
  }
};

export const fromRotateXToTransform = (turn) => {
  try {
    const t = toJsTransformFromCgalTransform(
      getCgal().Transformation__rotate_x(turn)
    );
    return t;
  } catch (error) {
    throw Error(error);
  }
};

export const fromRotateYToTransform = (turn) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().Transformation__rotate_y(turn)
    );
  } catch (error) {
    throw Error(error);
  }
};

export const fromRotateZToTransform = (turn) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().Transformation__rotate_z(turn)
    );
  } catch (error) {
    throw Error(error);
  }
};

export const fromTranslateToTransform = (x = 0, y = 0, z = 0) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().Transformation__translate(x, y, z)
    );
  } catch (error) {
    console.log(`QQ/fromTranslateToTransform: ${x} ${y} ${z}`);
    throw Error(error);
  }
};

export const fromScaleToTransform = (x = 0, y = 0, z = 0) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().Transformation__scale(x, y, z)
    );
  } catch (error) {
    throw Error(error);
  }
};

export const fromSegmentToInverseTransform = (
  [[startX = 0, startY = 0, startZ = 0], [endX = 0, endY = 0, endZ = 0]],
  [
    [originX = 0, originY = 0, originZ = 0],
    [normalX = 0, normalY = 0, normalZ = 1],
  ]
) => {
  try {
    return toJsTransformFromCgalTransform(
      getCgal().InverseSegmentTransform(
        startX,
        startY,
        startZ,
        endX,
        endY,
        endZ,
        normalX - originX,
        normalY - originY,
        normalZ - originZ
      )
    );
  } catch (error) {
    throw Error(error);
  }
};

export const identity = () => blessed(identityMatrix);

export const matrix6 = (a, b, c, d, tx, ty) =>
  blessed([a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1]);
