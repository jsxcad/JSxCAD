import '@jsxcad/api-v1-svg';

Sphere(30).cut(Sphere(15)).section().Page().view().writeSvg('cutSpheres');
