import { Assembly } from './Assembly';
import { Paths } from './Paths';
import { Z0Surface } from './Z0Surface';
import { assemble } from './assemble';
import { toSvg } from '@jsxcad/convert-svg';
import { writeFileSync } from '@jsxcad/sys';

export const writeSvg = async ({ path }, ...shapes) => {
  const assembly = assemble(...shapes);
console.log(`QQ/writeSvg/assembly: ${JSON.stringify(assembly)}`);
  const disjoint = assembly.toDisjointGeometry();
console.log(`QQ/writeSvg/disjoint: ${JSON.stringify(disjoint)}`);
  await writeFileSync(path, () => toSvg({}, disjoint), disjoint);
};

const method = function (options = {}) { writeSvg(options, this); return this; };

Assembly.prototype.writeSvg = method;
Paths.prototype.writeSvg = method;
Z0Surface.prototype.writeSvg = method;
