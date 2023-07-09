import Shape from './Shape.js';

export const toGeometry = Shape.registerMethod3(
  'toGeometry',
  ['inputGeometry'],
  (geometry) => geometry,
  (geometry) => geometry
);
