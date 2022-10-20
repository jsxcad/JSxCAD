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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: '4b8983f4898e6b9f4cfb92f08a304d08d79ef2d7',
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
  sha: '773151240752e3e3ca9c1728f77f45cae8d3ec0e',
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
  sha: '4b9511dba12a4aafb95747dc85f62eda0c1c371c',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: '4b8983f4898e6b9f4cfb92f08a304d08d79ef2d7',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: '4b8983f4898e6b9f4cfb92f08a304d08d79ef2d7',
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
  sha: '773151240752e3e3ca9c1728f77f45cae8d3ec0e',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: '4b8983f4898e6b9f4cfb92f08a304d08d79ef2d7',
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
  sha: '773151240752e3e3ca9c1728f77f45cae8d3ec0e',
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
  sha: '4b9511dba12a4aafb95747dc85f62eda0c1c371c',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: '4b8983f4898e6b9f4cfb92f08a304d08d79ef2d7',
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
  sha: 'c91c0e6809da2db10017941de077eb8e4d7d72f8',
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
  sha: '4b8983f4898e6b9f4cfb92f08a304d08d79ef2d7',
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
  sha: '773151240752e3e3ca9c1728f77f45cae8d3ec0e',
  line: 4
});


} catch (error) { throw error; }
`,
        },
      },
    }
  );
});
