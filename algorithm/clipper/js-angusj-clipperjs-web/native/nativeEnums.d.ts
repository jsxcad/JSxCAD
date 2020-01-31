export interface NativeClipType {
    Intersection: NativeClipType;
    Union: NativeClipType;
    Difference: NativeClipType;
    Xor: NativeClipType;
}
export interface NativePolyType {
    Subject: NativePolyType;
    Clip: NativePolyType;
}
export interface NativePolyFillType {
    EvenOdd: NativePolyFillType;
    NonZero: NativePolyFillType;
    Positive: NativePolyFillType;
    Negative: NativePolyFillType;
}
export interface NativeInitOptions {
    ReverseSolution: NativeInitOptions | number;
    StrictlySimple: NativeInitOptions | number;
    PreserveCollinear: NativeInitOptions | number;
}
export interface NativeJoinType {
    Square: NativeJoinType;
    Round: NativeJoinType;
    Miter: NativeJoinType;
}
export interface NativeEndType {
    ClosedPolygon: NativeEndType;
    ClosedLine: NativeEndType;
    OpenButt: NativeEndType;
    OpenSquare: NativeEndType;
    OpenRound: NativeEndType;
}
