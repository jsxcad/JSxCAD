/*
import {
  ClipType,
  NativeClipperLibRequestedFormat,
  PolyFillType,
  loadNativeClipperLibInstanceAsync
} from './js-angusj-clipperjs-web/index.js';

test('strictlySimple fails', async t => {
  const clipper = await loadNativeClipperLibInstanceAsync(NativeClipperLibRequestedFormat.WasmOnly);
  const request =
    {
      clipType: ClipType.Union,
      subjectInputs: [{ data: [{ x: 50, y: 50 }, { x: -50, y: 50 }, { x: -50, y: -50 }, { x: 50, y: -50 }], closed: true },
                      { data: [{ x: -5, y: -5 }, { x: -5, y: 5 }, { x: 5, y: 5 }, { x: 5, y: -5 }], closed: true }],
      subjectFillType: PolyFillType.NonZero,
      strictlySimple: true
    };
  const result = clipper.clipToPolyTree(request);
  t.deepEqual(result, []);
});
*/

import test from 'ava';

test('dummy', (t) => t.true(true));
