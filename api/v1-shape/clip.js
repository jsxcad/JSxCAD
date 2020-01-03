import { Shape } from './Shape';
import { intersection } from './intersection';

const clipMethod = function (...shapes) { return intersection(this, ...shapes); };
Shape.prototype.clip = clipMethod;

clipMethod.signature = 'Shape -> clip(...to:Shape) -> Shape';
