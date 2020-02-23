import { cache as cache$1, cachePoints } from './jsxcad-cache.js';
import { fromPolygons } from './jsxcad-geometry-solid.js';
import { translate } from './jsxcad-geometry-points.js';
import { deduplicate, assertGood, flip, translate as translate$1, scale as scale$2, rotateX, isClosed } from './jsxcad-geometry-path.js';
import { makeConvex, flip as flip$1, translate as translate$2 } from './jsxcad-geometry-surface.js';
import { fromPolygon } from './jsxcad-math-plane.js';
import { fromPoints } from './jsxcad-math-poly3.js';
import { scale as scale$1, add as add$1, unit } from './jsxcad-math-vec3.js';
import { fromAngleRadians } from './jsxcad-math-vec2.js';
import { outline, makeConvex as makeConvex$1 } from './jsxcad-geometry-z0surface-boolean.js';
import { createNormalize2 } from './jsxcad-algorithm-quantize.js';
import { translate as translate$3 } from './jsxcad-geometry-tagged.js';

function clone(point) { //TODO: use gl-vec2 for this
    return [point[0], point[1]]
}

function vec2(x, y) {
    return [x, y]
}

var _function = function createBezierBuilder(opt) {
    opt = opt||{};

    var RECURSION_LIMIT = typeof opt.recursion === 'number' ? opt.recursion : 8;
    var FLT_EPSILON = typeof opt.epsilon === 'number' ? opt.epsilon : 1.19209290e-7;
    var PATH_DISTANCE_EPSILON = typeof opt.pathEpsilon === 'number' ? opt.pathEpsilon : 1.0;

    var curve_angle_tolerance_epsilon = typeof opt.angleEpsilon === 'number' ? opt.angleEpsilon : 0.01;
    var m_angle_tolerance = opt.angleTolerance || 0;
    var m_cusp_limit = opt.cuspLimit || 0;

    return function bezierCurve(start, c1, c2, end, scale, points) {
        if (!points)
            points = [];

        scale = typeof scale === 'number' ? scale : 1.0;
        var distanceTolerance = PATH_DISTANCE_EPSILON / scale;
        distanceTolerance *= distanceTolerance;
        begin(start, c1, c2, end, points, distanceTolerance);
        return points
    }


    ////// Based on:
    ////// https://github.com/pelson/antigrain/blob/master/agg-2.4/src/agg_curves.cpp

    function begin(start, c1, c2, end, points, distanceTolerance) {
        points.push(clone(start));
        var x1 = start[0],
            y1 = start[1],
            x2 = c1[0],
            y2 = c1[1],
            x3 = c2[0],
            y3 = c2[1],
            x4 = end[0],
            y4 = end[1];
        recursive(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance, 0);
        points.push(clone(end));
    }

    function recursive(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance, level) {
        if(level > RECURSION_LIMIT) 
            return

        var pi = Math.PI;

        // Calculate all the mid-points of the line segments
        //----------------------
        var x12   = (x1 + x2) / 2;
        var y12   = (y1 + y2) / 2;
        var x23   = (x2 + x3) / 2;
        var y23   = (y2 + y3) / 2;
        var x34   = (x3 + x4) / 2;
        var y34   = (y3 + y4) / 2;
        var x123  = (x12 + x23) / 2;
        var y123  = (y12 + y23) / 2;
        var x234  = (x23 + x34) / 2;
        var y234  = (y23 + y34) / 2;
        var x1234 = (x123 + x234) / 2;
        var y1234 = (y123 + y234) / 2;

        if(level > 0) { // Enforce subdivision first time
            // Try to approximate the full cubic curve by a single straight line
            //------------------
            var dx = x4-x1;
            var dy = y4-y1;

            var d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx);
            var d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx);

            var da1, da2;

            if(d2 > FLT_EPSILON && d3 > FLT_EPSILON) {
                // Regular care
                //-----------------
                if((d2 + d3)*(d2 + d3) <= distanceTolerance * (dx*dx + dy*dy)) {
                    // If the curvature doesn't exceed the distanceTolerance value
                    // we tend to finish subdivisions.
                    //----------------------
                    if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
                        points.push(vec2(x1234, y1234));
                        return
                    }

                    // Angle & Cusp Condition
                    //----------------------
                    var a23 = Math.atan2(y3 - y2, x3 - x2);
                    da1 = Math.abs(a23 - Math.atan2(y2 - y1, x2 - x1));
                    da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - a23);
                    if(da1 >= pi) da1 = 2*pi - da1;
                    if(da2 >= pi) da2 = 2*pi - da2;

                    if(da1 + da2 < m_angle_tolerance) {
                        // Finally we can stop the recursion
                        //----------------------
                        points.push(vec2(x1234, y1234));
                        return
                    }

                    if(m_cusp_limit !== 0.0) {
                        if(da1 > m_cusp_limit) {
                            points.push(vec2(x2, y2));
                            return
                        }

                        if(da2 > m_cusp_limit) {
                            points.push(vec2(x3, y3));
                            return
                        }
                    }
                }
            }
            else {
                if(d2 > FLT_EPSILON) {
                    // p1,p3,p4 are collinear, p2 is considerable
                    //----------------------
                    if(d2 * d2 <= distanceTolerance * (dx*dx + dy*dy)) {
                        if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push(vec2(x1234, y1234));
                            return
                        }

                        // Angle Condition
                        //----------------------
                        da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                        if(da1 >= pi) da1 = 2*pi - da1;

                        if(da1 < m_angle_tolerance) {
                            points.push(vec2(x2, y2));
                            points.push(vec2(x3, y3));
                            return
                        }

                        if(m_cusp_limit !== 0.0) {
                            if(da1 > m_cusp_limit) {
                                points.push(vec2(x2, y2));
                                return
                            }
                        }
                    }
                }
                else if(d3 > FLT_EPSILON) {
                    // p1,p2,p4 are collinear, p3 is considerable
                    //----------------------
                    if(d3 * d3 <= distanceTolerance * (dx*dx + dy*dy)) {
                        if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push(vec2(x1234, y1234));
                            return
                        }

                        // Angle Condition
                        //----------------------
                        da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
                        if(da1 >= pi) da1 = 2*pi - da1;

                        if(da1 < m_angle_tolerance) {
                            points.push(vec2(x2, y2));
                            points.push(vec2(x3, y3));
                            return
                        }

                        if(m_cusp_limit !== 0.0) {
                            if(da1 > m_cusp_limit)
                            {
                                points.push(vec2(x3, y3));
                                return
                            }
                        }
                    }
                }
                else {
                    // Collinear case
                    //-----------------
                    dx = x1234 - (x1 + x4) / 2;
                    dy = y1234 - (y1 + y4) / 2;
                    if(dx*dx + dy*dy <= distanceTolerance) {
                        points.push(vec2(x1234, y1234));
                        return
                    }
                }
            }
        }

        // Continue subdivision
        //----------------------
        recursive(x1, y1, x12, y12, x123, y123, x1234, y1234, points, distanceTolerance, level + 1); 
        recursive(x1234, y1234, x234, y234, x34, y34, x4, y4, points, distanceTolerance, level + 1); 
    }
};

var adaptiveBezierCurve = _function();
var adaptiveBezierCurve_1 = adaptiveBezierCurve.bezier;

const buildAdaptiveCubicBezierCurve = ({ scale = 2 }, [start, c1, c2, end]) => adaptiveBezierCurve(start, c1, c2, end, scale);

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var subtract_1 = subtract;

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out
}

var cross_1 = cross;

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out
}

var squaredLength_1 = squaredLength;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z
}

var ab = [];
var ap = [];
var cr = [];

var squared = function (p, a, b) {
  // // == vector solution
  // var normalize = require('gl-vec3/normalize')
  // var scaleAndAdd = require('gl-vec3/scaleAndAdd')
  // var dot = require('gl-vec3/dot')
  // var squaredDistance = require('gl-vec3/squaredDistance')
  // // n = vector `ab` normalized
  // var n = []
  // // projection = projection of `point` on `n`
  // var projection = []
  // normalize(n, subtract(n, a, b))
  // scaleAndAdd(projection, a, n, dot(n, p))
  // return squaredDistance(projection, p)

  // == parallelogram solution
  //
  //            s
  //      __a________b__
  //       /   |    /
  //      /   h|   /
  //     /_____|__/
  //    p
  //
  //  s = b - a
  //  area = s * h
  //  |ap x s| = s * h
  //  h = |ap x s| / s
  //
  subtract_1(ab, b, a);
  subtract_1(ap, p, a);
  var area = squaredLength_1(cross_1(cr, ap, ab));
  var s = squaredLength_1(ab);
  if (s === 0) {
    throw Error('a and b are the same point')
  }
  return area / s
};

var pointLineDistance = function (point, a, b) {
  return Math.sqrt(squared(point, a, b))
};

var normalize_1 = normalize;

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out
}

var tmp = [0, 0, 0];

var getPlaneNormal = planeNormal;

function planeNormal (out, point1, point2, point3) {
  subtract_1(out, point1, point2);
  subtract_1(tmp, point2, point3);
  cross_1(out, out, tmp);
  return normalize_1(out, out)
}

var dot_1 = dot;

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

var VertexList_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VertexList = function () {
  function VertexList() {
    _classCallCheck(this, VertexList);

    this.head = null;
    this.tail = null;
  }

  _createClass(VertexList, [{
    key: "clear",
    value: function clear() {
      this.head = this.tail = null;
    }

    /**
     * Inserts a `node` before `target`, it's assumed that
     * `target` belongs to this doubly linked list
     *
     * @param {*} target
     * @param {*} node
     */

  }, {
    key: "insertBefore",
    value: function insertBefore(target, node) {
      node.prev = target.prev;
      node.next = target;
      if (!node.prev) {
        this.head = node;
      } else {
        node.prev.next = node;
      }
      target.prev = node;
    }

    /**
     * Inserts a `node` after `target`, it's assumed that
     * `target` belongs to this doubly linked list
     *
     * @param {Vertex} target
     * @param {Vertex} node
     */

  }, {
    key: "insertAfter",
    value: function insertAfter(target, node) {
      node.prev = target;
      node.next = target.next;
      if (!node.next) {
        this.tail = node;
      } else {
        node.next.prev = node;
      }
      target.next = node;
    }

    /**
     * Appends a `node` to the end of this doubly linked list
     * Note: `node.next` will be unlinked from `node`
     * Note: if `node` is part of another linked list call `addAll` instead
     *
     * @param {*} node
     */

  }, {
    key: "add",
    value: function add(node) {
      if (!this.head) {
        this.head = node;
      } else {
        this.tail.next = node;
      }
      node.prev = this.tail;
      // since node is the new end it doesn't have a next node
      node.next = null;
      this.tail = node;
    }

    /**
     * Appends a chain of nodes where `node` is the head,
     * the difference with `add` is that it correctly sets the position
     * of the node list `tail` property
     *
     * @param {*} node
     */

  }, {
    key: "addAll",
    value: function addAll(node) {
      if (!this.head) {
        this.head = node;
      } else {
        this.tail.next = node;
      }
      node.prev = this.tail;

      // find the end of the list
      while (node.next) {
        node = node.next;
      }
      this.tail = node;
    }

    /**
     * Deletes a `node` from this linked list, it's assumed that `node` is a
     * member of this linked list
     *
     * @param {*} node
     */

  }, {
    key: "remove",
    value: function remove(node) {
      if (!node.prev) {
        this.head = node.next;
      } else {
        node.prev.next = node.next;
      }

      if (!node.next) {
        this.tail = node.prev;
      } else {
        node.next.prev = node.prev;
      }
    }

    /**
     * Removes a chain of nodes whose head is `a` and whose tail is `b`,
     * it's assumed that `a` and `b` belong to this list and also that `a`
     * comes before `b` in the linked list
     *
     * @param {*} a
     * @param {*} b
     */

  }, {
    key: "removeChain",
    value: function removeChain(a, b) {
      if (!a.prev) {
        this.head = b.next;
      } else {
        a.prev.next = b.next;
      }

      if (!b.next) {
        this.tail = a.prev;
      } else {
        b.next.prev = a.prev;
      }
    }
  }, {
    key: "first",
    value: function first() {
      return this.head;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return !this.head;
    }
  }]);

  return VertexList;
}();

