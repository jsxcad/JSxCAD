import { fromTranslation } from '@jsxcad/math-mat4';
import test from 'ava';
import { toTransformedGeometry } from './toTransformedGeometry';
import { transform } from './transform';

test('Deferred translation.', (t) => {
  const geometry = transform(fromTranslation([1, 1, 1]), {
    type: 'points',
    points: [[0, 0]],
    tags: ['a'],
  });
  t.deepEqual(geometry, {
    type: 'transform',
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
    content: [
      {
        type: 'points',
        points: [[0, 0]],
        tags: ['a'],
      },
    ],
    tags: ['a'],
  });
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(transformed, {
    type: 'points',
    points: [[1, 1, 1]],
    tags: ['a'],
  });
});

test('Deferred rotated translation.', (t) => {
  // x.translate(1, 1, 1).rotateZ(180)
  const geometry = {
    // Rotate 180 degrees around the Z axis.
    type: 'transform',
    matrix: [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    content: [
      {
        // Translate 1, 1, 1.
        type: 'transform',
        matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
        content: [
          {
            type: 'points',
            points: [[0, 0]],
          },
        ],
      },
    ],
  };
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(transformed, {
    type: 'points',
    points: [[-1, -1, 1]],
  });
});

test('Deferred translated rotation.', (t) => {
  // x.rotateZ(180).translate(1, 1, 1)
  const geometry = {
    // Translate 1, 1, 1.
    type: 'transform',
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
    content: [
      {
        // Rotate 180 degrees around the Z axis.
        type: 'transform',
        matrix: [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        content: [
          {
            type: 'points',
            points: [[0, 0]],
          },
        ],
      },
    ],
  };
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(transformed, {
    type: 'points',
    points: [[1, 1, 1]],
  });
});
