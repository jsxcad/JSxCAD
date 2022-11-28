import Shape from './Shape.js';

export const getTags = Shape.registerMethod(
  'getTags',
  (tags = []) =>
    async (shape) => {
      const { tags = [] } = await shape.toGeometry();
      return tags;
    }
);

export default getTags;
