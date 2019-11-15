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
 * <p><a href="https://jsxcad.js.org" target="_blank">Main Site</a></p>
 *
 * <p><a href="https://groups.google.com/forum/#!forum/jsxcad" target="_blank">Discussion Forum</a></p>
 *
 * <p><a href="https://github.com/jsxcad/JSxCAD" target="_blank">Reponsitory</a></p>
 *
 * ***
 *
 * # Introduction
 *
 * The initial app can be opened via:
 * <p><a href="https://jsxcad.js.org/preAlpha" target="_blank">https://jsxcad.js.org/preAlpha</a></p>
 *
 * Appending #project will select a project (stored within local storage):
 * <p><a href="https://jsxcad.js.org/preAlpha#circle" target="_blank">https://jsxcad.js.org/preAlpha#circle</a></p>
 *
 * Appending @gistUrl will load the initial script from a file named 'script' in the provided gist url:
 * <p><a href="https://jsxcad.js.org/preAlpha#circle@https://api.github.com/gists/3c39d513e91278681eed2eea27b0e589" target="_blank">https://jsxcad.js.org/preAlpha#circle@https://api.github.com/gists/3c39d513e91278681eed2eea27b0e589</a></p>
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
 * # Syntax
 *
 * Constructors and classes are capitalized. e.g., Circle, Shape.
 * Operations are lowercase. e.g., assemble.
 *
 * Functions are generally of the following form. The slots are optional.
 * ```
 * op(subject, ...arguments, { ...parameters }, ...objects)
 * ```
 *
 * Methods are of the same form:
 * ```
 * subject.op(...arguments, { ...parameters }, ...objects)
 * ```
 *
 * The number of arguments may vary for different operations.
 * These should be fundamental to the operation, such as Circle.ofRadius(radius).
 *
 * Parameters should supply non-fundamental values that are clarified by the parameter names.
 * e.g., Circle.ofRadius(radius, { sides: 8 }).
 *
 * Objects are a variable length list, generally of shapes.
 * e.g., Cube().with(Cube().moveX(1), Cube().moveX(2)).
 *
 * ***
 *
 * # Operator Guide
 *
 **/
