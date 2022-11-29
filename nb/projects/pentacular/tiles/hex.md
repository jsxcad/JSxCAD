```JavaScript
const hex = Hexagon(32);
```

```JavaScript
const Tab = (thickness, tabLength) =>
  Box([0.5, -1], [thickness * 5, -thickness * 5], [thickness, -thickness])
    .and(
      Box(
        [0.5, -1],
        [thickness * 2, thickness * 4],
        [thickness * 2, thickness * -2]
      ),
      Box(
        [0.5, -1],
        [thickness * -2, thickness * -4],
        [thickness * 2, thickness * -2]
      )
    )
    .as('tab');
```

```JavaScript
const placeTab = (tab) => (e, l) => (s) =>
  tab
    .z(l * (1 / 2))
    .color('red')
    .mask(grow(0.1, 'yz').grow(0.2, 'x'))
    .to(e);
```

```JavaScript
const tab = await Tab(1.5, 32 / 8);
```

```JavaScript
tab.stl('tab', ry(1 / 4));
```

[tab_1.stl](hex.tab_1.stl)

```JavaScript
const hexTile = hex
  .inset(0.1)
  .ez(2, -1)
  .cut(hex.eachEdge(placeTab(tab)))
  /*
  .cut(
    Hexagon(32).eachEdge(
      (e, l, o) => (s) => s.at(e.origin(), s.by(o.origin()).get('tab'))
    )
  )
  */
  .fuse()
  .clean();
```

```JavaScript
const square = Box(32);
```

```JavaScript
const place = (turn) => {
  if (turn === 0) {
    return Point();
  } else {
    return Point()
      .x(13 / 2)
      .rz(turn);
  }
};
```

```JavaScript
const placeBetween = (turn) => {
  if (turn === 0) {
    return Point();
  } else {
    return Point()
      .x(13 / 2)
      .rz(turn + 1 / 12);
  }
};
```

```JavaScript
const buildTree = Cached('Tree', ({ dx, dy, dz }) =>
  Hull(Orb(6), Point(dx, dy, dz))
    .join(Arc(2, 2, [-4]))
    .by(align('z>'))
    .remesh(1)
    .smooth(Box(8, 8, [3, 20]))
    .clean()
);
```

```JavaScript
const Tree = (seed = 0) => {
  const dx = random(seed).pick(3, 2, 1, 0, -1, -2, -3);
  const dy = random(seed + 1).pick(3, 2, 1, 0, -1, -2, -3);
  const dz = random(seed + 2).pick(4, 5, 6, 7, 8);
  return buildTree({ dx: dx(0), dy: dy(0), dz: dz(0) });
};
```

```JavaScript
const Peaks = (seed = 0, turns = [0], nth = 0) => {
  const peaks = [];
  for (const turn of turns) {
    nth += 1;
    const da = random(seed + nth + 1).in(0, 1);
    const dd = random(seed + nth + 2).in(0, 6);
    const dz = random(seed + nth + 3).in(2, 20);
    peaks.push(
      Seq({ upto: 3 }, (t) =>
        Hull(Hexagon(16), Point(dd(t), 0, dz(t)).rz(da(t)))
      ).to(place(turn))
    );
  }
  return Group(...peaks)
    .and(hex.ez(0.1))
    .fuse()
    .remesh(1)
    .smooth(hex.ez(0.2, 21))
    .clean();
};
```

```JavaScript
const Mountainous =
  (maxHeight = 13, minHeight = 1, peaks = 10) =>
  (seed = 0) => {
    const turn = random(seed + 1).in(0, 1);
    const distance = random(seed + 2).in(0, 13);
    const height = random(seed + 3).in(minHeight, maxHeight);
    return Seq({ upto: peaks }, (t) =>
      Hull(hex, Point(distance(t), 0, height(t)).rz(turn(t)))
    )
      .fuse()
      .remesh(1)
      .smooth(hex.ez(0.2, 21))
      .clean()
      .z(2)
      .and(hexTile);
  };
```

```JavaScript
const Mountain = Cached('Mountain', Mountainous(20, 1));
```

```JavaScript
const Hill = Cached('Hill', Mountainous(6));
```

