import { direction, fromPoints as toLineFromPoints } from '@jsxcad/math-line2';

import { distance } from '@jsxcad/math-vec2';

const EPS = 1e-5;

const interpolateXForY = (point1, point2, y) => {
  let f1 = y - point1[1];
  let f2 = point2[1] - point1[1];
  if (f2 < 0) {
    f1 = -f1;
    f2 = -f2;
  }
  let t;
  if (f1 <= 0) {
    t = 0.0;
  } else if (f1 >= f2) {
    t = 1.0;
  } else if (f2 < 1e-10) { // FIXME Should this be EPS?
    t = 0.5;
  } else {
    t = f1 / f2;
  }
  let result = point1[0] + t * (point2[0] - point1[0]);
  return result;
};

const fnNumberSort = (a, b) => {
  return a - b;
};

const insertSorted = (array, element, comparefunc) => {
  let leftBound = 0;
  let rightBound = array.length;
  while (rightBound > leftBound) {
    let textIndex = Math.floor((leftBound + rightBound) / 2);
    let testElement = array[textIndex];
    let compareresult = comparefunc(element, testElement);
    if (compareresult > 0) {
      leftBound = textIndex + 1;
    } else {
      rightBound = textIndex;
    }
  }
  array.splice(leftBound, 0, element);
};

const binY = (yCoordinateBins, y) => {
  const yCoordinateBin = Math.floor(y * yCoordinateBinningFactor);
  if (yCoordinateBins.has(yCoordinateBin)) {
    return yCoordinateBins.get(yCoordinateBin);
  } else if (yCoordinateBins.has(yCoordinateBin + 1)) {
    return yCoordinateBins.get(yCoordinateBin + 1);
  } else if (yCoordinateBins.has(yCoordinateBin - 1)) {
    return yCoordinateBins.get(yCoordinateBin - 1);
  } else {
    yCoordinateBins.set(yCoordinateBin, y);
    return y;
  }
};

const X = 0;
const Y = 1;
const yCoordinateBinningFactor = 1.0 / EPS * 10;

/**
 * Retesselation for a z0Surface.
 */

export const binPolygons = (sourcePolygons) => {
  const normalizedPolygons = [];
  const polygonTopVertexIndexes = []; // array of indexes of topmost vertex per polygon
  const topYToPolygonIndexes = {};
  const topYToPolygon = new Map();
  const yCoordinateToPolygonIndexes = {};

  const yCoordinateBins = new Map();
  const yCoordinateToPolygons = new Map();

  // Make a list of all encountered y coordinates
  // And build a map of all polygons that have a vertex at a certain y coordinate:
  for (const polygon of sourcePolygons) {
    const polygonIndex = normalizedPolygons.length;
    let points = [];
    let minIndex = -1;
    if (polygon.length > 0) {
      let minY = Infinity;
      let maxY = -Infinity;
      for (let index = 0; index < polygon.length; index++) {
        const point = polygon[index];
        // perform binning of y coordinates: If we have multiple vertices very
        // close to each other, give them the same y coordinate:
        const y = binY(yCoordinateBins, point[Y]);
        points.push([point[X], y]);
        if (y < minY) {
          minY = y;
          minIndex = index;
        }
        if (y > maxY) {
          maxY = y;
        }
      }
      if (minY >= maxY) {
        // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
        continue;
      }
      if (topYToPolygon.has(minY)) {
        // Look for a duplicate polygon.
      }
      for (let index = 0; index < polygon.length; index++) {
        const y = polygon[index][Y];
        if (!(y in yCoordinateToPolygonIndexes)) {
          yCoordinateToPolygonIndexes[y] = {};
        }
        yCoordinateToPolygonIndexes[y][polygonIndex] = true;
        if (!yCoordinateToPolygons.has(y)) {
          yCoordinateToPolygons.set(y, []);
        }
        yCoordinateToPolygons.get(y).push(polygon);
      }
      if (minY >= maxY) {
        // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
        points = []
        // numVertices = 0
        minIndex = -1
      } else {
        if (!(minY in topYToPolygonIndexes)) {
          topYToPolygonIndexes[minY] = [];
        }
        topYToPolygonIndexes[minY].push(polygonIndex);
        if (!topYToPolygon.has(minY)) {
          topYToPolygon.set(minY, polygon);
        }
      }
    }
    // We push empty polygons on here, too.
    // reverse the vertex order:
    // PROVE: Why are we reversing the order?
    points.reverse();
    minIndex = polygon.length - minIndex - 1;
    // These are keyed by the polygon index.
    normalizedPolygons.push(points);
    polygonTopVertexIndexes.push(minIndex);
  }

  const yCoordinates = [...yCoordinateToPolygons.keys()].sort(fnNumberSort);

  return {
    yCoordinates,
    yCoordinateToPolygons,
    yCoordinateToPolygonIndexes,
    topYToPolygonIndexes,
    normalizedPolygons,
    polygonTopVertexIndexes
  };
};

