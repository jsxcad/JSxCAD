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
  const imports = [];
  const updates = {};
  const replays = {};
  const exports = [];
  await toEcmascript(
    `
import 'blah';
const Mountain = () => foo();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    { imports, updates, replays, exports }
  );

  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        mountainView: {
          dependencies: ['$1', 'Mountain'],
          imports: ['blah'],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', '$1');\n" +
            '\n' +
            "const $1 = await importModule('blah');\n" +
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
            '  line: 4,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const mountainView = Mountain().scale(0.5).Page();\n' +
            "await write('meta/def//mountainView', {\n" +
            "  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',\n" +
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
        $2: {
          dependencies: ['$1', 'mountainView'],
          imports: ['blah'],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', '$1');\n" +
            '\n' +
            "const $1 = await importModule('blah');\n" +
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
            'const $2 = mountainView.frontView({\n' +
            '  position: [0, -100, 50]\n' +
            '});\n' +
            "await write('meta/def//$2', {\n" +
            "  sha: '46ba2bee79153c17eef85ba46ecea6f9168c571f',\n" +
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
      replays: {
        $1: {
          dependencies: ['$1', 'importModule'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', '$1');\n" +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        Mountain: {
          dependencies: ['$1', 'foo'],
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
  const reupdates = {};
  const rereplays = {};
  const reexports = [];
  await toEcmascript(
    `
const Mountain = () => bar();
const mountainView = Mountain().scale(0.5).Page();
mountainView.frontView({ position: [0, -100, 50] });
`,
    {
      imports: reimports,
      updates: reupdates,
      replays: rereplays,
      exports: reexports,
    }
  );

  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [],
      updates: {
        mountainView: {
          dependencies: ['$1', 'Mountain'],
          imports: ['blah'],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', '$1');\n" +
            '\n' +
            "const $1 = await importModule('blah');\n" +
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
            '  line: 4,\n' +
            '  column: 0\n' +
            '});\n' +
            '\n' +
            'const mountainView = Mountain().scale(0.5).Page();\n' +
            "await write('meta/def//mountainView', {\n" +
            "  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',\n" +
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
        $2: {
          dependencies: ['$1', 'mountainView'],
          imports: ['blah'],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', '$1');\n" +
            '\n' +
            "const $1 = await importModule('blah');\n" +
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
            'const $2 = mountainView.frontView({\n' +
            '  position: [0, -100, 50]\n' +
            '});\n' +
            "await write('meta/def//$2', {\n" +
            "  sha: '46ba2bee79153c17eef85ba46ecea6f9168c571f',\n" +
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
      replays: {
        $1: {
          dependencies: ['$1', 'importModule'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            "await replayRecordedNotes('', '$1');\n" +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
        Mountain: {
          dependencies: ['$1', 'foo'],
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
