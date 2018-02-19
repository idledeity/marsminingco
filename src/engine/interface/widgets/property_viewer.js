(function (JJ, undefined) { /* JJ module namespace */
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Interface, undefined) { /* Interface submodule namespace */

  // WIP for a viwer that creates HTML DOM objects from an object's properties
  JJ.BE.Interface.PropertyViewerWidget = class PropertyViewerWidget {
    displayProperties(obj) {
      // Look for an existing list element
      let list = document.getElementById("property_list");
      if (list == null) {
        // Create a new list
        let body = document.getElementById('game');

        // Create the list and add it to the body element
        list = document.createElement('ul');
        list.setAttribute("id", "property_list");
        body.appendChild(list)
      }

      // Loop over the object's properties, adding each one to the list
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          // Turn the property into a string
          const propertyName = property.toString();

          // Look for an existing property with matching id
          let propertyListItem = document.getElementById(propertyName);
          if (propertyListItem == null) {
            // If no property was found, generate new elements for it

            // First generate a list item, and append it to the list
            propertyListItem = document.createElement('li');
            propertyListItem.setAttribute("id", propertyName);
            list.appendChild(propertyListItem);

            // Create a div for the property name and value, and add it to the list item
            let propertyContainer = document.createElement('div');
            propertyListItem.appendChild(propertyContainer);

            // Create an element for the property name, and add it to the container
            let propertyNameText = document.createElement('b');
            propertyNameText.innerHTML = propertyName + ": ";
            propertyContainer.appendChild(propertyNameText);

            // Create an element for the property value, and add it to the container
            let propertyValueContainer = document.createElement("div");
            propertyValueContainer.className = "valueText";
            propertyContainer.appendChild(propertyValueContainer);
          }

          // Locate the property value and update the text
          propertyListItem.getElementsByClassName("valueText")[0].textContent = obj[property].toString();
        }
      }
    }
  }

}(window.JJ.BE.Interface = window.JJ.BE.Interface || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));