import { getCorner1, getCorner2 } from './Plan.js';

import Edge from './Edge.js';
import Face from './Face.js';
import Point from './Point.js';
import Polyhedron from './Polyhedron.js';
import Shape from './Shape.js';
import { taggedPlan } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

let fundamentalShapes;

const fs = () => {
  if (fundamentalShapes === undefined) {
    fundamentalShapes = {
      tlfBox: Point(),
      tlBox: Edge(Point(0, 1, 0), Point(0, 0, 0)),
      tfBox: Edge(Point(0, 0, 0), Point(1, 0, 0)),
      tBox: Face(Point(1, 0, 0), Point(1, 1, 0), Point(0, 1, 0), Point(0, 0, 0)),

      lfBox: Edge(Point(0, 0, 0), Point(0, 0, 1)),
      lBox: Face(Point(0, 0, 0), Point(0, 1, 0), Point(0, 1, 1), Point(0, 0, 1)),

      fBox: Face(Point(0, 0, 1), Point(1, 0, 1), Point(1, 0, 0), Point(0, 0, 0)),

      box: Polyhedron(Face(Point(0, 0, 1), Point(0, 1, 1), Point(1, 1, 1), Point(1, 0, 1)),
                  Face(Point(0, 0, 0), Point(0, 1, 0), Point(1, 1, 0), Point(1, 0, 0)),
                  Face( Point(0, 0, 0), Point(0, 1, 0), Point(0, 1, 1), Point(0, 0, 1)),
                  Face( Point(1, 0, 0), Point(1, 1, 0), Point(1, 1, 1), Point(1, 0, 1)),
                  Face( Point(0, 0, 0), Point(1, 0, 0), Point(1, 0, 1), Point(0, 0, 1)),
                  Face( Point(0, 1, 0), Point(1, 1, 0), Point(1, 1, 1), Point(0, 1, 1))),
    };
  }
  return fundamentalShapes;
};

const reifyBox = (geometry) => {
  const build = () => {
    const corner1 = getCorner1(geometry);
    const corner2 = getCorner2(geometry);

    const left = corner1[X];
    const right = corner2[X];

    const front = corner1[Y];
    const back = corner2[Y];

    const bottom = corner1[Z];
    const top = corner2[Z];

    if (top === bottom) {
      if (left === right) {
        if (front === back) {
          // return Point(bottom, left, front)
          return fs().tlfBox.move(left, back, bottom);
        } else {
          // return Edge(Point(left, front, bottom), Point(right, back, top));
          return fs().tlBox.sy(front - back).move(left, back, bottom);
        }
      } else {
        if (front === back) {
          // return Edge(Point(left, front, bottom), Point(right, back, top));
          return fs().tfBox.sx(right - left).move(left, back, bottom);
        } else {
          // left !== right && front !== back
          // return Face(Point(left, back, bottom), Point(left, front, bottom), Point(right, front, top), Point(right, back, top));
          return fs().tBox.sx(right - left).sy(front - back).move(left, back, bottom);
        }
      }
    } else {
      if (left === right) {
        if (front === back) {
          // return Edge(Point(left, front, bottom), Point(right, back, top));
          return fs().lfBox.sz(top - bottom).move(left, back, bottom);
        } else {
          // top !== bottom && front !== back
          // return Face(Point(right, back, top), Point(right, front, top), Point(right, front, bottom), Point(left, back, bottom));
          return fs().lBox.sz(top - bottom).sy(front - back).move(left, back, bottom);
        }
      } else {
        if (front === back) {
          // top !== bottom && left !== right
          // return Face(Point(left, back, top), Point(right, front, top), Point(right, front, bottom), Point(left, back, bottom));
          return fs().fBox.sz(top - bottom).sx(right - left).move(left, back, bottom);
        } else {
          // top !== bottom && front !== back && left !== right
          /*
          return Polyhedron(
            Face( Point(left, back, top), Point(left, front, top), Point(right, front, top), Point(right, back, top)),
            Face( Point(left, back, bottom), Point(left, front, bottom), Point(right, front, bottom), Point(right, back, bottom)),
            Face( Point(left, back, bottom), Point(left, front, bottom), Point(left, front, top), Point(left, back, top)),
            Face( Point(right, back, bottom), Point(right, front, bottom), Point(right, front, top), Point(right, back, top)),
            Face( Point(left, back, bottom), Point(right, back, bottom), Point(right, back, top), Point(left, back, top)),
            Face( Point(left, front, bottom), Point(right, front, bottom), Point(right, front, top), Point(left, front, top)));
          */
          return fs().box.sz(top - bottom).sx(right - left).sy(front - back).move(left, back, bottom);
        }
      }
    }
  };

  return build().tag(...geometry.tags);
};

Shape.registerReifier('Box', reifyBox);

export const Box = (x, y = x, z = 0) => {
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
