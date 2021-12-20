import { deleteFile } from './deleteFile.js';
import { readFile } from './readFile.js';
import { setupFilesystem } from './filesystem.js';
import test from 'ava';
import { watchFileDeletion } from './files.js';
import { writeFile } from './writeFile.js';

test('Utf8 read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });

  const deleted = new Set();
  watchFileDeletion((path) => deleted.add(path));

  await writeFile({}, 'hello', 'hello');
  const data1 = await readFile({}, 'hello');
  await deleteFile({}, 'hello');
  const data2 = await readFile({}, 'hello');
  t.is(data1, 'hello');
  t.true(deleted.has('jsxcad/tmp/hello'));
  t.is(data2, undefined);
});
