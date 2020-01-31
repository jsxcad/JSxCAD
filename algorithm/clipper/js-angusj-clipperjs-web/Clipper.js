"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var nativeEnumConversion_1 = require("./native/nativeEnumConversion");
var PathsToNativePaths_1 = require("./native/PathsToNativePaths");
var PathToNativePath_1 = require("./native/PathToNativePath");
var PolyTree_1 = require("./PolyTree");
var Clipper = /** @class */ (function () {
    /**
     * The Clipper constructor creates an instance of the Clipper class. One or more InitOptions may be passed as a parameter to set the corresponding properties.
     * (These properties can still be set or reset after construction.)
     *
     * @param _nativeLib
     * @param initOptions
     */
    function Clipper(_nativeLib, initOptions) {
        if (initOptions === void 0) { initOptions = {}; }
        this._nativeLib = _nativeLib;
        var realInitOptions = __assign({ reverseSolutions: false, strictlySimple: false, preserveCollinear: false }, initOptions);
        var nativeInitOptions = 0;
        if (realInitOptions.reverseSolutions) {
            nativeInitOptions += _nativeLib.InitOptions.ReverseSolution;
        }
        if (realInitOptions.strictlySimple) {
            nativeInitOptions += _nativeLib.InitOptions.StrictlySimple;
        }
        if (realInitOptions.preserveCollinear) {
            nativeInitOptions += _nativeLib.InitOptions.PreserveCollinear;
        }
        this._clipper = new _nativeLib.Clipper(nativeInitOptions);
    }
    Object.defineProperty(Clipper.prototype, "preserveCollinear", {
        /**
         * By default, when three or more vertices are collinear in input polygons (subject or clip), the Clipper object removes the 'inner' vertices before
         * clipping. When enabled the preserveCollinear property prevents this default behavior to allow these inner vertices to appear in the solution.
         *
         * @return {boolean} - true if set, false otherwise
         */
        get: function () {
            return this._clipper.preserveCollinear;
        },
        /**
         * By default, when three or more vertices are collinear in input polygons (subject or clip), the Clipper object removes the 'inner' vertices before
         * clipping. When enabled the preserveCollinear property prevents this default behavior to allow these inner vertices to appear in the solution.
         *
         * @param value - value to set
         */
        set: function (value) {
            this._clipper.preserveCollinear = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Clipper.prototype, "reverseSolution", {
        /**
         * When this property is set to true, polygons returned in the solution parameter of the execute() method will have orientations opposite to their normal
         * orientations.
         *
         * @return {boolean} - true if set, false otherwise
         */
        get: function () {
            return this._clipper.reverseSolution;
        },
        /**
         * When this property is set to true, polygons returned in the solution parameter of the execute() method will have orientations opposite to their normal
         * orientations.
         *
         * @param value - value to set
         */
        set: function (value) {
            this._clipper.reverseSolution = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Clipper.prototype, "strictlySimple", {
        /**
         * Terminology:
         * - A simple polygon is one that does not self-intersect.
         * - A weakly simple polygon is a simple polygon that contains 'touching' vertices, or 'touching' edges.
         * - A strictly simple polygon is a simple polygon that does not contain 'touching' vertices, or 'touching' edges.
         *
         * Vertices 'touch' if they share the same coordinates (and are not adjacent). An edge touches another if one of its end vertices touches another edge
         * excluding its adjacent edges, or if they are co-linear and overlapping (including adjacent edges).
         *
         * Polygons returned by clipping operations (see Clipper.execute()) should always be simple polygons. When the StrictlySimply property is enabled,
         * polygons returned will be strictly simple, otherwise they may be weakly simple. It's computationally expensive ensuring polygons are strictly simple
         * and so this property is disabled by default.
         *
         * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
         *
         * @return {boolean} - true if set, false otherwise
         */
        get: function () {
            return this._clipper.strictlySimple;
        },
        /**
         * Terminology:
         * - A simple polygon is one that does not self-intersect.
         * - A weakly simple polygon is a simple polygon that contains 'touching' vertices, or 'touching' edges.
         * - A strictly simple polygon is a simple polygon that does not contain 'touching' vertices, or 'touching' edges.
         *
         * Vertices 'touch' if they share the same coordinates (and are not adjacent). An edge touches another if one of its end vertices touches another edge
         * excluding its adjacent edges, or if they are co-linear and overlapping (including adjacent edges).
         *
         * Polygons returned by clipping operations (see Clipper.execute()) should always be simple polygons. When the StrictlySimply property is enabled,
         * polygons returned will be strictly simple, otherwise they may be weakly simple. It's computationally expensive ensuring polygons are strictly simple
         * and so this property is disabled by default.
         *
         * Note: There's currently no guarantee that polygons will be strictly simple since 'simplifying' is still a work in progress.
         *
         * @param value - value to set
         */
        set: function (value) {
            this._clipper.strictlySimple = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Any number of subject and clip paths can be added to a clipping task, either individually via the addPath() method, or as groups via the addPaths()
     * method, or even using both methods.
     *
     * 'Subject' paths may be either open (lines) or closed (polygons) or even a mixture of both, but 'clipping' paths must always be closed. Clipper allows
     * polygons to clip both lines and other polygons, but doesn't allow lines to clip either lines or polygons.
     *
     * With closed paths, orientation should conform with the filling rule that will be passed via Clipper's execute method.
     *
     * Path Coordinate range:
     * Path coordinates must be between ± 9007199254740991, otherwise a range error will be thrown when attempting to add the path to the Clipper object.
     * If coordinates can be kept between ± 0x3FFFFFFF (± 1.0e+9), a modest increase in performance (approx. 15-20%) over the larger range can be achieved by
     * avoiding large integer math.
     *
     * Return Value:
     * The function will return false if the path is invalid for clipping. A path is invalid for clipping when:
     * - it has less than 2 vertices
     * - it has 2 vertices but is not an open path
     * - the vertices are all co-linear and it is not an open path
     *
     * @param path - Path to add
     * @param polyType - Polygon type
     * @param closed - If the path is closed
     */
    Clipper.prototype.addPath = function (path, polyType, closed) {
        var nativePath = PathToNativePath_1.pathToNativePath(this._nativeLib, path);
        try {
            return this._clipper.addPath(nativePath, nativeEnumConversion_1.polyTypeToNative(this._nativeLib, polyType), closed);
        }
        finally {
            nativePath.delete();
        }
    };
    /**
     * Any number of subject and clip paths can be added to a clipping task, either individually via the addPath() method, or as groups via the addPaths()
     * method, or even using both methods.
     *
     * 'Subject' paths may be either open (lines) or closed (polygons) or even a mixture of both, but 'clipping' paths must always be closed. Clipper allows
     * polygons to clip both lines and other polygons, but doesn't allow lines to clip either lines or polygons.
     *
     * With closed paths, orientation should conform with the filling rule that will be passed via Clipper's execute method.
     *
     * Path Coordinate range:
     * Path coordinates must be between ± 9007199254740991, otherwise a range error will be thrown when attempting to add the path to the Clipper object.
     * If coordinates can be kept between ± 0x3FFFFFFF (± 1.0e+9), a modest increase in performance (approx. 15-20%) over the larger range can be achieved
     * by avoiding large integer math.
     *
     * Return Value:
     * The function will return false if the path is invalid for clipping. A path is invalid for clipping when:
     * - it has less than 2 vertices
     * - it has 2 vertices but is not an open path
     * - the vertices are all co-linear and it is not an open path
     *
     * @param paths - Paths to add
     * @param polyType - Paths polygon type
     * @param closed - If all the inner paths are closed
     */
    Clipper.prototype.addPaths = function (paths, polyType, closed) {
        var nativePaths = PathsToNativePaths_1.pathsToNativePaths(this._nativeLib, paths);
        try {
            return this._clipper.addPaths(nativePaths, nativeEnumConversion_1.polyTypeToNative(this._nativeLib, polyType), closed);
        }
        finally {
            nativePaths.delete();
        }
    };
    /**
     * The Clear method removes any existing subject and clip polygons allowing the Clipper object to be reused for clipping operations on different polygon sets.
     */
    Clipper.prototype.clear = function () {
        this._clipper.clear();
    };
    /**
     * This method returns the axis-aligned bounding rectangle of all polygons that have been added to the Clipper object.
     *
     * @return {{left: number, right: number, top: number, bottom: number}} - Bounds
     */
    Clipper.prototype.getBounds = function () {
        var nativeBounds = this._clipper.getBounds();
        var rect = {
            left: nativeBounds.left,
            right: nativeBounds.right,
            top: nativeBounds.top,
            bottom: nativeBounds.bottom
        };
        nativeBounds.delete();
        return rect;
    };
    /**
     * Once subject and clip paths have been assigned (via addPath and/or addPaths), execute can then perform the clipping operation (intersection, union,
     * difference or XOR) specified by the clipType parameter.
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
     * The subjFillType and clipFillType parameters define the polygon fill rule to be applied to the polygons (ie closed paths) in the subject and clip
     * paths respectively. (It's usual though obviously not essential that both sets of polygons use the same fill rule.)
     *
     * execute can be called multiple times without reassigning subject and clip polygons (ie when different clipping operations are required on the
     * same polygon sets).
     *
     * @param clipType - Clip operation type
     * @param subjFillType - Fill type of the subject polygons
     * @param clipFillType - Fill type of the clip polygons
     * @param cleanDistance - Clean distance over the output, or undefined for no cleaning.
     * @return {Paths | undefined} - The solution or undefined if there was an error
     */
    Clipper.prototype.executeToPaths = function (clipType, subjFillType, clipFillType, cleanDistance) {
        var outNativePaths = new this._nativeLib.Paths();
        try {
            var success = this._clipper.executePathsWithFillTypes(nativeEnumConversion_1.clipTypeToNative(this._nativeLib, clipType), outNativePaths, nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, subjFillType), nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, clipFillType));
            if (!success) {
                return undefined;
            }
            else {
                if (cleanDistance !== undefined) {
                    this._nativeLib.cleanPolygons(outNativePaths, cleanDistance);
                }
                return PathsToNativePaths_1.nativePathsToPaths(this._nativeLib, outNativePaths, true); // frees outNativePaths
            }
        }
        finally {
            if (!outNativePaths.isDeleted()) {
                outNativePaths.delete();
            }
        }
    };
    /**
     * Once subject and clip paths have been assigned (via addPath and/or addPaths), execute can then perform the clipping operation (intersection, union,
     * difference or XOR) specified by the clipType parameter.
     *
     * The solution parameter can be either a Paths or PolyTree structure. The Paths structure is simpler than the PolyTree structure. Because of this it is
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
     * The subjFillType and clipFillType parameters define the polygon fill rule to be applied to the polygons (ie closed paths) in the subject and clip
     * paths respectively. (It's usual though obviously not essential that both sets of polygons use the same fill rule.)
     *
     * execute can be called multiple times without reassigning subject and clip polygons (ie when different clipping operations are required on the
     * same polygon sets).
     *
     * @param clipType - Clip operation type
     * @param subjFillType - Fill type of the subject polygons
     * @param clipFillType - Fill type of the clip polygons
     * @return {PolyTree | undefined} - The solution or undefined if there was an error
     */
    Clipper.prototype.executeToPolyTee = function (clipType, subjFillType, clipFillType) {
        var outNativePolyTree = new this._nativeLib.PolyTree();
        try {
            var success = this._clipper.executePolyTreeWithFillTypes(nativeEnumConversion_1.clipTypeToNative(this._nativeLib, clipType), outNativePolyTree, nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, subjFillType), nativeEnumConversion_1.polyFillTypeToNative(this._nativeLib, clipFillType));
            if (!success) {
                return undefined;
            }
            else {
                return PolyTree_1.PolyTree.fromNativePolyTree(this._nativeLib, outNativePolyTree, true); // frees outNativePolyTree
            }
        }
        finally {
            if (!outNativePolyTree.isDeleted()) {
                outNativePolyTree.delete();
            }
        }
    };
    /**
     * Checks if the object has been disposed.
     *
     * @return {boolean} - true if disposed, false if not
     */
    Clipper.prototype.isDisposed = function () {
        return this._clipper === undefined || this._clipper.isDeleted();
    };
    /**
     * Since this library uses WASM/ASM.JS internally for speed this means that you must dispose objects after you are done using them or mem leaks will occur.
     */
    Clipper.prototype.dispose = function () {
        if (this._clipper) {
            this._clipper.delete();
            this._clipper = undefined;
        }
    };
    return Clipper;
}());
exports.Clipper = Clipper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9DbGlwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFJQSxzRUFJdUM7QUFDdkMsa0VBQXFGO0FBQ3JGLDhEQUE2RDtBQUc3RCx1Q0FBc0M7QUFzQnRDO0lBcUZFOzs7Ozs7T0FNRztJQUNILGlCQUNtQixVQUFvQyxFQUNyRCxXQUFvQztRQUFwQyw0QkFBQSxFQUFBLGdCQUFvQztRQURuQixlQUFVLEdBQVYsVUFBVSxDQUEwQjtRQUdyRCxJQUFNLGVBQWUsY0FDbkIsZ0JBQWdCLEVBQUUsS0FBSyxFQUN2QixjQUFjLEVBQUUsS0FBSyxFQUNyQixpQkFBaUIsRUFBRSxLQUFLLElBQ3JCLFdBQVcsQ0FDZixDQUFDO1FBRUYsSUFBSSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7WUFDcEMsaUJBQWlCLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUF5QixDQUFDO1NBQ3ZFO1FBQ0QsSUFBSSxlQUFlLENBQUMsY0FBYyxFQUFFO1lBQ2xDLGlCQUFpQixJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsY0FBd0IsQ0FBQztTQUN0RTtRQUNELElBQUksZUFBZSxDQUFDLGlCQUFpQixFQUFFO1lBQ3JDLGlCQUFpQixJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsaUJBQTJCLENBQUM7U0FDekU7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUExR0Qsc0JBQUksc0NBQWlCO1FBTnJCOzs7OztXQUtHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFTLENBQUMsaUJBQWlCLENBQUM7UUFDMUMsQ0FBQztRQUVEOzs7OztXQUtHO2FBQ0gsVUFBc0IsS0FBYztZQUNsQyxJQUFJLENBQUMsUUFBUyxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMzQyxDQUFDOzs7T0FWQTtJQWtCRCxzQkFBSSxvQ0FBZTtRQU5uQjs7Ozs7V0FLRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUyxDQUFDLGVBQWUsQ0FBQztRQUN4QyxDQUFDO1FBRUQ7Ozs7O1dBS0c7YUFDSCxVQUFvQixLQUFjO1lBQ2hDLElBQUksQ0FBQyxRQUFTLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUN6QyxDQUFDOzs7T0FWQTtJQTZCRCxzQkFBSSxtQ0FBYztRQWpCbEI7Ozs7Ozs7Ozs7Ozs7Ozs7V0FnQkc7YUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVMsQ0FBQyxjQUFjLENBQUM7UUFDdkMsQ0FBQztRQUVEOzs7Ozs7Ozs7Ozs7Ozs7O1dBZ0JHO2FBQ0gsVUFBbUIsS0FBYztZQUMvQixJQUFJLENBQUMsUUFBUyxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDeEMsQ0FBQzs7O09BckJBO0lBdUREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXVCRztJQUNILHlCQUFPLEdBQVAsVUFBUSxJQUFrQixFQUFFLFFBQWtCLEVBQUUsTUFBZTtRQUM3RCxJQUFNLFVBQVUsR0FBRyxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQUk7WUFDRixPQUFPLElBQUksQ0FBQyxRQUFTLENBQUMsT0FBTyxDQUMzQixVQUFVLEVBQ1YsdUNBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsRUFDM0MsTUFBTSxDQUNQLENBQUM7U0FDSDtnQkFBUztZQUNSLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCwwQkFBUSxHQUFSLFVBQVMsS0FBb0IsRUFBRSxRQUFrQixFQUFFLE1BQWU7UUFDaEUsSUFBTSxXQUFXLEdBQUcsdUNBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRCxJQUFJO1lBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUyxDQUFDLFFBQVEsQ0FDNUIsV0FBVyxFQUNYLHVDQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQzNDLE1BQU0sQ0FDUCxDQUFDO1NBQ0g7Z0JBQVM7WUFDUixXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCx1QkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLFFBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDJCQUFTLEdBQVQ7UUFDRSxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hELElBQU0sSUFBSSxHQUFHO1lBQ1gsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJO1lBQ3ZCLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSztZQUN6QixHQUFHLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDckIsTUFBTSxFQUFFLFlBQVksQ0FBQyxNQUFNO1NBQzVCLENBQUM7UUFDRixZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQ0c7SUFDSCxnQ0FBYyxHQUFkLFVBQ0UsUUFBa0IsRUFDbEIsWUFBMEIsRUFDMUIsWUFBMEIsRUFDMUIsYUFBaUM7UUFFakMsSUFBTSxjQUFjLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25ELElBQUk7WUFDRixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUyxDQUFDLHlCQUF5QixDQUN0RCx1Q0FBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxFQUMzQyxjQUFjLEVBQ2QsMkNBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFDbkQsMkNBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FDcEQsQ0FBQztZQUNGLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osT0FBTyxTQUFTLENBQUM7YUFDbEI7aUJBQU07Z0JBQ0wsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO29CQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7aUJBQzlEO2dCQUNELE9BQU8sdUNBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7YUFDMUY7U0FDRjtnQkFBUztZQUNSLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQy9CLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN6QjtTQUNGO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQ0c7SUFDSCxrQ0FBZ0IsR0FBaEIsVUFDRSxRQUFrQixFQUNsQixZQUEwQixFQUMxQixZQUEwQjtRQUUxQixJQUFNLGlCQUFpQixHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6RCxJQUFJO1lBQ0YsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVMsQ0FBQyw0QkFBNEIsQ0FDekQsdUNBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsRUFDM0MsaUJBQWlCLEVBQ2pCLDJDQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLEVBQ25ELDJDQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQ3BELENBQUM7WUFDRixJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE9BQU8sbUJBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsMEJBQTBCO2FBQ3pHO1NBQ0Y7Z0JBQVM7WUFDUixJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ2xDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzVCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDRCQUFVLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEUsQ0FBQztJQUVEOztPQUVHO0lBQ0gseUJBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBcFdELElBb1dDO0FBcFdZLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xpcFR5cGUsIFBvbHlGaWxsVHlwZSwgUG9seVR5cGUgfSBmcm9tIFwiLi9lbnVtc1wiO1xyXG5pbXBvcnQgeyBJbnRSZWN0IH0gZnJvbSBcIi4vSW50UmVjdFwiO1xyXG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJcIjtcclxuaW1wb3J0IHsgTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZVwiO1xyXG5pbXBvcnQge1xyXG4gIGNsaXBUeXBlVG9OYXRpdmUsXHJcbiAgcG9seUZpbGxUeXBlVG9OYXRpdmUsXHJcbiAgcG9seVR5cGVUb05hdGl2ZVxyXG59IGZyb20gXCIuL25hdGl2ZS9uYXRpdmVFbnVtQ29udmVyc2lvblwiO1xyXG5pbXBvcnQgeyBuYXRpdmVQYXRoc1RvUGF0aHMsIHBhdGhzVG9OYXRpdmVQYXRocyB9IGZyb20gXCIuL25hdGl2ZS9QYXRoc1RvTmF0aXZlUGF0aHNcIjtcclxuaW1wb3J0IHsgcGF0aFRvTmF0aXZlUGF0aCB9IGZyb20gXCIuL25hdGl2ZS9QYXRoVG9OYXRpdmVQYXRoXCI7XHJcbmltcG9ydCB7IFBhdGgsIFJlYWRvbmx5UGF0aCB9IGZyb20gXCIuL1BhdGhcIjtcclxuaW1wb3J0IHsgUGF0aHMsIFJlYWRvbmx5UGF0aHMgfSBmcm9tIFwiLi9QYXRoc1wiO1xyXG5pbXBvcnQgeyBQb2x5VHJlZSB9IGZyb20gXCIuL1BvbHlUcmVlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsaXBwZXJJbml0T3B0aW9ucyB7XHJcbiAgLyoqXHJcbiAgICogV2hlbiB0aGlzIHByb3BlcnR5IGlzIHNldCB0byB0cnVlLCBwb2x5Z29ucyByZXR1cm5lZCBpbiB0aGUgc29sdXRpb24gcGFyYW1ldGVyIG9mIHRoZSBleGVjdXRlKCkgbWV0aG9kIHdpbGwgaGF2ZSBvcmllbnRhdGlvbnMgb3Bwb3NpdGUgdG8gdGhlaXIgbm9ybWFsXHJcbiAgICogb3JpZW50YXRpb25zLlxyXG4gICAqL1xyXG4gIHJldmVyc2VTb2x1dGlvbj86IGJvb2xlYW47XHJcblxyXG4gIC8qKlxyXG4gICAqIFdoZW4gdGhpcyBwcm9wZXJ0eSBpcyBzZXQgdG8gdHJ1ZSwgcG9seWdvbnMgcmV0dXJuZWQgaW4gdGhlIHNvbHV0aW9uIHBhcmFtZXRlciBvZiB0aGUgZXhlY3V0ZSgpIG1ldGhvZCB3aWxsIGhhdmUgb3JpZW50YXRpb25zIG9wcG9zaXRlIHRvIHRoZWlyIG5vcm1hbFxyXG4gICAqIG9yaWVudGF0aW9ucy5cclxuICAgKi9cclxuICBzdHJpY3RseVNpbXBsZT86IGJvb2xlYW47XHJcblxyXG4gIC8qKlxyXG4gICAqIEJ5IGRlZmF1bHQsIHdoZW4gdGhyZWUgb3IgbW9yZSB2ZXJ0aWNlcyBhcmUgY29sbGluZWFyIGluIGlucHV0IHBvbHlnb25zIChzdWJqZWN0IG9yIGNsaXApLCB0aGUgQ2xpcHBlciBvYmplY3QgcmVtb3ZlcyB0aGUgJ2lubmVyJyB2ZXJ0aWNlcyBiZWZvcmVcclxuICAgKiBjbGlwcGluZy4gV2hlbiBlbmFibGVkIHRoZSBwcmVzZXJ2ZUNvbGxpbmVhciBwcm9wZXJ0eSBwcmV2ZW50cyB0aGlzIGRlZmF1bHQgYmVoYXZpb3IgdG8gYWxsb3cgdGhlc2UgaW5uZXIgdmVydGljZXMgdG8gYXBwZWFyIGluIHRoZSBzb2x1dGlvbi5cclxuICAgKi9cclxuICBwcmVzZXJ2ZUNvbGxpbmVhcj86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDbGlwcGVyIHtcclxuICBwcml2YXRlIF9jbGlwcGVyPzogTmF0aXZlQ2xpcHBlcjtcclxuXHJcbiAgLyoqXHJcbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aHJlZSBvciBtb3JlIHZlcnRpY2VzIGFyZSBjb2xsaW5lYXIgaW4gaW5wdXQgcG9seWdvbnMgKHN1YmplY3Qgb3IgY2xpcCksIHRoZSBDbGlwcGVyIG9iamVjdCByZW1vdmVzIHRoZSAnaW5uZXInIHZlcnRpY2VzIGJlZm9yZVxyXG4gICAqIGNsaXBwaW5nLiBXaGVuIGVuYWJsZWQgdGhlIHByZXNlcnZlQ29sbGluZWFyIHByb3BlcnR5IHByZXZlbnRzIHRoaXMgZGVmYXVsdCBiZWhhdmlvciB0byBhbGxvdyB0aGVzZSBpbm5lciB2ZXJ0aWNlcyB0byBhcHBlYXIgaW4gdGhlIHNvbHV0aW9uLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSB0cnVlIGlmIHNldCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgZ2V0IHByZXNlcnZlQ29sbGluZWFyKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NsaXBwZXIhLnByZXNlcnZlQ29sbGluZWFyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aHJlZSBvciBtb3JlIHZlcnRpY2VzIGFyZSBjb2xsaW5lYXIgaW4gaW5wdXQgcG9seWdvbnMgKHN1YmplY3Qgb3IgY2xpcCksIHRoZSBDbGlwcGVyIG9iamVjdCByZW1vdmVzIHRoZSAnaW5uZXInIHZlcnRpY2VzIGJlZm9yZVxyXG4gICAqIGNsaXBwaW5nLiBXaGVuIGVuYWJsZWQgdGhlIHByZXNlcnZlQ29sbGluZWFyIHByb3BlcnR5IHByZXZlbnRzIHRoaXMgZGVmYXVsdCBiZWhhdmlvciB0byBhbGxvdyB0aGVzZSBpbm5lciB2ZXJ0aWNlcyB0byBhcHBlYXIgaW4gdGhlIHNvbHV0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHZhbHVlIC0gdmFsdWUgdG8gc2V0XHJcbiAgICovXHJcbiAgc2V0IHByZXNlcnZlQ29sbGluZWFyKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9jbGlwcGVyIS5wcmVzZXJ2ZUNvbGxpbmVhciA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogV2hlbiB0aGlzIHByb3BlcnR5IGlzIHNldCB0byB0cnVlLCBwb2x5Z29ucyByZXR1cm5lZCBpbiB0aGUgc29sdXRpb24gcGFyYW1ldGVyIG9mIHRoZSBleGVjdXRlKCkgbWV0aG9kIHdpbGwgaGF2ZSBvcmllbnRhdGlvbnMgb3Bwb3NpdGUgdG8gdGhlaXIgbm9ybWFsXHJcbiAgICogb3JpZW50YXRpb25zLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSB0cnVlIGlmIHNldCwgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAgICovXHJcbiAgZ2V0IHJldmVyc2VTb2x1dGlvbigpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyIS5yZXZlcnNlU29sdXRpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXaGVuIHRoaXMgcHJvcGVydHkgaXMgc2V0IHRvIHRydWUsIHBvbHlnb25zIHJldHVybmVkIGluIHRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgb2YgdGhlIGV4ZWN1dGUoKSBtZXRob2Qgd2lsbCBoYXZlIG9yaWVudGF0aW9ucyBvcHBvc2l0ZSB0byB0aGVpciBub3JtYWxcclxuICAgKiBvcmllbnRhdGlvbnMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdmFsdWUgLSB2YWx1ZSB0byBzZXRcclxuICAgKi9cclxuICBzZXQgcmV2ZXJzZVNvbHV0aW9uKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9jbGlwcGVyIS5yZXZlcnNlU29sdXRpb24gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRlcm1pbm9sb2d5OlxyXG4gICAqIC0gQSBzaW1wbGUgcG9seWdvbiBpcyBvbmUgdGhhdCBkb2VzIG5vdCBzZWxmLWludGVyc2VjdC5cclxuICAgKiAtIEEgd2Vha2x5IHNpbXBsZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gdGhhdCBjb250YWlucyAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxyXG4gICAqIC0gQSBzdHJpY3RseSBzaW1wbGUgcG9seWdvbiBpcyBhIHNpbXBsZSBwb2x5Z29uIHRoYXQgZG9lcyBub3QgY29udGFpbiAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxyXG4gICAqXHJcbiAgICogVmVydGljZXMgJ3RvdWNoJyBpZiB0aGV5IHNoYXJlIHRoZSBzYW1lIGNvb3JkaW5hdGVzIChhbmQgYXJlIG5vdCBhZGphY2VudCkuIEFuIGVkZ2UgdG91Y2hlcyBhbm90aGVyIGlmIG9uZSBvZiBpdHMgZW5kIHZlcnRpY2VzIHRvdWNoZXMgYW5vdGhlciBlZGdlXHJcbiAgICogZXhjbHVkaW5nIGl0cyBhZGphY2VudCBlZGdlcywgb3IgaWYgdGhleSBhcmUgY28tbGluZWFyIGFuZCBvdmVybGFwcGluZyAoaW5jbHVkaW5nIGFkamFjZW50IGVkZ2VzKS5cclxuICAgKlxyXG4gICAqIFBvbHlnb25zIHJldHVybmVkIGJ5IGNsaXBwaW5nIG9wZXJhdGlvbnMgKHNlZSBDbGlwcGVyLmV4ZWN1dGUoKSkgc2hvdWxkIGFsd2F5cyBiZSBzaW1wbGUgcG9seWdvbnMuIFdoZW4gdGhlIFN0cmljdGx5U2ltcGx5IHByb3BlcnR5IGlzIGVuYWJsZWQsXHJcbiAgICogcG9seWdvbnMgcmV0dXJuZWQgd2lsbCBiZSBzdHJpY3RseSBzaW1wbGUsIG90aGVyd2lzZSB0aGV5IG1heSBiZSB3ZWFrbHkgc2ltcGxlLiBJdCdzIGNvbXB1dGF0aW9uYWxseSBleHBlbnNpdmUgZW5zdXJpbmcgcG9seWdvbnMgYXJlIHN0cmljdGx5IHNpbXBsZVxyXG4gICAqIGFuZCBzbyB0aGlzIHByb3BlcnR5IGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQuXHJcbiAgICpcclxuICAgKiBOb3RlOiBUaGVyZSdzIGN1cnJlbnRseSBubyBndWFyYW50ZWUgdGhhdCBwb2x5Z29ucyB3aWxsIGJlIHN0cmljdGx5IHNpbXBsZSBzaW5jZSAnc2ltcGxpZnlpbmcnIGlzIHN0aWxsIGEgd29yayBpbiBwcm9ncmVzcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBzZXQsIGZhbHNlIG90aGVyd2lzZVxyXG4gICAqL1xyXG4gIGdldCBzdHJpY3RseVNpbXBsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyIS5zdHJpY3RseVNpbXBsZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRlcm1pbm9sb2d5OlxyXG4gICAqIC0gQSBzaW1wbGUgcG9seWdvbiBpcyBvbmUgdGhhdCBkb2VzIG5vdCBzZWxmLWludGVyc2VjdC5cclxuICAgKiAtIEEgd2Vha2x5IHNpbXBsZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gdGhhdCBjb250YWlucyAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxyXG4gICAqIC0gQSBzdHJpY3RseSBzaW1wbGUgcG9seWdvbiBpcyBhIHNpbXBsZSBwb2x5Z29uIHRoYXQgZG9lcyBub3QgY29udGFpbiAndG91Y2hpbmcnIHZlcnRpY2VzLCBvciAndG91Y2hpbmcnIGVkZ2VzLlxyXG4gICAqXHJcbiAgICogVmVydGljZXMgJ3RvdWNoJyBpZiB0aGV5IHNoYXJlIHRoZSBzYW1lIGNvb3JkaW5hdGVzIChhbmQgYXJlIG5vdCBhZGphY2VudCkuIEFuIGVkZ2UgdG91Y2hlcyBhbm90aGVyIGlmIG9uZSBvZiBpdHMgZW5kIHZlcnRpY2VzIHRvdWNoZXMgYW5vdGhlciBlZGdlXHJcbiAgICogZXhjbHVkaW5nIGl0cyBhZGphY2VudCBlZGdlcywgb3IgaWYgdGhleSBhcmUgY28tbGluZWFyIGFuZCBvdmVybGFwcGluZyAoaW5jbHVkaW5nIGFkamFjZW50IGVkZ2VzKS5cclxuICAgKlxyXG4gICAqIFBvbHlnb25zIHJldHVybmVkIGJ5IGNsaXBwaW5nIG9wZXJhdGlvbnMgKHNlZSBDbGlwcGVyLmV4ZWN1dGUoKSkgc2hvdWxkIGFsd2F5cyBiZSBzaW1wbGUgcG9seWdvbnMuIFdoZW4gdGhlIFN0cmljdGx5U2ltcGx5IHByb3BlcnR5IGlzIGVuYWJsZWQsXHJcbiAgICogcG9seWdvbnMgcmV0dXJuZWQgd2lsbCBiZSBzdHJpY3RseSBzaW1wbGUsIG90aGVyd2lzZSB0aGV5IG1heSBiZSB3ZWFrbHkgc2ltcGxlLiBJdCdzIGNvbXB1dGF0aW9uYWxseSBleHBlbnNpdmUgZW5zdXJpbmcgcG9seWdvbnMgYXJlIHN0cmljdGx5IHNpbXBsZVxyXG4gICAqIGFuZCBzbyB0aGlzIHByb3BlcnR5IGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQuXHJcbiAgICpcclxuICAgKiBOb3RlOiBUaGVyZSdzIGN1cnJlbnRseSBubyBndWFyYW50ZWUgdGhhdCBwb2x5Z29ucyB3aWxsIGJlIHN0cmljdGx5IHNpbXBsZSBzaW5jZSAnc2ltcGxpZnlpbmcnIGlzIHN0aWxsIGEgd29yayBpbiBwcm9ncmVzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSAtIHZhbHVlIHRvIHNldFxyXG4gICAqL1xyXG4gIHNldCBzdHJpY3RseVNpbXBsZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgdGhpcy5fY2xpcHBlciEuc3RyaWN0bHlTaW1wbGUgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBDbGlwcGVyIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIENsaXBwZXIgY2xhc3MuIE9uZSBvciBtb3JlIEluaXRPcHRpb25zIG1heSBiZSBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgdG8gc2V0IHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnRpZXMuXHJcbiAgICogKFRoZXNlIHByb3BlcnRpZXMgY2FuIHN0aWxsIGJlIHNldCBvciByZXNldCBhZnRlciBjb25zdHJ1Y3Rpb24uKVxyXG4gICAqXHJcbiAgICogQHBhcmFtIF9uYXRpdmVMaWJcclxuICAgKiBAcGFyYW0gaW5pdE9wdGlvbnNcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxyXG4gICAgaW5pdE9wdGlvbnM6IENsaXBwZXJJbml0T3B0aW9ucyA9IHt9XHJcbiAgKSB7XHJcbiAgICBjb25zdCByZWFsSW5pdE9wdGlvbnMgPSB7XHJcbiAgICAgIHJldmVyc2VTb2x1dGlvbnM6IGZhbHNlLFxyXG4gICAgICBzdHJpY3RseVNpbXBsZTogZmFsc2UsXHJcbiAgICAgIHByZXNlcnZlQ29sbGluZWFyOiBmYWxzZSxcclxuICAgICAgLi4uaW5pdE9wdGlvbnNcclxuICAgIH07XHJcblxyXG4gICAgbGV0IG5hdGl2ZUluaXRPcHRpb25zID0gMDtcclxuICAgIGlmIChyZWFsSW5pdE9wdGlvbnMucmV2ZXJzZVNvbHV0aW9ucykge1xyXG4gICAgICBuYXRpdmVJbml0T3B0aW9ucyArPSBfbmF0aXZlTGliLkluaXRPcHRpb25zLlJldmVyc2VTb2x1dGlvbiBhcyBudW1iZXI7XHJcbiAgICB9XHJcbiAgICBpZiAocmVhbEluaXRPcHRpb25zLnN0cmljdGx5U2ltcGxlKSB7XHJcbiAgICAgIG5hdGl2ZUluaXRPcHRpb25zICs9IF9uYXRpdmVMaWIuSW5pdE9wdGlvbnMuU3RyaWN0bHlTaW1wbGUgYXMgbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlYWxJbml0T3B0aW9ucy5wcmVzZXJ2ZUNvbGxpbmVhcikge1xyXG4gICAgICBuYXRpdmVJbml0T3B0aW9ucyArPSBfbmF0aXZlTGliLkluaXRPcHRpb25zLlByZXNlcnZlQ29sbGluZWFyIGFzIG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9jbGlwcGVyID0gbmV3IF9uYXRpdmVMaWIuQ2xpcHBlcihuYXRpdmVJbml0T3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbnkgbnVtYmVyIG9mIHN1YmplY3QgYW5kIGNsaXAgcGF0aHMgY2FuIGJlIGFkZGVkIHRvIGEgY2xpcHBpbmcgdGFzaywgZWl0aGVyIGluZGl2aWR1YWxseSB2aWEgdGhlIGFkZFBhdGgoKSBtZXRob2QsIG9yIGFzIGdyb3VwcyB2aWEgdGhlIGFkZFBhdGhzKClcclxuICAgKiBtZXRob2QsIG9yIGV2ZW4gdXNpbmcgYm90aCBtZXRob2RzLlxyXG4gICAqXHJcbiAgICogJ1N1YmplY3QnIHBhdGhzIG1heSBiZSBlaXRoZXIgb3BlbiAobGluZXMpIG9yIGNsb3NlZCAocG9seWdvbnMpIG9yIGV2ZW4gYSBtaXh0dXJlIG9mIGJvdGgsIGJ1dCAnY2xpcHBpbmcnIHBhdGhzIG11c3QgYWx3YXlzIGJlIGNsb3NlZC4gQ2xpcHBlciBhbGxvd3NcclxuICAgKiBwb2x5Z29ucyB0byBjbGlwIGJvdGggbGluZXMgYW5kIG90aGVyIHBvbHlnb25zLCBidXQgZG9lc24ndCBhbGxvdyBsaW5lcyB0byBjbGlwIGVpdGhlciBsaW5lcyBvciBwb2x5Z29ucy5cclxuICAgKlxyXG4gICAqIFdpdGggY2xvc2VkIHBhdGhzLCBvcmllbnRhdGlvbiBzaG91bGQgY29uZm9ybSB3aXRoIHRoZSBmaWxsaW5nIHJ1bGUgdGhhdCB3aWxsIGJlIHBhc3NlZCB2aWEgQ2xpcHBlcidzIGV4ZWN1dGUgbWV0aG9kLlxyXG4gICAqXHJcbiAgICogUGF0aCBDb29yZGluYXRlIHJhbmdlOlxyXG4gICAqIFBhdGggY29vcmRpbmF0ZXMgbXVzdCBiZSBiZXR3ZWVuIMKxIDkwMDcxOTkyNTQ3NDA5OTEsIG90aGVyd2lzZSBhIHJhbmdlIGVycm9yIHdpbGwgYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byBhZGQgdGhlIHBhdGggdG8gdGhlIENsaXBwZXIgb2JqZWN0LlxyXG4gICAqIElmIGNvb3JkaW5hdGVzIGNhbiBiZSBrZXB0IGJldHdlZW4gwrEgMHgzRkZGRkZGRiAowrEgMS4wZSs5KSwgYSBtb2Rlc3QgaW5jcmVhc2UgaW4gcGVyZm9ybWFuY2UgKGFwcHJveC4gMTUtMjAlKSBvdmVyIHRoZSBsYXJnZXIgcmFuZ2UgY2FuIGJlIGFjaGlldmVkIGJ5XHJcbiAgICogYXZvaWRpbmcgbGFyZ2UgaW50ZWdlciBtYXRoLlxyXG4gICAqXHJcbiAgICogUmV0dXJuIFZhbHVlOlxyXG4gICAqIFRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiBmYWxzZSBpZiB0aGUgcGF0aCBpcyBpbnZhbGlkIGZvciBjbGlwcGluZy4gQSBwYXRoIGlzIGludmFsaWQgZm9yIGNsaXBwaW5nIHdoZW46XHJcbiAgICogLSBpdCBoYXMgbGVzcyB0aGFuIDIgdmVydGljZXNcclxuICAgKiAtIGl0IGhhcyAyIHZlcnRpY2VzIGJ1dCBpcyBub3QgYW4gb3BlbiBwYXRoXHJcbiAgICogLSB0aGUgdmVydGljZXMgYXJlIGFsbCBjby1saW5lYXIgYW5kIGl0IGlzIG5vdCBhbiBvcGVuIHBhdGhcclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXRoIC0gUGF0aCB0byBhZGRcclxuICAgKiBAcGFyYW0gcG9seVR5cGUgLSBQb2x5Z29uIHR5cGVcclxuICAgKiBAcGFyYW0gY2xvc2VkIC0gSWYgdGhlIHBhdGggaXMgY2xvc2VkXHJcbiAgICovXHJcbiAgYWRkUGF0aChwYXRoOiBSZWFkb25seVBhdGgsIHBvbHlUeXBlOiBQb2x5VHlwZSwgY2xvc2VkOiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBuYXRpdmVQYXRoID0gcGF0aFRvTmF0aXZlUGF0aCh0aGlzLl9uYXRpdmVMaWIsIHBhdGgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2NsaXBwZXIhLmFkZFBhdGgoXHJcbiAgICAgICAgbmF0aXZlUGF0aCxcclxuICAgICAgICBwb2x5VHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgcG9seVR5cGUpLFxyXG4gICAgICAgIGNsb3NlZFxyXG4gICAgICApO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgbmF0aXZlUGF0aC5kZWxldGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFueSBudW1iZXIgb2Ygc3ViamVjdCBhbmQgY2xpcCBwYXRocyBjYW4gYmUgYWRkZWQgdG8gYSBjbGlwcGluZyB0YXNrLCBlaXRoZXIgaW5kaXZpZHVhbGx5IHZpYSB0aGUgYWRkUGF0aCgpIG1ldGhvZCwgb3IgYXMgZ3JvdXBzIHZpYSB0aGUgYWRkUGF0aHMoKVxyXG4gICAqIG1ldGhvZCwgb3IgZXZlbiB1c2luZyBib3RoIG1ldGhvZHMuXHJcbiAgICpcclxuICAgKiAnU3ViamVjdCcgcGF0aHMgbWF5IGJlIGVpdGhlciBvcGVuIChsaW5lcykgb3IgY2xvc2VkIChwb2x5Z29ucykgb3IgZXZlbiBhIG1peHR1cmUgb2YgYm90aCwgYnV0ICdjbGlwcGluZycgcGF0aHMgbXVzdCBhbHdheXMgYmUgY2xvc2VkLiBDbGlwcGVyIGFsbG93c1xyXG4gICAqIHBvbHlnb25zIHRvIGNsaXAgYm90aCBsaW5lcyBhbmQgb3RoZXIgcG9seWdvbnMsIGJ1dCBkb2Vzbid0IGFsbG93IGxpbmVzIHRvIGNsaXAgZWl0aGVyIGxpbmVzIG9yIHBvbHlnb25zLlxyXG4gICAqXHJcbiAgICogV2l0aCBjbG9zZWQgcGF0aHMsIG9yaWVudGF0aW9uIHNob3VsZCBjb25mb3JtIHdpdGggdGhlIGZpbGxpbmcgcnVsZSB0aGF0IHdpbGwgYmUgcGFzc2VkIHZpYSBDbGlwcGVyJ3MgZXhlY3V0ZSBtZXRob2QuXHJcbiAgICpcclxuICAgKiBQYXRoIENvb3JkaW5hdGUgcmFuZ2U6XHJcbiAgICogUGF0aCBjb29yZGluYXRlcyBtdXN0IGJlIGJldHdlZW4gwrEgOTAwNzE5OTI1NDc0MDk5MSwgb3RoZXJ3aXNlIGEgcmFuZ2UgZXJyb3Igd2lsbCBiZSB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIGFkZCB0aGUgcGF0aCB0byB0aGUgQ2xpcHBlciBvYmplY3QuXHJcbiAgICogSWYgY29vcmRpbmF0ZXMgY2FuIGJlIGtlcHQgYmV0d2VlbiDCsSAweDNGRkZGRkZGICjCsSAxLjBlKzkpLCBhIG1vZGVzdCBpbmNyZWFzZSBpbiBwZXJmb3JtYW5jZSAoYXBwcm94LiAxNS0yMCUpIG92ZXIgdGhlIGxhcmdlciByYW5nZSBjYW4gYmUgYWNoaWV2ZWRcclxuICAgKiBieSBhdm9pZGluZyBsYXJnZSBpbnRlZ2VyIG1hdGguXHJcbiAgICpcclxuICAgKiBSZXR1cm4gVmFsdWU6XHJcbiAgICogVGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIGZhbHNlIGlmIHRoZSBwYXRoIGlzIGludmFsaWQgZm9yIGNsaXBwaW5nLiBBIHBhdGggaXMgaW52YWxpZCBmb3IgY2xpcHBpbmcgd2hlbjpcclxuICAgKiAtIGl0IGhhcyBsZXNzIHRoYW4gMiB2ZXJ0aWNlc1xyXG4gICAqIC0gaXQgaGFzIDIgdmVydGljZXMgYnV0IGlzIG5vdCBhbiBvcGVuIHBhdGhcclxuICAgKiAtIHRoZSB2ZXJ0aWNlcyBhcmUgYWxsIGNvLWxpbmVhciBhbmQgaXQgaXMgbm90IGFuIG9wZW4gcGF0aFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGhzIC0gUGF0aHMgdG8gYWRkXHJcbiAgICogQHBhcmFtIHBvbHlUeXBlIC0gUGF0aHMgcG9seWdvbiB0eXBlXHJcbiAgICogQHBhcmFtIGNsb3NlZCAtIElmIGFsbCB0aGUgaW5uZXIgcGF0aHMgYXJlIGNsb3NlZFxyXG4gICAqL1xyXG4gIGFkZFBhdGhzKHBhdGhzOiBSZWFkb25seVBhdGhzLCBwb2x5VHlwZTogUG9seVR5cGUsIGNsb3NlZDogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgbmF0aXZlUGF0aHMgPSBwYXRoc1RvTmF0aXZlUGF0aHModGhpcy5fbmF0aXZlTGliLCBwYXRocyk7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fY2xpcHBlciEuYWRkUGF0aHMoXHJcbiAgICAgICAgbmF0aXZlUGF0aHMsXHJcbiAgICAgICAgcG9seVR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIHBvbHlUeXBlKSxcclxuICAgICAgICBjbG9zZWRcclxuICAgICAgKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIG5hdGl2ZVBhdGhzLmRlbGV0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIENsZWFyIG1ldGhvZCByZW1vdmVzIGFueSBleGlzdGluZyBzdWJqZWN0IGFuZCBjbGlwIHBvbHlnb25zIGFsbG93aW5nIHRoZSBDbGlwcGVyIG9iamVjdCB0byBiZSByZXVzZWQgZm9yIGNsaXBwaW5nIG9wZXJhdGlvbnMgb24gZGlmZmVyZW50IHBvbHlnb24gc2V0cy5cclxuICAgKi9cclxuICBjbGVhcigpOiB2b2lkIHtcclxuICAgIHRoaXMuX2NsaXBwZXIhLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBheGlzLWFsaWduZWQgYm91bmRpbmcgcmVjdGFuZ2xlIG9mIGFsbCBwb2x5Z29ucyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgQ2xpcHBlciBvYmplY3QuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHt7bGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCB0b3A6IG51bWJlciwgYm90dG9tOiBudW1iZXJ9fSAtIEJvdW5kc1xyXG4gICAqL1xyXG4gIGdldEJvdW5kcygpOiBJbnRSZWN0IHtcclxuICAgIGNvbnN0IG5hdGl2ZUJvdW5kcyA9IHRoaXMuX2NsaXBwZXIhLmdldEJvdW5kcygpO1xyXG4gICAgY29uc3QgcmVjdCA9IHtcclxuICAgICAgbGVmdDogbmF0aXZlQm91bmRzLmxlZnQsXHJcbiAgICAgIHJpZ2h0OiBuYXRpdmVCb3VuZHMucmlnaHQsXHJcbiAgICAgIHRvcDogbmF0aXZlQm91bmRzLnRvcCxcclxuICAgICAgYm90dG9tOiBuYXRpdmVCb3VuZHMuYm90dG9tXHJcbiAgICB9O1xyXG4gICAgbmF0aXZlQm91bmRzLmRlbGV0ZSgpO1xyXG4gICAgcmV0dXJuIHJlY3Q7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPbmNlIHN1YmplY3QgYW5kIGNsaXAgcGF0aHMgaGF2ZSBiZWVuIGFzc2lnbmVkICh2aWEgYWRkUGF0aCBhbmQvb3IgYWRkUGF0aHMpLCBleGVjdXRlIGNhbiB0aGVuIHBlcmZvcm0gdGhlIGNsaXBwaW5nIG9wZXJhdGlvbiAoaW50ZXJzZWN0aW9uLCB1bmlvbixcclxuICAgKiBkaWZmZXJlbmNlIG9yIFhPUikgc3BlY2lmaWVkIGJ5IHRoZSBjbGlwVHlwZSBwYXJhbWV0ZXIuXHJcbiAgICpcclxuICAgKiBUaGUgc29sdXRpb24gcGFyYW1ldGVyIGluIHRoaXMgY2FzZSBpcyBhIFBhdGhzIG9yIFBvbHlUcmVlIHN0cnVjdHVyZS4gVGhlIFBhdGhzIHN0cnVjdHVyZSBpcyBzaW1wbGVyIHRoYW4gdGhlIFBvbHlUcmVlIHN0cnVjdHVyZS4gQmVjYXVzZSBvZiB0aGlzIGl0IGlzXHJcbiAgICogcXVpY2tlciB0byBwb3B1bGF0ZSBhbmQgaGVuY2UgY2xpcHBpbmcgcGVyZm9ybWFuY2UgaXMgYSBsaXR0bGUgYmV0dGVyIChpdCdzIHJvdWdobHkgMTAlIGZhc3RlcikuIEhvd2V2ZXIsIHRoZSBQb2x5VHJlZSBkYXRhIHN0cnVjdHVyZSBwcm92aWRlcyBtb3JlXHJcbiAgICogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJldHVybmVkIHBhdGhzIHdoaWNoIG1heSBiZSBpbXBvcnRhbnQgdG8gdXNlcnMuIEZpcnN0bHksIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgcHJlc2VydmVzIG5lc3RlZCBwYXJlbnQtY2hpbGQgcG9seWdvbiByZWxhdGlvbnNoaXBzXHJcbiAgICogKGllIG91dGVyIHBvbHlnb25zIG93bmluZy9jb250YWluaW5nIGhvbGVzIGFuZCBob2xlcyBvd25pbmcvY29udGFpbmluZyBvdGhlciBvdXRlciBwb2x5Z29ucyBldGMpLiBBbHNvLCBvbmx5IHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgY2FuIGRpZmZlcmVudGlhdGVcclxuICAgKiBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlZCBwYXRocyBzaW5jZSBlYWNoIFBvbHlOb2RlIGhhcyBhbiBJc09wZW4gcHJvcGVydHkuIChUaGUgUGF0aCBzdHJ1Y3R1cmUgaGFzIG5vIG1lbWJlciBpbmRpY2F0aW5nIHdoZXRoZXIgaXQncyBvcGVuIG9yIGNsb3NlZC4pXHJcbiAgICogRm9yIHRoaXMgcmVhc29uLCB3aGVuIG9wZW4gcGF0aHMgYXJlIHBhc3NlZCB0byBhIENsaXBwZXIgb2JqZWN0LCB0aGUgdXNlciBtdXN0IHVzZSBhIFBvbHlUcmVlIG9iamVjdCBhcyB0aGUgc29sdXRpb24gcGFyYW1ldGVyLCBvdGhlcndpc2UgYW4gZXhjZXB0aW9uXHJcbiAgICogd2lsbCBiZSByYWlzZWQuXHJcbiAgICpcclxuICAgKiBXaGVuIGEgUG9seVRyZWUgb2JqZWN0IGlzIHVzZWQgaW4gYSBjbGlwcGluZyBvcGVyYXRpb24gb24gb3BlbiBwYXRocywgdHdvIGFuY2lsbGlhcnkgZnVuY3Rpb25zIGhhdmUgYmVlbiBwcm92aWRlZCB0byBxdWlja2x5IHNlcGFyYXRlIG91dCBvcGVuIGFuZFxyXG4gICAqIGNsb3NlZCBwYXRocyBmcm9tIHRoZSBzb2x1dGlvbiAtIE9wZW5QYXRoc0Zyb21Qb2x5VHJlZSBhbmQgQ2xvc2VkUGF0aHNGcm9tUG9seVRyZWUuIFBvbHlUcmVlVG9QYXRocyBpcyBhbHNvIGF2YWlsYWJsZSB0byBjb252ZXJ0IHBhdGggZGF0YSB0byBhIFBhdGhzXHJcbiAgICogc3RydWN0dXJlIChpcnJlc3BlY3RpdmUgb2Ygd2hldGhlciB0aGV5J3JlIG9wZW4gb3IgY2xvc2VkKS5cclxuICAgKlxyXG4gICAqIFRoZXJlIGFyZSBzZXZlcmFsIHRoaW5ncyB0byBub3RlIGFib3V0IHRoZSBzb2x1dGlvbiBwYXRocyByZXR1cm5lZDpcclxuICAgKiAtIHRoZXkgYXJlbid0IGluIGFueSBzcGVjaWZpYyBvcmRlclxyXG4gICAqIC0gdGhleSBzaG91bGQgbmV2ZXIgb3ZlcmxhcCBvciBiZSBzZWxmLWludGVyc2VjdGluZyAoYnV0IHNlZSBub3RlcyBvbiByb3VuZGluZylcclxuICAgKiAtIGhvbGVzIHdpbGwgYmUgb3JpZW50ZWQgb3Bwb3NpdGUgb3V0ZXIgcG9seWdvbnNcclxuICAgKiAtIHRoZSBzb2x1dGlvbiBmaWxsIHR5cGUgY2FuIGJlIGNvbnNpZGVyZWQgZWl0aGVyIEV2ZW5PZGQgb3IgTm9uWmVybyBzaW5jZSBpdCB3aWxsIGNvbXBseSB3aXRoIGVpdGhlciBmaWxsaW5nIHJ1bGVcclxuICAgKiAtIHBvbHlnb25zIG1heSByYXJlbHkgc2hhcmUgYSBjb21tb24gZWRnZSAodGhvdWdoIHRoaXMgaXMgbm93IHZlcnkgcmFyZSBhcyBvZiB2ZXJzaW9uIDYpXHJcbiAgICpcclxuICAgKiBUaGUgc3ViakZpbGxUeXBlIGFuZCBjbGlwRmlsbFR5cGUgcGFyYW1ldGVycyBkZWZpbmUgdGhlIHBvbHlnb24gZmlsbCBydWxlIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHBvbHlnb25zIChpZSBjbG9zZWQgcGF0aHMpIGluIHRoZSBzdWJqZWN0IGFuZCBjbGlwXHJcbiAgICogcGF0aHMgcmVzcGVjdGl2ZWx5LiAoSXQncyB1c3VhbCB0aG91Z2ggb2J2aW91c2x5IG5vdCBlc3NlbnRpYWwgdGhhdCBib3RoIHNldHMgb2YgcG9seWdvbnMgdXNlIHRoZSBzYW1lIGZpbGwgcnVsZS4pXHJcbiAgICpcclxuICAgKiBleGVjdXRlIGNhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgd2l0aG91dCByZWFzc2lnbmluZyBzdWJqZWN0IGFuZCBjbGlwIHBvbHlnb25zIChpZSB3aGVuIGRpZmZlcmVudCBjbGlwcGluZyBvcGVyYXRpb25zIGFyZSByZXF1aXJlZCBvbiB0aGVcclxuICAgKiBzYW1lIHBvbHlnb24gc2V0cykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY2xpcFR5cGUgLSBDbGlwIG9wZXJhdGlvbiB0eXBlXHJcbiAgICogQHBhcmFtIHN1YmpGaWxsVHlwZSAtIEZpbGwgdHlwZSBvZiB0aGUgc3ViamVjdCBwb2x5Z29uc1xyXG4gICAqIEBwYXJhbSBjbGlwRmlsbFR5cGUgLSBGaWxsIHR5cGUgb2YgdGhlIGNsaXAgcG9seWdvbnNcclxuICAgKiBAcGFyYW0gY2xlYW5EaXN0YW5jZSAtIENsZWFuIGRpc3RhbmNlIG92ZXIgdGhlIG91dHB1dCwgb3IgdW5kZWZpbmVkIGZvciBubyBjbGVhbmluZy5cclxuICAgKiBAcmV0dXJuIHtQYXRocyB8IHVuZGVmaW5lZH0gLSBUaGUgc29sdXRpb24gb3IgdW5kZWZpbmVkIGlmIHRoZXJlIHdhcyBhbiBlcnJvclxyXG4gICAqL1xyXG4gIGV4ZWN1dGVUb1BhdGhzKFxyXG4gICAgY2xpcFR5cGU6IENsaXBUeXBlLFxyXG4gICAgc3ViakZpbGxUeXBlOiBQb2x5RmlsbFR5cGUsXHJcbiAgICBjbGlwRmlsbFR5cGU6IFBvbHlGaWxsVHlwZSxcclxuICAgIGNsZWFuRGlzdGFuY2U6IG51bWJlciB8IHVuZGVmaW5lZFxyXG4gICk6IFBhdGhzIHwgdW5kZWZpbmVkIHtcclxuICAgIGNvbnN0IG91dE5hdGl2ZVBhdGhzID0gbmV3IHRoaXMuX25hdGl2ZUxpYi5QYXRocygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuX2NsaXBwZXIhLmV4ZWN1dGVQYXRoc1dpdGhGaWxsVHlwZXMoXHJcbiAgICAgICAgY2xpcFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIGNsaXBUeXBlKSxcclxuICAgICAgICBvdXROYXRpdmVQYXRocyxcclxuICAgICAgICBwb2x5RmlsbFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIHN1YmpGaWxsVHlwZSksXHJcbiAgICAgICAgcG9seUZpbGxUeXBlVG9OYXRpdmUodGhpcy5fbmF0aXZlTGliLCBjbGlwRmlsbFR5cGUpXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICghc3VjY2Vzcykge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGNsZWFuRGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhpcy5fbmF0aXZlTGliLmNsZWFuUG9seWdvbnMob3V0TmF0aXZlUGF0aHMsIGNsZWFuRGlzdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKHRoaXMuX25hdGl2ZUxpYiwgb3V0TmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBvdXROYXRpdmVQYXRoc1xyXG4gICAgICB9XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBpZiAoIW91dE5hdGl2ZVBhdGhzLmlzRGVsZXRlZCgpKSB7XHJcbiAgICAgICAgb3V0TmF0aXZlUGF0aHMuZGVsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE9uY2Ugc3ViamVjdCBhbmQgY2xpcCBwYXRocyBoYXZlIGJlZW4gYXNzaWduZWQgKHZpYSBhZGRQYXRoIGFuZC9vciBhZGRQYXRocyksIGV4ZWN1dGUgY2FuIHRoZW4gcGVyZm9ybSB0aGUgY2xpcHBpbmcgb3BlcmF0aW9uIChpbnRlcnNlY3Rpb24sIHVuaW9uLFxyXG4gICAqIGRpZmZlcmVuY2Ugb3IgWE9SKSBzcGVjaWZpZWQgYnkgdGhlIGNsaXBUeXBlIHBhcmFtZXRlci5cclxuICAgKlxyXG4gICAqIFRoZSBzb2x1dGlvbiBwYXJhbWV0ZXIgY2FuIGJlIGVpdGhlciBhIFBhdGhzIG9yIFBvbHlUcmVlIHN0cnVjdHVyZS4gVGhlIFBhdGhzIHN0cnVjdHVyZSBpcyBzaW1wbGVyIHRoYW4gdGhlIFBvbHlUcmVlIHN0cnVjdHVyZS4gQmVjYXVzZSBvZiB0aGlzIGl0IGlzXHJcbiAgICogcXVpY2tlciB0byBwb3B1bGF0ZSBhbmQgaGVuY2UgY2xpcHBpbmcgcGVyZm9ybWFuY2UgaXMgYSBsaXR0bGUgYmV0dGVyIChpdCdzIHJvdWdobHkgMTAlIGZhc3RlcikuIEhvd2V2ZXIsIHRoZSBQb2x5VHJlZSBkYXRhIHN0cnVjdHVyZSBwcm92aWRlcyBtb3JlXHJcbiAgICogaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJldHVybmVkIHBhdGhzIHdoaWNoIG1heSBiZSBpbXBvcnRhbnQgdG8gdXNlcnMuIEZpcnN0bHksIHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgcHJlc2VydmVzIG5lc3RlZCBwYXJlbnQtY2hpbGQgcG9seWdvbiByZWxhdGlvbnNoaXBzXHJcbiAgICogKGllIG91dGVyIHBvbHlnb25zIG93bmluZy9jb250YWluaW5nIGhvbGVzIGFuZCBob2xlcyBvd25pbmcvY29udGFpbmluZyBvdGhlciBvdXRlciBwb2x5Z29ucyBldGMpLiBBbHNvLCBvbmx5IHRoZSBQb2x5VHJlZSBzdHJ1Y3R1cmUgY2FuIGRpZmZlcmVudGlhdGVcclxuICAgKiBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlZCBwYXRocyBzaW5jZSBlYWNoIFBvbHlOb2RlIGhhcyBhbiBJc09wZW4gcHJvcGVydHkuIChUaGUgUGF0aCBzdHJ1Y3R1cmUgaGFzIG5vIG1lbWJlciBpbmRpY2F0aW5nIHdoZXRoZXIgaXQncyBvcGVuIG9yIGNsb3NlZC4pXHJcbiAgICogRm9yIHRoaXMgcmVhc29uLCB3aGVuIG9wZW4gcGF0aHMgYXJlIHBhc3NlZCB0byBhIENsaXBwZXIgb2JqZWN0LCB0aGUgdXNlciBtdXN0IHVzZSBhIFBvbHlUcmVlIG9iamVjdCBhcyB0aGUgc29sdXRpb24gcGFyYW1ldGVyLCBvdGhlcndpc2UgYW4gZXhjZXB0aW9uXHJcbiAgICogd2lsbCBiZSByYWlzZWQuXHJcbiAgICpcclxuICAgKiBXaGVuIGEgUG9seVRyZWUgb2JqZWN0IGlzIHVzZWQgaW4gYSBjbGlwcGluZyBvcGVyYXRpb24gb24gb3BlbiBwYXRocywgdHdvIGFuY2lsbGlhcnkgZnVuY3Rpb25zIGhhdmUgYmVlbiBwcm92aWRlZCB0byBxdWlja2x5IHNlcGFyYXRlIG91dCBvcGVuIGFuZFxyXG4gICAqIGNsb3NlZCBwYXRocyBmcm9tIHRoZSBzb2x1dGlvbiAtIE9wZW5QYXRoc0Zyb21Qb2x5VHJlZSBhbmQgQ2xvc2VkUGF0aHNGcm9tUG9seVRyZWUuIFBvbHlUcmVlVG9QYXRocyBpcyBhbHNvIGF2YWlsYWJsZSB0byBjb252ZXJ0IHBhdGggZGF0YSB0byBhIFBhdGhzXHJcbiAgICogc3RydWN0dXJlIChpcnJlc3BlY3RpdmUgb2Ygd2hldGhlciB0aGV5J3JlIG9wZW4gb3IgY2xvc2VkKS5cclxuICAgKlxyXG4gICAqIFRoZXJlIGFyZSBzZXZlcmFsIHRoaW5ncyB0byBub3RlIGFib3V0IHRoZSBzb2x1dGlvbiBwYXRocyByZXR1cm5lZDpcclxuICAgKiAtIHRoZXkgYXJlbid0IGluIGFueSBzcGVjaWZpYyBvcmRlclxyXG4gICAqIC0gdGhleSBzaG91bGQgbmV2ZXIgb3ZlcmxhcCBvciBiZSBzZWxmLWludGVyc2VjdGluZyAoYnV0IHNlZSBub3RlcyBvbiByb3VuZGluZylcclxuICAgKiAtIGhvbGVzIHdpbGwgYmUgb3JpZW50ZWQgb3Bwb3NpdGUgb3V0ZXIgcG9seWdvbnNcclxuICAgKiAtIHRoZSBzb2x1dGlvbiBmaWxsIHR5cGUgY2FuIGJlIGNvbnNpZGVyZWQgZWl0aGVyIEV2ZW5PZGQgb3IgTm9uWmVybyBzaW5jZSBpdCB3aWxsIGNvbXBseSB3aXRoIGVpdGhlciBmaWxsaW5nIHJ1bGVcclxuICAgKiAtIHBvbHlnb25zIG1heSByYXJlbHkgc2hhcmUgYSBjb21tb24gZWRnZSAodGhvdWdoIHRoaXMgaXMgbm93IHZlcnkgcmFyZSBhcyBvZiB2ZXJzaW9uIDYpXHJcbiAgICpcclxuICAgKiBUaGUgc3ViakZpbGxUeXBlIGFuZCBjbGlwRmlsbFR5cGUgcGFyYW1ldGVycyBkZWZpbmUgdGhlIHBvbHlnb24gZmlsbCBydWxlIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHBvbHlnb25zIChpZSBjbG9zZWQgcGF0aHMpIGluIHRoZSBzdWJqZWN0IGFuZCBjbGlwXHJcbiAgICogcGF0aHMgcmVzcGVjdGl2ZWx5LiAoSXQncyB1c3VhbCB0aG91Z2ggb2J2aW91c2x5IG5vdCBlc3NlbnRpYWwgdGhhdCBib3RoIHNldHMgb2YgcG9seWdvbnMgdXNlIHRoZSBzYW1lIGZpbGwgcnVsZS4pXHJcbiAgICpcclxuICAgKiBleGVjdXRlIGNhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgd2l0aG91dCByZWFzc2lnbmluZyBzdWJqZWN0IGFuZCBjbGlwIHBvbHlnb25zIChpZSB3aGVuIGRpZmZlcmVudCBjbGlwcGluZyBvcGVyYXRpb25zIGFyZSByZXF1aXJlZCBvbiB0aGVcclxuICAgKiBzYW1lIHBvbHlnb24gc2V0cykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY2xpcFR5cGUgLSBDbGlwIG9wZXJhdGlvbiB0eXBlXHJcbiAgICogQHBhcmFtIHN1YmpGaWxsVHlwZSAtIEZpbGwgdHlwZSBvZiB0aGUgc3ViamVjdCBwb2x5Z29uc1xyXG4gICAqIEBwYXJhbSBjbGlwRmlsbFR5cGUgLSBGaWxsIHR5cGUgb2YgdGhlIGNsaXAgcG9seWdvbnNcclxuICAgKiBAcmV0dXJuIHtQb2x5VHJlZSB8IHVuZGVmaW5lZH0gLSBUaGUgc29sdXRpb24gb3IgdW5kZWZpbmVkIGlmIHRoZXJlIHdhcyBhbiBlcnJvclxyXG4gICAqL1xyXG4gIGV4ZWN1dGVUb1BvbHlUZWUoXHJcbiAgICBjbGlwVHlwZTogQ2xpcFR5cGUsXHJcbiAgICBzdWJqRmlsbFR5cGU6IFBvbHlGaWxsVHlwZSxcclxuICAgIGNsaXBGaWxsVHlwZTogUG9seUZpbGxUeXBlXHJcbiAgKTogUG9seVRyZWUgfCB1bmRlZmluZWQge1xyXG4gICAgY29uc3Qgb3V0TmF0aXZlUG9seVRyZWUgPSBuZXcgdGhpcy5fbmF0aXZlTGliLlBvbHlUcmVlKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBzdWNjZXNzID0gdGhpcy5fY2xpcHBlciEuZXhlY3V0ZVBvbHlUcmVlV2l0aEZpbGxUeXBlcyhcclxuICAgICAgICBjbGlwVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgY2xpcFR5cGUpLFxyXG4gICAgICAgIG91dE5hdGl2ZVBvbHlUcmVlLFxyXG4gICAgICAgIHBvbHlGaWxsVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgc3ViakZpbGxUeXBlKSxcclxuICAgICAgICBwb2x5RmlsbFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIGNsaXBGaWxsVHlwZSlcclxuICAgICAgKTtcclxuICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gUG9seVRyZWUuZnJvbU5hdGl2ZVBvbHlUcmVlKHRoaXMuX25hdGl2ZUxpYiwgb3V0TmF0aXZlUG9seVRyZWUsIHRydWUpOyAvLyBmcmVlcyBvdXROYXRpdmVQb2x5VHJlZVxyXG4gICAgICB9XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBpZiAoIW91dE5hdGl2ZVBvbHlUcmVlLmlzRGVsZXRlZCgpKSB7XHJcbiAgICAgICAgb3V0TmF0aXZlUG9seVRyZWUuZGVsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyBpZiB0aGUgb2JqZWN0IGhhcyBiZWVuIGRpc3Bvc2VkLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gLSB0cnVlIGlmIGRpc3Bvc2VkLCBmYWxzZSBpZiBub3RcclxuICAgKi9cclxuICBpc0Rpc3Bvc2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NsaXBwZXIgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9jbGlwcGVyLmlzRGVsZXRlZCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2luY2UgdGhpcyBsaWJyYXJ5IHVzZXMgV0FTTS9BU00uSlMgaW50ZXJuYWxseSBmb3Igc3BlZWQgdGhpcyBtZWFucyB0aGF0IHlvdSBtdXN0IGRpc3Bvc2Ugb2JqZWN0cyBhZnRlciB5b3UgYXJlIGRvbmUgdXNpbmcgdGhlbSBvciBtZW0gbGVha3Mgd2lsbCBvY2N1ci5cclxuICAgKi9cclxuICBkaXNwb3NlKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX2NsaXBwZXIpIHtcclxuICAgICAgdGhpcy5fY2xpcHBlci5kZWxldGUoKTtcclxuICAgICAgdGhpcy5fY2xpcHBlciA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19