exports.default = VertexList;
module.exports = exports["default"];
});

unwrapExports(VertexList_1);

var Vertex_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = function Vertex(point, index) {
  _classCallCheck(this, Vertex);

  this.point = point;
  // index in the input array
  this.index = index;
  // vertex is a double linked list node
  this.next = null;
  this.prev = null;
  // the face that is able to see this point
  this.face = null;
};

exports.default = Vertex;
module.exports = exports["default"];
});

unwrapExports(Vertex_1);

var add_1 = add;

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out
}

var copy_1 = copy;

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out
}

var length_1 = length;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z)
}

var scale_1 = scale;

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out
}

var scaleAndAdd_1 = scaleAndAdd;

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out
}

var distance_1 = distance;

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z)
}

var squaredDistance_1 = squaredDistance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z
}

var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var browser$1 = true;

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = ms;
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
  /**
  * Create a debugger with the given `namespace`.
  *
  * @param {String} namespace
  * @return {Function}
  * @api public
  */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */


  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
  }
  /**
  * Returns true if the given mode name is enabled, false otherwise.
  *
  * @param {String} name
  * @return {Boolean}
  * @api public
  */


  function enabled(name) {
    if (name[name.length - 1] === '*') {
      return true;
    }

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
        return true;
      }
    }

    return false;
  }
  /**
  * Coerce `val`.
  *
  * @param {Mixed} val
  * @return {Mixed}
  * @api private
  */


  function coerce(val) {
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

var common = setup;

var browser$2 = createCommonjsModule(function (module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = common(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
});
var browser_1 = browser$2.log;
var browser_2 = browser$2.formatArgs;
var browser_3 = browser$2.save;
var browser_4 = browser$2.load;
var browser_5 = browser$2.useColors;
var browser_6 = browser$2.storage;
var browser_7 = browser$2.colors;

// MIT lisence
// from https://github.com/substack/tty-browserify/blob/1ba769a6429d242f36226538835b4034bf6b7886/index.js

function isatty() {
  return false;
}

function ReadStream() {
  throw new Error('tty.ReadStream is not implemented');
}

function WriteStream() {
  throw new Error('tty.ReadStream is not implemented');
}

var tty = {
  isatty: isatty,
  ReadStream: ReadStream,
  WriteStream: WriteStream
};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var inherits;
if (typeof Object.create === 'function'){
  inherits = function inherits(ctor, superCtor) {
    // implementation from standard node.js 'util' module
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  inherits = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}
var inherits$1 = inherits;

var formatRegExp = /%[sdj%]/g;
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
}

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
function deprecate(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global$1.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

var debugs = {};
var debugEnviron;
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
}

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    _extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray$1(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var length = output.reduce(function(prev, cur) {
    if (cur.indexOf('\n') >= 0) ;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray$1(ar) {
  return Array.isArray(ar);
}

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

function isNull(arg) {
  return arg === null;
}

function isNullOrUndefined(arg) {
  return arg == null;
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isString(arg) {
  return typeof arg === 'string';
}

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

function isUndefined(arg) {
  return arg === void 0;
}

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}

function isBuffer$1(maybeBuf) {
  return isBuffer(maybeBuf);
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
function log() {
  console.log('%s - %s', timestamp(), format.apply(null, arguments));
}

function _extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var util = {
  inherits: inherits$1,
  _extend: _extend,
  log: log,
  isBuffer: isBuffer$1,
  isPrimitive: isPrimitive,
  isFunction: isFunction,
  isError: isError,
  isDate: isDate,
  isObject: isObject,
  isRegExp: isRegExp,
  isUndefined: isUndefined,
  isSymbol: isSymbol,
  isString: isString,
  isNumber: isNumber,
  isNullOrUndefined: isNullOrUndefined,
  isNull: isNull,
  isBoolean: isBoolean,
  isArray: isArray$1,
  inspect: inspect,
  deprecate: deprecate,
  format: format,
  debuglog: debuglog
};

var hasFlag = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const {env: env$1} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env$1) {
	if (env$1.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env$1.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env$1.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env$1.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env$1.TERM === 'dumb') {
		return min;
	}

	if ('CI' in env$1) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env$1) || env$1.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env$1) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env$1.TEAMCITY_VERSION) ? 1 : 0;
	}

	if ('GITHUB_ACTIONS' in env$1) {
		return 1;
	}

	if (env$1.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env$1) {
		const version = parseInt((env$1.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env$1.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env$1.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env$1.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env$1) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};

var node = createCommonjsModule(function (module, exports) {

/**
 * Module dependencies.
 */



/**
 * This is the Node.js implementation of `debug()`.
 */


exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
  // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
  // eslint-disable-next-line import/no-extraneous-dependencies
  var supportsColor = supportsColor_1;

  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
  }
} catch (error) {} // Swallow - we only care if `supports-color` is available; it doesn't have to be.

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */


exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // Camel-case
  var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function (_, k) {
    return k.toUpperCase();
  }); // Coerce string value into JS value

  var val = process.env[key];

  if (/^(yes|on|true|enabled)$/i.test(val)) {
    val = true;
  } else if (/^(no|off|false|disabled)$/i.test(val)) {
    val = false;
  } else if (val === 'null') {
    val = null;
  } else {
    val = Number(val);
  }

  obj[prop] = val;
  return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  var name = this.namespace,
      useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = "\x1B[3" + (c < 8 ? c : '8;5;' + c);
    var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + "\x1B[0m");
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  }

  return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */


function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  if (namespaces) {
    process.env.DEBUG = namespaces;
  } else {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */


function init(debug) {
  debug.inspectOpts = {};
  var keys = Object.keys(exports.inspectOpts);

  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

module.exports = common(exports);
var formatters = module.exports.formatters;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts).replace(/\s*\n\s*/g, ' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */


formatters.O = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function (module) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */
if (typeof process === 'undefined' || process.type === 'renderer' || browser$1 === true || process.__nwjs) {
  module.exports = browser$2;
} else {
  module.exports = node;
}
});

var HalfEdge_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _distance2 = _interopRequireDefault(distance_1);



var _squaredDistance2 = _interopRequireDefault(squaredDistance_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = src('halfedge');

var HalfEdge = function () {
  function HalfEdge(vertex, face) {
    _classCallCheck(this, HalfEdge);

    this.vertex = vertex;
    this.face = face;
    this.next = null;
    this.prev = null;
    this.opposite = null;
  }

  _createClass(HalfEdge, [{
    key: 'head',
    value: function head() {
      return this.vertex;
    }
  }, {
    key: 'tail',
    value: function tail() {
      return this.prev ? this.prev.vertex : null;
    }
  }, {
    key: 'length',
    value: function length() {
      if (this.tail()) {
        return (0, _distance2.default)(this.tail().point, this.head().point);
      }
      return -1;
    }
  }, {
    key: 'lengthSquared',
    value: function lengthSquared() {
      if (this.tail()) {
        return (0, _squaredDistance2.default)(this.tail().point, this.head().point);
      }
      return -1;
    }
  }, {
    key: 'setOpposite',
    value: function setOpposite(edge) {
      var me = this;
      if (debug.enabled) {
        debug('opposite ' + me.tail().index + ' <--> ' + me.head().index + ' between ' + me.face.collectIndices() + ', ' + edge.face.collectIndices());
      }
      this.opposite = edge;
      edge.opposite = this;
    }
  }]);

  return HalfEdge;
}();

exports.default = HalfEdge;
module.exports = exports['default'];
});

unwrapExports(HalfEdge_1);

var Face_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETED = exports.NON_CONVEX = exports.VISIBLE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _dot2 = _interopRequireDefault(dot_1);



var _add2 = _interopRequireDefault(add_1);



var _subtract2 = _interopRequireDefault(subtract_1);



var _cross2 = _interopRequireDefault(cross_1);



var _copy2 = _interopRequireDefault(copy_1);



var _length2 = _interopRequireDefault(length_1);



var _scale2 = _interopRequireDefault(scale_1);



var _scaleAndAdd2 = _interopRequireDefault(scaleAndAdd_1);



var _normalize2 = _interopRequireDefault(normalize_1);



