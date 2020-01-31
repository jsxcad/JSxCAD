import { PointInPolygonResult, PolyFillType } from "./enums";
import { IntPoint } from "./IntPoint";
import { NativeClipperLibInstance } from "./native/NativeClipperLibInstance";
import { Path, ReadonlyPath } from "./Path";
import { Paths, ReadonlyPaths } from "./Paths";
import { PolyTree } from "./PolyTree";
export declare function area(path: ReadonlyPath): number;
export declare function cleanPolygon(nativeLib: NativeClipperLibInstance, path: ReadonlyPath, distance?: number): Path;
export declare function cleanPolygons(nativeLib: NativeClipperLibInstance, paths: ReadonlyPaths, distance?: number): Paths;
export declare function closedPathsFromPolyTree(polyTree: PolyTree): Paths;
export declare function minkowskiDiff(nativeLib: NativeClipperLibInstance, poly1: ReadonlyPath, poly2: ReadonlyPath): Paths;
export declare function minkowskiSumPath(nativeLib: NativeClipperLibInstance, pattern: ReadonlyPath, path: ReadonlyPath, pathIsClosed: boolean): Paths;
export declare function minkowskiSumPaths(nativeLib: NativeClipperLibInstance, pattern: ReadonlyPath, paths: ReadonlyPaths, pathIsClosed: boolean): Paths;
export declare function openPathsFromPolyTree(polyTree: PolyTree): ReadonlyPath[];
export declare function orientation(path: ReadonlyPath): boolean;
export declare function pointInPolygon(point: Readonly<IntPoint>, path: ReadonlyPath): PointInPolygonResult;
export declare function polyTreeToPaths(polyTree: PolyTree): Paths;
export declare function reversePath(path: Path): void;
export declare function reversePaths(paths: Paths): void;
export declare function simplifyPolygon(nativeLib: NativeClipperLibInstance, path: ReadonlyPath, fillType?: PolyFillType): Paths;
export declare function simplifyPolygons(nativeLib: NativeClipperLibInstance, paths: ReadonlyPaths, fillType?: PolyFillType): Paths;
export declare function scalePath(path: ReadonlyPath, scale: number): Path;
/**
 * Scales all inner paths by multiplying all its coordinates by a number and then rounding them.
 *
 * @param paths - Paths to scale
 * @param scale - Scale multiplier
 * @return {Paths} - The scaled paths
 */
export declare function scalePaths(paths: ReadonlyPaths, scale: number): Paths;
