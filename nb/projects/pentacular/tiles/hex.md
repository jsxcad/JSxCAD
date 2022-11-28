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
const tab = Tab(1.5, 32 / 8);
```

```JavaScript
tab.stl('tab', ry(1 / 4));
```

[tab_1.stl](hex.tab_1.stl)

```JavaScript
const hexTile = await hex
  .inset(0.1)
  .ez(2, -1)
  .cut(hex.eachEdge(placeTab(tab)))
  .fuse()
  .clean();
```

```JavaScript
const square = await Box(32);
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
const Tree = Cached('Tree', (seed = 0) => {
  const dx = random(seed).in(3, -3);
  const dy = random(seed + 1).in(3, -3);
  const dz = random(seed + 2).in(4, 8);
  return Hull(Orb(6), Point(dx(0), dy(0), dz(0)))
    .join(Arc(2, 2, [-4]))
    .by(align('z>'))
    .remesh(1)
    .smooth(Box(8, 8, [3, 20]))
    .clean();
});
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
const wave = (low = 1.5, high = 4.5) =>
  cut(ArcX(32, 2, [low, high]).seq({ from: -20, to: 20, by: 1.75 }, y));
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
const Path = Cached('Path', (seed = 0, to = 3 / 6, from = 0 / 6) => {
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
    .eachPoint(
      (p, n) => (s) =>
        Arc(2, 2, [0, 4])
          .and(Orb(2, 2, [3, 5]).hasZag(1))
          .to(p),
      ChainHull
    )
    .clean()
    .fuse();
});
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
              .and(Orb(6, 6, [3, 5]).hasZag(1))
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
const Tunnel = Cached('Tunnel', (seed = 0, to = 3 / 6, from = 0 / 6) => {
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
const Field = (seed = 0, turn = 0, nth = 0) => {
  const dl = random(seed * 872).in(8, 14);
  const dw = random(seed * 313).in(8, 14);
  const dr = random(seed * 398).in(-1 / 6, 1 / 6);
  if (turn === 0) {
    return Hexagon(10).ez(2, 5).op(wave(3.5, 5));
  } else {
    return (
      Triangle(14)
        .clip(Box(20, 6))
        .ez(2, 4)
        //.op(wave(2.5, 4.5))
        //.rz(dr(nth))
        .to(place(turn))
        .on(
          noOp(),
          rz(-3 / 12)
            .x(2.5)
            .op(wave(3.5, 5))
        )
    );
  }
};
```

```JavaScript
const Wall = (seed = 0, turn = 0, nth = 0) =>
  Triangle(18)
    .clip(Box(20, [-5, -3]))
    .ez(2, 8)
    .to(place(turn))
    .on(noOp(), rz(-3 / 12).x(2.5));
```

```JavaScript
const Buildings = (
  seed = 0,
  turn = 0,
  nth = 0,
  rd = random((nth + seed) * 27).in(0, 6),
  ra = random((nth + seed) * 54).in(0, 1),
  rs = random((nth + seed) * 59).in(3, 12),
  rl = random((nth + seed) * 71).in(2, 6),
  rw = random((nth + seed) * 81).in(2, 6),
  rh = random((nth + seed) * 59).in(2, 5)
) =>
  Seq({ to: 3 }, (n) =>
    (rs(n) > 8 ? Box : Arc)(rl(n), rw(n), [0, rh(n)])
      .hasSides(rs(n))
      .x(rd(n))
      .rz(ra(n))
  )
    .and(Arc(12).ez(-0.5))
    .to(place(turn))
    .z(2);
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
const Tile = Shape.registerShapeMethod('Tile', async (...args) =>
  {
  // testMode(false, () => {
    console.log(`QQ/Tile: ${JSON.stringify(args)}`);
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
        field,
        swamp,
      },
    ] = args;
    console.log(`QQ/1`);
    const tileTerrain = await {
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
    console.log(`QQ/2: ${tile}`);

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
    console.log(`QQ/3: ${tile}`);

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
    console.log(`QQ/4: ${tile}`);

    const roads = [];
    for (const [from, to, nth] of turnPairs(road)) {
      roads.push(Road(seed, from, to, nth));
    }
    if (roads.length > 0) {
      tile = tile.cut(...roads);
      //.cut(tileTerrain)
      //.z(-0.5)
    }

    for (const [turn, nth] of turnSingles(field)) {
      tile = tile.and(Field(seed, turn, nth));
    }

    console.log(`QQ/4a: ${tile}`);

    for (const [turn, nth] of turnSingles(buildings)) {
      tile = tile.and(Buildings(seed, turn, nth));
    }
    console.log(`QQ/5: ${tile}`);

    const tunnels = [];
    for (const [from, to, nth] of turnPairs(tunnel)) {
      tunnels.push(Tunnel(seed, from, to, nth));
    }

    if (tunnels.length > 0) {
      tile = tile.cut(...tunnels);
    }
    console.log(`QQ/6: ${tile}`);

    return tile.clean().fuse();
  // })();
  });
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
  wall: wall,
  field: field2,
}).stl('tile');
```

[tile_1.stl](hex.tile_1.stl)
