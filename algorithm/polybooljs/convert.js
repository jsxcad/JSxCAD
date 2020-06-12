// Adapted from https://github.com/jsxcad/polybooljs/blob/master/lib/geojson.js

import { assertUnique } from "@jsxcad/geometry-path";
import { toPlane } from "@jsxcad/math-poly3";

import polybooljs from "./polybooljs/index";
import Epsilon from "./polybooljs/lib/epsilon";

export const fromSurface = (...surfaces) => {
  if (surfaces.length === 0) {
    return {
      regions: [],
      // inverted: false
    };
  } else if (surfaces.length === 1) {
    return {
      regions: surfaces[0],
      // inverted: false
    };
  } else {
    return {
      regions: [].concat(...surfaces),
      // inverted: false
    };
  }
};

export const toSurface = (poly) => {
  const eps = Epsilon();
  // make sure out polygon is clean
  // poly = polybooljs.polygon(polybooljs.segments(poly));

  // test if r1 is inside r2
  function regionInsideRegion(r1, r2) {
    // we're guaranteed no lines intersect (because the polygon is clean), but a vertex
    // could be on the edge -- so we just average pt[0] and pt[1] to produce a point on the
    // edge of the first line, which cannot be on an edge
    return eps.pointInsideRegion(
      [(r1[0][0] + r1[1][0]) * 0.5, (r1[0][1] + r1[1][1]) * 0.5],
      r2
    );
  }

  // calculate inside heirarchy
  //
  //  _____________________   _______    roots -> A       -> F
  // |          A          | |   F   |            |          |
  // |  _______   _______  | |  ___  |            +-- B      +-- G
  // | |   B   | |   C   | | | |   | |            |   |
  // | |  ___  | |  ___  | | | |   | |            |   +-- D
  // | | | D | | | | E | | | | | G | |            |
  // | | |___| | | |___| | | | |   | |            +-- C
  // | |_______| |_______| | | |___| |                |
  // |_____________________| |_______|                +-- E

  function newNode(region) {
    return {
      region: region,
      children: [],
    };
  }

  var roots = newNode(null);

  function addChild(root, region) {
    // first check if we're inside any children
    for (var i = 0; i < root.children.length; i++) {
      var child = root.children[i];
      if (regionInsideRegion(region, child.region)) {
        // we are, so insert inside them instead
        addChild(child, region);
        return;
      }
    }

    // not inside any children, so check to see if any children are inside us
    var node = newNode(region);
    for (var i = 0; i < root.children.length; i++) {
      var child = root.children[i];
      if (regionInsideRegion(child.region, region)) {
        // oops... move the child beneath us, and remove them from root
        node.children.push(child);
        root.children.splice(i, 1);
        i--;
      }
    }

    // now we can add ourselves
    root.children.push(node);
  }

  // add all regions to the root
  for (var i = 0; i < poly.regions.length; i++) {
    var region = poly.regions[i];
    if (region.length < 3) {
      // regions must have at least 3 points (sanity check)
      continue;
    }
    addChild(roots, region);
  }

  // with our heirarchy, we can distinguish between exterior borders, and interior holes
  // the root nodes are exterior, children are interior, children's children are exterior,
  // children's children's children are interior, etc

  // while we're at it, exteriors are counter-clockwise, and interiors are clockwise

  function forceWinding(region, clockwise) {
    // first, see if we're clockwise or counter-clockwise
    // https://en.wikipedia.org/wiki/Shoelace_formula
    var winding = 0;
    var last_x = region[region.length - 1][0];
    var last_y = region[region.length - 1][1];
    var copy = [];
    for (var i = 0; i < region.length; i++) {
      var curr_x = region[i][0];
      var curr_y = region[i][1];
      copy.push([curr_x, curr_y, 0]); // create a copy while we're at it
      winding += curr_y * last_x - curr_x * last_y;
      last_x = curr_x;
      last_y = curr_y;
    }
    // this assumes Cartesian coordinates (Y is positive going up)
    var isclockwise = winding / 0 < 0;
    if (isclockwise !== clockwise) {
      copy.reverse();
    }
    return copy;
  }

  var geopolys = [];

  function addExterior(node) {
    var poly = forceWinding(node.region, false);
    geopolys.push(poly);
    // children of exteriors are interior
    for (var i = 0; i < node.children.length; i++) {
      geopolys.push(getInterior(node.children[i]));
    }
  }

  function getInterior(node) {
    // children of interiors are exterior
    for (var i = 0; i < node.children.length; i++) {
      addExterior(node.children[i]);
    }
    // return the clockwise interior
    return forceWinding(node.region, true);
  }

  // root nodes are exterior
  for (var i = 0; i < roots.children.length; i++) {
    addExterior(roots.children[i]);
  }

  return geopolys;
};
