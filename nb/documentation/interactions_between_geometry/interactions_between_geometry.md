---
# Interactions between geometry
JSxCAD offers a number of ways to interact two or more geometries to create new geometry. Most of these operations will work on both 2D and 3D geometry.

---
### ADD
Returns the union of the input shapes.

![Image](interactions_between_geometry.md.0.png)

---
### Assembly
Assembles together two or more 2D or 3D shapes to form a single one. Shapes interact subtractively with shapes later in the arguments list meaning that no overlap is allowed in the generated assembly. See Group as an alternative.

![Image](interactions_between_geometry.md.1.png)

---
### ChainedHull
Performs the hull operation sequentially on the input shapes

![Image](interactions_between_geometry.md.2.png)

---
### Clip
Finds the overlapping volume of two shapes.

![Image](interactions_between_geometry.md.3.png)

![Image](interactions_between_geometry.md.4.png)

---
### Cut
Subtracts one shape from another.

![Image](interactions_between_geometry.md.5.png)

![Image](interactions_between_geometry.md.6.png)

---
### Group
Similar to Assembly, group joins together a number of shapes, however unlike Assembly, Group does not subtract the shapes which means they are allowed to overlap which makes Group much faster to compute than Assembly. Group can also be done using the .and() operator.

![Image](interactions_between_geometry.md.7.png)

![Image](interactions_between_geometry.md.8.png)

---
### Hull
Performs the hull operation on the input shapes.

![Image](interactions_between_geometry.md.9.png)

---
### Pack
Pack takes input geometry and lays it out on a sheet. Groups and Assemblies are split apart, but items are preserved.

![Image](interactions_between_geometry.md.10.png)

![Image](interactions_between_geometry.md.11.png)