const recomputeActivePolygons = ({ activePolygons, polygonIndexesWithCorner, normalizedPolygons, yCoordinate }) => {
  for (let activePolygonIndex = 0; activePolygonIndex < activePolygons.length; activePolygonIndex++) {
    const activePolygon = activePolygons[activePolygonIndex];
    const polygonIndex = activePolygon.polygonIndex;
    if (polygonIndexesWithCorner[polygonIndex]) {
      // this active polygon has a corner at this y coordinate:
      const polygon = normalizedPolygons[polygonIndex];
      const numVertices = polygon.length;
      let newLeftVertexIndex = activePolygon.leftVertexIndex;
      let newRightVertexIndex = activePolygon.rightVertexIndex;
      // See if we need to increase leftVertexIndex or decrease rightVertexIndex:
      while (true) {
        let nextLeftVertexIndex = newLeftVertexIndex + 1;
        if (nextLeftVertexIndex >= numVertices) nextLeftVertexIndex = 0;
        if (polygon[nextLeftVertexIndex][1] !== yCoordinate) break;
        newLeftVertexIndex = nextLeftVertexIndex;
      }
      let nextRightVertexIndex = newRightVertexIndex - 1;
      if (nextRightVertexIndex < 0) nextRightVertexIndex = numVertices - 1;
      if (polygon[nextRightVertexIndex][1] === yCoordinate) {
        newRightVertexIndex = nextRightVertexIndex;
      }
      if ((newLeftVertexIndex !== activePolygon.leftVertexIndex) && (newLeftVertexIndex === newRightVertexIndex)) {
        // We have increased leftVertexIndex or decreased rightVertexIndex, and now they point to the same vertex
        // This means that this is the bottom point of the polygon. We'll remove it:
        activePolygons.splice(activePolygonIndex, 1);
        activePolygonIndex -= 1;
      } else {
        activePolygon.leftVertexIndex = newLeftVertexIndex;
        activePolygon.rightVertexIndex = newRightVertexIndex;
        activePolygon.topLeft = polygon[newLeftVertexIndex];
        activePolygon.topright = polygon[newRightVertexIndex];
        let nextLeftVertexIndex = newLeftVertexIndex + 1;
        if (nextLeftVertexIndex >= numVertices) nextLeftVertexIndex = 0;
        activePolygon.bottomLeft = polygon[nextLeftVertexIndex];
        let nextRightVertexIndex = newRightVertexIndex - 1;
        if (nextRightVertexIndex < 0) nextRightVertexIndex = numVertices - 1;
        activePolygon.bottomRight = polygon[nextRightVertexIndex];
      }
    } // if polygon has corner here
  } // for activePolygonIndex
};

const findNextYCoordinate = ({ yIndex, yCoordinates, yCoordinate, topYToPolygonIndexes, normalizedPolygons, polygonTopVertexIndexes, activePolygons }) => {
  let nextYCoordinate;
  if (yIndex >= yCoordinates.length - 1) {
    // last row, all polygons must be finished here:
    return null;
  }
  nextYCoordinate = Number(yCoordinates[yIndex + 1]);
  const middleYCoordinate = 0.5 * (yCoordinate + nextYCoordinate);
  // update activePolygons by adding any polygons that start here:
  const startingPolygonIndexes = topYToPolygonIndexes[yCoordinate];
  for (let polygonIndexKey in startingPolygonIndexes) {
    const polygonIndex = startingPolygonIndexes[polygonIndexKey];
    const polygon = normalizedPolygons[polygonIndex];
    const numVertices = polygon.length;
    const topVertexIndex = polygonTopVertexIndexes[polygonIndex];
    // the top of the polygon may be a horizontal line. In that case topVertexIndex can point to any point on this line.
    // Find the left and right topmost vertices which have the current y coordinate:
    let topLeftVertexIndex = topVertexIndex;
    while (true) {
      let i = topLeftVertexIndex + 1;
      if (i >= numVertices) i = 0;
      if (polygon[i][1] !== yCoordinate) break;
      if (i === topVertexIndex) break; // should not happen, but just to prevent endless loops
      topLeftVertexIndex = i;
    }
    let topRightVertexIndex = topVertexIndex;
    while (true) {
      let i = topRightVertexIndex - 1;
      if (i < 0) i = numVertices - 1;
      if (polygon[i][1] !== yCoordinate) break;
      if (i === topLeftVertexIndex) break; // should not happen, but just to prevent endless loops
      topRightVertexIndex = i;
    }
    let nextLeftVertexIndex = topLeftVertexIndex + 1;
    if (nextLeftVertexIndex >= numVertices) nextLeftVertexIndex = 0;
    let nextRightVertexIndex = topRightVertexIndex - 1;
    if (nextRightVertexIndex < 0) nextRightVertexIndex = numVertices - 1;
    const newActivePolygon = {
      polygonIndex,
      leftVertexIndex: topLeftVertexIndex,
      rightVertexIndex: topRightVertexIndex,
      topLeft: polygon[topLeftVertexIndex],
      topright: polygon[topRightVertexIndex],
      bottomLeft: polygon[nextLeftVertexIndex],
      bottomRight: polygon[nextRightVertexIndex]
    };
    insertSorted(activePolygons, newActivePolygon, (el1, el2) => {
      const x1 = interpolateXForY(el1.topLeft, el1.bottomLeft, middleYCoordinate);
      const x2 = interpolateXForY(el2.topLeft, el2.bottomLeft, middleYCoordinate);
      if (x1 > x2) return 1;
      if (x1 < x2) return -1;
      return 0;
    });
  }
  return nextYCoordinate;
};

