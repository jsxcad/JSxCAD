```JavaScript
const joint = Joint({
  armLength: 60,
  endJoint: ArcX(10, 5, 5).color('green').and(ArcX(10, 2, 2).gap()),
  arm: Box(10, 1, [2.5, 60 - 2.5]),
})
  .rx(90 / 360)
  .on(
    get('next'),
    hold(
      Joint({
        armLength: 60,
        baseJoint: ArcX(5, 5, 5).and(ArcX(10, 2, 2).gap()),
        endJoint: ArcX(10, 5, 5).color('red').and(ArcX(10, 2, 2).gap()),
        arm: Box(10, 1, [2.5, 60 - 2.5]),
      })
    )
  )
  .on(
    get('next/next'),
    hold(
      Joint({
        armLength: 60,
        baseJoint: ArcX(5, 5, 5).and(ArcX(10, 2, 2).gap()),
        arm: Box(10, 1, [2.5, 60 - 2.5]),
      })
    )
  )
  .on(get('next'), rx(1 / 3))
  .on(get('next/next'), rx(1 / 3))
  .disjoint()
  .stl('a', getNot('next'))
  .stl('b', get('next').in().getNot('next'))
  .stl('c', get('next/next'));
```

```JavaScript
const Joint = ({
  armLength = 30,
  endJoint = Group(),
  baseJoint = Group(),
  arm = Group(),
} = {}) =>
  And(
    Ref('baseJoint'),
    baseJoint,
    arm,
    endJoint.as('endJoint').z(armLength),
    Group().as('next').z(armLength)
  );
```
