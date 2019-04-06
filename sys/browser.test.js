import { readFileSync } from './readFileSyncBrowser';
import { test } from 'ava';
import { watchFile } from './watchFileBrowser';
import { watchFileCreation } from './files';
import { writeFileSync } from './writeFileSyncBrowser';

test('Test writing a new file', t => {
  writeFileSync('tmp/1', 'hello');
  t.is(readFileSync('tmp/1').data, 'hello');
});

test('Test reading a new file', t => {
  t.is(readFileSync('tmp/2', 'hello').data, undefined);
});

test('Test watch before writing a new file', t => {
  let changed = false;
  watchFile('tmp/3', () => { changed = true; });
  t.false(changed);
  writeFileSync('tmp/3', 'hello');
  t.true(changed);
});

test('Test watch on writing an existing file', t => {
  writeFileSync('tmp/4', 'hello');
  let changed = false;
  watchFile('tmp/4', () => { changed = true; });
  t.false(changed);
  writeFileSync('tmp/4', 'goodbye');
  t.true(changed);
});

test('Test watching file creation.', t => {
  // We should not notice this file being created.
  writeFileSync('tmp/5', '5');

  const created = [];
  watchFileCreation(file => created.push(file.path));

  // We should not notice this file being updated.
  writeFileSync('tmp/5', 'five');

  // We should notice this new file being created.
  writeFileSync('tmp/6', 'six');
  t.deepEqual(created, ['tmp/6']);
});
