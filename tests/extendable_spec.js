const t          = require('track-spec');
const Extendable = require('../lib/extendable.js');

t.describe('TrackDSL', () => {
  let ClassA = null;
  let ClassB = null;
  let ClassC = null;
  let ClassD = null;

  t.beforeEach(() => {
    ClassA = (class extends Extendable {
      /**
       * Mock definer.
       */
      static definer() {}
    });
    ClassB = (class extends ClassA {});
    ClassC = (class extends ClassB {
      /**
       * Mock definer.
       */
      static definer() {}
    });
    ClassD = (class extends ClassC {});
  });

  t.describe('#definers', () => {
    const subject = (() => (new ClassD()).definers);

    t.it('Return definers', () => {
      t.expect(subject().length).equals(2);
      t.expect(subject()[0]).equals(ClassA.definer);
      t.expect(subject()[1]).equals(ClassC.definer);
    });
  });
});
