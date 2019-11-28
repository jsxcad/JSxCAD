/*

// Flow
{
  nodes: [
    {
      op: { opId },
      nodeId,
      input: {
        sockets: [{ socketId, socketName }],
      },
      output: {
        sockets: [{ socketId, socketName }],
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

export const toFlows = (data) => {
  const flows = [];
  const { molecules } = data;
  let nextId = 0;
  for (const moleculeDefinition of molecules) {
    const { allAtoms, allConnectors, name, uniqueID } = moleculeDefinition;
    const flow = { nodes: [], connections: [], flowId: uniqueID, flowName: name };

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
        op: { opId: atomType },
        name,
        nodeId,
        legacyId,
        input: { sockets: [] },
        output: { sockets: [] },
        metadata: { projectID, x, y }
      };
      for (const { name, ioValue } of ioValues) {
        const socketId = getNextId('socket');
        const socketName = name;
        node.input.sockets.push({ socketId, socketName, pendingIoValue: ioValue });
      }
      nodeById.set(nodeId, node);
      flow.nodes.push(node);
      return nodeId;
    };

    const connectorFingerprints = new Set();

    const emitConnector = (connector) => {
      let { ap1ID, ap1Name, ap2ID, ap2Name } = connector;
      if (ap2ID === undefined) {
        // Assume this goes to the magical Output node.
        ap2ID = 'Output';
      }
      if (ap1ID === undefined || ap2ID === undefined) {
        throw Error('die');
      }

      // Deduplicate connectors
      const fingerprint = [ap1ID, ap1Name, ap2ID, ap2Name].join('/');
      if (connectorFingerprints.has(fingerprint)) {
        return;
      } else {
        connectorFingerprints.add(fingerprint);
      }

      const connectionId = getNextId('connection');
      const [inputNode, outputNode] = [toNode(toNodeId(ap1ID)), toNode(toNodeId(ap2ID))];
      const inputSocketId = getNextId('socket');
      inputNode.output.sockets.push({ socketId: inputSocketId, name: ap1Name });

      let outputSocketId;
      for (const socket of outputNode.input.sockets) {
        const { socketId, socketName } = socket;
        if (socketName === ap2Name) {
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
        outputNode.input.sockets.push({ socketId: outputSocketId, name: ap2Name });
      }
      const connection = {
        connectionId,
        input: {
          nodeId: inputNode.nodeId,
          socketId: inputSocketId
        },
        output: {
          nodeId: outputNode.nodeId,
          socketId: outputSocketId
        }
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
              parameters: { value: pendingIoValue }
            },
            name: pendingIoValue,
            nodeId: constantNodeId,
            input: { sockets: [] },
            output: { sockets: [{ socketId: constantSocketId, socketName: 'number' }] }
          };
          nodeById.set(constantNodeId, constantNode);
          flow.nodes.push(constantNode);
          const connectionId = getNextId('connection');
          flow.connections.push({
            connectionId,
            input: { nodeId: constantNodeId, socketId: constantSocketId },
            output: { nodeId, socketId }
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
      dot.push(`    ${nodeId} [label="${name}\n(${opId}\n${nodeId}\n${legacyId})"];`);
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
