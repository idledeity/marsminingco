import serializableTypeMgr from "./serializable_type_manager.js";
import { serializeValue } from "./serialization.js";
import SerializationContext from "./serialization_context.js"

import assert from "../../system/assert.js";

/**
 * Defines an interface for custom objects that have special serialization needs, either to filter/strip data that
 * shouldn't be serialized or to handle circular references and any other custom serialization needs.
 */
export default class Serializable {
  /**
   * Construct a new Serializable
   */
  constructor() {
    // Do a quick check to ensure that the type has been registered
    let serializationId = (this.constructor as typeof Serializable).getSerializationId();
    assert((serializableTypeMgr.getType(serializationId) != null),
      "Serializable object instantiated without its serialization type ({0}) registered with serialization manager.\n\
      Call 'serializableTypeMgr.registerType()'' to register a serializable type on init.",
      serializationId);
  }

  /**
   * Returns the serialization ID for the object
   * @return {string} Unique serialization ID for this class
   */
  static getSerializationId() {
    assert(false, "Serializable objects must implement their own getSerializationId override, type: {0}!", (<any>this).constructor.name);
    return "<Unknown>";
  }

  /**
   * Serializes this object to and from a buffer =
   * @param {SerializationContext} context - The serialization context for the current operation
   */
  serialize(context: SerializationContext) {
    // Serialize the type ID so we know which object to create when reading
    serializeValue(context, "_SerializedType", (this.constructor as typeof Serializable).getSerializationId());
  }

  /**
   * Function called after the entire object hierarchy has been read during a serialization for any post processing
   */
  postSerializeRead() {
    // No default behavior
  }
}
