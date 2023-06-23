![Image](test.md.$1.png)

```JavaScript
Box(10, 10, 20)
  .cutOut(Box(20, 20, [8, 100]), noOp(), grow(2, 'xy'))
  .view();
```
