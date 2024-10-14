![Image](disjoint.md.$1_1.png)

![Image](disjoint.md.$1_2.png)

```JavaScript
Box(10, 10, 10).seq({ upto: 32 }, (t) => random(3, t, (a, b, c) => ry(a).rz(b).x(lerp(-50, 50, c))), Group).view(1).disjoint().pack('bb').view(2);
```

![Image](disjoint.md.$2.png)

```JavaScript
Point().view();
```
