import { addSource, getSources } from './source';

import test from 'ava';

test('Retrieve no sources', (t) => {
  const sources = getSources('hello');
  t.deepEqual(sources, []);
});

test('Retrieve multiple sources in reverse order', (t) => {
  addSource('hello', 'file/tmp/hello.txt');
  addSource('hello', 'http://hello.com');

  const sources = getSources('hello');
  t.deepEqual(sources, ['http://hello.com', 'file/tmp/hello.txt']);
});
