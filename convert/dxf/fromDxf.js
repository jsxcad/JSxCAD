import { scale, translate } from '@jsxcad/geometry';

import DxfParser from 'dxf-parser';
import { toTagFromRgbInt } from '@jsxcad/algorithm-color';

const fromAngleRadians = (radians) => [Math.cos(radians), Math.sin(radians)];

const buildRegularPolygon = (sides = 32) => {
  let points = [];
  for (let i = 0; i < sides; i++) {
    let radians = (2 * Math.PI * i) / sides;
    let [x, y] = fromAngleRadians(radians);
    points.push([x, y, 0]);
  }
  return points;
};

export const fromDxf = async (data) => {
  const parser = new DxfParser();
  const dxf = parser.parseSync(data);
  const assembly = [];
  for (const entity of dxf.entities) {
    const { handle, layer } = entity;
    let tags = [];
    if (handle !== undefined) {
      tags.push(`user:dxf:handle:${handle}`);
    }
    if (layer !== undefined) {
      tags.push(`user:dxf:layer:${layer}`);
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
        assembly.push({ type: 'paths', paths: [path], tags });
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
        assembly.push(
          translate(
            [x, y, z],
            scale([radius, radius, radius], {
              ...buildRegularPolygon(32),
              tags,
            })
          )
        );
        break;
      }
      default:
        throw Error(`die due to entity: ${JSON.stringify(entity)}`);
    }
  }
  return { type: 'assembly', content: assembly };
};

export default fromDxf;