var _HalfEdge2 = _interopRequireDefault(HalfEdge_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = src('face');

var VISIBLE = exports.VISIBLE = 0;
var NON_CONVEX = exports.NON_CONVEX = 1;
var DELETED = exports.DELETED = 2;

var Face = function () {
  function Face() {
    _classCallCheck(this, Face);

    this.normal = [];
    this.centroid = [];
    // signed distance from face to the origin
    this.offset = 0;
    // pointer to the a vertex in a double linked list this face can see
    this.outside = null;
    this.mark = VISIBLE;
    this.edge = null;
    this.nVertices = 0;
  }

  _createClass(Face, [{
    key: 'getEdge',
    value: function getEdge(i) {
      if (typeof i !== 'number') {
        throw Error('requires a number');
      }
      var it = this.edge;
      while (i > 0) {
        it = it.next;
        i -= 1;
      }
      while (i < 0) {
        it = it.prev;
        i += 1;
      }
      return it;
    }
  }, {
    key: 'computeNormal',
    value: function computeNormal() {
      var e0 = this.edge;
      var e1 = e0.next;
      var e2 = e1.next;
      var v2 = (0, _subtract2.default)([], e1.head().point, e0.head().point);
      var t = [];
      var v1 = [];

      this.nVertices = 2;
      this.normal = [0, 0, 0];
      while (e2 !== e0) {
        (0, _copy2.default)(v1, v2);
        (0, _subtract2.default)(v2, e2.head().point, e0.head().point);
        (0, _add2.default)(this.normal, this.normal, (0, _cross2.default)(t, v1, v2));
        e2 = e2.next;
        this.nVertices += 1;
      }
      this.area = (0, _length2.default)(this.normal);
      // normalize the vector, since we've already calculated the area
      // it's cheaper to scale the vector using this quantity instead of
      // doing the same operation again
      this.normal = (0, _scale2.default)(this.normal, this.normal, 1 / this.area);
    }
  }, {
    key: 'computeNormalMinArea',
    value: function computeNormalMinArea(minArea) {
      this.computeNormal();
      if (this.area < minArea) {
        // compute the normal without the longest edge
        var maxEdge = void 0;
        var maxSquaredLength = 0;
        var edge = this.edge;

        // find the longest edge (in length) in the chain of edges
        do {
          var lengthSquared = edge.lengthSquared();
          if (lengthSquared > maxSquaredLength) {
            maxEdge = edge;
            maxSquaredLength = lengthSquared;
          }
          edge = edge.next;
        } while (edge !== this.edge);

        var p1 = maxEdge.tail().point;
        var p2 = maxEdge.head().point;
        var maxVector = (0, _subtract2.default)([], p2, p1);
        var maxLength = Math.sqrt(maxSquaredLength);
        // maxVector is normalized after this operation
        (0, _scale2.default)(maxVector, maxVector, 1 / maxLength);
        // compute the projection of maxVector over this face normal
        var maxProjection = (0, _dot2.default)(this.normal, maxVector);
        // subtract the quantity maxEdge adds on the normal
        (0, _scaleAndAdd2.default)(this.normal, this.normal, maxVector, -maxProjection);
        // renormalize `this.normal`
        (0, _normalize2.default)(this.normal, this.normal);
      }
    }
  }, {
    key: 'computeCentroid',
    value: function computeCentroid() {
      this.centroid = [0, 0, 0];
      var edge = this.edge;
      do {
        (0, _add2.default)(this.centroid, this.centroid, edge.head().point);
        edge = edge.next;
      } while (edge !== this.edge);
      (0, _scale2.default)(this.centroid, this.centroid, 1 / this.nVertices);
    }
  }, {
    key: 'computeNormalAndCentroid',
    value: function computeNormalAndCentroid(minArea) {
      if (typeof minArea !== 'undefined') {
        this.computeNormalMinArea(minArea);
      } else {
        this.computeNormal();
      }
      this.computeCentroid();
      this.offset = (0, _dot2.default)(this.normal, this.centroid);
    }
  }, {
    key: 'distanceToPlane',
    value: function distanceToPlane(point) {
      return (0, _dot2.default)(this.normal, point) - this.offset;
    }

    /**
     * @private
     *
     * Connects two edges assuming that prev.head().point === next.tail().point
     *
     * @param {HalfEdge} prev
     * @param {HalfEdge} next
     */

  }, {
    key: 'connectHalfEdges',
    value: function connectHalfEdges(prev, next) {
      var discardedFace = void 0;
      if (prev.opposite.face === next.opposite.face) {
        // `prev` is remove a redundant edge
        var oppositeFace = next.opposite.face;
        var oppositeEdge = void 0;
        if (prev === this.edge) {
          this.edge = next;
        }
        if (oppositeFace.nVertices === 3) {
          // case:
          // remove the face on the right
          //
          //       /|\
          //      / | \ the face on the right
          //     /  |  \ --> opposite edge
          //    / a |   \
          //   *----*----*
          //  /     b  |  \
          //           ▾
          //      redundant edge
          //
          // Note: the opposite edge is actually in the face to the right
          // of the face to be destroyed
          oppositeEdge = next.opposite.prev.opposite;
          oppositeFace.mark = DELETED;
          discardedFace = oppositeFace;
        } else {
          // case:
          //          t
          //        *----
          //       /| <- right face's redundant edge
          //      / | opposite edge
          //     /  |  ▴   /
          //    / a |  |  /
          //   *----*----*
          //  /     b  |  \
          //           ▾
          //      redundant edge
          oppositeEdge = next.opposite.next;
          // make sure that the link `oppositeFace.edge` points correctly even
          // after the right face redundant edge is removed
          if (oppositeFace.edge === oppositeEdge.prev) {
            oppositeFace.edge = oppositeEdge;
          }

          //       /|   /
          //      / | t/opposite edge
          //     /  | / ▴  /
          //    / a |/  | /
          //   *----*----*
          //  /     b     \
          oppositeEdge.prev = oppositeEdge.prev.prev;
          oppositeEdge.prev.next = oppositeEdge;
        }
        //       /|
        //      / |
        //     /  |
        //    / a |
        //   *----*----*
        //  /     b  ▴  \
        //           |
        //     redundant edge
        next.prev = prev.prev;
        next.prev.next = next;

        //       / \  \
        //      /   \->\
        //     /     \<-\ opposite edge
        //    / a     \  \
        //   *----*----*
        //  /     b  ^  \
        next.setOpposite(oppositeEdge);

        oppositeFace.computeNormalAndCentroid();
      } else {
        // trivial case
        //        *
        //       /|\
        //      / | \
        //     /  |--> next
        //    / a |   \
        //   *----*----*
        //    \ b |   /
        //     \  |--> prev
        //      \ | /
        //       \|/
        //        *
        prev.next = next;
        next.prev = prev;
      }
      return discardedFace;
    }
  }, {
    key: 'mergeAdjacentFaces',
    value: function mergeAdjacentFaces(adjacentEdge, discardedFaces) {
      var oppositeEdge = adjacentEdge.opposite;
      var oppositeFace = oppositeEdge.face;

      discardedFaces.push(oppositeFace);
      oppositeFace.mark = DELETED;

      // find the chain of edges whose opposite face is `oppositeFace`
      //
      //                ===>
      //      \         face         /
      //       * ---- * ---- * ---- *
      //      /     opposite face    \
      //                <===
      //
      var adjacentEdgePrev = adjacentEdge.prev;
      var adjacentEdgeNext = adjacentEdge.next;
      var oppositeEdgePrev = oppositeEdge.prev;
      var oppositeEdgeNext = oppositeEdge.next;

      // left edge
      while (adjacentEdgePrev.opposite.face === oppositeFace) {
        adjacentEdgePrev = adjacentEdgePrev.prev;
        oppositeEdgeNext = oppositeEdgeNext.next;
      }
      // right edge
      while (adjacentEdgeNext.opposite.face === oppositeFace) {
        adjacentEdgeNext = adjacentEdgeNext.next;
        oppositeEdgePrev = oppositeEdgePrev.prev;
      }
      // adjacentEdgePrev  \         face         / adjacentEdgeNext
      //                    * ---- * ---- * ---- *
      // oppositeEdgeNext  /     opposite face    \ oppositeEdgePrev

      // fix the face reference of all the opposite edges that are not part of
      // the edges whose opposite face is not `face` i.e. all the edges that
      // `face` and `oppositeFace` do not have in common
      var edge = void 0;
      for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
        edge.face = this;
      }

      // make sure that `face.edge` is not one of the edges to be destroyed
      // Note: it's important for it to be a `next` edge since `prev` edges
      // might be destroyed on `connectHalfEdges`
      this.edge = adjacentEdgeNext;

      // connect the extremes
      // Note: it might be possible that after connecting the edges a triangular
      // face might be redundant
      var discardedFace = void 0;
      discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);
      if (discardedFace) {
        discardedFaces.push(discardedFace);
      }
      discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);
      if (discardedFace) {
        discardedFaces.push(discardedFace);
      }

      this.computeNormalAndCentroid();
      // TODO: additional consistency checks
      return discardedFaces;
    }
  }, {
    key: 'collectIndices',
    value: function collectIndices() {
      var indices = [];
      var edge = this.edge;
      do {
        indices.push(edge.head().index);
        edge = edge.next;
      } while (edge !== this.edge);
      return indices;
    }
  }], [{
    key: 'createTriangle',
    value: function createTriangle(v0, v1, v2) {
      var minArea = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      var face = new Face();
      var e0 = new _HalfEdge2.default(v0, face);
      var e1 = new _HalfEdge2.default(v1, face);
      var e2 = new _HalfEdge2.default(v2, face);

      // join edges
      e0.next = e2.prev = e1;
      e1.next = e0.prev = e2;
      e2.next = e1.prev = e0;

      // main half edge reference
      face.edge = e0;
      face.computeNormalAndCentroid(minArea);
      if (debug.enabled) {
        debug('face created %j', face.collectIndices());
      }
      return face;
    }
  }]);

  return Face;
}();

exports.default = Face;
});

unwrapExports(Face_1);
var Face_2 = Face_1.DELETED;
var Face_3 = Face_1.NON_CONVEX;
var Face_4 = Face_1.VISIBLE;

var QuickHull_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _pointLineDistance2 = _interopRequireDefault(pointLineDistance);



var _getPlaneNormal2 = _interopRequireDefault(getPlaneNormal);



var _dot2 = _interopRequireDefault(dot_1);



var _VertexList2 = _interopRequireDefault(VertexList_1);



var _Vertex2 = _interopRequireDefault(Vertex_1);



