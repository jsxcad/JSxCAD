import { readFile } from './readFile';
import { test } from 'ava';

test('Utf8 read', async t => {
  const data = await readFile({ as: 'utf8', sources: [{ file: 'testdata/hello.txt' }] }, 'tmp/utf8');
  t.is(data, 'Hello\n');
});

test('Bytes read', async t => {
  const data = await readFile({ as: 'bytes', sources: [{ file: 'testdata/hello.txt' }] }, 'tmp/bytes');
  t.deepEqual([0, 1, 2, 3, 4, 5].map(nth => data[nth]),
              [72, 101, 108, 108, 111, 10]);
});
