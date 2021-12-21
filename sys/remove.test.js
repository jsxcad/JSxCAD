import { read } from './read.js';
import { remove } from './remove.js';
import { setupFilesystem } from './filesystem.js';
import test from 'ava';
import { watchFileDeletion } from './watchers.js';
import { write } from './write.js';

test('Utf8 read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });

  const deleted = new Set();
  watchFileDeletion((path) => {
    deleted.add(path);
  });

  await write('hello', 'hello');
  const data1 = await read('hello');
  await remove('hello');
  const data2 = await read('hello');
  t.is(data1, 'hello');
  t.true(deleted.has('jsxcad/tmp/hello'));
  t.is(data2, undefined);
});
