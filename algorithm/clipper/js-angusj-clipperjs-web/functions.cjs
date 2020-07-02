"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums.cjs");
var nativeEnumConversion_1 = require("./native/nativeEnumConversion.cjs");
var PathsToNativePaths_1 = require("./native/PathsToNativePaths.cjs");
var PathToNativePath_1 = require("./native/PathToNativePath.cjs");
function tryDelete() {
    var e_1, _a;
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    try {
        for (var objs_1 = __values(objs), objs_1_1 = objs_1.next(); !objs_1_1.done; objs_1_1 = objs_1.next()) {
            var obj = objs_1_1.value;
            if (!obj.isDeleted()) {
                obj.delete();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (objs_1_1 && !objs_1_1.done && (_a = objs_1.return)) _a.call(objs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function area(path) {
    // we use JS since copying structures is slower than actually doing it
    var cnt = path.length;
    if (cnt < 3) {
        return 0;
    }
    var a = 0;
    for (var i = 0, j = cnt - 1; i < cnt; ++i) {
        a += (path[j].x + path[i].x) * (path[j].y - path[i].y);
        j = i;
    }
    return -a * 0.5;
}
exports.area = area;
function cleanPolygon(nativeLib, path, distance) {
    if (distance === void 0) { distance = 1.1415; }
    var nativePath = PathToNativePath_1.pathToNativePath(nativeLib, path);
    try {
        nativeLib.cleanPolygon(nativePath, distance);
        return PathToNativePath_1.nativePathToPath(nativeLib, nativePath, true); // frees nativePath
    }
    finally {
        tryDelete(nativePath);
    }
}
exports.cleanPolygon = cleanPolygon;
function cleanPolygons(nativeLib, paths, distance) {
    if (distance === void 0) { distance = 1.1415; }
    var nativePaths = PathsToNativePaths_1.pathsToNativePaths(nativeLib, paths);
    try {
        nativeLib.cleanPolygons(nativePaths, distance);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, nativePaths, true); // frees nativePath
    }
    finally {
        tryDelete(nativePaths);
    }
}
exports.cleanPolygons = cleanPolygons;
function addPolyNodeToPaths(polynode, nt, paths) {
    var match = true;
    switch (nt) {
        case 1 /* Open */:
            return;
        case 2 /* Closed */:
            match = !polynode.isOpen;
            break;
        default:
            break;
    }
    if (polynode.contour.length > 0 && match) {
        paths.push(polynode.contour);
    }
    for (var ii = 0, max = polynode.childs.length; ii < max; ii++) {
        var pn = polynode.childs[ii];
        addPolyNodeToPaths(pn, nt, paths);
    }
}
function closedPathsFromPolyTree(polyTree) {
    // we do this in JS since copying path is more expensive than just doing it
    var result = [];
    // result.Capacity = polytree.Total;
    addPolyNodeToPaths(polyTree, 2 /* Closed */, result);
    return result;
}
exports.closedPathsFromPolyTree = closedPathsFromPolyTree;
function minkowskiDiff(nativeLib, poly1, poly2) {
    var nativePath1 = PathToNativePath_1.pathToNativePath(nativeLib, poly1);
    var nativePath2 = PathToNativePath_1.pathToNativePath(nativeLib, poly2);
    var outNativePaths = new nativeLib.Paths();
    try {
        nativeLib.minkowskiDiff(nativePath1, nativePath2, outNativePaths);
        tryDelete(nativePath1, nativePath2);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, outNativePaths, true); // frees outNativePaths
    }
    finally {
        tryDelete(nativePath1, nativePath2, outNativePaths);
    }
}
exports.minkowskiDiff = minkowskiDiff;
function minkowskiSumPath(nativeLib, pattern, path, pathIsClosed) {
    var patternNativePath = PathToNativePath_1.pathToNativePath(nativeLib, pattern);
    var nativePath = PathToNativePath_1.pathToNativePath(nativeLib, path);
    var outNativePaths = new nativeLib.Paths();
    try {
        nativeLib.minkowskiSumPath(patternNativePath, nativePath, outNativePaths, pathIsClosed);
        tryDelete(patternNativePath, nativePath);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, outNativePaths, true); // frees outNativePaths
    }
    finally {
        tryDelete(patternNativePath, nativePath, outNativePaths);
    }
}
exports.minkowskiSumPath = minkowskiSumPath;
function minkowskiSumPaths(nativeLib, pattern, paths, pathIsClosed) {
    // TODO: im not sure if for this method we can reuse the input/output path
    var patternNativePath = PathToNativePath_1.pathToNativePath(nativeLib, pattern);
    var nativePaths = PathsToNativePaths_1.pathsToNativePaths(nativeLib, paths);
    try {
        nativeLib.minkowskiSumPaths(patternNativePath, nativePaths, nativePaths, pathIsClosed);
        tryDelete(patternNativePath);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, nativePaths, true); // frees nativePaths
    }
    finally {
        tryDelete(patternNativePath, nativePaths);
    }
}
exports.minkowskiSumPaths = minkowskiSumPaths;
function openPathsFromPolyTree(polyTree) {
    // we do this in JS since copying path is more expensive than just doing it
    var result = [];
    var len = polyTree.childs.length;
    result.length = len;
    var resultLength = 0;
    for (var i = 0; i < len; i++) {
        if (polyTree.childs[i].isOpen) {
            result[resultLength++] = polyTree.childs[i].contour;
        }
    }
    result.length = resultLength;
    return result;
}
exports.openPathsFromPolyTree = openPathsFromPolyTree;
function orientation(path) {
    return area(path) >= 0;
}
exports.orientation = orientation;
function pointInPolygon(point, path) {
    // we do this in JS since copying path is more expensive than just doing it
    // returns 0 if false, +1 if true, -1 if pt ON polygon boundary
    // See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
    // http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
    var result = 0;
    var cnt = path.length;
    if (cnt < 3) {
        return 0;
    }
    var ip = path[0];
    for (var i = 1; i <= cnt; ++i) {
        var ipNext = i === cnt ? path[0] : path[i];
        if (ipNext.y === point.y) {
            if (ipNext.x === point.x || (ip.y === point.y && ipNext.x > point.x === ip.x < point.x)) {
                return -1;
            }
        }
        if (ip.y < point.y !== ipNext.y < point.y) {
            if (ip.x >= point.x) {
                if (ipNext.x > point.x) {
                    result = 1 - result;
                }
                else {
                    var d = (ip.x - point.x) * (ipNext.y - point.y) - (ipNext.x - point.x) * (ip.y - point.y);
                    if (d === 0) {
                        return -1;
                    }
                    else if (d > 0 === ipNext.y > ip.y) {
                        result = 1 - result;
                    }
                }
            }
            else {
                if (ipNext.x > point.x) {
                    var d = (ip.x - point.x) * (ipNext.y - point.y) - (ipNext.x - point.x) * (ip.y - point.y);
                    if (d === 0) {
                        return -1;
                    }
                    else if (d > 0 === ipNext.y > ip.y) {
                        result = 1 - result;
                    }
                }
            }
        }
        ip = ipNext;
    }
    return result;
}
exports.pointInPolygon = pointInPolygon;
function polyTreeToPaths(polyTree) {
    // we do this in JS since copying path is more expensive than just doing it
    var result = [];
    // result.Capacity = polytree.total;
    addPolyNodeToPaths(polyTree, 0 /* Any */, result);
    return result;
}
exports.polyTreeToPaths = polyTreeToPaths;
function reversePath(path) {
    // we use JS since copying structures is slower than actually doing it
    path.reverse();
}
exports.reversePath = reversePath;
function reversePaths(paths) {
    // we use JS since copying structures is slower than actually doing it
    for (var i = 0, max = paths.length; i < max; i++) {
        reversePath(paths[i]);
    }
}
exports.reversePaths = reversePaths;
function simplifyPolygon(nativeLib, path, fillType) {
    if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
    var nativePath = PathToNativePath_1.pathToNativePath(nativeLib, path);
    var outNativePaths = new nativeLib.Paths();
    try {
        nativeLib.simplifyPolygon(nativePath, outNativePaths, nativeEnumConversion_1.polyFillTypeToNative(nativeLib, fillType));
        tryDelete(nativePath);
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, outNativePaths, true); // frees outNativePaths
    }
    finally {
        tryDelete(nativePath, outNativePaths);
    }
}
exports.simplifyPolygon = simplifyPolygon;
function simplifyPolygons(nativeLib, paths, fillType) {
    if (fillType === void 0) { fillType = enums_1.PolyFillType.EvenOdd; }
    var nativePaths = PathsToNativePaths_1.pathsToNativePaths(nativeLib, paths);
    try {
        nativeLib.simplifyPolygonsOverwrite(nativePaths, nativeEnumConversion_1.polyFillTypeToNative(nativeLib, fillType));
        return PathsToNativePaths_1.nativePathsToPaths(nativeLib, nativePaths, true); // frees nativePaths
    }
    finally {
        tryDelete(nativePaths);
    }
}
exports.simplifyPolygons = simplifyPolygons;
function scalePath(path, scale) {
    var sol = [];
    var i = path.length;
    while (i--) {
        var p = path[i];
        sol.push({
            x: Math.round(p.x * scale),
            y: Math.round(p.y * scale)
        });
    }
    return sol;
}
exports.scalePath = scalePath;
/**
 * Scales all inner paths by multiplying all its coordinates by a number and then rounding them.
 *
 * @param paths - Paths to scale
 * @param scale - Scale multiplier
 * @return {Paths} - The scaled paths
 */
