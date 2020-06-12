import api from "./dist/api";

import { fromPolygons } from "@jsxcad/geometry-solid";
import { readFile } from "@jsxcad/sys";
import recast from "recast";
import types from "ast-types";

const unpackApi = (api) => {
  const operators = {};
  for (const domain of Object.keys(api)) {
    for (const library of Object.keys(api[domain])) {
      operators[library] = api[domain][library];
    }
  }
  return operators;
};

const csgToSolid = (csg) =>
  fromPolygons(
    {},
    csg.polygons.map((polygon) =>
      polygon.vertices.map((vertex) => [
        vertex.pos.x,
        vertex.pos.y,
        vertex.pos.z,
      ])
    )
  );

const createJscadFunction = (script, api) => {
  const parameter = `{ ${Object.keys(api).join(", ")} }`;
  const body = `
                 function getParameterDefinitions () { return []; }
                 ${script};
                 return { main, getParameterDefinitions };
                 `;
  const { main, getParameterDefinitions } = new Function(parameter, body)(api);
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
      if (name === "include" && node.arguments.length >= 1) {
        const { type } = node.arguments[0];
        if (type === "Literal") {
          includes.push(path);
        }
      }
      this.traverse(path);
    },
  });
  for (const include of includes) {
    const path = include.node.arguments[0].value;
    const raw = await readFile({ doSerialize: false, sources: [path] }, path);
    const src = new TextDecoder("utf8").decode(raw);
    include.replace(await replaceIncludes(recast.parse(src)));
  }
  return ast;
};

export const scriptToOperator = async (options = {}, script) => {
  try {
    const src = new TextDecoder("utf8").decode(script);
    const ast = await replaceIncludes(recast.parse(src));
    const operator = createJscadFunction(
      recast.print(ast).code,
      unpackApi(api)
    );
    return operator;
  } catch (e) {
    console.log(e);
  }
};
