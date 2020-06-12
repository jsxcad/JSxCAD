// title      : Example 001
// author     : OpenSCAD.org, adapted by Rene K. Mueller
// license    : MIT License
// description: example001.scad ported to OpenJSCAD.org
// file       : example001.jscad

function radiusFromDiameter(d) {
  return d / 2;
}

function rotcy(rot, r, h) {
  return rotate(rot, Cylinder(r, h));
}

function example001() {
  var size = 50;
  var hole = 25;
  var radius = radiusFromDiameter(hole);
  var height = radiusFromDiameter(size * 2.5);

  return difference(
    Sphere({ r: radiusFromDiameter(size) }),
    rotcy([0, 0, 0], radius, height),
    rotcy([90, 0, 0], radius, height),
    rotcy([0, 90, 0], radius, height)
  );
}

const solid = example001();
solid.writeStl("tmp/example001.stl");
solid.writeThreejsPage({
  cameraPosition: [0, 0, 120],
  path: "tmp/example001.html",
});
