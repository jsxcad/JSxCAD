import { polygonsToStla } from './polygonsToStla';
import { toPolygons } from '@jsxcad/algorithm-solid';

export const solidToStla = (options = {}, solid) => polygonsToStla(options, toPolygons({}, solid));