var _Face2 = _interopRequireDefault(Face_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = src('quickhull');

// merge types
// non convex with respect to the large face
var MERGE_NON_CONVEX_WRT_LARGER_FACE = 1;
var MERGE_NON_CONVEX = 2;

var QuickHull = function () {
  function QuickHull(points) {
    _classCallCheck(this, QuickHull);

    if (!Array.isArray(points)) {
      throw TypeError('input is not a valid array');
    }
    if (points.length < 4) {
      throw Error('cannot build a simplex out of <4 points');
    }

    this.tolerance = -1;

    // buffers
    this.nFaces = 0;
    this.nPoints = points.length;

    this.faces = [];
    this.newFaces = [];
    // helpers
    //
    // let `a`, `b` be `Face` instances
    // let `v` be points wrapped as instance of `Vertex`
    //
    //     [v, v, ..., v, v, v, ...]
    //      ^             ^
    //      |             |
    //  a.outside     b.outside
    //
    this.claimed = new _VertexList2.default();
    this.unclaimed = new _VertexList2.default();

    // vertices of the hull(internal representation of points)
    this.vertices = [];
    for (var i = 0; i < points.length; i += 1) {
      this.vertices.push(new _Vertex2.default(points[i], i));
    }
    this.discardedFaces = [];
    this.vertexPointIndices = [];
  }

  _createClass(QuickHull, [{
    key: 'addVertexToFace',
    value: function addVertexToFace(vertex, face) {
      vertex.face = face;
      if (!face.outside) {
        this.claimed.add(vertex);
      } else {
        this.claimed.insertBefore(face.outside, vertex);
      }
      face.outside = vertex;
    }

    /**
     * Removes `vertex` for the `claimed` list of vertices, it also makes sure
     * that the link from `face` to the first vertex it sees in `claimed` is
     * linked correctly after the removal
     *
     * @param {Vertex} vertex
     * @param {Face} face
     */

  }, {
    key: 'removeVertexFromFace',
    value: function removeVertexFromFace(vertex, face) {
      if (vertex === face.outside) {
        // fix face.outside link
        if (vertex.next && vertex.next.face === face) {
          // face has at least 2 outside vertices, move the `outside` reference
          face.outside = vertex.next;
        } else {
          // vertex was the only outside vertex that face had
          face.outside = null;
        }
      }
      this.claimed.remove(vertex);
    }

    /**
     * Removes all the visible vertices that `face` is able to see which are
     * stored in the `claimed` vertext list
     *
     * @param {Face} face
     * @return {Vertex|undefined} If face had visible vertices returns
     * `face.outside`, otherwise undefined
     */

  }, {
    key: 'removeAllVerticesFromFace',
    value: function removeAllVerticesFromFace(face) {
      if (face.outside) {
        // pointer to the last vertex of this face
        // [..., outside, ..., end, outside, ...]
        //          |           |      |
        //          a           a      b
        var end = face.outside;
        while (end.next && end.next.face === face) {
          end = end.next;
        }
        this.claimed.removeChain(face.outside, end);
        //                            b
        //                       [ outside, ...]
        //                            |  removes this link
        //     [ outside, ..., end ] -┘
        //          |           |
        //          a           a
        end.next = null;
        return face.outside;
      }
    }

    /**
     * Removes all the visible vertices that `face` is able to see, additionally
     * checking the following:
     *
     * If `absorbingFace` doesn't exist then all the removed vertices will be
     * added to the `unclaimed` vertex list
     *
     * If `absorbingFace` exists then this method will assign all the vertices of
     * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
     * it's added to the `unclaimed` vertex list
     *
     * @param {Face} face
     * @param {Face} [absorbingFace]
     */

  }, {
    key: 'deleteFaceVertices',
    value: function deleteFaceVertices(face, absorbingFace) {
      var faceVertices = this.removeAllVerticesFromFace(face);
      if (faceVertices) {
        if (!absorbingFace) {
          // mark the vertices to be reassigned to some other face
          this.unclaimed.addAll(faceVertices);
        } else {
          // if there's an absorbing face try to assign as many vertices
          // as possible to it

          // the reference `vertex.next` might be destroyed on
          // `this.addVertexToFace` (see VertexList#add), nextVertex is a
          // reference to it
          var nextVertex = void 0;
          for (var vertex = faceVertices; vertex; vertex = nextVertex) {
            nextVertex = vertex.next;
            var distance = absorbingFace.distanceToPlane(vertex.point);

            // check if `vertex` is able to see `absorbingFace`
            if (distance > this.tolerance) {
              this.addVertexToFace(vertex, absorbingFace);
            } else {
              this.unclaimed.add(vertex);
            }
          }
        }
      }
    }

    /**
     * Reassigns as many vertices as possible from the unclaimed list to the new
     * faces
     *
     * @param {Faces[]} newFaces
     */

  }, {
    key: 'resolveUnclaimedPoints',
    value: function resolveUnclaimedPoints(newFaces) {
      // cache next vertex so that if `vertex.next` is destroyed it's still
      // recoverable
      var vertexNext = this.unclaimed.first();
      for (var vertex = vertexNext; vertex; vertex = vertexNext) {
        vertexNext = vertex.next;
        var maxDistance = this.tolerance;
        var maxFace = void 0;
        for (var i = 0; i < newFaces.length; i += 1) {
          var face = newFaces[i];
          if (face.mark === Face_1.VISIBLE) {
            var dist = face.distanceToPlane(vertex.point);
            if (dist > maxDistance) {
              maxDistance = dist;
              maxFace = face;
            }
            if (maxDistance > 1000 * this.tolerance) {
              break;
            }
          }
        }

        if (maxFace) {
          this.addVertexToFace(vertex, maxFace);
        }
      }
    }

    /**
     * Computes the extremes of a tetrahedron which will be the initial hull
     *
     * @return {number[]} The min/max vertices in the x,y,z directions
     */

  }, {
    key: 'computeExtremes',
    value: function computeExtremes() {
      var me = this;
      var min = [];
      var max = [];

      // min vertex on the x,y,z directions
      var minVertices = [];
      // max vertex on the x,y,z directions
      var maxVertices = [];

      var i = void 0,
          j = void 0;

      // initially assume that the first vertex is the min/max
      for (i = 0; i < 3; i += 1) {
        minVertices[i] = maxVertices[i] = this.vertices[0];
      }
      // copy the coordinates of the first vertex to min/max
      for (i = 0; i < 3; i += 1) {
        min[i] = max[i] = this.vertices[0].point[i];
      }

      // compute the min/max vertex on all 6 directions
      for (i = 1; i < this.vertices.length; i += 1) {
        var vertex = this.vertices[i];
        var point = vertex.point;
        // update the min coordinates
        for (j = 0; j < 3; j += 1) {
          if (point[j] < min[j]) {
            min[j] = point[j];
            minVertices[j] = vertex;
          }
        }
        // update the max coordinates
        for (j = 0; j < 3; j += 1) {
          if (point[j] > max[j]) {
            max[j] = point[j];
            maxVertices[j] = vertex;
          }
        }
      }

      // compute epsilon
      this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min[0]), Math.abs(max[0])) + Math.max(Math.abs(min[1]), Math.abs(max[1])) + Math.max(Math.abs(min[2]), Math.abs(max[2])));
      if (debug.enabled) {
        debug('tolerance %d', me.tolerance);
      }
      return [minVertices, maxVertices];
    }

    /**
     * Compues the initial tetrahedron assigning to its faces all the points that
     * are candidates to form part of the hull
     */

  }, {
    key: 'createInitialSimplex',
    value: function createInitialSimplex() {
      var vertices = this.vertices;

      var _computeExtremes = this.computeExtremes(),
          _computeExtremes2 = _slicedToArray(_computeExtremes, 2),
          min = _computeExtremes2[0],
          max = _computeExtremes2[1];

      var v0 = void 0,
          v1 = void 0,
          v2 = void 0,
          v3 = void 0;
      var i = void 0,
          j = void 0;

      // Find the two vertices with the greatest 1d separation
      // (max.x - min.x)
      // (max.y - min.y)
      // (max.z - min.z)
      var maxDistance = 0;
      var indexMax = 0;
      for (i = 0; i < 3; i += 1) {
        var distance = max[i].point[i] - min[i].point[i];
        if (distance > maxDistance) {
          maxDistance = distance;
          indexMax = i;
        }
      }
      v0 = min[indexMax];
      v1 = max[indexMax];

      // the next vertex is the one farthest to the line formed by `v0` and `v1`
      maxDistance = 0;
      for (i = 0; i < this.vertices.length; i += 1) {
        var vertex = this.vertices[i];
        if (vertex !== v0 && vertex !== v1) {
          var _distance = (0, _pointLineDistance2.default)(vertex.point, v0.point, v1.point);
          if (_distance > maxDistance) {
            maxDistance = _distance;
            v2 = vertex;
          }
        }
      }

      // the next vertes is the one farthest to the plane `v0`, `v1`, `v2`
      // normalize((v2 - v1) x (v0 - v1))
      var normal = (0, _getPlaneNormal2.default)([], v0.point, v1.point, v2.point);
      // distance from the origin to the plane
      var distPO = (0, _dot2.default)(v0.point, normal);
      maxDistance = -1;
      for (i = 0; i < this.vertices.length; i += 1) {
        var _vertex = this.vertices[i];
        if (_vertex !== v0 && _vertex !== v1 && _vertex !== v2) {
          var _distance2 = Math.abs((0, _dot2.default)(normal, _vertex.point) - distPO);
          if (_distance2 > maxDistance) {
            maxDistance = _distance2;
            v3 = _vertex;
          }
        }
      }

      // initial simplex
      // Taken from http://everything2.com/title/How+to+paint+a+tetrahedron
      //
      //                              v2
      //                             ,|,
      //                           ,7``\'VA,
      //                         ,7`   |, `'VA,
      //                       ,7`     `\    `'VA,
      //                     ,7`        |,      `'VA,
      //                   ,7`          `\         `'VA,
      //                 ,7`             |,           `'VA,
      //               ,7`               `\       ,..ooOOTK` v3
      //             ,7`                  |,.ooOOT''`    AV
      //           ,7`            ,..ooOOT`\`           /7
      //         ,7`      ,..ooOOT''`      |,          AV
      //        ,T,..ooOOT''`              `\         /7
      //     v0 `'TTs.,                     |,       AV
      //            `'TTs.,                 `\      /7
      //                 `'TTs.,             |,    AV
      //                      `'TTs.,        `\   /7
      //                           `'TTs.,    |, AV
      //                                `'TTs.,\/7
      //                                     `'T`
      //                                       v1
      //
      var faces = [];
      if ((0, _dot2.default)(v3.point, normal) - distPO < 0) {
        // the face is not able to see the point so `planeNormal`
        // is pointing outside the tetrahedron
        faces.push(_Face2.default.createTriangle(v0, v1, v2), _Face2.default.createTriangle(v3, v1, v0), _Face2.default.createTriangle(v3, v2, v1), _Face2.default.createTriangle(v3, v0, v2));

        // set the opposite edge
        for (i = 0; i < 3; i += 1) {
          var _j = (i + 1) % 3;
          // join face[i] i > 0, with the first face
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(_j));
          // join face[i] with face[i + 1], 1 <= i <= 3
          faces[i + 1].getEdge(1).setOpposite(faces[_j + 1].getEdge(0));
        }
      } else {
        // the face is able to see the point so `planeNormal`
        // is pointing inside the tetrahedron
        faces.push(_Face2.default.createTriangle(v0, v2, v1), _Face2.default.createTriangle(v3, v0, v1), _Face2.default.createTriangle(v3, v1, v2), _Face2.default.createTriangle(v3, v2, v0));

        // set the opposite edge
        for (i = 0; i < 3; i += 1) {
          var _j2 = (i + 1) % 3;
          // join face[i] i > 0, with the first face
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3));
          // join face[i] with face[i + 1]
          faces[i + 1].getEdge(0).setOpposite(faces[_j2 + 1].getEdge(1));
        }
      }

      // the initial hull is the tetrahedron
      for (i = 0; i < 4; i += 1) {
        this.faces.push(faces[i]);
      }

      // initial assignment of vertices to the faces of the tetrahedron
      for (i = 0; i < vertices.length; i += 1) {
        var _vertex2 = vertices[i];
        if (_vertex2 !== v0 && _vertex2 !== v1 && _vertex2 !== v2 && _vertex2 !== v3) {
          maxDistance = this.tolerance;
          var maxFace = void 0;
          for (j = 0; j < 4; j += 1) {
            var _distance3 = faces[j].distanceToPlane(_vertex2.point);
            if (_distance3 > maxDistance) {
              maxDistance = _distance3;
              maxFace = faces[j];
            }
          }

          if (maxFace) {
            this.addVertexToFace(_vertex2, maxFace);
          }
        }
      }
    }
  }, {
    key: 'reindexFaceAndVertices',
    value: function reindexFaceAndVertices() {
      // remove inactive faces
      var activeFaces = [];
      for (var i = 0; i < this.faces.length; i += 1) {
        var face = this.faces[i];
        if (face.mark === Face_1.VISIBLE) {
          activeFaces.push(face);
        }
      }
      this.faces = activeFaces;
    }
  }, {
    key: 'collectFaces',
    value: function collectFaces(skipTriangulation) {
      var faceIndices = [];
      for (var i = 0; i < this.faces.length; i += 1) {
        if (this.faces[i].mark !== Face_1.VISIBLE) {
          throw Error('attempt to include a destroyed face in the hull');
        }
        var indices = this.faces[i].collectIndices();
        if (skipTriangulation) {
          faceIndices.push(indices);
        } else {
          for (var j = 0; j < indices.length - 2; j += 1) {
            faceIndices.push([indices[0], indices[j + 1], indices[j + 2]]);
          }
        }
      }
      return faceIndices;
    }

    /**
     * Finds the next vertex to make faces with the current hull
     *
     * - let `face` be the first face existing in the `claimed` vertex list
     *  - if `face` doesn't exist then return since there're no vertices left
     *  - otherwise for each `vertex` that face sees find the one furthest away
     *  from `face`
     *
     * @return {Vertex|undefined} Returns undefined when there're no more
     * visible vertices
     */

  }, {
    key: 'nextVertexToAdd',
    value: function nextVertexToAdd() {
      if (!this.claimed.isEmpty()) {
        var eyeVertex = void 0,
            vertex = void 0;
        var maxDistance = 0;
        var eyeFace = this.claimed.first().face;
        for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
          var distance = eyeFace.distanceToPlane(vertex.point);
          if (distance > maxDistance) {
            maxDistance = distance;
            eyeVertex = vertex;
          }
        }
        return eyeVertex;
      }
    }

    /**
     * Computes a chain of half edges in ccw order called the `horizon`, for an
     * edge to be part of the horizon it must join a face that can see
     * `eyePoint` and a face that cannot see `eyePoint`
     *
     * @param {number[]} eyePoint - The coordinates of a point
     * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
     * @param {Face} face - The current face being tested
     * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
     * ccw order
     */

  }, {
    key: 'computeHorizon',
    value: function computeHorizon(eyePoint, crossEdge, face, horizon) {
      // moves face's vertices to the `unclaimed` vertex list
      this.deleteFaceVertices(face);

      face.mark = Face_1.DELETED;

      var edge = void 0;
      if (!crossEdge) {
        edge = crossEdge = face.getEdge(0);
      } else {
        // start from the next edge since `crossEdge` was already analyzed
        // (actually `crossEdge.opposite` was the face who called this method
        // recursively)
        edge = crossEdge.next;
      }

      // All the faces that are able to see `eyeVertex` are defined as follows
      //
      //       v    /
      //           / <== visible face
      //          /
      //         |
      //         | <== not visible face
      //
      //  dot(v, visible face normal) - visible face offset > this.tolerance
      //
      do {
        var oppositeEdge = edge.opposite;
        var oppositeFace = oppositeEdge.face;
        if (oppositeFace.mark === Face_1.VISIBLE) {
          if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
            this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
          } else {
            horizon.push(edge);
          }
        }
        edge = edge.next;
      } while (edge !== crossEdge);
    }

    /**
     * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
     * `horizonEdge.tail` in ccw order
     *
     * @param {Vertex} eyeVertex
     * @param {HalfEdge} horizonEdge
     * @return {HalfEdge} The half edge whose vertex is the eyeVertex
     */

  }, {
    key: 'addAdjoiningFace',
    value: function addAdjoiningFace(eyeVertex, horizonEdge) {
      // all the half edges are created in ccw order thus the face is always
      // pointing outside the hull
      // edges:
      //
      //                  eyeVertex.point
      //                       / \
      //                      /   \
      //                  1  /     \  0
      //                    /       \
      //                   /         \
      //                  /           \
      //          horizon.tail --- horizon.head
      //                        2
      //
      var face = _Face2.default.createTriangle(eyeVertex, horizonEdge.tail(), horizonEdge.head());
      this.faces.push(face);
      // join face.getEdge(-1) with the horizon's opposite edge
      // face.getEdge(-1) = face.getEdge(2)
      face.getEdge(-1).setOpposite(horizonEdge.opposite);
      return face.getEdge(0);
    }

    /**
     * Adds horizon.length faces to the hull, each face will be 'linked' with the
     * horizon opposite face and the face on the left/right
     *
     * @param {Vertex} eyeVertex
     * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
     */

  }, {
    key: 'addNewFaces',
    value: function addNewFaces(eyeVertex, horizon) {
      this.newFaces = [];
      var firstSideEdge = void 0,
          previousSideEdge = void 0;
      for (var i = 0; i < horizon.length; i += 1) {
        var horizonEdge = horizon[i];
        // returns the right side edge
        var sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
        if (!firstSideEdge) {
          firstSideEdge = sideEdge;
        } else {
          // joins face.getEdge(1) with previousFace.getEdge(0)
          sideEdge.next.setOpposite(previousSideEdge);
        }
        this.newFaces.push(sideEdge.face);
        previousSideEdge = sideEdge;
      }
      firstSideEdge.next.setOpposite(previousSideEdge);
    }

    /**
     * Computes the distance from `edge` opposite face's centroid to
     * `edge.face`
     *
     * @param {HalfEdge} edge
     * @return {number}
     * - A positive number when the centroid of the opposite face is above the
     *   face i.e. when the faces are concave
     * - A negative number when the centroid of the opposite face is below the
     *   face i.e. when the faces are convex
     */

  }, {
    key: 'oppositeFaceDistance',
    value: function oppositeFaceDistance(edge) {
      return edge.face.distanceToPlane(edge.opposite.face.centroid);
    }

    /**
     * Merges a face with none/any/all its neighbors according to the strategy
     * used
     *
     * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
     * decided based on the face with the larger area, the centroid of the face
     * with the smaller area will be checked against the one with the larger area
     * to see if it's in the merge range [tolerance, -tolerance] i.e.
     *
     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
     *
     * Note that the first check (with +tolerance) was done on `computeHorizon`
     *
     * If the above is not true then the check is done with respect to the smaller
     * face i.e.
     *
     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
     *
     * If true then it means that two faces are non convex (concave), even if the
     * dot(...) - offset value is > 0 (that's the point of doing the merge in the
     * first place)
     *
     * If two faces are concave then the check must also be done on the other face
     * but this is done in another merge pass, for this to happen the face is
     * marked in a temporal NON_CONVEX state
     *
     * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
     * they pass the following conditions
     *
     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
     *
     * @param {Face} face
     * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or
     * MERGE_NON_CONVEX
     */

  }, {
    key: 'doAdjacentMerge',
    value: function doAdjacentMerge(face, mergeType) {
      var edge = face.edge;
      var convex = true;
      var it = 0;
      do {
        if (it >= face.nVertices) {
          throw Error('merge recursion limit exceeded');
        }
        var oppositeFace = edge.opposite.face;
        var merge = false;

        // Important notes about the algorithm to merge faces
        //
        // - Given a vertex `eyeVertex` that will be added to the hull
        //   all the faces that cannot see `eyeVertex` are defined as follows
        //
        //      dot(v, not visible face normal) - not visible offset < tolerance
        //
        // - Two faces can be merged when the centroid of one of these faces
        // projected to the normal of the other face minus the other face offset
        // is in the range [tolerance, -tolerance]
        // - Since `face` (given in the input for this method) has passed the
        // check above we only have to check the lower bound e.g.
        //
        //      dot(v, not visible face normal) - not visible offset > -tolerance
        //
        if (mergeType === MERGE_NON_CONVEX) {
          if (this.oppositeFaceDistance(edge) > -this.tolerance || this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
            merge = true;
          }
        } else {
          if (face.area > oppositeFace.area) {
            if (this.oppositeFaceDistance(edge) > -this.tolerance) {
              merge = true;
            } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              convex = false;
            }
          } else {
            if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              merge = true;
            } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
              convex = false;
            }
          }
        }

        if (merge) {
          debug('face merge');
          // when two faces are merged it might be possible that redundant faces
          // are destroyed, in that case move all the visible vertices from the
          // destroyed faces to the `unclaimed` vertex list
          var discardedFaces = face.mergeAdjacentFaces(edge, []);
          for (var i = 0; i < discardedFaces.length; i += 1) {
            this.deleteFaceVertices(discardedFaces[i], face);
          }
          return true;
        }

        edge = edge.next;
        it += 1;
      } while (edge !== face.edge);
      if (!convex) {
        face.mark = Face_1.NON_CONVEX;
      }
      return false;
    }

    /**
     * Adds a vertex to the hull with the following algorithm
     *
     * - Compute the `horizon` which is a chain of half edges, for an edge to
     *   belong to this group it must be the edge connecting a face that can
     *   see `eyeVertex` and a face which cannot see `eyeVertex`
     * - All the faces that can see `eyeVertex` have its visible vertices removed
     *   from the claimed VertexList
     * - A new set of faces is created with each edge of the `horizon` and
     *   `eyeVertex`, each face is connected with the opposite horizon face and
     *   the face on the left/right
     * - The new faces are merged if possible with the opposite horizon face first
     *   and then the faces on the right/left
     * - The vertices removed from all the visible faces are assigned to the new
     *   faces if possible
     *
     * @param {Vertex} eyeVertex
     */

  }, {
    key: 'addVertexToHull',
    value: function addVertexToHull(eyeVertex) {
      var horizon = [];

      this.unclaimed.clear();

      // remove `eyeVertex` from `eyeVertex.face` so that it can't be added to the
      // `unclaimed` vertex list
      this.removeVertexFromFace(eyeVertex, eyeVertex.face);
      this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
      if (debug.enabled) {
        debug('horizon %j', horizon.map(function (edge) {
          return edge.head().index;
        }));
      }
      this.addNewFaces(eyeVertex, horizon);

      debug('first merge');

      // first merge pass
      // Do the merge with respect to the larger face
      for (var i = 0; i < this.newFaces.length; i += 1) {
        var face = this.newFaces[i];
        if (face.mark === Face_1.VISIBLE) {
          while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {}
        }
      }

      debug('second merge');

      // second merge pass
      // Do the merge on non convex faces (a face is marked as non convex in the
      // first pass)
      for (var _i = 0; _i < this.newFaces.length; _i += 1) {
        var _face = this.newFaces[_i];
        if (_face.mark === Face_1.NON_CONVEX) {
          _face.mark = Face_1.VISIBLE;
          while (this.doAdjacentMerge(_face, MERGE_NON_CONVEX)) {}
        }
      }

      debug('reassigning points to newFaces');
      // reassign `unclaimed` vertices to the new faces
      this.resolveUnclaimedPoints(this.newFaces);
    }
  }, {
    key: 'build',
    value: function build() {
      var iterations = 0;
      var eyeVertex = void 0;
      this.createInitialSimplex();
      while (eyeVertex = this.nextVertexToAdd()) {
        iterations += 1;
        debug('== iteration %j ==', iterations);
        debug('next vertex to add = %d %j', eyeVertex.index, eyeVertex.point);
        this.addVertexToHull(eyeVertex);
        debug('end');
      }
      this.reindexFaceAndVertices();
    }
  }]);

  return QuickHull;
}();

