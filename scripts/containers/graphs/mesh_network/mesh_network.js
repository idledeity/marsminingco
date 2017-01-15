(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  // Simple class used to store some meta data for each mesh network node in the network
  //
  class MeshNetworkNodeInfo {
    constructor(nodeIndex) {
      this.nodeIndex = nodeIndex;
      this.nodeLinks = [];
    }

    getNodeIndex() {
      return this.nodeIndex;
    }

    getNodeLinks() {
      return this.nodeLinks;
    }

    addNodeLink(newLink) {
      // Ensure the connection type is valid
      if (!JJ.System.assert((newLink instanceof Containers.MeshNetworkLink),
        "Links must be an instance of MeshNetworkLink")) {
        return false;
      }

      this.nodeLinks.push(newLink);
    }
  }

  // A MeshNetwork is a graph that consists of a collections of 'nodes' and the directed 'links' from node to node.
  //
  // Each node in the MeshNetwork can be connected to any number of of other nodes via a link, although multiple
  // connections from a source to the same destination are not allowed. Links are all unidirectional, to create a
  // bidirectional link between two nodes A & B, two unidirectional links must be created.
  //
  Containers.MeshNetwork = class MeshNetwork extends JJ.System.Serialization.Serializable {
    // Constructor
    constructor() {
      super();

      this.clear();
    }

    // Removes all nodes from the network
    clear() {
      this.networkNodes = [];    // array of network nodes
      this.networkLinks = [];    // array of network links

      this.networkNodeInfoMap = {}; // map of network node info, keyed by the node ID
    }

    // Returns the number of nodes in the mesh network
    //
    getNodeCount() {
      return this.networkNodes.length;
    }

    // Returns the mesh network node at the specified index
    // NOTE: the index is into the internal array, not the node ID
    //
    getNodeByIndex(index) {
      // Make sure the index is valid
      if (!JJ.System.assert(((index >= 0) && (index < this.networkNodes.length)),
        "The node index is out of bounds.")) {
        return null;
      }

      // Return the node at the requested index
      return this.networkNodes[index];
    }

    // Returns the node info for the node with the passed node ID
    //
    getNodeInfo(nodeId) {
      // Check for an invalid node id
      if (nodeId == Containers.MeshNetworkNodeInvalidId) {
        return null;
      }

      // Look up the node's info in the map
      let nodeInfo = this.networkNodeInfoMap[nodeId];
      if (nodeInfo === undefined) {
        return null;
      }

      return nodeInfo;
    }

    // Returns the index of a node with the specified ID, or -1 if the node does not exist
    //
    getNodeIndexFromId(nodeId) {
      // Retrieve the node info for the passed ID
      const nodeInfo = this.getNodeInfo(nodeId);
      if (nodeInfo == null) {
        return -1;
      }

      // Return the node's index
      return nodeInfo.getNodeIndex();
    }

    // Searches for a node in the MeshNetwork with the given ID, and returns a references
    //
    // nodeId:  Node ID of the node to retrieve
    //
    // returns: Reference to the node with the specified ID, or undefined if no node with the ID was found in the Mesh
    //
    getNodeById(nodeId) {
      // Look up the node index from the ID and then retrieve the node
      const nodeIndex = this.getNodeIndexFromId(nodeId);
      if (nodeIndex < 0) {
        return null;
      }

      return this.getNodeByIndex(nodeIndex);
    }

    // Returns an array of links starting with the passed node as the source
    //
    getNodeLinks(nodeId) {
      // Look up the node's info
      let nodeInfo = this.getNodeInfo(nodeId);
      if (nodeInfo == null) {
        return [];
      }

      return nodeInfo.getNodeLinks();
    }

    // Adds a node to the MeshNetwork
    //
    // node:    Must be an instance of JJ.Containers.MeshNetworkNode,
    //
    // returns: The node ID of the inserted node, or Containers.MeshNetworkNodeInvalidId if the insertion failed
    //
    addNode(node) {
      // Check the node type
      if (!JJ.System.assert((node instanceof Containers.MeshNetworkNode), "Invalid node type.")) {
        return Containers.MeshNetworkNodeInvalidId;
      }

      // Ensure the node doesn't already exist in this network
      if (!JJ.System.assert((this.getNodeById(node.getId()) == null), "Cannot add node, already exists in network.")) {
        return Containers.MeshNetworkNodeInvalidId;
      }

      // Ensure the node doesn't already have a parent mesh network
      if (!JJ.System.assert((node.getParentMeshNetwork() == null),
        "Cannot add node, it already has a parent mesh network.")) {
        return Containers.MeshNetworkNodeInvalidId;
      }

      // Add the node to the array of nodes
      const nodeArrayIndex = this.networkNodes.push(node) - 1;

      // Create a new node info and store it in the map
      let nodeInfo = new MeshNetworkNodeInfo(nodeArrayIndex);
      this.networkNodeInfoMap[node.getId()] = nodeInfo;

      // Set the node's parent mesh netwrk
      node.setParentMeshNetwork(this);

      // Success
      return node.getId();
    }

    // Adds a link to the MeshNetwork
    //
    // link:      The link to be added to the MeshNetwork (must be an instance of JJ.Containers.MeshNetworkLink)
    //
    // returns:   True if the link was successfully added to the network, false otherwise
    //
    addLink(link) {
      // Ensure the link is a valid type
      if (!JJ.System.assert((link instanceof Containers.MeshNetworkLink),
        "Cannot add new link to mesh network because it is not a valid type.")) {
        return false;
      }

      // Ensure the link's source nodes exists in this mesh network
      let sourceNodeInfo = this.getNodeInfo(link.getSourceNodeId());
      if (!JJ.System.assert((sourceNodeInfo != null),
        "Cannot add new link because its source node does not exist in the mesh network.")){
        return false;
      }

      // Ensure the link's destination nodes exists in this mesh network
      let destNodeInfo = this.getNodeInfo(link.getDestNodeId());
      if (!JJ.System.assert((destNodeInfo != null),
        "Cannot add new link because its destination node does not exist in the mesh network.")){
        return false;
      }

      // Ensure the link doesn't already exist for the network
      if (!JJ.System.assert((this.networkLinks.indexOf(link) === -1),
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

    // Links the source node to the destination node (creating a new MeshNetworkLink as necessary)
    //
    // source:  The node ID of the source node
    // dest:    The node ID of the destination node
    // weight:  Weight of the link from the source node to the destination node
    //
    // returns: True if the link was created successfully, false if there was an error creating the link
    //
    linkNode(sourceId, destId, weight) {
      // Create a new link object
      let newLink = new Containers.MeshNetworkLink();
      newLink.setSourceNodeId(sourceId);
      newLink.setDestNodeId(destId);
      newLink.setLinkWeight(weight);

      // Attempt to add the newly created link
      return this.addLink(newLink);
    }

    // Links the source node to the destination node (creating a new MeshNetworkLink as necessary)
    //
    // source:        Can either be the node ID of the source node, or a reference to the source node
    // dest:          Can either be the ndoe ID of the destination node, or a reference to the destinatino node
    // bidirectional: If true, 2 links are created (source->dest & dest->source), to link the nodes in both directions
    // weight:        Weight of the link from the source node to the destination node
    // reverseWeight: Weight of the link from the destination node to the source node (for bidirectional links only)
    //
    // returns:       True if the link was created successfully, false if there was an error creating the link
    //
    linkNodes(sourceId, destId, biDirectional, weight, reverseWeight) {
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

    // Performs an A* search through the Mesh Network to find an optimized (but not necessarily the shortest) path
    // from the source mesh network node to the destination.
    //
    // sourceId:  ID of the source node in the Mesh Network
    // destId:    ID of the destination ndde in the Mesh Network
    // heuristic: Function which returns the expected cost between any two arbitrary nodes in the mesh network
    //              heuristicFunc(sourceNode, destNode) { return estimatedCost; }
    //
    findPath(sourceId, destId, heuristic) {
      // Get the source node, and check that it's valid
      let sourceNode = this.getNodeById(sourceId);
      if (!JJ.System.assert((sourceNode instanceof Containers.MeshNetworkNode),
        "sourceNode is not valid.")) {
        return false;
      }

      // Get the destination node, and check that it's valid
      let destNode = this.getNodeById(destId);
      if (!JJ.System.assert((destNode instanceof Containers.MeshNetworkNode),
        "destNode is not valid.")) {
        return false;
      }

      // Create a map to store solver info for the mesh nodes, and initialize it for each node in the mesh
      let nodeSolverInfo = [];
      for (let nodeIndex = 0; nodeIndex < this.getNodeCount(); nodeIndex++) {
        // Get the node from the current index
        const currentNode = this.getNodeByIndex(nodeIndex);

        // Sanity check the node is valid
        if (!JJ.System.assert((currentNode != null), "Encountered invalid node in the MeshNetwork.")) {
          continue;
        }

        // Initialize the solver info for this node
        let nodeInfo = {
          node: currentNode,
          prevNode: null,
          partialCost: Number.MAX_NUMBER,
          expectedCost: Number.MAX_NUMBER,
          pathNodeCount: 0,
          open: false,
          closed: false,
        };

        // Add this node's info to the map
        nodeSolverInfo[currentNode.getId()] = nodeInfo;
      }

      // Create a list of "open" nodes which are being evaluated
      let openNodes = new JJ.Containers.List(); // A list of oepn nodes still being evaluated

      // Initialize the start node
      let firstNodeSolverInfo = nodeSolverInfo[sourceId];
      if (!JJ.System.assert((firstNodeSolverInfo != undefined), "Node solver info lookup failed unexpectently.")) {
        return false;
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
        if (!JJ.System.assert((nodeToEvalSolverInfo != null), "Failed to find a suitable node from the open node set.")) {
          return false;
        }

        // Get the node to evaluate from the solver info object
        let nodeToEval = nodeToEvalSolverInfo.node;
        if (!JJ.System.assert((nodeToEval != null), "Node solver info has null node.")) {
          return false;
        }

        // Check if the goal has been reached
        if (nodeToEvalSolverInfo.node.getId() == destId) {
          // Found a path to the destination node, reconstruct the path by walking the previous nodes
          let pathResult = [];

          // Fill the path result array from the end to the front, since we're walking the solution path backwards
          let pathNode = nodeToEvalSolverInfo.node;
          for (let pathIndex = nodeToEvalSolverInfo.pathNodeCount - 1; pathIndex >= 0; pathIndex--) {
            // Verify the path node is valid
            if (!JJ.System.assert((pathNode != null), "Encountered invalid path node reconstructing path solution.")) {
              return false;
            }

            // Store the path node in the result array
            pathResult[pathIndex] = pathNode.getId();

            // Get the solver info for the current node on the path
            const pathNodeSolverInfo = nodeSolverInfo[pathNode.getId()];
            if (!JJ.System.assert((pathNodeSolverInfo != undefined), "Node solver info lookup failed unexpectently.")) {
              return false;
            }

            // Update the path node to the current node's previous node
            pathNode = pathNodeSolverInfo.prevNode;
          }

          // If the complete path was written to the solution array, the pathNode should point to the source node
          if (!JJ.System.assert((pathNode == null), "Mismatch in solution path size and nodes added to array.")) {
            return false;
          }

          // Return the solution path
          return pathResult;
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
          if (!JJ.System.assert((meshLink != null), "Mesh network has invalid mesh link.")) {
            continue;
          }

          // Get the solver info for the linked node
          let linkedNodeSolverInfo = nodeSolverInfo[meshLink.getDestNodeId()];
          if (!JJ.System.assert((linkedNodeSolverInfo != undefined), "Failed to look up linked node solver info.")) {
            continue;
          }

          // Get the linked node from the solver info
          const linkedNode = linkedNodeSolverInfo.node;
          if (!JJ.System.assert((linkedNode != null), "Failed to get valid node from mesh link.")) {
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
    }

    //
    // Serializable methods
    //

    static getSerializationId() {
      return "MeshNetwork";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.networkNodes = JJ.System.Serialization.serialize(serializeContext, this.networkNodes, "networkNodes");
      this.networkLinks = JJ.System.Serialization.serialize(serializeContext, this.networkLinks, "networkLinks");

      for (let linkIndex = 0; linkIndex < this.networkLinks.length; linkIndex++) {
        this.networkLinks[linkIndex].setParentMeshNetwork(this);
      }
    }

    postSerializeRead() {
      const serializedNodes = this.networkNodes;
      const serializedLinks = this.networkLinks

      // First clear the network
      this.clear();

      // Loop over each serialized node, and insert it into this network
      for (let nodeIndex = 0; nodeIndex < serializedNodes.length; nodeIndex++) {
        const newNodeId = this.addNode(serializedNodes[nodeIndex]);
        JJ.System.assert((newNodeId !== Containers.MeshNetworkNodeInvalidId),
          "Failed to insert mesh network node during serialization.");
      }

      // Next, loop over each serialized link, and insert it into this network
      for (let linkIndex = 0; linkIndex < serializedLinks.length; linkIndex++) {
        const success = this.addLink(serializedLinks[linkIndex]);
        JJ.System.assert(success, "Failed to insert mesh network link during serialization");
      }
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Containers.MeshNetwork);

}(window.JJ.Containers = window.JJ.Containers || {}));
}(window.JJ = window.JJ || {}));