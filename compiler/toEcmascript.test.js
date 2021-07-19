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
const foo = x => x + 1;
const main = async () => {
  let a = 10;
  return circle(foo(a));
};
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
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: [],
      program: `
try {
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


} catch (error) { throw error; }
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
try {
let a = 10;
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
const length = control('length', 10, 'number');
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
const length = control('length', 10, 'number');
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
  });
  const updates = {};
  const ecmascript = await toEcmascript(
    `
const length = control('length', 10, 'number');
const foo = bar(length);`,
    { updates }
  );
  // FIX: This should get back 16.
  t.is(
    ecmascript,
    `
try {
const length = control('length', 10, 'number');
const foo = await loadGeometry('data/def//foo');
Object.freeze(foo);
await replayRecordedNotes('', 'foo');
return {};

} catch (error) { throw error; }
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
try {
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['foo'],
      program:
        "\ntry {\ninfo('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = foo().bar();\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: 'f1ba20d047a38ae14951a33eb07abc4e8ce86a58'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n\n} catch (error) { throw error; }\n",
    },
  });
});

test('Top level await.', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript(`await foo()`, { updates });
  t.is(
    ecmascript,
    `
try {
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['foo'],
      program:
        "\ntry {\ninfo('define $1');\n\nbeginRecordingNotes('', '$1', {\n  line: 1,\n  column: 0\n});\n\nconst $1 = await foo();\n$1 instanceof Shape && (await saveGeometry('data/def//$1', $1)) && (await write('meta/def//$1', {\n  sha: '2f4394138c05757310464b13560b310c6e092bbe'\n}));\n\nawait saveRecordedNotes('', '$1');\n\n\n} catch (error) { throw error; }\n",
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
try {
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
const $2 = await loadGeometry('data/def//$2');
Object.freeze($2);
await replayRecordedNotes('', '$2');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['foo'],
      program: `
try {
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


} catch (error) { throw error; }
`,
    },
    '/$2': {
      dependencies: ['bar'],
      program: `
try {
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


} catch (error) { throw error; }
`,
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
try {
const foo = (await importModule('bar')).foo;
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
const a = 1;
const b = () => 2;
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
const a = 1;
const b = () => a;
const c = () => b();
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
const Foo = (await importModule('bar')).default;
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

test('Unassigned Import', async (t) => {
  const updates = {};
  const ecmascript = await toEcmascript('import "bar";', { updates });
  t.is(
    ecmascript,
    `
try {
const $1 = await importModule('bar');
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
const A = await loadGeometry('data/def//A');
Object.freeze(A);
await replayRecordedNotes('', 'A');
const B = () => 2;
function C() {}
return {};

} catch (error) { throw error; }
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
try {
const A = await loadGeometry('data/def//A');
Object.freeze(A);
await replayRecordedNotes('', 'A');
const B = () => 2;
function C() {}
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(reupdates, {
    '/A': {
      dependencies: ['bar'],
      program: `
try {
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


} catch (error) { throw error; }
`,
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
try {
const D = await loadGeometry('data/def//D');
Object.freeze(D);
await replayRecordedNotes('', 'D');
const E = () => D;
return {};

} catch (error) { throw error; }
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
const a = await loadGeometry('data/def//a');
Object.freeze(a);
await replayRecordedNotes('', 'a');
const $1 = await loadGeometry('data/def//$1');
Object.freeze($1);
await replayRecordedNotes('', '$1');
return {};

} catch (error) { throw error; }
`
  );
  t.deepEqual(updates, {
    '/$1': {
      dependencies: ['log', 'a'],
      program: `
try {
const a = await loadGeometry('data/def//a');

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


} catch (error) { throw error; }
`,
    },
    '/a': {
      dependencies: [],
      program: `
try {
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


} catch (error) { throw error; }
`,
    },
  });
});
