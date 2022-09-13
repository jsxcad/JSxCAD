import Shape from './Shape.js';

export const List = (...shapes) => shapes;

export const list =
  (...shapes) =>
  (shape) =>
    List(...shapes);

Shape.List = List;

export default List;
