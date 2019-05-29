import { add, transform } from '@jsxcad/math-vec3';
import { fromZRotation, identity, multiply } from '@jsxcad/math-mat4';

import { Shape } from './Shape';
import { close } from '@jsxcad/geometry-path';

// Normalize (1, 2, 3) and ([1, 2, 3]).
const normalizeVector = (...params) => {
  if (params[0] instanceof Array) {
    const [x = 0, y = 0, z = 0] = params[0];
    return [x, y, z];
  } else {
    const [x = 0, y = 0, z = 0] = params;
    return [x, y, z];
  }
}

/**
 *
 * # Cursor
 *
 * A cursor is moved by transformations rather than the universe around it.
 *
 * ::: illustration { "view": { "position": [0, -1, 40] } }
 * ```
 * cursor()
 *   .translate(5)
 *   .turn(45)
 *   .translate(5)
 *   .interior()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 40] } }
 * ```
 * cursor()
 *   .translate(5)
 *   .turn(-45)
 *   .translate(5)
 *   .interior()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 25] } }
 * ```
 * cursor()
 *   .translate(5)
 *   .corner(45)
 *   .translate(5)
 *   .interior()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 25] } }
 * ```
 * cursor()
 *   .translate(5)
 *   .corner(-45)
 *   .translate(5)
 *   .interior()
 * ```
 * :::
 *
 **/

class Cursor {
  constructor ({ matrix = identity(), path = [null, [0, 0, 0]] } = {}) {
    this.matrix = matrix;
    this.path = path.slice();
  }

  close () {
    return new Cursor({ matrix: this.matrix, path: close(this.path) });
  }

  corner (angle) {
    return this.rotateZ(180 - angle);
  }

  interior () {
    return this.close().toShape().interior();
  }

  outline () {
    return this.close().toShape();
  }

  rotateZ (angle) {
    return this.transform(fromZRotation(angle * Math.PI * 2 / 360));
  }

  toPoint () {
    const last = this.path[this.path.length - 1];
    if (last === null) {
      return [0, 0, 0];
    } else {
      return last;
    }
  }

  toPath () {
    return this.path;
  }

  toShape () {
    return Shape.fromPath(this.toPath());
  }

  transform (matrix) {
    return new Cursor({ matrix: multiply(matrix, this.matrix), path: this.path });
  }

  translate (...params) {
    const [x, y, z] = normalizeVector(params);
    const path = this.path.slice();
    path.push(add(this.toPoint(), transform(this.matrix, [x, y, z])));
    return new Cursor({ matrix: this.matrix, path });
  }

  turn (angle) {
    return this.rotateZ(angle);
  }
}

export const cursor = () => new Cursor();
