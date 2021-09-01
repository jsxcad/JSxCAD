md`
---
# Interactions between geometry
JSxCAD offers a number of ways to interact two or more geometries to create new geometry. Most of these operations will work on both 2D and 3D geometry.`;


md`
---
### ADD
Returns the union of the input shapes.`;

Arc(10, 10, 5).add(Box(5, 5, 5).move(3, 0, 2)).view();

md`
---
### Assembly
Assembles together two or more 2D or 3D shapes to form a single one. Shapes interact subtractively with shapes later in the arguments list meaning that no overlap is allowed in the generated assembly. See Group as an alternative.`;

const twoCylindersAssembled = Assembly(
  Arc(10, 10, 3).color('red'),
  Arc(10, 10, 3).color('blue').x(4)
).view();

md`
---
### ChainedHull
Performs the hull operation sequentially on the input shapes`;

ChainedHull(Arc(10), Box(5).move(12, 12, 0), Arc(20).x(40)).view();

md`
---
### Clip
Finds the overlapping volume of two shapes.`;

Arc(10, 10, 5).clip(Box(5, 5, 5).move(3, 0, 2)).view();

Arc(10, 10, 5).clipFrom(Box(5, 5, 5).move(3, 0, 2)).view();

md`
---
### Cut
Subtracts one shape from another.`;

Arc(10, 10, 5).cut(Box(5, 5, 5).move(3, 0, 2)).view();

Arc(10, 10, 5).cutFrom(Box(5, 5, 5).move(3, 0, 2)).view();

md`
---
### Group
Similar to Assembly, group joins together a number of shapes, however unlike Assembly, Group does not subtract the shapes which means they are allowed to overlap which makes Group much faster to compute than Assembly. Group can also be done using the .and() operator.`;

Group(Arc(10, 10, 3), Arc(10, 10, 3).x(4)).view();

Arc(10, 10, 3).and(Arc(10, 10, 3).x(4)).view(); //Does a group

md`
---
### Hull
Performs the hull operation on the input shapes.`;

Hull(Arc(10), Box(5).move(12, 12, 0), Arc(20).x(40)).view();

md`
---
### Pack
Pack takes input geometry and lays it out on a sheet. Groups and Assemblies are split apart, but items are preserved.`;

Group(Arc(10), Box(3), Box(3.5)).pack().view();

Group(Arc(10), Box(3), Box(3.5)).as('anItem').pack().view();
