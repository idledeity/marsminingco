import UIPane from "./panes/ui_pane.js";

/**
 * The InterfaceManager class is responsible for managing all interface panes and processes user input
 */
export default class InterfaceManager {
  private panes: UIPane[];

  /**
   * Constructor
   */
  constructor() {
    this.panes = [];
  }

  /**
   * Main update
   * @param {number} deltaMs - Elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // Update each of the panes
    for(let paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
      let currentPane = this.panes[paneIndex];
      currentPane.update(deltaMs);
    }
  }

  /**
   * Add a pane to the manager
   * @param {UIPane} pane - The pane being added to the Interface manager
   */
  addPane(pane: UIPane) {
    this.panes.push(pane);
  }

  /**
   * Remove a pane from the manager
   * @param {number} paneIndex - The index of the pane to be removed
   */
  removePane(paneIndex: number) {
    this.panes.splice(paneIndex, 1);
  }
}
