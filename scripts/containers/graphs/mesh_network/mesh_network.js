(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  // A MeshNetwork is a graph that consists of a collections of 'nodes' and the directed 'links' from node to node.
  //
  // Each node in the MeshNetwork can be connected to any number of of other nodes via a link, although multiple
  // connections from a source to the same destination are not allowed. Links are all unidirectional, to create a
  // bidirectional link between two nodes A & B, two unidirectional links must be created.
  //
  Containers.MeshNetwork = class MeshNetwork {
    // Constructor
    constructor() {
      this.networkNodes = [];
      this.networkNodesMap = [];
    }

    // Adds a node to the MeshNetwork
    //
    // node:    Must be an instance of MMC.AI.Pathfinding.MeshNetworkNode,
    //
    // returns: The node ID of teh inserted node, or Pathfinding.MeshNetworkNodeInvalidId if the insertion failed
    //
    addNode(node) {
      // Check the node type
      if (!MMC.System.assert((node instanceof Containers.MeshNetworkNode), "Invalid node type.")) {
        return Pathfinding.MeshNetworkNodeInvalidId;
      }

      // Add the node to the array of nodes
      const nodeArrayIndex = this.networkNodes.push(node) - 1;
      this.networkNodesMap[node.getId()] = nodeArrayIndex;

      // Success
      return node.getId();
    }

    // Searches for a node in the MeshNetwork with the given ID, and returns a references
    //
    // nodeId:  Node ID of the node to retrieve
    //
    // returns: Reference to the node with the specified ID, or undefined if no node with the ID was found in the Mesh
    //
    getNode(nodeId) {
      // Look up the node's index in the array from the map
      const nodeArrayIndex = this.networkNodesMap[nodeId];

      // If the node array index is undefined, then the node doesn't exist in the map
      if (nodeArrayIndex == undefined) {
        return null;
      }

      // Look up the node at the requested index, and return it
      return this.getNodeByIndex(nodeArrayIndex);
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
      // Get the source node, and check that it's valid
      let sourceNode = this.getNode(sourceId);
      if (!MMC.System.assert((sourceNode instanceof Containers.MeshNetworkNode),
        "sourceNode is not valid.")) {
        return false;
      }

      // Get the destination node, and check that it's valid
      let destNode = this.getNode(destId);
      if (!MMC.System.assert((destNode instanceof Containers.MeshNetworkNode),
        "destNode is not valid.")) {
        return false;
      }

      // Look for an existing link on the source node to the destination node
      let link = sourceNode.getLinkToNode(destNode.getId());

      // If there's not an existing link, create a new one and add it to the source node
      if (link == null) {
        link = new Containers.MeshNetworkLink();
        sourceNode.addMeshLink(link);
      }

      // Point the link to the destination node and set the weight
      link.setLinkNode(destNode);
      link.setLinkWeight(weight);

      // Return success
      return true;
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

    // Returns the number of nodes in the mesh network
    getNodeCount() {
      return this.networkNodes.length;
    }

    // Returns the mesh network node at the specified index
    // NOTE: the index is into the internal array, not the node ID
    //
    getNodeByIndex(index) {
      // Make sure the index is valid
      if (!MMC.System.assert(((index >= 0) && (index < this.networkNodes.length)),
        "The node index is out of bounds.")) {
        return null;
      }

      // Return the node at the requested index
      return this.networkNodes[index];
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
      let sourceNode = this.getNode(sourceId);
      if (!MMC.System.assert((sourceNode instanceof Containers.MeshNetworkNode),
        "sourceNode is not valid.")) {
        return false;
      }

      // Get the destination node, and check that it's valid
      let destNode = this.getNode(destId);
      if (!MMC.System.assert((destNode instanceof Containers.MeshNetworkNode),
        "destNode is not valid.")) {
        return false;
      }

      // Create a map to store solver info for the mesh nodes, and initialize it for each node in the mesh
      let solverNodeInfo = [];
      for (let nodeIndex = 0; nodeIndex < this.getNodeCount(); nodeIndex++) {
        // Get the node from the current index
        const currentNode = this.getNodeByIndex(nodeIndex);

        // Sanity check the node is valid
        if (!MMC.System.assert((currentNode != null), "Encountered invalid node in the MeshNetwork.")) {
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
        solverNodeInfo[currentNode.getId()] = nodeInfo;
      }

      // Create a list of "open" nodes which are being evaluated
      let openNodes = new MMC.Containers.List(); // A list of oepn nodes still being evaluated

      // Initialize the start node
      let firstNodeInfo = solverNodeInfo[sourceId];
      if (!MMC.System.assert((firstNodeInfo != undefined), "Node solver info lookup failed unexpectently.")) {
        return false;
      }
      firstNodeInfo.partialCost = 0; // no cost to get to this node
      firstNodeInfo.expectedCost = heuristic(sourceNode, destNode); // use heuristic to determine expected cost
      firstNodeInfo.pathNodeCount = 1; // start path node count at one to count the start node
      firstNodeInfo.open = true; // flag that the node is open

      // Add the start node as the initial seed of open nodes
      openNodes.prepend(firstNodeInfo);

      // Search for a path evaluating the open nodes until a path is found or the open node set is exhausted
      while(!openNodes.isEmpty()) {
        // Select the "best" node from the open node set, with the lowest expected cost
        let nodeToEvalInfo = null;
        let nodeToEvalCost = Number.MAX_VALUE;
        openNodes.forEach(function(currentNodeInfo) {
          // Check if the current node has a lower cost than the "best" node evaluated so far
          if (currentNodeInfo.expectedCost < nodeToEvalCost) {
            // Record this node as the new "best"
            nodeToEvalInfo = currentNodeInfo;
            nodeToEvalCost = currentNodeInfo.expectedCost;
          }
        });
        if (!MMC.System.assert((nodeToEvalInfo != null), "Failed to find a suitable node from the open node set.")) {
          return false;
        }

        // Get the node to evaluate from the solver info object
        let nodeToEval = nodeToEvalInfo.node;
        if (!MMC.System.assert((nodeToEval != null), "Node solver info has null node.")) {
          return false;
        }

        // Check if the goal has been reached
        if (nodeToEvalInfo.node.getId() == destId) {
          // Found a path to the destination node, reconstruct the path by walking the previous nodes
          let pathResult = [];

          // Fill the path result array from the end to the front, since we're walking the solution path backwards
          let pathNode = nodeToEvalInfo.node;
          for (let pathIndex = nodeToEvalInfo.pathNodeCount - 1; pathIndex >= 0; pathIndex--) {
            // Verify the path node is valid
            if (!MMC.System.assert((pathNode != null), "Encountered invalid path node reconstructing path solution.")) {
              return false;
            }

            // Store the path node in the result array
            pathResult[pathIndex] = pathNode.getId();

            // Get the solver info for the current node on the path
            const pathNodeInfo = solverNodeInfo[pathNode.getId()];
            if (!MMC.System.assert((pathNodeInfo != undefined), "Node solver info lookup failed unexpectently.")) {
              return false;
            }

            // Update the path node to the current node's previous node
            pathNode = pathNodeInfo.prevNode;
          }

          // If the complete path was written to the solution array, the pathNode should point to the source node
          if (!MMC.System.assert((pathNode == null), "Mismatch in solution path size and nodes added to array.")) {
            return false;
          }

          // Return the solution path
          return pathResult;
        }

        // Remove the node being evaluated from the open set and mark is as closed
        openNodes.remove(nodeToEvalInfo);
        nodeToEvalInfo.open = false;
        nodeToEvalInfo.closed = true;

        // Iterrate over links of the node being evaluated, adding any that aren't already closed to the open set
        for (let linkIndex = 0; linkIndex < nodeToEval.getMeshLinkCount(); linkIndex++) {
          // Get the link to the connected node
          const meshLink = nodeToEval.getMeshLink(linkIndex);
          if (!MMC.System.assert((meshLink != null), "Mesh network has invalid mesh link.")) {
            continue;
          }

          // Get the linked node from the mesh link
          const linkedNode = meshLink.getLinkNode();
          if (!MMC.System.assert((linkedNode != null), "Failed to get valid node from mesh link.")) {
            continue;
          }

          // Get the solver info for the linked node
          let linkedNodeInfo = solverNodeInfo[linkedNode.getId()];
          if (!MMC.System.assert((linkedNodeInfo != undefined), "Failed to look up linked node solver info.")) {
            continue;
          }

          // Check if the linked node had already been closed
          if (linkedNodeInfo.closed == true) {
            continue;
          }

          // Calculate the actual cost to get to the linked node via this path
          const costToLinkedNode = nodeToEvalInfo.partialCost + meshLink.getLinkWeight();

          // Check if this is the first time the linked node has been encountered
          if (linkedNodeInfo.open) {
            // If the node is already on the open set, check to see if this path is better
            if (costToLinkedNode >= linkedNodeInfo.partialCost) {
              // The previous path to the linked node has a lower cost, so reject the current path
              continue;
            }
          } else {
            // Add this node to the open set
            openNodes.prepend(linkedNodeInfo);
            linkedNodeInfo.open = true;
          }

          // Update the info for the linked node
          linkedNodeInfo.prevNode = nodeToEval; // previous node for the optimal path to this node
          linkedNodeInfo.pathNodeCount = nodeToEvalInfo.pathNodeCount + 1;
          linkedNodeInfo.partialCost = costToLinkedNode; // partial cost to get to this node on this path
          linkedNodeInfo.expectedCost = costToLinkedNode + heuristic(linkedNode, destNode); // expected cost to goal
        }
      }
    }
  }

}(window.MMC.Containers = window.MMC.Containers || {}));
}(window.MMC = window.MMC || {}));