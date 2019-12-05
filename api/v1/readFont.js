import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { toFont } from '@jsxcad/algorithm-text';

// TODO: (await readFont(...))({ emSize: 16 })("CA");

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
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(20)("M").extrude(5).rotateX(90).above().center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 100] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(10)("M").center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 100] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(20)("M").center()
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * const greatVibes = await readFont('font/great-vibes/GreatVibes-Regular.ttf');
 * greatVibes(16)("CA").center()
 * ```
 * :::
 *
 **/

const toEmSizeFromMm = (mm) => mm * 1.5;

export const readFont = async (path, { flip = false } = {}) => {
  let data = await readFile({ as: 'bytes' }, `source/${path}`);
  if (data === undefined) {
    data = await readFile({ as: 'bytes', sources: getSources(`cache/${path}`) }, `cache/${path}`);
  }
  const font = toFont({ path }, data);
  const xform = flip ? shape => shape.flip() : _ => _;
  const fontFactory = (size = 1) => (text) => Shape.fromGeometry(font({ emSize: toEmSizeFromMm(size) }, text)).op(xform);
  return fontFactory;
};

export default readFont;
