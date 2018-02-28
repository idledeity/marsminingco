import MeshNetworkNode from "../../../../core_libs/containers/graphs/mesh_network/mesh_network_node.js";
import Vector3 from "../../../../core_libs/math/vectors/vector3.js";
import { serializeValue } from "../../../../core_libs/system/serialization/serialization.js"
import SerializationContext from "../../../../core_libs/system/serialization/serialization_context.js";
import serializableTypeMgr from "../../../../core_libs/system/serialization/serializable_type_manager.js";

/**
 * The NavNetworkNode class represents a node in the NavMeshNetwork.
 * @extends MeshNetworkNode
 */
export default class NavNetworkNode extends MeshNetworkNode {
  private worldPos: Vector3;  // Position of the navigation node in world space
  
  /**
   * Constructor
   * @param {Vector3} worldPos - The world position of the nav network node in world space
   */
  constructor(worldPos: Vector3) {
    // Call the super
    super();

    // Store a copy of the world position
    if (worldPos != undefined) {
      this.setWorldPos(worldPos);   
    } else {
      this.setWorldPos(Vector3.ZERO);
    }
    
  }

  /**
   * Returns the world position of the navigation node
   * @return {Vector3} The world position of the navigation node in world space
   */
  getWorldPos() {
    return this.worldPos.copy();
  }

  /**
   * Sets the world position of the navigation node
   * @param {Vector3} newPos - The new world position of the navigation node in world space
   */
  setWorldPos(newPos: Vector3) {
    this.worldPos = newPos.copy();
  }

  //
  // Serializable methods
  //

  /**
   * Returns the serialization ID for the object
   * @return {string} Unique serialization ID for this class
   */
  static getSerializationId() {
    return "NavNetworkNode";
  }

  /**
   * Serializes this object to and from a buffer
   * @param {SerializationContextObject} context - The serialization context for the current operations
   */
  serialize(context: SerializationContext) {
    super.serialize(context);

    this.worldPos = serializeValue(context, "worldPos", this.worldPos);
  }
}

// Register this serializable type with the serialization type manager
serializableTypeMgr.registerType(NavNetworkNode);
