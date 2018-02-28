import NavNetworkNode from "./nav_network_node.js";

import MeshNetwork from "../../../../core_libs/containers/graphs/mesh_network/mesh_network.js";
import MeshNetworkNode from "../../../../core_libs/containers/graphs/mesh_network/mesh_network_node.js";
import assert from "../../../../core_libs/system/assert.js";
import SerializationContext from "../../../../core_libs/system/serialization/serialization_context.js";
import serializableTypeMgr from "../../../../core_libs/system/serialization/serializable_type_manager.js";

/**
 * The NavNetwork is a network of interconnected nodes representing world locations accessible by navigation.
 *
 * Each accessible locations contains a list of links to other nodes in the network, which can be used to navigate
 * through the entirety of the network.
 * @extends MeshNetwork
 */
export default class NavNetwork extends MeshNetwork {
  /**
   * Constructor
   */
  constructor() {
    // Call the super
    super();
  }

  /**
   * Adds a node to the MeshNetwork
   * @param {NavNetworkNode} node - The new NavNetworkNode to add to the network
   * @returns {number} The node ID of teh inserted node, or MeshNetworkNode.INVALID_ID if the insert failed
   */
  addNode(node: NavNetworkNode) {
    return super.addNode(node);
  }

  /**
   * Link two nodes in the nav network
   * @param {number} sourceId - ID of the source node of the link
   * @param {number} destId - ID of the destination node of the link
   * @param {number} [weight=distance between source and dest] - Weight of traversing the link from the source to the
   *    destination nodes
   * @return {boolean} True if the nodes were linked successfull, False if there was an error
   */
  linkNode(sourceId: number, destId: number, weight?: number) {
    // Get the source node, and check that it's valid
    let sourceNode = this.getNodeById(sourceId);
    if (!assert((sourceNode != null), "sourceNode is not valid.")) {
      return false;
    }

    // Get the destination node, and check that it's valid
    let destNode = this.getNodeById(destId);
    if (!assert((destNode != null), "destNode is not valid.")) {
      return false;
    }

    // If no weight was specified, calculate the weight between the nodes by using the distance between them
    if (weight == undefined) {
      weight = (destNode as NavNetworkNode).getWorldPos().sub((sourceNode as NavNetworkNode).getWorldPos()).length();
    }

    // Call the super to do the work of creating the nav mesh link
    return super.linkNode(sourceId, destId, weight);
  }

  /** Link two nodes in the nav network
   * @param {number} sourceId - ID of the source node of the link
   * @param {number} destID - ID of the destination node of the link
   * @param {boolean} biDirectional - Set to true to make a link between the source and destination nodes in both directions
   * @param {number} [weight=distance between source and dest] - Weight of traversing the link from the source to the
   *    destination nodes
   * @param {number} [reverseWeight=weight]: Weight of the reverse link (only used for biDirectional links)
   * @return {Boolean} True if the nodes were linked successfully, False if there was an error
   */
  linkNodes(sourceId: number, destId: number, biDirectional: boolean, weight?: number, reverseWeight?: number) {
    // Get the source node, and check that it's valid
    let sourceNode = this.getNodeById(sourceId);
    if (!assert((sourceNode != null), "sourceNode is not valid.")) {
      return false;
    }

    // Get the destination node, and check that it's valid
    let destNode = this.getNodeById(destId);
    if (!assert((destNode != null), "destNode is not valid.")) {
      return false;
    }

    // If no weight was specified, calculate the weight between the nodes by using the distance between them
    if (weight == undefined) {
      weight = (destNode as NavNetworkNode).getWorldPos().sub((sourceNode as NavNetworkNode).getWorldPos()).length();
    }
    // If no reverse weight was specified, use the forward weight
    if (reverseWeight == undefined) {
      reverseWeight = weight;
    }

    // Call the super to do the work of creating the nav mesh links
    return super.linkNodes(sourceId, destId, biDirectional, weight, reverseWeight);
  }

  /**
   * Performs an A* search through the Nav Network to find an optimized (but not necessarily the shortest) path
   * from the source mesh network node to the destination.
   * @param {number} sourceId - ID of the source node in the Mesh Network
   * @param {number} destId - ID of the destination ndde in the Mesh Network
   * @return {[boolean, number[]]} Returns an array of nodeId's the consitute the solved path
   */
  findPath(sourceId, destId): [boolean, number[]] {
    let heuristic = function(sourceNode, destNode) {
      const weight = destNode.getWorldPos().copy().sub(sourceNode.getWorldPos()).length();
      return weight;
    }

    return super.findPath(sourceId, destId, heuristic);
  }

  //
  // Serializable methods
  //

  /**
   * Returns the serialization ID for the object
   * @return {string} Unique serialization ID for this class
   */
  static getSerializationId() {
    return "NavNetwork";
  }

  /**
   * Serializes this object to and from a buffer
   * @param {SerializationContext} context - The serialization context for the current operation
   */
  serialize(context: SerializationContext) {
    super.serialize(context);
  }
}

// Register this serializable type with the serialization type manager
serializableTypeMgr.registerType(NavNetwork);
