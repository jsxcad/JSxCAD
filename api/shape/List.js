import Shape from './Shape.js';

export const List = (...values) => values;

export const list = Shape.registerMethod3(
  'list',
  ['values'],
  (values) => values,
  (values) => values
);

Shape.List = List;

export default List;
