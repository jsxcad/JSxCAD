import Shape from './Shape.js';
import note from './note.js';
import { parts } from '@jsxcad/geometry';

const counted = (list, prices) => {
  const counts = new Map();
  let totalPrice = 0;
  for (const tag of list) {
    const name = tag.substring('part:'.length);
    counts.set(name, (counts.get(name) || 0) + 1);
    totalPrice += prices.get(name) || 0;
  }
  const counted = [];
  for (const [name, count] of counts.entries()) {
    counted.push(
      `| ${name} | ${count} | ${prices.get(name)} | ${
        prices.get(name) * count
      }\n`
    );
  }
  counted.push(`| | | | ${totalPrice} |\n`);
  counted.sort();
  return counted;
};

export const billOfMaterials = Shape.registerMethod3(
  ['billOfMaterials', 'bom'],
  ['inputGeometry', 'function', 'strings'],
  (geometry) => parts(geometry, 'part:*'),
  (
    tags,
    [
      geometry,
      op = (attributes, ...list) => {
        const prices = new Map();
        for (const attribute of attributes) {
          const m = attribute.match(/^price:([^=]*)=(.*)$/);
          if (m === null) {
            throw Error(`Unknown billOfMaterials attribute: "${attribute}"`);
          }
          const [, part, price] = m;
          prices.set(part, Number(price));
        }
        return note(
          `| Part | Count | Price | Total |\n| --- | --- | --- | --- |\n${counted(
            list,
            prices
          ).join('')}`
        );
      },
      attributes = [],
    ]
  ) => op(attributes, ...tags)(Shape.fromGeometry(geometry))
);

export const bom = billOfMaterials;
