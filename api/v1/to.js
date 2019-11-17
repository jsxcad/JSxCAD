import Shape from './Shape';
import connect from './connect';

const toMethod = function (...shapes) { return connect(this, ...shapes); };
Shape.prototype.to = toMethod;
