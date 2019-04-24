import { CSG } from './CSG';
import { assemble } from './assemble';
import { scriptToOperator } from '@jsxcad/convert-jscad';
import { readFile } from '@jsxcad/sys';
import { toSolid } from '@jsxcad/algorithm-assembly';

export const readJscad = async ({ path, script }) => {
  if (script === undefined) {
    if (path !== undefined) {
      script = await readFile(path);
    }
  }
  const { getAssembly, getParameterDefinitions } = await scriptToOperator({}, script);
  const jscadOp = (parameters) => {
    const assembly = getAssembly(parameters);
    return assemble(CAG.fromSurface(toSurface({}, assembly)),
                    CSG.fromSolid(toSolid({}, assembly)),
                    Path2D.fromPaths(toPaths({}, assembly)));
  };
  jscadOp.getParameterDefinitions = getParameterDefinitions;
  return jscadOp;
};
