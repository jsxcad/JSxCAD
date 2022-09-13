### noVoid

Removes void geometry from the incoming shape.

Equivalent to on(get('type:void'), Empty()).

```JavaScript
Group(Box(), Triangle(1.5).void())
  .view(1)
  .note('With void')
  .noVoid()
  .view(2)
  .note('noVoid() removes the void triangle.');
```

![Image](noVoid.md.0.png)

With void

![Image](noVoid.md.1.png)

noVoid() removes the void triangle.
