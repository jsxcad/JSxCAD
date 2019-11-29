import Circle from './Circle';
import Polygon from './Polygon';
import Hershey from './Hershey';
import Path from './Path';
import Shape from './Shape';
import assemble from './assemble';
import { getPlans } from '@jsxcad/geometry-tagged';

/**
 *
 * # Plan
 *
 * Produces a plan based on marks that transform as geometry.
 *
 **/

export const Plan = ({ plan, marks = [], planes = [], tags = [], visualization }, context) => {
  let geometry = visualization === undefined ? { assembly: [] } : visualization.toKeptGeometry();
  const shape = Shape.fromGeometry({ plan, marks, planes, tags, visualization: geometry }, context);
  return shape;
};

// Radius

export const Radius = (radius = 1, center = [0, 0, 0]) =>
  Plan({
    plan: { radius },
    marks: [center],
    visualization: Circle.ofRadius(radius)
                         .outline()
                         .add(Path([0, 0, 0], [0, radius, 0]))
                         .add(Hershey(`R${radius}`).moveY(radius / 2))
                         .color('red')
  });
Plan.Radius = Radius;

export const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
           plan: { apothem },
           marks: [center],
           visualization: Circle.ofRadius(radius)
                                .outline()
                                .add(Path([0, 0, 0], [0, radius, 0]))
                                .add(Hershey(`A${apothem}`).moveY(radius / 2))
                                .color('red')
         });
}
Plan.Apothem = Apothem;

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