```JavaScript
const Meadow = Cached('Meadow', Mountainous(2, 0));
```

```JavaScript
const Flat = Cached('Flat', Mountainous(0, 0));
```

```JavaScript
const Forest = Cached('Forest', (seed = 0, turn = 0, nth, count = 40) => {
  console.log(`Forest: seed=${seed}, turn=${turn}, count=${count}`);
  const getAngle = random(seed + 1).in(0, 1);
  const getDistance = random(seed + 2).in(0, 13);
  const trees = [];
  for (let nth = 0; nth < count; nth++) {
    const angle = getAngle(nth);
    const distance = getDistance(nth);
    if (turn === 0) {
      if (distance >= 13 / 2) {
        continue;
      }
    } else if (
      angle < turn - 1 / 12 ||
      angle >= turn + 1 / 12 ||
      distance < 13 / 2
    ) {
      continue;
    }
    trees.push(
      Tree((seed + nth) % 10)
        .x(distance)
        .rz(angle)
    );
  }
  return Group(...trees).z(2);
});
```

```JavaScript
const Swamp = (seed = 0, turn = 0, nth = 0, count = 5) => {
  seed += nth;
  console.log(`Swamp${nth}: seed=${seed}, turn=${turn}, count=${count}`);
  const getAngle = random(seed * 234).in(0, 1);
  const getDistance = random(seed * 543).in(0, 8);
  const getDiameter = random(seed * 645).in(1, 5);

  const holes = [];
  for (let nth = 0; nth < count; nth++) {
    holes.push(
      Arc(getDiameter(nth), getDiameter(nth), [-0.5, 10])
        .x(getDistance(nth))
        .rz(getAngle(nth))
    );
  }
  console.log(`holes: ${holes.length}`);
  return Group(...holes)
    .to(place(turn))
    .z(2);
};
```

```JavaScript
const Island = (seed = 0, nth = 0) => {
  const dx = random(seed).in(3, 9);
  const dy = random(seed + 1).in(3, 9);
  const dz = random(seed + 2).in(2, 6);
  return Orb(dx(nth), dy(nth), dz(nth) * 2).clip(
    Box(dx(nth), dy(nth), [1.5, dz(nth)])
  );
};
```

```JavaScript
const wave = (low = 1.5, high = 4.5, turn = 0) =>
  cut(
    ArcX(32, 2, [low, high]).seq({ from: -20, to: 20, by: 1.75 }, y).rz(turn)
  );
```

```JavaScript
const Waves = (seed = 0, nth = 0) => hex.ez(1.5, 3).join(hexTile).op(wave);
```

```JavaScript
const Dunes = (seed = 0, nth = 0) =>
  hex
    .ez(1.5, 3.5)
    .join(hexTile)
    .cut(ArcX(32, 3, [2, 5.5]).seq({ from: -20, to: 20, by: 3 }, y));
```

```JavaScript
const River = Cached('River', (seed = 0, to = 3 / 6, from = 0 / 6) => {
  const dy1 = random(seed * 111).in(-18, 18);
  const dy2 = random(seed * 69).in(-18, 18);
  const dr = random(seed * 123).in(3, 6);
  return Curve(
    Point(16 - 2, 0, 0).rz(from),
    Point(8, dy1(0)).rz(from),
    Point(8, dy2(1)).rz(to),
    Point(16 - 2, 0, 0).rz(to)
  )
    .eachPoint((p, n) => (s) => Orb(2, dr(n), 4).hasZag(1).to(p), ChainHull)
    .z(3)
    .clean()
    .fuse();
});
```

```JavaScript
const Path = (seed = 0, to = 3 / 6, from = 0 / 6, nth = 0) => {
  console.log(`Path ${seed} ${to} ${from} ${nth}`);
  const dy1 = random((seed + nth) * 87).in(-20, 20);
  const dy2 = random((seed + nth) * 31).in(-20, 20);
  const curve =
    to === 0
      ? Curve(
          Point(16 - 2, 0, 0).rz(from),
          Point(11, dy1(0)).rz(from),
          Point(5, dy2(1)).rz(from),
          Point(0, 0, 0)
        )
      : Curve(
          Point(16 - 2, 0, 0).rz(from),
          Point(6, dy1(0)).rz(from),
          Point(6, dy2(1)).rz(to),
          Point(16 - 2, 0, 0).rz(to)
        );
  return curve
    .eachPoint(
      (p, n) => (s) =>
        Arc(2, 2, [0, 4])
          .and(Orb(2, 2, [3, 5]).hasZag(1))
          .to(p),
      ChainHull
    )
    .clean()
    .fuse();
};
```

