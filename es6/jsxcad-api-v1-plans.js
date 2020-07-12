import { Polygon, Circle, Path } from './jsxcad-api-v1-shapes.js';
import { Hershey } from './jsxcad-api-v1-font.js';
import Plan from './jsxcad-api-v1-plan.js';
import Shape from './jsxcad-api-v1-shape.js';

const dp2 = (number) => Math.round(number * 100) / 100;

const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
    plan: { apothem },
    marks: [center],
    visualization: Circle.ofRadius(radius)
      .outline()
      .add(Path([0, 0, 0], [0, radius, 0]))
      .add(Hershey(radius / 10)(`A${dp2(apothem)}`).moveY(radius / 2))
      .color('red'),
  });
};

Plan.Apothem = Apothem;

const Diameter = (diameter = 1, center = [0, 0, 0]) => {
  const radius = diameter / 2;
  return Plan({
    plan: { diameter },
    marks: [center],
    visualization: Circle.ofDiameter(diameter)
      .outline()
      .add(Path([0, -radius, 0], [0, +radius, 0]))
      .add(Hershey(radius / 10)(`D${dp2(diameter)}`))
      .color('red'),
  });
};
Plan.Diameter = Diameter;

const Label = (label, mark = [0, 0, 0]) =>
  Plan({ plan: { label }, marks: [mark] });
Plan.Label = Label;

const withLabelMethod = function (...args) {
  return this.with(Plan.Label(...args));
};
Shape.prototype.withLabel = withLabelMethod;

const Length = (length) => {
  return Plan({
    plan: { length },
    visualization: Path([0, 0, 0], [0, length, 0])
      .add(Hershey(length / 10)(`L${dp2(length)}`).moveY(length / 2))
      .color('red'),
  });
};
Plan.Length = Length;

// Radius

const Radius = (radius = 1, center = [0, 0, 0]) =>
  Plan({
    plan: { radius },
    marks: [center],
    visualization: Circle.ofRadius(radius)
      .outline()
      .add(Path([0, 0, 0], [0, radius, 0]))
      .add(Hershey(radius / 10)(`R${dp2(radius)}`).moveY(radius / 2))
      .color('red'),
  });
Plan.Radius = Radius;

const api = {
  Apothem,
  Diameter,
  Label,
  Length,
  Radius,
};

export default api;
export { Apothem, Diameter, Label, Length, Radius };
