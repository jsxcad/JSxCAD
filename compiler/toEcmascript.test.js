import test from 'ava';
import { toEcmascript } from './toEcmascript.js';
import { write } from '@jsxcad/sys';

Error.stackTraceLimit = Infinity;

test('Wrap and return.', async (t) => {
  const ecmascript = await toEcmascript(
    `export const foo = (x) => x + 1;
       export const main = async () => {
         let a = 10;
         return circle(foo(a));
       }`
  );
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'foo'
});
const foo = x => x + 1;
popSourceLocation({
  path: '',
  id: 'foo'
});
pushSourceLocation({
  path: '',
  id: 'main'
});
const main = async () => {
  let a = 10;
  return circle(foo(a));
};
popSourceLocation({
  path: '',
  id: 'main'
});
return {
  foo,
  main
};

} catch (error) { throw error; }
`
  );
});

test('Top level expressions become variables.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('1 + 2;', { updates });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = 1 + 2;
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
});

test("Don't return declarations.", async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`let a = 10;`, { updates });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'a'
});
let a = 10;
popSourceLocation({
  path: '',
  id: 'a'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Replace control with constant default.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(
    `const length = control('length', 10, 'number');`,
    { updates }
  );
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'length'
});
const length = control('length', 10, 'number');
popSourceLocation({
  path: '',
  id: 'length'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Replace control with constant setting.', async (t) => {
  const updates = {};
  await write('control/', { length: 16 });
  const ecmascript = await toEcmascript(
    `const length = control('length', 10, 'number');`,
    { updates }
  );
  // FIX: This should retrieve 16.
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'length'
});
const length = control('length', 10, 'number');
popSourceLocation({
  path: '',
  id: 'length'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Control can be used with cached output.', async (t) => {
  await write('control/', { length: 16 });
  await write('data/def//foo', 1);
  await write('meta/def//foo', {
    sha: '3b47f5704826b7544ce6724559603a63199f9b0e',
    type: 'Shape',
  });
  const updates = {};
  const replays = [];
  await toEcmascript(
    `
const length = control('length', 10, 'number');
const foo = bar(length);`,
    { updates, replays }
  );
  // FIX: This should get back 16.
  t.deepEqual(replays, [
    `
try {
pushSourceLocation({
  path: '',
  id: 'length'
});
const length = control('length', 10, 'number');
popSourceLocation({
  path: '',
  id: 'length'
});
const foo = await loadGeometry('data/def//foo');
Object.freeze(foo);
pushSourceLocation({
  path: '',
  id: 'foo'
});
await replayRecordedNotes('', 'foo');
popSourceLocation({
  path: '',
  id: 'foo'
});
return {};

} catch (error) { throw error; }
`,
  ]);
});

test('Bind await to calls properly.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`foo().bar()`, { updates });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = foo().bar();
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
});

test('Top level await.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`await foo()`, { updates });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = await foo();
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
});

test('Wrap on long implicit return expression is not malformed.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(
    `
foo();
// Hello.
await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
`,
    { updates }
  );
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = foo();
popSourceLocation({
  path: '',
  id: '$1'
});
pushSourceLocation({
  path: '',
  id: '$2'
});
const $2 = await bar({
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1
}, 2);
popSourceLocation({
  path: '',
  id: '$2'
});
return {};

} catch (error) { throw error; }
`
  );
});

test('Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('import { foo } from "bar";', {
    updates,
  });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'foo'
});
const foo = (await importModule('bar')).foo;
popSourceLocation({
  path: '',
  id: 'foo'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Definition', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(
    'const a = 1; const b = () => 2; function c () {}',
    { updates }
  );
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'a'
});
const a = 1;
popSourceLocation({
  path: '',
  id: 'a'
});
pushSourceLocation({
  path: '',
  id: 'b'
});
const b = () => 2;
popSourceLocation({
  path: '',
  id: 'b'
});
function c() {}
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Reference', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(
    'const a = 1; const b = () => a; const c = () => b();',
    { updates }
  );
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'a'
});
const a = 1;
popSourceLocation({
  path: '',
  id: 'a'
});
pushSourceLocation({
  path: '',
  id: 'b'
});
const b = () => a;
popSourceLocation({
  path: '',
  id: 'b'
});
pushSourceLocation({
  path: '',
  id: 'c'
});
const c = () => b();
popSourceLocation({
  path: '',
  id: 'c'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Default Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('import Foo from "bar";', { updates });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: 'Foo'
});
const Foo = (await importModule('bar')).default;
popSourceLocation({
  path: '',
  id: 'Foo'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

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
pushSourceLocation({
  path: '',
  id: 'Foo'
});
const Foo = (await importModule('bar')).default;
popSourceLocation({
  path: '',
  id: 'Foo'
});
pushSourceLocation({
  path: '',
  id: 'foo'
});
const foo = Foo();
popSourceLocation({
  path: '',
  id: 'foo'
});
return {};

} catch (error) { throw error; }
`
  );
});

test('Unassigned Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('import "bar";', { updates });
  t.is(
    ecmascript,
    `
try {
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = await importModule('bar');
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {});
});

