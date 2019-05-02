import { assemble, cube, sphere, writeThreejsPage } from '@jsxcad/api-v1';

const script = `
// HOWTO
//
// Shift-Enter to render.
// PageUp and PageDown to cycle windows.

const x = assemble(sphere().as('a'),
                   cube({ size: 1, center: true }).translate([0.5, 0.5, 0.5]).as('b'),
                   cube({ size: 1, center: true }).translate([0.5, 0, 0]).as('c'));

writeStl({ path: 'assembly' }, x);
writeStl({ path: 'sphere' }, x.toSolid({ requires: ['a'] }));
`;

export const main = async () => {
  const x = assemble(sphere().as('a'),
                     cube({ size: 1, center: true }).translate([0.5, 0.5, 0.5]).as('b'),
                     cube({ size: 1, center: true }).translate([0.5, 0, 0]).as('c'));
  await writeThreejsPage({ path: 'tmp/app.html', includeEditor: true, includeEvaluator: true, initialScript: script, initialPage: 'assembly', previewPage: 'assembly' }, x);
};
