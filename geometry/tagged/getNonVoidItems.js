import { isNotVoid } from "./isNotVoid";
import { visit } from "./visit";

export const getNonVoidItemsItems = (geometry) => {
  const items = [];
  const op = (geometry, descend) => {
    if (geometry.item && isNotVoid(geometry)) {
      items.push(geometry);
    } else {
      descend();
    }
  };
  visit(geometry, op);
  return items;
};
