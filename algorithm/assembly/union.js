import { map } from './map';
import { unionItems } from './unionItems';

export const union = (assembly, item) => map(assembly, assemblyItem => unionItems(assemblyItem, item));