exports.default = QuickHull;
module.exports = exports['default'];
});

var QuickHull = unwrapExports(QuickHull_1);

const buildConvexHullImpl = (points) => {
  const hull = new QuickHull(points, { skipTriangulation: true });
  hull.build();
  const polygons = hull.collectFaces().map(polygon => polygon.map(nthPoint => points[nthPoint]));
  polygons.isConvex = true;
  return { solid: fromPolygons({}, polygons) };
};

const buildConvexHull = cache$1(buildConvexHullImpl);

const buildConvexMinkowskiSumImpl = (aPoints, bPoints) => {
  const summedPoints = [];
  for (const aPoint of aPoints) {
    for (const summedPoint of translate(aPoint, bPoints)) {
      summedPoints.push(summedPoint);
    }
  }
  return buildConvexHull(summedPoints);
};

const buildConvexMinkowskiSum = cache$1(buildConvexMinkowskiSumImpl);

var twoProduct_1 = twoProduct;

var SPLITTER = +(Math.pow(2, 27) + 1.0);

function twoProduct(a, b, result) {
  var x = a * b;

  var c = SPLITTER * a;
  var abig = c - a;
  var ahi = c - abig;
  var alo = a - ahi;

  var d = SPLITTER * b;
  var bbig = d - b;
  var bhi = d - bbig;
  var blo = b - bhi;

  var err1 = x - (ahi * bhi);
  var err2 = err1 - (alo * bhi);
  var err3 = err2 - (ahi * blo);

  var y = alo * blo - err3;

  if(result) {
    result[0] = y;
    result[1] = x;
    return result
  }

  return [ y, x ]
}

