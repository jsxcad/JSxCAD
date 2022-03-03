import {
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  SVGLoader,
  ShapeGeometry,
} from '@jsxcad/algorithm-threejs';

export const fromSvgToThreejs = async (input) => {
  const text = new TextDecoder('utf8').decode(input);
  const loader = new SVGLoader();
  const data = loader.parse(text);
  const paths = data.paths;

  const group = new Group();

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const fillColor = path.userData.style.fill;
    if (fillColor !== undefined && fillColor !== 'none') {
      const material = new MeshBasicMaterial({
        color: new Color().setStyle(fillColor).convertSRGBToLinear(),
        opacity: path.userData.style.fillOpacity,
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
      });

      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];

        const geometry = new ShapeGeometry(shape);
        const mesh = new Mesh(geometry, material);

        group.add(mesh);
      }
    }

    const strokeColor = path.userData.style.stroke;

    if (strokeColor !== undefined && strokeColor !== 'none') {
      const material = new MeshBasicMaterial({
        color: new Color().setStyle(strokeColor).convertSRGBToLinear(),
        opacity: path.userData.style.strokeOpacity,
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
      });

      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];

        const geometry = SVGLoader.pointsToStroke(
          subPath.getPoints(),
          path.userData.style
        );

        if (geometry) {
          const mesh = new Mesh(geometry, material);

          group.add(mesh);
        }
      }
    }
  }

  return group;
};
