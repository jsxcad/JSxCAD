import { read } from './read.js';
import { setupFilesystem } from './filesystem.js';
import test from 'ava';
import { write } from './write.js';

test('Unserialized utf8 read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  const data = await read('utf8', {
    doSerialize: false,
    sources: ['testdata/hello.txt'],
  });
  const text = new TextDecoder('utf8').decode(data);
  t.is(text, 'Hello\n');
});

test('Unserialized bytes read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  const data = await read('bytes', {
    doSerialize: false,
    sources: ['testdata/hello.txt'],
  });
  t.deepEqual(
    [0, 1, 2, 3, 4, 5].map((nth) => data[nth]),
    [72, 101, 108, 108, 111, 10]
  );
});

test('Serialized utf8 read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  await write('serialized_utf8', 'Hello\n');
  const data = await read('serialized_utf8', {
    sources: ['testdata/hello.txt'],
  });
  t.is(data, 'Hello\n');
});

test('Serialized bytes read', async (t) => {
  setupFilesystem({ fileBase: 'tmp' });
  await write('serialized_bytes', new TextEncoder('utf8').encode('Hello\n'));
  const data = await read('serialized_bytes', {
    sources: ['testdata/hello.txt'],
  });
  t.deepEqual(
    [0, 1, 2, 3, 4, 5].map((nth) => data[nth]),
    [72, 101, 108, 108, 111, 10]
  );
});
