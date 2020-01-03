import Shape from '@jsxcad/api-v1-shape';

export const fromPoint = (point) => Shape.fromPoint(point);
export const Point = (point) => fromPoint(point);

export default Point;

Point.signature = 'Point(point:Point) -> Shape';
