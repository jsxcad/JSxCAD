import { fromPolygonsToSurfaceMesh } from './fromPolygonsToSurfaceMesh.js';
import { fromSurfaceMeshToGraph } from './fromSurfaceMeshToGraph.js';
import { identityMatrix } from '@jsxcad/math-mat4';
import { initCgal } from './getCgal.js';
import { joinSurfaceMeshes } from './joinSurfaceMeshes.js';

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

test('Join', (t) => {
  const a = fromPolygonsToSurfaceMesh(largeBox);
  const b = fromPolygonsToSurfaceMesh(box);
  // The first entry is the pivot of the disjunction.
  const r = joinSurfaceMeshes(
    [{ mesh: b, matrix: [...identityMatrix], tags: ['a'] }],
    [{ mesh: a, matrix: [...identityMatrix], tags: ['b'] }]);
  const graphs = r.map(({ mesh, matrix, tags }) => ({
    graph: fromSurfaceMeshToGraph(mesh),
    matrix,
    tags,
  }));
  t.deepEqual(JSON.parse(JSON.stringify(graphs)),
[{"graph":{"edges":[{"point":1,"next":9,"twin":1,"facet":2,"face":2},{"point":0,"next":21,"twin":0,"facet":0,"face":0},{"point":1,"next":29,"twin":3,"facet":3,"face":2},{"point":2,"next":0,"twin":2,"facet":2,"face":2},{"point":0,"next":11,"twin":5,"facet":1,"face":0},{"point":5,"next":1,"twin":4,"facet":0,"face":0},{"point":0,"next":15,"twin":7,"facet":4,"face":4},{"point":3,"next":4,"twin":6,"facet":1,"face":0},{"point":2,"next":12,"twin":9,"facet":5,"face":4},{"point":0,"next":3,"twin":8,"facet":2,"face":2},{"point":3,"next":19,"twin":11,"facet":6,"face":6},{"point":5,"next":7,"twin":10,"facet":1,"face":0},{"point":0,"next":25,"twin":13,"facet":5,"face":4},{"point":4,"next":6,"twin":12,"facet":4,"face":4},{"point":4,"next":16,"twin":15,"facet":7,"face":6},{"point":3,"next":13,"twin":14,"facet":4,"face":4},{"point":3,"next":33,"twin":17,"facet":7,"face":6},{"point":6,"next":10,"twin":16,"facet":6,"face":6},{"point":6,"next":20,"twin":19,"facet":8,"face":8},{"point":5,"next":17,"twin":18,"facet":6,"face":6},{"point":5,"next":27,"twin":21,"facet":8,"face":8},{"point":1,"next":5,"twin":20,"facet":0,"face":0},{"point":1,"next":31,"twin":23,"facet":9,"face":8},{"point":7,"next":2,"twin":22,"facet":3,"face":2},{"point":2,"next":35,"twin":25,"facet":10,"face":10},{"point":4,"next":8,"twin":24,"facet":5,"face":4},{"point":6,"next":22,"twin":27,"facet":9,"face":8},{"point":1,"next":18,"twin":26,"facet":8,"face":8},{"point":7,"next":24,"twin":29,"facet":10,"face":10},{"point":2,"next":23,"twin":28,"facet":3,"face":2},{"point":6,"next":34,"twin":31,"facet":11,"face":10},{"point":7,"next":26,"twin":30,"facet":9,"face":8},{"point":4,"next":30,"twin":33,"facet":11,"face":10},{"point":6,"next":14,"twin":32,"facet":7,"face":6},{"point":7,"next":32,"twin":35,"facet":11,"face":10},{"point":4,"next":28,"twin":34,"facet":10,"face":10}],"points":[[1,-1,-1],[1,-1,1],[1,1,-1],[-1,-1,-1],[-1,1,-1],[-1,-1,1],[-1,1,1],[1,1,1]],"exactPoints":[["1","-1","-1"],["1","-1","1"],["1","1","-1"],["-1","-1","-1"],["-1","1","-1"],["-1","-1","1"],["-1","1","1"],["1","1","1"]],"faces":[{"plane":[0,-1,0,-4],"exactPlane":["0","-4","0","-4"]},null,{"plane":[1,0,0,-4],"exactPlane":["4","0","0","-4"]},null,{"plane":[0,0,-1,-4],"exactPlane":["0","0","-4","-4"]},null,{"plane":[-1,0,0,-4],"exactPlane":["-4","0","0","-4"]},null,{"plane":[0,0,1,-4],"exactPlane":["0","0","4","-4"]},null,{"plane":[0,1,0,-4],"exactPlane":["0","4","0","-4"]}],"facets":[{"edge":21},{"edge":11},{"edge":9},{"edge":29},{"edge":15},{"edge":25},{"edge":19},{"edge":33},{"edge":27},{"edge":31},{"edge":35},{"edge":34}],"isClosed":true},"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"tags":["a"]}]);
});
