import { readFile, getSources } from './jsxcad-sys.js';
import Shape from './jsxcad-api-v1-shape.js';
import { scriptToOperator } from './jsxcad-convert-jscad.js';

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

const readJscad = async (options = {}) => {
  if (typeof options === 'string') {
    options = { path: options };
  }
  let { path, script } = options;
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile({ doSerialize: false, ...options }, `source/${path}`);
      if (script === undefined) {
        script = await readFile({ sources: getSources(`cache/${path}`), options }, `cache/${path}`);
      }
    }
  }
  const { getGeometry, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    return Shape.fromGeometry(getGeometry(parameters));
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};

const api = { readJscad };

export default api;
export { readJscad };
