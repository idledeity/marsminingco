(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // BehaviorTreeCompositeNode is the base for all of the composite nodes in the behavior tree.
  //
  // Composite nodes have no restrictions on the maximum number of children, but should have at least one child. Nodes
  // with no children should instead be "action" nodes. 
  //
  Behavior.BehaviorTreeCompositeNode = class BehaviorTreeCompositeNode extends Behavior.BehaviorTreeNode {
    // Constructor
    constructor() {
      super();
      // Nothing to do
    }

    // Enter function called when this node begins running
    enter() {
      // Call enter on the super function
      super.enter();

      // Ensure this composite nodes has at least one child
      MMC.System.assert((this.getChildNodeCount() > 0), "BehaviorTreeCompositeNode require at least one child node.");
    }
  }

}(window.MMC.AI.Behavior = window.MMC.AI.Behavior || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));