```JavaScript
const Road = (seed = 0, to = 3 / 6, from = 0 / 6) => {
  const dy1 = random(seed * 87).in(-20, 20);
  const dy2 = random(seed * 31).in(-20, 20);
  const curve =
    to === 0
      ? Curve(
          Point(16 - 2, 0, 0).rz(from),
          Point(11, dy1(0)).rz(from),
          Point(5, dy2(1)).rz(from),
          Point(0, 0, 0)
        )
      : Curve(
          Point(16 - 2, 0, 0).rz(from),
          Point(6, dy1(0)).rz(from),
          Point(6, dy2(1)).rz(to),
          Point(16 - 2, 0, 0).rz(to)
        );
  return curve
    .op((s) =>
      s
        .eachPoint(
          (p, n) => (s) =>
            Arc(6, 6, [-0.5, 4])
              .and(Orb(6, 6, [3, 5], { zag: 1 }))
              .to(p),
          ChainHull
        )
        .cut(
          s.eachPoint((p, n) => (s) => Arc(3, 3, [-0.5, 0]).to(p), ChainHull)
        )
    )
    .clean()
    .fuse()
    .z(2);
};
```

```JavaScript
const buildTunnel = Cached('Tunnel', ({ from, to, dy1, dy2 }) => {
  console.log(`buildTunnel: ${JSON.stringify({ from, to, dy1, dy2 })}`);
  const curve =
    to === 0
      ? Curve(
          Point(16 - 2, 0, 0).rz(from),
          Point(11, dy1).rz(from),
          Point(5, dy2).rz(from),
          Point(0, 0, 0)
        )
      : Curve(
          Point(16 - 2, 0, 0).rz(from),
          Point(6, dy1).rz(from),
          Point(6, dy2).rz(to),
          Point(16 - 2, 0, 0).rz(to)
        );
  return curve
    .eachPoint(
      (p, n) => (s) =>
        Arc(2, 2, [1.5, 4])
          .and(Orb(2, 2, [3, 5]).hasZag(1))
          .to(p),
      ChainHull
    )
    .clean()
    .fuse();
});
```

```JavaScript
const Tunnel = (seed = 0, to = 3 / 6, from = 0 / 6, nth = 0) => {
  const dy1 = random((nth + seed) * 87).pick(
    -20,
    -15,
    -10,
    -5,
    0,
    5,
    10,
    15,
    20
  );
  const dy2 = random((nth + seed) * 31).pick(
    -20,
    -15,
    -10,
    -5,
    0,
    5,
    10,
    15,
    20
  );
  return buildTunnel({ from, to, dy1: dy1(0), dy2: dy2(0) });
};
```

```JavaScript
const buildField = Cached('Field', ({ dr, ds, turn }) => {
  if (turn === 0) {
    return Hexagon(10).ez(2, 4).op(wave(3.5, 5));
  } else {
    return Triangle(14 + ds)
      .clip(Box(20, 6 + ds))
      .ez(2, 4)
      .to(place(turn))
      .on(
        noOp(),
        rz(-3 / 12)
          .x(2.5)
          .op(wave(3.5, 5, dr))
      );
  }
});
```

```JavaScript
const Field = (seed = 0, turn = 0, nth = 0) => {
  const dr = random(seed * 398).pick(0 / 6, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6);
  const ds = random(seed * 398).pick(0, 4.1);
  return buildField({ dr: dr(nth), ds: ds(nth), turn });
};
```

```JavaScript
const Wall = (seed = 0, turn = 0, nth = 0) =>
  Triangle(18)
    .clip(Box(20, [-5, -3]))
    .ez(2, 8)
    .to(place(turn))
    .on(self(), rz(-3 / 12).x(2.5));
```

