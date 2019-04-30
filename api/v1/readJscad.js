import { Assembly } from './Assembly';
import { readFile } from '@jsxcad/sys';
import { scriptToOperator } from '@jsxcad/convert-jscad';

export const readJscad = async ({ path, script }) => {
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile(path);
    }
  }
  const { getAssembly, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    return Assembly.fromGeometry(getAssembly(parameters));
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};
