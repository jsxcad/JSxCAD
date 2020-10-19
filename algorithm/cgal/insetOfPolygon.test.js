import { initCgal } from './getCgal.js';
import { insetOfPolygon } from './insetOfPolygon.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await initCgal();
});

test('insetOfPolygon/bow', (t) => {
  const polygon = [
    [0.25, -0.18899576365947723, 0],
    [0.7886751294136047, -0.5, 0],
    [0.7886751294136047, 0.5, 0],
    [0.25, 0.18899576365947723, 0],
    [-0.28867512941360474, 0.5, 0],
    [-0.28867512941360474, -0.5, 0],
  ];
  const xyPlane = [0, 0, 1, 0];
  const inset = insetOfPolygon(0.2, xyPlane, polygon, []);
  t.deepEqual(inset, [
    {
      boundary: [
        [0.17735026460143843, 0, 0],
        [-0.08867512941360473, 0.15358983549676689, 0],
        [-0.08867512941360473, -0.15358983549676689, 0],
      ],
      holes: [],
    },
    {
      boundary: [
        [0.5886751294136047, -0.15358983549676689, 0],
        [0.5886751294136047, 0.15358983549676689, 0],
        [0.3226497353985615, 0, 0],
      ],
      holes: [],
    },
  ]);
});
