import { Shape } from "./Shape";
import { cacheShape } from "./writeShape";
import { readFile } from "@jsxcad/sys";

export const readShape = async (
  path,
  build,
  { ephemeral = false, src } = {}
) => {
  let data = await readFile({ ephemeral }, `source/${path}`);
  if (data === undefined && src) {
    data = await readFile({ sources: [src], ephemeral }, `cache/${path}`);
  }
  if (data === undefined && build !== undefined) {
    data = await readFile({ ephemeral }, `cache/${path}`);
    if (data !== undefined) {
      return Shape.fromGeometry(data);
    }
    const shape = await build();
    if (!ephemeral) {
      await cacheShape(shape, path);
    }
    return shape;
  }
  return Shape.fromGeometry(data);
};

export default readShape;
