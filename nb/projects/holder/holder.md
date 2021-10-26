```JavaScript
const penDiameter = 10.5;
```

```JavaScript
const magnetDiameter = 5.0;
```

```JavaScript
const magnetHeight = 2.5;
```

```JavaScript
const magneticPenHolder = Arc(magnetDiameter)
  .material('steel')
  .ex(magnetHeight)
  .fit((s) =>
    Arc(magnetDiameter + 2)
      .material('plastic')
      .ex(magnetHeight)
  )
  .at(yz)
  .align('z>')
  .fit(
    Arc(penDiameter)
      .material('plastic')
      .voidIn(offset(1))
      .ex(magnetDiameter + 2)
      .align('x<')
      .x(1)
  )
  .view()
  .stl('holder', drop('material:steel'));
```

![Image](holder.md.0.png)

![Image](holder.md.1.png)
