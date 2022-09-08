# Cached(name, constructor)

Returns a caching version of the constructor.

The name is used to distinguish the constructions.

On subsequent invocations with the same arguments, the cached version will be reused.

```JavaScript
Cached('box', Box)(1, 2, 4).view().md("Cached('box', Box)(1, 2, 4)");
```

![Image](Cached.md.0.png)

Cached('box', Box)(1, 2, 4)
