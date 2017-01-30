[![npm package](https://nodei.co/npm/exman.png)](https://nodei.co/npm/exman/)

Use Adobe's [Extension Manager command line tool](https://www.adobeexchange.com/resources/28) in node.js.

## Installation

```sh
$ npm install exman
```

## Usage

```js
const exman = require('exman');

exman.install(path.join(__dirname, 'com.domain.extension.zxp'))
     .then(() => console.log('Extension installed!'))
     .catch((stderr) => console.warn(`Failed to install: ${stderr.toString()}`))
```

## Module API

| Command     | Description          | Required Argument                        |
| ----------- | -------------------- | ---------------------------------------- |
| `install`   | Install an extension | Path to the extension's `.zxp` file      |
| `remove`    | Remove an extension  | The extension name (bundle identifier)   |
| `enable`    | Enable an extension  | The extension name (bundle identifier)   |
| `disable`   | Disable an extension | The extension name (bundle identifier)   |
| `update`    | Update an extension  | The extension name (bundle identifier)   |

