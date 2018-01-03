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

### Allow inheritance for specific classes

```json
{
    "extends": [
        "tslint-no-subclass"
    ],
    "rules": {
        "no-subclass": [true, "Foo", "Bar"]
    }
}
```

## Example

Config:

```json
{
    "extends": [
        "tslint-no-subclass"
    ],
    "rules": {
        "no-subclass": [true, "Allow"]
    }
}
```

Source code:

```typescript
class Allow {}

class Valid extends Allow {} // Valid because "Allow" was added to rule exceptions

class Disallow {}

class Invalid extends Disallow {} // Error: Subclass not allowed
```