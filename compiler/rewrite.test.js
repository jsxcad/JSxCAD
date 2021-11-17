import { rewrite } from './rewrite.js';
import test from 'ava';

test(`Rewrite Voxels.view('x').`, (t) => {
  const script = `const foo = Voxels([1, 2, 3]).view('x');`;
  const rewritten = rewrite(script, { viewId: 'x', pointToAppend: [4, 5, 6] });
  t.is(rewritten, `const foo = Voxels([1, 2, 3], [4, 5, 6]).view('x');`);
});

test(`Remove point`, (t) => {
  const script = `const foo = Voxels([1, 2, 3], [4, 5, 6]).view('x');`;
  const rewritten = rewrite(script, { viewId: 'x', pointToRemove: [4, 5, 6] });
  t.is(rewritten, `const foo = Voxels([1, 2, 3]).view('x');`);
});

test('Rewrite only the right view.', (t) => {
  const script = `
    const foo = Voxels([1, 2, 3]).view('x');
    const bar = Voxels([1, 2, 3]).view('y');
`;
  const rewritten = rewrite(script, { viewId: 'x', pointToAppend: [4, 5, 6] });
  t.is(
    rewritten,
    `
    const foo = Voxels([1, 2, 3], [4, 5, 6]).view('x');
    const bar = Voxels([1, 2, 3]).view('y');
`
  );
});
