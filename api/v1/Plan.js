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

export const Plan = (options = {}) => {
  const { plan, marks } = options;
  // FIX: Add validation.
  return Shape.fromGeometry({ plan, marks });
};

const labels = (geometry) => {
  const labels = {};
  for (const { plan, marks } of getPlans(geometry)) {
    if (plan.label) {
      labels[plan.label] = marks[0];
    }
  }
  return labels;
};

Plan.Label = (label, mark = [0, 0, 0]) => Plan({ plan: { label }, marks: [mark] });

const withLabelMethod = function (label) { return assemble(this, Plan.Label(label)); };

const labelsMethod = function () { return labels(this.toKeptGeometry()); };

Shape.prototype.labels = labelsMethod;
Shape.prototype.withLabel = withLabelMethod;
