import { map } from "./map";
import { toGeneric as toGenericPath } from "@jsxcad/geometry-path";

export const toGeneric = (paths) => map(paths, toGenericPath);
