import { rewrite } from './rewrite.js';
import test from 'ava';

test(`Rewrite Voxels.edit('x').`, (t) => {
  const script = `const foo = Voxels([1, 2, 3]).edit('x');`;
  const rewritten = rewrite(script, { editId: 'x', pointToAppend: [4, 5, 6] });
  t.is(rewritten, `const foo = Voxels([1, 2, 3], [4, 5, 6]).edit('x');`);
});

test(`Remove point`, (t) => {
  const script = `const foo = Voxels([1, 2, 3], [4, 5, 6]).edit('x');`;
  const rewritten = rewrite(script, { editId: 'x', pointToRemove: [4, 5, 6] });
  t.is(rewritten, `const foo = Voxels([1, 2, 3]).edit('x');`);
});

test('Rewrite only the right edit.', (t) => {
  const script = `
    const foo = Voxels([1, 2, 3]).edit('x');
    const bar = Voxels([1, 2, 3]).edit('y');
`;
  const rewritten = rewrite(script, { editId: 'x', pointToAppend: [4, 5, 6] });
  t.is(
    rewritten,
    `
    const foo = Voxels([1, 2, 3], [4, 5, 6]).edit('x');
    const bar = Voxels([1, 2, 3]).edit('y');
`
  );
});
