import assert from "../../core_libs/system/assert.js";
import * as FileIO from "../../core_libs/system/io/file.js";

/**
 * Enumeration of possible resource states
 * @enum {number}
 */
enum ResourceState {
  UNLOADED,
  LOADING,
  LOADED,
  ERROR,
}

/**
 * A class for storing important information about a particular resource
 */
class ResourceInfo {
  public readonly filePath: string;
  public readonly handle: number;
  public readonly mimeType: string;

  public referenceCount: number;
  public resourceState: ResourceState;
  public fileRequest: XMLHttpRequest;
  public data: string;

  /**
   * Constructor
   * @param {string} filePath - File path of the resource
   * @param {number} handle - The handle for the resource info (given from the ResourceManager)
   * @param {string} mimeType - The meme type of the resource
   */
  constructor(filePath, handle, mimeType) {
    this.filePath = filePath;
    this.mimeType = mimeType;
    this.handle = handle;
    this.referenceCount = 0;
    this.resourceState = ResourceState.UNLOADED;
    this.fileRequest = null;
    this.data = null;
  }
}

/**
 * The ResourceManager class handles requesting and loading data resources
 */
export class ResourceManager {
  public static readonly RESOURCE_HANDLE_INVALID: number = -1;
  private static resourceHandleNext: number = 0;

  private resourceInfoMap: Map<number, ResourceInfo>;
  private resourcePathToHandleMap: Map<string, number>;

  /**
   * Constructor
   */
  constructor() {
    this.resourceInfoMap = new Map<number, ResourceInfo>();
    this.resourcePathToHandleMap = new Map<string, number>();
  }

  /**
   * Retrive the resource info of a resource by it's handle
   * @param {nummber} resourceHandle - The handle of the resource to retrieve
   * @return {ResourceInfo} The resource info for the requested resource, or (null) if no match resource was found
   */
  getResourceInfo(resourceHandle: number): ResourceInfo {
    // Check if the handle is invalid
    if (resourceHandle === ResourceManager.RESOURCE_HANDLE_INVALID) {
      return null;
    }

    // Look up the resource info by handle
    let resourceInfo = this.resourceInfoMap[resourceHandle];
    if (resourceInfo == undefined) {
      return null;
    }

    return resourceInfo;
  }

  /**
   * Look up a resource handle from a file path
   * @param {string} filePath - The path of the file to look-up the handle for
   * @return {number} The resource handle of the resource mathing the file path, or 
   *                  ResourceManager.RESOURCE_HANDLE_INVALID if not match was found
   */
  findResourceHandle(filePath): number {
    // Look-up the resource handle
    const resourceHandle = this.resourcePathToHandleMap[filePath];
    if (resourceHandle == undefined) {
      return ResourceManager.RESOURCE_HANDLE_INVALID;
    }

    return resourceHandle
  }

  /**
   * Checks if the specified resource is loaded
   * @param {number} resourceHandle - The handle of the resource to check the status of
   * @return {boolean} True if the specified resource is loaded, False if it is not
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
   * @param {number} resourceHandle - The handle of the resource to retrieve the data from
   * @return {string} The data for the specified resource, or (null) if the resource doesn't exit or isn't loaded
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
      if (assert((resourceInfo.fileRequest != null), "Loading resource has no file request!")) {
        resourceInfo.fileRequest.abort();
        resourceInfo.fileRequest = null;
      }

      // Request the file synchronously
      let requestOutput = FileIO.requestFileBlocking(resourceInfo.filePath, resourceInfo.mimeType);
      resourceInfo.resourceState = requestOutput[0] ? ResourceState.LOADED : ResourceState.ERROR;
      resourceInfo.data = requestOutput[1];
    }

    // Check if the resource isloaded
    if (!assert((resourceInfo.resourceState === ResourceState.LOADED), "Cannot get resource data because it is not loaded")) {
      return null;
    }

    // Return the resource data
    return resourceInfo.data;
  }

  /**
   * Request a resource to be loaded
   * @param {string} filePath - The path to the resource file
   * @param {string} mimeType - The mimeType for how to request the file
   * @return {number} The resource handle of the requested resource, or {ResourceManager.RESOURCE_HANDLE_INVALID} if
   *   there was an error during the request
   */
  requestResource(filePath, mimeType) {
    // First check if there is an existing resource info for the requested path
    let resourceInfo = this.getResourceInfo(this.findResourceHandle(filePath));
    if (resourceInfo == null) {
      resourceInfo = new ResourceInfo(filePath, ResourceManager.resourceHandleNext++, mimeType);
      this.resourceInfoMap[resourceInfo.handle] = resourceInfo;
      this.resourcePathToHandleMap[filePath] = resourceInfo.handle;
    }

    // If the resource hasn't been requested, then request it now
    if (resourceInfo.referenceCount == 0) {
      // Set the state as loading
      resourceInfo.resourceState = ResourceState.LOADING;

      // Request the resource
      resourceInfo.fileRequest = FileIO.requestFileAsync(filePath, 
        function(filePath: string, result: FileIO.FileRequestResult, responseText: string) {
        // Look-up the resource's handle
        const resourceHandle = resourceMgr.findResourceHandle(filePath);
        if (!assert((resourceHandle !== ResourceManager.RESOURCE_HANDLE_INVALID), 
          "Resource Manager callback failed to find handle for filepath.")) {
          return;
        }

        // Get the resource info
        let resourceInfo = resourceMgr.getResourceInfo(resourceHandle);
        if (!assert((resourceInfo != null), "Resource Manager callback failed ot find resource info.")) {
          return;
        }

        // Update the resource's state
        resourceInfo.data = responseText;
        resourceInfo.resourceState = (result === FileIO.FileRequestResult.SUCCESS ? ResourceState.LOADED : ResourceState.ERROR);
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
    if (!assert((resourceInfo !== null && resourceHandle != ResourceManager.RESOURCE_HANDLE_INVALID),
      "Cannot release resource because does not exist.")) {
      return false;
    }

    // Decrement the reference count
    resourceInfo.referenceCount--;
    assert((resourceInfo.referenceCount >= 0), "Resource reference count out of sync.");

    // If the reference count is zero, release the resource
    if (resourceInfo.referenceCount == 0) {
      assert((resourceInfo.resourceState !== ResourceState.UNLOADED), "Attempting to unload resource that is already unloaded.");

      // If the resource was loading, cancel the request
      if (resourceInfo.resourceState === ResourceState.LOADING) {
        // Attempt to abort the file request
        if (assert((resourceInfo.fileRequest != null), "Cannot cancel file request because it is invalid")) {

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
let resourceMgr = new ResourceManager();
export { resourceMgr };