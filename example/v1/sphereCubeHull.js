import { hull } from '@jsxcad/api-v1-extrude';
import '@jsxcad/api-v1-stl';

await hull(Sphere(),
           Cube().move(0.5, 0.5, 3.0),
           Cube().move(0.5, -1, 0))
        .writeStl('stl/sphereCubeHull.stl');
