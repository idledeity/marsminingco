import MeshNetwork from "./mesh_network.js";

import Serializable from "../../../../core_libs/system/serialization/serializable.js";
import serializableTypeMgr from "../../../../core_libs/system/serialization/serializable_type_manager.js";
import SerializationContext from "../../../../core_libs/system/serialization/serialization_context.js";

/**
 * The MeshNetworkNode class represents a node in the MeshNetwork.
 *
 * Each node in the network can be linked to other nodes in the mesh network to form a directed graph.
 * @extends Serializable
 */
export default class MeshNetworkNode extends Serializable {
  // Members
  private nodeId: number;
  private parentMeshNetwork: MeshNetwork;

  // Constants
  public static readonly INVALID_ID = -1;

  // Internal static to keep track of the next node ID to be assigned
  private static nextNodeId = 0;
  
  /**
   * Creates a new MeshNetworkNode
   */
  constructor() {
    super();

    this.nodeId = MeshNetworkNode.nextNodeId++;
    this.parentMeshNetwork = null;
  }

  /**
   * Returns the ID of this node
   * @return {number} The node's ID
   */
  getId() {
    return this.nodeId;
  }

  /**
   * Gets the parent mesh network that "owns" this node
   * @return {MeshNetwork} Parent mesh network that owns this node
   */
  getParentMeshNetwork() {
    return this.parentMeshNetwork;
  }

  /**
   * Set the parent mesh network that "owns" this node
   * @param {MeshNetwork} The parent mesh network that owns this node
   */
  setParentMeshNetwork(meshNetwork: MeshNetwork) {
    this.parentMeshNetwork = meshNetwork;
  }

  //
  // Serializable methods
  //

  /**
   * Returns the serialization ID for the object
   * @return {string} Unique serialization ID for this class
   */
  static getSerializationId() {
    return "MeshNetworkNode";
  }

  /**
   * Serializes this object to and from a buffer =
   * @param {SerializationContext} context - The serialization context for the current operation
   */
  serialize(context) {
    super.serialize(context);
  }
}

// Register this serializable type with the serialization type manager
serializableTypeMgr.registerType(MeshNetworkNode);
