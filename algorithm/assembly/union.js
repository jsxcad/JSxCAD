import { map } from './map';
import { unionItems } from './unionItems';

export const union = (assembly, item) => {
console.log(`QQ/union/assembly: ${JSON.stringify(assembly)}`);
console.log(`QQ/union/assembly/item: ${JSON.stringify(item)}`);
  return map(assembly, assemblyItem => unionItems(assemblyItem, item));
}
