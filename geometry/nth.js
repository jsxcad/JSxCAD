import { Empty } from './Empty.js';
import { Group } from './Group.js';
import { each } from './each.js';

export const nth = (geometry, nths) => {
  const candidates = each(geometry);
  const group = [];
  for (let nth of nths) {
    if (nth < 0) {
      nth = candidates.length + nth;
    }
    let candidate = candidates[nth];
    if (candidate === undefined) {
      candidate = Empty();
    }
    group.push(candidate);
  }
  return Group(group);
};
