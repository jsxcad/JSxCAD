import Shape from './Shape';
import assemble from './assemble';
import drop from './drop';

/**
 *
 * # shape.void(...shapes)
 *
 **/

const voidMethod = function (...shapes) { return assemble(this, ...shapes.map(drop)); };
Shape.prototype.void = voidMethod;

voidMethod.signature = 'Shape -> void(...shapes:Shape) -> Shape';
