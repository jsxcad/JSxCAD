import { Paths, ReadonlyPaths } from "../Paths";
import { NativeClipperLibInstance } from "./NativeClipperLibInstance";
import { NativePaths } from "./NativePaths";
export declare function pathsToDoubleArray(nativeClipperLib: NativeClipperLibInstance, myPaths: ReadonlyPaths): Float64Array;
export declare function doubleArrayToNativePaths(nativeClipperLib: NativeClipperLibInstance, array: Float64Array, freeArray: boolean): NativePaths;
export declare function pathsToNativePaths(nativeClipperLib: NativeClipperLibInstance, paths: ReadonlyPaths): NativePaths;
export declare function nativePathsToDoubleArray(nativeClipperLib: NativeClipperLibInstance, nativePaths: NativePaths, freeNativePaths: boolean): Float64Array;
export declare function doubleArrayToPaths(nativeClipperLib: NativeClipperLibInstance, array: Float64Array, _freeDoubleArray: boolean): Paths;
export declare function nativePathsToPaths(nativeClipperLib: NativeClipperLibInstance, nativePaths: NativePaths, freeNativePaths: boolean): Paths;
