import Shape from './Shape.js';

export const List = (...shapes) => shapes;

export const list = Shape.registerMethod2(
  'list',
  ['values'],
  (values) => values
);

Shape.List = List;

export default List;
