import { setupFilesystem, writeFile as writeFsFile } from '@jsxcad/sys';

import fs from 'fs';
import test from 'ava';
import { toZipFromFilesystem } from './toZipFromFilesystem';

const { readFile } = fs.promises;

test('Simple', async t => {
  setupFilesystem({ fileBase: 'test' });
  await writeFsFile({}, 'file/hello.txt', 'hello');
  const observed = await toZipFromFilesystem();
  const expected = await readFile('test.zip');
  t.deepEqual([...observed], [...expected]);
});
