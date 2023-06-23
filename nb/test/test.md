![Image](test.md.$1.png)

```JavaScript
Box(10)
  .ez([10])
  .unfold()
  .on(get('unfold:faces'), color('blue').ez([0.1]))
  .and(on(get('unfold:edge'), (e) => Box(1).ez([e.diameter()]).color('white')))
  .view()
```
