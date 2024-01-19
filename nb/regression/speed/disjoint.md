```JavaScript
const r = Random();
```

![Image](disjoint.md.$1_1.png)

![Image](disjoint.md.$1_2.png)

```JavaScript
await Box(10, 10, 10).seq({ upto: 32 }, (t) => ry(r.in(0, 1)).rz(r.in(0, 1)).x(r.in(-50, 50)), Group).view(1).disjoint().pack().view(2);
```

![Image](disjoint.md.$2_1.png)

![Image](disjoint.md.$2_2.png)

```JavaScript
await Box(10).seq({ upto: 256 }, (t) => rz(r.in(0, 1)).x(r.in(-50, 50)), Group).view(1).disjoint().pack().view(2);
```
