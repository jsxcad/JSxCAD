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
  sha: '0c97e728789dce7f7552ef78cbf0bd9701e74e93'
});

const Gear = await $run(async () => {
  const Gear = () => Plan('Gear');
  ;
  return Gear;
}, {
  path: '',
  id: 'Gear',
  text: undefined,
  sha: 'a1ff55341b3778065ee162ce9465cfa8096a9210'
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
  sha: '0c97e728789dce7f7552ef78cbf0bd9701e74e93'
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
  sha: '0c97e728789dce7f7552ef78cbf0bd9701e74e93'
});

const Gear = await $run(async () => {
  const Gear = () => Plan('Gear');
  ;
  return Gear;
}, {
  path: '',
  id: 'Gear',
  text: undefined,
  sha: 'a1ff55341b3778065ee162ce9465cfa8096a9210'
});


} catch (error) { throw error; }
`,
        },
      },
    }
  );
});
