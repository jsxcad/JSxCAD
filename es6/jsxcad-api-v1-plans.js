import { Polygon, Circle, Path } from './jsxcad-api-v1-shapes.js';
import { Hershey } from './jsxcad-api-v1-font.js';
import Plan$1 from './jsxcad-api-v1-plan.js';
import { Shape, assemble } from './jsxcad-api-v1-shape.js';
import { getPlans } from './jsxcad-geometry-tagged.js';

const dp2 = (number) => Math.round(number * 100) / 100;

const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan$1({
    plan: { apothem },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Hershey(radius / 10)(`A${dp2(apothem)}`).moveY(radius / 2))
          .color('red')
  });
};

Plan$1.Apothem = Apothem;

const Diameter = (diameter = 1, center = [0, 0, 0]) => {
  const radius = diameter / 2;
  return Plan$1({
    plan: { diameter },
    marks: [center],
    visualization:
      Circle.ofDiameter(diameter)
          .outline()
          .add(Path([0, -radius, 0], [0, +radius, 0]))
          .add(Hershey(radius / 10)(`D${dp2(diameter)}`))
          .color('red')
  });
};
Plan$1.Diameter = Diameter;

const Label = (label, mark = [0, 0, 0]) => Plan$1({ plan: { label }, marks: [mark] });
Plan$1.Label = Label;

const withLabelMethod = function (...args) { return assemble(this, Plan$1.Label(...args)); };
Shape.prototype.withLabel = withLabelMethod;

const Length = (length) => {
  return Plan$1({
    plan: { length },
    visualization: Path([0, 0, 0], [0, length, 0])
        .add(Hershey(length / 10)(`L${dp2(length)}`).moveY(length / 2))
        .color('red')
  });
};
Plan$1.Length = Length;

/**
 *
 * # Plan
 *
 * Produces a plan based on marks that transform as geometry.
 *
 **/

const dp2$1 = (number) => Math.round(number * 100) / 100;

const Text = Hershey;

const Plan = ({ plan, marks = [], planes = [], tags = [], visualization }, context) => {
  let geometry = visualization === undefined ? { assembly: [] } : visualization.toKeptGeometry();
  const shape = Shape.fromGeometry({ plan, marks, planes, tags, visualization: geometry }, context);
  return shape;
};

// Radius

const Radius = (radius = 1, center = [0, 0, 0]) =>
  Plan({
    plan: { radius },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Text(radius / 10)(`R${dp2$1(radius)}`).moveY(radius / 2))
          .color('red')
  });
Plan.Radius = Radius;

const Diameter$1 = (diameter = 1, center = [0, 0, 0]) => {
  const radius = diameter / 2;
  return Plan({
    plan: { diameter },
    marks: [center],
    visualization:
      Circle.ofDiameter(diameter)
          .outline()
          .add(Path([0, -radius, 0], [0, +radius, 0]))
          .add(Text(radius / 10)(`D${dp2$1(diameter)}`))
          .color('red')
  });
};
Plan.Diameter = Diameter$1;

const Apothem$1 = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
    plan: { apothem },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Text(radius / 10)(`A${dp2$1(apothem)}`).moveY(radius / 2))
          .color('red')
  });
};
Plan.Apothem = Apothem$1;

const Length$1 = (length) => {
  return Plan({
    plan: { length },
    visualization: Path([0, 0, 0], [0, length, 0])
        .add(Text(length / 10)(`L${dp2$1(length)}`).moveY(length / 2))
        .color('red')
  });
};
Plan.Length = Length$1;

// FIX: Support outline for solids and use that for sketches.
const Sketch = (shape) => {
  return Plan({
    plan: { sketch: 'shape' },
    visualization: shape.outline().color('red')
  });
};
Plan.Sketch = Sketch;

Shape.prototype.sketch = function (...args) { return Sketch(this); };
Shape.prototype.withSketch = function (...args) { return assemble(this, Sketch(this)); };

// Labels

const Label$1 = (label, mark = [0, 0, 0]) => Plan({ plan: { label }, marks: [mark] });

Plan.Label = Label$1;

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

const withLabelMethod$1 = function (...args) { return assemble(this, Plan.Label(...args)); };
Shape.prototype.withLabel = withLabelMethod$1;

// Radius

const Radius$1 = (radius = 1, center = [0, 0, 0]) =>
  Plan$1({
    plan: { radius },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Hershey(radius / 10)(`R${dp2(radius)}`).moveY(radius / 2))
          .color('red')
  });
Plan$1.Radius = Radius$1;

const Sketch$1 = (shape) => {
  return Plan$1({
    plan: { sketch: 'shape' },
    visualization: shape.outline().color('red')
  });
};
Plan$1.Sketch = Sketch$1;

Shape.prototype.sketch = function (...args) { return Sketch$1(this); };
Shape.prototype.withSketch = function (...args) { return assemble(this, Sketch$1(this)); };

const api = {
  Apothem,
  Diameter,
  Label,
  Length,
  Plan,
  Radius: Radius$1,
  Sketch: Sketch$1
};

export default api;
export { Apothem, Diameter, Label, Length, Plan, Radius$1 as Radius, Sketch$1 as Sketch };
