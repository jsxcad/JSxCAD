/* global postMessage, onmessage:writable, self */

import * as api from '@jsxcad/api-v1';
import * as convertThree from '@jsxcad/convert-threejs';
import * as sys from '@jsxcad/sys';
import { add, normalize, scale, subtract } from '@jsxcad/math-vec3';
import { Hull } from '@jsxcad/api-v1-extrude';
import { clearCache } from '@jsxcad/cache';
import { toStl } from '@jsxcad/convert-stl';
import { toSvg } from '@jsxcad/convert-svg';

function computeXYSegmentLength(p1, p2) {
  const segmentLength = Math.sqrt(
    (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1])
  );
  return segmentLength;
}

function computeXYPathLength(path) {
  var pathLength = 0;
  var k = 1;
  while (k < path.length) {
    const p1 = path[k - 1];
    const p2 = path[k];
    pathLength = pathLength + computeXYSegmentLength(p1, p2);
    k++;
  }

  return pathLength;
}

// Move all the points in a range to a new z-value
function shiftRange(path, start, end, height) {
  var generatedPath = [path[0]];
  var n = 1;
  while (n < path.length) {
    // Measure the distance with the new point
    const nextTotalLength = computeXYPathLength(
      generatedPath.concat([path[n]])
    );
    if (nextTotalLength > start && nextTotalLength < end) {
      var shiftedPoint = path[n];
      shiftedPoint[2] = height;
      generatedPath.push(shiftedPoint);
    } else {
      generatedPath.push(path[n]);
    }
    n++;
  }
  return path;
}

// Insert an elevation change a given distance into a path
function insertPointByDist(path, target, height) {
  var generatedPath = [path[0]];
  // Walk through each point and see if adding it would excede distance
  var k = 1;
  while (k < path.length) {
    // Measure the distance with the new point
    const nextTotalLength = computeXYPathLength(
      generatedPath.concat([path[k]])
    );
    if (nextTotalLength > target) {
      const prior = computeXYPathLength(generatedPath);
      const newSegmentLength = target - prior;

      const normalVector = normalize(subtract(path[k], path[k - 1]));
      const scaled = scale(newSegmentLength, normalVector);

      var newPoint = add(path[k - 1], scaled);
      newPoint[2] = height; // Set the new point's z value

      generatedPath.push(newPoint);

      // Fastforward to the end
      while (k < path.length) {
        generatedPath.push(path[k]);
        k++;
      }

      return generatedPath;
    }
    generatedPath.push(path[k]);
    k++;
  }
  // This return catches it if no point is added
  return generatedPath;
}

// Add tabs to a pass
function addTabs(pass, baselineHeight, thickness, tabs, toolSize) {
  const tabHeight = thickness * (-2 / 3);
  console.log(tabHeight);
  // Compute path length
  const totalPathLength = computeXYPathLength(pass.concat([pass[0]]));
  const tabWidth = 4 * toolSize;
  const spaceBetweenTabs = (totalPathLength - tabWidth * tabs) / tabs;
  const bias = totalPathLength / 8 - tabWidth / 2; // Bias the tabs so on a square they appear on the middle of the edges, not at the corners

  var m = 1;
  while (m <= tabs) {
    const tabBegin = m * spaceBetweenTabs + (m - 1) * tabWidth - bias;
    const tabEnd = m * spaceBetweenTabs + (m - 1) * tabWidth + tabWidth - bias;
    pass = insertPointByDist(pass, tabBegin, baselineHeight);
    pass = insertPointByDist(pass, tabBegin, tabHeight);
    pass = shiftRange(pass, tabBegin, tabEnd, tabHeight);
    pass = insertPointByDist(pass, tabEnd, tabHeight);
    pass = insertPointByDist(pass, tabEnd, baselineHeight);
    m++;
  }

  return pass;
}

