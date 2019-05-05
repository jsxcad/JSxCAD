import { readFile } from './readFile';
import { test } from 'ava';

// FIX: Flaky
test('Download', async t => {
  // FIX: Probably should set up a local webserver.
  const data = await readFile({ sources: [{ url: 'https://jsxcad.js.org/data/hello.txt' }] }, 'test');
  t.is(data, 'Hello, world.\n');
});
