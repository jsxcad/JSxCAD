import { distance } from './vector.js';
import { toCoordinates } from './toCoordinates.js';

export const computeGeneralizedDiameter = (geometry) => {
  const coordinates = toCoordinates(geometry);
  let maximumDiameter = 0;
  for (let a of coordinates) {
    for (let b of coordinates) {
      const diameter = distance(a, b);
      if (diameter > maximumDiameter) {
        maximumDiameter = diameter;
      }
    }
  }
  return maximumDiameter;
};
