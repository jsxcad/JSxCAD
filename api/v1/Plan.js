import { Shape } from './Shape';
import { assemble } from './assemble';
import { getPlans } from '@jsxcad/geometry-tagged';

/**
 *
 * # Plan
 *
 * Produces a plan based on marks that transform as geometry.
 *
 **/

export const Plan = ({ plan, marks, planes, tags }, context) => {
  const shape = Shape.fromGeometry({ plan, marks, planes, tags }, context);
  return shape;
};

// Radius

export const Radius = (label, radius = 1, center = [0, 0, 0]) => Plan({ plan: { radius }, marks: [center] });
Plan.Radius = Radius;

// Labels

export const Label = (label, mark = [0, 0, 0]) => Plan({ plan: { label }, marks: [mark] });

Plan.Label = Label;

const labels = (geometry) => {
  const labels = {};
  for (const { plan, marks } of getPlans(geometry)) {
    if (plan.label) {
      labels[plan.label] = marks[0];
    }
  }
  return labels;
};

const labelsMethod = function () { return labels(this.toKeptGeometry()); };
Shape.prototype.labels = labelsMethod;

const withLabelMethod = function (...args) { return assemble(this, Plan.Label(...args)); };
Shape.prototype.withLabel = withLabelMethod;

export default Plan;
