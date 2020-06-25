/*

// Flow
{
  nodes: [
    {
      op: { opId },
      nodeId,
      input: {
        sockets: [{ socketId, socketName, description }],
      },
      output: {
        sockets: [{ socketId, socketName, description }],
      },
    }
  ],
  connections: [
    {
      connectionId,
      input: { nodeId, socketId },
      output: { nodeId, socketId },
    }
  ],
}

*/

const toSocketNameFromDescription = (description) => {
  if (description.startsWith('3D')) return 'shape';
  if (description === 'Equation') return 'equation';
  if (description === 'Project ID') return 'project';
  if (description === 'BOM Item') return 'bomItem';
  if (description === 'Name') return 'name';
  if (description === 'result') return 'result';
  if (description === 'number') return 'number';
  if (description === 'diameter') return 'diameter';
  if (description === 'x-axis degrees') return 'x';
  if (description === 'y-axis degrees') return 'y';
  if (description === 'z-axis degrees') return 'z';
  if (description === 'height') return 'height';
  if (description === 'M') return 'm'; // what is this?
  if (description === 'x length') return 'length';
  if (description === 'y length') return 'width';
  if (description === 'z length') return 'height';
  if (description === 'xDist') return 'x';
  if (description === 'yDist') return 'y';
  if (description === 'zDist') return 'z';
  if (description === 'geometry') return 'shape';
  if (description === 'Geometry') return 'shape';
  if (description === 'number or geometry') return 'value';

  throw Error(`QQ/Unknown socket description: [${description}]`);
};

export const toFlows = (data) => {
  const flows = [];
  const { molecules } = data;
  let nextId = 0;
  for (const moleculeDefinition of molecules) {
    const { allAtoms, allConnectors, name, uniqueID } = moleculeDefinition;
    const flow = {
      nodes: [],
      connections: [],
      flowId: uniqueID,
      flowName: name,
    };

    const nodeIdByMoleculeId = new Map();
    const toNodeId = (moleculeId) => {
      const nodeId = nodeIdByMoleculeId.get(moleculeId);
      if (nodeId === undefined) throw Error(`die: ${moleculeId}`);
      return nodeId;
    };
    const nodeById = new Map();
    const toNode = (nodeId) => {
      const node = nodeById.get(nodeId);
      if (node === undefined) throw Error(`die: ${nodeId}`);
      return node;
    };
    const getNextId = (tag) => `${tag}_${nextId++}`;

    const atomFingerprints = new Set();

    const emitAtom = (atom) => {
      let { atomType, name, projectID, x, y, uniqueID, ioValues } = atom;

      // Deduplicate atoms
      const fingerprint = uniqueID;
      if (atomFingerprints.has(fingerprint)) {
        return;
      } else {
        atomFingerprints.add(fingerprint);
      }

      const nodeId = getNextId('node');
      if (uniqueID === undefined) {
        if (atomType === 'Output') {
          // Why is this missing?
          uniqueID = 'Output';
        } else {
          throw Error('die');
        }
      }
      nodeIdByMoleculeId.set(uniqueID, nodeId);
      const legacyId = uniqueID;
      const node = {
        op: { opId: atomType, parameters: {} },
        name,
        nodeId,
        legacyId,
        input: { sockets: [] },
        output: { sockets: [] },
        metadata: { projectID, x, y },
      };
      switch (atom.atomType) {
        case 'Add BOM Tag': {
          const ioValue = atom.BOMitem;
          const description = 'BOM Item';
          const socketId = getNextId('socket');
          const socketName = toSocketNameFromDescription(description);
          node.input.sockets.push({
            socketId,
            socketName,
            description,
            pendingIoValue: ioValue,
          });
          break;
        }
        case 'Color': {
          const ioValue = [
            'Powder blue',
            'White',
            'Red',
            'Steel blue',
            'Yellow',
            'Brown',
            'Cyan',
            'Green',
            'Pink',
            'Blue',
            'Silver',
            'Black',
            'Keep Out',
          ][atom.selectedColorIndex];
          const description = 'Name';
          const socketId = getNextId('socket');
          const socketName = toSocketNameFromDescription(description);
          node.input.sockets.push({
            socketId,
            socketName,
            description,
            pendingIoValue: ioValue,
          });
          break;
        }
        case 'GitHubMolecule': {
          const ioValue = atom.projectID;
          const description = 'Project ID';
          const socketId = getNextId('socket');
          const socketName = toSocketNameFromDescription(description);
          node.input.sockets.push({
            socketId,
            socketName,
            description,
            pendingIoValue: ioValue,
          });
          break;
        }
        case 'Equation': {
          const ioValue = atom.currentEquation;
          const description = 'Equation';
          const socketId = getNextId('socket');
          const socketName = toSocketNameFromDescription(description);
          node.input.sockets.push({
            socketId,
            socketName,
            description,
            pendingIoValue: ioValue,
          });
          break;
        }
      }
      for (const { name, ioValue } of ioValues) {
        const description = name;
        const socketId = getNextId('socket');
        const socketName = toSocketNameFromDescription(description);
        node.input.sockets.push({
          socketId,
          socketName,
          description,
          pendingIoValue: ioValue,
        });
      }
      nodeById.set(nodeId, node);
      flow.nodes.push(node);
      return nodeId;
    };

    const connectorFingerprints = new Set();

    const emitConnector = (connector) => {
      let {
        ap1ID,
        ap1Name,
        ap1Primary = true,
        ap2ID,
        ap2Name,
        ap2Primary = false,
      } = connector;
      if (ap2ID === undefined) {
        // Assume this goes to the magical Output node.
        ap2ID = 'Output';
      }
      if (ap1ID === undefined || ap2ID === undefined) {
        throw Error('die');
      }

      // Deduplicate connectors
      const fingerprint = [
        ap1ID,
        ap1Name,
        ap1Primary,
        ap2ID,
        ap2Name,
        ap2Primary,
      ].join('/');
      if (connectorFingerprints.has(fingerprint)) {
        return;
      } else {
        connectorFingerprints.add(fingerprint);
      }

      const connectionId = getNextId('connection');
      const [inputNode, outputNode] = [
        toNode(toNodeId(ap1ID)),
        toNode(toNodeId(ap2ID)),
      ];
      const inputSocketId = getNextId('socket');
      inputNode.output.sockets.push({
        socketId: inputSocketId,
        socketName: ap1Primary ? '' : toSocketNameFromDescription(ap1Name),
        description: ap1Name,
      });

      let outputSocketId;
      for (const socket of outputNode.input.sockets) {
        const { socketId, description } = socket;
        if (description === ap2Name) {
          // Fuse connector by name with existing input, since these are sometimes duplicated.
          outputSocketId = socketId;
          // Remove any pending constant.
          delete socket.pendingIoValue;
          break;
        }
      }
      if (outputSocketId === undefined) {
        // Didn't fuse; add a new input.
        outputSocketId = getNextId('socket');
        outputNode.input.sockets.push({
          socketId: outputSocketId,
          socketName: ap2Primary ? '' : toSocketNameFromDescription(ap2Name),
          description: ap2Name,
        });
      }
      const connection = {
        connectionId,
        input: {
          nodeId: inputNode.nodeId,
          socketId: inputSocketId,
        },
        output: {
          nodeId: outputNode.nodeId,
          socketId: outputSocketId,
        },
      };
      flow.connections.push(connection);
    };

    const resolvePendingIoValues = (node) => {
      const { nodeId } = node;
      for (const socket of node.input.sockets) {
        const { pendingIoValue, socketId } = socket;
        if (pendingIoValue !== undefined) {
          delete socket.pendingIoValue;
          // FIX: Assumes numeric constant.
          const constantNodeId = getNextId('node');
          const constantSocketId = getNextId('socket');
          const constantNode = {
            op: {
              opId: 'Constant',
              parameters: { value: pendingIoValue },
            },
            name: pendingIoValue,
            nodeId: constantNodeId,
            input: {
              sockets: [],
            },
            output: {
              sockets: [
                {
                  socketId: constantSocketId,
                  socketName: 'number',
                  description: pendingIoValue,
                },
              ],
            },
          };
          nodeById.set(constantNodeId, constantNode);
          flow.nodes.push(constantNode);
          const connectionId = getNextId('connection');
          flow.connections.push({
            connectionId,
            input: {
              nodeId: constantNodeId,
              socketId: constantSocketId,
            },
            output: {
              nodeId,
              socketId,
            },
          });
        }
      }
    };

    // Generate
    allAtoms.forEach(emitAtom);
    allConnectors.forEach(emitConnector);

    // FIX: Hook up the flow through the molecule definition.
    flow.nodes.forEach(resolvePendingIoValues);
    flows.push(flow);
  }

  return flows;
};

