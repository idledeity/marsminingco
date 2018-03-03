import UIPane from "../../engine/interface/panes/ui_pane.js";

export default class EditorWindow extends UIPane {
  /**
   * Constructor
   * @param {HTMLElement} parentElement - The parent DOM element this pane is a child of
   */
  constructor(parentElement: HTMLElement) {
    super(parentElement, "data/editor/interface/editor_window.html", "data/editor/interface/editor_window.css");
  }

  /**
   * Called when the pane is created
   */
  createPane() {
    // Call the super
    super.createPane();
  }

  /**
   * Called when the pane is destroyed
   */
  destroyPane() {
    // Call the super
    super.destroyPane();
  }

  /**
   * Called to show the console (make it visible)
   */
  show() {
    // Call the super
    super.show();
  }
}