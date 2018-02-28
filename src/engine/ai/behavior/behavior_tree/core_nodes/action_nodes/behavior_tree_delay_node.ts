import BehaviorTreeActionNode from "../behavior_tree_action_node.js";
import { BehaviorTreeNodeStatus } from "../../behavior_tree_node.js";

import { random } from "../../../../../../core_libs/math/random.js";
import assert from "../../../../../../core_libs/system/assert.js";

/**
 * BehaviorTreeDelayNode is an action node that simply delays for a certain amount of time
 * @extends Behavior.BehaviorTreeActionNode
 */
export default class BehaviorTreeDelayNode extends BehaviorTreeActionNode {
  private delayTimeMinMs: number; // Minimum delay time (MS)
  private delayTimeMaxMs: number; // Maximum delay time (MS)
  private delayTimeMs: number;    // Current random delay time between [min, max) (MS)
  private elapsedTimeMs: number;  // Elapsed time since the node started processing (MS)

  /**
   * Constructor to create a new BehaviorTreeDelayNode
   * @param {number} [delayTimeMinMs=0.0] - The minimum delay time in milliseconds
   * @param {number} [delayTimeMaxMs=delayTimeMinMs] - The maximum delay time in milliseconds
   */
  constructor(delayTimeMinMs?: number, delayTimeMaxMs?: number) {
    super();

    // Handle missing arguments
    if (delayTimeMinMs == undefined) {
      delayTimeMinMs = 0.0;
    }
    if (delayTimeMaxMs == undefined) {
      delayTimeMaxMs = delayTimeMinMs;
    }

    // Ensure the max value is greater or equal to the min value
    assert((delayTimeMaxMs >= delayTimeMinMs), "delayTimeMaxMs must be greater than delayTimeMinMs.");

    this.delayTimeMinMs = delayTimeMinMs;      
    this.delayTimeMaxMs = delayTimeMaxMs;      
    this.delayTimeMs = 0.0;    
    this.elapsedTimeMs = 0.0;             
  }

  /**
   * Returns a random delay time based on the min and max values
   * @return {number} A randomized delay time in milliseconds between the minimum and maximum value
   */
  getRandomDelayTimeMs() {
    const delta = this.delayTimeMaxMs - this.delayTimeMinMs;
    return this.delayTimeMinMs + (random() * delta);
  }

  /**
   * Enter function called when this node begins running
   * @return {boolean} True if the behavior node was setup correctly, False if there was an error and the node should be aborted
   * */
  enter(): boolean {
    // Call enter on the super class
    if (!super.enter()) {
      return false;
    }

    // Calculate how long this node will delay
    this.delayTimeMs = this.getRandomDelayTimeMs();
    this.elapsedTimeMs = 0.0;

    return true;
  }

  /**
   * Exit function called when this node end running
   * @param {boolean} fromAbort - True if this behavior is exiting as a result of being aborted, False otherwise
   */
  exit(fromAbort: boolean): void {
    // Call exit on the super class
    super.exit(fromAbort);
  }

  /**
   * Per-frame update function called on this node while it is running.
   * @param {number} deltaMs - The elapsed simulation time in milliseconds since the last process was called
   * @return {BehaviorTreeNodeStatus} The current status of this BehaviorTreeNode after processing
   */
  process(deltaMs: number): BehaviorTreeNodeStatus {
    // Call process on the super class
    const baseResult = super.process(deltaMs);
    if (baseResult == BehaviorTreeNodeStatus.FAILURE) {
      return BehaviorTreeNodeStatus.FAILURE;
    }

    // If the active duration is greater or equal to the delay time, return success
    if (this.elapsedTimeMs >= this.delayTimeMs) {
      return BehaviorTreeNodeStatus.SUCCESS;
    }

    // Update the duration this node has been active
    this.elapsedTimeMs += deltaMs;
    return BehaviorTreeNodeStatus.RUNNING;
  }
}
