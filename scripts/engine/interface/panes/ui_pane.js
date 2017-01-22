(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Interface, undefined) { /* Controllers submodule namespace */

  // UIPane is the base class for UI modules built from html & css files.
  //
  Interface.UIPane = class UIPane {
    constructor(htmlPath, cssPath, parentElement) {
      // File path and handles for resources
      this.htmlPath = htmlPath;
      this.htmlHandle = BE.Resources.InvalidResourceHandle;
      this.cssPath = cssPath;
      this.cssHandle = BE.Resources.InvalidResourceHandle;

      // DOM elements
      this.parentElement = parentElement;
      this.rootElement = null;

      // Flags
      this.visible = false;
      this.resourcesRequested = false;
      this.paneCreated = false;

      // Request the panes resources
      this.requestResources();
    }

    // Returns whether the pane is visible
    //
    isVisible() {
      return this.visible;
    }

    // Show the pane, making it's elements visible
    //
    show() {
      // Nothing to do if it's already visible
      if (this.isVisible()) {
        return;
      }

      // Make the root element visible
      this.rootElement.style.display = "block";
      this.visible = true;
    }

    // Hide the pane, making it's elements invisible
    //
    hide() {
      // Nothing to do if it's already hidden
      if (!this.isVisible()) {
        return;
      }

      // Make the root element invisible
      this.consoleElement.style.display = "none";
      this.visible = false;
    }

    // Main update for per frame processing
    //
    update(deltaTime) {
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

    // Requests all of the resources needed by the pane
    //
    requestResources() {
      // Check if the resoures have already been requested
      if (this.resourcesRequested) {
        return;
      }

      // If there is a valid HTML document path, request it's resource
      if (this.htmlPath != undefined) {
        this.htmlHandle = BE.Resources.resourceMgr.requestResource(this.htmlPath, "text/plain");
      }

      // If there is a valid CSS document path, request it's resource
      if (this.cssPath != undefined) {
        this.cssHandle = BE.Resources.resourceMgr.requestResource(this.cssPath, "text/plain");
      }

      // Mark that the resources have been requested
      this.resourcesRequested = true;
    }

    // Releases all of the resources requested by the pane
    //
    releaseResources() {
      if (!this.resourcesRequested) {
        return;
      }

      // If there is a resource handle for the html document, release it
      if (this.htmlHandle != BE.Resources.InvalidResourceHandle) {
        BE.Resources.resourceMgr.releaseResource(this.htmlHandle);
        this.htmlHandle = BE.Resources.InvalidResourceHandle;
      }

      // If there is a resource handle for the css document, release it
      if (this.cssHandle != BE.Resources.InvalidResourceHandle) {
        BE.Resources.resourceMgr.releaseResource(this.cssHandle);
        this.cssHandle = BE.Resources.InvalidResourceHandle;
      }

      // Mark that the resources have been released
      this.resourcesRequested = false;
    }

    // Checks if the resources required by the pane are loaded, returning true if they are
    //
    checkResourcesLoaded() {
      // Assume resources are loaded
      let resourcesLoaded = true;

      // If there is a valid html document, check if it is loaded
      if (this.htmlPath != undefined) {
        resourcesLoaded = resourcesLoaded && BE.Resources.resourceMgr.isLoaded(this.htmlHandle);
      }

      // If there is a valid css document, check if it is loaded
      if (this.cssPath != undefined) {
        resourcesLoaded = resourcesLoaded && BE.Resources.resourceMgr.isLoaded(this.cssHandle);
      }

      // Return whether the resources are loaded
      return resourcesLoaded;
    }

    // Creates the pane
    //
    createPane() {
      // Check if the pane has already been created
      if (this.paneCreated) {
        return;
      }

      // Create the root element for the pane
      JJ.System.assert((this.rootElement == null), "Creating a pane that already has a root element.");
      this.rootElement = document.createElement("div");

      // Create the CSS element
      if (this.cssHandle != BE.Resources.InvalidResourceHandle) {
        let cssData = BE.Resources.resourceMgr.getData(this.cssHandle);
        if (JJ.System.assert((cssData != null), "Unable to retrieve CSS data for interface pane.")) {
          let newElement = document.createElement("style");
          newElement.innerHTML = cssData;
          this.rootElement.appendChild(newElement);
        }
      }

      // Create the HTML elements
      if (this.htmlHandle != BE.Resources.InvalidResourceHandle) {
        let htmlData = BE.Resources.resourceMgr.getData(this.htmlHandle);
        if (JJ.System.assert((htmlData != null), "Unable to retrieve HTML data for interface pane.")) {
          let newElement = document.createElement("div");
          newElement.innerHTML = htmlData;

          for (let childIndex = 0; childIndex < newElement.childNodes.length; childIndex++) {
            this.rootElement.appendChild(newElement.childNodes[childIndex]);
          }
        }
      }

      // Add this pane's root element to it's parent element
      if (this.rootElement != null) {
        this.parentElement.appendChild(this.rootElement);
      }

      // Set the created flag
      this.paneCreated = true;
    }

    // Destroys the pane
    //
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


}(window.JJ.BE.Interface = window.JJ.BE.Interface || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));