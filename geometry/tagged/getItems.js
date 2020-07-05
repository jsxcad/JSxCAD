import { visit } from './visit.js';

export const getItems = (geometry) => {
  const items = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'item':
        return items.push(geometry);
      case 'sketch':
        // We don't look inside sketches.
        return;
      default:
        return descend();
    }
  };
  visit(geometry, op);
  return items;
};
