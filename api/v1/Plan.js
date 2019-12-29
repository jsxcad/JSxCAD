import Circle from './Circle';
import Hershey from './Hershey';
import Path from './Path';
import Polygon from './Polygon';
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

const dp2 = (number) => Math.round(number * 100) / 100;

const Text = Hershey;

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
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Text(radius / 10)(`R${dp2(radius)}`).moveY(radius / 2))
          .color('red')
  });
Plan.Radius = Radius;

export const Diameter = (diameter = 1, center = [0, 0, 0]) => {
  const radius = diameter / 2;
  return Plan({
    plan: { diameter },
    marks: [center],
    visualization:
      Circle.ofDiameter(diameter)
          .outline()
          .add(Path([0, -radius, 0], [0, +radius, 0]))
          .add(Text(radius / 10)(`D${dp2(diameter)}`))
          .color('red')
  });
};
Plan.Diameter = Diameter;

export const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
    plan: { apothem },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Text(radius / 10)(`A${dp2(apothem)}`).moveY(radius / 2))
          .color('red')
  });
};
Plan.Apothem = Apothem;

export const Length = (length) => {
  return Plan({
    plan: { length },
    visualization: Path([0, 0, 0], [0, length, 0])
        .add(Text(length / 10)(`L${dp2(length)}`).moveY(length / 2))
        .color('red')
  });
};
Plan.Length = Length;

// FIX: Support outline for solids and use that for sketches.
export const Sketch = (shape) => {
  return Plan({
    plan: { sketch: 'shape' },
    visualization: shape.outline().color('red')
  });
};
Plan.Sketch = Sketch;

Shape.prototype.sketch = function (...args) { return Sketch(this); };
Shape.prototype.withSketch = function (...args) { return assemble(this, Sketch(this)); };

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
