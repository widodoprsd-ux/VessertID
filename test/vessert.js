/*
 * File      : vessert.js
 * Layer     : test (assertion engine)
 * Caller    : test/pupputer.test.js
 *             test/parallel.test.js
 * Calls     : (none)
 *
 * Variables : (none)
 * Operations: vessert         (public)
 *             VessertError   (public class)
 *             _formatValue   (private)
 *             _isDeepEqual   (private)
 * Exports   : vessert, VessertError
 */

// === CLASSES ===

/**
 * Custom error thrown when an assertion fails.
 */
class VessertError extends Error {
  /**
   * @param {Object} options - Error details.
   * @param {string} options.message - Failure description.
   * @param {any} [options.actual] - Actual value received.
   * @param {any} [options.expected] - Expected value.
   * @param {string} [options.operator] - Name of the assertion operator.
   */
  constructor({ message, actual, expected, operator }) {
    super(message);
    this.name = 'VessertError';
    this.actual = actual;
    this.expected = expected;
    this.operator = operator;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VessertError);
    }
  }
}

// === PRIVATE METHODS ===

/**
 * Safely format a value for assertion failure messages.
 *
 * @param {any} val - Value to serialize.
 * @returns {string} String representation.
 */
function _formatValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return JSON.stringify(val);
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (typeof val === 'symbol') return val.toString();
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Compare two values deeply for structural equality.
 *
 * @param {any} a - First value.
 * @param {any} b - Second value.
 * @returns {boolean} True if deeply equal.
 */
function _isDeepEqual(a, b) {
  if (Object.is(a, b)) return true;

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!_isDeepEqual(a[key], b[key])) return false;
  }

  return true;
}

// === PUBLIC METHODS ===

/**
 * Vessert Assertion Engine.
 * Callable as `vessert(val, msg)` or via its assertion methods.
 *
 * @param {any} val - Value to test for truthiness.
 * @param {string} [msg] - Optional custom failure message.
 * @throws {VessertError} If value is falsy.
 */
function vessert(val, msg) {
  vessert.ok(val, msg);
}

/**
 * Assert that value is truthy.
 *
 * @param {any} val - Value to check.
 * @param {string} [msg] - Custom error message.
 * @throws {VessertError}
 */
vessert.ok = function ok(val, msg) {
  if (!val) {
    throw new VessertError({
      message: msg || `Expected truthy value, got ${_formatValue(val)}`,
      actual: val,
      expected: true,
      operator: 'ok'
    });
  }
};

/**
 * Assert strict equality (`===`).
 *
 * @param {any} actual - Actual value.
 * @param {any} expected - Expected value.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.equal = function equal(actual, expected, msg) {
  if (!Object.is(actual, expected)) {
    throw new VessertError({
      message: msg || `Expected ${_formatValue(actual)} === ${_formatValue(expected)}`,
      actual,
      expected,
      operator: 'strictEqual'
    });
  }
};

/**
 * Assert strict inequality (`!==`).
 *
 * @param {any} actual - Actual value.
 * @param {any} expected - Unwanted value.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.notEqual = function notEqual(actual, expected, msg) {
  if (Object.is(actual, expected)) {
    throw new VessertError({
      message: msg || `Expected values not to equal: ${_formatValue(actual)}`,
      actual,
      expected,
      operator: 'notStrictEqual'
    });
  }
};

/**
 * Assert deep structural equality.
 *
 * @param {any} actual - Actual value.
 * @param {any} expected - Expected value.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.deepEqual = function deepEqual(actual, expected, msg) {
  if (!_isDeepEqual(actual, expected)) {
    throw new VessertError({
      message: msg || `Deep equality failed:\nActual  : ${_formatValue(actual)}\nExpected: ${_formatValue(expected)}`,
      actual,
      expected,
      operator: 'deepEqual'
    });
  }
};

/**
 * Assert that a string matches a RegExp.
 *
 * @param {string} string - Input string.
 * @param {RegExp} regex - Expected pattern.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.match = function match(string, regex, msg) {
  if (!(regex instanceof RegExp)) {
    throw new TypeError(`Expected RegExp pattern, got ${_formatValue(regex)}`);
  }
  if (!regex.test(string)) {
    throw new VessertError({
      message: msg || `Expected string to match ${regex}:\n${_formatValue(string)}`,
      actual: string,
      expected: regex,
      operator: 'match'
    });
  }
};

/**
 * Assert that a string does NOT match a RegExp.
 *
 * @param {string} string - Input string.
 * @param {RegExp} regex - Unwanted pattern.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.doesNotMatch = function doesNotMatch(string, regex, msg) {
  if (!(regex instanceof RegExp)) {
    throw new TypeError(`Expected RegExp pattern, got ${_formatValue(regex)}`);
  }
  if (regex.test(string)) {
    throw new VessertError({
      message: msg || `Expected string not to match ${regex}:\n${_formatValue(string)}`,
      actual: string,
      expected: regex,
      operator: 'doesNotMatch'
    });
  }
};

/**
 * Assert that executing `fn` throws an error.
 *
 * @param {() => any} fn - Function expected to throw.
 * @param {Function|RegExp|string} [expected] - Expected constructor or pattern.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.throws = function throws(fn, expected, msg) {
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  let thrown = false;
  let thrownError = null;

  try {
    fn();
  } catch (err) {
    thrown = true;
    thrownError = err;
  }

  if (!thrown) {
    throw new VessertError({
      message: msg || 'Expected function to throw, but it did not',
      actual: null,
      expected,
      operator: 'throws'
    });
  }

  if (typeof expected === 'function') {
    if (!(thrownError instanceof expected)) {
      throw new VessertError({
        message: msg || `Expected error to be instance of ${expected.name}, got ${thrownError?.name || thrownError}`,
        actual: thrownError,
        expected,
        operator: 'throws'
      });
    }
  } else if (expected instanceof RegExp) {
    const errString = String(thrownError?.message || thrownError);
    if (!expected.test(errString)) {
      throw new VessertError({
        message: msg || `Expected error message to match ${expected}, got: ${errString}`,
        actual: thrownError,
        expected,
        operator: 'throws'
      });
    }
  }
};

/**
 * Assert that executing `fn` does NOT throw any error.
 *
 * @param {() => any} fn - Function expected to succeed.
 * @param {string} [msg] - Custom message.
 * @throws {VessertError}
 */
vessert.doesNotThrow = function doesNotThrow(fn, msg) {
  if (typeof fn !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  try {
    fn();
  } catch (err) {
    throw new VessertError({
      message: msg || `Expected function not to throw, but caught: ${err?.message || err}`,
      actual: err,
      expected: undefined,
      operator: 'doesNotThrow'
    });
  }
};

// === EXPORTS ===

export { vessert, VessertError };
