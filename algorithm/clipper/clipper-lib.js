import clipperjs from './js-angusj-clipperjs-web/index.cjs';

import { onBoot } from '@jsxcad/sys';

const {
  ClipType,
  NativeClipperLibRequestedFormat,
  PolyFillType,
  PolyTree,
  loadNativeClipperLibInstanceAsync,
} = clipperjs;

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

export { ClipType, PolyFillType, PolyTree };

onBoot(setup);
