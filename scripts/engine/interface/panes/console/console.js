(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Interface, undefined) { /* Interface submodule namespace */
(function(Panes, undefined) { /* Interface submodule namespace */

  // Console pane for debug commands and output
  //
  Panes.Console = class Console extends Interface.UIPane {
    constructor(parentElement) {
      super(parentElement, "data/engine/interface/console/console.html", "data/engine/interface/console/console.css");

     // this.createHidden = true;

      this.outputTextElement = null;
      this.inputTextElement = null;
      this.historyIndex = -1;
    }

    // Called when the pane is created
    //
    createPane() {
      // Call the super
      super.createPane();

      // Locate the input and output elements
      this.outputTextElement = JJ.Utility.DOM.findElementChildByClass(this.rootElement, "output_text");
      JJ.System.assert((this.outputTextElement != null), "Failed to find 'output_text' element in console.html.");
      this.inputTextElement = JJ.Utility.DOM.findElementChildByClass(this.rootElement, "input_text");
      JJ.System.assert((this.inputTextElement != null), "Failed to find 'input_text' element in console.html.");

      // Register a keydown listener for the input element so we can block the tilda key from inputing into the box
      this.inputTextElement.addEventListener('keydown', this.inputTextKeydownHandler.bind(this));
    }

    // Called when the pane is destroyed
    //
    destroyPane() {
      // Call the super
      super.destroyPane();

      this.outputTextElement = null;
      this.inputTextElement = null;
    }

    // Show the console
    //
    show() {
      // Call the super
      super.show();

      this.inputTextElement.focus();
    }

    // Refreshes the output text
    //
    refreshOutput() {
      // Check that the output text element is valid
      if (this.outputTextElement == null) {
        return;
      }

      // Check if the scroll bar is currently at the bottom
      let scrollAtBottom = (this.outputTextElement.scrollTop == (this.outputTextElement.scrollHeight - this.outputTextElement.offsetHeight));

      // Update the output element with the current debug command log
      this.outputTextElement.innerHTML = BE.Debug.Command.getLog();

      // If the scroll bar *was* at the bottom, make sure it's still at the bottom after the text update
      if (scrollAtBottom) {
        this.outputTextElement.scrollTop = this.outputTextElement.scrollHeight;
      }
    }

    // Process a command entered from the console
    //
    processCommand(command) {
      // Try and execute the command
      BE.Debug.Command.execute(command);

      // Refresh the output text
      this.refreshOutput()

      // Clear the input box
      this.inputTextElement.value = "";
      this.historyIndex = -1;
    }

    // Handles moving selection "up" in the console history
    //
    moveHistorySelection(up) {
      const history = BE.Debug.Command.getHistory();

      // Update the history index
      let validSelection = false;
      if (up) {
        // Make sure there is room to move "up" in the history
        if (this.historyIndex + 1 < history.length) {
          // There is room, move up and record that the selection is valid
          this.historyIndex++;
          validSelection = true;
        }
      } else {
        // Make sure there is room to move "down" in the history
        if (this.historyIndex - 1 >= 0) {
          // There is room, move down and record that the selection is valid
          this.historyIndex--;
          validSelection = true;
        } else {
          // Clear the history from the input text and reset the index
          this.historyIndex = -1;
          this.inputTextElement.value = "";
        }
      }

      if (validSelection) {
        const displayIndex = history.length - this.historyIndex - 1;
        if (JJ.System.assert(((displayIndex >= 0) && (displayIndex < history.length)), "Invalid history display index.")) {
          this.inputTextElement.value = history[displayIndex];
        }
      }
    }

    // Hanlder for user key presses in the input text box
    //
    inputTextKeydownHandler(event) {
      // Process the evet
      switch(event.keyCode) {
        // Ignore the tilda keypress
        case JJ.System.IO.Keyboard.KeyCodesEnum.KEY_TILDA: {
          event.preventDefault();
        } break;

        // Process enter key to 'execute' the command
        case JJ.System.IO.Keyboard.KeyCodesEnum.KEY_ENTER: {
          if (this.inputTextElement.value != "") {
            this.processCommand(this.inputTextElement.value);
          }
        } break;

        // Cycle "up" through the console history
        case JJ.System.IO.Keyboard.KeyCodesEnum.KEY_UP_ARROW: {
          this.moveHistorySelection(true);
        } break;

        // Cycle "up" through the console history
        case JJ.System.IO.Keyboard.KeyCodesEnum.KEY_DOWN_ARROW: {
          this.moveHistorySelection(false);
        } break;

        // Clear the input
        case JJ.System.IO.Keyboard.KeyCodesEnum.KEY_ESCAPE: {
          // Reset the history index and clear the input text
          this.historyIndex = -1;
          this.inputTextElement.value = "";

          // Prevent the default enter action which will prevent the input clear from sticking
          event.preventDefault();
        } break;

      }
    }
  }


}(window.JJ.BE.Interface.Panes = window.JJ.BE.Interface.Panes || {}));
}(window.JJ.BE.Interface = window.JJ.BE.Interface || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));