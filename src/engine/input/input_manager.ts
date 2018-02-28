import assert from "../../core_libs/system/assert.js";
import KeyboardKeyCodes from "../../core_libs/system/io/keyboard/keycodes.js";

/**
 * InputManager to manage user input
 */
export default class InputManager {
  private events: KeyboardEvent[];
  private eventBuffer: KeyboardEvent[];
  private keyDepressed: Array<boolean>;
  private keyDepressedPrev: Array<boolean>;

  /**
   * Constructor
   */
  constructor() {
    // Initialize the event buffers
    this.events = [];
    this.eventBuffer = [];

    // Initialize the key pressed state buffers
    this.keyDepressed = new Array<boolean>(KeyboardKeyCodes.KEY_COUNT);
    for (let keyIndex = 0; keyIndex < KeyboardKeyCodes.KEY_COUNT; keyIndex++) {
      this.keyDepressed[keyIndex] = false;
    }
    this.keyDepressedPrev = new Array<boolean>(KeyboardKeyCodes.KEY_COUNT);
    for (let keyIndex = 0; keyIndex < KeyboardKeyCodes.KEY_COUNT; keyIndex++) {
      this.keyDepressedPrev[keyIndex] = false;
    }

    // Reigster for keybaord events
    document.addEventListener('keydown', function(event) {
      this.eventBuffer.push(event);
    }.bind(this));
    document.addEventListener('keyup', function(event) {
      this.eventBuffer.push(event);
    }.bind(this));
  }

  /**
   * Returns the active events for the current frame
   * @return {KeyEvent[]} An array of KeyEvents received since the last update was called
   */
  getEvents() {
    return this.events;
  }

  /**
   * Returns whether a specific key is depressed on the current frame
   * @param {KeyboardKeyCodes} keyCode - The key code for the key to check
   * @return {boolean} True if the key is currently depressed, False if it is not
   */
  getKeyDepressed(keyCode: KeyboardKeyCodes) {
    // Check for invalid keycodes
    if (!assert(((keyCode >= 0) && (keyCode < KeyboardKeyCodes.KEY_COUNT)),
      "Invalid keyCode passed.")) {
      return false;
    }

    // Return the key depressed state
    return this.keyDepressed[keyCode];
  }

  /**
   * Returns whether a specific key was depressed on the previous frame
   * @param {KeyboardKeyCodes} keyCode - The key code for the key to check
   * @return {boolean} True if the key was depressed on the previous frame, False if it was not
   */
  getKeyDepressedPrev(keyCode: KeyboardKeyCodes) {
    // Check for invalid keycodes
    if (!assert(((keyCode >= 0) && (keyCode < KeyboardKeyCodes.KEY_COUNT)),
      "Invalid keyCode passed.")) {
      return false;
    }

    // Return the key depressed state
    return this.keyDepressedPrev[keyCode];
  }

  /**
   * Returns whether a key was pressed "down" this frame (switch from not depressed to depressed)
   * @param {KeyboardKeyCodes} keyCode - The key code for the key to check
   * @return {boolean} True if the key changed from not depressed to depressed during this frame, False if not
   */
  getKeyDown(keyCode: KeyboardKeyCodes) {
    const keyWasDepressed = this.getKeyDepressedPrev(keyCode);
    const keyIsDepressed = this.getKeyDepressed(keyCode);

    return (keyIsDepressed && !keyWasDepressed);
  }

  /**
   * Returns whether a key was released "up" this frame (switch from depressed to not depressed)
   * @param {KeyboardKeyCodes} keyCode - The key code for the key to check
   * @return {boolean} True if the key changed from depressed to not depressed during this frame, False if not
   */
  getKeyUp(keyCode: KeyboardKeyCodes) {
    const keyWasDepressed = this.getKeyDepressedPrev(keyCode);
    const keyIsDepressed = this.getKeyDepressed(keyCode);

    return (!keyIsDepressed && keyWasDepressed);
  }

  /**
   * Per-frame update function
   */
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
