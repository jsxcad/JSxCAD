import { difference } from "./difference";
import { intersection } from "./intersection";
import { union } from "./union";

const clean = (polygons) => union(...polygons.map((polygon) => [polygon]));

export { clean, difference, intersection, union };
