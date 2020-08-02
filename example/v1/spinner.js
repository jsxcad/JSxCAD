const Wing = (
  baseDiameter = 20,
  tipDiameter = 5,
  length = 60,
  { twist = 45, thickness = 1 } = {}
) =>
  Hull(
    Circle.ofDiameter(baseDiameter),
    Circle.ofDiameter(tipDiameter).moveX(length)
  )
    .rotateY(-90)
    .extrude(thickness / 2, thickness / -2)
    .twist(twist, { resolution: 0.5 })
    .rotateY(90);

const Wings = (...args) => Wing(...args).add(Wing(...args).rotate(180));

const BearingBall = (diameter) => Sphere.ofDiameter(diameter);

const Spinner = ({
  bearingBallDiameter = 10.8,
  bearingBallPlay = 0.1,
  coreDiameter = 15,
  coreThickness = 2,
  wingtipDiameter = 5,
  wingLength = 30,
  wingTwist = 45,
} = {}) =>
  Wings(coreDiameter, wingtipDiameter, wingLength, { twist: wingTwist })
    .add(Cylinder.ofDiameter(coreDiameter, coreThickness))
    .with(BearingBall(bearingBallDiameter + bearingBallPlay * 2));

Spinner({ wingTwist: 45 }).cloud(0.5).view().writeShape('spinner');
Spinner({ wingTwist: 45 }).Item().Page().view().writeStl('spinner');
