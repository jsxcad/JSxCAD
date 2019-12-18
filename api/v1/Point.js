import { Shape } from './Shape';

export const fromPoint = (point) => Shape.fromPoint(point);
export const Point = (point) => fromPoint(point);

export default Point;

Point.signature = 'Point(point:Point) -> Shape';
