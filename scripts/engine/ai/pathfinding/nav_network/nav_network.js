(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */


  // The NavNetwork is a network of interconnected nodes representing world locations accessible by navigation.
  //
  // Each accessible locations contains a list of links to other nodes in the network, which can be used to navigate
  // through the entirety of the network.
  //
  Pathfinding.NavNetwork = class NavNetwork extends JJ.Containers.MeshNetwork {
    // Constructor
    constructor() {
      // Call the super
      super();
    }

    // Adds a node to the MeshNetwork
    //
    // node:    Must be an instance of JJ.BE.AI.Pathfinding.NavNetworkNode,
    //
    // returns: The node ID of teh inserted node, or Containers.MeshNetworkNodeInvalidId if the insertion failed
    //
    addNode(node) {
      // Check the node type
      if (!JJ.System.assert((node instanceof Pathfinding.NavNetworkNode), "Invalid node type.")) {
        return Pathfinding.MeshNetworkNodeInvalidId;
      }

      return super.addNode(node);
    }

    // Link two nodes in the nav network
    //
    // sourceId: ID of the source node of the link
    // destID:   ID of the destination node of the link
    // weight:   Weight of the link (if not specified, will default to distance between source and dest node positions)
    //
    linkNode(sourceId, destId, weight) {
      // Get the source node, and check that it's valid
      let sourceNode = this.getNodeById(sourceId);
      if (!JJ.System.assert((sourceNode instanceof Pathfinding.NavNetworkNode),
        "sourceNode is not valid.")) {
        return false;
      }

      // Get the destination node, and check that it's valid
      let destNode = this.getNodeById(destId);
      if (!JJ.System.assert((destNode instanceof Pathfinding.NavNetworkNode),
        "destNode is not valid.")) {
        return false;
      }

      // If no weight was specified, calculate the weight between the nodes by using the distance between them
      if (weight == undefined) {
        weight = destNode.getWorldPos().copy().sub(sourceNode.getWorldPos()).length();
      }

      // Call the super to do the work of creating the nav mesh link
      return super.linkNode(sourceId, destId, weight);
    }

    // Link two nodes in the nav network
    //
    // sourceId:        ID of the source node of the link
    // destID:          ID of the destination node of the link
    // biDirectional:   Set to true to make a link between the source and destination nodes in both directions
    // weight:          Weight of the link (if not specified, defaults to distance between source and dest positions)
    // reverseWeight:   Weight of the reverse link (only used for biDirectional links)
    //
    linkNodes(sourceId, destId, biDirectional, weight, reverseWeight) {
      // Get the source node, and check that it's valid
      let sourceNode = this.getNodeById(sourceId);
      if (!JJ.System.assert((sourceNode instanceof Pathfinding.NavNetworkNode),
        "sourceNode is not valid.")) {
        return false;
      }

      // Get the destination node, and check that it's valid
      let destNode = this.getNodeById(destId);
      if (!JJ.System.assert((destNode instanceof Pathfinding.NavNetworkNode),
        "destNode is not valid.")) {
        return false;
      }

      // If no weight was specified, calculate the weight between the nodes by using the distance between them
      if (weight == undefined) {
        weight = destNode.getWorldPos().copy().sub(sourceNode.getWorldPos()).length();
      }
      // If no reverse weight was specified, use the forward weight
      if (reverseWeight == undefined) {
        reverseWeight = weight;
      }

      // Call the super to do the work of creating the nav mesh links
      return super.linkNodes(sourceId, destId, biDirectional, weight, reverseWeight);
    }

    // Performs an A* search through the Nav Network to find an optimized (but not necessarily the shortest) path
    // from the source mesh network node to the destination.
    //
    // sourceId:  ID of the source node in the Mesh Network
    // destId:    ID of the destination ndde in the Mesh Network
    //
    findPath(sourceId, destId) {
      let heuristic = function(sourceNode, destNode) {
        // Verify the node types
        if (!JJ.System.assert((sourceNode instanceof Pathfinding.NavNetworkNode),
          "sourceNode is not valid.")) {
          return Number.MAX_VALUE;
        }
        if (!JJ.System.assert((destNode instanceof Pathfinding.NavNetworkNode),
          "destNode is not valid.")) {
          return Number.MAX_VALUE;
        }

        const weight = destNode.getWorldPos().copy().sub(sourceNode.getWorldPos()).length();
        return weight;
      }

      return super.findPath(sourceId, destId, heuristic);
    }

    //
    // Serializable methods
    //

    static getSerializationId() {
      return "NavNetwork";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Pathfinding.NavNetwork);


}(window.JJ.BE.AI.Pathfinding = window.JJ.BE.AI.Pathfinding || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));