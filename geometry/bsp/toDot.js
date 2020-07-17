import { inLeaf, outLeaf } from './bsp.js';

export const toDot = (bsp) => {
  const lines = [];
  const dot = (text) => lines.push(text);

  dot(`digraph {`);

  const ids = new Map();
  let nextId = 0;

  const walk = (bsp, parent) => {
    if (bsp === inLeaf) {
      return `"IN_${parent}"`;
    } else if (bsp === outLeaf) {
      return `"OUT ${parent}"`;
    } else {
      if (!ids.has(bsp)) {
        ids.set(bsp, nextId++);
      }
      const id = ids.get(bsp);

      dot(
        `  ${id} [label="${bsp.plane.map((v) => v.toFixed(3)).join(', ')}"];`
      );
      dot(`  ${id} -> ${walk(bsp.front, id)} [label="front"];`);
      dot(`  ${id} -> ${walk(bsp.back, id)} [label="back"];`);

      return id;
    }
  };

  walk(bsp);

  dot(`}`);

  return lines.join('\n');
};
