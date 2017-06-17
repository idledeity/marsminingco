(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  /**
   * Enumeration of possible BehaviorTree states
   * @enum {Number}
   * @readonly
   */
  const BehaviorTreeState = {
    IDLE: 0,
    ACTIVE: 1,
    SUCCESS: 2,
    FAILURE: 3,
  }

  /**
   * The BehaviorTree class represents various "behaviors" in a hierarchical form.
   *
   * Processing the tree begins each frame with the root node in the tree, which evaluates which child node (if any)
   * should be processed. Processing continues "down" the tree, with each node processing and then returning to its
   * parent wether it "succeeded", "failed", or "is not yet complete". Each parent node can handle the returned values
   * as necessary for it's defined behavior, and in turn returns a result to it's parent, until the root node is
   * reached again.
   */
  JJ.BE.AI.Behavior.BehaviorTree = class BehaviorTree {
    /**
     * Constructor
     */
    constructor() {
      var _rootNode = null;
      var _treeState = BehaviorTreeState.IDLE;

      this.rootNode = _rootNode;      // The root node of the behavior tree
      this.treeState = _treeState;    // The current state of the behavior tree
    }

    /**
     * Returns whether or not the behavior tree is active
     * @return {Boolean} True if the behavior tree is "active", False if it is either "idle" or has completed
     */
    isActive() {
      return (this.treeState == BehaviorTreeState.ACTIVE);
    }

    /**
     * Returns whether or not the behavior tree is complete
     * @return {Boolean} True if the behavior tree has completed (either "success" or "failure"), False otherwise
     */
    isComplete() {
      return (this.treeState == BehaviorTreeState.SUCCESS || this.treeState == BehaviorTreeState.FAILURE);
    }

    /**
     * Returns whether or not the behavior tree completed successfully
     * @return {Boolean} True if the behavior tree has completed with success, False otherwise
     */
    wasSuccess() {
      return (this.treeState == BehaviorTreeState.SUCCESS);
    }

    /**
     * Returns whether or not the behavior tree completed due to a failure
     * @return {Boolean} True if the behavior tree has completed with failure, False otherwise
     */
    wasFailure() {
      return (this.treeState == BehaviorTreeState.FAILURE);
    }

    /**
     * Activates the behavior tree to begin processing it's BehaviorTreeNodes starting at the root node
     * @return {Boolean} True if the behavior tree succesfully activated, False if there was an error
     */
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

    /**
     * Called to deactivate the behavior tree, aborting any BehaviorTreeNodes that may be actively processing
     */
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

    /**
     * Per-frame update on the behavior tree, which handles processing the BehaviorTreeNodes while the tree is active
     * @param {Number} deltaMs - The elapsed simulation time since the last time the tree was updated in milliseconds
     */
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
          JJ.System.assert(false, "Unexpected BehaviorTreeNodeResult encountered.");
          break;
        }
      }
    }

    /**
     * Returns the root BehaviorTreeNode of this tree
     * @return {JJ.BE.AI.Behavior.BehaviorTreeNode} The root node of the behavior tree
     */
    getRootNode() {
      return this.rootNode;
    }

    /**
     * Sets the root BehaviorTreeNode of this tree
     * @param {JJ.BE.AI.Behavior.BehaviorTreeNode} newRootNode - The new root node of the behavior tree
     * @return {Boolean} True if the behavior tree root node was set successfully, False otherwise
     */
    setRootNode(newRootNode) {
      if (newRootNode != null) {
        // Ensure the new root node object is of the proper type
        if (!JJ.System.assert((newRootNode instanceof Behavior.BehaviorTreeNode),
            "BehaviorTree root nodes must be derived from Behavior.BehaviorTreeNodeResult")) {
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

}(window.JJ.BE.AI.Behavior = window.JJ.BE.AI.Behavior || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));