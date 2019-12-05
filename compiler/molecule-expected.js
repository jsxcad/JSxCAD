const $$Test1 = () => {
  const $0 = Square(10, 10);
  const $1 = $0.extrude(10, 0, { twist: 0, steps: 1 });
  const $2 = $1.move(0, 10, 0);
  const $3 = Circle.ofDiameter(10, { sides: 32 });
  const $4 = $3.extrude(10, 0, { twist: 0, steps: 1 });
  const $5 = $4.move(0, 0, -4);
  const $6 = assemble($2, $5);
  return $6;
};
