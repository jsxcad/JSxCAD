import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import outlineSurface from './outlineSurface';
import test from 'ava';

test('square-with-square-hole', t => {
  const normalize = createNormalize3();
  const surface = [
    [[-5,5,0],[-5,-5,0],[-0.5,-0.5,0]],
    [[0.5,-0.5,0],[-0.5,-0.5,0],[-5,-5,0]],
    [[-5,5,0],[-0.5,-0.5,0],[-0.5,0.5,0]],
    [[0.5,-0.5,0],[-5,-5,0],[5,-5,0]],
    [[5,5,0],[-5,5,0],[-0.5,0.5,0]],
    [[0.5,0.5,0],[0.5,-0.5,0],[5,-5,0]],
    [[5,5,0],[-0.5,0.5,0],[0.5,0.5,0]],
    [[0.5,0.5,0],[5,-5,0],[5,5,0]]
    ];
  const outline = outlineSurface(surface, normalize);
  console.log(`QQ/outline: ${JSON.stringify(outline)}`);
  t.deepEqual(
    outline,
    [
     [[0.5,0.5,0],[5,-5,0],[5,5,0],[-5,5,0],[-5,-5,0],[5,-5,0],[0.5,0.5,0],[0.5,-0.5,0],[-0.5,-0.5,0],[-0.5,0.5,0]]
    ]);
});
