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

test('Top level expressions become variables.', async (t) => {
  const ecmascript = await toEcmascript('1 + 2;');
  t.is(
    ecmascript,
    `
info('define $1');
beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});
const $1 = 1 + 2;
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: '6cd739b6b0d5172a2164a0bb14d4c99a3cb661f7'
}));
await saveRecordedNotes('', '$1');
Object.freeze($1);
return {};
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

test('Replace control with constant default.', async (t) => {
  const ecmascript = await toEcmascript(
    `const length = control('length', 10, 'number');`
  );
  t.is(
    ecmascript,
    `
const length = control('length', 10, 'number');
return {};
`
  );
});

test('Replace control with constant setting.', async (t) => {
  await write('control/', { length: 16 });
  const ecmascript = await toEcmascript(
    `const length = control('length', 10, 'number');`
  );
  t.is(
    ecmascript,
    `
const length = control('length', 16, 'number');
return {};
`
  );
});

test('Control can be used with cached output.', async (t) => {
  await write('control/', { length: 16 });
  await write('data/def//foo', 1);
  await write('meta/def//foo', {
    sha: '8def1b9857f29dfc6864ae9d23f8c56a590192e1',
  });
  const ecmascript = await toEcmascript(
    `
const length = control('length', 10, 'number');
const foo = bar(length);`
  );
  t.is(
    ecmascript,
    `
const length = control('length', 16, 'number');
info('define foo');
const foo = await loadGeometry('data/def//foo');
await replayRecordedNotes('', 'foo');
Object.freeze(foo);
return {};
`
  );
});

test('Bind await to calls properly.', async (t) => {
  const ecmascript = await toEcmascript(`foo().bar()`);
  t.is(
    ecmascript,
    `
info('define $1');
beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});
const $1 = foo().bar();
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: 'f1ba20d047a38ae14951a33eb07abc4e8ce86a58'
}));
await saveRecordedNotes('', '$1');
Object.freeze($1);
return {};
`
  );
});

test('Top level await.', async (t) => {
  const ecmascript = await toEcmascript(`await foo()`);
  t.is(
    ecmascript,
    `
info('define $1');
beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});
const $1 = await foo();
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: '2f4394138c05757310464b13560b310c6e092bbe'
}));
await saveRecordedNotes('', '$1');
Object.freeze($1);
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
info('define $1');
beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});
const $1 = foo();
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: 'cfc22c60c0ee7327c485872b8edd0ca7f0f5a393'
}));
await saveRecordedNotes('', '$1');
Object.freeze($1);
info('define $2');
beginRecordingNotes('', '$2', {
  line: 1,
  column: 0
});
const $2 = await bar({
  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1
}, 2);
$2 instanceof Shape && (await saveGeometry('data/def//$2', $2)) && (await write('meta/def//$2', {
  sha: '2508716645a52f147e0e52d6b5db9aaa2fcd959b'
}));
await saveRecordedNotes('', '$2');
Object.freeze($2);
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
info('define A');
const A = await loadGeometry('data/def//A');
await replayRecordedNotes('', 'A');
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
info('define A');
beginRecordingNotes('', 'A', {
  line: 1,
  column: 0
});
const A = bar();
A instanceof Shape && (await saveGeometry('data/def//A', A)) && (await write('meta/def//A', {
  sha: '998f2a52e6cffab9dfbdadd70971164741f7538f'
}));
await saveRecordedNotes('', 'A');
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
info('define D');
const D = await loadGeometry('data/def//D');
await replayRecordedNotes('', 'D');
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
info('define mountainView');
const mountainView = await loadGeometry('data/def//mountainView');
await replayRecordedNotes('', 'mountainView');
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
Object.freeze($1);
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
Object.freeze($1);
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
info('define a');
beginRecordingNotes('', 'a', {
  line: 2,
  column: 0
});
const a = [];
a instanceof Shape && (await saveGeometry('data/def//a', a)) && (await write('meta/def//a', {
  sha: '008e21a56df83b743c52799ddf689ac20ea2bb8c'
}));
await saveRecordedNotes('', 'a');
Object.freeze(a);
info('define $1');
beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});
const $1 = log(a);
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: 'febfc480508dc06dad7d4001bede9553949663bc'
}));
await saveRecordedNotes('', '$1');
Object.freeze($1);
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
