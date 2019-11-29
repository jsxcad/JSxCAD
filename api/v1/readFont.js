import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { toFont } from '@jsxcad/algorithm-text';

/**
 *
 * # Read Font
 *
 * readFont reads in a font and produces a function that renders text as a surface with that font.
 *
 * The rendering function takes an option defaulting to { emSize = 10 } and a string of text.
 * This means that one M is 10 mm in height.
 *
 * ::: illustration { "view": { "position": [-50, -50, 50] } }
 * ```
 * const greatVibes = await readFont({ path: 'font/great-vibes/GreatVibes-Regular.ttf' });
 * greatVibes({ emSize: 20 }, "M").extrude(5).rotateX(90).above().center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 100] } }
 * ```
 * const greatVibes = await readFont({ path: 'font/great-vibes/GreatVibes-Regular.ttf' });
 * greatVibes({ emSize: 10 }, "M").center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 100] } }
 * ```
 * const greatVibes = await readFont({ path: 'font/great-vibes/GreatVibes-Regular.ttf' });
 * greatVibes({ emSize: 20 }, "M").center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * const greatVibes = await readFont({ path: 'font/great-vibes/GreatVibes-Regular.ttf' });
 * greatVibes({ emSize: 16 }, "CA").center()
 * ```
 * :::
 *
 **/

export const readFont = async (options = {}) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { name, path } = options;
  let data = await readFile({ as: 'bytes', ...options }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'bytes', sources: getSources(`cache/${path}`), ...options }, `cache/${path}`);
  }
  const font = toFont({ name }, data);
  const textToShape = ({ emSize = 10 }, text) => Shape.fromGeometry(font({ emSize }, text));
  return textToShape;
};
