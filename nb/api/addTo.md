# shape.addTo(other)

Extends the form of other to cover the form of shape.

'''
Box(10)
  .color('blue')
  .addTo(Triangle(15).color('green'))
  .view();
'''

```JavaScript
Box(10)
  .color('blue')
  .addTo(Triangle(15).color('green'))
  .view()
  .md('The result is green.');
```

![Image](addTo.md.0.png)

The result is green.

Constrast this with [add](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/add.nb) which extends shape to cover other.

'''
Box(10)
  .color('blue')
  .add(Triangle(15).color('green'))
  .view()
'''

```JavaScript
Box(10)
  .color('blue')
  .add(Triangle(15).color('green'))
  .view()
  .md('The result is blue.');
```

![Image](addTo.md.1.png)

The result is blue.
