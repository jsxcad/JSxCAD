[index](../../nb/api/index.md)
### Implicit()
Parameter|Default|Type
---|---|---
function||Function to determine the volume.
radius|1|Radius of a sphere that the result will fit into.
{angularBound}|30|
{distanceBound}|0.1|
{errorBound}|0.001|

Builds a volume by finding the surface at which function(x, y, z) is approximately zero.

_Note: non-deterministic._

![Image](Implicit.md.$2.png)

Implicit(2, (x, y, z) => x * x + y * y + z * z - 1) produces a sphere of radius 1.

```JavaScript
Implicit(2, (x, y, z) => x * x + y * y + z * z - 1)
  .view({ withGrid: false })
  .note(
    'Implicit(2, (x, y, z) => x * x + y * y + z * z - 1) produces a sphere of radius 1.'
  );
```
