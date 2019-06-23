import * as api from './api';

import { fromPolygons } from '@jsxcad/geometry-solid';
import { readFile } from '@jsxcad/sys';
import recast from 'recast';
import types from 'ast-types';

const unpackApi = (api) => {
  const operators = {};
  for (const domain of Object.keys(api)) {
    for (const library of Object.keys(api[domain])) {
      for (const operator of Object.keys(api[domain][library])) {
        operators[operator] = api[domain][library][operator];
      }
    }
  }
  return operators;
};

const operators = unpackApi(api);

const csgToSolid = (csg) =>
  fromPolygons({}, csg.polygons.map(polygon =>
    polygon.vertices.map(vertex =>
      [vertex.pos.x, vertex.pos.y, vertex.pos.z])));

const createJscadFunction = (script, operators) => {
  const { main, getParameterDefinitions } =
      new Function(`{ ${Object.keys(operators).join(', ')} }`,
                   `
                    function getParameterDefinitions () { return []; }
                    ${script};
                    return { main, getParameterDefinitions };
                   `
      )(operators);
  const getGeometry = (params) => {
    const output = main(params);
    const result = { assembly: [] };
    if (output.polygons) {
      result.assembly.push({ solid: csgToSolid(output) });
    }
    return result;
  };
  return { getGeometry, getParameterDefinitions };
};

const replaceIncludes = async (ast) => {
  const includes = [];
  // Look for include("foo") statements and replace them with the content of "foo".
  types.visit(ast, {
    visitCallExpression: function (path) {
      const { node } = path;
      const { callee } = node;
      const { name } = callee;
      if (name === 'include' && node.arguments.length >= 1) {
        const { type } = node.arguments[0];
        if (type === 'Literal') {
          includes.push(path);
        }
      }
      this.traverse(path);
    }
  });
  for (const include of includes) {
    const path = include.node.arguments[0].value;
    include.replace(await replaceIncludes(recast.parse(await readFile({ path, sources: [path] }))));
  }
  return ast;
};

export const scriptToOperator = async (options = {}, script) =>
  replaceIncludes(recast.parse(script))
      .then(ast => createJscadFunction(recast.print(ast).code, operators))
      .catch(error => console.log(error));
