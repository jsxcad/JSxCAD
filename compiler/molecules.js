export const toDot = (data) => {
  const { molecules } = data;
  const adHocFields = new Set();
  const dot = [];
  dot.push(`digraph {`);
  dot.push(`  rankdir = TB;`);
  const emitAtom = (atom) => {
    const { atomType, name, projectID, x, y, uniqueID, ioValues } = atom;
    for (const key of Object.keys(atom)) {
      if (['atomType', 'name', 'projectID', 'x', 'y', 'uniqueID', 'ioValues'].includes(key) === false) {
        adHocFields.add(key);
      }
    }
    const args = [];
    for (const { name, ioValue } of ioValues) {
      args.push(`${name}=${ioValue}`)
    }
    const label = `${name}\n(\n${args.join('\n')}\n)`;
    
    dot.push(`    "${uniqueID}" [label="${label}"];`);
  }

  const seen = new Set();

  let cluster = 0;
  for (const moleculeDefinition of molecules) {
    const { allAtoms, allConnectors, name } = moleculeDefinition;
    dot.push(`  subgraph cluster_${cluster++} {`);
    dot.push(`    label = "${name}";`);
    for (const atom of allAtoms) {
      emitAtom(atom);
    }
    for (const connector of allConnectors) {
      const { ap1ID, ap1Name, ap2ID, ap2Name } = connector;
      const key = [ap1ID, ap1Name, ap2ID, ap2Name].join('/');
      if (seen.has(key)) continue;
      seen.add(key);
      if (ap1ID !== undefined && ap2ID !== undefined) {
        dot.push(`  "${ap1ID} -> ${ap2ID}" [label="" shape=point];`);
        dot.push(`  "${ap1ID}" -> "${ap1ID} -> ${ap2ID}" [label="${ap1Name}"];`);
        dot.push(`  "${ap1ID} -> ${ap2ID}" -> "${ap2ID}" [label="${ap2Name}"];`);
      }
    }
    dot.push(`  }`);
  }
  dot.push(`}`);
  console.log(`QQ/adHocFields: ${[...adHocFields].join(', ')}`);
  return dot.join('\n');
}
