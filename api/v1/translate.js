import { assertEmpty, assertNumber, assertShape } from './assert';

import { Shape } from './Shape';
import { dispatch } from './dispatch';
import { fromTranslation } from '@jsxcad/math-mat4';

/**
 *
 * # Translate
 *
 * Translation moves a shape.
 *
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above())
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above()
 *                  .translate(0, 0, 1))
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above()
 *                  .translate(0, 1, 0))
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 0, 10] } }
 * ```
 * assemble(Circle(),
 *          Sphere().above()
 *                  .translate([-1, -1, 1]))
 * ```
 * :::
 *
 **/

const fromValue = ([x = 0, y = 0, z = 0], shape) => shape.transform(fromTranslation([x, y, z]));
const fromValues = (x = 0, y = 0, z = 0, shape) => shape.transform(fromTranslation([x, y, z]));

export const translate = dispatch(
  'translate',
  (x, shape, ...rest) => {
    assertNumber(x);
    assertShape(shape);
    assertEmpty(rest);
    return () => fromValues(x, 0, 0, shape);
  },
  (x, y, shape, ...rest) => {
    assertNumber(x);
    assertNumber(y);
    assertShape(shape);
    assertEmpty(rest);
    return () => fromValues(x, y, 0, shape);
  },
  (x, y, z, shape, ...rest) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    assertShape(shape);
    assertEmpty(rest);
    return () => fromValues(x, y, z, shape);
  },
  ([x = 0, y = 0, z = 0], shape, ...rest) => {
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    assertShape(shape);
    assertEmpty(rest);
    return () => fromValue([x, y, z], shape);
  });

translate.fromValue = fromValue;
translate.fromValues = fromValues;

const method = function (...params) { return translate(...params, this); };
Shape.prototype.translate = method;
