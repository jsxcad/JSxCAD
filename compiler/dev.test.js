import test from 'ava';
import { toEcmascript } from './toEcmascript.js';

Error.stackTraceLimit = Infinity;

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
const Foo = await loadGeometry('data/def//Foo');
Object.freeze(Foo);
await replayRecordedNotes('', 'Foo');
const foo = await loadGeometry('data/def//foo');
Object.freeze(foo);
await replayRecordedNotes('', 'foo');
return {};

} catch (error) { throw error; }
`
  );
  // FIX: This should include the Foo import.
  t.deepEqual(updates, {
    '/Foo': {
      dependencies: ['importModule'],
      program: `
try {
info('define Foo');

beginRecordingNotes('', 'Foo', {
  line: 1,
  column: 0
});

const Foo = (await importModule('bar')).default;
Foo instanceof Shape && (await saveGeometry('data/def//Foo', Foo)) && (await write('meta/def//Foo', {
  sha: 'd83c9c742193c2ccc0487366f92ac46bd7520524'
}));

await saveRecordedNotes('', 'Foo');


} catch (error) { throw error; }
`,
    },
    '/foo': {
      dependencies: ['Foo'],
      program: `
try {
const Foo = await loadGeometry('data/def//Foo');

Object.freeze(Foo);

info('define foo');

beginRecordingNotes('', 'foo', {
  line: 1,
  column: 23
});

const foo = Foo();
foo instanceof Shape && (await saveGeometry('data/def//foo', foo)) && (await write('meta/def//foo', {
  sha: '12aabf3f55ab5d4a514d406b33750f92a78629f9'
}));

await saveRecordedNotes('', 'foo');


} catch (error) { throw error; }
`,
    },
  });
});
