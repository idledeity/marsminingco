(function (MMC, undefined) { /* MMC module namespace */
  (function(Interface, undefined) { /* Interface submodule namespace */

    // WIP for a viwer that creates HTML DOM objects from an object's properties
    Interface.PropertyViewerWidget = class PropertyViewerWidget {
      displayProperties(obj) {
        // Create a new list
        let body = document.getElementById('game');
        let list = document.createElement('ul');
        body.appendChild(list)

        // Loop over the object's properties, adding a new list item for each once
        for (let property in obj) {
          if (obj.hasOwnProperty(property)) {
            // Create a new list item for this property
            let propertyListItem = document.createElement('li');
            propertyListItem.innerHTML = "<b>" + property.toString() + ":</b> " + obj[property].toString()
            list.appendChild(propertyListItem);
          }
        }
      }
    }

  }(window.MMC.Interface = window.MMC.Interface || {}));
}(window.MMC = window.MMC || {}));