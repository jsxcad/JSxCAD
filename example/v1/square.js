import { square, writePdf } from '@jsxcad/api-v1';

writePdf({ path: '/tmp/square.pdf' }, square(30));
