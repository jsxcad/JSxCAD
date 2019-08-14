/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as convertThree from '@jsxcad/convert-threejs';
import * as sys from '@jsxcad/sys';
import { toStl } from '@jsxcad/convert-stl';
import { toSvg } from '@jsxcad/convert-svg';

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    var { key, values } = question;
    switch (key) {
      case 'assemble':
        values = values.map(api.Shape.fromGeometry);
        return api.assemble(...values).drop('cutAway').toKeptGeometry();
      case 'bounding box':
        return api.Shape.fromGeometry(values[0]).measureBoundingBox();
      case 'circle':
        return api.Circle({ radius: values[0] / 2, center: true, sides: values[1] }).toDisjointGeometry();
      case 'color':
        return api.Shape.fromGeometry(values[0]).color(values[1]).toDisjointGeometry();
      case 'difference':
        return api.difference(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
      case 'cutAway':
        return api.Shape.fromGeometry(values[0]).as('cutAway').toDisjointGeometry();
      case 'extrude':
        return api.Shape.fromGeometry(values[0]).extrude({ height: values[1] }).toDisjointGeometry();
      case 'hull':
        values = values.map(api.Shape.fromGeometry);
        return api.hull(...values).toDisjointGeometry();
      case 'intersection':
        return api.intersection(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
      case 'rectangle':
        return api.Square(values[0], values[1]).toDisjointGeometry();
      case 'regular polygon':
        return api.circle({ radius: values[0], center: true, resolution: values[1] }).toDisjointGeometry();
      case 'render':
        return convertThree.toThreejsGeometry(api.Shape.fromGeometry(values).toDisjointGeometry());
      case 'rotate':
        return api.Shape.fromGeometry(values[0]).rotateX(values[1]).rotateY(values[2]).rotateZ(values[3]).toDisjointGeometry();
      case 'scale':
        return api.Shape.fromGeometry(values[0]).scale(values[1]).toDisjointGeometry();
      case 'stl':
        const inflated = api.Shape.fromGeometry(values[0]).toKeptGeometry();
        const stlString = await toStl({}, inflated);
        return stlString;
      case 'stretch':
        return api.Shape.fromGeometry(values[0]).scale([values[1], values[2], values[3]]).toDisjointGeometry();
      case 'svg':
        return toSvg({}, api.Shape.fromGeometry(values[0]).center().crossSection());
      case 'SVG Picture':
        const shape = api.Shape.fromGeometry(values[0]).center();
        const bounds = shape.measureBoundingBox();
        const cameraDistance = 6 * Math.max(...bounds[1]);
        return convertThree.toSvg({ view: { position: [0, 0, cameraDistance], near: 1, far: 10000 } }, shape.rotateX(20).rotateY(-45).toDisjointGeometry());
      case 'tag':
        return api.Shape.fromGeometry(values[0]).as(values[1]).toDisjointGeometry();
      case 'translate':
        return api.Shape.fromGeometry(values[0]).translate([values[1], values[2], values[3]]).toDisjointGeometry();
      case 'union':
        return api.union(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
      default:
        return -1;
    }
  } catch (error) {
    console.log('Called with: ');
    console.log(question);
    console.log(error);
    return -1;
  }
};
const { ask, hear } = sys.conversation({ agent, say });
self.ask = ask;
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
