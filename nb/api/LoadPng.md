[index](../../nb/api/index.md)
### LoadPng()
Parameter|Default|Type
---|---|---
path||The path or url to load
bands|[0.5, 1.0]|The threshold bands to draw contours at.

![Image](LoadPng.md.$2.png)

LoadPng('https://jsxcad.js.org/png/bathymetry.png', { by: 1 / 2 }, (l, h) => e([h]))

```JavaScript
LoadPng('https://jsxcad.js.org/png/bathymetry.png',
        { by: 1 / 2 },
        (l, h) => e([h]))
  .view('top')
  .note(`LoadPng('https://jsxcad.js.org/png/bathymetry.png', { by: 1 / 2 }, (l, h) => e([h]))`);
```
