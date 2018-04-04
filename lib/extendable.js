const ClassHelper = require('track-helpers/lib/class_helper');

/**
 * Support inheritance definer.
 * @example
 * class A extend Extendable {
 *   static definer() {
 *     getter('foo');  // Define instance.foo
 *   }
 * }
 *
 * class B extend A {
 *   static definer() {
 *     getter('bar');  // Define instance.bar
 *   }
 * }
 *
 * (new A()).definers; // Return A definers.
 * (new B()).definers; // Return A and B definers.
 */
class Extendable {
  /**
   * Get definers.
   * @private
   * @return {array<function>} definers.
   */
  get definers() {
    return (
      ClassHelper.getAncestors(this.constructor, Extendable)
                 .map((klass) => klass.definer)
                 .filter((func, idx, arr) => func && arr.indexOf(func) == idx)
                 .reverse()
    );
  }
}
module.exports = Extendable;
