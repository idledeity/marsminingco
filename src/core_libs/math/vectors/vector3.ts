import { nearlyEqual, SMALL_NUMBER } from "../../math/number.js";

import Serializable from "../../../core_libs/system/serialization/serializable.js";
import serializableTypeMgr from "../../../core_libs/system/serialization/serializable_type_manager.js";
import { serializeValue } from "../../../core_libs/system/serialization/serialization.js";
import SerializationContext from "../../../core_libs/system/serialization/serialization_context.js";

/**
 * A simple 3D vector class
 * @extends Serializable
 */
export default class Vector3 extends Serializable {
  public x: number;
  public y: number;
  public z: number;

  // Register this serializable type with the serialization type manager
  private static readonly registered = serializableTypeMgr.registerType(Vector3);

  // Constants
  public static readonly ZERO = new Vector3(0.0, 0.0, 0.0);
  public static readonly RIGHT = new Vector3(1.0, 0.0, 0.0);
  public static readonly UP = new Vector3(0.0, 1.0, 0.0);
  public static readonly FORWARD = new Vector3(0.0, 0.0, 1.0);

  /**
   * Create a new Vector3
   */
  constructor(vector: Vector3);
  constructor(x: number, y: number, z: number);
  constructor(fill?: number);
  constructor() {
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
   * @param {number} x - The X component of the vector
   * @param {number} y - The Y component of the vector
   * @param {number} z - The Z component of the vector
   * @return {Vector3} This vector object
   */
  setComponents(x: number, y?:number, z?:number) {
      this.x = x;
      this.y = (y !== undefined ? y : x);
      this.z = (z !== undefined ? z : x);
      return this;
  }

  /**
   * Set this vector to equal the passed vector
   * @param {Vector3} vector - The vector to set this vector to
   * @return {Vector3} This vector object
   */
  set(vector: Vector3) {
    return this.setComponents(vector.x, vector.y, vector.z);
  }

  /**
   * Set this vector to equal the passed vector
   * @param {Vector3} vector - The vector to assign to this vector
   * @return {Vector3} This vector object
   */
  equals(vector: Vector3) {
    return this.set(vector);
  }

  /**
   * Returns a copy of this vector
   * @return {Vector3} A new vector object that is a copy of this vector
   */
  copy() {
    return new Vector3(this);
  }

  /**
   * Zeros the vector components
   * @return {Vector3} This vectoor object
   */
  zero() {
    return this.setComponents(0.0, 0.0, 0.0);
  }

  /**
   * Multiply this vector's components by a scalar value
   * @param {number} value - The scalar value to multiply this vector by
   * @return {Vector3} This vector object
   */
  scalarMul(value: number) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  /**
   * Divide this vector's components by a scalar value
   * @param {number} value - The scalar value to divide this vector by
   * @return {Vector3} This vector object
   */
  scalarDiv(value: number) {
    this.x /= value;
    this.y /= value;
    this.z /= value;
    return this;
  }

  /**
   * Add another vector's components to this vector's components
   * @param {Vector3} vector - The vector to add to this vector
   * @return {Vector3} This vector object
   */
  add(vector: Vector3) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  /**
   * Subtract another vector's components to this vector's components
   * @param {Vector3} vector - The vector to subtract from this vector
   * @return {Vector3} This vector object
   */
  sub(vector: Vector3) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }

  /**
   * Multiply another vector's components to this vector's components
   * @param {Vector3} vector - The vector to use for component wise multiplication
   * @return {Vector3} This vector object
   */
  mul(vector: Vector3) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
  }

  /**
   * Divide another vector's components to this vector's components
   * @param {Vector3} vector - The vector to use for component wise division
   * @return {Vector3} This vector object
   */
  div(vector: Vector3) {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;
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
   * @param {Vector3} vector - The vector to use for the dot product with this vector
   * @return {number} The result of the dot product between this vector and the passed vector
   */
  dot(vector: Vector3) {
    return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
  }

  /**
   * Returns the cross product of this vector and the passed vector
   * @param {Vector3} vector - The vector to use for the cross product with this vector (this x vector)
   * @return {Vector3} A new vector that is the result of the cross product of this vector with the passed
   *   vector
   */
  cross(vector: Vector3) {
    let newVector = new Vector3();
    newVector.x = (this.y * vector.z) - (this.z * vector.y);
    newVector.y = (this.z * vector.x) - (this.x * vector.z);
    newVector.z = (this.x * vector.y) - (this.y * vector.x);
    return newVector;
  }

  /**
   * Returns true if the vector is a normalized unit vector, false if it is not
   * @return {boolean} True if this vector is normalized (unit length), False if it is not
   */
  isNormalized() {
    const lengthSq = this.lengthSq();
    return nearlyEqual(lengthSq, 1.0);
  }

  /**
   * Noramalizes the vector's length to convert it to a unit vector in the same direction
   * @return {Vector3} This vector object
   */
  normalize() {
    // If the length of the vectors is smaller than epsilon, default to the right facing unit vector
    const vectorLength = this.length();
    if (vectorLength < SMALL_NUMBER) {
      return this.equals(Vector3.RIGHT);
    }

    // Divide each of the components by the vector's length to generate a unit vector
    return this.scalarDiv(vectorLength);
  }

  /**
   * Creates a copy of this vector that is normalized to a unit vector
   * @return {Vector3} A new vector that is equal to this vector normalized
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
   * @return {string} Unique serialization ID for this class
   */
  static getSerializationId() {
    return "Vector3";
  }

  /**
   * Serializes this object to and from a buffer =
   * @param {SerializationContext} context - The serialization context for the current operations (ex. read or write)
   */
  serialize(context) {
    super.serialize(context);

    this.x = serializeValue(context, "x", this.x);
    this.y = serializeValue(context, "y", this.y);
    this.z = serializeValue(context, "z", this.z);
  }
}
