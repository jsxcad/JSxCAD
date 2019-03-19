import { square, writePdf } from '@jsxcad/api-v1';

export const getParameterDefinitions = () => [
  { name: 'length', initial: 30, caption: 'Length', type: 'int' }
];

export const main = ({ length = 30 }) => {
  const shape = square(length);
  writePdf({ path: 'tmp/square.pdf' }, shape);
};