var robustSum = linearExpansionSum;

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b;
  var bv = x - a;
  var av = x - bv;
  var br = b - bv;
  var ar = a - av;
  var y = ar + br;
  if(y) {
    return [y, x]
  }
  return [x]
}

function linearExpansionSum(e, f) {
  var ne = e.length|0;
  var nf = f.length|0;
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], f[0])
  }
  var n = ne + nf;
  var g = new Array(n);
  var count = 0;
  var eptr = 0;
  var fptr = 0;
  var abs = Math.abs;
  var ei = e[eptr];
  var ea = abs(ei);
  var fi = f[fptr];
  var fa = abs(fi);
  var a, b;
  if(ea < fa) {
    b = ei;
    eptr += 1;
    if(eptr < ne) {
      ei = e[eptr];
      ea = abs(ei);
    }
  } else {
    b = fi;
    fptr += 1;
    if(fptr < nf) {
      fi = f[fptr];
      fa = abs(fi);
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei;
    eptr += 1;
    if(eptr < ne) {
      ei = e[eptr];
      ea = abs(ei);
    }
  } else {
    a = fi;
    fptr += 1;
    if(fptr < nf) {
      fi = f[fptr];
      fa = abs(fi);
    }
  }
  var x = a + b;
  var bv = x - a;
  var y = b - bv;
  var q0 = y;
  var q1 = x;
  var _x, _bv, _av, _br, _ar;
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei;
      eptr += 1;
      if(eptr < ne) {
        ei = e[eptr];
        ea = abs(ei);
      }
    } else {
      a = fi;
      fptr += 1;
      if(fptr < nf) {
        fi = f[fptr];
        fa = abs(fi);
      }
    }
    b = q0;
    x = a + b;
    bv = x - a;
    y = b - bv;
    if(y) {
      g[count++] = y;
    }
    _x = q1 + x;
    _bv = _x - q1;
    _av = _x - _bv;
    _br = x - _bv;
    _ar = q1 - _av;
    q0 = _ar + _br;
    q1 = _x;
  }
  while(eptr < ne) {
    a = ei;
    b = q0;
    x = a + b;
    bv = x - a;
    y = b - bv;
    if(y) {
      g[count++] = y;
    }
    _x = q1 + x;
    _bv = _x - q1;
    _av = _x - _bv;
    _br = x - _bv;
    _ar = q1 - _av;
    q0 = _ar + _br;
    q1 = _x;
    eptr += 1;
    if(eptr < ne) {
      ei = e[eptr];
    }
  }
  while(fptr < nf) {
    a = fi;
    b = q0;
    x = a + b;
    bv = x - a;
    y = b - bv;
    if(y) {
      g[count++] = y;
    } 
    _x = q1 + x;
    _bv = _x - q1;
    _av = _x - _bv;
    _br = x - _bv;
    _ar = q1 - _av;
    q0 = _ar + _br;
    q1 = _x;
    fptr += 1;
    if(fptr < nf) {
      fi = f[fptr];
    }
  }
  if(q0) {
    g[count++] = q0;
  }
  if(q1) {
    g[count++] = q1;
  }
  if(!count) {
    g[count++] = 0.0;  
  }
  g.length = count;
  return g
}

var twoSum = fastTwoSum;

function fastTwoSum(a, b, result) {
	var x = a + b;
	var bv = x - a;
	var av = x - bv;
	var br = b - bv;
	var ar = a - av;
	if(result) {
		result[0] = ar + br;
		result[1] = x;
		return result
	}
	return [ar+br, x]
}

var robustScale = scaleLinearExpansion;

function scaleLinearExpansion(e, scale) {
  var n = e.length;
  if(n === 1) {
    var ts = twoProduct_1(e[0], scale);
    if(ts[0]) {
      return ts
    }
    return [ ts[1] ]
  }
  var g = new Array(2 * n);
  var q = [0.1, 0.1];
  var t = [0.1, 0.1];
  var count = 0;
  twoProduct_1(e[0], scale, q);
  if(q[0]) {
    g[count++] = q[0];
  }
  for(var i=1; i<n; ++i) {
    twoProduct_1(e[i], scale, t);
    var pq = q[1];
    twoSum(pq, t[0], q);
    if(q[0]) {
      g[count++] = q[0];
    }
    var a = t[1];
    var b = q[1];
    var x = a + b;
    var bv = x - a;
    var y = b - bv;
    q[1] = x;
    if(y) {
      g[count++] = y;
    }
  }
  if(q[1]) {
    g[count++] = q[1];
  }
  if(count === 0) {
    g[count++] = 0.0;
  }
  g.length = count;
  return g
}

var robustDiff = robustSubtract;

//Easy case: Add two scalars
function scalarScalar$1(a, b) {
  var x = a + b;
  var bv = x - a;
  var av = x - bv;
  var br = b - bv;
  var ar = a - av;
  var y = ar + br;
  if(y) {
    return [y, x]
  }
  return [x]
}

function robustSubtract(e, f) {
  var ne = e.length|0;
  var nf = f.length|0;
  if(ne === 1 && nf === 1) {
    return scalarScalar$1(e[0], -f[0])
  }
  var n = ne + nf;
  var g = new Array(n);
  var count = 0;
  var eptr = 0;
  var fptr = 0;
  var abs = Math.abs;
  var ei = e[eptr];
  var ea = abs(ei);
  var fi = -f[fptr];
  var fa = abs(fi);
  var a, b;
  if(ea < fa) {
    b = ei;
    eptr += 1;
    if(eptr < ne) {
      ei = e[eptr];
      ea = abs(ei);
    }
  } else {
    b = fi;
    fptr += 1;
    if(fptr < nf) {
      fi = -f[fptr];
      fa = abs(fi);
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei;
    eptr += 1;
    if(eptr < ne) {
      ei = e[eptr];
      ea = abs(ei);
    }
  } else {
    a = fi;
    fptr += 1;
    if(fptr < nf) {
      fi = -f[fptr];
      fa = abs(fi);
    }
  }
  var x = a + b;
  var bv = x - a;
  var y = b - bv;
  var q0 = y;
  var q1 = x;
  var _x, _bv, _av, _br, _ar;
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei;
      eptr += 1;
      if(eptr < ne) {
        ei = e[eptr];
        ea = abs(ei);
      }
    } else {
      a = fi;
      fptr += 1;
      if(fptr < nf) {
        fi = -f[fptr];
        fa = abs(fi);
      }
    }
    b = q0;
    x = a + b;
    bv = x - a;
    y = b - bv;
    if(y) {
      g[count++] = y;
    }
    _x = q1 + x;
    _bv = _x - q1;
    _av = _x - _bv;
    _br = x - _bv;
    _ar = q1 - _av;
    q0 = _ar + _br;
    q1 = _x;
  }
  while(eptr < ne) {
    a = ei;
    b = q0;
    x = a + b;
    bv = x - a;
    y = b - bv;
    if(y) {
      g[count++] = y;
    }
    _x = q1 + x;
    _bv = _x - q1;
    _av = _x - _bv;
    _br = x - _bv;
    _ar = q1 - _av;
    q0 = _ar + _br;
    q1 = _x;
    eptr += 1;
    if(eptr < ne) {
      ei = e[eptr];
    }
  }
  while(fptr < nf) {
    a = fi;
    b = q0;
    x = a + b;
    bv = x - a;
    y = b - bv;
    if(y) {
      g[count++] = y;
    } 
    _x = q1 + x;
    _bv = _x - q1;
    _av = _x - _bv;
    _br = x - _bv;
    _ar = q1 - _av;
    q0 = _ar + _br;
    q1 = _x;
    fptr += 1;
    if(fptr < nf) {
      fi = -f[fptr];
    }
  }
  if(q0) {
    g[count++] = q0;
  }
  if(q1) {
    g[count++] = q1;
  }
  if(!count) {
    g[count++] = 0.0;  
  }
  g.length = count;
  return g
}

var orientation_1 = createCommonjsModule(function (module) {






var NUM_EXPAND = 5;

var EPSILON     = 1.1102230246251565e-16;
var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON;
var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON;

function cofactor(m, c) {
  var result = new Array(m.length-1);
  for(var i=1; i<m.length; ++i) {
    var r = result[i-1] = new Array(m.length-1);
    for(var j=0,k=0; j<m.length; ++j) {
      if(j === c) {
        continue
      }
      r[k++] = m[i][j];
    }
  }
  return result
}

function matrix(n) {
  var result = new Array(n);
  for(var i=0; i<n; ++i) {
    result[i] = new Array(n);
    for(var j=0; j<n; ++j) {
      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("");
    }
  }
  return result
}

function sign(n) {
  if(n & 1) {
    return "-"
  }
  return ""
}

function generateSum(expr) {
  if(expr.length === 1) {
    return expr[0]
  } else if(expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("")
  } else {
    var m = expr.length>>1;
    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
  }
}

function determinant(m) {
  if(m.length === 2) {
    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
  } else {
    var expr = [];
    for(var i=0; i<m.length; ++i) {
      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""));
    }
    return expr
  }
}

