```JavaScript
const acos = (a) => (Math.acos(a) / (Math.PI * 2)) * 360;
```

```JavaScript
const cos = (a) => Math.cos((a / 360) * Math.PI * 2);
```

```JavaScript
const sin = (a) => Math.sin((a / 360) * Math.PI * 2);
```

```JavaScript
export const polar = (radius, theta) => [
  radius * sin(theta),
  radius * cos(theta),
];
```

```JavaScript
export const q6 = (baseCircle, side, angle, pitchRadius) =>
  polar(pitchRadius, side * (iang(baseCircle, pitchRadius) + angle));
```

```JavaScript
export const q7 = (
  fraction,
  rootRadius,
  baseRadius,
  outerRadius,
  angle,
  side
) =>
  q6(
    baseRadius,
    side,
    angle,
    (1 - fraction) * Math.max(baseRadius, rootRadius) + fraction * outerRadius
  );
```

```JavaScript
export const iang = (baseRadius, pitchRadius) =>
  (Math.sqrt((pitchRadius / baseRadius) * (pitchRadius / baseRadius) - 1) /
    Math.PI) *
    180 -
  acos(baseRadius / pitchRadius);
```

```JavaScript
export const ToothProfile = (
  rootRadius = 7,
  baseRadius = 7.517540966287267,
  outerRadius = 9,
  angle = -6.478958291841238,
  resolution = 5
) => {
  const path = [polar(rootRadius, -angle)];
  for (let i = 0; i <= resolution; i++) {
    path.push(
      q7(i / resolution, rootRadius, baseRadius, outerRadius, angle, -1)
    );
  }
  for (let i = resolution; i >= 0; i--) {
    path.push(
      q7(i / resolution, rootRadius, baseRadius, outerRadius, angle, 1)
    );
  }
  if (rootRadius < baseRadius) {
    path.push(polar(rootRadius, angle));
  }

  return Link(Points(path));
};
```

```JavaScript
export const pitchRadius = (mmPerTooth = Math.PI, numberOfTeeth = 16) =>
  (mmPerTooth * numberOfTeeth) / Math.PI / 2;
```

```JavaScript
export const outerRadius = (
  mmPerTooth = Math.PI,
  numberOfTeeth = 16,
  clearance = 0
) => pitchRadius(mmPerTooth, numberOfTeeth) + mmPerTooth / Math.PI - clearance;
```

```JavaScript
export const baseRadius = (
  mmPerTooth = Math.PI,
  numberOfTeeth = 16,
  pressureAngle = 20
) => pitchRadius(mmPerTooth, numberOfTeeth) * cos(pressureAngle);
```

```JavaScript
export const rootRadius = (
  mmPerTooth = Math.PI,
  numberOfTeeth = 16,
  clearance = 0
) => {
  const p = pitchRadius(mmPerTooth, numberOfTeeth);
  const c = outerRadius(mmPerTooth, numberOfTeeth);
  return p - (c - p) - clearance;
};
```

```JavaScript
export const Gear = ({ teeth = 16, mmPerTooth = Math.PI, hiddenTeeth = 0, pressureAngle = 20, clearance = 0, backlash = 0, toothResolution = 5 } = {}) => {
  const pi = Math.PI;
  const p = pitchRadius(mmPerTooth, teeth);
  const c = outerRadius(mmPerTooth, teeth, clearance);
  const b = baseRadius(mmPerTooth, teeth, pressureAngle);
  const r = rootRadius(mmPerTooth, teeth, clearance);
  const t = mmPerTooth / 2 - backlash / 2;

  // angle to where involute meets base circle on each side of tooth
  const k = -iang(b, p) - (t / 2 / p / pi) * 180;

  const toothProfile = ToothProfile(r, b, c, k, toothResolution);

  return toothProfile
    .seq(
      { upto: teeth - hiddenTeeth },
      (i) => rz(-i / teeth),
      Group
    )
    .loop()
    .fill()
    .setTag('plan:gear/teeth', teeth)
    .setTag('plan:gear/mmPerTooth', mmPerTooth)
    .setTag('plan:gear/hiddenTeeth', hiddenTeeth)
    .setTag('plan:gear/pressureAngle', pressureAngle)
    .setTag('plan:gear/clearance', clearance)
    .setTag('plan:gear/backlash', backlash)
    .setTag('plan:gear/toothResolution', toothResolution);
}
```
