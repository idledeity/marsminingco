(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // BehaviorTreeRepeaterNode repeats a single child node forever
  //
  Behavior.BehaviorTreeRepeaterNode = class BehaviorTreeRepeaterNode extends Behavior.BehaviorTreeDecoratorNode {
    // Constructor
    constructor() {
      super();
      // Nothing to do
    }

    // Returns true if the node should repeat
    shouldRepeat(childProcessResult) {
      return true;
    }

    // Enter function called when this node begins running
    enter() {
      // Call enter on the super class
      super.enter();

      // Set the active child as the first (and only) child
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

      // Get the active child
      let activeChild = this.getActiveChild();
      if (!MMC.System.assert((activeChild != null), "There should always be an active child during the process step.")) {
        return Behavior.BehaviorTreeNodeResult.FAILURE; 
      }

      // Process the child
      const childProcessResult = activeChild.process(deltaMs);
      let returnResult = Behavior.BehaviorTreeNodeResult.RUNNING;

      // If the child node completed, check if it should be repeated
      if ((childProcessResult == Behavior.BehaviorTreeNodeResult.SUCCESS) || 
          (childProcessResult == Behavior.BehaviorTreeNodeResult.FAILURE)) {
        // Check if it should repeat
        if (this.shouldRepeat(childProcessResult)) {
          // Tell the child to exit and immediately enter again
          activeChild.exit();
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

}(window.MMC.AI.Behavior = window.MMC.AI.Behavior || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));