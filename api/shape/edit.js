import Shape from './Shape.js';

export const edit = (editId) => (shape) =>
  shape.untag('editId:*').tag(`editId:${editId}`);

Shape.registerMethod('edit', edit);
