(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Math, undefined) { /* Math submodule namespace */

    // A simple 2D vector class
    Math.Vector2 = class Vector2 extends MMC.System.Serialization.Serializable {
      constructor() {
        super();

        // Check the number of arguments provided
        if (arguments.length == 1) {
          // Check if the single argument is a Vector2
          if (arguments[0] instanceof Vector2) {
            // Copy the Vector2
            this.equals(arguments[0]);
          } else if (!isNaN(arguments[0])) {
            // If the argument is a number, fill all components with it
            this.setComponents(arguments[0]);
          } else {
            // Unknown argument configuration, just zero the vector
            this.zero();
          }
        } else if (arguments.length == 2) {
          // If there are 2 arguments, try to assign them to the vector's components
          this.setComponents(arguments[0], arguments[1]);
        } else {
          // Unknown argument configuration, just zero the vector
          this.zero();
        }
      }

      // Set the components for the vector
      setComponents(x, y) {
          MMC.System.assert(!isNaN(x), "Expected at least one numeric value");
          this.x = (!isNaN(arguments[0]) ? arguments[0] : 0.0);
          this.y = (!isNaN(arguments[1]) ? arguments[1] : 0.0);
          return this;
      }

      // Set this vector to equal the passed vector
      set(vector) {
        MMC.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
        return this.setComponents(vector.x, vector.y);
      }

      // Set this vector to equal the passed vector
      equals(vector) {
        return this.set(vector);
      }

      // Returns a copy of this vector
      copy() {
        return new Vector2(this);
      }

      // Zeros the vector components
      zero() {
        return this.setComponents(0.0, 0.0);
      }

      // Multiply this vector's components by a scalar value
      scalarMul(value) {
        MMC.System.assert(!isNaN(value), "Expected numeric value.");
        this.x *= value;
        this.y *= value;
        return this;
      }

      // Divide this vector's components by a scalar value
      scalarDiv(value) {
        MMC.System.assert(!isNaN(value), "Expected numeric value.");
        this.x /= value;
        this.y /= value;
        return this;
      }

      // Add another vector's components to this vector's components
      add(vector) {
        MMC.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
        this.x += vector.x;
        this.y += vector.y;
        return this;
      }

      // Subtract another vector's components to this vector's components
      sub(vector) {
        MMC.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
      }

      // Multiply another vector's components to this vector's components
      mul(vector) {
        MMC.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
      }

      // Divide another vector's components to this vector's components
      div(vector) {
        MMC.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
      }

      // Returns the length of the vector
      length() {
        return window.Math.sqrt(this.lengthSq());
      }

      // Returns the squared length of the vector
      lengthSq() {
        return this.dot(this);
      }

      // Returns the result of the dot product of this vector with the passed vector
      dot(vector) {
        MMC.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
        return (this.x * vector.x) + (this.y * vector.y);
      }

      // Returns true if the vector is a normalized unit vector, false if it is not
      isNormalized() {
        const lengthSq = this.lengthSq();
        return MMC.Math.nearlyEqual(lengthSq, 1.0);
      }

      // Noramalizes the vector's length to convert it to a unit vector in the same direction
      normalize() {
        // If the length of the vectors is smaller than epsilon, default to the right facing unit vector
        const vectorLength = this.length();
        if (vectorLength < Number.EPSILON) {
          this.equals(Math.vector2Right);
          return;
        }

        // Divide each of the components by the vector's length to generate a unit vector
        return this.scalarDiv(vectorLength);
      }

      // Creates a copy of this vector that is normalized to a unit vector
      normalizeCopy() {
        let newVector = new Vector2(this);
        return newVector.normalize();
      }

      //
      // Serializable methods
      //

      static getSerializationId() {
        return "Vector2";
      }

      serialize(serializeContext) {
        super.serialize(serializeContext);

        this.x = MMC.System.Serialization.serialize(serializeContext, "x", this.x);
        this.y = MMC.System.Serialization.serialize(serializeContext, "y", this.y);
      }
    }

    // Register this serializable type with the serialization type manager
    MMC.System.Serialization.serializableTypeMgr.registerType(Math.Vector2);

    Math.vector2Up = new Math.Vector2(0.0, 1.0);
    Math.vector2Right = new Math.Vector2(1.0, 0.0);

  }(window.MMC.Math = window.MMC.Math || {}));
}(window.MMC = window.MMC || {}));