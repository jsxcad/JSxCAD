### tags()
Parameter|Default|Type
---|---|---
op||Function to transform the tags.
namespace|'user'|String giving the namespace of the tags to extract.

Collects the set of tags of the given namespace associated with leaf geometry in the incoming shape.

See: [tag](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/tag.nb).

```JavaScript
Box()
  .tag('a')
  .and(Box().tag('b'))
  .tags()
  .note("Box().tag('a').and(Box().tag('b')).tags()");
```

tags: a,b

Box().tag('a').and(Box().tag('b')).tags()