import '@jsxcad/api-v1-svg';

Ball(30).cut(Ball(15)).section().Page().view().writeSvg('cutSpheres');
