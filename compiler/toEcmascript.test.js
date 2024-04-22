import test from 'ava';
import { toEcmascript } from './toEcmascript.js';
import { write } from '@jsxcad/sys';

Error.stackTraceLimit = Infinity;

test('Wrap and return.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `export const foo = (x) => x + 1;
       export const main = async () => {
         let a = 10;
         return circle(foo(a));
       }`,
    { api: { circle: true }, imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [
        `
try {
const foo = await $run(async () => {
  const foo = x => x + 1;
  ;
  return foo;
}, {
  path: '',
  id: 'foo',
  text: undefined,
  sha: '4a895d9c02e128e4fd8a43b06efc39df3250b1dc',
  line: 1
});

const main = await $run(async () => {
  const main = async () => {
    let a = 10;
    return circle(foo(a));
  };
  ;
  return main;
}, {
  path: '',
  id: 'main',
  text: undefined,
  sha: '651c145e8eebd00e06775eb159836571e43964f3',
  line: 2
});

return {
  foo,
  main
};

} catch (error) { throw error; }
`,
      ],
      imports: [],
      replays: {},
      updates: {
        foo: {
          dependencies: ['x'],
          imports: [],
          program: `
try {
const foo = await $run(async () => {
  const foo = x => x + 1;
  ;
  return foo;
}, {
  path: '',
  id: 'foo',
  text: undefined,
  sha: '4a895d9c02e128e4fd8a43b06efc39df3250b1dc',
  line: 1
});

} catch (error) { throw error; }
`,
        },
        main: {
          dependencies: ['circle', 'foo', 'a'],
          imports: [],
          program: `
try {
const foo = await $run(async () => {
  const foo = x => x + 1;
  ;
  return foo;
}, {
  path: '',
  id: 'foo',
  text: undefined,
  sha: '4a895d9c02e128e4fd8a43b06efc39df3250b1dc',
  line: 1
});

const main = await $run(async () => {
  const main = async () => {
    let a = 10;
    return circle(foo(a));
  };
  ;
  return main;
}, {
  path: '',
  id: 'main',
  text: undefined,
  sha: '651c145e8eebd00e06775eb159836571e43964f3',
  line: 2
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Top level expressions become variables.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('1 + 2;', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: [],
          imports: [],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = 1 + 2;
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: '48b5c8f303bf9be4a74927d32e8645d2026c0551',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test("Don't return declarations.", async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`let a = 10;`, {
    api: { control: true, importModule: true },
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        a: {
          dependencies: [],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  let a = 10;
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'ce1303ad3d9b7bcb90607c4697730920731eebfc',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Replace control with constant default.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`const length = control('length', 10, 'number');`, {
    api: { control: true },
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        length: {
          dependencies: ['control'],
          imports: [],
          program: `
try {
const length = await $run(async () => {
  const length = control('length', 10, 'number');
  ;
  return length;
}, {
  path: '',
  id: 'length',
  text: undefined,
  sha: 'fb058c1c6fcdc16667bf48f34fb6f4c49064bac4',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Replace control with constant setting.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await write('control/', { length: 16 });
  await toEcmascript(`const length = control('length', 10, 'number');`, {
    noLines: true,
    imports,
    exports,
    updates,
    replays,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        length: {
          dependencies: ['control'],
          imports: [],
          program: `
try {
const length = await $run(async () => {
  const length = control('length', 16, 'number');
  ;
  return length;
}, {
  path: '',
  id: 'length',
  text: undefined,
  sha: '46f14fb9eb28fb7f8e237d953f786e7268d9714a',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Control can be used with cached output.', async (t) => {
  await write('control/', { length: 16 });
  await write('data/def//foo', 1);
  await write('meta/def//foo', {
    sha: '4f0f243209c365e2118d069625a46cd3e00b14ef',
    type: 'Shape',
  });
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `
const length = control('length', 16, 'number');
const foo = bar(length);`,
    { api: { bar: true, control: true }, imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        length: {
          dependencies: ['control'],
          imports: [],
          program:
            "\ntry {\nconst length = await $run(async () => {\n  const length = control('length', 16, 'number');\n  ;\n  return length;\n}, {\n  path: '',\n  id: 'length',\n  text: undefined,\n  sha: '46f14fb9eb28fb7f8e237d953f786e7268d9714a',\n  line: 2\n});\n\n\n} catch (error) { throw error; }\n",
        },
        foo: {
          dependencies: ['bar', 'length'],
          imports: [],
          program:
            "\ntry {\nconst length = await $run(async () => {\n  const length = control('length', 16, 'number');\n  ;\n  return length;\n}, {\n  path: '',\n  id: 'length',\n  text: undefined,\n  sha: '46f14fb9eb28fb7f8e237d953f786e7268d9714a',\n  line: 2\n});\n\nconst foo = await $run(async () => {\n  const foo = bar(length);\n  ;\n  return foo;\n}, {\n  path: '',\n  id: 'foo',\n  text: undefined,\n  sha: '4f0f243209c365e2118d069625a46cd3e00b14ef',\n  line: 3\n});\n\n\n} catch (error) { throw error; }\n",
        },
      },
      replays: {},
    }
  );
});

test('Bind await to calls properly.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`foo().bar()`, { api: { foo: true }, updates, noLines: true });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['foo'],
          imports: [],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = foo().bar();
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'b08718d8f421b45e986025ccb939932f76a14211',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Top level await.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`await foo()`, {
    api: { foo: true },
    noLines: true,
    imports,
    exports,
    updates,
    replays,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['foo'],
          imports: [],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await foo();
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd751b55431b6f767f78bd2fc357a0294b385d108',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Wrap on long implicit return expression is not malformed.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `
foo();
// Hello.
await bar({ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1 }, 2);
`,
    { api: { bar: true, foo: true }, imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['foo'],
          imports: [],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = foo();
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'ab0e831a1a47f4041adb5864c6e0246cef3debc0',
  line: 2
});

} catch (error) { throw error; }
`,
        },
        $2: {
          dependencies: ['bar'],
          imports: [],
          program: `
try {
const $2 = await $run(async () => {
  const $2 = await bar({
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1
  }, 2);
  ;
  return $2;
}, {
  path: '',
  id: '$2',
  text: undefined,
  sha: '8cb79aea46dc91277b1b6733c4a62998f1e970fa',
  line: 4
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Import', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('import { foo } from "bar";', {
    api: { bar: true, foo: true, importModule: true },
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        foo: {
          dependencies: ['importModule'],
          imports: ['bar'],
          program: `
try {
const foo = await $run(async () => {
  const foo = (await importModule('bar')).foo;
  ;
  return foo;
}, {
  path: '',
  id: 'foo',
  text: undefined,
  sha: '7abdb5e864e76b06e553a96c19528b1b2367604b',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Definition', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('const a = 1; const b = () => 2; function c () {}', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        a: {
          dependencies: [],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  const a = 1;
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',
  line: 1
});

} catch (error) { throw error; }
`,
        },
        b: {
          dependencies: [],
          imports: [],
          program: `
try {
const b = await $run(async () => {
  const b = () => 2;
  ;
  return b;
}, {
  path: '',
  id: 'b',
  text: undefined,
  sha: '2504d846458f7a2204ad1e6084c382111bd08b3b',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Reference', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('const a = 1; const b = () => a; const c = () => b();', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        a: {
          dependencies: [],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  const a = 1;
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',
  line: 1
});

} catch (error) { throw error; }
`,
        },
        b: {
          dependencies: ['a'],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  const a = 1;
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',
  line: 1
});

const b = await $run(async () => {
  const b = () => a;
  ;
  return b;
}, {
  path: '',
  id: 'b',
  text: undefined,
  sha: 'a1c4d611f87b788313eda91ada2774a81e64e0bb',
  line: 1
});

} catch (error) { throw error; }
`,
        },
        c: {
          dependencies: ['b'],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  const a = 1;
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',
  line: 1
});

const b = await $run(async () => {
  const b = () => a;
  ;
  return b;
}, {
  path: '',
  id: 'b',
  text: undefined,
  sha: 'a1c4d611f87b788313eda91ada2774a81e64e0bb',
  line: 1
});

const c = await $run(async () => {
  const c = () => b();
  ;
  return c;
}, {
  path: '',
  id: 'c',
  text: undefined,
  sha: 'b6b2ce926049bb8b928989f1202cf963e041c2ed',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Ordered Reference', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('const a = 1; const b = () => a; const c = () => b();', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  const dependencies = {};
  for (const key of Object.keys(updates)) {
    dependencies[key] = updates[key].dependencies;
  }
  t.deepEqual(dependencies, { a: [], b: ['a'], c: ['b'] });

  const programs = {};
  for (const key of Object.keys(updates)) {
    programs[key] = updates[key].program;
  }
  t.deepEqual(programs, {
    a: "\ntry {\nconst a = await $run(async () => {\n  const a = 1;\n  ;\n  return a;\n}, {\n  path: '',\n  id: 'a',\n  text: undefined,\n  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',\n  line: 1\n});\n\n\n} catch (error) { throw error; }\n",
    b: "\ntry {\nconst a = await $run(async () => {\n  const a = 1;\n  ;\n  return a;\n}, {\n  path: '',\n  id: 'a',\n  text: undefined,\n  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',\n  line: 1\n});\n\nconst b = await $run(async () => {\n  const b = () => a;\n  ;\n  return b;\n}, {\n  path: '',\n  id: 'b',\n  text: undefined,\n  sha: 'a1c4d611f87b788313eda91ada2774a81e64e0bb',\n  line: 1\n});\n\n\n} catch (error) { throw error; }\n",
    c: "\ntry {\nconst a = await $run(async () => {\n  const a = 1;\n  ;\n  return a;\n}, {\n  path: '',\n  id: 'a',\n  text: undefined,\n  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',\n  line: 1\n});\n\nconst b = await $run(async () => {\n  const b = () => a;\n  ;\n  return b;\n}, {\n  path: '',\n  id: 'b',\n  text: undefined,\n  sha: 'a1c4d611f87b788313eda91ada2774a81e64e0bb',\n  line: 1\n});\n\nconst c = await $run(async () => {\n  const c = () => b();\n  ;\n  return c;\n}, {\n  path: '',\n  id: 'c',\n  text: undefined,\n  sha: 'b6b2ce926049bb8b928989f1202cf963e041c2ed',\n  line: 1\n});\n\n\n} catch (error) { throw error; }\n",
  });
});

test('Disordered Reference', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('const b = () => a; const a = 1; const c = () => b();', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  const dependencies = {};
  for (const key of Object.keys(updates)) {
    dependencies[key] = updates[key].dependencies;
  }
  t.deepEqual(dependencies, { b: ['a'], a: [], c: ['b'] });

  const programs = {};
  for (const key of Object.keys(updates)) {
    programs[key] = updates[key].program;
  }

  t.deepEqual(programs, {
    b: "\ntry {\nconst a = await $run(async () => {\n  const a = 1;\n  ;\n  return a;\n}, {\n  path: '',\n  id: 'a',\n  text: undefined,\n  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',\n  line: 1\n});\n\nconst b = await $run(async () => {\n  const b = () => a;\n  ;\n  return b;\n}, {\n  path: '',\n  id: 'b',\n  text: undefined,\n  sha: 'a1c4d611f87b788313eda91ada2774a81e64e0bb',\n  line: 1\n});\n\n\n} catch (error) { throw error; }\n",
    a: "\ntry {\nconst a = await $run(async () => {\n  const a = 1;\n  ;\n  return a;\n}, {\n  path: '',\n  id: 'a',\n  text: undefined,\n  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',\n  line: 1\n});\n\n\n} catch (error) { throw error; }\n",
    c: "\ntry {\nconst a = await $run(async () => {\n  const a = 1;\n  ;\n  return a;\n}, {\n  path: '',\n  id: 'a',\n  text: undefined,\n  sha: 'dbc35e3043908e15573c1657f1dc968d7411d028',\n  line: 1\n});\n\nconst b = await $run(async () => {\n  const b = () => a;\n  ;\n  return b;\n}, {\n  path: '',\n  id: 'b',\n  text: undefined,\n  sha: 'a1c4d611f87b788313eda91ada2774a81e64e0bb',\n  line: 1\n});\n\nconst c = await $run(async () => {\n  const c = () => b();\n  ;\n  return c;\n}, {\n  path: '',\n  id: 'c',\n  text: undefined,\n  sha: 'b6b2ce926049bb8b928989f1202cf963e041c2ed',\n  line: 1\n});\n\n\n} catch (error) { throw error; }\n",
  });
});

test('Default Import', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('import Foo from "bar";', {
    api: { importModule: true },
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        Foo: {
          dependencies: ['importModule'],
          imports: ['bar'],
          program: `
try {
const Foo = await $run(async () => {
  const Foo = (await importModule('bar')).default;
  ;
  return Foo;
}, {
  path: '',
  id: 'Foo',
  text: undefined,
  sha: '3399fa096575d2c783f995a364fe9950b1839a28',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Used Import', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('import Foo from "bar"; const foo = Foo();', {
    api: { importModule: true },
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        Foo: {
          dependencies: ['importModule'],
          imports: ['bar'],
          program: `
try {
const Foo = await $run(async () => {
  const Foo = (await importModule('bar')).default;
  ;
  return Foo;
}, {
  path: '',
  id: 'Foo',
  text: undefined,
  sha: '3399fa096575d2c783f995a364fe9950b1839a28',
  line: 1
});

} catch (error) { throw error; }
`,
        },
        foo: {
          dependencies: ['Foo'],
          imports: ['bar'],
          program: `
try {
const Foo = await $run(async () => {
  const Foo = (await importModule('bar')).default;
  ;
  return Foo;
}, {
  path: '',
  id: 'Foo',
  text: undefined,
  sha: '3399fa096575d2c783f995a364fe9950b1839a28',
  line: 1
});

const foo = await $run(async () => {
  const foo = Foo();
  ;
  return foo;
}, {
  path: '',
  id: 'foo',
  text: undefined,
  sha: '059296860b176e3d5c2b467d41a7cccf84e0ba0a',
  line: 1
});

} catch (error) { throw error; }
`,
        },
      },
    }
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
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  toEcmascript('const D = foo(); const E = () => D;', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  // FIX: What?
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {},
      replays: {},
    }
  );
});

test('Reuse', async (t) => {
  // Demonstrate defined case.
  await write('meta/def//mountainView', {
    sha: 'c3b0ad66f1281cd0078066eea1b208fef9ffc133',
    type: 'Shape',
  });

  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `
const Mountain = () => foo();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['mountainView'],
          imports: [],
          program: `
try {
const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '9844099332903654038735bce39b0bf4d52db958',
  line: 2
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'd184afa8d04d4b8d99e468a5dd039a60baaa60c1',
  line: 3
});

const $1 = await $run(async () => {
  const $1 = mountainView.frontView({
    position: [0, -100, 50]
  });
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: '27ce7cb189f641755d01675e4e37ae332e99316d',
  line: 4
});

} catch (error) { throw error; }
`,
        },
        Mountain: {
          dependencies: ['foo'],
          imports: [],
          program: `
try {
const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '9844099332903654038735bce39b0bf4d52db958',
  line: 2
});

} catch (error) { throw error; }
`,
        },
        mountainView: {
          dependencies: ['Mountain'],
          imports: [],
          program: `
try {
const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '9844099332903654038735bce39b0bf4d52db958',
  line: 2
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'd184afa8d04d4b8d99e468a5dd039a60baaa60c1',
  line: 3
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );

  const reimports = [];
  const reexports = [];
  const reupdates = {};
  const rereplays = {};
  await toEcmascript(
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    {
      imports: reimports,
      exports: reexports,
      updates: reupdates,
      replays: rereplays,
      noLines: true,
    }
  );

  t.deepEqual(
    { reimports, reexports, reupdates, rereplays },
    {
      reexports: [],
      reimports: [],
      rereplays: {},
      reupdates: {
        $1: {
          dependencies: ['mountainView'],
          imports: [],
          program: `
try {
const Mountain = await $run(async () => {
  const Mountain = () => bar();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: 'ce3270865c37b124c55e3fa21acc4ca267626353',
  line: 2
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'b41e235c8552c827b3f72bc6efc72604b76efb43',
  line: 3
});

const $1 = await $run(async () => {
  const $1 = mountainView.frontView({
    position: [0, -100, 50]
  });
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'a6eea3f0de6a3b628c886107d2b5ef2049ba6e03',
  line: 4
});

} catch (error) { throw error; }
`,
        },
        Mountain: {
          dependencies: ['bar'],
          imports: [],
          program: `
try {
const Mountain = await $run(async () => {
  const Mountain = () => bar();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: 'ce3270865c37b124c55e3fa21acc4ca267626353',
  line: 2
});

} catch (error) { throw error; }
`,
        },
        mountainView: {
          dependencies: ['Mountain'],
          imports: [],
          program: `
try {
const Mountain = await $run(async () => {
  const Mountain = () => bar();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: 'ce3270865c37b124c55e3fa21acc4ca267626353',
  line: 2
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'b41e235c8552c827b3f72bc6efc72604b76efb43',
  line: 3
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Top level definitions are frozen', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `
const a = [];
log(a);
`,
    { api: { log: true }, imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['log', 'a'],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  const a = [];
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'c9c5711fc5c3e573ac0f8547ccf0039eb6c164a8',
  line: 2
});

const $1 = await $run(async () => {
  const $1 = log(a);
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: '8c37f48b45318d5a614f794e7baa1a2ef6b8a9d6',
  line: 3
});

} catch (error) { throw error; }
`,
        },
        a: {
          dependencies: [],
          imports: [],
          program: `
try {
const a = await $run(async () => {
  const a = [];
  ;
  return a;
}, {
  path: '',
  id: 'a',
  text: undefined,
  sha: 'c9c5711fc5c3e573ac0f8547ccf0039eb6c164a8',
  line: 2
});

} catch (error) { throw error; }
`,
        },
      },
    }
  );
});

test('Unbound variables are an error if not in api', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await t.throwsAsync(() => toEcmascript(
    `
const a = [];
log(b);
`,
    { imports, exports, updates, replays, noLines: true }
  ), { instanceOf: Error, message: 'Unbound variable: log' });
});

test('Unbound variables are ok if in api', async (t) => {
  const api = { log: true, b: true };
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await t.notThrowsAsync(() => toEcmascript(
    `
const a = [];
log(b);
`,
    { api, imports, exports, updates, replays, noLines: true }));
});

test('Arrow function parameters are not unbound variables', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await t.notThrowsAsync(
    () =>
      toEcmascript(
        `
(a) => a
`,
        { imports, exports, updates, replays, noLines: true }
      )
  );
});
