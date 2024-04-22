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
    {
      api: { Plan: true, importModule: true },
      imports,
      exports,
      updates,
      replays,
      noLines: true,
    }
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
  sha: 'c97bb78c095cf0ba76f9fa5943deaf78714381d8',
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
  sha: 'b4bb77b084f0dd1c0c9256cae787356fd58dc70b',
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
  sha: 'c97bb78c095cf0ba76f9fa5943deaf78714381d8',
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
  sha: 'c97bb78c095cf0ba76f9fa5943deaf78714381d8',
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
  sha: 'b4bb77b084f0dd1c0c9256cae787356fd58dc70b',
  line: 4
});


} catch (error) { throw error; }
`,
        },
      },
    }
  );
});
