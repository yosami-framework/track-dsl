const TrackDSL    = require('./index');
const ClassHelper = require('track-helpers/lib/class_helper');

/**
 * Support inheritance definer.
 * @example
 * class A extend TrackDSLBase {
 *   static definer() {
 *     getter('foo');  // Define instance.foo
 *   }
 *
 *   static dsl() {}
 *     return {'getter': {func: this._defineGetter, binding: this}};
 *   }
 * }
 *
 * class B extend A {
 *   static definer() {
 *     setter('bar');  // Define instance.bar
 *   }
 *
 *   static dsl() {}
 *     return {'setter': {func: this._defineSetter, binding: this}};
 *   }
 * }
 */
class TrackDSLBase {
  /**
   * Initialize class.
   */
  constructor() {
    const dsls = {};
    this._collectFunction('dsl').forEach((func) => {
      const dsl = func.bind(this)();
      for (let name in dsl) {
        if (dsl.hasOwnProperty(name)) {
          dsls[name] = dsl[name];
        }
      }
    });

    const dsl = new TrackDSL(this, dsls);
    this._collectFunction('definer').forEach((definer) => {
      dsl.evaluate(definer);
    });
  }

  /**
   * Collect function of all descendants.
   * @private
   * @param {string} name Function name.
   * @return {array<function>} Functions.
   */
  _collectFunction(name) {
    return (
      ClassHelper.getAncestors(this.constructor, TrackDSLBase)
                 .map((klass) => klass[name])
                 .filter((func, idx, arr) => func && arr.indexOf(func) == idx)
                 .reverse()
    );
  }
}
module.exports = TrackDSLBase;
