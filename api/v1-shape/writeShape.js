import { Shape } from "./Shape";
import { writeFile } from "@jsxcad/sys";

/**
 *
 * # Write Shape Geometry
 *
 * This writes a shape as a tagged geometry in json format.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeShape('cube.shape');
 * await readShape({ path: 'cube.shape' })
 * ```
 * :::
 *
 **/

export const cacheShape = async (shape, path) => {
  const geometry = shape.toGeometry();
  await writeFile({}, `cache/${path}`, geometry);
};

export const writeShape = async (shape, path) => {
  const geometry = shape.toGeometry();
  await writeFile(
    { doSerialize: false },
    `output/${path}`,
    JSON.stringify(geometry)
  );
  await writeFile({}, `geometry/${path}`, geometry);
};

const writeShapeMethod = function (...args) {
  return writeShape(this, ...args);
};
Shape.prototype.writeShape = writeShapeMethod;

export default writeShape;
