"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var clipFunctions_1 = require("./clipFunctions.cjs");
var ClipperError_1 = require("./ClipperError.cjs");
exports.ClipperError = ClipperError_1.ClipperError;
var constants_1 = require("./constants.cjs");
var enums_1 = require("./enums.cjs");
exports.ClipType = enums_1.ClipType;
exports.EndType = enums_1.EndType;
exports.JoinType = enums_1.JoinType;
exports.NativeClipperLibLoadedFormat = enums_1.NativeClipperLibLoadedFormat;
exports.NativeClipperLibRequestedFormat = enums_1.NativeClipperLibRequestedFormat;
exports.PointInPolygonResult = enums_1.PointInPolygonResult;
exports.PolyFillType = enums_1.PolyFillType;
var functions = require("./functions.cjs");
var offsetFunctions_1 = require("./offsetFunctions.cjs");
var PolyNode_1 = require("./PolyNode.cjs");
exports.PolyNode = PolyNode_1.PolyNode;
var PolyTree_1 = require("./PolyTree.cjs");
exports.PolyTree = PolyTree_1.PolyTree;
var wasmModule;
var asmJsModule;
/**
 * A wrapper for the Native Clipper Library instance with all the operations available.
 */
var ClipperLibWrapper = /** @class */ (function () {
    /**
     * Internal constructor. Use loadNativeClipperLibInstanceAsync instead.
     *
     * @param instance
     * @param format
     */
    function ClipperLibWrapper(instance, format) {
        this.format = format;
        this.instance = instance;
    }
    /**
     * Performs a polygon clipping (boolean) operation, returning the resulting Paths or throwing an error if failed.
     *
     * The solution parameter in this case is a Paths or PolyTree structure. The Paths structure is simpler than the PolyTree structure. Because of this it is
     * quicker to populate and hence clipping performance is a little better (it's roughly 10% faster). However, the PolyTree data structure provides more
     * information about the returned paths which may be important to users. Firstly, the PolyTree structure preserves nested parent-child polygon relationships
     * (ie outer polygons owning/containing holes and holes owning/containing other outer polygons etc). Also, only the PolyTree structure can differentiate
     * between open and closed paths since each PolyNode has an IsOpen property. (The Path structure has no member indicating whether it's open or closed.)
     * For this reason, when open paths are passed to a Clipper object, the user must use a PolyTree object as the solution parameter, otherwise an exception
     * will be raised.
     *
     * When a PolyTree object is used in a clipping operation on open paths, two ancilliary functions have been provided to quickly separate out open and
     * closed paths from the solution - OpenPathsFromPolyTree and ClosedPathsFromPolyTree. PolyTreeToPaths is also available to convert path data to a Paths
     * structure (irrespective of whether they're open or closed).
     *
     * There are several things to note about the solution paths returned:
     * - they aren't in any specific order
     * - they should never overlap or be self-intersecting (but see notes on rounding)
     * - holes will be oriented opposite outer polygons
     * - the solution fill type can be considered either EvenOdd or NonZero since it will comply with either filling rule
     * - polygons may rarely share a common edge (though this is now very rare as of version 6)
     *
     * @param params - clipping operation data
     * @return {Paths} - the resulting Paths.
     */
    ClipperLibWrapper.prototype.clipToPaths = function (params) {
        return clipFunctions_1.clipToPaths(this.instance, params);
    };
    /**
     * Performs a polygon clipping (boolean) operation, returning the resulting PolyTree or throwing an error if failed.
     *
     * The solution parameter in this case is a Paths or PolyTree structure. The Paths structure is simpler than the PolyTree structure. Because of this it is
     * quicker to populate and hence clipping performance is a little better (it's roughly 10% faster). However, the PolyTree data structure provides more
     * information about the returned paths which may be important to users. Firstly, the PolyTree structure preserves nested parent-child polygon relationships
     * (ie outer polygons owning/containing holes and holes owning/containing other outer polygons etc). Also, only the PolyTree structure can differentiate
     * between open and closed paths since each PolyNode has an IsOpen property. (The Path structure has no member indicating whether it's open or closed.)
     * For this reason, when open paths are passed to a Clipper object, the user must use a PolyTree object as the solution parameter, otherwise an exception
     * will be raised.
     *
     * When a PolyTree object is used in a clipping operation on open paths, two ancilliary functions have been provided to quickly separate out open and
     * closed paths from the solution - OpenPathsFromPolyTree and ClosedPathsFromPolyTree. PolyTreeToPaths is also available to convert path data to a Paths
     * structure (irrespective of whether they're open or closed).
     *
     * There are several things to note about the solution paths returned:
     * - they aren't in any specific order
     * - they should never overlap or be self-intersecting (but see notes on rounding)
     * - holes will be oriented opposite outer polygons
     * - the solution fill type can be considered either EvenOdd or NonZero since it will comply with either filling rule
     * - polygons may rarely share a common edge (though this is now very rare as of version 6)
     *
     * @param params - clipping operation data
     * @return {PolyTree} - the resulting PolyTree or undefined.
     */
    ClipperLibWrapper.prototype.clipToPolyTree = function (params) {
        return clipFunctions_1.clipToPolyTree(this.instance, params);
    };
    /**
     * Performs a polygon offset operation, returning the resulting Paths or undefined if failed.
     *
     * This method encapsulates the process of offsetting (inflating/deflating) both open and closed paths using a number of different join types
     * and end types.
     *
     * Preconditions for offsetting:
     * 1. The orientations of closed paths must be consistent such that outer polygons share the same orientation, and any holes have the opposite orientation
     * (ie non-zero filling). Open paths must be oriented with closed outer polygons.
     * 2. Polygons must not self-intersect.
     *
     * Limitations:
     * When offsetting, small artefacts may appear where polygons overlap. To avoid these artefacts, offset overlapping polygons separately.
     *
     * @param params - offset operation params
     * @return {Paths|undefined} - the resulting Paths or undefined if failed.
     */
    ClipperLibWrapper.prototype.offsetToPaths = function (params) {
        return offsetFunctions_1.offsetToPaths(this.instance, params);
    };
    /**
     * Performs a polygon offset operation, returning the resulting PolyTree or undefined if failed.
     *
     * This method encapsulates the process of offsetting (inflating/deflating) both open and closed paths using a number of different join types
     * and end types.
     *
     * Preconditions for offsetting:
     * 1. The orientations of closed paths must be consistent such that outer polygons share the same orientation, and any holes have the opposite orientation
     * (ie non-zero filling). Open paths must be oriented with closed outer polygons.
     * 2. Polygons must not self-intersect.
     *
     * Limitations:
     * When offsetting, small artefacts may appear where polygons overlap. To avoid these artefacts, offset overlapping polygons separately.
     *
     * @param params - offset operation params
     * @return {PolyTree|undefined} - the resulting PolyTree or undefined if failed.
     */
    ClipperLibWrapper.prototype.offsetToPolyTree = function (params) {
        return offsetFunctions_1.offsetToPolyTree(this.instance, params);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function returns the area of the supplied polygon. It's assumed that the path is closed and does not self-intersect. Depending on orientation,
     * this value may be positive or negative. If Orientation is true, then the area will be positive and conversely, if Orientation is false, then the
     * area will be negative.
     *
     * @param path - The path
     * @return {number} - Area
     */
    ClipperLibWrapper.prototype.area = function (path) {
        return functions.area(path);
    };
    /**
     * Removes vertices:
     * - that join co-linear edges, or join edges that are almost co-linear (such that if the vertex was moved no more than the specified distance the edges
     * would be co-linear)
     * - that are within the specified distance of an adjacent vertex
     * - that are within the specified distance of a semi-adjacent vertex together with their out-lying vertices
     *
     * Vertices are semi-adjacent when they are separated by a single (out-lying) vertex.
     *
     * The distance parameter's default value is approximately √2 so that a vertex will be removed when adjacent or semi-adjacent vertices having their
     * corresponding X and Y coordinates differing by no more than 1 unit. (If the egdes are semi-adjacent the out-lying vertex will be removed too.)
     *
     * @param path - The path to clean
     * @param distance - How close points need to be before they are cleaned
     * @return {Path} - The cleaned path
     */
    ClipperLibWrapper.prototype.cleanPolygon = function (path, distance) {
        if (distance === void 0) { distance = 1.1415; }
        return functions.cleanPolygon(this.instance, path, distance);
    };
    /**
     * Removes vertices:
     * - that join co-linear edges, or join edges that are almost co-linear (such that if the vertex was moved no more than the specified distance the edges
     * would be co-linear)
     * - that are within the specified distance of an adjacent vertex
     * - that are within the specified distance of a semi-adjacent vertex together with their out-lying vertices
     *
     * Vertices are semi-adjacent when they are separated by a single (out-lying) vertex.
     *
     * The distance parameter's default value is approximately √2 so that a vertex will be removed when adjacent or semi-adjacent vertices having their
     * corresponding X and Y coordinates differing by no more than 1 unit. (If the egdes are semi-adjacent the out-lying vertex will be removed too.)
     *
     * @param paths - The paths to clean
     * @param distance - How close points need to be before they are cleaned
     * @return {Paths} - The cleaned paths
     */
    ClipperLibWrapper.prototype.cleanPolygons = function (paths, distance) {
        if (distance === void 0) { distance = 1.1415; }
        return functions.cleanPolygons(this.instance, paths, distance);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function filters out open paths from the PolyTree structure and returns only closed paths in a Paths structure.
     *
     * @param polyTree
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.closedPathsFromPolyTree = function (polyTree) {
        return functions.closedPathsFromPolyTree(polyTree);
    };
    /**
     *  Minkowski Difference is performed by subtracting each point in a polygon from the set of points in an open or closed path. A key feature of Minkowski
     *  Difference is that when it's applied to two polygons, the resulting polygon will contain the coordinate space origin whenever the two polygons touch or
     *  overlap. (This function is often used to determine when polygons collide.)
     *
     * @param poly1
     * @param poly2
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.minkowskiDiff = function (poly1, poly2) {
        return functions.minkowskiDiff(this.instance, poly1, poly2);
    };
    /**
     * Minkowski Addition is performed by adding each point in a polygon 'pattern' to the set of points in an open or closed path. The resulting polygon
     * (or polygons) defines the region that the 'pattern' would pass over in moving from the beginning to the end of the 'path'.
     *
     * @param pattern
     * @param path
     * @param pathIsClosed
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.minkowskiSumPath = function (pattern, path, pathIsClosed) {
        return functions.minkowskiSumPath(this.instance, pattern, path, pathIsClosed);
    };
    /**
     * Minkowski Addition is performed by adding each point in a polygon 'pattern' to the set of points in an open or closed path. The resulting polygon
     * (or polygons) defines the region that the 'pattern' would pass over in moving from the beginning to the end of the 'path'.
     *
     * @param pattern
     * @param paths
     * @param pathIsClosed
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.minkowskiSumPaths = function (pattern, paths, pathIsClosed) {
        return functions.minkowskiSumPaths(this.instance, pattern, paths, pathIsClosed);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function filters out closed paths from the PolyTree structure and returns only open paths in a Paths structure.
     *
     * @param polyTree
     * @return {ReadonlyPath[]}
     */
    ClipperLibWrapper.prototype.openPathsFromPolyTree = function (polyTree) {
        return functions.openPathsFromPolyTree(polyTree);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Orientation is only important to closed paths. Given that vertices are declared in a specific order, orientation refers to the direction (clockwise or
     * counter-clockwise) that these vertices progress around a closed path.
     *
     * Orientation is also dependent on axis direction:
     * - On Y-axis positive upward displays, orientation will return true if the polygon's orientation is counter-clockwise.
     * - On Y-axis positive downward displays, orientation will return true if the polygon's orientation is clockwise.
     *
     * Notes:
     * - Self-intersecting polygons have indeterminate orientations in which case this function won't return a meaningful value.
     * - The majority of 2D graphic display libraries (eg GDI, GDI+, XLib, Cairo, AGG, Graphics32) and even the SVG file format have their coordinate origins
     * at the top-left corner of their respective viewports with their Y axes increasing downward. However, some display libraries (eg Quartz, OpenGL) have their
     * coordinate origins undefined or in the classic bottom-left position with their Y axes increasing upward.
     * - For Non-Zero filled polygons, the orientation of holes must be opposite that of outer polygons.
     * - For closed paths (polygons) in the solution returned by the clip method, their orientations will always be true for outer polygons and false
     * for hole polygons (unless the reverseSolution property has been enabled).
     *
     * @param path - Path
     * @return {boolean}
     */
    ClipperLibWrapper.prototype.orientation = function (path) {
        return functions.orientation(path);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Returns PointInPolygonResult.Outside when false, PointInPolygonResult.OnBoundary when point is on poly and PointInPolygonResult.Inside when point is in
     * poly.
     *
     * It's assumed that 'poly' is closed and does not self-intersect.
     *
     * @param point
     * @param path
     * @return {PointInPolygonResult}
     */
    ClipperLibWrapper.prototype.pointInPolygon = function (point, path) {
        return functions.pointInPolygon(point, path);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * This function converts a PolyTree structure into a Paths structure.
     *
     * @param polyTree
     * @return {Paths}
     */
    ClipperLibWrapper.prototype.polyTreeToPaths = function (polyTree) {
        return functions.polyTreeToPaths(polyTree);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Reverses the vertex order (and hence orientation) in the specified path.
     *
     * @param path - Path to reverse, which gets overwritten rather than copied
     */
    ClipperLibWrapper.prototype.reversePath = function (path) {
        functions.reversePath(path);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Reverses the vertex order (and hence orientation) in each contained path.
     *
     * @param paths - Paths to reverse, which get overwritten rather than copied
     */
    ClipperLibWrapper.prototype.reversePaths = function (paths) {
        functions.reversePaths(paths);
    };
    /**
     * Removes self-intersections from the supplied polygon (by performing a boolean union operation using the nominated PolyFillType).
     * Polygons with non-contiguous duplicate vertices (ie 'touching') will be split into two polygons.
     *
     * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
     *
     * @param path
     * @param fillType
     * @return {Paths} - The solution
     */
    ClipperLibWrapper.prototype.simplifyPolygon = function (path, fillType) {
        if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
        return functions.simplifyPolygon(this.instance, path, fillType);
    };
    /**
     * Removes self-intersections from the supplied polygons (by performing a boolean union operation using the nominated PolyFillType).
     * Polygons with non-contiguous duplicate vertices (ie 'vertices are touching') will be split into two polygons.
     *
     * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
     *
     * @param paths
     * @param fillType
     * @return {Paths} - The solution
     */
    ClipperLibWrapper.prototype.simplifyPolygons = function (paths, fillType) {
        if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
        return functions.simplifyPolygons(this.instance, paths, fillType);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Scales a path by multiplying all its points by a number and then rounding them.
     *
     * @param path - Path to scale
     * @param scale - Scale multiplier
     * @return {Path} - The scaled path
     */
    ClipperLibWrapper.prototype.scalePath = function (path, scale) {
        return functions.scalePath(path, scale);
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Scales all inner paths by multiplying all its points by a number and then rounding them.
     *
     * @param paths - Paths to scale
     * @param scale - Scale multiplier
     * @return {Paths} - The scaled paths
     */
    ClipperLibWrapper.prototype.scalePaths = function (paths, scale) {
        return functions.scalePaths(paths, scale);
    };
    /**
     * Max coordinate value (both positive and negative).
     */
    ClipperLibWrapper.hiRange = constants_1.hiRange;
    return ClipperLibWrapper;
}());
exports.ClipperLibWrapper = ClipperLibWrapper;
/**
 * Asynchronously tries to load a new native instance of the clipper library to be shared across all method invocations.
 *
 * @param format - Format to load, either WasmThenAsmJs, WasmOnly or AsmJsOnly.
 * @return {Promise<ClipperLibWrapper>} - Promise that resolves with the wrapper instance.
 */
exports.loadNativeClipperLibInstanceAsync = function (format) { return __awaiter(void 0, void 0, void 0, function () {
    function getModuleAsync(initModule) {
        return new Promise(function (resolve, reject) {
            var finalModule;
            //noinspection JSUnusedLocalSymbols
            var moduleOverrides = {
                noExitRuntime: true,
                preRun: function () {
                    if (finalModule) {
                        resolve(finalModule);
                    }
                    else {
                        setTimeout(function () {
                            resolve(finalModule);
                        }, 1);
                    }
                },
                quit: function (code, err) {
                    reject(err);
                }
            };
            finalModule = initModule(moduleOverrides);
        });
    }
    var tryWasm, tryAsmJs, initModule, err_1, initModule, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                switch (format) {
                    case enums_1.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback:
                        tryWasm = true;
                        tryAsmJs = true;
                        break;
                    case enums_1.NativeClipperLibRequestedFormat.WasmOnly:
                        tryWasm = true;
                        tryAsmJs = false;
                        break;
                    case enums_1.NativeClipperLibRequestedFormat.AsmJsOnly:
                        tryWasm = false;
                        tryAsmJs = true;
                        break;
                    default:
                        throw new ClipperError_1.ClipperError("unknown native clipper format");
                }
                if (!tryWasm) return [3 /*break*/, 7];
                if (!(wasmModule instanceof Error)) return [3 /*break*/, 1];
                return [3 /*break*/, 7];
            case 1:
                if (!(wasmModule === undefined)) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                initModule = require("./wasm/clipper-wasm.cjs").init;
                return [4 /*yield*/, getModuleAsync(initModule)];
            case 3:
                wasmModule = _a.sent();
                return [2 /*return*/, new ClipperLibWrapper(wasmModule, enums_1.NativeClipperLibLoadedFormat.Wasm)];
            case 4:
                err_1 = _a.sent();
                wasmModule = err_1;
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, new ClipperLibWrapper(wasmModule, enums_1.NativeClipperLibLoadedFormat.Wasm)];
            case 7:
                if (!tryAsmJs) return [3 /*break*/, 14];
                if (!(asmJsModule instanceof Error)) return [3 /*break*/, 8];
                return [3 /*break*/, 14];
            case 8:
                if (!(asmJsModule === undefined)) return [3 /*break*/, 13];
                _a.label = 9;
            case 9:
                _a.trys.push([9, 11, , 12]);
                initModule = require("./wasm/clipper.cjs").init;
                return [4 /*yield*/, getModuleAsync(initModule)];
            case 10:
                asmJsModule = _a.sent();
                return [2 /*return*/, new ClipperLibWrapper(asmJsModule, enums_1.NativeClipperLibLoadedFormat.AsmJs)];
            case 11:
                err_2 = _a.sent();
                asmJsModule = err_2;
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13: return [2 /*return*/, new ClipperLibWrapper(asmJsModule, enums_1.NativeClipperLibLoadedFormat.AsmJs)];
            case 14: throw new ClipperError_1.ClipperError("could not load native clipper in the desired format");
        }
    });
}); };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBcUY7QUFDckYsK0NBQThDO0FBMEM1Qyx1QkExQ08sMkJBQVksQ0EwQ1A7QUF6Q2QseUNBQXNDO0FBQ3RDLGlDQVFpQjtBQWFmLG1CQXBCQSxnQkFBUSxDQW9CQTtBQUNSLGtCQXBCQSxlQUFPLENBb0JBO0FBQ1AsbUJBcEJBLGdCQUFRLENBb0JBO0FBRVIsdUNBckJBLG9DQUE0QixDQXFCQTtBQUM1QiwwQ0FyQkEsdUNBQStCLENBcUJBO0FBQy9CLCtCQXJCQSw0QkFBb0IsQ0FxQkE7QUFIcEIsdUJBakJBLG9CQUFZLENBaUJBO0FBZmQsdUNBQXlDO0FBSXpDLHFEQUErRjtBQUcvRix1Q0FBc0M7QUFZcEMsbUJBWk8sbUJBQVEsQ0FZUDtBQVhWLHVDQUFzQztBQVlwQyxtQkFaTyxtQkFBUSxDQVlQO0FBY1YsSUFBSSxVQUF3RCxDQUFDO0FBQzdELElBQUksV0FBaUQsQ0FBQztBQUV0RDs7R0FFRztBQUNIO0lBZ0JFOzs7OztPQUtHO0lBQ0gsMkJBQVksUUFBa0MsRUFBRSxNQUFvQztRQUNsRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILHVDQUFXLEdBQVgsVUFBWSxNQUFrQjtRQUM1QixPQUFPLDJCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILDBDQUFjLEdBQWQsVUFBZSxNQUFrQjtRQUMvQixPQUFPLDhCQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFB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L0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsaXBJbnB1dCwgQ2xpcFBhcmFtcywgY2xpcFRvUGF0aHMsIGNsaXBUb1BvbHlUcmVlIH0gZnJvbSBcIi4vY2xpcEZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgeyBDbGlwcGVyRXJyb3IgfSBmcm9tIFwiLi9DbGlwcGVyRXJyb3JcIjtcclxuaW1wb3J0IHsgaGlSYW5nZSB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQge1xyXG4gIENsaXBUeXBlLFxyXG4gIEVuZFR5cGUsXHJcbiAgSm9pblR5cGUsXHJcbiAgTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdCxcclxuICBOYXRpdmVDbGlwcGVyTGliUmVxdWVzdGVkRm9ybWF0LFxyXG4gIFBvaW50SW5Qb2x5Z29uUmVzdWx0LFxyXG4gIFBvbHlGaWxsVHlwZVxyXG59IGZyb20gXCIuL2VudW1zXCI7XHJcbmltcG9ydCAqIGFzIGZ1bmN0aW9ucyBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcclxuaW1wb3J0IHsgSW50UG9pbnQgfSBmcm9tIFwiLi9JbnRQb2ludFwiO1xyXG5pbXBvcnQgeyBJbnRSZWN0IH0gZnJvbSBcIi4vSW50UmVjdFwiO1xyXG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XHJcbmltcG9ydCB7IE9mZnNldElucHV0LCBPZmZzZXRQYXJhbXMsIG9mZnNldFRvUGF0aHMsIG9mZnNldFRvUG9seVRyZWUgfSBmcm9tIFwiLi9vZmZzZXRGdW5jdGlvbnNcIjtcclxuaW1wb3J0IHsgUGF0aCwgUmVhZG9ubHlQYXRoIH0gZnJvbSBcIi4vUGF0aFwiO1xyXG5pbXBvcnQgeyBQYXRocywgUmVhZG9ubHlQYXRocyB9IGZyb20gXCIuL1BhdGhzXCI7XHJcbmltcG9ydCB7IFBvbHlOb2RlIH0gZnJvbSBcIi4vUG9seU5vZGVcIjtcclxuaW1wb3J0IHsgUG9seVRyZWUgfSBmcm9tIFwiLi9Qb2x5VHJlZVwiO1xyXG5cclxuLy8gZXhwb3J0IHR5cGVzXHJcbmV4cG9ydCB7XHJcbiAgQ2xpcFR5cGUsXHJcbiAgRW5kVHlwZSxcclxuICBKb2luVHlwZSxcclxuICBQb2x5RmlsbFR5cGUsXHJcbiAgTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdCxcclxuICBOYXRpdmVDbGlwcGVyTGliUmVxdWVzdGVkRm9ybWF0LFxyXG4gIFBvaW50SW5Qb2x5Z29uUmVzdWx0LFxyXG4gIFBvbHlOb2RlLFxyXG4gIFBvbHlUcmVlLFxyXG4gIEludFBvaW50LFxyXG4gIEludFJlY3QsXHJcbiAgUGF0aCxcclxuICBSZWFkb25seVBhdGgsXHJcbiAgUGF0aHMsXHJcbiAgUmVhZG9ubHlQYXRocyxcclxuICBDbGlwSW5wdXQsXHJcbiAgQ2xpcFBhcmFtcyxcclxuICBPZmZzZXRJbnB1dCxcclxuICBPZmZzZXRQYXJhbXMsXHJcbiAgQ2xpcHBlckVycm9yXHJcbn07XHJcblxyXG5sZXQgd2FzbU1vZHVsZTogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIHwgdW5kZWZpbmVkIHwgRXJyb3I7XHJcbmxldCBhc21Kc01vZHVsZTogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIHwgdW5kZWZpbmVkO1xyXG5cclxuLyoqXHJcbiAqIEEgd3JhcHBlciBmb3IgdGhlIE5hdGl2ZSBDbGlwcGVyIExpYnJhcnkgaW5zdGFuY2Ugd2l0aCBhbGwgdGhlIG9wZXJhdGlvbnMgYXZhaWxhYmxlLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENsaXBwZXJMaWJXcmFwcGVyIHtcclxuICAvKipcclxuICAgKiBNYXggY29vcmRpbmF0ZSB2YWx1ZSAoYm90aCBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUpLlxyXG4gICAqL1xyXG4gIHN0YXRpYyByZWFkb25seSBoaVJhbmdlID0gaGlSYW5nZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTmF0aXZlIGxpYnJhcnkgaW5zdGFuY2UuXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgaW5zdGFuY2U6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZTtcclxuXHJcbiAgLyoqXHJcbiAgICogTmF0aXZlIGxpYnJhcnkgZm9ybWF0LlxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGZvcm1hdDogTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdDtcclxuXHJcbiAgLyoqXHJcbiAgICogSW50ZXJuYWwgY29uc3RydWN0b3IuIFVzZSBsb2FkTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlQXN5bmMgaW5zdGVhZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSBmb3JtYXRcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihpbnN0YW5jZTogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLCBmb3JtYXQ6IE5hdGl2ZUNsaXBwZXJMaWJMb2FkZWRGb3JtYXQpIHtcclxuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUGVyZm9ybXMgYSBwb2x5Z29uIGNsaXBwaW5nIChib29sZWFuKSBvcGVyYXRpb24sIHJldHVybmluZyB0aGUgcmVzdWx0aW5nIFBhdGhzIG9yIHRocm93aW5nIGFuIGVycm9yIGlmIGZhaWxlZC5cclxuICAgKlxyXG4gICAqIFRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgaW4gdGhpcyBjYXNlIGlzIGEgUGF0aHMgb3IgUG9seVRyZWUgc3RydWN0dXJlLiBUaGUgUGF0aHMgc3RydWN0dXJlIGlzIHNpbXBsZXIgdGhhbiB0aGUgUG9seVRyZWUgc3RydWN0dXJlLiBCZWNhdXNlIG9mIHRoaXMgaXQgaXNcclxuICAgKiBxdWlja2VyIHRvIHBvcHVsYXRlIGFuZCBoZW5jZSBjbGlwcGluZyBwZXJmb3JtYW5jZSBpcyBhIGxpdHRsZSBiZXR0ZXIgKGl0J3Mgcm91Z2hseSAxMCUgZmFzdGVyKS4gSG93ZXZlciwgdGhlIFBvbHlUcmVlIGRhdGEgc3RydWN0dXJlIHByb3ZpZGVzIG1vcmVcclxuICAgKiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcmV0dXJuZWQgcGF0aHMgd2hpY2ggbWF5IGJlIGltcG9ydGFudCB0byB1c2Vycy4gRmlyc3RseSwgdGhlIFBvbHlUcmVlIHN0cnVjdHVyZSBwcmVzZXJ2ZXMgbmVzdGVkIHBhcmVudC1jaGlsZCBwb2x5Z29uIHJlbGF0aW9uc2hpcHNcclxuICAgKiAoaWUgb3V0ZXIgcG9seWdvbnMgb3duaW5nL2NvbnRhaW5pbmcgaG9sZXMgYW5kIGhvbGVzIG93bmluZy9jb250YWluaW5nIG90aGVyIG91dGVyIHBvbHlnb25zIGV0YykuIEFsc28sIG9ubHkgdGhlIFBvbHlUcmVlIHN0cnVjdHVyZSBjYW4gZGlmZmVyZW50aWF0ZVxyXG4gICAqIGJldHdlZW4gb3BlbiBhbmQgY2xvc2VkIHBhdGhzIHNpbmNlIGVhY2ggUG9seU5vZGUgaGFzIGFuIElzT3BlbiBwcm9wZXJ0eS4gKFRoZSBQYXRoIHN0cnVjdHVyZSBoYXMgbm8gbWVtYmVyIGluZGljYXRpbmcgd2hldGhlciBpdCdzIG9wZW4gb3IgY2xvc2VkLilcclxuICAgKiBGb3IgdGhpcyByZWFzb24sIHdoZW4gb3BlbiBwYXRocyBhcmUgcGFzc2VkIHRvIGEgQ2xpcHBlciBvYmplY3QsIHRoZSB1c2VyIG11c3QgdXNlIGEgUG9seVRyZWUgb2JqZWN0IGFzIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIsIG90aGVyd2lzZSBhbiBleGNlcHRpb25cclxuICAgKiB3aWxsIGJlIHJhaXNlZC5cclxuICAgKlxyXG4gICAqIFdoZW4gYSBQb2x5VHJlZSBvYmplY3QgaXMgdXNlZCBpbiBhIGNsaXBwaW5nIG9wZXJhdGlvbiBvbiBvcGVuIHBhdGhzLCB0d28gYW5jaWxsaWFyeSBmdW5jdGlvbnMgaGF2ZSBiZWVuIHByb3ZpZGVkIHRvIHF1aWNrbHkgc2VwYXJhdGUgb3V0IG9wZW4gYW5kXHJcbiAgICogY2xvc2VkIHBhdGhzIGZyb20gdGhlIHNvbHV0aW9uIC0gT3BlblBhdGhzRnJvbVBvbHlUcmVlIGFuZCBDbG9zZWRQYXRoc0Zyb21Qb2x5VHJlZS4gUG9seVRyZWVUb1BhdGhzIGlzIGFsc28gYXZhaWxhYmxlIHRvIGNvbnZlcnQgcGF0aCBkYXRhIHRvIGEgUGF0aHNcclxuICAgKiBzdHJ1Y3R1cmUgKGlycmVzcGVjdGl2ZSBvZiB3aGV0aGVyIHRoZXkncmUgb3BlbiBvciBjbG9zZWQpLlxyXG4gICAqXHJcbiAgICogVGhlcmUgYXJlIHNldmVyYWwgdGhpbmdzIHRvIG5vdGUgYWJvdXQgdGhlIHNvbHV0aW9uIHBhdGhzIHJldHVybmVkOlxyXG4gICAqIC0gdGhleSBhcmVuJ3QgaW4gYW55IHNwZWNpZmljIG9yZGVyXHJcbiAgICogLSB0aGV5IHNob3VsZCBuZXZlciBvdmVybGFwIG9yIGJlIHNlbGYtaW50ZXJzZWN0aW5nIChidXQgc2VlIG5vdGVzIG9uIHJvdW5kaW5nKVxyXG4gICAqIC0gaG9sZXMgd2lsbCBiZSBvcmllbnRlZCBvcHBvc2l0ZSBvdXRlciBwb2x5Z29uc1xyXG4gICAqIC0gdGhlIHNvbHV0aW9uIGZpbGwgdHlwZSBjYW4gYmUgY29uc2lkZXJlZCBlaXRoZXIgRXZlbk9kZCBvciBOb25aZXJvIHNpbmNlIGl0IHdpbGwgY29tcGx5IHdpdGggZWl0aGVyIGZpbGxpbmcgcnVsZVxyXG4gICAqIC0gcG9seWdvbnMgbWF5IHJhcmVseSBzaGFyZSBhIGNvbW1vbiBlZGdlICh0aG91Z2ggdGhpcyBpcyBub3cgdmVyeSByYXJlIGFzIG9mIHZlcnNpb24gNilcclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXJhbXMgLSBjbGlwcGluZyBvcGVyYXRpb24gZGF0YVxyXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIHRoZSByZXN1bHRpbmcgUGF0aHMuXHJcbiAgICovXHJcbiAgY2xpcFRvUGF0aHMocGFyYW1zOiBDbGlwUGFyYW1zKTogUGF0aHMgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIGNsaXBUb1BhdGhzKHRoaXMuaW5zdGFuY2UsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtcyBhIHBvbHlnb24gY2xpcHBpbmcgKGJvb2xlYW4pIG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcgUG9seVRyZWUgb3IgdGhyb3dpbmcgYW4gZXJyb3IgaWYgZmFpbGVkLlxyXG4gICAqXHJcbiAgICogVGhlIHNvbHV0aW9uIHBhcmFtZXRlciBpbiB0aGlzIGNhc2UgaXMgYSBQYXRocyBvciBQb2x5VHJlZSBzdHJ1Y3R1cmUuIFRoZSBQYXRocyBzdHJ1Y3R1cmUgaXMgc2ltcGxlciB0aGFuIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUuIEJlY2F1c2Ugb2YgdGhpcyBpdCBpc1xyXG4gICAqIHF1aWNrZXIgdG8gcG9wdWxhdGUgYW5kIGhlbmNlIGNsaXBwaW5nIHBlcmZvcm1hbmNlIGlzIGEgbGl0dGxlIGJldHRlciAoaXQncyByb3VnaGx5IDEwJSBmYXN0ZXIpLiBIb3dldmVyLCB0aGUgUG9seVRyZWUgZGF0YSBzdHJ1Y3R1cmUgcHJvdmlkZXMgbW9yZVxyXG4gICAqIGluZm9ybWF0aW9uIGFib3V0IHRoZSByZXR1cm5lZCBwYXRocyB3aGljaCBtYXkgYmUgaW1wb3J0YW50IHRvIHVzZXJzLiBGaXJzdGx5LCB0aGUgUG9seVRyZWUgc3RydWN0dXJlIHByZXNlcnZlcyBuZXN0ZWQgcGFyZW50LWNoaWxkIHBvbHlnb24gcmVsYXRpb25zaGlwc1xyXG4gICAqIChpZSBvdXRlciBwb2x5Z29ucyBvd25pbmcvY29udGFpbmluZyBob2xlcyBhbmQgaG9sZXMgb3duaW5nL2NvbnRhaW5pbmcgb3RoZXIgb3V0ZXIgcG9seWdvbnMgZXRjKS4gQWxzbywgb25seSB0aGUgUG9seVRyZWUgc3RydWN0dXJlIGNhbiBkaWZmZXJlbnRpYXRlXHJcbiAgICogYmV0d2VlbiBvcGVuIGFuZCBjbG9zZWQgcGF0aHMgc2luY2UgZWFjaCBQb2x5Tm9kZSBoYXMgYW4gSXNPcGVuIHByb3BlcnR5LiAoVGhlIFBhdGggc3RydWN0dXJlIGhhcyBubyBtZW1iZXIgaW5kaWNhdGluZyB3aGV0aGVyIGl0J3Mgb3BlbiBvciBjbG9zZWQuKVxyXG4gICAqIEZvciB0aGlzIHJlYXNvbiwgd2hlbiBvcGVuIHBhdGhzIGFyZSBwYXNzZWQgdG8gYSBDbGlwcGVyIG9iamVjdCwgdGhlIHVzZXIgbXVzdCB1c2UgYSBQb2x5VHJlZSBvYmplY3QgYXMgdGhlIHNvbHV0aW9uIHBhcmFtZXRlciwgb3RoZXJ3aXNlIGFuIGV4Y2VwdGlvblxyXG4gICAqIHdpbGwgYmUgcmFpc2VkLlxyXG4gICAqXHJcbiAgICogV2hlbiBhIFBvbHlUcmVlIG9iamVjdCBpcyB1c2VkIGluIGEgY2xpcHBpbmcgb3BlcmF0aW9uIG9uIG9wZW4gcGF0aHMsIHR3byBhbmNpbGxpYXJ5IGZ1bmN0aW9ucyBoYXZlIGJlZW4gcHJvdmlkZWQgdG8gcXVpY2tseSBzZXBhcmF0ZSBvdXQgb3BlbiBhbmRcclxuICAgKiBjbG9zZWQgcGF0aHMgZnJvbSB0aGUgc29sdXRpb24gLSBPcGVuUGF0aHNGcm9tUG9seVRyZWUgYW5kIENsb3NlZFBhdGhzRnJvbVBvbHlUcmVlLiBQb2x5VHJlZVRvUGF0aHMgaXMgYWxzbyBhdmFpbGFibGUgdG8gY29udmVydCBwYXRoIGRhdGEgdG8gYSBQYXRoc1xyXG4gICAqIHN0cnVjdHVyZSAoaXJyZXNwZWN0aXZlIG9mIHdoZXRoZXIgdGhleSdyZSBvcGVuIG9yIGNsb3NlZCkuXHJcbiAgICpcclxuICAgKiBUaGVyZSBhcmUgc2V2ZXJhbCB0aGluZ3MgdG8gbm90ZSBhYm91dCB0aGUgc29sdXRpb24gcGF0aHMgcmV0dXJuZWQ6XHJcbiAgICogLSB0aGV5IGFyZW4ndCBpbiBhbnkgc3BlY2lmaWMgb3JkZXJcclxuICAgKiAtIHRoZXkgc2hvdWxkIG5ldmVyIG92ZXJsYXAgb3IgYmUgc2VsZi1pbnRlcnNlY3RpbmcgKGJ1dCBzZWUgbm90ZXMgb24gcm91bmRpbmcpXHJcbiAgICogLSBob2xlcyB3aWxsIGJlIG9yaWVudGVkIG9wcG9zaXRlIG91dGVyIHBvbHlnb25zXHJcbiAgICogLSB0aGUgc29sdXRpb24gZmlsbCB0eXBlIGNhbiBiZSBjb25zaWRlcmVkIGVpdGhlciBFdmVuT2RkIG9yIE5vblplcm8gc2luY2UgaXQgd2lsbCBjb21wbHkgd2l0aCBlaXRoZXIgZmlsbGluZyBydWxlXHJcbiAgICogLSBwb2x5Z29ucyBtYXkgcmFyZWx5IHNoYXJlIGEgY29tbW9uIGVkZ2UgKHRob3VnaCB0aGlzIGlzIG5vdyB2ZXJ5IHJhcmUgYXMgb2YgdmVyc2lvbiA2KVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhcmFtcyAtIGNsaXBwaW5nIG9wZXJhdGlvbiBkYXRhXHJcbiAgICogQHJldHVybiB7UG9seVRyZWV9IC0gdGhlIHJlc3VsdGluZyBQb2x5VHJlZSBvciB1bmRlZmluZWQuXHJcbiAgICovXHJcbiAgY2xpcFRvUG9seVRyZWUocGFyYW1zOiBDbGlwUGFyYW1zKTogUG9seVRyZWUgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIGNsaXBUb1BvbHlUcmVlKHRoaXMuaW5zdGFuY2UsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtcyBhIHBvbHlnb24gb2Zmc2V0IG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcgUGF0aHMgb3IgdW5kZWZpbmVkIGlmIGZhaWxlZC5cclxuICAgKlxyXG4gICAqIFRoaXMgbWV0aG9kIGVuY2Fwc3VsYXRlcyB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIChpbmZsYXRpbmcvZGVmbGF0aW5nKSBib3RoIG9wZW4gYW5kIGNsb3NlZCBwYXRocyB1c2luZyBhIG51bWJlciBvZiBkaWZmZXJlbnQgam9pbiB0eXBlc1xyXG4gICAqIGFuZCBlbmQgdHlwZXMuXHJcbiAgICpcclxuICAgKiBQcmVjb25kaXRpb25zIGZvciBvZmZzZXR0aW5nOlxyXG4gICAqIDEuIFRoZSBvcmllbnRhdGlvbnMgb2YgY2xvc2VkIHBhdGhzIG11c3QgYmUgY29uc2lzdGVudCBzdWNoIHRoYXQgb3V0ZXIgcG9seWdvbnMgc2hhcmUgdGhlIHNhbWUgb3JpZW50YXRpb24sIGFuZCBhbnkgaG9sZXMgaGF2ZSB0aGUgb3Bwb3NpdGUgb3JpZW50YXRpb25cclxuICAgKiAoaWUgbm9uLXplcm8gZmlsbGluZykuIE9wZW4gcGF0aHMgbXVzdCBiZSBvcmllbnRlZCB3aXRoIGNsb3NlZCBvdXRlciBwb2x5Z29ucy5cclxuICAgKiAyLiBQb2x5Z29ucyBtdXN0IG5vdCBzZWxmLWludGVyc2VjdC5cclxuICAgKlxyXG4gICAqIExpbWl0YXRpb25zOlxyXG4gICAqIFdoZW4gb2Zmc2V0dGluZywgc21hbGwgYXJ0ZWZhY3RzIG1heSBhcHBlYXIgd2hlcmUgcG9seWdvbnMgb3ZlcmxhcC4gVG8gYXZvaWQgdGhlc2UgYXJ0ZWZhY3RzLCBvZmZzZXQgb3ZlcmxhcHBpbmcgcG9seWdvbnMgc2VwYXJhdGVseS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXJhbXMgLSBvZmZzZXQgb3BlcmF0aW9uIHBhcmFtc1xyXG4gICAqIEByZXR1cm4ge1BhdGhzfHVuZGVmaW5lZH0gLSB0aGUgcmVzdWx0aW5nIFBhdGhzIG9yIHVuZGVmaW5lZCBpZiBmYWlsZWQuXHJcbiAgICovXHJcbiAgb2Zmc2V0VG9QYXRocyhwYXJhbXM6IE9mZnNldFBhcmFtcyk6IFBhdGhzIHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBvZmZzZXRUb1BhdGhzKHRoaXMuaW5zdGFuY2UsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQZXJmb3JtcyBhIHBvbHlnb24gb2Zmc2V0IG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHRpbmcgUG9seVRyZWUgb3IgdW5kZWZpbmVkIGlmIGZhaWxlZC5cclxuICAgKlxyXG4gICAqIFRoaXMgbWV0aG9kIGVuY2Fwc3VsYXRlcyB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIChpbmZsYXRpbmcvZGVmbGF0aW5nKSBib3RoIG9wZW4gYW5kIGNsb3NlZCBwYXRocyB1c2luZyBhIG51bWJlciBvZiBkaWZmZXJlbnQgam9pbiB0eXBlc1xyXG4gICAqIGFuZCBlbmQgdHlwZXMuXHJcbiAgICpcclxuICAgKiBQcmVjb25kaXRpb25zIGZvciBvZmZzZXR0aW5nOlxyXG4gICAqIDEuIFRoZSBvcmllbnRhdGlvbnMgb2YgY2xvc2VkIHBhdGhzIG11c3QgYmUgY29uc2lzdGVudCBzdWNoIHRoYXQgb3V0ZXIgcG9seWdvbnMgc2hhcmUgdGhlIHNhbWUgb3JpZW50YXRpb24sIGFuZCBhbnkgaG9sZXMgaGF2ZSB0aGUgb3Bwb3NpdGUgb3JpZW50YXRpb25cclxuICAgKiAoaWUgbm9uLXplcm8gZmlsbGluZykuIE9wZW4gcGF0aHMgbXVzdCBiZSBvcmllbnRlZCB3aXRoIGNsb3NlZCBvdXRlciBwb2x5Z29ucy5cclxuICAgKiAyLiBQb2x5Z29ucyBtdXN0IG5vdCBzZWxmLWludGVyc2VjdC5cclxuICAgKlxyXG4gICAqIExpbWl0YXRpb25zOlxyXG4gICAqIFdoZW4gb2Zmc2V0dGluZywgc21hbGwgYXJ0ZWZhY3RzIG1heSBhcHBlYXIgd2hlcmUgcG9seWdvbnMgb3ZlcmxhcC4gVG8gYXZvaWQgdGhlc2UgYXJ0ZWZhY3RzLCBvZmZzZXQgb3ZlcmxhcHBpbmcgcG9seWdvbnMgc2VwYXJhdGVseS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXJhbXMgLSBvZmZzZXQgb3BlcmF0aW9uIHBhcmFtc1xyXG4gICAqIEByZXR1cm4ge1BvbHlUcmVlfHVuZGVmaW5lZH0gLSB0aGUgcmVzdWx0aW5nIFBvbHlUcmVlIG9yIHVuZGVmaW5lZCBpZiBmYWlsZWQuXHJcbiAgICovXHJcbiAgb2Zmc2V0VG9Qb2x5VHJlZShwYXJhbXM6IE9mZnNldFBhcmFtcyk6IFBvbHlUcmVlIHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiBvZmZzZXRUb1BvbHlUcmVlKHRoaXMuaW5zdGFuY2UsIHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBhcmVhIG9mIHRoZSBzdXBwbGllZCBwb2x5Z29uLiBJdCdzIGFzc3VtZWQgdGhhdCB0aGUgcGF0aCBpcyBjbG9zZWQgYW5kIGRvZXMgbm90IHNlbGYtaW50ZXJzZWN0LiBEZXBlbmRpbmcgb24gb3JpZW50YXRpb24sXHJcbiAgICogdGhpcyB2YWx1ZSBtYXkgYmUgcG9zaXRpdmUgb3IgbmVnYXRpdmUuIElmIE9yaWVudGF0aW9uIGlzIHRydWUsIHRoZW4gdGhlIGFyZWEgd2lsbCBiZSBwb3NpdGl2ZSBhbmQgY29udmVyc2VseSwgaWYgT3JpZW50YXRpb24gaXMgZmFsc2UsIHRoZW4gdGhlXHJcbiAgICogYXJlYSB3aWxsIGJlIG5lZ2F0aXZlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGggLSBUaGUgcGF0aFxyXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSBBcmVhXHJcbiAgICovXHJcbiAgYXJlYShwYXRoOiBSZWFkb25seVBhdGgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5hcmVhKHBhdGgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyB2ZXJ0aWNlczpcclxuICAgKiAtIHRoYXQgam9pbiBjby1saW5lYXIgZWRnZXMsIG9yIGpvaW4gZWRnZXMgdGhhdCBhcmUgYWxtb3N0IGNvLWxpbmVhciAoc3VjaCB0aGF0IGlmIHRoZSB2ZXJ0ZXggd2FzIG1vdmVkIG5vIG1vcmUgdGhhbiB0aGUgc3BlY2lmaWVkIGRpc3RhbmNlIHRoZSBlZGdlc1xyXG4gICAqIHdvdWxkIGJlIGNvLWxpbmVhcilcclxuICAgKiAtIHRoYXQgYXJlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIGRpc3RhbmNlIG9mIGFuIGFkamFjZW50IHZlcnRleFxyXG4gICAqIC0gdGhhdCBhcmUgd2l0aGluIHRoZSBzcGVjaWZpZWQgZGlzdGFuY2Ugb2YgYSBzZW1pLWFkamFjZW50IHZlcnRleCB0b2dldGhlciB3aXRoIHRoZWlyIG91dC1seWluZyB2ZXJ0aWNlc1xyXG4gICAqXHJcbiAgICogVmVydGljZXMgYXJlIHNlbWktYWRqYWNlbnQgd2hlbiB0aGV5IGFyZSBzZXBhcmF0ZWQgYnkgYSBzaW5nbGUgKG91dC1seWluZykgdmVydGV4LlxyXG4gICAqXHJcbiAgICogVGhlIGRpc3RhbmNlIHBhcmFtZXRlcidzIGRlZmF1bHQgdmFsdWUgaXMgYXBwcm94aW1hdGVseSDiiJoyIHNvIHRoYXQgYSB2ZXJ0ZXggd2lsbCBiZSByZW1vdmVkIHdoZW4gYWRqYWNlbnQgb3Igc2VtaS1hZGphY2VudCB2ZXJ0aWNlcyBoYXZpbmcgdGhlaXJcclxuICAgKiBjb3JyZXNwb25kaW5nIFggYW5kIFkgY29vcmRpbmF0ZXMgZGlmZmVyaW5nIGJ5IG5vIG1vcmUgdGhhbiAxIHVuaXQuIChJZiB0aGUgZWdkZXMgYXJlIHNlbWktYWRqYWNlbnQgdGhlIG91dC1seWluZyB2ZXJ0ZXggd2lsbCBiZSByZW1vdmVkIHRvby4pXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGF0aCAtIFRoZSBwYXRoIHRvIGNsZWFuXHJcbiAgICogQHBhcmFtIGRpc3RhbmNlIC0gSG93IGNsb3NlIHBvaW50cyBuZWVkIHRvIGJlIGJlZm9yZSB0aGV5IGFyZSBjbGVhbmVkXHJcbiAgICogQHJldHVybiB7UGF0aH0gLSBUaGUgY2xlYW5lZCBwYXRoXHJcbiAgICovXHJcbiAgY2xlYW5Qb2x5Z29uKHBhdGg6IFJlYWRvbmx5UGF0aCwgZGlzdGFuY2UgPSAxLjE0MTUpOiBQYXRoIHtcclxuICAgIHJldHVybiBmdW5jdGlvbnMuY2xlYW5Qb2x5Z29uKHRoaXMuaW5zdGFuY2UsIHBhdGgsIGRpc3RhbmNlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdmVydGljZXM6XHJcbiAgICogLSB0aGF0IGpvaW4gY28tbGluZWFyIGVkZ2VzLCBvciBqb2luIGVkZ2VzIHRoYXQgYXJlIGFsbW9zdCBjby1saW5lYXIgKHN1Y2ggdGhhdCBpZiB0aGUgdmVydGV4IHdhcyBtb3ZlZCBubyBtb3JlIHRoYW4gdGhlIHNwZWNpZmllZCBkaXN0YW5jZSB0aGUgZWRnZXNcclxuICAgKiB3b3VsZCBiZSBjby1saW5lYXIpXHJcbiAgICogLSB0aGF0IGFyZSB3aXRoaW4gdGhlIHNwZWNpZmllZCBkaXN0YW5jZSBvZiBhbiBhZGphY2VudCB2ZXJ0ZXhcclxuICAgKiAtIHRoYXQgYXJlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIGRpc3RhbmNlIG9mIGEgc2VtaS1hZGphY2VudCB2ZXJ0ZXggdG9nZXRoZXIgd2l0aCB0aGVpciBvdXQtbHlpbmcgdmVydGljZXNcclxuICAgKlxyXG4gICAqIFZlcnRpY2VzIGFyZSBzZW1pLWFkamFjZW50IHdoZW4gdGhleSBhcmUgc2VwYXJhdGVkIGJ5IGEgc2luZ2xlIChvdXQtbHlpbmcpIHZlcnRleC5cclxuICAgKlxyXG4gICAqIFRoZSBkaXN0YW5jZSBwYXJhbWV0ZXIncyBkZWZhdWx0IHZhbHVlIGlzIGFwcHJveGltYXRlbHkg4oiaMiBzbyB0aGF0IGEgdmVydGV4IHdpbGwgYmUgcmVtb3ZlZCB3aGVuIGFkamFjZW50IG9yIHNlbWktYWRqYWNlbnQgdmVydGljZXMgaGF2aW5nIHRoZWlyXHJcbiAgICogY29ycmVzcG9uZGluZyBYIGFuZCBZIGNvb3JkaW5hdGVzIGRpZmZlcmluZyBieSBubyBtb3JlIHRoYW4gMSB1bml0LiAoSWYgdGhlIGVnZGVzIGFyZSBzZW1pLWFkamFjZW50IHRoZSBvdXQtbHlpbmcgdmVydGV4IHdpbGwgYmUgcmVtb3ZlZCB0b28uKVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGhzIC0gVGhlIHBhdGhzIHRvIGNsZWFuXHJcbiAgICogQHBhcmFtIGRpc3RhbmNlIC0gSG93IGNsb3NlIHBvaW50cyBuZWVkIHRvIGJlIGJlZm9yZSB0aGV5IGFyZSBjbGVhbmVkXHJcbiAgICogQHJldHVybiB7UGF0aHN9IC0gVGhlIGNsZWFuZWQgcGF0aHNcclxuICAgKi9cclxuICBjbGVhblBvbHlnb25zKHBhdGhzOiBSZWFkb25seVBhdGhzLCBkaXN0YW5jZSA9IDEuMTQxNSk6IFBhdGhzIHtcclxuICAgIHJldHVybiBmdW5jdGlvbnMuY2xlYW5Qb2x5Z29ucyh0aGlzLmluc3RhbmNlLCBwYXRocywgZGlzdGFuY2UpO1xyXG4gIH1cclxuXHJcbiAgLy9ub2luc3BlY3Rpb24gSlNNZXRob2RDYW5CZVN0YXRpY1xyXG4gIC8qKlxyXG4gICAqIFRoaXMgZnVuY3Rpb24gZmlsdGVycyBvdXQgb3BlbiBwYXRocyBmcm9tIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgYW5kIHJldHVybnMgb25seSBjbG9zZWQgcGF0aHMgaW4gYSBQYXRocyBzdHJ1Y3R1cmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcG9seVRyZWVcclxuICAgKiBAcmV0dXJuIHtQYXRoc31cclxuICAgKi9cclxuICBjbG9zZWRQYXRoc0Zyb21Qb2x5VHJlZShwb2x5VHJlZTogUG9seVRyZWUpOiBQYXRocyB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb25zLmNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlKHBvbHlUcmVlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqICBNaW5rb3dza2kgRGlmZmVyZW5jZSBpcyBwZXJmb3JtZWQgYnkgc3VidHJhY3RpbmcgZWFjaCBwb2ludCBpbiBhIHBvbHlnb24gZnJvbSB0aGUgc2V0IG9mIHBvaW50cyBpbiBhbiBvcGVuIG9yIGNsb3NlZCBwYXRoLiBBIGtleSBmZWF0dXJlIG9mIE1pbmtvd3NraVxyXG4gICAqICBEaWZmZXJlbmNlIGlzIHRoYXQgd2hlbiBpdCdzIGFwcGxpZWQgdG8gdHdvIHBvbHlnb25zLCB0aGUgcmVzdWx0aW5nIHBvbHlnb24gd2lsbCBjb250YWluIHRoZSBjb29yZGluYXRlIHNwYWNlIG9yaWdpbiB3aGVuZXZlciB0aGUgdHdvIHBvbHlnb25zIHRvdWNoIG9yXHJcbiAgICogIG92ZXJsYXAuIChUaGlzIGZ1bmN0aW9uIGlzIG9mdGVuIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZW4gcG9seWdvbnMgY29sbGlkZS4pXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcG9seTFcclxuICAgKiBAcGFyYW0gcG9seTJcclxuICAgKiBAcmV0dXJuIHtQYXRoc31cclxuICAgKi9cclxuICBtaW5rb3dza2lEaWZmKHBvbHkxOiBSZWFkb25seVBhdGgsIHBvbHkyOiBSZWFkb25seVBhdGgpOiBQYXRocyB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb25zLm1pbmtvd3NraURpZmYodGhpcy5pbnN0YW5jZSwgcG9seTEsIHBvbHkyKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1pbmtvd3NraSBBZGRpdGlvbiBpcyBwZXJmb3JtZWQgYnkgYWRkaW5nIGVhY2ggcG9pbnQgaW4gYSBwb2x5Z29uICdwYXR0ZXJuJyB0byB0aGUgc2V0IG9mIHBvaW50cyBpbiBhbiBvcGVuIG9yIGNsb3NlZCBwYXRoLiBUaGUgcmVzdWx0aW5nIHBvbHlnb25cclxuICAgKiAob3IgcG9seWdvbnMpIGRlZmluZXMgdGhlIHJlZ2lvbiB0aGF0IHRoZSAncGF0dGVybicgd291bGQgcGFzcyBvdmVyIGluIG1vdmluZyBmcm9tIHRoZSBiZWdpbm5pbmcgdG8gdGhlIGVuZCBvZiB0aGUgJ3BhdGgnLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdHRlcm5cclxuICAgKiBAcGFyYW0gcGF0aFxyXG4gICAqIEBwYXJhbSBwYXRoSXNDbG9zZWRcclxuICAgKiBAcmV0dXJuIHtQYXRoc31cclxuICAgKi9cclxuICBtaW5rb3dza2lTdW1QYXRoKHBhdHRlcm46IFJlYWRvbmx5UGF0aCwgcGF0aDogUmVhZG9ubHlQYXRoLCBwYXRoSXNDbG9zZWQ6IGJvb2xlYW4pOiBQYXRocyB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb25zLm1pbmtvd3NraVN1bVBhdGgodGhpcy5pbnN0YW5jZSwgcGF0dGVybiwgcGF0aCwgcGF0aElzQ2xvc2VkKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1pbmtvd3NraSBBZGRpdGlvbiBpcyBwZXJmb3JtZWQgYnkgYWRkaW5nIGVhY2ggcG9pbnQgaW4gYSBwb2x5Z29uICdwYXR0ZXJuJyB0byB0aGUgc2V0IG9mIHBvaW50cyBpbiBhbiBvcGVuIG9yIGNsb3NlZCBwYXRoLiBUaGUgcmVzdWx0aW5nIHBvbHlnb25cclxuICAgKiAob3IgcG9seWdvbnMpIGRlZmluZXMgdGhlIHJlZ2lvbiB0aGF0IHRoZSAncGF0dGVybicgd291bGQgcGFzcyBvdmVyIGluIG1vdmluZyBmcm9tIHRoZSBiZWdpbm5pbmcgdG8gdGhlIGVuZCBvZiB0aGUgJ3BhdGgnLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdHRlcm5cclxuICAgKiBAcGFyYW0gcGF0aHNcclxuICAgKiBAcGFyYW0gcGF0aElzQ2xvc2VkXHJcbiAgICogQHJldHVybiB7UGF0aHN9XHJcbiAgICovXHJcbiAgbWlua293c2tpU3VtUGF0aHMocGF0dGVybjogUmVhZG9ubHlQYXRoLCBwYXRoczogUmVhZG9ubHlQYXRocywgcGF0aElzQ2xvc2VkOiBib29sZWFuKTogUGF0aHMge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5taW5rb3dza2lTdW1QYXRocyh0aGlzLmluc3RhbmNlLCBwYXR0ZXJuLCBwYXRocywgcGF0aElzQ2xvc2VkKTtcclxuICB9XHJcblxyXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcclxuICAvKipcclxuICAgKiBUaGlzIGZ1bmN0aW9uIGZpbHRlcnMgb3V0IGNsb3NlZCBwYXRocyBmcm9tIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgYW5kIHJldHVybnMgb25seSBvcGVuIHBhdGhzIGluIGEgUGF0aHMgc3RydWN0dXJlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBvbHlUcmVlXHJcbiAgICogQHJldHVybiB7UmVhZG9ubHlQYXRoW119XHJcbiAgICovXHJcbiAgb3BlblBhdGhzRnJvbVBvbHlUcmVlKHBvbHlUcmVlOiBQb2x5VHJlZSk6IFJlYWRvbmx5UGF0aFtdIHtcclxuICAgIHJldHVybiBmdW5jdGlvbnMub3BlblBhdGhzRnJvbVBvbHlUcmVlKHBvbHlUcmVlKTtcclxuICB9XHJcblxyXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcclxuICAvKipcclxuICAgKiBPcmllbnRhdGlvbiBpcyBvbmx5IGltcG9ydGFudCB0byBjbG9zZWQgcGF0aHMuIEdpdmVuIHRoYXQgdmVydGljZXMgYXJlIGRlY2xhcmVkIGluIGEgc3BlY2lmaWMgb3JkZXIsIG9yaWVudGF0aW9uIHJlZmVycyB0byB0aGUgZGlyZWN0aW9uIChjbG9ja3dpc2Ugb3JcclxuICAgKiBjb3VudGVyLWNsb2Nrd2lzZSkgdGhhdCB0aGVzZSB2ZXJ0aWNlcyBwcm9ncmVzcyBhcm91bmQgYSBjbG9zZWQgcGF0aC5cclxuICAgKlxyXG4gICAqIE9yaWVudGF0aW9uIGlzIGFsc28gZGVwZW5kZW50IG9uIGF4aXMgZGlyZWN0aW9uOlxyXG4gICAqIC0gT24gWS1heGlzIHBvc2l0aXZlIHVwd2FyZCBkaXNwbGF5cywgb3JpZW50YXRpb24gd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgcG9seWdvbidzIG9yaWVudGF0aW9uIGlzIGNvdW50ZXItY2xvY2t3aXNlLlxyXG4gICAqIC0gT24gWS1heGlzIHBvc2l0aXZlIGRvd253YXJkIGRpc3BsYXlzLCBvcmllbnRhdGlvbiB3aWxsIHJldHVybiB0cnVlIGlmIHRoZSBwb2x5Z29uJ3Mgb3JpZW50YXRpb24gaXMgY2xvY2t3aXNlLlxyXG4gICAqXHJcbiAgICogTm90ZXM6XHJcbiAgICogLSBTZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyBoYXZlIGluZGV0ZXJtaW5hdGUgb3JpZW50YXRpb25zIGluIHdoaWNoIGNhc2UgdGhpcyBmdW5jdGlvbiB3b24ndCByZXR1cm4gYSBtZWFuaW5nZnVsIHZhbHVlLlxyXG4gICAqIC0gVGhlIG1ham9yaXR5IG9mIDJEIGdyYXBoaWMgZGlzcGxheSBsaWJyYXJpZXMgKGVnIEdESSwgR0RJKywgWExpYiwgQ2Fpcm8sIEFHRywgR3JhcGhpY3MzMikgYW5kIGV2ZW4gdGhlIFNWRyBmaWxlIGZvcm1hdCBoYXZlIHRoZWlyIGNvb3JkaW5hdGUgb3JpZ2luc1xyXG4gICAqIGF0IHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlaXIgcmVzcGVjdGl2ZSB2aWV3cG9ydHMgd2l0aCB0aGVpciBZIGF4ZXMgaW5jcmVhc2luZyBkb3dud2FyZC4gSG93ZXZlciwgc29tZSBkaXNwbGF5IGxpYnJhcmllcyAoZWcgUXVhcnR6LCBPcGVuR0wpIGhhdmUgdGhlaXJcclxuICAgKiBjb29yZGluYXRlIG9yaWdpbnMgdW5kZWZpbmVkIG9yIGluIHRoZSBjbGFzc2ljIGJvdHRvbS1sZWZ0IHBvc2l0aW9uIHdpdGggdGhlaXIgWSBheGVzIGluY3JlYXNpbmcgdXB3YXJkLlxyXG4gICAqIC0gRm9yIE5vbi1aZXJvIGZpbGxlZCBwb2x5Z29ucywgdGhlIG9yaWVudGF0aW9uIG9mIGhvbGVzIG11c3QgYmUgb3Bwb3NpdGUgdGhhdCBvZiBvdXRlciBwb2x5Z29ucy5cclxuICAgKiAtIEZvciBjbG9zZWQgcGF0aHMgKHBvbHlnb25zKSBpbiB0aGUgc29sdXRpb24gcmV0dXJuZWQgYnkgdGhlIGNsaXAgbWV0aG9kLCB0aGVpciBvcmllbnRhdGlvbnMgd2lsbCBhbHdheXMgYmUgdHJ1ZSBmb3Igb3V0ZXIgcG9seWdvbnMgYW5kIGZhbHNlXHJcbiAgICogZm9yIGhvbGUgcG9seWdvbnMgKHVubGVzcyB0aGUgcmV2ZXJzZVNvbHV0aW9uIHByb3BlcnR5IGhhcyBiZWVuIGVuYWJsZWQpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGggLSBQYXRoXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBvcmllbnRhdGlvbihwYXRoOiBSZWFkb25seVBhdGgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBmdW5jdGlvbnMub3JpZW50YXRpb24ocGF0aCk7XHJcbiAgfVxyXG5cclxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBQb2ludEluUG9seWdvblJlc3VsdC5PdXRzaWRlIHdoZW4gZmFsc2UsIFBvaW50SW5Qb2x5Z29uUmVzdWx0Lk9uQm91bmRhcnkgd2hlbiBwb2ludCBpcyBvbiBwb2x5IGFuZCBQb2ludEluUG9seWdvblJlc3VsdC5JbnNpZGUgd2hlbiBwb2ludCBpcyBpblxyXG4gICAqIHBvbHkuXHJcbiAgICpcclxuICAgKiBJdCdzIGFzc3VtZWQgdGhhdCAncG9seScgaXMgY2xvc2VkIGFuZCBkb2VzIG5vdCBzZWxmLWludGVyc2VjdC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwb2ludFxyXG4gICAqIEBwYXJhbSBwYXRoXHJcbiAgICogQHJldHVybiB7UG9pbnRJblBvbHlnb25SZXN1bHR9XHJcbiAgICovXHJcbiAgcG9pbnRJblBvbHlnb24ocG9pbnQ6IFJlYWRvbmx5PEludFBvaW50PiwgcGF0aDogUmVhZG9ubHlQYXRoKTogUG9pbnRJblBvbHlnb25SZXN1bHQge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5wb2ludEluUG9seWdvbihwb2ludCwgcGF0aCk7XHJcbiAgfVxyXG5cclxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBjb252ZXJ0cyBhIFBvbHlUcmVlIHN0cnVjdHVyZSBpbnRvIGEgUGF0aHMgc3RydWN0dXJlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBvbHlUcmVlXHJcbiAgICogQHJldHVybiB7UGF0aHN9XHJcbiAgICovXHJcbiAgcG9seVRyZWVUb1BhdGhzKHBvbHlUcmVlOiBQb2x5VHJlZSk6IFBhdGhzIHtcclxuICAgIHJldHVybiBmdW5jdGlvbnMucG9seVRyZWVUb1BhdGhzKHBvbHlUcmVlKTtcclxuICB9XHJcblxyXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcclxuICAvKipcclxuICAgKiBSZXZlcnNlcyB0aGUgdmVydGV4IG9yZGVyIChhbmQgaGVuY2Ugb3JpZW50YXRpb24pIGluIHRoZSBzcGVjaWZpZWQgcGF0aC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXRoIC0gUGF0aCB0byByZXZlcnNlLCB3aGljaCBnZXRzIG92ZXJ3cml0dGVuIHJhdGhlciB0aGFuIGNvcGllZFxyXG4gICAqL1xyXG4gIHJldmVyc2VQYXRoKHBhdGg6IFBhdGgpOiB2b2lkIHtcclxuICAgIGZ1bmN0aW9ucy5yZXZlcnNlUGF0aChwYXRoKTtcclxuICB9XHJcblxyXG4gIC8vbm9pbnNwZWN0aW9uIEpTTWV0aG9kQ2FuQmVTdGF0aWNcclxuICAvKipcclxuICAgKiBSZXZlcnNlcyB0aGUgdmVydGV4IG9yZGVyIChhbmQgaGVuY2Ugb3JpZW50YXRpb24pIGluIGVhY2ggY29udGFpbmVkIHBhdGguXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGF0aHMgLSBQYXRocyB0byByZXZlcnNlLCB3aGljaCBnZXQgb3ZlcndyaXR0ZW4gcmF0aGVyIHRoYW4gY29waWVkXHJcbiAgICovXHJcbiAgcmV2ZXJzZVBhdGhzKHBhdGhzOiBQYXRocyk6IHZvaWQge1xyXG4gICAgZnVuY3Rpb25zLnJldmVyc2VQYXRocyhwYXRocyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIHNlbGYtaW50ZXJzZWN0aW9ucyBmcm9tIHRoZSBzdXBwbGllZCBwb2x5Z29uIChieSBwZXJmb3JtaW5nIGEgYm9vbGVhbiB1bmlvbiBvcGVyYXRpb24gdXNpbmcgdGhlIG5vbWluYXRlZCBQb2x5RmlsbFR5cGUpLlxyXG4gICAqIFBvbHlnb25zIHdpdGggbm9uLWNvbnRpZ3VvdXMgZHVwbGljYXRlIHZlcnRpY2VzIChpZSAndG91Y2hpbmcnKSB3aWxsIGJlIHNwbGl0IGludG8gdHdvIHBvbHlnb25zLlxyXG4gICAqXHJcbiAgICogTm90ZTogVGhlcmUncyBjdXJyZW50bHkgbm8gZ3VhcmFudGVlIHRoYXQgcG9seWdvbnMgd2lsbCBiZSBzdHJpY3RseSBzaW1wbGUgc2luY2UgJ3NpbXBsaWZ5aW5nJyBpcyBzdGlsbCBhIHdvcmsgaW4gcHJvZ3Jlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGF0aFxyXG4gICAqIEBwYXJhbSBmaWxsVHlwZVxyXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFRoZSBzb2x1dGlvblxyXG4gICAqL1xyXG4gIHNpbXBsaWZ5UG9seWdvbihwYXRoOiBSZWFkb25seVBhdGgsIGZpbGxUeXBlOiBQb2x5RmlsbFR5cGUgPSBQb2x5RmlsbFR5cGUuRXZlbk9kZCk6IFBhdGhzIHtcclxuICAgIHJldHVybiBmdW5jdGlvbnMuc2ltcGxpZnlQb2x5Z29uKHRoaXMuaW5zdGFuY2UsIHBhdGgsIGZpbGxUeXBlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgc2VsZi1pbnRlcnNlY3Rpb25zIGZyb20gdGhlIHN1cHBsaWVkIHBvbHlnb25zIChieSBwZXJmb3JtaW5nIGEgYm9vbGVhbiB1bmlvbiBvcGVyYXRpb24gdXNpbmcgdGhlIG5vbWluYXRlZCBQb2x5RmlsbFR5cGUpLlxyXG4gICAqIFBvbHlnb25zIHdpdGggbm9uLWNvbnRpZ3VvdXMgZHVwbGljYXRlIHZlcnRpY2VzIChpZSAndmVydGljZXMgYXJlIHRvdWNoaW5nJykgd2lsbCBiZSBzcGxpdCBpbnRvIHR3byBwb2x5Z29ucy5cclxuICAgKlxyXG4gICAqIE5vdGU6IFRoZXJlJ3MgY3VycmVudGx5IG5vIGd1YXJhbnRlZSB0aGF0IHBvbHlnb25zIHdpbGwgYmUgc3RyaWN0bHkgc2ltcGxlIHNpbmNlICdzaW1wbGlmeWluZycgaXMgc3RpbGwgYSB3b3JrIGluIHByb2dyZXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGhzXHJcbiAgICogQHBhcmFtIGZpbGxUeXBlXHJcbiAgICogQHJldHVybiB7UGF0aHN9IC0gVGhlIHNvbHV0aW9uXHJcbiAgICovXHJcbiAgc2ltcGxpZnlQb2x5Z29ucyhwYXRoczogUmVhZG9ubHlQYXRocywgZmlsbFR5cGU6IFBvbHlGaWxsVHlwZSA9IFBvbHlGaWxsVHlwZS5FdmVuT2RkKTogUGF0aHMge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zaW1wbGlmeVBvbHlnb25zKHRoaXMuaW5zdGFuY2UsIHBhdGhzLCBmaWxsVHlwZSk7XHJcbiAgfVxyXG5cclxuICAvL25vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXHJcbiAgLyoqXHJcbiAgICogU2NhbGVzIGEgcGF0aCBieSBtdWx0aXBseWluZyBhbGwgaXRzIHBvaW50cyBieSBhIG51bWJlciBhbmQgdGhlbiByb3VuZGluZyB0aGVtLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGggLSBQYXRoIHRvIHNjYWxlXHJcbiAgICogQHBhcmFtIHNjYWxlIC0gU2NhbGUgbXVsdGlwbGllclxyXG4gICAqIEByZXR1cm4ge1BhdGh9IC0gVGhlIHNjYWxlZCBwYXRoXHJcbiAgICovXHJcbiAgc2NhbGVQYXRoKHBhdGg6IFJlYWRvbmx5UGF0aCwgc2NhbGU6IG51bWJlcik6IFBhdGgge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zY2FsZVBhdGgocGF0aCwgc2NhbGUpO1xyXG4gIH1cclxuXHJcbiAgLy9ub2luc3BlY3Rpb24gSlNNZXRob2RDYW5CZVN0YXRpY1xyXG4gIC8qKlxyXG4gICAqIFNjYWxlcyBhbGwgaW5uZXIgcGF0aHMgYnkgbXVsdGlwbHlpbmcgYWxsIGl0cyBwb2ludHMgYnkgYSBudW1iZXIgYW5kIHRoZW4gcm91bmRpbmcgdGhlbS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXRocyAtIFBhdGhzIHRvIHNjYWxlXHJcbiAgICogQHBhcmFtIHNjYWxlIC0gU2NhbGUgbXVsdGlwbGllclxyXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFRoZSBzY2FsZWQgcGF0aHNcclxuICAgKi9cclxuICBzY2FsZVBhdGhzKHBhdGhzOiBSZWFkb25seVBhdGhzLCBzY2FsZTogbnVtYmVyKTogUGF0aHMge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zY2FsZVBhdGhzKHBhdGhzLCBzY2FsZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQXN5bmNocm9ub3VzbHkgdHJpZXMgdG8gbG9hZCBhIG5ldyBuYXRpdmUgaW5zdGFuY2Ugb2YgdGhlIGNsaXBwZXIgbGlicmFyeSB0byBiZSBzaGFyZWQgYWNyb3NzIGFsbCBtZXRob2QgaW52b2NhdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmb3JtYXQgLSBGb3JtYXQgdG8gbG9hZCwgZWl0aGVyIFdhc21UaGVuQXNtSnMsIFdhc21Pbmx5IG9yIEFzbUpzT25seS5cclxuICogQHJldHVybiB7UHJvbWlzZTxDbGlwcGVyTGliV3JhcHBlcj59IC0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHdyYXBwZXIgaW5zdGFuY2UuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbG9hZE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZUFzeW5jID0gYXN5bmMgKFxyXG4gIGZvcm1hdDogTmF0aXZlQ2xpcHBlckxpYlJlcXVlc3RlZEZvcm1hdFxyXG4pOiBQcm9taXNlPENsaXBwZXJMaWJXcmFwcGVyPiA9PiB7XHJcbiAgLy8gVE9ETzogaW4gdGhlIGZ1dHVyZSB1c2UgdGhlc2UgbWV0aG9kcyBpbnN0ZWFkIGh0dHBzOi8vZ2l0aHViLmNvbS9qZWRpc2N0MS9saWJzb2RpdW0uanMvaXNzdWVzLzk0XHJcblxyXG4gIGxldCB0cnlXYXNtO1xyXG4gIGxldCB0cnlBc21KcztcclxuICBzd2l0Y2ggKGZvcm1hdCkge1xyXG4gICAgY2FzZSBOYXRpdmVDbGlwcGVyTGliUmVxdWVzdGVkRm9ybWF0Lldhc21XaXRoQXNtSnNGYWxsYmFjazpcclxuICAgICAgdHJ5V2FzbSA9IHRydWU7XHJcbiAgICAgIHRyeUFzbUpzID0gdHJ1ZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIE5hdGl2ZUNsaXBwZXJMaWJSZXF1ZXN0ZWRGb3JtYXQuV2FzbU9ubHk6XHJcbiAgICAgIHRyeVdhc20gPSB0cnVlO1xyXG4gICAgICB0cnlBc21KcyA9IGZhbHNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgTmF0aXZlQ2xpcHBlckxpYlJlcXVlc3RlZEZvcm1hdC5Bc21Kc09ubHk6XHJcbiAgICAgIHRyeVdhc20gPSBmYWxzZTtcclxuICAgICAgdHJ5QXNtSnMgPSB0cnVlO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBDbGlwcGVyRXJyb3IoXCJ1bmtub3duIG5hdGl2ZSBjbGlwcGVyIGZvcm1hdFwiKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldE1vZHVsZUFzeW5jKFxyXG4gICAgaW5pdE1vZHVsZTogKG92ZXJyaWRlczogb2JqZWN0KSA9PiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfCB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgZmluYWxNb2R1bGU6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgIC8vbm9pbnNwZWN0aW9uIEpTVW51c2VkTG9jYWxTeW1ib2xzXHJcbiAgICAgIGNvbnN0IG1vZHVsZU92ZXJyaWRlcyA9IHtcclxuICAgICAgICBub0V4aXRSdW50aW1lOiB0cnVlLFxyXG4gICAgICAgIHByZVJ1bigpIHtcclxuICAgICAgICAgIGlmIChmaW5hbE1vZHVsZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGZpbmFsTW9kdWxlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoZmluYWxNb2R1bGUpO1xyXG4gICAgICAgICAgICB9LCAxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHF1aXQoY29kZTogbnVtYmVyLCBlcnI6IEVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBmaW5hbE1vZHVsZSA9IGluaXRNb2R1bGUobW9kdWxlT3ZlcnJpZGVzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHRyeVdhc20pIHtcclxuICAgIGlmICh3YXNtTW9kdWxlIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgLy8gc2tpcFxyXG4gICAgfSBlbHNlIGlmICh3YXNtTW9kdWxlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpbml0TW9kdWxlID0gcmVxdWlyZShcIi4vd2FzbS9jbGlwcGVyLXdhc21cIikuaW5pdDtcclxuICAgICAgICB3YXNtTW9kdWxlID0gYXdhaXQgZ2V0TW9kdWxlQXN5bmMoaW5pdE1vZHVsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQ2xpcHBlckxpYldyYXBwZXIod2FzbU1vZHVsZSwgTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdC5XYXNtKTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgd2FzbU1vZHVsZSA9IGVycjtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG5ldyBDbGlwcGVyTGliV3JhcHBlcih3YXNtTW9kdWxlLCBOYXRpdmVDbGlwcGVyTGliTG9hZGVkRm9ybWF0Lldhc20pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHRyeUFzbUpzKSB7XHJcbiAgICBpZiAoYXNtSnNNb2R1bGUgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAvLyBza2lwXHJcbiAgICB9IGVsc2UgaWYgKGFzbUpzTW9kdWxlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpbml0TW9kdWxlID0gcmVxdWlyZShcIi4vd2FzbS9jbGlwcGVyXCIpLmluaXQ7XHJcbiAgICAgICAgYXNtSnNNb2R1bGUgPSBhd2FpdCBnZXRNb2R1bGVBc3luYyhpbml0TW9kdWxlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBDbGlwcGVyTGliV3JhcHBlcihhc21Kc01vZHVsZSwgTmF0aXZlQ2xpcHBlckxpYkxvYWRlZEZvcm1hdC5Bc21Kcyk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGFzbUpzTW9kdWxlID0gZXJyO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbmV3IENsaXBwZXJMaWJXcmFwcGVyKGFzbUpzTW9kdWxlLCBOYXRpdmVDbGlwcGVyTGliTG9hZGVkRm9ybWF0LkFzbUpzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRocm93IG5ldyBDbGlwcGVyRXJyb3IoXCJjb3VsZCBub3QgbG9hZCBuYXRpdmUgY2xpcHBlciBpbiB0aGUgZGVzaXJlZCBmb3JtYXRcIik7XHJcbn07XHJcbiJdfQ==
