import { fixTJunctions } from "./fixTJunctions";

export const makeWatertight = (polygons) => fixTJunctions(polygons);
