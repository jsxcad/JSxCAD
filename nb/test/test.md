```JavaScript
import { Text, readFont } from '@jsxcad/api-v1-font';
```

```JavaScript
const unYetGul = 'https://jsxcad.js.org/ttf/UnYetgul.ttf';
```

```JavaScript
const text = control('Engraving', '輝');
```

```JavaScript
const model = Text(unYetGul, text, 25)
  // .align('xy')
  .cutFrom(Box(30, 26));
```
