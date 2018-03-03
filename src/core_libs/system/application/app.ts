export default class App {
  private timestampMs: number;
  private timestampPrevMs: number;

  /**
   * Constructor
   */
  constructor() {
    this.timestampMs = 0.0;
    this.timestampPrevMs = 0.0;
  }

  /**
   * Per-frame updating
   * @param deltaTimeMs - the elapsed time in MS since the last time update was called 
   */
  update(deltaTimeMs: number) {

  }

  /**
   * This is the primary game loop for the application
   * @param {number} timestampMs - The current system timestamp for the elapsed number of milliseconds
   */
  mainLoop(timestampMs) {
    // Update the applications's running time with the new timestamp
    this.timestampPrevMs = this.timestampMs;
    this.timestampMs = timestampMs;
    const deltaTimeMs = this.timestampMs - this.timestampPrevMs;

    this.update(deltaTimeMs);

    // Request the main loop to be called again after the browser has rendered the window
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  /**
   * This is the primary entry point for the application, initiating the main loop
   */
  runApp() {
    requestAnimationFrame(this.mainLoop.bind(this));
  }
}