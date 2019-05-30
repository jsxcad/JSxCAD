/**
 * # User Guide
 *
 * # Pre-Alpha Release
 *
 * This version of JSxCAD is pre-alpha.
 *
 * Some things are broken and some things will break.
 *
 * You have been warned. :)
 *
 * [Main Site](http://jsxcad.js.org)
 *
 * [Discussion Forum](https://groups.google.com/forum/#!forum/jsxcad)
 *
 * [Repository](https://github.com/jsxcad/JSxCAD)
 *
 * ***
 *
 * # Introduction
 *
 * The initial app can be opened via:
 * [http://jsxcad.js.org/preAlpha](http://jsxcad.js.org/preAlpha)
 *
 * Appending #project will select a project (stored within local storage):
 * [http://jsxcad.js.org/preAlpha#circle](http://jsxcad.js.org/preAlpha#circle)
 *
 * Appending @gistUrl will load the initial script from a file named 'script' in the provided gist url:
 * [http://jsxcad.js.org/preAlpha#circle@https://api.github.com/gists/3c39d513e91278681eed2eea27b0e589](http://jsxcad.js.org/preAlpha#circle@https://api.github.com/gists/3c39d513e91278681eed2eea27b0e589)
 *
 * Replace 3c39d513e91278681eed2eea27b0e589 in the example with your gist id.
 *
 * Saving the project to gist is not yet supported.
 *
 * ***
 *
 * # Language
 *
 * A small compiler is included which will transform input to a canonical form.
 *
 * The basic api is implicitly imported into the top level scope, making 'circle', etc, available.
 *
 * If no 'main' export is provided the compiler collects top level expressions other than exports, and bundles them into an implicit main function.
 * An implicit 'return' is placed before the last expression.
 *
 * All functions are made async, and all function calls have an implicit await.
 *
 * The intent is that it should be possible to write simple things easily, and have these translated into es6 modules automatically, while also allowing
 * es6 modules to be written out explicitly.
 *
 * In some cases the analysis is confused by missing semicolons. If a script does not work, make sure all statements are terminated with semicolons.
 *
 * Returning a shape from the script should produce a preview.
 *
 * In order to generate stl, etc, use an operator like writeStl as described below. This should open a new window with a download button.
 *
 * ***
 *
 * # Operator Guide
 *
 **/
