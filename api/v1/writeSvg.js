import { polygonsToSvg } from '@jsxcad/convert-svg';
import { writeFileSync } from '@jsxcad/sys';

export const writeSvg = ({ path }, ...shapes) => {
  const polygons = shapes.map(shape => {
    if (shape instanceof Array) {
      return shape;
    } else {
      return shape.toPolygons({});
    }
  });

  writeFileSync(path, () => polygonsToSvg({}, [].concat(...polygons)));
};
