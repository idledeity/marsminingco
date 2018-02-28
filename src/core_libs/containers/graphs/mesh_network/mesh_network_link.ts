import MeshNetworkNode from "./mesh_network_node.js";
import MeshNetwork from "./mesh_network.js";

import assert from "../../../../core_libs/system/assert.js";
import Serializable from "../../../../core_libs/system/serialization/serializable.js";
import serializableTypeMgr from "../../../../core_libs/system/serialization/serializable_type_manager.js";
import { serializeValue } from "../../../../core_libs/system/serialization/serialization.js";
import SerializationContext from "../../../../core_libs/system/serialization/serialization_context";

/*
  * Stores the link information from one MeshNetworkNode to another MeshNetworkNode
  * @extends Serializable
  */
export default class MeshNetworkLink extends Serializable {
  // Members
  private sourceNodeId: number;
  private destNodeId: number;
  private parentMeshNetwork: MeshNetwork;
  private linkWeight: any;

  /**
   * Creates a new MeshNetworkLink
   */
  constructor() {
    super();

    // Invalidate the source and destination node ids
    this.sourceNodeId = MeshNetworkNode.INVALID_ID;
    this.destNodeId = MeshNetworkNode.INVALID_ID;
    this.parentMeshNetwork = null;
  }

  /**
   * Get the source node's ID
   * @return {number} Returns the link's source node ID
   */
  getSourceNodeId() {
    return this.sourceNodeId;
  }

  /**
   * Sets source node ID for this link
   * @param {number} nodeId - ID of the source node
   */
  setSourceNodeId(nodeId: number) {
    this.sourceNodeId = nodeId;
  }

  /**
   * Returns the link's destination node ID
   * @return {number} Returns the link's destination node ID
   */
  getDestNodeId() {
    return this.destNodeId;
  }

  /**
   * Sets the destination node ID for this link
   * @param {number} nodeId  ID of the destination node
   */
  setDestNodeId(nodeId: number) {
    this.destNodeId = nodeId;
  }

  /**
   * Returns the weight of the link
   * @return {any} Returns the weight of the link
   */
  getLinkWeight() : any {
    return this.linkWeight;
  }

  /**
   * Sets the weight of the link
   * @param {any} linkWeight - weight of the link
   */
  setLinkWeight(linkWeight : any) {
    this.linkWeight = linkWeight;
  }

  /**
   * Return the parent mesh network this link belongs to
   * @return {MeshNetwork} Returns the parent mesh network for the link
   */
  getParentMeshNetwork() {
    return this.parentMeshNetwork;
  }

  /**
   * Set the parent mesh network the link belongs to
   * @param {MeshNetwork} meshNetwork - The parent mesh network that owns this link
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
    return "MeshNetworkLink";
  }

  /**
   * Serializes this object to and from a buffer =
   * @param {SerializationContext} context - The serialization context managing the buffer
   */
  serialize(context: SerializationContext) {
    super.serialize(context);

    // Serialize the source and destination node indexes
    if (context.isRead) {
      // Just store the index in the ID for now since we don't have a reference to the network.
      // We will do the conversion during the post serialize read step
      this.sourceNodeId = serializeValue(context, "sourceNodeIndex", this.sourceNodeId);
      this.destNodeId = serializeValue(context, "destNodeIndex", this.destNodeId);
    } else {
      assert((this.parentMeshNetwork != null),
        "Serializing out a Mesh Network Link with no parent mesh network.");

      // Convert the node IDs into indexes before writting to the serialization buffer
      const sourceNodeIndex = ((this.parentMeshNetwork != null) ?
        this.parentMeshNetwork.getNodeIndexFromId(this.sourceNodeId) : this.sourceNodeId);
      const destNodeIndex = ((this.parentMeshNetwork != null) ?
        this.parentMeshNetwork.getNodeIndexFromId(this.destNodeId) : this.destNodeId);

      // Serialize out the node indexes
      serializeValue(context, "sourceNodeIndex", sourceNodeIndex);
      serializeValue(context, "destNodeIndex", destNodeIndex);
    }

    // Serialize the rest of the link data
    this.linkWeight = serializeValue(context, "weight", this.linkWeight);
  }

  /**
   * Function called after the entire object hierarchy has been read during a serialization for any post processing
   */
  postSerializeRead() {
    if (!assert((this.parentMeshNetwork != null),
        "Serializing in a Mesh Network Link with no parent mesh network.")) {
      return;
    }

    // Update the source and destination node ID's now that the parent mesh network is valid
    let sourceNode = this.parentMeshNetwork.getNodeByIndex(this.sourceNodeId);
    if (assert((sourceNode != null), "Failed to locate mesh network link source node.")) {
      this.setSourceNodeId(sourceNode.getId());
    }
    let destNode = this.parentMeshNetwork.getNodeByIndex(this.destNodeId);
    if (assert((destNode != null), "Failed to locate mesh network link source node.")) {
      this.setDestNodeId(destNode.getId());
    }
  }
}

// Register this serializable type with the serialization type manager
serializableTypeMgr.registerType(MeshNetworkLink);
