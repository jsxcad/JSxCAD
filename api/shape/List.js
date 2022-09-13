import Shape from './Shape.js';

export const List = (...shapes) => shapes;

export const list =
  (...shapes) =>
  (shape) =>
    List(...shapes);

Shape.registerMethod('list', list);

Shape.List = List;

export default List;
