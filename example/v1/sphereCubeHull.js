import { Hull } from '@jsxcad/api-v1-extrude';
import '@jsxcad/api-v1-stl';

await Hull(Sphere(), Cube().move(0.5, 0.5, 3.0), Cube().move(0.5, -1, 0))
  .Item()
  .Page()
  .writeStl('sphereCubeHull');
