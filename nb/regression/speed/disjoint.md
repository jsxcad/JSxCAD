![Image](disjoint.md.$1_1.png)

![Image](disjoint.md.$1_2.png)

```JavaScript
await Box(10, 10, 10).seq({ upto: 32 }, (t) => random(3, t, (a, b, c) => ry(a).rz(b).x(lerp(-50, 50, c))), Group).view(1).disjoint().pack().view(2);
```

![Image](disjoint.md.$2_1.png)

![Image](disjoint.md.$2_2.png)

```JavaScript
await Box(10).seq({ upto: 256 }, (t) => random(3, t, (a, b) => rz(a).x(lerp(-50, 50, b))), Group).view(1).disjoint().pack().view(2);
```
