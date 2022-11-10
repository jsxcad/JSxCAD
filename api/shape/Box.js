import './extrude.js';
import './rx.js';
import './ry.js';

import { buildCorners, getCorner1, getCorner2 } from './Plan.js';

import Edge from './Edge.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { onBoot } from '@jsxcad/sys';
import { taggedPlan } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

let fundamentalShapes;

const fs = () => fundamentalShapes;

const buildFs = async () => {
  if (fundamentalShapes === undefined) {
    // console.log(`QQ/fs/Loop.isChain: ${Loop.isChain}`);
    const f = await Loop(
      Point(1, 0, 0),
      Point(1, 1, 0),
      Point(0, 1, 0),
      Point(0, 0, 0)
    ).fill();
    // console.log(`QQ/fs/fq: ${'' + fq}`);
    // console.log(`QQ/fs/fq.isChain: ${fq.isChain}`);
    // console.log(`QQ/f: ${JSON.stringify(f)} isChain: ${f.isChain}`);
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
      box: await f.ez(1),
    };
  }
  return fundamentalShapes;
};

onBoot(buildFs);

const reifyBox = (plan) => {
  const build = () => {
    const corner1 = getCorner1(plan.toGeometry());
    const corner2 = getCorner2(plan.toGeometry());

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
        console.log(`QQ/box: ${fs().box}`);
          return fs()
            .box.sz(top - bottom)
            .sx(right - left)
            .sy(back - front)
            .move(left, front, bottom);
        }
      }
    }
  };

  return build()
    .absolute()
    .tag(...plan.toGeometry().tags);
};

// Shape.registerReifier('Box', reifyBox);

export const Box = Shape.registerShapeMethod('Box', (x = 1, y = x, z = 0) => {
  const [c1, c2] = buildCorners(x, y, z);
  return reifyBox(
    Shape.fromGeometry(taggedPlan({}, { type: 'Box' }))
      .hasC1(...c1)
      .hasC2(...c2)
  );
});

export default Box;
