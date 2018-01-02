# tslint-no-subclass

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/tslint-no-subclass.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/tslint-no-subclass/)

TSLint rule to prevent class inheritance.

## Install

```bash
npm install --save-dev tslint-no-subclass
```

## Usage

Add the following to `tslint.json`:

```json
{
    "extends": [
        "tslint-no-subclass"
    ],
    "rules": {
        "no-subclass": true
    }
}
```

## Example

```typescript
class Foo {}

class Bar extends Foo {} // Error: No subclasses allowed
```