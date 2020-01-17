import { visit } from './visit';

export const getItems = (geometry) => {
  const items = [];
  const op = (geometry, descend) => {
    if (geometry.item) {
      items.push(geometry);
    } else {
      descend();
    }
  };
  visit(geometry, op);
  return items;
};
