# Quick Start Guide

This quick start guide is meant to get someone with no background in JSXCAD up to speed and using the program quickly

## Introduction

Unlike a drawing based approach to CAD JSXCAD uses a programing language to define a CAD model. This approach has a number including the ability to revision control CAD models, reuse sections of a project, and more easily integrate CAD with other programs.

JSXCAD is a project derived from JSCAD which is itself inspired by Open SCAD.

In general JSXCAD tries to support the same interface as JSCAD which can be found [here](https://openjscad.org/dokuwiki/doku.php).

## Using JSXCAD from the Command Line

The primary way to use JSXCAD is to run a JSXCAD file from the command line. 

A JSXCAD file has three basic parts.

1) Imports

At the top of the JSXCAD file we need to import the parts of JSXCAD we will need for our model like this:

`import { cylinder, difference, rotate, sphere, writeStl, writeThreejsPage } from '@jsxcad/api-v1';`

2) Operations

Once we have imported the JSXCAD elements we need we can use them to create primitives and perform operations. A JSXCAD file is still a full javascript language file so you are free to use functions, for loops, and any other js operations you would like. Here is an example from the `example001.js` file.

```

function radiusFromDiameter (d) {
  return d / 2;
}

function rotcy (rot, r, h) {
  return rotate(rot, cylinder({ r: r, h: h, center: true }));
}

function example001 () {
  var size = 50;
  var hole = 25;
  var radius = radiusFromDiameter(hole);
  var height = radiusFromDiameter(size * 2.5);

  return difference(
    sphere({ r: radiusFromDiameter(size) }),
    rotcy([0, 0, 0], radius, height),
    rotcy([90, 0, 0], radius, height),
    rotcy([0, 90, 0], radius, height)
  );
}

const solid = example001();

```

At the end of this code block `solid` will contain the JSXCAD geometry defined by the operations specified above.

3) Exports

Once we have done some operations to our JSXCAD primitives we need to be able to export the result into a useful file format. We can do that easily using a command like:

`writeStl({ path: '/tmp/example001.stl' }, solid);`

Which will create a new file or overwrite an existing file in the location `/tmp/example001.stl`. JSXCAD can write to a number of file types this way.

## Using JSXCAD embedded in a website or larger program

One of the other major advantages of a programing based approach to CAD is that JSXCAD can be embedded in a website easily to provide CAD capabilities to a website. Because JSXCAD is already using java script it is easy to make a CAD model which can be modified by the website.

1) Add way to view your JSXCAD file

JSXCAD does natively include any file viewing capabilities. JSXCAD can only take a definition of geometry and write it to a file which we can then view in another program.

Because a website needs to display the rendered model for visitors we will need use a library which can display the file produced by JSXCAD. 

...in progress here

