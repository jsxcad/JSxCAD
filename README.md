## JSxCAD

## Unstable - DO NOT USE

(... unless you read the following carefully ...)

This code is in early development - many things are broken.

It is suitable for use for testing and development until the jscad user API is up to spec.

At this time we are actively seeking representative jscad examples to drive user API development.

If you have example code that you would like to work under JSxCAD please make a PR to add the code under example/v1.

## Overview

This library supports solid modeling (e.g., for 3d printing), surface modeling, and path modeling (e.g, for laser cutting and embroidery).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Installation

```
npm install @jsxcad/api-v1
```

Note: npm packages will be published once the user api is up to spec.

## Usage

- Running locally

This should produce example/v1/tmp/square.pdf.

```
git clone https://github.com/jsxcad/JSxCAD

cd JSxCAD
npm install
npm run bootstrap
cd example/v1

npm run example square
```

- Script support

These should work at the top level.

Travis will enforce 'npm run test' and 'npm run lint' passing.

```
npm install
npm run bootstrap
npm run test
npm run lint
```

These should work in all sub-packages.

```
npm run test name
npm run tests
npm run lint
npm run lintfix
```

## API

For questions about the API, please contact the [User Group](https://groups.google.com/forum/#!forum/jsxcad).

## Contribute

This library is maintained by a group of volunteers. We welcome and encourage anyone to pitch in but please take a moment to read the following guidelines.

- Design discussion on [Design](https://docs.google.com/document/d/1SLwZldZ-3Xxda4b2HtJlQhFxdZDizvTz3ciKIZAyLoY/edit?usp=sharing).

- API discussion on [API](https://docs.google.com/document/d/197XMxmHM7dL0wbdeFG33BX3efA6_f5peiO5rUsdQkJc/edit?usp=sharing).

- Bug reports are accepted as [Issues](https://github.com/JSxCAD/jsxcad/issues/) via GitHub.

- New contributions are accepted as [Pull Requests](https://github.com/JSxCAD/jsxcad/pulls/) via GithHub.

- We only accept bug reports and pull requests on **GitHub**.

- If you have a question about how to use JSxCAD, then please start a conversation at the [User Group](https://groups.google.com/forum/#!forum/jsxcad).

- If you have a change or new feature in mind, please start a conversation at the [User Group](https://groups.google.com/forum/#!forum/jsxcad).

Small Note: If editing this README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Copyrights

Some copyrights apply. Copyright (c) 2012 Joost Nieuwenhuijse (joost@newhouse.nl), under the MIT license. Copyright (c) 2011 Evan Wallace (http://madebyevan.com/)

## License

[The MIT License (MIT)](https://github.com/JSxCAD/jsxcad/blob/master/LICENSE)
(unless specified otherwise)
