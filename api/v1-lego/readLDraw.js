import Shape from "@jsxcad/api-v1-shape";
import { fromLDraw } from "@jsxcad/convert-ldraw";

/**
 *
 * # Read LDraw Parts
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * await readLDraw({ part: '3004' })
 * ```
 * :::
 *
 **/

export const readLDraw = async (part) =>
  Shape.fromGeometry(await fromLDraw(part));

export default readLDraw;
