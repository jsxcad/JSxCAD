const signatures = {
  ".bom": {
    input: { type: "shape" },
    argument: [{ name: "bomItem", type: "bomItem" }],
    output: { type: "shape" },
  },
  assemble: { rest: { name: "shape", type: "shape" } },
  Circle: {
    argument: [{ name: "radius", type: "number", value: 1 }],
    parameter: [{ name: "sides", type: "number", value: 32 }],
  },
  "Circle.ofDiameter": {
    argument: [{ name: "diameter", type: "number", value: 1 }],
    parameter: [{ name: "sides", type: "number", value: 32 }],
  },
  ".color": {
    input: { type: "shape" },
    argument: [{ name: "name", type: "string" }],
    output: { type: "shape" },
  },
  ".extrude": {
    input: { type: "shape" },
    argument: [
      { name: "height", type: "number", value: 1 },
      { name: "depth", type: "number", value: 0 },
    ],
    parameter: [
      { name: "twist", type: "number", value: 0 },
      { name: "steps", type: "number", value: 1 },
    ],
    output: { type: "shape" },
  },
  Square: {
    argument: [
      { name: "length", type: "number", value: 1 },
      { name: "width", type: "number", value: 1 },
    ],
    output: { type: "shape" },
  },
  ".move": {
    input: { type: "shape" },
    argument: [
      { name: "x", type: "number" },
      { name: "y", type: "number" },
      { name: "z", type: "number" },
    ],
    output: { type: "shape" },
  },
};

const toCall = (op, node, toInRef) => {
  const { input, argument, parameter, rest } = signatures[op];
  let prefix = op;
  if (input) {
    let inRef = toInRef(node, "");
    if (inRef === undefined) {
      // Fall back to 'shape' as being the primary input.
      inRef = toInRef(node, "shape");
    }
    if (inRef === undefined) {
      throw Error("die");
    }
    prefix = `${inRef}${prefix}`;
  }
  const pieces = [];
  if (argument) {
    pieces.push(
      argument.map(({ name, value }) => toInRef(node, name, value)).join(", ")
    );
  }
  if (parameter) {
    pieces.push(
      `{ ${parameter
        .map(({ name, value }) => `${name}: ${toInRef(node, name, value)}`)
        .join(", ")} }`
    );
  }
  if (rest) {
    const { name } = rest;
    for (let nth = 0; ; nth++) {
      const ref = toInRef(node, name, undefined, nth);
      if (ref === undefined) {
        break;
      }
      pieces.push(ref);
    }
  }
  return `${prefix}(${pieces.join(", ")})`;
};

export const toEcmascript = (flow) => {
  const { connections, flowName, nodes } = flow;

  const toFunctionName = (name) => `$$${name.replace(/ /g, "_")}`;

  let nextStatementId = 0;
  const getNextStatementId = (prefix = "v") => `${prefix}${nextStatementId++}`;
  const nextRef = (type) => getNextStatementId(type);
  const definitions = new Map();
  const statements = [];

  const toNode = (nodeId) => {
    for (const node of nodes) {
      if (node.nodeId === nodeId) {
        return node;
      }
    }
  };

  const toConnectionRef = (nodeId, socketId, otherwise) => {
    for (const { input, output } of connections) {
      if (output.nodeId === nodeId && output.socketId === socketId) {
        return toRef(input.nodeId);
      }
    }
    return otherwise;
  };

  const toRef = (nodeId) => {
    const ref = definitions.get(nodeId);
    if (ref === undefined) {
      const node = toNode(nodeId);
      const { input, name, op } = node;

      const toSocketId = (sockets, socketName, nth = 0) => {
        for (const socket of sockets) {
          if (socket.socketName === socketName) {
            if (nth-- === 0) {
              return socket.socketId;
            }
          }
        }
      };

      const toInRef = (node, socketName, otherwise, nth = 0) => {
        const socketId = toSocketId(node.input.sockets, socketName, nth);
        if (socketId === undefined) {
          return otherwise;
        } else {
          return toConnectionRef(node.nodeId, socketId, otherwise);
        }
      };

      const toStatement = (nodeId, code) => {
        const ref = nextRef("$");
        statements.push(`const ${ref} = ${code};`);
        definitions.set(nodeId, ref);
        return ref;
      };

      switch (op.opId) {
        case "Add BOM Tag": {
          return toStatement(nodeId, toCall(".bom", node, toInRef));
        }
        case "Assembly": {
          return toStatement(nodeId, toCall("assemble", node, toInRef));
        }
        case "Circle": {
          return toStatement(
            nodeId,
            toCall("Circle.ofDiameter", node, toInRef)
          );
          // const diameter = toInRef(node, 'diameter', 1);
          // return `Circle.ofDiameter(${diameter})`;
        }
        case "Color": {
          return toStatement(nodeId, toCall(".color", node, toInRef));
        }
        case "Constant": {
          return JSON.stringify(op.parameters.value);
        }
        case "Equation": {
          // FIX: Equation is not regular under the current schema.
          const equation = toInRef(node, "equation", 1);
          const inRefs = input.sockets
            .filter(({ socketName }) => socketName !== "equation")
            .map(({ socketId }) => toConnectionRef(nodeId, socketId));
          return `Equation(${equation}, ${inRefs.join(", ")})`;
        }
        case "Extrude": {
          return toStatement(nodeId, toCall(".extrude", node, toInRef));
        }
        case "GitHubMolecule": {
          // const project = toInRef(node, 'project');
          const inRefs = input.sockets
            .filter(({ socketName }) => socketName !== "project")
            .map(({ socketId }) => toConnectionRef(nodeId, socketId));
          const newRef = nextRef("$");
          // FIX: Import 'project'.
          statements.push(
            `const ${newRef} = ${toFunctionName(name)}(${inRefs.join(", ")});`
          );
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case "Molecule": {
          const inRefs = input.sockets.map(({ socketId }) =>
            toConnectionRef(nodeId, socketId)
          );
          const newRef = nextRef("$");
          statements.push(
            `const ${newRef} = ${toFunctionName(name)}(${inRefs.join(", ")});`
          );
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case "Rectangle": {
          return toStatement(nodeId, toCall("Square", node, toInRef));
        }
        case "Rotate": {
          const shape = toInRef(node, "shape");
          const x = toInRef(node, "x", 0);
          const y = toInRef(node, "y", 0);
          const z = toInRef(node, "z", 0);
          const newRef = nextRef("$");
          // CHECK: semantics.
          statements.push(
            `const ${newRef} = ${shape}.rotate(${x}, ${y}, ${z});`
          );
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case "Translate": {
          return toStatement(nodeId, toCall(".move", node, toInRef));
        }
        case "Output": {
          const inRefs = input.sockets.map(({ socketId }) =>
            toConnectionRef(nodeId, socketId)
          );
          // So, how do we return multiple values?
          statements.push(`return ${inRefs[0]};`);
          return;
        }
        default: {
          throw Error(`die: Unhandled op [${op.opId}]`);
        }
      }
    } else {
      return ref;
    }
  };

  // From the outside, each flow is a function definition.
  for (const node of nodes) {
    if (node.output.sockets.length === 0) {
      toRef(node.nodeId);
    }
  }

  return `const ${toFunctionName(flowName)} = () => {\n  ${statements.join(
    "\n  "
  )}\n};\n`;
};
