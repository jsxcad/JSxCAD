import getEdges from './getEdges';

export const toDot = (loops) => {
  const out = [];
  out.push(`digraph {`);
  for (const loop of loops) {
    out.push(`  subgraph cluster_${loop.id} {`);
    for (const edge of getEdges(loop)) {
      const [x, y] = edge.start;
      out.push(`    ${edge.id} [pos = "${x},${y}!"];`);
    }
    out.push(`  }`);
  }
  for (const loop of loops) {
    for (const edge of getEdges(loop)) {
      out.push(`  ${edge.id} -> ${edge.next.id};`);
      if (edge.twin) {
        out.push(`  ${edge.id} -> ${edge.twin.id} [style="dotted"];`);
      }
    }
  }
  out.push(`}`);
  return out.join('\n');
};

export default toDot;
