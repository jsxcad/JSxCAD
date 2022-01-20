import { boot, write } from '@jsxcad/sys';

import { fromLDrawPart } from './fromLDraw.js';
import { prepareForSerialization } from '@jsxcad/geometry';
import test from 'ava';

test('Load a file', async (t) => {
  await boot();
  const writeText = async (path, text) =>
    write(path, new TextEncoder('utf8').encode(text));
  await writeText(
    'cache/ldraw/part/3024.dat',
    '0 Plate  1 x  1\r\n0 Name: 3024.dat\r\n0 Author: James Jessiman\r\n0 !LDRAW_ORG Part UPDATE 2002-03\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 2001-10-26 [PTadmin] Official Update 2001-01\r\n0 !HISTORY 2002-05-07 [unknown] BFC Certification\r\n0 !HISTORY 2002-06-11 [PTadmin] Official Update 2002-03\r\n0 !HISTORY 2007-06-07 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n\r\n0 BFC INVERTNEXT\r\n1 16 0 8 0 6 0 0 0 -4 0 0 0 6 box5.dat\r\n\r\n4 16 10 8 10 6 8 6 -6 8 6 -10 8 10\r\n4 16 -10 8 10 -6 8 6 -6 8 -6 -10 8 -10\r\n4 16 -10 8 -10 -6 8 -6 6 8 -6 10 8 -10\r\n4 16 10 8 -10 6 8 -6 6 8 6 10 8 10\r\n\r\n1 16 0 8 0 10 0 0 0 -8 0 0 0 10 box5.dat\r\n\r\n1 16 0 0 0 1 0 0 0 1 0 0 0 1 stud.dat\r\n0\r\n'
  );
  await writeText(
    'cache/ldraw/part/4-4cyli.dat',
    '0 Hi-Res Cylinder 1.0\r\n0 Name: 48\\4-4cyli.dat\r\n0 Author: Paul Easter [pneaster]\r\n0 !LDRAW_ORG 48_Primitive UPDATE 2012-02\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 2002-08-18 [PTadmin] Official Update 2002-04\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2012-02-27 [Philo] Changed to CCW\r\n0 !HISTORY 2012-08-09 [PTadmin] Official Update 2012-02\r\n\r\n1 16 0 0 0 1 0 0 0 1 0 0 0 1 48\\1-4cyli.dat\r\n1 16 0 0 0 0 0 -1 0 1 0 1 0 0 48\\1-4cyli.dat\r\n1 16 0 0 0 -1 0 0 0 1 0 0 0 -1 48\\1-4cyli.dat\r\n1 16 0 0 0 0 0 1 0 1 0 -1 0 0 48\\1-4cyli.dat\r\n'
  );
  await writeText(
    'cache/ldraw/part/4-4disc.dat',
    '0 Hi-Res Disc 1.0\r\n0 Name: 48\\4-4disc.dat\r\n0 Author: Miklos Hosszu [hmick]\r\n0 !LDRAW_ORG 48_Primitive UPDATE 2012-02\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 2004-11-06 [PTadmin] Official Update 2004-04\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2012-02-27 [Philo] Changed to CCW\r\n0 !HISTORY 2012-08-09 [PTadmin] Official Update 2012-02\r\n\r\n3 16 1 0 0 0.9914 0 0.1305 0 0 0\r\n3 16 0.9914 0 0.1305 0.9659 0 0.2588 0 0 0\r\n3 16 0.9659 0 0.2588 0.9239 0 0.3827 0 0 0\r\n3 16 0.9239 0 0.3827 0.866 0 0.5 0 0 0\r\n3 16 0.866 0 0.5 0.7934 0 0.6088 0 0 0\r\n3 16 0.7934 0 0.6088 0.7071 0 0.7071 0 0 0\r\n3 16 0.7071 0 0.7071 0.6088 0 0.7934 0 0 0\r\n3 16 0.6088 0 0.7934 0.5 0 0.866 0 0 0\r\n3 16 0.5 0 0.866 0.3827 0 0.9239 0 0 0\r\n3 16 0.3827 0 0.9239 0.2588 0 0.9659 0 0 0\r\n3 16 0.2588 0 0.9659 0.1305 0 0.9914 0 0 0\r\n3 16 0.1305 0 0.9914 0 0 1 0 0 0\r\n3 16 0 0 1 -0.1305 0 0.9914 0 0 0\r\n3 16 -0.1305 0 0.9914 -0.2588 0 0.9659 0 0 0\r\n3 16 -0.2588 0 0.9659 -0.3827 0 0.9239 0 0 0\r\n3 16 -0.3827 0 0.9239 -0.5 0 0.866 0 0 0\r\n3 16 -0.5 0 0.866 -0.6088 0 0.7934 0 0 0\r\n3 16 -0.6088 0 0.7934 -0.7071 0 0.7071 0 0 0\r\n3 16 -0.7071 0 0.7071 -0.7934 0 0.6088 0 0 0\r\n3 16 -0.7934 0 0.6088 -0.866 0 0.5 0 0 0\r\n3 16 -0.866 0 0.5 -0.9239 0 0.3827 0 0 0\r\n3 16 -0.9239 0 0.3827 -0.9659 0 0.2588 0 0 0\r\n3 16 -0.9659 0 0.2588 -0.9914 0 0.1305 0 0 0\r\n3 16 -0.9914 0 0.1305 -1 0 0 0 0 0\r\n3 16 -1 0 0 -0.9914 0 -0.1305 0 0 0\r\n3 16 -0.9914 0 -0.1305 -0.9659 0 -0.2588 0 0 0\r\n3 16 -0.9659 0 -0.2588 -0.9239 0 -0.3827 0 0 0\r\n3 16 -0.9239 0 -0.3827 -0.866 0 -0.5 0 0 0\r\n3 16 -0.866 0 -0.5 -0.7934 0 -0.6088 0 0 0\r\n3 16 -0.7934 0 -0.6088 -0.7071 0 -0.7071 0 0 0\r\n3 16 -0.7071 0 -0.7071 -0.6088 0 -0.7934 0 0 0\r\n3 16 -0.6088 0 -0.7934 -0.5 0 -0.866 0 0 0\r\n3 16 -0.5 0 -0.866 -0.3827 0 -0.9239 0 0 0\r\n3 16 -0.3827 0 -0.9239 -0.2588 0 -0.9659 0 0 0\r\n3 16 -0.2588 0 -0.9659 -0.1305 0 -0.9914 0 0 0\r\n3 16 -0.1305 0 -0.9914 0 0 -1 0 0 0\r\n3 16 0 0 -1 0.1305 0 -0.9914 0 0 0\r\n3 16 0.1305 0 -0.9914 0.2588 0 -0.9659 0 0 0\r\n3 16 0.2588 0 -0.9659 0.3827 0 -0.9239 0 0 0\r\n3 16 0.3827 0 -0.9239 0.5 0 -0.866 0 0 0\r\n3 16 0.5 0 -0.866 0.6088 0 -0.7934 0 0 0\r\n3 16 0.6088 0 -0.7934 0.7071 0 -0.7071 0 0 0\r\n3 16 0.7071 0 -0.7071 0.7934 0 -0.6088 0 0 0\r\n3 16 0.7934 0 -0.6088 0.866 0 -0.5 0 0 0\r\n3 16 0.866 0 -0.5 0.9239 0 -0.3827 0 0 0\r\n3 16 0.9239 0 -0.3827 0.9659 0 -0.2588 0 0 0\r\n3 16 0.9659 0 -0.2588 0.9914 0 -0.1305 0 0 0\r\n3 16 0.9914 0 -0.1305 1 0 0 0 0 0\r\n'
  );
  await writeText(
    'cache/ldraw/part/4-4edge.dat',
    "0 Hi-Res Circle 1.0\r\n0 Name: 48\\4-4edge.dat\r\n0 Author: Paul Easter [pneaster]\r\n0 !LDRAW_ORG 48_Primitive UPDATE 2012-01\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 2002-08-18 [PTadmin] Official Update 2002-04\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2012-01-15 [MagFors] BFC'ed, title changed from Edge to Circle\r\n0 !HISTORY 2012-03-30 [PTadmin] Official Update 2012-01\r\n\r\n1 16 0 0 0 1 0 0 0 1 0 0 0 1 48\\1-4edge.dat\r\n1 16 0 0 0 0 0 -1 0 1 0 1 0 0 48\\1-4edge.dat\r\n1 16 0 0 0 -1 0 0 0 1 0 0 0 -1 48\\1-4edge.dat\r\n1 16 0 0 0 0 0 1 0 1 0 -1 0 0 48\\1-4edge.dat\r\n\r\n"
  );
  await writeText(
    'cache/ldraw/part/48/1-4cyli.dat',
    "0 Hi-Res Cylinder 0.25\r\n0 Name: 48\\1-4cyli.dat\r\n0 Author: Manfred Moolhuysen\r\n0 !LDRAW_ORG 48_Primitive UPDATE 2009-01\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 1999-07-05 [PTadmin] Official Update 1999-05\r\n0 !HISTORY 2002-02-28 [hafhead] Added BFC statement\r\n0 !HISTORY 2002-04-25 [PTadmin] Official Update 2002-02\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2008-07-07 [guyvivan] Made BFC'ed CCW (2005-12-06)\r\n0 !HISTORY 2009-05-02 [PTadmin] Official Update 2009-01\r\n\r\n4 16 0.9914 0 0.1305 1 0 0 1 1 0 0.9914 1 0.1305\r\n4 16 0.9659 0 0.2588 0.9914 0 0.1305 0.9914 1 0.1305 0.9659 1 0.2588\r\n4 16 0.9239 0 0.3827 0.9659 0 0.2588 0.9659 1 0.2588 0.9239 1 0.3827\r\n4 16 0.866 0 0.5 0.9239 0 0.3827 0.9239 1 0.3827 0.866 1 0.5\r\n4 16 0.7934 0 0.6088 0.866 0 0.5 0.866 1 0.5 0.7934 1 0.6088\r\n4 16 0.7071 0 0.7071 0.7934 0 0.6088 0.7934 1 0.6088 0.7071 1 0.7071\r\n4 16 0.6088 0 0.7934 0.7071 0 0.7071 0.7071 1 0.7071 0.6088 1 0.7934\r\n4 16 0.5 0 0.866 0.6088 0 0.7934 0.6088 1 0.7934 0.5 1 0.866\r\n4 16 0.3827 0 0.9239 0.5 0 0.866 0.5 1 0.866 0.3827 1 0.9239\r\n4 16 0.2588 0 0.9659 0.3827 0 0.9239 0.3827 1 0.9239 0.2588 1 0.9659\r\n4 16 0.1305 0 0.9914 0.2588 0 0.9659 0.2588 1 0.9659 0.1305 1 0.9914\r\n4 16 0 0 1 0.1305 0 0.9914 0.1305 1 0.9914 0 1 1\r\n\r\n0 conditional lines\r\n5 24 1 1 0 1 0 0 1 1 -1 0.9914 1 0.1305\r\n5 24 0.9914 1 0.1305 0.9914 0 0.1305 1 1 0 0.9659 1 0.2588\r\n5 24 0.9659 1 0.2588 0.9659 0 0.2588 0.9914 1 0.1305 0.9239 1 0.3827\r\n5 24 0.9239 1 0.3827 0.9239 0 0.3827 0.9659 1 0.2588 0.866 1 0.5\r\n5 24 0.866 1 0.5 0.866 0 0.5 0.9239 1 0.3827 0.7934 1 0.6088\r\n5 24 0.7934 1 0.6088 0.7934 0 0.6088 0.866 1 0.5 0.7071 1 0.7071\r\n5 24 0.7071 1 0.7071 0.7071 0 0.7071 0.7934 1 0.6088 0.6088 1 0.7934\r\n5 24 0.6088 1 0.7934 0.6088 0 0.7934 0.7071 1 0.7071 0.5 1 0.866\r\n5 24 0.5 1 0.866 0.5 0 0.866 0.6088 1 0.7934 0.3827 1 0.9239\r\n5 24 0.3827 1 0.9239 0.3827 0 0.9239 0.5 1 0.866 0.2588 1 0.9659\r\n5 24 0.2588 1 0.9659 0.2588 0 0.9659 0.3827 1 0.9239 0.1305 1 0.9914\r\n5 24 0.1305 1 0.9914 0.1305 0 0.9914 0.2588 1 0.9659 0 1 1\r\n5 24 0 1 1 0 0 1 0.1305 1 0.9914 -1 1 1\r\n\r\n0 end of file"
  );
  await writeText(
    'cache/ldraw/part/48/1-4edge.dat',
    "0 Hi-Res Circle 0.25\r\n0 Name: 48\\1-4edge.dat\r\n0 Author: Manfred Moolhuysen\r\n0 !LDRAW_ORG 48_Primitive UPDATE 2010-02\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 1999-07-05 [PTadmin] Official Update 1999-05\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2010-03-17 [MagFors] Updated description\r\n0 !HISTORY 2010-05-21 [mikeheide] BFC'ed and compacted numbers (saved 10% filesize)\r\n0 !HISTORY 2010-07-05 [PTadmin] Official Update 2010-02\r\n\r\n2 24 1 0 0 0.9914 0 0.1305\r\n2 24 0.9914 0 0.1305 0.9659 0 0.2588\r\n2 24 0.9659 0 0.2588 0.9239 0 0.3827\r\n2 24 0.9239 0 0.3827 0.866 0 0.5\r\n2 24 0.866 0 0.5 0.7934 0 0.6088\r\n2 24 0.7934 0 0.6088 0.7071 0 0.7071\r\n2 24 0.7071 0 0.7071 0.6088 0 0.7934\r\n2 24 0.6088 0 0.7934 0.5 0 0.866\r\n2 24 0.5 0 0.866 0.3827 0 0.9239\r\n2 24 0.3827 0 0.9239 0.2588 0 0.9659\r\n2 24 0.2588 0 0.9659 0.1305 0 0.9914\r\n2 24 0.1305 0 0.9914 0 0 1\r\n0 //\r\n"
  );
  await writeText(
    'cache/ldraw/part/box5.dat',
    '0 Box with 5 Faces and All Edges\r\n0 Name: box5.dat\r\n0 Author: James Jessiman\r\n0 !LDRAW_ORG Primitive UPDATE 2012-01\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 2002-04-03 [sbliss] Modified for BFC compliance\r\n0 !HISTORY 2002-04-25 [PTadmin] Official Update 2002-02\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2012-02-16 [Philo] Changed to CCW\r\n0 !HISTORY 2012-03-30 [PTadmin] Official Update 2012-01\r\n\r\n2 24 1 1 1 -1 1 1\r\n2 24 -1 1 1 -1 1 -1\r\n2 24 -1 1 -1 1 1 -1\r\n2 24 1 1 -1 1 1 1\r\n2 24 1 0 1 -1 0 1\r\n2 24 -1 0 1 -1 0 -1\r\n2 24 -1 0 -1 1 0 -1\r\n2 24 1 0 -1 1 0 1\r\n2 24 1 0 1 1 1 1\r\n2 24 -1 0 1 -1 1 1\r\n2 24 1 0 -1 1 1 -1\r\n2 24 -1 0 -1 -1 1 -1\r\n4 16 -1 1 1 1 1 1 1 1 -1 -1 1 -1\r\n4 16 -1 1 1 -1 0 1 1 0 1 1 1 1\r\n4 16 -1 1 -1 -1 0 -1 -1 0 1 -1 1 1\r\n4 16 1 1 -1 1 0 -1 -1 0 -1 -1 1 -1\r\n4 16 1 1 1 1 0 1 1 0 -1 1 1 -1\r\n'
  );
  await writeText(
    'cache/ldraw/part/stud.dat',
    '0 Stud\r\n0 Name: stud.dat\r\n0 Author: James Jessiman\r\n0 !LDRAW_ORG Primitive UPDATE 2012-01\r\n0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt\r\n\r\n0 BFC CERTIFY CCW\r\n\r\n0 !HISTORY 2002-04-04 [sbliss] Modified for BFC compliance\r\n0 !HISTORY 2002-04-25 [PTadmin] Official Update 2002-02\r\n0 !HISTORY 2007-06-24 [PTadmin] Header formatted for Contributor Agreement\r\n0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01\r\n0 !HISTORY 2012-02-16 [Philo] Changed to CCW\r\n0 !HISTORY 2012-03-30 [PTadmin] Official Update 2012-01\r\n\r\n1 16 0 0 0 6 0 0 0 1 0 0 0 6 4-4edge.dat\r\n1 16 0 -4 0 6 0 0 0 1 0 0 0 6 4-4edge.dat\r\n1 16 0 0 0 6 0 0 0 -4 0 0 0 6 4-4cyli.dat\r\n1 16 0 -4 0 6 0 0 0 1 0 0 0 6 4-4disc.dat\r\n'
  );
  const graph = await fromLDrawPart('3024', { allowFetch: false });
  t.deepEqual(JSON.parse(JSON.stringify(prepareForSerialization(graph))), {
    type: 'graph',
    tags: [],
    graph: {
      isClosed: false,
      isEmpty: false,
      isLazy: true,
      provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
      serializedSurfaceMesh:
        '113\n' +
        '-6 4 6\n' +
        '6 4 6\n' +
        '6 4 -6\n' +
        '-6 4 -6\n' +
        '-6 8 6\n' +
        '6 8 6\n' +
        '-6 8 -6\n' +
        '6 8 -6\n' +
        '10 8 10\n' +
        '-10 8 10\n' +
        '-10 8 -10\n' +
        '10 8 -10\n' +
        '-10 0 -10\n' +
        '10 0 -10\n' +
        '10 0 10\n' +
        '-10 0 10\n' +
        '232/39 -4 18/23\n' +
        '6 0 0\n' +
        '232/39 0 18/23\n' +
        '6 -4 0\n' +
        '226/39 -4 59/38\n' +
        '226/39 0 59/38\n' +
        '194/35 -4 62/27\n' +
        '194/35 0 62/27\n' +
        '213/41 -4 3\n' +
        '213/41 0 3\n' +
        '119/25 -4 84/23\n' +
        '119/25 0 84/23\n' +
        '140/33 -4 140/33\n' +
        '140/33 0 140/33\n' +
        '84/23 -4 119/25\n' +
        '84/23 0 119/25\n' +
        '3 -4 213/41\n' +
        '3 0 213/41\n' +
        '62/27 -4 194/35\n' +
        '62/27 0 194/35\n' +
        '59/38 -4 226/39\n' +
        '59/38 0 226/39\n' +
        '18/23 -4 232/39\n' +
        '18/23 0 232/39\n' +
        '0 -4 6\n' +
        '0 0 6\n' +
        '-18/23 -4 232/39\n' +
        '-18/23 0 232/39\n' +
        '-59/38 -4 226/39\n' +
        '-59/38 0 226/39\n' +
        '-62/27 -4 194/35\n' +
        '-62/27 0 194/35\n' +
        '-3 -4 213/41\n' +
        '-3 0 213/41\n' +
        '-84/23 -4 119/25\n' +
        '-84/23 0 119/25\n' +
        '-140/33 -4 140/33\n' +
        '-140/33 0 140/33\n' +
        '-119/25 -4 84/23\n' +
        '-119/25 0 84/23\n' +
        '-213/41 -4 3\n' +
        '-213/41 0 3\n' +
        '-194/35 -4 62/27\n' +
        '-194/35 0 62/27\n' +
        '-226/39 -4 59/38\n' +
        '-226/39 0 59/38\n' +
        '-232/39 -4 18/23\n' +
        '-232/39 0 18/23\n' +
        '-6 -4 0\n' +
        '-6 0 0\n' +
        '-232/39 -4 -18/23\n' +
        '-232/39 0 -18/23\n' +
        '-226/39 -4 -59/38\n' +
        '-226/39 0 -59/38\n' +
        '-194/35 -4 -62/27\n' +
        '-194/35 0 -62/27\n' +
        '-213/41 -4 -3\n' +
        '-213/41 0 -3\n' +
        '-119/25 -4 -84/23\n' +
        '-119/25 0 -84/23\n' +
        '-140/33 -4 -140/33\n' +
        '-140/33 0 -140/33\n' +
        '-84/23 -4 -119/25\n' +
        '-84/23 0 -119/25\n' +
        '-3 -4 -213/41\n' +
        '-3 0 -213/41\n' +
        '-62/27 -4 -194/35\n' +
        '-62/27 0 -194/35\n' +
        '-59/38 -4 -226/39\n' +
        '-59/38 0 -226/39\n' +
        '-18/23 -4 -232/39\n' +
        '-18/23 0 -232/39\n' +
        '0 -4 -6\n' +
        '0 0 -6\n' +
        '18/23 -4 -232/39\n' +
        '18/23 0 -232/39\n' +
        '59/38 -4 -226/39\n' +
        '59/38 0 -226/39\n' +
        '62/27 -4 -194/35\n' +
        '62/27 0 -194/35\n' +
        '3 -4 -213/41\n' +
        '3 0 -213/41\n' +
        '84/23 -4 -119/25\n' +
        '84/23 0 -119/25\n' +
        '140/33 -4 -140/33\n' +
        '140/33 0 -140/33\n' +
        '119/25 -4 -84/23\n' +
        '119/25 0 -84/23\n' +
        '213/41 -4 -3\n' +
        '213/41 0 -3\n' +
        '194/35 -4 -62/27\n' +
        '194/35 0 -62/27\n' +
        '226/39 -4 -59/38\n' +
        '226/39 0 -59/38\n' +
        '232/39 -4 -18/23\n' +
        '232/39 0 -18/23\n' +
        '0 -4 0\n' +
        '\n' +
        '172\n' +
        '3 1 3 0\n' +
        '3 4 1 0\n' +
        '3 6 0 3\n' +
        '3 7 3 2\n' +
        '3 5 2 1\n' +
        '3 5 9 8\n' +
        '3 4 10 9\n' +
        '3 6 11 10\n' +
        '3 7 8 11\n' +
        '3 13 15 12\n' +
        '3 8 15 14\n' +
        '3 9 12 15\n' +
        '3 10 13 12\n' +
        '3 11 14 13\n' +
        '3 18 16 17\n' +
        '3 19 17 16\n' +
        '3 21 20 18\n' +
        '3 16 18 20\n' +
        '3 23 22 21\n' +
        '3 20 21 22\n' +
        '3 25 24 23\n' +
        '3 22 23 24\n' +
        '3 24 27 26\n' +
        '3 29 28 27\n' +
        '3 26 27 28\n' +
        '3 31 30 29\n' +
        '3 28 29 30\n' +
        '3 30 33 32\n' +
        '3 35 34 33\n' +
        '3 32 33 34\n' +
        '3 37 36 35\n' +
        '3 34 35 36\n' +
        '3 39 38 37\n' +
        '3 36 37 38\n' +
        '3 41 40 39\n' +
        '3 38 39 40\n' +
        '3 43 42 41\n' +
        '3 40 41 42\n' +
        '3 45 44 43\n' +
        '3 42 43 44\n' +
        '3 47 46 45\n' +
        '3 44 45 46\n' +
        '3 49 48 47\n' +
        '3 46 47 48\n' +
        '3 48 51 50\n' +
        '3 53 52 51\n' +
        '3 50 51 52\n' +
        '3 55 54 53\n' +
        '3 52 53 54\n' +
        '3 54 57 56\n' +
        '3 59 58 57\n' +
        '3 56 57 58\n' +
        '3 61 60 59\n' +
        '3 58 59 60\n' +
        '3 63 62 61\n' +
        '3 60 61 62\n' +
        '3 65 64 63\n' +
        '3 62 63 64\n' +
        '3 67 66 65\n' +
        '3 64 65 66\n' +
        '3 69 68 67\n' +
        '3 66 67 68\n' +
        '3 71 70 69\n' +
        '3 68 69 70\n' +
        '3 73 72 71\n' +
        '3 70 71 72\n' +
        '3 72 75 74\n' +
        '3 77 76 75\n' +
        '3 74 75 76\n' +
        '3 79 78 77\n' +
        '3 76 77 78\n' +
        '3 78 81 80\n' +
        '3 83 82 81\n' +
        '3 80 81 82\n' +
        '3 85 84 83\n' +
        '3 82 83 84\n' +
        '3 87 86 85\n' +
        '3 84 85 86\n' +
        '3 89 88 87\n' +
        '3 86 87 88\n' +
        '3 91 90 89\n' +
        '3 88 89 90\n' +
        '3 93 92 91\n' +
        '3 90 91 92\n' +
        '3 95 94 93\n' +
        '3 92 93 94\n' +
        '3 97 96 95\n' +
        '3 94 95 96\n' +
        '3 96 99 98\n' +
        '3 101 100 99\n' +
        '3 98 99 100\n' +
        '3 103 102 101\n' +
        '3 100 101 102\n' +
        '3 102 105 104\n' +
        '3 107 106 105\n' +
        '3 104 105 106\n' +
        '3 109 108 107\n' +
        '3 106 107 108\n' +
        '3 111 110 109\n' +
        '3 108 109 110\n' +
        '3 17 19 111\n' +
        '3 110 111 19\n' +
        '3 112 19 16\n' +
        '3 112 16 20\n' +
        '3 112 20 22\n' +
        '3 112 22 24\n' +
        '3 112 24 26\n' +
        '3 112 26 28\n' +
        '3 112 28 30\n' +
        '3 112 30 32\n' +
        '3 112 32 34\n' +
        '3 112 34 36\n' +
        '3 112 36 38\n' +
        '3 112 38 40\n' +
        '3 112 40 42\n' +
        '3 112 42 44\n' +
        '3 112 44 46\n' +
        '3 112 46 48\n' +
        '3 112 48 50\n' +
        '3 112 50 52\n' +
        '3 112 52 54\n' +
        '3 112 54 56\n' +
        '3 112 56 58\n' +
        '3 112 58 60\n' +
        '3 112 60 62\n' +
        '3 112 62 64\n' +
        '3 112 64 66\n' +
        '3 112 66 68\n' +
        '3 112 68 70\n' +
        '3 112 70 72\n' +
        '3 112 72 74\n' +
        '3 112 74 76\n' +
        '3 112 76 78\n' +
        '3 112 78 80\n' +
        '3 112 80 82\n' +
        '3 112 82 84\n' +
        '3 112 84 86\n' +
        '3 112 86 88\n' +
        '3 112 88 90\n' +
        '3 112 90 92\n' +
        '3 112 92 94\n' +
        '3 112 94 96\n' +
        '3 112 96 98\n' +
        '3 112 98 100\n' +
        '3 112 100 102\n' +
        '3 112 102 104\n' +
        '3 112 104 106\n' +
        '3 112 106 108\n' +
        '3 112 108 110\n' +
        '3 112 110 19\n' +
        '3 3 1 2\n' +
        '3 1 4 5\n' +
        '3 0 6 4\n' +
        '3 3 7 6\n' +
        '3 2 5 7\n' +
        '3 9 5 4\n' +
        '3 10 4 6\n' +
        '3 11 6 7\n' +
        '3 8 7 5\n' +
        '3 15 13 14\n' +
        '3 15 8 9\n' +
        '3 12 9 10\n' +
        '3 13 10 11\n' +
        '3 14 11 8\n' +
        '3 27 24 25\n' +
        '3 33 30 31\n' +
        '3 51 48 49\n' +
        '3 57 54 55\n' +
        '3 75 72 73\n' +
        '3 81 78 79\n' +
        '3 99 96 97\n' +
        '3 105 102 103\n',
      hash: 'KTdDNEQq3LqnJCWz1RGvIdv966hffr0yhtAC4V/QXWQ=',
    },
    matrix: [
      0.39999999999999997,
      0,
      0,
      0,
      0,
      0.39999999999999997,
      0,
      0,
      0,
      0,
      0.39999999999999997,
      0,
      0,
      0,
      0,
      1,
      '2/5',
      '0',
      '0',
      '0',
      '0',
      '2/5',
      '0',
      '0',
      '0',
      '0',
      '2/5',
      '0',
      '1',
    ],
    cache: {
      boundingBox: [
        [-4.0000000000000036, -1.600000000000001, -4.000000000000003],
        [4.0000000000000036, 3.200000000000002, 4.000000000000003],
      ],
    },
  });
});
