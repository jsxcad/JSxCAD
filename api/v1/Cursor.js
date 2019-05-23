import { add, transform } from '@jsxcad/math-vec2';
import { fromZRotation, identity, multiply } from '@jsxcad/math-mat4';

import { Shape } from './Shape';

export class Cursor {
  constructor ({ matrix = identity(), path = [null, [0, 0, 0]] } = {}) {
    this.matrix = matrix;
    this.path = path.slice();
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

  translate ([x = 0, y = 0, z = 0]) {
    const path = this.path.slice();
    path.push(add(this.toPoint(), transform(this.matrix, [x, y, z])));
    return new Cursor({ matrix: this.matrix, path });
  }
}
