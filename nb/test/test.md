![Image](test.md.joint.png)

```JavaScript
const joint = Joint(
  60,
  20,
  Box(10, 1, [2.5, 60]).join(ArcX(5, 5, 5)).and(ArcX(5, 2, 2).gap()),
  Box(10, 1, [2.5, 20])
    .join(ArcX([-5, -2.5], 5, 5), ArcX([5, 2.5], 5, 5))
    .and(ArcX(10, 2, 2).gap())
)
  .on(get('arm'), rx(90 / 360))
  .on(get('base'), rx(30 / 360))
  .view();
```

```JavaScript
const Joint = (
  baseLength = 30,
  armLength = 30,
  base = Group(),
  arm = Group()
) =>
  And(
    And(Ref('hinge'), base, Ref('end').z(baseLength)).as('base'),
    And(Ref('hinge'), arm, Ref('end').z(armLength)).as('arm')
  );
```

![Image](test.md.$1.png)

![Image](test.md.$1_base.png)

[base.stl](test.base.stl)

![Image](test.md.$1_arm_base.png)

[arm_base.stl](test.arm_base.stl)

![Image](test.md.$1_arm_arm.png)

[arm_arm.stl](test.arm_arm.stl)

```JavaScript
joint
  .on(
    get('arm').in().get('end'),
    and(
      Joint(
        50,
        30,
        Box(10, 1, [2.5, 50]).join(ArcX(5, 5, 5)).and(ArcX(5, 2, 2).gap()),
        Box(10, 1, [2.5, 30])
          .join(ArcX([-5, -2.5], 5, 5), ArcX([5, 2.5], 5, 5))
          .and(ArcX(10, 2, 2).gap())
      )
        .on(get('arm'), rx(-60 / 360))
        .to(origin(), get('arm').in().get('end'))
        .rx(1 / 2)
    )
  )
  .view()
  .stl('base', get('base').disjoint())
  .stl('arm_base', get('arm').in().get('base').disjoint())
  .stl('arm_arm', get('arm').in().getNot('base').disjoint())

  .v(1);
```

![Image](test.md.j2.png)

```JavaScript
const j2 = joint
  .on(
    joint.get('arm').in().get('end'),
    and(To(joint, get('arm').in().get('end')))
  )
  .view()
  .v(2);
```

![Image](test.md.$2.png)

```JavaScript
Joint(40, 40)
  .on(get('base').in().get('end'), and(Box(30)))
  .view();
```

![Image](test.md.b.png)

```JavaScript
const b = joint.flat(get('base').in().get('end')).view().v(2);
```
