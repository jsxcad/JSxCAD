import { assert, assertPoints } from './assert';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

export const fromPath = ({ points }) => Shape.fromPathToZ0Surface(points);

export const polygon = dispatch(
  'polygon',
  // polygon([[0,0],[3,0],[3,3]])
  (points) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => fromPath({ path: points });
  },
  // polygon({ points: [[0, 0], [3, 0], [3, 3]] })
  ({ points }) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => fromPath({ path: points });
  });

export default polygon;
