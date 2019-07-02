/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as sys from '@jsxcad/sys';
import * as convertThree from '@jsxcad/convert-threejs'
import * as convertSvg from '@jsxcad/convert-svg'
import * as convertStl from '@jsxcad/convert-stl'

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    var {key, values} = question
    switch(key){
        case "assemble":
            values = values.map(api.Shape.fromGeometry)
            return api.assemble(...values).toDisjointGeometry()
            break
        case "bounding box":
            return api.Shape.fromGeometry(values[0]).measureBoundingBox()
            break
        case "circle":
            return api.circle({radius: values[0], center: true, resolution: values[1]}).toDisjointGeometry()
            break
        case "difference":
            return api.difference(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry()
            break
        case "extrude":
            return api.Shape.fromGeometry(values[0]).extrude({height: values[1]}).toDisjointGeometry()
            break
        case "hull":
            values = values.map(api.Shape.fromGeometry)
            return api.hull(...values).toDisjointGeometry()
            break
        case "intersection":
            return api.intersection(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry()
            break
        case "rectangle":
            return api.square(values[0],values[1]).toDisjointGeometry()
            break
        case "regular polygon":
            return api.circle({radius: values[0], center: true, resolution: values[1]}).toDisjointGeometry()
            break
        case "render":
            return convertThree.toThreejsGeometry(api.Shape.fromGeometry(values).toDisjointGeometry())
            break
        case "rotate":
            return api.Shape.fromGeometry(values[0]).rotateX(values[1]).rotateY(values[2]).rotateZ(values[3]).toDisjointGeometry()
            break
        case "scale":
            return api.Shape.fromGeometry(values[0]).scale(values[1]).toDisjointGeometry()
            break
        case "stl":
            return convertStl.toStl({}, api.Shape.fromGeometry(values[0]).toDisjointGeometry())
            break
        case "stretch":
            return api.Shape.fromGeometry(values[0]).scale([values[1], values[2], values[3]]).toDisjointGeometry()
            break
        case "svg":
            const crossSection = api.Shape.fromGeometry(values[0]).center().crossSection().toDisjointGeometry()
            return convertSvg.toSvg({}, crossSection)
            break
        case "SVG Picture":
            const shape = api.Shape.fromGeometry(values[0]).center()
            const bounds = shape.measureBoundingBox()
            const cameraDistance = 6*Math.max(...bounds[1])
            return convertThree.toSvg({view: { position: [0, 0, cameraDistance], near: 1, far: 10000}}, shape.rotateX(20).rotateY(-45).toDisjointGeometry())
        case "tag":
            return api.Shape.fromGeometry(values[0]).as(values[1]).toDisjointGeometry()
            break
        case "translate":
            return api.Shape.fromGeometry(values[0]).translate([values[1], values[2], values[3]]).toDisjointGeometry()
            break
        case "union":
            return api.union(api.Shape.fromGeometry(values[0]), api.Shape.fromGeometry(values[1])).toDisjointGeometry()
            break
        default:
            return -1
    }
  }
  catch(error){
    console.log(error)
    return -1
  }
};
const { ask, hear } = sys.conversation({ agent, say });
self.ask = ask;
onmessage = ({ data }) => hear(data);
if (onmessage === undefined) throw Error('die');
