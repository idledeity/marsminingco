(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Math, undefined) { /* Math submodule namespace */

  /**
   * Returns true if the two values are equal to one another within the epsilon margin
   * @param {Number} value1 - The first value to compare
   * @param {Number} value2 - The second value to compare
   * @param {Number} [epsilon=Number.EPSILON] - The epsilon value to use for comparing if the two values are nealy equal
   * @return {Boolean} True if the delta between the two values is Less Than (LT) to the epsilon value, False otherwise
   */
  JJ.Math.nearlyEqual = function(value1, value2, epsilon) {
    // If no epsilon value was specified, use the default JS epsilon
    if (epsilon == undefined) {
      epsilon = Number.EPSILON;
    }

    // Calculate the delta and compare it to the epsilon value
    const delta = value2 - value1;
    return (delta < epsilon);
  }

}(window.JJ.Math = window.JJ.Math || {}));
}(window.JJ = window.JJ || {}));