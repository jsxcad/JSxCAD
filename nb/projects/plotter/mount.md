```JavaScript
import { NutThread, ScrewThread } from '../bolt/bolt.nb';
```

```JavaScript
import { Gear } from '../gear/gear.js';
```

```JavaScript
import {
  bodyDiameter,
  reelDiameter,
  reelThickness,
  stepperMotor28byj48,
} from '../28BYJ-48/28BYJ-48.nb';
```

```JavaScript
const boardThickness = 8.4;
```

```JavaScript
const screw = ScrewThread(16, 5)
  .cut(
    Box(2, 6)
      .ez(5)
      .rz(0, 1 / 4)
  )
  .stl('screw', rx(1 / 2));
```

![Image](mount.md.0.png)

[screw_0.stl](mount.screw_0.stl)

```JavaScript
const upsideClip = Box(30 + 4)
  .align('x>y>')
  .ez(boardThickness + 2, -5)
  .cut(Box(30).align('x>y>').ez(boardThickness))
  .rz(1 / 8)
  .x(2)
  .cut(Box(22).ez(20, -5))
  .cut(Arc(16).ez(-5).x(33))
  .op((s) =>
    Line(21, -21)
      .rz(1 / 4)
      .z(10.5, 0)
      .x(23)
      .hull()
      .op((f) => s.cut(f.extrudeAlong(normal(), -15)).and(f.extrudeAlong(normal(), 0.4)))
  )
  .and(NutThread(16, 5).z(-5).x(33))
  .as('clip')
  .view();
```

![Image](mount.md.1.png)

```JavaScript
const upsideProfile = Box(30, 27)
  .clip(
    Arc(bodyDiameter + 2).hull(
      Line((bodyDiameter + 2) / 2, (bodyDiameter + 2) / -2)
        .rz(1 / 4)
        .x(-15)
    )
  )
  .view();
```

![Image](mount.md.2.png)

```JavaScript
const toothedReel = Group(
  Arc(reelDiameter + 8)
    .ez(1)
    .z(reelThickness / -2)
    .as('rim')
    .fitTo(Arc(reelDiameter, reelDiameter, reelThickness)),
  Arc(reelDiameter + 4)
    .ez(1)
    .z(reelThickness / 2),
  Gear()
    .hasMmPerTooth(5)
    .hasTeeth(17)
    .ez(2, 1)
    .z(reelThickness / 2)
)
  .as('toothedReel')
  .view(rx(1 / 2));
```

![Image](mount.md.3.png)

```JavaScript
const upsideBox = upsideProfile
  .ez(20, 9 - 3 + 4)
  .as('box-top')
  .material('glass')
  .and(
    upsideProfile
      .ez(9 - 3 + 4, 2)
      .mask(grow(0.1))
      .as('box-base')
  )
  .fitTo(Box(5, 10).x(-11.5).ez(-3, 20).color('green').as('box-pin'))
  .view();
```

![Image](mount.md.4.png)

```JavaScript
const upsideDesign = stepperMotor28byj48
  .rx(1 / 2)
  .align('z>')
  .z(2)
  .fit(upsideBox)
  .cutOut(at(get('shaft'), Arc(reelDiameter + 12).ez(2, 11)));
```

```JavaScript
const upsideDesign2 = upsideDesign
  .material('glass')
  .and(
    op((s) =>
      upsideClip
        .rz(1 / 2)
        .rx(1 / 2)
        .z(2 - 5)
        .x(5)
        .fitTo(s.g('box-pin'))
    )
  )
  .on(get('shaft'), fit(toothedReel.z(6)))
  .view()
  .stl('box-top', get('box-top'))
  .stl('box-pin', (s) => s.get('box-pin').ry(1 / 4))
  .stl('box-base', (s) => s.get('box-base').rx(1 / 2))
  .stl('reel',
    (s) =>
      s
        .get('toothedReel')
        .n(1) // This is due to the cutOut earlier?
        .on(
          (s) => s.get('rim'),
          (s) => s.color('green').void()
        )
        .material('glass'),
  )
  .stl('rim', (s) => s.get('toothedReel').n(1).get('rim'))
  .stl('clip', (s) => s.get('clip').rx(1 / 2));
```

![Image](mount.md.5.png)

![Image](mount.md.6.png)

[box-top_0.stl](mount.box-top_0.stl)

![Image](mount.md.7.png)

[box-pin_0.stl](mount.box-pin_0.stl)

![Image](mount.md.8.png)

[box-base_0.stl](mount.box-base_0.stl)

![Image](mount.md.9.png)

[reel_0.stl](mount.reel_0.stl)

![Image](mount.md.10.png)

[rim_0.stl](mount.rim_0.stl)

![Image](mount.md.11.png)

[clip_0.stl](mount.clip_0.stl)