function scalePaths(paths, scale) {
    if (scale === 0) {
        return [];
    }
    var sol = [];
    var i = paths.length;
    while (i--) {
        var p = paths[i];
        sol.push(scalePath(p, scale));
    }
    return sol;
}
exports.scalePaths = scalePaths;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Z1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQTZEO0FBSTdELHNFQUFxRTtBQUNyRSxrRUFBcUY7QUFDckYsOERBQStFO0FBTS9FLFNBQVMsU0FBUzs7SUFBQyxjQUEwQjtTQUExQixVQUEwQixFQUExQixxQkFBMEIsRUFBMUIsSUFBMEI7UUFBMUIseUJBQTBCOzs7UUFDM0MsS0FBa0IsSUFBQSxTQUFBLFNBQUEsSUFBSSxDQUFBLDBCQUFBLDRDQUFFO1lBQW5CLElBQU0sR0FBRyxpQkFBQTtZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ3BCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNkO1NBQ0Y7Ozs7Ozs7OztBQUNILENBQUM7QUFFRCxTQUFnQixJQUFJLENBQUMsSUFBa0I7SUFDckMsc0VBQXNFO0lBQ3RFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1FBQ1gsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDekMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1A7SUFD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RSxLQUFhO0lBQzVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtRQUNmLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxJQUFNLEdBQUcsR0FBVSxFQUFFLENBQUM7SUFDdEIsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNyQixPQUFPLENBQUMsRUFBRSxFQUFFO1FBQ1YsSUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBWkQsZ0NBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb2ludEluUG9seWdvblJlc3VsdCwgUG9seUZpbGxUeXBlIH0gZnJvbSBcIi4vZW51bXNcIjtcclxuaW1wb3J0IHsgSW50UG9pbnQgfSBmcm9tIFwiLi9JbnRQb2ludFwiO1xyXG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XHJcbmltcG9ydCB7IE5hdGl2ZURlbGV0YWJsZSB9IGZyb20gXCIuL25hdGl2ZS9OYXRpdmVEZWxldGFibGVcIjtcclxuaW1wb3J0IHsgcG9seUZpbGxUeXBlVG9OYXRpdmUgfSBmcm9tIFwiLi9uYXRpdmUvbmF0aXZlRW51bUNvbnZlcnNpb25cIjtcclxuaW1wb3J0IHsgbmF0aXZlUGF0aHNUb1BhdGhzLCBwYXRoc1RvTmF0aXZlUGF0aHMgfSBmcm9tIFwiLi9uYXRpdmUvUGF0aHNUb05hdGl2ZVBhdGhzXCI7XHJcbmltcG9ydCB7IG5hdGl2ZVBhdGhUb1BhdGgsIHBhdGhUb05hdGl2ZVBhdGggfSBmcm9tIFwiLi9uYXRpdmUvUGF0aFRvTmF0aXZlUGF0aFwiO1xyXG5pbXBvcnQgeyBQYXRoLCBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XHJcbmltcG9ydCB7IFBhdGhzLCBSZWFkb25seVBhdGhzIH0gZnJvbSBcIi4vUGF0aHNcIjtcclxuaW1wb3J0IHsgUG9seU5vZGUgfSBmcm9tIFwiLi9Qb2x5Tm9kZVwiO1xyXG5pbXBvcnQgeyBQb2x5VHJlZSB9IGZyb20gXCIuL1BvbHlUcmVlXCI7XHJcblxyXG5mdW5jdGlvbiB0cnlEZWxldGUoLi4ub2JqczogTmF0aXZlRGVsZXRhYmxlW10pIHtcclxuICBmb3IgKGNvbnN0IG9iaiBvZiBvYmpzKSB7XHJcbiAgICBpZiAoIW9iai5pc0RlbGV0ZWQoKSkge1xyXG4gICAgICBvYmouZGVsZXRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXJlYShwYXRoOiBSZWFkb25seVBhdGgpOiBudW1iZXIge1xyXG4gIC8vIHdlIHVzZSBKUyBzaW5jZSBjb3B5aW5nIHN0cnVjdHVyZXMgaXMgc2xvd2VyIHRoYW4gYWN0dWFsbHkgZG9pbmcgaXRcclxuICBjb25zdCBjbnQgPSBwYXRoLmxlbmd0aDtcclxuICBpZiAoY250IDwgMykge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG4gIGxldCBhID0gMDtcclxuICBmb3IgKGxldCBpID0gMCwgaiA9IGNudCAtIDE7IGkgPCBjbnQ7ICsraSkge1xyXG4gICAgYSArPSAocGF0aFtqXS54ICsgcGF0aFtpXS54KSAqIChwYXRoW2pdLnkgLSBwYXRoW2ldLnkpO1xyXG4gICAgaiA9IGk7XHJcbiAgfVxyXG4gIHJldHVybiAtYSAqIDAuNTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuUG9seWdvbihcclxuICBuYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcclxuICBwYXRoOiBSZWFkb25seVBhdGgsXHJcbiAgZGlzdGFuY2UgPSAxLjE0MTVcclxuKTogUGF0aCB7XHJcbiAgY29uc3QgbmF0aXZlUGF0aCA9IHBhdGhUb05hdGl2ZVBhdGgobmF0aXZlTGliLCBwYXRoKTtcclxuICB0cnkge1xyXG4gICAgbmF0aXZlTGliLmNsZWFuUG9seWdvbihuYXRpdmVQYXRoLCBkaXN0YW5jZSk7XHJcbiAgICByZXR1cm4gbmF0aXZlUGF0aFRvUGF0aChuYXRpdmVMaWIsIG5hdGl2ZVBhdGgsIHRydWUpOyAvLyBmcmVlcyBuYXRpdmVQYXRoXHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIHRyeURlbGV0ZShuYXRpdmVQYXRoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhblBvbHlnb25zKFxyXG4gIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxyXG4gIHBhdGhzOiBSZWFkb25seVBhdGhzLFxyXG4gIGRpc3RhbmNlID0gMS4xNDE1XHJcbik6IFBhdGhzIHtcclxuICBjb25zdCBuYXRpdmVQYXRocyA9IHBhdGhzVG9OYXRpdmVQYXRocyhuYXRpdmVMaWIsIHBhdGhzKTtcclxuICB0cnkge1xyXG4gICAgbmF0aXZlTGliLmNsZWFuUG9seWdvbnMobmF0aXZlUGF0aHMsIGRpc3RhbmNlKTtcclxuICAgIHJldHVybiBuYXRpdmVQYXRoc1RvUGF0aHMobmF0aXZlTGliLCBuYXRpdmVQYXRocywgdHJ1ZSk7IC8vIGZyZWVzIG5hdGl2ZVBhdGhcclxuICB9IGZpbmFsbHkge1xyXG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGhzKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGVudW0gTm9kZVR5cGUge1xyXG4gIEFueSxcclxuICBPcGVuLFxyXG4gIENsb3NlZFxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRQb2x5Tm9kZVRvUGF0aHMocG9seW5vZGU6IFBvbHlOb2RlLCBudDogTm9kZVR5cGUsIHBhdGhzOiBSZWFkb25seVBhdGhbXSk6IHZvaWQge1xyXG4gIGxldCBtYXRjaCA9IHRydWU7XHJcbiAgc3dpdGNoIChudCkge1xyXG4gICAgY2FzZSBOb2RlVHlwZS5PcGVuOlxyXG4gICAgICByZXR1cm47XHJcbiAgICBjYXNlIE5vZGVUeXBlLkNsb3NlZDpcclxuICAgICAgbWF0Y2ggPSAhcG9seW5vZGUuaXNPcGVuO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgaWYgKHBvbHlub2RlLmNvbnRvdXIubGVuZ3RoID4gMCAmJiBtYXRjaCkge1xyXG4gICAgcGF0aHMucHVzaChwb2x5bm9kZS5jb250b3VyKTtcclxuICB9XHJcbiAgZm9yIChsZXQgaWkgPSAwLCBtYXggPSBwb2x5bm9kZS5jaGlsZHMubGVuZ3RoOyBpaSA8IG1heDsgaWkrKykge1xyXG4gICAgY29uc3QgcG4gPSBwb2x5bm9kZS5jaGlsZHNbaWldO1xyXG4gICAgYWRkUG9seU5vZGVUb1BhdGhzKHBuLCBudCwgcGF0aHMpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlZFBhdGhzRnJvbVBvbHlUcmVlKHBvbHlUcmVlOiBQb2x5VHJlZSk6IFBhdGhzIHtcclxuICAvLyB3ZSBkbyB0aGlzIGluIEpTIHNpbmNlIGNvcHlpbmcgcGF0aCBpcyBtb3JlIGV4cGVuc2l2ZSB0aGFuIGp1c3QgZG9pbmcgaXRcclxuXHJcbiAgY29uc3QgcmVzdWx0OiBQYXRocyA9IFtdO1xyXG4gIC8vIHJlc3VsdC5DYXBhY2l0eSA9IHBvbHl0cmVlLlRvdGFsO1xyXG4gIGFkZFBvbHlOb2RlVG9QYXRocyhwb2x5VHJlZSwgTm9kZVR5cGUuQ2xvc2VkLCByZXN1bHQpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaW5rb3dza2lEaWZmKFxyXG4gIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxyXG4gIHBvbHkxOiBSZWFkb25seVBhdGgsXHJcbiAgcG9seTI6IFJlYWRvbmx5UGF0aFxyXG4pOiBQYXRocyB7XHJcbiAgY29uc3QgbmF0aXZlUGF0aDEgPSBwYXRoVG9OYXRpdmVQYXRoKG5hdGl2ZUxpYiwgcG9seTEpO1xyXG4gIGNvbnN0IG5hdGl2ZVBhdGgyID0gcGF0aFRvTmF0aXZlUGF0aChuYXRpdmVMaWIsIHBvbHkyKTtcclxuICBjb25zdCBvdXROYXRpdmVQYXRocyA9IG5ldyBuYXRpdmVMaWIuUGF0aHMoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIG5hdGl2ZUxpYi5taW5rb3dza2lEaWZmKG5hdGl2ZVBhdGgxLCBuYXRpdmVQYXRoMiwgb3V0TmF0aXZlUGF0aHMpO1xyXG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGgxLCBuYXRpdmVQYXRoMik7XHJcbiAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKG5hdGl2ZUxpYiwgb3V0TmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBvdXROYXRpdmVQYXRoc1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICB0cnlEZWxldGUobmF0aXZlUGF0aDEsIG5hdGl2ZVBhdGgyLCBvdXROYXRpdmVQYXRocyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWlua293c2tpU3VtUGF0aChcclxuICBuYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcclxuICBwYXR0ZXJuOiBSZWFkb25seVBhdGgsXHJcbiAgcGF0aDogUmVhZG9ubHlQYXRoLFxyXG4gIHBhdGhJc0Nsb3NlZDogYm9vbGVhblxyXG4pOiBQYXRocyB7XHJcbiAgY29uc3QgcGF0dGVybk5hdGl2ZVBhdGggPSBwYXRoVG9OYXRpdmVQYXRoKG5hdGl2ZUxpYiwgcGF0dGVybik7XHJcbiAgY29uc3QgbmF0aXZlUGF0aCA9IHBhdGhUb05hdGl2ZVBhdGgobmF0aXZlTGliLCBwYXRoKTtcclxuICBjb25zdCBvdXROYXRpdmVQYXRocyA9IG5ldyBuYXRpdmVMaWIuUGF0aHMoKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIG5hdGl2ZUxpYi5taW5rb3dza2lTdW1QYXRoKHBhdHRlcm5OYXRpdmVQYXRoLCBuYXRpdmVQYXRoLCBvdXROYXRpdmVQYXRocywgcGF0aElzQ2xvc2VkKTtcclxuICAgIHRyeURlbGV0ZShwYXR0ZXJuTmF0aXZlUGF0aCwgbmF0aXZlUGF0aCk7XHJcbiAgICByZXR1cm4gbmF0aXZlUGF0aHNUb1BhdGhzKG5hdGl2ZUxpYiwgb3V0TmF0aXZlUGF0aHMsIHRydWUpOyAvLyBmcmVlcyBvdXROYXRpdmVQYXRoc1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICB0cnlEZWxldGUocGF0dGVybk5hdGl2ZVBhdGgsIG5hdGl2ZVBhdGgsIG91dE5hdGl2ZVBhdGhzKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaW5rb3dza2lTdW1QYXRocyhcclxuICBuYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcclxuICBwYXR0ZXJuOiBSZWFkb25seVBhdGgsXHJcbiAgcGF0aHM6IFJlYWRvbmx5UGF0aHMsXHJcbiAgcGF0aElzQ2xvc2VkOiBib29sZWFuXHJcbik6IFBhdGhzIHtcclxuICAvLyBUT0RPOiBpbSBub3Qgc3VyZSBpZiBmb3IgdGhpcyBtZXRob2Qgd2UgY2FuIHJldXNlIHRoZSBpbnB1dC9vdXRwdXQgcGF0aFxyXG5cclxuICBjb25zdCBwYXR0ZXJuTmF0aXZlUGF0aCA9IHBhdGhUb05hdGl2ZVBhdGgobmF0aXZlTGliLCBwYXR0ZXJuKTtcclxuICBjb25zdCBuYXRpdmVQYXRocyA9IHBhdGhzVG9OYXRpdmVQYXRocyhuYXRpdmVMaWIsIHBhdGhzKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIG5hdGl2ZUxpYi5taW5rb3dza2lTdW1QYXRocyhwYXR0ZXJuTmF0aXZlUGF0aCwgbmF0aXZlUGF0aHMsIG5hdGl2ZVBhdGhzLCBwYXRoSXNDbG9zZWQpO1xyXG4gICAgdHJ5RGVsZXRlKHBhdHRlcm5OYXRpdmVQYXRoKTtcclxuICAgIHJldHVybiBuYXRpdmVQYXRoc1RvUGF0aHMobmF0aXZlTGliLCBuYXRpdmVQYXRocywgdHJ1ZSk7IC8vIGZyZWVzIG5hdGl2ZVBhdGhzXHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIHRyeURlbGV0ZShwYXR0ZXJuTmF0aXZlUGF0aCwgbmF0aXZlUGF0aHMpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5QYXRoc0Zyb21Qb2x5VHJlZShwb2x5VHJlZTogUG9seVRyZWUpOiBSZWFkb25seVBhdGhbXSB7XHJcbiAgLy8gd2UgZG8gdGhpcyBpbiBKUyBzaW5jZSBjb3B5aW5nIHBhdGggaXMgbW9yZSBleHBlbnNpdmUgdGhhbiBqdXN0IGRvaW5nIGl0XHJcblxyXG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gIGNvbnN0IGxlbiA9IHBvbHlUcmVlLmNoaWxkcy5sZW5ndGg7XHJcbiAgcmVzdWx0Lmxlbmd0aCA9IGxlbjtcclxuICBsZXQgcmVzdWx0TGVuZ3RoID0gMDtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICBpZiAocG9seVRyZWUuY2hpbGRzW2ldLmlzT3Blbikge1xyXG4gICAgICByZXN1bHRbcmVzdWx0TGVuZ3RoKytdID0gcG9seVRyZWUuY2hpbGRzW2ldLmNvbnRvdXI7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlc3VsdC5sZW5ndGggPSByZXN1bHRMZW5ndGg7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9yaWVudGF0aW9uKHBhdGg6IFJlYWRvbmx5UGF0aCk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBhcmVhKHBhdGgpID49IDA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwb2ludEluUG9seWdvbihcclxuICBwb2ludDogUmVhZG9ubHk8SW50UG9pbnQ+LFxyXG4gIHBhdGg6IFJlYWRvbmx5UGF0aFxyXG4pOiBQb2ludEluUG9seWdvblJlc3VsdCB7XHJcbiAgLy8gd2UgZG8gdGhpcyBpbiBKUyBzaW5jZSBjb3B5aW5nIHBhdGggaXMgbW9yZSBleHBlbnNpdmUgdGhhbiBqdXN0IGRvaW5nIGl0XHJcblxyXG4gIC8vIHJldHVybnMgMCBpZiBmYWxzZSwgKzEgaWYgdHJ1ZSwgLTEgaWYgcHQgT04gcG9seWdvbiBib3VuZGFyeVxyXG4gIC8vIFNlZSBcIlRoZSBQb2ludCBpbiBQb2x5Z29uIFByb2JsZW0gZm9yIEFyYml0cmFyeSBQb2x5Z29uc1wiIGJ5IEhvcm1hbm4gJiBBZ2F0aG9zXHJcbiAgLy8gaHR0cDovL2NpdGVzZWVyeC5pc3QucHN1LmVkdS92aWV3ZG9jL2Rvd25sb2FkP2RvaT0xMC4xLjEuODguNTQ5OCZyZXA9cmVwMSZ0eXBlPXBkZlxyXG4gIGxldCByZXN1bHQgPSAwO1xyXG4gIGNvbnN0IGNudCA9IHBhdGgubGVuZ3RoO1xyXG4gIGlmIChjbnQgPCAzKSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgbGV0IGlwID0gcGF0aFswXTtcclxuICBmb3IgKGxldCBpID0gMTsgaSA8PSBjbnQ7ICsraSkge1xyXG4gICAgY29uc3QgaXBOZXh0ID0gaSA9PT0gY250ID8gcGF0aFswXSA6IHBhdGhbaV07XHJcbiAgICBpZiAoaXBOZXh0LnkgPT09IHBvaW50LnkpIHtcclxuICAgICAgaWYgKGlwTmV4dC54ID09PSBwb2ludC54IHx8IChpcC55ID09PSBwb2ludC55ICYmIGlwTmV4dC54ID4gcG9pbnQueCA9PT0gaXAueCA8IHBvaW50LngpKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXAueSA8IHBvaW50LnkgIT09IGlwTmV4dC55IDwgcG9pbnQueSkge1xyXG4gICAgICBpZiAoaXAueCA+PSBwb2ludC54KSB7XHJcbiAgICAgICAgaWYgKGlwTmV4dC54ID4gcG9pbnQueCkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gMSAtIHJlc3VsdDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZCA9XHJcbiAgICAgICAgICAgIChpcC54IC0gcG9pbnQueCkgKiAoaXBOZXh0LnkgLSBwb2ludC55KSAtIChpcE5leHQueCAtIHBvaW50LngpICogKGlwLnkgLSBwb2ludC55KTtcclxuICAgICAgICAgIGlmIChkID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZCA+IDAgPT09IGlwTmV4dC55ID4gaXAueSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAxIC0gcmVzdWx0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXBOZXh0LnggPiBwb2ludC54KSB7XHJcbiAgICAgICAgICBjb25zdCBkID1cclxuICAgICAgICAgICAgKGlwLnggLSBwb2ludC54KSAqIChpcE5leHQueSAtIHBvaW50LnkpIC0gKGlwTmV4dC54IC0gcG9pbnQueCkgKiAoaXAueSAtIHBvaW50LnkpO1xyXG4gICAgICAgICAgaWYgKGQgPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChkID4gMCA9PT0gaXBOZXh0LnkgPiBpcC55KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IDEgLSByZXN1bHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpcCA9IGlwTmV4dDtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlUcmVlVG9QYXRocyhwb2x5VHJlZTogUG9seVRyZWUpOiBQYXRocyB7XHJcbiAgLy8gd2UgZG8gdGhpcyBpbiBKUyBzaW5jZSBjb3B5aW5nIHBhdGggaXMgbW9yZSBleHBlbnNpdmUgdGhhbiBqdXN0IGRvaW5nIGl0XHJcblxyXG4gIGNvbnN0IHJlc3VsdDogUGF0aHMgPSBbXTtcclxuICAvLyByZXN1bHQuQ2FwYWNpdHkgPSBwb2x5dHJlZS50b3RhbDtcclxuICBhZGRQb2x5Tm9kZVRvUGF0aHMocG9seVRyZWUsIE5vZGVUeXBlLkFueSwgcmVzdWx0KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV2ZXJzZVBhdGgocGF0aDogUGF0aCk6IHZvaWQge1xyXG4gIC8vIHdlIHVzZSBKUyBzaW5jZSBjb3B5aW5nIHN0cnVjdHVyZXMgaXMgc2xvd2VyIHRoYW4gYWN0dWFsbHkgZG9pbmcgaXRcclxuICBwYXRoLnJldmVyc2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2VQYXRocyhwYXRoczogUGF0aHMpOiB2b2lkIHtcclxuICAvLyB3ZSB1c2UgSlMgc2luY2UgY29weWluZyBzdHJ1Y3R1cmVzIGlzIHNsb3dlciB0aGFuIGFjdHVhbGx5IGRvaW5nIGl0XHJcbiAgZm9yIChsZXQgaSA9IDAsIG1heCA9IHBhdGhzLmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XHJcbiAgICByZXZlcnNlUGF0aChwYXRoc1tpXSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnlQb2x5Z29uKFxyXG4gIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxyXG4gIHBhdGg6IFJlYWRvbmx5UGF0aCxcclxuICBmaWxsVHlwZTogUG9seUZpbGxUeXBlID0gUG9seUZpbGxUeXBlLkV2ZW5PZGRcclxuKTogUGF0aHMge1xyXG4gIGNvbnN0IG5hdGl2ZVBhdGggPSBwYXRoVG9OYXRpdmVQYXRoKG5hdGl2ZUxpYiwgcGF0aCk7XHJcbiAgY29uc3Qgb3V0TmF0aXZlUGF0aHMgPSBuZXcgbmF0aXZlTGliLlBhdGhzKCk7XHJcbiAgdHJ5IHtcclxuICAgIG5hdGl2ZUxpYi5zaW1wbGlmeVBvbHlnb24oXHJcbiAgICAgIG5hdGl2ZVBhdGgsXHJcbiAgICAgIG91dE5hdGl2ZVBhdGhzLFxyXG4gICAgICBwb2x5RmlsbFR5cGVUb05hdGl2ZShuYXRpdmVMaWIsIGZpbGxUeXBlKVxyXG4gICAgKTtcclxuICAgIHRyeURlbGV0ZShuYXRpdmVQYXRoKTtcclxuICAgIHJldHVybiBuYXRpdmVQYXRoc1RvUGF0aHMobmF0aXZlTGliLCBvdXROYXRpdmVQYXRocywgdHJ1ZSk7IC8vIGZyZWVzIG91dE5hdGl2ZVBhdGhzXHJcbiAgfSBmaW5hbGx5IHtcclxuICAgIHRyeURlbGV0ZShuYXRpdmVQYXRoLCBvdXROYXRpdmVQYXRocyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2ltcGxpZnlQb2x5Z29ucyhcclxuICBuYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcclxuICBwYXRoczogUmVhZG9ubHlQYXRocyxcclxuICBmaWxsVHlwZTogUG9seUZpbGxUeXBlID0gUG9seUZpbGxUeXBlLkV2ZW5PZGRcclxuKTogUGF0aHMge1xyXG4gIGNvbnN0IG5hdGl2ZVBhdGhzID0gcGF0aHNUb05hdGl2ZVBhdGhzKG5hdGl2ZUxpYiwgcGF0aHMpO1xyXG4gIHRyeSB7XHJcbiAgICBuYXRpdmVMaWIuc2ltcGxpZnlQb2x5Z29uc092ZXJ3cml0ZShuYXRpdmVQYXRocywgcG9seUZpbGxUeXBlVG9OYXRpdmUobmF0aXZlTGliLCBmaWxsVHlwZSkpO1xyXG4gICAgcmV0dXJuIG5hdGl2ZVBhdGhzVG9QYXRocyhuYXRpdmVMaWIsIG5hdGl2ZVBhdGhzLCB0cnVlKTsgLy8gZnJlZXMgbmF0aXZlUGF0aHNcclxuICB9IGZpbmFsbHkge1xyXG4gICAgdHJ5RGVsZXRlKG5hdGl2ZVBhdGhzKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzY2FsZVBhdGgocGF0aDogUmVhZG9ubHlQYXRoLCBzY2FsZTogbnVtYmVyKTogUGF0aCB7XHJcbiAgY29uc3Qgc29sOiBQYXRoID0gW107XHJcbiAgbGV0IGkgPSBwYXRoLmxlbmd0aDtcclxuICB3aGlsZSAoaS0tKSB7XHJcbiAgICBjb25zdCBwID0gcGF0aFtpXTtcclxuICAgIHNvbC5wdXNoKHtcclxuICAgICAgeDogTWF0aC5yb3VuZChwLnggKiBzY2FsZSksXHJcbiAgICAgIHk6IE1hdGgucm91bmQocC55ICogc2NhbGUpXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuIHNvbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNjYWxlcyBhbGwgaW5uZXIgcGF0aHMgYnkgbXVsdGlwbHlpbmcgYWxsIGl0cyBjb29yZGluYXRlcyBieSBhIG51bWJlciBhbmQgdGhlbiByb3VuZGluZyB0aGVtLlxyXG4gKlxyXG4gKiBAcGFyYW0gcGF0aHMgLSBQYXRocyB0byBzY2FsZVxyXG4gKiBAcGFyYW0gc2NhbGUgLSBTY2FsZSBtdWx0aXBsaWVyXHJcbiAqIEByZXR1cm4ge1BhdGhzfSAtIFRoZSBzY2FsZWQgcGF0aHNcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzY2FsZVBhdGhzKHBhdGhzOiBSZWFkb25seVBhdGhzLCBzY2FsZTogbnVtYmVyKTogUGF0aHMge1xyXG4gIGlmIChzY2FsZSA9PT0gMCkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc29sOiBQYXRocyA9IFtdO1xyXG4gIGxldCBpID0gcGF0aHMubGVuZ3RoO1xyXG4gIHdoaWxlIChpLS0pIHtcclxuICAgIGNvbnN0IHAgPSBwYXRoc1tpXTtcclxuICAgIHNvbC5wdXNoKHNjYWxlUGF0aChwLCBzY2FsZSkpO1xyXG4gIH1cclxuICByZXR1cm4gc29sO1xyXG59XHJcbiJdfQ==
