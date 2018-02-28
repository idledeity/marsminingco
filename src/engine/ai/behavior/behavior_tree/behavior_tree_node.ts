import assert from "../../../../core_libs/system/assert.js";

/**
 * Enumeration of possible results of a BehaviorTreeNode process function, returned to the calling parent node
 * @enum {Number}
 * @readonly
 */
export enum BehaviorTreeNodeStatus {
  RUNNING,
  SUCCESS,
  FAILURE,
}

/**
 * Base class representing an individual node in the Behavior Tree model
 */
export class BehaviorTreeNode {
  protected childNodes: BehaviorTreeNode[];
  protected running: boolean;
  protected activeChildIndex: number; 

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
   * @return {boolean} Returns whether the behavior node is actively running
   */
  isRunning() {
    return this.running;
  }

  /**
   * Returns the current number of children
   * @return {number} The number of children behavior tree nodes
   */
  getChildNodeCount() {
    return this.childNodes.length;
  }

  /**
   * Returns the index of the active child node
   * @return {number} The index of the active child node
   */
  getActiveChildIndex() {
    return this.activeChildIndex;
  }

  /**
   * Returns true if the child index is valid, false if it lies outside of bounds and is invalid
   * @param {number} childIndex - The index of the child node to check for validity
   * @return {boolean} Whether the passed index is a valid child index for this BehaviorTreeNode
   */
  childIndexIsValid(childIndex: number) {
    return (childIndex >= 0 && childIndex < this.childNodes.length);
  }

  /**
   * Appends a new child node to this node's children
   * @param {BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
   * @return {boolean} True if the child node was successfully appended to this node's child list, False if there was
   *   an error
   */
  appendChildNode(newChildNode: BehaviorTreeNode) {
    if (newChildNode == null) {
      return false;
    }

    // Push the new child node onto the end of the array
    this.childNodes.push(newChildNode);
    return true;
  }

  /**
   * Inserts a new child node to this node's children, at the specified index
   * @param {BehaviorTreeNode} newChildNode - The new child node to append to this BehaviorTreeNode
   * @param {number} insertAtIndex - The index where the new child should be insterted into this node's child list
   * @return {boolean} True if the child node was successfully inserted into the node's child list, False if there was
   *   an error
   */
  insertChildNode(newChildNode: BehaviorTreeNode, insertAtIndex: number) {
    if (newChildNode == null) {
      return false;
    }

    // Ensure the insert index is valid
    if (!assert(this.childIndexIsValid(insertAtIndex), "insertAtIndex outside of array bounds.")) {
      return false
    }

    // Splice the new child node into the array at the specified insert index
    this.childNodes.splice(insertAtIndex, 0, newChildNode);

    // If the active child index matches the insertion index, update the active child index
    if (insertAtIndex == this.activeChildIndex) {
      this.activeChildIndex += 1; // the active child node is now one slot further in the array
    }

    return true;
  }

  /**
   * Returns the actively running child node if one is active, or (null) if no child nodes are actively running
   * @return {BehaviorTreeNode} The actively running child node if one is active, otherwise (null)
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
   * @param {number} childIndex - The index of the child index to set as the active child
   * @return {boolean} True if the child behavior at the specified index was set active, False if there was an error
   */
  setActiveChild(childIndex: number) {
    if (!this.childIndexIsValid(childIndex)) {
      console.assert(this.childIndexIsValid(childIndex), "childIndex outside of array bounds.");
      return false;
    }

    // If the new child index matches the current active child index, then nothing to do
    if (childIndex != this.activeChildIndex) {
      // First, tell any active child to exit
      let activeChild = this.getActiveChild();
      if (activeChild != null) {
        activeChild.exit(true);
      }

      // Tell the newly active child to "enter" and record the it's index as the active once
      this.childNodes[childIndex].enter();
      this.activeChildIndex = childIndex;
    }

    return true;
  }

  /**
   * Enter function called when this node begins running
   * @return {boolean} True if the behavior node was setup correctly, False if there was an error and the node should be aborted
   */
  enter(): boolean {
    if (!assert(!this.isRunning(), "BehaviorTreeNode enter function called while already running.")) {
      return false;
    }

    // Record that this node is now running
    this.running = true;
    return true;
  }

  /**
   * Exit function called when this node end running
   * @param {boolean} fromAbort - True if this behavior is exiting as a result of being aborted, False otherwise
   */
  exit(fromAbort: boolean) {
    assert(this.isRunning(), "BehaviorTreeNode exit function called on a node that isn't running.");

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
   * @param {number} deltaMs - The elapsed simulation time in milliseconds since the last process was called
   * @return {BehaviorTreeNodeStatus} The current status of this BehaviorTreeNode after processing
   */
  process(deltaMs: number): BehaviorTreeNodeStatus {
    // Handle the case of process being called on a node that isn't running
    if (!assert(this.isRunning(), "BehaviorTreeNode process fuction called on a node that isn't running.")) {
      return BehaviorTreeNodeStatus.FAILURE;
    }

    return BehaviorTreeNodeStatus.SUCCESS;
  }
}
