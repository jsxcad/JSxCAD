import './extrude.js';
import './rx.js';
import './ry.js';

import { getCorner1, getCorner2 } from './Plan.js';

import Edge from './Edge.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { taggedPlan } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

let fundamentalShapes;

const fs = () => {
  if (fundamentalShapes === undefined) {
    const f = Loop(
      Point(1, 0, 0),
      Point(1, 1, 0),
      Point(0, 1, 0),
      Point(0, 0, 0)
    ).fill();
    fundamentalShapes = {
      tlfBox: Point(),
      tlBox: Edge(Point(0, 1, 0), Point(0, 0, 0)),
      tfBox: Edge(Point(0, 0, 0), Point(1, 0, 0)),
      tBox: f,
      lfBox: Edge(Point(0, 0, 0), Point(0, 0, 1)),
      lBox: f
        .ry(1 / 4)
        .rz(1 / 2)
        .rx(-1 / 4),
      fBox: f
        .rx(1 / 4)
        .rz(1 / 2)
        .ry(-1 / 4),
      box: f.ez(1),
    };
  }
  return fundamentalShapes;
};

const reifyBox = (geometry) => {
  const build = () => {
    const corner1 = getCorner1(geometry);
    const corner2 = getCorner2(geometry);

    const left = corner2[X];
    const right = corner1[X];

    const front = corner2[Y];
    const back = corner1[Y];

    const bottom = corner2[Z];
    const top = corner1[Z];

    if (top === bottom) {
      if (left === right) {
        if (front === back) {
          return fs().tlfBox.move(left, front, bottom);
        } else {
          return fs()
            .tlBox.sy(back - front)
            .move(left, front, bottom);
        }
      } else {
        if (front === back) {
          return fs()
            .tfBox.sx(right - left)
            .move(left, front, bottom);
        } else {
          return fs()
            .tBox.sx(right - left)
            .sy(back - front)
            .move(left, front, bottom);
        }
      }
    } else {
      if (left === right) {
        if (front === back) {
          return fs()
            .lfBox.sz(top - bottom)
            .move(left, front, bottom);
        } else {
          return fs()
            .lBox.sz(top - bottom)
            .sy(back - front)
            .move(left, front, bottom);
        }
      } else {
        if (front === back) {
          return fs()
            .fBox.sz(top - bottom)
            .sx(right - left)
            .move(left, front, bottom);
        } else {
          return fs()
            .box.sz(top - bottom)
            .sx(right - left)
            .sy(back - front)
            .move(left, front, bottom);
        }
      }
    }
  };

  return build().tag(...geometry.tags);
};

Shape.registerReifier('Box', reifyBox);

export const Box = (x = 1, y = x, z = 0) => {
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    if (x[0] < x[1]) {
      c1[X] = x[1];
      c2[X] = x[0];
    } else {
      c1[X] = x[0];
      c2[X] = x[1];
    }
  } else {
    c1[X] = x / 2;
    c2[X] = x / -2;
  }
  if (y instanceof Array) {
    if (y[0] < y[1]) {
      c1[Y] = y[1];
      c2[Y] = y[0];
    } else {
      c1[Y] = y[0];
      c2[Y] = y[1];
    }
  } else {
    c1[Y] = y / 2;
    c2[Y] = y / -2;
  }
  if (z instanceof Array) {
    if (z[0] < z[1]) {
      c1[Z] = z[1];
      c2[Z] = z[0];
    } else {
      c1[Z] = z[0];
      c2[Z] = z[1];
    }
  } else {
    c1[Z] = z / 2;
    c2[Z] = z / -2;
  }
  return Shape.fromGeometry(taggedPlan({}, { type: 'Box' }))
    .hasC1(...c1)
    .hasC2(...c2);
};

Shape.prototype.Box = Shape.shapeMethod(Box);

export default Box;
