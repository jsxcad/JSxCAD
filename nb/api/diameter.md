[index](../../nb/api/index.md)
### diameter()
Parameter|Default|Type
---|---|---
op|function|(diameter) => (shape) => diameter

Computes the longest distance between any two points in the shape to determine the generalized diameter.

This is then transformed by _op_ which defaults to returning the numeric value.

The diameter is a Box(3) is 4.242640687119285

```JavaScript
Box(3).diameter((d) => note(`The diameter is a Box(3) is ${d}`));
```
