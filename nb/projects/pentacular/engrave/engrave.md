```JavaScript
import { Text, readFont } from '@jsxcad/api-v1-font';
```

```JavaScript
const unYetGul = await readFont('https://jsxcad.js.org/ttf/UnYetgul.ttf');
```

```JavaScript
const text = await control('Engraving', '輝');
```

```JavaScript
const model = await Text(unYetGul, text, 25)
  .by(align('xy'))
  .cutFrom(Box(30, 26))
  .view()
  .md('Model');
```

![Image](engrave.md.model.png)

Model

```JavaScript
const inset = await model.inset(0.5).gridView().md('Section Inset');
```

![Image](engrave.md.inset.png)

Section Inset
