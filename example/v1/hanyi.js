import { loadFont, text, writePdf, writeStl } from '@jsxcad/api-v1';

const hanyi = loadFont({ path: './hanyi/HanyiSentyTang.ttf' });

export const main = ({ string = '福' }) => {
  const surface = text({ font: hanyi, curveSegments: 4 }, string);
console.log(`QQ/surface: ${JSON.stringify(surface)}`);
  const extrusion = surface.extrude({ height: 5 });
console.log(`QQ/extrusion: ${JSON.stringify(extrusion)}`);
  writePdf({ path: 'tmp/hanyi.pdf' }, surface);
  writeStl({ path: 'tmp/hanyi.stl' }, surface.extrude({ height: 5 }));
};
