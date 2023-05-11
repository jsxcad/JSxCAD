[index](../../nb/api/index.md)
### note()
Parameter|Default|Type
---|---|---
message||String of markdown to display

Displays markdown text in the notebook.

See: [md](https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/Assembly.md).

![Image](note.md.$2.png)

note('This is a \_nice\_ triangle.') displays 'This is a _nice_ triangle.'

```JavaScript
Triangle(5)
  .view()
  .note(
    "note('This is a \_nice\_ triangle.') displays 'This is a _nice_ triangle.'"
  );
```
