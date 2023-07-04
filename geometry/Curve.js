import { Link, Loop } from './link.js';

import { CurveInterpolator } from 'curve-interpolator';
import { Points } from './Point.js';
import { toCoordinates } from './toCoordinates.js';

export const Curve = (
  coordinates,
  implicitSteps = 20,
  { steps = implicitSteps } = {},
  { closed }
) => {
  const approximateCoordinates = coordinates.map(([x = 0, y = 0, z = 0]) => [
    x,
    y,
    z,
  ]);
  const interpolator = new CurveInterpolator(approximateCoordinates, {
    closed,
    tension: 0.2,
    alpha: 0.5,
  });
  const points = interpolator.getPoints(steps);
  if (closed) {
    return Loop([Points(points)]);
  } else {
    return Link([Points(points)]);
  }
};

export const curve = (geometry, coordinates, implicitSteps, options, modes) =>
  Curve(
    [...toCoordinates(geometry), ...coordinates],
    implicitSteps,
    options,
    modes
  );
