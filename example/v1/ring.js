import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-svg';

const ring = Circle(20).cut(Circle(10)).color('green');

await ring.Page().writePdf('ring');
await ring.Page().writeSvg('ring');
