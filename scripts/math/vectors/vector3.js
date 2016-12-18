(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Math, undefined) { /* Math submodule namespace */

    // A simple 3D vector class
    Math.Vector3 = class Vector3 {
      constructor(x, y, z) {
        // Check the number of arguments provided
        if (arguments.length == 1) {
          // Check if the single argument is a Vector3
          if (arguments[0] instanceof Vector3) {
            // Copy the Vector3
            this.equals(arguments[0].x);
          } else if (!isNan(arguments[0])) {
            // If the argument is a number, fill all components with it
            this.setComponents(arguments[0]);
          } else {
            // Unknown argument configuration, just zero the vector
            this.zero();
          }
        } else if (arguments.length == 3) {
          // If there are 3 arguments, try to assign them to the vector's components
          this.setComponent(arguments[0], arguments[1], arguments[2]);
        } else {
          // Unknown argument configuration, just zero the vector
          this.zero();
        }
      }

      // Set the components for the vector
      setComponents(x, y, z) {
          MMC.System.assert(!isNan(x), "Expected at least one numeric value");
          this.x = (!isNan(arguments[0]) ? arguments[0] : 0.0);
          this.y = (!isNan(arguments[1]) ? arguments[1] : 0.0);
          this.z = (!isNan(arguments[2]) ? arguments[2] : 0.0);
          return this;
      }

      // Set this vector to equal the passed vector
      set(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        return this.setComponents(vector.x, vector.y, vector.z);
      }

      // Set this vector to equal the passed vector
      equals(vector) {
        return this.set(vector);
      }

      // Returns a copy of this vector
      copy() {
        return new Vector3(this);
      }

      // Zeros the vector components
      zero() {
        return this.setComponents(0.0, 0.0, 0.0);
      }

      // Multiply this vector's components by a scalar value
      scalarMul(value) {
        MMC.System.assert(!isNan(value), "Expected numeric value.");
        this.x *= value;
        this.y *= value;
        this.z *= value;
        return this;
      }

      // Divide this vector's components by a scalar value
      scalarDiv(value) {
        MMC.System.assert(!isNan(value), "Expected numeric value.");
        this.x /= value;
        this.y /= value;
        this.z /= value;
        return this;
      }

      // Add another vector's components to this vector's components
      add(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
      }

      // Subtract another vector's components to this vector's components
      sub(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;
      }

      // Multiply another vector's components to this vector's components
      mul(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        this.x *= vector.x;
        this.y *= vector.y;
        this.z *= vector.z;
        return this;
      }

      // Divide another vector's components to this vector's components
      div(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        this.x /= vector.x;
        this.y /= vector.y;
        this.z /= vector.z;
        return this;
      }

      // Returns the length of the vector
      length() {
        return window.Math.sqrt(lengthSq());
      }

      // Returns the squared length of the vector
      lengthSq() {
        return this.dot(this);
      }

      // Returns the result of the dot product of this vector with the passed vector
      dot(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
      }

      // Returns the cross product of this vector and the passed vector
      cross(vector) {
        MMC.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
        let newVector = new Vector3();
        newVector.x = (this.y * vector.z) - (this.z * vector.y);
        newVector.y = (this.z * vector.x) - (this.x * vector.z);
        newVector.z = (this.x * vector.y) - (this.y * vector.x);
        return newVector;
      }

      // Noramalizes the vector's length to convert it to a unit vector in the same direction
      normalize() {
        // If the length of the vectors is smaller than epsilon, default to the right facing unit vector
        const vectorLength = this.length();
        if (vectorLength < Number.EPSILON) {
          this.equals(Math.vector3Right);
          return;
        }

        // Divide each of the components by the vector's length to generate a unit vector
        return this.scalarDiv(vectorLength);
      }

      // Creates a copy of this vector that is normalized to a unit vector
      normalizeCopy() {
        let newVector = new Vector3(this);
        return newVector.normalize();
      }
    }

    // Constants
    Math.vector3Right = new Math.Vector2(1.0, 0.0, 0.0);
    Math.vector2Up = new Math.Vector2(0.0, 1.0, 0.0);
    Math.vector2Forward = new Math.Vector2(0.0, 0.0, 1.0);

  }(window.MMC.Math = window.MMC.Math || {}));
}(window.MMC = window.MMC || {}));