"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * By far the most widely used winding rules for polygon filling are EvenOdd & NonZero (GDI, GDI+, XLib, OpenGL, Cairo, AGG, Quartz, SVG, Gr32)
 * Others rules include Positive, Negative and ABS_GTR_EQ_TWO (only in OpenGL)
 * see http://glprogramming.com/red/chapter11.html
 */
var PolyFillType;
(function (PolyFillType) {
    PolyFillType["EvenOdd"] = "evenOdd";
    PolyFillType["NonZero"] = "nonZero";
    PolyFillType["Positive"] = "positive";
    PolyFillType["Negative"] = "negative";
})(PolyFillType = exports.PolyFillType || (exports.PolyFillType = {}));
var ClipType;
(function (ClipType) {
    ClipType["Intersection"] = "intersection";
    ClipType["Union"] = "union";
    ClipType["Difference"] = "difference";
    ClipType["Xor"] = "xor";
})(ClipType = exports.ClipType || (exports.ClipType = {}));
var PolyType;
(function (PolyType) {
    PolyType["Subject"] = "subject";
    PolyType["Clip"] = "clip";
})(PolyType = exports.PolyType || (exports.PolyType = {}));
var JoinType;
(function (JoinType) {
    JoinType["Square"] = "square";
    JoinType["Round"] = "round";
    JoinType["Miter"] = "miter";
})(JoinType = exports.JoinType || (exports.JoinType = {}));
var EndType;
(function (EndType) {
    EndType["ClosedPolygon"] = "closedPolygon";
    EndType["ClosedLine"] = "closedLine";
    EndType["OpenButt"] = "openButt";
    EndType["OpenSquare"] = "openSquare";
    EndType["OpenRound"] = "openRound";
})(EndType = exports.EndType || (exports.EndType = {}));
var PointInPolygonResult;
(function (PointInPolygonResult) {
    PointInPolygonResult[PointInPolygonResult["Outside"] = 0] = "Outside";
    PointInPolygonResult[PointInPolygonResult["Inside"] = 1] = "Inside";
    PointInPolygonResult[PointInPolygonResult["OnBoundary"] = -1] = "OnBoundary";
})(PointInPolygonResult = exports.PointInPolygonResult || (exports.PointInPolygonResult = {}));
/**
 * Format to use when loading the native library instance.
 */
var NativeClipperLibRequestedFormat;
(function (NativeClipperLibRequestedFormat) {
    /**
     * Try to load the WebAssembly version, if it fails try to load the Asm.js version.
     */
    NativeClipperLibRequestedFormat["WasmWithAsmJsFallback"] = "wasmWithAsmJsFallback";
    /**
     * Load the WebAssembly version exclusively.
     */
    NativeClipperLibRequestedFormat["WasmOnly"] = "wasmOnly";
    /**
     * Load the Asm.js version exclusively.
     */
    NativeClipperLibRequestedFormat["AsmJsOnly"] = "asmJsOnly";
})(NativeClipperLibRequestedFormat = exports.NativeClipperLibRequestedFormat || (exports.NativeClipperLibRequestedFormat = {}));
/**
 * The format the native library being used is in.
 */
