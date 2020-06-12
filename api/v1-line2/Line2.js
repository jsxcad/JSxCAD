import { fromPoints, intersectPointOfLines } from "@jsxcad/math-line2";

export const ofPoints = (a, b) => fromPoints(a, b);
export const meet = (a, b) => intersectPointOfLines(a, b);

export const Line2 = (...args) => ofPoints(...args);

Line2.ofPoints = ofPoints;
Line2.meet = meet;

export default Line2;
