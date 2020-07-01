import {
  rotateZ as rotateSurface,
  scale as scaleSurface,
} from '@jsxcad/geometry-surface';
import {
  scale as scaleSolid,
  fromPolygons as solidFromPolygons,
  translate as translateSolid,
} from '@jsxcad/geometry-solid';
import {
  unitCubePolygons,
  unitRegularTrianglePolygon,
  unitSquarePolygon,
} from '@jsxcad/data-shape';

import { boot } from '@jsxcad/sys';
import { canonicalize } from './canonicalize';
import test from 'ava';
import { union } from './union';

test.beforeEach(async (t) => {
  await boot();
});

test('Surface', (t) => {
  const surface = union(
    {
      type: 'assembly',
      content: [{ type: 'z0Surface', z0Surface: [unitSquarePolygon] }],
    },
    {
      type: 'z0Surface',
      z0Surface: scaleSurface(
        [0.8, 0.8, 0.8],
        rotateSurface(Math.PI / 2, [unitRegularTrianglePolygon])
      ),
    }
  );
  t.deepEqual(canonicalize(surface), {
    type: 'assembly',
    tags: undefined,
    content: [
      {
        type: 'z0Surface',
        tags: undefined,
        z0Surface: [
          [
            [0.5, -0.4, 0],
            [0.69282, -0.4, 0],
            [0.5, -0.06602, 0],
            [0.5, 0.5, 0],
            [0.17321, 0.5, 0],
            [0, 0.8, 0],
            [-0.17321, 0.5, 0],
            [-0.5, 0.5, 0],
            [-0.5, -0.06602, 0],
            [-0.69282, -0.4, 0],
            [-0.5, -0.4, 0],
            [-0.5, -0.5, 0],
            [0.5, -0.5, 0],
          ],
        ],
      },
    ],
  });
});

test('Solid', (t) => {
  const solid = union(
    {
      type: 'solid',
      solid: translateSolid(
        [0, 0, 0],
        scaleSolid([10, 10, 10], solidFromPolygons({}, unitCubePolygons))
      ),
    },
    {
      type: 'solid',
      solid: translateSolid(
        [2, 2, 0],
        scaleSolid([10, 10, 10], solidFromPolygons({}, unitCubePolygons))
      ),
    },
    {
      type: 'solid',
      solid: translateSolid(
        [4, 4, 0],
        scaleSolid([10, 10, 10], solidFromPolygons({}, unitCubePolygons))
      ),
    }
  );
  t.deepEqual(canonicalize(solid), {
    type: 'solid',
    tags: undefined,
    solid: [
      [
        [
          [5, -3, -5],
          [5, -5, -5],
          [-5, -5, -5],
        ],
        [
          [7, -1, -5],
          [7, -3, -5],
          [5, -3, -5],
        ],
        [
          [9, 9, -5],
          [9, -1, -5],
          [7, -1, -5],
        ],
        [
          [-1, 7, -5],
          [-1, 9, -5],
          [9, 9, -5],
        ],
        [
          [-3, 5, -5],
          [-3, 7, -5],
          [-1, 7, -5],
        ],
        [
          [-5, -5, -5],
          [-5, 5, -5],
          [-3, 5, -5],
        ],
        [
          [7, -1, -5],
          [5, -3, -5],
          [-5, -5, -5],
        ],
        [
          [-1, 7, -5],
          [9, 9, -5],
          [7, -1, -5],
        ],
        [
          [-5, -5, -5],
          [-3, 5, -5],
          [-1, 7, -5],
        ],
        [
          [-1, 7, -5],
          [7, -1, -5],
          [-5, -5, -5],
        ],
      ],
      [
        [
          [5, -5, -5],
          [5, -3, -5],
          [5, -3, 5],
        ],
        [
          [5, -3, 5],
          [5, -5, 5],
          [5, -5, -5],
        ],
      ],
      [
        [
          [5, -3, 5],
          [5, -3, -5],
          [7, -3, -5],
        ],
        [
          [7, -3, -5],
          [7, -3, 5],
          [5, -3, 5],
        ],
      ],
      [
        [
          [7, -3, -5],
          [7, -1, -5],
          [7, -1, 5],
        ],
        [
          [7, -1, 5],
          [7, -3, 5],
          [7, -3, -5],
        ],
      ],
      [
        [
          [7, -1, 5],
          [7, -1, -5],
          [9, -1, -5],
        ],
        [
          [9, -1, -5],
          [9, -1, 5],
          [7, -1, 5],
        ],
      ],
      [
        [
          [9, -1, 5],
          [9, -1, -5],
          [9, 9, -5],
        ],
        [
          [9, 9, -5],
          [9, 9, 5],
          [9, -1, 5],
        ],
      ],
      [
        [
          [9, 9, -5],
          [-1, 9, -5],
          [-1, 9, 5],
        ],
        [
          [-1, 9, 5],
          [9, 9, 5],
          [9, 9, -5],
        ],
      ],
      [
        [
          [-1, 7, -5],
          [-1, 7, 5],
          [-1, 9, 5],
        ],
        [
          [-1, 9, 5],
          [-1, 9, -5],
          [-1, 7, -5],
        ],
      ],
      [
        [
          [-1, 7, -5],
          [-3, 7, -5],
          [-3, 7, 5],
        ],
        [
          [-3, 7, 5],
          [-1, 7, 5],
          [-1, 7, -5],
        ],
      ],
      [
        [
          [-3, 5, -5],
          [-3, 5, 5],
          [-3, 7, 5],
        ],
        [
          [-3, 7, 5],
          [-3, 7, -5],
          [-3, 5, -5],
        ],
      ],
      [
        [
          [-3, 5, -5],
          [-5, 5, -5],
          [-5, 5, 5],
        ],
        [
          [-5, 5, 5],
          [-3, 5, 5],
          [-3, 5, -5],
        ],
      ],
      [
        [
          [-5, 5, -5],
          [-5, -5, -5],
          [-5, -5, 5],
        ],
        [
          [-5, -5, 5],
          [-5, 5, 5],
          [-5, 5, -5],
        ],
      ],
      [
        [
          [5, -5, -5],
          [5, -5, 5],
          [-5, -5, 5],
        ],
        [
          [-5, -5, 5],
          [-5, -5, -5],
          [5, -5, -5],
        ],
      ],
      [
        [
          [-5, 5, 5],
          [-5, -5, 5],
          [5, -5, 5],
        ],
        [
          [5, -3, 5],
          [7, -3, 5],
          [7, -1, 5],
        ],
        [
          [7, -1, 5],
          [9, -1, 5],
          [9, 9, 5],
        ],
        [
          [9, 9, 5],
          [-1, 9, 5],
          [-1, 7, 5],
        ],
        [
          [-1, 7, 5],
          [-3, 7, 5],
          [-3, 5, 5],
        ],
        [
          [-3, 5, 5],
          [-5, 5, 5],
          [5, -5, 5],
        ],
        [
          [5, -3, 5],
          [7, -1, 5],
          [9, 9, 5],
        ],
        [
          [9, 9, 5],
          [-1, 7, 5],
          [-3, 5, 5],
        ],
        [
          [-3, 5, 5],
          [5, -5, 5],
          [5, -3, 5],
        ],
        [
          [5, -3, 5],
          [9, 9, 5],
          [-3, 5, 5],
        ],
      ],
    ],
  });
});
