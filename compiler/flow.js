export const toEcmascript = (flow) => {
  const { connections, flowName, nodes } = flow;

  const toFunctionName = (name) => `build${name.replace(/ /g, '')}`;

  let nextStatementId = 0;
  const getNextStatementId = (prefix = 'v') => `${prefix}${nextStatementId++}`;
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

      const toSocketId = (sockets, socketName) => {
        for (const socket of sockets) {
          if (socket.socketName === socketName) {
            return socket.socketId;
          }
        }
      };

      const toInRef = (node, socketName, otherwise) => {
        const socketId = toSocketId(node.input.sockets, socketName);
        if (socketId === undefined) {
          return otherwise;
        } else {
          return toConnectionRef(node.nodeId, socketId, otherwise);
        }
      };

      switch (op.opId) {
        case 'Add BOM Tag': {
          const shape = toInRef(node, 'shape');
          const bomItem = toInRef(node, 'bomItem');
          const newRef = nextRef('$');
          statements.push(`const ${newRef} = ${shape}.bom(${bomItem});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Assembly': {
          const inRefs = input.sockets.map(({ socketId }) => toConnectionRef(nodeId, socketId));
          const newRef = nextRef('$');
          statements.push(`const ${newRef} = assemble(${inRefs.join(', ')});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Circle': {
          const diameter = toInRef(node, 'diameter', 1);
          return `Circle.ofDiameter(${diameter})`;
        }
        case 'Color': {
          const name = toInRef(node, 'name');
          const shape = toInRef(node, 'shape');
          const newRef = nextRef('$');
          statements.push(`const ${newRef} = ${shape}.color(${name});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Constant': {
          return JSON.stringify(op.parameters.value);
        }
        case 'Equation': {
          const equation = toInRef(node, 'equation', 1);
          const inRefs = input.sockets.filter(({ socketName }) => socketName !== 'equation')
              .map(({ socketId }) => toConnectionRef(nodeId, socketId));
          return `Equation(${equation}, ${inRefs.join(', ')})`;
        }
        case 'Extrude': {
          const height = toInRef(node, 'height');
          const shape = toInRef(node, 'shape');
          const newRef = nextRef('$');
          statements.push(`const ${newRef} = ${shape}.extrude(${height});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'GitHubMolecule': {
          // const project = toInRef(node, 'project');
          const inRefs = input.sockets.filter(({ socketName }) => socketName !== 'project')
              .map(({ socketId }) => toConnectionRef(nodeId, socketId));
          const newRef = nextRef('$');
          // FIX: Import 'project'.
          statements.push(`const ${newRef} = ${toFunctionName(name)}(${inRefs.join(', ')});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Molecule': {
          const inRefs = input.sockets.map(({ socketId }) => toConnectionRef(nodeId, socketId));
          const newRef = nextRef('$');
          statements.push(`const ${newRef} = ${toFunctionName(name)}(${inRefs.join(', ')});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Rectangle': {
          const length = toInRef(node, 'length', 1);
          const width = toInRef(node, 'width', 1);
          return `Square(${length}, ${width})`;
          // const newRef = nextRef('$');
          // statements.push(`const ${newRef} = Square(${length}, ${width});`);
          // definitions.set(nodeId, newRef);
          // return newRef;
        }
        case 'Rotate': {
          const shape = toInRef(node, 'shape');
          const x = toInRef(node, 'x', 0);
          const y = toInRef(node, 'y', 0);
          const z = toInRef(node, 'z', 0);
          const newRef = nextRef('$');
          // CHECK: semantics.
          statements.push(`const ${newRef} = ${shape}.rotate(${x}, ${y}, ${z});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Translate': {
          const args = [toInRef(node, 'x', 0), toInRef(node, 'y', '0'), toInRef(node, 'z', '0')];
          const shape = toInRef(node, 'shape');
          const newRef = nextRef('$');
          statements.push(`const ${newRef} = ${shape}.move(${args.join(', ')});`);
          definitions.set(nodeId, newRef);
          return newRef;
        }
        case 'Output': {
          const inRefs = input.sockets.map(({ socketId }) => toConnectionRef(nodeId, socketId));
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

  return `const ${toFunctionName(flowName)} = () => {\n  ${statements.join('\n  ')}\n};\n`;
};
