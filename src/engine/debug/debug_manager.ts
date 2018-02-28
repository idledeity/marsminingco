import Console from "../interface/panes/console/console.js";

import KeyboardKeyCodes from "../../core_libs/system/io/keyboard/keycodes.js";

/**
 * The DebugManager manages all debug functionality and rendering
 */
export default class DebugManager {
  private game: any;
  private consolePane: any;

  /**
   * Constructor
   */
  constructor(game: any) {
    this.game = game;

    // Create the debug console and add it to the interface manager
    this.consolePane = new Console(document.getElementById('game'));
    this.game.getInterfaceMgr().addPane(this.consolePane);
  }

  /**
   * Main update
   * @param {Number} deltaMs - The elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // If the tilda key was pressed, toggle the console visibility
    let inputMgr = this.game.getInputMgr();
    if (inputMgr.getKeyDown(KeyboardKeyCodes.KEY_TILDA)) {
      this.consolePane.toggleVisiblity();
    }
  }
}
