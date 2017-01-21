(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  // Stores the link information from one MeshNetworkNode to another MeshNetworkNode
  //
  Containers.MeshNetworkLink = class MeshNetworkLink extends JJ.System.Serialization.Serializable {
    constructor() {
      super();

      // Invalidate the source and destination node ids
      this.sourceNodeId = Containers.MeshNetworkNodeInvalidId;
      this.destNodeId = Containers.MeshNetworkNodeInvalidId;
      this.parentMeshNetwork = null;
    }

    // Returns the link's source node ID
    getSourceNodeId() {
      return this.sourceNodeId;
    }

    // Sets source node ID for this link
    setSourceNodeId(nodeId) {
      this.sourceNodeId = nodeId;
    }

    // Returns the link's destination node ID
    getDestNodeId() {
      return this.destNodeId;
    }

    // Sets the destination node ID for this link
    setDestNodeId(nodeId) {
      this.destNodeId = nodeId;
    }

    // Returns the weight of the link
    getLinkWeight() {
      return this.linkWeight;
    }

    // Sets the weight of the link
    setLinkWeight(linkWeight) {
      this.linkWeight = linkWeight;
    }

    // Return the parent mesh network this link belongs to
    getParentMeshNetwork() {
      return this.parentMeshNetwork;
    }

    // Set the parent mesh network the link belongs to
    setParentMeshNetwork(meshNetwork) {
      this.parentMeshNetwork = meshNetwork;
    }

    //
    // Serializable methods
    //

    static getSerializationId() {
      return "MeshNetworkLink";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);

      // Serialize the source and destination node indexes
      if (serializeContext.isRead) {
        // Just store the index in the ID for now since we don't have a reference to the network.
        // We will do the conversion during the post serialize read step
        this.sourceNodeId = JJ.System.Serialization.serialize(serializeContext, this.sourceNodeId, "sourceNodeIndex");
        this.destNodeId = JJ.System.Serialization.serialize(serializeContext, this.destNodeId, "destNodeIndex");
      } else {
        JJ.System.assert((this.parentMeshNetwork != null),
          "Serializing out a Mesh Network Link with no parent mesh network.");

        // Convert the node IDs into indexes before writting to the serialization buffer
        const sourceNodeIndex = ((this.parentMeshNetwork != null) ?
          this.parentMeshNetwork.getNodeIndexFromId(this.sourceNodeId) : this.sourceNodeId);
        const destNodeIndex = ((this.parentMeshNetwork != null) ?
          this.parentMeshNetwork.getNodeIndexFromId(this.destNodeId) : this.destNodeId);

        // Serialize out the node indexes
        JJ.System.Serialization.serialize(serializeContext, sourceNodeIndex, "sourceNodeIndex");
        JJ.System.Serialization.serialize(serializeContext, destNodeIndex, "destNodeIndex");
      }

      // Serialize the rest of the link data
      this.linkWeight = JJ.System.Serialization.serialize(serializeContext, this.linkWeight, "weight");
    }

    postSerializeRead() {
      if (!JJ.System.assert((this.parentMeshNetwork != null),
          "Serializing in a Mesh Network Link with no parent mesh network.")) {
        return;
      }

      // Update the source and destination node ID's now that the parent mesh network is valid
      let sourceNode = this.parentMeshNetwork.getNodeByIndex(this.sourceNodeId);
      if (JJ.System.assert((sourceNode != null), "Failed to locate mesh network link source node.")) {
        this.setSourceNodeId(sourceNode.getId());
      }
      let destNode = this.parentMeshNetwork.getNodeByIndex(this.destNodeId);
      if (JJ.System.assert((destNode != null), "Failed to locate mesh network link source node.")) {
        this.setDestNodeId(destNode.getId());
      }
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Containers.MeshNetworkLink);


}(window.JJ.Containers = window.JJ.Containers || {}));
}(window.JJ = window.JJ || {}));