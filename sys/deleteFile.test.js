import { deleteFile } from './deleteFile';
import { readFile } from './readFile';
import { setupFilesystem } from './filesystem';
import test from 'ava';
import { watchFileDeletion } from './files';
import { writeFile } from './writeFile';

test('Utf8 read', async t => {
  setupFilesystem({ fileBase: 'tmp' });

  const deleted = new Set();
  watchFileDeletion((options, file) => deleted.add(file.path));

  await writeFile({}, 'hello', 'hello');
  const data1 = await readFile({}, 'hello');
  await deleteFile({}, 'hello');
  const data2 = await readFile({}, 'hello');
  t.is(data1, 'hello');
  t.true(deleted.has('hello'));
  t.is(data2, undefined);
});
