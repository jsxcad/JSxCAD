import Plan from '@jsxcad/api-v1-plan';
import Shape from '@jsxcad/api-v1-shape';

export const Label = (label, mark = [0, 0, 0]) =>
  Plan({ plan: { label }, marks: [mark] });
Plan.Label = Label;

const withLabelMethod = function (...args) {
  return this.with(Plan.Label(...args));
};
Shape.prototype.withLabel = withLabelMethod;

export default Label;
