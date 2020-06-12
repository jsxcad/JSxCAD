import Shape from "@jsxcad/api-v1-shape";
import { toDxf } from "@jsxcad/convert-dxf";
import { writeFile } from "@jsxcad/sys";

/**
 *
 * # Write DXF
 *
 * ```
 * Cube().section().writeDxf('cube.dxf');
 * ```
 *
 **/

export const writeDxf = async (options, shape) => {
  if (typeof options === "string") {
    // Support writeDxf('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const dxf = await toDxf({ preview: true, ...options }, geometry);
  await writeFile({ doSerialize: false }, `output/${path}`, dxf);
  await writeFile({}, `geometry/${path}`, geometry);
};

const method = function (options = {}) {
  return writeDxf(options, this);
};
Shape.prototype.writeDxf = method;

export default writeDxf;
