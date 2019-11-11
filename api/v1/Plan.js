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
  const { plan, marks, tags } = options;
  // FIX: Add validation.
  return Shape.fromGeometry({ plan, marks, tags });
};

// Connectors

Plan.Connector = (connector, a = [0, 0, 0], b = [100, 0, 0], c = [0, 100, 0]) =>
    Plan({ plan: { connector }, marks: [a, b, c], tags: [`connector/${connector}`] });

const connectors = (geometry) => {
  const connectors = {};
  for (const entry of getPlans(geometry)) {
    if (entry.plan.connector && (entry.tags === undefined || !entry.tags.includes('compose/non-positive'))) {
      connectors[entry.plan.connector] = entry;
    }
  }
  return connectors;
};

const withConnectorMethod = function (...args) { return assemble(this, Plan.Connector(...args)); };
const connectorsMethod = function () { return connectors(this.toKeptGeometry()); };

Shape.prototype.connectors = connectorsMethod;
Shape.prototype.withConnector = withConnectorMethod;

// Labels

Plan.Label = (label, mark = [0, 0, 0]) => Plan({ plan: { label }, marks: [mark] });

const labels = (geometry) => {
  const labels = {};
  for (const { plan, marks } of getPlans(geometry)) {
    if (plan.label) {
      labels[plan.label] = marks[0];
    }
  }
  return labels;
};

const withLabelMethod = function (...args) { return assemble(this, Plan.Label(...args)); };
const labelsMethod = function () { return labels(this.toKeptGeometry()); };

Shape.prototype.labels = labelsMethod;
Shape.prototype.withLabel = withLabelMethod;
