import MeshNetworkNode from "./mesh_network_node.js";
import MeshNetworkLink from "./mesh_network_link.js";

import List from "../../../containers/list.js";

import assert from "../../../../core_libs/system/assert.js";
import Serializable from "../../../../core_libs/system/serialization/serializable.js";
import serializableTypeMgr from "../../../../core_libs/system/serialization/serializable_type_manager.js";
import { serializeValue } from "../../../../core_libs/system/serialization/serialization.js";
import SerializationContext from "../../../../core_libs/system/serialization/serialization_context.js";

/**
 * Class used to store some meta data for each mesh network node in the network
 */
class MeshNetworkNodeInfo {
  // Members
  public nodeIndex: number;
  public nodeLinks: MeshNetworkLink[];

  /**
   * Create a MeshNetworkNodeInfo
   * @param {number} nodeIndex - the node's index within the MeshNetwork
   */
  constructor(nodeIndex: number) {
    this.nodeIndex = nodeIndex;
    this.nodeLinks = [];
  }

  /**
   * Gets the node's index
   * @return {number} Returns the node's index within the MeshNetwork
   */
  getNodeIndex() {
    return this.nodeIndex;
  }

  /**
   * Gets the node's links
   * @return {number} Returns the node's link to other nodes
   */
  getNodeLinks() {
    return this.nodeLinks;
  }

  /**
   * Adds a link to another node
   * @param {MeshNetworkLink} newLink - Link object (MeshNetworkLink)
   * @return {number} Returns the node's index within the MeshNetwork
   */
  addNodeLink(newLink: MeshNetworkLink) {
    // Ensure the connection type is valid
    if (!assert((newLink instanceof MeshNetworkLink),
      "Links must be an instance of MeshNetworkLink")) {
      return false;
    }

    this.nodeLinks.push(newLink);
  }
}

/**
 * Class to represent a graph that consists of a collections of 'nodes' and the directed 'links' from node to node.
 *
 * Each node in the MeshNetwork can be connected to any number of of other nodes via a link, although multiple
 * connections from a source to the same destination are not allowed. Links are all unidirectional, to create a
 * bidirectional link between two nodes A & B, two unidirectional links must be created.
 * @extends Serializable
 */
export default class MeshNetwork extends Serializable {
  // Members
  private networkNodes: MeshNetworkNode[];
  private networkLinks: MeshNetworkLink[];
  private networkNodeInfoMap: Map<number, MeshNetworkNodeInfo>;

  /**
   * Create a MeshNetwork
   */
  constructor() {
    super();

    this.clear();
  }

  /**
   * Removes all nodes from the network
   */
  clear() {
    this.networkNodes = [];    // array of network nodes
    this.networkLinks = [];    // array of network links

    this.networkNodeInfoMap = new Map<number, MeshNetworkNodeInfo>(); // map of network node info, keyed by the node ID
  }
B
  /**
   * Get the number of nodes in the mesh network
   * @return {number} Returns the number of nodes in the mesh network
   */
  getNodeCount() {
    return this.networkNodes.length;
  }

  /**
   * Returns the mesh network node at the specified index
   * NOTE: the index is into the internal array, not the node ID
   * @param {number} index - The index of the node to retrieve
   * @return {MeshNetworkNode} The node at the specified index
   */
  getNodeByIndex(index: number) {
    // Make sure the index is valid
    if (!assert(((index >= 0) && (index < this.networkNodes.length)),
      "The node index is out of bounds.")) {
      return null;
    }

    // Return the node at the requested index
    return this.networkNodes[index];
  }

  /**
   * Returns the node info for the node with the passed node ID
   * @param {number} nodeId - The ID of the node to retrieve
   * @return {MeshNetworkNodeInfo} Info for the specified node ID
   */
  getNodeInfo(nodeId: number) {
    // Check for an invalid node id
    if (nodeId == MeshNetworkNode.INVALID_ID) {
      return null;
    }

    // Look up the node's info in the map
    let nodeInfo = this.networkNodeInfoMap.get(nodeId);
    if (nodeInfo === undefined) {
      return null;
    }

    return nodeInfo;
  }

