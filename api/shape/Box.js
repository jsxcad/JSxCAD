import './extrude.js';
import './rx.js';
import './ry.js';

import Edge from './Edge.js';
import Geometry from './Geometry.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { absolute } from './absolute.js';
import { buildCorners } from './Plan.js';
import { makeOcctBox } from '@jsxcad/algorithm-cgal';

const X = 0;
const Y = 1;
const Z = 2;

let fundamentalShapes;

const buildFs = async () => {
  if (fundamentalShapes === undefined) {
    const f = await Loop(
      Point(1, 0, 0),
      Point(1, 1, 0),
      Point(0, 1, 0),
      Point(0, 0, 0)
    ).fill();
    fundamentalShapes = {
      tlfBox: await Point(),
      tlBox: await Edge(Point(0, 1, 0), Point(0, 0, 0)),
      tfBox: await Edge(Point(0, 0, 0), Point(1, 0, 0)),
      tBox: await f,
      lfBox: await Edge(Point(0, 0, 0), Point(0, 0, 1)),
      lBox: await f
        .ry(1 / 4)
        .rz(1 / 2)
        .rx(-1 / 4),
      fBox: await f
        .rx(1 / 4)
        .rz(1 / 2)
        .ry(-1 / 4),
      box: await f.ez([1]),
    };
  }
  return fundamentalShapes;
};

const reifyBox = async (corner1, corner2, isOcct = false) => {
  const build = async () => {
    const fs = await buildFs();
    const left = corner2[X];
    const right = corner1[X];

    const front = corner2[Y];
    const back = corner1[Y];

    const bottom = corner2[Z];
    const top = corner1[Z];

    if (top === bottom) {
      if (left === right) {
        if (front === back) {
          return fs.tlfBox.move(left, front, bottom);
        } else {
          return fs.tlBox.sy(back - front).move(left, front, bottom);
        }
      } else {
        if (front === back) {
          return fs.tfBox.sx(right - left).move(left, front, bottom);
        } else {
          const v1 = fs;
          const v2 = v1.tBox;
          const v3 = v2.sx(right - left);
          const v4 = v3.sy(back - front);
          const v5 = v4.move(left, front, bottom);
          return v5;
        }
      }
    } else {
      if (left === right) {
        if (front === back) {
          return fs.lfBox.sz(top - bottom).move(left, front, bottom);
        } else {
          return fs.lBox
            .sz(top - bottom)
            .sy(back - front)
            .move(left, front, bottom);
        }
      } else {
        if (front === back) {
          return fs.fBox
            .sz(top - bottom)
            .sx(right - left)
            .move(left, front, bottom);
        } else {
          if (isOcct) {
            return Geometry(
              makeOcctBox(right - left, back - front, top - bottom)
            ).move(left, front, bottom);
          } else {
            return fs.box
              .sz(top - bottom)
              .sx(right - left)
              .sy(back - front)
              .move(left, front, bottom);
          }
        }
      }
    }
  };

  return absolute()(await build());
};

export const Box = Shape.registerMethod2(
  'Box',
  ['input', 'modes:occt', 'intervals', 'options'],
  async (input, { occt }, [x = 1, y = x, z = 0], options) => {
    const [computedC1, computedC2] = await buildCorners(x, y, z)(input);
    let { c1 = computedC1, c2 = computedC2 } = options;
    return reifyBox(c1, c2, occt);
  }
);

export default Box;
