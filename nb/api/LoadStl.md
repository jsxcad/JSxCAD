[index](../../nb/api/index.md)
### LoadStl()
Parameter|Default|Type
---|---|---
path||The path or url to load
'binary'||Read from a binary representation.

![Image](LoadStl.md.$2.png)

await LoadStl('https://jsxcad.js.org/stl/bear.stl')

```JavaScript
LoadStl('https://jsxcad.js.org/stl/bear.stl', 'auto')
  .view()
  .note(`await LoadStl('https://jsxcad.js.org/stl/bear.stl')`);
```
