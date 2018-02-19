(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Math, undefined) { /* Math submodule namespace */

  /**
   * A simple 2D vector class
   * @extends JJ.System.Serialization.Serializable
   */
  JJ.Math.Vector3 = class Vector3 extends JJ.System.Serialization.Serializable {
    /**
     * Create a new Vector3
     */
    constructor(x, y, z) {
      super();

      // Check the number of arguments provided
      if (arguments.length == 1) {
        // Check if the single argument is a Vector3
        if (arguments[0] instanceof Vector3) {
          // Copy the Vector3
          this.equals(arguments[0]);
        } else if (!isNaN(arguments[0])) {
          // If the argument is a number, fill all components with it
          this.setComponents(arguments[0]);
        } else {
          // Unknown argument configuration, just zero the vector
          this.zero();
        }
      } else if (arguments.length == 3) {
        // If there are 3 arguments, try to assign them to the vector's components
        this.setComponents(arguments[0], arguments[1], arguments[2]);
      } else {
        // Unknown argument configuration, just zero the vector
        this.zero();
      }
    }

    /**
     * Set the components for the vector
     * @param {Number} x - The X component of the vector
     * @param {Number} y - The Y component of the vector
     * @param {Number} z - The Z component of the vector
     * @return {JJ.Math.Vector3} This vector object
     */
    setComponents(x, y, z) {
        JJ.System.assert(!isNaN(x), "Expected at least one numeric value");
        this.x = (!isNaN(arguments[0]) ? arguments[0] : 0.0);
        this.y = (!isNaN(arguments[1]) ? arguments[1] : 0.0);
        this.z = (!isNaN(arguments[2]) ? arguments[2] : 0.0);
        return this;
    }

    /**
     * Set this vector to equal the passed vector
     * @param {JJ.Math.Vector3} vector - The vector to set this vector to
     * @return {JJ.Math.Vector3} This vector object
     */
    set(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      return this.setComponents(vector.x, vector.y, vector.z);
    }

    /**
     * Set this vector to equal the passed vector
     * @param {JJ.Math.Vector3} vector - The vector to assign to this vector
     * @return {JJ.Math.Vector3} This vector object
     */
    equals(vector) {
      return this.set(vector);
    }

    /**
     * Returns a copy of this vector
     * @return {JJ.Math.Vector3} A new vector object that is a copy of this vector
     */
    copy() {
      return new Vector3(this);
    }

    /**
     * Zeros the vector components
     * @return {JJ.Math.Vector3} This vectoor object
     */
    zero() {
      return this.setComponents(0.0, 0.0, 0.0);
    }

    /**
     * Multiply this vector's components by a scalar value
     * @param {Number} value - The scalar value to multiply this vector by
     * @return {JJ.Math.Vector3} This vector object
     */
    scalarMul(value) {
      JJ.System.assert(!isNaN(value), "Expected numeric value.");
      this.x *= value;
      this.y *= value;
      this.z *= value;
      return this;
    }

    /**
     * Divide this vector's components by a scalar value
     * @param {Number} value - The scalar value to divide this vector by
     * @return {JJ.Math.Vector3} This vector object
     */
    scalarDiv(value) {
      JJ.System.assert(!isNaN(value), "Expected numeric value.");
      this.x /= value;
      this.y /= value;
      this.z /= value;
      return this;
    }

    /**
     * Add another vector's components to this vector's components
     * @param {JJ.Math.Vector3} vector - The vector to add to this vector
     * @return {JJ.Math.Vector3} This vector object
     */
    add(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      this.x += vector.x;
      this.y += vector.y;
      this.z += vector.z;
      return this;
    }

    /**
     * Subtract another vector's components to this vector's components
     * @param {JJ.Math.Vector3} vector - The vector to subtract from this vector
     * @return {JJ.Math.Vector3} This vector object
     */
    sub(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      this.x -= vector.x;
      this.y -= vector.y;
      this.z -= vector.z;
      return this;
    }

    /**
     * Multiply another vector's components to this vector's components
     * @param {JJ.Math.Vector3} vector - The vector to use for component wise multiplication
     * @return {JJ.Math.Vector3} This vector object
     */
    mul(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      this.x *= vector.x;
      this.y *= vector.y;
      this.z *= vector.z;
      return this;
    }

    /**
     * Divide another vector's components to this vector's components
     * @param {JJ.Math.Vector3} vector - The vector to use for component wise division
     * @return {JJ.Math.Vector3} This vector object
     */
    div(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      this.x /= vector.x;
      this.y /= vector.y;
      this.z /= vector.z;
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
     * @param {JJ.Math.Vector3} vector - The vector to use for the dot product with this vector
     * @return {Number} The result of the dot product between this vector and the passed vector
     */
    dot(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
    }

    /**
     * Returns the cross product of this vector and the passed vector
     * @param {JJ.Math.Vector3} vector - The vector to use for the cross product with this vector (this x vector)
     * @return {JJ.Math.Vector3} A new vector that is the result of the cross product of this vector with the passed
     *   vector
     */
    cross(vector) {
      JJ.System.assert((vector instanceof Math.Vector3), "Expected Vector3 object.");
      let newVector = new Vector3();
      newVector.x = (this.y * vector.z) - (this.z * vector.y);
      newVector.y = (this.z * vector.x) - (this.x * vector.z);
      newVector.z = (this.x * vector.y) - (this.y * vector.x);
      return newVector;
    }

    /**
     * Returns true if the vector is a normalized unit vector, false if it is not
     * @return {Boolean} True if this vector is normalized (unit length), False if it is not
     */
    isNormalized() {
      const lengthSq = this.lengthSq();
      return JJ.Math.nearlyEqual(lengthSq, 1.0);
    }

    /**
     * Noramalizes the vector's length to convert it to a unit vector in the same direction
     * @return {JJ.Math.Vector3} This vector object
     */
    normalize() {
      // If the length of the vectors is smaller than epsilon, default to the right facing unit vector
      const vectorLength = this.length();
      if (vectorLength < Number.EPSILON) {
        return this.equals(Math.vector3Right);
      }

      // Divide each of the components by the vector's length to generate a unit vector
      return this.scalarDiv(vectorLength);
    }

    /**
     * Creates a copy of this vector that is normalized to a unit vector
     * @return {JJ.Math.Vector3} A new vector that is equal to this vector normalized
     */
    normalizeCopy() {
      let newVector = new Vector3(this);
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
      return "Vector3";
    }

    /**
     * Serializes this object to and from a buffer =
     * @param {Object} serializeContext - The serialization context for the current operations (ex. read or write)
     */
    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.x = JJ.System.Serialization.serialize(serializeContext, this.x, "x");
      this.y = JJ.System.Serialization.serialize(serializeContext, this.y, "y");
      this.z = JJ.System.Serialization.serialize(serializeContext, this.z, "z");
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Math.Vector3);

  // Constants
  Math.vector3Right = new Math.Vector3(1.0, 0.0, 0.0);
  Math.vector3Up = new Math.Vector3(0.0, 1.0, 0.0);
  Math.vector3Forward = new Math.Vector3(0.0, 0.0, 1.0);

}(window.JJ.Math = window.JJ.Math || {}));
}(window.JJ = window.JJ || {}));