```JavaScript
const Building = (seed = 0, turn = 0, nth = 0) => {
  const dh = random(seed * 398).in(0, 20);
  const da = random(seed * 432).in(0, 1);
  if (turn === 0) {
    return Hexagon(10)
      .ez(2, dh(nth) + 10)
      .hull(self(), Point(0, 0, dh(nth) + 15))
      .cut(
        Seq({ from: 2, to: dh(nth) + 5, by: 8 }, (h) =>
          Box(3.5, 15, [h, h + 5]).rz(da(nth + h))
        )
      );
  } else {
    return Triangle(14)
      .clip(Box(20, [-2, 4]))
      .clean()
      .chainHull(
        z(2),
        z(dh(nth) + 5),
        scale(0.25, 0.25, 1)
          .z(dh(nth) + 10)
          .y(1)
      )
      .cut(
        Seq({ from: 2, to: dh(nth), by: 8 }, (h) =>
          Box(3.5, 15, [h, h + 5]).rz(da(nth + h))
        )
      )
      .to(place(turn))
      .on(self(), rz(-3 / 12).x(2.5));
  }
};
```

```JavaScript
const Building2 = (seed = 0, turn = 0, nth = 0) => {
  const dh = random(seed * 398).in(2, 20);
  const da = random(seed * 432).in(0, 1);
  const dl = random(seed * 213).pick(1 / 32, 1 / 32, 0, 0, 0, 0, 0);
  const dr = random(seed * 632).pick(1 / 32, 1 / 32, 0, 0, 0, 0, 0);
  if (turn === 0) {
    return (
      Hexagon(10)
        //.ez(2, dh(nth) + 10)
        .chainHull(
          self(),
          z(dh(nth) + 10),
          scale(0.25, 0.25, 1).z(dh(nth) + 15)
        )
        .rz(1 / 12)
    );
  } else {
    return Hexagon(28)
      .clip(Line(50).hull(rz(2 / 12 + dl(nth)), rz(4 / 12 - dr(nth))))
      .cut(Hexagon(11.8))
      .clean()
      .chainHull(
        z(2),
        z(dh(nth) + 5),
        scale(0.25, 0.25, 1)
          .z(dh(nth) + 10)
          .y(-7)
      )
      .rz(turn + 1 / 12)
      .on(self(), rz(-1 / 12).x(0));
  }
};
```

```JavaScript
const turnList = (config) =>
  config
    .split(',')
    .map((value) => parseInt(value))
    .filter(isFinite);
```

```JavaScript
const turnSingles = (config) => {
  const turns = turnList(config);
  const singles = [];
  for (let nth = 0; nth < turns.length; nth += 1) {
    singles.push([turns[nth] / 6, nth]);
  }
  return singles;
};
```

```JavaScript
const turnPairs = (config) => {
  const turns = turnList(config);
  const pairs = [];
  for (let nth = 1; nth < turns.length; nth += 2) {
    pairs.push([turns[nth] / 6, turns[nth - 1] / 6, nth]);
  }
  return pairs;
};
```

