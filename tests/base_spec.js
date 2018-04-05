const t            = require('track-spec');
const TrackDSLBase = require('../lib/base.js');

t.describe('TrackDSLBase', () => {
  let ClassA = null;
  let ClassB = null;
  let ClassC = null;
  let ClassD = null;

  t.beforeEach(() => {
    ClassA = (class extends TrackDSLBase {
      /**
       * Mock definer.
       */
      static definer() {
        hoge('HOOOGE!!!');
      }

      /**
       * Mock dsl.
       * @return {object} DSL.
       */
      static dsl() {
        return {'hoge': {func: this._setHoge, binding: this}};
      }

      /**
       * Set hoge.
       * @param {string} value Value.
       */
      _setHoge(value) {
        this.hoge = value;
      }
    });
    ClassB = (class extends ClassA {});
    ClassC = (class extends ClassB {
      /**
       * Mock definer.
       */
      static definer() {
        piyo('PIYO!PIYO!');
      }

      /**
       * Mock dsl.
       * @return {object} DSL.
       */
      static dsl() {
        return {'piyo': {func: this._setPiyo, binding: this}};
      }

      /**
       * Set piyo.
       * @param {string} value Value.
       */
      _setPiyo(value) {
        this.piyo = value;
      }
    });
    ClassD = (class extends ClassC {});
  });

  t.it('Execute DSL', () => {
    t.expect((new ClassD()).hoge).equals('HOOOGE!!!');
    t.expect((new ClassD()).piyo).equals('PIYO!PIYO!');
  });

  t.describe('#_collectFunction', () => {
    const subject = (() => (new ClassD())._collectFunction('definer'));

    t.it('Return definers', () => {
      t.expect(subject().length).equals(2);
      t.expect(subject()[0]).equals(ClassA.definer);
      t.expect(subject()[1]).equals(ClassC.definer);
    });
  });
});
