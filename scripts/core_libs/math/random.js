(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Math, undefined) { /* Math submodule namespace */

  // TODO: Make this work with a seed for reproducible results
  /**
   * Generates a floating-point, pseudo-random number in the range [0.0, 1.0)
   * @return {Number} Pseudo-random floating-point number in the range [0.0, 1.0)
   */
  JJ.Math.random = function() {
    // For now just return default Math.random
    return window.Math.random();
  }

}(window.JJ.Math = window.JJ.Math || {}));
}(window.JJ = window.JJ || {}));