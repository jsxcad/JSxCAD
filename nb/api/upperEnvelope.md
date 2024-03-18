[index](../../nb/api/index.md)
### upperEnvelope()

Generates a shape that covers the top of the shape.

The envelope is monotonic - there is no vertical convexity.

The envelope is safe for vertical extrusion.

See: [lowerEnvelope](../../nb/api/lowerEnvelope.md)

![Image](upperEnvelope.md.$2.png)

The upper envelope of a rough sphere.

```JavaScript
Orb(5).upperEnvelope('face').view().note('The upper envelope of a rough sphere.');
```
