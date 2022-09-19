### lowerEnvelope()

Generates a shape that covers the base of the shape.

The envelope is monotonic - there is no vertical convexity.

The envelope is safe for vertical extrusion.

See: [upperEnvelope](../../nb/api/upperEnvelope.md)

```JavaScript
Orb(5).lowerEnvelope().view().note('The lower envelope of a rough sphere.');
```

![Image](lowerEnvelope.md.0.png)

The lower envelope of a rough sphere.