test('Reuse and Redefine', async (t) => {
  // Establish
  await write('data/def//A', 1);
  await write('meta/def//A', {
    sha: 'd20ea9544ceb910f702b8ab8167cbe3e5fb7a2a2',
  });

  // Reuse
  const updates = {};
  const reuse = await toEcmascript(
    'const A = Circle(); const B = () => 2; function C () {}',
    { updates }
  );
  t.is(
    reuse,
    `
try {
pushSourceLocation({
  path: '',
  id: 'A'
});
const A = Circle();
popSourceLocation({
  path: '',
  id: 'A'
});
pushSourceLocation({
  path: '',
  id: 'B'
});
const B = () => 2;
popSourceLocation({
  path: '',
  id: 'B'
});
function C() {}
return {};

} catch (error) { throw error; }
`
  );

  const reupdates = {};
  // Redefine
  const redefine = await toEcmascript(
    'const A = bar(); const B = () => 2; function C () {}',
    { updates: reupdates }
  );
  t.is(
    redefine,
    `
try {
pushSourceLocation({
  path: '',
  id: 'A'
});
const A = bar();
popSourceLocation({
  path: '',
  id: 'A'
});
pushSourceLocation({
  path: '',
  id: 'B'
});
const B = () => 2;
popSourceLocation({
  path: '',
  id: 'B'
});
function C() {}
return {};

} catch (error) { throw error; }
`
  );
});

test('Indirect Redefinition', async (t) => {
  // Establish
  await write('data/def//D', 1);
  await write('meta/def//D', {
    sha: '132b04f13d83839780310820e22fa068e6e12f3b',
  });
  await write('data/def//E', 1);
  await write('meta/def//E', {
    sha: '91c534153aa9d64e620465cee99c4fa0739c4472',
  });

  // Demonstrate reuse.
  const updates = {};
  const reuse = await toEcmascript('const D = foo(); const E = () => D;', {
    updates,
  });
  t.is(
    reuse,
    `
try {
pushSourceLocation({
  path: '',
  id: 'D'
});
const D = foo();
popSourceLocation({
  path: '',
  id: 'D'
});
pushSourceLocation({
  path: '',
  id: 'E'
});
const E = () => D;
popSourceLocation({
  path: '',
  id: 'E'
});
return {};

} catch (error) { throw error; }
`
  );
});

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
pushSourceLocation({
  path: '',
  id: 'mountainView'
});
await replayRecordedNotes('', 'mountainView');
popSourceLocation({
  path: '',
  id: 'mountainView'
});
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = mountainView.frontView({
  position: [0, -100, 50]
});
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
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
pushSourceLocation({
  path: '',
  id: 'mountainView'
});
await replayRecordedNotes('', 'mountainView');
popSourceLocation({
  path: '',
  id: 'mountainView'
});
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = mountainView.frontView({
  position: [0, -100, 50]
});
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
});

test('Top level definitions are frozen', async (t) => {
  const updates = {};
  const script = await toEcmascript(
    `
const a = [];
log(a);
`,
    { updates }
  );
  t.is(
    script,
    `
try {
pushSourceLocation({
  path: '',
  id: 'a'
});
const a = [];
popSourceLocation({
  path: '',
  id: 'a'
});
pushSourceLocation({
  path: '',
  id: '$1'
});
const $1 = log(a);
popSourceLocation({
  path: '',
  id: '$1'
});
return {};

} catch (error) { throw error; }
`
  );
});
