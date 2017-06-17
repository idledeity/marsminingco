(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  /**
   * BehaviorTreeActionNode is the base for all of the action nodes in the behavior tree.
   *
   * Action nodes are intended to be leaf nodes on the BehaviorTree's graph, and perform some "action". As leaf nodes,
   * Action nodes may not have any children nodes.
   * @extends JJ.BE.AI.Behavior.BehaviorTreeNode
   */
  JJ.BE.AI.Behavior.BehaviorTreeActionNode = class BehaviorTreeActionNode extends Behavior.BehaviorTreeNode {
    /**
     * Constructor
     */
    constructor() {
      super();
      // Nothing to do
    }

    /**
     * Appends a new child node to this node's children
     * @param {JJ.BE.AI.Behavior.BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
     * @return {Boolean} True if the child node was successfully appended to this node's child list, False if there was
     *   an error
     */
    appendChildNode(newChildNode) {
      // Action nodes may not have chilren
      JJ.System.assert(false, "Action nodes may not have children.");
      return false;
    }

    /**
     * Inserts a new child node to this node's children, at the specified index
     * @param {JJ.BE.AI.Behavior.BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
     * @param {Number} insertAtIndex - The index where the new child should be insterted into this node's child list
     * @return {Boolean} True if the child node was successfully inserted into the node's child list, False if there was
     *   an error
     */
    insertChildNode(newChildNode, insertAtIndex) {
      // Action nodes may not have chilren
      JJ.System.assert(false, "Action nodes may not have children.");
      return false;
    }
  }

}(window.JJ.BE.AI.Behavior = window.JJ.BE.AI.Behavior || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));