  /**
   * Get a node's index from it's ID
   * @param {number} nodeId - The ID of the node to get the index of
   * @return {number} Returns the index of a node with the specified ID, or -1 if the node does not exist
   */
  getNodeIndexFromId(nodeId: number) {
    // Retrieve the node info for the passed ID
    const nodeInfo = this.getNodeInfo(nodeId);
    if (nodeInfo == null) {
      return -1;
    }

    // Return the node's index
    return nodeInfo.getNodeIndex();
  }

  /**
   * Searches for a node in the MeshNetwork with the given ID, and returns a references
   * @param {number} nodeId - Node ID of the node to retrieve
   * @return {MeshNetworkNode} Node with the specified ID,
        or undefined if no node with the ID was found in the Mesh
    */
  getNodeById(nodeId: number) {
    // Look up the node index from the ID and then retrieve the node
    const nodeIndex = this.getNodeIndexFromId(nodeId);
    if (nodeIndex < 0) {
      return null;
    }

    return this.getNodeByIndex(nodeIndex);
  }

  /**
   * Returns an array of links starting with the passed node as the source
   * @param {number} nodeId - Node ID of the node to retrieve
   * @return {MeshNetworkLink[]} Array of MeshNetworkLinks of outbound links from this node
   */
  getNodeLinks(nodeId: number) {
    // Look up the node's info
    let nodeInfo = this.getNodeInfo(nodeId);
    if (nodeInfo == null) {
      return [];
    }

    return nodeInfo.getNodeLinks();
  }

  /**
   * Adds a node to the MeshNetwork
   * @param {MeshNetworkNode} node - Must be an instance of
   * @return {number} The node ID of the inserted node, or MeshNetworkNode.INVALID_ID if insertion failed
   */
  addNode(node: MeshNetworkNode) {
    // Check the node type
    if (!assert((node instanceof MeshNetworkNode), "Invalid node type.")) {
      return MeshNetworkNode.INVALID_ID;
    }

    // Ensure the node doesn't already exist in this network
    if (!assert((this.getNodeById(node.getId()) == null), "Cannot add node, already exists in network.")) {
      return MeshNetworkNode.INVALID_ID;
    }

    // Ensure the node doesn't already have a parent mesh network
    if (!assert((node.getParentMeshNetwork() == null),
      "Cannot add node, it already has a parent mesh network.")) {
      return MeshNetworkNode.INVALID_ID;
    }

    // Add the node to the array of nodes
    const nodeArrayIndex = this.networkNodes.push(node) - 1;

    // Create a new node info and store it in the map
    let nodeInfo = new MeshNetworkNodeInfo(nodeArrayIndex);
    this.networkNodeInfoMap.set(node.getId(), nodeInfo);

    // Set the node's parent mesh netwrk
    node.setParentMeshNetwork(this);

    // Success
    return node.getId();
  }

  /**
   * Adds a link to the MeshNetwork
   * @param {MeshNetworkLink} link - The link to add to the MeshNetwork
   * @return {Boolean} True if the link was successfully added to the network, false otherwise
   */
  addLink(link: MeshNetworkLink) {
    // Ensure the link is a valid type
    if (!assert((link instanceof MeshNetworkLink),
      "Cannot add new link to mesh network because it is not a valid type.")) {
      return false;
    }

    // Ensure the link's source nodes exists in this mesh network
    let sourceNodeInfo = this.getNodeInfo(link.getSourceNodeId());
    if (!assert((sourceNodeInfo != null),
      "Cannot add new link because its source node does not exist in the mesh network.")){
      return false;
    }

    // Ensure the link's destination nodes exists in this mesh network
    let destNodeInfo = this.getNodeInfo(link.getDestNodeId());
    if (!assert((destNodeInfo != null),
      "Cannot add new link because its destination node does not exist in the mesh network.")){
      return false;
    }

    // Ensure the link doesn't already exist for the network
    if (!assert((this.networkLinks.indexOf(link) === -1),
      "Cannot add new link because it already exists in the mesh network.")) {
      return false;
    }

    // Add the link
    sourceNodeInfo.addNodeLink(link);
    this.networkLinks.push(link);

    // Set the link's parent mesh netwrk
    link.setParentMeshNetwork(this);

    return true;
  }