// Essentially moves a pass to the correct depth
function generatePass(path, depth, hasTabs, thickness, tabs, toolSize) {
  var pass = [];
  // Add all the rest of the points in the pass
  path.forEach((point) => {
    pass.push([point[0], point[1], depth]);
  });
  pass.push([path[0][0], path[0][1], depth]); // Add the first point again to close the path

  if (hasTabs) {
    pass = addTabs(pass, depth, thickness, tabs, toolSize);
  }

  return pass;
}

const say = (message) => postMessage(message);
const agent = async ({ ask, question }) => {
  try {
    var { key, values } = question;
    const shape = (nth) => api.Shape.fromGeometry(values[nth]);
    clearCache();
    switch (key) {
      case 'assemble':
        var inputs = values[0].map(api.Shape.fromGeometry);
        return api.Assembly(...inputs).toKeptGeometry();
      case 'bounding box':
        return api.Shape.fromGeometry(values[0]).measureBoundingBox();
      case 'circle':
        return api.Circle.ofDiameter(values[0], {
          sides: values[1],
        }).toKeptGeometry(); // {center: true, sides: values[1] }).toKeptGeometry();
      case 'color':
        if (values[1] === 'Keep Out') {
          return api.Shape.fromGeometry(values[0])
            .color('Red')
            .material('keepout')
            .toKeptGeometry();
        } else {
          return api.Shape.fromGeometry(values[0])
            .color(values[1])
            .toKeptGeometry();
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
        const signature =
          '{ ' +
          Object.keys(api).join(', ') +
          ', ' +
          Object.keys(inputs).join(', ') +
          ' }';
        const foo = new Function(signature, values[0]);
        const returnVal = foo({ ...api, ...inputs });
        if (typeof returnVal === 'object') {
          return returnVal.toKeptGeometry();
        } else {
          return returnVal;
        }
      case 'layout':
        console.log('Doing layout');
        const solidToSplit = api.Shape.fromGeometry(values[0]);
        var flatItems = [];
        solidToSplit.items().forEach((item) => {
          flatItems.push(item.flat().to(api.Z(0)));
        });

        console.log(flatItems);

        const laidOut = api
          .Layers(...flatItems)
          .Page({ itemMargin: values[1] });

        return laidOut.toKeptGeometry();
      case 'difference':
        return api.Shape.fromGeometry(values[0])
          .cut(api.Shape.fromGeometry(values[1]))
          .kept()
          .toKeptGeometry();
      case 'extractTag':
        return api.Shape.fromGeometry(values[0])
          .keep(values[1])
          .noVoid()
          .noPlan()
          .toKeptGeometry();
      case 'extrude':
        return api.Shape.fromGeometry(values[0])
          .extrude(values[1])
          .toKeptGeometry();
      case 'hull':
        values = values.map(api.Shape.fromGeometry);
        return Hull(...values).toKeptGeometry();
      case 'intersection':
        return shape(0).cut(shape(1)).toDisjointGeometry();
      case 'rectangle':
        return api.Square(values[0], values[1]).toKeptGeometry();
      case 'Over Cut Inside Corners':
        const overcutShape = api.Shape.fromGeometry(values[0]);
        const overcutSection = overcutShape.section(api.Z());
        const toolpath = overcutSection.toolpath(values[1], {
          overcut: true,
          joinPaths: true,
        });
        const height = overcutShape.size().height;
        const sweep = toolpath.sweep(api.Circle(values[1])).extrude(height);
        return overcutShape.cut(sweep).toKeptGeometry();
      case 'render':
        var fromGeo = api.Empty(); // This should be an empty geometry;

        try {
          if (values[1] === true && values[2] === false) {
            // Solid, no wireframe
            fromGeo = api.Shape.fromGeometry(values[0]);
          } else if (values[1] === false && values[2] === true) {
            fromGeo = api.Shape.fromGeometry(values[0]).outline();
          } else if (values[1] === true && values[2] === true) {
            const intermediate = api.Shape.fromGeometry(values[0]);
            fromGeo = intermediate.with(intermediate.outline());
          }
        } catch (err) {
          console.log("Can't display in worker thread");
          console.log(err);
        }
        return convertThree.toThreejsGeometry(fromGeo.toKeptGeometry());
      case 'rotate':
        return api.Shape.fromGeometry(values[0])
          .rotateX(values[1])
          .rotateY(values[2])
          .rotateZ(values[3])
          .toKeptGeometry();
      case 'stl':
        const inflated = api.Shape.fromGeometry(values[0]).toKeptGeometry();
        const stlString = await toStl(inflated);
        return stlString;
      case 'svg':
        const svgString = await toSvg(
          api.Shape.fromGeometry(values[0])
            .Union()
            .center()
            .section()
            .outline()
            .toKeptGeometry()
        );
        return svgString;
      case 'stackedOutline':
        const gcodeShape = api.Shape.fromGeometry(values[0]);
        const thickness = gcodeShape.size().height;
        const toolSize = values[1];
        const numberOfPasses = values[2];
        // const speed = values[3];
        const tabs = values[4];
        const safeHeight = values[5];

        const distPerPass = (-1 * thickness) / numberOfPasses;

        var slice = gcodeShape
          .Union()
          .center()
          .section()
          .toolpath(toolSize, { joinPaths: true });

        // Split each path into it's layers
        slice.geometry.paths.forEach((path, index) => {
          // This generates all the passes for a single cut (ie a single outside or inside profile)
          var plungePoint = path[0];
          plungePoint[2] = safeHeight;
          var newPath = [[0, 0, safeHeight], plungePoint];
          var i = 1;
          while (i <= numberOfPasses) {
            // Paths in the bottom 1/3 have tabs
            var tabsInThisPass = false;
            if (i >= numberOfPasses * (2 / 3)) {
              tabsInThisPass = true;
            }

            newPath = newPath.concat(
              generatePass(
                path,
                i * distPerPass,
                tabsInThisPass,
                thickness,
                tabs,
                toolSize
              )
            );

            i++;
          }

          const lastIndex = newPath.length - 1;
          newPath.push([
            newPath[lastIndex][0],
            newPath[lastIndex][1],
            safeHeight,
          ]); // Retract back to safe height after finishing move
          slice.geometry.paths[index] = newPath; // Replaces the existing path with the new multi level one
        });

        // A shape can have many paths which need to be cut (ie inside and outside profiles. This joins them all into one
        var completePath = [[0, 0, safeHeight]];
        slice.geometry.paths.forEach((path) => {
          completePath = completePath.concat(path);
        });

        slice.geometry.paths = [completePath];

        return slice.toKeptGeometry();
      case 'gcode':
        return 'G0 would be here';
      case 'outline':
        return api.Shape.fromGeometry(values[0])
          .Union()
          .center()
          .section()
          .outline()
          .toKeptGeometry();
      /*
      case 'SVG Picture':
        const shape = api.Shape.fromGeometry(values[0]).center();
        const bounds = shape.measureBoundingBox();
        const cameraDistance = 6 * Math.max(...bounds[1]);
        return convertThree.toSvg(
          { view: { position: [0, 0, cameraDistance], near: 1, far: 10000 } },
          shape.rotateX(20).rotateY(-45).toKeptGeometry()
        );
*/
      case 'size':
        return shape(0).size();
      case 'tag':
        return shape(0).as(values[1]).toDisjointGeometry();
      case 'specify':
        return shape(0).Item(values[1]).DisjointGeometry();
      case 'translate':
        return shape(0)
          .move(values[1], values[2], values[3])
          .DisjointGeometry();
      case 'getBOM':
        return api.Shape.fromGeometry(values[0]).bom();
      case 'union':
        return shape(0).add(shape(1)).toDisjointGeometry();
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

const bootstrap = async () => {
  await sys.boot();
  const { ask, hear } = sys.conversation({ agent, say });
  self.ask = ask;
  onmessage = ({ data }) => hear(data);
  if (onmessage === undefined) throw Error('die');
};

bootstrap();