const buildOutputPolygons = ({ activePolygons, yCoordinate, nextYCoordinate, newPolygonRow, yIndex, previousPolygonRow, destinationPolygons }) => {
  // Now activePolygons is up to date

  // Build the output polygons for the next row in newPolygonRow:
  for (let activepolygonKey in activePolygons) {
    const activePolygon = activePolygons[activepolygonKey];

    let x = interpolateXForY(activePolygon.topLeft, activePolygon.bottomLeft, yCoordinate);
    const topLeft = [x, yCoordinate];
    x = interpolateXForY(activePolygon.topright, activePolygon.bottomRight, yCoordinate);
    const topright = [x, yCoordinate];
    x = interpolateXForY(activePolygon.topLeft, activePolygon.bottomLeft, nextYCoordinate);
    const bottomLeft = [x, nextYCoordinate];
    x = interpolateXForY(activePolygon.topright, activePolygon.bottomRight, nextYCoordinate);
    const bottomRight = [x, nextYCoordinate];
    const outPolygon = {
      topLeft,
      topright,
      bottomLeft,
      bottomRight,
      leftLine: toLineFromPoints(topLeft, bottomLeft),
      rightLine: toLineFromPoints(bottomRight, topright)
    };
    if (newPolygonRow.length > 0) {
      const previousOutPolygon = newPolygonRow[newPolygonRow.length - 1];
      const d1 = distance(outPolygon.topLeft, previousOutPolygon.topright);
      const d2 = distance(outPolygon.bottomLeft, previousOutPolygon.bottomRight);
      if ((d1 < EPS) && (d2 < EPS)) {
        // we can join this polygon with the one to the left:
        outPolygon.topLeft = previousOutPolygon.topLeft;
        outPolygon.leftLine = previousOutPolygon.leftLine;
        outPolygon.bottomLeft = previousOutPolygon.bottomLeft;
        newPolygonRow.splice(newPolygonRow.length - 1, 1);
      }
    }
    newPolygonRow.push(outPolygon);
  }

  // Merge the old row with the next row.
  if (yIndex > 0) {
    // try to match the new polygons against the previous row:
    const previousContinuedIndexes = {};
    const matchedIndexes = {};
    for (let i = 0; i < newPolygonRow.length; i++) {
      const thisPolygon = newPolygonRow[i];
      for (let ii = 0; ii < previousPolygonRow.length; ii++) {
        if (!matchedIndexes[ii]) { // not already processed?
          // We have a match if the sidelines are equal or if the top coordinates
          // are on the sidelines of the previous polygon
          const previousPolygon = previousPolygonRow[ii];
          if (distance(previousPolygon.bottomLeft, thisPolygon.topLeft) < EPS) {
            if (distance(previousPolygon.bottomRight, thisPolygon.topright) < EPS) {
              // Yes, the top of this polygon matches the bottom of the previous:
              matchedIndexes[ii] = true;
              // Now check if the joined polygon would remain convex:
              const v1 = direction(thisPolygon.leftLine);
              const v2 = direction(previousPolygon.leftLine);
              const d1 = v1[0] - v2[0];

              const v3 = direction(thisPolygon.rightLine);
              const v4 = direction(previousPolygon.rightLine);
              const d2 = v3[0] - v4[0];

              const leftLineContinues = Math.abs(d1) < EPS;
              const rightLineContinues = Math.abs(d2) < EPS;
              const leftLineIsConvex = leftLineContinues || (d1 >= 0);
              const rightLineIsConvex = rightLineContinues || (d2 >= 0);
              if (leftLineIsConvex && rightLineIsConvex) {
                // yes, both sides have convex corners:
                // This polygon will continue the previous polygon
                thisPolygon.outPolygon = previousPolygon.outPolygon;
                thisPolygon.leftLineContinues = leftLineContinues;
                thisPolygon.rightLineContinues = rightLineContinues;
                previousContinuedIndexes[ii] = true;
              }
              break;
            }
          }
        }
      }
    }
    for (let ii = 0; ii < previousPolygonRow.length; ii++) {
      if (!previousContinuedIndexes[ii]) {
        // polygon ends here
        // Finish the polygon with the last point(s):
        const previousPolygon = previousPolygonRow[ii];
        previousPolygon.outPolygon.rightpoints.push(previousPolygon.bottomRight);
        if (distance(previousPolygon.bottomRight, previousPolygon.bottomLeft) > EPS) {
          // polygon ends with a horizontal line:
          previousPolygon.outPolygon.leftpoints.push(previousPolygon.bottomLeft);
        }
        // reverse the left half so we get a counterclockwise circle:
        previousPolygon.outPolygon.leftpoints.reverse();
        const polygon = previousPolygon.outPolygon.rightpoints.concat(previousPolygon.outPolygon.leftpoints);
        destinationPolygons.push(polygon);
      }
    }
  }

  // Prepare for the next new row.
  for (let i = 0; i < newPolygonRow.length; i++) {
    const thisPolygon = newPolygonRow[i];
    if (!thisPolygon.outPolygon) {
      // polygon starts here:
      thisPolygon.outPolygon = {
        leftpoints: [],
        rightpoints: []
      };
      thisPolygon.outPolygon.leftpoints.push(thisPolygon.topLeft);
      if (distance(thisPolygon.topLeft, thisPolygon.topright) > EPS) {
        // we have a horizontal line at the top:
        thisPolygon.outPolygon.rightpoints.push(thisPolygon.topright);
      }
    } else {
      // continuation of a previous row
      if (!thisPolygon.leftLineContinues) {
        thisPolygon.outPolygon.leftpoints.push(thisPolygon.topLeft);
      }
      if (!thisPolygon.rightLineContinues) {
        thisPolygon.outPolygon.rightpoints.push(thisPolygon.topright);
      }
    }
  }
  previousPolygonRow = newPolygonRow;

  return previousPolygonRow;
};

