import Shape from './Shape.js';
import { distributedAssemble } from '@jsxcad/geometry';

const isDefined = (value) => value !== undefined;

export const DistributedAssembly = async (...shapes) =>
  Shape.fromGeometry(
    await distributedAssemble(
      ...shapes.filter(isDefined).map((shape) => shape.toGeometry())
    )
  );

export default DistributedAssembly;

Shape.prototype.DistributedAssembly = Shape.shapeMethod(DistributedAssembly);
