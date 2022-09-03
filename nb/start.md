# JSxCAD

Press Shift-Enter or click Run above to generate notebook.

## Links

1. [Documentation](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/documentation/index.nb)
1. [Regression](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/regression/regression.nb)
1. [Projects](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/projects/index.nb)

## Introduction

JSxCAD allows CAD design as notebooks.

```JavaScript
Hershey('JSxCAD', 20).color('purple').by(align('xy')).gridView();
```

![Image](start.md.0.png)

Clicking on a view maximizes and allows rotation and animation; use Escape to return.

## Navigation

You can Control-Click on a link in the editor to visit a page.

'''
import 'https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/examples.nb';
'''

You can click on links in a notebook, like so: [examples.nb](#JSxCAD@https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/examples.nb)

The back button should return as usual, and urls can be bookmarked normally.

## Stability

Please understand that JSxCAD is undergoing rapid evolution, and the API is not stable.

You will soon be able to select particular commits to work at to mitigate this somewhat.

## Supported Browsers

Only the latest version of chromium is supported at this time.

Other browsers may or may not work, and fixes to support them are a low priority.

This should change as JSxCAD becomes more mature.

## Data Storage

Edits are stored locally in the browser - they can be downloaded or published only explicitly.

* Control-S will save local edits in the browser.
* Shift-Enter will save, then run the notebook being edited.
