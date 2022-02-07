import { getCgal } from './getCgal.js';
import { toCgalTransformFromJsTransform } from './transform.js';

export const generatePackingEnvelopeForSurfaceMesh = (
  mesh,
  transform,
  offset,
  segments = 16,
  costThreshold
) => {
  try {
    const outputs = [];
    let output;
    let points;
    let exactPoints;
    getCgal().GeneratePackingEnvelopeForSurfaceMesh(
      mesh,
      toCgalTransformFromJsTransform(transform),
      offset,
      segments / 2,
      costThreshold,
      (isHole) => {
        points = [];
        exactPoints = [];
        if (isHole) {
          output.holes.push({
            points,
            exactPoints,
            holes: [],
            plane: [0, 0, 1, 0],
          });
        } else {
          output = {
            points,
            exactPoints,
            holes: [],
            plane: [0, 0, 1, 0],
          };
          outputs.push(output);
        }
      },
      (x, y, z, exactX, exactY, exactZ) => {
        points.push([x, y, z]);
        exactPoints.push([exactX, exactY, exactZ]);
      }
    );
    return outputs;
  } catch (error) {
    throw Error(error);
  }
};
