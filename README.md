# TrackDSL
DSL support for track.

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
    const dsl = new TrackDSL({
      'getter': {func: this._defineGetter, binding: this},
      'setter': {func: this._defineSetter, binding: this},
    });

    dsl.evaluate(this.constructor.definer, this);
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
