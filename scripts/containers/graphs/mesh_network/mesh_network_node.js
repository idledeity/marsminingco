(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  // Constant for an invalid mesh network node id
  const MeshNetworkNodeInvalidId = -1;
  Containers.MeshNetworkNodeInvalidId = MeshNetworkNodeInvalidId;

  // Simple incrementor to generate the next MeshNetworkNode ID
  let MeshNetworkNodeNextId = 0;

  // The MeshNetworkNode class represents a node in the MeshNetwork.
  //
  // Each node in the network can be linked to other nodes in the mesh network to form a directed graph.
  //
  Containers.MeshNetworkNode = class MeshNetworkNode extends MMC.System.Serialization.Serializable {
    constructor() {
      super();

      this.nodeId = MeshNetworkNodeNextId++;
      this.parentMeshNetwork = null;
    }

    // Returns the ID of this node
    getId() {
      return this.nodeId;
    }

    // Gets the parent mesh network that "owns" this node
    getParentMeshNetwork() {
      return this.parentMeshNetwork;
    }

    // Set the parent mesh network that "owns" this node
    setParentMeshNetwork(meshNetwork) {
      this.parentMeshNetwork = meshNetwork;
    }

    //
    // Serializable methods
    //

    static getSerializationId() {
      return "MeshNetworkNode";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);
    }
  }

  // Register this serializable type with the serialization type manager
  MMC.System.Serialization.serializableTypeMgr.registerType(Containers.MeshNetworkNode);


}(window.MMC.Containers = window.MMC.Containers || {}));
}(window.MMC = window.MMC || {}));