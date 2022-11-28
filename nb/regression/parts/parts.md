Parts regression tests.

```JavaScript
const disk = await Arc(4).ez(1).asPart('disk');
```

```JavaScript
const beam = await Box(2, 2).ez(10).asPart('beam');
```

```JavaScript
const diskBeam = await disk.and(beam).asPart('diskBeam');
```

The bill of materials is function () { [native code] }
