# Heropatterns Helper

Node.js helper functions to convert heropatterns to JPEGs, PNGs, SVGs, and ZIPs

## Getting Started

### Installation

Install with [NPM](https://www.npmjs.com/package/heropatterns-helper).

```Shell
npm install heropatterns-helper sharp
```

Install with Yarn.

```Shell
yarn add heropatterns-helper sharp
```

### Setup and Usage

#### Import the library

```js
const heropatterns = require('heropatterns-helper');

const {
  toJpeg,
  toPng,
  toSvg,
  toZip,
  getMetadata,
  FileType,
} = require('heropatterns-helper');
```

#### Helper functions

```js
// returns object { width, height, backgroundColor, foregroundColor, svg, }
getMetadata(cssString);
```

```js
// returns buffer with jpeg
toJpeg(heroPatternSvg);
```

```js
// returns buffer with png
toPng(heroPatternSvg);
```

```js
// returns buffer with svg
toSvg(heroPatternSvg);
```

```js
// The FileType as imported above
export const FileType = {
  JPEG: 'JPEG',
  PNG: 'PNG',
  SVG: 'SVG',
  ZIP: 'ZIP',
};

// if you have already created file buffers
// the zip function can reuse them
const files = {
  [FileType.JPEG]: await toJpeg(heroPatternSvg),
};
// returns buffer with zip
toZip(heroPatternSvg, files, fileName, licenseText);
```

### License

Heropatterns Helper Code: MIT (see license.md)
