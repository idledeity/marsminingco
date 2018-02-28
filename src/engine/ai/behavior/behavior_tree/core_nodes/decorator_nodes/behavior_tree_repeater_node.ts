import { BehaviorTreeNodeStatus } from "../../behavior_tree_node.js";
import BehaviorTreeDecoratorNode from "../behavior_tree_decorator_node.js";

import assert from "../../../../../../core_libs/system/assert.js";

/**
 * BehaviorTreeRepeaterNode repeats a single child node forever
 * @extends BehaviorTreeDecoratorNode
 */
export default class BehaviorTreeRepeaterNode extends BehaviorTreeDecoratorNode {
  /**
   * Constructor
   */
  constructor() {
    super();

    // Nothing to do
  }

  /**
   * Returns true if the node should repeat
   * @param {BehaviorTreeNodeStatus} childProcessResult - The result of the child process
   * @return {boolean} True if the behavior node was setup correctly, False if there was an error and the node should be aborted
   */
  shouldRepeat(childProcessResult: BehaviorTreeNodeStatus) {
    return true;
  }

  /**
   * Enter function called when this node begins running
   * @return {boolean} True if the behavior node was setup correctly, False if there was an error and the node should be aborted
   */
  enter(): boolean {
    // Call enter on the super class
    if (!super.enter()) {
      return false;
    }

    // Set the active child as the first (and only) child
    this.setActiveChild(0);

    return true;
  }

  /**
   * Exit function called when this node end running
   * @param {boolean} fromAbort - True if this behavior is exiting as a result of being aborted, False otherwise
   */
  exit(fromAbort: boolean) {
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

    // Get the active child
    let activeChild = this.getActiveChild();
    if (!assert((activeChild != null), "There should always be an active child during the process step.")) {
      return BehaviorTreeNodeStatus.FAILURE;
    }

    // Process the child
    const childProcessResult = activeChild.process(deltaMs);
    let returnResult = BehaviorTreeNodeStatus.RUNNING;

    // If the child node completed, check if it should be repeated
    if ((childProcessResult == BehaviorTreeNodeStatus.SUCCESS) ||
        (childProcessResult == BehaviorTreeNodeStatus.FAILURE)) {
      // Check if it should repeat
      if (this.shouldRepeat(childProcessResult)) {
        // Tell the child to exit and immediately enter again
        activeChild.exit(false);
        activeChild.enter();
      } else {
        // If not repeating, use the child's return result as our own
        returnResult = childProcessResult;
      }
    }

    // Return the result
    return returnResult;
  }

}
