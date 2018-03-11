import { ResourceManager, resourceMgr } from "../../resources/resource_manager.js";

import assert from "../../../core_libs/system/assert.js";

/**
 * UIWidget is the base class for UI modules built from html & css files.
 */
export class UIWidget {
  private readonly pathHTML: string;
  private readonly pathCSS: string;
  private handleHTML: number;
  private handleCSS: number;

  private widgetState : UIWidget.State;

  private parentElement: HTMLElement;
  private rootElement: HTMLElement;
  private childWidgets: UIWidget[];

  private visible: boolean;

  /**
   * Constructor
   * @param {string} pathHTML - Path to the HTML document for this widget
   * @param {string} pathCSS - Path to the CSS document for this widget
   * @param {HTMLElement} parentElement - The parent DOM element this widget is a child of [default = null]
   */
  constructor(pathHTML: string, pathCSS: string, parentElement: HTMLElement = null) {
    // File path and handles for resources
    this.pathHTML = pathHTML;
    this.pathCSS = pathCSS;
    this.handleHTML = ResourceManager.RESOURCE_HANDLE_INVALID;
    this.handleCSS = ResourceManager.RESOURCE_HANDLE_INVALID;

    // Widget state
    this.widgetState = UIWidget.State.UNLOADED;

    // Set the parent element
    this.parentElement = null;
    this.setParentElement(parentElement);
    
    // Inititialize members
    this.rootElement = null;
    this.childWidgets = [];

    // Flags
    this.visible = true;
  }

  /**
   * Handles composing the widget after it's resources have been loaded
   * @returns {boolean} True if the widget was successfully composed, False if there was some error
   */
  protected compose() {
    switch (this.getState()) {
      case UIWidget.State.UNLOADED: // fall-through
      case UIWidget.State.LOADING:  // fall-through
      case UIWidget.State.DESTROYED:
        // Cannot compose a pane while resources are unloaded or loading
        return false;
      case UIWidget.State.COMPOSED:
        // If already composed, just return true
        return true;
      case UIWidget.State.LOADED:
        // break out of this switch and compose this pane!
        break;
      default:
        assert( false, "Unexpeted UIWidget.State, no default behavior.");
        break;
    }

    // Recursively compose all child widgets first
    for (let childWidget of this.childWidgets) {
      childWidget.compose()
    }

    // Create the root element for the widget
    assert((this.rootElement == null), "Creating a widget that already has a root element.");
    this.rootElement = document.createElement("div");

    // Create the CSS element
    if (this.handleCSS != ResourceManager.RESOURCE_HANDLE_INVALID) {
      let cssData = resourceMgr.getData(this.handleCSS);
      if (assert((cssData != null), "Unable to retrieve CSS data for interface widget.")) {
        let newElement = document.createElement("style");
        newElement.innerHTML = cssData;
        this.rootElement.appendChild(newElement);
      }
    }

    // Create the HTML elements
    if (this.handleHTML != ResourceManager.RESOURCE_HANDLE_INVALID) {
      let htmlData = resourceMgr.getData(this.handleHTML);
      if (assert((htmlData != null), "Unable to retrieve HTML data for interface widget.")) {
        let newElement = document.createElement("div");
        newElement.innerHTML = htmlData;

        for (let childIndex = 0; childIndex < newElement.childNodes.length; childIndex++) {
          this.rootElement.appendChild(newElement.childNodes[childIndex]);
        }
      }
    }

    // Add this widget's root element to it's parent element
    if (this.parentElement != null) {
      this.parentElement.appendChild(this.rootElement);
    }

    // If the widget should be created hidden, then hide it now
    if (!this.visible) {
      this.hide();
    }

    // Set the composed flag
    this.widgetState = UIWidget.State.COMPOSED;
    return true;
  }

  /**
   * Main update for per frame processing
   * @param {number} deltaMs - Elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // Update all of the child widgets
    for (let childWidget of this.childWidgets) {
      childWidget.update(deltaMs);
    }

    // If loading, check if resources are loaded
    if (this.getState() == UIWidget.State.LOADING) {
      let loaded = true;

      // First, check if immediate children are loaded
      for (let childWidget of this.childWidgets) {
        let childState = childWidget.getState();
        if (childState != UIWidget.State.LOADED) {
          assert(childState == UIWidget.State.LOADING, "Widget is loading while child widget is not in LOADING or LOADED state.");
          loaded = false;
          break;
        }
      }     

      // Check if this widget's resources are loaded
      if (loaded && this.checkResourcesLoaded(false)) {
        this.widgetState = UIWidget.State.LOADED;
      }
    }
  }

  /**
   * Destroys the widget
   */
  destroy() {
    // Check if the widget is already destroyed
    if (this.getState() == UIWidget.State.DESTROYED) {
      return;
    }

    // Destroy all of the child widgets
    for (let childWidget of this.childWidgets) {
      childWidget.destroy();
    }
    this.childWidgets = [];

    // Release the resources
    this.releaseResources(false);

    this.widgetState = UIWidget.State.UNLOADED;
  }

  setParentElement(newParent: HTMLElement) {
    // Remove this widget's root element from it's parent element
    if (this.parentElement != null && this.rootElement != null) {
      this.parentElement.removeChild(this.rootElement);
    }

    // If the new parent is non-null, append our root element to it now
    if (newParent != null && this.rootElement != null) {
      newParent.appendChild(this.rootElement);
    }

    this.parentElement = newParent;
  }

  /**
   * Add a child widget to this widget
   * @param {UIWidget} newWidget - The child widget to add
   */
  addWidget(newWidget: UIWidget) {
    this.childWidgets.push(newWidget);
  }

