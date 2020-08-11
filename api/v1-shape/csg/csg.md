Some examples of constructive solid geometry.

![Image](csg.md.1.png)

'''
Cube(10, 10, 20)
.add(Cube(20, 10, 10))
.add(Cube(10, 20, 10))
.withOutline()
.Item()
.view();
'''

---

![Image](csg.md.2.png)

'''
Cube(20)
.cut(Cylinder(12, 12))
.withOutline()
.Item()
.view();
'''

---

'''
const sphere = Sphere(10).clip(Cube(19.5));
'''

![Image](csg.md.3.png)

'''
sphere
.withOutline()
.Item()
.view();
'''

![Image](csg.md.4.png)

'''
Cube(18)
.cut(sphere)
.withOutline()
.Item()
.view();
'''
