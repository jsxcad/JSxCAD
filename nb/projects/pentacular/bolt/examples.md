```JavaScript
import {
  NutThread,
  NutThreadSegment,
  ScrewThread,
  ScrewThreadSegment,
} from './bolt.nb';
```

![Image](examples.md.$1.png)

ScrewThreadSegment(20)

```JavaScript
await ScrewThreadSegment(20).material('steel').view().md(`ScrewThreadSegment(20)`);
```
