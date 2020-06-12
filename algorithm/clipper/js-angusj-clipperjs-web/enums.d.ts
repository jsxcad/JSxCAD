/**
 * By far the most widely used winding rules for polygon filling are EvenOdd & NonZero (GDI, GDI+, XLib, OpenGL, Cairo, AGG, Quartz, SVG, Gr32)
 * Others rules include Positive, Negative and ABS_GTR_EQ_TWO (only in OpenGL)
 * see http://glprogramming.com/red/chapter11.html
 */
export declare enum PolyFillType {
  EvenOdd = "evenOdd",
  NonZero = "nonZero",
  Positive = "positive",
  Negative = "negative",
}
export declare enum ClipType {
  Intersection = "intersection",
  Union = "union",
  Difference = "difference",
  Xor = "xor",
}
export declare enum PolyType {
  Subject = "subject",
  Clip = "clip",
}
export declare enum JoinType {
  Square = "square",
  Round = "round",
  Miter = "miter",
}
export declare enum EndType {
  ClosedPolygon = "closedPolygon",
  ClosedLine = "closedLine",
  OpenButt = "openButt",
  OpenSquare = "openSquare",
  OpenRound = "openRound",
}
export declare enum PointInPolygonResult {
  Outside = 0,
  Inside = 1,
  OnBoundary = -1,
}
/**
 * Format to use when loading the native library instance.
 */
export declare enum NativeClipperLibRequestedFormat {
  /**
   * Try to load the WebAssembly version, if it fails try to load the Asm.js version.
   */
  WasmWithAsmJsFallback = "wasmWithAsmJsFallback",
  /**
   * Load the WebAssembly version exclusively.
   */
  WasmOnly = "wasmOnly",
  /**
   * Load the Asm.js version exclusively.
   */
  AsmJsOnly = "asmJsOnly",
}
/**
 * The format the native library being used is in.
 */
export declare enum NativeClipperLibLoadedFormat {
  /**
   * WebAssembly.
   */
  Wasm = "wasm",
  /**
   * Asm.js.
   */
  AsmJs = "asmJs",
}
