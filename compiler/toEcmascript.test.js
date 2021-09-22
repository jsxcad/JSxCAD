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
    { imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [
        '\n' +
          'try {\n' +
          'pushSourceLocation({\n' +
          "  path: '',\n" +
          "  id: 'foo'\n" +
          '});\n' +
          '\n' +
          "await replayRecordedNotes('', 'foo');\n" +
          '\n' +
          'const foo = x => x + 1;\n' +
          'popSourceLocation({\n' +
          "  path: '',\n" +
          "  id: 'foo'\n" +
          '});\n' +
          '\n' +
          'pushSourceLocation({\n' +
          "  path: '',\n" +
          "  id: 'main'\n" +
          '});\n' +
          '\n' +
          "await replayRecordedNotes('', 'main');\n" +
          '\n' +
          'const main = async () => {\n' +
          '  let a = 10;\n' +
          '  return circle(foo(a));\n' +
          '};\n' +
          'popSourceLocation({\n' +
          "  path: '',\n" +
          "  id: 'main'\n" +
          '});\n' +
          '\n' +
          'return {\n' +
          '  foo,\n' +
          '  main\n' +
          '};\n' +
          '\n' +
          '} catch (error) { throw error; }\n',
      ],
      updates: {},
      replays: {
        foo: {
          dependencies: ['x'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'foo'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'foo');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'foo'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        main: {
          dependencies: ['circle', 'foo', 'a'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'main'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'main');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'main'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
      imports: [],
      exports: [],
      updates: {
        $1: {
          dependencies: [],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = 1 + 2;\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: 'fc6dd8b8d1285cd1edc8c1ffe54b5acb798c7387',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {},
    }
  );
});

test("Don't return declarations.", async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`let a = 10;`, {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {},
      replays: {
        a: {
          dependencies: [],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'a');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {},
      replays: {
        length: {
          dependencies: ['control'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'length');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
      imports: [],
      exports: [],
      updates: {},
      replays: {
        length: {
          dependencies: ['control'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'length');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
    }
  );
});

test('Control can be used with cached output.', async (t) => {
  await write('control/', { length: 16 });
  await write('data/def//foo', 1);
  await write('meta/def//foo', {
    sha: 'cab8606c3133e5d59965bae55412a5f03cb273e2',
    type: 'Shape',
  });
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `
const length = control('length', 10, 'number');
const foo = bar(length);`,
    { imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        foo: {
          dependencies: ['bar', 'length'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'length');\n" +
            '\n' +
            "const length = control('length', 10, 'number');\n" +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            "info('define foo');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'foo'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', 'foo', {\n" +
            '  line: 3,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const foo = bar(length);\n' +
            "await write('meta/def//foo', {\n" +
            "  sha: '3e7b9e179e36b61b3a80476feb39ccaadd685c9a',\n" +
            "  type: foo instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if (foo instanceof Shape) {\n' +
            "  await saveGeometry('data/def//foo', foo);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', 'foo');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'foo'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {
        length: {
          dependencies: ['control'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'length');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'length'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
    }
  );
});

test('Bind await to calls properly.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`foo().bar()`, { updates, noLines: true });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        $1: {
          dependencies: ['foo'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = foo().bar();\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: '7bdff1a1fedd69427b31085d58c342a3b137ece2',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {},
    }
  );
});

test('Top level await.', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(`await foo()`, {
    noLines: true,
    imports,
    exports,
    updates,
    replays,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        $1: {
          dependencies: ['foo'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = await foo();\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: 'a199562e5ab8ffc2534453f164165d3a47fed088',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {},
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
    { imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        $1: {
          dependencies: ['foo'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = foo();\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: '75dd6f574bd4f86fb5fce18b64fe446696ad857e',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        $2: {
          dependencies: ['bar'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "info('define $2');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$2'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$2', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $2 = await bar({\n' +
            '  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagh: 1\n' +
            '}, 2);\n' +
            "await write('meta/def//$2', {\n" +
            "  sha: '7141ae679533db16d1d6c99795f86d3666b901d2',\n" +
            "  type: $2 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($2 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$2', $2);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$2');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$2'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {},
    }
  );
});

test('Import', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('import { foo } from "bar";', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {},
      replays: {
        foo: {
          dependencies: ['importModule'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', 'foo');\n" +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
      imports: [],
      exports: [],
      updates: {},
      replays: {
        a: {
          dependencies: [],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'a');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        b: {
          dependencies: [],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'b'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'b');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'b'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
      imports: [],
      exports: [],
      updates: {},
      replays: {
        a: {
          dependencies: [],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'a');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        b: {
          dependencies: ['a'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'b'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'b');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'b'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        c: {
          dependencies: ['b'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'c'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'c');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'c'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
    }
  );
});

test('Default Import', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript('import Foo from "bar";', {
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {},
      replays: {
        Foo: {
          dependencies: ['importModule'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', 'Foo');\n" +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
    imports,
    exports,
    updates,
    replays,
    noLines: true,
  });
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        foo: {
          dependencies: ['Foo'],
          imports: ['bar'],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', 'Foo');\n" +
            '\n' +
            "const Foo = (await importModule('bar')).default;\n" +
            "info('define foo');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'foo'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', 'foo', {\n" +
            '  line: 1,\n' +
            '  column: 23\n' +
            '});\n' +
            '\n' +
            'const foo = Foo();\n' +
            "await write('meta/def//foo', {\n" +
            "  sha: '8dae1f3b3a9fdc66a5f13c7a0efdc9836d788f99',\n" +
            "  type: foo instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if (foo instanceof Shape) {\n' +
            "  await saveGeometry('data/def//foo', foo);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', 'foo');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'foo'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {
        Foo: {
          dependencies: ['importModule'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', 'Foo');\n" +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
      imports: [],
      exports: [],
      updates: {
        mountainView: {
          dependencies: ['Mountain'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Mountain');\n" +
            '\n' +
            'const Mountain = () => foo();\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "info('define mountainView');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', 'mountainView', {\n" +
            '  line: 3,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const mountainView = Mountain().scale(0.5).Page();\n' +
            "await write('meta/def//mountainView', {\n" +
            "  sha: '6b59399386453161dac45fdfdd094e14b1db745c',\n" +
            "  type: mountainView instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if (mountainView instanceof Shape) {\n' +
            "  await saveGeometry('data/def//mountainView', mountainView);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', 'mountainView');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        $1: {
          dependencies: ['mountainView'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Mountain');\n" +
            '\n' +
            'const Mountain = () => foo();\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "const mountainView = await loadGeometry('data/def//mountainView');\n" +
            '\n' +
            'Object.freeze(mountainView);\n' +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'mountainView');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = mountainView.frontView({\n' +
            '  position: [0, -100, 50]\n' +
            '});\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: '90bc8ca30e592e30bdb5c65df7e0070a4b1b3cdc',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {
        Mountain: {
          dependencies: ['foo'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Mountain');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
      reimports: [],
      reexports: [],
      reupdates: {
        mountainView: {
          dependencies: ['Mountain'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Mountain');\n" +
            '\n' +
            'const Mountain = () => bar();\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "info('define mountainView');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', 'mountainView', {\n" +
            '  line: 3,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const mountainView = Mountain().scale(0.5).Page();\n' +
            "await write('meta/def//mountainView', {\n" +
            "  sha: '1952b6311872fb454d675b9d14b8c53c41c23c57',\n" +
            "  type: mountainView instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if (mountainView instanceof Shape) {\n' +
            "  await saveGeometry('data/def//mountainView', mountainView);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', 'mountainView');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        $1: {
          dependencies: ['mountainView'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Mountain');\n" +
            '\n' +
            'const Mountain = () => bar();\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "const mountainView = await loadGeometry('data/def//mountainView');\n" +
            '\n' +
            'Object.freeze(mountainView);\n' +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'mountainView');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'mountainView'\n" +
            '});\n' +
            '\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = mountainView.frontView({\n' +
            '  position: [0, -100, 50]\n' +
            '});\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: 'f6fbedf20aa75786f6cce70e27e67a1a5f50bc37',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      rereplays: {
        Mountain: {
          dependencies: ['bar'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Mountain');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Mountain'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
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
    { imports, exports, updates, replays, noLines: true }
  );
  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        a: {
          dependencies: [],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "info('define a');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', 'a', {\n" +
            '  line: 2,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const a = [];\n' +
            "await write('meta/def//a', {\n" +
            "  sha: '1e7e49f0bc9af1ba962b5532385c19a95f71f7bb',\n" +
            "  type: a instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if (a instanceof Shape) {\n' +
            "  await saveGeometry('data/def//a', a);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', 'a');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        $1: {
          dependencies: ['log', 'a'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'a');\n" +
            '\n' +
            'const a = [];\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'a'\n" +
            '});\n' +
            '\n' +
            "info('define $1');\n" +
            '\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            "beginRecordingNotes('', '$1', {\n" +
            '  line: 1,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const $1 = log(a);\n' +
            "await write('meta/def//$1', {\n" +
            "  sha: '64b17f788d49d14fcb63a9df334df40f3fc98aa3',\n" +
            "  type: $1 instanceof Shape ? 'Shape' : 'Object'\n" +
            '});\n' +
            '\n' +
            'if ($1 instanceof Shape) {\n' +
            "  await saveGeometry('data/def//$1', $1);\n" +
            '}\n' +
            '\n' +
            "await saveRecordedNotes('', '$1');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: '$1'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
      replays: {},
    }
  );
});
