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
    { api: { bar: true, foo: true, importModule: true }, imports, updates, replays, exports, noLines: true }
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: 'c6dba05ab2e9e9a0c175faf37197439d7e7142d0',
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
  sha: '49ec1c689f206de0b2bcd7635731d86cd8119647',
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
  sha: '8984082e4c388b3e1e38d9dd71f1d48274677c9f',
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: 'c6dba05ab2e9e9a0c175faf37197439d7e7142d0',
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: 'c6dba05ab2e9e9a0c175faf37197439d7e7142d0',
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
  sha: '49ec1c689f206de0b2bcd7635731d86cd8119647',
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
      api: { bar: true },
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: 'c6dba05ab2e9e9a0c175faf37197439d7e7142d0',
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
  sha: '49ec1c689f206de0b2bcd7635731d86cd8119647',
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
  sha: '8984082e4c388b3e1e38d9dd71f1d48274677c9f',
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: 'c6dba05ab2e9e9a0c175faf37197439d7e7142d0',
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
  sha: '56e6eab1c875e7707c162560264252be3aabb98b',
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
  sha: 'c6dba05ab2e9e9a0c175faf37197439d7e7142d0',
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
  sha: '49ec1c689f206de0b2bcd7635731d86cd8119647',
  line: 4
});


} catch (error) { throw error; }
`,
        },
      },
    }
  );
});
