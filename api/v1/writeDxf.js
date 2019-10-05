import { Shape } from './Shape';
import { toDxf } from '@jsxcad/convert-dxf';
import { writeFile } from '@jsxcad/sys';

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
  if (typeof options === 'string') {
    // Support writeDxf('foo', bar);
    options = { path: options };
  }
  const { path } = options;
  const geometry = shape.toKeptGeometry();
  const dxf = await toDxf({ preview: true, ...options }, geometry);
  await writeFile({}, `file/${path}`, dxf);
  await writeFile({}, `geometry/${path}`, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeDxf(options, this); };

Shape.prototype.writeDxf = method;
