[index](../../nb/api/index.md)
### LoadStl()
Parameter|Default|Type
---|---|---
path||The path or url to load
'binary'||Read from a binary representation.

![Image](LoadStl.md.$2.png)

LoadStl('https://jsxcad.js.org/stl/bear.stl')

```JavaScript
LoadStl('https://jsxcad.js.org/stl/bear.stl', 'patch')
  .view()
  .note(`LoadStl('https://jsxcad.js.org/stl/bear.stl')`);
```
