import Shape from './Shape.js';

export const edit = Shape.chainable(
  (editId) => (shape) => shape.untag('editId:*').tag(`editId:${editId}`)
);

Shape.registerMethod('edit', edit);
