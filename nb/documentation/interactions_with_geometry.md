# Interactions with Geometry
JSxCAD provides a number of functions to modify existing geometry.

---
### Color
Geometry can be given a color

![Image](interactions_with_geometry.md.0.png)

---
### Extrude
2D shapes can be 'extruded' to create 3D shapes. This can be abbreviated to .ex() for brevity.

![Image](interactions_with_geometry.md.1.png)

![Image](interactions_with_geometry.md.2.png)

---
### Item
Geometry can be defined to be an "item". Items are a way to identify individual elements within an assembly or group. Items are different from tags in that an item is a monolithic entity, while an object with a tag is a collection of individual geometry elements each of which has that tag. Items ideally correspond to real world physical items.

![Image](interactions_with_geometry.md.3.png)

![Image](interactions_with_geometry.md.4.png)

![Image](interactions_with_geometry.md.5.png)

---
### Grow
Expands the shape outwards by the input distance. May result in self intersections if not used cautiously.

![Image](interactions_with_geometry.md.6.png)

---
### Move
A shape can be moved in XYZ space using the .move(x,y,z) command. These can also be shortened to .x(), .y(), or .z() if a movement in only one axis is needed.

![Image](interactions_with_geometry.md.7.png)

---
### Remesh
Remesh can be used to break up the segments of a shape allowing it to be distorted. .remesh(4, 2) first breaks segments longer than 4 and then breaks segments longer than 2. Then the shape is re-triangularized.

![Image](interactions_with_geometry.md.8.png)

![Image](interactions_with_geometry.md.9.png)

Once a shape is remeshed it can be twisted or bent about the origin.

![Image](interactions_with_geometry.md.10.png)

![Image](interactions_with_geometry.md.11.png)

---
### Rotate
A shape can be rotated about the origin using the .rx(), .ry(), and .rz() commands. These take an argument of a fraction of a rotation, so .rz(1/8) would rotate the shape by 1/8th of a rotation.

![Image](interactions_with_geometry.md.12.png)

![Image](interactions_with_geometry.md.13.png)

---
### Scale
Scale enlarges a shape by the entered multiple.

![Image](interactions_with_geometry.md.14.png)

---
### Section
Section takes a 2D slice of a 3D shape. By default the slice is taken where the shape intersects the XY plane.

![Image](interactions_with_geometry.md.15.png)

---
### Size
Size returns the size of the shape along with it's bounding box corners.

---
### Tags
Tags lists all of the tags associated with a shape.

Tags can be used to selectively keep or remove parts of geometry.

![Image](interactions_with_geometry.md.16.png)

![Image](interactions_with_geometry.md.17.png)

![Image](interactions_with_geometry.md.18.png)
