import { isNotVoid } from "./isNotVoid";
import { visit } from "./visit";

export const eachNonVoidItem = (geometry, op) => {
  const walk = (geometry, descend) => {
    if (isNotVoid(geometry)) {
      op(geometry);
      descend();
    }
  };
  visit(geometry, walk);
};
