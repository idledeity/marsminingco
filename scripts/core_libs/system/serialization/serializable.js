(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(System, undefined) { /* System submodule namespace */
(function(Serialization, undefined) { /* Serialization submodule namespace */

  /**
   * Defines an interface for custom objects that have special serialization needs, either to filter/strip data that
   * shouldn't be serialized or to handle circular references and any other custom serialization needs.
   */
  JJ.System.Serialization.Serializable = class Serializable {
    /**
     * Construct a new Serializable
     */
    constructor() {
      // Do a quick check to ensure that the type has been registered
      JJ.System.assert((JJ.System.Serialization.serializableTypeMgr.getType(this.constructor.getSerializationId()) != null),
        "Serializable object instantiated without its serialization type ({0}) registered with serialization manager.\n\
        Call 'JJ.System.Serialization.serializableTypeMgr.registerType()'' to register a serializable type on init.",
        this.constructor.getSerializationId());
    }

    /**
     * Returns the serialization ID for the object
     * @return {String} Unique serialization ID for this class
     */
    static getSerializationId() {
      JJ.System.assert(false, "Serializable objects must implement their own getSerializationId override, type: {0}!",
        this.name);
      return "<Unknown>";
    }

    /**
     * Serializes this object to and from a buffer =
     * @param {Object} serializeContext - The serialization context for the current operations (ex. read or write)
     */
    serialize(serializeContext) {
      // Serialize the type ID so we know which object to create when reading
      Serialization.serialize(serializeContext, this.constructor.getSerializationId(), "_SerializedType");
    }

    /**
     * Function called after the entire object hierarchy has been read during a serialization for any post processing
     */
    postSerializeRead() {
      // No default behavior
    }

  }

}(window.JJ.System.Serialization = window.JJ.System.Serialization || {}));
}(window.JJ.System = window.JJ.System || {}));
}(window.JJ = window.JJ || {}));