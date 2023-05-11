[index](../../nb/api/index.md)
### image()
Parameter|Default|Type
---|---|---
|url||Url of the image to display as a texture.

This specifies an image to use as a texture for a shape.

The texture does not affect the geometry.

See: [material](../../nb/api/material.md)

![Image](image.md.$2.png)

Orb(4).image('https://jsxcad.js.org/png/bathymetry.png')

```JavaScript
Orb(4, { zag: 0.1 })
  .image('https://jsxcad.js.org/png/bathymetry.png')
  .view()
  .note("Orb(4).image('https://jsxcad.js.org/png/bathymetry.png')");
```

![Image](image.md.$3.png)

Arc(4).image('https://jsxcad.js.org/png/bathymetry.png')

```JavaScript
Arc(4)
  .image('https://jsxcad.js.org/png/bathymetry.png')
  .view()
  .note("Arc(4).image('https://jsxcad.js.org/png/bathymetry.png')");
```
