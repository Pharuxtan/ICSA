# ICSA

[![LICENSE](https://img.shields.io/badge/LICENSE-MIT-c40000.svg?style=for-the-badge)](https://github.com/Pharuxtan/ICSA/blob/master/LICENSE)

#### ICSA is an archive file format based on brotli compression

## Installation

```
npm install --save icsa
```

## Examples

```js
const {createICSAFile, readICSAFile} = require("icsa");

// Create File
let file = await createICSAFile("path/to/dir"); // => <Buffer ...>;

// readFile
let icsa = await readICSAFile("path/to/file.icsa");
/*
 * icsa.file => ICSA File Buffer <Buffer ...>
 * icsa.magic => Magic number "ICSA"
 * icsa.dir => all dirs and files:
 * {
 *   "/": {"file.ext": <Buffer ...>, ...},
 *   "/folder": {...}
 * }
 * icsa.error => "null" if there has been no errors
 */
```
