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
      this.networkNodes[node.getId()] = node;

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
      return this.networkNodes[nodeId];
    }

    // Links the source node to the destination node (creating a new MeshNetworkLink as necessary)
    //
    // source:  Can either be the node ID of the source node, or a reference to the source node
    // dest:    Can either be the ndoe ID of the destination node, or a reference to the destinatino node
    // weight:  Weight of the link from the source node to the destination node
    //
    // returns: True if the link was created successfully, false if there was an error creating the link
    // 
    linkNode(source, dest, weight) {
      // Get the source node, and check that it's valid
      let sourceNode = ((source instanceof Containers.MeshNetworkNode) ? source : this.getNode(source));
      if (!MMC.System.assert((sourceNode instanceof Containers.MeshNetworkNode),
        "sourceNode is not valid.")) {
        return false;
      }

      // Get the destination node, and check that it's valid
      let destNode = ((dest instanceof Containers.MeshNetworkNode) ? dest : this.getNode(dest));
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
    linkNodes(source, dest, biDirectional, weight, reverseWeight) {
      // Link the source node to the destination node
      let success = this.linkNode(source, dest, weight);

      // Check if the link is bi-directional
      if (biDirectional) {
        // Figure out the weight for the reverse link
        if (reverseWeight == undefined) {
          reverseWeight = weight;
        }

        // Create the reverse link
        success = success && this.linkNode(dest, source, reverseWeight);
      }

      // Return success
      return success;
    }
  }

}(window.MMC.Containers = window.MMC.Containers || {}));
}(window.MMC = window.MMC || {}));