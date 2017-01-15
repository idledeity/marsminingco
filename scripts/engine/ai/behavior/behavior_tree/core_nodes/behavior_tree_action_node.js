(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // BehaviorTreeActionNode is the base for all of the action nodes in the behavior tree.
  //
  // Action nodes are intended to be leaf nodes on the BehaviorTree's graph, and perform some "action". As leaf nodes,
  // Action nodes may not have any children nodes.
  //
  Behavior.BehaviorTreeActionNode = class BehaviorTreeActionNode extends Behavior.BehaviorTreeNode {
    // Constructor
    constructor() {
      super();
      // Nothing to do
    }

    // Appends a new child node to this node's children
    appendChildNode(newChildNode) {
      // Action nodes may not have chilren
      JJ.System.assert(false, "Action nodes may not have children.");
    }

    // Inserts a new child node to this node's children at the specified index
    insertChildNode(newChildNode, insertAtIndex) {
      // Action nodes may not have chilren
      JJ.System.assert(false, "Action nodes may not have children.");
    }
  }

}(window.JJ.BE.AI.Behavior = window.JJ.BE.AI.Behavior || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));