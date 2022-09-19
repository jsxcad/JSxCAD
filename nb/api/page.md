### page()
Parameter|Default|Type
---|---|---
{size}||Pair of numbers [width, height]
{pageMargin}|5|Number of mm to reserve around the edge of the page
{itemMargin}|1|Number of mm to reserve around each item on the page
{itemsPerPage}|Infinity|Maximum number of shapes per page
'pack'|false|Automatically layout the items on the page.

Paginates the incoming shape for display or output.

See: [pack](../../nb/api/pack.nb), [Page](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/Page.md).

```JavaScript
Seq({ upto: 20 }, () => Box(), Group)
  .page('pack')
  .view()
  .note(
    "Seq({ upto: 20 }, () => Box(), Group).page('pack') packs 20 boxes onto a page."
  );
```

![Image](page.md.0.png)

Seq({ upto: 20 }, () => Box(), Group).page('pack') packs 20 boxes onto a page.
