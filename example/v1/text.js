import { loadFont, text, writeStl } from '@jsxcad/api-v1';

Error.stackTraceLimit = Infinity;

const greatVibes = loadFont({ path: './great-vibes/GreatVibes-Regular.ttf' });

export const getParameterDefinitions = () => [
  { name: 'text', initial: 30, caption: 'Length', type: 'text' }
];

export const main = ({ string = 'JSxCAD' }) => {
  const letters = text({ font: greatVibes, curveSegments: 32 }, string);
  const solid = letters.extrude({ height: 10 }).translate([-170, -20, 0]);

  writeStl({ path: 'tmp/text.stl' }, solid);
};
