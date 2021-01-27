import test from 'ava';
import { toTagsFromName } from './tool.js';

test('Default works.', (t) => {
  t.deepEqual(toTagsFromName('cnc'), ['tool/cnc']);
});
