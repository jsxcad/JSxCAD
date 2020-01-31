"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nativeEnumConversion_1 = require("./native/nativeEnumConversion");
var PathsToNativePaths_1 = require("./native/PathsToNativePaths");
var PathToNativePath_1 = require("./native/PathToNativePath");
var PolyTree_1 = require("./PolyTree");
/**
 * The ClipperOffset class encapsulates the process of offsetting (inflating/deflating) both open and closed paths using a number of different join types
 * and end types.
 *
 * Preconditions for offsetting:
 * 1. The orientations of closed paths must be consistent such that outer polygons share the same orientation, and any holes have the opposite orientation
 * (ie non-zero filling). Open paths must be oriented with closed outer polygons.
 * 2. Polygons must not self-intersect.
 *
 * Limitations:
 * When offsetting, small artefacts may appear where polygons overlap. To avoid these artefacts, offset overlapping polygons separately.
 */
var ClipperOffset = /** @class */ (function () {
    /**
     * The ClipperOffset constructor takes 2 optional parameters: MiterLimit and ArcTolerance. The two parameters corresponds to properties of the same name.
     * MiterLimit is only relevant when JoinType is Miter, and ArcTolerance is only relevant when JoinType is Round or when EndType is OpenRound.
     *
     * @param _nativeLib - Native clipper lib instance to use
     * @param miterLimit - Miter limit
     * @param arcTolerance - ArcTolerance (round precision)
     */
    function ClipperOffset(_nativeLib, miterLimit, arcTolerance) {
        if (miterLimit === void 0) { miterLimit = 2; }
        if (arcTolerance === void 0) { arcTolerance = 0.25; }
        this._nativeLib = _nativeLib;
        this._clipperOffset = new _nativeLib.ClipperOffset(miterLimit, arcTolerance);
    }
    Object.defineProperty(ClipperOffset.prototype, "arcTolerance", {
        /**
         * Firstly, this field/property is only relevant when JoinType = Round and/or EndType = Round.
         *
         * Since flattened paths can never perfectly represent arcs, this field/property specifies a maximum acceptable imprecision ('tolerance') when arcs are
         * approximated in an offsetting operation. Smaller values will increase 'smoothness' up to a point though at a cost of performance and in creating more
         * vertices to construct the arc.
         *
         * The default ArcTolerance is 0.25 units. This means that the maximum distance the flattened path will deviate from the 'true' arc will be no more
         * than 0.25 units (before rounding).
         *
         * Reducing tolerances below 0.25 will not improve smoothness since vertex coordinates will still be rounded to integer values. The only way to achieve
         * sub-integer precision is through coordinate scaling before and after offsetting (see example below).
         *
         * It's important to make ArcTolerance a sensible fraction of the offset delta (arc radius). Large tolerances relative to the offset delta will produce
         * poor arc approximations but, just as importantly, very small tolerances will substantially slow offsetting performance while providing unnecessary
         * degrees of precision. This is most likely to be an issue when offsetting polygons whose coordinates have been scaled to preserve floating point precision.
         *
         * Example: Imagine a set of polygons (defined in floating point coordinates) that is to be offset by 10 units using round joins, and the solution is to
         * retain floating point precision up to at least 6 decimal places.
         * To preserve this degree of floating point precision, and given that Clipper and ClipperOffset both operate on integer coordinates, the polygon
         * coordinates will be scaled up by 108 (and rounded to integers) prior to offsetting. Both offset delta and ArcTolerance will also need to be scaled
         * by this same factor. If ArcTolerance was left unscaled at the default 0.25 units, every arc in the solution would contain a fraction of 44 THOUSAND
         * vertices while the final arc imprecision would be 0.25 × 10-8 units (ie once scaling was reversed). However, if 0.1 units was an acceptable imprecision
         * in the final unscaled solution, then ArcTolerance should be set to 0.1 × scaling_factor (0.1 × 108 ). Now if scaling is applied equally to both
         * ArcTolerance and to Delta Offset, then in this example the number of vertices (steps) defining each arc would be a fraction of 23.
         *
         * The formula for the number of steps in a full circular arc is ... Pi / acos(1 - arc_tolerance / abs(delta))
         *
         * @return {number} - Current arc tolerance
         */
        get: function () {
            return this._clipperOffset.arcTolerance;
        },
        /**
         * Firstly, this field/property is only relevant when JoinType = Round and/or EndType = Round.
         *
         * Since flattened paths can never perfectly represent arcs, this field/property specifies a maximum acceptable imprecision ('tolerance') when arcs are
         * approximated in an offsetting operation. Smaller values will increase 'smoothness' up to a point though at a cost of performance and in creating more
         * vertices to construct the arc.
         *
         * The default ArcTolerance is 0.25 units. This means that the maximum distance the flattened path will deviate from the 'true' arc will be no more
         * than 0.25 units (before rounding).
         *
         * Reducing tolerances below 0.25 will not improve smoothness since vertex coordinates will still be rounded to integer values. The only way to achieve
         * sub-integer precision is through coordinate scaling before and after offsetting (see example below).
         *
         * It's important to make ArcTolerance a sensible fraction of the offset delta (arc radius). Large tolerances relative to the offset delta will produce
         * poor arc approximations but, just as importantly, very small tolerances will substantially slow offsetting performance while providing unnecessary
         * degrees of precision. This is most likely to be an issue when offsetting polygons whose coordinates have been scaled to preserve floating point precision.
         *
         * Example: Imagine a set of polygons (defined in floating point coordinates) that is to be offset by 10 units using round joins, and the solution is to
         * retain floating point precision up to at least 6 decimal places.
         * To preserve this degree of floating point precision, and given that Clipper and ClipperOffset both operate on integer coordinates, the polygon
         * coordinates will be scaled up by 108 (and rounded to integers) prior to offsetting. Both offset delta and ArcTolerance will also need to be scaled
         * by this same factor. If ArcTolerance was left unscaled at the default 0.25 units, every arc in the solution would contain a fraction of 44 THOUSAND
         * vertices while the final arc imprecision would be 0.25 × 10-8 units (ie once scaling was reversed). However, if 0.1 units was an acceptable imprecision
         * in the final unscaled solution, then ArcTolerance should be set to 0.1 × scaling_factor (0.1 × 108 ). Now if scaling is applied equally to both
         * ArcTolerance and to Delta Offset, then in this example the number of vertices (steps) defining each arc would be a fraction of 23.
         *
         * The formula for the number of steps in a full circular arc is ... Pi / acos(1 - arc_tolerance / abs(delta))
         *
         * @param value - Arc tolerance to set.
         */
        set: function (value) {
            this._clipperOffset.arcTolerance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipperOffset.prototype, "miterLimit", {
        /**
         * This property sets the maximum distance in multiples of delta that vertices can be offset from their original positions before squaring is applied.
         * (Squaring truncates a miter by 'cutting it off' at 1 × delta distance from the original vertex.)
         *
         * The default value for MiterLimit is 2 (ie twice delta). This is also the smallest MiterLimit that's allowed. If mitering was unrestricted (ie without
         * any squaring), then offsets at very acute angles would generate unacceptably long 'spikes'.
         *
         * @return {number} - Current miter limit
         */
        get: function () {
            return this._clipperOffset.miterLimit;
        },
        /**
         * Sets the current miter limit (see getter docs for more info).
         *
         * @param value - Mit limit to set.
         */
        set: function (value) {
            this._clipperOffset.miterLimit = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a Path to a ClipperOffset object in preparation for offsetting.
     *
     * Any number of paths can be added, and each has its own JoinType and EndType. All 'outer' Paths must have the same orientation, and any 'hole' paths must
     * have reverse orientation. Closed paths must have at least 3 vertices. Open paths may have as few as one vertex. Open paths can only be offset
     * with positive deltas.
     *
     * @param path - Path to add
     * @param joinType - Join type
     * @param endType - End type
     */
    ClipperOffset.prototype.addPath = function (path, joinType, endType) {
        var nativePath = PathToNativePath_1.pathToNativePath(this._nativeLib, path);
        try {
            this._clipperOffset.addPath(nativePath, nativeEnumConversion_1.joinTypeToNative(this._nativeLib, joinType), nativeEnumConversion_1.endTypeToNative(this._nativeLib, endType));
        }
        finally {
            nativePath.delete();
        }
    };
    /**
     * Adds Paths to a ClipperOffset object in preparation for offsetting.
     *
     * Any number of paths can be added, and each path has its own JoinType and EndType. All 'outer' Paths must have the same orientation, and any 'hole'
     * paths must have reverse orientation. Closed paths must have at least 3 vertices. Open paths may have as few as one vertex. Open paths can only be
     * offset with positive deltas.
     *
     * @param paths - Paths to add
     * @param joinType - Join type
     * @param endType - End type
     */
    ClipperOffset.prototype.addPaths = function (paths, joinType, endType) {
        var nativePaths = PathsToNativePaths_1.pathsToNativePaths(this._nativeLib, paths);
        try {
            this._clipperOffset.addPaths(nativePaths, nativeEnumConversion_1.joinTypeToNative(this._nativeLib, joinType), nativeEnumConversion_1.endTypeToNative(this._nativeLib, endType));
        }
        finally {
            nativePaths.delete();
        }
    };
    /**
     * Negative delta values shrink polygons and positive delta expand them.
     *
     * This method can be called multiple times, offsetting the same paths by different amounts (ie using different deltas).
     *
     * @param delta - Delta
     * @param cleanDistance - Clean distance over the output, or undefined for no cleaning.
     * @return {Paths} - Solution paths
     */
    ClipperOffset.prototype.executeToPaths = function (delta, cleanDistance) {
        var outNativePaths = new this._nativeLib.Paths();
        try {
            this._clipperOffset.executePaths(outNativePaths, delta);
            if (cleanDistance !== undefined) {
                this._nativeLib.cleanPolygons(outNativePaths, cleanDistance);
            }
            return PathsToNativePaths_1.nativePathsToPaths(this._nativeLib, outNativePaths, true); // frees outNativePaths
        }
        finally {
            if (!outNativePaths.isDeleted()) {
                outNativePaths.delete();
            }
        }
    };
    /**
     * This method takes two parameters. The first is the structure that receives the result of the offset operation (a PolyTree structure). The second parameter
     * is the amount to which the supplied paths will be offset. Negative delta values shrink polygons and positive delta expand them.
     *
     * This method can be called multiple times, offsetting the same paths by different amounts (ie using different deltas).
     *
     * @param delta - Delta
     * @return {Paths} - Solution paths
     */
    ClipperOffset.prototype.executeToPolyTree = function (delta) {
        var outNativePolyTree = new this._nativeLib.PolyTree();
        try {
            this._clipperOffset.executePolyTree(outNativePolyTree, delta);
            return PolyTree_1.PolyTree.fromNativePolyTree(this._nativeLib, outNativePolyTree, true); // frees outNativePolyTree
        }
        finally {
            if (!outNativePolyTree.isDeleted()) {
                outNativePolyTree.delete();
            }
        }
    };
    /**
     * This method clears all paths from the ClipperOffset object, allowing new paths to be assigned.
     */
    ClipperOffset.prototype.clear = function () {
        this._clipperOffset.clear();
    };
    /**
     * Checks if the object has been disposed.
     *
     * @return {boolean} - true if disposed, false if not
     */
    ClipperOffset.prototype.isDisposed = function () {
        return this._clipperOffset === undefined || this._clipperOffset.isDeleted();
    };
    /**
     * Since this library uses WASM/ASM.JS internally for speed this means that you must dispose objects after you are done using them or mem leaks will occur.
     */
    ClipperOffset.prototype.dispose = function () {
        if (this._clipperOffset) {
            this._clipperOffset.delete();
            this._clipperOffset = undefined;
        }
    };
    return ClipperOffset;
}());
exports.ClipperOffset = ClipperOffset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcHBlck9mZnNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9DbGlwcGVyT2Zmc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esc0VBQWtGO0FBQ2xGLGtFQUFxRjtBQUNyRiw4REFBNkQ7QUFHN0QsdUNBQXNDO0FBRXRDOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUE2RkU7Ozs7Ozs7T0FPRztJQUNILHVCQUNtQixVQUFvQyxFQUNyRCxVQUFjLEVBQ2QsWUFBbUI7UUFEbkIsMkJBQUEsRUFBQSxjQUFjO1FBQ2QsNkJBQUEsRUFBQSxtQkFBbUI7UUFGRixlQUFVLEdBQVYsVUFBVSxDQUEwQjtRQUlyRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQTFFRCxzQkFBSSx1Q0FBWTtRQTlCaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBNkJHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFlLENBQUMsWUFBWSxDQUFDO1FBQzNDLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0E2Qkc7YUFDSCxVQUFpQixLQUFhO1lBQzVCLElBQUksQ0FBQyxjQUFlLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUM1QyxDQUFDOzs7T0FsQ0E7SUE2Q0Qsc0JBQUkscUNBQVU7UUFUZDs7Ozs7Ozs7V0FRRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsY0FBZSxDQUFDLFVBQVUsQ0FBQztRQUN6QyxDQUFDO1FBRUQ7Ozs7V0FJRzthQUNILFVBQWUsS0FBYTtZQUMxQixJQUFJLENBQUMsY0FBZSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDMUMsQ0FBQzs7O09BVEE7SUEyQkQ7Ozs7Ozs7Ozs7T0FVRztJQUNILCtCQUFPLEdBQVAsVUFBUSxJQUFrQixFQUFFLFFBQWtCLEVBQUUsT0FBZ0I7UUFD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QUFTLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBbk9ELElBbU9DO0FBbk9ZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW5kVHlwZSwgSm9pblR5cGUgfSBmcm9tIFwiLi9lbnVtc1wiO1xyXG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XHJcbmltcG9ydCB7IE5hdGl2ZUNsaXBwZXJPZmZzZXQgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlck9mZnNldFwiO1xyXG5pbXBvcnQgeyBlbmRUeXBlVG9OYXRpdmUsIGpvaW5UeXBlVG9OYXRpdmUgfSBmcm9tIFwiLi9uYXRpdmUvbmF0aXZlRW51bUNvbnZlcnNpb25cIjtcclxuaW1wb3J0IHsgbmF0aXZlUGF0aHNUb1BhdGhzLCBwYXRoc1RvTmF0aXZlUGF0aHMgfSBmcm9tIFwiLi9uYXRpdmUvUGF0aHNUb05hdGl2ZVBhdGhzXCI7XHJcbmltcG9ydCB7IHBhdGhUb05hdGl2ZVBhdGggfSBmcm9tIFwiLi9uYXRpdmUvUGF0aFRvTmF0aXZlUGF0aFwiO1xyXG5pbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XHJcbmltcG9ydCB7IFBhdGhzLCBSZWFkb25seVBhdGhzIH0gZnJvbSBcIi4vUGF0aHNcIjtcclxuaW1wb3J0IHsgUG9seVRyZWUgfSBmcm9tIFwiLi9Qb2x5VHJlZVwiO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBDbGlwcGVyT2Zmc2V0IGNsYXNzIGVuY2Fwc3VsYXRlcyB0aGUgcHJvY2VzcyBvZiBvZmZzZXR0aW5nIChpbmZsYXRpbmcvZGVmbGF0aW5nKSBib3RoIG9wZW4gYW5kIGNsb3NlZCBwYXRocyB1c2luZyBhIG51bWJlciBvZiBkaWZmZXJlbnQgam9pbiB0eXBlc1xyXG4gKiBhbmQgZW5kIHR5cGVzLlxyXG4gKlxyXG4gKiBQcmVjb25kaXRpb25zIGZvciBvZmZzZXR0aW5nOlxyXG4gKiAxLiBUaGUgb3JpZW50YXRpb25zIG9mIGNsb3NlZCBwYXRocyBtdXN0IGJlIGNvbnNpc3RlbnQgc3VjaCB0aGF0IG91dGVyIHBvbHlnb25zIHNoYXJlIHRoZSBzYW1lIG9yaWVudGF0aW9uLCBhbmQgYW55IGhvbGVzIGhhdmUgdGhlIG9wcG9zaXRlIG9yaWVudGF0aW9uXHJcbiAqIChpZSBub24temVybyBmaWxsaW5nKS4gT3BlbiBwYXRocyBtdXN0IGJlIG9yaWVudGVkIHdpdGggY2xvc2VkIG91dGVyIHBvbHlnb25zLlxyXG4gKiAyLiBQb2x5Z29ucyBtdXN0IG5vdCBzZWxmLWludGVyc2VjdC5cclxuICpcclxuICogTGltaXRhdGlvbnM6XHJcbiAqIFdoZW4gb2Zmc2V0dGluZywgc21hbGwgYXJ0ZWZhY3RzIG1heSBhcHBlYXIgd2hlcmUgcG9seWdvbnMgb3ZlcmxhcC4gVG8gYXZvaWQgdGhlc2UgYXJ0ZWZhY3RzLCBvZmZzZXQgb3ZlcmxhcHBpbmcgcG9seWdvbnMgc2VwYXJhdGVseS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDbGlwcGVyT2Zmc2V0IHtcclxuICBwcml2YXRlIF9jbGlwcGVyT2Zmc2V0PzogTmF0aXZlQ2xpcHBlck9mZnNldDtcclxuXHJcbiAgLyoqXHJcbiAgICogRmlyc3RseSwgdGhpcyBmaWVsZC9wcm9wZXJ0eSBpcyBvbmx5IHJlbGV2YW50IHdoZW4gSm9pblR5cGUgPSBSb3VuZCBhbmQvb3IgRW5kVHlwZSA9IFJvdW5kLlxyXG4gICAqXHJcbiAgICogU2luY2UgZmxhdHRlbmVkIHBhdGhzIGNhbiBuZXZlciBwZXJmZWN0bHkgcmVwcmVzZW50IGFyY3MsIHRoaXMgZmllbGQvcHJvcGVydHkgc3BlY2lmaWVzIGEgbWF4aW11bSBhY2NlcHRhYmxlIGltcHJlY2lzaW9uICgndG9sZXJhbmNlJykgd2hlbiBhcmNzIGFyZVxyXG4gICAqIGFwcHJveGltYXRlZCBpbiBhbiBvZmZzZXR0aW5nIG9wZXJhdGlvbi4gU21hbGxlciB2YWx1ZXMgd2lsbCBpbmNyZWFzZSAnc21vb3RobmVzcycgdXAgdG8gYSBwb2ludCB0aG91Z2ggYXQgYSBjb3N0IG9mIHBlcmZvcm1hbmNlIGFuZCBpbiBjcmVhdGluZyBtb3JlXHJcbiAgICogdmVydGljZXMgdG8gY29uc3RydWN0IHRoZSBhcmMuXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCBBcmNUb2xlcmFuY2UgaXMgMC4yNSB1bml0cy4gVGhpcyBtZWFucyB0aGF0IHRoZSBtYXhpbXVtIGRpc3RhbmNlIHRoZSBmbGF0dGVuZWQgcGF0aCB3aWxsIGRldmlhdGUgZnJvbSB0aGUgJ3RydWUnIGFyYyB3aWxsIGJlIG5vIG1vcmVcclxuICAgKiB0aGFuIDAuMjUgdW5pdHMgKGJlZm9yZSByb3VuZGluZykuXHJcbiAgICpcclxuICAgKiBSZWR1Y2luZyB0b2xlcmFuY2VzIGJlbG93IDAuMjUgd2lsbCBub3QgaW1wcm92ZSBzbW9vdGhuZXNzIHNpbmNlIHZlcnRleCBjb29yZGluYXRlcyB3aWxsIHN0aWxsIGJlIHJvdW5kZWQgdG8gaW50ZWdlciB2YWx1ZXMuIFRoZSBvbmx5IHdheSB0byBhY2hpZXZlXHJcbiAgICogc3ViLWludGVnZXIgcHJlY2lzaW9uIGlzIHRocm91Z2ggY29vcmRpbmF0ZSBzY2FsaW5nIGJlZm9yZSBhbmQgYWZ0ZXIgb2Zmc2V0dGluZyAoc2VlIGV4YW1wbGUgYmVsb3cpLlxyXG4gICAqXHJcbiAgICogSXQncyBpbXBvcnRhbnQgdG8gbWFrZSBBcmNUb2xlcmFuY2UgYSBzZW5zaWJsZSBmcmFjdGlvbiBvZiB0aGUgb2Zmc2V0IGRlbHRhIChhcmMgcmFkaXVzKS4gTGFyZ2UgdG9sZXJhbmNlcyByZWxhdGl2ZSB0byB0aGUgb2Zmc2V0IGRlbHRhIHdpbGwgcHJvZHVjZVxyXG4gICAqIHBvb3IgYXJjIGFwcHJveGltYXRpb25zIGJ1dCwganVzdCBhcyBpbXBvcnRhbnRseSwgdmVyeSBzbWFsbCB0b2xlcmFuY2VzIHdpbGwgc3Vic3RhbnRpYWxseSBzbG93IG9mZnNldHRpbmcgcGVyZm9ybWFuY2Ugd2hpbGUgcHJvdmlkaW5nIHVubmVjZXNzYXJ5XHJcbiAgICogZGVncmVlcyBvZiBwcmVjaXNpb24uIFRoaXMgaXMgbW9zdCBsaWtlbHkgdG8gYmUgYW4gaXNzdWUgd2hlbiBvZmZzZXR0aW5nIHBvbHlnb25zIHdob3NlIGNvb3JkaW5hdGVzIGhhdmUgYmVlbiBzY2FsZWQgdG8gcHJlc2VydmUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uLlxyXG4gICAqXHJcbiAgICogRXhhbXBsZTogSW1hZ2luZSBhIHNldCBvZiBwb2x5Z29ucyAoZGVmaW5lZCBpbiBmbG9hdGluZyBwb2ludCBjb29yZGluYXRlcykgdGhhdCBpcyB0byBiZSBvZmZzZXQgYnkgMTAgdW5pdHMgdXNpbmcgcm91bmQgam9pbnMsIGFuZCB0aGUgc29sdXRpb24gaXMgdG9cclxuICAgKiByZXRhaW4gZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIHVwIHRvIGF0IGxlYXN0IDYgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICogVG8gcHJlc2VydmUgdGhpcyBkZWdyZWUgb2YgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uLCBhbmQgZ2l2ZW4gdGhhdCBDbGlwcGVyIGFuZCBDbGlwcGVyT2Zmc2V0IGJvdGggb3BlcmF0ZSBvbiBpbnRlZ2VyIGNvb3JkaW5hdGVzLCB0aGUgcG9seWdvblxyXG4gICAqIGNvb3JkaW5hdGVzIHdpbGwgYmUgc2NhbGVkIHVwIGJ5IDEwOCAoYW5kIHJvdW5kZWQgdG8gaW50ZWdlcnMpIHByaW9yIHRvIG9mZnNldHRpbmcuIEJvdGggb2Zmc2V0IGRlbHRhIGFuZCBBcmNUb2xlcmFuY2Ugd2lsbCBhbHNvIG5lZWQgdG8gYmUgc2NhbGVkXHJcbiAgICogYnkgdGhpcyBzYW1lIGZhY3Rvci4gSWYgQXJjVG9sZXJhbmNlIHdhcyBsZWZ0IHVuc2NhbGVkIGF0IHRoZSBkZWZhdWx0IDAuMjUgdW5pdHMsIGV2ZXJ5IGFyYyBpbiB0aGUgc29sdXRpb24gd291bGQgY29udGFpbiBhIGZyYWN0aW9uIG9mIDQ0IFRIT1VTQU5EXHJcbiAgICogdmVydGljZXMgd2hpbGUgdGhlIGZpbmFsIGFyYyBpbXByZWNpc2lvbiB3b3VsZCBiZSAwLjI1IMOXIDEwLTggdW5pdHMgKGllIG9uY2Ugc2NhbGluZyB3YXMgcmV2ZXJzZWQpLiBIb3dldmVyLCBpZiAwLjEgdW5pdHMgd2FzIGFuIGFjY2VwdGFibGUgaW1wcmVjaXNpb25cclxuICAgKiBpbiB0aGUgZmluYWwgdW5zY2FsZWQgc29sdXRpb24sIHRoZW4gQXJjVG9sZXJhbmNlIHNob3VsZCBiZSBzZXQgdG8gMC4xIMOXIHNjYWxpbmdfZmFjdG9yICgwLjEgw5cgMTA4ICkuIE5vdyBpZiBzY2FsaW5nIGlzIGFwcGxpZWQgZXF1YWxseSB0byBib3RoXHJcbiAgICogQXJjVG9sZXJhbmNlIGFuZCB0byBEZWx0YSBPZmZzZXQsIHRoZW4gaW4gdGhpcyBleGFtcGxlIHRoZSBudW1iZXIgb2YgdmVydGljZXMgKHN0ZXBzKSBkZWZpbmluZyBlYWNoIGFyYyB3b3VsZCBiZSBhIGZyYWN0aW9uIG9mIDIzLlxyXG4gICAqXHJcbiAgICogVGhlIGZvcm11bGEgZm9yIHRoZSBudW1iZXIgb2Ygc3RlcHMgaW4gYSBmdWxsIGNpcmN1bGFyIGFyYyBpcyAuLi4gUGkgLyBhY29zKDEgLSBhcmNfdG9sZXJhbmNlIC8gYWJzKGRlbHRhKSlcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSBDdXJyZW50IGFyYyB0b2xlcmFuY2VcclxuICAgKi9cclxuICBnZXQgYXJjVG9sZXJhbmNlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fY2xpcHBlck9mZnNldCEuYXJjVG9sZXJhbmNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmlyc3RseSwgdGhpcyBmaWVsZC9wcm9wZXJ0eSBpcyBvbmx5IHJlbGV2YW50IHdoZW4gSm9pblR5cGUgPSBSb3VuZCBhbmQvb3IgRW5kVHlwZSA9IFJvdW5kLlxyXG4gICAqXHJcbiAgICogU2luY2UgZmxhdHRlbmVkIHBhdGhzIGNhbiBuZXZlciBwZXJmZWN0bHkgcmVwcmVzZW50IGFyY3MsIHRoaXMgZmllbGQvcHJvcGVydHkgc3BlY2lmaWVzIGEgbWF4aW11bSBhY2NlcHRhYmxlIGltcHJlY2lzaW9uICgndG9sZXJhbmNlJykgd2hlbiBhcmNzIGFyZVxyXG4gICAqIGFwcHJveGltYXRlZCBpbiBhbiBvZmZzZXR0aW5nIG9wZXJhdGlvbi4gU21hbGxlciB2YWx1ZXMgd2lsbCBpbmNyZWFzZSAnc21vb3RobmVzcycgdXAgdG8gYSBwb2ludCB0aG91Z2ggYXQgYSBjb3N0IG9mIHBlcmZvcm1hbmNlIGFuZCBpbiBjcmVhdGluZyBtb3JlXHJcbiAgICogdmVydGljZXMgdG8gY29uc3RydWN0IHRoZSBhcmMuXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCBBcmNUb2xlcmFuY2UgaXMgMC4yNSB1bml0cy4gVGhpcyBtZWFucyB0aGF0IHRoZSBtYXhpbXVtIGRpc3RhbmNlIHRoZSBmbGF0dGVuZWQgcGF0aCB3aWxsIGRldmlhdGUgZnJvbSB0aGUgJ3RydWUnIGFyYyB3aWxsIGJlIG5vIG1vcmVcclxuICAgKiB0aGFuIDAuMjUgdW5pdHMgKGJlZm9yZSByb3VuZGluZykuXHJcbiAgICpcclxuICAgKiBSZWR1Y2luZyB0b2xlcmFuY2VzIGJlbG93IDAuMjUgd2lsbCBub3QgaW1wcm92ZSBzbW9vdGhuZXNzIHNpbmNlIHZlcnRleCBjb29yZGluYXRlcyB3aWxsIHN0aWxsIGJlIHJvdW5kZWQgdG8gaW50ZWdlciB2YWx1ZXMuIFRoZSBvbmx5IHdheSB0byBhY2hpZXZlXHJcbiAgICogc3ViLWludGVnZXIgcHJlY2lzaW9uIGlzIHRocm91Z2ggY29vcmRpbmF0ZSBzY2FsaW5nIGJlZm9yZSBhbmQgYWZ0ZXIgb2Zmc2V0dGluZyAoc2VlIGV4YW1wbGUgYmVsb3cpLlxyXG4gICAqXHJcbiAgICogSXQncyBpbXBvcnRhbnQgdG8gbWFrZSBBcmNUb2xlcmFuY2UgYSBzZW5zaWJsZSBmcmFjdGlvbiBvZiB0aGUgb2Zmc2V0IGRlbHRhIChhcmMgcmFkaXVzKS4gTGFyZ2UgdG9sZXJhbmNlcyByZWxhdGl2ZSB0byB0aGUgb2Zmc2V0IGRlbHRhIHdpbGwgcHJvZHVjZVxyXG4gICAqIHBvb3IgYXJjIGFwcHJveGltYXRpb25zIGJ1dCwganVzdCBhcyBpbXBvcnRhbnRseSwgdmVyeSBzbWFsbCB0b2xlcmFuY2VzIHdpbGwgc3Vic3RhbnRpYWxseSBzbG93IG9mZnNldHRpbmcgcGVyZm9ybWFuY2Ugd2hpbGUgcHJvdmlkaW5nIHVubmVjZXNzYXJ5XHJcbiAgICogZGVncmVlcyBvZiBwcmVjaXNpb24uIFRoaXMgaXMgbW9zdCBsaWtlbHkgdG8gYmUgYW4gaXNzdWUgd2hlbiBvZmZzZXR0aW5nIHBvbHlnb25zIHdob3NlIGNvb3JkaW5hdGVzIGhhdmUgYmVlbiBzY2FsZWQgdG8gcHJlc2VydmUgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uLlxyXG4gICAqXHJcbiAgICogRXhhbXBsZTogSW1hZ2luZSBhIHNldCBvZiBwb2x5Z29ucyAoZGVmaW5lZCBpbiBmbG9hdGluZyBwb2ludCBjb29yZGluYXRlcykgdGhhdCBpcyB0byBiZSBvZmZzZXQgYnkgMTAgdW5pdHMgdXNpbmcgcm91bmQgam9pbnMsIGFuZCB0aGUgc29sdXRpb24gaXMgdG9cclxuICAgKiByZXRhaW4gZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIHVwIHRvIGF0IGxlYXN0IDYgZGVjaW1hbCBwbGFjZXMuXHJcbiAgICogVG8gcHJlc2VydmUgdGhpcyBkZWdyZWUgb2YgZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uLCBhbmQgZ2l2ZW4gdGhhdCBDbGlwcGVyIGFuZCBDbGlwcGVyT2Zmc2V0IGJvdGggb3BlcmF0ZSBvbiBpbnRlZ2VyIGNvb3JkaW5hdGVzLCB0aGUgcG9seWdvblxyXG4gICAqIGNvb3JkaW5hdGVzIHdpbGwgYmUgc2NhbGVkIHVwIGJ5IDEwOCAoYW5kIHJvdW5kZWQgdG8gaW50ZWdlcnMpIHByaW9yIHRvIG9mZnNldHRpbmcuIEJvdGggb2Zmc2V0IGRlbHRhIGFuZCBBcmNUb2xlcmFuY2Ugd2lsbCBhbHNvIG5lZWQgdG8gYmUgc2NhbGVkXHJcbiAgICogYnkgdGhpcyBzYW1lIGZhY3Rvci4gSWYgQXJjVG9sZXJhbmNlIHdhcyBsZWZ0IHVuc2NhbGVkIGF0IHRoZSBkZWZhdWx0IDAuMjUgdW5pdHMsIGV2ZXJ5IGFyYyBpbiB0aGUgc29sdXRpb24gd291bGQgY29udGFpbiBhIGZyYWN0aW9uIG9mIDQ0IFRIT1VTQU5EXHJcbiAgICogdmVydGljZXMgd2hpbGUgdGhlIGZpbmFsIGFyYyBpbXByZWNpc2lvbiB3b3VsZCBiZSAwLjI1IMOXIDEwLTggdW5pdHMgKGllIG9uY2Ugc2NhbGluZyB3YXMgcmV2ZXJzZWQpLiBIb3dldmVyLCBpZiAwLjEgdW5pdHMgd2FzIGFuIGFjY2VwdGFibGUgaW1wcmVjaXNpb25cclxuICAgKiBpbiB0aGUgZmluYWwgdW5zY2FsZWQgc29sdXRpb24sIHRoZW4gQXJjVG9sZXJhbmNlIHNob3VsZCBiZSBzZXQgdG8gMC4xIMOXIHNjYWxpbmdfZmFjdG9yICgwLjEgw5cgMTA4ICkuIE5vdyBpZiBzY2FsaW5nIGlzIGFwcGxpZWQgZXF1YWxseSB0byBib3RoXHJcbiAgICogQXJjVG9sZXJhbmNlIGFuZCB0byBEZWx0YSBPZmZzZXQsIHRoZW4gaW4gdGhpcyBleGFtcGxlIHRoZSBudW1iZXIgb2YgdmVydGljZXMgKHN0ZXBzKSBkZWZpbmluZyBlYWNoIGFyYyB3b3VsZCBiZSBhIGZyYWN0aW9uIG9mIDIzLlxyXG4gICAqXHJcbiAgICogVGhlIGZvcm11bGEgZm9yIHRoZSBudW1iZXIgb2Ygc3RlcHMgaW4gYSBmdWxsIGNpcmN1bGFyIGFyYyBpcyAuLi4gUGkgLyBhY29zKDEgLSBhcmNfdG9sZXJhbmNlIC8gYWJzKGRlbHRhKSlcclxuICAgKlxyXG4gICAqIEBwYXJhbSB2YWx1ZSAtIEFyYyB0b2xlcmFuY2UgdG8gc2V0LlxyXG4gICAqL1xyXG4gIHNldCBhcmNUb2xlcmFuY2UodmFsdWU6IG51bWJlcikge1xyXG4gICAgdGhpcy5fY2xpcHBlck9mZnNldCEuYXJjVG9sZXJhbmNlID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIHByb3BlcnR5IHNldHMgdGhlIG1heGltdW0gZGlzdGFuY2UgaW4gbXVsdGlwbGVzIG9mIGRlbHRhIHRoYXQgdmVydGljZXMgY2FuIGJlIG9mZnNldCBmcm9tIHRoZWlyIG9yaWdpbmFsIHBvc2l0aW9ucyBiZWZvcmUgc3F1YXJpbmcgaXMgYXBwbGllZC5cclxuICAgKiAoU3F1YXJpbmcgdHJ1bmNhdGVzIGEgbWl0ZXIgYnkgJ2N1dHRpbmcgaXQgb2ZmJyBhdCAxIMOXIGRlbHRhIGRpc3RhbmNlIGZyb20gdGhlIG9yaWdpbmFsIHZlcnRleC4pXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgTWl0ZXJMaW1pdCBpcyAyIChpZSB0d2ljZSBkZWx0YSkuIFRoaXMgaXMgYWxzbyB0aGUgc21hbGxlc3QgTWl0ZXJMaW1pdCB0aGF0J3MgYWxsb3dlZC4gSWYgbWl0ZXJpbmcgd2FzIHVucmVzdHJpY3RlZCAoaWUgd2l0aG91dFxyXG4gICAqIGFueSBzcXVhcmluZyksIHRoZW4gb2Zmc2V0cyBhdCB2ZXJ5IGFjdXRlIGFuZ2xlcyB3b3VsZCBnZW5lcmF0ZSB1bmFjY2VwdGFibHkgbG9uZyAnc3Bpa2VzJy5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge251bWJlcn0gLSBDdXJyZW50IG1pdGVyIGxpbWl0XHJcbiAgICovXHJcbiAgZ2V0IG1pdGVyTGltaXQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyT2Zmc2V0IS5taXRlckxpbWl0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY3VycmVudCBtaXRlciBsaW1pdCAoc2VlIGdldHRlciBkb2NzIGZvciBtb3JlIGluZm8pLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHZhbHVlIC0gTWl0IGxpbWl0IHRvIHNldC5cclxuICAgKi9cclxuICBzZXQgbWl0ZXJMaW1pdCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLl9jbGlwcGVyT2Zmc2V0IS5taXRlckxpbWl0ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGUgQ2xpcHBlck9mZnNldCBjb25zdHJ1Y3RvciB0YWtlcyAyIG9wdGlvbmFsIHBhcmFtZXRlcnM6IE1pdGVyTGltaXQgYW5kIEFyY1RvbGVyYW5jZS4gVGhlIHR3byBwYXJhbWV0ZXJzIGNvcnJlc3BvbmRzIHRvIHByb3BlcnRpZXMgb2YgdGhlIHNhbWUgbmFtZS5cclxuICAgKiBNaXRlckxpbWl0IGlzIG9ubHkgcmVsZXZhbnQgd2hlbiBKb2luVHlwZSBpcyBNaXRlciwgYW5kIEFyY1RvbGVyYW5jZSBpcyBvbmx5IHJlbGV2YW50IHdoZW4gSm9pblR5cGUgaXMgUm91bmQgb3Igd2hlbiBFbmRUeXBlIGlzIE9wZW5Sb3VuZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBfbmF0aXZlTGliIC0gTmF0aXZlIGNsaXBwZXIgbGliIGluc3RhbmNlIHRvIHVzZVxyXG4gICAqIEBwYXJhbSBtaXRlckxpbWl0IC0gTWl0ZXIgbGltaXRcclxuICAgKiBAcGFyYW0gYXJjVG9sZXJhbmNlIC0gQXJjVG9sZXJhbmNlIChyb3VuZCBwcmVjaXNpb24pXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcclxuICAgIG1pdGVyTGltaXQgPSAyLFxyXG4gICAgYXJjVG9sZXJhbmNlID0gMC4yNVxyXG4gICkge1xyXG4gICAgdGhpcy5fY2xpcHBlck9mZnNldCA9IG5ldyBfbmF0aXZlTGliLkNsaXBwZXJPZmZzZXQobWl0ZXJMaW1pdCwgYXJjVG9sZXJhbmNlKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSBQYXRoIHRvIGEgQ2xpcHBlck9mZnNldCBvYmplY3QgaW4gcHJlcGFyYXRpb24gZm9yIG9mZnNldHRpbmcuXHJcbiAgICpcclxuICAgKiBBbnkgbnVtYmVyIG9mIHBhdGhzIGNhbiBiZSBhZGRlZCwgYW5kIGVhY2ggaGFzIGl0cyBvd24gSm9pblR5cGUgYW5kIEVuZFR5cGUuIEFsbCAnb3V0ZXInIFBhdGhzIG11c3QgaGF2ZSB0aGUgc2FtZSBvcmllbnRhdGlvbiwgYW5kIGFueSAnaG9sZScgcGF0aHMgbXVzdFxyXG4gICAqIGhhdmUgcmV2ZXJzZSBvcmllbnRhdGlvbi4gQ2xvc2VkIHBhdGhzIG11c3QgaGF2ZSBhdCBsZWFzdCAzIHZlcnRpY2VzLiBPcGVuIHBhdGhzIG1heSBoYXZlIGFzIGZldyBhcyBvbmUgdmVydGV4LiBPcGVuIHBhdGhzIGNhbiBvbmx5IGJlIG9mZnNldFxyXG4gICAqIHdpdGggcG9zaXRpdmUgZGVsdGFzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGggLSBQYXRoIHRvIGFkZFxyXG4gICAqIEBwYXJhbSBqb2luVHlwZSAtIEpvaW4gdHlwZVxyXG4gICAqIEBwYXJhbSBlbmRUeXBlIC0gRW5kIHR5cGVcclxuICAgKi9cclxuICBhZGRQYXRoKHBhdGg6IFJlYWRvbmx5UGF0aCwgam9pblR5cGU6IEpvaW5UeXBlLCBlbmRUeXBlOiBFbmRUeXBlKSB7XHJcbiAgICBjb25zdCBuYXRpdmVQYXRoID0gcGF0aFRvTmF0aXZlUGF0aCh0aGlzLl9uYXRpdmVMaWIsIHBhdGgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5fY2xpcHBlck9mZnNldCEuYWRkUGF0aChcclxuICAgICAgICBuYXRpdmVQYXRoLFxyXG4gICAgICAgIGpvaW5UeXBlVG9OYXRpdmUodGhpcy5fbmF0aXZlTGliLCBqb2luVHlwZSksXHJcbiAgICAgICAgZW5kVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgZW5kVHlwZSlcclxuICAgICAgKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIG5hdGl2ZVBhdGguZGVsZXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIFBhdGhzIHRvIGEgQ2xpcHBlck9mZnNldCBvYmplY3QgaW4gcHJlcGFyYXRpb24gZm9yIG9mZnNldHRpbmcuXHJcbiAgICpcclxuICAgKiBBbnkgbnVtYmVyIG9mIHBhdGhzIGNhbiBiZSBhZGRlZCwgYW5kIGVhY2ggcGF0aCBoYXMgaXRzIG93biBKb2luVHlwZSBhbmQgRW5kVHlwZS4gQWxsICdvdXRlcicgUGF0aHMgbXVzdCBoYXZlIHRoZSBzYW1lIG9yaWVudGF0aW9uLCBhbmQgYW55ICdob2xlJ1xyXG4gICAqIHBhdGhzIG11c3QgaGF2ZSByZXZlcnNlIG9yaWVudGF0aW9uLiBDbG9zZWQgcGF0aHMgbXVzdCBoYXZlIGF0IGxlYXN0IDMgdmVydGljZXMuIE9wZW4gcGF0aHMgbWF5IGhhdmUgYXMgZmV3IGFzIG9uZSB2ZXJ0ZXguIE9wZW4gcGF0aHMgY2FuIG9ubHkgYmVcclxuICAgKiBvZmZzZXQgd2l0aCBwb3NpdGl2ZSBkZWx0YXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGF0aHMgLSBQYXRocyB0byBhZGRcclxuICAgKiBAcGFyYW0gam9pblR5cGUgLSBKb2luIHR5cGVcclxuICAgKiBAcGFyYW0gZW5kVHlwZSAtIEVuZCB0eXBlXHJcbiAgICovXHJcbiAgYWRkUGF0aHMocGF0aHM6IFJlYWRvbmx5UGF0aHMsIGpvaW5UeXBlOiBKb2luVHlwZSwgZW5kVHlwZTogRW5kVHlwZSkge1xyXG4gICAgY29uc3QgbmF0aXZlUGF0aHMgPSBwYXRoc1RvTmF0aXZlUGF0aHModGhpcy5fbmF0aXZlTGliLCBwYXRocyk7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jbGlwcGVyT2Zmc2V0IS5hZGRQYXRocyhcclxuICAgICAgICBuYXRpdmVQYXRocyxcclxuICAgICAgICBqb2luVHlwZVRvTmF0aXZlKHRoaXMuX25hdGl2ZUxpYiwgam9pblR5cGUpLFxyXG4gICAgICAgIGVuZFR5cGVUb05hdGl2ZSh0aGlzLl9uYXRpdmVMaWIsIGVuZFR5cGUpXHJcbiAgICAgICk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBuYXRpdmVQYXRocy5kZWxldGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE5lZ2F0aXZlIGRlbHRhIHZhbHVlcyBzaHJpbmsgcG9seWdvbnMgYW5kIHBvc2l0aXZlIGRlbHRhIGV4cGFuZCB0aGVtLlxyXG4gICAqXHJcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcywgb2Zmc2V0dGluZyB0aGUgc2FtZSBwYXRocyBieSBkaWZmZXJlbnQgYW1vdW50cyAoaWUgdXNpbmcgZGlmZmVyZW50IGRlbHRhcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZGVsdGEgLSBEZWx0YVxyXG4gICAqIEBwYXJhbSBjbGVhbkRpc3RhbmNlIC0gQ2xlYW4gZGlzdGFuY2Ugb3ZlciB0aGUgb3V0cHV0LCBvciB1bmRlZmluZWQgZm9yIG5vIGNsZWFuaW5nLlxyXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFNvbHV0aW9uIHBhdGhzXHJcbiAgICovXHJcbiAgZXhlY3V0ZVRvUGF0aHMoZGVsdGE6IG51bWJlciwgY2xlYW5EaXN0YW5jZTogbnVtYmVyIHwgdW5kZWZpbmVkKTogUGF0aHMge1xyXG4gICAgY29uc3Qgb3V0TmF0aXZlUGF0aHMgPSBuZXcgdGhpcy5fbmF0aXZlTGliLlBhdGhzKCk7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9jbGlwcGVyT2Zmc2V0IS5leGVjdXRlUGF0aHMob3V0TmF0aXZlUGF0aHMsIGRlbHRhKTtcclxuICAgICAgaWYgKGNsZWFuRGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX25hdGl2ZUxpYi5jbGVhblBvbHlnb25zKG91dE5hdGl2ZVBhdGhzLCBjbGVhbkRpc3RhbmNlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKHRoaXMuX25hdGl2ZUxpYiwgb3V0TmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBvdXROYXRpdmVQYXRoc1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgaWYgKCFvdXROYXRpdmVQYXRocy5pc0RlbGV0ZWQoKSkge1xyXG4gICAgICAgIG91dE5hdGl2ZVBhdGhzLmRlbGV0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIG1ldGhvZCB0YWtlcyB0d28gcGFyYW1ldGVycy4gVGhlIGZpcnN0IGlzIHRoZSBzdHJ1Y3R1cmUgdGhhdCByZWNlaXZlcyB0aGUgcmVzdWx0IG9mIHRoZSBvZmZzZXQgb3BlcmF0aW9uIChhIFBvbHlUcmVlIHN0cnVjdHVyZSkuIFRoZSBzZWNvbmQgcGFyYW1ldGVyXHJcbiAgICogaXMgdGhlIGFtb3VudCB0byB3aGljaCB0aGUgc3VwcGxpZWQgcGF0aHMgd2lsbCBiZSBvZmZzZXQuIE5lZ2F0aXZlIGRlbHRhIHZhbHVlcyBzaHJpbmsgcG9seWdvbnMgYW5kIHBvc2l0aXZlIGRlbHRhIGV4cGFuZCB0aGVtLlxyXG4gICAqXHJcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcywgb2Zmc2V0dGluZyB0aGUgc2FtZSBwYXRocyBieSBkaWZmZXJlbnQgYW1vdW50cyAoaWUgdXNpbmcgZGlmZmVyZW50IGRlbHRhcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZGVsdGEgLSBEZWx0YVxyXG4gICAqIEByZXR1cm4ge1BhdGhzfSAtIFNvbHV0aW9uIHBhdGhzXHJcbiAgICovXHJcbiAgZXhlY3V0ZVRvUG9seVRyZWUoZGVsdGE6IG51bWJlcik6IFBvbHlUcmVlIHtcclxuICAgIGNvbnN0IG91dE5hdGl2ZVBvbHlUcmVlID0gbmV3IHRoaXMuX25hdGl2ZUxpYi5Qb2x5VHJlZSgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5fY2xpcHBlck9mZnNldCEuZXhlY3V0ZVBvbHlUcmVlKG91dE5hdGl2ZVBvbHlUcmVlLCBkZWx0YSk7XHJcbiAgICAgIHJldHVybiBQb2x5VHJlZS5mcm9tTmF0aXZlUG9seVRyZWUodGhpcy5fbmF0aXZlTGliLCBvdXROYXRpdmVQb2x5VHJlZSwgdHJ1ZSk7IC8vIGZyZWVzIG91dE5hdGl2ZVBvbHlUcmVlXHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBpZiAoIW91dE5hdGl2ZVBvbHlUcmVlLmlzRGVsZXRlZCgpKSB7XHJcbiAgICAgICAgb3V0TmF0aXZlUG9seVRyZWUuZGVsZXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgbWV0aG9kIGNsZWFycyBhbGwgcGF0aHMgZnJvbSB0aGUgQ2xpcHBlck9mZnNldCBvYmplY3QsIGFsbG93aW5nIG5ldyBwYXRocyB0byBiZSBhc3NpZ25lZC5cclxuICAgKi9cclxuICBjbGVhcigpOiB2b2lkIHtcclxuICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQhLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgaWYgdGhlIG9iamVjdCBoYXMgYmVlbiBkaXNwb3NlZC5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IC0gdHJ1ZSBpZiBkaXNwb3NlZCwgZmFsc2UgaWYgbm90XHJcbiAgICovXHJcbiAgaXNEaXNwb3NlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9jbGlwcGVyT2Zmc2V0ID09PSB1bmRlZmluZWQgfHwgdGhpcy5fY2xpcHBlck9mZnNldC5pc0RlbGV0ZWQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpbmNlIHRoaXMgbGlicmFyeSB1c2VzIFdBU00vQVNNLkpTIGludGVybmFsbHkgZm9yIHNwZWVkIHRoaXMgbWVhbnMgdGhhdCB5b3UgbXVzdCBkaXNwb3NlIG9iamVjdHMgYWZ0ZXIgeW91IGFyZSBkb25lIHVzaW5nIHRoZW0gb3IgbWVtIGxlYWtzIHdpbGwgb2NjdXIuXHJcbiAgICovXHJcbiAgZGlzcG9zZSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9jbGlwcGVyT2Zmc2V0KSB7XHJcbiAgICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQuZGVsZXRlKCk7XHJcbiAgICAgIHRoaXMuX2NsaXBwZXJPZmZzZXQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==