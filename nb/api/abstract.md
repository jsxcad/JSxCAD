# shape.abstract()

Provides a graph of the shapes internal structure.

_Consider deprecating this operator._

```JavaScript
Box()
  .x(3, 6)
  .rz(seq({ by: 1 / 2 }))
  .abstract();
```

'''mermaid
graph LR;
  0[group<br>]
  0 --> 1;
  1[plan<br>]
  0 --> 2;
  2[plan<br>]
  0 --> 3;
  3[plan<br>]
  0 --> 4;
  4[plan<br>]
  0 --> 5;
  5[plan<br>]
  0 --> 6;
  6[plan<br>]
'''
