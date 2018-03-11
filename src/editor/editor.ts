import EditorWindow from "./interface/editor_window.js";

import App from "../core_libs/system/application/app.js";
import Engine from "../engine/engine.js";

export default class Editor extends App {
    private engine: Engine;
    private editorWindow: EditorWindow;

    /**
     * Constructor
     */
    constructor() {
      super();

      // Create the engine runtime
      this.engine = new Engine();

      // Create the debug console and add it to the interface manager
      this.editorWindow = new EditorWindow(document.getElementById('editor'));
      this.engine.getInterfaceMgr().addPane(this.editorWindow);
      this.editorWindow.load();
    }

    /**
     * Per-frame updating
     * @param deltaTimeMs - the elapsed time in MS since the last time update was called 
     */
    update(deltaTimeMs: number) {
      super.update(deltaTimeMs);

      this.engine.update(deltaTimeMs);
    }
}

let theEditor = new Editor();
theEditor.runApp();