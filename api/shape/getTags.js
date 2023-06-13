import Shape from './Shape.js';

// This should take an op.

export const getTags = Shape.registerMethod2(
  'getTags',
  ['inputGeometry'],
  (geometry) => {
    const { tags = [] } = geometry;
    return tags;
  }
);

export default getTags;
