import { fromTranslation } from '@jsxcad/math-mat4';
import test from 'ava';
import { toTransformedGeometry } from './toTransformedGeometry';
import { transform } from './transform';

test('Deferred translation.', (t) => {
  const geometry = transform(fromTranslation([1, 1, 1]), {
    points: [[0, 0]],
    tags: ['a'],
  });
  t.deepEqual(geometry, {
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
    untransformed: {
      points: [[0, 0]],
      tags: ['a'],
    },
    tags: ['a'],
  });
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(transformed, {
    points: [[1, 1, 1]],
    tags: ['a'],
  });
});

test('Deferred rotated translation.', (t) => {
  // x.translate(1, 1, 1).rotateZ(180)
  const geometry = {
    // Rotate 180 degrees around the Z axis.
    matrix: [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    untransformed: {
      // Translate 1, 1, 1.
      matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      untransformed: {
        points: [[0, 0]],
      },
    },
  };
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(transformed, {
    points: [[-1, -1, 1]],
    tags: undefined,
  });
});

test('Deferred translated rotation.', (t) => {
  // x.rotateZ(180).translate(1, 1, 1)
  const geometry = {
    // Translate 1, 1, 1.
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
    untransformed: {
      // Rotate 180 degrees around the Z axis.
      matrix: [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      untransformed: {
        points: [[0, 0]],
      },
    },
  };
  const transformed = toTransformedGeometry(geometry);
  t.deepEqual(transformed, {
    points: [[1, 1, 1]],
    tags: undefined,
  });
});
