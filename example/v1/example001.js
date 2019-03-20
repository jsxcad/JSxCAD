import { cylinder, difference, rotate, sphere, writeStl, writeThreejsPage } from '@jsxcad/api-v1';

Error.stackTraceLimit = Infinity;

// title      : Example 001
// author     : OpenSCAD.org, adapted by Rene K. Mueller
// license    : MIT License
// description: example001.scad ported to OpenJSCAD.org
// file       : example001.jscad

function radiusFromDiameter (d) {
  return d / 2;
}

function rotcy (rot, r, h) {
  return rotate(rot, cylinder({ r: r, h: h, center: true }));
}

function example001 () {
  var size = 50;
  var hole = 25;
  var radius = radiusFromDiameter(hole);
  var height = radiusFromDiameter(size * 2.5);

  return difference(
    sphere({ r: radiusFromDiameter(size) }),
    rotcy([0, 0, 0], radius, height),
    rotcy([90, 0, 0], radius, height),
    rotcy([0, 90, 0], radius, height)
  );
}

export const main = () => {
  const solid = example001();
  writeStl({ path: 'tmp/example001.stl' }, solid);
  writeThreejsPage({ cameraPosition: [0, 0, 120], path: 'tmp/example001.html' }, solid);
};
