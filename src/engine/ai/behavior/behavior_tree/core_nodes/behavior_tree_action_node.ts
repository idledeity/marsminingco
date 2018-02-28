import { BehaviorTreeNode } from "../behavior_tree_node.js";

import assert from "../../../../../core_libs/system/assert.js";

/**
 * BehaviorTreeActionNode is the base for all of the action nodes in the behavior tree.
 *
 * Action nodes are intended to be leaf nodes on the BehaviorTree's graph, and perform some "action". As leaf nodes,
 * Action nodes may not have any children nodes.
 * @extends BehaviorTreeNode
 */
export default class BehaviorTreeActionNode extends BehaviorTreeNode {
  /**
   * Constructor
   */
  constructor() {
    super();
    // Nothing to do
  }

  /**
   * Appends a new child node to this node's children
   * @param {BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
   * @return {boolean} True if the child node was successfully appended to this node's child list, False if there was
   *   an error
   */
  appendChildNode(newChildNode: BehaviorTreeNode) {
    // Action nodes may not have chilren
    assert(false, "Action nodes may not have children.");
    return false;
  }

  /**
   * Inserts a new child node to this node's children, at the specified index
   * @param {BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
   * @param {number} insertAtIndex - The index where the new child should be insterted into this node's child list
   * @return {boolean} True if the child node was successfully inserted into the node's child list, False if there was
   *   an error
   */
  insertChildNode(newChildNode: BehaviorTreeNode, insertAtIndex: number) {
    // Action nodes may not have chilren
    assert(false, "Action nodes may not have children.");
    return false;
  }
}
