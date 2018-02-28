import { nearlyEqual, SMALL_NUMBER } from "../../math/number.js";

import Serializable from "../../../core_libs/system/serialization/serializable.js";
import serializableTypeMgr from "../../../core_libs/system/serialization/serializable_type_manager.js";
import { serializeValue } from "../../../core_libs/system/serialization/serialization.js";
import SerializationContext from "../../../core_libs/system/serialization/serialization_context.js";

/**
 * A simple 2D vector class
 * @extends Serializable
 */
export default class Vector2 extends Serializable {
  public x: number;
  public y: number;

  // Register this serializable type with the serialization type manager
  private static readonly registered = serializableTypeMgr.registerType(Vector2);

  // Constants
  public static readonly ZERO = new Vector2(0.0, 0.0);
  public static readonly RIGHT = new Vector2(1.0, 0.0);
  public static readonly UP = new Vector2(0.0, 1.0);

  /**
  * Create a new Vector2
  */
  constructor(vector: Vector2);
  constructor(x: number, y: number);
  constructor(fill?: number);
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
   * @param {number} x - The X component
   * @param {number} y - The Y component
   * @return {Vector2} This Vector2 object
   */
  setComponents(x: number, y?: number) {
      this.x = x;
      this.y = (y !== undefined ? y : x);
      return this;
  }

  /**
   * Set this vector to equal the passed vector
   * @param {Vector2} vector - The vector to set this vector to
   * @return {Vector2} This Vector2 object
   */
  set(vector: Vector2) {
    return this.setComponents(vector.x, vector.y);
  }

  /**
   * Set this vector to equal the passed vector
   * @param {Vector2} vector - The vector to set this vector to
   * @return {Vector2} This Vector2 object
   */
  equals(vector: Vector2) {
    return this.set(vector);
  }

  /**
   * Returns a copy of this vector
   * @return {Vector2} A new Vector2 object that is a copy of this vector
   */
  copy() {
    return new Vector2(this);
  }

  /** Zeros the vector components
   * @return {Vector2} This Vector2 object
   */
  zero() {
    return this.setComponents(0.0, 0.0);
  }

  /**
   * Multiply this vector's components by a scalar value
   * @param {number} value - The scalar value to multiply this vector by
   * @return {Vector2} This Vector2 object
   */
  scalarMul(value: number) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  /**
   * Divide this vector's components by a scalar value
   * @param {number} value - The scalar balue to divide this vector by
   * @return {Vector2} This Vector2 object
   */
  scalarDiv(value: number) {
    this.x /= value;
    this.y /= value;
    return this;
  }

  /**
   * Add another vector's components to this vector's components
   * @param {Vector2} vector - The vector to add to this vector
   * @return {Vector2} This Vector2 object
   */
  add(vector: Vector2) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Subtract another vector's components to this vector's components
   * @param {Vector2} vector - The vector to subtract from this vector
   * @return {Vector2} This Vector2 object
   */
  sub(vector: Vector2) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  // Multiply another vector's components to this vector's components
  mul(vector: Vector2) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  /**
   * Divide this vector's components by another vector's components
   * @param {Vector2} vector - The vector to to use for dividing each of this vector's components
   * @return {Vector2} This Vector2 object
   */
  div(vector: Vector2) {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  }

  /**
   * Returns the length of the vector
   * @return {number} The length of this vector
   */
  length() {
    return Math.sqrt(this.lengthSq());
  }

  /**
   * Returns the squared length of the vector
   * @return {number} The squared length of this vector
   */
  lengthSq() {
    return this.dot(this);
  }

  /**
   * Returns the result of the dot product of this vector with the passed vector
   * @return {number} The dot product of this vector and the passed vector
   */
  dot(vector: Vector2) {
    return (this.x * vector.x) + (this.y * vector.y);
  }

  /**
   * Returns true if the vector is a normalized unit vector, false if it is not
   * @return {boolean} True if this vector is normalized (has unit length), False if it is not
   */
  isNormalized() {
    const lengthSq = this.lengthSq();
    return nearlyEqual(lengthSq, 1.0);
  }

  /**
   * Noramalizes the vector's length to convert it to a unit vector in the same direction
   * @return {Vector2} This vector object
   */
  normalize() {
    // If the length of the vectors is smaller than epsilon, default to the right facing unit vector
    const vectorLength = this.length();
    if (vectorLength < SMALL_NUMBER) {
      this.equals(Vector2.RIGHT);
    }

    // Divide each of the components by the vector's length to generate a unit vector
    return this.scalarDiv(vectorLength);
  }

  /**
   * Creates a copy of this vector that is normalized to a unit vector
   * @return {Vector2} A new Vector2 object that is a normalized copy of this vector
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
   * @return {string} Unique serialization ID for this class
   */
  static getSerializationId() {
    return "Vector2";
  }

  /**
   * Serializes this object to and from a buffer =
   * @param {SerializationContext} context - The serialization context for the current operation
   */
  serialize(context) {
    super.serialize(context);

    this.x = serializeValue(context, "x", this.x);
    this.y = serializeValue(context, "y", this.y);
  }
}
