import { Group, getLeafs } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const sort = Shape.registerMethod3(
  'sort',
  ['inputGeometry', 'function', 'modes:min,max', 'numbers'],
  async (geometry, rankOp = () => 0, mode, tiersToKeep = []) => {
    let predicate = (a, b) => a - b;
    if (mode.max) {
      // Start from the max tier.
      predicate = (a, b) => b - a;
    }
    const leafs = [];
    for (const leaf of getLeafs(geometry)) {
      const rank = await rankOp(Shape.fromGeometry(leaf));
      leafs.push({
        rank,
        leaf,
      });
    }
    leafs.sort((a, b) => predicate(a.rank, b.rank));
    let lastLeaf;
    let tier;
    const tiers = [];
    for (const thisLeaf of leafs) {
      if (!lastLeaf || lastLeaf.rank !== thisLeaf.rank) {
        tier = [];
        tiers.push(tier);
      }
      tier.push(thisLeaf);
    }
    // Structure the results by rank tiers.
    const keptTiers = [];
    for (let nth = 0; nth < tiers.length; nth++) {
      if (tiersToKeep.length === 0 || tiersToKeep.includes(nth + 1)) {
        keptTiers.push(tiers[nth]);
      }
    }
    return Group(keptTiers.map((tier) => Group(tier.map(({ leaf }) => leaf))));
  }
);

export default sort;
