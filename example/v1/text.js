import { loadFont, text, union, writeStl, writeThreejsPage } from '@jsxcad/api-v1';

const greatVibes = loadFont({ path: './great-vibes/GreatVibes-Regular.ttf' });

export const getParameterDefinitions = () => [
  { name: 'text', initial: 30, caption: 'Length', type: 'text' }
];

export const main = ({ string = 'JSxCAD' }) => {
  const solid = union(text({ font: greatVibes, curveSegments: 32 }, string))
      .extrude({ height: 10 })
      .translate([-170, -20, 0]);

  writeStl({ path: 'tmp/text.stl' }, solid);
  writeThreejsPage({ path: 'tmp/text.html', cameraPosition: [0, 0, 400] }, solid);
};
