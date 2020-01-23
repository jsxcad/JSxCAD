import '@jsxcad/api-v1-pdf';

const length = 30;
await Square(length).Page().writePdf('square');
