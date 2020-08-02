import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-svg';

const ring = Circle(20).cut(Circle(10)).color('green');

ring.Page().view().writePdf('ring');
ring.Page().view().writeSvg('ring');
