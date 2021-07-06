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
  const updates = {};
  const ecmascript = await toEcmascript('1 + 2;', { updates });
  t.is(
    ecmascript,
    `
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: [],
      program: `info('define $1');

beginRecordingNotes('', '$1', {
  line: 1,
  column: 0
});

const $1 = 1 + 2;
$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {
  sha: '6cd739b6b0d5172a2164a0bb14d4c99a3cb661f7'
}));

await saveRecordedNotes('', '$1');

`,
    },
  });
});

test("Don't return declarations.", async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`let a = 10;`, { updates });
  t.is(
    ecmascript,
    `
let a = 10;
return {};
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
const length = control('length', 10, 'number');
return {};
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
  t.is(
    ecmascript,
    `
const length = control('length', 16, 'number');
return {};
`
  );
  t.deepEqual(updates, {});
});

test('Control can be used with cached output.', async (t) => {
  await write('control/', { length: 16 });
  await write('data/def//foo', 1);
  await write('meta/def//foo', {
    sha: '8def1b9857f29dfc6864ae9d23f8c56a590192e1',
  });
  const updates = {};
  const ecmascript = await toEcmascript(
    `
const length = control('length', 10, 'number');
const foo = bar(length);`,
    { updates }
  );
  t.is(
    ecmascript,
    `
const length = control('length', 16, 'number');
const foo = await loadGeometry('data/def//foo');
Object.freeze(foo);
await replayRecordedNotes('', 'foo');
return {};
`
  );
  t.deepEqual(updates, {});
});

test('Bind await to calls properly.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`foo().bar()`, { updates });
  t.is(
    ecmascript,
    `
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['foo'],
      program:
        "info('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = foo().bar();\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: 'f1ba20d047a38ae14951a33eb07abc4e8ce86a58'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n",
    },
  });
});

test('Top level await.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`await foo()`, { updates });
  t.is(
    ecmascript,
    `
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['foo'],
      program:
        "info('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = await foo();\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: '2f4394138c05757310464b13560b310c6e092bbe'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n",
    },
  });
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
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
const $2 = await loadGeometry('data/def//$2');
Object.freeze($2);
await replayRecordedNotes('', '$2');
return {};
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['foo'],
      program:
        "info('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = foo();\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: 'cfc22c60c0ee7327c485872b8edd0ca7f0f5a393'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n",
    },
    '/$2': {
      dependencies: ['bar'],
      program:
        "info('define $2');\n\nbeginRecordingNotes('', '$2', {\n  line: 1,\n  column: 0\n});\n\nconst $2 = await bar({\n  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1\n}, 2);\n$2 instanceof Shape && (await saveGeometry('data/def//$2', $2)) && (await write('meta/def//$2', {\n  sha: '2508716645a52f147e0e52d6b5db9aaa2fcd959b'\n}));\n\nawait saveRecordedNotes('', '$2');\n\n",
    },
  });
});

test('Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('import { foo } from "bar";', {
    updates,
  });
  t.is(
    ecmascript,
    `
const {foo} = await importModule('bar');
return {};
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
const a = 1;
const b = () => 2;
function c() {}
return {};
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
const a = 1;
const b = () => a;
const c = () => b();
return {};
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
const Foo = (await importModule('bar')).default;
return {};
`
  );
  t.deepEqual(updates, {});
});

test('Unassigned Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('import "bar";', { updates });
  t.is(
    ecmascript,
    `
await importModule('bar');
return {};
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
const A = await loadGeometry('data/def//A');
Object.freeze(A);
await replayRecordedNotes('', 'A');
const B = () => 2;
function C() {}
return {};
`
  );
  t.deepEqual(updates, {});

  const reupdates = {};
  // Redefine
  const redefine = await toEcmascript(
    'const A = bar(); const B = () => 2; function C () {}',
    { updates: reupdates }
  );
  t.is(
    redefine,
    `
const A = await loadGeometry('data/def//A');
Object.freeze(A);
await replayRecordedNotes('', 'A');
const B = () => 2;
function C() {}
return {};
`
  );
  t.deepEqual(reupdates, {
    '/A': {
      dependencies: ['bar'],
      program:
        "info('define A');\n\nbeginRecordingNotes('', 'A', {\n  line: 1,\n  column: 0\n});\n\nconst A = bar();\nA instanceof Shape && (await saveGeometry('data/def//A', A)) && (await write('meta/def//A', {\n  sha: '998f2a52e6cffab9dfbdadd70971164741f7538f'\n}));\n\nawait saveRecordedNotes('', 'A');\n\n",
    },
  });
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
const D = await loadGeometry('data/def//D');
Object.freeze(D);
await replayRecordedNotes('', 'D');
const E = () => D;
return {};
`
  );
  t.deepEqual(updates, {});
});

test('Reuse', async (t) => {
  // Demonstrate defined case.
  await write('meta/def//mountainView', {
    sha: 'c3b0ad66f1281cd0078066eea1b208fef9ffc133',
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
const Mountain = () => foo();
const mountainView = await loadGeometry('data/def//mountainView');
Object.freeze(mountainView);
await replayRecordedNotes('', 'mountainView');
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['mountainView'],
      program:
        "const Mountain = () => foo();\nconst mountainView = await loadGeometry('data/def//mountainView');\n\nObject.freeze(mountainView);\n\ninfo('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = mountainView.frontView({\n  position: [0, -100, 50]\n});\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: '02a507c50a75df23ccf0d75d1b20c813fffda121'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n",
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
const Mountain = () => bar();
const mountainView = await loadGeometry('data/def//mountainView');
Object.freeze(mountainView);
await replayRecordedNotes('', 'mountainView');
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};
`
  );
  t.deepEqual(reupdates, {
    '/mountainView': {
      dependencies: ['Mountain'],
      program:
        "const Mountain = () => bar();\ninfo('define mountainView');\n\nbeginRecordingNotes('', 'mountainView', {\n  line: 3,\n  column: 0\n});\n\nconst mountainView = Mountain().scale(0.5).Page();\nmountainView instanceof Shape && (await saveGeometry('data/def//mountainView', mountainView)) && (await write('meta/def//mountainView', {\n  sha: 'ff13df28379e2578fac3d15154411d6bf1b707a8'\n}));\n\nawait saveRecordedNotes('', 'mountainView');\n\n",
    },
    '/$1': {
      dependencies: ['mountainView'],
      program:
        "const Mountain = () => bar();\nconst mountainView = await loadGeometry('data/def//mountainView');\n\nObject.freeze(mountainView);\n\ninfo('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = mountainView.frontView({\n  position: [0, -100, 50]\n});\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: '5dfb25d06c9ee5b1dc85dba3e0df726e91f4502b'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n",
    },
  });
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
const a = await loadGeometry('data/def//a');
Object.freeze(a);
await replayRecordedNotes('', 'a');
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};
`
  );
  t.deepEqual(updates, {
    '/a': {
      dependencies: [],
      program:
        "info('define a');\n\nbeginRecordingNotes('', 'a', {\n  line: 2,\n  column: 0\n});\n\nconst a = [];\na instanceof Shape && (await saveGeometry('data/def//a', a)) && (await write('meta/def//a', {\n  sha: '008e21a56df83b743c52799ddf689ac20ea2bb8c'\n}));\n\nawait saveRecordedNotes('', 'a');\n\n",
    },
    '/$1': {
      dependencies: ['log', 'a'],
      program:
        "const a = await loadGeometry('data/def//a');\n\nObject.freeze(a);\n\ninfo('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = log(a);\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: 'febfc480508dc06dad7d4001bede9553949663bc'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n",
    },
  });
});
