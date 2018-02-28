import Serializable from "./serializable.js";

import assert from "../../system/assert.js";

/**
 * A manager class that maintains a map of registered Serializable Types.
 *
 * The Serialize Type map is used to store type info necessary to restore serialized data into full fledged objects,
 * which cannot be deduced by normal means
 *
 */
class SerializableTypeManager {
  private serializationTypeMap: Map<string, typeof Serializable>;

  /**
   * Construct a new serialization manager
   */
  constructor() {
    this.serializationTypeMap = new Map<string, typeof Serializable>();
  }

  /**
   * Register a Serializable Type with the manager
   * @param {typeof Serializable} serializableType - The serializable type to be registered
   * @return {boolean} True if the type was successfully registers, False if there was an error
   */
  registerType(serializableType) {
    // Get the type ID, and ensure the type ID hasn't already been registered
    const typeId = serializableType.getSerializationId();
    if (!assert((this.getType(typeId) == undefined),
      "Serialization type ID collision with '{0}'.", typeId)) {
      return false;
    }

    // Create a new serialization type info, and add it to the map
    this.serializationTypeMap.set(typeId, serializableType);

    // Return success
    return true;
  }

  /**
   * Returns the Serializable Type for the given ID
   * @param {string} typeId - The type ID string
   * @return {typeof Serializable} The Serializable Type matching the specified ID
   */
  getType(typeId) {
    return this.serializationTypeMap.get(typeId);
  }

  /**
   * Creates an object associated with a specified Serialized Type ID
   * @param {string} typeId - The type ID string
   * @return {object} A new object of type specified by the Serializable Type ID, 
   *                  or {null} if no matching Serializable type was found with the ID
   */
  createObjectFromType(typeId) {
    // Look up the type info
    const type = this.getType(typeId);
    if (!assert((type != undefined),
      "Cannot create object for serializable type '{0}', because no matching type was found.", typeId)) {
      return null;
    }

    // Create a new type and return it
    return new type();
  }

}

let serializableTypeMgr = new SerializableTypeManager();
export default serializableTypeMgr;
