import { CSG } from './CSG';
import { scriptToOperator } from '@jsxcad/convert-jscad';
import { readFile } from '@jsxcad/sys';

export const readJscad = async ({ path, script }) => {
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile(path);
    }
  }
  const { getAssembly, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    const assembly = getAssembly(parameters);
    // FIX: Move this to an assembly constructor.
    return CSG.fromSolid(assembly[0].solid);
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};
