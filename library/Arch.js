export const RoundArch = (height, diameter, depth) =>
  Cylinder.ofDiameter(diameter, depth, { sides: 10 })
    .rotateX(90)
    .moveZ(height - diameter / 2)
    .add(Cube(diameter, depth, height - diameter / 2)
           .above());
