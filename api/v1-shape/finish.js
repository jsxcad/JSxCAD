import Shape from './Shape';

export const finish = (shape) => Shape.fromGeometry(shape.toKeptGeometry());

const finishMethod = function () { return finish(this); };
Shape.prototype.finish = finishMethod;
