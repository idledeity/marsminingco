(function (JJ, undefined) { /* JJ module namespace */
  "use strict";

(function(System, undefined) { /* System submodule namespace */
(function(Serialization, undefined) { /* Serialization submodule namespace */

  // Defines an interface for custom objects that have special serialization needs, either to filter/strip data that
  // shouldn't be serialized or to handle circular references and any other custom serialization needs.
  //
  Serialization.Serializable = class Serializable {
    constructor() {
      // Do a quick check to ensure that the type has been registered
      JJ.System.assert((JJ.System.Serialization.serializableTypeMgr.getType(this.constructor.getSerializationId()) != null),
        "Serializable object instantiated without its serialization type ({0}) registered with serialization manager.\n\
        Call 'JJ.System.Serialization.serializableTypeMgr.registerType()'' to register a serializable type on init.",
        this.constructor.getSerializationId());
    }

    // Returns the serializaiton ID (string) for the object type, which must be unique
    //
    static getSerializationId() {
      JJ.System.assert(false, "Serializable objects must implement their own getSerializationId override, type: {0}!",
        this.name);
      return "<Unknown>";
    }

    // Handles serializing the object to (write) and from (read) the buffer JS object in the serializeContext
    //
    serialize(serializeContext) {
      // Serialize the type ID so we know which object to create when reading
      Serialization.serialize(serializeContext, this.constructor.getSerializationId(), "_SerializedType");
    }

    // Called after the entire object has been serialized during a read for serializables needing further processing
    //
    postSerializeRead() {
      // No default behavior
    }

  }

}(window.JJ.System.Serialization = window.JJ.System.Serialization || {}));
}(window.JJ.System = window.JJ.System || {}));
}(window.JJ = window.JJ || {}));