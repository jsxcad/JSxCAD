Some examples of constructive solid geometry.

![Image](csg.md.1.png)

'''
Box(10, 10, 20)
.add(Box(20, 10, 10))
.add(Box(10, 20, 10))
.view();
'''

---

![Image](csg.md.2.png)

'''
Box(20)
.cut(Rod(12, 12))
.view();
'''

---

'''
const orb = Sphere(10).clip(Cube(19.5));
'''

![Image](csg.md.3.png)
![Image](csg.md.4.png)

'''
Box(18, 18, 18)
.cut(orb)
.view();
'''
