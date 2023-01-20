export class AssertionError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = "AssertionError"
  }
}

/**
 * Assertion function for type narrowing.
 *
 * Thows an AssertionError if the condition is false.
 *
 * @param condition Something to evaluate as true to pass the assertion. If it is false, an AssertionError is thrown.
 * @param msg The message to display in the error.
 */
export const assert = (condition: any, msg?: string): asserts condition => {
  if (!condition) {
    throw new AssertionError(msg)
  }
}