export const retessellate = (sourcePolygons) => {
  if (sourcePolygons.length < 2) {
    return sourcePolygons;
  }
  let { yCoordinates, yCoordinateToPolygonIndexes, topYToPolygonIndexes, normalizedPolygons, polygonTopVertexIndexes } = binPolygons(sourcePolygons);
  const destinationPolygons = [];
  // Now we will iterate over all y coordinates, from lowest to highest y coordinate
  // activePolygons: source polygons that are 'active', i.e. intersect with our y coordinate
  //   Is sorted so the polygons are in left to right order
  // Each element in activePolygons has these properties:
  //        polygonIndex: the index of the source polygon (i.e. an index into the sourcepolygons
  //                      and normalizedPolygons arrays)
  //        leftVertexIndex: the index of the vertex at the left side of the polygon (lowest x)
  //                         that is at or just above the current y coordinate
  //        rightVertexIndex: dito at right hand side of polygon
  //        topLeft, bottomLeft: coordinates of the left side of the polygon crossing the current y coordinate
  //        topright, bottomRight: coordinates of the right hand side of the polygon crossing the current y coordinate
  let activePolygons = [];
  let previousPolygonRow = [];
  for (let yIndex = 0; yIndex < yCoordinates.length; yIndex++) {
    const newPolygonRow = [];
    const yCoordinate = yCoordinates[yIndex];

    // update activePolygons for this y coordinate:
    // - Remove any polygons that end at this y coordinate
    // - update leftVertexIndex and rightVertexIndex (which point to the current vertex index
    //   at the the left and right side of the polygon
    // Iterate over all polygons that have a corner at this y coordinate:
    const polygonIndexesWithCorner = yCoordinateToPolygonIndexes[yCoordinate];
    recomputeActivePolygons({ activePolygons, polygonIndexesWithCorner, normalizedPolygons, yCoordinate });
    const nextYCoordinate = findNextYCoordinate({ yIndex, yCoordinates, yCoordinate, topYToPolygonIndexes, normalizedPolygons, polygonTopVertexIndexes, activePolygons });
    if (nextYCoordinate === null) {
      activePolygons = [];
    }
    previousPolygonRow = buildOutputPolygons({ activePolygons, yCoordinate, nextYCoordinate, newPolygonRow, yIndex, previousPolygonRow, destinationPolygons });
  }
  return destinationPolygons;
};
