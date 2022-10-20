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
    { imports, exports, updates, replays, noLines: true }
  );

  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [
        `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('gearPlan.js');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'a0e5e2505c6fede89345441e86bc82293af7b8c6',
  line: 1
});

const Gear = await $run(async () => {
  const Gear = () => Plan('Gear');
  ;
  return Gear;
}, {
  path: '',
  id: 'Gear',
  text: undefined,
  sha: '2fd607ad184c7b4fd4910a3696ce631b3f0ea790',
  line: 4
});

return {
  Gear
};


} catch (error) { throw error; }
`,
      ],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['$1', 'importModule'],
          imports: ['gearPlan.js'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('gearPlan.js');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'a0e5e2505c6fede89345441e86bc82293af7b8c6',
  line: 1
});


} catch (error) { throw error; }
`,
        },
        Gear: {
          dependencies: ['$1', 'Plan'],
          imports: ['gearPlan.js'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('gearPlan.js');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'a0e5e2505c6fede89345441e86bc82293af7b8c6',
  line: 1
});

const Gear = await $run(async () => {
  const Gear = () => Plan('Gear');
  ;
  return Gear;
}, {
  path: '',
  id: 'Gear',
  text: undefined,
  sha: '2fd607ad184c7b4fd4910a3696ce631b3f0ea790',
  line: 4
});


} catch (error) { throw error; }
`,
        },
      },
    }
  );
});
