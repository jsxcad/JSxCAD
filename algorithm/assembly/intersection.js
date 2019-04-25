import { intersectionItems } from './intersectionItems';
import { map } from './map';

export const intersection = (assembly, item) => map(assembly, assemblyItem => intersectionItems(assemblyItem, item));
