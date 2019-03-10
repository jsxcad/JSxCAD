import { CSG } from './CSG';
import { assertEmpty, assertNumber, assertSingle } from './assert';
import { buildRegularPrism,
         buildRoundedConvexHull,
         regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);

const buildCube = ({ center = false, centerPosition, length = 1, width = 1, height = 1,
                     round = false, roundingRadius, roundingFaces }) => {
  let cube = CSG.fromPolygons(buildRegularPrism({ edges: 4 }))
      .rotateZ(45)
      .scale([edgeScale, edgeScale, 1]);
  if (center === false && centerPosition === undefined) {
    cube = cube.translate([0.5, 0.5, 0.5]);
  }
  if (round) {
    cube = cube.scale([length - roundingRadius * 2, width - roundingRadius * 2, height - roundingRadius * 2]);
    cube = CSG.fromPolygons(buildRoundedConvexHull({ roundingRadius: roundingRadius, roundingFaces: roundingFaces },
                                                   cube.toPoints({})));
  } else {
    cube = cube.scale([length, width, height]);
  }
  if (centerPosition) {
    cube = cube.translate(centerPosition);
  }
  return cube;
};

const decode = (params) => {
  // cube({ center: [0, 0, 0], radius: 1, roundradius: 0.9, resolution: 8 })
  try {
    const { center, radius, roundRadius, resolution } = params[0];
    const [x, y, z] = center;
    assertNumber(x);
    assertNumber(y);
    assertNumber(z);
    assertNumber(radius);
    assertNumber(roundRadius);
    assertNumber(resolution);
    assertSingle(params);
    return { centerPosition: center,
             length: radius,
             width: radius,
             height: radius,
             round: true,
             roundingRadius: roundRadius,
             roundingFaces: resolution };
  } catch (e) {}

  // cube({ radius: 1, roundradius: 0.9, resolution: 8 })
  try {
    const { radius, roundRadius, resolution } = params[0];
    assertNumber(radius);
    assertNumber(roundRadius);
    assertNumber(resolution);
    assertSingle(params);
    return { length: radius,
             width: radius,
             height: radius,
             round: true,
             roundingRadius: roundRadius,
             roundingFaces: resolution };
  } catch (e) {}

  // cube({size: [1,2,3], center: false });
  try {
    const { size, center = false } = params[0];
    const [length, width, height] = size;
    assertNumber(length);
    assertNumber(width);
    assertNumber(height);
    assertSingle(params);
    return { center: center, length: length, width: width, height: height };
  } catch (e) {}

  // cube({ size: 1, center: false });
  try {
    const { size, center = false } = params[0];
    assertNumber(size);
    assertSingle(params);
    return { center: center, length: size, width: size, height: size };
  } catch (e) {}

  // cube(10)
  try {
    assertSingle(params);
    const [ size ] = params;
    assertNumber(size);
    return { center: false, length: size, width: size, height: size };
  } catch (e) {}

  // cube()
  try {
    assertEmpty(params);
    return { center: false };
  } catch (e) {}

  throw Error(`Unsupported interface for cube: ${JSON.stringify(params)}`);
};

/**
 *
 * cube(); // openscad like
 * cube(1);
 * cube({size: 1});
 * cube({size: [1,2,3]});
 * cube({size: 1, center: true}); // default center:false
 * cube({size: 1, center: [false,false,false]}); // individual axis center true or false
 * cube({size: [1,2,3] });
 * cube({ center: [0, 0, 0], radius: [1, 1, 1] });
 * cube({ corner1: [4, 4, 4], corner2: [5, 4, 2] });
 */
export const cube = (...params) => buildCube(decode(params));

// Install support for CSG.cube and CSG.roundedCube.
CSG.cube = cube;
CSG.roundedCube = cube;
