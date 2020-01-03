import '@jsxcad/api-v1-svg';

await Sphere(30)
        .cut(Sphere(15))
        .section()
        .writeSvg('cutSpheres.svg');
