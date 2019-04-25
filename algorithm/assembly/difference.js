import { differenceItems } from './differenceItems';
import { map } from './map';

export const difference = (assembly, item) => map(assembly, assemblyItem => differenceItems(assemblyItem, item));
