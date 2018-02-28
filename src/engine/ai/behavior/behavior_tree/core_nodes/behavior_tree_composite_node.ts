import { BehaviorTreeNode } from "../behavior_tree_node.js";

import assert from "../../../../../core_libs/system/assert.js";

/**
 * BehaviorTreeCompositeNode is the base for all of the composite nodes in the behavior tree.
 *
 * Composite nodes have no restrictions on the maximum number of children, but should have at least one child. Nodes
 * with no children should instead be "action" nodes.
 * @extends BehaviorTreeNode
 */
export default class BehaviorTreeCompositeNode extends BehaviorTreeNode {
  /**
   * Constructor
   */
  constructor() {
    super();
    // Nothing to do
  }

  /**
   * Enter function called when this node begins running
   * @return {boolean} True if the behavior node was setup correctly, False if there was an error and the node should be aborted
   */
  enter(): boolean {
    // Call enter on the super function
    if (!super.enter()) {
      return false;
    }

    // Ensure this composite nodes has at least one child
    assert((this.getChildNodeCount() > 0), "BehaviorTreeCompositeNode require at least one child node.");
    return true;
  }
}
