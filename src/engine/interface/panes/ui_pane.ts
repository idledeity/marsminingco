import { ResourceManager, resourceMgr } from "../../resources/resource_manager.js";

import assert from "../../../core_libs/system/assert.js";

/**
 * UIPane is the base class for UI modules built from html & css files.
 */
export default class UIPane {
  private readonly htmlPath: string;
  private readonly cssPath: string;
  private htmlHandle: number;
  private cssHandle: number;

  protected parentElement: HTMLElement;
  protected rootElement: HTMLElement;

  private visible: boolean;
  private resourcesRequested: boolean;
  private paneCreated: boolean;
  private createHidden: boolean;

  /**
   * Constructor
   * @param {HTMLElement} parentElement - The parent DOM element this pane is a child of
   * @param {string} htmlPath - Path to the HTML document for this pane
   * @param {string} cssPath - Path to the CSS document for this pane
   */
  constructor(parentElement: HTMLElement, htmlPath: string, cssPath: string) {
    // File path and handles for resources
    this.htmlPath = htmlPath;
    this.cssPath = cssPath;
    this.htmlHandle = ResourceManager.RESOURCE_HANDLE_INVALID;
    this.cssHandle = ResourceManager.RESOURCE_HANDLE_INVALID;

    // DOM elements
    this.parentElement = parentElement;
    this.rootElement = null;

    // Flags
    this.visible = true;
    this.resourcesRequested = false;
    this.paneCreated = false;
    this.createHidden = false;

    // Request the panes resources
    this.requestResources();
  }

  /**
   * Returns whether the pane is visible
   * @return {boolean} True if the pane is currently visible, False if it is not
   */
  isVisible() {
    return this.visible;
  }

  /**
   * Show the pane, making it's elements visible
   */
  show() {
    // Nothing to do if it's already visible
    if (this.isVisible()) {
      return;
    }

    // Make the root element visible
    if (this.rootElement != null) {
      this.rootElement.style.display = "block";
    }
    this.visible = true;
  }

  /**
   * Hide the pane, making it's elements invisible
   */
  hide() {
    // Nothing to do if it's already hidden
    if (!this.isVisible()) {
      return;
    }

    // Make the root element invisible
    if (this.rootElement != null) {
      this.rootElement.style.display = "none";
    }
    this.visible = false;
  }

  /**
   * Toggle the visibliity of the pane
   */
  toggleVisiblity() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Main update for per frame processing
   * @param {number} deltaMs - Elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // Check if the pane hasn't been created
    if (!this.paneCreated) {
      // Check if the resources have been requested
      if (this.resourcesRequested) {
        // Check if the resources are loaded
        if (this.checkResourcesLoaded()) {
          // Create the pane
          this.createPane();
        }
      }
    }
  }

  /**
   * Requests all of the resources needed by the pane
   */
  requestResources() {
    // Check if the resoures have already been requested
    if (this.resourcesRequested) {
      return;
    }

    // If there is a valid HTML document path, request it's resource
    if (this.htmlPath != undefined) {
      this.htmlHandle = resourceMgr.requestResource(this.htmlPath, "text/plain");
    }

    // If there is a valid CSS document path, request it's resource
    if (this.cssPath != undefined) {
      this.cssHandle = resourceMgr.requestResource(this.cssPath, "text/plain");
    }

    // Mark that the resources have been requested
    this.resourcesRequested = true;
  }

  /**
   * Releases all of the resources requested by the pane
   */
  releaseResources() {
    if (!this.resourcesRequested) {
      return;
    }

    // If there is a resource handle for the html document, release it
    if (this.htmlHandle != ResourceManager.RESOURCE_HANDLE_INVALID) {
      resourceMgr.releaseResource(this.htmlHandle);
      this.htmlHandle = ResourceManager.RESOURCE_HANDLE_INVALID;
    }

    // If there is a resource handle for the css document, release it
    if (this.cssHandle != ResourceManager.RESOURCE_HANDLE_INVALID) {
      resourceMgr.releaseResource(this.cssHandle);
      this.cssHandle = ResourceManager.RESOURCE_HANDLE_INVALID;
    }

    // Mark that the resources have been released
    this.resourcesRequested = false;
  }

  /**
   * Checks if the resources required by the pane are loaded, returning true if they are
   */
  checkResourcesLoaded() {
    // Assume resources are loaded
    let resourcesLoaded = true;

    // If there is a valid html document, check if it is loaded
    if (this.htmlPath != undefined) {
      resourcesLoaded = resourcesLoaded && resourceMgr.isLoaded(this.htmlHandle);
    }

    // If there is a valid css document, check if it is loaded
    if (this.cssPath != undefined) {
      resourcesLoaded = resourcesLoaded && resourceMgr.isLoaded(this.cssHandle);
    }

    // Return whether the resources are loaded
    return resourcesLoaded;
  }

  /**
   * Creates the pane
   */
  createPane() {
    // Check if the pane has already been created
    if (this.paneCreated) {
      return;
    }

    // Create the root element for the pane
    assert((this.rootElement == null), "Creating a pane that already has a root element.");
    this.rootElement = document.createElement("div");

    // Create the CSS element
    if (this.cssHandle != ResourceManager.RESOURCE_HANDLE_INVALID) {
      let cssData = resourceMgr.getData(this.cssHandle);
      if (assert((cssData != null), "Unable to retrieve CSS data for interface pane.")) {
        let newElement = document.createElement("style");
        newElement.innerHTML = cssData;
        this.rootElement.appendChild(newElement);
      }
    }

    // Create the HTML elements
    if (this.htmlHandle != ResourceManager.RESOURCE_HANDLE_INVALID) {
      let htmlData = resourceMgr.getData(this.htmlHandle);
      if (assert((htmlData != null), "Unable to retrieve HTML data for interface pane.")) {
        let newElement = document.createElement("div");
        newElement.innerHTML = htmlData;

        for (let childIndex = 0; childIndex < newElement.childNodes.length; childIndex++) {
          this.rootElement.appendChild(newElement.childNodes[childIndex]);
        }
      }
    }

    // If the pane should be created hidden, then hide it now
    if (this.createHidden) {
      this.hide();
    }

    // Add this pane's root element to it's parent element
    if (this.rootElement != null) {
      this.parentElement.appendChild(this.rootElement);
    }

    // Set the created flag
    this.paneCreated = true;
  }

  /**
   * Destroys the pane
   */
  destroyPane() {
    // Nothing to do if the pane hasn't been created
    if (!this.paneCreated) {
      return;
    }

    // Remove this pane's root element from it's parent element
    if (this.parentElement != null) {
      this.parentElement.removeChild(this.rootElement);
    }
    this.rootElement = null;

    // Clear the created flag
    this.paneCreated = false;
  }
}
