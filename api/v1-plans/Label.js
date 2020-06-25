import { Shape, assemble } from '@jsxcad/api-v1-shape';

import Plan from '@jsxcad/api-v1-plan';

export const Label = (label, mark = [0, 0, 0]) =>
  Plan({ plan: { label }, marks: [mark] });
Plan.Label = Label;

const withLabelMethod = function (...args) {
  return assemble(this, Plan.Label(...args));
};
Shape.prototype.withLabel = withLabelMethod;

export default Label;
