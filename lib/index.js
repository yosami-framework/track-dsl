/**
 * DSL support for track.
 * @example
 * const dsl = new TrackDSL(this, {
 *  'getter': { func: this._defineGetter, binding: this },
 *  'setter': { func: this._defineSetter, binding: this },
 * });
 *
 * dsl.evaluate(function() {
 *   getter('hoge');
 *   setter('fuga');
 * });
 */
class TrackDSL {
  /**
   * Inititlize DSL module.
   * @param {object} context DSL execution context.
   * @param {object} dsl     DSL definition.
   */
  constructor(context, dsl) {
    this._cxt = context;
    this._dsl = dsl;
    this._defineDelegator();
  }

  /**
   * Define delegator.
   */
  _defineDelegator() {
    for (const key in this._dsl) {
      if (this._dsl.hasOwnProperty(key)) {
        const operation = this._dsl[key];
        this[`__${key}`] = operation.func.bind(operation.binding);
      }
    }
  }

  /**
   * Evaluate code block with DSL.
   * @param {function} block Code block.
   */
  evaluate(block) {
    const scripts = [];

    for (const key in this._dsl) {
      if (this._dsl.hasOwnProperty(key)) {
        scripts.push(`const ${key}=this.__${key}`);
      }
    }

    scripts.push(`(function(){${this._getFunctionBody(block)}}).bind(this._cxt)()`);

    eval(scripts.join(';'));
  }

  /**
   * Strip code from function.
   * @param {function} func Function.
   * @return {string} Function body.
   */
  _getFunctionBody(func) {
    return func.toString()
               .replace(/^[^{]+{/, '')
               .replace(/}[^}]*$/, '');
  }
}

module.exports = TrackDSL;