function orientation(n) {
  var pos = [];
  var neg = [];
  var m = matrix(n);
  var args = [];
  for(var i=0; i<n; ++i) {
    if((i&1)===0) {
      pos.push.apply(pos, determinant(cofactor(m, i)));
    } else {
      neg.push.apply(neg, determinant(cofactor(m, i)));
    }
    args.push("m" + i);
  }
  var posExpr = generateSum(pos);
  var negExpr = generateSum(neg);
  var funcName = "orientation" + n + "Exact";
  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("");
  var proc = new Function("sum", "prod", "scale", "sub", code);
  return proc(robustSum, twoProduct_1, robustScale, robustDiff)
}

var orientation3Exact = orientation(3);
var orientation4Exact = orientation(4);

var CACHED = [
  function orientation0() { return 0 },
  function orientation1() { return 0 },
  function orientation2(a, b) { 
    return b[0] - a[0]
  },
  function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0]);
    var r = (a[0] - c[0]) * (b[1] - c[1]);
    var det = l - r;
    var s;
    if(l > 0) {
      if(r <= 0) {
        return det
      } else {
        s = l + r;
      }
    } else if(l < 0) {
      if(r >= 0) {
        return det
      } else {
        s = -(l + r);
      }
    } else {
      return det
    }
    var tol = ERRBOUND3 * s;
    if(det >= tol || det <= -tol) {
      return det
    }
    return orientation3Exact(a, b, c)
  },
  function orientation4(a,b,c,d) {
    var adx = a[0] - d[0];
    var bdx = b[0] - d[0];
    var cdx = c[0] - d[0];
    var ady = a[1] - d[1];
    var bdy = b[1] - d[1];
    var cdy = c[1] - d[1];
    var adz = a[2] - d[2];
    var bdz = b[2] - d[2];
    var cdz = c[2] - d[2];
    var bdxcdy = bdx * cdy;
    var cdxbdy = cdx * bdy;
    var cdxady = cdx * ady;
    var adxcdy = adx * cdy;
    var adxbdy = adx * bdy;
    var bdxady = bdx * ady;
    var det = adz * (bdxcdy - cdxbdy) 
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady);
    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
    var tol = ERRBOUND4 * permanent;
    if ((det > tol) || (-det > tol)) {
      return det
    }
    return orientation4Exact(a,b,c,d)
  }
];

function slowOrient(args) {
  var proc = CACHED[args.length];
  if(!proc) {
    proc = CACHED[args.length] = orientation(args.length);
  }
  return proc.apply(undefined, args)
}

function generateOrientationProc() {
  while(CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length));
  }
  var args = [];
  var procArgs = ["slow"];
  for(var i=0; i<=NUM_EXPAND; ++i) {
    args.push("a" + i);
    procArgs.push("o" + i);
  }
  var code = [
    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
  ];
  for(var i=2; i<=NUM_EXPAND; ++i) {
    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");");
  }
  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation");
  procArgs.push(code.join(""));

  var proc = Function.apply(undefined, procArgs);
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
  for(var i=0; i<=NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i];
  }
}

generateOrientationProc();
});

var monotoneConvexHull2d = monotoneConvexHull2D;

var orient = orientation_1[3];

function monotoneConvexHull2D(points) {
  var n = points.length;

  if(n < 3) {
    var result = new Array(n);
    for(var i=0; i<n; ++i) {
      result[i] = i;
    }

    if(n === 2 &&
       points[0][0] === points[1][0] &&
       points[0][1] === points[1][1]) {
      return [0]
    }

    return result
  }

  //Sort point indices along x-axis
  var sorted = new Array(n);
  for(var i=0; i<n; ++i) {
    sorted[i] = i;
  }
  sorted.sort(function(a,b) {
    var d = points[a][0]-points[b][0];
    if(d) {
      return d
    }
    return points[a][1] - points[b][1]
  });

  //Construct upper and lower hulls
  var lower = [sorted[0], sorted[1]];
  var upper = [sorted[0], sorted[1]];

  for(var i=2; i<n; ++i) {
    var idx = sorted[i];
    var p   = points[idx];

    //Insert into lower list
    var m = lower.length;
    while(m > 1 && orient(
        points[lower[m-2]], 
        points[lower[m-1]], 
        p) <= 0) {
      m -= 1;
      lower.pop();
    }
    lower.push(idx);

    //Insert into upper list
    m = upper.length;
    while(m > 1 && orient(
        points[upper[m-2]], 
        points[upper[m-1]], 
        p) >= 0) {
      m -= 1;
      upper.pop();
    }
    upper.push(idx);
  }

  //Merge lists together
  var result = new Array(upper.length + lower.length - 2);
  var ptr    = 0;
  for(var i=0, nl=lower.length; i<nl; ++i) {
    result[ptr++] = lower[i];
  }
  for(var j=upper.length-2; j>0; --j) {
    result[ptr++] = upper[j];
  }

  //Return result
  return result
}

const buildConvexSurfaceHullImpl = (points) => {
  const hull = [];
  for (const nth of monotoneConvexHull2d(points)) {
    hull.push(points[nth]);
  }
  return { z0Surface: [hull.reverse()] };
};

const buildConvexSurfaceHull = cache$1(buildConvexSurfaceHullImpl);

const EPSILON = 1e-5;

const buildWalls = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    const a = deduplicate([floor[start], floor[end], roof[start]]);
    const b = deduplicate([floor[end], roof[end], roof[start]]);

    // Some of these polygons may become degenerate -- skip those.
    if (fromPolygon(a)) {
      polygons.push(a);
    }

    if (fromPolygon(b)) {
      polygons.push(b);
    }
  }
};

const buildPath = (op, latitude, resolution, context) => {
  const points = [];
  const step = 1 / resolution;
  for (let longitude = 0; longitude <= 1; longitude += step) {
    points.push(op(latitude, longitude, context));
  }
  return points;
};

// Build a tube from generated path slices.
// The paths are assumed to connect in a 1:1 vertical relationship before deduplication.
const buildFromFunctionImpl = (op, resolution, cap = true, context) => {
  const polygons = [];
  const step = 1 / resolution;
  let lastPath;
  for (let latitude = 0; latitude <= 1 + EPSILON; latitude += step) {
    const path = buildPath(op, latitude, resolution, context);
    if (lastPath !== undefined) {
      buildWalls(polygons, path, lastPath);
    } else {
      if (cap) {
        const deduplicatedPath = deduplicate(path);
        if (deduplicatedPath.length > 0) {
          polygons.push(...makeConvex([deduplicatedPath]));
        }
      }
    }
    lastPath = path;
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  if (cap) {
    const deduplicatedPath = deduplicate(flip(lastPath));
    if (deduplicatedPath.length > 0) {
      polygons.push(...makeConvex([deduplicatedPath]));
    }
  }
  const solid = { solid: fromPolygons({}, polygons) };
  return solid;
};

const buildFromFunction = cache$1(buildFromFunctionImpl);

const buildWalls$1 = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    const a = deduplicate([floor[start], floor[end], roof[start]]);
    const b = deduplicate([floor[end], roof[end], roof[start]]);

    // Some of these polygons may become degenerate -- skip those.
    if (fromPolygon(a)) {
      polygons.push(a);
    }

    if (fromPolygon(b)) {
      polygons.push(b);
    }
  }
};

// Build a tube from generated path slices.
// The paths are assumed to connect in a 1:1 vertical relationship before deduplication.
const buildFromSlices = (buildPath, resolution, cap = true) => {
  const polygons = [];
  const step = 1 / resolution;
  let lastPath;
  for (let t = 0; t <= 1; t += step) {
    const path = buildPath(t);
    if (lastPath !== undefined) {
      buildWalls$1(polygons, path, lastPath);
    } else {
      if (cap) {
        const deduplicatedPath = deduplicate(path);
        if (deduplicatedPath.length > 0) {
          polygons.push(...makeConvex([deduplicatedPath]));
        }
      }
    }
    lastPath = path;
  }
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  if (cap) {
    const deduplicatedPath = deduplicate(lastPath);
    if (deduplicatedPath.length > 0) {
      polygons.push(...flip$1(makeConvex([deduplicatedPath])));
    }
  }

  return { solid: fromPolygons({}, flip$1(polygons)) };
};

const fromPointsAndPaths = ({ points = [], paths = [] }) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push(fromPoints(path.map(nth => points[nth])));
  }
  return polygons;
};

// Unit icosahedron vertices.
const points = [[0.850651, 0.000000, -0.525731],
                [0.850651, -0.000000, 0.525731],
                [-0.850651, -0.000000, 0.525731],
                [-0.850651, 0.000000, -0.525731],
                [0.000000, -0.525731, 0.850651],
                [0.000000, 0.525731, 0.850651],
                [0.000000, 0.525731, -0.850651],
                [0.000000, -0.525731, -0.850651],
                [-0.525731, -0.850651, -0.000000],
                [0.525731, -0.850651, -0.000000],
                [0.525731, 0.850651, 0.000000],
                [-0.525731, 0.850651, 0.000000]];

// Triangular decomposition structure.
const paths = [[1, 9, 0], [0, 10, 1], [0, 7, 6], [0, 6, 10],
               [0, 9, 7], [4, 1, 5], [9, 1, 4], [1, 10, 5],
               [3, 8, 2], [2, 11, 3], [4, 5, 2], [2, 8, 4],
               [5, 11, 2], [6, 7, 3], [3, 11, 6], [3, 7, 8],
               [4, 8, 9], [5, 10, 11], [6, 11, 10], [7, 9, 8]];

// FIX: Why aren't we computing the convex hull?
const buildRegularIcosahedron = (options = {}) => {
  return fromPointsAndPaths({ points: points, paths: paths });
};

//      0
//     /\
//  10/__\20
//   /\  /\
// 1/__\/__\2
//     21
const subdivideTriangle = (triangle) => {
  const t0 = triangle[0];
  const t1 = triangle[1];
  const t2 = triangle[2];
  const t10 = scale$1(1 / 2, add$1(t1, t0));
  const t20 = scale$1(1 / 2, add$1(t2, t0));
  const t21 = scale$1(1 / 2, add$1(t2, t1));
  // Turning CCW.
  return [[t0, t10, t20],
          [t10, t1, t21],
          [t20, t21, t2],
          [t10, t21, t20]];
};

const subdivideTriangularMesh = (mesh) => {
  const subdividedMesh = [];
  for (const triangle of mesh) {
    for (const subTriangle of subdivideTriangle(triangle)) {
      subdividedMesh.push(subTriangle);
    }
  }
  return subdividedMesh;
};

/**
 *
 * Builds a sphere with at least the number of faces requested, and less than
 *   four times the number of faces requested.
 */
const buildGeodesicSphere = ({ faces = 20 }) => {
  let mesh = buildRegularIcosahedron({});
  while (mesh.length < faces) {
    mesh = subdivideTriangularMesh(mesh);
  }
  return mesh.map(triangle => triangle.map(unit));
};

const buildPolygonFromPointsImpl = (points) => ({ surface: [points.map(([x = 0, y = 0, z = 0]) => [x, y, z])] });

const buildPolygonFromPoints = cachePoints(buildPolygonFromPointsImpl);

