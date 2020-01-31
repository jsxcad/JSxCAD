import { ClipType, EndType, JoinType, PolyFillType, PolyType } from "../enums";
import { NativeClipperLibInstance } from "./NativeClipperLibInstance";
import { NativeClipType, NativeEndType, NativeJoinType, NativePolyFillType, NativePolyType } from "./nativeEnums";
export declare function polyFillTypeToNative(nativeLib: NativeClipperLibInstance, polyFillType: PolyFillType): NativePolyFillType;
export declare function clipTypeToNative(nativeLib: NativeClipperLibInstance, clipType: ClipType): NativeClipType;
export declare function polyTypeToNative(nativeLib: NativeClipperLibInstance, polyType: PolyType): NativePolyType;
export declare function joinTypeToNative(nativeLib: NativeClipperLibInstance, joinType: JoinType): NativeJoinType;
export declare function endTypeToNative(nativeLib: NativeClipperLibInstance, endType: EndType): NativeEndType;
