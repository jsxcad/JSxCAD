/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as convertThree from '@jsxcad/convert-threejs';
import * as sys from '@jsxcad/sys';

import { intersection, union } from '@jsxcad/api-v1-shape';
import { clearCache } from '@jsxcad/cache';
import { hull } from '@jsxcad/api-v1-extrude';
import { pack } from '@jsxcad/api-v1-layout';
import { toStl } from '@jsxcad/convert-stl';
import { toSvg } from '@jsxcad/convert-svg';

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  console.log('This ran');
  try {
    var { key, values } = question;
    clearCache();
    switch (key) {
      case 'assemble':
        var inputs = values[0].map(api.Shape.fromGeometry);
        if (values[1]) {
          return api.Assembly(...inputs).drop('cutAway').toKeptGeometry();
        } else {
          return api.Assembly(...inputs).toDisjointGeometry();
        }
      case 'bounding box':
        return api.Shape.fromGeometry(values[0]).measureBoundingBox();
      case 'circle':
        return api.Circle.ofDiameter(values[0], { sides: values[1] }).toDisjointGeometry();// {center: true, sides: values[1] }).toDisjointGeometry();
      case 'color':
        if (values[1] === 'Keep Out') {
          return api.Shape.fromGeometry(values[0]).color('Red').material('keepout').toDisjointGeometry();
        } else {
          return api.Shape.fromGeometry(values[0]).color(values[1]).toDisjointGeometry();
        }
      case 'code':
        inputs = {};
        for (key in values[1]) {
          if (values[1][key] != null && typeof values[1][key] === 'object') {
            inputs[key] = api.Shape.fromGeometry(values[1][key]);
          } else {
            inputs[key] = values[1][key];
          }
        }
        const signature = '{ ' + Object.keys(api).join(', ') + ', ' + Object.keys(inputs).join(', ') + ' }';
        const foo = new Function(signature, values[0]);
        const returnVal = foo({ ...api, ...inputs });
        if (typeof returnVal === 'object') {
          return returnVal.toDisjointGeometry();
        } else {
          return returnVal;
        }
      case 'getLayoutSvgs':
        // Extract shapes
        let items = api.Shape.fromGeometry(values[0]).toItems();
        const sheetX = values[2];
        const sheetY = values[3];
        const [packed, unpacked] = pack({ size: [sheetX, sheetY], margin: values[1] }, ...items.map(
          x => x.flat().to(api.Z()))
        );
        console.log(unpacked);
        return api.Assembly(...packed).toDisjointGeometry();
      case 'difference':
        return api.Shape.fromGeometry(values[0]).cut(api.Shape.fromGeometry(values[1])).kept().toDisjointGeometry();
      case 'extractTag':
        return api.Shape.fromGeometry(values[0]).keep(values[1]).toKeptGeometry();
      case 'extrude':
        return api.Shape.fromGeometry(values[0]).extrude(values[1]).toDisjointGeometry();
      case 'hull':
        values = values.map(api.Shape.fromGeometry);
        return hull(...values).toDisjointGeometry();
      case 'intersection':
        return intersection(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
      case 'rectangle':
        return api.Square(values[0], values[1]).toDisjointGeometry();
      case 'Over Cut Inside Corners':
        console.log('Overcutting corners');
        const overcutShape = api.Shape.fromGeometry(values[0]);
        const overcutSection = overcutShape.section(api.Z());
        const toolpath = overcutSection.toolpath(values[1], { overcut: true, joinPaths: true });
        const height = overcutShape.size().height;
        const sweep = toolpath.sweep(api.Circle(values[1])).extrude(height);
        return overcutShape.cut(sweep).toDisjointGeometry();
      case 'render':
        var fromGeo = null;
        if (values[1] === true && values[2] === false) { // Solid, no wireframe
          fromGeo = api.Shape.fromGeometry(values[0]);
        } else if (values[1] === false && values[2] === true) {
          fromGeo = api.Shape.fromGeometry(values[0]).wireframe();
        } else if (values[1] === true && values[2] === true) {
          const intermediate = api.Shape.fromGeometry(values[0]);
          fromGeo = intermediate.with(intermediate.wireframe());
        } else {
          fromGeo = api.Shape.fromGeometry([]); // This should be an empty geometry
        }
        return convertThree.toThreejsGeometry(fromGeo.toDisjointGeometry());
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
        return api.Shape.fromGeometry(values[0]).move(values[1], values[2], values[3]).toDisjointGeometry();
      case 'getBOM':
        return api.Shape.fromGeometry(values[0]).toBillOfMaterial();
      case 'union':
        return union(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry();
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
