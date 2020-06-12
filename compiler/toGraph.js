// FIX: Is this specific to the v1 api? If so, move it there.

import { generate } from "astring";
import { parse } from "acorn";

export const strip = (ast) => {
  if (ast instanceof Array) {
    return ast.map(strip);
  } else if (ast instanceof Object) {
    const stripped = {};
    for (const key of Object.keys(ast)) {
      if (["end", "loc", "start"].includes(key)) {
        continue;
      }
      stripped[key] = strip(ast[key]);
    }
    return stripped;
  } else {
    return ast;
  }
};

export const toGraph = ({ includeSource = false }, script) => {
  let ast = parse(script, {
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    sourceType: "module",
  });

  const strippedAst = strip(ast);

  const identifiers = new Map();
  const findIdentifier = (name) => {
    return identifiers.get(name);
  };
  const addIdentifier = (name, node) => {
    identifiers.set(name, node);
    return node;
  };

  const nodes = {};
  const edges = [];

  let nextNodeId = 0;
  const allocateNodeId = () => {
    return nextNodeId++;
  };
  const allocateNode = (node) => {
    const nodeId = allocateNodeId();
    nodes[nodeId] = node;
    return nodeId;
  };

  const walkExpression = (expression) => {
    const { type } = expression;
    switch (type) {
      case "CallExpression": {
        return allocateNode({
          call: walkExpression(expression.callee),
          arguments: expression.arguments.map(walkExpression),
          source: includeSource ? expression : undefined,
        });
      }
      case "MemberExpression": {
        const { object, property, computed } = expression;
        return allocateNode({
          object: walkExpression(object),
          member: walkExpression(property),
          computed,
          source: includeSource ? expression : undefined,
        });
      }
      case "NumericLiteral": {
        const { value } = expression;
        return allocateNode({
          number: value,
          source: includeSource ? expression : undefined,
        });
      }
      case "Identifier": {
        const { name } = expression;
        const identifier = findIdentifier(name);
        if (identifier === undefined) {
          // Undeclared identifier.
          return addIdentifier(
            name,
            allocateNode({
              identifier: name,
              source: includeSource ? expression : undefined,
            })
          );
        } else {
          return identifier;
        }
      }
    }
  };

  const walkStatement = (entry) => {
    if (entry.type === "ExpressionStatement") {
      walkExpression(entry.expression);
    }
  };

  const walkProgram = (program) => {
    const { body } = program;
    body.forEach(walkStatement);
  };

  walkProgram(strippedAst);

  return { nodes, edges };
};

export const toDot = ({ nodes, edges }) => {
  const dot = [];
  dot.push(`digraph {`);
  const emitEdge = (from, to) => dot.push(`  "${from}" -> "${to}";`);
  for (let nodeId = 0; ; nodeId++) {
    const node = nodes[nodeId];
    if (node === undefined) {
      break;
    }
    const js = generate(node.source);
    dot.push(`  "${nodeId}" [label="${js}"];`);
  }
  for (let nodeId = 0; ; nodeId++) {
    const node = nodes[nodeId];
    if (node === undefined) {
      break;
    }
    if (node.call !== undefined) {
      emitEdge(node.call, nodeId);
    }
    if (node.arguments !== undefined) {
      for (const argument of node.arguments) {
        emitEdge(argument, nodeId);
      }
    }
    if (node.object !== undefined) {
      emitEdge(node.object, nodeId);
    }
    if (node.member !== undefined) {
      emitEdge(node.member, nodeId);
    }
  }
  dot.push(`}`);
  return dot.join("\n");
};
