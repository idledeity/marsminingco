import CharacterController from "../../controllers/character_controller.js";

/**
 * Class for controlling characters that are AI controlled
 */
export default class AICharacterController extends CharacterController {
  /**
   * Constructor
   */
  constructor() {
    super();
  }

  /**
   * Per frame update
   * @param {number} deltaMs - The elapsed simulation time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    super.update(deltaMs);
  }
}
