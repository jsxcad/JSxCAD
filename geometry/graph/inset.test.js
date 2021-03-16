import { initCgal, insetOfPolygonWithHoles } from '@jsxcad/algorithm-cgal';

import { fromPolygonsWithHoles } from './fromPolygonsWithHoles.js';
import { inset } from './inset.js';
import { outline } from './outline.js';
import { realizeGraph } from './realizeGraph.js';
import test from 'ava';

Error.stackTraceLimit = Infinity;

test.beforeEach(async (t) => {
  await initCgal();
});

test('inset', (t) => {
  const graph = {
    isClosed: false,
    isLazy: false,
    provenance: 'fromPolygonsWithHoles',
    edges: [
      { point: 0, next: 2, twin: 1, facet: 0, face: 0 }, // 0
      { point: 1, next: 22, twin: 0, facet: 4, face: 0 },
      { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
      { point: 2, next: 9, twin: 2, facet: -1, face: -1 },
      { point: 2, next: 0, twin: 5, facet: 0, face: 0 },
      { point: 0, next: 15, twin: 4, facet: 8, face: 0 }, // 5
      { point: 3, next: 8, twin: 7, facet: 1, face: 0 },
      { point: 4, next: 20, twin: 6, facet: 3, face: 0 },
      { point: 4, next: 10, twin: 9, facet: 1, face: 0 },
      { point: 1, next: 33, twin: 8, facet: -1, face: -1 },
      { point: 1, next: 6, twin: 11, facet: 1, face: 0 }, // 10
      { point: 3, next: 25, twin: 10, facet: 6, face: 0 },
      { point: 5, next: 14, twin: 13, facet: 2, face: 0 },
      { point: 6, next: 26, twin: 12, facet: 5, face: 0 },
      { point: 6, next: 16, twin: 15, facet: 2, face: 0 },
      { point: 2, next: 34, twin: 14, facet: 8, face: 0 }, // 15
      { point: 2, next: 12, twin: 17, facet: 2, face: 0 },
      { point: 5, next: 3, twin: 16, facet: -1, face: -1 },
      { point: 7, next: 7, twin: 19, facet: 3, face: 0 },
      { point: 4, next: 27, twin: 18, facet: 7, face: 0 },
      { point: 3, next: 18, twin: 21, facet: 3, face: 0 }, // 20
      { point: 7, next: 31, twin: 20, facet: -1, face: -1 },
      { point: 0, next: 24, twin: 23, facet: 4, face: 0 },
      { point: 8, next: 35, twin: 22, facet: -1, face: -1 },
      { point: 8, next: 1, twin: 25, facet: 4, face: 0 },
      { point: 1, next: 30, twin: 24, facet: 6, face: 0 }, // 25
      { point: 5, next: 28, twin: 27, facet: 5, face: 0 },
      { point: 7, next: 32, twin: 26, facet: 7, face: 0 },
      { point: 7, next: 13, twin: 29, facet: 5, face: 0 },
      { point: 6, next: 21, twin: 28, facet: -1, face: -1 },
      { point: 8, next: 11, twin: 31, facet: 6, face: 0 }, // 30
      { point: 3, next: 23, twin: 30, facet: -1, face: -1 },
      { point: 5, next: 19, twin: 33, facet: 7, face: 0 },
      { point: 4, next: 17, twin: 32, facet: -1, face: -1 },
      { point: 6, next: 5, twin: 35, facet: 8, face: 0 },
      { point: 0, next: 29, twin: 34, facet: -1, face: -1 }, // 35
    ],
    points: [
      [5.629165124598852, 3.2499999999999996, 0],
      [10, -10, 0],
      [10, 10, 0],
      [3.9801020972288977e-16, -6.5, 0],
      [-10, -10, 0],
      [-10, 10, 0],
      [-3.2499999999999996, 3.2499999999999996, 0],
      [-5.629165124598852, 3.2499999999999996, 0],
      [2.379165124598851, -2.379165124598851, 0],
    ],
    exactPoints: [
      [
        '6337876489387595/1125899906842624',
        '7318349394477055/2251799813685248',
        '0',
      ],
      ['10', '-10', '0'],
      ['10', '10', '0'],
      ['8072606100034955/20282409603651670423947251286016', '-13/2', '0'],
      ['-10', '-10', '0'],
      ['-10', '10', '0'],
      [
        '-7318349394477055/2251799813685248',
        '7318349394477055/2251799813685248',
        '0',
      ],
      [
        '-6337876489387595/1125899906842624',
        '7318349394477055/2251799813685248',
        '0',
      ],
      [
        '5357403584298133/2251799813685248',
        '-5357403584298133/2251799813685248',
        '0',
      ],
    ],
    faces: [
      {
        plane: [0, 0, 0.9999999999999998, 0],
        exactPlane: ['0', '0', '24605612895193225/24605612895193228', '0'],
      },
    ],
    facets: [
      { edge: 4 },
      { edge: 10 },
      { edge: 16 },
      { edge: 20 },
      { edge: 24 },
      { edge: 28 },
      { edge: 30 },
      { edge: 32 },
      { edge: 34 },
    ],
  };
  const polygonsWithHoles = outline(graph);
  t.deepEqual(polygonsWithHoles, [
    {
      points: [
        [-10, 10, 0],
        [-10, -10, 0],
        [10, -10, 0],
        [10, 10, 0],
      ],
      exactPoints: [
        ['-10', '10', '0'],
        ['-10', '-10', '0'],
        ['10', '-10', '0'],
        ['10', '10', '0'],
      ],
      holes: [
        {
          points: [
            [-3.2499999999999996, 3.2499999999999996, 0],
            [5.629165124598852, 3.2499999999999996, 0],
            [2.379165124598851, -2.379165124598851, 0],
            [3.9801020972288977e-16, -6.5, 0],
            [-5.629165124598852, 3.2499999999999996, 0],
          ],
          exactPoints: [
            [
              '-7318349394477055/2251799813685248',
              '7318349394477055/2251799813685248',
              '0',
            ],
            [
              '6337876489387595/1125899906842624',
              '7318349394477055/2251799813685248',
              '0',
            ],
            [
              '5357403584298133/2251799813685248',
              '-5357403584298133/2251799813685248',
              '0',
            ],
            ['8072606100034955/20282409603651670423947251286016', '-13/2', '0'],
            [
              '-6337876489387595/1125899906842624',
              '7318349394477055/2251799813685248',
              '0',
            ],
          ],
          holes: [],
          exactPlane: ['0', '0', '24605612895193225/24605612895193228', '0'],
          plane: [0, 0, 0.9999999999999998, 0],
        },
      ],
      plane: [0, 0, 0.9999999999999998, 0],
      exactPlane: ['0', '0', '24605612895193225/24605612895193228', '0'],
    },
  ]);
  const insetsOfPolygonsWithHoles = polygonsWithHoles.map((polygonWithHoles) =>
    insetOfPolygonWithHoles(1, undefined, undefined, polygonWithHoles)
  );
  t.deepEqual(insetsOfPolygonsWithHoles, [
    [
      {
        points: [
          [-9, -8.999999999999998, 0],
          [9, -8.999999999999998, 0],
          [9, 8.999999999999998, 0],
          [-9, 8.999999999999998, 0],
        ],
        holes: [
          {
            points: [
              [6.6292, 3.250000000000002, 0],
              [6.60998528040323, 3.0549096779838734, 0],
              [6.553079532511287, 2.8673165676349117, 0],
              [6.460669612302546, 2.6944297669803987, 0],
              [3.210669612302546, -2.9347702330196, 0],
              [0.8314696123025462, -7.0555702330196, 0],
              [0.7071067811865487, -7.207106781186545, 0],
              [0.5555702330196034, -7.331469612302544, 0],
              [0.3826834323650909, -7.423879532511285, 0],
              [0.19509032201612922, -7.4807852804032295, 0],
              [7.657137397853899e-16, -7.499999999999999, 0],
              [-0.19509032201612772, -7.4807852804032295, 0],
              [-0.38268343236508945, -7.423879532511286, 0],
              [-0.5555702330196022, -7.331469612302545, 0],
              [-0.7071067811865476, -7.207106781186547, 0],
              [-0.8314696123025453, -7.055570233019601, 0],
              [-6.460669612302545, 2.694429766980398, 0],
              [-6.553079532511286, 2.86731656763491, 0],
              [-6.60998528040323, 3.0549096779838716, 0],
              [-6.6292, 3.2499999999999996, 0],
              [-6.60998528040323, 3.445090322016128, 0],
              [-6.553079532511286, 3.6326834323650896, 0],
              [-6.460669612302545, 3.8055702330196017, 0],
              [-6.336306781186547, 3.957106781186547, 0],
              [-6.184770233019602, 4.081469612302544, 0],
              [-6.01188343236509, 4.173879532511285, 0],
              [-5.824290322016128, 4.230785280403229, 0],
              [-5.6292, 4.249999999999998, 0],
              [-3.25, 4.249999999999998, 0],
              [5.6292, 4.249999999999998, 0],
              [5.8242903220161235, 4.2307852804032295, 0],
              [6.011883432365086, 4.173879532511287, 0],
              [6.184770233019599, 4.081469612302546, 0],
              [6.336306781186544, 3.9571067811865497, 0],
              [6.460669612302543, 3.8055702330196044, 0],
              [6.553079532511285, 3.6326834323650923, 0],
              [6.6099852804032295, 3.4450903220161306, 0],
            ],
            holes: [],
            plane: [0, 0, 0.9999999999999998, 0],
            exactPlane: ['0', '0', '24605612895193225/24605612895193228', '0'],
          },
        ],
        plane: [0, 0, 0.9999999999999998, 0],
        exactPlane: ['0', '0', '24605612895193225/24605612895193228', '0'],
      },
    ],
  ]);
  // FIX: Here is where it is going wrong.
  const stepwiseInsetGraphs = insetsOfPolygonsWithHoles.map(
    (insetPolygonsWithHoles) =>
      realizeGraph(fromPolygonsWithHoles(insetPolygonsWithHoles))
  );
  t.deepEqual(JSON.parse(JSON.stringify(stepwiseInsetGraphs)), [
    {
      isClosed: false,
      isLazy: false,
      provenance: 'fromPolygonsWithHoles',
      edges: [
        { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
        { point: 1, next: 7, twin: 0, facet: -1, face: -1 },
        { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
        { point: 2, next: 1, twin: 2, facet: -1, face: -1 },
        { point: 2, next: 6, twin: 5, facet: 0, face: 0 },
        { point: 3, next: 3, twin: 4, facet: -1, face: -1 },
        { point: 3, next: 0, twin: 7, facet: 0, face: 0 },
        { point: 0, next: 5, twin: 6, facet: -1, face: -1 },
      ],
      points: [
        [-9, 8.999999999999998, 0],
        [-9, -8.999999999999998, 0],
        [9, -8.999999999999998, 0],
        [9, 8.999999999999998, 0],
      ],
      exactPoints: [
        ['-9', '5066549580791807/562949953421312', '0'],
        ['-9', '-5066549580791807/562949953421312', '0'],
        ['9', '-5066549580791807/562949953421312', '0'],
        ['9', '5066549580791807/562949953421312', '0'],
      ],
      faces: [
        {
          plane: [0, 0, 1, 0],
          exactPlane: ['0', '0', '45598946227126263/45598946227126256', '0'],
        },
      ],
      facets: [{ edge: 6 }],
    },
  ]);
  const insetGraphs = inset(graph, 1);
  t.deepEqual(
    JSON.parse(JSON.stringify(insetGraphs.map((graph) => realizeGraph(graph)))),
    [
      {
        isClosed: false,
        isLazy: false,
        provenance: 'fromPolygonsWithHoles',
        edges: [
          { point: 0, next: 2, twin: 1, facet: 0, face: 0 },
          { point: 1, next: 7, twin: 0, facet: -1, face: -1 },
          { point: 1, next: 4, twin: 3, facet: 0, face: 0 },
          { point: 2, next: 1, twin: 2, facet: -1, face: -1 },
          { point: 2, next: 6, twin: 5, facet: 0, face: 0 },
          { point: 3, next: 3, twin: 4, facet: -1, face: -1 },
          { point: 3, next: 0, twin: 7, facet: 0, face: 0 },
          { point: 0, next: 5, twin: 6, facet: -1, face: -1 },
        ],
        points: [
          [-9, 8.999999999999998, 0],
          [-9, -8.999999999999998, 0],
          [9, -8.999999999999998, 0],
          [9, 8.999999999999998, 0],
        ],
        exactPoints: [
          ['-9', '5066549580791807/562949953421312', '0'],
          ['-9', '-5066549580791807/562949953421312', '0'],
          ['9', '-5066549580791807/562949953421312', '0'],
          ['9', '5066549580791807/562949953421312', '0'],
        ],
        faces: [
          {
            plane: [0, 0, 1, 0],
            exactPlane: ['0', '0', '45598946227126263/45598946227126256', '0'],
          },
        ],
        facets: [{ edge: 6 }],
      },
    ]
  );
});
