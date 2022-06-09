```JavaScript
import { Text, readFont } from '@jsxcad/api-v1-font';
```

```JavaScript
const text = await control('Engraving', '輝');
```

```JavaScript
const unYetGul = await readFont('https://jsxcad.js.org/ttf/UnYetgul.ttf');
```

```JavaScript
const model = Text(unYetGul, text, 25)
  .by(align('xy'))
  .cutFrom(Box(30, 26))
  .view()
  .md('Model');
```

![Image](engrave.md.0.png)

Model

```JavaScript
const inset = model.inset(0.5).gridView().md('Section Inset');
```

![Image](engrave.md.1.png)

Section Inset
