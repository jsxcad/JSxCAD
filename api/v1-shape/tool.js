import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-tool';

export const tool = (shape, name) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName(name), [], shape.toGeometry()));

const toolMethod = function (name) {
  return tool(this, name);
};
Shape.prototype.tool = toolMethod;

export default tool;
