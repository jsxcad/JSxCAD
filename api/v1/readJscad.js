import { Shape } from './Shape';
import { readFile } from '@jsxcad/sys';
import { scriptToOperator } from '@jsxcad/convert-jscad';

export const readJscad = async ({ path, script }) => {
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile(path);
    }
  }
  const { getGeometry, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    return Shape.fromGeometry(getGeometry(parameters));
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};