```JavaScript
const Tile = (...args) => {
  const [
    seed = 0,
    {
      terrain,
      trees,
      islands,
      peaks,
      river,
      path,
      road,
      tunnel,
      wall,
      buildings,
      buildings2,
      field,
      swamp,
      caves,
    },
  ] = args;

  console.log(`Tile: ${JSON.stringify(args)}`);

  let caveCut = Empty();
  if (caves) {
    const dt = random(seed).pick(0 / 6, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6);
    for (let h = 2; h < 20; h += 5) {
      for (let t = 0; t < 6; t++) {
        caveCut = caveCut.and(Tunnel(seed, t / 6, dt(h + t), h).z(h));
      }
    }
  }

  console.log(`QQ/1`);
  const tileTerrain = {
    meadow: Meadow,
    hill: Hill,
    mountain: Mountain,
    dunes: Dunes,
    waves: Waves,
    flat: Flat,
  }[terrain](seed);
  let tile = tileTerrain;

  for (const [turn, nth] of turnSingles(trees)) {
    tile = tile.and(Forest(seed, turn, nth));
  }
  console.log(`QQ/2`);

  const peakTurns = turnList(peaks);
  if (peakTurns.length > 0) {
    tile = tile.and(
      Peaks(
        seed,
        peakTurns.map((turn) => turn / 6)
      )
    );
  }

  const islandTurns = turnList(islands);
  if (islandTurns.length > 0) {
    tile = tile.and(
      Peaks(
        seed,
        islandTurns.map((turn) => turn / 6)
      )
        .z(-8)
        .clip(hex.ez(20))
    );
  }
  console.log(`QQ/3`);

  const swampTurns = turnList(swamp);
  const swamps = [];
  for (const turn of swampTurns) {
    swamps.push(Swamp(seed, turn / 6, swamps.length));
  }
  if (swamps.length > 0) {
    console.log(`QQ/Swamps: ${swamps.length}`);
    tile = tile.cut(...swamps);
  }

  const wallTurns = turnList(wall);
  const walls = [];
  for (const turn of wallTurns) {
    walls.push(Wall(seed, turn / 6, walls.length));
  }
  if (walls.length > 0) {
    tile = tile.and(...walls);
  }

  for (const [to, from, nth] of turnPairs(river)) {
    tile = tile.cut(River(seed, to, from, nth));
  }

  console.log(`QQ/4`);

  for (const [turn, nth] of turnSingles(buildings)) {
    tile = tile.and(Building(seed, turn, nth));
  }

  for (const [turn, nth] of turnSingles(buildings2)) {
    tile = tile.and(Building2(seed, turn, nth));
  }

  const paths = [];
  for (const [from, to, nth] of turnPairs(path)) {
    paths.push(Path(seed, from, to, nth));
  }
  if (paths.length > 0) {
    tile = tile.cut(
      Join(...paths)
        .cut(tileTerrain)
        .z(-0.5)
    );
  }

  const roads = [];
  for (const [from, to, nth] of turnPairs(road)) {
    roads.push(Road(seed, from, to, nth));
  }
  if (roads.length > 0) {
    tile = tile.cut(...roads);
  }

  for (const [turn, nth] of turnSingles(field)) {
    tile = tile.and(Field(seed, turn, nth));
  }

  console.log(`QQ/4a`);

  console.log(`QQ/5`);

  const tunnels = [];
  for (const [from, to, nth] of turnPairs(tunnel)) {
    tunnels.push(Tunnel(seed, from, to, nth));
  }

  if (tunnels.length > 0) {
    tile = tile.cut(...tunnels);
  }
  console.log(`QQ/6`);

  tile = tile.cut(caveCut);

  return tile.clean().fuse();
};
```

### Tile Generator

```JavaScript
const seed4 = control('seed', '1', 'input');
```

```JavaScript
const terrain2 = control('terrain', 'meadow', 'select', [
  'meadow',
  'hill',
  'mountain',
  'dunes',
  'waves',
  'flat',
]);
```

```JavaScript
const trees2 = control('trees', '', 'input');
```

```JavaScript
const islands3 = control('islands', '', 'input');
```

```JavaScript
const peaks = control('peaks', '', 'input');
```

```JavaScript
const river3 = control('river', '', 'input');
```

```JavaScript
const swamp2 = control('swamp', '', 'input');
```

```JavaScript
const path2 = control('path', '', 'input');
```

```JavaScript
const road = control('road', '', 'input');
```

```JavaScript
const tunnel2 = control('tunnel', '', 'input');
```

```JavaScript
const field2 = control('field', '', 'input');
```

```JavaScript
const buildings = control('buildings', '', 'input');
```

```JavaScript
const buildings2 = control('buildings2', '', 'input');
```

```JavaScript
const caves = control('caves', '', 'input');
```

```JavaScript
const wall = control('wall', '', 'input');
```

```JavaScript
await Tile(seed4, {
  terrain: terrain2,
  trees: trees2,
  islands: islands3,
  peaks: peaks,
  river: river3,
  swamp: swamp2,
  path: path2,
  road: road,
  tunnel: tunnel2,
  buildings: buildings,
  buildings2: buildings2,
  caves: caves,
  wall: wall,
  field: field2,
}).stl('tile');
```

[tile_1.stl](hex.tile_1.stl)
