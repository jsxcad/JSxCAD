# File IO
JSxCAD supports importing and exporting .svg and .stl file types

One thing to note is that output may consist of multiple 'pages'.

A filename like 'teapot' will have the page number and filetype appended, so it may produce 'teapot_0.stl', 'teapot_1.stl', etc.

---
### Exporting .stl
Creates an option to download the shape as an stl file. A view is created to show what will be downloaded.

```JavaScript
Arc(10, 10, 10).stl('fileName');
```

![Image](file_import_and_export.md.0.png)

[fileName_0.stl](file_import_and_export.fileName_0.stl)

---
### Exporting .svg
Creates an option to download the shape as a svg file. A view is created to show what will be downloaded.

```JavaScript
Arc(10).svg('fileName');
```

![Image](file_import_and_export.md.1.png)

[fileName_0.svg](file_import_and_export.fileName_0.svg)

---
### Importing .stl
Imports a .stl file which can then be used as geometry. A best effort is made to handle bad geometry in the .stl file.

```JavaScript
const importedStl = await readStl('https://jsxcad.js.org/stl/teapot.stl');
```

```JavaScript
importedStl.view();
```

![Image](file_import_and_export.md.2.png)

---
### Importing .svg
Imports a .svg file which can then be used as geometry.

```JavaScript
const importedSvg = await readSvg('https://jsxcad.js.org/svg/rocket.svg', { fill: false });
```

```JavaScript
import { readCollada, readSvg as readSvgWithThreejs } from '@jsxcad/api-threejs';
```

```JavaScript
importedSvg.by(align('xy')).view();
```

![Image](file_import_and_export.md.3.png)

```JavaScript
importedSvg.by(align('xy')).scaleToFit(10).fill().ez(2).untag('color:#090000').view();
```

![Image](file_import_and_export.md.4.png)

```JavaScript
(await readCollada('https://jsxcad.js.org/collada/duck_triangles.dae')).rx(1/4).view();
```

![Image](file_import_and_export.md.5.png)

```JavaScript
(await readSvgWithThreejs('https://jsxcad.js.org/svg/rocket.svg')).by(align('xy')).view();
```

![Image](file_import_and_export.md.6.png)
