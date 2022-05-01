# Fonts

Fonts are relatively expensive, so they are imported on demand.

```JavaScript
import { readFont, Text } from '@jsxcad/api-v1-font';
```

#### async readFont(path)

readFont takes a path which may be a url, and is async so needs await.

```JavaScript
const unYetGul = await readFont('https://jsxcad.js.org/ttf/UnYetgul.ttf');
```

#### Text(font, text, size=10)
Text takes a font, the text to render, and an optional size defaulting to 10.

```JavaScript
Text(unYetGul, '字').by(align('xy')).gridView();
```

![Image](font.md.0.png)
