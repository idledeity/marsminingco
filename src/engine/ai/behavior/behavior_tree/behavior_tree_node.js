(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  /**
   * Enumeration of possible results of a BehaviorTreeNode process function, returned to the calling parent node
   * @enum {Number}
   * @readonly
   */
  JJ.BE.AI.Behavior.BehaviorTreeNodeResult = {
    RUNNING: 0,
    SUCCESS: 1,
    FAILURE: 2,
  }

  /**
   * Base class representing an individual node in the Behavior Tree model
   */
  JJ.BE.AI.Behavior.BehaviorTreeNode = class BehaviorTreeNode {
    /**
     * Constructor for the base BehaviorTreeNode
     */
    constructor() {
      this.childNodes = [];         // array of all of this node's children nodes

      this.running = false;         // whether the node is actively running
      this.activeChildIndex = -1;   // index of the active running child node (if any is active)
    }

    /**
     * Returns whether or not this behavior tree node is actively running
     * @return {Boolean} Returns whether the behavior node is actively running
     */
    isRunning() {
      return this.running;
    }

    /**
     * Returns the current number of children
     * @return {Number} The number of children behavior tree nodes
     */
    getChildNodeCount() {
      return this.childNodes.length;
    }

    /**
     * Returns the index of the active child node
     * @return {Number} The index of the active child node
     */
    getActiveChildIndex() {
      return this.activeChildIndex;
    }

    /**
     * Returns true if the child index is valid, false if it lies outside of bounds and is invalid
     * @param {Number} childIndex - The index of the child node to check for validity
     * @return {Boolean} Whether the passed index is a valid child index for this BehaviorTreeNode
     */
    childIndexIsValid(childIndex) {
      return (childIndex >= 0 && childIndex < this.childNodes.length);
    }

    /**
     * Appends a new child node to this node's children
     * @param {JJ.BE.AI.Behavior.BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
     * @return {Boolean} True if the child node was successfully appended to this node's child list, False if there was
     *   an error
     */
    appendChildNode(newChildNode) {
      if (newChildNode == null) {
        return false;
      }

      // Ensure the new child node object is of the proper type
      if (!JJ.System.assert((newChildNode instanceof Behavior.BehaviorTreeNode),
          "BehaviorTree nodes must be derived from Behavior.BehaviorTreeNodeResult")) {
        return false;
      }

      // Push the new child node onto the end of the array
      this.childNodes.push(newChildNode);
      return true;
    }

    /**
     * Inserts a new child node to this node's children, at the specified index
     * @param {JJ.BE.AI.Behavior.BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
     * @param {Number} insertAtIndex - The index where the new child should be insterted into this node's child list
     * @return {Boolean} True if the child node was successfully inserted into the node's child list, False if there was
     *   an error
     */
    insertChildNode(newChildNode, insertAtIndex) {
      if (newChildNode == null) {
        return false;
      }

      // Ensure the new child node object is of the proper type
      if (!JJ.System.assert((newChildNode instanceof Behavior.BehaviorTreeNode),
          "BehaviorTree nodes must be derived from Behavior.BehaviorTreeNodeResult")) {
        return false;
      }

      // Ensure the insert index is valid
      if (!JJ.System.assert(this.childIndexIsValid(insertAtIndex), "insertAtIndex outside of array bounds.")) {
        return false
      }

      // Splice the new child node into the array at the specified insert index
      this.childNodes.splice(insterAtIndex, 0, newChildNode);

      // If the active child index matches the insertion index, update the active child index
      if (insertAtIndex == this.activeChildIndex) {
        this.activeChildIndex += 1; // the active child node is now one slot further in the array
      }

      return true;
    }

    /**
     * Returns the actively running child node if one is active, or (null) if no child nodes are actively running
     * @return {JJ.BE.AI.Behavior.BehaviorTreeNode} The actively running child node if one is active, otherwise (null)
     */
    getActiveChild() {
      // Cannot have an active child if the node isn't currently running
      if (!this.isRunning()) {
        return null
      }

      // Check if the active child index is outside of bounds
      if (!this.childIndexIsValid(this.activeChildIndex)) {
        return null;
      }

      // Return the active child node
      return this.childNodes[this.activeChildIndex];
    }

    /**
     * Set the actively running child node by index, handling exiting any currently running nodes
     * @param {Number} childIndex - The index of the child index to set as the active child
     * @return {Boolean} True if the child behavior at the specified index was set active, False if there was an error
     */
    setActiveChild(childIndex) {
      if (!this.childIndexIsValid(childIndex)) {
        console.assert(this.childIndexIsValid(childIndex), "childIndex outside of array bounds.");
        return false;
      }

      // If the new child index matches the current active child index, then nothing to do
      if (childIndex != this.activeChildIndex) {
        // First, tell any active child to exit
        let activeChild = this.getActiveChild();
        if (activeChild != null) {
          activeChild.exit();
        }

        // Tell the newly active child to "enter" and record the it's index as the active once
        this.childNodes[childIndex].enter();
        this.activeChildIndex = childIndex;
      }

      return true;
    }

    /**
     * Enter function called when this node begins running
     */
    enter() {
      JJ.System.assert(!this.isRunning(), "BehaviorTreeNode enter function called while already running.");

      // Record that this node is now running
      this.running = true;
    }

    /**
     * Exit function called when this node end running
     * @param {Boolean} fromAbort - True if this behavior is exiting as a result of being aborted, False otherwise
     */
    exit(fromAbort) {
      JJ.System.assert(this.isRunning(), "BehaviorTreeNode exit function called on a node that isn't running.");

      // If there is an active child running, tell it to exit first (exit from the "bottom up")
      let activeChild = this.getActiveChild();
      if (activeChild != null && activeChild.isRunning()) {
        activeChild.exit(fromAbort);
      }

      // Record that this node is no longer running
      this.running = false;
    }

    /**
     * Per-frame update function called on this node while it is running.
     * @param {Number} deltaMs - The elapsed simulation time in milliseconds since the last process was called
     * @return {JJ.BE.AI.Behavior.BehaviorTreeNodeResult} The current status of this BehaviorTreeNode after processing
     */
    process(deltaMs) {
      // Handle the case of process being called on a node that isn't running
      if (!JJ.System.assert(this.isRunning(),
        "BehaviorTreeNode process fuction called on a node that isn't running.")){
        return Behavior.BehaviorTreeNodeResult.FAILURE;
      }

      return Behavior.BehaviorTreeNodeResult.SUCCESS;
    }
  }

}(window.JJ.BE.AI.Behavior = window.JJ.BE.AI.Behavior || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));