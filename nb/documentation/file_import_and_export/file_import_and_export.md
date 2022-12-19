# File IO
JSxCAD supports importing and exporting .svg and .stl file types

One thing to note is that output may consist of multiple 'pages'.

A filename like 'teapot' will have the page number and filetype appended, so it may produce 'teapot_0.stl', 'teapot_1.stl', etc.

---
### Exporting .stl
Creates an option to download the shape as an stl file. A view is created to show what will be downloaded.

```JavaScript
await Arc(10, 10, 10).stl('fileName');
```

![Image](file_import_and_export.md.$4_fileName.png)

[fileName.stl](file_import_and_export.fileName.stl)

---
### Exporting .svg
Creates an option to download the shape as a svg file. A view is created to show what will be downloaded.

```JavaScript
await Arc(10).svg('fileName');
```

![Image](file_import_and_export.md.$6_fileName.png)

[fileName.svg](file_import_and_export.fileName.svg)

---
### Importing .stl
Imports a .stl file which can then be used as geometry. A best effort is made to handle bad geometry in the .stl file.

```JavaScript
const importedStl = await LoadStl('https://jsxcad.js.org/stl/teapot.stl');
```

```JavaScript
await importedStl.view();
```

![Image](file_import_and_export.md.$8.png)

---
### Importing .svg
Imports a .svg file which can then be used as geometry.

```JavaScript
const importedSvg = await LoadSvg('https://jsxcad.js.org/svg/rocket.svg', { fill: false })
```

```JavaScript
await importedSvg.by(align('xy')).view();
```

![Image](file_import_and_export.md.$10.png)

```JavaScript
await importedSvg.by(align('xy')).scaleToFit(10).fill().ez(2).untag('color:#090000').view();
```

![Image](file_import_and_export.md.$11.png)

```JavaScript
import { ThreejsCollada, ThreejsSvg } from '@jsxcad/api-threejs';
```

```JavaScript
await ThreejsSvg('https://jsxcad.js.org/svg/rocket.svg').by(align('xy')).view();
```

![Image](file_import_and_export.md.$12.png)

```JavaScript
await ThreejsCollada('https://jsxcad.js.org/collada/duck_triangles.dae').rx(1/4).view();
```

![Image](file_import_and_export.md.$13.png)
