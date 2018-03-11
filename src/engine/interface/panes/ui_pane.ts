import { UIWidget } from "../widgets/ui_widget.js";

import { ResourceManager, resourceMgr } from "../../resources/resource_manager.js";

import assert from "../../../core_libs/system/assert.js";

/**
 * UIPane is the base class for UI modules built from html & css files.
 */
export default class UIPane extends UIWidget {
  /**
   * Constructor
   * @param {string} pathHTML - Path to the HTML document for this pane
   * @param {string} pathCSS - Path to the CSS document for this panne
   * @param {HTMLElement} parentElement - The parent DOM element this pane is a child of [default = null]
   */
  constructor(pathHTML: string, pathCSS: string, parentElement: HTMLElement = null) {
    super(pathHTML, pathCSS, parentElement);
  }

  load() {
    this.requestResources(true);
  }

  /**
   * Main update for per frame processing
   * @param {number} deltaMs - Elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // Call update on the base widget class
    super.update(deltaMs);

    // Check if the pane needs to be composed
    if (this.getState() == UIWidget.State.LOADED) {
      this.compose();
    }
  }

  unload() {
    this.releaseResources(true);
  }

  destroy() {

  }
}
