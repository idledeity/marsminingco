(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Math, undefined) { /* Math submodule namespace */

    // A simple 2D vector class
    Math.Vector2 = class Vector2 {
      constructor(x, y) {
        if (isNan(x)) { x = 0.0; }
        if (isNan(y)) { y = x; }
        this.x = x;
        this.y = y;
      }

      // Multiply this vector's components by a scalar value
      scalarMul(value) {
        this.x *= value;
        this.y *= value;
        return this;
      }

      // Divide this vector's components by a scalar value
      scalarDiv(value) {
        this.x /= value;
        this.y /= value;
        return this;
      }

      // Add another vector's components to this vector's components
      add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
      }

      // Subtract another vector's components to this vector's components
      sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
      }

      // Multiply another vector's components to this vector's components
      mul(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
      }

      // Divide another vector's components to this vector's components
      div(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
      }

      // Zeros the vector components
      zero() {
        this.x = 0.0;
        this.y = 0.0;
        return this;
      }
    }

  }(window.MMC.Math = window.MMC.Math || {}));
}(window.MMC = window.MMC || {}));