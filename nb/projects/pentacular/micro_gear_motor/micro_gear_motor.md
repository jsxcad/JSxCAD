```JavaScript
import { Gear } from '../gear/gear.js';
```

```JavaScript
import { Block, SocketBoard, StudBoard, block16x8x9_6 } from '../lego/lego.nb';
```

## Gear Motor and Sheath

```JavaScript
const motorProfile = Arc(12).clip(Box(9.8, 12)).md('Motor Profile').gridView();
```

Motor Profile

![Image](micro_gear_motor.md.0.png)

```JavaScript
const gearboxProfile = Box(9.8, 11.8).md('Gearbox Profile').gridView();
```

Gearbox Profile

![Image](micro_gear_motor.md.1.png)

```JavaScript
const axleProfile = Arc(3.2).md('Axle Profile').gridView();
```

Axle Profile

![Image](micro_gear_motor.md.2.png)

```JavaScript
const rearHubProfile = Arc(4.8).md('Rear Hub Profile').gridView();
```

Rear Hub Profile

![Image](micro_gear_motor.md.3.png)

```JavaScript
const axleFlatProfile = axleProfile
  .clip(Box(3.2).x(0.5))
  .md('Flat Axle Profile')
  .gridView();
```

Flat Axle Profile

![Image](micro_gear_motor.md.4.png)

```JavaScript
const wireThickness = 0.8;
```

```JavaScript
const motor = Group(
  axleFlatProfile.ez(13.5 + 9.1, 13.5 + 9.1 + 10.8),
  gearboxProfile.ez(13.5, 13.5 + 9.1),
  motorProfile.ez(13.5, 0)
)
  .md('Motor')
  .view();
```

Motor

![Image](micro_gear_motor.md.5.png)

```JavaScript
const wireChannelProfile = Box(wireThickness, wireThickness * 5)
  .x(5.3)
  .md('Wire Channel Profile')
  .gridView();
```

Wire Channel Profile

![Image](micro_gear_motor.md.6.png)

```JavaScript
const capProfile = Box(9.8 + 2, 12 + 2)
  .add(Box(wireThickness * 2, wireThickness * 7).x(5.3 + 0.4))
  .md('Cap Profile')
  .gridView();
```

Cap Profile

![Image](micro_gear_motor.md.7.png)

```JavaScript
const gearProfile = Gear(20).md('Gear Profile').gridView();
```

Gear Profile

![Image](micro_gear_motor.md.8.png)

```JavaScript
const sheath = capProfile
  .cut(motorProfile, wireChannelProfile)
  .ez(0, 5)
  .md('Sheath')
  .stl('sheath1');
```

Sheath

![Image](micro_gear_motor.md.9.png)

[sheath1_0.stl](micro_gear_motor.sheath1_0.stl)

```JavaScript
const gear = Gear(20)
  .fill()
  .cut(axleFlatProfile)
  .ez(4)
  .md('Gear')
  .gridView()
  .stl('gear2');
```

Gear

![Image](micro_gear_motor.md.10.png)

![Image](micro_gear_motor.md.11.png)

[gear2_0.stl](micro_gear_motor.gear2_0.stl)

```JavaScript
const cap = Group(capProfile.ez(-2, -0.0), sheath).md('Cap').stl('cap');
```

Cap

![Image](micro_gear_motor.md.12.png)

[cap_0.stl](micro_gear_motor.cap_0.stl)

```JavaScript
const gearCutout = Gear(20).fill()
  .and(cutFrom(Arc(24)).inset(0.5))
  .as('gear cutout')
  .md('Gear Cutout')
  .gridView();
```

Gear Cutout

![Image](micro_gear_motor.md.13.png)

## Motor Driver Bracket

```JavaScript
const motorDriverHolder = Block(4, 4, 3.2 * 5)
  .cut(Box(20.7, 24.7).ez(2, 100))
  .as('motor driver holder')
  .md('Motor Driver Holder')
  .stl('motor_driver_holder_3');
```

Motor Driver Holder

![Image](micro_gear_motor.md.14.png)

[motor_driver_holder_3_0.stl](micro_gear_motor.motor_driver_holder_3_0.stl)

## Wemos Bracket

```JavaScript
const wemosDriverHolder = Block(4, 5, 3.2 * 11)
  .cut(Box(25.7 + 0.2, 34.5 + 0.2).ez(2, 100))
  .cut(XZ().Box(3 * 8, 2.5 * 8).extrudeAlong(normal(), 3.2 * (4 + 1.5), 100))
  .cut(YZ().Box(3.2 * 8, 4 * 8).extrudeAlong(normal(), 3.2 * (4 + 1.5), 100))
  .cut(
    XZ()
      .involute()
      .Box(3 * 8, 2.5 * 8)
      .extrudeAlong(normal(), 3.2 * (4 + 1.5), 100)
  )
  .cut(
    YZ()
      .involute()
      .Box(3.2 * 8, 4 * 8)
      .extrudeAlong(normal(), 3.2 * (4 + 1.5), 100)
  )
  .as('wemos holder')
  .md('Wemos Driver Holder')
  .rz(1 / 2)
  .stl('wemos_holder_2');
```

Wemos Driver Holder

![Image](micro_gear_motor.md.15.png)

[wemos_holder_2_0.stl](micro_gear_motor.wemos_holder_2_0.stl)

## Gear Motor Bracket

```JavaScript
const motorHolderLegoBoard = Block(1, 4, 3.2).y(6);
```

```JavaScript
const motorHolderMotor = Group(motor, sheath.z(9.1 - 0.7), cap)
  .rx(1 / 4)
  .ry(-1 / 4)
  .move(0, 14, 5.6 + 3.2 - 0.7)
  .as('motor')
  .md('Motor holder moter')
  .view();
```

Motor holder moter

![Image](micro_gear_motor.md.16.png)
