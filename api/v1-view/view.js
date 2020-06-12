import { getLeafs, getPlans } from "@jsxcad/geometry-tagged";

import Shape from "@jsxcad/api-v1-shape";
import { writeFile } from "@jsxcad/sys";

export const view = async (
  shape,
  name = "preview",
  { width, height, view } = {}
) => {
  let index = 0;
  for (const entry of getPlans(shape.toKeptGeometry())) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        await writeFile(
          {},
          `geometry/${name}_${index++}`,
          JSON.stringify(leaf)
        );
      }
    }
  }
};

const viewMethod = function (...args) {
  return view(this, ...args);
};
Shape.prototype.view = viewMethod;

export default view;
