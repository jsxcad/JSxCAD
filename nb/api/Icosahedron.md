# Icosahedron(...dimensions)

Produces an icosahedron that fits the bounding dimensions.

```JavaScript
Icosahedron(3).and(Box(3, 3, 3).material('glass')).view().md('Icosahedron(3)');
```

![Image](Icosahedron.md.0.png)

Icosahedron(3)

```JavaScript
Icosahedron(1, 2, [0, 3])
  .and(Box(1, 2, [0, 3]).material('glass'))
  .view()
  .md('Icosahedron(1, 2, [0, 3])');
```

![Image](Icosahedron.md.1.png)

Icosahedron(1, 2, [0, 3])
