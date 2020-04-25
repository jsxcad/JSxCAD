import { dot, length, scale } from './jsxcad-math-vec3.js';
import { toPlane as toPlane$1, flip } from './jsxcad-math-poly3.js';
import { pushWhenValid } from './jsxcad-geometry-polygons.js';

// This produces a half-edge link.

const createEdge = (start = [0, 0, 0], face = undefined, next = undefined, twin = undefined) => ({ start, face, next, twin });

const getEdges = (loop) => {
  let value = loop;
  let done = false;
  return {
    next: () => {
      const result = { value, done };
      value = value.next;
      if (value === loop) {
        done = true;
      }
      return result;
    },
    [Symbol.iterator]: function () { return this; }
  };
};

let id = 0;

const fromSolid = (solid, normalize, closed = true) => {
  const twinMap = new Map();
  const getTwins = (point) => {
    let twins = twinMap.get(point);
    if (twins === undefined) {
      twins = [];
      twinMap.set(point, twins);
    }
    return twins;
  };
  const loops = [];

  for (const surface of solid) {
    for (const path of surface) {
      let first;
      let last;
      for (let nth = 0; nth < path.length; nth++) {
        const thisPoint = normalize(path[nth]);
        const nextPoint = normalize(path[(nth + 1) % path.length]);
        const edge = createEdge(thisPoint);
        edge.id = id++;
        // nextPoint will be the start of the twin.
        getTwins(nextPoint).push(edge);
        if (first === undefined) {
          first = edge;
        }
        if (last !== undefined) {
          last.next = edge;
        }
        // Any arbitrary link will serve for face identity.
        edge.face = first;
        last = edge;
      }
      if (first === undefined) {
        throw Error(`die: ${JSON.stringify(path)}`);
      }
      // Close the loop.
      last.next = first;
      // And collect the closed loop.
      loops.push(first);
    }
  }

  // Bridge the edges.
  for (const loop of loops) {
    let link = loop;
    do {
      if (link.twin === undefined) {
        const candidates = twinMap.get(link.start);
        if (candidates === undefined) {
          throw Error('die');
        }
        // FIX: Assert one or zero twins?
        // Find the candidate that starts where we end.
        let count = 0;
        for (const candidate of candidates) {
          if (candidate.start === link.next.start) {
            count += 1;
            if (candidate.twin === undefined) {
              candidate.twin = link;
              link.twin = candidate;
            } else {
              // console.log(`QQ/twin: ${JSON.stringify(toPolygons([candidate.twin]))}`);
              // console.log(`QQ/candidate: ${JSON.stringify(toPolygons([candidate]))}`);
              // console.log(`QQ/link: ${JSON.stringify(toPolygons([link]))}`);
              // throw Error('die');
              for (const edge of getEdges(link)) {
                edge.face = undefined;
              }
            }
          }
        }
        if (count > 1) {
          console.log(`QQ/fromSolid/twins: multiple ${link.start} -> ${link.next.start}`);
        } else if (count === 0) {
          console.log(`QQ/fromSolid/twins: none ${link.start} -> ${link.next.start} ${link.face.id}`);
        }
      }
      link = link.next;
    } while (link !== loop);
  }

  let holeCount = 0;
  let edgeCount = 0;

  if (closed) {
    for (const loop of loops) {
      if (loop.face === undefined) continue;
      for (const edge of getEdges(loop)) {
        edgeCount += 1;
        if (edge.twin === undefined) {
          // A hole in the 2-manifold.
          holeCount += 1;
          // edge.start[Z] += 1;
        }
      }
    }
  }

  console.log(`QQ/edgeCount: ${edgeCount}`);
  console.log(`QQ/holeCount: ${holeCount}`);

  return loops;
};

const THRESHOLD = 0.99999;

const equalsPlane = (a, b) => {
  if (a === undefined || b === undefined) {
    return false;
  }
  const t = dot(a, b);
  if (t >= THRESHOLD) {
    return true;
  } else {
    return false;
  }
};

const junctionSelector = (solid, normalize) => {
  const planesOfPoint = new Map();

  const getPlanesOfPoint = (point) => {
    let planes = planesOfPoint.get(point);
    if (planes === undefined) {
      planes = [];
      planesOfPoint.set(point, planes);
    }
    return planes;
  };

  const considerJunction = (point, planeOfPath) => {
    let planes = getPlanesOfPoint(point);
    for (const plane of planes) {
      if (equalsPlane(plane, planeOfPath)) {
        return;
      }
    }
    planes.push(planeOfPath);
  };

  for (const surface of solid) {
    for (const path of surface) {
      for (const point of path) {
        considerJunction(normalize(point), toPlane$1(path));
      }
    }
  }

  // A corner is defined as a point of intersection of three distinct planes.
  const select = (point) => getPlanesOfPoint(point).length >= 3;

  return select;
};

const X = 0;
const Y = 1;
const Z = 2;
const W = 3;

