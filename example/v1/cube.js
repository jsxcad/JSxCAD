import { cube, writeStl } from '@jsxcad/api-v1';

writeStl({ path: '/tmp/cube.stl' }, cube(30));
// writeStl({ path: '/tmp/cube_10_50_10.stl' }, cube({ size: [10, 50, 10], center: true }));
