```JavaScript
const a = await Box(10, 10, 1).color('red').x(10);
```

```JavaScript
console.log(`QQ/a.isChain: ${a.isChain}`);
```

```JavaScript
console.log(`QQ/a.align.isChain: ${a.align.isChain}`);
```

```JavaScript
console.log(`QQ/a.align('x>').isChain: ${a.align('x>').isChain}`);
```

```JavaScript
await a.align('x>').view();
```

![Image](test.md.$4.png)

```JavaScript
await Box(10, 10, 1).color('red').x(10).align('x>').view();
```

![Image](test.md.$5.png)
