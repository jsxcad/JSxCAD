import { makeConvex } from "./makeConvex";

export const fromPolygons = ({ plane }, polygons) => makeConvex(polygons);
