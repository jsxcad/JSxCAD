import Shape from './Shape';
import connect from './connect';

const toMethod = function (...args) { return connect(this, ...args); };
Shape.prototype.to = toMethod;
