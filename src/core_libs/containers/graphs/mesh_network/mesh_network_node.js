(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  // Constant for an invalid mesh network node id
  const MeshNetworkNodeInvalidId = -1;
  JJ.Containers.MeshNetworkNodeInvalidId = MeshNetworkNodeInvalidId;

  // Simple incrementor to generate the next MeshNetworkNode ID
  let MeshNetworkNodeNextId = 0;

  /**
   * The MeshNetworkNode class represents a node in the MeshNetwork.
   *
   * Each node in the network can be linked to other nodes in the mesh network to form a directed graph.
   * @extends JJ.System.Serialization.Serializable
   */
  JJ.Containers.MeshNetworkNode = class MeshNetworkNode extends JJ.System.Serialization.Serializable {
    /**
     * Creates a new MeshNetworkNode
     */
    constructor() {
      super();

      this.nodeId = MeshNetworkNodeNextId++;
      this.parentMeshNetwork = null;
    }

    /**
     * Returns the ID of this node
     * @return {Number} The node's ID
     */
    getId() {
      return this.nodeId;
    }

    /**
     * Gets the parent mesh network that "owns" this node
     * @return {JJ.Containers.MeshNetwork} Parent mesh network that owns this node
     */
    getParentMeshNetwork() {
      return this.parentMeshNetwork;
    }

    /**
     * Set the parent mesh network that "owns" this node
     * @param {JJ.Containers.MeshNetwork} The parent mesh network that owns this node
     */
    setParentMeshNetwork(meshNetwork) {
      this.parentMeshNetwork = meshNetwork;
    }

    //
    // Serializable methods
    //

    /**
     * Returns the serialization ID for the object
     * @return {String} Unique serialization ID for this class
     */
    static getSerializationId() {
      return "MeshNetworkNode";
    }

    /**
     * Serializes this object to and from a buffer =
     * @param {Object} serializeContext - The serialization context for the current operations (ex. read or write)
     */
    serialize(serializeContext) {
      super.serialize(serializeContext);
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Containers.MeshNetworkNode);


}(window.JJ.Containers = window.JJ.Containers || {}));
}(window.JJ = window.JJ || {}));