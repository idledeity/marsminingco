(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Math, undefined) { /* Math submodule namespace */

  /**
   * A simple 2D vector class
   * @extends JJ.System.Serialization.Serializable
   */
  JJ.Math.Vector2 = class Vector2 extends JJ.System.Serialization.Serializable {
    /**
    * Create a new Vector2
    */
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

    /**
     * Set the components for the vector
     * @param {Number} x - The X component
     * @param {Number} y - The Y component
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    setComponents(x, y) {
        JJ.System.assert(!isNaN(x), "Expected at least one numeric value");
        this.x = (!isNaN(arguments[0]) ? arguments[0] : 0.0);
        this.y = (!isNaN(arguments[1]) ? arguments[1] : 0.0);
        return this;
    }

    /**
     * Set this vector to equal the passed vector
     * @param {JJ.Math.Vector2} vector - The vector to set this vector to
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    set(vector) {
      JJ.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
      return this.setComponents(vector.x, vector.y);
    }

    /**
     * Set this vector to equal the passed vector
     * @param {JJ.Math.Vector2} vector - The vector to set this vector to
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    equals(vector) {
      return this.set(vector);
    }

    /**
     * Returns a copy of this vector
     * @return {JJ.Math.Vector2} A new Vector2 object that is a copy of this vector
     */
    copy() {
      return new Vector2(this);
    }

    /** Zeros the vector components
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    zero() {
      return this.setComponents(0.0, 0.0);
    }

    /**
     * Multiply this vector's components by a scalar value
     * @param {Number} value - The scalar value to multiply this vector by
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    scalarMul(value) {
      JJ.System.assert(!isNaN(value), "Expected numeric value.");
      this.x *= value;
      this.y *= value;
      return this;
    }

    /**
     * Divide this vector's components by a scalar value
     * @param {Number} value - The scalar balue to divide this vector by
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    scalarDiv(value) {
      JJ.System.assert(!isNaN(value), "Expected numeric value.");
      this.x /= value;
      this.y /= value;
      return this;
    }

    /**
     * Add another vector's components to this vector's components
     * @param {JJ.Math.Vector2} vector - The vector to add to this vector
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    add(vector) {
      JJ.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }

    /**
     * Subtract another vector's components to this vector's components
     * @param {JJ.Math.Vector2} vector - The vector to subtract from this vector
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    sub(vector) {
      JJ.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }

    // Multiply another vector's components to this vector's components
    mul(vector) {
      JJ.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
      this.x *= vector.x;
      this.y *= vector.y;
      return this;
    }

    /**
     * Divide this vector's components by another vector's components
     * @param {JJ.Math.Vector2} vector - The vector to to use for dividing each of this vector's components
     * @return {JJ.Math.Vector2} This Vector2 object
     */
    div(vector) {
      JJ.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
      this.x /= vector.x;
      this.y /= vector.y;
      return this;
    }

    /**
     * Returns the length of the vector
     * @return {Number} The length of this vector
     */
    length() {
      return window.Math.sqrt(this.lengthSq());
    }

    /**
     * Returns the squared length of the vector
     * @return {Number} The squared length of this vector
     */
    lengthSq() {
      return this.dot(this);
    }

    /**
     * Returns the result of the dot product of this vector with the passed vector
     * @return {Number} The dot product of this vector and the passed vector
     */
    dot(vector) {
      JJ.System.assert((vector instanceof Math.Vector2), "Expected Vector2 object.");
      return (this.x * vector.x) + (this.y * vector.y);
    }

    /**
     * Returns true if the vector is a normalized unit vector, false if it is not
     * @return {Boolean} True if this vector is normalized (has unit length), False if it is not
     */
    isNormalized() {
      const lengthSq = this.lengthSq();
      return JJ.Math.nearlyEqual(lengthSq, 1.0);
    }

    /**
     * Noramalizes the vector's length to convert it to a unit vector in the same direction
     * @return {JJ.Math.Vector2} This vector object
     */
    normalize() {
      // If the length of the vectors is smaller than epsilon, default to the right facing unit vector
      const vectorLength = this.length();
      if (vectorLength < Number.EPSILON) {
        this.equals(Math.vector2Right);
      }

      // Divide each of the components by the vector's length to generate a unit vector
      return this.scalarDiv(vectorLength);
    }

    /**
     * Creates a copy of this vector that is normalized to a unit vector
     * @return {JJ.Math.Vector2} A new Vector2 object that is a normalized copy of this vector
     */
    normalizeCopy() {
      let newVector = new Vector2(this);
      return newVector.normalize();
    }

    //
    // Serializable methods
    //

    /**
     * Returns the serialization ID for the object
     * @return {String} Unique serialization ID for this class
     */
    static getSerializationId() {
      return "Vector2";
    }

    /**
     * Serializes this object to and from a buffer =
     * @param {Object} serializeContext - The serialization context for the current operations (ex. read or write)
     */
    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.x = JJ.System.Serialization.serialize(serializeContext, this.x, "x");
      this.y = JJ.System.Serialization.serialize(serializeContext, this.y, "y");
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Math.Vector2);

  Math.vector2Up = new Math.Vector2(0.0, 1.0);
  Math.vector2Right = new Math.Vector2(1.0, 0.0);

}(window.JJ.Math = window.JJ.Math || {}));
}(window.JJ = window.JJ || {}));