  /**
   * Remove a child widget from this widget
   * @param {UIWidget} widget - The child widget to remove
   */
  removeWidget(widget: UIWidget) {
    for (let widgetIndex = 0; widgetIndex < this.childWidgets.length; widgetIndex++) {
      if (this.childWidgets[widgetIndex] === widget) {
        this.childWidgets.splice(widgetIndex, 1);
        break;
      }
    }
  }

  /**
   * Returns whether the widget is visible
   * @return {boolean} True if the widget is currently visible, False if it is not
   */
  isVisible() {
    return this.visible;
  }

  /**
   * Show the widget, making it's elements visible
   */
  show() {
    // Make the root element visible
    if (this.rootElement != null) {
      this.rootElement.style.display = "block";
    }
    this.visible = true;
  }

  /**
   * Hide the widget, making it's elements invisible
   */
  hide() {
    // Make the root element invisible
    if (this.rootElement != null) {
      this.rootElement.style.display = "none";
    }
    this.visible = false;
  }

  /**
   * Toggle the visibliity of the widget
   */
  toggleVisiblity() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Returns the path of the widget's HTML file
   * @returns {string} the path to the widget's HTML file
   */
  getPathHTML() {
    return this.pathHTML;
  }

  /**
   * Returns the path of the widget's CSS file
   * @returns {string} the path to the widget's CSS file
   */
  getPathCSS() {
    return this.pathCSS;
  }

  /**
   * Returns the current state of the widget
   * @returns {UIWidget.State} The current state of the widget
   */
  getState() {
    return this.widgetState;
  }

  /**
   * Returns the root element of the widget
   * @returns {HTMLElement} The root element of the widget
   */
  getRootElement() {
    return this.rootElement;
  }

  /**
   * Checks if the resources required by the pawidgetne are loaded, returning true if they are
   */
  checkResourcesLoaded(checkChildren: boolean) {
    // Assume resources are loaded
    let resourcesLoaded = true;

    // If there is a valid html document, check if it is loaded
    if (this.handleHTML != ResourceManager.RESOURCE_HANDLE_INVALID) {
      resourcesLoaded = resourcesLoaded && resourceMgr.isLoaded(this.handleHTML);
    }

    // If there is a valid css document, check if it is loaded
    if (this.handleCSS != ResourceManager.RESOURCE_HANDLE_INVALID) {
      resourcesLoaded = resourcesLoaded && resourceMgr.isLoaded(this.handleCSS);
    }

    // Check all of the child widgets
    if (checkChildren) {
      for (let childWidget of this.childWidgets) {
        resourcesLoaded = resourcesLoaded && childWidget.checkResourcesLoaded(checkChildren);
      }
    }

    // Return whether the resources are loaded
    return resourcesLoaded;
  }

  /**
   * Requests all of the resources needed by the widget
   * @param {boolean} includeChildren - Whether or not the child widgets should request their resources or not
   */
  protected requestResources(includeChildren: boolean) {
    if (!assert(this.getState() != UIWidget.State.DESTROYED, "Cannot release resources on destroyed widget")) {
      return;
    }

    // Check if the resoures have already been requested
    if (this.getState() == UIWidget.State.UNLOADED) {
      // If there is a valid HTML document path, request it's resource
      if (this.pathHTML != undefined) {
        this.handleHTML = resourceMgr.requestResource(this.pathHTML, "text/plain");
      }

      // If there is a valid CSS document path, request it's resource
      if (this.pathCSS != undefined) {
        this.handleCSS = resourceMgr.requestResource(this.pathCSS, "text/plain");
      }

      this.widgetState = UIWidget.State.LOADING;
    }

    // Request all resources for children widgets
    if (includeChildren) {
      for (let childWidget of this.childWidgets) {
        childWidget.requestResources(includeChildren);
      }
    }
  }

  /**
   * Releases all of the resources requested by the widget
   * @param {boolean} includeChildren - Whether or not the child widgets should release their resources or not
   */
  protected releaseResources(includeChildren: boolean) {
    if (!assert(this.getState() != UIWidget.State.DESTROYED, "Cannot release resources on destroyed widget")) {
      return;
    }

    if (this.getState() == UIWidget.State.COMPOSED) {
      // Remove this widget's root element from it's parent element
      if (this.parentElement != null && this.rootElement != null) {
        this.parentElement.removeChild(this.rootElement);
      }
      this.rootElement = null;
    }

    if (this.getState() == UIWidget.State.LOADING || this.getState() == UIWidget.State.LOADED) {
      // If there is a resource handle for the html document, release it
      if (this.handleHTML != ResourceManager.RESOURCE_HANDLE_INVALID) {
        resourceMgr.releaseResource(this.handleHTML);
        this.handleHTML = ResourceManager.RESOURCE_HANDLE_INVALID;
      }

      // If there is a resource handle for the css document, release it
      if (this.handleCSS != ResourceManager.RESOURCE_HANDLE_INVALID) {
        resourceMgr.releaseResource(this.handleCSS);
        this.handleCSS = ResourceManager.RESOURCE_HANDLE_INVALID;
      }
    }

    // Release all resources for children widgets
    if (includeChildren) {
      for (let childWidget of this.childWidgets) {
        childWidget.releaseResources(includeChildren);
      }
    }

    // Mark that the resources have been released
    this.widgetState = UIWidget.State.UNLOADED;
  }
}

/**
 * Enumeration of widget states
 * @enum {Number}
 * @readonly
 */
export namespace UIWidget {
  export enum State {
    UNLOADED,
    LOADING,
    LOADED,
    COMPOSED,
    DESTROYED,
  }
}