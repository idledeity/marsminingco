(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // The BehaviorTreeSequenceNode iterates through each of it's children, processing them in sequence.
  //
  // Starting with the first child node, the node is processed until it returns success or failure. If a child returns
  // success, the next child in the sequence is processed. However, if a child returns failure, the sequence will
  // immediately stop processing, returning failure to it's parent. If all child nodes in the sequence process
  // successfuly, this sequence node will return success to it's parent.
  //
  Behavior.BehaviorTreeSequenceNode = class BehaviorTreeSequenceNode extends Behavior.BehaviorTreeCompositeNode {
    // Constructor
    constructor() {
      super();
      // Nothing to do
    }

    // Enter function called when this node begins running
    enter() {
      // Call enter on the super class
      super.enter();

      // Set the first node active
      this.setActiveChild(0);
    }

    // Exit funcitno called when this node end running
    exit(fromAbort) {
      // Call exit on the super class
      super.exit(fromAbort);
    }

    // Per-frame update function called on this node while it is running.
    process(deltaMs) {
      // Call process on the super class
      const baseResult = super.process(deltaMs);
      if (baseResult == Behavior.BehaviorTreeNodeResult.FAILURE) {
        return Behavior.BehaviorTreeNodeResult.FAILURE;
      }

      // Process the children until one return "running" or "failure"
      let activeChild = this.getActiveChild();
      JJ.System.assert((activeChild != null), "There should always be an active child during the process step.");
      while(activeChild != null) {
        // Process the active child
        const childProcessResult = activeChild.process(deltaMs);

        // Handle the result returned from the child
        if (childProcessResult == Behavior.BehaviorTreeNodeResult.RUNNING) {
          // The active child is still running, so we're done for this frame
          return Behavior.BehaviorTreeNodeResult.RUNNING;
        } else if (childProcessResult == Behavior.BehaviorTreeNodeResult.SUCCESS) {
          // Check if we've reached the last node
          if ((this.getActiveChildIndex() + 1) >= this.getChildNodeCount()) {
            // The last node in the sequence returned success, so return success ourselves
            return Behavior.BehaviorTreeNodeResult.SUCCESS;
          }
        } else if (childProcessResult == Behavior.BehaviorTreeNodeResult.FAILURE) {
          // If any child fails, immediately return failure ourselves
          return Behavior.BehaviorTreeNodeResult.FAILURE;
        } else {
          // Unknown type
          JJ.System.assert(false, "Unrecognized BehaviorTreeNodeResult type");
          return Behavior.BehaviorTreeNodeResult.FAILURE;
        }

        // Activate the next child
        this.setActiveChild(this.getActiveChildIndex() + 1);
        activeChild = this.getActiveChild();
      }
    }

  }

}(window.JJ.BE.AI.Behavior = window.JJ.BE.AI.Behavior || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));