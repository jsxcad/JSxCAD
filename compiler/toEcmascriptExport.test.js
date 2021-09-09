import test from 'ava';
import { toEcmascript } from './toEcmascript.js';

test('Export', async (t) => {
  const imports = [];
  const exports = [];
  const updates = {};
  const replays = {};
  await toEcmascript(
    `
import './gearPlan.js';

export const Gear = () => Plan('Gear');
`,
    { imports, exports, updates, replays }
  );

  t.deepEqual(
    { imports, exports, updates, replays },
    {
      imports: [],
      exports: [
        '\n' +
          'try {\n' +
          "await replayRecordedNotes('', '$1');\n" +
          '\n' +
          "const $1 = await importModule('gearPlan.js');\n" +
          'pushSourceLocation({\n' +
          "  path: '',\n" +
          "  id: 'Gear'\n" +
          '});\n' +
          '\n' +
          "await replayRecordedNotes('', 'Gear');\n" +
          '\n' +
          "const Gear = () => Plan('Gear');\n" +
          'popSourceLocation({\n' +
          "  path: '',\n" +
          "  id: 'Gear'\n" +
          '});\n' +
          '\n' +
          'return {\n' +
          '  Gear\n' +
          '};\n' +
          '\n' +
          '} catch (error) { throw error; }\n',
      ],
      updates: {},
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
        Gear: {
          dependencies: ['$1', 'Plan'],
          imports: [],
          program:
            '\n' +
            'try {\n' +
            'pushSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Gear'\n" +
            '});\n' +
            '\n' +
            "await replayRecordedNotes('', 'Gear');\n" +
            '\n' +
            'popSourceLocation({\n' +
            "  path: '',\n" +
            "  id: 'Gear'\n" +
            '});\n' +
            '\n' +
            '\n' +
            '} catch (error) { throw error; }\n',
        },
      },
    }
  );
});
