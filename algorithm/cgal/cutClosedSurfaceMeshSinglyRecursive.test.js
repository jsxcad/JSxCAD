import { cutClosedSurfaceMeshSinglyRecursive } from './cutClosedSurfaceMeshSinglyRecursive.js';
import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';

import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

const box = [
  {
    points: [
      [-0.5, 0.5, -0.5],
      [-0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, 0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [-0.5, -0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ],
  },
  {
    points: [
      [-0.5, 0.5, -0.5],
      [0.5, 0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, -0.5],
      [-0.5, -0.5, -0.5],
      [-0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, 0.5, -0.5],
      [0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, 0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
    ],
  },
  {
    points: [
      [-0.5, -0.5, 0.5],
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
    ],
  },
  {
    points: [
      [0.5, -0.5, -0.5],
      [0.5, -0.5, 0.5],
      [-0.5, -0.5, 0.5],
    ],
  },
];

const largeBox = [
  {
    points: [
      [-1.0, 1.0, -1.0],
      [-1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [1.0, 1.0, 1.0],
      [1.0, 1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, 1.0],
      [1.0, 1.0, 1.0],
      [-1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, 1.0],
      [-1.0, -1.0, 1.0],
      [1.0, -1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, 1.0],
      [-1.0, 1.0, -1.0],
      [-1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [-1.0, -1.0, -1.0],
      [-1.0, -1.0, 1.0],
      [-1.0, 1.0, 1.0],
    ],
  },
  {
    points: [
      [-1.0, 1.0, -1.0],
      [1.0, 1.0, -1.0],
      [1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, -1.0],
      [-1.0, -1.0, -1.0],
      [-1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, 1.0, -1.0],
      [1.0, 1.0, 1.0],
      [1.0, -1.0, 1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, 1.0],
      [1.0, -1.0, -1.0],
      [1.0, 1.0, -1.0],
    ],
  },
  {
    points: [
      [-1.0, -1.0, 1.0],
      [-1.0, -1.0, -1.0],
      [1.0, -1.0, -1.0],
    ],
  },
  {
    points: [
      [1.0, -1.0, -1.0],
      [1.0, -1.0, 1.0],
      [-1.0, -1.0, 1.0],
    ],
  },
];

test('Cutting box from largeBox gives box and largeBox with a hole', (t) => {
  const a = fromPolygonsToSurfaceMesh(largeBox);
  const b = fromPolygonsToSurfaceMesh(box);
  const mesh = cutClosedSurfaceMeshSinglyRecursive(
    a,
    [...identityMatrix],
    true,
    [{ mesh: b, matrix: [...identityMatrix] }]
  );
  const graph = fromSurfaceMeshToGraph(mesh);
  t.deepEqual(graph,
{"edges":[{"point":0,"next":2,"twin":1,"facet":0,"face":0},{"point":1,"next":18,"twin":0,"facet":4,"face":4},{"point":1,"next":4,"twin":3,"facet":0,"face":0},{"point":2,"next":12,"twin":2,"facet":2,"face":2},{"point":2,"next":0,"twin":5,"facet":0,"face":0},{"point":0,"next":6,"twin":4,"facet":1,"face":0},{"point":2,"next":8,"twin":7,"facet":1,"face":0},{"point":3,"next":11,"twin":6,"facet":8,"face":8},{"point":3,"next":5,"twin":9,"facet":1,"face":0},{"point":0,"next":24,"twin":8,"facet":6,"face":6},{"point":4,"next":3,"twin":11,"facet":2,"face":2},{"point":2,"next":30,"twin":10,"facet":8,"face":8},{"point":1,"next":10,"twin":13,"facet":2,"face":2},{"point":4,"next":14,"twin":12,"facet":3,"face":2},{"point":1,"next":16,"twin":15,"facet":3,"face":2},{"point":5,"next":21,"twin":14,"facet":5,"face":4},{"point":5,"next":13,"twin":17,"facet":3,"face":2},{"point":4,"next":35,"twin":16,"facet":11,"face":10},{"point":0,"next":20,"twin":19,"facet":4,"face":4},{"point":6,"next":27,"twin":18,"facet":7,"face":6},{"point":6,"next":1,"twin":21,"facet":4,"face":4},{"point":1,"next":22,"twin":20,"facet":5,"face":4},{"point":6,"next":15,"twin":23,"facet":5,"face":4},{"point":5,"next":29,"twin":22,"facet":10,"face":10},{"point":3,"next":26,"twin":25,"facet":6,"face":6},{"point":7,"next":31,"twin":24,"facet":9,"face":8},{"point":7,"next":9,"twin":27,"facet":6,"face":6},{"point":0,"next":28,"twin":26,"facet":7,"face":6},{"point":7,"next":19,"twin":29,"facet":7,"face":6},{"point":6,"next":34,"twin":28,"facet":10,"face":10},{"point":4,"next":7,"twin":31,"facet":8,"face":8},{"point":3,"next":32,"twin":30,"facet":9,"face":8},{"point":4,"next":25,"twin":33,"facet":9,"face":8},{"point":7,"next":17,"twin":32,"facet":11,"face":10},{"point":7,"next":23,"twin":35,"facet":10,"face":10},{"point":5,"next":33,"twin":34,"facet":11,"face":10},{"point":8,"next":45,"twin":37,"facet":13,"face":12},{"point":11,"next":41,"twin":36,"facet":12,"face":12},{"point":11,"next":55,"twin":39,"facet":16,"face":16},{"point":9,"next":37,"twin":38,"facet":12,"face":12},{"point":9,"next":49,"twin":41,"facet":14,"face":14},{"point":8,"next":39,"twin":40,"facet":12,"face":12},{"point":8,"next":67,"twin":43,"facet":20,"face":20},{"point":13,"next":36,"twin":42,"facet":13,"face":12},{"point":13,"next":61,"twin":45,"facet":18,"face":18},{"point":11,"next":43,"twin":44,"facet":13,"face":12},{"point":9,"next":53,"twin":47,"facet":15,"face":14},{"point":14,"next":40,"twin":46,"facet":14,"face":14},{"point":14,"next":42,"twin":49,"facet":20,"face":20},{"point":8,"next":47,"twin":48,"facet":14,"face":14},{"point":9,"next":59,"twin":51,"facet":17,"face":16},{"point":10,"next":46,"twin":50,"facet":15,"face":14},{"point":10,"next":68,"twin":53,"facet":23,"face":22},{"point":14,"next":51,"twin":52,"facet":15,"face":14},{"point":12,"next":50,"twin":55,"facet":17,"face":16},{"point":9,"next":57,"twin":54,"facet":16,"face":16},{"point":11,"next":65,"twin":57,"facet":19,"face":18},{"point":12,"next":38,"twin":56,"facet":16,"face":16},{"point":12,"next":71,"twin":59,"facet":22,"face":22},{"point":10,"next":54,"twin":58,"facet":17,"face":16},{"point":15,"next":56,"twin":61,"facet":19,"face":18},{"point":11,"next":63,"twin":60,"facet":18,"face":18},{"point":13,"next":69,"twin":63,"facet":21,"face":20},{"point":15,"next":44,"twin":62,"facet":18,"face":18},{"point":15,"next":58,"twin":65,"facet":22,"face":22},{"point":12,"next":60,"twin":64,"facet":19,"face":18},{"point":14,"next":62,"twin":67,"facet":21,"face":20},{"point":13,"next":48,"twin":66,"facet":20,"face":20},{"point":14,"next":70,"twin":69,"facet":23,"face":22},{"point":15,"next":66,"twin":68,"facet":21,"face":20},{"point":15,"next":52,"twin":71,"facet":23,"face":22},{"point":10,"next":64,"twin":70,"facet":22,"face":22}],"points":[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1],[1,-1,1],[-1,-1,1],[-1,-1,-1],[1,-1,-1],[0.5,0.5,0.5],[-0.5,0.5,0.5],[-0.5,-0.5,0.5],[-0.5,0.5,-0.5],[-0.5,-0.5,-0.5],[0.5,0.5,-0.5],[0.5,-0.5,0.5],[0.5,-0.5,-0.5]],"exactPoints":[["-1","1","-1"],["-1","1","1"],["1","1","1"],["1","1","-1"],["1","-1","1"],["-1","-1","1"],["-1","-1","-1"],["1","-1","-1"],["1/2","1/2","1/2"],["-1/2","1/2","1/2"],["-1/2","-1/2","1/2"],["-1/2","1/2","-1/2"],["-1/2","-1/2","-1/2"],["1/2","1/2","-1/2"],["1/2","-1/2","1/2"],["1/2","-1/2","-1/2"]],"faces":[{"plane":[0,1,0,-4],"exactPlane":["0","4","0","-4"]},undefined,{"plane":[0,0,1,-4],"exactPlane":["0","0","4","-4"]},undefined,{"plane":[-1,0,0,-4],"exactPlane":["-4","0","0","-4"]},undefined,{"plane":[0,0,-1,-4],"exactPlane":["0","0","-4","-4"]},undefined,{"plane":[1,0,0,-4],"exactPlane":["4","0","0","-4"]},undefined,{"plane":[0,-1,0,-4],"exactPlane":["0","-4","0","-4"]},undefined,{"plane":[0,-1,0,0.5],"exactPlane":["0","-1","0","1/2"]},undefined,{"plane":[0,0,-1,0.5],"exactPlane":["0","0","-1","1/2"]},undefined,{"plane":[1,0,0,0.5],"exactPlane":["1","0","0","1/2"]},undefined,{"plane":[0,0,1,0.5],"exactPlane":["0","0","1","1/2"]},undefined,{"plane":[-1,0,0,0.5],"exactPlane":["-1","0","0","1/2"]},undefined,{"plane":[0,1,0,0.5],"exactPlane":["0","1","0","1/2"]}],"facets":[{"edge":4},{"edge":8},{"edge":12},{"edge":16},{"edge":20},{"edge":22},{"edge":26},{"edge":28},{"edge":30},{"edge":32},{"edge":34},{"edge":35},{"edge":41},{"edge":45},{"edge":49},{"edge":53},{"edge":57},{"edge":59},{"edge":63},{"edge":65},{"edge":67},{"edge":69},{"edge":71},{"edge":70}],"isClosed":true}
);
});
