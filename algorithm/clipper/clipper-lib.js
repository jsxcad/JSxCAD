import {
  NativeClipperLibRequestedFormat,
  loadNativeClipperLibInstanceAsync,
} from "./js-angusj-clipperjs-web/index.js";

import { onBoot } from "@jsxcad/sys";

export let clipper;

export const setup = async () => {
  if (clipper === undefined) {
    clipper = await loadNativeClipperLibInstanceAsync(
      // let it autodetect which one to use, but also available WasmOnly and AsmJsOnly
      // NativeClipperLibRequestedFormat.WasmWithAsmJsFallback
      NativeClipperLibRequestedFormat.WasmOnly
    );
    clipper.strictlySimple = true;
    clipper.preserveCollinear = true;
  }
};

export function IntPoint(x, y) {
  this.x = x;
  this.y = y;
}

export {
  ClipType,
  PolyFillType,
  PolyTree,
} from "./js-angusj-clipperjs-web/index.js";

onBoot(setup);
