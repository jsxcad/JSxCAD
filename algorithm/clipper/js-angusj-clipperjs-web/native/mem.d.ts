import { NativeClipperLibInstance } from "./NativeClipperLibInstance";
export declare function mallocDoubleArray(nativeClipperLib: NativeClipperLibInstance, len: number): Float64Array;
export declare function freeTypedArray(nativeClipperLib: NativeClipperLibInstance, array: Float64Array | Uint32Array): void;
