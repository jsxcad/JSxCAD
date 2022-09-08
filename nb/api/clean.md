# shape.clean()

Removes ghost geometry, but not voids.

```JavaScript
Box(10)
  .cut(Arc(8))
  .view(1)
  .md('We can see the ghost of the cut with Box(10).cut(Arc(8)).')
  .clean()
  .view(2)
  .md('Now the ghost has been cleaned Box(10).cut(Arc(8)).clean().');
```

![Image](clean.md.0.png)

We can see the ghost of the cut with Box(10).cut(Arc(8)).

![Image](clean.md.1.png)

Now the ghost has been cleaned Box(10).cut(Arc(8)).clean().

```JavaScript
Box(10)
  .fitTo(Arc(8).void())
  .view(1)
  .md('We can see the void arc with Box(10).fitTo(Arc(8).void())')
  .clean()
  .view(2)
  .md(
    'We can still see the void arc with Box(10).fitTo(Arc(8).void()).clean()'
  );
```

![Image](clean.md.2.png)

We can see the void arc with Box(10).fitTo(Arc(8).void())

![Image](clean.md.3.png)

We can still see the void arc with Box(10).fitTo(Arc(8).void()).clean()
