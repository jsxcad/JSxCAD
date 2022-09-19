### toolpath()
Parameter|Default|Type
---|---|---
{diameter}|1|
{jumpHeight}|1|
{stepCost}|diameter * -2|
{turnCost}|-2|
neighborCost|-2|
stopCost|30
candidateLimit|1
subCandidateLimit|1

Computes toolpaths along edges, filling areas, and volumes.

```JavaScript
Arc(4)
  .x(5)
  .seq({ by: 1 / 8 }, rz, Join)
  .material('glass')
  .color('orange')
  .and(toolpath())
  .view(57);
```

![Image](toolpath.md.0.png)
