import { toDot, toGraph } from './toGraph';

import test from 'ava';

test('Function call.', (t) => {
  const { nodes } = toGraph({}, `foo(1);`);
  t.deepEqual(nodes, {
    0: { identifier: 'foo', source: undefined },
    1: { number: 1, source: undefined },
    2: { call: 0, arguments: [1], source: undefined },
  });
});

test('Object call.', (t) => {
  const { nodes } = toGraph({}, `foo.bar(1);`);
  t.deepEqual(nodes, {
    0: { identifier: 'foo', source: undefined },
    1: { identifier: 'bar', source: undefined },
    2: { object: 0, member: 1, computed: false, source: undefined },
    3: { number: 1, source: undefined },
    4: { call: 2, arguments: [3], source: undefined },
  });
});

test('Chaining.', (t) => {
  const { nodes } = toGraph({}, `Circle(10).extrude(5);`);
  t.deepEqual(nodes, {
    0: { identifier: 'Circle', source: undefined },
    1: { number: 10, source: undefined },
    2: { call: 0, arguments: [1], source: undefined },
    3: { identifier: 'extrude', source: undefined },
    4: { object: 2, member: 3, computed: false, source: undefined },
    5: { number: 5, source: undefined },
    6: { call: 4, arguments: [5], source: undefined },
  });
});

test('Identifier consolidation.', (t) => {
  const { nodes } = toGraph({}, `foo(bar, bar);`);
  t.deepEqual(nodes, {
    0: { identifier: 'foo', source: undefined },
    1: { identifier: 'bar', source: undefined },
    2: { call: 0, arguments: [1, 1], source: undefined },
  });
});

test('To Dot', (t) => {
  const { nodes } = toGraph({ includeSource: true }, `Circle(10).extrude(5);`);
  const dot = toDot({ nodes });
  t.is(
    dot,
    `digraph {
  "0" [label="Circle"];
  "1" [label="10"];
  "2" [label="Circle(10)"];
  "3" [label="extrude"];
  "4" [label="Circle(10).extrude"];
  "5" [label="5"];
  "6" [label="Circle(10).extrude(5)"];
  "0" -> "2";
  "1" -> "2";
  "2" -> "4";
  "3" -> "4";
  "4" -> "6";
  "5" -> "6";
}`
  );
});
