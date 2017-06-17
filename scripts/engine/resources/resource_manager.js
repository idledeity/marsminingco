(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Resources, undefined) { /* Objects submodule namespace */

  // Constant for an invalid mesh network node id
  const InvalidResourceHandle = -1;
  JJ.BE.Resources.InvalidResourceHandle = InvalidResourceHandle;

  // Simple incrementor to generate the next MeshNetworkNode ID
  let ResourceHandleNext = 0;

  //
  /**
   * Enumeration of possible resource states
   * @enum {Number}
   * @readonly
   */
  JJ.BE.Resources.ResourceState = {
    UNLOADED: 0,
    LOADING: 1,
    LOADED: 2,
    ERROR: 3,
  }

  /**
   * A class for storing important information about a particular resource
   */
  class ResourceInfo {
    /**
     * Constructor
     * @param {String} filePath - File path of the resource
     * @param {String} mimeType - The meme type of the resource
     */
    constructor(filePath, mimeType) {
      this.filePath = filePath;
      this.mimeType = mimeType;
      this.handle = ResourceHandleNext++;
      this.referenceCount = 0;
      this.resourceState = ResourceState.UNLOADED;
      this.fileRequest = null;
      this.data = null;
    }
  }

  /**
   * The MeshNetworkNode class represents a node in the MeshNetwork.
   *
   * Each node in the network can be linked to other nodes in the mesh network to form a directed graph.
   */
  class ResourceManager {
    /**
     * Constructor
     */
    constructor() {
      this.resourceInfoMap = [];
      this.resourcePathToHandleMap = {};
    }

    /**
     * Retrive the resource info of a resource by it's handle
     * @param {Nummber} resourceHandle - The handle of the resource to retrieve
     * @return {ResourceInfo} The resource info for the requested resource, or (null) if no match resource was found
     */
    getResourceInfo(resourceHandle) {
      let resourceInfo = this.resourceInfoMap[resourceHandle];
      if (resourceInfo === undefined) {
        return null;
      }

      return resourceInfo;
    }

    /**
     * Look up a resource handle from a file path
     * @param {String} filePath - The path of the file to look-up the handle for
     * @return {Number} The resource handle of the resource mathing the file path, or
     *   JJ.BE.Resources.InvalidResourceHandle if not match was found
     */
    findResourceHandle(filePath) {
      // Look-up the resource handle
      const resourceHandle = this.resourcePathToHandleMap[filePath];
      if (resourceHandle === undefined) {
        return Resources.InvalidResourceHandle;
      }

      return resourceHandle
    }

    /**
     * Checks if the specified resource is loaded
     * @param {Number} resourceHandle - The handle of the resource to check the status of
     * @return {Boolean} True if the specified resource is loaded, False if it is not
     */
    isLoaded(resourceHandle) {
      let resourceInfo = this.getResourceInfo(resourceHandle);
      if (resourceInfo == null) {
        return false;
      }

      return (resourceInfo.resourceState === ResourceState.LOADED);
    }

    /**
     * Retrieves the data for the specified resource
     * @param {Number} resourceHandle - The handle of the resource to retrieve the data from
     * @return {*} The data for the specified resource, or (null) if the resource doesn't exit or isn't loaded
     */
    getData(resourceHandle) {
      // Get the resource info for the specified handle
      let resourceInfo = this.getResourceInfo(resourceHandle);
      if (resourceInfo == null) {
        return null;
      }

      // If the resource is loading, we need to wait for it to finish
      if (resourceInfo.resourceState === ResourceState.LOADING) {
        // Abort the active async request
        if (JJ.System.assert((resourceInfo.fileRequest != null), "Loading resource has no file request!")) {
          resourceInfo.fileRequest.abort();
          resourceInfo.fileRequest = null;
        }

        // Request the file synchronously
        resourceInfo.data = JJ.System.IO.requestFileBlocking(resourceInfo.filePath, resourceInfo.mimeType);
        resourceInfo.resourceState = ResourceState.LOADED;
      }

      // Check if the resource isloaded
      if (!JJ.System.assert((resourceInfo.resourceState === ResourceState.LOADED),
        "Cannot get resource data because it is not loaded")) {
        return null;
      }

      // Return the resource data
      return resourceInfo.data;
    }

    /**
     * Request a resource to be loaded
     * @param {String} filePath - The path to the resource file
     * @param {String} mimeType - The mimeType for how to request the file
     * @param {Number} The resource handle of the requested resource, or {JJ.BE.Resources.InvalidResourceHandle} if
     *   there was an error during the request
     */
    requestResource(filePath, mimeType) {
      let resourceInfo = this.getResourceInfo(this.findResourceHandle(filePath));
      if (resourceInfo == null) {
        resourceInfo = new ResourceInfo(filePath, mimeType);

        this.resourceInfoMap[resourceInfo.handle] = resourceInfo;
        this.resourcePathToHandleMap[filePath] = resourceInfo.handle;
      }

      // If the resource hasn't been requested, then request it now
      if (resourceInfo.referenceCount == 0) {
        // Set the state as loading
        resourceInfo.resourceState = ResourceState.LOADING;

        // Request the resource
        resourceInfo.fileRequest = JJ.System.IO.requestFileAsync(filePath, function(success, filePath, responseText) {
          // Look-up the resource's handle
          const resourceHandle = Resources.resourceMgr.findResourceHandle(filePath);
          if (!JJ.System.assert((resourceHandle !== Resources.InvalidResourceHandle),
            "Resource Manager callback failed to find handle for filepath.")) {
            return Resources.InvalidResourceHandle;
          }

          // Get the resource info
          let resourceInfo = Resources.resourceMgr.getResourceInfo(resourceHandle);
          if (!JJ.System.assert((resourceInfo != null), "Resource Manager callback failed ot find resource info.")) {
            return Resources.InvalidResourceHandle;
          }

          // Update the resource's state
          resourceInfo.data = responseText;
          resourceInfo.resourceState = success ? ResourceState.LOADED : ResourceState.ERROR;
          resourceInfo.fileRequest = null;
        }, resourceInfo.mimeType);
      }

      // Increment the reference count
      resourceInfo.referenceCount++;

      // Return the resource handle
      return resourceInfo.handle;
    }

    /**
     * Release a previously requested resource. If the reference count on the resrouce becomes 0, it will be unloaded
     * @param {Number} resourceHandle - The resource handle of the resource to be released
     * @return {Boolean} True if the resource was successfully released, False if it could not be found or there was an
     *    error releasing it
     */
    releaseResource(resourceHandle) {
      // Look-up the resource's info
      let resourceInfo = this.getResourceInfo(resourceHandle);
      if (!JJ.System.assert((resourceInfo !== null && resourceHandle != Resources.InvalidResourceHandle),
        "Cannot release resource because does not exist.")) {

        return false;
      }

      // Decrement the reference count
      resourceInfo.referenceCount--;
      JJ.System.assert((resourceInfo.referenceCount >= 0), "Resource reference count out of sync.");

      // If the reference count is zero, release the resource
      if (resourceInfo.referenceCount == 0) {
        JJ.System.assert((resourceInfo.resourceState !== ResourceState.UNLOADED),
          "Attempting to unload resource that is already unloaded.")

        // If the resource was loading, cancel the request
        if (resourceInfo.resourceState === ResourceState.LOADING) {
          // Attempt to abort the file request
          if (JJ.System.assert((resourceInfo.fileRequest != null),
            "Cannot cancel file request because it is invalid")) {

            resourceInfo.fileRequest.abort();
          }
        }

        // Clear the loaded data and update the resource info status
        resourceInfo.data = null;
        resourceInfo.resourceState = ResourceState.UNLOADED;
        resourceInfo.fileRequest = null;
      }
    }
  }

  /**
   * The global serializable type manager
   */
  JJ.BE.Resources.resourceMgr = new ResourceManager();

}(window.JJ.BE.Resources = window.JJ.BE.Resources || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));