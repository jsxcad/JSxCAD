import SvgShapes from 'svg-shapes';
import absolutifySvgPath from 'abs-svg-path';
import { boot } from '@jsxcad/sys';
import curvifySvgPath from 'curvify-svg-path';
import parseSvgPath from 'parse-svg-path';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

test('Circle as cubic bezier.', (t) => {
  const circlePath = SvgShapes.toPath(
    SvgShapes.getPoints('circle', { cx: 0, cy: 0, r: 1 })
  );
  const parsedCirclePath = parseSvgPath(circlePath);
  const absoluteCirclePath = absolutifySvgPath(parsedCirclePath);
  const curvifiedCirclePath = curvifySvgPath(absoluteCirclePath);
  t.deepEqual(curvifiedCirclePath, [
    ['M', 0, -1],
    [
      'C',
      -0.5522847498307932,
      -1,
      -0.9999999999999999,
      -0.5522847498307935,
      -1,
      -1.2246467991473532e-16,
    ],
    [
      'C',
      -1,
      0.5522847498307932,
      -0.5522847498307936,
      0.9999999999999999,
      -1.8369701987210297e-16,
      1,
    ],
    [
      'C',
      0.5522847498307931,
      1,
      0.9999999999999998,
      0.5522847498307936,
      0.9999999999999999,
      2.220446049250313e-16,
    ],
    [
      'C',
      1.0000000000000002,
      -0.5522847498307931,
      0.5522847498307936,
      -0.9999999999999999,
      1.914284349463475e-16,
      -1,
    ],
    ['C', 1.914284349463475e-16, -1, 0, -1, 0, -1],
  ]);
});
