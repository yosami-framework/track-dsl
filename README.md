# TrackDSL
DSL support for track.

[![Build Status](https://travis-ci.org/yosami-framework/track-dsl.svg?branch=master)](https://travis-ci.org/yosami-framework/track-dsl)

## Installation

### npm

```shell
npm install track-dsl
```

## Usage

For example, create DSL having `#getter` and `#setter`.

```javascript
class Hoge extends Base {
  static definer() {
    getter('foo');  // Define instance.foo
    getter('bar');  // Define instance.bar
    setter('piyo'); // Define instance.piyo=
  }
}
```

### Define DSL

```javascript
const TrackDSL = require('track-dsl');
class Base {
  constructor() {
    const dsl = new TrackDSL(this, {
      'getter': {func: this._defineGetter, binding: this},
      'setter': {func: this._defineSetter, binding: this},
    });

    dsl.evaluate(this.constructor.definer);
  }

  _defineGetter(name) {
    Object.defineProperty(this, name, {
      get: function() {
        return this[`_${name}`];
      }
    });
  }

  _defineSetter(name) {
    Object.defineProperty(this, name, {
      set: function(value) {
        this[`_${name}`] = value;
      }
    });
  }
}
```

### Use

```javascript
const hoge = new Hoge();

hoge.piyo = 'piyo';
hoge.foo;
```

### Base class.

Use `track-dsl/lib/base`.

```javascript
const TrackDSLBase = require('track-dsl/lib/extendable');

class BaseA extend TrackDSLBase {
  static dsl() {
    return  {
      'getter': {func: this._defineGetter, binding: this},
    }
  }

  constructor() {
    this.evaluateDSL();
  }
}

class BaseB extend BaseA {
  static dsl() {
    return  {
      'setter': {func: this._defineSetter, binding: this},
    }
  }
}

class ClassA extend BaseB {
  static definer() {
    getter('foo');  // Define instance.foo
  }
}

class ClassB extend ClassA {
  static definer() {
    setter('bar');  // Define instance.bar
  }
}
```

ClassB will define getter foo and setter bar.
