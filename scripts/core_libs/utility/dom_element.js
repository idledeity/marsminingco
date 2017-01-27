(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(Utility, undefined) { /* Utility submodule namespace */
(function(DOM, undefined) { /* DOM submodule namespace */

  // Search's a DOM element's children recursively for a child (or decendent) with matching id
  //
  DOM.findElementChildByID = function(element, id) {
    // Check that the element is valid
    if (!JJ.System.assert((element != undefined), "Invalid element passed.")) {
      return null;
    }

    // Search all of the elements children nodes
    for (let childIndex = 0; childIndex < element.childNodes.length; childIndex++) {
      let childElement = element.childNodes[childIndex];

      // Check if the child element matches the ID
      if (childElement.id == id) {
        return childElement;
      }

      // Search the child's children
      let decendent = DOM.findElementChildByID(childElement, id);
      if (decendent != null) {
        return decendent;
      }
    }

    return null;
  }

  // Search's a DOM element's children recursively for a child (or decendent) with matching class
  //
  DOM.findElementChildByClass = function(element, className) {
    // Check that the element is valid
    if (!JJ.System.assert((element != undefined), "Invalid element passed.")) {
      return null;
    }

    // Search all of the elements children nodes
    for (let childIndex = 0; childIndex < element.childNodes.length; childIndex++) {
      let childElement = element.childNodes[childIndex];

      // Check if the child element matches the ID
      if (childElement.className == className) {
        return childElement;
      }

      // Search the child's children
      let decendent = DOM.findElementChildByClass(childElement, className);
      if (decendent != null) {
        return decendent;
      }
    }

    return null;
  }

}(window.JJ.Utility.DOM = window.JJ.Utility.DOM || {}));
}(window.JJ.Utility = window.JJ.Utility || {}));
}(window.JJ = window.JJ || {}));
