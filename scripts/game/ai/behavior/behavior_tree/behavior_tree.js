(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // Enumeration of possible BehaviorTree states
  const BehaviorTreeState = {
    IDLE: 0,
    ACTIVE: 1,
    SUCCESS: 2,
    FAILURE: 3,
  }

  // The BehaviorTree class represents various "behaviors" in a hierarchical form.
  //
  // Processing the tree begins each frame with the root node in the tree, which evaluates which child node (if any) 
  // should be processed. Processing continues "down" the tree, with each node processing and then returning to its 
  // parent wether it "succeeded", "failed", or "is not yet complete". Each parent node can handle the returned values 
  // as necessary for it's defined behavior, and in turn returns a result to it's parent, until the root node is 
  // reached again.
  // 
  Behavior.BehaviorTree = class BehaviorTree {
    // Constructor
    constructor() {
      var _rootNode = null;
      var _treeState = BehaviorTreeState.IDLE;

      this.rootNode = _rootNode;      // The root node of the behavior tree
      this.treeState = _treeState;    // The current state of the behavior tree
    }

    // Returns true if the behavior tree is "active", false if it is either "idle" or has completed
    isActive() {
      return (this.treeState == BehaviorTreeState.ACTIVE);
    }

    // Returns true if the behavior tree has completed (either "success" or "failure"), false otherwise
    isComplete() {
      return (this.treeState == BehaviorTreeState.SUCCESS || this.treeState == BehaviorTreeState.FAILURE);
    }

    // Returns true if the behavior tree has completed with success, false otherwise
    wasSuccess() {
      return (this.treeState == BehaviorTreeState.SUCCESS);
    }

    // Returns true if the behavior tree has completed with failure, false otherwise
    wasFailure() {
      return (this.treeState == BehaviorTreeState.FAILURE);
    }

    // Activates the behavior tree to begin processing it's BehaviorTreeNodes starting at the root node
    activate() {
      // Ensure there is a root node
      if (this.rootNode == null) {
        return false;
      }

      // Ensure the tree is not already active
      if (this.isActive()) {
        return false;
      }

      // Start the root node and set the tree state as active
      this.rootNode.enter()
      this.treeState = BehaviorTreeState.ACTIVE;

      return true;
    }

    // Called to deactivate the behavior tree, aborting any BehaviorTreeNodes that may be processing
    deactivate() {
      // Ensure the tree is active
      if (!this.isActive()) {
        return false;
      }

      // Tell the root node to abort all actions
      const fromAbort = true;
      this.rootNode.exit(fromAbort);

      // Update the tree state to idle
      this.treeState = BehaviorTreeState.IDLE;
    }

    // Per-frame update on the behavior tree, which handles processing the BehaviorTreeNodes while the tree is active
    update(deltaMs) {
      // Nothing to do if the behavior tree is inactive
      if (!this.isActive()) {
        return;
      }

      // Update the tree via the root node
      const result = this.rootNode.process(deltaMs);

      // Handle the result
      switch(result) {
        case Behavior.BehaviorTreeNodeResult.RUNNING: {
          // Nothing to do if the tree is still running normally
          break;
        }
        case Behavior.BehaviorTreeNodeResult.SUCCESS: {
          // The tree has completed with "success", exit the root node and record the result
          this.rootNode.exit();
          this.treeState = BehaviorTreeState.SUCCESS;
          break;
        }
        case Behavior.BehaviorTreeNodeResult.FAILURE: {
          // The tree has completed with "failure", exit the root node and record the result
          this.rootNode.exit();
          this.treeState = BehaviorTreeState.FAILURE;
          break;
        }
        default: {
          console.assert(false, "Unexpected BehaviorTreeNodeResult encountered.");
          break;
        }
      }
    }

    // Returns the root BehaviorTreeNode of this tree
    getRootNode() {
      return this.rootNode;
    }

    // Sets the root BehaviorTreeNode of this tree
    setRootNode(newRootNode) {
      if (newRootNode != null) {
        // Ensure the new root node object is of the proper type
        if (!(newRootNode instanceof Behavior.BehaviorTreeNode)) {
          console.assert(newRootNode instanceof Behavior.BehaviorTreeNode, 
            "BehaviorTree root nodes must be derived from Behavior.BehaviorTreeNodeResult");
          return false;
        }
      }

      // If the behavior tree is active, we must first stop any previous action
      if (this.isActive()) {
        this.deactivate();
      }

      // Update the root node and return success
      this.rootNode = newRootNode;
      return true;
    }

  }

}(window.MMC.AI.Behavior = window.MMC.AI.Behavior || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));