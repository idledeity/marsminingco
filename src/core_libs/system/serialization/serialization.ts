import Serializable from "./serializable.js";
import serializableTypeMgr from "./serializable_type_manager.js";
import SerializationContext from "./serialization_context.js";

import assert from "../../system/assert.js";

/**
 * Function called to serialize a JS object to (write) and from (read) an intermediary serialization JS buffer object.
 *
 * This function is used to serialize complex JS objects to (and from) a simplified "serialized" buffer object,
 * that can be used with with JSON.stringify() and JSON.parse() or for other cases where a 'minimized' representation
 * of an object's state is required.
 *
 * @param {SerializationContext} serializationContext - The current serialization context
 * @param {string} propertyKey - Property key of the value be serialized
 * @param {any} value - The value to be serialized
 * @return {any} The value that was serialized
 */
export function serializeValue(serializationContext, propertyKey, value) {
  let returnValue = value;

  // Check if serialization is reading or writing to the buffer object
  if (serializationContext.isRead) {
    //
    // Reading from the buffer object
    //

    // Look up the property by the passed string
    const propertyObj = ((propertyKey !== undefined) ?
      serializationContext.bufferObj[propertyKey] : serializationContext.bufferObj);
    if (!assert((propertyObj != undefined), "Failed to parse property '{0}'.", propertyKey)) {
      return undefined;
    }

    // Create a new context so we can move the bufferObj to the child property without affecting our reference
    let newContext = new SerializationContext(serializationContext.isRead, propertyObj);

    // Check if the property being serialized is an array
    if (Array.isArray(propertyObj)) {
      // Set the return value to an empty array
      returnValue = [];

      // Iterate over all of the array elements and serialize them
      for (let arrayIndex = 0; arrayIndex < propertyObj.length; arrayIndex++) {
        // Serialize the element, and push it into the array
        let element = serializeValue(newContext, arrayIndex, {});
        returnValue.push(element);
      }

    } else {
      // Check if the property being serialized is an object
      if (typeof propertyObj === "object") {
        // Check if the property has a serializable type field
        const propertySerializedType = propertyObj["_SerializedType"];
        if (propertySerializedType != undefined) {
          // Attempt to create a new object for the serialized type
          let newObject = serializableTypeMgr.createObjectFromType(propertySerializedType);
          if (!assert((newObject != null),
            "Failed to create new object for serialization type '{0}'.", propertySerializedType)) {
            return undefined;
          }

          // Let the new object handle the serialization internally
          newObject.serialize(newContext);
          returnValue = newObject;
        } else {
          // Set the return value to a blank object
          returnValue = {};

          // Iterate over all of the object's properties, and serialize each one
          for (let key in propertyObj) {
            // If the propertyObj doesn't have it's own property for this key, skip it
            if (!propertyObj.hasOwnProperty(key)) {
              continue;
            }

            // Serialize the key
            returnValue[key] = serializeValue(newContext, key, propertyObj[key]);
          }
        }
      } else {
        // If there is now serialized type field, this is a plain JS object, and we can just assign it to the value
        returnValue = propertyObj;
      }
    }
  } else {
    //
    // Writing to the buffer object
    //

    // Start wth an empty object to hold the serialized data
    let serializedObject = {}

    // Check if the value being serialized is an array
    if (Array.isArray(value)) {
      // Create an empty array at the specified property key, that we can write to
      serializedObject = [];

      // Iterate over all of the array elements and serialize them
      for (let arrayIndex = 0; arrayIndex < value.length; arrayIndex++) {
        // Serialize the element into a dummy object
        let elementContext = new SerializationContext(serializationContext.isRead);
        serializeValue(elementContext, "_element", value[arrayIndex]);

        // Grab the serialized data from the dummy object and push it into the array
        (serializedObject as any[]).push(elementContext.bufferObj["_element"]);
      }
    } else {
      // Create an empty object at the specified property key that we can write to and a new context
      serializedObject = {};
      let newContext = new SerializationContext(serializationContext.isRead, serializedObject);

      if (typeof value === "object") {
        // If the object in the value field is serializable, serialize it now
        if (value instanceof Serializable) {
          // Let the value serialize itself
          value.serialize(newContext);
        } else {
          // Iterate over all of the object's properties, and serialize each one
          for (let key in value) {
            // If the value doesn't have it's own property for this key, skip it
            if (!value.hasOwnProperty(key)) {
              continue;
            }

            // Skip function values
            if (typeof value[key] === "function") {
              continue;
            }

            // Serialize the key
            serializeValue(newContext, key, value[key]);
          }
        }
      } else {
        // Just write the value to a new buffer object
        serializedObject = value;
      }
    }

    if (propertyKey !== undefined) {
      serializationContext.bufferObj[propertyKey] = serializedObject;
    } else {
      serializationContext.bufferObj = serializedObject;
    }
  }

  // Always return the value
  return returnValue;
}

/**
 * Writes the passed object into a serialized buffer that is returned
 * @param {Object} object - The object to be serialized
 * @return {Object} The serialized version of the passed object
 */
export function writeObject(object) {
  // Setup the serialization context
  let serializationContext = new SerializationContext(false);

  // Write the object using the unified serialize function
  serializeValue(serializationContext, undefined, object);
  return serializationContext.bufferObj;
}

/**
 * Reads a serialization buffer to generate an object that is returned
 * @param {Object} buffer - The buffer to store the serialized object
 * @return {Object} The serialized object
 */
export function readObject(buffer) {
  // Setup the serialization context
  let serializationContext = new SerializationContext(true, buffer);

  // Read the object using the unified serialize function
  let serializedObject = serializeValue(serializationContext, undefined, {});

  // Call post serialize read on the new object so it can "fix-up" any serializable fields after the read is complete
  postSerializeRead(serializedObject);

  // Return the serialized object
  return serializedObject;
}

/**
 * Recursive function that traverses an object and all it's children calling, the postSerializeRead function on any
 * serializable children
 * @param {Object} object - The object that was just serialized
 */
function postSerializeRead(object) {
  // Create a set to store visited objects (the object is not a serialized buffer, so circular references are allowed)
  let visitedObjects = new Set();

  // Internal function to handle the recursive traversal
  function postSerializeReadInternal(object) {
    // Handle any child objects or properties first
    if (Array.isArray(object)) {
      // Iterate over all of the array elements, calling postSerializeReadInternal on each
      for (let arrayIndex = 0; arrayIndex < object.length; arrayIndex++) {
        postSerializeReadInternal(object[arrayIndex]);
      }
    } else if (typeof object === "object") {
      // Ensure the object hasn't already been visited
      if (visitedObjects.has(object)) {
        return;
      }

      // Insert the object into the set of visitied objects
      if (typeof object === "object") {
        visitedObjects.add(object);
      }

      // Iterate over all of the object's properties, and process each one for any serializables
      for (let key in object) {
        // If the object doesn't have it's own property for this key, skip it
        if (!object.hasOwnProperty(key)) {
          continue;
        }

        // Skip function values
        if (typeof object[key] === "function") {
          continue;
        }

        // Process the object property for any serializables that need to have postSerializeRead() called on them
        postSerializeReadInternal(object[key]);
      }
    }

    // Check if the object has a "postSerializeRead" method and run it
    if (object instanceof Serializable) {
      object.postSerializeRead();
    }
  }

  // Call the internal function to recursively handle calling post serialization read on all the object's children
  postSerializeReadInternal(object);
}
