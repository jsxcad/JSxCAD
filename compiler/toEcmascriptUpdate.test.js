import test from 'ava';
import { toEcmascript } from './toEcmascript.js';
import { write } from '@jsxcad/sys';

Error.stackTraceLimit = Infinity;

test('Reuse', async (t) => {
  // Demonstrate defined case.
  await write('meta/def//mountainView', {
    sha: 'c3b0ad66f1281cd0078066eea1b208fef9ffc133',
    type: 'Shape',
  });
  const updates = {};
  const replays = [];
  await toEcmascript(
    `
import 'blah';
const Mountain = () => foo();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { updates, replays }
  );

  t.deepEqual(replays, [
    `
try {
pushSourceLocation({
  path: '',
  id: 'Mountain'
});
const Mountain = () => foo();
popSourceLocation({
  path: '',
  id: 'Mountain'
});

} catch (error) { throw error; }
`,
  ]);
  t.deepEqual(updates, {
    $1: {
      dependencies: ['$1', 'importModule'],
      program: `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});

const $1 = await importModule('blah');
popSourceLocation({
  path: '',
  id: '$1'
});

info('define $1');

pushSourceLocation({
  path: '',
  id: '$1'
});

beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});

const $1 = await importModule('blah');
await write('meta/def//$1', {
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  type: $1 instanceof Shape ? 'Shape' : 'Object'
});
if ($1 instanceof Shape) {
  await saveGeometry('data/def//$1', $1);
}

await saveRecordedNotes('', '$1');

popSourceLocation({
  path: '',
  id: '$1'
});


} catch (error) { throw error; }
`,
    },
    $2: {
      dependencies: ['$1', 'mountainView'],
      program: `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});

const $1 = await importModule('blah');
popSourceLocation({
  path: '',
  id: '$1'
});

pushSourceLocation({
  path: '',
  id: 'Mountain'
});

const Mountain = () => foo();
popSourceLocation({
  path: '',
  id: 'Mountain'
});

const mountainView = await loadGeometry('data/def//mountainView');

Object.freeze(mountainView);

info('define $2');

pushSourceLocation({
  path: '',
  id: '$2'
});

beginRecordingNotes('', '$2', {
  line: 1,
  column: 0
});

const $2 = mountainView.frontView({
  position: [0, -100, 50]
});
await write('meta/def//$2', {
  sha: '46ba2bee79153c17eef85ba46ecea6f9168c571f',
  type: $2 instanceof Shape ? 'Shape' : 'Object'
});
if ($2 instanceof Shape) {
  await saveGeometry('data/def//$2', $2);
}

await saveRecordedNotes('', '$2');

popSourceLocation({
  path: '',
  id: '$2'
});


} catch (error) { throw error; }
`,
    },
    mountainView: {
      dependencies: ['$1', 'Mountain'],
      program: `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});

const $1 = await importModule('blah');
popSourceLocation({
  path: '',
  id: '$1'
});

pushSourceLocation({
  path: '',
  id: 'Mountain'
});

const Mountain = () => foo();
popSourceLocation({
  path: '',
  id: 'Mountain'
});

info('define mountainView');

pushSourceLocation({
  path: '',
  id: 'mountainView'
});

beginRecordingNotes('', 'mountainView', {
  line: 4,
  column: 0
});

const mountainView = Mountain().scale(0.5).Page();
await write('meta/def//mountainView', {
  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',
  type: mountainView instanceof Shape ? 'Shape' : 'Object'
});
if (mountainView instanceof Shape) {
  await saveGeometry('data/def//mountainView', mountainView);
}

await saveRecordedNotes('', 'mountainView');

popSourceLocation({
  path: '',
  id: 'mountainView'
});


} catch (error) { throw error; }
`,
    },
  });

  const reupdates = {};
  const rereplays = [];
  await toEcmascript(
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { updates: reupdates, replays: rereplays }
  );

  t.deepEqual(rereplays, [
    `
try {
pushSourceLocation({
  path: '',
  id: 'Mountain'
});
const Mountain = () => bar();
popSourceLocation({
  path: '',
  id: 'Mountain'
});

} catch (error) { throw error; }
`,
  ]);
  t.deepEqual(reupdates, {
    $1: {
      dependencies: ['mountainView'],
      program: `
try {
pushSourceLocation({
  path: '',
  id: 'Mountain'
});

const Mountain = () => bar();
popSourceLocation({
  path: '',
  id: 'Mountain'
});

const mountainView = await loadGeometry('data/def//mountainView');

Object.freeze(mountainView);

info('define $1');

pushSourceLocation({
  path: '',
  id: '$1'
});

beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});

const $1 = mountainView.frontView({
  position: [0, -100, 50]
});
await write('meta/def//$1', {
  sha: 'f6fbedf20aa75786f6cce70e27e67a1a5f50bc37',
  type: $1 instanceof Shape ? 'Shape' : 'Object'
});
if ($1 instanceof Shape) {
  await saveGeometry('data/def//$1', $1);
}

await saveRecordedNotes('', '$1');

popSourceLocation({
  path: '',
  id: '$1'
});


} catch (error) { throw error; }
`,
    },
    mountainView: {
      dependencies: ['Mountain'],
      program: `
try {
pushSourceLocation({
  path: '',
  id: 'Mountain'
});

const Mountain = () => bar();
popSourceLocation({
  path: '',
  id: 'Mountain'
});

info('define mountainView');

pushSourceLocation({
  path: '',
  id: 'mountainView'
});

beginRecordingNotes('', 'mountainView', {
  line: 3,
  column: 0
});

const mountainView = Mountain().scale(0.5).Page();
await write('meta/def//mountainView', {
  sha: '1952b6311872fb454d675b9d14b8c53c41c23c57',
  type: mountainView instanceof Shape ? 'Shape' : 'Object'
});
if (mountainView instanceof Shape) {
  await saveGeometry('data/def//mountainView', mountainView);
}

await saveRecordedNotes('', 'mountainView');

popSourceLocation({
  path: '',
  id: 'mountainView'
});


} catch (error) { throw error; }
`,
    },
  });
});
