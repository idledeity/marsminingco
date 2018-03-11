import Engine from "../engine.js";
import Console from "../interface/panes/console/console.js";
import UIPane from "../interface/panes/ui_pane.js";

import KeyboardKeyCodes from "../../core_libs/system/io/keyboard/keycodes.js";

/**
 * The DebugManager manages all debug functionality and rendering
 */
export default class DebugManager {
  private engine: Engine;
  private console: Console;

  /**
   * Constructor
   */
  constructor(engine: Engine) {
    this.engine = engine;

    // Create the debug console and add it to the interface manager
    this.console = new Console(document.getElementById('appplication'));
    this.engine.getInterfaceMgr().addPane(this.console);
    this.console.load();
  }

  /**
   * Main update
   * @param {number} deltaMs - The elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // If the tilda key was pressed, toggle the console visibility
    let inputMgr = this.engine.getInputMgr();
    if (inputMgr.getKeyDown(KeyboardKeyCodes.KEY_TILDA)) {
      this.console.toggleVisiblity();
    }
  }
}
