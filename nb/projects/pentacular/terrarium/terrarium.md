# Terrarium

This is a simple terrarium design intended to be cut from transparent acrylic.

* The terrarium forms a box with the corners removed, allowing for excess water drainage.
* A hole is provided in the top to allow the top panel to be removed or water to be added.
* A lid is provided for the hole to minimize moisture loss.

This terrarium was designed for growing moss, but might be useful for other kinds of plants as well.

### Parameters

```JavaScript
const length = control('box length', 50, 'input');
```

```JavaScript
const width = control('box width', 50, 'input');
```

```JavaScript
const height = control('box height', 50, 'input');
```

```JavaScript
const thickness = control('pane thickness', 3, 'input');
```

```JavaScript
const hingeLength = control('hinge length', 5, 'input');
```

```JavaScript
const kerf = control('kerf', 0.09, 'input');
```

```JavaScript
const holeDiameter = control('hole diameter', 20, 'input');
```

```JavaScript
const Hinge = (l, thickness, hingeLength) =>
  Seq(
    { from: 0, by: hingeLength * 2, upto: l / 2 },
    (offset) =>
      Group(
        Box(
          [0, -thickness],
          [0, -thickness],
          [l / 2 - offset - hingeLength * 2, l / 2 - offset - hingeLength]
        ),
        Box(
          [0, -thickness],
          [0, -thickness],
          [l / 2 + offset, l / 2 + offset + hingeLength]
        )
      ),
    Group
  ).clip(Box([0, -thickness], [0, -thickness], [0, l]));
```

```JavaScript
const Lid = (holeDiameter, thickness, kerf) =>
  Arc(holeDiameter)
    .op(ez([-thickness]), offset(2).ez([thickness]))
    .fitTo(
      Box(thickness - kerf * 2, thickness - kerf * 2, thickness * 2).as('pin')
    )
    .material('acrylic')
    .as('lid');
```

```JavaScript
const makeLid = () => (shape) =>
  shape
    .get('lid')
    .in()
    .note('#### Lid')
    .note('These profiles assemble to form the lid')
    .pdf(
      'lid_base',
      z(-thickness / 2)
        .section()
        .outline()
        .clean()
    )
    .pdf(
      'lid_top',
      z(thickness / 2)
        .section()
        .clean()
        .outline()
    )
    .pdf(
      'lid_pin',
      get('pin')
        .rx(1 / 4)
        .section()
        .flat()
        .offset(kerf)
        .clean()
        .outline()
    )
    .note(
      'Stack the larger disc on the smaller and then push the rectangular pin through to connect them.'
    );
```

```JavaScript
const Terrarium = (
  length,
  width,
  height,
  thickness,
  hingeLength,
  holeDiameter,
  kerf
) =>
  Box(length, width, [0, height])
    .faces()
    .eachEdge(
      (e, l) => s => Hinge(l, thickness, hingeLength).to(e),
      (e, f) => s => f.e([-thickness]).cut(e)
    )
    .cut(Arc(holeDiameter, holeDiameter, [height - thickness, height]))
    .material('acrylic')
    .clean()
    .as('terrarium');
```

```JavaScript
const makeTerrarium = () => (shape) =>
  shape
    .get('terrarium')
    .in()
    .each(flat().section().offset(kerf))
    .note('#### Panels')
    .note(
      "These are the profiles you'll need to cut out to assemble the terrarium."
    )
    .pdf('faces', outline().page('pack', { itemsPerPage: 1 }))
    .note('Fit the profiles together to form a box with the hole on the top.');
```

### Preview

This is a preview of the assembled 50x50x50mm terrarium formed from 3mm acrylic with a 5mm hinge length and a 20mm diameter hole in the top with matching plug, cut with a 0.09mm laser beam.

![Image](terrarium.md.terrarium_1.png)

![Image](terrarium.md.terrarium_2.png)

```JavaScript
const terrarium = await Terrarium(
  length,
  width,
  height,
  thickness,
  hingeLength,
  holeDiameter,
  kerf
)
  .and(Lid(holeDiameter, thickness, kerf).z(height))
  .view(1)
  .view(
    2,
    get('terrarium')
      .align()
      .in()
      .untag('material:acrylic')
      .each((s) =>
        s
          .ghost()
          .and(
            Edge(s.centroid(), s.centroid().moveAlong(s.centroid(), 1)).color(
              'green'
            ),
            s.moveAlong(s.centroid(), 1)
          )
      )
  );
```

### Instructions

Specify the dimensions of the terrarium you want, taking some care with the sheet thickness and kerf.

I recommend cutting two pieces to test how well they mesh with the kerf supplied.

The panels should have a snug fit, so that the assembly is solid without requiring glue.

The lid should have a snug fit internally, but a loose connection to the top panel so that it can be easily removed.

### Laser cut profiles

#### Panels

These are the profiles you'll need to cut out to assemble the terrarium.

![Image](terrarium.md.$7_faces.png)