var NativeClipperLibLoadedFormat;
(function (NativeClipperLibLoadedFormat) {
    /**
     * WebAssembly.
     */
    NativeClipperLibLoadedFormat["Wasm"] = "wasm";
    /**
     * Asm.js.
     */
    NativeClipperLibLoadedFormat["AsmJs"] = "asmJs";
})(NativeClipperLibLoadedFormat = exports.NativeClipperLibLoadedFormat || (exports.NativeClipperLibLoadedFormat = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW51bXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxZQUtYO0FBTEQsV0FBWSxZQUFZO0lBQ3RCLG1DQUFtQixDQUFBO0lBQ25CLG1DQUFtQixDQUFBO0lBQ25CLHFDQUFxQixDQUFBO0lBQ3JCLHFDQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtBQUVELElBQVksUUFLWDtBQUxELFdBQVksUUFBUTtJQUNsQix5Q0FBNkIsQ0FBQTtJQUM3QiwyQkFBZSxDQUFBO0lBQ2YscUNBQXlCLENBQUE7SUFDekIsdUJBQVcsQ0FBQTtBQUNiLENBQUMsRUFMVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUtuQjtBQUNELElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNsQiwrQkFBbUIsQ0FBQTtJQUNuQix5QkFBYSxDQUFBO0FBQ2YsQ0FBQyxFQUhXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBR25CO0FBRUQsSUFBWSxRQUlYO0FBSkQsV0FBWSxRQUFRO0lBQ2xCLDZCQUFpQixDQUFBO0lBQ2pCLDJCQUFlLENBQUE7SUFDZiwyQkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFKVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUluQjtBQUNELElBQVksT0FNWDtBQU5ELFdBQVksT0FBTztJQUNqQiwwQ0FBK0IsQ0FBQTtJQUMvQixvQ0FBeUIsQ0FBQTtJQUN6QixnQ0FBcUIsQ0FBQTtJQUNyQixvQ0FBeUIsQ0FBQTtJQUN6QixrQ0FBdUIsQ0FBQTtBQUN6QixDQUFDLEVBTlcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBTWxCO0FBRUQsSUFBWSxvQkFJWDtBQUpELFdBQVksb0JBQW9CO0lBQzlCLHFFQUFXLENBQUE7SUFDWCxtRUFBVSxDQUFBO0lBQ1YsNEVBQWUsQ0FBQTtBQUNqQixDQUFDLEVBSlcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFJL0I7QUFFRDs7R0FFRztBQUNILElBQVksK0JBYVg7QUFiRCxXQUFZLCtCQUErQjtJQUN6Qzs7T0FFRztJQUNILGtGQUErQyxDQUFBO0lBQy9DOztPQUVHO0lBQ0gsd0RBQXFCLENBQUE7SUFDckI7O09BRUc7SUFDSCwwREFBdUIsQ0FBQTtBQUN6QixDQUFDLEVBYlcsK0JBQStCLEdBQS9CLHVDQUErQixLQUEvQix1Q0FBK0IsUUFhMUM7QUFFRDs7R0FFRztBQUNILElBQVksNEJBU1g7QUFURCxXQUFZLDRCQUE0QjtJQUN0Qzs7T0FFRztJQUNILDZDQUFhLENBQUE7SUFDYjs7T0FFRztJQUNILCtDQUFlLENBQUE7QUFDakIsQ0FBQyxFQVRXLDRCQUE0QixHQUE1QixvQ0FBNEIsS0FBNUIsb0NBQTRCLFFBU3ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEJ5IGZhciB0aGUgbW9zdCB3aWRlbHkgdXNlZCB3aW5kaW5nIHJ1bGVzIGZvciBwb2x5Z29uIGZpbGxpbmcgYXJlIEV2ZW5PZGQgJiBOb25aZXJvIChHREksIEdESSssIFhMaWIsIE9wZW5HTCwgQ2Fpcm8sIEFHRywgUXVhcnR6LCBTVkcsIEdyMzIpXHJcbiAqIE90aGVycyBydWxlcyBpbmNsdWRlIFBvc2l0aXZlLCBOZWdhdGl2ZSBhbmQgQUJTX0dUUl9FUV9UV08gKG9ubHkgaW4gT3BlbkdMKVxyXG4gKiBzZWUgaHR0cDovL2dscHJvZ3JhbW1pbmcuY29tL3JlZC9jaGFwdGVyMTEuaHRtbFxyXG4gKi9cclxuZXhwb3J0IGVudW0gUG9seUZpbGxUeXBlIHtcclxuICBFdmVuT2RkID0gXCJldmVuT2RkXCIsXHJcbiAgTm9uWmVybyA9IFwibm9uWmVyb1wiLFxyXG4gIFBvc2l0aXZlID0gXCJwb3NpdGl2ZVwiLFxyXG4gIE5lZ2F0aXZlID0gXCJuZWdhdGl2ZVwiXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIENsaXBUeXBlIHtcclxuICBJbnRlcnNlY3Rpb24gPSBcImludGVyc2VjdGlvblwiLFxyXG4gIFVuaW9uID0gXCJ1bmlvblwiLFxyXG4gIERpZmZlcmVuY2UgPSBcImRpZmZlcmVuY2VcIixcclxuICBYb3IgPSBcInhvclwiXHJcbn1cclxuZXhwb3J0IGVudW0gUG9seVR5cGUge1xyXG4gIFN1YmplY3QgPSBcInN1YmplY3RcIixcclxuICBDbGlwID0gXCJjbGlwXCJcclxufVxyXG5cclxuZXhwb3J0IGVudW0gSm9pblR5cGUge1xyXG4gIFNxdWFyZSA9IFwic3F1YXJlXCIsXHJcbiAgUm91bmQgPSBcInJvdW5kXCIsXHJcbiAgTWl0ZXIgPSBcIm1pdGVyXCJcclxufVxyXG5leHBvcnQgZW51bSBFbmRUeXBlIHtcclxuICBDbG9zZWRQb2x5Z29uID0gXCJjbG9zZWRQb2x5Z29uXCIsXHJcbiAgQ2xvc2VkTGluZSA9IFwiY2xvc2VkTGluZVwiLFxyXG4gIE9wZW5CdXR0ID0gXCJvcGVuQnV0dFwiLFxyXG4gIE9wZW5TcXVhcmUgPSBcIm9wZW5TcXVhcmVcIixcclxuICBPcGVuUm91bmQgPSBcIm9wZW5Sb3VuZFwiXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFBvaW50SW5Qb2x5Z29uUmVzdWx0IHtcclxuICBPdXRzaWRlID0gMCxcclxuICBJbnNpZGUgPSAxLFxyXG4gIE9uQm91bmRhcnkgPSAtMVxyXG59XHJcblxyXG4vKipcclxuICogRm9ybWF0IHRvIHVzZSB3aGVuIGxvYWRpbmcgdGhlIG5hdGl2ZSBsaWJyYXJ5IGluc3RhbmNlLlxyXG4gKi9cclxuZXhwb3J0IGVudW0gTmF0aXZlQ2xpcHBlckxpYlJlcXVlc3RlZEZvcm1hdCB7XHJcbiAgLyoqXHJcbiAgICogVHJ5IHRvIGxvYWQgdGhlIFdlYkFzc2VtYmx5IHZlcnNpb24sIGlmIGl0IGZhaWxzIHRyeSB0byBsb2FkIHRoZSBBc20uanMgdmVyc2lvbi5cclxuICAgKi9cclxuICBXYXNtV2l0aEFzbUpzRmFsbGJhY2sgPSBcIndhc21XaXRoQXNtSnNGYWxsYmFja1wiLFxyXG4gIC8qKlxyXG4gICAqIExvYWQgdGhlIFdlYkFzc2VtYmx5IHZlcnNpb24gZXhjbHVzaXZlbHkuXHJcbiAgICovXHJcbiAgV2FzbU9ubHkgPSBcIndhc21Pbmx5XCIsXHJcbiAgLyoqXHJcbiAgICogTG9hZCB0aGUgQXNtLmpzIHZlcnNpb24gZXhjbHVzaXZlbHkuXHJcbiAgICovXHJcbiAgQXNtSnNPbmx5ID0gXCJhc21Kc09ubHlcIlxyXG59XHJcblxyXG4vKipcclxuICogVGhlIGZvcm1hdCB0aGUgbmF0aXZlIGxpYnJhcnkgYmVpbmcgdXNlZCBpcyBpbi5cclxuICovXHJcbmV4cG9ydCBlbnVtIE5hdGl2ZUNsaXBwZXJMaWJMb2FkZWRGb3JtYXQge1xyXG4gIC8qKlxyXG4gICAqIFdlYkFzc2VtYmx5LlxyXG4gICAqL1xyXG4gIFdhc20gPSBcIndhc21cIixcclxuICAvKipcclxuICAgKiBBc20uanMuXHJcbiAgICovXHJcbiAgQXNtSnMgPSBcImFzbUpzXCJcclxufVxyXG4iXX0=