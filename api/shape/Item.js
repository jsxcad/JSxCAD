import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item from the designator.
export const Item = () => (shape) =>
  Shape.fromGeometry(taggedItem({}, shape.toGeometry()));

Shape.registerMethod('item', Item);

export default Item;
