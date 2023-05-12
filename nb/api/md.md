[index](../../nb/api/index.md)
### md()
Parameter|Default|Type
---|---|---
|message||Markdown string to display.

Provides a template operator to output markdown.

Note is similar, but cannot be used as a template tag operator.

See: [Note](../../nb/api/Note.md)

md\`Hello, this is *markdown*.\` produces:

```JavaScript
Note('md\`Hello, this is *markdown*.\` produces:');
```

Hello, this is *markdown*.
