md`
# Interactions with Geometry
JSxCAD provides a number of functions to modify existing geometry.`;
md`
---
### Color
Geometry can be given a color`;

Box(10, 10, 10).color('pink').view();

md`
---
### Extrude
2D shapes can be 'extruded' to create 3D shapes. This can be abbreviated to .ex() for brevity.`;

Arc(10).view();
Arc(10).extrude(5).view();

md`
---
### Item
Geometry can be defined to be an "item". Items are a way to identify individual elements within an assembly or group. Items are different from tags in that an item is a monolithic entity, while an object with a tag is a collection of individual geometry elements each of which has that tag. Items ideally correspond to real world physical items.`;

const aBolt = Group(Arc(8, 8, 2), Arc(4, 4, 14).z(-7))
  .color('brown')
  .as('bolt')
  .view();

const aGroup = Assembly(Box(10, 10, 10), aBolt.z(10)).view();

aGroup.get('*').view();

md`
---
### Grow
Expands the shape outwards by the input distance. May result in self intersections if not used cautiously.`;

Arc(10, 10, 5).grow(1).view();

md`
---
### Move
A shape can be moved in XYZ space using the .move(x,y,z) command. These can also be shortened to .x(), .y(), or .z() if a movement in only one axis is needed.`;

Box(5, 5, 5).move(10, 2, 12).view();

md`
---
### Remesh
Remesh can be used to break up the segments of a shape allowing it to be distorted. .remesh(4, 2) first breaks segments longer than 4 and then breaks segments longer than 2. Then the shape is re-triangularized.`;

const aRectangle = Box(5, 5, 15).view();

aRectangle.remesh(4, 2).view({ wireframe: true });

md`
Once a shape is remeshed it can be twisted or bent about the origin.`;

aRectangle.remesh(4, 1).twist(10).view({ wireframe: true });

aRectangle
  .ry(1 / 4)
  .remesh(4, 1)
  .y(10)
  .bend(4)
  .view({ wireframe: true });

md`
---
### Rotate
A shape can be rotated about the origin using the .rx(), .ry(), and .rz() commands. These take an argument of a fraction of a rotation, so .rz(1/8) would rotate the shape by 1/8th of a rotation. `;

aRectangle.rz(1 / 8).view();

aRectangle
  .rotateY(1 / 10)
  .x(4)
  .z(-2)
  .view();

md`
---
### Scale
Scale enlarges a shape by the entered multiple.`;

aRectangle.scale(2).view();

md`
---
### Section
Section takes a 2D slice of a 3D shape. By default the slice is taken where the shape intersects the XY plane.`;

aRectangle.section().view();

md`
---
### Size
Size returns the size of the shape along with it's bounding box corners.`;

log(aRectangle.size());

md`
---
### Tags
Tags lists all of the tags associated with a shape.`;

log(aRectangle.tag('tagString').tags());

md`
Tags can be used to selectively keep or remove parts of geometry.`;

const tagsAssembly = Assembly(
  Arc(10, 10, 2).color('blue').tag('thing1'),
  Box(6, 5, 2).move(2, 1, 1).color('red').tag('thing2')
).view();

tagsAssembly.keep('thing1').noVoid().view();

tagsAssembly.drop('thing1').view();
