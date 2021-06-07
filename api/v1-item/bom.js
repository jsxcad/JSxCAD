import Shape from '@jsxcad/api-v1-shape';
import { emit } from '@jsxcad/sys';
import { visit } from '@jsxcad/geometry';

export const bom = (shape) => {
  const bom = [];
  visit(shape.toKeptGeometry(), (geometry, descend) => {
    if (geometry.type === 'item' && geometry.tags) {
      bom.push(
        geometry.tags
          .filter((tag) => tag.startsWith('item/'))
          .map((tag) => tag.substring(5))
      );
    }
    descend();
  });
  return bom;
};

const bomMethod = function () {
  return bom(this);
};
Shape.prototype.bom = bomMethod;

const bomViewMethod = function () {
  const counts = new Map();
  for (const ids of this.bom()) {
    for (const id of ids) {
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }
  const md = [];
  md.push(``);
  md.push(`| Item | Count |`);
  md.push(`| ---- | ----- |`);
  for (const [id, count] of counts) {
    md.push(`| ${id} | ${count} |`);
  }
  md.push(``);

  emit({ md: md.join('\n') });
  return this;
};
Shape.prototype.bomView = bomViewMethod;

export default bom;
