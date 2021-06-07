import { getCgal } from './getCgal.js';
import { identityMatrix } from '@jsxcad/math-mat4';

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
};

export const toCgalTransformFromJsTransform = (
  jsTransform = identityMatrix
) => {
  try {
    let cgalTransform = jsTransform[transformSymbol];
    if (cgalTransform === undefined) {
      if (jsTransform.length > 16) {
        cgalTransform = fromExactToCgalTransform(...jsTransform.slice(16));
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
        cgalTransform = fromApproximateToCgalTransform(
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
          hw
        );
      }
      jsTransform[transformSymbol] = cgalTransform;
    }
    return cgalTransform;
  } catch (e) {
    console.log('oops');
    throw e;
  }
};

export const composeTransforms = (a, b) => {
  return toJsTransformFromCgalTransform(
    getCgal().Transformation__compose(
      toCgalTransformFromJsTransform(a),
      toCgalTransformFromJsTransform(b)
    )
  );
};

export const fromExactToCgalTransform = (...exact) =>
  getCgal().Transformation__from_exact(() => exact.shift());

export const fromApproximateToCgalTransform = (...approximate) =>
  getCgal().Transformation__from_approximate(() => approximate.shift());

export const fromIdentityToCgalTransform = () =>
  toJsTransformFromCgalTransform(getCgal().Transformation__identity());

export const fromRotateXToTransform = (angle) => {
  const t = toJsTransformFromCgalTransform(
    getCgal().Transformation__rotate_x(angle)
  );
  return t;
};

export const fromRotateYToTransform = (angle) =>
  toJsTransformFromCgalTransform(getCgal().Transformation__rotate_y(angle));

export const fromRotateZToTransform = (angle) =>
  toJsTransformFromCgalTransform(getCgal().Transformation__rotate_z(angle));

export const fromTranslateToTransform = (x = 0, y = 0, z = 0) =>
  toJsTransformFromCgalTransform(getCgal().Transformation__translate(x, y, z));

export const fromScaleToTransform = (x = 0, y = 0, z = 0) =>
  toJsTransformFromCgalTransform(getCgal().Transformation__scale(x, y, z));
