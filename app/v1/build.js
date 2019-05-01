import { toThreejsPage } from '@jsxcad/convert-threejs';
import { writeFileSync } from 'fs';

const script = `
// HOWTO
//
// Shift-Enter to render.
// PageUp and PageDown to cycle windows.

let x = assemble(sphere().as('a'),
                 cube({ size: 1, center: true }).translate([0.5, 0.5, 0.5]).as('b'),
                 cube({ size: 1, center: true }).translate([0.5, 0, 0]).as('c'));

writeStl({ path: 'assembly' }, x);
writeStl({ path: 'sphere' }, x.toSolid({ requires: ['a'] }));
`;

toThreejsPage({ includeEditor: true, includeEvaluator: true, initialScript: script }, {})
    .then(page => writeFileSync('dist/app.html', page))
    .catch(error => { throw error; });
