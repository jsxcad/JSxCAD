import { divide as divideSolid } from '@jsxcad/geometry-solid';
import { map } from './map';

export const divide = (geometry) =>
  map(geometry,
      (item) => {
        if (item.solid) {
          const parts = divideSolid(item.solid);
          if (parts.length === 1) {
            return item;
          } else {
            return { disjointAssembly: parts.map(part => ({ solid: part })), tags: item.tags };
          }
        } else {
          return item;
        }
      });
