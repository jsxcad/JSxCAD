/*
import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const makeOcctBox = (xLength = 1, yLength = 1, zLength = 1) =>
  withCgalGeometry('makeOcctBox', [], (geometry, g) => {
    const status = g.MakeOcctBox(geometry, xLength, yLength, zLength);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by makeOcctBox');
      case STATUS_OK:
        return fromCgalGeometry(geometry, [], 1)[0];
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });

export const makeOcctSphere = (diameter) =>
  withCgalGeometry('makeOcctSphere', [], (geometry, g) => {
    const status = g.MakeOcctSphere(geometry, diameter);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by makeOcctSphere'
        );
      case STATUS_OK:
        return fromCgalGeometry(geometry, [], 1)[0];
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
*/
