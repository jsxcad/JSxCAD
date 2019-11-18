import { scale, translate } from '@jsxcad/geometry-tagged';

import DxfParser from 'dxf-parser';
import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { toTagFromRgbInt } from '@jsxcad/algorithm-color';

export const fromDxf = async (options = {}, data) => {
  const parser = new DxfParser();
  const dxf = parser.parseSync(data);
  const assembly = [];
  for (const entity of dxf.entities) {
    const { handle, layer } = entity;
    let tags = [];
    if (handle !== undefined) {
      tags.push(`user/dxf/handle:${handle}`);
    }
    if (layer !== undefined) {
      tags.push(`user/dxf/layer:${layer}`);
      if (dxf.tables && dxf.tables.layer && dxf.tables.layer.layers) {
        const color = dxf.tables.layer.layers[layer].color;
        if (color !== undefined) {
          tags.push(toTagFromRgbInt(color));
        }
      }
    }
    if (tags.length === 0) tags = undefined;
    switch (entity.type) {
      case 'LINE':
      case 'LWPOLYLINE':
      case 'POLYLINE': {
        const { shape, vertices } = entity;
        const path = vertices.map(({ x = 0, y = 0, z = 0 }) => [x, y, z]);
        if (shape !== true) {
          // Shape false means closed.
          path.unshift(null);
        }
        assembly.push({ paths: [path], tags });
        break;
      }
      case 'INSERT': {
        // const { x = 0, y = 0, z = 0 } = entity.position;
        // const { xScale, rotation } = entity;
        break;
      }
      case 'CIRCLE': {
        const { x = 0, y = 0, z = 0 } = entity.center;
        const { radius = 1 } = entity;
        assembly.push(translate([x, y, z], scale([radius, radius, radius], { ...buildRegularPolygon(32), tags })));
        break;
      }
      default:
        throw Error(`die due to entity: ${JSON.stringify(entity)}`);
    }
  }
  return { assembly };
};

export default fromDxf;
