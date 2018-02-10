const t        = require('track-spec');
const TrackDSL = require('../lib/index.js');

t.describe('TrackDSL', () => {
  t.beforeEach(() => {
    const mockBase = (class mockBase {
      /**
       * Initialize base.
       */
      constructor() {
        const dsl = new TrackDSL({
          'getter': {func: this._defineGetter, binding: this},
          'setter': {func: this._defineSetter, binding: this},
        });

        dsl.evaluate(this.constructor.definer);
      }

      /**
       * Define getter.
       * @param {string} name getter name.
       */
      _defineGetter(name) {
        Object.defineProperty(this, name, {
          get: function() {
            return this[`_${name}`];
          },
        });
      }

      /**
       * Define setter.
       * @param {string} name setter name.
       */
      _defineSetter(name) {
        Object.defineProperty(this, name, {
          set: function(value) {
            this[`_${name}`] = value;
          },
        });
      }
    });

    mock = new (class extends mockBase {
      /**
       * Definitions of model.
       */
      static definer() {
        getter('foo');
        setter('piyo');
      }
    })();
  });

  t.describe('getter', () => {
    t.it('Defined', () => {
      mock._foo = 'FOOOOOO!!';
      t.expect(mock.foo).equals('FOOOOOO!!');
    });
  });

  t.describe('setter', () => {
    t.it('Defined', () => {
      mock.piyo = 'PIYO!!!!';
      t.expect(mock._piyo).equals('PIYO!!!!');
    });
  });
});
