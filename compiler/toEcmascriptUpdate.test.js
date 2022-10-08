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
    { imports, updates, replays, exports, noLines: true }
  );

  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['$1', 'importModule'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});


} catch (error) { throw error; }
`,
        },
        $2: {
          dependencies: ['$1', 'mountainView'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});

const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '8004fc2084b4f6da7851dc47e8cb5612edbef602',
  line: 3
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',
  line: 4
});

const $2 = await $run(async () => {
  const $2 = mountainView.frontView({
    position: [0, -100, 50]
  });
  ;
  return $2;
}, {
  path: '',
  id: '$2',
  text: undefined,
  sha: '46ba2bee79153c17eef85ba46ecea6f9168c571f',
  line: 5
});


} catch (error) { throw error; }
`,
        },
        Mountain: {
          dependencies: ['$1', 'foo'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});

const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '8004fc2084b4f6da7851dc47e8cb5612edbef602',
  line: 3
});


} catch (error) { throw error; }
`,
        },
        mountainView: {
          dependencies: ['$1', 'Mountain'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});

const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '8004fc2084b4f6da7851dc47e8cb5612edbef602',
  line: 3
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',
  line: 4
});


} catch (error) { throw error; }
`,
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
      noLines: true,
    }
  );

  t.deepEqual(
    { imports, exports, updates, replays },
    {
      exports: [],
      imports: [],
      replays: {},
      updates: {
        $1: {
          dependencies: ['$1', 'importModule'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});


} catch (error) { throw error; }
`,
        },
        $2: {
          dependencies: ['$1', 'mountainView'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});

const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '8004fc2084b4f6da7851dc47e8cb5612edbef602',
  line: 3
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',
  line: 4
});

const $2 = await $run(async () => {
  const $2 = mountainView.frontView({
    position: [0, -100, 50]
  });
  ;
  return $2;
}, {
  path: '',
  id: '$2',
  text: undefined,
  sha: '46ba2bee79153c17eef85ba46ecea6f9168c571f',
  line: 5
});


} catch (error) { throw error; }
`,
        },
        Mountain: {
          dependencies: ['$1', 'foo'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});

const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '8004fc2084b4f6da7851dc47e8cb5612edbef602',
  line: 3
});


} catch (error) { throw error; }
`,
        },
        mountainView: {
          dependencies: ['$1', 'Mountain'],
          imports: ['blah'],
          program: `
try {
const $1 = await $run(async () => {
  const $1 = await importModule('blah');
  ;
  return $1;
}, {
  path: '',
  id: '$1',
  text: undefined,
  sha: 'd3d743575d242dbbfc82a4d23ded4f43d538977c',
  line: 1
});

const Mountain = await $run(async () => {
  const Mountain = () => foo();
  ;
  return Mountain;
}, {
  path: '',
  id: 'Mountain',
  text: undefined,
  sha: '8004fc2084b4f6da7851dc47e8cb5612edbef602',
  line: 3
});

const mountainView = await $run(async () => {
  const mountainView = Mountain().scale(0.5).Page();
  ;
  return mountainView;
}, {
  path: '',
  id: 'mountainView',
  text: undefined,
  sha: 'dfc411bd02db82d7dc9410873aab460c274d2b01',
  line: 4
});


} catch (error) { throw error; }
`,
        },
      },
    }
  );
});
