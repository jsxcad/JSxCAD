import Shape from './Shape.js';

const doMethod = function (op, ...args) {
  op(this, ...args);
  return this;
};

Shape.prototype.do = doMethod;
