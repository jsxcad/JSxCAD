import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const computeToolpath = (
  inputs,
  materialStart,
  resolution = 1,
  toolSize = 1,
  toolCutDepth = 1,
  annealingMax = 1,
  annealingMin = 0.01,
  annealingDecay = 0.99,
  simple = false
) =>
  withCgalGeometry('computeToolpath', inputs, (cgalGeometry, g) => {
    const status = g.ComputeToolpath(
      cgalGeometry,
      Number(materialStart),
      Number(resolution),
      Number(toolSize),
      Number(toolCutDepth),
      Number(annealingMax),
      Number(annealingMin),
      Number(annealingDecay),
      simple
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by computeToolpath'
        );
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          inputs,
          cgalGeometry.getSize(),
          inputs.length
        );
      default:
        throw new Error(`Unexpected status ${status} in computeToolpath`);
    }
  });
