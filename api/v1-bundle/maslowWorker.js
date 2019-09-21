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
        const inputs = values[0].map(api.Shape.fromGeometry);
        if (values[1]) {
          return api.assemble(...inputs).drop('cutAway').toKeptGeometry();
        } else {
          return api.assemble(...inputs).toDisjointGeometry();
        }
      case 'bounding box':
        return api.Shape.fromGeometry(values[0]).measureBoundingBox();
      case 'circle':
        return api.Circle({ radius: values[0] / 2, center: true, sides: values[1] }).toDisjointGeometry();
      case 'color':
        return api.Shape.fromGeometry(values[0]).color(values[1]).toDisjointGeometry();
      case 'getLayoutSvgs':
        // Extract shapes
        var items = api.Shape.fromGeometry(values[0]).toItems();

        // Center each one and grab a .svg of it
        var svgArray = [];
        var item;
        for (item in items) {
          const svgString = await toSvg({}, items[item].center().section().outline().toKeptGeometry());
          svgArray.push(svgString);
        }

        return svgArray;
      case 'difference':
        return api.difference(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
      case 'extractTag':
        return api.Shape.fromGeometry(values[0]).keep(values[1]).toKeptGeometry();
      case 'extrude':
        return api.Shape.fromGeometry(values[0]).extrude({ height: values[1] }).toDisjointGeometry();
      case 'hull':
        values = values.map(api.Shape.fromGeometry);
        return api.hull(...values).toDisjointGeometry();
      case 'intersection':
        return api.intersection(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
      case 'rectangle':
        return api.Square(values[0], values[1]).toDisjointGeometry();
      case 'Overcut Inside Corners':
        const overcutShape = api.Shape.fromGeometry(values[0]);
        const toolpath = overcutShape.toolpath(4);
        console.log("Toolpath: ")
        console.log(toolpath)
        console.log("Outline: ")
        console.log(overcutShape.outline());
        const sweep = api.Circle(4).sweep(toolpath)
        return toolpath.toDisjointGeometry();
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
        const svgString = await toSvg({}, api.Shape.fromGeometry(values[0]).center().section().outline().toKeptGeometry());
        return svgString;
      case 'SVG Picture':
        const shape = api.Shape.fromGeometry(values[0]).center();
        const bounds = shape.measureBoundingBox();
        const cameraDistance = 6 * Math.max(...bounds[1]);
        return convertThree.toSvg({ view: { position: [0, 0, cameraDistance], near: 1, far: 10000 } }, shape.rotateX(20).rotateY(-45).toDisjointGeometry());
      case 'tag':
        return api.Shape.fromGeometry(values[0]).as(values[1]).toDisjointGeometry();
      case 'specify':
        return api.Shape.fromGeometry(values[0]).specify([values[1]]).toDisjointGeometry();
      case 'translate':
        return api.Shape.fromGeometry(values[0]).translate([values[1], values[2], values[3]]).toDisjointGeometry();
      case 'getBOM':
        return api.Shape.fromGeometry(values[0]).toBillOfMaterial();
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
