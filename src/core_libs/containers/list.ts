/**
 * Container for storing an element in a list with next and previous references
 * @private
 */
class ListElement<T> {
  constructor(public obj: T, public nextElement: ListElement<T>, public prevElement: ListElement<T>) {
  }
}

/**
 * A simple container wrapping an unsorted doubly linked list of objects
 */
export default class List<T> {
  public head: ListElement<T>;

  /**
   * Create a new list
   */
  constructor() {
    this.head = null;
  }

  /**
   * Prepends the object at the front of the list
   * @param {T} obj - The object to prepend at the beginning of the list
   */
  prepend(obj: T) {
    // Create a new element
    let listElement = new ListElement<T>(obj, this.head, null);

    // Update the previous element on the head node
    if (this.head != null) {
      this.head.prevElement = listElement;
    }

    // Insert the element at the head
    this.head = listElement;
  }

  /**
   * Removes an object from the list
   * @param {T} obj - The object to be removed from the list
   */
  remove(obj: T) {
    // Search the the link element targeting the object
    let linkElement = this.findLinkElement(obj);

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
   * @return {boolean} Whether or not the list is empty
   */
  isEmpty() {
    return (this.head == null);
  }

  /**
   * Returns true if the list contains the object
   * @param {T} obj - The object to check if it exists in the list
   * @return {boolean} True if the list contains the object, False if it does not
   */
  containsObject(obj: T) {
    return (this.findLinkElement(obj) != null);
  }

  /**
   * Iterates over all the elements in the list, calling the passed functino on each object
   * @param {List~forEachCBFunc} func - The function to be run on each element in the list.
   */
  /**
   * @callback List~forEachCBFunc
   * @param {T} obj - current element in the list being processed
   * @return {boolean} True to stop processing, False (or nothing) to continue processing the list of elements
   */
  forEach(func: Function) {
    // Search the list for the specified object
    let currentElement = this.head;
    while(currentElement != null) {
      // Call the function
      const stopLooping = func(currentElement.obj);

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
   * @param {T} obj - the object to search for
   * @return {ListElement} The list element that references the passed object, or null if no match was found
   * @private
   */
  findLinkElement(obj) {
    // Search the list for the specified object
    let currentElement = this.head;
    while(currentElement != null) {
      // Check if there is a match
      if (currentElement.obj === obj) {
        return currentElement;
      }

      // Continue the search with the next element
      currentElement = currentElement.nextElement;
    }

    // Searched the whole list without a match, return null
    return null;
  }

}
