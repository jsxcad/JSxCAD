import { square, writePdf } from '@jsxcad/api-v1';

const shape = square(30);

console.log(`QQ/square: ${JSON.stringify(shape)}`);

writePdf({ path: '/tmp/square.pdf' }, shape);
