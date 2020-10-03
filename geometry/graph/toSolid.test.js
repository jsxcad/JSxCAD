import test from 'ava';
import { toSolid } from './toSolid.js';

test('toSolid', (t) => {
  const graph = {"edges":[undefined,undefined,undefined,undefined,{"point":2,"next":4,"loop":0,"twin":3},{"point":0,"next":5,"loop":1,"twin":9},undefined,undefined,undefined,undefined,undefined,undefined,{"point":1,"next":12,"loop":2,"twin":2},{"point":4,"next":13,"loop":3,"twin":17},undefined,undefined,undefined,undefined,undefined,undefined,{"point":6,"next":20,"loop":4,"twin":19},{"point":1,"next":21,"loop":5,"twin":14},undefined,undefined,undefined,undefined,{"point":7,"next":26,"loop":6,"twin":25},{"point":0,"next":27,"loop":7,"twin":18},undefined,undefined,{"point":4,"next":30,"loop":8,"twin":10},{"point":3,"next":31,"loop":9,"twin":24},undefined,undefined,{"point":7,"next":34,"loop":10,"twin":28},{"point":5,"next":35,"loop":11,"twin":16}],"faces":[{"loop":0},{"loop":1},{"loop":2},{"loop":3},{"loop":4},{"loop":5},{"loop":6},{"loop":7},{"loop":8},{"loop":9},{"loop":10},{"loop":11}],"loops":[{"edge":4},{"edge":5},{"edge":12},{"edge":13},{"edge":20},{"edge":21},{"edge":26},{"edge":27},{"edge":30},{"edge":31},{"edge":34},{"edge":35}],"points":[[-0.5,0.5,-0.5],[-0.5,0.5,0.5],[0.5,0.5,0.5],[0.5,0.5,-0.5],[0.5,-0.5,0.5],[-0.5,-0.5,0.5],[-0.5,-0.5,-0.5],[0.5,-0.5,-0.5]]};

  const solid = JSON.parse(JSON.stringify(toSolid(graph)));

  t.deepEqual(solid, [
    [
      [
        [0.5, 0.5, 0.5],
        [-0.5, 0.5, -0.5],
        [-0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, 0.5],
        [0.5, -0.5, 0.5],
        [0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, 0.5],
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, 0.5],
      ],
    ],
    [
      [
        [-0.5, -0.5, -0.5],
        [-0.5, 0.5, 0.5],
        [-0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, 0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, -0.5, 0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [0.5, 0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, 0.5, -0.5],
        [0.5, -0.5, -0.5],
        [-0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, 0.5],
        [0.5, 0.5, -0.5],
        [0.5, 0.5, 0.5],
      ],
    ],
    [
      [
        [0.5, 0.5, -0.5],
        [0.5, -0.5, 0.5],
        [0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [0.5, -0.5, -0.5],
        [-0.5, -0.5, 0.5],
        [-0.5, -0.5, -0.5],
      ],
    ],
    [
      [
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, -0.5],
        [0.5, -0.5, 0.5],
      ],
    ],
  ]);
});