  /**
   * Links the source node to the destination node (creating a new MeshNetworkLink as necessary)
   * @param {number} sourceId - The node ID of the source node
   * @param {number} destId - The node ID of the destination node
   * @param {any} weight - Weight of the link from the source node to the destination node
   * @return {boolean} - True if the link was created successfully, false if there was an error creating the link
   */
  linkNode(sourceId: number, destId: number, weight: any) {
    // Create a new link object
    let newLink = new MeshNetworkLink();
    newLink.setSourceNodeId(sourceId);
    newLink.setDestNodeId(destId);
    newLink.setLinkWeight(weight);

    // Attempt to add the newly created link
    return this.addLink(newLink);
  }

  /**
   * Links the source node to the destination node (creating a new MeshNetworkLink as necessary)
   * @param {number} sourceId - The node ID of the source node
   * @param {number} destId - The node ID of the destination node
   * @param {boolean} bidirectional - If true, 2 links are created (source->dest & dest->source)
   * @param {any} weight - Weight of the link from the source node to the destination node
   * @param {any} reverseWeight - Weight of the link from the destination node to the source node (only bidirectional links)
   * @return {boolean} True if the link was created successfully, false if there was an error creating the link
   */
  linkNodes(sourceId: number, destId: number, biDirectional: boolean, weight: any, reverseWeight: any) {
    // Link the source node to the destination node
    let success = this.linkNode(sourceId, destId, weight);

    // Check if the link is bi-directional
    if (biDirectional) {
      // Figure out the weight for the reverse link
      if (reverseWeight == undefined) {
        reverseWeight = weight;
      }

      // Create the reverse link
      success = success && this.linkNode(destId, sourceId, reverseWeight);
    }

    // Return success
    return success;
  }

