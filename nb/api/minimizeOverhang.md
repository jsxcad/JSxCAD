[index](../../nb/api/index.md)
### minimizeOverhang()
Parameter|Default|Type
---|---|---
|threshold|130|Reference shape
|'split'|false|Minimize symmetrically toward XY(0).

If 'split' is specified arranges a shape so that when cut along the XY(0) plane it produces two shapes with the area of faces with inclinations exceeding the threshold projected onto the XY(0) plane being semi-minimal.

The result can then be cut and reoriented using something like cutOut(XY(), rx(0), rx(1 / 2)).

Otherwise arranges a shape to minimize overhangs one in direction, without crossing XY(0) or being cut.

Note: This is experimental and may change.

![Image](minimizeOverhang.md.$2.png)

ArcX(5, 5, [-5]).join(Box(5, 5, 5)).minimizeOverhang('split')

```JavaScript
ArcX(5, 5, [-5]).join(Box(5, 5, 5)).minimizeOverhang('split').view()
  .note(`ArcX(5, 5, [-5]).join(Box(5, 5, 5)).minimizeOverhang('split')`);
```

![Image](minimizeOverhang.md.$3.png)

ArcX(5, 5, [-5]).join(Box(5, 5, 5)).minimizeOverhang().cutOut(XY(), rx(0), rx(1 / 2)).pack()

```JavaScript
ArcX(5, 5, [-5]).join(Box(5, 5, 5)).minimizeOverhang().cutOut(XY(), rx(0), rx(1 / 2)).pack().view()
  .note('ArcX(5, 5, [-5]).join(Box(5, 5, 5)).minimizeOverhang().cutOut(XY(), rx(0), rx(1 / 2)).pack()');
```
