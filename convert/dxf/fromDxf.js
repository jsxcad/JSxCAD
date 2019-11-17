import DxfParser from 'dxf-parser';
import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { scale } from '@jsxcad/geometry-tagged';

export const fromDxf = async (options = {}, data) => {
  const parser = new DxfParser();
  const dxf = parser.parseSync(data);
console.log(`QQ/dxf: ${JSON.stringify(dxf)}`);
  const assembly = [];
  const paths = [];
  for (const entity of dxf.entities) {
    const { layer = 0, colorIndex = 0, color = 0 } = entity;
    switch (entity.type) {
      case 'LINE':
      case 'LWPOLYLINE':
      case 'POLYLINE': {
        const { shape, vertices } = entity;
        const path = entity.vertices.map(({ x = 0, y = 0, z = 0 }) => [x, y, z]);
        if (shape !== true) {
          // Shape false means closed.
          path.unshift(null);
        }
        paths.push(path);
        break;
      }
      case 'INSERT': {
        const { x = 0, y = 0, z = 0 } = entity.position;
        const { xScale, rotation } = entity;
        break;
      }
      case 'CIRCLE': {
        const { x = 0, y = 0, z = 0 } = entity.center;
        const { radius = 1 } = entity;
        assembly.push(scale([radius, radius, radius], buildRegularPolygon(32)));
        break;
      }
      default:
        throw Error(`die: entity type [${entity.type}]`);
    }
  }
  assembly.push({ paths });
  return { assembly };
}

export default fromDxf;
