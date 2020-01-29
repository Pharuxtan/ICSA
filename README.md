# ICSA

[![LICENSE](https://img.shields.io/badge/LICENSE-MIT-c40000.svg?style=for-the-badge)](https://github.com/Pharuxtan/ICSA/blob/master/LICENSE)

#### ICSA is an archive file format based on brotli compression

## Installation

```
npm install --save icsa
```

## Examples

```js
const {createICSAFile, readICSAFile, createEICSAFile, readEICSAFile} = require("icsa");

// Create File
let file = await createICSAFile("path/to/dir"); // => <Buffer ...> // Use await createEICSAFile("path/to/file.icsa", "32 key length") for create encrypted icsa;

// Read File
let icsa = await readICSAFile("path/to/file.icsa"); // Use await readEICSAFile("path/to/file.icsa", "32 key length") for read encrypted icsa
/*
 * icsa.file => ICSA File Buffer <Buffer ...>
 * icsa.key => (only on readEICSAFile) The key you entered;
 * icsa.decrypt => (only on readEICSAFile) the decrypted ICSA File Buffer <Buffer ...>
 * icsa.magic => Magic number "ICSA"
 * icsa.dir => All dirs and files:
 * {
 *   "/": {"file.ext": <Buffer ...>, ...},
 *   "/folder": {...}
 * }
 * icsa.error => "null" if there has been no errors
 */
```
 
