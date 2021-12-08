import {
  deleteViewGroupCode,
  rewriteViewGroupOrient,
  rewriteVoxels,
} from './rewrite.js';
import test from 'ava';

Error.stackTraceLimit = Infinity;

test('Rewrite view group orientations by append', (t) => {
  const script = `const foo = Group(Box()).view('x');`;
  const rewritten = rewriteViewGroupOrient(script, {
    viewId: 'x',
    nth: 0,
    at: [1, 2, 3],
    to: [4, 5, 6],
    up: [7, 8, 8],
  });
  t.is(
    rewritten,
    `const foo = Group(Box().orient({
  "at": [1, 2, 3],
  "to": [4, 5, 6],
  "up": [7, 8, 8]
})).view('x');`
  );
});

test('Rewrite view group orientations by delete', (t) => {
  const script = `const foo = Group(Box()).view('x');`;
  const rewritten = deleteViewGroupCode(script, {
    viewId: 'x',
    nth: 0,
  });
  t.is(rewritten, `const foo = Group().view('x');`);
});

test('Rewrite view group orientations by update', (t) => {
  const script = `const foo = Group(Box().orient({ at: [0, 0, 0] })).view('x');`;
  const rewritten = rewriteViewGroupOrient(script, {
    viewId: 'x',
    nth: 0,
    at: [1, 2, 3],
    to: [4, 5, 6],
    up: [7, 8, 8],
  });
  t.is(
    rewritten,
    `const foo = Group(Box().orient({
  "at": [1, 2, 3],
  "to": [4, 5, 6],
  "up": [7, 8, 8]
})).view('x');`
  );
});

test(`Rewrite Voxels.edit('x').`, (t) => {
  const script = `const foo = Voxels([1, 2, 3]).edit('x');`;
  const rewritten = rewriteVoxels(script, {
    editId: 'x',
    pointToAppend: [4, 5, 6],
  });
  t.is(rewritten, `const foo = Voxels([1, 2, 3], [4, 5, 6]).edit('x');`);
});

test(`Remove point`, (t) => {
  const script = `const foo = Voxels([1, 2, 3], [4, 5, 6]).edit('x');`;
  const rewritten = rewriteVoxels(script, {
    editId: 'x',
    pointToRemove: [4, 5, 6],
  });
  t.is(rewritten, `const foo = Voxels([1, 2, 3]).edit('x');`);
});

test('Rewrite only the right edit.', (t) => {
  const script = `
    const foo = Voxels([1, 2, 3]).edit('x');
    const bar = Voxels([1, 2, 3]).edit('y');
`;
  const rewritten = rewriteVoxels(script, {
    editId: 'x',
    pointToAppend: [4, 5, 6],
  });
  t.is(
    rewritten,
    `
    const foo = Voxels([1, 2, 3], [4, 5, 6]).edit('x');
    const bar = Voxels([1, 2, 3]).edit('y');
`
  );
});
