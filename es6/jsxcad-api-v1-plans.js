import { Polygon, Circle, Path, Square } from './jsxcad-api-v1-shapes.js';
import { Hershey } from './jsxcad-api-v1-font.js';
import Plan, { Plan as Plan$1 } from './jsxcad-api-v1-plan.js';
import Shape$1, { Shape, assemble } from './jsxcad-api-v1-shape.js';
import { max } from './jsxcad-api-v1-math.js';
import { pack } from './jsxcad-api-v1-layout.js';

const dp2 = (number) => Math.round(number * 100) / 100;

const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
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

Plan.Apothem = Apothem;

const Diameter = (diameter = 1, center = [0, 0, 0]) => {
  const radius = diameter / 2;
  return Plan({
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
Plan.Diameter = Diameter;

const Label = (label, mark = [0, 0, 0]) => Plan({ plan: { label }, marks: [mark] });
Plan.Label = Label;

const withLabelMethod = function (...args) { return assemble(this, Plan.Label(...args)); };
Shape.prototype.withLabel = withLabelMethod;

const Length = (length) => {
  return Plan({
    plan: { length },
    visualization: Path([0, 0, 0], [0, length, 0])
        .add(Hershey(length / 10)(`L${dp2(length)}`).moveY(length / 2))
        .color('red')
  });
};
Plan.Length = Length;

const Page = ({ size, pageMargin = 5, itemMargin = 1, itemsPerPage = Infinity }, ...items) => {
  if (size) {
    // Content fits to page size.
    const [width, length] = size;
    return Plan$1({
      plan: { page: { size, margin: pageMargin } },
      content: pack(Shape$1.fromGeometry({ layers: items.map(item => item.toGeometry()) }),
                    { size, pageMargin, itemMargin, perLayout: itemsPerPage }),
      visualization:
                    Square(width, length)
                        .outline()
                        .with(Hershey(max(width, length) * 0.0125)(`Page ${width} x ${length}`).move(width / -2, (length * 1.0125) / 2))
                        .color('red')
    });
  } else {
    // Page fits to content size.
    const content = pack(Shape$1.fromGeometry({ layers: items.map(item => item.toGeometry()) }),
                         { pageMargin, itemMargin, perLayout: itemsPerPage })
        .center();
    const { width, length } = content.size();
    return Plan$1({
      plan: { page: { size, margin: pageMargin } },
      content: content,
      visualization:
                    Square(width, length)
                        .outline()
                        .with(Hershey(max(width, length) * 0.0125)(`Page ${width} x ${length}`).move(width / -2, (length * 1.0125) / 2))
                        .color('red')
    });
  }
};

Plan$1.Page = Page;

const PageMethod = function (options = {}) { return Page(options, this); };
Shape$1.prototype.Page = PageMethod;

// Radius

const Radius = (radius = 1, center = [0, 0, 0]) =>
  Plan({
    plan: { radius },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Hershey(radius / 10)(`R${dp2(radius)}`).moveY(radius / 2))
          .color('red')
  });
Plan.Radius = Radius;

const Sketch = (shape) => {
  return Plan({
    plan: { sketch: 'shape' },
    visualization: shape.outline().color('red')
  });
};
Plan.Sketch = Sketch;

Shape.prototype.sketch = function (...args) { return Sketch(this); };
Shape.prototype.withSketch = function (...args) { return assemble(this, Sketch(this)); };

const api = {
  Apothem,
  Diameter,
  Label,
  Length,
  Page,
  Radius,
  Sketch
};

export default api;
export { Apothem, Diameter, Label, Length, Page, Radius, Sketch };
