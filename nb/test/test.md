```JavaScript
const r = Random();
```

![Image](test.md.$1_1.png)

![Image](test.md.$1_2.png)

```JavaScript
Box(10, 10, 10).seq({ to: 32 }, (t) => ry(r.in(0, 1)).rz(r.in(0, 1)).x(r.in(-50, 50)), Group).view(1).disjoint().pack().view(2)
```
