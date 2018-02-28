let SMALL_NUMBER: number = 0.001;
export { SMALL_NUMBER }

/**
 * Returns true if the two values are equal to one another within the epsilon margin
 * @param {number} value1 - The first value to compare
 * @param {number} value2 - The second value to compare
 * @param {number} [epsilon=Number.EPSILON] - The epsilon value to use for comparing if the two values are nealy equal
 * @return {boolean} True if the delta between the two values is Less Than (LT) to the epsilon value, False otherwise
 */
export function nearlyEqual(value1: number, value2: number, epsilon: number = SMALL_NUMBER) {
  // Calculate the delta and compare it to the epsilon value
  const delta = value2 - value1;
  return (delta < epsilon || delta > -epsilon);
}
