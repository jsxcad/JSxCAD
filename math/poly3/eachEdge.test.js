import { eachEdge } from './eachEdge';
import test from 'ava';

test('Empty polygon emits no edges.', t => {
  const collected = [];
  eachEdge({}, edge => collected.push(edge), []);
  t.deepEqual(collected, []);
});

test('Single point polygon emits no edges.', t => {
  const collected = [];
  eachEdge({}, edge => collected.push(edge), [[0, 0, 0]]);
  t.deepEqual(collected, []);
});

test('Edges are cyclic and emitted in order.', t => {
  const collected = [];
  eachEdge({}, (start, end) => collected.push([start, end]),
           [[0, 0, 0], [1, 1, 1], [2, 2, 2]]);
  t.deepEqual(collected, [[[0, 0, 0], [1, 1, 1]],
                          [[1, 1, 1], [2, 2, 2]],
                          [[2, 2, 2], [0, 0, 0]]]);
});
