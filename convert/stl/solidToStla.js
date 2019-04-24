import { toPolygons } from '@jsxcad/algorithm-solid';
import { polygonsToStla } from './polygonsToStla';

export const solidToStla = (options = {}, solid) => polygonsToStla(options, toPolygons({}, solid));