const toPlane = (loop, recompute = false) => {
  if (loop.face.plane === undefined || recompute || true) {
    loop.face.plane = toPlaneFromLoop(loop.face);
  }
  return loop.face.plane;
};

// Newell's method for computing the plane of a polygon.
const toPlaneFromLoop = (start) => {
  const normal = [0, 0, 0];
  const reference = [0, 0, 0];
  // Run around the ring.
  let size = 0;
  let link = start;
  do {
    const lastPoint = link.start;
    const thisPoint = link.next.start;
    if (lastPoint !== thisPoint) {
      normal[X] += (lastPoint[Y] - thisPoint[Y]) * (lastPoint[Z] + thisPoint[Z]);
      normal[Y] += (lastPoint[Z] - thisPoint[Z]) * (lastPoint[X] + thisPoint[X]);
      normal[Z] += (lastPoint[X] - thisPoint[X]) * (lastPoint[Y] + thisPoint[Y]);
      reference[X] += lastPoint[X];
      reference[Y] += lastPoint[Y];
      reference[Z] += lastPoint[Z];
      size += 1;
    }
    link = link.next;
  } while (link !== start);
  const factor = 1 / length(normal);
  const plane = scale(factor, normal);
  plane[W] = dot(reference, normal) * factor / size;
  if (isNaN(plane[X])) {
    return undefined;
  } else {
    return plane;
  }
};

// Note that merging produces duplicate points.

const setFace = (loop, face, plane) => {
  let cursor = loop;
  do {
    if (face === undefined && cursor.twin !== undefined && cursor.twin.face !== undefined) {
      throw Error('die');
    }
    cursor.face = face;
    cursor.plane = plane;
    cursor = cursor.next;
  } while (cursor !== loop);
};

const merge = (loops) => {
  // console.log(`QQ/merge/dot: ${toDot(loops)}`);
  const merged = [];
  const faces = new Set();
  for (let loop of loops) {
    if (loop.face === undefined) continue;
    let link = loop;
    do {
      if (link.face !== undefined && link.twin !== undefined && link.twin.face !== undefined) {
        const linkPlane = toPlane(link);
        const twinPlane = toPlane(link.twin);
        if (equalsPlane(linkPlane, twinPlane)) {
          // console.log(`QQ/link/before`); console.log(toDot([link]));
          // Linking a face to itself is the only way to produce a new island.

          // Edge collapse produces a duplicate in order to preserve twin edge identity.
          const twin = link.twin;
          // console.log(`QQ/twin/before`); console.log(toDot([twin]));
          const linkNext = link.next;
          const twinNext = twin.next;
          if (twin.start !== link.next.start) {
            throw Error('die');
          }
          if (twin.next.start !== link.start) {
            throw Error('die');
          }
          link.next = twinNext;
          twin.next = linkNext;
          // The collapsed edges do not have twins.
          link.twin = undefined;
          twin.twin = undefined;
          // Make sure that the face stays coherent.
          if (link.start !== link.next.start) {
            throw Error('die');
          }
          if (twin.start !== twin.next.start) {
            throw Error('die');
          }
          if (link.face === twin.face) {
            // The loop was split.
            // Was a hole was formed?
            // CHECK: Is this condition sufficient?
            const newLinkPlane = toPlane(link, /* recompute= */true);
            const newTwinPlane = toPlane(twin, /* recompute= */true);
            if (newLinkPlane === undefined && newTwinPlane === undefined) {
              setFace(link, undefined, toPlane(link, true));
              setFace(link, undefined, /* plane= */undefined);
              setFace(twin, undefined, /* plane= */undefined);
            } else if (newLinkPlane === undefined) {
              setFace(link, undefined, /* plane= */undefined);
              setFace(twin, twin, /* plane= */newTwinPlane);
            } else if (newTwinPlane === undefined) {
              setFace(twin, undefined, /* plane= */undefined);
              setFace(link, link, /* plane= */newLinkPlane);
            } else {
              const linkEqual = equalsPlane(newLinkPlane, linkPlane);
              const twinEqual = equalsPlane(newTwinPlane, linkPlane);
              if (linkEqual && twinEqual) {
                // Neither are holes
                // throw Error('die');
                setFace(link, link, newLinkPlane);
                setFace(twin, twin, newTwinPlane);
              } else if (!linkEqual && !twinEqual) {
                // Both are holes
                throw Error('die');
              } else if (linkEqual) {
                // Twin is hole.
                setFace(link, link, newLinkPlane);
                link.face.hole = twin;
              } else if (twinEqual) {
                // Link is hole.
                setFace(twin, twin, newTwinPlane);
                twin.face.hole = link;
              }
            }
          } else {
            // Two loops were merged -- unify the face.
            setFace(loop, loop);
          }
        }
      }
      link = link.next;
    } while (link !== loop);
    if (loop.face !== undefined && !faces.has(loop.face)) {
      faces.add(loop.face);
      merged.push(loop);
    }
  }
  return merged;
};

