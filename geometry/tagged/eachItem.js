import { visit } from "./visit";

export const eachItem = (geometry, op) => {
  const walk = (geometry, descend) => {
    op(geometry);
    descend();
  };
  visit(geometry, walk);
};
