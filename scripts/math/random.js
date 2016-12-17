(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Math, undefined) { /* Math submodule namespace */

    // TODO: Make this work with a seed for reproducible results

    Math.random = function() {
      // For now just return default Math.random
      return window.Math.random();
    }
    
  }(window.MMC.Math = window.MMC.Math || {}));
}(window.MMC = window.MMC || {}));