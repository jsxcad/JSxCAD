import { keepOrDrop, selectToDrop, selectToKeep } from './keep.js';

import { Shape } from './Shape.js';

export const drop =
  (...tags) =>
  (shape) => {
    if (tags.length === 0) {
      // Keeping no tags is an unconditional drop.
      return keepOrDrop(shape, [], selectToKeep);
    } else {
      return keepOrDrop(shape, tags, selectToDrop);
    }
  };

Shape.registerMethod('drop', drop);
