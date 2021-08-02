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
  const define = await toEcmascript(
    `
const Mountain = () => foo();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { updates }
  );

  t.is(
    define,
    `
try {
const Mountain = () => foo();
const mountainView = await loadGeometry('data/def//mountainView');
Object.freeze(mountainView);
await replayRecordedNotes('', 'mountainView');
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['mountainView'],
      program: `
try {
const Mountain = () => foo();
const mountainView = await loadGeometry('data/def//mountainView');

Object.freeze(mountainView);

info('define $1');

beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});

const $1 = mountainView.frontView({
  position: [0, -100, 50]
});
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: '02a507c50a75df23ccf0d75d1b20c813fffda121'
}));

await saveRecordedNotes('', '$1');


} catch (error) { throw error; }
`,
    },
  });

  const reupdates = {};
  const redefine = await toEcmascript(
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { updates: reupdates }
  );

  t.is(
    redefine,
    `
try {
const Mountain = () => bar();
const mountainView = await loadGeometry('data/def//mountainView');
Object.freeze(mountainView);
await replayRecordedNotes('', 'mountainView');
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(reupdates, {
    '/$1': {
      dependencies: ['mountainView'],
      program: `
try {
const Mountain = () => bar();
const mountainView = await loadGeometry('data/def//mountainView');

Object.freeze(mountainView);

info('define $1');

beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});

const $1 = mountainView.frontView({
  position: [0, -100, 50]
});
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: '5dfb25d06c9ee5b1dc85dba3e0df726e91f4502b'
}));

await saveRecordedNotes('', '$1');


} catch (error) { throw error; }
`,
    },
    '/mountainView': {
      dependencies: ['Mountain'],
      program: `
try {
const Mountain = () => bar();
info('define mountainView');

beginRecordingNotes('', 'mountainView', {
  line: 3,
  column: 0
});

const mountainView = Mountain().scale(0.5).Page();
mountainView instanceof Shape && (await saveGeometry('data/def//mountainView', mountainView)) && (await write('meta/def//mountainView', {
  sha: 'ff13df28379e2578fac3d15154411d6bf1b707a8'
}));

await saveRecordedNotes('', 'mountainView');


} catch (error) { throw error; }
`,
    },
  });
});

/*
test('Used Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(
    'import Foo from "bar"; const foo = Foo();',
    { updates }
  );
  t.is(
    ecmascript,
    `
try {
const Foo = (await importModule('bar')).default;
const foo = Foo();
return {};

} catch (error) { throw error; }
`
  );
  // FIX: This should include the Foo import.
  t.deepEqual(updates, {
    '/foo': {
      dependencies: ['Foo'],
      program: `
try {
const Foo = (await importModule('bar')).default;
info('define foo');

beginRecordingNotes('', 'foo', {
  line: 1,
  column: 23
});

const foo = Foo();
await write('meta/def//foo', {
  sha: '12aabf3f55ab5d4a514d406b33750f92a78629f9',
  type: foo instanceof Shape ? 'Shape' : 'Object'
});
if (foo instanceof Shape) {
  await saveGeometry('data/def//foo');
}

await saveRecordedNotes('', 'foo');

} catch (error) { throw error; }
`,
    },
  });
});
*/
