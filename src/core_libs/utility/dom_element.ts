import assert from "../../core_libs/system/assert.js";

/**
 * Search's a DOM element's children recursively for a child (or decendent) with matching id
 * @param {Node} element - The parent DOM Node to search the children of
 * @param {string} id - The string ID of the child element to locate
 * @return {HTMLElement} The first child with matching ID, or (null) if no matchiing child was found
 */
export function findElementByID(element: Node, id: string): HTMLElement{
  // Check that the element is valid
  if (!assert((element != undefined), "Invalid element passed.")) {
    return null;
  }

  // Search all of the elements children nodes
  for (let childIndex = 0; childIndex < element.childNodes.length; childIndex++) {
    let childNode = element.childNodes[childIndex];

    // Check if the child element matches the ID
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      let childElement = childNode as HTMLElement;
      if (childElement.id === id) {
        return childElement;
      }
    }

    // Search the child's children
    let decendent = findElementByID(childNode, id);
    if (decendent != null) {
      return decendent;
    }
  }

  return null;
}

/**
 * Search's a DOM element's children recursively for a child (or decendent) with matching class
 * @param {Node} element - The parent DOM element to search the children of
 * @param {string} className - The className of the child element to locate
 * @return {HTMLElement} The first child with matching ID, or (null) if no matchiing child was found
 */
export function findElementByClass(element: Node, className: string): HTMLElement {
  // Check that the element is valid
  if (!assert((element != undefined), "Invalid element passed.")) {
    return null;
  }

  // Search all of the elements children nodes
  for (let childIndex = 0; childIndex < element.childNodes.length; childIndex++) {
    let childNode = element.childNodes[childIndex];


    // Check if the child element matches the ID
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      let childElement = childNode as HTMLElement;
      if (childElement.className === className) {
        return childElement;
      }
    }

    // Search the child's children
    let decendent = findElementByClass(childNode, className);
    if (decendent != null) {
      return decendent;
    }
  }

  return null;
}
