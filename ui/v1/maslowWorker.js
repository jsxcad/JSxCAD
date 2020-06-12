/* global postMessage, onmessage:writable, self */

import * as api from "@jsxcad/api-v1";
import * as convertThree from "@jsxcad/convert-threejs";
import * as sys from "@jsxcad/sys";
import { intersection, union } from "@jsxcad/api-v1-shape";
import { Hull } from "@jsxcad/api-v1-extrude";
import { clearCache } from "@jsxcad/cache";
// import { pack } from '@jsxcad/api-v1-layout';
import { toStl } from "@jsxcad/convert-stl";
import { toSvg } from "@jsxcad/convert-svg";

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    var { key, values } = question;
    clearCache();
    switch (key) {
      case "assemble":
        var inputs = values[0].map(api.Shape.fromGeometry);
        return api.Assembly(...inputs).toDisjointGeometry();
      case "bounding box":
        return api.Shape.fromGeometry(values[0]).measureBoundingBox();
      case "circle":
        return api.Circle.ofDiameter(values[0], {
          sides: values[1],
        }).toDisjointGeometry(); // {center: true, sides: values[1] }).toDisjointGeometry();
      case "color":
        if (values[1] === "Keep Out") {
          return api.Shape.fromGeometry(values[0])
            .color("Red")
            .material("keepout")
            .toDisjointGeometry();
        } else {
          return api.Shape.fromGeometry(values[0])
            .color(values[1])
            .toDisjointGeometry();
        }
      case "code":
        inputs = {};
        for (key in values[1]) {
          if (values[1][key] != null && typeof values[1][key] === "object") {
            inputs[key] = api.Shape.fromGeometry(values[1][key]);
          } else {
            inputs[key] = values[1][key];
          }
        }
        const signature =
          "{ " +
          Object.keys(api).join(", ") +
          ", " +
          Object.keys(inputs).join(", ") +
          " }";
        const foo = new Function(signature, values[0]);
        const returnVal = foo({ ...api, ...inputs });
        if (typeof returnVal === "object") {
          return returnVal.toDisjointGeometry();
        } else {
          return returnVal;
        }
      case "layout":
        console.log("Doing layout");
        const solidToSplit = api.Shape.fromGeometry(values[0]);
        var flatItems = [];
        solidToSplit.items().forEach((item) => {
          flatItems.push(item.flat().to(api.Z(0)));
        });

        console.log(flatItems);

        const laidOut = api
          .Layers(...flatItems)
          .Page({ itemMargin: values[1] });

        return laidOut.toDisjointGeometry();
      case "difference":
        return api.Shape.fromGeometry(values[0])
          .cut(api.Shape.fromGeometry(values[1]))
          .kept()
          .toDisjointGeometry();
      case "extractTag":
        return api.Shape.fromGeometry(values[0])
          .keep(values[1])
          .toKeptGeometry();
      case "extrude":
        return api.Shape.fromGeometry(values[0])
          .extrude(values[1])
          .toDisjointGeometry();
      case "hull":
        values = values.map(api.Shape.fromGeometry);
        return Hull(...values).toDisjointGeometry();
      case "intersection":
        return intersection(
          api.Shape.fromGeometry(values[0]),
          api.Shape.fromGeometry(values[1])
        ).toDisjointGeometry();
      case "rectangle":
        return api.Square(values[0], values[1]).toDisjointGeometry();
      case "Over Cut Inside Corners":
        const overcutShape = api.Shape.fromGeometry(values[0]);
        const overcutSection = overcutShape.section(api.Z());
        const toolpath = overcutSection.toolpath(values[1], {
          overcut: true,
          joinPaths: true,
        });
        const height = overcutShape.size().height;
        const sweep = toolpath.sweep(api.Circle(values[1])).extrude(height);
        return overcutShape.cut(sweep).toDisjointGeometry();
      case "render":
        var fromGeo = null;
        if (values[1] === true && values[2] === false) {
          // Solid, no wireframe
          fromGeo = api.Shape.fromGeometry(values[0]);
        } else if (values[1] === false && values[2] === true) {
          fromGeo = api.Shape.fromGeometry(values[0]).outline();
        } else if (values[1] === true && values[2] === true) {
          const intermediate = api.Shape.fromGeometry(values[0]);
          fromGeo = intermediate.with(intermediate.outline());
        } else {
          fromGeo = api.Empty(); // This should be an empty geometry
        }
        return convertThree.toThreejsGeometry(fromGeo.toDisjointGeometry());
      case "rotate":
        return api.Shape.fromGeometry(values[0])
          .rotateX(values[1])
          .rotateY(values[2])
          .rotateZ(values[3])
          .toDisjointGeometry();
      case "scale":
        return api.Shape.fromGeometry(values[0])
          .scale(values[1])
          .toDisjointGeometry();
      case "stl":
        const inflated = api.Shape.fromGeometry(values[0]).toKeptGeometry();
        const stlString = await toStl(inflated);
        return stlString;
      case "stretch":
        return api.Shape.fromGeometry(values[0])
          .scale([values[1], values[2], values[3]])
          .toDisjointGeometry();
      case "svg":
        const svgString = await toSvg(
          api.Shape.fromGeometry(values[0])
            .Union()
            .center()
            .section()
            .outline()
            .toKeptGeometry()
        );
        return svgString;
      case "stackedOutline":
        const gcodeShape = api.Shape.fromGeometry(values[0]);
        const thickness = gcodeShape.size().height;
        const toolSize = values[1];
        const numberOfPasses = values[2];
        // const speed = values[3];
        // const tabs = values[4];
        const safeHeight = values[5];

        const distPerPass = (-1 * thickness) / numberOfPasses;

        var oneProfile = gcodeShape
          .Union()
          .center()
          .section()
          .toolpath(toolSize, { joinPaths: true });

        console.log(oneProfile.geometry.paths);

        // Split each path into it's layers
        oneProfile.geometry.paths.forEach((path, index) => {
          var newPath = [];
          var i = 1;
          while (i <= numberOfPasses) {
            newPath.push([path[0][0], path[0][1], safeHeight]); // Move to the starting position before plunging
            path.forEach((point) => {
              newPath.push([point[0], point[1], point[2] + i * distPerPass]);
            });
            newPath.push([
              path[0][0],
              path[0][1],
              path[0][2] + i * distPerPass,
            ]); // Add the first point again to close the path
            i++;
          }
          const lastIndex = newPath.length - 1;
          newPath.push([
            newPath[lastIndex][0],
            newPath[lastIndex][1],
            safeHeight,
          ]); // Retract back to safe height after finishing move
          oneProfile.geometry.paths[index] = newPath;
        });

        // Join all the layers into a single continuous path
        var completePath = [[0, 0, safeHeight]];
        oneProfile.geometry.paths.forEach((path) => {
          completePath = completePath.concat(path);
        });

        console.log("Complete path");
        console.log(completePath);

        oneProfile.geometry.paths = [completePath];

        return oneProfile.toKeptGeometry();
      case "gcode":
        return "G0 would be here";
      case "outline":
        return api.Shape.fromGeometry(values[0])
          .Union()
          .center()
          .section()
          .outline()
          .toKeptGeometry();
      case "SVG Picture":
        const shape = api.Shape.fromGeometry(values[0]).center();
        const bounds = shape.measureBoundingBox();
        const cameraDistance = 6 * Math.max(...bounds[1]);
        return convertThree.toSvg(
          { view: { position: [0, 0, cameraDistance], near: 1, far: 10000 } },
          shape.rotateX(20).rotateY(-45).toDisjointGeometry()
        );
      case "size":
        return api.Shape.fromGeometry(values[0]).size();
      case "tag":
        return api.Shape.fromGeometry(values[0])
          .as(values[1])
          .toDisjointGeometry();
      case "specify":
        return api.Shape.fromGeometry(values[0])
          .Item(values[1])
          .toDisjointGeometry();
      case "translate":
        return api.Shape.fromGeometry(values[0])
          .move(values[1], values[2], values[3])
          .toDisjointGeometry();
      case "getBOM":
        return api.Shape.fromGeometry(values[0]).bom();
      case "union":
        return union(
          api.Shape.fromGeometry(values[0]),
          api.Shape.fromGeometry(values[1])
        ).toDisjointGeometry();
      default:
        return -1;
    }
  } catch (error) {
    console.log("Called with: ");
    console.log(question);
    console.log(error);
    return -1;
  }
};

const bootstrap = async () => {
  await sys.boot();
  const { ask, hear } = sys.conversation({ agent, say });
  self.ask = ask;
  onmessage = ({ data }) => hear(data);
  if (onmessage === undefined) throw Error("die");
};

bootstrap();
