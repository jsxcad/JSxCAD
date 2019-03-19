import { cross } from './cross';
import { test } from 'ava';

test('vec2: cross() called with two paramerters should return a vec2 with correct values', (t) => {
  const obs1 = cross([0, 0], [0, 0]);
  t.deepEqual(obs1, [0, 0, 0]);

  const obs2 = cross([5, 5], [10, 20]);
  t.deepEqual(obs2, [0, 0, 50]);

  const obs3 = cross([5, 5], [10, -20]);
  t.deepEqual(obs3, [0, 0, -150]);

  const obs4 = cross([5, 5], [-10, -20]);
  t.deepEqual(obs4, [0, 0, -50]);

  const obs5 = cross([5, 5], [-10, 20]);
  t.deepEqual(obs5, [0, 0, 150]);

  const obs6 = cross([5, 5], [10, 20]);
  t.deepEqual(obs6, [0, 0, 50]);

  const obs7 = cross([5, 5], [10, -20]);
  t.deepEqual(obs7, [0, 0, -150]);

  const obs8 = cross([5, 5], [-10, -20]);
  t.deepEqual(obs8, [0, 0, -50]);

  const obs9 = cross([5, 5], [-10, 20]);
  t.deepEqual(obs9, [0, 0, 150]);
});
