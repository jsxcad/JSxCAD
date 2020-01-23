import { Hershey } from '@jsxcad/api-v1-font';
import { Plan } from '@jsxcad/api-v1-plan';
import Shape from '@jsxcad/api-v1-shape';
import { Square } from '@jsxcad/api-v1-shapes';
import { max } from '@jsxcad/api-v1-math';
import { pack } from '@jsxcad/api-v1-layout';

export const Page = ({ size = [100, 100], pageMargin = 5, itemMargin = 1, itemsPerPage = Infinity }, ...items) => {
  const [width, length] = size;
  return Plan({
    plan: { page: { size, margin: pageMargin } },
    content: pack(Shape.fromGeometry({ layers: items.map(item => item.toGeometry()) }),
                  { size, pageMargin, itemMargin, perLayout: itemsPerPage }),
    visualization:
                  Square(width, length)
                      .outline()
                      .with(Hershey(max(width, length) * 0.0125)(`Page ${width} x ${length}`).move(width / -2, (length * 1.0125) / 2))
                      .color('red')
  });
};

Plan.Page = Page;

export default Page;
