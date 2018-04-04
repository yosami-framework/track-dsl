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

### Extendable definer

Use `track-dsl/lib/extendable`.


```javascript
const TrackDSL           = require('track-dsl');
const TrackDSLExtendable = require('track-dsl/lib/extendable');

class Base extend TrackDSLExtendable {
  constructor() {
    const dsl = new TrackDSL(this, {
      'getter': {func: this._defineGetter, binding: this},
      'setter': {func: this._defineSetter, binding: this},
    });

    this.definers.forEach((definer) => {
      dsl.evaluate(definer);
    });
  }
}
```

And

```javascript
class A extend Base {
  static definer() {
    getter('foo');  // Define instance.foo
  }
}

class B extend A {
  static definer() {
    getter('bar');  // Define instance.bar
  }
}
```

B will define getter foo and bar.
