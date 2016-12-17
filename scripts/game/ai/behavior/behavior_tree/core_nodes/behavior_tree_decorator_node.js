(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // BehaviorTreeDecoratorNode is the base for all of the "decorator" nodes in the behavior tree.
  //
  // Decorator nodes are intended to processes a single child node, and modify the child node's process result sent
  // to the parent node. Example decorator nodes include an invertor node that inverts the process result of its child
  // from success to failure and vice-versa, or an succeeder node that always returns success regardless of the child 
  // process return value.
  //
  Behavior.BehaviorTreeDecoratorNode = class BehaviorTreeDecoratorNode extends Behavior.BehaviorTreeNode {
    // Constructor
    constructor() {
      super();
      // Nothing to do
    }

    // Appends a new child node to this node's children
    appendChildNode(newChildNode) {
      // Decorator nodes may only have a single child
      if (this.getChildNodeCount() > 0) {
        console.assert((this.getChildNodeCount() == 0), "Decorator nodes may only have one child node.");
        return;  
      }
      
      // Call the super function
      super.appendChildNode(newChildNode);
    }

    // Inserts a new child node to this node's children at the specified index
    insertChildNode(newChildNode, insertAtIndex) {
      // Decorator nodes may only have a single child
      if (this.getChildNodeCount() > 0) {
        console.assert((this.getChildNodeCount() == 0), "Decorator nodes may only have one child node.");
        return;  
      }

      // Call the super function
      super.insertChildNode(newChildNode, insertAtIndex);
    }
  }

}(window.MMC.AI.Behavior = window.MMC.AI.Behavior || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));