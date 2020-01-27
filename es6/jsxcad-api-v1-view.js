import './jsxcad-api-v1-plans.js';
import { Layers } from './jsxcad-api-v1-shapes.js';
import Shape from './jsxcad-api-v1-shape.js';
import { writeFile } from './jsxcad-sys.js';
import { getPlans, getLeafs } from './jsxcad-geometry-tagged.js';

const preview = async (shape, name = 'preview', { width, height, view } = {}) => {
  const output = Layers(...shape.leafs(l => l.Page())).Page().toKeptGeometry();
  return writeFile({}, `geometry/${name}`, JSON.stringify(output.item.content));
};

const previewMethod = function (...args) { return preview(this, ...args); };
Shape.prototype.preview = previewMethod;

const view = async (shape, name = 'preview', { width, height, view } = {}) => {
  let index = 0;
  for (const entry of getPlans(shape.toKeptGeometry())) {
    if (entry.plan.page) {
      for (let leaf of getLeafs(entry.content)) {
        await writeFile({}, `geometry/${name}_${index++}`, JSON.stringify(leaf));
      }
    }
  }
};

const viewMethod = function (...args) { return view(this, ...args); };
Shape.prototype.view = viewMethod;

const api = { preview, view };

export default api;
export { preview, view };
