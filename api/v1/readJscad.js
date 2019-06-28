import { Shape } from './Shape';
import { readFile } from '@jsxcad/sys';
import { scriptToOperator } from '@jsxcad/convert-jscad';

/**
 *
 * # Read OpenJSCAD
 *
 * ::: illustration { "view": { "position": [-40, -40, 40] } }
 * ```
 * await readJscad({ path: "example001.jscad",
 *                   sources: [{ file: 'jscad/example001.jscad' },
 *                             { url: 'https://jsxcad.js.org/jscad/example001.jscad' }] });
 * ```
 * :::
 *
 **/

export const readJscad = async (options = {}) => {
  let { path, script } = options;
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile(options, path);
    }
  }
  const { getGeometry, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    return Shape.fromGeometry(getGeometry(parameters));
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};
