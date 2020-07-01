import { visit } from './visit';

export const getItems = (geometry) => {
  const items = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'item':
        return items.push(geometry);
      default:
        return descend();
    }
  };
  visit(geometry, op);
  return items;
};
