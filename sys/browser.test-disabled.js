import { readFile } from './readFile.js';
import { test } from 'ava';
import { watchFile } from './watchFile.js';
import { watchFileCreation } from './files.js';
import { writeFile } from './writeFile.js';

test('Test writing a new file', async (t) => {
  await writeFile('tmp/1', 'hello');
  t.is(await readFile('tmp/1'), 'hello');
});

test('Test reading a new file', async (t) => {
  t.is(await readFile('tmp/2'), undefined);
});

test('Test watch before writing a new file', async (t) => {
  let changed = false;
  watchFile('tmp/3', () => {
    changed = true;
  });
  t.false(changed);
  await writeFile('tmp/3', 'hello');
  t.true(changed);
});

test('Test watch on writing an existing file', async (t) => {
  await writeFile('tmp/4', 'hello');
  let changed = false;
  watchFile('tmp/4', () => {
    changed = true;
  });
  t.false(changed);
  await writeFile('tmp/4', 'goodbye');
  t.true(changed);
});

test('Test watching file creation.', async (t) => {
  // We should not notice this file being created.
  await writeFile('tmp/5', '5');

  const created = [];
  watchFileCreation((file) => created.push(file.path));

  // We should not notice this file being updated.
  await writeFile('tmp/5', 'five');

  // We should notice this new file being created.
  await writeFile('tmp/6', 'six');
  t.deepEqual(created, ['tmp/6']);
});
