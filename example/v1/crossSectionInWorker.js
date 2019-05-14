import { assemble, circle, difference, extrude, Shape, sphere, square, writeSvg } from '@jsxcad/api-v1';

export const main = async () => {
  
  //Here is a simple example which works
  const cube = square(10).extrude({height: 10}).translate([0,0,-5]);;
  const passable = cube.toLazyGeometry().toGeometry();
  //Simulate passing to ww here ----------------------------
  const inThread = Shape.fromGeometry(passable).crossSection().toDisjointGeometry();
  console.log(inThread);
  
  
  //Here is a more complex example which breaks -- Possibly because of user error with "Error: Non-manifold"
  const cylinder = circle({r: 10}).extrude({height: 10}).translate([10,0,0]);
  const assembly = assemble(cylinder, cube)
  const passable2 = assembly.toLazyGeometry().toGeometry();
  //Simulate passing to ww here ----------------------------
  const inThread2 = Shape.fromGeometry(passable2).crossSection().toDisjointGeometry();
  console.log(inThread2);
  
};
