(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Input, undefined) { /* Controllers submodule namespace */

  // InputManager to manage user input
  //
  Input.InputManager = class InputManager {
    constructor() {
      // Initialize the event buffers
      this.events = [];
      this.eventBuffer = [];

      // Initialize the key pressed state buffers
      this.keyDepressed = new Array(JJ.System.IO.Keyboard.KeyCodesEnum.KEY_COUNT);
      this.keyDepressed.fill(false);
      this.keyDepressedPrev = new Array(JJ.System.IO.Keyboard.KeyCodesEnum.KEY_COUNT);
      this.keyDepressedPrev.fill(false);

      // Reigster for keybaord events
      document.addEventListener('keydown', function(event) {
        this.eventBuffer.push(event);
      }.bind(this));      document.addEventListener('keyup', function(event) {
        this.eventBuffer.push(event);
      }.bind(this));
    }

    // Returns the active event for the current frame
    //
    getEvents() {
      return this.events;
    }

    // Returns whether a specific key is depressed on the current frame
    //
    getKeyDepressed(keyCode) {
      // Check for invalid keycodes
      if (!JJ.System.assert(((keyCode >= 0) && (keyCode < JJ.System.IO.Keyboard.KeyCodesEnum.KEY_COUNT)),
        "Invalid keyCode passed.")) {
        return false;
      }

      // Return the key depressed state
      return this.keyDepressed[keyCode];
    }

    // Returns whether a specific key was depressed on the previous frame
    //
    getKeyDepressedPrev(keyCode) {
      // Check for invalid keycodes
      if (!JJ.System.assert(((keyCode >= 0) && (keyCode < JJ.System.IO.Keyboard.KeyCodesEnum.KEY_COUNT)),
        "Invalid keyCode passed.")) {
        return false;
      }

      // Return the key depressed state
      return this.keyDepressedPrev[keyCode];
    }

    // Returns whether a key was pressed "down" this frame (switch from not depressed to depressed)
    //
    getKeyDown(keyCode) {
      const keyWasDepressed = this.getKeyDepressedPrev(keyCode);
      const keyIsDepressed = this.getKeyDepressed(keyCode);

      return (keyIsDepressed && !keyWasDepressed);
    }

    // Returns whether a key was released "up" this frame (switch from depressed to not depressed)
    //
    getKeyUp(keyCode) {
      const keyWasDepressed = this.getKeyDepressedPrev(keyCode);
      const keyIsDepressed = this.getKeyDepressed(keyCode);

      return (!keyIsDepressed && keyWasDepressed);
    }

    // Per-frame update function
    //
    update() {
      // Swap the event buffer into the active events, and clear the event buffer
      this.events = this.eventBuffer;
      this.eventBuffer = [];

      // Update the key state based on the received events
      this.keyDepressedPrev = this.keyDepressed.slice(); // copy old state into previous
      for (let eventIndex = 0; eventIndex < this.events.length; eventIndex++) {
        const currentEvent = this.events[eventIndex];

        // Check for "keydown" and "keyup" events
        if (currentEvent.type === "keydown") {
          this.keyDepressed[currentEvent.keyCode] = true;
        } else if (currentEvent.type === "keyup") {
          this.keyDepressed[currentEvent.keyCode] = false;
        }
      }
    }
  }

}(window.JJ.BE.Input = window.JJ.BE.Input || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));