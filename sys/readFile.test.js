import { readFile } from './readFile.js';
import { setupFilesystem } from './filesystem.js';
import test from 'ava';
import { writeFile } from './writeFile.js';

test('Unserialized utf8 read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  const data = await readFile(
    { doSerialize: false, sources: ['testdata/hello.txt'] },
    'utf8'
  );
  const text = new TextDecoder('utf8').decode(data);
  t.is(text, 'Hello\n');
});

test('Unserialized bytes read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  const data = await readFile(
    { doSerialize: false, sources: ['testdata/hello.txt'] },
    'bytes'
  );
  t.deepEqual(
    [0, 1, 2, 3, 4, 5].map((nth) => data[nth]),
    [72, 101, 108, 108, 111, 10]
  );
});

test('Serialized utf8 read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  await writeFile({}, 'serialized_utf8', 'Hello\n');
  const data = await readFile(
    { sources: ['testdata/hello.txt'] },
    'serialized_utf8'
  );
  t.is(data, 'Hello\n');
});

test('Serialized bytes read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  await writeFile(
    {},
    'serialized_bytes',
    new TextEncoder('utf8').encode('Hello\n')
  );
  const data = await readFile(
    { sources: ['testdata/hello.txt'] },
    'serialized_bytes'
  );
  t.deepEqual(
    [0, 1, 2, 3, 4, 5].map((nth) => data[nth]),
    [72, 101, 108, 108, 111, 10]
  );
});
