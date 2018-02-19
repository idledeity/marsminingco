(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(System, undefined) { /* System submodule namespace */
(function(Serialization, undefined) { /* Serialization submodule namespace */

  /**
   * A manager class that maintains a map of registered Serializable Types.
   *
   * The Serialize Type map is used to store type info necessary to restore serialized data into full fledged objects,
   * which cannot be deduced by normal means
   *
   */
  class SerializableTypeManager {
    /**
     * Construct a new serialization manager
     */
    constructor() {
      this.serializationTypeMap = {}; // a map of Serializable Type infos, keyed by the Serialization ID
    }

    /**
     * Register a Serializable Type with the manager
     * @param {JJ.System.Serialization.Serializable} newType - The serializable type to be registered
     * @return {Boolean} True if the type was successfully registers, False if there was an error
     */
    registerType(newType) {
      // Get the type ID, and ensure the type ID hasn't already been registered
      const typeId = newType.getSerializationId();
      if (!JJ.System.assert((this.getType(typeId) == undefined),
        "Serialization type ID collision with '{0}'.", typeId)) {
        return false;
      }

      // Create a new serialization type info, and add it to the map
      this.serializationTypeMap[typeId] = newType;

      // Return success
      return true;
    }

    /**
     * Returns the Serializable Type for the given ID
     * @param {String} typeId - The type ID string
     * @return {JJ.System.Serialization.Serializable} The Serializable Type matching the specified ID
     */
    getType(typeId) {
      return this.serializationTypeMap[typeId];
    }

    /**
     * Creates an object associated with a specified Serialized Type ID
     * @param {String} typeId - The type ID string
     * @return {Object} A new object of type specified by the Serializable Type ID
     */
    createObjectFromType(typeId) {
      // Look up the type info
      const type = this.getType(typeId);
      if (!JJ.System.assert((type != undefined),
        "Cannot create object for serializable type '{0}', because no matching type was found.", typeId)) {
        return null;
      }

      // Create a new type and return it
      return new type();
    }

  }

  JJ.System.Serialization.serializableTypeMgr = new SerializableTypeManager();


}(window.JJ.System.Serialization = window.JJ.System.Serialization || {}));
}(window.JJ.System = window.JJ.System || {}));
}(window.JJ = window.JJ || {}));