const eachLink = (loop, thunk) => {
  let link = loop;
  do {
    thunk(link);
    link = link.next;
  } while (link !== loop);
};

var earcut_1 = earcut;
var default_1 = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);

        // filter collinear points around the cuts
        filterPoints(outerNode, outerNode.next);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    var o1 = sign(area(p1, q1, p2));
    var o2 = sign(area(p1, q1, q2));
    var o3 = sign(area(p2, q2, p1));
    var o4 = sign(area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};
earcut_1.default = default_1;

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

const buildContourXy = (points, contour, loop, selectJunction) => {
  const index = contour.length >>> 1;
  let link = loop;
  do {
    if (link.start !== link.next.start && selectJunction(link.start)) {
      points.push(link.start);
      contour.push(link.start[X$1], link.start[Y$1]);
    }
    link = link.next;
  } while (link !== loop);
  return index;
};

const buildContourXz = (points, contour, loop, selectJunction) => {
  const index = contour.length >>> 1;
  let link = loop;
  do {
    if (link.start !== link.next.start && selectJunction(link.start)) {
      points.push(link.start);
      contour.push(link.start[X$1], link.start[Z$1]);
    }
    link = link.next;
  } while (link !== loop);
  return index;
};

const buildContourYz = (points, contour, loop, selectJunction) => {
  const index = contour.length >>> 1;
  let link = loop;
  do {
    if (link.start !== link.next.start && selectJunction(link.start)) {
      points.push(link.start);
      contour.push(link.start[Y$1], link.start[Z$1]);
    }
    link = link.next;
  } while (link !== loop);
  return index;
};

const selectBuildContour = (plane) => {
  const tZ = dot(plane, [0, 0, 1, 0]);
  if (tZ >= 0.5) {
    // Best aligned with the Z axis.
    return buildContourXy;
  } else if (tZ <= -0.5) {
    return buildContourXy;
  }
  const tY = dot(plane, [0, 1, 0, 0]);
  if (tY >= 0.5) {
    // Best aligned with the Y axis.
    return buildContourXz;
  } else if (tY <= -0.5) {
    return buildContourXz;
  }
  const tX = dot(plane, [1, 0, 0, 0]);
  if (tX >= 0) {
    return buildContourYz;
  } else {
    return buildContourYz;
  }
};

const pushConvexPolygons = (polygons, loop, selectJunction) => {
  const plane = toPlane(loop);
  const buildContour = selectBuildContour(plane);
  const points = [];
  const contour = [];
  buildContour(points, contour, loop, selectJunction);
  const holes = [];
  eachLink(loop,
           (link) => {
             if (link.hole) {
               holes.push(buildContour(points, contour, link, selectJunction));
             }
           });
  const triangles = earcut_1(contour, holes);
  for (let i = 0; i < triangles.length; i += 3) {
    const a = triangles[i + 0];
    const b = triangles[i + 1];
    const c = triangles[i + 2];
    const triangle = [points[a], points[b], points[c]];
    const trianglePlane = toPlane$1(triangle);
    if (trianglePlane === undefined) {
      // Degenerate.
      continue;
    }
    if (dot(trianglePlane, plane) < 0) {
      polygons.push(flip(triangle));
    } else {
      polygons.push(triangle);
    }
  }
};

const walked = Symbol('walked');

// FIX: Coplanar surface coherence.
const toSolid = (loops, selectJunction) => {
  const solid = [];

  const walk = (loop) => {
    if (loop === undefined || loop[walked] || loop.face === undefined) return;
    eachLink(loop, (link) => { link[walked] = true; });
    eachLink(loop, (link) => walk(link.twin));
    const polygons = [];
    pushConvexPolygons(polygons, loop, selectJunction);
    solid.push(polygons);
  };

  walk(loops[0]);

  return solid;
};

const cleanSolid = (solid, normalize) => {
  for (const surface of solid) {
    console.log(`QQ/surface/length: ${surface.length}`);
  }
  const loops = fromSolid(solid, normalize, /* closed= */true);
  console.log(`QQ/loops/length: ${loops.length}`);
  const selectJunction = junctionSelector(solid, normalize);
  const merged = merge(loops);
  // const merged = loops;
  // return toSolid(merged, selectJunction);
  return toSolid(merged, n => true);
};

const fromSurface = (surface, normalize) => fromSolid([surface], normalize, /* closed= */false);

const fromPolygons = (polygons, normalize) => fromSurface(polygons, normalize);

const toPolygons = (loops) => {
  const polygons = [];
  for (const loop of loops) {
    const polygon = [];
    for (const edge of getEdges(loop)) {
      if (edge.face !== undefined) {
        polygon.push(edge.start);
      }
    }
    pushWhenValid(polygons, polygon);
  }
  return polygons;
};

const mergeCoplanarPolygons = (polygons, normalize, noIslands = false) => toPolygons(merge(fromPolygons(polygons, normalize)));

export { cleanSolid, fromSolid, fromSurface, junctionSelector, mergeCoplanarPolygons, toPlane, toPolygons, toSolid };
