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
const Foo = (await importModule('bar')).default;
const foo = await loadGeometry('data/def//foo');
Object.freeze(foo);
await replayRecordedNotes('', 'foo');
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
foo instanceof Shape && (await saveGeometry('data/def//foo', foo)) && (await write('meta/def//foo', {
  sha: '12aabf3f55ab5d4a514d406b33750f92a78629f9'
}));

await saveRecordedNotes('', 'foo');


} catch (error) { throw error; }
`,
    },
  });
});
