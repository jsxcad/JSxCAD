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

export const shapeToConnect = Symbol('shapeToConnect');

const isNan = (v) => typeof v === 'number' && isNaN(v);

export const Connector = (connector, a = [0, 0, 0], b = [100, 0, 0], c = [0, 100, 0]) => {
  if (isNan(a) || isNan(b) || isNan(c)) {
    throw Error('die');
  }
  return Plan({ plan: { connector }, marks: [a, b, c], tags: [`connector/${connector}`] });
};

Plan.Connector = Connector;

const connectors = (shape) => {
  const connectors = {};
  for (const entry of getPlans(shape.toKeptGeometry())) {
    if (entry.plan.connector && (entry.tags === undefined || !entry.tags.includes('compose/non-positive'))) {
      connectors[entry.plan.connector] = Shape.fromGeometry(entry, { [shapeToConnect]: shape });
    }
  }
  return connectors;
};

const connector = (geometry, id) => connectors(geometry)[id];

const connectorMethod = function (id) { return connector(this, id); };
Shape.prototype.connector = connectorMethod;

const connectorsMethod = function () { return connectors(this); };
Shape.prototype.connectors = connectorsMethod;

const withConnectorMethod = function (...args) { return assemble(this, Plan.Connector(...args)); };
Shape.prototype.withConnector = withConnectorMethod;

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
