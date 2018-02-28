import BehaviorTreeCompositeNode from "../behavior_tree_composite_node.js";
import { BehaviorTreeNodeStatus } from "../../behavior_tree_node.js";

import assert from "../../../../../../core_libs/system/assert.js";

/**
 * The BehaviorTreeSequenceNode iterates through each of it's children, processing them in sequence.
 *
 * Starting with the first child node, the node is processed until it returns success or failure. If a child returns
 * success, the next child in the sequence is processed. However, if a child returns failure, the sequence will
 * immediately stop processing, returning failure to it's parent. If all child nodes in the sequence process
 * successfuly, this sequence node will return success to it's parent.
 * @extends BehaviorTreeCompositeNode
 */
export default class BehaviorTreeSequenceNode extends BehaviorTreeCompositeNode {
  /**
   * Constructor
   */
  constructor() {
    super();
    // Nothing to do
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

    // Set the first node active
    this.setActiveChild(0);

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

    // Process the children until one returns "running" or "failure"
    let activeChild = this.getActiveChild();
    if (activeChild == null) {
      assert((activeChild != null), "There should always be an active child during the process step.");
      return BehaviorTreeNodeStatus.FAILURE;
    }
    
    let returnStatus = BehaviorTreeNodeStatus.RUNNING;
    while(activeChild != null && returnStatus == BehaviorTreeNodeStatus.RUNNING) {
      // Process the active child
      const childProcessResult = activeChild.process(deltaMs);

      // Handle the result returned from the child
      switch(childProcessResult) {
        case BehaviorTreeNodeStatus.RUNNING:
          // The active child is still running, so we're done for this frame
          returnStatus = BehaviorTreeNodeStatus.RUNNING;
          break;
        case BehaviorTreeNodeStatus.SUCCESS:
          // Check if we've reached the last node
          if ((this.getActiveChildIndex() + 1) < this.getChildNodeCount()) {
            // The last node in the sequence returned success, so return success ourselves
            returnStatus = BehaviorTreeNodeStatus.SUCCESS;
          }
          break;
        case BehaviorTreeNodeStatus.FAILURE:
          // If any child fails, immediately return failure ourselves
          returnStatus = BehaviorTreeNodeStatus.FAILURE;
          break;
        default:
          // Unknown type
          assert(false, "Unrecognized BehaviorTreeNodeStatus type");
          returnStatus = BehaviorTreeNodeStatus.FAILURE;
          break;
      }

      // Activate the next child
      this.setActiveChild(this.getActiveChildIndex() + 1);
      activeChild = this.getActiveChild();
    }

    return BehaviorTreeNodeStatus.FAILURE;
  }

}
