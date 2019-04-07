import { polygonsToSvg } from '../../algorithm/svg/polygonsToSvg';
import { writeFileSync } from '@jsxcad/sys';

export const writeSvg = ({ path }, ...shapes) => {
  console.log("writeSvg() ran, and was called with:");
  console.log(shapes);
  //for (const shape of shapes) {
    const shape = shapes[0];
    console.log("Loop: ");
    console.log(shapes);
    console.log(shape.toPolygons());
    const svg = polygonsToSvg({}, shape.toPolygons());
    console.log(svg);
  //}
  
  
    
   writeFileSync(path,() => polygonsToSvg({}, shape.toPolygons()),{});
};
