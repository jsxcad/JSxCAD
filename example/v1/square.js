import { square, writePdf } from '@jsxcad/api-v1';

const shape = square(30);

writePdf({ path: '/tmp/square.pdf' }, shape);
