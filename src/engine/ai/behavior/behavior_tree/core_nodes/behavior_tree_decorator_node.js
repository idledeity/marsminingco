(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  /**
   * BehaviorTreeDecoratorNode is the base for all of the "decorator" nodes in the behavior tree.
   *
   * Decorator nodes are intended to processes a single child node, and modify the child node's process result sent
   * to the parent node. Example decorator nodes include an invertor node that inverts the process result of its child
   * from success to failure and vice-versa, or an succeeder node that always returns success regardless of the child
   * process return value.
   * @extends JJ.BE.AI.Behavior.BehaviorTreeNode
   */
  JJ.BE.AI.Behavior.BehaviorTreeDecoratorNode = class BehaviorTreeDecoratorNode extends Behavior.BehaviorTreeNode {
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
      // Decorator nodes may only have a single child
      if (JJ.System.assert((this.getChildNodeCount() == 0), "Decorator nodes may only have one child node.")) {
        return false;
      }

      // Call the super function
      return super.appendChildNode(newChildNode);
    }

    /**
     * Inserts a new child node to this node's children, at the specified index
     * @param {JJ.BE.AI.Behavior.BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
     * @param {Number} insertAtIndex - The index where the new child should be insterted into this node's child list
     * @return {Boolean} True if the child node was successfully inserted into the node's child list, False if there was
     *   an error
     */
    insertChildNode(newChildNode, insertAtIndex) {
      // Decorator nodes may only have a single child
      if (JJ.System.assert((this.getChildNodeCount() == 0), "Decorator nodes may only have one child node.")){
        return false;
      }

      // Call the super function
      return super.insertChildNode(newChildNode, insertAtIndex);
    }
  }

}(window.JJ.BE.AI.Behavior = window.JJ.BE.AI.Behavior || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));