  /**
   * Performs an A* search through the Mesh Network to find an optimized (but not necessarily the shortest) path
   * from the source mesh network node to the destination.
   * @param {number} sourceId - ID of the source node in the Mesh Network
   * @param {number} destId - ID of the destination ndde in the Mesh Network
   * @param {Function} heuristic - Function that calculates expected cost between any two nodes in the mesh network
   * heuristicFunc(sourceNode, destNode) { return estimatedCost; }
   * @return {[boolean, number[]]} Returns an array of nodeId's the consitute the solved path
   */
  findPath(sourceId: number, destId: number, heuristic: Function): [boolean, number[]] {
    // Get the source node, and check that it's valid
    let sourceNode = this.getNodeById(sourceId);
    if (!assert((sourceNode instanceof MeshNetworkNode),
      "sourceNode is not valid.")) {
      return [false, []];
    }

    // Get the destination node, and check that it's valid
    let destNode = this.getNodeById(destId);
    if (!assert((destNode instanceof MeshNetworkNode),
      "destNode is not valid.")) {
      return [false, []];
    }

    // Create a map to store solver info for the mesh nodes, and initialize it for each node in the mesh
    let nodeSolverInfo = [];
    for (let nodeIndex = 0; nodeIndex < this.getNodeCount(); nodeIndex++) {
      // Get the node from the current index
      const currentNode = this.getNodeByIndex(nodeIndex);

      // Sanity check the node is valid
      if (!assert((currentNode != null), "Encountered invalid node in the MeshNetwork.")) {
        continue;
      }

      // Initialize the solver info for this node
      let nodeInfo = {
        node: currentNode,
        prevNode: null,
        partialCost: Number.MAX_VALUE,
        expectedCost: Number.MAX_VALUE,
        pathNodeCount: 0,
        open: false,
        closed: false,
      };

      // Add this node's info to the map
      nodeSolverInfo[currentNode.getId()] = nodeInfo;
    }

    // Create a list of "open" nodes which are being evaluated
    let openNodes = new List(); // A list of oepn nodes still being evaluated

    // Initialize the start node
    let firstNodeSolverInfo = nodeSolverInfo[sourceId];
    if (!assert((firstNodeSolverInfo != undefined), "Node solver info lookup failed unexpectently.")) {
      return [false, []];
    }
    firstNodeSolverInfo.partialCost = 0; // no cost to get to this node
    firstNodeSolverInfo.expectedCost = heuristic(sourceNode, destNode); // use heuristic to determine expected cost
    firstNodeSolverInfo.pathNodeCount = 1; // start path node count at one to count the start node
    firstNodeSolverInfo.open = true; // flag that the node is open

    // Add the start node as the initial seed of open nodes
    openNodes.prepend(firstNodeSolverInfo);

    // Search for a path evaluating the open nodes until a path is found or the open node set is exhausted
    while(!openNodes.isEmpty()) {
      // Select the "best" node from the open node set, with the lowest expected cost
      let nodeToEvalSolverInfo = null;
      let nodeToEvalCost = Number.MAX_VALUE;
      openNodes.forEach(function(currentNodeSolverInfo) {
        // Check if the current node has a lower cost than the "best" node evaluated so far
        if (currentNodeSolverInfo.expectedCost < nodeToEvalCost) {
          // Record this node as the new "best"
          nodeToEvalSolverInfo = currentNodeSolverInfo;
          nodeToEvalCost = currentNodeSolverInfo.expectedCost;
        }
      });
      if (!assert((nodeToEvalSolverInfo != null), "Failed to find a suitable node from the open node set.")) {
        return [false, []];
      }

      // Get the node to evaluate from the solver info object
      let nodeToEval = nodeToEvalSolverInfo.node;
      if (!assert((nodeToEval != null), "Node solver info has null node.")) {
        return [false, []];
      }

      // Check if the goal has been reached
      if (nodeToEvalSolverInfo.node.getId() == destId) {
        // Found a path to the destination node, reconstruct the path by walking the previous nodes
        let pathResult = [];

        // Fill the path result array from the end to the front, since we're walking the solution path backwards
        let pathNode = nodeToEvalSolverInfo.node;
        for (let pathIndex = nodeToEvalSolverInfo.pathNodeCount - 1; pathIndex >= 0; pathIndex--) {
          // Verify the path node is valid
          if (!assert((pathNode != null), "Encountered invalid path node reconstructing path solution.")) {
            return [false, []];
          }

          // Store the path node in the result array
          pathResult[pathIndex] = pathNode.getId();

          // Get the solver info for the current node on the path
          const pathNodeSolverInfo = nodeSolverInfo[pathNode.getId()];
          if (!assert((pathNodeSolverInfo != undefined), "Node solver info lookup failed unexpectently.")) {
            return [false, []];
          }

          // Update the path node to the current node's previous node
          pathNode = pathNodeSolverInfo.prevNode;
        }

        // If the complete path was written to the solution array, the pathNode should point to the source node
        if (!assert((pathNode == null), "Mismatch in solution path size and nodes added to array.")) {
          return [false, []];
        }

        // Return the solution path
        return [true, pathResult];
      }

      // Remove the node being evaluated from the open set and mark is as closed
      openNodes.remove(nodeToEvalSolverInfo);
      nodeToEvalSolverInfo.open = false;
      nodeToEvalSolverInfo.closed = true;

      // Iterrate over links of the node being evaluated, adding any that aren't already closed to the open set
      let nodeLinks = this.getNodeLinks(nodeToEval.getId());
      for (let linkIndex = 0; linkIndex < nodeLinks.length; linkIndex++) {
        // Get the link to the connected node
        const meshLink = nodeLinks[linkIndex];
        if (!assert((meshLink != null), "Mesh network has invalid mesh link.")) {
          continue;
        }

        // Get the solver info for the linked node
        let linkedNodeSolverInfo = nodeSolverInfo[meshLink.getDestNodeId()];
        if (!assert((linkedNodeSolverInfo != undefined), "Failed to look up linked node solver info.")) {
          continue;
        }

        // Get the linked node from the solver info
        const linkedNode = linkedNodeSolverInfo.node;
        if (!assert((linkedNode != null), "Failed to get valid node from mesh link.")) {
          continue;
        }

        // Check if the linked node had already been closed
        if (linkedNodeSolverInfo.closed == true) {
          continue;
        }

        // Calculate the actual cost to get to the linked node via this path
        const costToLinkedNode = nodeToEvalSolverInfo.partialCost + meshLink.getLinkWeight();

        // Check if this is the first time the linked node has been encountered
        if (linkedNodeSolverInfo.open) {
          // If the node is already on the open set, check to see if this path is better
          if (costToLinkedNode >= linkedNodeSolverInfo.partialCost) {
            // The previous path to the linked node has a lower cost, so reject the current path
            continue;
          }
        } else {
          // Add this node to the open set
          openNodes.prepend(linkedNodeSolverInfo);
          linkedNodeSolverInfo.open = true;
        }

        // Update the info for the linked node
        linkedNodeSolverInfo.prevNode = nodeToEval; // previous node for the optimal path to this node
        linkedNodeSolverInfo.pathNodeCount = nodeToEvalSolverInfo.pathNodeCount + 1;
        linkedNodeSolverInfo.partialCost = costToLinkedNode; // partial cost to get to this node on this path
        linkedNodeSolverInfo.expectedCost = costToLinkedNode + heuristic(linkedNode, destNode); // expected cost to goal
      }
    }

    return [false, []];
  }

