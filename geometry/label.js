import { Edge } from './Edge.js';
import { Group } from './Group.js';
import { Hershey } from './Hershey.js';
import { ghost } from './ghost.js';
import { hasTypeLabel } from './tagged/type.js';
import { translate } from './translate.js';

export const Label = (text, distance) =>
  hasTypeLabel(
    ghost(
      Group([
        Edge([0, 0, 0], [distance, 0, 0]),
        translate(Hershey(text, 10), [distance, 0, 0]),
      ])
    )
  );
