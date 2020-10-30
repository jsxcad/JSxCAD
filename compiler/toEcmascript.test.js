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
const foo = x => x + 1;
const main = async () => {
  let a = 10;
  return circle(foo(a));
};
return {
  foo,
  main
};
`
  );
});

test("Don't return declarations.", async (t) => {
  const ecmascript = await toEcmascript(`let a = 10;`);
  t.is(
    ecmascript,
    `
let a = 10;
return {};
`
  );
});

test('Bind await to calls properly.', async (t) => {
  const ecmascript = await toEcmascript(`foo().bar()`);
  t.is(
    ecmascript,
    `
foo().bar();
return {};
`
  );
});

test('Top level await.', async (t) => {
  const ecmascript = await toEcmascript(`await foo()`);
  t.is(
    ecmascript,
    `
await foo();
return {};
`
  );
});

test('Wrap on long implicit return expression is not malformed.', async (t) => {
  const ecmascript = await toEcmascript(`
foo();
// Hello.
await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
`);
  t.is(
    ecmascript,
    `
foo();
await bar({
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1
}, 2);
return {};
`
  );
});

test('Import', async (t) => {
  const ecmascript = await toEcmascript('import { foo } from "bar";');
  t.is(
    ecmascript,
    `
const {foo} = await importModule('bar');
return {};
`
  );
});

test('Definition', async (t) => {
  const ecmascript = await toEcmascript(
    'const a = 1; const b = () => 2; function c () {}'
  );
  t.is(
    ecmascript,
    `
const a = 1;
const b = () => 2;
function c() {}
return {};
`
  );
});

test('Reference', async (t) => {
  const ecmascript = await toEcmascript(
    'const a = 1; const b = () => a; const c = () => b();'
  );
  t.is(
    ecmascript,
    `
const a = 1;
const b = () => a;
const c = () => b();
return {};
`
  );
});

test('Default Import', async (t) => {
  const ecmascript = await toEcmascript('import Foo from "bar";');
  t.is(
    ecmascript,
    `
const Foo = (await importModule('bar')).default;
return {};
`
  );
});

test('Unassigned Import', async (t) => {
  const ecmascript = await toEcmascript('import "bar";');
  t.is(
    ecmascript,
    `
await importModule('bar');
return {};
`
  );
});

test('Reuse and Redefine', async (t) => {
  // Establish
  await write('data/def//A', 1);
  await write('meta/def//A', {
    sha: 'd20ea9544ceb910f702b8ab8167cbe3e5fb7a2a2',
  });

  // Reuse
  const reuse = await toEcmascript(
    'const A = Circle(); const B = () => 2; function C () {}'
  );
  t.is(
    reuse,
    `
const A = await loadGeometry('data/def//A');
Object.freeze(A);
const B = () => 2;
function C() {}
return {};
`
  );

  // Redefine
  const redefine = await toEcmascript(
    'const A = bar(); const B = () => 2; function C () {}'
  );
  t.is(
    redefine,
    `
const A = bar();
A instanceof Shape && (await saveGeometry('data/def//A', A)) && (await write('meta/def//A', {
  sha: '998f2a52e6cffab9dfbdadd70971164741f7538f'
}));
Object.freeze(A);
const B = () => 2;
function C() {}
return {};
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
  const reuse = await toEcmascript('const D = foo(); const E = () => D;');
  t.is(
    reuse,
    `
const D = await loadGeometry('data/def//D');
Object.freeze(D);
const E = () => D;
return {};
`
  );
});

test('Reuse', async (t) => {
  // Demonstrate defined case.
  await write('meta/def//mountainView', {
    sha: 'c3b0ad66f1281cd0078066eea1b208fef9ffc133',
  });
  const define = await toEcmascript(
    `
const Mountain = () => foo();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`
  );

  t.is(
    define,
    `
const Mountain = () => foo();
const mountainView = await loadGeometry('data/def//mountainView');
Object.freeze(mountainView);
mountainView.frontView({
  position: [0, -100, 50]
});
return {};
`
  );

  const redefine = await toEcmascript(
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`
  );

  t.is(
    redefine,
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView instanceof Shape && (await saveGeometry('data/def//mountainView', mountainView)) && (await write('meta/def//mountainView', {
  sha: 'ff13df28379e2578fac3d15154411d6bf1b707a8'
}));
Object.freeze(mountainView);
mountainView.frontView({
  position: [0, -100, 50]
});
return {};
`
  );
});

test('Top level definitions are frozen', async (t) => {
  const script = await toEcmascript(
    `
const a = [];
log(a);
`
  );
  t.is(
    script,
    `
const a = [];
a instanceof Shape && (await saveGeometry('data/def//a', a)) && (await write('meta/def//a', {
  sha: '008e21a56df83b743c52799ddf689ac20ea2bb8c'
}));
Object.freeze(a);
log(a);
return {};
`
  );
});

test('Top level definitions generate sub-programs', async (t) => {
  const topLevel = new Map();
  await toEcmascript(
    `
let bar = () => 1;
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { topLevel }
  );

  t.deepEqual(topLevel.get('bar').program, 'let bar = () => 1;\n');
  t.deepEqual(
    topLevel.get('Mountain').program,
    'let bar = () => 1;\nconst Mountain = () => bar();\n'
  );
  t.deepEqual(
    topLevel.get('mountainView').program,
    'let bar = () => 1;\nconst Mountain = () => bar();\nconst mountainView = Mountain().scale(0.5).Page();\n'
  );
});