  //
  // Serializable methods
  //

  /**
   * Returns the serialization ID for the object
   * @return {String} Unique serialization ID for this class
   */
  static getSerializationId() {
    return "MeshNetwork";
  }

  /**
   * Serializes this object to and from a buffer =
   * @param {SerializationContext} context - The serialization context for the current operation
   */
  serialize(context) {
    super.serialize(context);

    this.networkNodes = serializeValue(context, "networkNodes", this.networkNodes);
    this.networkLinks = serializeValue(context, "networkLinks", this.networkLinks);

    for (let linkIndex = 0; linkIndex < this.networkLinks.length; linkIndex++) {
      this.networkLinks[linkIndex].setParentMeshNetwork(this);
    }
  }

  /**
   * Function called after the entire object hierarchy has been read during a serialization for any post processing
   */
  postSerializeRead() {
    const serializedNodes = this.networkNodes;
    const serializedLinks = this.networkLinks

    // First clear the network
    this.clear();

    // Loop over each serialized node, and insert it into this network
    for (let nodeIndex = 0; nodeIndex < serializedNodes.length; nodeIndex++) {
      const newNodeId = this.addNode(serializedNodes[nodeIndex]);
      assert((newNodeId !== MeshNetworkNode.INVALID_ID),
        "Failed to insert mesh network node during serialization.");
    }

    // Next, loop over each serialized link, and insert it into this network
    for (let linkIndex = 0; linkIndex < serializedLinks.length; linkIndex++) {
      const success = this.addLink(serializedLinks[linkIndex]);
      assert(success, "Failed to insert mesh network link during serialization");
    }
  }
}

// Register this serializable type with the serialization type manager
serializableTypeMgr.registerType(MeshNetwork);
