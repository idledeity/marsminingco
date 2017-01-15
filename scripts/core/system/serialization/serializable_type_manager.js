(function (JJ, undefined) { /* JJ module namespace */
  "use strict";

(function(System, undefined) { /* System submodule namespace */
(function(Serialization, undefined) { /* Serialization submodule namespace */

  // The SerializedTypeManager class is a simple class that maintains a map of registered Serialized Types.
  //
  // The Serialize Type map is used to store type info necessary to restore serialized data into full fledged objects,
  // which cannot be deduced by normal means
  //
  class SerializableTypeManager {
    constructor() {
      this.serializationTypeMap = {}; // a map of Serializable Type infos, keyed by the Serialization ID
    }

    // Register a Serializable Type with the manager
    //
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

    // Returns the Serializable Type for the given ID
    //
    getType(typeId) {
      return this.serializationTypeMap[typeId];
    }

    // Creates an object associated with a specified Serialized Type ID
    //
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

  // The global serializable type manager
  Serialization.serializableTypeMgr = new SerializableTypeManager();


}(window.JJ.System.Serialization = window.JJ.System.Serialization || {}));
}(window.JJ.System = window.JJ.System || {}));
}(window.JJ = window.JJ || {}));