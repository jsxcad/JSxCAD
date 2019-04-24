import { difference } from './difference';

// Traverse the assembly tree and disjoint it backward.
export const toDisjointAssembly = (assembly) => {
  const subtractions = [];

  const walk = (assembly, nth, disjointed) => {
    const item = assembly[nth];
    if (nth < assembly.length - 1) {
      walk(assembly, nth + 1, disjointed);
    }
    if (item.assembly) {
      const subAssembly = [];
      walk(item.assembly, 0, subAssembly);
      disjointed.push({ assembly: subAssembly, tags: item.tags });
    } else {
      const differenced = difference(item, ...subtractions);
      disjointed.push(differenced);
      subtractions.push(differenced);
    }
  };
  const disjoint = [];
  walk(assembly, 0, disjoint);
  return disjoint;
};
