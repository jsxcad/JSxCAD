```JavaScript
import {
  NutThread,
  NutThreadSegment,
  ScrewThread,
  ScrewThreadSegment,
} from './bolt.nb';
```

```JavaScript
await ScrewThreadSegment(20).material('steel').view().md(`ScrewThreadSegment(20)`);
```

![Image](examples.md.$1.png)

ScrewThreadSegment(20)

```JavaScript
await ScrewThread(20, 10).material('steel').view().md(`ScrewThread(20, 10)`);
```

![Image](examples.md.$2.png)

ScrewThread(20, 10)

```JavaScript
await NutThreadSegment(20).material('steel').view().md(`NutThreadSegment(20)`);
```

![Image](examples.md.$3.png)

NutThreadSegment(20)

```JavaScript
await NutThread(20, 10).material('steel').view().md(`NutThread(20, 10)`);
```

![Image](examples.md.$4.png)

NutThread(20, 10)

```JavaScript
await NutThreadSegment(20, { play: 0.1 })
  .color('orange')
  .and(ScrewThreadSegment(20, { play: 0.1 }).color('blue'))
  .clip(Box([0, 10], [0, 10], [0, 10]))
  .view()
  .md(`NutThread(20, 10).and(ScrewThread(20, 10))`);
```

![Image](examples.md.$5.png)

NutThread(20, 10).and(ScrewThread(20, 10))
