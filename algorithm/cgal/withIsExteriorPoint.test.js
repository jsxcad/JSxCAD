import { initCgal } from './getCgal.js';
import test from 'ava';
import { withIsExteriorPoint } from './withIsExteriorPoint.js';

test.beforeEach(async (t) => {
  await initCgal();
});

test('Empty', (t) => {
  withIsExteriorPoint([], (isExteriorPoint) =>
    t.true(isExteriorPoint(0, 0, 0))
  );
});