[faces.pdf](terrarium.faces.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_2.pdf](terrarium.faces_2.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_3.pdf](terrarium.faces_3.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_4.pdf](terrarium.faces_4.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_5.pdf](terrarium.faces_5.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_6.pdf](terrarium.faces_6.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_7.pdf](terrarium.faces_7.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_8.pdf](terrarium.faces_8.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_9.pdf](terrarium.faces_9.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_10.pdf](terrarium.faces_10.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_11.pdf](terrarium.faces_11.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_12.pdf](terrarium.faces_12.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_13.pdf](terrarium.faces_13.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_14.pdf](terrarium.faces_14.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_15.pdf](terrarium.faces_15.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_16.pdf](terrarium.faces_16.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_17.pdf](terrarium.faces_17.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_18.pdf](terrarium.faces_18.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_19.pdf](terrarium.faces_19.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_20.pdf](terrarium.faces_20.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_21.pdf](terrarium.faces_21.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_22.pdf](terrarium.faces_22.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_23.pdf](terrarium.faces_23.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_24.pdf](terrarium.faces_24.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_25.pdf](terrarium.faces_25.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_26.pdf](terrarium.faces_26.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_27.pdf](terrarium.faces_27.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_28.pdf](terrarium.faces_28.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_29.pdf](terrarium.faces_29.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_30.pdf](terrarium.faces_30.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_31.pdf](terrarium.faces_31.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_32.pdf](terrarium.faces_32.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_33.pdf](terrarium.faces_33.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_34.pdf](terrarium.faces_34.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_35.pdf](terrarium.faces_35.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_36.pdf](terrarium.faces_36.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_37.pdf](terrarium.faces_37.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_38.pdf](terrarium.faces_38.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_39.pdf](terrarium.faces_39.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_40.pdf](terrarium.faces_40.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_41.pdf](terrarium.faces_41.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_42.pdf](terrarium.faces_42.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_43.pdf](terrarium.faces_43.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_44.pdf](terrarium.faces_44.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_45.pdf](terrarium.faces_45.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_46.pdf](terrarium.faces_46.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_47.pdf](terrarium.faces_47.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_48.pdf](terrarium.faces_48.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_49.pdf](terrarium.faces_49.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_50.pdf](terrarium.faces_50.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_51.pdf](terrarium.faces_51.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_52.pdf](terrarium.faces_52.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_53.pdf](terrarium.faces_53.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_54.pdf](terrarium.faces_54.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_55.pdf](terrarium.faces_55.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_56.pdf](terrarium.faces_56.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_57.pdf](terrarium.faces_57.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_58.pdf](terrarium.faces_58.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_59.pdf](terrarium.faces_59.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_60.pdf](terrarium.faces_60.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_61.pdf](terrarium.faces_61.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_62.pdf](terrarium.faces_62.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_63.pdf](terrarium.faces_63.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_64.pdf](terrarium.faces_64.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_65.pdf](terrarium.faces_65.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_66.pdf](terrarium.faces_66.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_67.pdf](terrarium.faces_67.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_68.pdf](terrarium.faces_68.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_69.pdf](terrarium.faces_69.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_70.pdf](terrarium.faces_70.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_71.pdf](terrarium.faces_71.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_72.pdf](terrarium.faces_72.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_73.pdf](terrarium.faces_73.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_74.pdf](terrarium.faces_74.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_75.pdf](terrarium.faces_75.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_76.pdf](terrarium.faces_76.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_77.pdf](terrarium.faces_77.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_78.pdf](terrarium.faces_78.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_79.pdf](terrarium.faces_79.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_80.pdf](terrarium.faces_80.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_81.pdf](terrarium.faces_81.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_82.pdf](terrarium.faces_82.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_83.pdf](terrarium.faces_83.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_84.pdf](terrarium.faces_84.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_85.pdf](terrarium.faces_85.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_86.pdf](terrarium.faces_86.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_87.pdf](terrarium.faces_87.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_88.pdf](terrarium.faces_88.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_89.pdf](terrarium.faces_89.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_90.pdf](terrarium.faces_90.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_91.pdf](terrarium.faces_91.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_92.pdf](terrarium.faces_92.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_93.pdf](terrarium.faces_93.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_94.pdf](terrarium.faces_94.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_95.pdf](terrarium.faces_95.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_96.pdf](terrarium.faces_96.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_97.pdf](terrarium.faces_97.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_98.pdf](terrarium.faces_98.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_99.pdf](terrarium.faces_99.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_100.pdf](terrarium.faces_100.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_101.pdf](terrarium.faces_101.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_102.pdf](terrarium.faces_102.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_103.pdf](terrarium.faces_103.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_104.pdf](terrarium.faces_104.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_105.pdf](terrarium.faces_105.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_106.pdf](terrarium.faces_106.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_107.pdf](terrarium.faces_107.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_108.pdf](terrarium.faces_108.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_109.pdf](terrarium.faces_109.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_110.pdf](terrarium.faces_110.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_111.pdf](terrarium.faces_111.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_112.pdf](terrarium.faces_112.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_113.pdf](terrarium.faces_113.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_114.pdf](terrarium.faces_114.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_115.pdf](terrarium.faces_115.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_116.pdf](terrarium.faces_116.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_117.pdf](terrarium.faces_117.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_118.pdf](terrarium.faces_118.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_119.pdf](terrarium.faces_119.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_120.pdf](terrarium.faces_120.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_121.pdf](terrarium.faces_121.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_122.pdf](terrarium.faces_122.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_123.pdf](terrarium.faces_123.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_124.pdf](terrarium.faces_124.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_125.pdf](terrarium.faces_125.pdf)

![Image](terrarium.md.$7_faces.png)

[faces_126.pdf](terrarium.faces_126.pdf)

Fit the profiles together to form a box with the hole on the top.

#### Lid

These profiles assemble to form the lid

![Image](terrarium.md.$7_lid_base.png)

[lid_base.pdf](terrarium.lid_base.pdf)

![Image](terrarium.md.$7_lid_top.png)

[lid_top.pdf](terrarium.lid_top.pdf)

![Image](terrarium.md.$7_lid_pin.png)

[lid_pin.pdf](terrarium.lid_pin.pdf)

Stack the larger disc on the smaller and then push the rectangular pin through to connect them.

```JavaScript
await terrarium
  .z(-height)
  .note('### Laser cut profiles')
  .op(makeTerrarium(), makeLid());
```
