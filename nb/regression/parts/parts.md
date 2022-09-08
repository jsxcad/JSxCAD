Parts regression tests.

```JavaScript
const disk = Arc(4).ez(1).asPart('disk');
```

```JavaScript
const beam = Box(2, 2).ez(10).asPart('beam');
```

```JavaScript
const diskBeam = disk.and(beam).asPart('diskBeam');
```

Materials: disk, diskBeam

The bill of materials is [object Object]
