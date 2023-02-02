## Gear Motor

```JavaScript
const motorProfile = await Arc(12).clip(Box(9.8, 12));
```

```JavaScript
export const gearboxProfile = await Box(9.8, 11.8);
```

```JavaScript
export const axleProfile = await Arc(3.2);
```

```JavaScript
export const axleFlatProfile = await axleProfile.clip(Box(3.2).x(0.5));
```

```JavaScript
export const MicroGearMotor = Shape.registerMethod(
  'MicroGearMotor',
  ({
    axleLength = 10.8,
    gearboxLength = 9.1,
    motorLength = 15.5,
    hubLength = 1.5,
  } = {}) => (shape) =>
    Group(
      axleFlatProfile.ez([axleLength]),
      gearboxProfile.ez([0 - gearboxLength]),
      motorProfile.ez([0 - gearboxLength, -gearboxLength - motorLength]),
      Arc(5).ez(
        [0 - gearboxLength - motorLength,
        -gearboxLength - motorLength - hubLength]
      )
    )
    .fuse()
);
```
