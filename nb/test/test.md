![Image](test.md.$1_1.png)

![Image](test.md.$1_2.png)

```JavaScript
Box(10, 10, 10).seq({ upto: 16 }, (t) => random(3, t, (a, b, c) => ry(a).rz(b).x(lerp(-50, 50, c))), Group).view(1).disjoint().pack('bb').view(2);
```
