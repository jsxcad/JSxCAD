import { Path, ReadonlyPath } from "../Path";
import { NativeClipperLibInstance } from "./NativeClipperLibInstance";
import { NativePath } from "./NativePath";
export declare function getNofItemsForPath(path: ReadonlyPath): number;
export declare function writePathToDoubleArray(path: ReadonlyPath, heapBytes: Float64Array, startPtr: number): number;
export declare function pathToDoubleArray(nativeClipperLib: NativeClipperLibInstance, path: ReadonlyPath): Float64Array;
export declare function doubleArrayToNativePath(nativeClipperLib: NativeClipperLibInstance, array: Float64Array, freeArray: boolean): NativePath;
export declare function pathToNativePath(nativeClipperLib: NativeClipperLibInstance, path: ReadonlyPath): NativePath;
export declare function nativePathToDoubleArray(nativeClipperLib: NativeClipperLibInstance, nativePath: NativePath, freeNativePath: boolean): Float64Array;
export declare function doubleArrayToPath(nativeClipperLib: NativeClipperLibInstance, array: Float64Array, _freeDoubleArray: boolean, startPtr: number): {
    path: Path;
    ptrEnd: number;
};
export declare function nativePathToPath(nativeClipperLib: NativeClipperLibInstance, nativePath: NativePath, freeNativePath: boolean): Path;
