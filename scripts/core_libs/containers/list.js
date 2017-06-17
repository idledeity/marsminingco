(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  /**
   * Container for storing an element in a list with next and previous references
   * @private
   */
  class ListElement {
    constructor(target, nextElement, prevElement) {
      this.target = target;           // reference to object in the list
      this.nextElement = nextElement; // reference to the next element in the list
      this.prevElement = prevElement; // reference to the previous element in the list
    }
  }

  /**
   * A simple container wrapping an unsorted doubly linked list of objects
   */
  JJ.Containers.List = class List {
    /**
     * Create a new list
     */
    constructor(linkNode, linkWeight) {
      this.head = null;
    }

    /**
     * Prepends the object at the front of the list
     * @param {Object} object - The object to prepend at the beginning of the list
     */
    prepend(object) {
      // Create a new element
      let listElement = new ListElement(object, this.head, null);

      // Update the previous element on the head node
      if (this.head != null) {
        this.head.prevElement = listElement;
      }

      // Insert the element at the head
      this.head = listElement;
    }

    /**
     * Removes an object from the list
     * @param {Object} object - The object to be removed from the list
     */
    remove(object) {
      // Search the the link element targeting the object
      let linkElement = this.findLinkElement(object);

      // If a valid link element was found, remove it from the linked list
      if (linkElement != null) {
        // If the removed link element has a valid previous element, then update the next element it points to
        if (linkElement.prevElement != null) {
          linkElement.prevElement.nextElement = linkElement.nextElement;
        }

        // If the removed link element has a valid next element, then update the previous element it points to
        if (linkElement.nextElement != null) {
          linkElement.nextElement.prevElement = linkElement.prevElement;
        }

        // And finally, check if the removed link element is the current head
        if (this.head === linkElement) {
          this.head = null;
        }
      }
    }

    /**
     * Returns true if the list is empty, false if there is at least one element in the list
     * @return {Boolean} Whether or not the list is empty
     */
    isEmpty() {
      return (this.head == null);
    }

    /**
     * Returns true if the list contains the object
     * @return {Boolean} True if the list contains the object, False if it does not
     */
    containsObject(object) {
      return (this.findLinkElement(object) != null);
    }

    /**
     * Iterates over all the elements in the list, calling the passed functino on each object
     * @param {JJ.Containers.List~forEachCBFunc} func - The function to be run on each element in the list.
     */
    /**
     * @callback JJ.Containers.List~forEachCBFunc
     * @param {Object} object - current element in the list being processed
     * @return {Boolean} True to stop processing, False (or nothing) to continue processing the list of elements
     */
    forEach(func) {
      // Search the list for the specified object
      let currentElement = this.head;
      while(currentElement != null) {
        // Call the function
        const stopLooping = func(currentElement.target);

        // Decide whether to continue the search with the next element
        if (stopLooping) {
          currentElement = null;
        } else {
          currentElement = currentElement.nextElement;
        }
      }
    }

    /**
     * Searches the list for the link object that is targeting the passed object and returns it, null otherwise
     * @param {Object} object - the object to search for
     * @return {ListElement} The list element that references the passed object, or null if no match was found
     * @private
     */
    findLinkElement(object) {
      // Search the list for the specified object
      let currentElement = this.head;
      while(currentElement != null) {
        // Check if there is a match
        if (currentElement.target === object) {
          return currentElement;
        }

        // Continue the search with the next element
        currentElement = currentElement.nextElement;
      }

      // Searched the whole list without a match, return null
      return null;
    }

  }


}(window.JJ.Containers = window.JJ.Containers || {}));
}(window.JJ = window.JJ || {}));