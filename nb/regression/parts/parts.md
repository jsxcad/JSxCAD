Parts regression tests.

```JavaScript
const disk = Arc(4).ex(1).asPart('disk');
```

```JavaScript
const beam = Box(2, 2).ex(10).asPart('beam');
```

```JavaScript
const diskBeam = disk.and(beam).asPart('diskBeam');
```

The bill of materials is disk,diskBeam
