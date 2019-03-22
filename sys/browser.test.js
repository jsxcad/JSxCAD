import { readFileSync } from './readFileSyncBrowser';
import { test } from 'ava';
import { watchFile } from './watchFileBrowser';
import { writeFileSync } from './writeFileSyncBrowser';

test("Test writing a new file", t => {
  writeFileSync('tmp/1', 'hello');
  t.is(readFileSync('tmp/1'), 'hello');
});

test("Test reading a new file", t => {
  t.is(readFileSync('tmp/2', 'hello'), undefined);
});

test("Test watch before writing a new file", t => {
  let changed = false;
  watchFile('tmp/3', () => { changed = true; })
  t.false(changed);
  writeFileSync('tmp/3', 'hello');
  t.true(changed);
});

test("Test watch on writing an existing file", t => {
  writeFileSync('tmp/4', 'hello');
  let changed = false;
  watchFile('tmp/4', () => { changed = true; })
  t.false(changed);
  writeFileSync('tmp/4', 'goodbye');
  t.true(changed);
});
