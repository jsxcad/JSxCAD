# File IO
JSxCAD supports importing and exporting .svg and .stl file types

One thing to note is that output may consist of multiple 'pages'.

A filename like 'teapot' will have the page number and filetype appended, so it may produce 'teapot_0.stl', 'teapot_1.stl', etc.

---
### Exporting .stl
Creates an option to download the shape as an stl file. A view is created to show what will be downloaded.

Arc(10, 10, 10).stl('fileName');

![Image](file_import_and_export.md.0.png)

---
### Exporting .svg
Creates an option to download the shape as a svg file. A view is created to show what will be downloaded.

Arc(10).svg('fileName');

![Image](file_import_and_export.md.1.png)

---
### Importing .stl
Imports a .stl file which can then be used as geometry. A best effort is made to handle bad geometry in the .stl file.

const importedStl = await readStl('https://jsxcad.js.org/stl/teapot.stl');

importedStl.view();

![Image](file_import_and_export.md.2.png)

---
### Importing .svg
Imports a .svg file which can then be used as geometry.

const importedSvg = await readSvg('https://jsxcad.js.org/svg/rocket.svg', { fill: false });

importedSvg.align('xy').view();

![Image](file_import_and_export.md.3.png)

importedSvg.align('xy').scaleToFit(10).extrude(2).notColor('#090000').view();

![Image](file_import_and_export.md.4.png)
