// See: http://sandroarienzo.blogspot.com/2011/04/27-tipologias-de-arcos.html

export const RoundArch = (
  diameter = 1,
  height = 1,
  depth = 1,
  { resolution = 32 } = {}
) =>
  Circle.ofDiameter(diameter, depth, { sides: resolution })
    .extrude(depth)
    .rotateX(90)
    .chop(Z(0).flip())
    .stretch(height - diameter / 2);

export const PointedArch = (
  diameter = 1,
  height = 1,
  depth = 1,
  { resolution = 32 } = {}
) => {
  const construction = Plan.Radius(diameter)
    .rotateZ(-30)
    .moveX(diameter / -2)
    .with(
      Plan.Radius(diameter)
        .rotateZ(30)
        .moveX(diameter / +2)
    )
    .rotateX(90)
    .moveZ(height - diameter / 2);
  return Square(diameter)
    .moveY(diameter / 2)
    .clip(Circle.ofRadius(diameter).moveX(diameter / -2))
    .clip(Circle.ofRadius(diameter).moveX(diameter / +2))
    .extrude(depth)
    .rotateX(90)
    .above()
    .stretch(height - diameter / 2)
    .with(construction);
};

export const Wall = (diameter = 1, height = 1, depth = 1) =>
  Square(diameter, height).rotateX(90).above().extrude(depth);

export const main = () =>
  assemble(
    Wall(14, 14, 3),
    RoundArch(5, 10, 3).moveX(-3).drop(),
    PointedArch(5, 10, 3).moveX(3).drop()
  );
