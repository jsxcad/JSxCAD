import { difference } from './difference';
import { intersection } from './intersection';
import { union } from './union';

const clean = (surface) => intersection(surface, surface);

export {
  clean,
  difference,
  intersection,
  union
};
