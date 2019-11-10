import { getSources, readFile } from '@jsxcad/sys';

import { Shape } from './Shape';
import { scriptToOperator } from '@jsxcad/convert-jscad';

/**
 *
 * # Read OpenJSCAD
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * const op = await readJscad({ path: "example001.jscad",
 *                              sources: [{ file: 'jscad/example001.jscad' },
 *                                        { url: 'https://jsxcad.js.org/jscad/example001.jscad' }] });
 * op();
 * ```
 * :::
 *
 **/

export const readJscad = async (options = {}) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  let { path, script } = options;
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile({ sources: getSources(path), options }, `file/${path}`);
    }
  }
  const { getGeometry, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    return Shape.fromGeometry(getGeometry(parameters));
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};