/**
 * Construct a regular unit polygon of a given edge count.
 * Note: radius and length must not conflict.
 *
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.sides=32] - how many sides the polygon has.
 * @returns {PointArray} Array of points along the path of the circle in CCW winding.
 *
 * @example
 * const circlePoints = regularPolygon(32)
 *
 * @example
 * const squarePoints = regularPolygon(4)
 * })
 */
const buildRegularPolygonImpl = (sides = 32) => {
  let points = [];
  for (let i = 0; i < sides; i++) {
    let radians = 2 * Math.PI * i / sides;
    let [x, y] = fromAngleRadians(radians);
    points.push([x, y, 0]);
  }
  points.isConvex = true;
  // FIX: Clean up the consumers of this result.
  const z0Surface = { z0Surface: [points] };
  return z0Surface;
};

const buildRegularPolygon = cache$1(buildRegularPolygonImpl);

const extrudeImpl = (z0Surface, height = 1, depth = 0, cap = true) => {
  const normalize = createNormalize2();
  const surfaceOutline = outline(z0Surface, normalize);
  const polygons = [];
  const stepHeight = height - depth;

  // Build the walls.
  for (const polygon of surfaceOutline) {
    const wall = flip(polygon);
    const floor = translate$1([0, 0, depth + stepHeight * 0], wall);
    const roof = translate$1([0, 0, depth + stepHeight * 1], wall);
    // Walk around the floor to build the walls.
    for (let i = 0; i < floor.length; i++) {
      const floorStart = floor[i];
      const floorEnd = floor[(i + 1) % floor.length];
      const roofStart = roof[i];
      const roofEnd = roof[(i + 1) % roof.length];
      polygons.push([floorStart, roofStart, roofEnd, floorEnd]);
    }
  }

  if (cap) {
    // FIX: This is already Z0.
    // FIX: This is bringing the vertices out of alignment?
    const surface = makeConvex$1(surfaceOutline, normalize);

    // Roof goes up.
    const roof = translate$2([0, 0, height], surface);
    polygons.push(...roof);

    // floor faces down.
    const floor = translate$2([0, 0, depth], flip$1(surface));
    polygons.push(...floor);
  }

  const solid = fromPolygons({}, polygons);
  return solid;
};

const extrude = cache$1(extrudeImpl);

/**
 * Construct a regular unit prism of a given edge count.
 * Note: radius and length must not conflict.
 *
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.edges=32] - how many edges the polygon has.
 * @returns {PointArray} Array of points along the path of the circle in CCW winding.
 *
 * @example
 * const circlePoints = regularPolygon({ edges: 32 })
 */

const buildRegularPrismImpl = (edges = 32) => {
  const surface = buildRegularPolygon(edges);
  surface.isConvex = true;
  return translate$3([0, 0, -0.5], { solid: extrude(surface.z0Surface, 1) });
};

const buildRegularPrism = cache$1(buildRegularPrismImpl);

// Unit tetrahedron vertices.
const points$1 = [[1, 1, 1], [-1, 1, -1], [1, -1, -1],
                [-1, 1, -1], [-1, -1, 1], [1, -1, -1],
                [1, 1, 1], [1, -1, -1], [-1, -1, 1],
                [1, 1, 1], [-1, -1, 1], [-1, 1, -1]];

const buildRegularTetrahedron = (options = {}) => buildConvexHull(points$1);

const buildWalls$2 = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    // Remember that we are walking CCW.
    polygons.push(deduplicate([floor[start], floor[end], roof[end], roof[start]]));
  }
};

// Approximates a UV sphere.
const buildRingSphereImpl = (resolution = 20) => {
  const polygons = [];
  let lastPath;

  const latitudinalResolution = 2 + resolution;
  const longitudinalResolution = 2 * latitudinalResolution;

  // Trace out latitudinal rings.
  const ring = buildRegularPolygon(longitudinalResolution);
  for (let slice = 0; slice <= latitudinalResolution; slice++) {
    let angle = Math.PI * 1.0 * slice / latitudinalResolution;
    let height = Math.cos(angle);
    let radius = Math.sin(angle);
    const points = ring.z0Surface[0]; // FIX: Make this less fragile.
    const scaledPath = scale$2([radius, radius, radius], points);
    const translatedPath = translate$1([0, 0, height], scaledPath);
    const path = translatedPath;
    if (lastPath !== undefined) {
      buildWalls$2(polygons, path, lastPath);
    }
    lastPath = path;
  }
  polygons.isConvex = true;
  for (const polygon of polygons) {
    assertGood(polygon);
  }
  const solid = { solid: fromPolygons({}, polygons) };
  return solid;
};

const buildRingSphere = cache$1(buildRingSphereImpl);

var cache = {
    '1': bezier1
  , '2': bezier2
  , '3': bezier3
  , '4': bezier4
};

var bezier = neat;
var prepare_1 = prepare;

function neat(arr, t) {
  return prepare(arr.length)(arr, t)
}

function prepare(pieces) {
  pieces = +pieces|0;
  if (!pieces) throw new Error('Cannot create a interpolator with no elements')
  if (cache[pieces]) return cache[pieces]

  var fn = ['var ut = 1 - t', ''];

  var n = pieces;
  while (n--) {
    for (var j = 0; j < n; j += 1) {
      if (n+1 === pieces) {
        fn.push('var p'+j+' = arr['+j+'] * ut + arr['+(j+1)+'] * t');
      } else
      if (n > 1) {
        fn.push('p'+j+' = p'+j+' * ut + p'+(j+1)+' * t');
      } else {
        fn.push('return p'+j+' * ut + p'+(j+1)+' * t');
      }
    }
    if (n > 1) fn.push('');
  }

  fn = [
    'return function bezier'+pieces+'(arr, t) {'
    , fn.map(function(s) { return '  ' + s }).join('\n')
    , '}'
  ].join('\n');

  return Function(fn)()
}

//
// Including the first four degrees
// manually - there's a slight performance penalty
// to generated code. It's outweighed by
// the gains of the optimisations, but always
// helps to cover the most common cases :)
//

function bezier1(arr) {
  return arr[0]
}

function bezier2(arr, t) {
  return arr[0] + (arr[1] - arr[0]) * t
}

function bezier3(arr, t) {
  var ut = 1 - t;
  return (arr[0] * ut + arr[1] * t) * ut + (arr[1] * ut + arr[2] * t) * t
}

function bezier4(arr, t) {
  var ut = 1 - t;
  var a1 = arr[1] * ut + arr[2] * t;
  return ((arr[0] * ut + arr[1] * t) * ut + a1 * t) * ut + (a1 * ut + (arr[2] * ut + arr[3] * t) * t) * t
}
bezier.prepare = prepare_1;

const interpolateCubicBezier = bezier.prepare(4);

// Approximate a cubic bezier by dividing the curve into a uniform number of segments.

const buildUniformCubicBezierCurve = ({ segments = 8 }, points) => {
  const xPoints = points.map(point => point[0]);
  const yPoints = points.map(point => point[1]);
  const path = [];
  for (let t = 0; t <= 1; t += 1 / segments) {
    path.push([interpolateCubicBezier(xPoints, t),
               interpolateCubicBezier(yPoints, t)]);
  }
  return path;
};

const buildWalls$3 = (polygons, floor, roof) => {
  for (let start = floor.length - 1, end = 0; end < floor.length; start = end++) {
    if (floor[start] === null || floor[end] === null) {
      continue;
    }
    // Remember that we are walking CCW.
    polygons.push([roof[start], roof[end], floor[start]]);
    polygons.push([roof[end], floor[end], floor[start]]);
  }
};

// Rotate a path around the X axis to produce the polygons of a solid.
const loopImpl = (path, endRadians = Math.PI * 2, resolution = 16, pitch = 0) => {
  const stepRadians = (Math.PI * 2) / resolution;
  const pitchPerRadian = pitch / (Math.PI * 2);
  let lastPath;
  const polygons = [];
  if (endRadians !== Math.PI * 2 || pitch !== 0) {
    // Cap the loop.
    polygons.push(flip(path), translate$1([pitchPerRadian * endRadians, 0, 0], rotateX(endRadians, path)));
  }
  for (let radians = 0; radians < endRadians; radians += stepRadians) {
    const rotatedPath = translate$1([pitchPerRadian * radians, 0, 0], rotateX(radians, path));
    if (lastPath !== undefined) {
      buildWalls$3(polygons, rotatedPath, lastPath);
    }
    lastPath = rotatedPath;
  }
  if (lastPath !== undefined) {
    buildWalls$3(polygons, translate$1([pitchPerRadian * endRadians, 0, 0], rotateX(endRadians, path)), lastPath);
  }
  return { solid: fromPolygons({}, polygons) };
};

const loop = cache$1(loopImpl);

const sin = (a) => Math.sin(a / 360 * Math.PI * 2);

const regularPolygonEdgeLengthToRadius = (length, edges) => length / (2 * sin(180 / edges));

function getSqDist(p1, p2) {
    var dx = p1[0] - p2[0],
        dy = p1[1] - p2[1];

    return dx * dx + dy * dy;
}

// basic distance-based simplification
var radialDistance = function simplifyRadialDist(points, tolerance) {
    if (points.length<=1)
        return points;
    tolerance = typeof tolerance === 'number' ? tolerance : 1;
    var sqTolerance = tolerance * tolerance;
    
    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
};

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {
    var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2[0];
            y = p2[1];

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return dx * dx + dy * dy;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
        index;

    for (var i = first + 1; i < last; i++) {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
var douglasPeucker = function simplifyDouglasPeucker(points, tolerance) {
    if (points.length<=1)
        return points;
    tolerance = typeof tolerance === 'number' ? tolerance : 1;
    var sqTolerance = tolerance * tolerance;
    
    var last = points.length - 1;

    var simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
};

//simplifies using both algorithms
var simplifyPath = function simplify(points, tolerance) {
    points = radialDistance(points, tolerance);
    points = douglasPeucker(points, tolerance);
    return points;
};

var radialDistance$1 = radialDistance;
var douglasPeucker$1 = douglasPeucker;
simplifyPath.radialDistance = radialDistance$1;
simplifyPath.douglasPeucker = douglasPeucker$1;

const simplifyPath$1 = (path, tolerance = 0.01) => {
  if (isClosed(path)) {
    return simplifyPath(path, tolerance);
  } else {
    return [null, ...simplifyPath(path.slice(1), tolerance)];
  }
};

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);
const toRadiusFromEdge = (edge, sides) => edge * regularPolygonEdgeLengthToRadius(1, sides);

export { buildAdaptiveCubicBezierCurve, buildConvexHull, buildConvexMinkowskiSum, buildConvexSurfaceHull, buildFromFunction, buildFromSlices, buildGeodesicSphere, buildPolygonFromPoints, buildRegularIcosahedron, buildRegularPolygon, buildRegularPrism, buildRegularTetrahedron, buildRingSphere, buildUniformCubicBezierCurve, extrude, loop, regularPolygonEdgeLengthToRadius, simplifyPath$1 as simplifyPath, subdivideTriangle, subdivideTriangularMesh, toRadiusFromApothem, toRadiusFromEdge };