export const toDotFromFlows = (flows) => {
  const dot = [];
  let nextClusterId = 0;
  const getNextClusterId = () => nextClusterId++;
  dot.push(`digraph {`);
  dot.push(`  rankdir = TB;`);
  for (const flow of flows) {
    const { flowId, flowName } = flow;

    dot.push(`  subgraph cluster_${getNextClusterId()} {`);
    dot.push(`    label = "${flowName}\n(${flowId})";`);

    const emitInputSocket = (node, socket) => {
      const { socketId, socketName = '' } = socket;
      const { nodeId } = node;
      dot.push(`    ${socketId} [label="" shape=point];`);
      dot.push(`    ${socketId} -> ${nodeId} [label="${socketName}"];`);
      if (socketId === undefined) throw Error('die');
      if (nodeId === undefined) throw Error('die');
    };
    const emitOutputSocket = (node, socket) => {
      const { socketId, socketName = '' } = socket;
      const { nodeId } = node;
      dot.push(`    ${socketId} [label="" shape=point];`);
      dot.push(`    ${nodeId} -> ${socketId} [label="${socketName}"];`);
      if (socketId === undefined) throw Error('die');
      if (nodeId === undefined) throw Error('die');
    };
    const emitNode = (node) => {
      const { nodeId, name, op, input, output, legacyId } = node;
      const { opId } = op;
      for (const socket of input.sockets) {
        emitInputSocket(node, socket);
      }
      dot.push(
        `    ${nodeId} [label="${name}\n(${opId}\n${nodeId}\n${legacyId})"];`
      );
      for (const socket of output.sockets) {
        emitOutputSocket(node, socket);
      }
    };
    const emitConnection = (connection) => {
      const { input, output } = connection;
      dot.push(`    ${input.socketId} -> ${output.socketId} [label = ""];`);
      if (input.socketId === undefined) throw Error('die');
      if (output.socketId === undefined) throw Error('die');
    };
    flow.nodes.forEach(emitNode);
    flow.connections.forEach(emitConnection);
    dot.push(`  }`);
  }
  dot.push(`}`);
  return dot.join('\n');
};
