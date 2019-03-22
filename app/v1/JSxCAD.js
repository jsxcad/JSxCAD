import { cube } from '@jsxcad/api-v1';
import { trianglesToThreejsDatasets } from '@jsxcad/algorithm-threejs';

export const main = () => trianglesToThreejsDatasets({}, cube({ size: 4, center: true }).rotateX(45).rotateY(45).toPolygons());
